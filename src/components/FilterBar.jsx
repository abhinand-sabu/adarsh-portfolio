import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

export default function FilterBar({
  activeCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  searchQuery,
  setSearchQuery,
  selectedAspect,
  setSelectedAspect
}) {
  // Define subcategories based on active main category
  const videoSubCategories = [
    'All Videos',
    'Cinematic & Trailers',
    'Reels & Commercials',
    'Music Videos'
  ];

  const posterSubCategories = [
    'All Posters',
    'Movie & Key Art',
    'Music & Festivals',
    'Fashion & Editorial'
  ];

  let currentSubCategories = [];
  if (activeCategory === 'video') {
    currentSubCategories = videoSubCategories;
  } else if (activeCategory === 'poster') {
    currentSubCategories = posterSubCategories;
  } else {
    currentSubCategories = ['All Work', 'Cinematic & Trailers', 'Reels & Commercials', 'Movie & Key Art', 'Fashion & Editorial'];
  }

  const aspectOptions = [
    { id: 'all', label: 'All Ratios' },
    { id: '16:9', label: '16:9 Landscape' },
    { id: '9:16', label: '9:16 Vertical Reel' },
    { id: '4:5', label: '4:5 Poster' },
    { id: '1:1', label: '1:1 Square' },
  ];

  return (
    <div className="py-4 space-y-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles, clients, software (e.g. DaVinci, Cyberpunk)..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Aspect Ratio Filter Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-mono-tag text-slate-400 uppercase hidden sm:inline">
            Ratio:
          </span>
          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            {aspectOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedAspect(opt.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono-tag transition whitespace-nowrap cursor-pointer ${
                  selectedAspect === opt.id
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Subcategory Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {currentSubCategories.map((sub) => {
          const isSelected = selectedSubCategory === sub || (sub.startsWith('All') && selectedSubCategory === 'All');
          return (
            <button
              key={sub}
              onClick={() => setSelectedSubCategory(sub.startsWith('All') ? 'All' : sub)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              {sub}
            </button>
          );
        })}
      </div>
    </div>
  );
}
