import React, { useState, useRef } from 'react';
import { X, Upload, Film, Image as ImageIcon, Sparkles, Check, AlertCircle } from 'lucide-react';
import { readFileAsDataURL } from '../utils/db';

export default function UploadModal({ isOpen, onClose, onUploadSuccess, defaultCategory = 'video' }) {
  const [category, setCategory] = useState(defaultCategory === 'poster' ? 'Poster Designing' : 'Video Editing');
  const [title, setTitle] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [client, setClient] = useState('');
  const [year, setYear] = useState('2026');
  const [duration, setDuration] = useState('01:30');
  const [dimensions, setDimensions] = useState('27" x 40"');
  const [description, setDescription] = useState('');
  const [selectedSoftware, setSelectedSoftware] = useState(['Premiere Pro', 'DaVinci Resolve']);
  const [fileDataUrl, setFileDataUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const isVideo = category === 'Video Editing';

  const videoSubCats = ['Cinematic & Trailers', 'Reels & Commercials', 'Music Videos', 'Motion Graphics'];
  const posterSubCats = ['Movie & Key Art', 'Music & Festivals', 'Fashion & Editorial', 'Branding & Identity'];

  const availableSoftware = isVideo 
    ? ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Blender', 'CapCut Pro', 'Audition']
    : ['Photoshop', 'Illustrator', 'InDesign', 'Lightroom', 'Cinema 4D', 'Midjourney'];

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    if (newCat === 'Video Editing') {
      setAspectRatio('16:9');
      setSubCategory('Cinematic & Trailers');
      setSelectedSoftware(['Premiere Pro', 'DaVinci Resolve']);
    } else {
      setAspectRatio('4:5');
      setSubCategory('Movie & Key Art');
      setSelectedSoftware(['Photoshop', 'Illustrator']);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    setFileName(file.name);
    setFileType(file.type);

    try {
      const dataUrl = await readFileAsDataURL(file);
      setFileDataUrl(dataUrl);

      // Auto-populate title if empty
      if (!title) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    } catch (err) {
      console.error('File read error:', err);
      setErrorMsg('Failed to read the selected file. Please try another.');
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
    if (!fileDataUrl) {
      setErrorMsg('Please select a media file to showcase');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const isVid = category === 'Video Editing';
      const newItem = {
        id: `custom-${Date.now()}`,
        type: isVid ? 'video' : 'poster',
        title: title.trim(),
        category,
        subCategory: subCategory || (isVid ? 'Cinematic & Trailers' : 'Movie & Key Art'),
        aspectRatio,
        duration: isVid ? duration : undefined,
        dimensions: !isVid ? dimensions : undefined,
        dpi: !isVid ? '300 DPI High-Res' : undefined,
        resolution: isVid ? (aspectRatio === '9:16' ? '4K Vertical' : '4K UHD') : undefined,
        software: selectedSoftware,
        client: client.trim() || 'Custom Showcase',
        year: year || '2026',
        description: description.trim() || `Showcase ${isVid ? 'video project' : 'poster art'} by creator.`,
        thumbnailUrl: fileDataUrl,
        videoUrl: isVid ? fileDataUrl : null,
        imageUrl: !isVid ? fileDataUrl : null,
        isCustom: true,
        createdAt: new Date().toISOString(),
        accent: isVid ? 'gold' : 'silver',
      };

      await onUploadSuccess(newItem);
      onClose();
    } catch (err) {
      console.error('Save failed:', err);
      setErrorMsg('Failed to save to local portfolio storage.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-[#090e21] border border-amber-500/40 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-black/60 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-950 font-bold">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-cinzel">
                Upload Showcase Media
              </h2>
              <p className="text-xs text-amber-300">
                Directly showcase new work in your portfolio
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Category Switcher */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono-tag uppercase tracking-wider text-slate-400">
              Target Category
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleCategoryChange('Video Editing')}
                className={`flex items-center justify-center gap-2.5 py-3 rounded-xl text-xs sm:text-sm font-semibold border transition cursor-pointer ${
                  category === 'Video Editing'
                    ? 'bg-gradient-to-r from-rose-600 to-rose-700 border-rose-400 text-white shadow-lg shadow-rose-950/40'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Video Editing</span>
              </button>

              <button
                type="button"
                onClick={() => handleCategoryChange('Poster Designing')}
                className={`flex items-center justify-center gap-2.5 py-3 rounded-xl text-xs sm:text-sm font-semibold border transition cursor-pointer ${
                  category === 'Poster Designing'
                    ? 'bg-gradient-to-r from-sky-600 to-sky-700 border-sky-400 text-white shadow-lg shadow-sky-950/40'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Poster Designing</span>
              </button>
            </div>
          </div>

          {/* 2. Drag & Drop File Upload Zone */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono-tag uppercase tracking-wider text-slate-400">
              Media File ({isVideo ? 'Video (MP4, WEBM, MOV) or Thumbnail' : 'Image (PNG, JPG, WEBP, SVG)'})
            </label>
            
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group relative border-2 border-dashed border-amber-500/30 hover:border-amber-400 rounded-2xl p-5 text-center bg-black/40 hover:bg-black/60 transition cursor-pointer flex flex-col items-center justify-center min-h-[140px]"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={isVideo ? 'video/*,image/*' : 'image/*'}
                onChange={handleFileSelect}
                className="hidden"
              />

              {fileDataUrl ? (
                <div className="flex flex-col items-center space-y-2">
                  {fileType.startsWith('video') ? (
                    <video
                      src={fileDataUrl}
                      className="max-h-36 rounded-lg shadow-lg border border-white/20"
                      muted
                      controls
                    />
                  ) : (
                    <img
                      src={fileDataUrl}
                      alt="Preview"
                      className="max-h-36 rounded-lg object-contain shadow-lg border border-white/20"
                    />
                  )}
                  <span className="text-xs font-mono-tag text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {fileName} (Click to replace)
                  </span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-200">
                      Click to browse or drop file here
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {isVideo ? 'Supports high-res reels, mp4, webm' : 'Supports high-res 300dpi posters, png, jpg'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Title & SubCategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono-tag uppercase tracking-wider text-slate-400">
                Project Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isVideo ? "e.g. CYBERPUNK 2099 TRAILER" : "e.g. DUNE KEY ART POSTER"}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono-tag uppercase tracking-wider text-slate-400">
                SubCategory
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {(isVideo ? videoSubCats : posterSubCats).map((sc) => (
                  <option key={sc} value={sc}>{sc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Aspect Ratio & Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono-tag uppercase tracking-wider text-slate-400">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {isVideo ? (
                  <>
                    <option value="16:9">16:9 Landscape (Cinema/YouTube)</option>
                    <option value="9:16">9:16 Vertical (Reel/TikTok/Shorts)</option>
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
              <label className="text-xs font-mono-tag uppercase tracking-wider text-slate-400">
                Client / Brand
              </label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="e.g. Sony Music, Nike, Indie"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono-tag uppercase tracking-wider text-slate-400">
                {isVideo ? 'Duration' : 'Dimensions'}
              </label>
              <input
                type="text"
                value={isVideo ? duration : dimensions}
                onChange={(e) => isVideo ? setDuration(e.target.value) : setDimensions(e.target.value)}
                placeholder={isVideo ? "01:45" : "27\" x 40\""}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* 5. Software Stack Chips */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono-tag uppercase tracking-wider text-slate-400">
              Software Used
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
                        ? 'bg-amber-400 text-slate-950 font-bold border border-amber-300'
                        : 'bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {sw}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Description */}
          <div className="space-y-1">
            <label className="text-xs font-mono-tag uppercase tracking-wider text-slate-400">
              Project Description &amp; Techniques
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your creative concept, color grading, sound design, typography, or visual rhythm..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:brightness-110 shadow-lg shadow-amber-500/30 transition cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Publishing...' : 'Publish to Portfolio'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
