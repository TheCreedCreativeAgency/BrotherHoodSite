'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react'; // Added useCallback
import { useRouter } from 'next/navigation';
import './options.css';

export default function SubscriptionOptions() {
  const [amount, setAmount] = useState(0); // Numeric amount for logic (no decimals)
  const [textInputValue, setTextInputValue] = useState('00'); // String for the input field (no decimals)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [dragging, setDragging] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('visa'); // 'visa' or 'crypto'
  const router = useRouter();
  const inputRef = useRef(null); // Ref for the input element

  // --- Utility function to format a number as a string (no decimals) ---
  const formatAmountToString = useCallback((value) => {
    // If value is NaN or null/undefined, default to 0 for formatting purposes
    const num = parseInt(value);
    if (isNaN(num)) return '0';
    return num.toString();
  }, []);

  // --- Effect to keep textInputValue in sync with amount when amount changes ---
  // (e.g., from radial slider or initial load)
  useEffect(() => {
    // Only update if not dragging AND the current text input value doesn't already
    // match the formatted numeric amount. This prevents overwriting user's typing.
    const formattedAmount = formatAmountToString(amount);
    if (!dragging && textInputValue !== formattedAmount) {
        setTextInputValue(formattedAmount);
    }
  }, [amount, dragging, textInputValue, formatAmountToString]);


  const handleRadialDrag = (e) => {
    e.preventDefault();
    setDragging(true);

    // Calculate initial position
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

    // Calculate initial position for touch
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
    console.log('Input value:', value); // Debug log

    // Immediately update the input's displayed string value
    setTextInputValue(value);

    // Parse the value as a number
    const numValue = parseInt(value);
    console.log('Parsed value:', numValue); // Debug log

    if (!isNaN(numValue)) {
      // Clamp the value between 0 and 100
      const clampedValue = Math.max(0, Math.min(100, numValue));
      console.log('Setting amount to:', clampedValue); // Debug log
      setAmount(clampedValue);
    } else if (value === '') {
      // If empty, set to 0
      console.log('Empty input, setting to 0'); // Debug log
      setAmount(0);
    }
  };

  const handleInputBlur = (e) => {
    let numValue = parseInt(textInputValue);

    // If empty or invalid, reset to default
    if (textInputValue === '' || isNaN(numValue) || numValue < 0) {
      setAmount(0);
      setTextInputValue('00');
    } else {
      // Ensure the amount is within bounds and formatted
      numValue = Math.max(0, Math.min(100, numValue));
      setAmount(numValue);
      setTextInputValue(formatAmountToString(numValue));
    }
  };

  // Global mouse/touch event listeners for dragging
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
          
          // Convert degrees to amount (0-360 degrees = 1-100 dollars)
          let newAmount = Math.round((degrees / 360) * 99 + 1);
          newAmount = Math.max(1, Math.min(100, newAmount));

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
          
          let newAmount = Math.round((degrees / 360) * 99 + 1);
          newAmount = Math.max(1, Math.min(100, newAmount));

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

    // Ensure the final amount sent is correctly formatted and within bounds
    // We use the `amount` state here as it's the validated numeric value.
    const finalAmount = Math.max(1, Math.min(100, amount));
    const amountInCents = Math.round(finalAmount * 100); // Convert to cents

    if (amountInCents < 100) { // Minimum 1 dollar (100 cents)
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
          <img src="/home-icon.png" alt="Home" className="nav-icon-img" />
        </div>
        <div className="nav-icon nav-icon-active">
          <img src="/payment-icon.png" alt="Payment" className="nav-icon-img" />
        </div>
        <div className="nav-icon">
          <img src="/profile-icon.png" alt="Profile" className="nav-icon-img" />
        </div>
      </div>

      {/* Main Payment Card */}
      <div className="options-card">
        {/* Left Section - Payment Methods */}
        <div className="payment-methods-section">
          <div className="payment-logo">
            <img src="/hamburger-icon.png" alt="Menu" className="payment-logo-img" />
          </div>
          <h2 className="payment-methods-title">PAYMENT METHODS</h2>

          <div className="payment-methods-buttons">
            <button
              className={`payment-method-btn visa ${selectedPaymentMethod === 'visa' ? 'active' : ''}`}
              onClick={() => setSelectedPaymentMethod('visa')}
            >
              <img src="/visa-logo.png" alt="VISA" className="payment-method-logo" />
            </button>

            <button
              className={`payment-method-btn crypto ${selectedPaymentMethod === 'crypto' ? 'active' : ''}`}
              onClick={() => setSelectedPaymentMethod('crypto')}
            >
              <img src="/crypto-logo.png" alt="CRYPTO" className="payment-method-logo" />
            </button>
          </div>
        </div>

        {/* Center Section - Radial Amount Selection */}
        <div className="radial-section">
          <div className="radial-instruction">
            <span>SLIDE THE DOT</span>
          </div>

          <div className="radial-payment-container">
            <div
              className="radial-slider"
              onMouseDown={handleRadialDrag}
              onTouchStart={handleTouchStart}
            >
              {/* Progress ring */}
              <div
                className="radial-progress-ring"
                style={{
                  background: `conic-gradient(from -90deg, #FFC56D 0%, #FFC56D ${(amount / 100) * 360}deg, transparent ${(amount / 100) * 360}deg, transparent 360deg)`
                }}
              ></div>

              <div className="radial-amount-display">
                <div className="radial-amount-value">
                  <input
                    ref={inputRef}
                    type="number"
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
                  <div className="radial-amount-label">Per Month</div>
                  <div className="radial-amount-currency">USD</div>
                </div>
              </div>

              <div
                className="radial-handle"
                style={{
                  transform: `translate(-50%, -50%) rotate(${(amount / 100) * 360}deg) translateY(-150px)`
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
            <img src="/close-icon.png" alt="Close" className="action-icon" />
          </button>

          <button
            onClick={handleCheckout}
            disabled={loading || amount < 1}
            className="pay-button"
          >
            <img src="/fingerprint-icon.png" alt="Fingerprint" className="fingerprint-icon" />
            <span className="pay-button-text">PAY</span>
          </button>

          <button className="profile-button">
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