import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Memory } from '../types';
import { Film } from 'lucide-react';
import { FALLBACK_IMAGE } from '../constants';

interface InfiniteCarouselProps {
  memories: Memory[];
  currentIndex: number;
  onScrollChange: (index: number) => void;
  onPickMemory: (index: number) => void;
  activeHeroId: number;
  reducedMotion: boolean;
  liteMode: boolean;
}

const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({
  memories,
  currentIndex,
  onScrollChange,
  onPickMemory,
  activeHeroId,
  reducedMotion,
  liteMode,
}) => {
  const [isPaused, setIsPaused] = useState(reducedMotion || liteMode);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef(currentIndex);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    setIsPaused(reducedMotion || liteMode);
  }, [reducedMotion, liteMode]);

  const handleNext = useCallback(() => {
    const next = (indexRef.current + 1) % memories.length;
    onScrollChange(next);
  }, [memories.length, onScrollChange]);

  const handlePrev = () => {
    onScrollChange((indexRef.current - 1 + memories.length) % memories.length);
  };

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isPaused && !reducedMotion && !liteMode) {
      intervalRef.current = setInterval(handleNext, 3200);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [handleNext, isPaused, reducedMotion, liteMode]);

  const pauseAutoPlay = () => {
    setIsPaused(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const resumeAutoPlay = () => {
    if (reducedMotion || liteMode) return;
    timeoutRef.current = setTimeout(() => setIsPaused(false), 2500);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    pauseAutoPlay();
  };

  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return resumeAutoPlay();
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) handleNext();
    if (distance < -minSwipeDistance) handlePrev();
    resumeAutoPlay();
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
    pauseAutoPlay();
  };

  const onMouseMove = (e: React.MouseEvent) => touchStart !== null && setTouchEnd(e.clientX);

  const onMouseUp = () => {
    if (touchStart !== null && touchEnd !== null) {
      const distance = touchStart - touchEnd;
      if (distance > minSwipeDistance) handleNext();
      if (distance < -minSwipeDistance) handlePrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
    resumeAutoPlay();
  };

  const getCardStyle = (index: number) => {
    const baseStyle = `absolute top-1/2 left-1/2 transition-[transform,opacity] ${reducedMotion ? 'duration-150' : 'duration-500'} ease-[cubic-bezier(0.25,1,0.5,1)] origin-bottom transform-gpu will-change-transform`;
    if (index === currentIndex) return `${baseStyle} z-30 opacity-100 scale-105 md:scale-110 -translate-x-1/2 -translate-y-1/2 rotate-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)]`;
    if (index === (currentIndex - 1 + memories.length) % memories.length) return `${baseStyle} z-20 opacity-40 scale-90 -translate-x-[90%] md:-translate-x-[85%] -translate-y-1/2 ${reducedMotion ? '' : '-rotate-3 md:-rotate-6'} cursor-pointer hover:opacity-60`;
    if (index === (currentIndex + 1) % memories.length) return `${baseStyle} z-20 opacity-40 scale-90 -translate-x-[10%] md:-translate-x-[15%] -translate-y-1/2 ${reducedMotion ? '' : 'rotate-3 md:rotate-6'} cursor-pointer hover:opacity-60`;
    return `${baseStyle} z-0 opacity-0 scale-50 -translate-x-1/2 -translate-y-1/2 pointer-events-none`;
  };

  return (
    <div
      className="relative w-full max-w-full md:max-w-[95vw] mx-auto group my-8 md:my-12 h-[280px] md:h-[420px] select-none cursor-grab active:cursor-grabbing perspective-1000"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {!liteMode && <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-40 md:h-96 bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_0%,_transparent_70%)] rounded-full -z-10 pointer-events-none transform-gpu"></div>}

      <div className="w-full h-full relative">
        {memories.map((memory, index) => {
          const isHeroActive = memory.id === activeHeroId;
          const cardClasses = getCardStyle(index);
          const src = failedImages[memory.id] ? FALLBACK_IMAGE : memory.imageUrl;
          return (
            <button
              key={memory.id}
              aria-label={`Pilih memory ${memory.title}`}
              onClick={(e) => {
                e.stopPropagation();
                if (index === currentIndex) onPickMemory(index);
                else onScrollChange(index);
              }}
              className={`w-[220px] h-[150px] md:w-[480px] md:h-[300px] bg-white p-1.5 md:p-4 rounded-sm ${cardClasses} will-change-transform text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400`}
            >
              <div className="w-full h-full bg-gray-900 relative overflow-hidden border border-gray-200 shadow-inner group-card transform-gpu">
                <img
                  src={src}
                  srcSet={`${src} 480w, ${src} 768w, ${src} 1280w`}
                  sizes="(max-width: 768px) 220px, 480px"
                  alt={memory.title}
                  width={memory.width}
                  height={memory.height}
                  loading={index === currentIndex ? 'eager' : 'lazy'}
                  fetchPriority={index === currentIndex ? 'high' : 'auto'}
                  decoding="async"
                  onError={() => setFailedImages((prev) => ({ ...prev, [memory.id]: true }))}
                  className="w-full h-full object-cover pointer-events-none"
                />

                {index !== currentIndex && <div className="absolute inset-0 bg-black/40 transition-opacity"></div>}
                <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] md:text-sm px-2 md:px-3 py-0.5 md:py-1 rounded-full font-mono md:backdrop-blur-md backdrop-blur-0">#{index + 1}</div>
                {isHeroActive && <div className={`absolute inset-0 border-4 border-yellow-400/80 pointer-events-none z-40 ${reducedMotion ? '' : 'animate-pulse'}`}></div>}
              </div>

              {!liteMode && <div className="absolute -top-2 md:-top-5 left-1/2 -translate-x-1/2 w-12 md:w-32 h-3 md:h-8 bg-white/30 rotate-1 md:backdrop-blur-sm backdrop-blur-0 pointer-events-none"></div>}
            </button>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none opacity-50">
        <Film size={12} className="text-purple-400" />
        <span className="font-mono text-[10px] text-purple-200 tracking-[0.2em] uppercase">{isPaused ? 'HOLD' : 'SLIDE'}</span>
      </div>
    </div>
  );
};

export default InfiniteCarousel;
