import Stripe from 'stripe';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }
  const { amount } = await request.json();

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Test Product',
          },
          unit_amount: amount, // in cents
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:3000/payment?success=true',
    cancel_url: 'http://localhost:3000/payment?canceled=true',
  });

  // Save payment record (for demo, on session creation)
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  await prisma.payment.create({
    data: {
      userId: user.id,
      amount,
      stripeId: stripeSession.id,
    },
  });

  return new Response(JSON.stringify({ url: stripeSession.url }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
