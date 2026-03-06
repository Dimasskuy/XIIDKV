import React, { useEffect, useState } from 'react';

interface IntroScreenProps {
  onComplete: () => void;
  reducedMotion: boolean;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete, reducedMotion }) => {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const showFor = reducedMotion ? 300 : 1800;
    const t1 = setTimeout(() => setHidden(true), showFor);
    const t2 = setTimeout(onComplete, showFor + 420);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#050507] transition-opacity duration-500 ${hidden ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative text-center px-6">
        <div className="absolute -inset-12 bg-[radial-gradient(circle,_rgba(217,70,239,0.2)_0%,_transparent_65%)] animate-pulse-slow" />
        <p className="relative text-xs uppercase tracking-[0.5em] text-fuchsia-300 mb-4">Presenting</p>
        <h2 className="relative text-4xl md:text-7xl font-black italic tracking-[0.18em]">DKV NI BOSSS</h2>
        <div className="relative mt-6 h-px w-64 md:w-96 mx-auto bg-gradient-to-r from-transparent via-fuchsia-400/70 to-transparent" />
      </div>
    </div>
  );
};

export default IntroScreen;
