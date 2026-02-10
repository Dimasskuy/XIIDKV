import React, { useRef, useEffect, useState } from 'react';
import { Memory } from '../types';
import { Film } from 'lucide-react';

interface InfiniteCarouselProps {
  memories: Memory[];
  currentIndex: number;
  onScrollChange: (index: number) => void; 
  onPickMemory: (index: number) => void;
  activeHeroId: number;
}

const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({ 
  memories, 
  currentIndex, 
  onScrollChange, 
  onPickMemory,
  activeHeroId 
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Swipe State
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const handleNext = () => {
    onScrollChange((currentIndex + 1) % memories.length);
  };

  const handlePrev = () => {
    onScrollChange((currentIndex - 1 + memories.length) % memories.length);
  };

  // --- Auto-play Logic ---
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (!isPaused) {
      interval = setInterval(() => {
        handleNext();
      }, 3000); // Sedikit diperlambat agar kartu terlihat jelas
    }

    return () => {
        if (interval) clearInterval(interval);
    };
  }, [isPaused, currentIndex, memories.length]);

  // --- Pause/Resume Logic ---
  const pauseAutoPlay = () => {
    setIsPaused(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const resumeAutoPlay = () => {
    timeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2500);
  };

  // --- Swipe/Touch Handlers ---
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    pauseAutoPlay();
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
        resumeAutoPlay();
        return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
    
    resumeAutoPlay();
  };

  // --- Mouse Handlers ---
  const onMouseDown = (e: React.MouseEvent) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
    pauseAutoPlay();
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (touchStart !== null) {
        setTouchEnd(e.clientX);
    }
  };

  const onMouseUp = () => {
    if (touchStart !== null && touchEnd !== null) {
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) handleNext();
        if (isRightSwipe) handlePrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
    resumeAutoPlay();
  };

  const onMouseLeave = () => {
    if (touchStart !== null) {
        setTouchStart(null);
        resumeAutoPlay();
    }
  };

  // Helper to determine position style
  const getCardStyle = (index: number) => {
    const len = memories.length;
    // Calculate relative position accounting for wrap-around
    let diff = (index - currentIndex + len) % len;
    // Adjust diff to be -1, 0, 1 for prev, current, next
    if (diff > len / 2) diff -= len;

    // Base styles - optimized transitions for performance
    const baseStyle = "absolute top-1/2 left-1/2 transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] shadow-2xl origin-bottom transform-gpu will-change-[transform,opacity]";
    
    // CENTER CARD (Active)
    if (index === currentIndex) {
      return `${baseStyle} z-30 opacity-100 scale-110 -translate-x-1/2 -translate-y-1/2 rotate-0 grayscale-0 hover:scale-115`;
    }
    
    // PREVIOUS CARD (Left, tucked behind)
    const prevIndex = (currentIndex - 1 + len) % len;
    if (index === prevIndex) {
      return `${baseStyle} z-20 opacity-50 scale-90 -translate-x-[85%] -translate-y-1/2 -rotate-6 grayscale md:blur-[1px] cursor-pointer hover:opacity-80`;
    }
    
    // NEXT CARD (Right, tucked behind)
    const nextIndex = (currentIndex + 1) % len;
    if (index === nextIndex) {
      return `${baseStyle} z-20 opacity-50 scale-90 -translate-x-[15%] -translate-y-1/2 rotate-6 grayscale md:blur-[1px] cursor-pointer hover:opacity-80`;
    }

    // OTHERS (Hidden behind center)
    return `${baseStyle} z-0 opacity-0 scale-50 -translate-x-1/2 -translate-y-1/2 rotate-0 pointer-events-none`;
  };

  return (
    <div 
      // Adjusted height for better desktop balance
      className="relative w-full max-w-[95vw] mx-auto group my-12 h-[300px] md:h-[400px] select-none cursor-grab active:cursor-grabbing perspective-1000"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
    >
      
      {/* Decorative Background for Carousel - Optimized with radial gradient */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-40 md:h-96 bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_0%,_transparent_70%)] rounded-full -z-10 pointer-events-none transform-gpu"></div>

      {/* Cards Container */}
      <div className="w-full h-full relative">
          {memories.map((memory, index) => {
             const isHeroActive = memory.id === activeHeroId;
             const cardClasses = getCardStyle(index);

             return (
              <div
                key={memory.id}
                onClick={(e) => {
                    e.stopPropagation(); 
                    if (index === currentIndex) {
                      onPickMemory(index);
                    } else {
                      onScrollChange(index);
                    }
                }}
                // Reduced size for desktop so it doesn't overshadow the Hero
                className={`w-64 h-44 md:w-[500px] md:h-[320px] bg-white p-2 md:p-5 rounded-sm ${cardClasses} will-change-transform`}
              >
                <div className={`w-full h-full bg-gray-900 relative overflow-hidden border border-gray-200 shadow-inner group-card transform-gpu`}>
                    <img
                        src={memory.imageUrl}
                        alt={memory.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover pointer-events-none"
                    />
                    
                    {/* Dark Overlay for inactive cards */}
                    {index !== currentIndex && (
                      <div className="absolute inset-0 bg-black/40 transition-opacity"></div>
                    )}

                    {/* Number Badge */}
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] md:text-sm px-2 md:px-3 py-0.5 md:py-1 rounded-full font-mono backdrop-blur-md">
                      #{index + 1}
                    </div>

                    {/* Active Hero Indicator */}
                    {isHeroActive && (
                        <div className="absolute inset-0 border-4 border-yellow-400/80 pointer-events-none z-40 animate-pulse"></div>
                    )}
                </div>
                
                {/* Tape Effect on Top */}
                <div className="absolute -top-3 md:-top-5 left-1/2 -translate-x-1/2 w-16 md:w-32 h-4 md:h-8 bg-white/30 rotate-1 backdrop-blur-sm shadow-sm"></div>
              </div>
             );
          })}
      </div>
      
      {/* Status */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none opacity-50">
         <Film size={12} className="text-purple-400" />
         <span className="font-mono text-[10px] text-purple-200 tracking-[0.2em] uppercase">
            {isPaused ? "HOLD" : "SLIDE"}
         </span>
      </div>
    </div>
  );
};

export default InfiniteCarousel;
