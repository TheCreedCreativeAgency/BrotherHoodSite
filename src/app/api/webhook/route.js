import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const sig = req.headers.get('stripe-signature');
  const buf = await req.arrayBuffer();
  const body = Buffer.from(buf);
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Just acknowledge the webhook - we don't need to do anything since we're using Stripe Dashboard
  console.log(`Webhook received: ${event.type}`);
  
  return new Response('Webhook received', { status: 200 });
}