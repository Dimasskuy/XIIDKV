import React from 'react';
import { Instagram, Heart } from 'lucide-react';
import { SCHOOL_IG_URL } from '../constants';

interface FooterProps {
  liteMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ liteMode }) => {
  return (
    <footer className="w-full py-8 mt-12 border-t border-white/5 bg-black/40 md:backdrop-blur-sm backdrop-blur-0">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Dibuat dengan</span>
          <Heart size={14} className="text-red-500 fill-red-500" />
          <span>oleh Dimas 3 DKV {liteMode ? '· Lite Mode ON' : ''}</span>
        </div>

        <a
          href={SCHOOL_IG_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Buka Instagram kelas"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <Instagram size={18} />
          <span className="text-sm font-medium">Instagram Kelas</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
