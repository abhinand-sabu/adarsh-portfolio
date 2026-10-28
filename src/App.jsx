import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import NetworkBanner from './components/NetworkBanner';
import Hero from './components/Hero';
import CategoryNav from './components/CategoryNav';
import FilterBar from './components/FilterBar';
import VideoCard from './components/VideoCard';
import PosterCard from './components/PosterCard';
import VideoModal from './components/VideoModal';
import PosterModal from './components/PosterModal';
import UploadModal from './components/UploadModal';
import ProfileEditModal from './components/ProfileEditModal';
import Footer from './components/Footer';

import { 
  getAllPortfolioItems, 
  addPortfolioItem, 
  deletePortfolioItem, 
  getStoredProfile, 
  saveStoredProfile 
} from './utils/db';
import { Film, Image as ImageIcon, Upload, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Navigation & Hash-routed state
  const [activeCategory, setActiveCategory] = useState(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (hash === 'video' || hash === 'poster') return hash;
    }
    return 'all';
  });
  
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [selectedAspect, setSelectedAspect] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [profile, setProfile] = useState(getStoredProfile());
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadCategoryHint, setUploadCategoryHint] = useState('video');
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Synchronize hash with activeCategory for direct linking (e.g. #video, #poster)
  const setCategoryAndHash = (cat) => {
    setActiveCategory(cat);
    if (typeof window !== 'undefined') {
      if (cat === 'all') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      } else {
        history.replaceState(null, '', `#${cat}`);
      }
    }
  };

  // Listen to browser Back/Forward hashchange events
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
      if (hash === 'video' || hash === 'poster') {
        setActiveCategory(hash);
      } else {
        setActiveCategory('all');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Load portfolio items from DB
  useEffect(() => {
    async function loadData() {
      try {
        const items = await getAllPortfolioItems();
        setPortfolioItems(items);
      } catch (err) {
        console.error('Failed to load items:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // When active category changes, reset subcategory
  useEffect(() => {
    setSelectedSubCategory('All');
  }, [activeCategory]);

  // Handle new item upload
  const handleUploadSuccess = async (newItem) => {
    await addPortfolioItem(newItem);
    setPortfolioItems((prev) => [newItem, ...prev]);
    showToast(`Successfully added "${newItem.title}" to your portfolio!`);
  };

  // Handle item deletion
  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to remove this showcase item?')) {
      await deletePortfolioItem(id);
      setPortfolioItems((prev) => prev.filter((item) => item.id !== id));
      showToast('Item deleted successfully.');
    }
  };

  // Handle profile update
  const handleSaveProfile = (updatedProfile) => {
    saveStoredProfile(updatedProfile);
    setProfile(updatedProfile);
    showToast('Creator profile updated!');
  };

  // Quick upload trigger with category pre-selected
  const openUploadWithCategory = (cat) => {
    setUploadCategoryHint(cat);
    setIsUploadOpen(true);
  };

  // Counts for category badges
  const counts = useMemo(() => {
    const videoCount = portfolioItems.filter((i) => i.type === 'video').length;
    const posterCount = portfolioItems.filter((i) => i.type === 'poster').length;
    return {
      all: portfolioItems.length,
      video: videoCount,
      poster: posterCount
    };
  }, [portfolioItems]);

  // Filtered items based on active category, subcategory, search, and aspect ratio
  const filteredItems = useMemo(() => {
    return portfolioItems.filter((item) => {
      // 1. Main Category filter
      if (activeCategory === 'video' && item.type !== 'video') return false;
      if (activeCategory === 'poster' && item.type !== 'poster') return false;

      // 2. SubCategory filter
      if (selectedSubCategory !== 'All' && selectedSubCategory !== 'All Work' && selectedSubCategory !== 'All Videos' && selectedSubCategory !== 'All Posters') {
        if (item.subCategory !== selectedSubCategory) return false;
      }

      // 3. Aspect Ratio filter
      if (selectedAspect !== 'all') {
        if (item.aspectRatio !== selectedAspect) return false;
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(query);
        const matchesClient = item.client?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesSoftware = item.software?.some((s) => s.toLowerCase().includes(query));
        if (!matchesTitle && !matchesClient && !matchesDesc && !matchesSoftware) {
          return false;
        }
      }

      return true;
    });
  }, [portfolioItems, activeCategory, selectedSubCategory, selectedAspect, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#050814] text-slate-100 selection:bg-rose-600 selection:text-white">
      {/* LAN Network Testing info bar with QR Code */}
      <NetworkBanner />

      {/* Main Top Navigation */}
      <Navbar
        activeCategory={activeCategory}
        setActiveCategory={setCategoryAndHash}
        onOpenUpload={() => openUploadWithCategory(activeCategory === 'poster' ? 'poster' : 'video')}
        onOpenProfileEdit={() => setIsProfileEditOpen(true)}
        profile={profile}
      />

      {/* Hero Section with Dual Focus & Profile Avatar */}
      <Hero
        profile={profile}
        setActiveCategory={setCategoryAndHash}
        onOpenUpload={() => openUploadWithCategory(activeCategory === 'poster' ? 'poster' : 'video')}
        onOpenProfileEdit={() => setIsProfileEditOpen(true)}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-amber-500/50 shadow-2xl text-xs sm:text-sm text-slate-100 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Portfolio Showcase Section */}
      <main id="portfolio-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Category Navigation Bar */}
        <CategoryNav
          activeCategory={activeCategory}
          setActiveCategory={setCategoryAndHash}
          counts={counts}
        />

        {/* Dedicated Section Header & Upload Callout */}
        <div className="mt-8 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] sm:text-xs font-mono-tag px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                activeCategory === 'video'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : activeCategory === 'poster'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {activeCategory === 'video' ? 'Dedicated Video Editing Suite' : activeCategory === 'poster' ? 'Dedicated Poster Design Gallery' : 'Featured Dual Showcase'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mt-1">
              {activeCategory === 'video' && 'Cinematic Video Cuts & Viral Reels'}
              {activeCategory === 'poster' && 'High-Res Key Art & Poster Designs'}
              {activeCategory === 'all' && 'Curated Visual & Editing Works'}
            </h2>
          </div>

          {/* Quick upload button for this specific section */}
          <button
            onClick={() => openUploadWithCategory(activeCategory === 'poster' ? 'poster' : 'video')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload {activeCategory === 'poster' ? 'Poster' : activeCategory === 'video' ? 'Video Cut' : 'Creation'}</span>
          </button>
        </div>

        {/* Filters, Subcategories & Search */}
        <FilterBar
          activeCategory={activeCategory}
          selectedSubCategory={selectedSubCategory}
          setSelectedSubCategory={setSelectedSubCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedAspect={selectedAspect}
          setSelectedAspect={setSelectedAspect}
        />

        {/* Portfolio Cards Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-xs font-mono-tag text-slate-400">Loading Portfolio Artworks...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center glass-panel rounded-3xl p-8 border border-white/10 my-8">
            <AlertCircle className="w-10 h-10 text-amber-400/80 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No items found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No creations match the selected filters or search terms. Try clearing filters or upload a new creation!
            </p>
            <button
              onClick={() => {
                setSelectedSubCategory('All');
                setSelectedAspect('all');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 pt-4">
            {filteredItems.map((item) => (
              item.type === 'video' ? (
                <VideoCard
                  key={item.id}
                  item={item}
                  onPlay={(v) => setSelectedVideo(v)}
                  onDelete={handleDeleteItem}
                />
              ) : (
                <PosterCard
                  key={item.id}
                  item={item}
                  onInspect={(p) => setSelectedPoster(p)}
                  onDelete={handleDeleteItem}
                />
              )
            ))}
          </div>
        )}

      </main>

      {/* Modals */}
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
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        defaultCategory={uploadCategoryHint}
      />

      <ProfileEditModal
        isOpen={isProfileEditOpen}
        onClose={() => setIsProfileEditOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Footer */}
      <Footer
        profile={profile}
        setActiveCategory={setCategoryAndHash}
      />
    </div>
  );
}
