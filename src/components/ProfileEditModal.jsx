import React, { useState, useRef } from 'react';
import { X, Camera, RotateCcw, Check, UserCheck, Sparkles, AlertCircle } from 'lucide-react';
import { resizeImageFile } from '../utils/mediaUtils';

export default function ProfileEditModal({ isOpen, onClose, profile, onSaveProfile }) {
  const [name, setName] = useState(profile.name || 'Neon Creator');
  const [tagline, setTagline] = useState(profile.tagline || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [experienceYears, setExperienceYears] = useState(profile.experienceYears || '6+ Years');
  const [projectsCompleted, setProjectsCompleted] = useState(profile.projectsCompleted || '140+');
  const [clientsSatisfied, setClientsSatisfied] = useState(profile.clientsSatisfied || '85+');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '/assets/neon-creator.png');
  const [email, setEmail] = useState(profile.socials?.email || 'creator@neonstudio.design');
  const [instagram, setInstagram] = useState(profile.socials?.instagram || '');
  const [youtube, setYoutube] = useState(profile.socials?.youtube || '');
  const [isProcessingAvatar, setIsProcessingAvatar] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingAvatar(true);
    setErrorMsg('');

    try {
      // Downsample/compress camera photo to 512x512 JPEG (~50KB)
      // This prevents LocalStorage 5MB QuotaExceededError completely
      const optimizedDataUrl = await resizeImageFile(file, 512, 512, 0.88);
      setAvatarUrl(optimizedDataUrl);
    } catch (err) {
      console.error('Failed to optimize avatar photo:', err);
      setErrorMsg('Failed to process avatar photo. Please try a standard JPG/PNG.');
    } finally {
      setIsProcessingAvatar(false);
    }
  };

  const handleResetToNeonCreator = () => {
    setAvatarUrl('/assets/neon-creator.png');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Creator name cannot be empty.');
      return;
    }

    const updated = {
      ...profile,
      name: name.trim(),
      tagline: tagline.trim(),
      bio: bio.trim(),
      experienceYears: experienceYears.trim(),
      projectsCompleted: projectsCompleted.trim(),
      clientsSatisfied: clientsSatisfied.trim(),
      avatarUrl,
      socials: {
        ...profile.socials,
        email: email.trim(),
        instagram: instagram.trim(),
        youtube: youtube.trim()
      }
    };
    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-[#090e21] border border-amber-500/40 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-black/60 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-cinzel">
                Edit Creator Profile &amp; Avatar
              </h2>
              <p className="text-xs text-slate-400">
                Personalize your headline, bio, and visual portrait
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          
          {/* Avatar Swap Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/10">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-lg flex-shrink-0">
              <img
                src={avatarUrl}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/neon-creator.png';
                }}
              />
              {isProcessingAvatar && (
                <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-amber-300 text-xs">
                  <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <h4 className="text-xs font-mono-tag uppercase tracking-wider text-slate-300">
                Profile Photo (Optimized for Mobile &amp; Retina)
              </h4>
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFile}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingAvatar}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{isProcessingAvatar ? 'Optimizing...' : 'Upload Photo'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetToNeonCreator}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
                  title="Reset to default Neon Creator artwork"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Use Neon Creator</span>
                </button>
              </div>
            </div>
          </div>

          {/* Name & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-mono-tag uppercase tracking-wider text-slate-400">
                Creator / Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono-tag uppercase tracking-wider text-slate-400">
                Short Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <label className="text-xs font-mono-tag uppercase tracking-wider text-slate-400">
              Biography / Artistic Statement
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Stats Bar fields */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-mono-tag uppercase tracking-wider text-slate-400">
                Experience
              </label>
              <input
                type="text"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono-tag uppercase tracking-wider text-slate-400">
                Projects
              </label>
              <input
                type="text"
                value={projectsCompleted}
                onChange={(e) => setProjectsCompleted(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-mono-tag uppercase tracking-wider text-slate-400">
                Clients
              </label>
              <input
                type="text"
                value={clientsSatisfied}
                onChange={(e) => setClientsSatisfied(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-sky-300 font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Socials & Email */}
          <div className="space-y-2">
            <label className="text-xs font-mono-tag uppercase tracking-wider text-slate-400">
              Contact &amp; Social Links
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Inquiry Email"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              />
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="Instagram URL"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Actions */}
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
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 shadow-lg shadow-amber-500/30 transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
