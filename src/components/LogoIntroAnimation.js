import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useWindowSize from "../hooks/useWindowSize";

const LogoIntroAnimation = ({
  onAnimationComplete,
  fontFamily = "'Cormorant Garamond', serif",
}) => {
  const { isMobile } = useWindowSize();
  const [showText, setShowText] = useState(false);
  const [isVisible] = useState(true);

  useEffect(() => {
    // Set the gradient background immediately and prevent any flashing
    document.body.style.backgroundImage = 'linear-gradient(to right, #0f0f0f 8%, #371919 100%)';
    document.body.style.backgroundColor = 'transparent';
    document.body.style.transition = 'none'; // Prevent transitions that cause flashing
    
    const sequence = async () => {
      // Reveal text a bit after logo starts scaling
      await new Promise((resolve) => setTimeout(resolve, 1700));
      setShowText(true);

      // Keep the gradient background - don't restore original
      document.body.style.backgroundImage = 'linear-gradient(to right, #0f0f0f 8%, #371919 100%)';
      document.body.style.backgroundColor = 'transparent';

      // Total animation time should be ~3s
      await new Promise((resolve) => setTimeout(resolve, 1700));

      onAnimationComplete();
    };
    
    sequence();
  }, [onAnimationComplete]);

  return (
    <motion.div
      style={{
        position: "fixed",
        inset: 0,
        background: "linear-gradient(to right, #0f0f0f 8%, #371919 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          gap: isMobile ? "28px" : "40px",
        }}
      >
        {/* Logo grows smoothly with large start-to-end difference */}
        <motion.div
          initial={{ opacity: 0, scale: 0.01 }}
          animate={{ opacity: 1, scale: 1.7 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: isMobile ? "84px" : "220px",
            height: isMobile ? "84px" : "220px",
            borderRadius: "50%",
            backgroundColor: "#381e1e",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 14px 40px rgba(0,0,0,0.5)",
            willChange: 'transform, filter, opacity',
          }}
        >
          <img
            src="/Vector 36.png"
            alt="Logo Icon"
            style={{ width: isMobile ? "34px" : "58px", height: "auto" }}
          />
        </motion.div>

        {/* Text slides down from beneath the logo using a reveal container */}
        {showText && (
          <div
            style={{
              overflow: 'hidden',
              height: isMobile ? 34 : 64,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: '-110%' }}
              animate={{ opacity: 1, y: '0%' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "flex", gap: isMobile ? "8px" : "12px" }}
            >
              <span
                style={{
                  color: "#FFC400",
                  opacity: 0.75,
                  fontSize: isMobile ? "28px" : "48px",
                  fontFamily: fontFamily,
                  fontWeight: 600,
                  fontStyle: 'italic',
                  whiteSpace: "nowrap",
                  letterSpacing: isMobile ? "0.3px" : "0.6px",
                  textShadow: '0 2px 8px rgba(0,0,0,0.35)',
                }}
              >
                The
              </span>
              <span
                style={{
                  color: "#FFC400",
                  opacity: 0.75,
                  fontSize: isMobile ? "28px" : "48px",
                  fontFamily: fontFamily,
                  fontWeight: 600,
                  fontStyle: 'italic',
                  whiteSpace: "nowrap",
                  letterSpacing: isMobile ? "0.3px" : "0.6px",
                  textShadow: '0 2px 8px rgba(0,0,0,0.35)',
                }}
              >
                Creed
              </span>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LogoIntroAnimation;
