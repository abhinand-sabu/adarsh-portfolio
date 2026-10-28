import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Sparkles, Tag, Film, CheckCircle2 } from 'lucide-react';

export default function VideoModal({ video, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(25);
  const videoRef = useRef(null);

  // If mock video without actual video stream, simulate timeline scrubbing
  useEffect(() => {
    let interval;
    if (isPlaying && (!video?.videoUrl || !video.videoUrl.startsWith('data:video'))) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying, video]);

  if (!video) return null;

  const hasActualVideo = video.videoUrl && video.videoUrl.startsWith('data:video');

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
      {/* Modal Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container */}
      <div className="relative w-full max-w-4xl bg-[#090e21] border border-amber-500/30 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Top Header Bar */}
        <div className="px-5 py-3.5 bg-black/50 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <Film className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-mono-tag uppercase tracking-wider text-amber-400 font-bold">
                {video.subCategory || 'Cinematic Cut'}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                {video.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theater Player Area */}
        <div className="relative bg-black flex items-center justify-center overflow-hidden aspect-video max-h-[50vh] sm:max-h-[58vh]">
          {hasActualVideo ? (
            <video
              ref={videoRef}
              src={video.videoUrl}
              className="w-full h-full object-contain"
              autoPlay
              controls
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-contain filter brightness-90"
              />

              {/* Simulated Ambient HUD overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/40 flex flex-col justify-between p-4 sm:p-6">
                
                {/* HUD Top info */}
                <div className="flex items-center justify-between text-xs font-mono-tag">
                  <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded-md border border-white/10 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>PRORES 4444 // 4K 60FPS</span>
                  </div>
                  <div className="bg-black/60 px-3 py-1 rounded-md border border-white/10 text-amber-300">
                    TIMECODE: 00:01:24:18
                  </div>
                </div>

                {/* Simulated Center indicator if paused */}
                {!isPlaying && (
                  <div className="self-center p-4 rounded-full bg-amber-400/90 text-slate-950 shadow-2xl">
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </div>
                )}

                {/* HUD Bottom Player Controls */}
                <div className="space-y-2 pointer-events-auto bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  {/* Progress scrubber bar */}
                  <div 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickPos = (e.clientX - rect.left) / rect.width;
                      setProgress(Math.round(clickPos * 100));
                    }}
                    className="relative w-full h-2 bg-slate-800 rounded-full cursor-pointer overflow-hidden group"
                  >
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-rose-500 via-amber-400 to-sky-400 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={togglePlay} 
                        className="text-white hover:text-amber-400 transition cursor-pointer"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      </button>
                      <button 
                        onClick={toggleMute} 
                        className="text-slate-300 hover:text-white transition cursor-pointer"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <span className="font-mono-tag text-slate-400 text-[11px]">
                        {video.duration || '01:45'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono-tag text-slate-400">
                      <span>DaVinci Color Match Active</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Project Breakdown & Metadata Section */}
        <div className="p-5 overflow-y-auto space-y-4 bg-[#070b1a]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-xs font-mono-tag tracking-wider text-amber-400 uppercase font-semibold">
                Project Narrative &amp; Technique
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {video.description}
              </p>
            </div>

            <div className="space-y-3 bg-black/40 p-3.5 rounded-xl border border-white/5 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] font-mono-tag block">CLIENT</span>
                <span className="text-slate-200 font-medium">{video.client || 'Creative Showcase'}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-mono-tag block">DELIVERY SPECS</span>
                <span className="text-amber-300 font-mono-tag font-bold">{video.resolution || '4K Master'} ({video.aspectRatio})</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-mono-tag block">SOFTWARE WORKFLOW</span>
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
