import React from 'react';
import { Play, Clock, Trash2, ArrowUpRight, Pencil } from 'lucide-react';
import { parseVideoUrl } from '../utils/mediaUtils';

export default function VideoCard({ item, onPlay, onDelete, onEdit, isAdmin = false }) {
  const isVertical = item.aspectRatio === '9:16';
  const parsed = parseVideoUrl(item.videoUrl);
  const isDirectFile = parsed?.platform === 'direct' || (
    item.videoUrl && (
      item.videoUrl.startsWith('data:video') || 
      item.videoUrl.startsWith('blob:') || 
      item.videoUrl.endsWith('.mp4') ||
      item.videoUrl.endsWith('.webm')
    )
  );
  const hasActualVideo = isDirectFile;

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-[#0a0d14] border border-white/[0.08] hover:border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col h-full">
      
      {/* Uniform 16:9 Cinema Aspect Ratio Container for ALL videos */}
      <div 
        onClick={() => onPlay(item)}
        className="relative w-full aspect-video overflow-hidden bg-[#040508] cursor-pointer group/media select-none"
      >
        {hasActualVideo ? (
          isVertical ? (
            /* Vertical video in 16:9 container with blurred ambient backdrop */
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black" data-protected-media="true">
              <video
                src={`${item.videoUrl}#t=0.001`}
                className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-35 pointer-events-none select-none"
                muted
                loop
                playsInline
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
              />
              <div className="relative h-full aspect-[9/16] shadow-2xl border-x border-white/10 z-10 overflow-hidden">
                <video
                  src={`${item.videoUrl}#t=0.001`}
                  className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-700 select-none"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  draggable="false"
                  controlsList="nodownload"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                  onMouseEnter={(e) => e.target.play().catch(() => {})}
                  onMouseLeave={(e) => {
                    e.target.pause();
                    e.target.currentTime = 0;
                  }}
                />
              </div>
            </div>
          ) : (
            <video
              src={`${item.videoUrl}#t=0.001`}
              className="w-full h-full object-cover group-hover/media:scale-105 transition-transform duration-700 select-none"
              muted
              loop
              playsInline
              preload="metadata"
              draggable="false"
              controlsList="nodownload"
              disablePictureInPicture
              data-protected-media="true"
              onContextMenu={(e) => e.preventDefault()}
              onMouseEnter={(e) => e.target.play().catch(() => {})}
              onMouseLeave={(e) => {
                e.target.pause();
                e.target.currentTime = 0;
              }}
            />
          )
        ) : (
          <img
            src={item.thumbnailUrl}
            alt={item.title}
            draggable="false"
            data-protected-media="true"
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none pointer-events-none"
            loading="lazy"
          />
        )}

        {/* Ambient Dark Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d14] via-black/10 to-black/30 pointer-events-none" />

        {/* Play Icon Overlay - Perfectly Centered */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#dfba73] shadow-xl group-hover:scale-110 group-hover:bg-[#dfba73] group-hover:text-black transition-all duration-300">
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono-tag font-semibold tracking-wider backdrop-blur-md flex items-center gap-1.5 border shadow-sm ${
              isVertical
                ? 'bg-[#22080d]/90 text-[#fca5a5] border-[#54121c]'
                : 'bg-black/85 text-[#dfba73] border-white/10'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isVertical ? 'bg-rose-400' : 'bg-[#dfba73]'}`} />
              <span>{isVertical ? '9:16 Reel' : 'Cinema 16:9'}</span>
            </span>
            {item.isCustom && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono-tag uppercase tracking-wider bg-[#3b0a11]/80 text-[#fca5a5] border border-[#54121c]">
                Custom
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 bg-black/85 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 text-slate-300 font-mono-tag text-[10px] shadow-sm">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{item.duration || '01:00'}</span>
          </div>
        </div>
      </div>

      {/* Card Body Details - Uniform Heights & Alignment */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-[#0a0d14] border-t border-white/[0.06]">
        <div>
          <div className="flex items-center justify-between text-[10px] font-mono-tag text-slate-400 uppercase tracking-widest">
            <span className="text-[#dfba73] font-medium">{item.subCategory}</span>
            <span>{item.year || '2026'}</span>
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-[#dfba73] transition-colors mt-1 font-cinzel line-clamp-1 h-6">
            {item.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed font-light min-h-[2.5rem]">
            {item.description}
          </p>
        </div>

        {/* Client & Software Tags */}
        <div className="space-y-2 pt-2.5 border-t border-white/[0.06]">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Client: <strong className="text-slate-200 font-medium">{item.client || 'Creative Reel'}</strong></span>
            <span className="font-mono-tag text-[10px] text-slate-500">{item.resolution || '4K Master'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-1">
            {(item.software || ['Premiere Pro', 'DaVinci']).map((sw, i) => (
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
            onClick={() => onPlay(item)}
            className="flex items-center gap-1 text-xs font-semibold text-[#dfba73] hover:text-[#f3e7c4] transition cursor-pointer"
          >
            <span>Watch Cut</span>
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
                  title="Edit video project"
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
