import React from 'react';
import { Heart, Instagram } from 'lucide-react';
import { SCHOOL_IG_URL } from '../constants';

interface FooterProps {
  liteMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ liteMode }) => {
  return (
    <footer className="mt-12 border-t border-white/10 bg-black/45 md:backdrop-blur-sm backdrop-blur-0">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <p className="text-sm text-gray-300 inline-flex items-center gap-2">
          Dibuat dengan <Heart size={14} className="text-red-500 fill-red-500" /> untuk XII DKV
          {liteMode && <span className="text-fuchsia-300">· Lite Mode aktif</span>}
        </p>

        <a
          href={SCHOOL_IG_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Kunjungi Instagram kelas"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400"
        >
          <Instagram size={18} />
          <span className="text-sm font-semibold">Instagram Kelas</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
