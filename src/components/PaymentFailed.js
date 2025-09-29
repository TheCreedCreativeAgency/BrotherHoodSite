import React from 'react';
import Link from 'next/link';

const PaymentFailed = ({ error, amount }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{
      background: 'linear-gradient(to right, #0f0f0f 8%, #371919 100%)'
    }}>
      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        {/* Logo */}
        <div className="mb-8">
          <img src="/icon.png" alt="Logo" className="w-20 h-20 mx-auto" />
        </div>

        {/* Failure Card */}
        <div className="bg-red-900/20 backdrop-blur-md border border-red-500/30 rounded-3xl py-16 px-12 w-full relative text-center">
          {/* Error Icon */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-light text-white mb-4">Payment Failed</h1>
          <p className="text-red-200 mb-6 font-light">
            {error || 'Your payment could not be processed at this time.'}
          </p>
          
          {amount && (
            <div className="mb-6 p-4 bg-red-800/20 rounded-xl border border-red-500/20">
              <p className="text-red-200 text-sm font-light">
                Attempted Amount: <span className="text-white font-medium">${amount}</span>
              </p>
            </div>
          )}

          <div className="space-y-4">
            <Link
              href="/payment/subscribe"
              className="bg-gradient-to-r from-[#DAA520] to-[#B8860B] text-white font-light py-4 px-8 rounded-2xl hover:opacity-80 transition-all duration-300 text-base inline-block w-full"
            >
              Try Again
            </Link>
            
            <Link
              href="/payment/subscription"
              className="bg-transparent border border-white/20 text-white font-light py-4 px-8 rounded-2xl hover:bg-white/10 transition-all duration-300 text-base inline-block w-full"
            >
              Manage Subscriptions
            </Link>

            <Link
              href="/"
              className="bg-transparent border border-white/20 text-white font-light py-4 px-8 rounded-2xl hover:bg-white/10 transition-all duration-300 text-base inline-block w-full"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
