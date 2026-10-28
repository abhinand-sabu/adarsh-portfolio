import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Film } from 'lucide-react';
import { formatTimecode, parseVideoUrl } from '../utils/mediaUtils';

export default function VideoModal({ video, onClose }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(25);
  const videoRef = useRef(null);

  const isVertical = video?.aspectRatio === '9:16';
  const parsedVideo = parseVideoUrl(video?.videoUrl);
  const hasDirectVideo = parsedVideo?.platform === 'direct' || (
    video?.videoUrl && (
      video.videoUrl.startsWith('data:video') || 
      video.videoUrl.startsWith('blob:') || 
      video.videoUrl.endsWith('.mp4') ||
      video.videoUrl.endsWith('.webm')
    )
  );
  const hasEmbedVideo = Boolean(parsedVideo?.embedUrl);

  // If mock video without actual video stream, simulate timeline playback
  useEffect(() => {
    let interval;
    if (isPlaying && !hasDirectVideo && !hasEmbedVideo) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isPlaying, hasDirectVideo, hasEmbedVideo]);

  if (!video) return null;

  const currentTimecode = formatTimecode(video.duration || '01:45', progress);

  const togglePlay = () => {
    if (hasDirectVideo && videoRef.current) {
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
    if (hasDirectVideo && videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    } else {
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fadeIn">
      {/* Modal Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container: dynamically scales width based on 16:9 vs 9:16 vertical layout */}
      <div className={`relative w-full ${isVertical ? 'max-w-md' : 'max-w-4xl'} bg-[#0a0d14] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[96vh] sm:max-h-[92vh]`}>
        
        {/* Top Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-black/60 border-b border-white/[0.08] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="p-1.5 rounded-lg bg-white/[0.04] text-[#dfba73] flex-shrink-0 border border-white/10">
              <Film className="w-4 h-4" />
            </span>
            <div className="truncate">
              <span className="text-[10px] font-mono-tag uppercase tracking-widest text-[#dfba73] font-medium block truncate">
                {video.subCategory || 'Cinematic Cut'} {isVertical ? '• 9:16 Reel' : '• 16:9 Cinema'}
              </span>
              <h2 className="text-xs sm:text-base font-bold text-white truncate mt-0.5">
                {video.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Theater Player Area */}
        <div 
          data-protected-media="true"
          className={`relative bg-black flex items-center justify-center overflow-hidden ${
            isVertical ? 'aspect-[9/16] max-h-[62vh] mx-auto w-auto' : 'aspect-video max-h-[48vh] sm:max-h-[58vh] w-full'
          }`}
        >
          {hasEmbedVideo ? (
            <iframe
              src={parsedVideo.embedUrl}
              title={video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : hasDirectVideo ? (
            <video
              ref={videoRef}
              src={video.videoUrl}
              className="w-full h-full object-contain select-none"
              autoPlay
              controls
              controlsList="nodownload"
              disablePictureInPicture
              draggable="false"
              data-protected-media="true"
              onContextMenu={(e) => e.preventDefault()}
              playsInline
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center" data-protected-media="true">
              <img
                src={(isVertical && video.verticalThumbUrl) ? video.verticalThumbUrl : video.thumbnailUrl}
                alt={video.title}
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
                className={`w-full h-full ${isVertical ? 'object-cover' : 'object-contain'} filter brightness-95 select-none pointer-events-none`}
              />

              {/* Cinema HUD overlay */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-transparent to-black/50 flex flex-col justify-between p-3 sm:p-5">
                
                {/* HUD Top info */}
                <div className="flex items-center justify-between text-[11px] font-mono-tag">
                  <div className="flex items-center gap-1.5 bg-black/80 px-2.5 py-1 rounded-md border border-white/10 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{video.resolution || '4K 60FPS'}</span>
                  </div>
                  <div className="bg-black/80 px-2.5 py-1 rounded-md border border-white/10 text-[#dfba73] font-mono-tag">
                    TC: {currentTimecode}
                  </div>
                </div>

                {/* Simulated Center indicator if paused */}
                {!isPlaying && (
                  <div className="self-center p-3.5 sm:p-4 rounded-full bg-white/10 backdrop-blur-md text-[#dfba73] border border-white/20 shadow-2xl">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                  </div>
                )}

                {/* HUD Bottom Player Controls */}
                <div className="space-y-2 pointer-events-auto bg-[#0a0d14]/90 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-white/10">
                  {/* Progress scrubber bar with subtle champagne gradient */}
                  <div 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickPos = (e.clientX - rect.left) / rect.width;
                      setProgress(Math.round(Math.max(0, Math.min(100, clickPos * 100))));
                    }}
                    className="relative w-full h-1.5 bg-white/10 rounded-full cursor-pointer overflow-hidden group"
                  >
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-[#dfba73] rounded-full transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <button 
                        onClick={togglePlay} 
                        className="text-white hover:text-[#dfba73] transition cursor-pointer p-0.5"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      </button>
                      <button 
                        onClick={toggleMute} 
                        className="text-slate-400 hover:text-white transition cursor-pointer p-0.5"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <span className="font-mono-tag text-slate-400 text-[11px]">
                        {video.duration || '01:45'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-mono-tag text-slate-400">
                      <span>ProRes 4444</span>
                      <span className="text-slate-600">•</span>
                      <span>24 FPS MASTER</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Project Breakdown & Metadata Section */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 bg-[#0a0d14] border-t border-white/[0.08]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="md:col-span-2 space-y-1.5">
              <h3 className="text-xs font-mono-tag tracking-widest text-[#dfba73] uppercase font-semibold">
                Project Narrative &amp; Cut Techniques
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {video.description}
              </p>
            </div>

            <div className="space-y-2 bg-white/[0.02] p-3.5 rounded-xl border border-white/[0.06] text-xs">
              <div>
                <span className="text-slate-500 text-[10px] font-mono-tag block tracking-wider uppercase">CLIENT</span>
                <span className="text-slate-200 font-medium">{video.client || 'Creative Showcase'}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] font-mono-tag block tracking-wider uppercase">DELIVERY FORMAT</span>
                <span className="text-[#dfba73] font-mono-tag">{video.resolution || '4K Master'} ({video.aspectRatio})</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] font-mono-tag block tracking-wider uppercase">POST WORKFLOW</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(video.software || ['Premiere Pro', 'DaVinci Resolve']).map((s, idx) => (
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
  );
}
