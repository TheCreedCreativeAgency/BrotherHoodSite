import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify([]), { status: 401 });
  }
  
  console.log('Fetching payments for user:', session.user.email);
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { payments: true }
  });
  
  console.log('User found:', user ? 'Yes' : 'No');
  console.log('Payments found:', user?.payments?.length || 0);
  
  return new Response(JSON.stringify(user?.payments || []), { status: 200 });
}
