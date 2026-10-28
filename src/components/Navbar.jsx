import React from 'react';
import { Search, X, Upload, UserCheck, LogOut, Key } from 'lucide-react';

export default function Navbar({ 
  searchQuery, 
  setSearchQuery, 
  isAdmin = false,
  onOpenUpload,
  onOpenProfileEdit,
  onOpenChangePassword,
  onExitAdmin,
  totalResults = 0
}) {
  const isSearching = Boolean(searchQuery && searchQuery.trim().length > 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07090e]/90 backdrop-blur-2xl border-b border-white/[0.08] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Brand Monogram / Name */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#dfba73]/30 via-white/5 to-transparent p-[1px] shadow-sm">
            <div className="w-full h-full rounded-[7px] bg-[#0a0d14] flex items-center justify-center border border-white/5">
              <span className="font-cinzel text-xs font-bold text-[#dfba73] group-hover:scale-110 transition-transform">
                A
              </span>
            </div>
          </div>
          <span className="font-cinzel text-sm sm:text-base font-bold tracking-wider text-slate-100 group-hover:text-[#dfba73] transition-colors hidden sm:inline">
            Adarsh A L
          </span>
        </div>

        {/* Minimalist Centered Search Bar */}
        <div className="flex-1 max-w-xl mx-auto">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 pointer-events-none text-slate-500 flex items-center">
              <Search className="w-4 h-4" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setSearchQuery('');
              }}
              placeholder="Search videos, graphics, software, tags..."
              className="w-full pl-10 pr-10 py-2 rounded-full bg-[#0a0d14] border border-white/10 hover:border-white/20 focus:border-[#dfba73]/60 focus:bg-[#0c1018] text-xs sm:text-sm text-slate-100 placeholder-slate-500 font-mono-tag focus:outline-none transition-all duration-200 shadow-inner"
            />

            {/* Clear Button or Result Badge */}
            <div className="absolute right-3 flex items-center gap-1.5">
              {isSearching && (
                <>
                  <span className="text-[10px] font-mono-tag px-2 py-0.5 rounded-full bg-white/[0.06] text-[#dfba73] hidden md:inline">
                    {totalResults} {totalResults === 1 ? 'match' : 'matches'}
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Top-Right Area: Only Admin Management Controls when in Admin Mode */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isAdmin ? (
            <>
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-[10px] font-mono-tag">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Admin</span>
              </div>

              <button
                onClick={onOpenProfileEdit}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition cursor-pointer"
                title="Edit Bio & Profile"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#dfba73]" />
                <span className="text-[11px]">Profile</span>
              </button>

              <button
                onClick={onOpenChangePassword}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition cursor-pointer"
                title="Change Admin Password"
              >
                <Key className="w-3.5 h-3.5 text-[#dfba73]" />
                <span className="text-[11px]">Password</span>
              </button>

              <button
                onClick={onOpenUpload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-black bg-[#c5a059] hover:bg-[#dfba73] shadow transition cursor-pointer active:scale-95"
                title="Upload New Work"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>

              <button
                onClick={onExitAdmin}
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 border border-transparent hover:border-rose-900/40 transition cursor-pointer"
                title="Exit Admin Mode"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            /* Public View: Minimalist subtle placeholder or balance element */
            <div className="w-8 h-8 flex items-center justify-center opacity-0 pointer-events-none sm:block">
              <span className="w-1" />
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
