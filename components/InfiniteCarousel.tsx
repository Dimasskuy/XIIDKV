import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Film } from 'lucide-react';
import { FALLBACK_IMAGE } from '../constants';
import { Memory } from '../types';

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
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const idxRef = useRef(currentIndex);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    idxRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    setIsPaused(reducedMotion || liteMode);
  }, [reducedMotion, liteMode]);

  const next = useCallback(() => {
    onScrollChange((idxRef.current + 1) % memories.length);
  }, [memories.length, onScrollChange]);

  const prev = () => {
    onScrollChange((idxRef.current - 1 + memories.length) % memories.length);
  };

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isPaused && !reducedMotion && !liteMode) {
      intervalRef.current = setInterval(next, 3600);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (resumeRef.current) clearTimeout(resumeRef.current);
    };
  }, [isPaused, reducedMotion, liteMode, next]);

  const pause = () => {
    setIsPaused(true);
    if (resumeRef.current) clearTimeout(resumeRef.current);
  };

  const resume = () => {
    if (reducedMotion || liteMode) return;
    resumeRef.current = setTimeout(() => setIsPaused(false), 2200);
  };

  const minSwipeDistance = 45;

  const cardBase = (index: number) => {
    const base = `absolute top-1/2 left-1/2 transition-[transform,opacity] ${reducedMotion ? 'duration-150' : 'duration-500'} ease-out origin-center transform-gpu`;
    if (index === currentIndex) return `${base} z-30 opacity-100 scale-100 md:scale-105 -translate-x-1/2 -translate-y-1/2`;
    if (index === (currentIndex - 1 + memories.length) % memories.length) return `${base} z-20 opacity-55 scale-90 -translate-x-[95%] md:-translate-x-[88%] -translate-y-1/2 ${reducedMotion ? '' : '-rotate-6'}`;
    if (index === (currentIndex + 1) % memories.length) return `${base} z-20 opacity-55 scale-90 -translate-x-[5%] md:-translate-x-[12%] -translate-y-1/2 ${reducedMotion ? '' : 'rotate-6'}`;
    return `${base} z-0 opacity-0 scale-75 -translate-x-1/2 -translate-y-1/2 pointer-events-none`;
  };

  return (
    <section
      className="relative w-full h-[300px] md:h-[430px] mt-4 select-none cursor-grab active:cursor-grabbing"
      onTouchStart={(e) => {
        pause();
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
      }}
      onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientX)}
      onTouchEnd={() => {
        if (touchStart !== null && touchEnd !== null) {
          const d = touchStart - touchEnd;
          if (d > minSwipeDistance) next();
          if (d < -minSwipeDistance) prev();
        }
        resume();
      }}
      onMouseDown={(e) => {
        pause();
        setTouchEnd(null);
        setTouchStart(e.clientX);
      }}
      onMouseMove={(e) => touchStart !== null && setTouchEnd(e.clientX)}
      onMouseUp={() => {
        if (touchStart !== null && touchEnd !== null) {
          const d = touchStart - touchEnd;
          if (d > minSwipeDistance) next();
          if (d < -minSwipeDistance) prev();
        }
        setTouchStart(null);
        setTouchEnd(null);
        resume();
      }}
      onMouseLeave={() => {
        setTouchStart(null);
        setTouchEnd(null);
        resume();
      }}
    >
      {!liteMode && <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-40 md:h-72 rounded-full bg-[radial-gradient(circle,_rgba(217,70,239,0.13)_0%,_transparent_70%)]" />}

      <div className="relative w-full h-full">
        {memories.map((memory, index) => {
          const src = failed[memory.id] ? FALLBACK_IMAGE : memory.imageUrl;
          const isActive = memory.id === activeHeroId;
          return (
            <button
              key={memory.id}
              aria-label={`Pilih ${memory.title}`}
              className={`${cardBase(index)} w-[245px] h-[165px] md:w-[520px] md:h-[320px] rounded-lg bg-white p-2 md:p-3 text-left shadow-[0_20px_60px_rgba(0,0,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400`}
              onClick={() => (index === currentIndex ? onPickMemory(index) : onScrollChange(index))}
            >
              <div className="relative h-full w-full overflow-hidden rounded border border-white/10 bg-black">
                <img
                  src={src}
                  srcSet={`${src} 480w, ${src} 768w, ${src} 1280w`}
                  sizes="(max-width: 768px) 245px, 520px"
                  alt={memory.title}
                  width={memory.width}
                  height={memory.height}
                  loading={index === currentIndex ? 'eager' : 'lazy'}
                  fetchPriority={index === currentIndex ? 'high' : 'auto'}
                  decoding="async"
                  onError={() => setFailed((p) => ({ ...p, [memory.id]: true }))}
                  className="w-full h-full object-cover"
                />
                {index !== currentIndex && <div className="absolute inset-0 bg-black/45" />}
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-[10px] md:text-xs bg-black/60 border border-white/10">#{index + 1}</div>
                {isActive && <div className={`absolute inset-0 border-[3px] border-amber-300/90 ${reducedMotion ? '' : 'animate-pulse'}`} />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-fuchsia-200/85 pointer-events-none">
        <Film size={12} /> {isPaused ? 'HOLD' : 'AUTOPLAY'}
      </div>
    </section>
  );
};

export default InfiniteCarousel;
