import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryNav from './components/CategoryNav';
import VideoCard from './components/VideoCard';
import PosterCard from './components/PosterCard';
import VideoModal from './components/VideoModal';
import PosterModal from './components/PosterModal';
import UploadModal from './components/UploadModal';
import ProfileEditModal from './components/ProfileEditModal';
import StudioAuthModal from './components/StudioAuthModal';
import Footer from './components/Footer';

import { 
  getAllPortfolioItems, 
  addPortfolioItem, 
  updatePortfolioItem,
  deletePortfolioItem, 
  getStoredProfile, 
  getLocalStoredProfile,
  saveStoredProfile 
} from './utils/db';
import { Film, Image as ImageIcon, Upload, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  // Admin Mode state (Default: Client Mode is active, management controls are hidden)
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adarsh_portfolio_admin') === 'true';
    }
    return false;
  });

  const [isStudioAuthOpen, setIsStudioAuthOpen] = useState(false);
  const [studioAuthMode, setStudioAuthMode] = useState(null);

  // Data states
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [profile, setProfile] = useState(() => getLocalStoredProfile());
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploadCategoryHint, setUploadCategoryHint] = useState('video');
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);

  // Hash navigation parser resolving category
  const parseCategoryFromHash = (hash) => {
    if (!hash) return null;
    const clean = hash.replace(/^#\/?/, '').split('?')[0].split('&')[0].trim().toLowerCase();
    if (clean === 'video' || clean === 'videos') return 'videos';
    if (clean === 'poster' || clean === 'posters' || clean === 'graphics') return 'graphics';
    if (clean === 'all') return 'all';
    return null;
  };

  const [activeCategory, setActiveCategory] = useState(() => {
    if (typeof window !== 'undefined') {
      const fromHash = parseCategoryFromHash(window.location.hash);
      if (fromHash) return fromHash;
    }
    return 'all';
  });

  const handleCategoryChange = (cat) => {
    // If clicking the active category (e.g. clicking Videos when already on Videos), toggle back to 'all'
    const nextCat = (cat === activeCategory && cat !== 'all') ? 'all' : cat;
    setActiveCategory(nextCat);
    if (typeof window !== 'undefined') {
      try {
        if (nextCat === 'all') {
          window.history.pushState(null, '', window.location.pathname + window.location.search);
        } else {
          window.history.pushState(null, '', `#${nextCat}`);
        }
      } catch {
        // Fallback
      }

      // Smoothly ensure showcase container is visible without jump
      const showcaseEl = document.getElementById('portfolio-showcase');
      if (showcaseEl) {
        const rect = showcaseEl.getBoundingClientRect();
        if (rect.top < 64 || rect.top > window.innerHeight * 0.4) {
          const targetY = window.scrollY + rect.top - 80;
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        }
      }
    }
  };

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Lock background scroll when any modal is open
  const isAnyModalOpen = Boolean(
    selectedVideo || 
    selectedPoster || 
    isUploadOpen || 
    editingItem ||
    isProfileEditOpen || 
    isStudioAuthOpen
  );

  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isAnyModalOpen]);

  // Global Escape key listener to close open modals
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (selectedVideo) setSelectedVideo(null);
        else if (selectedPoster) setSelectedPoster(null);
        else if (isUploadOpen) setIsUploadOpen(false);
        else if (editingItem) setEditingItem(null);
        else if (isProfileEditOpen) setIsProfileEditOpen(false);
        else if (isStudioAuthOpen) setIsStudioAuthOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedVideo, selectedPoster, isUploadOpen, editingItem, isProfileEditOpen, isStudioAuthOpen]);

  // Comprehensive Media Download & Right-Click Protection
  // Blocks right-click "Save Image As...", context menu, and dragging to desktop/tab on all media
  useEffect(() => {
    const handleContextMenu = (e) => {
      const target = e.target;
      if (
        target instanceof HTMLImageElement ||
        target instanceof HTMLVideoElement ||
        target instanceof HTMLCanvasElement ||
        (target.closest && target.closest('img, video, canvas, [data-protected-media]'))
      ) {
        e.preventDefault();
      }
    };

    const handleDragStart = (e) => {
      const target = e.target;
      if (
        target instanceof HTMLImageElement ||
        target instanceof HTMLVideoElement ||
        target instanceof HTMLCanvasElement ||
        (target.closest && target.closest('img, video, canvas, [data-protected-media]'))
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  // Keyboard shortcut for discreet Studio Admin access (Ctrl+Shift+A or Cmd+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (isAdmin) {
          setIsAdmin(false);
          localStorage.setItem('adarsh_portfolio_admin', 'false');
          showToast('Switched to Public Client View');
        } else {
          setStudioAuthMode(null);
          setIsStudioAuthOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdmin]);

  // Listen to browser Back/Forward hash changes
  useEffect(() => {
    const handleHash = () => {
      const fromHash = parseCategoryFromHash(window.location.hash);
      if (fromHash) {
        setActiveCategory(fromHash);
      } else if (!window.location.hash || window.location.hash === '#') {
        setActiveCategory('all');
      }
    };

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Handle hash scrolling on initial load if directly navigated to anchor
  useEffect(() => {
    const cleanHash = window.location.hash.replace(/^#\/?/, '').split('?')[0].split('&')[0].trim().toLowerCase();
    let targetId = null;
    if (cleanHash === 'video' || cleanHash === 'videos') targetId = 'videos';
    if (cleanHash === 'poster' || cleanHash === 'posters' || cleanHash === 'graphics') targetId = 'graphics';

    if (targetId) {
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          const topOffset = 80;
          const targetY = el.getBoundingClientRect().top + window.scrollY - topOffset;
          window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        }
      }, 150);
    }
  }, []);

  // Load portfolio items & profile from DB
  useEffect(() => {
    async function loadData() {
      try {
        const [items, cloudProfile] = await Promise.all([
          getAllPortfolioItems(),
          getStoredProfile()
        ]);
        setPortfolioItems(items);
        if (cloudProfile) {
          setProfile(cloudProfile);
        }
      } catch {
        // Graceful fallback: local storage and defaults remain active
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Handle new item upload
  const handleUploadSuccess = async (newItem) => {
    const savedItem = await addPortfolioItem(newItem);
    setPortfolioItems((prev) => [savedItem || newItem, ...prev]);
    showToast(`Added "${newItem.title}" to portfolio!`);
  };

  // Handle item update
  const handleUpdateItem = async (id, updatedFields) => {
    const updated = await updatePortfolioItem(id, updatedFields);
    setPortfolioItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
    showToast(`Updated "${updated?.title || 'item'}" successfully!`);
  };

  // Handle item deletion
  const handleDeleteItem = async (id) => {
    await deletePortfolioItem(id);
    setPortfolioItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Item deleted successfully.');
  };

  // Handle profile update
  const handleSaveProfile = async (updatedProfile) => {
    const saved = await saveStoredProfile(updatedProfile);
    setProfile(saved || updatedProfile);
    showToast('Creator profile updated!');
  };

  // Quick upload trigger with category pre-selected
  const openUploadWithCategory = (cat) => {
    setUploadCategoryHint(cat);
    setIsUploadOpen(true);
  };

  const handleToggleAdmin = (status) => {
    setIsAdmin(status);
    localStorage.setItem('adarsh_portfolio_admin', status ? 'true' : 'false');
    showToast(status ? 'Portfolio Admin Mode Active' : 'Switched to Public Client View');
  };

  // Filtering video and graphics by search query
  const query = searchQuery.trim().toLowerCase();

  const matchesSearch = (item) => {
    if (!query) return true;
    return (
      item.title?.toLowerCase().includes(query) ||
      item.client?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.software?.some((s) => s.toLowerCase().includes(query)) ||
      item.category?.toLowerCase().includes(query) ||
      item.subCategory?.toLowerCase().includes(query)
    );
  };

  const videoItems = useMemo(() => {
    return portfolioItems.filter((i) => i.type === 'video' && matchesSearch(i));
  }, [portfolioItems, query]);

  const graphicItems = useMemo(() => {
    return portfolioItems.filter((i) => i.type === 'poster' && matchesSearch(i));
  }, [portfolioItems, query]);

  const totalMatches = videoItems.length + graphicItems.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 selection:bg-[#c5a059] selection:text-black">
      
      {/* 1. Sleek Search Bar at the Very Top */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isAdmin={isAdmin}
        onOpenUpload={() => openUploadWithCategory(activeCategory === 'graphics' ? 'poster' : 'video')}
        onOpenProfileEdit={() => setIsProfileEditOpen(true)}
        onOpenChangePassword={() => {
          setStudioAuthMode('change-password');
          setIsStudioAuthOpen(true);
        }}
        onExitAdmin={() => handleToggleAdmin(false)}
        totalResults={totalMatches}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#0a0d14]/95 backdrop-blur-xl border border-[#c5a059]/40 shadow-2xl text-xs sm:text-sm text-slate-100 animate-slideDown">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* 2. Hero Profile: Name, DP, Main Tagline, Small Bio */}
      <Hero
        profile={profile}
        onOpenProfileEdit={() => setIsProfileEditOpen(true)}
        isAdmin={isAdmin}
      />

      {/* Main Content Area: Category Switcher + Showcase */}
      <main id="portfolio-showcase" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12 sm:space-y-16">
        
        {/* Category Switcher Above the Works (Simple, Clean, Minimalist) */}
        <CategoryNav
          activeCategory={activeCategory}
          setActiveCategory={handleCategoryChange}
        />

        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-2 border-[#dfba73] border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-xs font-mono-tag text-slate-400">Loading Portfolio Showcase...</p>
          </div>
        ) : (
          <>
            {/* ======================================================== */}
            {/* SECTION 1: VIDEO SHOWCASE */}
            {/* ======================================================== */}
            {(activeCategory === 'all' || activeCategory === 'videos') && (
              <section id="videos" className="scroll-mt-24">
                
                {/* Video Section Header */}
                <div className="flex items-end justify-between border-b border-white/[0.08] pb-5 mb-8">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#dfba73]" />
                      <span className="text-[10px] font-mono-tag tracking-[0.25em] uppercase text-slate-400 font-semibold">
                        01 // MOTION &amp; EDITING
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">
                      Video Showcase
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 font-light mt-0.5">
                      16:9 cinema masters, fitness hype reels &amp; commercial edits.
                    </p>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => openUploadWithCategory('video')}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-black bg-[#c5a059] hover:bg-[#dfba73] shadow-md transition cursor-pointer active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Video</span>
                    </button>
                  )}
                </div>

                {/* Videos Grid */}
                {videoItems.length === 0 ? (
                  <div className="py-20 text-center bg-[#0a0d14]/70 rounded-3xl border border-white/[0.07] p-8 max-w-lg mx-auto flex flex-col items-center justify-center space-y-3.5 shadow-xl">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#dfba73]">
                      <Film className="w-6 h-6 opacity-75" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base text-slate-200 font-cinzel font-bold">
                        {searchQuery ? `No videos match "${searchQuery}"` : "No projects in this section yet."}
                      </h3>
                      <p className="text-xs text-slate-400 font-light">
                        {searchQuery ? "Try searching for a different keyword or tag." : "Cinematic edits, fitness reels, and commercial cuts will appear here."}
                      </p>
                    </div>
                    {isAdmin && !searchQuery && (
                      <button
                        onClick={() => openUploadWithCategory('video')}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-black bg-[#c5a059] hover:bg-[#dfba73] shadow-md transition cursor-pointer mt-1 active:scale-95"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload First Video</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {videoItems.map((item) => (
                      <VideoCard
                        key={item.id}
                        item={item}
                        onPlay={(v) => setSelectedVideo(v)}
                        onDelete={isAdmin ? handleDeleteItem : null}
                        onEdit={isAdmin ? (it) => setEditingItem(it) : null}
                        isAdmin={isAdmin}
                      />
                    ))}
                  </div>
                )}

              </section>
            )}

            {/* ======================================================== */}
            {/* SECTION 2: GRAPHICS SHOWCASE */}
            {/* ======================================================== */}
            {(activeCategory === 'all' || activeCategory === 'graphics') && (
              <section id="graphics" className="scroll-mt-24">
                
                {/* Graphics Section Header */}
                <div className="flex items-end justify-between border-b border-white/[0.08] pb-5 mb-8">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#93c5fd]" />
                      <span className="text-[10px] font-mono-tag tracking-[0.25em] uppercase text-slate-400 font-semibold">
                        02 // VISUAL &amp; KEY ART
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mt-1">
                      Graphics Showcase
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 font-light mt-0.5">
                      High-resolution promotional posters, brand artwork &amp; thumbnails.
                    </p>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => openUploadWithCategory('poster')}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-black bg-[#c5a059] hover:bg-[#dfba73] shadow-md transition cursor-pointer active:scale-95"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Graphic</span>
                    </button>
                  )}
                </div>

                {/* Graphics Grid */}
                {graphicItems.length === 0 ? (
                  <div className="py-20 text-center bg-[#0a0d14]/70 rounded-3xl border border-white/[0.07] p-8 max-w-lg mx-auto flex flex-col items-center justify-center space-y-3.5 shadow-xl">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#93c5fd]">
                      <ImageIcon className="w-6 h-6 opacity-75" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base text-slate-200 font-cinzel font-bold">
                        {searchQuery ? `No graphics match "${searchQuery}"` : "No projects in this section yet."}
                      </h3>
                      <p className="text-xs text-slate-400 font-light">
                        {searchQuery ? "Try searching for a different keyword or tag." : "Promotional posters, event flyers, and key art will appear here."}
                      </p>
                    </div>
                    {isAdmin && !searchQuery && (
                      <button
                        onClick={() => openUploadWithCategory('poster')}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-black bg-[#c5a059] hover:bg-[#dfba73] shadow-md transition cursor-pointer mt-1 active:scale-95"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload First Graphic</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {graphicItems.map((item) => (
                      <PosterCard
                        key={item.id}
                        item={item}
                        onInspect={(p) => setSelectedPoster(p)}
                        onDelete={isAdmin ? handleDeleteItem : null}
                        onEdit={isAdmin ? (it) => setEditingItem(it) : null}
                        isAdmin={isAdmin}
                      />
                    ))}
                  </div>
                )}

              </section>
            )}
          </>
        )}

      </main>

      {/* Lightbox & Management Modals */}
      {selectedVideo && (
        <VideoModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}

      {selectedPoster && (
        <PosterModal
          poster={selectedPoster}
          onClose={() => setSelectedPoster(null)}
        />
      )}

      <UploadModal
        isOpen={isUploadOpen || Boolean(editingItem)}
        onClose={() => {
          setIsUploadOpen(false);
          setEditingItem(null);
        }}
        editItem={editingItem}
        onUploadSuccess={handleUploadSuccess}
        onUpdateSuccess={handleUpdateItem}
        defaultCategory={uploadCategoryHint}
      />

      <ProfileEditModal
        isOpen={isProfileEditOpen}
        onClose={() => setIsProfileEditOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      <StudioAuthModal
        isOpen={isStudioAuthOpen}
        onClose={() => {
          setIsStudioAuthOpen(false);
          setStudioAuthMode(null);
        }}
        initialMode={studioAuthMode}
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdmin}
        onOpenUpload={() => openUploadWithCategory(activeCategory === 'graphics' ? 'poster' : 'video')}
        onOpenProfileEdit={() => setIsProfileEditOpen(true)}
      />

      {/* Clean Bottom Footer with Creator Credit at the Very Bottom */}
      <Footer
        profile={profile}
        isAdmin={isAdmin}
        onOpenAdminModal={() => {
          setStudioAuthMode(null);
          setIsStudioAuthOpen(true);
        }}
      />

    </div>
  );
}
