import Stripe from 'stripe';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }
  const { amount } = await request.json();
  if (!amount || amount < 1 || amount > 100) {
    return new Response(JSON.stringify({ error: 'Invalid amount' }), { status: 400 });
  }
  // Find or create Stripe product/price for this amount
  const productName = `Monthly Subscription $${amount}`;
  let product = (await stripe.products.list({ limit: 100 })).data.find(p => p.name === productName);
  if (!product) {
    product = await stripe.products.create({ name: productName });
  }
  let price = (await stripe.prices.list({ product: product.id, limit: 100 })).data.find(p => p.unit_amount === amount * 100 && p.recurring?.interval === 'month');
  if (!price) {
    price = await stripe.prices.create({
      product: product.id,
      unit_amount: amount * 100,
      currency: 'usd',
      recurring: { interval: 'month' },
    });
  }
  // Find or create Stripe customer for user
  let user = await prisma.user.findUnique({ where: { email: session.user.email } });
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email });
    customerId = customer.id;
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
  }
  // Create Stripe Checkout session for subscription
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: price.id, quantity: 1 }],
    mode: 'subscription',
    success_url: 'http://localhost:3000/payment?success=true',
    cancel_url: 'http://localhost:3000/payment?canceled=true',
  });
  return new Response(JSON.stringify({ url: checkoutSession.url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
