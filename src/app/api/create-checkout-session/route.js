import Stripe from 'stripe';
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "../../../lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }

  const { amount } = await request.json();
  
  if (!amount || amount < 100) { // Minimum $1.00
    return new Response(JSON.stringify({ error: 'Invalid amount' }), { status: 400 });
  }

  try {
    // Find or create Stripe customer for this user
    let user = await db.getUserByEmail(session.user.email);

    console.log('User found:', user ? 'Yes' : 'No');
    console.log('User email:', session.user.email);

    let customerId = user?.stripe_customer_id;

    if (!customerId) {
      console.log('Creating new Stripe customer for:', session.user.email);
      
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          userId: session.user.id,
        },
      });

      customerId = customer.id;
      console.log('Created Stripe customer:', customerId);

      // Update user with Stripe customer ID
      await db.updateUser(user.id, { stripe_customer_id: customerId });
      
      console.log('Updated user with Stripe customer ID');
    } else {
      console.log('Using existing Stripe customer:', customerId);
    }

    console.log('Creating checkout session with customer:', customerId);

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Monthly Subscription $${(amount / 100).toFixed(0)}`,
            },
            unit_amount: amount,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription', // Changed from 'payment' to 'subscription'
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/payment?canceled=true`,
      customer: customerId, // Link to existing customer
      subscription_data: {
        metadata: {
          userId: session.user.id,
          userEmail: session.user.email,
        },
      },
      metadata: {
        userId: session.user.id,
        userEmail: session.user.email,
      },
    });

    console.log('Checkout session created:', checkoutSession.id);

    return new Response(JSON.stringify({ url: checkoutSession.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return new Response(JSON.stringify({ error: 'Failed to create checkout session' }), { status: 500 });
  }
}
