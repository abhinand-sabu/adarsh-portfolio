import React from 'react';
import { Film, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function CategoryNav({ 
  activeCategory = 'all', 
  setActiveCategory 
}) {
  const tabs = [
    {
      id: 'all',
      label: 'All Work',
      icon: Sparkles,
    },
    {
      id: 'videos',
      label: 'Videos',
      icon: Film,
    },
    {
      id: 'graphics',
      label: 'Graphics',
      icon: ImageIcon,
    }
  ];

  return (
    <div className="w-full flex items-center justify-center pt-2 pb-6 px-2">
      <nav 
        aria-label="Work Category Switcher"
        className="inline-flex items-center p-1 rounded-full bg-[#0a0d14]/90 backdrop-blur-xl border border-white/10 shadow-lg max-w-full overflow-x-auto"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = 
            activeCategory === tab.id || 
            (tab.id === 'videos' && activeCategory === 'video') || 
            (tab.id === 'graphics' && (activeCategory === 'poster' || activeCategory === 'posters'));

          let activeStyle = '';
          if (isActive) {
            if (tab.id === 'videos') {
              activeStyle = 'bg-[#dfba73]/20 text-[#dfba73] font-semibold border border-[#dfba73]/40 shadow-sm';
            } else if (tab.id === 'graphics') {
              activeStyle = 'bg-[#93c5fd]/20 text-[#93c5fd] font-semibold border border-[#93c5fd]/40 shadow-sm';
            } else {
              activeStyle = 'bg-white/15 text-white font-semibold border border-white/20 shadow-sm';
            }
          } else {
            activeStyle = 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent';
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory && setActiveCategory(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-mono-tag whitespace-nowrap transition-all duration-200 cursor-pointer active:scale-95 ${activeStyle}`}
            >
              <Icon className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
