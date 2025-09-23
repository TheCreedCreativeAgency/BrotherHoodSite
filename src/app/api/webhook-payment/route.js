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
    console.error('Webhook signature verification failed:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log('=== WEBHOOK DEBUG ===');
  console.log('Event type:', event.type);
  console.log('Event ID:', event.id);

  // Handle successful payment
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    console.log('Payment Intent received:', {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      metadata: paymentIntent.metadata
    });
    
    try {
      // Find user by metadata
      const userId = paymentIntent.metadata.userId;
      const userEmail = paymentIntent.metadata.userEmail;
      
      console.log('Looking for user:', { userId, userEmail });
      
      if (userEmail) {
        // Find user by email (since userId might be undefined)
        const user = await prisma.user.findUnique({
          where: { email: userEmail }
        });
        
        if (!user) {
          console.error('User not found with email:', userEmail);
          return new Response('User not found', { status: 400 });
        }
        
        console.log('Found user:', { id: user.id, email: user.email });
        
        // Save payment to database
        const payment = await prisma.payment.create({
          data: {
            userId: user.id, // Use the found user's ID
            amount: paymentIntent.amount,
            stripeId: paymentIntent.id,
          },
        });
        
        console.log(`Payment ${paymentIntent.id} saved for user ${userEmail}`, payment);
      } else {
        console.error('Missing user email in metadata:', { userId, userEmail });
      }
    } catch (error) {
      console.error('Error saving payment to database:', error);
      return new Response('Database error', { status: 500 });
    }
  }

  return new Response('Webhook received', { status: 200 });
}
