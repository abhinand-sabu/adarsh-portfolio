import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, Download, Sparkles, Layers, Image as ImageIcon, Check } from 'lucide-react';
import { exportArtworkAsPng } from '../utils/mediaUtils';

export default function PosterModal({ poster, onClose }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [downloading, setDownloading] = useState(false);

  if (!poster) return null;

  const handleZoom = (level) => {
    setZoomLevel(level);
  };

  const handleDownload = async () => {
    setDownloading(true);
    const cleanTitle = poster.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    try {
      await exportArtworkAsPng(poster.imageUrl || poster.thumbnailUrl, `${cleanTitle}.png`);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl bg-[#090e21] border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[96vh] sm:max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="px-4 sm:px-5 py-3 bg-black/70 border-b border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400 flex-shrink-0">
              <ImageIcon className="w-4 h-4" />
            </span>
            <div className="truncate">
              <span className="text-[10px] font-mono-tag uppercase tracking-wider text-sky-400 font-bold block truncate">
                {poster.subCategory || 'Key Art & Print'}
              </span>
              <h2 className="text-xs sm:text-base font-bold text-white truncate font-cinzel">
                {poster.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Zoom Controls - fully visible and tap-friendly on mobile */}
            <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-900/90 px-1.5 sm:px-2 py-1 rounded-xl border border-white/10">
              <button
                onClick={() => handleZoom(1)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono-tag cursor-pointer transition ${
                  zoomLevel === 1 ? 'bg-amber-400 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                1x
              </button>
              <button
                onClick={() => handleZoom(1.4)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono-tag cursor-pointer transition ${
                  zoomLevel === 1.4 ? 'bg-amber-400 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                1.4x
              </button>
              <button
                onClick={() => handleZoom(2)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono-tag cursor-pointer transition ${
                  zoomLevel === 2 ? 'bg-amber-400 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                2x
              </button>
            </div>

            {/* Export High-Res PNG Button */}
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 text-xs font-bold shadow transition cursor-pointer disabled:opacity-50"
              title="Export high-resolution artwork as PNG"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{downloading ? 'Exporting...' : 'Export PNG'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Poster Canvas Viewport with Scroll/Pan support at 1.4x and 2x */}
        <div className="relative bg-[#04060d] flex-1 min-h-[300px] max-h-[58vh] overflow-auto p-3 sm:p-8 flex items-center justify-center">
          <div 
            className="transition-all duration-300 m-auto flex items-center justify-center"
            style={{
              width: zoomLevel === 1 ? 'auto' : `${zoomLevel * 100}%`,
              maxWidth: zoomLevel === 1 ? '100%' : 'none',
            }}
          >
            <div className={`relative rounded-lg overflow-hidden shadow-2xl border-2 border-amber-400/40 transition-all duration-300 ${
              zoomLevel === 1 ? 'max-h-[48vh] sm:max-h-[52vh]' : zoomLevel === 1.4 ? 'max-h-[70vh]' : 'max-h-[90vh]'
            }`}>
              <img
                src={poster.imageUrl || poster.thumbnailUrl}
                alt={poster.title}
                className="w-auto h-full object-contain mx-auto"
              />
            </div>
          </div>
        </div>

        {/* Technical Specifications Section */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 bg-[#070b1a] border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            
            <div className="md:col-span-2 space-y-1.5">
              <h3 className="text-xs font-mono-tag tracking-wider text-amber-400 uppercase font-semibold">
                Design Concept &amp; Aesthetic
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {poster.description}
              </p>
            </div>

            <div className="space-y-2.5 bg-black/40 p-3 sm:p-3.5 rounded-xl border border-white/5 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] font-mono-tag block">PRINT DIMENSIONS</span>
                <span className="text-sky-300 font-bold">{poster.dimensions || '27" x 40" Full Bleed'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-mono-tag block">COLOR PROFILE &amp; RESOLUTION</span>
                <span className="text-amber-300 font-mono-tag font-bold">{poster.dpi || '300 DPI CMYK Ready'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-mono-tag block">DESIGN SUITE</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(poster.software || ['Photoshop', 'Illustrator']).map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
