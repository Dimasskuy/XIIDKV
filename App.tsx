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
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         {/* Gradients - Optimized with radial-gradient instead of heavy blur filters */}
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,_rgba(88,28,135,0.1)_0%,_transparent_70%)] mix-blend-screen animate-pulse duration-[8s] transform-gpu will-change-[opacity]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,_rgba(131,24,67,0.1)_0%,_transparent_70%)] mix-blend-screen transform-gpu"></div>
        
        {/* Floating Icons/Doodles - Added GPU acceleration */}
        <Star className="absolute top-20 left-[10%] text-yellow-500/20 w-12 h-12 rotate-12 animate-bounce duration-[3000ms] transform-gpu will-change-transform" />
        <Star className="absolute bottom-40 right-[15%] text-purple-500/20 w-8 h-8 -rotate-12 transform-gpu" />
        <Zap className="absolute top-1/3 right-[5%] text-cyan-500/20 w-16 h-16 rotate-45 transform-gpu" />
        <Disc className="absolute bottom-20 left-10 text-white/5 w-32 h-32 animate-spin duration-[10000ms] transform-gpu will-change-transform" />
        
        {/* Abstract Lines */}
        <div className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent transform -rotate-3"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/10 to-transparent transform rotate-6"></div>
        
        {/* Random Text Textures */}
        <div className="absolute top-32 right-20 font-hand text-6xl text-white/5 rotate-12 select-none">Memories</div>
        <div className="absolute bottom-10 left-10 font-sans text-8xl font-black text-white/5 -rotate-6 select-none tracking-tighter">DKV</div>
        
        {/* Crosses */}
        <X className="absolute top-10 right-10 text-white/20 w-6 h-6" />
        <X className="absolute top-1/2 left-10 text-white/20 w-4 h-4" />
        <X className="absolute bottom-1/4 right-1/4 text-white/10 w-8 h-8" />
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
              hidden: { opacity: 0, y: -20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
            className="w-full py-6 px-6 md:px-12 flex justify-between items-center border-b border-white/5 backdrop-blur-md md:backdrop-blur-sm sticky top-0 z-40 bg-black/40 md:bg-black/20"
          >
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                  <div className="absolute inset-0 bg-purple-500 blur-sm opacity-50 rounded-full group-hover:opacity-100 transition-opacity"></div>
                  <Camera strokeWidth={1.5} className="w-8 h-8 text-white relative z-10" />
              </div>
              <div className="flex flex-col">
                  <h1 className="text-2xl font-black tracking-tighter italic group-hover:text-purple-300 transition-colors">
                    ALBUM {CLASS_NAME}
                  </h1>
                  <span className="text-[10px] tracking-[0.3em] text-gray-400 uppercase">Class of Legends</span>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="px-4 py-1 border border-white/20 rounded-full text-xs font-mono text-gray-400 bg-white/5 transform rotate-2 hover:rotate-0 transition-transform">
                Since 2025
              </div>
            </div>
          </motion.header>

          {/* Main Content Area */}
          <main className="flex-grow flex flex-col items-center justify-start py-8 space-y-6 w-full px-4">

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
