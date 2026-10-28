import React, { useState, useEffect, useRef } from 'react';
import { X, Image as ImageIcon, Move } from 'lucide-react';

export default function PosterModal({ poster, onClose }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, startPanX: 0, startPanY: 0 });

  if (!poster) return null;

  const handleZoom = (level) => {
    setZoomLevel(level);
    if (level === 1) {
      setPan({ x: 0, y: 0 });
    }
  };

  const handleDoubleClick = () => {
    if (zoomLevel === 1) {
      handleZoom(2);
    } else {
      handleZoom(1);
    }
  };

  // Mouse drag handling when zoomed (1-to-1 screen pixel tracking)
  const handleMouseDown = (e) => {
    if (zoomLevel <= 1 || e.button !== 0) return;
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      // Allow panning up to full visual overflow with comfortable margin
      const maxPanX = Math.max(120, (window.innerWidth * (zoomLevel - 1)) * 0.7);
      const maxPanY = Math.max(200, (window.innerHeight * (zoomLevel - 1)) * 0.75);
      setPan({
        x: Math.max(-maxPanX, Math.min(maxPanX, dragStartRef.current.startPanX + dx)),
        y: Math.max(-maxPanY, Math.min(maxPanY, dragStartRef.current.startPanY + dy)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, zoomLevel]);

  // Touch drag handling for mobile devices
  const handleTouchStart = (e) => {
    if (zoomLevel <= 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
  };

  const handleTouchMove = (e) => {
    if (!isDragging || zoomLevel <= 1 || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    const maxPanX = Math.max(120, (window.innerWidth * (zoomLevel - 1)) * 0.7);
    const maxPanY = Math.max(200, (window.innerHeight * (zoomLevel - 1)) * 0.75);
    setPan({
      x: Math.max(-maxPanX, Math.min(maxPanX, dragStartRef.current.startPanX + dx)),
      y: Math.max(-maxPanY, Math.min(maxPanY, dragStartRef.current.startPanY + dy)),
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Mouse wheel pan when zoomed in
  const handleWheel = (e) => {
    if (zoomLevel > 1) {
      e.preventDefault();
      const maxPanX = Math.max(120, (window.innerWidth * (zoomLevel - 1)) * 0.7);
      const maxPanY = Math.max(200, (window.innerHeight * (zoomLevel - 1)) * 0.75);
      setPan((prev) => ({
        x: Math.max(-maxPanX, Math.min(maxPanX, prev.x - e.deltaX)),
        y: Math.max(-maxPanY, Math.min(maxPanY, prev.y - e.deltaY)),
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fadeIn">
      {/* Click backdrop to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl bg-[#0a0d14] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[96vh] sm:max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-black/60 border-b border-white/[0.08] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-1.5 rounded-lg bg-white/[0.04] text-[#dfba73] flex-shrink-0 border border-white/10">
              <ImageIcon className="w-4 h-4" />
            </span>
            <div className="truncate">
              <span className="text-[10px] font-mono-tag uppercase tracking-widest text-[#dfba73] font-medium block truncate">
                {poster.subCategory || 'Key Art & Print'}
              </span>
              <h2 className="text-xs sm:text-base font-bold text-white truncate font-cinzel mt-0.5">
                {poster.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Zoom Controls */}
            <div className="flex items-center gap-0.5 bg-white/[0.04] px-1.5 py-1 rounded-xl border border-white/10">
              <button
                onClick={() => handleZoom(1)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono-tag cursor-pointer transition ${
                  zoomLevel === 1 ? 'bg-white text-black font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                1x
              </button>
              <button
                onClick={() => handleZoom(1.4)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono-tag cursor-pointer transition ${
                  zoomLevel === 1.4 ? 'bg-white text-black font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                1.4x
              </button>
              <button
                onClick={() => handleZoom(2)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono-tag cursor-pointer transition ${
                  zoomLevel === 2 ? 'bg-white text-black font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                2x
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 min-h-0 flex flex-col">
          {/* Poster Canvas Viewport: flex-shrink-0 ensures naturally fitted height is never squashed */}
          <div 
            className={`relative bg-[#05070c] p-3 sm:p-6 flex items-center justify-center flex-shrink-0 select-none overflow-hidden ${
              zoomLevel > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
            }`}
            onContextMenu={(e) => e.preventDefault()}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
            onDoubleClick={handleDoubleClick}
          >
            {/* Smooth Zoom and Pan Viewport */}
            <div 
              className="m-auto flex items-center justify-center transition-transform select-none"
              style={{
                transform: zoomLevel === 1 
                  ? 'none' 
                  : `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div 
                className="relative rounded-xl overflow-hidden shadow-2xl border border-white/15 bg-black/40 flex items-center justify-center max-w-full"
                data-protected-media="true"
              >
                <img
                  src={poster.imageUrl || poster.thumbnailUrl}
                  alt={poster.title}
                  draggable="false"
                  onContextMenu={(e) => e.preventDefault()}
                  className="object-contain w-auto h-auto max-h-[75vh] sm:max-h-[80vh] max-w-full mx-auto select-none pointer-events-none block"
                />
                {/* Transparent protective shield overlay preventing right-click or drag on image */}
                <div 
                  className="absolute inset-0 z-10 select-none bg-transparent"
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            </div>

            {/* Subtle Pan Hint when zoomed */}
            {zoomLevel > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-mono-tag text-[#dfba73] shadow-lg animate-fadeIn">
                <Move className="w-3 h-3 animate-pulse" />
                <span>Drag to pan artwork</span>
              </div>
            )}
          </div>

          {/* Technical Specifications Section */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#0a0d14] border-t border-white/[0.08]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="md:col-span-2 space-y-1.5">
                <h3 className="text-xs font-mono-tag tracking-widest text-[#dfba73] uppercase font-semibold">
                  Design Concept &amp; Typography
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  {poster.description}
                </p>
              </div>

              <div className="space-y-2 bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.06] text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] font-mono-tag block tracking-wider uppercase">PRINT DIMENSIONS</span>
                  <span className="text-slate-200 font-medium">{poster.dimensions || '27" x 40" Full Bleed'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] font-mono-tag block tracking-wider uppercase">COLOR PROFILE &amp; RESOLUTION</span>
                  <span className="text-[#dfba73] font-mono-tag">{poster.dpi || '300 DPI CMYK Ready'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] font-mono-tag block tracking-wider uppercase">DESIGN SUITE</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(poster.software || ['Photoshop', 'Illustrator']).map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] text-slate-300 border border-white/[0.06]">
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
    </div>
  );
}
