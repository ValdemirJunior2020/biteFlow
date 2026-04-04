// File: lib/validators.ts
export const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
export const required = (value?: string) => !!value?.trim();
