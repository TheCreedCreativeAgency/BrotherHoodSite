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

  try {
    // Find or create Stripe customer
    let user = await db.getUserByEmail(session.user.email);

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    let customerId = user.stripe_customer_id;

    if (!customerId) {
      // Create Stripe customer
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          userId: session.user.id,
        },
      });

      customerId = customer.id;

      // Update user with Stripe customer ID
      await db.updateUser(user.id, { stripe_customer_id: customerId });
    }

    // Create customer portal session
    console.log('Creating portal session for customer:', customerId);
    
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}`,
    });

    console.log('Portal session created:', portalSession.url);

    // Let's also check what the customer has
    const customer = await stripe.customers.retrieve(customerId);
    const charges = await stripe.charges.list({
      customer: customerId,
      limit: 10,
    });
    
    console.log('Customer details:', {
      id: customer.id,
      email: customer.email,
      chargesCount: charges.data.length,
    });

    return new Response(JSON.stringify({ url: portalSession.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error creating customer portal session:', err);
    return new Response(JSON.stringify({ 
      error: 'Failed to create customer portal session',
      details: err.message 
    }), { status: 500 });
  }
}
