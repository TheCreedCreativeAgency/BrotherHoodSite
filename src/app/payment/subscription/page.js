'use client';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../figma-styles.css';

export default function SubscriptionManagement() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleRenewSubscription = () => {
    router.push('/payment/options');
  };

  const handleManageBilling = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/create-customer-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await res.json();
      
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setMessage(data.details || data.error || 'Failed to create customer portal session.');
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/payment' });
  };

  if (!session) {
    return (
      <div className="min-h-screen creed-bg flex items-center justify-center p-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center w-full max-w-md">
          {/* Logo - Pixel perfect */}
          <div className="logo-container">
            <div className="logo-outer">
              <div className="greek-key-border"></div>
              <div className="logo-inner">
                <span className="logo-lambda">Λ</span>
              </div>
            </div>
          </div>

          {/* Access Required Card */}
          <div className="glass-card rounded-3xl p-8 w-full relative text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Access Required</h1>
            <p className="text-white/60 mb-6">Please sign in to manage your subscription</p>
            <div className="space-y-3">
              <Link
                href="/payment/login"
                className="glass-card text-white font-semibold py-4 px-16 rounded-2xl hover:bg-opacity-20 transition-all duration-300 text-base inline-block w-full"
              >
                Sign In
              </Link>
              <Link
                href="/payment/signup"
                className="glass-card text-white font-semibold py-4 px-16 rounded-2xl hover:bg-opacity-20 transition-all duration-300 text-base inline-block w-full"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen creed-bg flex items-center justify-center p-6 relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl">
        {/* Logo - Pixel perfect */}
        <div className="logo-container">
          <div className="logo-outer">
            <div className="greek-key-border"></div>
            <div className="logo-inner">
              <span className="logo-lambda">Λ</span>
            </div>
          </div>
        </div>

        {/* Main Subscription Card - Enhanced glassmorphism */}
        <div className="enhanced-glass rounded-3xl p-8 w-full relative">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome, {session.user?.name || session.user?.email}</h1>
            <p className="text-white/60">Manage your subscription and account</p>
          </div>

          {/* User Info Card */}
          <div className="subscription-info rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Account Information</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70 font-medium">Email:</span>
                <span className="text-white">{session.user?.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 font-medium">Status:</span>
                <span className="status-active">Active</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 font-medium">Member Since:</span>
                <span className="text-white">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Subscription Actions */}
          <div className="space-y-4 mb-8">
            <button
              onClick={handleRenewSubscription}
              className="w-full subscription-btn text-white font-semibold py-4 px-6 rounded-2xl text-lg"
            >
              Renew Subscription
            </button>

            <button
              onClick={handleManageBilling}
              disabled={loading}
              className="w-full subscription-btn text-white font-semibold py-4 px-6 rounded-2xl disabled:opacity-50 text-lg"
            >
              {loading ? 'Loading...' : 'Manage My Billing'}
            </button>

            <button
              onClick={handleLogout}
              className="w-full subscription-btn text-white font-semibold py-4 px-6 rounded-2xl text-lg"
            >
              Logout
            </button>
          </div>

          {/* Error Message */}
          {message && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm text-center text-sm mb-6">
              {message}
            </div>
          )}

          {/* Footer */}
          <div className="text-center">
            <Link href="/" className="text-white/40 hover:text-white/60 text-sm transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}