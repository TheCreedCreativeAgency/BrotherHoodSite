import { db } from "@/lib/supabase";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });
    }
    
    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await db.createUser({
      email,
      password: hashed
    });
    
    return new Response(JSON.stringify({ success: true, userId: user.id }), { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ error: "Registration failed" }), { status: 500 });
  }
}
