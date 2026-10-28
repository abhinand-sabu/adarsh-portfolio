import React, { useState } from 'react';
import { Film, Image as ImageIcon, Upload, Menu, X, Sparkles, UserCheck, Shield } from 'lucide-react';

export default function Navbar({ 
  activeCategory, 
  setActiveCategory, 
  onOpenUpload, 
  onOpenProfileEdit,
  profile 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'all', label: 'All Works', icon: Sparkles },
    { id: 'video', label: 'Video Editing', icon: Film },
    { id: 'poster', label: 'Poster Designing', icon: ImageIcon },
  ];

  const handleSelectCategory = (id) => {
    setActiveCategory(id);
    setMobileMenuOpen(false);
    const targetElement = document.getElementById('portfolio-section');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative w-11 h-11 rounded-xl p-[2px] bg-gradient-to-tr from-amber-400 via-rose-600 to-sky-400 shadow-lg shadow-rose-950/40">
            <div className="w-full h-full rounded-[10px] bg-[#050814] overflow-hidden flex items-center justify-center">
              <img 
                src={profile.avatarUrl} 
                alt="Profile Avatar" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/neon-creator.png';
                }}
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#050814]" title="Available for freelance" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg sm:text-xl font-bold tracking-wider text-slate-100">
                {profile.name}
              </span>
              <span className="text-[10px] font-mono-tag px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 tracking-wide flex items-center gap-1.5">
              <span className="text-rose-400 font-medium">Video Editor</span>
              <span className="text-slate-600">•</span>
              <span className="text-sky-400 font-medium">Graphic Designer</span>
            </p>
          </div>
        </div>

        {/* Desktop Navigation Category Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-slate-900/80 border border-white/10 shadow-inner">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeCategory === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectCategory(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500/90 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Buttons: Upload & Edit Profile */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenProfileEdit}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-500 transition cursor-pointer"
            title="Edit bio or change avatar photo"
          >
            <UserCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="group relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-900 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:brightness-110 shadow-lg shadow-amber-500/20 transition-all duration-200 cursor-pointer active:scale-95"
          >
            <Upload className="w-3.5 h-3.5 text-slate-950 group-hover:-translate-y-0.5 transition-transform" />
            <span>Upload Work</span>
            <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 opacity-20 blur group-hover:opacity-40 transition" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenUpload}
            className="p-2 rounded-lg bg-amber-400 text-slate-950 shadow-md cursor-pointer"
            title="Upload Media"
          >
            <Upload className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-200 hover:text-white cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-white/10 bg-[#090e21] px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <div className="grid grid-cols-1 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeCategory === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectCategory(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-200 hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenProfileEdit();
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700"
            >
              <UserCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenUpload();
              }}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold shadow"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Work</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
