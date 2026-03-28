import Stripe from 'stripe'

const secretKey = process.env.STRIPE_SECRET_KEY

export const stripe = (secretKey && secretKey.startsWith('sk_'))
  ? new Stripe(secretKey, { apiVersion: '2026-03-25.dahlia', typescript: true })
  : null
