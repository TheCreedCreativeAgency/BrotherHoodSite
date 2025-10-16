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
  const [shouldShowIntro, setShouldShowIntro] = useState(true);
  const [showPaymentFailed, setShowPaymentFailed] = useState(false);

  const handleAnimationComplete = () => {
    try {
      sessionStorage.setItem('paymentIntroSeen', '1');
    } catch {}
    setAnimationComplete(true);
    setShouldShowIntro(false);
  };

  // Decide whether to show the intro (only first visit per tab/session)
  useEffect(() => {
    try {
      const seen = sessionStorage.getItem('paymentIntroSeen');
      if (seen === '1') {
        setShouldShowIntro(false);
        setAnimationComplete(true);
      }
    } catch {}
  }, []);

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

  // Show intro only on first visit. Otherwise, render minimal placeholder while redirecting
  return (
    <>
      {shouldShowIntro ? (
        <IntroWrapper onAnimationComplete={handleAnimationComplete}>
          <div className="min-h-screen flex items-center justify-center" style={{
            background: 'linear-gradient(to right, #0f0f0f 8%, #371919 100%)'
          }}>
            </div>
        </IntroWrapper>
      ) : (
        <div className="min-h-screen flex items-center justify-center" style={{
          background: 'linear-gradient(to right, #0f0f0f 8%, #371919 100%)'
        }}>

        </div>
      )}
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(to right, #0f0f0f 8%, #371919 100%)'
      }}>

      </div>
    }>
      <PaymentPageContent />
    </Suspense>
  );
}