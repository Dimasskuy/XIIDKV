import React, { useEffect, useState } from 'react';
import { Memory, QuoteState } from '../types';
import { getRandomQuote } from '../services/quoteService';
import { Sparkles, Loader2, Quote, Sticker } from 'lucide-react';

interface HeroDisplayProps {
  memory: Memory;
}

const HeroDisplay: React.FC<HeroDisplayProps> = ({ memory }) => {
  const [quoteState, setQuoteState] = useState<QuoteState>({
    text: '',
    isLoading: false,
    error: null,
  });

  useEffect(() => {
    setQuoteState({ text: '', isLoading: false, error: null });
  }, [memory.id]);

  const handleGenerateQuote = async () => {
    setQuoteState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const text = await getRandomQuote();
      setQuoteState({ text, isLoading: false, error: null });
    } catch (err) {
      setQuoteState({ text: '', isLoading: false, error: 'Gagal memuat caption.' });
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto mb-4 flex flex-col items-center z-20">
      
      {/* Decorative Washi Tape Top */}
      <div className="w-32 h-8 bg-yellow-400/80 absolute -top-4 z-30 transform -rotate-3 opacity-90 backdrop-blur-sm shadow-sm" style={{ clipPath: 'polygon(0% 0%, 100% 0%, 98% 100%, 2% 100%)' }}></div>

      {/* Main Container */}
      <div className="flex flex-col md:flex-row gap-8 items-center bg-[#1a1a1a] p-4 md:p-6 rounded-xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] relative">
        
        {/* Photo Section */}
        <div className="relative group w-full md:w-3/5 transform-gpu">
            {/* Sticker Decoration */}
            <div className="absolute -top-4 -left-4 z-20 transform -rotate-12 bg-white text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-black">
                NEW!
            </div>
            
            <div className="relative bg-white p-2 md:p-3 pb-8 md:pb-12 shadow-xl transform-gpu transition-transform duration-500 hover:scale-[1.01] hover:rotate-1">
                <div className="aspect-video w-full overflow-hidden bg-gray-200 relative border border-gray-300">
                    <img
                    src={memory.imageUrl}
                    alt={memory.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover filter contrast-[1.1] saturate-[0.9]"
                    />
                    {/* Grain overlay on photo */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-noise"></div>
                </div>
                
                {/* Handwritten Date */}
                <div className="absolute bottom-2 right-4 transform -rotate-2">
                    <span className="font-hand text-black/80 text-xl md:text-2xl font-bold">
                    {memory.date}
                    </span>
                </div>
            </div>
        </div>

        {/* Text/Context Section */}
        <div className="w-full md:w-2/5 flex flex-col items-start text-left space-y-4 relative">
             {/* Abstract blob behind text - Optimized with radial gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle,_rgba(168,85,247,0.05)_0%,_transparent_70%)] rounded-full -z-10 transform-gpu"></div>

            <h1 className="text-3xl md:text-5xl font-black font-sans text-white uppercase leading-[0.9] tracking-tighter drop-shadow-lg">
                {memory.title}
            </h1>
            
            <div className="h-1 w-20 bg-purple-500 rounded-full"></div>

            <p className="text-gray-300 font-sans font-light text-sm md:text-base leading-relaxed border-l-2 border-white/20 pl-4">
                {memory.description}
            </p>

            {/* AI Generator */}
            <div className="w-full pt-4">
                {!quoteState.text && !quoteState.isLoading && (
                    <button
                    onClick={handleGenerateQuote}
                    className="group relative px-6 py-2 bg-transparent overflow-hidden rounded-lg border border-purple-500/50 text-purple-300 font-mono text-sm transition-all hover:bg-purple-500/10 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                    >
                    <span className="relative flex items-center gap-2">
                        <Sparkles size={14} />
                        Vibe Check Here..
                    </span>
                    </button>
                )}

                {quoteState.isLoading && (
                    <div className="flex items-center gap-2 text-purple-400 font-mono text-xs animate-pulse">
                    <Loader2 size={14} className="animate-spin" />
                    <span>Cooking up caption...</span>
                    </div>
                )}

                {quoteState.text && (
                    <div className="relative mt-2 p-4 bg-black/40 border border-white/10 rounded-lg transform rotate-1">
                        <Quote className="absolute -top-2 -left-2 text-purple-500 w-4 h-4 fill-purple-500" />
                        <p className="font-hand text-xl text-white/90 leading-tight">
                            "{quoteState.text}"
                        </p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default HeroDisplay;
