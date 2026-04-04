// File: functions/src/index.ts
import 'dotenv/config';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions/v2';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';

admin.initializeApp();
const db = admin.firestore();
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24.acacia'
});

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { orderId, customerEmail } = req.body as {
      orderId?: string;
      customerEmail?: string;
    };

    if (!orderId) {
      res.status(400).send('Missing orderId');
      return;
    }

    const orderSnap = await db.collection('orders').doc(orderId).get();
    if (!orderSnap.exists) {
      res.status(404).send('Order not found');
      return;
    }

    const order = orderSnap.data() as {
      total: number;
      commissionAmount?: number;
      restaurantId?: string;
      restaurantName?: string;
      customerEmail?: string;
    };

    const restaurantSnap = order.restaurantId ? await db.collection('restaurants').doc(order.restaurantId).get() : null;
    const restaurant = restaurantSnap?.data() as {
      stripeAccountId?: string;
      stripeOnboardingComplete?: boolean;
    } | undefined;

    const amount = Math.round(Number(order.total || 0) * 100);
    const applicationFeeAmount = Math.round(Number(order.commissionAmount || 0) * 100);
    const connectedAccountId = restaurant?.stripeOnboardingComplete ? restaurant?.stripeAccountId : undefined;

    const customer = await stripe.customers.create({
      email: customerEmail || order.customerEmail,
      metadata: {
        orderId,
        restaurantId: order.restaurantId || '',
        restaurantName: order.restaurantName || ''
      }
    });

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2025-02-24.acacia' }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
      application_fee_amount: connectedAccountId ? applicationFeeAmount : undefined,
      transfer_data: connectedAccountId ? { destination: connectedAccountId } : undefined,
      metadata: {
        orderId,
        restaurantId: order.restaurantId || '',
        restaurantName: order.restaurantName || '',
        connectedAccountId: connectedAccountId || ''
      }
    });

    await db.collection('orders').doc(orderId).set(
      {
        paymentIntentId: paymentIntent.id,
        paymentStatus: 'requires_payment'
      },
      { merge: true }
    );

    res.json({
      paymentIntentClientSecret: paymentIntent.client_secret,
      customerId: customer.id,
      customerEphemeralKeySecret: ephemeralKey.secret,
      usesStripeConnectDestinationCharge: Boolean(connectedAccountId)
    });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

app.post('/create-subscription-checkout', async (req, res) => {
  try {
    const { restaurantId, restaurantEmail, restaurantName, plan } = req.body;
    const priceMap: Record<string, string | undefined> = {
      basic: process.env.BASIC_PRICE_ID,
      pro: process.env.PRO_PRICE_ID,
      enterprise: process.env.ENTERPRISE_PRICE_ID
    };

    const selectedPrice = priceMap[String(plan || '').toLowerCase()];
    if (!selectedPrice) {
      res.status(400).send('Missing Stripe price id for selected plan');
      return;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: restaurantEmail,
      line_items: [{ price: selectedPrice, quantity: 1 }],
      success_url: `${process.env.STRIPE_CONNECT_RETURN_URL}?subscription=success`,
      cancel_url: `${process.env.STRIPE_CONNECT_REFRESH_URL}?subscription=cancelled`,
      metadata: { restaurantId, restaurantName, plan }
    });

    res.json({ url: session.url });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

app.post('/create-stripe-connect-link', async (req, res) => {
  try {
    const { restaurantId, ownerEmail, ownerName } = req.body;
    const restaurantRef = db.collection('restaurants').doc(restaurantId);
    const restaurantSnap = await restaurantRef.get();
    let stripeAccountId = restaurantSnap.data()?.stripeAccountId as string | undefined;

    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: ownerEmail,
        business_type: 'company',
        business_profile: { name: ownerName },
        metadata: { restaurantId }
      });
      stripeAccountId = account.id;
      await restaurantRef.set({ stripeAccountId, stripeOnboardingComplete: false }, { merge: true });
    }

    const link = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: process.env.STRIPE_CONNECT_REFRESH_URL || 'https://example.com/refresh',
      return_url: process.env.STRIPE_CONNECT_RETURN_URL || 'https://example.com/return',
      type: 'account_onboarding'
    });

    res.json({ url: link.url, stripeAccountId });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

export const api = functions.https.onRequest({ cors: true }, app);

export const stripeWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature as string,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;
      if (orderId) {
        await db.collection('orders').doc(orderId).set(
          {
            paymentStatus: 'paid',
            orderStatus: 'accepted'
          },
          { merge: true }
        );
      }
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const restaurantId = session.metadata?.restaurantId;
      const plan = session.metadata?.plan;
      if (restaurantId && plan) {
        await db.collection('restaurants').doc(restaurantId).set(
          {
            subscriptionPlan: plan,
            subscriptionStatus: 'active'
          },
          { merge: true }
        );
      }
    }

    if (event.type === 'account.updated') {
      const account = event.data.object as Stripe.Account;
      const restaurants = await db.collection('restaurants').where('stripeAccountId', '==', account.id).limit(1).get();
      if (!restaurants.empty) {
        const restaurantRef = restaurants.docs[0].ref;
        await restaurantRef.set(
          {
            stripeOnboardingComplete: Boolean(account.details_submitted && account.charges_enabled && account.payouts_enabled)
          },
          { merge: true }
        );
      }
    }

    res.status(200).send('ok');
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});
