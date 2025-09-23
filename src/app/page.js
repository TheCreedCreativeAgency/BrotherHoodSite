'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white dark:bg-zinc-900 shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-foreground">Brotherhood App</h1>
        <nav className="flex gap-4">
          <Link href="/">Home</Link>
          {!session && <Link href="/register">Register</Link>}
          {!session && <Link href="/login">Login</Link>}
          {session && <Link href="/payment">Payment</Link>}
          {session && <Link href="/dashboard">Dashboard</Link>}
          {session && <Link href="/profile">Profile</Link>}
          <Link href="/admin">Admin</Link>
          {session && (
            <button onClick={() => signOut()} className="ml-2 text-red-600">Logout</button>
          )}
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-3xl font-bold mb-4">Welcome to the Brotherhood App</h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-300 mb-8">
          Manage your account, subscribe, and view your payment history with ease.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          {!session && <Link href="/register" className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">Get Started</Link>}
          {session && <Link href="/payment" className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">Go to Payment</Link>}
          <Link href="/dashboard" className="px-6 py-3 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-foreground font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-700">Dashboard</Link>
          <Link href="/profile" className="px-6 py-3 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-foreground font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-700">Profile</Link>
          <Link href="/admin" className="px-6 py-3 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-foreground font-semibold hover:bg-zinc-300 dark:hover:bg-zinc-700">Admin</Link>
        </div>
      </main>
    </div>
  );
}
