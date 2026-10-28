import React from 'react';
import { Film, Image as ImageIcon, Sparkles, Play, ArrowDown, Award, Palette, Layers, ExternalLink, Camera } from 'lucide-react';

export default function Hero({ 
  profile, 
  setActiveCategory, 
  onOpenUpload, 
  onOpenProfileEdit 
}) {
  const scrollToPortfolio = (category) => {
    setActiveCategory(category);
    const element = document.getElementById('portfolio-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 md:pt-16 md:pb-24 overflow-hidden">
      {/* Cinematic Ambient Glow Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-rose-950/30 via-amber-600/10 to-sky-600/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 left-10 w-72 h-72 bg-red-900/20 blur-[100px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-900/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: Visual Avatar & Bio / Headlines */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Headlines & Dual Focus */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
            
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/30 shadow-md">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-[11px] sm:text-xs font-mono-tag tracking-wider text-amber-300 font-medium uppercase">
                Dual Discipline Portfolio
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] sm:text-xs text-slate-300">Open for Bookings</span>
            </div>

            {/* Giant Dual Title: Graphic Designer & Video Editor */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]">
                <span className="block text-gold-gradient drop-shadow-sm">
                  GRAPHIC DESIGNER
                </span>
                <span className="block text-xl sm:text-2xl md:text-3xl text-slate-400 font-light my-0.5 sm:my-1 italic font-cinzel">
                  &amp;
                </span>
                <span className="block text-silver-gradient drop-shadow-sm">
                  VIDEO EDITOR
                </span>
              </h1>
            </div>

            {/* Tagline & Bio */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {profile.bio}
            </p>

            {/* Software & Skill Badges */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center lg:justify-start pt-1">
              {profile.skills.map((skill, index) => (
                <span 
                  key={index}
                  className="text-[11px] sm:text-xs font-mono-tag px-2.5 sm:px-3 py-1 rounded-lg bg-slate-900/70 border border-slate-700/80 text-slate-300 shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Dual Category Navigation Cards / CTA Buttons */}
            <div className="pt-3 sm:pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 max-w-xl mx-auto lg:mx-0">
              
              {/* Category 1: Video Editing */}
              <button
                onClick={() => scrollToPortfolio('video')}
                className="group relative text-left p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#120713]/90 via-[#180a1c]/80 to-[#0b1022]/90 border border-rose-500/30 hover:border-amber-400/80 transition-all duration-300 shadow-xl hover:shadow-rose-950/50 cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-rose-500/20 text-rose-400 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                    <Film className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono-tag text-rose-300/80 group-hover:text-amber-300 transition">
                    Dedicated Suite →
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  Video Editing
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Commercials, 9:16 Viral Reels, Music Videos &amp; Sound Design.
                </p>
                <div className="mt-2.5 sm:mt-3 flex items-center gap-1 text-xs font-semibold text-rose-400 group-hover:text-amber-400">
                  <span>Enter Video Suite</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>

              {/* Category 2: Poster Designing */}
              <button
                onClick={() => scrollToPortfolio('poster')}
                className="group relative text-left p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#07111e]/90 via-[#0a1628]/80 to-[#0e172a]/90 border border-sky-500/30 hover:border-slate-300/80 transition-all duration-300 shadow-xl hover:shadow-sky-950/50 cursor-pointer active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                  <div className="p-2 sm:p-2.5 rounded-xl bg-sky-500/20 text-sky-400 group-hover:bg-slate-100 group-hover:text-slate-950 transition-colors">
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono-tag text-sky-300/80 group-hover:text-slate-200 transition">
                    Dedicated Gallery →
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-sky-300 transition-colors">
                  Poster Designing
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Cinema Key Art, Editorial Swiss Grids &amp; High-Res Prints.
                </p>
                <div className="mt-2.5 sm:mt-3 flex items-center gap-1 text-xs font-semibold text-sky-400 group-hover:text-slate-200">
                  <span>Enter Poster Gallery</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>

            </div>

          </div>

          {/* Right Column: Hero Profile Visual Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* Main Profile Showcase Card */}
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md group">
              
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-rose-600 to-sky-500 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-500" />
              
              {/* Main Card container */}
              <div className="relative rounded-3xl bg-[#090e21] border border-amber-400/30 overflow-hidden shadow-2xl">
                
                {/* Profile Image View */}
                <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/neon-creator.png';
                    }}
                  />

                  {/* Gradient bottom scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090e21] via-transparent to-black/30 pointer-events-none" />

                  {/* Top floating badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono-tag font-bold tracking-wider bg-black/60 backdrop-blur-md border border-amber-400/40 text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      MASTER CREATIVE
                    </span>

                    <button
                      onClick={onOpenProfileEdit}
                      className="p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition cursor-pointer"
                      title="Customize Profile / Photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Bottom overlay identity info */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white font-cinzel">
                      {profile.name}
                    </h2>
                    <p className="text-[11px] sm:text-xs text-amber-300 font-medium truncate">
                      {profile.tagline}
                    </p>
                  </div>
                </div>

                {/* Quick Profile Stats Bar */}
                <div className="grid grid-cols-3 divide-x divide-white/10 bg-black/50 backdrop-blur-md py-2.5 sm:py-3 text-center border-t border-white/10">
                  <div>
                    <div className="text-sm sm:text-base md:text-lg font-extrabold text-amber-400">
                      {profile.experienceYears}
                    </div>
                    <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400">
                      Experience
                    </div>
                  </div>
                  <div>
                    <div className="text-sm sm:text-base md:text-lg font-extrabold text-slate-100">
                      {profile.projectsCompleted}
                    </div>
                    <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400">
                      Projects
                    </div>
                  </div>
                  <div>
                    <div className="text-sm sm:text-base md:text-lg font-extrabold text-sky-400">
                      {profile.clientsSatisfied}
                    </div>
                    <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-slate-400">
                      Clients
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
