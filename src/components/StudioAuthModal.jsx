import React, { useState, useEffect } from 'react';
import { Lock, Unlock, X, Eye, EyeOff, AlertCircle, Key, CheckCircle2 } from 'lucide-react';
import { verifyAdminPassword, updateAdminPassword } from '../utils/db';

export default function StudioAuthModal({ 
  isOpen, 
  onClose, 
  isAdmin, 
  onToggleAdmin, 
  onOpenUpload, 
  onOpenProfileEdit,
  initialMode = null
}) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Change Password form state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changeError, setChangeError] = useState('');
  const [changeSuccess, setChangeSuccess] = useState('');
  const [isSubmittingChange, setIsSubmittingChange] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialMode === 'change-password') {
        setIsChangingPassword(true);
      }
    } else {
      setIsChangingPassword(false);
      setError('');
      setPassword('');
      setChangeError('');
      setChangeSuccess('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleUnlock = (e) => {
    e?.preventDefault();
    const clean = (password || '').trim();
    if (!clean) {
      setError('Please enter your admin password.');
      return;
    }

    if (verifyAdminPassword(clean)) {
      onToggleAdmin(true);
      setError('');
      setPassword('');
      onClose();
    } else {
      setError('Incorrect admin password. Access denied.');
    }
  };

  const handleLock = () => {
    onToggleAdmin(false);
    setIsChangingPassword(false);
    onClose();
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setChangeError('');
    setChangeSuccess('');

    if (!currentPassword) {
      setChangeError('Please enter your current password.');
      return;
    }

    if (!verifyAdminPassword(currentPassword.trim())) {
      setChangeError('Current password is incorrect.');
      return;
    }

    if (!newPassword || newPassword.trim().length < 6) {
      setChangeError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setChangeError('New passwords do not match.');
      return;
    }

    setIsSubmittingChange(true);
    try {
      await updateAdminPassword(newPassword.trim());
      setChangeSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setIsChangingPassword(false);
        setChangeSuccess('');
      }, 1500);
    } catch (err) {
      setChangeError(err.message || 'Failed to update password.');
    } finally {
      setIsSubmittingChange(false);
    }
  };

  const handleClose = () => {
    setError('');
    setPassword('');
    setIsChangingPassword(false);
    setChangeError('');
    setChangeSuccess('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={handleClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-[#0a0d14] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isAdmin ? 'bg-[#dfba73]/15 text-[#dfba73] border border-[#dfba73]/30' : 'bg-white/5 text-slate-300 border border-white/10'}`}>
              {isAdmin ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-[10px] font-mono-tag uppercase tracking-[0.2em] text-[#dfba73] font-semibold block">
                Portfolio Settings
              </span>
              <h3 className="text-base font-bold text-white font-cinzel">
                Creator Admin Portal
              </h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current State Info */}
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.07] space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono-tag">Current Mode:</span>
            <span className={`font-mono-tag font-semibold px-2 py-0.5 rounded text-[11px] ${
              isAdmin 
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' 
                : 'bg-emerald-400/15 text-emerald-300 border border-emerald-400/30'
            }`}>
              {isAdmin ? '● Admin Mode Active' : '● Public Client View'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-light">
            {isAdmin 
              ? 'Management controls (Upload, Edit, Delete, Profile) are unlocked. Switch to Client View before sharing with clients.'
              : 'The portfolio is currently in clean Client View. All management buttons and controls are protected.'}
          </p>
        </div>

        {/* Action based on status */}
        {isAdmin ? (
          isChangingPassword ? (
            /* Change Password Sub-form */
            <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white font-cinzel flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-[#dfba73]" />
                  <span>Update Admin Password</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="text-[11px] text-slate-400 hover:text-white font-mono-tag"
                >
                  Cancel
                </button>
              </div>

              {changeError && (
                <div className="flex items-center gap-1.5 text-rose-400 text-[11px] font-mono-tag bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{changeError}</span>
                </div>
              )}

              {changeSuccess && (
                <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-mono-tag bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{changeSuccess}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-mono-tag uppercase tracking-wider text-slate-400">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#dfba73]/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono-tag uppercase tracking-wider text-slate-400">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters (e.g. AdarshStudio#2026!)"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#dfba73]/60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono-tag uppercase tracking-wider text-slate-400">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  minLength={6}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#dfba73]/60"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 text-xs font-medium border border-white/10 transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingChange}
                  className="flex-1 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#dfba73] text-black text-xs font-semibold shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingChange ? 'Updating...' : 'Save New Password'}
                </button>
              </div>
            </form>
          ) : (
            /* Admin Active Controls */
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    handleClose();
                    onOpenProfileEdit();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 text-xs font-medium border border-white/10 transition cursor-pointer"
                >
                  Edit Creator Profile
                </button>
                <button
                  onClick={() => {
                    handleClose();
                    onOpenUpload();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#c5a059] hover:bg-[#dfba73] text-black text-xs font-semibold shadow transition cursor-pointer"
                >
                  Upload New Work
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsChangingPassword(true)}
                className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Key className="w-3.5 h-3.5 text-[#dfba73]" />
                <span>Change Admin Password</span>
              </button>

              <button
                onClick={handleLock}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium border border-white/10 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Lock &amp; Switch to Public Client View</span>
              </button>
            </div>
          )
        ) : (
          /* Password Authentication Form */
          <form onSubmit={handleUnlock} className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono-tag text-slate-300 flex items-center justify-between">
                <span>STUDIO ADMIN PASSWORD</span>
                <span className="text-[#dfba73] text-[10px] font-mono-tag">Protected</span>
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter admin password"
                  required
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-[#dfba73]/60 transition"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-1.5 text-rose-400 text-[11px] mt-1 font-mono-tag">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#dfba73] text-black text-xs font-semibold shadow-lg shadow-black/40 transition cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Unlock Studio Mode</span>
              </button>
            </div>
          </form>
        )}

        {/* Shortcut Tip */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono-tag text-slate-500">
          <span>Secure admin toggle:</span>
          <kbd className="px-1.5 py-0.5 rounded bg-black/60 border border-white/10 text-slate-400">
            Ctrl + Shift + A
          </kbd>
        </div>

      </div>
    </div>
  );
}
