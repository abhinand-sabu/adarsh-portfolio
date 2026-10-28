import React from 'react';
import { ArrowUp, Lock, Unlock } from 'lucide-react';

const InstagramIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Footer({ 
  profile, 
  isAdmin = false, 
  onOpenAdminModal 
}) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-20 border-t border-white/[0.08] bg-[#05070c] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Brand identity */}
        <div className="text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="font-cinzel text-base font-bold text-slate-100 tracking-wider">
              {profile.name}
            </span>
            <span className="text-[10px] font-mono-tag text-slate-500 uppercase">
              • Portfolio
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono-tag">
            Graphic Designer &amp; Video Editor
          </p>
        </div>

        {/* Action Controls: Back to top + Discreet Admin */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAdminModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono-tag transition cursor-pointer ${
              isAdmin 
                ? 'bg-amber-400/10 text-amber-300 border border-amber-400/25' 
                : 'bg-white/[0.03] text-slate-500 hover:text-slate-300 border border-white/10'
            }`}
            title="Studio Management Mode"
          >
            {isAdmin ? <Unlock className="w-3 h-3 text-amber-400" /> : <Lock className="w-3 h-3" />}
            <span>{isAdmin ? 'Studio Active' : 'Admin'}</span>
          </button>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white text-xs font-mono-tag transition cursor-pointer"
          >
            <ArrowUp className="w-3 h-3" />
            <span>Top</span>
          </button>
        </div>

      </div>

      {/* Creator Instagram Credit positioned at the very bottom */}
      <div className="border-t border-white/[0.04] py-5 bg-[#030508]/80 text-center">
        <p className="text-xs font-mono-tag text-slate-400 flex items-center justify-center gap-2">
          <span>Crafted with care by</span>
          <a
            href="https://instagram.com/abhinand.33"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-slate-200 hover:text-[#dfba73] transition font-semibold"
          >
            <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
            <span>@abhinand.33</span>
          </a>
        </p>
      </div>
    </footer>
  );
}
