import React, { useEffect } from 'react';

interface IntroScreenProps {
  onComplete: () => void;
  reducedMotion: boolean;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete, reducedMotion }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, reducedMotion ? 350 : 2200);
    return () => clearTimeout(timer);
  }, [onComplete, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505] transition-opacity duration-700">
      <div className="relative w-full max-w-3xl px-6 py-10 text-center animate-fade-in">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] rounded-full bg-[radial-gradient(circle,_rgba(147,51,234,0.05)_0%,_transparent_70%)]"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-xs tracking-[0.5em] text-purple-400 uppercase font-mono mb-4">Presenting</span>
          <h2 className="text-4xl md:text-7xl font-black italic tracking-[0.25em] text-white text-center px-4">DKV NI BOSSS</h2>
          <div className="h-[1px] mt-6 w-[80%] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;
