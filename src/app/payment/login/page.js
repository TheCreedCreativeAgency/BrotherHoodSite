'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '../figma-styles.css';

export default function SubscriptionLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Please try again.');
      } else {
        router.push('/payment/subscription');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

        {/* Main Login Card - Pixel perfect glassmorphism */}
        <div className="glass-card rounded-3xl p-8 w-full relative">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full pl-12 pr-4 py-4 rounded-2xl text-white placeholder-white/50 focus:outline-none text-base"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full pl-12 pr-4 py-4 rounded-2xl text-white placeholder-white/50 focus:outline-none text-base"
                placeholder="Password"
                required
              />
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex justify-between items-center pt-2">
              <label className="flex items-center text-white/50 text-sm cursor-pointer">
                <input type="checkbox" className="w-4 h-4 bg-red-600 border-red-600 rounded mr-2" />
                Remember me
              </label>
              <a href="#" className="text-white/50 text-sm hover:text-white/70 transition-colors">
                Forgot Password?
              </a>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/40 text-red-200 px-4 py-3 rounded-xl backdrop-blur-sm text-sm">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Login Button - Separate from card, pixel perfect */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-6 glass-card text-white font-semibold py-4 px-16 rounded-2xl hover:bg-opacity-20 transition-all duration-300 disabled:opacity-50 text-base"
        >
          {loading ? 'Signing In...' : 'Login'}
        </button>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-3">
          <p className="text-white/50 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/payment/signup" className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors">
              Sign up here
            </Link>
          </p>
          <Link href="/" className="text-white/30 hover:text-white/50 text-xs transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}