'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react'; // Added useCallback
import { useRouter } from 'next/navigation';
import '../figma-styles.css';

export default function SubscriptionOptions() {
  const [amount, setAmount] = useState(10.00); // Numeric amount for logic (e.g., 10.00)
  const [textInputValue, setTextInputValue] = useState('10.00'); // String for the input field (e.g., "10.00", "5", "5.")
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [dragging, setDragging] = useState(false);
  const router = useRouter();
  const inputRef = useRef(null); // Ref for the input element

  // --- Utility function to format a number as a currency string ---
  const formatAmountToString = useCallback((value) => {
    // If value is NaN or null/undefined, default to 0 for formatting purposes
    const num = parseFloat(value);
    if (isNaN(num)) return '0.00';
    return num.toFixed(2);
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
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleRadialMove = (e) => {
    if (!dragging) return;
    
    // Prevent default touch behavior for smoother dragging on mobile
    if (e.type === 'touchmove') {
      e.preventDefault();
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Handle both mouse and touch events
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    const angle = Math.atan2(clientY - centerY, clientX - centerX);
    const degrees = (angle * 180 / Math.PI + 360) % 360;
    
    // Smooth calculation with decimal precision
    let newAmount = Math.max(1, Math.min(100, degrees / 3.6));
    newAmount = Math.round(newAmount * 100) / 100; // Round to 2 decimal places

    setAmount(newAmount);
    // When dragging, we want the text input to reflect the *slider's* value immediately.
    setTextInputValue(formatAmountToString(newAmount));
  };

  const handleTextInput = (e) => {
    const value = e.target.value;

    // 1. Immediately update the input's displayed string value
    setTextInputValue(value);

    // 2. Parse and validate for the numeric `amount` state
    const numValue = parseFloat(value);

    if (!isNaN(numValue)) {
      // Clamp the numeric value, but don't aggressively round while typing
      // e.g., allow "5." to be typed before "5.50"
      let clampedValue = Math.max(1, Math.min(100, numValue));

      // Only setAmount if it's a valid number and it's different enough
      // to avoid infinite loops if it's already clamped.
      if (amount !== clampedValue) {
        setAmount(clampedValue);
      }
    } else if (value === '') {
      // If the input is empty, reset the numeric amount to 0
      setAmount(0);
    }
    // If `isNaN(numValue)` and `value` is not empty (e.g., typing "abc"),
    // `amount` will retain its last valid value until `onBlur` cleans it up.
  };

  const handleInputBlur = (e) => {
    let numValue = parseFloat(textInputValue);

    // If empty or invalid, reset to default
    if (textInputValue === '' || isNaN(numValue) || numValue < 1) {
      setAmount(10.00);
      setTextInputValue('10.00');
    } else {
      // Ensure the amount is within bounds and formatted
      numValue = Math.max(1, Math.min(100, numValue));
      const finalFormattedAmount = Math.round(numValue * 100) / 100;
      setAmount(finalFormattedAmount);
      setTextInputValue(formatAmountToString(finalFormattedAmount));
    }
  };

  // Keep the mouse/touch event listeners for dragging
  useEffect(() => {
    const handleMouseUp = () => setDragging(false);
    const handleTouchEnd = () => setDragging(false);
    const handleMouseMove = (e) => {
      if (dragging) {
        handleRadialMove(e);
      }
    };
    const handleTouchMove = (e) => {
      if (dragging) {
        handleRadialMove(e);
      }
    };
    
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [dragging, handleRadialMove]); // Dependency on handleRadialMove is important due to useCallback


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
    <div className="min-h-screen creed-bg flex items-center justify-center p-6 relative overflow-hidden">

      {/* Main Payment Card - Pixel perfect */}
      <div className="relative z-10 glass-card rounded-3xl p-8 w-full max-w-3xl">
        {/* Header Section - Only Close Button */}
        <div className="flex justify-end items-start mb-10">
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
                onMouseDown={handleRadialDrag}
                onMouseMove={handleRadialMove}
                onMouseUp={() => setDragging(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleRadialMove}
                onTouchEnd={() => setDragging(false)}
              >
                <div className="radial-amount-display">
                  <div className="radial-amount-value">
                    <input
                      ref={inputRef} // Assign the ref
                      type="text" // Use text type for better manual input control
                      inputMode="decimal" // Suggests a decimal keyboard on mobile
                      min="1"
                      max="100"
                      step="0.01"
                      value={textInputValue} // This is the controlled component value
                      onChange={handleTextInput}
                      onBlur={handleInputBlur}
                      onClick={(e) => e.stopPropagation()} // Prevent radial drag from starting if clicking input
                      onFocus={(e) => {
                        e.target.select(); // Select all text on focus
                        // Optionally, if the value is "0.00" or similar, clear it for typing
                        if (parseFloat(textInputValue) === 0) {
                            setTextInputValue('');
                        }
                      }}
                      className="radial-center-input"
                      placeholder="10.00"
                    />
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

        {/* Bottom Section - Only Pay Button */}
        <div className="flex justify-center items-end">
          {/* Pay Button - Pixel perfect with fingerprint */}
          <button
            onClick={handleCheckout}
            disabled={loading || amount < 1} // Disable if loading or amount is less than $1
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