import React from 'react';
import { Mail, ArrowUp, Sparkles, Heart } from 'lucide-react';

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
    <polygon points="10 15 15 12 10 9 10 15"/>
  </svg>
);

export default function Footer({ profile, setActiveCategory }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-24 border-t border-amber-500/20 bg-gradient-to-b from-[#080d1d] via-[#050814] to-black text-slate-400">
      {/* Decorative top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center justify-between">
          
          {/* Brand & Dual Role */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl font-bold text-white tracking-wider">
                {profile.name}
              </span>
              <span className="text-[10px] font-mono-tag px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                PORTFOLIO
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              Premium visual artistry bridging cinematic motion rhythm and high-impact poster key art. Available for commercial commissions, editorial posters, and brand films.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`mailto:${profile.socials?.email || 'creator@neonstudio.design'}`}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-semibold transition"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{profile.socials?.email || 'Inquire for Booking'}</span>
              </a>

              {profile.socials?.instagram && (
                <a
                  href={profile.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}

              {profile.socials?.youtube && (
                <a
                  href={profile.socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title="YouTube"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Category Navigation */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="text-xs font-mono-tag uppercase tracking-wider text-slate-200 font-bold">
              Navigation
            </h4>
            <div className="flex flex-col space-y-1.5 text-xs">
              <button 
                onClick={() => {
                  setActiveCategory('all');
                  document.getElementById('portfolio-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-left text-slate-400 hover:text-amber-300 transition cursor-pointer"
              >
                All Showcase Works
              </button>
              <button 
                onClick={() => {
                  setActiveCategory('video');
                  document.getElementById('portfolio-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-left text-slate-400 hover:text-rose-400 transition cursor-pointer"
              >
                Video Editing Portfolio (Trailers &amp; 9:16 Reels)
              </button>
              <button 
                onClick={() => {
                  setActiveCategory('poster');
                  document.getElementById('portfolio-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-left text-slate-400 hover:text-sky-400 transition cursor-pointer"
              >
                Poster Designing Portfolio (Key Art &amp; Swiss Grids)
              </button>
            </div>
          </div>

          {/* Back to top */}
          <div className="md:col-span-2 flex flex-col items-start md:items-end justify-center">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          </div>

        </div>

        {/* Bottom copyright & Netlify status */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>JAMstack &amp; Netlify Ready • Responsive Mobile Grid</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
