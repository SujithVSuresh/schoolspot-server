import Stripe from "stripe";
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY!, {
    apiVersion: '2025-03-31.basil',
  });
  
  export default stripe;