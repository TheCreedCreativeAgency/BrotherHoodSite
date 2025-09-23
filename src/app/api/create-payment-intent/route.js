import Stripe from 'stripe';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }

  const { amount, billingInfo } = await request.json();
  
  if (!amount || amount < 100) { // Minimum $1.00
    return new Response(JSON.stringify({ error: 'Invalid amount' }), { status: 400 });
  }

  try {
    const metadata = {
      userId: session.user.id,
      userEmail: session.user.email,
      billingName: billingInfo?.name || '',
      billingEmail: billingInfo?.email || '',
      billingAddress: billingInfo?.address || '',
      billingCity: billingInfo?.city || '',
      billingZip: billingInfo?.zipCode || '',
    };

    console.log('Creating Payment Intent with metadata:', metadata);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: 'usd',
      metadata: metadata,
    });

    console.log('Payment Intent created:', paymentIntent.id);

    return new Response(JSON.stringify({ 
      clientSecret: paymentIntent.client_secret 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error creating payment intent:', err);
    return new Response(JSON.stringify({ error: 'Failed to create payment intent' }), { status: 500 });
  }
}
