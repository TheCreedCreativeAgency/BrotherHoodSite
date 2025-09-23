import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

export async function POST(req) {
  const sig = req.headers.get('stripe-signature');
  const buf = await req.arrayBuffer();
  const body = Buffer.from(buf);
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      if (session.mode === 'subscription') {
        // Save subscription to DB
        const user = await prisma.user.findFirst({ where: { stripeCustomerId: session.customer } });
        if (user) {
          await prisma.subscription.create({
            data: {
              userId: user.id,
              amount: session.amount_total / 100,
              status: 'active',
              stripeId: session.subscription,
            },
          });
        }
      }
      break;
    }
    case 'invoice.paid': {
      const invoice = event.data.object;
      const user = await prisma.user.findFirst({ where: { stripeCustomerId: invoice.customer } });
      if (user) {
        const sub = await prisma.subscription.findFirst({ where: { stripeId: invoice.subscription } });
        await prisma.payment.create({
          data: {
            userId: user.id,
            amount: invoice.amount_paid,
            stripeId: invoice.id,
            subscriptionId: sub?.id,
          },
        });
      }
      break;
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      await prisma.subscription.updateMany({
        where: { stripeId: sub.id },
        data: { status: sub.status },
      });
      break;
    }
    default:
      break;
  }
  return new Response('ok', { status: 200 });
}
