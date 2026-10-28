import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Sparkles, Tag, Film, Download } from 'lucide-react';
import { formatTimecode, exportArtworkAsPng } from '../utils/mediaUtils';

export default function VideoModal({ video, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(20);
  const videoRef = useRef(null);

  const isVertical = video?.aspectRatio === '9:16';
  const hasActualVideo = video?.videoUrl && (
    video.videoUrl.startsWith('data:video') || 
    video.videoUrl.startsWith('blob:') || 
    video.videoUrl.endsWith('.mp4') ||
    video.videoUrl.endsWith('.webm')
  );

  // If mock video without actual video stream, simulate timeline playback & audio wave motion
  useEffect(() => {
    let interval;
    if (isPlaying && !hasActualVideo) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isPlaying, hasActualVideo]);

  if (!video) return null;

  const currentTimecode = formatTimecode(video.duration || '01:45', progress);

  const togglePlay = () => {
    if (hasActualVideo && videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (hasActualVideo && videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  const handleDownload = () => {
    if (video.videoUrl && hasActualVideo) {
      const link = document.createElement('a');
      link.href = video.videoUrl;
      link.download = `${video.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.mp4`;
      link.click();
    } else {
      exportArtworkAsPng(video.thumbnailUrl, `${video.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-cover.png`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn">
      {/* Modal Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container: dynamically scales width based on 16:9 vs 9:16 vertical layout */}
      <div className={`relative w-full ${isVertical ? 'max-w-md' : 'max-w-4xl'} bg-[#090e21] border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[96vh] sm:max-h-[92vh]`}>
        
        {/* Top Header Bar */}
        <div className="px-4 sm:px-5 py-3 bg-black/70 border-b border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 flex-shrink-0">
              <Film className="w-4 h-4" />
            </span>
            <div className="truncate">
              <span className="text-[10px] font-mono-tag uppercase tracking-wider text-amber-400 font-bold block truncate">
                {video.subCategory || 'Cinematic Cut'} {isVertical ? '• 9:16 Reel' : '• 16:9 Cinema'}
              </span>
              <h2 className="text-xs sm:text-base font-bold text-white truncate">
                {video.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition cursor-pointer"
              title={hasActualVideo ? "Download Video Master" : "Export Keyframe Artwork"}
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden xs:inline">{hasActualVideo ? 'Save Cut' : 'Save Cover'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Theater Player Area: adapts naturally to 16:9 Cinema or 9:16 Vertical Reel */}
        <div className={`relative bg-black flex items-center justify-center overflow-hidden ${
          isVertical ? 'aspect-[9/15] max-h-[58vh] sm:max-h-[62vh] mx-auto w-auto' : 'aspect-video max-h-[46vh] sm:max-h-[56vh] w-full'
        }`}>
          {hasActualVideo ? (
            <video
              ref={videoRef}
              src={video.videoUrl}
              className="w-full h-full object-contain"
              autoPlay
              controls
              playsInline
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-contain filter brightness-95"
              />

              {/* Simulated Ambient HUD overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-transparent to-black/50 flex flex-col justify-between p-3 sm:p-5">
                
                {/* HUD Top info with dynamic specs */}
                <div className="flex items-center justify-between text-[11px] font-mono-tag">
                  <div className="flex items-center gap-1.5 bg-black/70 px-2.5 py-1 rounded-md border border-white/10 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{video.resolution || '4K 60FPS'}</span>
                  </div>
                  <div className="bg-black/70 px-2.5 py-1 rounded-md border border-white/10 text-amber-300 font-bold">
                    TC: {currentTimecode}
                  </div>
                </div>

                {/* Simulated Center indicator if paused */}
                {!isPlaying && (
                  <div className="self-center p-3.5 sm:p-4 rounded-full bg-amber-400/90 text-slate-950 shadow-2xl">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                  </div>
                )}

                {/* HUD Bottom Player Controls */}
                <div className="space-y-1.5 pointer-events-auto bg-black/75 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-white/10">
                  {/* Progress scrubber bar */}
                  <div 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickPos = (e.clientX - rect.left) / rect.width;
                      setProgress(Math.round(Math.max(0, Math.min(100, clickPos * 100))));
                    }}
                    className="relative w-full h-2 bg-slate-800 rounded-full cursor-pointer overflow-hidden group"
                  >
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-rose-500 via-amber-400 to-sky-400 rounded-full transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-0.5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <button 
                        onClick={togglePlay} 
                        className="text-white hover:text-amber-400 transition cursor-pointer p-1"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      </button>
                      <button 
                        onClick={toggleMute} 
                        className="text-slate-300 hover:text-white transition cursor-pointer p-1"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <span className="font-mono-tag text-slate-400 text-[11px]">
                        {video.duration || '01:45'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono-tag text-slate-400">
                      <span className="hidden xs:inline">Rhythm Edit Sync</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Project Breakdown & Metadata Section */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 bg-[#070b1a] border-t border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            
            <div className="md:col-span-2 space-y-1.5">
              <h3 className="text-xs font-mono-tag tracking-wider text-amber-400 uppercase font-semibold">
                Project Narrative &amp; Cut Techniques
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {video.description}
              </p>
            </div>

            <div className="space-y-2.5 bg-black/40 p-3 sm:p-3.5 rounded-xl border border-white/5 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] font-mono-tag block">CLIENT</span>
                <span className="text-slate-200 font-medium">{video.client || 'Creative Showcase'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-mono-tag block">DELIVERY SPECS</span>
                <span className="text-amber-300 font-mono-tag font-bold">{video.resolution || '4K Master'} ({video.aspectRatio})</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-mono-tag block">EDITING &amp; COLOR WORKFLOW</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(video.software || ['Premiere Pro', 'DaVinci Resolve']).map((s, idx) => (
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
