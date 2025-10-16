'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PaymentNotification from '../../../components/PaymentNotification';
import './subscription.css';

function SubscriptionManagementContent() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('success');

  // Check for payment success/failure parameters
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    
    if (success === 'true') {
      setNotificationType('success');
      setShowNotification(true);
      // Clear URL parameters
      window.history.replaceState({}, '', '/payment/subscription');
    } else if (canceled === 'true') {
      setNotificationType('failure');
      setShowNotification(true);
      // Clear URL parameters
      window.history.replaceState({}, '', '/payment/subscription');
    }
  }, [searchParams]);

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

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

      <div className="subscription-container">

        <div className="subscription-content">
          {/* Logo - Using the provided login.png */}
          <div className="subscription-logo-container">
            <img src="/login.png" alt="Logo" className="subscription-logo-image" />
          </div>

          {/* Access Required Card */}
          <div className="access-card">
            <h1 className="access-title">Access Required</h1>
            <p className="access-message">Please sign in to manage your subscription</p>
            <div className="access-buttons">
              <Link
                href="/payment/login"
                className="access-btn"
              >
                Sign In
              </Link>
              <Link
                href="/payment/signup"
                className="access-btn"
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
    <div className="subscription-container">
       <div className="top-nav-bar">
        <div className="nav-icon nav-icon-active">
          {/* Replace with actual paths to your icons */}
          <Link href="#" >
            <img src="/home-icon.png" alt="Home" className="nav-icon-img" />
          </Link>
        </div>
        <div className="nav-icon">
          {/* Replace with actual paths to your icons */}
          <Link href="/payment/options">
            <img
              src="/payment-icon.png"
              alt="Payment"
              className="nav-icon-img"
            />
          </Link>
        </div>
        <div className="nav-icon">
          {/* Replace with actual paths to your icons */}
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
      <div className="subscription-content">
        {/* Logo - Using the provided login.png */}
        <div className="subscription-logo-container">
          <img src="/login.png" alt="Logo" className="subscription-logo-image" />
        </div>

        {/* Main Subscription Card - Enhanced glassmorphism */}
        <div className="subscription-card">
          <div className="subscription-header">
            <h1 className="subscription-title">Welcome, {session.user?.name || session.user?.email}</h1>
            <p className="subscription-subtitle">Manage your subscription and account</p>
          </div>

          {/* User Info Card */}
          <div className="subscription-info">
            <h2 className="subscription-info-title">Account Information</h2>
            <div>
              <div className="subscription-info-row">
                <span className="subscription-info-label">Email:</span>
                <span className="subscription-info-value">{session.user?.email}</span>
              </div>
              <div className="subscription-info-row">
                <span className="subscription-info-label">Member Since:</span>
                <span className="subscription-info-value">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Subscription Actions */}
          <div className="subscription-actions">
            <button
              onClick={handleRenewSubscription}
              className="subscription-btn"
            >
              Subscribe
            </button>

            <button
              onClick={handleManageBilling}
              disabled={loading}
              className="subscription-btn"
            >
              {loading ? 'Loading...' : 'Manage My Subscription'}
            </button>

            <button
              onClick={handleLogout}
              className="subscription-btn"
            >
              Logout
            </button>
          </div>

          {/* Error Message */}
          {message && (
            <div className="subscription-error">
              {message}
            </div>
          )}
        </div>
      </div>
      
      {/* Payment Notification Popup */}
      <PaymentNotification
        type={notificationType}
        isVisible={showNotification}
        onClose={handleNotificationClose}
      />
    </div>
  );
}

export default function SubscriptionManagement() {
  return (
    <Suspense fallback={
      <div className="subscription-container">
        <div className="subscription-content">
          <div className="subscription-logo-container">
            <img src="/login.png" alt="Logo" className="subscription-logo-image" />
          </div>
          <div className="subscription-card subscription-loading">
            <h1 className="subscription-loading-title">Loading...</h1>
            <p className="subscription-loading-message">Please wait while we load your subscription page</p>
          </div>
        </div>
      </div>
    }>
      <SubscriptionManagementContent />
    </Suspense>
  );
}