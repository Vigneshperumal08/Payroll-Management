
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const SplashScreen = () => {
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // First animation phase
    const timer1 = setTimeout(() => {
      setShowContent(true);
    }, 800);
    
    // Navigate to authentication after animations
    const timer2 = setTimeout(() => {
      navigate('/connect');
    }, 3500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
      {/* Background shapes */}
      <motion.div 
        className="absolute top-0 left-0 h-screen w-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-60 h-60 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 rounded-full bg-primary/5 blur-3xl"></div>
      </motion.div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center justify-center h-24 w-24 rounded-xl bg-primary text-primary-foreground font-bold text-3xl mb-6 shadow-lg"
        >
          LP
        </motion.div>
        
        {/* Text animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-2">Luna Pay Horizon</h1>
          <p className="text-muted-foreground text-lg">Payroll & HR Management System</p>
        </motion.div>
        
        {/* Additional content that appears after delay */}
        {showContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12 text-center max-w-md px-4"
          >
            <p className="mb-6">Streamline your HR operations with our comprehensive solution</p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {['Payroll', 'Attendance', 'Benefits', 'Leave Management'].map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + (i * 0.1), duration: 0.4 }}
                  className="px-4 py-2 rounded-full bg-primary/10 text-sm font-medium"
                >
                  {feature}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Loading indicator at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute bottom-10"
      >
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </motion.div>
    </div>
  );
};
