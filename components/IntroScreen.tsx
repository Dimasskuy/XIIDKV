import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroScreenProps {
  onComplete: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          key="intro-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: "easeInOut" }
          }}
          className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background decorations matching the main theme */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] rounded-full bg-[radial-gradient(circle,_rgba(147,51,234,0.07)_0%,_transparent_70%)] blur-3xl transform-gpu"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: "easeOut" }
              }}
              className="mb-4"
            >
              <span className="text-xs tracking-[0.5em] text-purple-400 uppercase font-mono">Presenting</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, scale: 0.8, letterSpacing: "0.1em" }}
              animate={{
                opacity: 1,
                scale: 1,
                letterSpacing: "0.3em",
                transition: {
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier for elegance
                  delay: 0.2
                }
              }}
              className="text-4xl md:text-7xl font-black italic tracking-tighter text-white text-center px-4"
            >
              DKV NI BOSSS
            </motion.h2>

            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{
                width: "80%",
                opacity: 1,
                transition: { duration: 1, delay: 0.8, ease: "easeInOut" }
              }}
              className="h-[1px] mt-6 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
            />
          </div>

          {/* Animated ornaments */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-12 font-hand text-xl text-white/20"
          >
            Class of Legends
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroScreen;
