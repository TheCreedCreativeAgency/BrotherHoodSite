'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import '../figma-styles.css';

function SubscribeContent() {
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
    let degrees = (angle * 180 / Math.PI + 90) % 360; // Start from top (90 degrees offset)
    if (degrees < 0) degrees += 360;
    
    // Convert degrees to amount (0-360 degrees = 1-100 dollars)
    let newAmount = (degrees / 360) * 99 + 1; // Scale from 1 to 100
    newAmount = Math.max(1, Math.min(100, newAmount));
    setAmount(Math.round(newAmount));
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
          {/* Logo - Using the provided login.png */}
          <div className="logo-container-new">
            <img src="/login.png" alt="Logo" className="logo-image-new" />
          </div>

          {/* Access Required Card */}
          <div className="login-card-new rounded-3xl py-16 px-12 w-full relative text-center">
            <h1 className="text-2xl font-light text-white mb-4">Access Required</h1>
            <p className="text-white/60 mb-6 font-light">Please sign in to continue with your subscription</p>
            <Link
              href="/payment/login"
              className="login-button text-white font-light py-5 px-32 rounded-2xl hover:bg-opacity-20 transition-all duration-300 text-base inline-block"
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
        {/* Logo - Using the provided login.png */}
        <div className="logo-container-new">
          <img src="/login.png" alt="Logo" className="logo-image-new" />
        </div>

        {/* Main Subscription Card - Enhanced glassmorphism */}
        <div className="login-card-new rounded-3xl py-16 px-12 w-full relative">

          {/* Amount Selection */}
          <div className="mb-8">
            
            {/* Radial Payment Interface */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Radial instruction */}
                <div className="radial-instruction">
                  <p className="radial-instruction-text font-light">rotate the dial</p>
                  <div className="radial-instruction-dot"></div>
                </div>
                
                {/* Radial Payment Interface */}
                <div className="radial-payment-container">
                  <div 
                    className="radial-slider"
                    style={{
                      background: `conic-gradient(from -90deg, #DAA520 0%, #DAA520 ${((amount - 1) / 99) * 360}deg, rgba(255,255,255,0.1) ${((amount - 1) / 99) * 360}deg, rgba(255,255,255,0.1) 360deg)`
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
                        transform: `translate(-50%, -50%) rotate(${((amount - 1) / 99) * 360}deg) translateY(-150px)`
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
              className="pay-button flex flex-col items-center space-y-1 relative font-light"
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
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm text-center text-sm mb-4 font-light">
              {message}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen creed-bg flex items-center justify-center p-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center w-full max-w-md">
          <div className="logo-container-new">
            <img src="/login.png" alt="Logo" className="logo-image-new" />
          </div>
          <div className="login-card-new rounded-3xl py-16 px-12 w-full relative text-center">
            <h1 className="text-2xl font-light text-white mb-4">Loading...</h1>
            <p className="text-white/60 font-light">Please wait while we load your subscription page</p>
          </div>
        </div>
      </div>
    }>
      <SubscribeContent />
    </Suspense>
  );
}