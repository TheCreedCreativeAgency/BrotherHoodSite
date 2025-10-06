'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './signup.css';

export default function SubscriptionSignup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/payment/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        {/* Logo - Using the provided login.png */}
        <div className="signup-logo-container">
          <img src="/login.png" alt="Logo" className="signup-logo-image" />
        </div>

        {/* Main Signup Card - Updated design */}
        <div className="signup-card">
          <form onSubmit={handleSubmit} className="signup-form">
            {/* Email Field */}
            <div className="signup-input-container">
              <div className="signup-input-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="signup-input"
                placeholder="Email ID"
                required
              />
            </div>

            {/* Password Field */}
            <div className="signup-input-container">
              <div className="signup-input-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="signup-input"
                placeholder="Password"
                required
              />
            </div>

            {/* Confirm Password Field */}
            <div className="signup-input-container">
              <div className="signup-input-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="signup-input"
                placeholder="Confirm Password"
                required
              />
            </div>

            {error && (
              <div className="signup-error">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Signup Button - Updated design */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="signup-button"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        {/* Footer Links */}
        <div className="signup-footer">
          <p className="signup-footer-text">
            Already have an account?{' '}
            <Link href="/payment/login" className="signup-login-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}