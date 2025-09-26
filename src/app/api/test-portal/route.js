import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }

  try {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || !user.stripeCustomerId) {
      return new Response(JSON.stringify({ error: 'No Stripe customer found' }), { status: 404 });
    }

    // Get customer details
    const customer = await stripe.customers.retrieve(user.stripeCustomerId);
    
    // Get charges
    const charges = await stripe.charges.list({
      customer: user.stripeCustomerId,
      limit: 10,
    });

    // Get invoices
    const invoices = await stripe.invoices.list({
      customer: user.stripeCustomerId,
      limit: 10,
    });

    // Get payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card',
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
        description: charge.description,
      })),
      invoices: invoices.data.map(invoice => ({
        id: invoice.id,
        amount: invoice.amount_paid,
        status: invoice.status,
        created: invoice.created,
      })),
      paymentMethods: paymentMethods.data.map(pm => ({
        id: pm.id,
        type: pm.type,
        card: pm.card ? {
          brand: pm.card.brand,
          last4: pm.card.last4,
        } : null,
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


