import React, { useState, useEffect, useRef } from 'react';
import { X, Camera, Check, UserCheck, AlertCircle, Key, Lock, CheckCircle2 } from 'lucide-react';
import { resizeImageFile } from '../utils/mediaUtils';
import { verifyAdminPassword, updateAdminPassword } from '../utils/db';

export default function ProfileEditModal({ isOpen, onClose, profile, onSaveProfile }) {
  const [name, setName] = useState(profile.name || 'Adarsh A L');
  const [tagline, setTagline] = useState(profile.tagline || 'Graphic Designer & Video Editor');
  const [bio, setBio] = useState(profile.bio || '');
  const [experienceYears, setExperienceYears] = useState(profile.experienceYears || 'Active');
  const [projectsCompleted, setProjectsCompleted] = useState(profile.projectsCompleted || '50+');
  const [clientsSatisfied, setClientsSatisfied] = useState(profile.clientsSatisfied || '100%');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '/assets/neon-creator.png');
  const [email, setEmail] = useState(profile.socials?.email || 'adarsh.visuals@gmail.com');
  const [instagram, setInstagram] = useState(profile.socials?.instagram || '');
  const [youtube, setYoutube] = useState(profile.socials?.youtube || '');
  const [isProcessingAvatar, setIsProcessingAvatar] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Change Password state inside Profile Settings
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && profile) {
      setName(profile.name || 'Adarsh A L');
      setTagline(profile.tagline || 'Graphic Designer & Video Editor');
      setBio(profile.bio || '');
      setExperienceYears(profile.experienceYears || 'Active');
      setProjectsCompleted(profile.projectsCompleted || '50+');
      setClientsSatisfied(profile.clientsSatisfied || '100%');
      setAvatarUrl(profile.avatarUrl || '/assets/neon-creator.png');
      setEmail(profile.socials?.email || 'adarsh.visuals@gmail.com');
      setInstagram(profile.socials?.instagram || '');
      setYoutube(profile.socials?.youtube || '');
      setErrorMsg('');
    }
  }, [isOpen, profile]);

  if (!isOpen) return null;

  const handleAvatarFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingAvatar(true);
    setErrorMsg('');

    try {
      // Downsample/compress to 512x512 JPEG (~50KB) to prevent LocalStorage QuotaExceededError
      const optimizedDataUrl = await resizeImageFile(file, 512, 512, 0.88);
      setAvatarUrl(optimizedDataUrl);
    } catch {
      setErrorMsg('Failed to process avatar photo. Please try a standard JPG/PNG.');
    } finally {
      setIsProcessingAvatar(false);
    }
  };

  const handleSelectPresetAvatar = (url) => {
    setAvatarUrl(url);
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

  const handlePasswordChangeSubmit = async (e) => {
    e?.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (!currentPassword) {
      setPassError('Please enter your current password.');
      return;
    }
    if (!verifyAdminPassword(currentPassword.trim())) {
      setPassError('Current password is incorrect.');
      return;
    }
    if (!newPassword || newPassword.trim().length < 6) {
      setPassError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    setIsUpdatingPass(true);
    try {
      await updateAdminPassword(newPassword.trim());
      setPassSuccess('Admin password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setIsChangingPassword(false);
        setPassSuccess('');
      }, 2000);
    } catch (err) {
      setPassError(err.message || 'Failed to update password.');
    } finally {
      setIsUpdatingPass(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-[#0a0d14] border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-black/60 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/[0.04] text-[#dfba73] border border-white/10">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-cinzel">
                Edit Creator Profile &amp; Avatar
              </h2>
              <p className="text-xs text-slate-400 font-light">
                Configure headline, bio statement, and portrait artwork
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          
          {/* Avatar Section with Swappable Presets */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/[0.08]">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-[#dfba73]/40 shadow-lg flex-shrink-0 bg-[#07090e]">
              <img
                src={avatarUrl}
                alt="Avatar Preview"
                draggable="false"
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-full object-cover select-none pointer-events-none"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/neon-creator.png';
                }}
              />
              {isProcessingAvatar && (
                <div className="absolute inset-0 bg-black/75 flex items-center justify-center text-amber-200 text-xs">
                  <div className="w-4 h-4 border-2 border-[#dfba73] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <h4 className="text-[11px] font-mono-tag uppercase tracking-wider text-slate-400">
                Visual Portrait / Swappable Avatars
              </h4>
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarFile}
                  className="hidden"
                />
                
                {/* Custom upload button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessingAvatar}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#dfba73]/15 hover:bg-[#dfba73]/25 border border-[#dfba73]/40 text-[#dfba73] text-xs font-semibold cursor-pointer disabled:opacity-50 transition"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{isProcessingAvatar ? 'Optimizing...' : 'Upload Photo'}</span>
                </button>

                {/* Preset 1: Adarsh A L default */}
                <button
                  type="button"
                  onClick={() => handleSelectPresetAvatar('/assets/neon-creator.png')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs cursor-pointer border transition ${
                    avatarUrl === '/assets/neon-creator.png'
                      ? 'bg-white/10 text-white border-white/30 font-medium'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border-white/10'
                  }`}
                  title="Default Adarsh A L Portrait"
                >
                  <span>Adarsh A L</span>
                </button>

                {/* Preset 2: Editor at Work */}
                <button
                  type="button"
                  onClick={() => handleSelectPresetAvatar('/assets/Neon Creative Editor at Work.png')}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs cursor-pointer border transition ${
                    avatarUrl === '/assets/Neon Creative Editor at Work.png'
                      ? 'bg-white/10 text-white border-white/30 font-medium'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white border-white/10'
                  }`}
                  title="Editor at Work Portrait"
                >
                  <span>Editor at Work</span>
                </button>
              </div>
            </div>
          </div>

          {/* Name & Tagline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-mono-tag uppercase tracking-wider text-slate-400">
                Creator / Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#dfba73]/60 transition"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono-tag uppercase tracking-wider text-slate-400">
                Short Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#dfba73]/60 transition"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono-tag uppercase tracking-wider text-slate-400">
              Biography / Artistic Statement
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-[#dfba73]/60 transition"
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
                className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-[#dfba73] font-bold focus:outline-none focus:border-[#dfba73]/60"
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
                className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-slate-200 font-bold focus:outline-none focus:border-[#dfba73]/60"
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
                className="w-full px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-xs text-slate-200 font-bold focus:outline-none focus:border-[#dfba73]/60"
              />
            </div>
          </div>

          {/* Socials & Email */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono-tag uppercase tracking-wider text-slate-400">
              Contact &amp; Portfolio Links
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Inquiry Email"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-[#dfba73]/60"
              />
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="Instagram URL"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-[#dfba73]/60"
              />
            </div>
          </div>

          {/* Studio Security: Change Password */}
          <div className="pt-2 border-t border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono-tag uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#dfba73]" />
                <span>Studio Admin Security</span>
              </span>
              {!isChangingPassword && (
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono-tag text-[#dfba73] hover:text-[#f3e7c4] bg-[#dfba73]/10 hover:bg-[#dfba73]/20 border border-[#dfba73]/30 transition cursor-pointer"
                >
                  <Key className="w-3 h-3" />
                  <span>Change Password</span>
                </button>
              )}
            </div>

            {isChangingPassword && (
              <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5 font-cinzel">
                    <Key className="w-3.5 h-3.5 text-[#dfba73]" />
                    <span>Update Admin Password</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPassError('');
                      setPassSuccess('');
                    }}
                    className="text-[10px] font-mono-tag text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                {passError && (
                  <div className="flex items-center gap-1.5 text-[11px] text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20 font-mono-tag">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{passError}</span>
                  </div>
                )}
                {passSuccess && (
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 font-mono-tag">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{passSuccess}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#dfba73]/60"
                  />
                  <input
                    type="password"
                    placeholder="New Password (min 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#dfba73]/60"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#dfba73]/60"
                  />
                </div>

                <div className="pt-1 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono-tag text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handlePasswordChangeSubmit}
                    disabled={isUpdatingPass}
                    className="px-4 py-1.5 rounded-lg bg-[#c5a059] hover:bg-[#dfba73] text-black text-xs font-semibold shadow transition cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingPass ? 'Updating...' : 'Save New Password'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
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
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-black bg-[#c5a059] hover:bg-[#dfba73] shadow-md shadow-black/50 transition cursor-pointer"
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
