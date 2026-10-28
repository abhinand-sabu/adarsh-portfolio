import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Film, Image as ImageIcon, Check, AlertCircle, Loader2, Link as LinkIcon, Edit3 } from 'lucide-react';
import { readFileAsDataURL } from '../utils/db';
import { captureVideoThumbnail, resizeImageFile, parseVideoUrl } from '../utils/mediaUtils';
import { createVideoThumbSvgDataUri } from '../data/defaultPortfolio';

export default function UploadModal({ 
  isOpen, 
  onClose, 
  onUploadSuccess, 
  onUpdateSuccess,
  editItem = null,
  defaultCategory = 'video' 
}) {
  const isEditing = Boolean(editItem);

  const [category, setCategory] = useState(defaultCategory === 'poster' ? 'Poster Designing' : 'Video Editing');
  const [title, setTitle] = useState('');
  const [subCategory, setSubCategory] = useState('Gym & Fitness');
  const [aspectRatio, setAspectRatio] = useState(defaultCategory === 'poster' ? '4:5' : '16:9');
  const [client, setClient] = useState('');
  const [year, setYear] = useState('2026');
  const [duration, setDuration] = useState('01:30');
  const [dimensions, setDimensions] = useState('27" x 40"');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [selectedSoftware, setSelectedSoftware] = useState(
    defaultCategory === 'poster' ? ['Canva', 'Photoshop'] : ['Premiere Pro', 'DaVinci Resolve']
  );

  // Media states
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDataUrl, setFileDataUrl] = useState(null);
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [isProcessingMedia, setIsProcessingMedia] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef(null);
  const videoObjectUrlRef = useRef(null);

  // Clean up any generated video object URL on unmount
  useEffect(() => {
    return () => {
      if (videoObjectUrlRef.current) {
        URL.revokeObjectURL(videoObjectUrlRef.current);
        videoObjectUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        const isVid = editItem.type === 'video' || (editItem.category && editItem.category.includes('Video'));
        setCategory(editItem.category || (isVid ? 'Video Editing' : 'Poster Designing'));
        setAspectRatio(editItem.aspectRatio || (isVid ? '16:9' : '4:5'));
        setSubCategory(editItem.subCategory || 'Gym & Fitness');
        setSelectedSoftware(Array.isArray(editItem.software) && editItem.software.length > 0
          ? editItem.software 
          : (isVid ? ['DaVinci Resolve', 'CapCut'] : ['Canva', 'Photoshop'])
        );
        setTitle(editItem.title || '');
        setClient(editItem.client || '');
        setYear(editItem.year || '2026');
        setDuration(editItem.duration || '01:30');
        setDimensions(editItem.dimensions || '27" x 40"');
        setDescription(editItem.description || '');
        setVideoUrl(editItem.videoUrl || '');
        setFileDataUrl(editItem.imageUrl || editItem.videoUrl || null);
        setThumbnailDataUrl(editItem.thumbnailUrl || null);
        setSelectedFile(null);
        setFileName(editItem.title || '');
        const isDirectVid = isVid && (editItem.videoUrl && (
          editItem.videoUrl.startsWith('data:video') || 
          editItem.videoUrl.startsWith('blob:') || 
          editItem.videoUrl.endsWith('.mp4') || 
          editItem.videoUrl.endsWith('.webm')
        ));
        setFileType(isDirectVid ? 'video/mp4' : 'image/png');
        setErrorMsg('');
      } else {
        const isPost = defaultCategory === 'poster';
        setCategory(isPost ? 'Poster Designing' : 'Video Editing');
        setAspectRatio(isPost ? '4:5' : '16:9');
        setSubCategory('Gym & Fitness');
        setSelectedSoftware(isPost ? ['Canva', 'Photoshop'] : ['Premiere Pro', 'DaVinci Resolve']);
        setTitle('');
        setClient('');
        setYear('2026');
        setDuration('01:30');
        setDimensions('27" x 40"');
        setDescription('');
        setVideoUrl('');
        setFileDataUrl(null);
        setThumbnailDataUrl(null);
        setSelectedFile(null);
        setFileName('');
        setFileType('');
        setErrorMsg('');
      }
    }
  }, [isOpen, defaultCategory, editItem]);

  if (!isOpen) return null;

  const isVideo = category === 'Video Editing';

  const videoSubCats = ['Gym & Fitness', 'Creator & YouTube', 'Brand & Promo', 'Event & Music'];
  const posterSubCats = ['Gym & Fitness', 'Event Flyers', 'Thumbnails & Social', 'Social Media Graphics', 'Brand & Merch'];

  const availableSoftware = isVideo 
    ? ['DaVinci Resolve', 'CapCut', 'Canva', 'AI Workflow', 'Premiere Pro', 'After Effects']
    : ['Canva', 'Photoshop', 'Illustrator', 'AI Workflow', 'InDesign', 'Lightroom'];

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    if (newCat === 'Video Editing') {
      setAspectRatio('16:9');
      setSubCategory('Gym & Fitness');
      setSelectedSoftware(['DaVinci Resolve', 'CapCut']);
    } else {
      setAspectRatio('4:5');
      setSubCategory('Gym & Fitness');
      setSelectedSoftware(['Canva', 'Photoshop']);
    }
  };

  const handleVideoUrlChange = (e) => {
    const val = e.target.value;
    setVideoUrl(val);
    setErrorMsg('');

    // If YouTube URL, auto populate thumbnail preview if none selected
    const parsed = parseVideoUrl(val);
    if (parsed?.defaultThumb && !thumbnailDataUrl) {
      setThumbnailDataUrl(parsed.defaultThumb);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Direct upload limit extended up to 500MB
    const sizeInMb = file.size / (1024 * 1024);
    if (sizeInMb > 500) {
      setErrorMsg(`File size is ${sizeInMb.toFixed(1)}MB, which exceeds the 500MB upload limit. For large 4K files, consider pasting a YouTube, Vimeo, or Google Drive URL below.`);
      return;
    }

    setErrorMsg('');
    setSelectedFile(file);
    setFileName(file.name);
    setFileType(file.type);
    setIsProcessingMedia(true);

    try {
      // If it's a video file, use memory-safe object URL for instant preview without base64 bloat
      if (file.type.startsWith('video/')) {
        if (videoObjectUrlRef.current) {
          URL.revokeObjectURL(videoObjectUrlRef.current);
          videoObjectUrlRef.current = null;
        }
        const objUrl = URL.createObjectURL(file);
        videoObjectUrlRef.current = objUrl;
        setFileDataUrl(objUrl);

        const videoThumb = await captureVideoThumbnail(file, 0.5);
        if (videoThumb) {
          setThumbnailDataUrl(videoThumb);
        } else {
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          const fallback = createVideoThumbSvgDataUri(cleanName.toUpperCase(), duration || '01:30', subCategory, '#111827', '#dfba73');
          setThumbnailDataUrl(fallback);
        }
      } else if (file.type.startsWith('image/')) {
        const imgThumb = await resizeImageFile(file, 800, 1100, 0.85);
        setThumbnailDataUrl(imgThumb);
        if (!isVideo) {
          const dataUrl = await readFileAsDataURL(file);
          setFileDataUrl(dataUrl);
        }
      } else {
        const dataUrl = await readFileAsDataURL(file);
        setFileDataUrl(dataUrl);
        setThumbnailDataUrl(dataUrl);
      }

      // Auto-populate title if empty
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    } catch {
      setErrorMsg('Failed to process the selected media file. Please try another file.');
    } finally {
      setIsProcessingMedia(false);
    }
  };

  const toggleSoftware = (sw) => {
    if (selectedSoftware.includes(sw)) {
      setSelectedSoftware(selectedSoftware.filter((s) => s !== sw));
    } else {
      setSelectedSoftware([...selectedSoftware, sw]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a project title');
      return;
    }

    const isVid = category === 'Video Editing';
    const effectiveVideoUrl = videoUrl.trim() || (isVid && selectedFile && selectedFile.type.startsWith('video/') ? fileDataUrl : null) || (isEditing ? editItem?.videoUrl : null);
    const hasMedia = fileDataUrl || effectiveVideoUrl || thumbnailDataUrl || (editItem && (editItem.thumbnailUrl || editItem.imageUrl || editItem.videoUrl));

    if (!hasMedia) {
      setErrorMsg(isVid ? 'Please select a media file or paste a Video URL.' : 'Please select an image file to showcase.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      // Ensure we have a thumbnail
      let finalThumb = thumbnailDataUrl;
      if (!finalThumb) {
        if (editItem?.thumbnailUrl) {
          finalThumb = editItem.thumbnailUrl;
        } else if (isVid) {
          finalThumb = createVideoThumbSvgDataUri(title.trim(), duration || '01:30', subCategory, '#111827', '#dfba73');
        } else {
          finalThumb = fileDataUrl;
        }
      }

      if (isEditing && editItem) {
        const updatedFields = {
          ...editItem,
          id: editItem.id,
          type: isVid ? 'video' : 'poster',
          title: title.trim(),
          category,
          subCategory: subCategory || (isVid ? 'Gym & Fitness' : 'Event Flyers'),
          aspectRatio,
          duration: isVid ? duration : undefined,
          dimensions: !isVid ? dimensions : undefined,
          dpi: !isVid ? '300 DPI High-Res' : undefined,
          resolution: isVid ? (aspectRatio === '9:16' ? '4K Vertical' : '4K UHD') : undefined,
          software: selectedSoftware,
          client: client.trim() || 'Custom Commission',
          year: year || '2026',
          description: description.trim() || `Showcase ${isVid ? 'video cut' : 'poster artwork'} created by Adarsh.`,
          thumbnailUrl: finalThumb,
          verticalThumbUrl: isVid && aspectRatio === '9:16' ? (finalThumb || editItem.verticalThumbUrl) : null,
          videoUrl: isVid ? effectiveVideoUrl : null,
          imageUrl: !isVid ? (fileDataUrl || editItem.imageUrl) : null,
          mediaFile: selectedFile || null,
          accent: isVid ? 'gold' : 'silver',
        };

        if (onUpdateSuccess) {
          await onUpdateSuccess(editItem.id, updatedFields);
        }
        onClose();
      } else {
        const newItem = {
          id: `custom-${Date.now()}`,
          type: isVid ? 'video' : 'poster',
          title: title.trim(),
          category,
          subCategory: subCategory || (isVid ? 'Gym & Fitness' : 'Event Flyers'),
          aspectRatio,
          duration: isVid ? duration : undefined,
          dimensions: !isVid ? dimensions : undefined,
          dpi: !isVid ? '300 DPI High-Res' : undefined,
          resolution: isVid ? (aspectRatio === '9:16' ? '4K Vertical' : '4K UHD') : undefined,
          software: selectedSoftware,
          client: client.trim() || 'Custom Commission',
          year: year || '2026',
          description: description.trim() || `Showcase ${isVid ? 'video cut' : 'poster artwork'} created by Adarsh.`,
          thumbnailUrl: finalThumb,
          verticalThumbUrl: isVid && aspectRatio === '9:16' ? finalThumb : null,
          videoUrl: isVid ? effectiveVideoUrl : null,
          imageUrl: !isVid ? fileDataUrl : null,
          mediaFile: selectedFile,
          isCustom: true,
          createdAt: new Date().toISOString(),
          accent: isVid ? 'gold' : 'silver',
        };

        await onUploadSuccess(newItem);
        onClose();
      }
    } catch {
      setErrorMsg('Failed to save project to portfolio. If file is very large, try a YouTube or Drive URL.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#0a0d14] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-black/60 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/[0.04] text-[#dfba73] border border-white/10">
              {isEditing ? <Edit3 className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-cinzel">
                {isEditing ? 'Edit Portfolio Artwork' : 'Upload Portfolio Artwork'}
              </h2>
              <p className="text-xs text-slate-400 font-light">
                {isEditing 
                  ? 'Update project details, media links, and metadata' 
                  : 'Directly showcase new video cuts, reels, or poster key art'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-5 flex-1">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Category Switcher */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono-tag uppercase tracking-wider text-slate-400">
              Target Discipline
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleCategoryChange('Video Editing')}
                className={`flex items-center justify-center gap-2.5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold border transition cursor-pointer ${
                  category === 'Video Editing'
                    ? 'bg-[#3b0a11]/40 border-[#54121c] text-[#fca5a5] shadow-md'
                    : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Video Editing Suite</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('Poster Designing')}
                className={`flex items-center justify-center gap-2.5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold border transition cursor-pointer ${
                  category === 'Poster Designing'
                    ? 'bg-[#081224]/70 border-[#1e293b] text-[#93c5fd] shadow-md'
                    : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Poster Design Gallery</span>
              </button>
            </div>
          </div>

          {/* 2. Video URL Input (For Videos - solves upload ceiling) */}
          {isVideo && (
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
              <label className="text-[11px] font-mono-tag uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-[#dfba73]" />
                  <span>Video URL (YouTube, Vimeo, Google Drive, or Direct MP4)</span>
                </span>
                <span className="text-[10px] text-[#dfba73] font-mono-tag">Supports 4K / Any Size</span>
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={handleVideoUrlChange}
                placeholder="https://www.youtube.com/watch?v=... or Google Drive / MP4 link"
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#dfba73]/60 transition"
              />
              <p className="text-[10px] text-slate-500 font-mono-tag">
                Paste a video link or upload a file directly below (up to 500MB).
              </p>
            </div>
          )}

          {/* 3. Drag & Drop File Upload Zone */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono-tag uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Media File ({isVideo ? 'Video MP4/WEBM or Custom Thumbnail' : 'High-Res Poster PNG/JPG/SVG'})</span>
              <span className="text-[10px] text-slate-500">Up to 500MB limit</span>
            </label>
            
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group relative border-2 border-dashed border-white/15 hover:border-[#dfba73]/60 rounded-2xl p-4 sm:p-5 text-center bg-white/[0.01] hover:bg-white/[0.03] transition cursor-pointer flex flex-col items-center justify-center min-h-[130px]"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={isVideo ? 'video/*,image/*' : 'image/*'}
                onChange={handleFileSelect}
                className="hidden"
              />

              {isProcessingMedia ? (
                <div className="flex flex-col items-center space-y-2 py-4">
                  <Loader2 className="w-7 h-7 text-[#dfba73] animate-spin" />
                  <span className="text-xs font-mono-tag text-slate-300">Processing media &amp; preparing preview...</span>
                </div>
              ) : (selectedFile || thumbnailDataUrl || (fileDataUrl && fileType.startsWith('video/'))) ? (
                <div className="flex flex-col items-center space-y-2">
                  {((selectedFile && selectedFile.type.startsWith('video/')) || (fileDataUrl && (fileDataUrl.startsWith('data:video') || fileDataUrl.startsWith('blob:') || fileDataUrl.endsWith('.mp4') || fileDataUrl.endsWith('.webm')))) ? (
                    <video
                      src={fileDataUrl}
                      className="max-h-32 rounded-lg shadow-lg border border-white/20 select-none"
                      muted
                      controls
                      controlsList="nodownload"
                      disablePictureInPicture
                      draggable="false"
                      onContextMenu={(e) => e.preventDefault()}
                    />
                  ) : (
                    <img
                      src={thumbnailDataUrl || fileDataUrl}
                      alt="Preview"
                      draggable="false"
                      onContextMenu={(e) => e.preventDefault()}
                      className="max-h-32 rounded-lg object-contain shadow-lg border border-white/20 select-none pointer-events-none"
                    />
                  )}
                  <span className="text-xs font-mono-tag text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {fileName || (selectedFile ? selectedFile.name : 'Media attached')} (Click to change file)
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/10 text-[#dfba73] mx-auto flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-slate-200">
                      Select or drop media file here
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isVideo ? 'Supports 4K masters, 9:16 reels, MP4, WEBM (up to 500MB)' : 'Supports 300 DPI one-sheets, PNG, JPG, WEBP'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 4. Title & SubCategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-mono-tag uppercase tracking-wider text-slate-400">
                Project Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isVideo ? "e.g. CYBERPUNK 2099 TRAILER" : "e.g. DUNE KEY ART POSTER"}
                required
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#dfba73]/60 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono-tag uppercase tracking-wider text-slate-400">
                SubCategory
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#0a0d14] border border-white/10 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#dfba73]/60 cursor-pointer"
              >
                {(isVideo ? videoSubCats : posterSubCats).map((sc) => (
                  <option key={sc} value={sc}>{sc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Aspect Ratio & Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-mono-tag uppercase tracking-wider text-slate-400">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0a0d14] border border-white/10 text-xs text-slate-100 focus:outline-none focus:border-[#dfba73]/60 cursor-pointer"
              >
                {isVideo ? (
                  <>
                    <option value="16:9">16:9 Cinema Landscape</option>
                    <option value="9:16">9:16 Vertical Reel (Instagram/TikTok)</option>
                    <option value="4:5">4:5 Feed Format</option>
                  </>
                ) : (
                  <>
                    <option value="4:5">4:5 Cinema Poster</option>
                    <option value="1:1">1:1 Square Art</option>
                    <option value="16:9">16:9 Landscape Banner</option>
                  </>
                )}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono-tag uppercase tracking-wider text-slate-400">
                Client / Commission
              </label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="e.g. Iron Vault Gym, Local Cafe, Tech Creator"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#dfba73]/60"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono-tag uppercase tracking-wider text-slate-400">
                {isVideo ? 'Duration' : 'Dimensions'}
              </label>
              <input
                type="text"
                value={isVideo ? duration : dimensions}
                onChange={(e) => isVideo ? setDuration(e.target.value) : setDimensions(e.target.value)}
                placeholder={isVideo ? "01:45" : "27\" x 40\""}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#dfba73]/60"
              />
            </div>
          </div>

          {/* 6. Software Stack Chips */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-mono-tag uppercase tracking-wider text-slate-400">
              Software Stack
            </label>
            <div className="flex flex-wrap gap-2">
              {availableSoftware.map((sw) => {
                const isSelected = selectedSoftware.includes(sw);
                return (
                  <button
                    key={sw}
                    type="button"
                    onClick={() => toggleSoftware(sw)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono-tag transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#dfba73]/20 text-[#dfba73] border border-[#dfba73]/50 font-semibold'
                        : 'bg-white/[0.03] border border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {sw}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 7. Description */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono-tag uppercase tracking-wider text-slate-400">
              Project Description &amp; Techniques
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your creative concept, color grading, sound design, typography, or visual rhythm..."
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#dfba73]/60"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-white/[0.04] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isProcessingMedia}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-black bg-[#c5a059] hover:bg-[#dfba73] shadow-md shadow-black/50 transition cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? (isEditing ? 'Saving...' : 'Publishing...') : (isEditing ? 'Save Changes' : 'Publish Artwork')}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
