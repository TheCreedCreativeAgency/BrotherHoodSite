import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
  }
  const { email, password } = await request.json();
  const data = { email };
  if (password) {
    data.password = await bcrypt.hash(password, 10);
  }
  await prisma.user.update({ where: { email: session.user.email }, data });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
