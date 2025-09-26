import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { db } from "../../../lib/supabase";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }

  try {
    // Find user
    let user = await db.getUserByEmail(session.user.email);

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Create Stripe customer if not exists
    let customerId = user.stripe_customer_id;
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          userId: session.user.id,
        },
      });

      customerId = customer.id;

      await db.updateUser(user.id, { stripe_customer_id: customerId });
    }

    // Get customer details from Stripe
    const customer = await stripe.customers.retrieve(customerId);
    const charges = await stripe.charges.list({
      customer: customerId,
      limit: 10,
    });

    return new Response(JSON.stringify({
      customer: {
        id: customer.id,
        email: customer.email,
        created: customer.created,
      },
      charges: charges.data.map(charge => ({
        id: charge.id,
        amount: charge.amount,
        status: charge.status,
        created: charge.created,
      })),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}


