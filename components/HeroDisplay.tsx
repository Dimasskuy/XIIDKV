import React, { useEffect, useState } from 'react';
import { Loader2, Quote, Share2, Sparkles } from 'lucide-react';
import { FALLBACK_IMAGE } from '../constants';
import { getRandomQuote } from '../services/quoteService';
import { Memory, QuoteState } from '../types';

interface HeroDisplayProps {
  memory: Memory;
  prioritizeImage: boolean;
  liteMode: boolean;
}

const HeroDisplay: React.FC<HeroDisplayProps> = ({ memory, prioritizeImage, liteMode }) => {
  const [quoteState, setQuoteState] = useState<QuoteState>({ text: '', isLoading: false, error: null });
  const [imageSrc, setImageSrc] = useState(memory.imageUrl);

  useEffect(() => {
    setImageSrc(memory.imageUrl);
    setQuoteState({ text: '', isLoading: false, error: null });
  }, [memory.id, memory.imageUrl]);

  const handleGenerateQuote = async () => {
    setQuoteState((p) => ({ ...p, isLoading: true, error: null }));
    try {
      const text = await getRandomQuote();
      setQuoteState({ text, isLoading: false, error: null });
    } catch {
      setQuoteState({ text: '', isLoading: false, error: 'Gagal memuat caption.' });
    }
  };

  const handleShare = async () => {
    const text = `${memory.title}\n${memory.description}\n${window.location.href}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: memory.title, text, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(text);
        alert('Teks memory berhasil disalin.');
      }
    } catch {
      alert('Gagal membagikan memory.');
    }
  };

  return (
    <section className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.09] to-white/[0.02] md:backdrop-blur-md backdrop-blur-0 shadow-[0_25px_90px_rgba(0,0,0,0.45)] p-4 md:p-6 lg:p-8">
      {!liteMode && <div className="absolute -top-3 left-8 px-3 py-1 rounded-full bg-yellow-300 text-black text-xs font-bold rotate-[-7deg] shadow-lg">Fresh Drop</div>}

      <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-5 md:gap-8 items-start">
        <div className="relative">
          <div className="overflow-hidden rounded-xl border border-white/20 bg-black">
            <img
              src={imageSrc}
              srcSet={`${imageSrc} 640w, ${imageSrc} 960w, ${imageSrc} 1280w`}
              sizes="(max-width: 768px) 96vw, 65vw"
              alt={memory.title}
              width={memory.width}
              height={memory.height}
              loading={prioritizeImage ? 'eager' : 'lazy'}
              fetchPriority={prioritizeImage ? 'high' : 'auto'}
              decoding="async"
              onError={() => setImageSrc(FALLBACK_IMAGE)}
              className={`aspect-video w-full object-cover ${liteMode ? '' : 'transition-transform duration-700 hover:scale-[1.04]'}`}
            />
            {!liteMode && <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/35 to-transparent" />}
          </div>
          <div className="mt-2 text-right font-hand text-2xl text-white/80">{memory.date}</div>
        </div>

        <div className="flex flex-col gap-4 md:gap-5">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[0.95] uppercase">{memory.title}</h2>
          <div className="h-1 w-24 rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-300" />
          <p className="text-gray-200/90 leading-relaxed text-sm md:text-base">{memory.description}</p>

          <div className="flex flex-wrap gap-2">
            {!quoteState.text && !quoteState.isLoading && (
              <button
                onClick={handleGenerateQuote}
                aria-label="Generate caption"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-fuchsia-400/40 text-fuchsia-200 hover:bg-fuchsia-500/10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400"
              >
                <Sparkles size={14} /> Vibe Caption
              </button>
            )}
            <button
              onClick={handleShare}
              aria-label="Share memory"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/25 hover:bg-white/10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              <Share2 size={14} /> Share Memory
            </button>
          </div>

          {quoteState.isLoading && (
            <div className="inline-flex items-center gap-2 text-fuchsia-200 text-sm">
              <Loader2 size={14} className="animate-spin" /> Generating caption...
            </div>
          )}

          {quoteState.text && (
            <div className="relative rounded-lg border border-white/15 bg-black/35 p-3 md:p-4">
              <Quote size={14} className="absolute -top-2 -left-2 text-fuchsia-300 fill-fuchsia-300" />
              <p className="font-hand text-xl md:text-2xl text-white/90">"{quoteState.text}"</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroDisplay;
