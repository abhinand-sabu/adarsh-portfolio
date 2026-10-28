import React from 'react';
import { ZoomIn, Trash2, ArrowUpRight, Pencil } from 'lucide-react';

export default function PosterCard({ item, onInspect, onDelete, onEdit, isAdmin = false }) {
  const isSquare = item.aspectRatio === '1:1';
  const isLandscape = item.aspectRatio === '16:9';

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-[#0a0d14] border border-white/[0.08] hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col h-full">
      
      {/* Poster Media Canvas Container with Museum Matting - Uniform 4:5 Height for All Poster Cards */}
      <div 
        onClick={() => onInspect(item)}
        className="relative w-full aspect-[4/5] overflow-hidden bg-[#05070c] cursor-pointer p-3 sm:p-4 flex items-center justify-center flex-shrink-0"
      >
        {/* Frame inner matting: 4:5 fills, 1:1 centers square, 16:9 frames landscape thumbnail */}
        <div 
          data-protected-media="true"
          className={`relative overflow-hidden rounded-lg shadow-2xl border border-white/10 ${
            isLandscape 
              ? 'w-full aspect-video' 
              : isSquare 
              ? 'aspect-square h-full max-w-full' 
              : 'w-full h-full'
          }`}
        >
          
          <img
            src={item.imageUrl || item.thumbnailUrl}
            alt={item.title}
            draggable="false"
            onContextMenu={(e) => e.preventDefault()}
            className={`w-full h-full ${isSquare || isLandscape ? 'object-contain' : 'object-cover'} group-hover:scale-[1.03] transition-transform duration-700 select-none pointer-events-none`}
            loading="lazy"
          />

          {/* Hover Overlay with Zoom Icon */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/85 border border-white/20 text-slate-100 shadow-xl font-medium text-xs">
              <ZoomIn className="w-3.5 h-3.5 text-[#dfba73]" />
              <span>Inspect Artwork</span>
            </div>
          </div>

          {/* Top badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-tag font-semibold tracking-wider bg-black/80 backdrop-blur-md text-[#dfba73] border border-white/10">
                {item.aspectRatio}
              </span>
              {item.isCustom && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-tag uppercase tracking-wider bg-[#081224]/90 text-[#93c5fd] border border-[#1e293b]">
                  Custom
                </span>
              )}
            </div>

            <span className="px-2 py-0.5 rounded text-[10px] font-mono-tag bg-black/80 text-slate-400 border border-white/10">
              {item.dpi || '300 DPI'}
            </span>
          </div>

        </div>
      </div>

      {/* Card Body Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-[#0a0d14] border-t border-white/[0.06]">
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono-tag text-slate-400 uppercase tracking-widest">
            <span className="text-slate-400 font-medium">{item.subCategory}</span>
            <span>{item.year || '2026'}</span>
          </div>
          
          <h3 className="text-base font-bold text-white group-hover:text-[#dfba73] transition-colors mt-1 font-cinzel line-clamp-1 h-6">
            {item.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed font-light min-h-[2.5rem]">
            {item.description}
          </p>
        </div>

        {/* Print Dimensions & Software */}
        <div className="space-y-2 pt-2.5 border-t border-white/[0.06]">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Format: <strong className="text-slate-200 font-medium">{item.dimensions || 'Poster Graphic'}</strong></span>
            <span className="text-slate-500 font-mono-tag text-[10px]">{item.client || 'Freelance Project'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {(item.software || ['Photoshop', 'Illustrator']).map((sw, i) => (
              <span 
                key={i}
                className="text-[10px] font-mono-tag px-2 py-0.5 rounded bg-white/[0.03] text-slate-400 border border-white/[0.06]"
              >
                {sw}
              </span>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between gap-2">
          <button
            onClick={() => onInspect(item)}
            className="flex items-center gap-1 text-xs font-semibold text-[#dfba73] hover:text-[#f3e7c4] transition cursor-pointer"
          >
            <span>Lightbox View</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {(isAdmin || onDelete || onEdit) && (
            <div className="flex items-center gap-1.5">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 transition cursor-pointer"
                  title="Edit poster artwork"
                >
                  <Pencil className="w-3 h-3 text-[#dfba73]" />
                  <span>Edit</span>
                </button>
              )}

              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`Are you sure you want to delete "${item.title}" from your portfolio?`)) {
                      onDelete(item.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-800/40 transition cursor-pointer"
                  title="Delete work from portfolio"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
