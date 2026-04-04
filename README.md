# BiteFlow SaaS

BiteFlow is a multi-tenant food delivery SaaS mobile app built with Expo Router, Firebase, Stripe, Stripe Connect, Firestore live tracking, and role-based navigation.

## What is included
- Customer mobile flow with tabs, cart, checkout, saved addresses, and live order tracking
- Restaurant owner flow with dashboard, menu management, order management, earnings, Stripe Connect, and subscription screens
- Super admin flow with platform dashboards for restaurants, users, orders, subscriptions, and revenue visibility
- Firebase Auth, Firestore, Storage, Analytics-ready setup
- Stripe payment sheet integration on mobile
- Firebase Functions scaffold for payment intents, Stripe subscriptions, Stripe Connect onboarding, and webhooks
- Multi-tenant Firestore model using `restaurantId`, `ownerId`, and `customerId`
- Expo Notifications bootstrap
- Dark/light mode support
- UI direction aligned to the iOS mock in `assets/reference/biteflow-ios-reference.png`

## Included infrastructure files
- `firestore.rules`
- `storage.rules`
- `firestore.indexes.json`
- `firebase.json`
- `eas.json`
- `.env.example`
- `functions/.env.example`

## Folder structure
```text
biteflow-saas/
  app/
    index.tsx
    _layout.tsx
    +not-found.tsx
    (public)/
      _layout.tsx
      welcome.tsx
      login.tsx
      signup.tsx
      forgot-password.tsx
    (customer)/
      _layout.tsx
      (tabs)/
        _layout.tsx
        index.tsx
        discover.tsx
        orders.tsx
        account.tsx
      restaurant/[id].tsx
      cart.tsx
      checkout.tsx
      addresses.tsx
      order/[id].tsx
      track/[id].tsx
    (restaurant)/
      _layout.tsx
      dashboard.tsx
      restaurant-profile.tsx
      menu.tsx
      menu/new.tsx
      menu/[id].tsx
      orders.tsx
      earnings.tsx
      stripe-connect.tsx
      subscription.tsx
      settings.tsx
    (admin)/
      _layout.tsx
      dashboard.tsx
      restaurants.tsx
      orders.tsx
      subscriptions.tsx
      users.tsx
  assets/
    icon.png
    reference/
      biteflow-ios-reference.png
  components/
  firebase/
  functions/
  hooks/
  lib/
  store/
  types/
  firestore.rules
  storage.rules
  firestore.indexes.json
  firebase.json
  package.json
  app.json
  app.config.ts
  eas.json
  .env.example
```

## First setup
1. Copy `.env.example` to `.env`.
2. Copy `functions/.env.example` to `functions/.env`.
3. Replace every Firebase, Google, Maps, Stripe, and RevenueCat placeholder with your real values.
4. In `firestore.rules`, replace `YOU_SUPER_ADMIN_EMAIL_HERE` with your real platform-owner email.
5. Install app deps with `npm install`.
6. Install functions deps with `cd functions && npm install && cd ..`.
7. Start the app with `npm run start`.
8. Serve functions locally with `npm run functions:serve`.

## Firestore deployment
Run these after logging into Firebase CLI:
```bash
firebase use your-project-id
firebase deploy --only firestore:rules,firestore:indexes,storage
firebase deploy --only functions
```

## Stripe + SaaS monetization setup
1. Set your commission percentage in `lib/constants.ts`.
2. Create Stripe recurring prices for Basic, Pro, and Enterprise.
3. Add those Stripe price IDs in `functions/.env`.
4. Connect each restaurant through the restaurant owner Stripe Connect screen.
5. When a restaurant has completed onboarding, the payment-intent function creates a destination charge so the platform automatically keeps the commission and the restaurant receives the remainder.
6. Use `restaurant.subscriptionPlan` and `restaurant.subscriptionStatus` to gate premium features such as featured listing, analytics, or priority support.

## Notes
- The root route guard now uses Expo Router segments, so protected route redirection works correctly with route groups.
- Signup sends an email verification message automatically.
- The Firebase Functions payment flow now reads order totals from Firestore instead of trusting the client payload.
- You still need to connect your real credentials before shipping to the App Store or Play Store.
