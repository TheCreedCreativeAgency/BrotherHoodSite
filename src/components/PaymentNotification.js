import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentNotification = ({ type, onClose, isVisible }) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
    
    if (isVisible) {
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 500); // Wait for animation to complete
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!show) return null;

  const isSuccess = type === 'success';
  const config = isSuccess 
    ? {
        icon: (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ),
        title: "Payment Successful!",
        message: "Your subscription has been activated successfully.",
        bgColor: "bg-green-900/20",
        borderColor: "border-green-500/30",
        iconBg: "bg-green-500",
        textColor: "text-green-200"
      }
    : {
        icon: (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ),
        title: "Payment Failed",
        message: "Your payment could not be processed at this time.",
        bgColor: "bg-red-900/20",
        borderColor: "border-red-500/30",
        iconBg: "bg-red-500",
        textColor: "text-red-200"
      };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{
            background: 'rgba(0, 0, 0, 0.5)'
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={`${config.bgColor} backdrop-blur-md ${config.borderColor} border rounded-3xl py-12 px-8 max-w-md w-full relative text-center`}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Icon */}
            <div className="mb-6">
              <div className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center mx-auto`}>
                {config.icon}
              </div>
            </div>

            {/* Content */}
            <h2 className="text-2xl font-light text-white mb-4">{config.title}</h2>
            <p className={`${config.textColor} mb-6 font-light`}>
              {config.message}
            </p>

            {/* Progress bar */}
            <div className="w-full bg-white/10 rounded-full h-1 mb-4">
              <motion.div
                className="bg-gradient-to-r from-[#DAA520] to-[#B8860B] h-1 rounded-full"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentNotification;
