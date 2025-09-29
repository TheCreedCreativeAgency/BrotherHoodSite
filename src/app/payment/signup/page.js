'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../figma-styles.css';

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
    <div className="min-h-screen creed-bg flex items-center justify-center p-6 relative overflow-hidden">
      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        {/* Logo - Using the provided login.png */}
        <div className="logo-container-new">
          <img src="/login.png" alt="Logo" className="logo-image-new" />
        </div>

        {/* Main Signup Card - Updated design */}
        <div className="login-card-new rounded-3xl py-16 px-12 w-full relative">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 20 20">
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
                className="login-input w-full pl-12 pr-4 py-5 rounded-2xl text-white placeholder-white/60 focus:outline-none text-base font-light"
                placeholder="Email ID"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="login-input w-full pl-12 pr-4 py-5 rounded-2xl text-white placeholder-white/60 focus:outline-none text-base font-light"
                placeholder="Password"
                required
              />
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="login-input w-full pl-12 pr-4 py-5 rounded-2xl text-white placeholder-white/60 focus:outline-none text-base font-light"
                placeholder="Confirm Password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm text-sm">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Signup Button - Updated design */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="login-button text-white font-light py-5 px-32 rounded-2xl hover:bg-opacity-20 transition-all duration-300 disabled:opacity-50 text-base"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-white/60 text-sm font-light">
            Already have an account?{' '}
            <Link href="/payment/login" className="text-[#DAA520] font-light transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}