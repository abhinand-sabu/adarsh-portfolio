import React from 'react';
import { Camera, Edit3 } from 'lucide-react';

export default function Hero({ 
  profile, 
  onOpenProfileEdit,
  isAdmin = false 
}) {
  return (
    <section className="relative pt-12 pb-14 sm:pt-16 sm:pb-20 overflow-hidden border-b border-white/[0.06]">
      {/* Luxury Restrained Radial Background Vignette */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[360px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(197,160,89,0.08),transparent_70%)] pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#3b0a11]/12 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#081224]/20 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Creator Display Picture (DP) */}
        <div className="relative group">
          <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full p-[2px] bg-gradient-to-b from-[#dfba73]/40 via-white/10 to-[#0a0d14] shadow-2xl transition-transform duration-500 group-hover:scale-105">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#07090e] border border-white/10 relative" data-protected-media="true">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-full object-cover object-center select-none pointer-events-none"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/neon-creator.png';
                }}
              />
              {/* Protective shield */}
              <div 
                className="absolute inset-0 z-10 select-none cursor-default bg-transparent"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          </div>

          {/* Quick Profile Edit Icon in Admin Mode */}
          {isAdmin && (
            <button
              onClick={onOpenProfileEdit}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-[#0a0d14] border border-[#dfba73]/50 text-[#dfba73] hover:bg-[#dfba73] hover:text-black shadow-lg transition-all duration-200 cursor-pointer active:scale-95"
              title="Edit Profile Photo & Bio"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Creator Name */}
        <h1 className="mt-6 text-3xl sm:text-5xl md:text-6xl font-bold font-cinzel tracking-wide text-gold-gradient">
          {profile.name}
        </h1>

        {/* Main Tagline */}
        <p className="mt-2 text-xs sm:text-sm font-mono-tag tracking-[0.25em] text-[#dfba73] uppercase font-semibold">
          {profile.tagline || 'Graphic Designer & Video Editor'}
        </p>

        {/* Clean, Concise Bio */}
        <p className="mt-4 text-sm sm:text-base text-slate-300 font-light leading-relaxed max-w-2xl text-center px-4 whitespace-pre-line">
          {profile.bio || "Graphic designer and video editor creating clean, engaging and modern visual content. Specializing in DaVinci Resolve color grading, dynamic hype cuts, and high-CTR social media artwork."}
        </p>

        {/* Admin Quick Action Button */}
        {isAdmin && (
          <div className="mt-5">
            <button
              onClick={onOpenProfileEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono-tag text-slate-300 hover:text-white transition cursor-pointer"
            >
              <Edit3 className="w-3 h-3 text-[#dfba73]" />
              <span>Edit Bio &amp; Profile Details</span>
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
