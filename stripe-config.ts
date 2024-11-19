import Stripe from 'stripe'

// Create a single Stripe instance to be used across the application
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { 
  apiVersion: '2024-10-28.acacia' 
})

export default stripe