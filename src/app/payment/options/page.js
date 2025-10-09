'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import './options.css';

export default function SubscriptionOptions() {
  const [amount, setAmount] = useState(0);
  const [textInputValue, setTextInputValue] = useState('00');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [dragging, setDragging] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('visa');
  const router = useRouter();
  const inputRef = useRef(null);

  const formatAmountToString = useCallback((value) => {
    const num = parseInt(value);
    if (isNaN(num)) return '0';
    return num.toString().padStart(2, '0'); // Ensure two digits
  }, []);

  useEffect(() => {
    const formattedAmount = formatAmountToString(amount);
    if (!dragging && textInputValue !== formattedAmount) {
        setTextInputValue(formattedAmount);
    }
  }, [amount, dragging, textInputValue, formatAmountToString]);

  const handleRadialDrag = (e) => {
    e.preventDefault();
    setDragging(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    let degrees = (angle * 180 / Math.PI + 90) % 360;
    if (degrees < 0) degrees += 360;

    let newAmount = Math.round((degrees / 360) * 100);
    newAmount = Math.max(0, Math.min(100, newAmount));

    setAmount(newAmount);
    setTextInputValue(formatAmountToString(newAmount));
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    setDragging(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const touch = e.touches[0];
    const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX);
    let degrees = (angle * 180 / Math.PI + 90) % 360;
    if (degrees < 0) degrees += 360;

    let newAmount = Math.round((degrees / 360) * 100);
    newAmount = Math.max(0, Math.min(100, newAmount));

    setAmount(newAmount);
    setTextInputValue(formatAmountToString(newAmount));
  };

  const handleTextInput = (e) => {
    const value = e.target.value;
    setTextInputValue(value);

    const numValue = parseInt(value);
    
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(0, Math.min(100, numValue));
      setAmount(clampedValue);
    } else if (value === '') {
      setAmount(0);
    }
  };

  const handleInputBlur = (e) => {
    let numValue = parseInt(textInputValue);

    if (textInputValue === '' || isNaN(numValue) || numValue < 0) {
      setAmount(0);
      setTextInputValue('00');
    } else {
      numValue = Math.max(0, Math.min(100, numValue));
      setAmount(numValue);
      setTextInputValue(formatAmountToString(numValue));
    }
  };


  useEffect(() => {
    const handleMouseUp = () => setDragging(false);
    const handleTouchEnd = () => setDragging(false);

    const handleMouseMove = (e) => {
      if (dragging) {
        e.preventDefault();
        const radialSlider = document.querySelector('.radial-slider');
        if (radialSlider) {
          const rect = radialSlider.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
          let degrees = (angle * 180 / Math.PI + 90) % 360;
          if (degrees < 0) degrees += 360;
          
          let newAmount = Math.round((degrees / 360) * 100);
          newAmount = Math.max(0, Math.min(100, newAmount));

          setAmount(newAmount);
          setTextInputValue(formatAmountToString(newAmount));
        }
      }
    };

    const handleTouchMove = (e) => {
      if (dragging) {
        e.preventDefault();
        const radialSlider = document.querySelector('.radial-slider');
        if (radialSlider) {
          const rect = radialSlider.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          const touch = e.touches[0];
          const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX);
          let degrees = (angle * 180 / Math.PI + 90) % 360;
          if (degrees < 0) degrees += 360;
          
          let newAmount = Math.round((degrees / 360) * 100);
          newAmount = Math.max(0, Math.min(100, newAmount));

          setAmount(newAmount);
          setTextInputValue(formatAmountToString(newAmount));
        }
      }
    };
    
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [dragging, formatAmountToString]);

  const handleCheckout = async () => {
    setLoading(true);
    setMessage('');

    const finalAmount = Math.max(1, Math.min(100, amount));
    const amountInCents = Math.round(finalAmount * 100);

    if (amountInCents < 100) {
      setMessage('Subscription amount must be at least $1.00');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountInCents }),
      });
      
      const data = await res.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage(data.error || 'Failed to create checkout session. Please try again.');
      }
    } catch (err) {
      setMessage(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="options-container">
      {/* Top Navigation Bar */}
      <div className="top-nav-bar">
        <div className="nav-icon">
          {/* Replace with actual paths to your icons */}
          <img src="/home-icon.png" alt="Home" className="nav-icon-img" />
        </div>
        <div className="nav-icon nav-icon-active">
          {/* Replace with actual paths to your icons */}
          <img src="/payment-icon.png" alt="Payment" className="nav-icon-img" />
        </div>
        <div className="nav-icon">
          {/* Replace with actual paths to your icons */}
          <img src="/profile-icon.png" alt="Profile" className="nav-icon-img" />
        </div>
      </div>

      {/* Main Payment Card */}
      <div className="options-card">
        {/* Left Section - Payment Methods */}
        <div className="payment-methods-section">
          <div className="payment-logo">
            {/* Replace with actual paths to your icons */}
            <img src="/chevron-icon.png" alt="Chevron" className="payment-logo-img" />
          </div>
          {/* Moved the title to match the image positioning */}

          <div className="payment-methods-buttons">
             <h2 className="payment-methods-title">PAYMENT METHODS</h2> {/* Title moved here */}
            <button
              className={`payment-method-btn visa ${selectedPaymentMethod === 'visa' ? 'active' : ''}`}
              onClick={() => setSelectedPaymentMethod('visa')}
            >
              {/* Replace with actual paths to your icons */}
              <img src="/visa-icon.png" alt="VISA" className="payment-method-logo" />
            </button>

            <button
              className={`payment-method-btn crypto ${selectedPaymentMethod === 'crypto' ? 'active' : ''}`}
              onClick={() => setSelectedPaymentMethod('crypto')}
            >
              {/* Replace with actual paths to your icons */}
              <img src="/crypto-icon.png" alt="CRYPTO" className="payment-method-logo" />
            </button>
          </div>
        </div>

        {/* Center Section - Radial Amount Selection */}
        <div className="radial-section">
          <div className="radial-instruction">
            <div className="radial-instruction-curved">
              <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%' }}>
                <defs>
                  <path id="curve" d="M 200,15 a 185,185 0 1,1 0,370 a 185,185 0 1,1 0,-370" />
                </defs>
                <text>
                  <textPath href="#curve" textAnchor="middle" startOffset="0%">
                    slide the dot
                  </textPath>
                </text>
              </svg>
            </div>
          </div>

          <div className="radial-payment-container">
            <div
              className="radial-slider"
              onMouseDown={handleRadialDrag}
              onTouchStart={handleTouchStart}
              style={{ userSelect: 'none' }}
            >
              {/* Progress ring - removed to match design */}

              <div className="radial-amount-display">
                <div className="radial-amount-value">
                  <input
                    ref={inputRef}
                    type="text" // Changed to text to handle '00' formatting better
                    pattern="[0-9]*" // Restrict to numeric input visually
                    min="0"
                    max="100"
                    value={textInputValue}
                    onChange={handleTextInput}
                    onBlur={handleInputBlur}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    className="radial-center-input"
                    placeholder="00"
                  />
                </div>
                <div className="radial-amount-side">
                  <div className="radial-amount-label">Per</div>
                  <div className="radial-amount-label">Month</div>
                  <div className="radial-amount-currency">USD</div>
                </div>
              </div>

            <div
              className="radial-handle"
              style={{
                transform: `translate(-50%, -50%) rotate(${(amount / 100) * 360}deg) translateY(-190px)`
              }}
            ></div>
            </div>
          </div>
        </div>

        {/* Right Section - Action Buttons (Single Column) */}
        <div className="action-section">
          <button
            className="close-button"
            onClick={() => router.push('/payment/subscription')}
          >
            {/* Replace with actual paths to your icons */}
            <img src="/close-icon.png" alt="Close" className="action-icon" />
          </button>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="pay-button"
          >
            {/* Replace with actual paths to your icons */}
            <img src="/icons/fingerprint-icon.png" alt="Fingerprint" className="fingerprint-icon" />
            <span className="pay-button-text">PAY</span>
          </button>

          <button className="profile-button">
            {/* Replace with actual paths to your icons */}
            <img src="/profile-icon.png" alt="Profile" className="action-icon" />
          </button>
        </div>

        {/* Error Message */}
        {message && (
          <div className="options-error">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}