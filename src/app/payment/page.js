'use client';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import IntroWrapper from '../../components/IntroWrapper';
import PaymentFailed from '../../components/PaymentFailed';

function PaymentPageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showPaymentFailed, setShowPaymentFailed] = useState(false);

  const handleAnimationComplete = () => {
    setAnimationComplete(true);
  };

  // Check for payment cancellation parameter
  useEffect(() => {
    const canceled = searchParams.get('canceled');
    if (canceled === 'true') {
      setShowPaymentFailed(true);
      // Clear the URL parameter after showing failure
      window.history.replaceState({}, '', '/payment');
    }
  }, [searchParams]);

  useEffect(() => {
    // Only proceed with navigation after animation is complete
    if (!animationComplete) return;
    
    if (status === 'loading') return; // Still loading

    if (session) {
      // User is logged in, redirect to subscription management
      router.push('/payment/subscription');
      } else {
      // User is not logged in, redirect to login
      router.push('/payment/login');
    }
  }, [session, status, router, animationComplete]);

  // Show payment failed page if payment was canceled
  if (showPaymentFailed) {
    return <PaymentFailed error="Payment was canceled" />;
  }

  // Show intro animation first, then proceed with navigation
  return (
    <>
      <style jsx global>{`
        body {
          background: linear-gradient(to right, #0f0f0f 8%, #371919 100%) !important;
          background-color: transparent !important;
        }
      `}</style>
      <IntroWrapper onAnimationComplete={handleAnimationComplete}>
        <div className="min-h-screen flex items-center justify-center" style={{
          background: 'linear-gradient(to right, #0f0f0f 8%, #371919 100%)'
        }}>
          <div className="text-center">
            <div className="mb-6">
              <img src="/icon.png" alt="Logo" className="w-20 h-20 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">The Creed</h1>
            <p className="text-gray-300">Loading subscription portal...</p>
          </div>
        </div>
      </IntroWrapper>
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(to right, #0f0f0f 8%, #371919 100%)'
      }}>
        <div className="text-center">
          <div className="mb-6">
            <img src="/icon.png" alt="Logo" className="w-20 h-20 mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">The Creed</h1>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}