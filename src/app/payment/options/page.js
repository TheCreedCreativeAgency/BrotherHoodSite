"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import "./options.css";
import Link from "next/link";

export default function SubscriptionOptions() {
  const [amount, setAmount] = useState(0);
  const [textInputValue, setTextInputValue] = useState("00");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [dragging, setDragging] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("visa");

  // State to hold the dynamically calculated radius for the handle's orbit
  const [handleRadius, setHandleRadius] = useState(183);

  const router = useRouter();
  const inputRef = useRef(null);

  // Ref to measure the slider's container element
  const radialContainerRef = useRef(null);

  // --- UPDATED LOGIC TO MAKE THE HANDLE FULLY RESPONSIVE ---
  useEffect(() => {
    const calculateRadius = () => {
      if (radialContainerRef.current) {
        const containerWidth = radialContainerRef.current.clientWidth ;
        // The original design has a 190px radius for a 350px container.
        // This calculates the new radius proportionally to maintain the same look.
        const newRadius = (containerWidth / 350) * 183;
        setHandleRadius(newRadius);
      }
    };

    calculateRadius(); // Calculate on initial render
    window.addEventListener('resize', calculateRadius);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', calculateRadius);
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  const formatAmountToString = useCallback((value) => {
    const num = parseInt(value);
    if (isNaN(num)) return "0";
    return num.toString().padStart(2, "0");
  }, []);

  useEffect(() => {
    const formattedAmount = formatAmountToString(amount);
    if (!dragging && textInputValue !== formattedAmount) {
      setTextInputValue(formattedAmount);
    }
  }, [amount, dragging, textInputValue, formatAmountToString]);

  // All your other handler functions (handleRadialDrag, handleCheckout, etc.) remain unchanged...
  const handleRadialDrag = (e) => {
    e.preventDefault();
    setDragging(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    let degrees = ((angle * 180) / Math.PI + 90) % 360;
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
    let degrees = ((angle * 180) / Math.PI + 90) % 360;
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
    } else if (value === "") {
      setAmount(0);
    }
  };

  const handleInputBlur = (e) => {
    let numValue = parseInt(textInputValue);

    if (textInputValue === "" || isNaN(numValue) || numValue < 0) {
      setAmount(0);
      setTextInputValue("00");
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
        const radialSlider = document.querySelector(".radial-slider");
        if (radialSlider) {
          const rect = radialSlider.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
          let degrees = ((angle * 180) / Math.PI + 90) % 360;
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
        const radialSlider = document.querySelector(".radial-slider");
        if (radialSlider) {
          const rect = radialSlider.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const touch = e.touches[0];
          const angle = Math.atan2(
            touch.clientY - centerY,
            touch.clientX - centerX
          );
          let degrees = ((angle * 180) / Math.PI + 90) % 360;
          if (degrees < 0) degrees += 360;

          let newAmount = Math.round((degrees / 360) * 100);
          newAmount = Math.max(0, Math.min(100, newAmount));

          setAmount(newAmount);
          setTextInputValue(formatAmountToString(newAmount));
        }
      }
    };

    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove, {
        passive: false,
      });
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragging, formatAmountToString]);

  const handleManageBilling = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/create-customer-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setMessage(
          data.details ||
            data.error ||
            "Failed to create customer portal session."
        );
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    setMessage("");

    const finalAmount = Math.max(1, Math.min(100, amount));
    const amountInCents = Math.round(finalAmount * 100);

    if (amountInCents < 100) {
      setMessage("Subscription amount must be at least $1.00");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInCents }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setMessage(
          data.error || "Failed to create checkout session. Please try again."
        );
      }
    } catch (err) {
      setMessage(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="options-container">
      {/* ... your top-nav-bar ... */}
       <div className="top-nav-bar">
        <div className="nav-icon">
          <Link href="/payment">
            <img src="/home-icon.png" alt="Home" className="nav-icon-img" />
          </Link>
        </div>
        <div className="nav-icon nav-icon-active">
          <Link href="/payment/options">
            <img
              src="/payment-icon.png"
              alt="Payment"
              className="nav-icon-img"
            />
          </Link>
        </div>
        <div className="nav-icon">
          <button
            target="_blank"
            onClick={handleManageBilling}
            href="/payment/profile"
          >
            <img
              src="/profile-icon.png"
              alt="Profile"
              className="nav-icon-img"
            />
          </button>
        </div>
      </div>


      <div className="options-card">
        {/* ... your payment-methods-section ... */}
        <div className="payment-methods-section">
          <div className="payment-logo">
            <img
              src="/Vector 36.png"
              alt="Chevron"
              className="payment-logo-img"
            />
          </div>
          <div className="payment-methods-buttons">
            <h2 className="payment-methods-title">PAYMENT METHODS</h2>
            <div className="payment-methods-buttons-inner">
              <button
                className={`payment-method-btn visa ${
                  selectedPaymentMethod === "visa" ? "active" : ""
                }`}
                onClick={() => setSelectedPaymentMethod("visa")}
              >
                <img
                  src="/visa-icon.png"
                  alt="VISA"
                  className="payment-method-logo"
                />
              </button>

              <button
                className={`payment-method-btn crypto ${
                  selectedPaymentMethod === "crypto" ? "active" : ""
                }`}
                onClick={() => setSelectedPaymentMethod("crypto")}
              >
                <img
                  src="/crypto-icon.png"
                  alt="CRYPTO"
                  className="payment-method-logo"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="radial-section">
          <div className="radial-instruction">
              <div className="radial-instruction-curved">
              <svg
                viewBox="0 0 400 400"
                style={{ width: "100%", height: "100%" }}
              >
                <defs>
                  <path
                    id="curve"
                    d="M 15,200 a 185,185 0 1,1 370,0 a 185,185 0 1,1 -370,0"
                  />
                </defs>
                <text>
                  <textPath
                    href="#curve"
                    textAnchor="middle"
                    startOffset="26%"
                  >
                    slide the dot
                  </textPath>
                </text>
              </svg>
            </div>
          </div>

          {/* --- ATTACH THE REF HERE --- */}
          <div ref={radialContainerRef} className="radial-payment-container">
            <div
              className="radial-slider"
              onMouseDown={handleRadialDrag}
              onTouchStart={handleTouchStart}
              style={{ userSelect: "none" }}
            >
              <div className="radial-amount-display">
                <div className="radial-amount-value">
                  <input
                    ref={inputRef}
                    type="text"
                    pattern="[0-9]*"
                    min="0"
                    max="100"
                    value={textInputValue}
                    onChange={handleTextInput}
                    onBlur={handleInputBlur}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.target.select()}
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
                  // --- USE THE DYNAMIC STATE VARIABLE FOR THE TRANSFORM ---
                  transform: `translate(-50%, -50%) rotate(${
                    (amount / 100) * 360
                  }deg) translateY(-${handleRadius}px)`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* ... your action-section ... */}
        <div className="action-section">
          <button
            className="close-button"
            onClick={() => router.push("/payment/subscription")}
          >
            <img src="/Vector 35.png" alt="Close" className="action-icon" />
          </button>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="pay-button"
          >
            <img
              src="/fingerprint-icon.png"
              alt="Fingerprint"
              className="fingerprint-icon"
            />
            <span className="pay-button-text">PAY</span>
          </button>

          <button className="profile-button">
            <img
              src="/profile-icon.png"
              alt="Profile"
              className="action-icon"
            />
          </button>
        </div>

        {message && <div className="options-error">{message}</div>}
      </div>
    </div>
  );
}