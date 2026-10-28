import React from 'react';
import { ZoomIn, Sparkles, Trash2, Layers, Download } from 'lucide-react';

export default function PosterCard({ item, onInspect, onDelete }) {
  const isSquare = item.aspectRatio === '1:1';

  return (
    <div className={`group relative rounded-2xl overflow-hidden glass-panel border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col ${
      item.accent === 'gold' 
        ? 'hover:border-amber-400/60 hover:shadow-amber-950/40' 
        : 'hover:border-slate-300/60 hover:shadow-sky-950/40'
    } border-white/10`}>
      
      {/* Poster Media Canvas Container */}
      <div 
        onClick={() => onInspect(item)}
        className={`relative w-full overflow-hidden bg-[#060a14] cursor-pointer p-3 sm:p-4 flex items-center justify-center`}
      >
        {/* Frame inner matting */}
        <div className={`relative w-full overflow-hidden rounded-lg shadow-2xl border ${
          item.accent === 'gold' ? 'border-amber-400/30' : 'border-slate-400/20'
        } ${isSquare ? 'aspect-square' : 'aspect-[4/5]'}`}>
          
          <img
            src={item.imageUrl || item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />

          {/* Hover Overlay with Zoom Icon */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/80 border border-amber-400/60 text-amber-300 shadow-xl font-medium text-xs">
              <ZoomIn className="w-4 h-4" />
              <span>Inspect High-Res</span>
            </div>
          </div>

          {/* Top badges */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-tag font-bold tracking-wider bg-black/80 backdrop-blur-md text-amber-300 border border-amber-400/30">
                {item.aspectRatio}
              </span>
              {item.isCustom && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-600/90 text-white shadow">
                  CUSTOM
                </span>
              )}
            </div>

            <span className="px-2 py-0.5 rounded text-[10px] font-mono-tag bg-black/80 text-slate-300 border border-white/10">
              {item.dpi || '300 DPI'}
            </span>
          </div>

        </div>
      </div>

      {/* Card Body Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-[#080d1f]/60">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-tag text-sky-400 uppercase font-semibold">
              {item.subCategory}
            </span>
            <span className="text-[11px] font-mono-tag text-slate-400">{item.year || '2026'}</span>
          </div>
          
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors mt-1 font-cinzel line-clamp-1">
            {item.title}
          </h3>

          <p className="text-xs text-slate-300 line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Print Dimensions & Software */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Print: <strong className="text-slate-200">{item.dimensions || 'One-Sheet'}</strong></span>
            <span className="text-slate-400 font-mono-tag">{item.client || 'Commission'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(item.software || ['Photoshop', 'Illustrator']).map((sw, i) => (
              <span 
                key={i}
                className="text-[10px] font-mono-tag px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60"
              >
                {sw}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={() => onInspect(item)}
            className="flex items-center gap-1.5 text-xs font-semibold text-sky-300 hover:text-sky-200 transition cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Lightbox View</span>
          </button>

          {item.isCustom && onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition cursor-pointer"
              title="Delete custom upload"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
