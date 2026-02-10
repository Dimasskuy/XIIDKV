import React from 'react';
import { Instagram, Heart } from 'lucide-react';
import { SCHOOL_IG_URL } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 mt-12 border-t border-white/5 bg-black/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Dibuat dengan</span>
          <Heart size={14} className="text-red-500 fill-red-500" />
          <span>oleh Dimas 3 DKV</span>
        </div>
        
        <a 
          href={SCHOOL_IG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
        >
          <Instagram size={18} />
          <span className="text-sm font-medium">Instagram Kelas</span>
        </a>
      </div>
    </footer>
  );
};

export default Footer;