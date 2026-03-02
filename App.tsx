import React, { useState, useEffect } from 'react';
import { MEMORIES, CLASS_NAME } from './constants';
import HeroDisplay from './components/HeroDisplay';
import InfiniteCarousel from './components/InfiniteCarousel';
import Footer from './components/Footer';
import IntroScreen from './components/IntroScreen';
import { Camera, Star, Zap, Disc, X, Gauge } from 'lucide-react';

const LAST_MEMORY_KEY = 'xii-dkv:last-memory';
const LITE_MODE_KEY = 'xii-dkv:lite-mode';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [liteMode, setLiteMode] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(LAST_MEMORY_KEY);
    if (saved) {
      const idx = Number(saved);
      if (!Number.isNaN(idx) && idx >= 0 && idx < MEMORIES.length) {
        setHeroIndex(idx);
        setCarouselIndex(idx);
      }
    }
    const savedLiteMode = localStorage.getItem(LITE_MODE_KEY);
    setLiteMode(savedLiteMode === '1');
  }, []);

  useEffect(() => {
    localStorage.setItem(LAST_MEMORY_KEY, String(heroIndex));
  }, [heroIndex]);

  useEffect(() => {
    localStorage.setItem(LITE_MODE_KEY, liteMode ? '1' : '0');
  }, [liteMode]);

  const activeMemory = MEMORIES[heroIndex];
  const shouldReduce = reducedMotion || liteMode;

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden font-sans relative selection:bg-pink-500/30">
      {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} reducedMotion={shouldReduce} />}

      {!shouldReduce && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <div className="absolute -top-[10%] -left-[10%] w-[80vw] h-[80vw] md:w-[60vw] md:h-[60vw] rounded-full bg-[radial-gradient(circle,_rgba(88,28,135,0.08)_0%,_transparent_70%)] mix-blend-screen transform-gpu will-change-opacity"></div>
          <div className="absolute -bottom-[10%] -right-[10%] w-[70vw] h-[70vw] md:w-[50vw] md:h-[50vw] rounded-full bg-[radial-gradient(circle,_rgba(131,24,67,0.08)_0%,_transparent_70%)] mix-blend-screen transform-gpu"></div>
          <Star className="hidden md:block absolute top-[15%] left-[10%] text-yellow-500/15 w-12 h-12 rotate-12 animate-float transform-gpu" />
          <Star className="hidden md:block absolute bottom-[20%] right-[15%] text-purple-500/15 w-8 h-8 -rotate-12 transform-gpu" />
          <Zap className="hidden md:block absolute top-[40%] right-[5%] text-cyan-500/15 w-16 h-16 rotate-45 transform-gpu" />
          <Disc className="hidden md:block absolute bottom-[10%] left-[5%] text-white/5 w-32 h-32 animate-spin-slow transform-gpu" />
          <div className="hidden md:block absolute top-[25%] left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent -rotate-2 transform-gpu"></div>
          <div className="hidden md:block absolute bottom-[30%] left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/5 to-transparent rotate-3 transform-gpu"></div>
          <div className="hidden md:block absolute top-[20%] right-[10%] font-hand text-6xl text-white/[0.03] rotate-12 transform-gpu">Memories</div>
          <div className="hidden md:block absolute bottom-[15%] left-[8%] font-sans text-8xl font-black text-white/[0.03] -rotate-6 tracking-tighter transform-gpu">DKV</div>
          <X className="absolute top-10 right-10 text-white/10 w-4 h-4 md:w-6 md:h-6" />
        </div>
      )}

      {!showIntro && (
        <div className="relative z-10 flex flex-col min-h-screen">
          <header className="w-full py-4 md:py-6 px-4 md:px-12 flex justify-between items-center border-b border-white/5 sticky top-0 z-40 bg-black/70 md:bg-black/20 md:backdrop-blur-sm backdrop-blur-0 transform-gpu">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                {!shouldReduce && <div className="absolute inset-0 bg-purple-500 blur-sm opacity-50 rounded-full group-hover:opacity-100 transition-opacity"></div>}
                <Camera strokeWidth={1.5} className="w-8 h-8 text-white relative z-10" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-black tracking-tighter italic group-hover:text-purple-300 transition-colors">ALBUM {CLASS_NAME}</h1>
                <span className="text-[8px] md:text-[10px] tracking-[0.3em] text-gray-400 uppercase">Class of Legends</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                aria-label="Toggle Lite Mode"
                onClick={() => setLiteMode((prev) => !prev)}
                className="px-3 py-2 rounded-full border border-white/20 text-xs font-mono bg-white/5 hover:bg-white/10 inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                <Gauge size={14} /> Lite Mode: {liteMode ? 'ON' : 'OFF'}
              </button>
              <div className="hidden md:block px-4 py-1 border border-white/20 rounded-full text-xs font-mono text-gray-400 bg-white/5 transform rotate-2 hover:rotate-0 transition-transform">Since 2025</div>
            </div>
          </header>

          <main className="flex-grow flex flex-col items-center justify-start py-4 md:py-8 space-y-4 md:space-y-6 w-full px-4">
            <div className="w-full flex justify-center">
              <HeroDisplay memory={activeMemory} prioritizeImage={!shouldReduce} liteMode={liteMode} />
            </div>

            <div className="w-full mt-auto">
              <div className="text-center mb-2 opacity-50">
                <span className="font-hand text-xl text-purple-300"> ~ Swipe to explore ~ </span>
              </div>
              <InfiniteCarousel
                memories={MEMORIES}
                currentIndex={carouselIndex}
                onScrollChange={setCarouselIndex}
                onPickMemory={setHeroIndex}
                activeHeroId={activeMemory.id}
                reducedMotion={reducedMotion}
                liteMode={liteMode}
              />
            </div>
          </main>

          <div>
            <Footer liteMode={liteMode} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
