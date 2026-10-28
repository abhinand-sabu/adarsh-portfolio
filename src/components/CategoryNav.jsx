import React from 'react';
import { Film, Image as ImageIcon, Sparkles, Filter } from 'lucide-react';

export default function CategoryNav({ 
  activeCategory, 
  setActiveCategory, 
  counts 
}) {
  const tabs = [
    {
      id: 'all',
      label: 'All Creations',
      count: counts.all,
      icon: Sparkles,
      color: 'amber'
    },
    {
      id: 'video',
      label: 'Video Editing',
      count: counts.video,
      icon: Film,
      color: 'rose'
    },
    {
      id: 'poster',
      label: 'Poster Designing',
      count: counts.poster,
      icon: ImageIcon,
      color: 'sky'
    }
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10">
      
      {/* Category Selection Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 shadow-lg w-full sm:w-auto overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? tab.id === 'video'
                    ? 'bg-gradient-to-r from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-900/40'
                    : tab.id === 'poster'
                    ? 'bg-gradient-to-r from-sky-600 to-sky-700 text-white shadow-lg shadow-sky-900/40'
                    : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className={`text-[11px] font-mono-tag px-1.5 py-0.5 rounded-full ${
                isActive
                  ? tab.id === 'all'
                    ? 'bg-black/20 text-slate-950 font-bold'
                    : 'bg-black/30 text-white'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category description label */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 font-mono-tag">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        {activeCategory === 'video' && 'SHOWCASING: REELS, 4K CUTS, MOTION DESIGN & SOUND'}
        {activeCategory === 'poster' && 'SHOWCASING: KEY ART, CINEMA ONE-SHEETS & EDITORIAL'}
        {activeCategory === 'all' && 'SHOWCASING: COMPREHENSIVE DUAL PORTFOLIO'}
      </div>

    </div>
  );
}
