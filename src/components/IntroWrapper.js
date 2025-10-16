import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import LogoIntroAnimation from "./LogoIntroAnimation";

const IntroWrapper = ({ children, onAnimationComplete }) => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Ensure gradient background is set immediately when component mounts
    document.body.style.backgroundImage = 'linear-gradient(to right, #0f0f0f 8%, #371919 100%)';
    document.body.style.backgroundColor = 'transparent';
    document.body.style.transition = 'none'; // Prevent flashing

    // Keep the gradient background even after animation
    const interval = setInterval(() => {
      document.body.style.backgroundImage = 'linear-gradient(to right, #0f0f0f 8%, #371919 100%)';
      document.body.style.backgroundColor = 'transparent';
    }, 100);

    // Cleanup function
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleAnimationComplete = () => {
    setShowIntro(false);
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <LogoIntroAnimation
            key="intro-animation"
            onAnimationComplete={handleAnimationComplete}
            fontFamily="'Cormorant Garamond', serif"
          />
        )}
      </AnimatePresence>
      
      {/* Main content - only show after animation completes */}
      {!showIntro && (
        <div key="main-content" style={{ 
          opacity: 1,
          minHeight: '100vh',
          // background: 'linear-gradient(to right, #0f0f0f 8%, #371919 100%)'
        }}>
          {children}
        </div>
      )}
    </>
  );
};

export default IntroWrapper;
