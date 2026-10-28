import React from 'react';
import { Play, Clock, Sparkles, Trash2, Maximize2, Tag } from 'lucide-react';

export default function VideoCard({ item, onPlay, onDelete }) {
  const isVertical = item.aspectRatio === '9:16';

  return (
    <div className={`group relative rounded-2xl overflow-hidden glass-panel border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col ${
      item.accent === 'gold' 
        ? 'hover:border-amber-400/60 hover:shadow-amber-950/40' 
        : 'hover:border-sky-400/60 hover:shadow-sky-950/40'
    } border-white/10`}>
      
      {/* Media / Thumbnail Container */}
      <div 
        onClick={() => onPlay(item)}
        className={`relative w-full overflow-hidden bg-slate-950 cursor-pointer ${
          isVertical ? 'aspect-[9/14]' : 'aspect-video'
        }`}
      >
        {item.videoUrl && item.videoUrl.startsWith('data:video') ? (
          <video
            src={item.videoUrl}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            muted
            loop
            playsInline
            onMouseEnter={(e) => e.target.play().catch(() => {})}
            onMouseLeave={(e) => {
              e.target.pause();
              e.target.currentTime = 0;
            }}
          />
        ) : (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
        )}

        {/* Ambient Dark Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

        {/* Play Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-xl group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all duration-300">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono-tag font-bold tracking-wider bg-black/75 backdrop-blur-md text-amber-300 border border-amber-400/30">
              {item.aspectRatio}
            </span>
            {item.isCustom && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600/90 text-white shadow">
                CUSTOM
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 bg-black/75 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 text-white font-mono-tag text-xs">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{item.duration || '01:00'}</span>
          </div>
        </div>

        {/* Bottom Quick Info inside image */}
        <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
          <span className="text-[11px] font-mono-tag text-rose-300 tracking-wider uppercase font-semibold">
            {item.subCategory}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
            {item.title}
          </h3>
        </div>
      </div>

      {/* Card Body Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-[#080d1f]/60">
        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {item.description}
        </p>

        {/* Client & Software Tags */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Client: <strong className="text-slate-200">{item.client || 'Creative Reel'}</strong></span>
            <span className="font-mono-tag text-amber-400/90">{item.year || '2026'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(item.software || ['Premiere Pro', 'DaVinci']).map((sw, i) => (
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
            onClick={() => onPlay(item)}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 transition cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Watch Full Cut</span>
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
