import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

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

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Create a test payment
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        amount: 1000, // $10.00
        stripeId: 'test_' + Date.now(),
      },
    });

    console.log('Test payment created:', payment);

    return new Response(JSON.stringify({ success: true, payment }), { status: 200 });
  } catch (error) {
    console.error('Error creating test payment:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
