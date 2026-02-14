import React, { useState, useEffect } from 'react';
import { MEMORIES, CLASS_NAME } from './constants';
import HeroDisplay from './components/HeroDisplay';
import InfiniteCarousel from './components/InfiniteCarousel';
import Footer from './components/Footer';
import IntroScreen from './components/IntroScreen';
import { Camera, Star, Zap, Disc, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);

  // State for the large "Hero" image (only changes on user click)
  const [heroIndex, setHeroIndex] = useState(0);
  
  // State for the bottom carousel (auto-rotates independently)
  const [carouselIndex, setCarouselIndex] = useState(0);

  const activeMemory = MEMORIES[heroIndex];

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden font-sans relative selection:bg-pink-500/30">
      <AnimatePresence mode="wait">
        {showIntro && (
          <IntroScreen key="intro" onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* === BACKGROUND DECORATIONS (The "Ramai" Factor) === */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
         {/* Gradients - Optimized with radial-gradient instead of heavy blur filters */}
        <div className="absolute -top-[10%] -left-[10%] w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] rounded-full bg-[radial-gradient(circle,_rgba(88,28,135,0.08)_0%,_transparent_70%)] mix-blend-screen transform-gpu will-change-opacity"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[70vw] h-[70vw] md:w-[50vw] md:h-[50vw] rounded-full bg-[radial-gradient(circle,_rgba(131,24,67,0.08)_0%,_transparent_70%)] mix-blend-screen transform-gpu"></div>
        
        {/* Floating Icons/Doodles - Added GPU acceleration and better positioning */}
        <Star className="absolute top-[15%] left-[5%] md:left-[10%] text-yellow-500/15 w-8 h-8 md:w-12 md:h-12 rotate-12 animate-float transform-gpu" />
        <Star className="absolute bottom-[20%] right-[10%] md:right-[15%] text-purple-500/15 w-6 h-6 md:w-8 md:h-8 -rotate-12 transform-gpu" />
        <Zap className="absolute top-[40%] right-[3%] md:right-[5%] text-cyan-500/15 w-10 h-10 md:w-16 md:h-16 rotate-45 transform-gpu" />
        <Disc className="absolute bottom-[10%] left-[5%] text-white/5 w-24 h-24 md:w-32 md:h-32 animate-spin-slow transform-gpu" />
        
        {/* Abstract Lines */}
        <div className="absolute top-[25%] left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent -rotate-2 transform-gpu"></div>
        <div className="absolute bottom-[30%] left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/5 to-transparent rotate-3 transform-gpu"></div>
        
        {/* Random Text Textures - Fluid sizing */}
        <div className="absolute top-[20%] right-[10%] font-hand text-4xl md:text-6xl text-white/[0.03] rotate-12 transform-gpu">Memories</div>
        <div className="absolute bottom-[15%] left-[8%] font-sans text-6xl md:text-8xl font-black text-white/[0.03] -rotate-6 tracking-tighter transform-gpu">DKV</div>
        
        {/* Crosses */}
        <X className="absolute top-10 right-10 text-white/10 w-4 h-4 md:w-6 md:h-6" />
        <X className="absolute top-1/2 left-[5%] text-white/10 w-3 h-3 md:w-4 md:h-4" />
        <X className="absolute bottom-[25%] right-[20%] text-white/5 w-6 h-6 md:w-8 md:h-8" />
      </div>

      {!showIntro && (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
              }
            }
          }}
          className="relative z-10 flex flex-col min-h-screen"
        >
          {/* Header - Reduced blur for mobile performance */}
          <motion.header
            variants={{
              hidden: { opacity: 0, y: -10 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
            }}
            className="w-full py-4 md:py-6 px-4 md:px-12 flex justify-between items-center border-b border-white/5 backdrop-blur-sm sticky top-0 z-40 bg-black/60 md:bg-black/20 transform-gpu"
          >
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                  <div className="absolute inset-0 bg-purple-500 blur-sm opacity-50 rounded-full group-hover:opacity-100 transition-opacity"></div>
                  <Camera strokeWidth={1.5} className="w-8 h-8 text-white relative z-10" />
              </div>
              <div className="flex flex-col">
                  <h1 className="text-xl md:text-2xl font-black tracking-tighter italic group-hover:text-purple-300 transition-colors">
                    ALBUM {CLASS_NAME}
                  </h1>
                  <span className="text-[8px] md:text-[10px] tracking-[0.3em] text-gray-400 uppercase">Class of Legends</span>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="px-4 py-1 border border-white/20 rounded-full text-xs font-mono text-gray-400 bg-white/5 transform rotate-2 hover:rotate-0 transition-transform">
                Since 2025
              </div>
            </div>
          </motion.header>

          {/* Main Content Area */}
          <main className="flex-grow flex flex-col items-center justify-start py-4 md:py-8 space-y-4 md:space-y-6 w-full px-4">

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              className="w-full flex justify-center"
            >
              <HeroDisplay memory={activeMemory} />
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
              }}
              className="w-full mt-auto"
            >
               {/* Section Title for Carousel */}
               <div className="text-center mb-2 opacity-50">
                  <span className="font-hand text-xl text-purple-300"> ~ Swipe to explore ~ </span>
               </div>
               {/*
                  - carouselIndex controls the animation loop
                  - setCarouselIndex updates the animation loop
                  - setHeroIndex is called ONLY when a user CLICKS a photo
               */}
              <InfiniteCarousel
                memories={MEMORIES}
                currentIndex={carouselIndex}
                onScrollChange={setCarouselIndex}
                onPickMemory={setHeroIndex}
                activeHeroId={activeMemory.id}
              />
            </motion.div>
          </main>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { delay: 0.5 } }
            }}
          >
            <Footer />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default App;
