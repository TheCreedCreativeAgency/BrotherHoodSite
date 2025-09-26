'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '../figma-styles.css';

export default function SubscribePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [dragging, setDragging] = useState(false);

  const handleRadialDrag = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleRadialMove = (e) => {
    if (!dragging) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const degrees = (angle * 180 / Math.PI + 360) % 360;
    
    const newAmount = Math.round(degrees / 3.6);
    setAmount(Math.max(1, Math.min(100, newAmount)));
  };

  React.useEffect(() => {
    const handleMouseUp = () => setDragging(false);
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, []);

  useEffect(() => {
    const planAmount = searchParams.get('amount');
    if (planAmount) {
      setAmount(parseInt(planAmount) / 100);
    }
  }, [searchParams]);

  const handleCheckout = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount * 100 }),
      });
      
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage('Failed to create checkout session.');
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
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
            <p className="text-white/60 mb-6">Please sign in to continue with your subscription</p>
            <Link
              href="/payment/login"
              className="glass-card text-white font-semibold py-4 px-16 rounded-2xl hover:bg-opacity-20 transition-all duration-300 text-base inline-block"
            >
              Sign In
            </Link>
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
            <h1 className="text-3xl font-bold text-white mb-2">Complete Your Subscription</h1>
            <p className="text-white/60">Choose your subscription amount and proceed to payment</p>
          </div>

          {/* Amount Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Select Amount</h2>
            
            {/* Radial Payment Interface */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Radial instruction */}
                <div className="radial-instruction">
                  <p className="radial-instruction-text">rotate the dial</p>
                  <div className="radial-instruction-dot"></div>
                </div>
                
                {/* Radial Payment Interface */}
                <div className="radial-payment-container">
                  <div 
                    className="radial-slider"
                    style={{
                      background: `conic-gradient(from 0deg, #DAA520 0%, #DAA520 ${amount * 3.6}deg, rgba(255,255,255,0.1) ${amount * 3.6}deg, rgba(255,255,255,0.1) 360deg)`
                    }}
                    onMouseDown={(e) => handleRadialDrag(e)}
                    onMouseMove={(e) => handleRadialMove(e)}
                    onMouseUp={() => setDragging(false)}
                  >
                    <div className="radial-amount-display">
                      <div className="radial-amount-value">
                        {amount.toString().padStart(2, '0')}
                      </div>
                      <div className="radial-amount-label">Per Month</div>
                      <div className="radial-amount-currency">USD</div>
                    </div>
                    <div 
                      className="radial-handle"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${amount * 3.6}deg) translateY(-150px)`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="pay-button flex flex-col items-center space-y-1 relative"
            >
              <svg className="fingerprint-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1a9 9 0 100 18 9 9 0 000-18zM8 6a2 2 0 114 0 2 2 0 01-4 0zm2 8a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="relative z-10 text-xl">
                {loading ? 'Processing...' : `Pay $${amount}`}
              </span>
            </button>
          </div>

          {/* Error Message */}
          {message && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm text-center text-sm mb-4">
              {message}
            </div>
          )}

          {/* Security Notice */}
          <div className="text-center text-white/40 text-xs mb-6">
            <p>🔒 Secure payment powered by Stripe</p>
          </div>

          {/* Footer Links */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.back()}
              className="glass-card text-white font-semibold py-2 px-6 rounded-xl hover:bg-opacity-20 transition-all duration-300 text-sm"
            >
              Back
            </button>
            <Link
              href="/payment/subscription"
              className="glass-card text-white font-semibold py-2 px-6 rounded-xl hover:bg-opacity-20 transition-all duration-300 text-sm"
            >
              Manage Subscription
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}