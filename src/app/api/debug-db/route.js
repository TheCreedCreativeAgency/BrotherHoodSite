import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        payments: true
      }
    });
    
    const payments = await prisma.payment.findMany();
    
    return new Response(JSON.stringify({
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        paymentCount: u.payments.length
      })),
      allPayments: payments.map(p => ({
        id: p.id,
        userId: p.userId,
        amount: p.amount,
        stripeId: p.stripeId,
        createdAt: p.createdAt
      }))
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
