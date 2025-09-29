import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useWindowSize from "../hooks/useWindowSize";

const LogoIntroAnimation = ({
  onAnimationComplete,
  fontFamily = "'Times New Roman', serif",
}) => {
  const { isMobile } = useWindowSize();
  const [showText, setShowText] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set the gradient background immediately and prevent any flashing
    document.body.style.backgroundImage = 'linear-gradient(to right, #0f0f0f 8%, #371919 100%)';
    document.body.style.backgroundColor = 'transparent';
    document.body.style.transition = 'none'; // Prevent transitions that cause flashing
    
    const sequence = async () => {
      // Wait for logo animation
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Show text
      setShowText(true);
      
      // Wait for text to be visible
      await new Promise((resolve) => setTimeout(resolve, 1600));
      
      // Start exit
      setIsVisible(false);
      
      // Wait for exit animation
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      // Keep the gradient background - don't restore original
      document.body.style.backgroundImage = 'linear-gradient(to right, #0f0f0f 8%, #371919 100%)';
      document.body.style.backgroundColor = 'transparent';
      
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
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* Logo with pop-in animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 120, 
            damping: 15,
            delay: 0.2
          }}
          style={{
            width: isMobile ? "60px" : "120px",
            height: isMobile ? "60px" : "120px",
            borderRadius: "50%",
            backgroundColor: "#381e1e",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            marginRight: isMobile ? "0px" : "30px",
            marginBottom: isMobile ? "30px" : "0px",
          }}
        >
          <img
            src="/icon3.png"
            alt="Logo Icon"
            style={{ width: isMobile ? "30px" : "65px", height: "auto" }}
          />
        </motion.div>

        <AnimatePresence>
          {showText && (
            <motion.div
              style={{ display: "flex", gap: "1rem" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Only "The Creed" - removed "Creatives" */}
              {["The", "Creed"].map((word, index) => (
                <motion.span
                  key={index}
                  style={{
                    color: "#d2ad75",
                    fontSize: isMobile ? "2.25rem" : "4rem",
                    fontFamily: fontFamily,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    display: "inline-block",
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 100,
                    delay: index * 0.2
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LogoIntroAnimation;
