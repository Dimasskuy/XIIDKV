import React, { useEffect, useMemo, useState } from 'react';
import { Camera, Gauge, Sparkles, Star, Zap, Disc } from 'lucide-react';
import { CLASS_NAME, MEMORIES } from './constants';
import HeroDisplay from './components/HeroDisplay';
import InfiniteCarousel from './components/InfiniteCarousel';
import Footer from './components/Footer';
import IntroScreen from './components/IntroScreen';

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
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const savedIndex = Number(localStorage.getItem(LAST_MEMORY_KEY) || '0');
    if (!Number.isNaN(savedIndex) && savedIndex >= 0 && savedIndex < MEMORIES.length) {
      setHeroIndex(savedIndex);
      setCarouselIndex(savedIndex);
    }
    setLiteMode(localStorage.getItem(LITE_MODE_KEY) === '1');
  }, []);

  useEffect(() => {
    localStorage.setItem(LAST_MEMORY_KEY, String(heroIndex));
  }, [heroIndex]);

  useEffect(() => {
    localStorage.setItem(LITE_MODE_KEY, liteMode ? '1' : '0');
  }, [liteMode]);

  const shouldReduce = reducedMotion || liteMode;
  const activeMemory = useMemo(() => MEMORIES[heroIndex], [heroIndex]);

  return (
    <div className="min-h-screen bg-[#060608] text-white overflow-x-hidden font-sans relative selection:bg-fuchsia-500/30">
      {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} reducedMotion={shouldReduce} />}

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(168,85,247,0.16),transparent_36%),radial-gradient(circle_at_82%_78%,rgba(34,211,238,0.1),transparent_40%)]" />
        {!shouldReduce && (
          <>
            <Star className="hidden md:block absolute top-[15%] left-[10%] text-fuchsia-300/30 w-10 h-10 animate-float" />
            <Zap className="hidden md:block absolute top-[35%] right-[8%] text-cyan-300/30 w-12 h-12 animate-float-delayed" />
            <Disc className="hidden lg:block absolute bottom-[14%] left-[7%] text-white/10 w-28 h-28 animate-spin-slow" />
          </>
        )}
      </div>

      {!showIntro && (
        <div className="relative z-10 min-h-screen flex flex-col">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 md:bg-black/35 md:backdrop-blur-md backdrop-blur-0">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {!shouldReduce && <div className="absolute inset-0 blur-md rounded-full bg-fuchsia-500/50" />}
                  <Camera className="relative w-7 h-7 md:w-8 md:h-8" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-black tracking-tight italic">ALBUM {CLASS_NAME}</h1>
                  <p className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-gray-400">Class of Legends</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden md:inline-flex items-center gap-1 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs text-fuchsia-200">
                  <Sparkles size={12} /> Premium Visual
                </span>
                <button
                  aria-label="Aktifkan atau nonaktifkan Lite Mode"
                  onClick={() => setLiteMode((v) => !v)}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400"
                >
                  <Gauge size={14} /> Lite {liteMode ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 max-w-7xl mx-auto w-full px-3 md:px-6 py-5 md:py-8">
            <HeroDisplay memory={activeMemory} prioritizeImage={!shouldReduce} liteMode={liteMode} />

            <div className="mt-8 md:mt-10">
              <p className="text-center font-hand text-2xl text-fuchsia-200/80">~ Swipe & pilih momen terbaik ~</p>
              <InfiniteCarousel
                memories={MEMORIES}
                currentIndex={carouselIndex}
                onScrollChange={setCarouselIndex}
                onPickMemory={(index) => {
                  setHeroIndex(index);
                  setCarouselIndex(index);
                }}
                activeHeroId={activeMemory.id}
                reducedMotion={reducedMotion}
                liteMode={liteMode}
              />
            </div>
          </main>

          <Footer liteMode={liteMode} />
        </div>
      )}
    </div>
  );
};

export default App;
