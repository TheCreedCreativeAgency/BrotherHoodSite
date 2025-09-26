'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../figma-styles.css';

export default function SubscriptionOptions() {
  const [amount, setAmount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [dragging, setDragging] = useState(false);
  const router = useRouter();

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

  const handleCheckout = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount * 100 }), // Convert to cents
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

  return (
    <div className="min-h-screen creed-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Top Bar - Pixel perfect */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="top-nav rounded-2xl px-6 py-3">
          <div className="flex space-x-6">
            {/* Payment Icon */}
            <div className="flex items-center space-x-2 text-yellow-400">
              <div className="nav-icon">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-semibold">Payment</span>
            </div>
            {/* Profile Icon */}
            <div className="flex items-center space-x-2 text-yellow-400">
              <div className="nav-icon">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xs font-semibold">Profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Payment Card - Pixel perfect */}
      <div className="relative z-10 glass-card rounded-3xl p-8 w-full max-w-3xl">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-10">
          {/* Left Section - Logo and Payment Methods */}
          <div className="flex items-start space-x-4">
            {/* Logo */}
            <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-bold">^</span>
            </div>
            
            {/* Payment Methods */}
            <div>
              <h1 className="text-white/70 text-xs font-semibold mb-3 tracking-wider">PAYMENT METHODS</h1>
              <div className="flex space-x-3">
                <button className="payment-method-btn visa text-xs px-3 py-2">
                  VISA
                </button>
                <button className="payment-method-btn crypto flex items-center space-x-1 text-xs px-3 py-2">
                  <span className="text-sm">₿</span>
                  <span>CRYPTO</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Close Button */}
          <button 
            onClick={() => router.back()}
            className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors text-lg font-bold"
          >
            ×
          </button>
        </div>

        {/* Center Section - Radial Amount Selection */}
        <div className="flex justify-center mb-10">
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

        {/* Bottom Section - Pay Button and Profile */}
        <div className="flex justify-between items-end">
          {/* Profile Icon */}
          <div className="flex items-center space-x-2 text-yellow-400">
            <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Pay Button - Pixel perfect with fingerprint */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="pay-button flex flex-col items-center space-y-1 relative"
          >
            <svg className="fingerprint-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1a9 9 0 100 18 9 9 0 000-18zM8 6a2 2 0 114 0 2 2 0 01-4 0zm2 8a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="relative z-10 text-xl">PAY</span>
          </button>
        </div>

        {/* Error Message */}
        {message && (
          <div className="mt-4 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm text-center text-sm">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}