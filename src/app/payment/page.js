'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PaymentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (session) {
      // User is logged in, redirect to subscription management
      router.push('/payment/subscription');
    } else {
      // User is not logged in, redirect to login
      router.push('/payment/login');
    }
  }, [session, status, router]);

  // Show loading state while determining redirect
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 bg-yellow-600 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
          <span className="text-white text-3xl font-bold">TC</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">The Creed</h1>
        <p className="text-gray-300">Loading subscription portal...</p>
      </div>
    </div>
  );
}