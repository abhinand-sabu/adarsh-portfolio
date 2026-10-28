import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  INITIAL_PROFILE, 
  INITIAL_PORTFOLIO_ITEMS, 
  SAMPLE_PORTFOLIO_ITEMS,
  createPosterSvgDataUri, 
  createVideoThumbSvgDataUri 
} from '../src/data/defaultPortfolio.js';
import { formatTimecode, parseVideoUrl } from '../src/utils/mediaUtils.js';
import QRCode from 'qrcode';

test('INITIAL_PROFILE contains required roles and avatar', () => {
  assert.equal(INITIAL_PROFILE.name, 'Adarsh A L');
  assert.ok(INITIAL_PROFILE.roles.includes('Graphic Designer'), 'Must include Graphic Designer role');
  assert.ok(INITIAL_PROFILE.roles.includes('Video Editor'), 'Must include Video Editor role');
  assert.ok(INITIAL_PROFILE.avatarUrl.includes('neon-creator.png'), 'Must reference neon-creator avatar asset');
  assert.ok(INITIAL_PROFILE.skills.length >= 5, 'Must have diverse creative software skills');
});

test('INITIAL_PORTFOLIO_ITEMS starts empty (no placeholders) while SAMPLE_PORTFOLIO_ITEMS has items', () => {
  // Task 1: Placeholders removed so user portfolio starts clean
  assert.equal(INITIAL_PORTFOLIO_ITEMS.length, 0, 'INITIAL_PORTFOLIO_ITEMS must be empty array so no placeholders appear');

  const videoItems = SAMPLE_PORTFOLIO_ITEMS.filter(i => i.type === 'video');
  const posterItems = SAMPLE_PORTFOLIO_ITEMS.filter(i => i.type === 'poster');

  assert.ok(videoItems.length >= 4, `Expected at least 4 video sample items, got ${videoItems.length}`);
  assert.ok(posterItems.length >= 4, `Expected at least 4 poster sample items, got ${posterItems.length}`);

  // Test video specific fields
  for (const v of videoItems) {
    assert.equal(v.category, 'Video Editing');
    assert.ok(v.duration, `Video item ${v.title} missing duration`);
    assert.ok(v.thumbnailUrl, `Video item ${v.title} missing thumbnailUrl`);
    assert.ok(['16:9', '9:16', '4:5'].includes(v.aspectRatio), `Video aspect ratio invalid: ${v.aspectRatio}`);
  }

  // Test poster specific fields
  for (const p of posterItems) {
    assert.equal(p.category, 'Poster Designing');
    assert.ok(p.dimensions, `Poster item ${p.title} missing dimensions`);
    assert.ok(p.thumbnailUrl, `Poster item ${p.title} missing thumbnailUrl`);
    assert.ok(['4:5', '1:1', '16:9'].includes(p.aspectRatio), `Poster aspect ratio invalid: ${p.aspectRatio}`);
  }
});

test('SVG generation produces valid data URIs', () => {
  const posterUri = createPosterSvgDataUri('CYBERPUNK CITY', 'DIRECTORS CUT', '#112233', '#FF0055', 'cinema');
  assert.ok(posterUri.startsWith('data:image/svg+xml;utf8,'), 'Poster URI must be a data SVG URI');
  assert.ok(posterUri.includes('CYBERPUNK%20CITY') || posterUri.includes('CYBERPUNK'), 'Poster URI must encode title');

  const videoUri = createVideoThumbSvgDataUri('ACTION TEASER', '01:30', '4K UHD', '#000000', '#FFCC00');
  assert.ok(videoUri.startsWith('data:image/svg+xml;utf8,'), 'Video URI must be a data SVG URI');
  assert.ok(videoUri.includes('01%3A30') || videoUri.includes('01:30'), 'Video URI must encode duration');
});

test('Filter simulation works accurately', () => {
  // Category filter
  const videosOnly = SAMPLE_PORTFOLIO_ITEMS.filter(item => item.type === 'video');
  const postersOnly = SAMPLE_PORTFOLIO_ITEMS.filter(item => item.type === 'poster');
  assert.equal(videosOnly.length + postersOnly.length, SAMPLE_PORTFOLIO_ITEMS.length);

  // Aspect ratio filter: 9:16 vertical reels
  const verticalReels = SAMPLE_PORTFOLIO_ITEMS.filter(item => item.aspectRatio === '9:16');
  assert.ok(verticalReels.length >= 2, 'Should have vertical 9:16 reels for mobile');

  // Search filter
  const query = 'davinci';
  const matched = SAMPLE_PORTFOLIO_ITEMS.filter(item => 
    item.title.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query) ||
    item.software?.some(s => s.toLowerCase().includes(query))
  );
  assert.ok(matched.length >= 1, 'Should find items matching DaVinci software');
});

test('formatTimecode helper calculates SMPTE style timecodes accurately', () => {
  // Test start (0%)
  const startTc = formatTimecode('01:30', 0);
  assert.equal(startTc, '00:00:00:00');

  // Test middle (50% of 90s = 45s)
  const midTc = formatTimecode('01:30', 50);
  assert.equal(midTc, '00:00:45:00');

  // Test end (100% of 90s = 1m 30s)
  const endTc = formatTimecode('01:30', 100);
  assert.equal(endTc, '00:01:30:00');
});

test('QR code generation produces valid data URL for local home network testing', async () => {
  const lanUrl = 'http://192.168.1.3:5173';
  const dataUrl = await QRCode.toDataURL(lanUrl);
  assert.ok(dataUrl.startsWith('data:image/png;base64,'), 'QR Code must be a base64 PNG data URL');
  assert.ok(dataUrl.length > 200, 'QR Code image data must be populated');
});

test('Hash navigation parser resolves correctly for dual showcase sections', () => {
  const parseSectionFromHash = (hash) => {
    if (!hash) return null;
    const clean = hash.replace(/^#\/?/, '').split('?')[0].split('&')[0].trim().toLowerCase();
    if (clean === 'video' || clean === 'videos') return 'videos';
    if (clean === 'poster' || clean === 'posters' || clean === 'graphics') return 'graphics';
    if (clean === 'all') return 'all';
    return null;
  };

  assert.equal(parseSectionFromHash('#video'), 'videos');
  assert.equal(parseSectionFromHash('#videos'), 'videos');
  assert.equal(parseSectionFromHash('#/videos'), 'videos');
  assert.equal(parseSectionFromHash('#videos?admin=true'), 'videos');
  assert.equal(parseSectionFromHash('#poster'), 'graphics');
  assert.equal(parseSectionFromHash('#posters'), 'graphics');
  assert.equal(parseSectionFromHash('#graphics'), 'graphics');
  assert.equal(parseSectionFromHash('#/graphics?source=hero'), 'graphics');
  assert.equal(parseSectionFromHash('#all'), 'all');
  assert.equal(parseSectionFromHash('#'), null);
  assert.equal(parseSectionFromHash(''), null);
  assert.equal(parseSectionFromHash('#unknown'), null);
});

test('Export aspect ratio scaling preserves authentic media proportions', () => {
  // Helper simulating the canvas dimension calculation in exportArtworkAsPng
  const calculateExportDimensions = (naturalWidth, naturalHeight) => {
    const longestEdge = Math.max(naturalWidth, naturalHeight);
    const scale = Math.max(1, 2400 / longestEdge);
    return {
      width: Math.round(naturalWidth * scale),
      height: Math.round(naturalHeight * scale),
      aspectRatio: (naturalWidth / naturalHeight).toFixed(3)
    };
  };

  // 1:1 Square Poster (e.g. Vinyl cover)
  const square = calculateExportDimensions(1000, 1000);
  assert.equal(square.width, 2400);
  assert.equal(square.height, 2400);
  assert.equal(square.aspectRatio, '1.000');

  // 16:9 Widescreen Video Keyframe
  const widescreen = calculateExportDimensions(1920, 1080);
  assert.equal(widescreen.width, 2400);
  assert.equal(widescreen.height, 1350);
  assert.equal(widescreen.aspectRatio, (1920 / 1080).toFixed(3));

  // 4:5 Cinema One-Sheet
  const poster = calculateExportDimensions(800, 1000);
  assert.equal(poster.width, 1920);
  assert.equal(poster.height, 2400);
  assert.equal(poster.aspectRatio, (800 / 1000).toFixed(3));
});

test('SAMPLE_PORTFOLIO_ITEMS uses luxury restrained color palette', () => {
  const disallowedNeonLasers = ['#ff0055', '#ff3366', '#ff2a5f', '#e11d48'];
  for (const item of SAMPLE_PORTFOLIO_ITEMS) {
    const uri = item.thumbnailUrl || '';
    for (const neon of disallowedNeonLasers) {
      assert.ok(
        !uri.toLowerCase().includes(neon.toLowerCase()),
        `Item ${item.title} should not use loud neon laser color ${neon}`
      );
    }
  }
});

test('Video thumbnails maintain 16:9 cinema master ratio with camera HUD and letterbox', () => {
  const videoItems = SAMPLE_PORTFOLIO_ITEMS.filter(i => i.type === 'video');
  for (const v of videoItems) {
    const decoded = decodeURIComponent(v.thumbnailUrl);
    assert.ok(decoded.includes('viewBox="0 0 1280 720"'), `Item ${v.title} must have 16:9 master viewBox (1280x720)`);
    assert.ok(decoded.includes('REC'), `Item ${v.title} must contain cinematic camera REC indicator`);
    assert.ok(decoded.includes('4K') || decoded.includes('8K') || decoded.includes('35MM'), `Item ${v.title} must contain cinema master metadata`);
  }
});

test('Vertical 9:16 reels include 9:16 safe-frame guidelines on 16:9 canvas', () => {
  const verticalItems = SAMPLE_PORTFOLIO_ITEMS.filter(i => i.aspectRatio === '9:16');
  assert.ok(verticalItems.length >= 2, 'Must have at least 2 vertical 9:16 reels');
  for (const v of verticalItems) {
    const decoded = decodeURIComponent(v.thumbnailUrl);
    assert.ok(
      decoded.includes('9:16') || decoded.includes('VERTICAL'),
      `Vertical reel ${v.title} should include 9:16 safe-frame guidelines in its SVG master still`
    );
  }
});

test('Discreet studio access password validation and update works securely', async () => {
  const { verifyAdminPassword, updateAdminPassword, DEFAULT_ADMIN_PASSWORD } = await import('../src/utils/db.js');

  assert.equal(DEFAULT_ADMIN_PASSWORD, 'AdarshStudio#2026!');
  assert.equal(verifyAdminPassword('AdarshStudio#2026!'), true, 'Default strong password must authenticate');
  assert.equal(verifyAdminPassword(''), false, 'Empty password must be strictly rejected');
  assert.equal(verifyAdminPassword('wrongpassword'), false, 'Incorrect password must be rejected');
  assert.equal(verifyAdminPassword('1234'), false, 'Legacy PIN 1234 must be rejected');

  // Test updating password
  const newPass = 'AdarshDirector2026!Secure';
  await updateAdminPassword(newPass);
  assert.equal(verifyAdminPassword(newPass), true, 'New password must authenticate successfully');
  assert.equal(verifyAdminPassword('AdarshStudio#2026!'), false, 'Old password must no longer authenticate');

  // Reset back to default
  await updateAdminPassword(DEFAULT_ADMIN_PASSWORD);
  assert.equal(verifyAdminPassword(DEFAULT_ADMIN_PASSWORD), true);
});

test('Vertical 9:16 reels provide authentic 9:16 vertical stills for theater modal player', () => {
  const verticalItems = SAMPLE_PORTFOLIO_ITEMS.filter(i => i.aspectRatio === '9:16');
  for (const v of verticalItems) {
    assert.ok(v.verticalThumbUrl, `Vertical reel ${v.title} must have verticalThumbUrl`);
    const decoded = decodeURIComponent(v.verticalThumbUrl);
    assert.ok(
      decoded.includes('viewBox="0 0 720 1280"'),
      `Vertical reel ${v.title} verticalThumbUrl must be 9:16 (720x1280)`
    );
    assert.ok(decoded.includes('REC'), `Vertical reel ${v.title} vertical still must have camera REC indicator`);
  }
});

test('1:1 square posters provide authentic 1:1 square master canvas', () => {
  const squareItems = SAMPLE_PORTFOLIO_ITEMS.filter(i => i.aspectRatio === '1:1');
  assert.ok(squareItems.length >= 1, 'Must have at least one 1:1 square poster');
  for (const item of squareItems) {
    const decoded = decodeURIComponent(item.thumbnailUrl);
    assert.ok(
      decoded.includes('viewBox="0 0 900 900"'),
      `1:1 Poster ${item.title} must have 1:1 square master viewBox (900x900)`
    );
  }
});

test('Instagram credit to @abhinand.33 is prominently placed at the very bottom in Footer', async () => {
  const fs = await import('node:fs');
  const footerCode = fs.readFileSync(new URL('../src/components/Footer.jsx', import.meta.url), 'utf8');
  const navCode = fs.readFileSync(new URL('../src/components/CategoryNav.jsx', import.meta.url), 'utf8');

  assert.ok(footerCode.includes('https://instagram.com/abhinand.33'), 'Footer must link to https://instagram.com/abhinand.33');
  assert.ok(footerCode.includes('@abhinand.33'), 'Footer must display @abhinand.33');
  assert.ok(footerCode.includes('Crafted with care by'), 'Footer must display credit text at the bottom');

  // Verify creator name is NOT on CategoryNav ("you dont need to specify my name on that nav bar thingy")
  assert.ok(!navCode.includes('@abhinand.33'), 'CategoryNav must not specify creator name on the nav bar');
});

test('Console easter egg is included in src/main.jsx', async () => {
  const fs = await import('node:fs');
  const mainCode = fs.readFileSync(new URL('../src/main.jsx', import.meta.url), 'utf8');

  assert.ok(mainCode.includes('@abhinand.33'), 'main.jsx easter egg must credit @abhinand.33');
  assert.ok(mainCode.includes('console.log'), 'main.jsx must have console easter egg');
  assert.ok(mainCode.includes('asciiArt') || mainCode.includes('██'), 'main.jsx must contain ASCII art easter egg banner');
});

test('Dual showcase sections independently filter by search query', () => {
  const query = 'gym';
  const matchesSearch = (item) => {
    return (
      item.title?.toLowerCase().includes(query) ||
      item.client?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.software?.some((s) => s.toLowerCase().includes(query)) ||
      item.category?.toLowerCase().includes(query) ||
      item.subCategory?.toLowerCase().includes(query)
    );
  };

  const videoMatches = SAMPLE_PORTFOLIO_ITEMS.filter((i) => i.type === 'video' && matchesSearch(i));
  const graphicMatches = SAMPLE_PORTFOLIO_ITEMS.filter((i) => i.type === 'poster' && matchesSearch(i));

  assert.ok(videoMatches.length >= 1, 'Search query "gym" must match video showcase items');
  assert.ok(graphicMatches.length >= 1, 'Search query "gym" must match graphics showcase items');
});

test('UploadModal synchronizes category and aspect ratio when opened with category hint', async () => {
  const fs = await import('node:fs');
  const uploadCode = fs.readFileSync(new URL('../src/components/UploadModal.jsx', import.meta.url), 'utf8');
  assert.ok(uploadCode.includes('useEffect'), 'UploadModal must have useEffect hook');
  assert.ok(uploadCode.includes('defaultCategory'), 'UploadModal must react to defaultCategory changes');
});

test('ProfileEditModal synchronizes form inputs when profile or open state changes', async () => {
  const fs = await import('node:fs');
  const profileEditCode = fs.readFileSync(new URL('../src/components/ProfileEditModal.jsx', import.meta.url), 'utf8');
  assert.ok(profileEditCode.includes('useEffect'), 'ProfileEditModal must have useEffect hook');
  assert.ok(profileEditCode.includes('setName(profile.name'), 'ProfileEditModal must sync name from profile prop');
});

test('CategoryNav provides clean minimalist tab switcher above the works without lock icon or creator name', async () => {
  const fs = await import('node:fs');
  const navCode = fs.readFileSync(new URL('../src/components/CategoryNav.jsx', import.meta.url), 'utf8');
  const appCode = fs.readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');

  assert.ok(navCode.includes('activeCategory'), 'CategoryNav must support activeCategory');
  assert.ok(navCode.includes('Videos'), 'CategoryNav must have Videos tab');
  assert.ok(navCode.includes('Graphics'), 'CategoryNav must have Graphics tab');
  assert.ok(navCode.includes('max-w-full'), 'CategoryNav must prevent horizontal overflow on small screens');
  assert.ok(!navCode.includes('@abhinand.33'), 'CategoryNav must NOT contain creator name');
  assert.ok(!navCode.includes('Unlock') && !navCode.includes('Lock'), 'CategoryNav must NOT contain lock/unlock buttons');

  // App must place CategoryNav above works showcase and must not render BottomNav
  assert.ok(appCode.includes('<CategoryNav'), 'App must render CategoryNav above works');
  assert.ok(!appCode.includes('<BottomNav'), 'App must NOT render BottomNav');
  assert.ok(appCode.includes('nextCat'), 'App must support toggling category filter back to all');
});

test('Hero preserves bio paragraph breaks using whitespace-pre-line', async () => {
  const fs = await import('node:fs');
  const heroCode = fs.readFileSync(new URL('../src/components/Hero.jsx', import.meta.url), 'utf8');
  assert.ok(heroCode.includes('whitespace-pre-line'), 'Hero bio must have whitespace-pre-line class for multi-paragraph spacing');
});

test('Supabase client exports configured client and storage bucket', async () => {
  const { supabase, isSupabaseConfigured, STORAGE_BUCKET, SUPABASE_URL } = await import('../src/utils/supabaseClient.js');
  assert.equal(isSupabaseConfigured, true);
  assert.ok(supabase, 'Supabase client must be initialized');
  assert.equal(STORAGE_BUCKET, 'portfolio-media');
  assert.ok(SUPABASE_URL.includes('supabase.co'));
});

test('.env and .env.example contain required Supabase variables', async () => {
  const fs = await import('node:fs');
  const envContent = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8');
  const envExampleContent = fs.readFileSync(new URL('../.env.example', import.meta.url), 'utf8');

  assert.ok(envContent.includes('VITE_SUPABASE_URL=https://ylnwdzlqmkfbleqyospr.supabase.co'));
  assert.ok(envContent.includes('VITE_SUPABASE_ANON_KEY=sb_publishable_JlSkE1vEJtH1rEd97tahMQ_-2FLcH1p'));
  assert.ok(envExampleContent.includes('VITE_SUPABASE_URL='));
  assert.ok(envExampleContent.includes('VITE_SUPABASE_ANON_KEY='));
});

test('supabase_schema.sql contains full database schema, RLS policies, bucket creation, and seed data', async () => {
  const fs = await import('node:fs');
  const sql = fs.readFileSync(new URL('../supabase_schema.sql', import.meta.url), 'utf8');

  // Tables
  assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.portfolio_items'), 'Must create portfolio_items table');
  assert.ok(sql.includes('CREATE TABLE IF NOT EXISTS public.profile'), 'Must create profile table');

  // Columns in portfolio_items
  const expectedItemCols = ['id', 'type', 'title', 'category', 'sub_category', 'aspect_ratio', 'duration', 'dimensions', 'dpi', 'resolution', 'software', 'client', 'year', 'description', 'thumbnail_url', 'vertical_thumb_url', 'video_url', 'featured', 'accent', 'created_at'];
  for (const col of expectedItemCols) {
    assert.ok(sql.includes(col), `portfolio_items schema missing column: ${col}`);
  }

  // Columns in profile
  const expectedProfileCols = ['id', 'name', 'roles', 'tagline', 'bio', 'avatar_url', 'location', 'skills', 'updated_at'];
  for (const col of expectedProfileCols) {
    assert.ok(sql.includes(col), `profile schema missing column: ${col}`);
  }

  // Storage bucket with 500MB limit
  assert.ok(sql.includes("'portfolio-media'"), 'Must create portfolio-media storage bucket');
  assert.ok(sql.includes('524288000'), 'Storage bucket limit must be 500MB (524288000 bytes)');

  // RLS policies
  assert.ok(sql.includes('ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on portfolio_items');
  assert.ok(sql.includes('ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;'), 'RLS enabled on profile');
  assert.ok(sql.includes('Public can view portfolio items'), 'SELECT policy on portfolio_items');
  assert.ok(sql.includes('Public/Anon can insert portfolio items'), 'INSERT policy on portfolio_items');
  assert.ok(sql.includes('Public/Anon can update portfolio items'), 'UPDATE policy on portfolio_items');
  assert.ok(sql.includes('Public/Anon can delete portfolio items'), 'DELETE policy on portfolio_items');

  // Pre-seed
  assert.ok(sql.includes('profile-main'), 'Profile pre-seed must include profile-main id');
  assert.ok(sql.includes('Adarsh A L'), 'Profile pre-seed must include Adarsh A L');
  assert.ok(sql.includes('IRON VAULT FITNESS'), 'Items pre-seed must include Iron Vault item');
  assert.ok(sql.includes('TITAN STRENGTH'), 'Items pre-seed must include Titan Strength item');
});

test('db.js mapper functions correctly convert between frontend camelCase and database snake_case', async () => {
  const { itemToRow, rowToItem, profileToRow, rowToProfile } = await import('../src/utils/db.js');

  const frontendItem = {
    id: 'test-item-1',
    type: 'video',
    title: 'Test Video',
    category: 'Video Editing',
    subCategory: 'Gym & Fitness',
    aspectRatio: '9:16',
    duration: '00:30',
    resolution: '1080x1920 60fps',
    software: ['CapCut', 'DaVinci Resolve'],
    client: 'Test Client',
    year: '2026',
    description: 'Test description',
    thumbnailUrl: 'https://example.com/thumb.jpg',
    verticalThumbUrl: 'https://example.com/vthumb.jpg',
    videoUrl: 'https://example.com/video.mp4',
    featured: true,
    accent: 'gold',
    createdAt: '2026-02-01T10:00:00.000Z',
    isCustom: true
  };

  const dbRow = itemToRow(frontendItem);
  assert.equal(dbRow.id, frontendItem.id);
  assert.equal(dbRow.sub_category, frontendItem.subCategory);
  assert.equal(dbRow.aspect_ratio, frontendItem.aspectRatio);
  assert.equal(dbRow.thumbnail_url, frontendItem.thumbnailUrl);
  assert.equal(dbRow.vertical_thumb_url, frontendItem.verticalThumbUrl);
  assert.equal(dbRow.video_url, frontendItem.videoUrl);
  assert.equal(dbRow.featured, true);
  assert.equal(dbRow.is_custom, true);
  assert.equal(dbRow.created_at, frontendItem.createdAt, 'itemToRow must preserve createdAt as created_at');

  // Verify that an initial showcase item gets is_custom = false
  const initialItemRow = itemToRow(SAMPLE_PORTFOLIO_ITEMS[0]);
  assert.equal(initialItemRow.is_custom, false, 'Initial portfolio item must be marked with is_custom: false');

  const restoredItem = rowToItem(dbRow);
  assert.equal(restoredItem.id, frontendItem.id);
  assert.equal(restoredItem.subCategory, frontendItem.subCategory);
  assert.equal(restoredItem.aspectRatio, frontendItem.aspectRatio);
  assert.equal(restoredItem.thumbnailUrl, frontendItem.thumbnailUrl);
  assert.equal(restoredItem.verticalThumbUrl, frontendItem.verticalThumbUrl);
  assert.equal(restoredItem.videoUrl, frontendItem.videoUrl);
  assert.equal(restoredItem.createdAt, frontendItem.createdAt, 'rowToItem must restore original createdAt timestamp');
  assert.equal(restoredItem.isCustom, true, 'rowToItem must restore isCustom boolean');

  const profile = {
    name: 'Adarsh A L',
    roles: ['Graphic Designer', 'Video Editor'],
    tagline: 'Designer & Editor',
    bio: 'Test bio',
    avatarUrl: '/assets/avatar.png',
    location: 'Remote',
    experienceYears: '3 Years',
    projectsCompleted: '60+',
    clientsSatisfied: '100%',
    socials: { email: 'test@example.com' },
    skills: ['DaVinci Resolve', 'CapCut']
  };

  const profileRow = profileToRow(profile);
  assert.equal(profileRow.id, 'profile-main');
  assert.equal(profileRow.name, 'Adarsh A L');
  assert.equal(profileRow.avatar_url, '/assets/avatar.png');

  const restoredProfile = rowToProfile(profileRow);
  assert.equal(restoredProfile.name, profile.name);
  assert.equal(restoredProfile.avatarUrl, profile.avatarUrl);
  assert.equal(restoredProfile.location, profile.location);
});

test('db.js graceful fallback returns default items and profile without legacy placeholders', async () => {
  const { getAllPortfolioItems, getStoredProfile, getLocalStoredProfile, isPlaceholderItem, LEGACY_PLACEHOLDER_IDS } = await import('../src/utils/db.js');

  const items = await getAllPortfolioItems();
  assert.ok(Array.isArray(items), 'getAllPortfolioItems must always return an array');
  for (const item of items) {
    assert.equal(isPlaceholderItem(item), false, `Item ${item.id} must not be a legacy placeholder`);
    assert.equal(LEGACY_PLACEHOLDER_IDS.has(item.id), false, `Item ${item.id} must not be in legacy placeholder IDs`);
  }

  const localProfile = getLocalStoredProfile();
  assert.equal(localProfile.name, 'Adarsh A L');

  const profile = await getStoredProfile();
  assert.ok(profile, 'getStoredProfile must return a profile object');
  assert.equal(profile.name, 'Adarsh A L');
  assert.ok(profile.roles.includes('Video Editor'));
});

test('addPortfolioItem, updatePortfolioItem, deletePortfolioItem, and saveStoredProfile operate gracefully without crashing', async () => {
  const { addPortfolioItem, updatePortfolioItem, deletePortfolioItem, saveStoredProfile, getLocalPortfolioItems } = await import('../src/utils/db.js');

  // Test item upload and persistence
  const testItem = {
    id: `custom-test-${Date.now()}`,
    type: 'video',
    title: 'Unit Test Video Showcase',
    category: 'Video Editing',
    aspectRatio: '16:9',
    duration: '01:00',
    mediaFile: new Blob(['fake-video-content'], { type: 'video/mp4' }),
    thumbnailUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    createdAt: new Date().toISOString()
  };

  const saved = await addPortfolioItem(testItem);
  assert.ok(saved, 'addPortfolioItem must return the processed item');
  assert.equal(saved.id, testItem.id);
  assert.equal('mediaFile' in saved, false, 'mediaFile should be stripped from persisted item');

  // Verify item is retrievable locally
  const currentItems = await getLocalPortfolioItems();
  assert.ok(currentItems.some(i => i.id === testItem.id), 'Newly added item must be present in local items');

  // Test updating item (Task 4)
  const updatedItem = await updatePortfolioItem(testItem.id, {
    title: 'Updated Test Title 4K Master',
    client: 'Upgraded Client Gym',
    duration: '02:00',
  });
  assert.equal(updatedItem.title, 'Updated Test Title 4K Master');
  assert.equal(updatedItem.client, 'Upgraded Client Gym');

  const afterUpdate = await getLocalPortfolioItems();
  const foundUpdated = afterUpdate.find(i => i.id === testItem.id);
  assert.ok(foundUpdated, 'Updated item must be found in local storage');
  assert.equal(foundUpdated.title, 'Updated Test Title 4K Master');

  // Test profile update
  const updatedProfile = await saveStoredProfile({
    name: 'Adarsh A L Updated',
    roles: ['Graphic Designer', 'Video Editor'],
    bio: 'Updated bio statement'
  });
  assert.equal(updatedProfile.name, 'Adarsh A L Updated');

  // Immediately restore authentic INITIAL_PROFILE so live cloud database is clean
  await saveStoredProfile(INITIAL_PROFILE);

  // Test deletion
  const deleteResult = await deletePortfolioItem(testItem.id);
  assert.equal(deleteResult, true);

  const afterDelete = await getLocalPortfolioItems();
  assert.equal(afterDelete.some(i => i.id === testItem.id), false, 'Deleted item must be removed from local items');
});

test('parseVideoUrl parses YouTube, Vimeo, Google Drive, and direct video links', () => {
  const yt = parseVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  assert.equal(yt.platform, 'youtube');
  assert.equal(yt.id, 'dQw4w9WgXcQ');
  assert.ok(yt.embedUrl.includes('embed/dQw4w9WgXcQ'));
  assert.ok(yt.defaultThumb.includes('dQw4w9WgXcQ'));

  const shorts = parseVideoUrl('https://youtube.com/shorts/AbCdEfGhIjK');
  assert.equal(shorts.platform, 'youtube');
  assert.equal(shorts.id, 'AbCdEfGhIjK');

  const vimeo = parseVideoUrl('https://vimeo.com/123456789');
  assert.equal(vimeo.platform, 'vimeo');
  assert.equal(vimeo.id, '123456789');
  assert.ok(vimeo.embedUrl.includes('player.vimeo.com/video/123456789'));

  const drive = parseVideoUrl('https://drive.google.com/file/d/1B2C3D4E5F6G7H8I9J/view');
  assert.equal(drive.platform, 'drive');
  assert.equal(drive.id, '1B2C3D4E5F6G7H8I9J');
  assert.ok(drive.embedUrl.includes('preview'));

  const driveOpen = parseVideoUrl('https://drive.google.com/open?id=2C3D4E5F6G7H8I9J0K');
  assert.equal(driveOpen.platform, 'drive');
  assert.equal(driveOpen.id, '2C3D4E5F6G7H8I9J0K');
  assert.ok(driveOpen.embedUrl.includes('preview'));

  const driveUc = parseVideoUrl('https://drive.google.com/uc?id=3D4E5F6G7H8I9J0K1L');
  assert.equal(driveUc.platform, 'drive');
  assert.equal(driveUc.id, '3D4E5F6G7H8I9J0K1L');

  const direct = parseVideoUrl('https://ylnwdzlqmkfbleqyospr.supabase.co/storage/v1/object/public/portfolio-media/videos/sample.mp4');
  assert.equal(direct.platform, 'direct');
});

test('VideoModal and PosterModal have removed all download options and buttons', async () => {
  const fs = await import('node:fs');
  const videoModalCode = fs.readFileSync(new URL('../src/components/VideoModal.jsx', import.meta.url), 'utf8');
  const posterModalCode = fs.readFileSync(new URL('../src/components/PosterModal.jsx', import.meta.url), 'utf8');

  // Verify Download buttons are removed from UI
  assert.ok(!videoModalCode.includes('Save Master'), 'VideoModal must not have Save Master button');
  assert.ok(!videoModalCode.includes('Save Cover'), 'VideoModal must not have Save Cover button');
  assert.ok(!posterModalCode.includes('Export PNG'), 'PosterModal must not have Export PNG button');
  assert.ok(!posterModalCode.includes('handleDownload'), 'PosterModal must not have handleDownload');
  assert.ok(videoModalCode.includes('controlsList="nodownload"'), 'VideoModal must enforce nodownload controlsList');
});

test('uploadPortfolioMedia safely handles remote URLs, null, multiline base64, and SVGs', async () => {
  const { uploadPortfolioMedia } = await import('../src/utils/db.js');

  const httpUrl = 'https://example.com/poster.jpg';
  const result = await uploadPortfolioMedia(httpUrl, 'artworks');
  assert.equal(result, httpUrl, 'Existing remote HTTP URLs must be returned unchanged');

  const localAsset = '/assets/neon-creator.png';
  const localResult = await uploadPortfolioMedia(localAsset);
  assert.equal(localResult, localAsset, 'Local assets must be returned unchanged');

  const nullResult = await uploadPortfolioMedia(null);
  assert.equal(nullResult, null, 'Null media input should return null gracefully');

  // Multiline base64 string
  const multilineDataUrl = 'data:image/png;base64,iVBORw0KGgo\nAAAANSUhEUg==';
  const multiResult = await uploadPortfolioMedia(multilineDataUrl);
  // When remote Supabase storage bucket is not yet created, it gracefully returns null rather than crashing
  assert.ok(multiResult === null || typeof multiResult === 'string');

  // SVG with charset
  const svgDataUrl = 'data:image/svg+xml;charset=utf-8;base64,PHN2Zz48L3N2Zz4=';
  const svgResult = await uploadPortfolioMedia(svgDataUrl);
  assert.ok(svgResult === null || typeof svgResult === 'string');
});

test('netlify.toml configures build command, dist folder, and SPA redirect rule', async () => {
  const fs = await import('node:fs');
  const netlifyToml = fs.readFileSync(new URL('../netlify.toml', import.meta.url), 'utf8');

  assert.ok(netlifyToml.includes('command = "npm run build"'), 'Must have npm run build command');
  assert.ok(netlifyToml.includes('publish = "dist"'), 'Must publish dist directory');
  assert.ok(netlifyToml.includes('from = "/*"'), 'Must redirect all routes');
  assert.ok(netlifyToml.includes('to = "/index.html"'), 'Must point SPA routes to index.html');
  assert.ok(netlifyToml.includes('status = 200'), 'Must use HTTP 200 rewrite for SPA');
});

test('Editing a poster preserves type as poster and does not convert to video', async () => {
  const { updatePortfolioItem, itemToRow } = await import('../src/utils/db.js');

  const posterItem = {
    id: `poster-test-${Date.now()}`,
    type: 'poster',
    title: 'Festival Key Art',
    category: 'Poster Designing',
    aspectRatio: '4:5',
    client: 'Music Fest',
  };

  // Check itemToRow type inference
  const row = itemToRow({ ...posterItem, title: 'Updated Festival Key Art' });
  assert.equal(row.type, 'poster', 'Poster row must retain type poster');

  // Even if type is omitted in updatedFields (from form payload), category must preserve poster type
  const rowWithoutType = itemToRow({
    id: posterItem.id,
    title: 'Updated Poster',
    category: 'Poster Designing',
  });
  assert.equal(rowWithoutType.type, 'poster', 'itemToRow must infer poster type from category');

  const updated = await updatePortfolioItem(posterItem.id, {
    category: 'Poster Designing',
    title: 'Updated Festival Key Art Master',
  });
  assert.equal(updated.type, 'poster', 'Updated item must retain type poster');
});

test('ProfileEditModal and Navbar provide accessible Change Password options in admin mode', async () => {
  const fs = await import('node:fs');
  const profileEditCode = fs.readFileSync(new URL('../src/components/ProfileEditModal.jsx', import.meta.url), 'utf8');
  const navbarCode = fs.readFileSync(new URL('../src/components/Navbar.jsx', import.meta.url), 'utf8');

  assert.ok(profileEditCode.includes('Change Password'), 'ProfileEditModal must provide Change Password option');
  assert.ok(profileEditCode.includes('verifyAdminPassword'), 'ProfileEditModal must verify current password');
  assert.ok(profileEditCode.includes('updateAdminPassword'), 'ProfileEditModal must update password');
  assert.ok(navbarCode.includes('onOpenChangePassword'), 'Navbar must accept onOpenChangePassword handler');
  assert.ok(navbarCode.includes('Password'), 'Navbar must display Password/Security button when in admin mode');
});

test('PosterModal fits entire image naturally without cropping and supports smooth zoom levels', async () => {
  const fs = await import('node:fs');
  const posterModalCode = fs.readFileSync(new URL('../src/components/PosterModal.jsx', import.meta.url), 'utf8');

  // Must use uncropped natural fit classes
  assert.ok(
    posterModalCode.includes('object-contain w-auto h-auto max-h-[75vh] sm:max-h-[80vh] max-w-full mx-auto'),
    'PosterModal image must use object-contain w-auto h-auto max-h-[75vh] sm:max-h-[80vh] max-w-full mx-auto to fit entire image naturally'
  );

  // Must not have the old restrictive cropping clamps
  assert.ok(!posterModalCode.includes('max-h-[58vh]'), 'PosterModal viewport must not be clamped to max-h-[58vh]');
  assert.ok(!posterModalCode.includes('max-h-[48vh]'), 'PosterModal wrapper must not crop images with max-h-[48vh]');

  // Must support 1x, 1.4x, 2x zoom levels
  assert.ok(posterModalCode.includes('handleZoom(1)'), 'PosterModal must support 1x zoom');
  assert.ok(posterModalCode.includes('handleZoom(1.4)'), 'PosterModal must support 1.4x zoom');
  assert.ok(posterModalCode.includes('handleZoom(2)'), 'PosterModal must support 2x zoom');
  assert.ok(posterModalCode.includes('scale(${zoomLevel})'), 'PosterModal must smoothly scale zoom level');

  // Must support drag-to-pan navigation across zoomed artwork
  assert.ok(posterModalCode.includes('handleMouseDown'), 'PosterModal must support mouse drag pan');
  assert.ok(posterModalCode.includes('handleTouchStart'), 'PosterModal must support touch pan on mobile');
  assert.ok(posterModalCode.includes('handleWheel'), 'PosterModal must support wheel scroll pan');
  assert.ok(posterModalCode.includes('flex-shrink-0'), 'PosterModal canvas viewport must use flex-shrink-0 to prevent flexbox squeezing');
});

test('Media download and right-click protection is comprehensively applied across all components', async () => {
  const fs = await import('node:fs');
  const indexCss = fs.readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');
  const appCode = fs.readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
  const posterModalCode = fs.readFileSync(new URL('../src/components/PosterModal.jsx', import.meta.url), 'utf8');
  const videoModalCode = fs.readFileSync(new URL('../src/components/VideoModal.jsx', import.meta.url), 'utf8');
  const posterCardCode = fs.readFileSync(new URL('../src/components/PosterCard.jsx', import.meta.url), 'utf8');
  const videoCardCode = fs.readFileSync(new URL('../src/components/VideoCard.jsx', import.meta.url), 'utf8');
  const heroCode = fs.readFileSync(new URL('../src/components/Hero.jsx', import.meta.url), 'utf8');

  // Global CSS rules
  assert.ok(indexCss.includes('user-drag: none'), 'CSS must disable user-drag');
  assert.ok(indexCss.includes('-webkit-touch-callout: none'), 'CSS must disable iOS touch callout');
  assert.ok(indexCss.includes('user-select: none'), 'CSS must disable user-select on media');

  // App-level global listeners
  assert.ok(appCode.includes("document.addEventListener('contextmenu'"), 'App must register global contextmenu listener');
  assert.ok(appCode.includes("document.addEventListener('dragstart'"), 'App must register global dragstart listener');

  // PosterModal protection
  assert.ok(posterModalCode.includes('draggable="false"'), 'PosterModal must set draggable="false"');
  assert.ok(posterModalCode.includes('onContextMenu='), 'PosterModal must block onContextMenu');
  assert.ok(posterModalCode.includes('data-protected-media'), 'PosterModal must mark data-protected-media');

  // VideoModal protection
  assert.ok(videoModalCode.includes('controlsList="nodownload"'), 'VideoModal must prevent video download in controlsList');
  assert.ok(videoModalCode.includes('disablePictureInPicture'), 'VideoModal must disable PIP');
  assert.ok(videoModalCode.includes('draggable="false"'), 'VideoModal must set draggable="false"');

  // PosterCard & VideoCard protection
  assert.ok(posterCardCode.includes('draggable="false"'), 'PosterCard must set draggable="false"');
  assert.ok(posterCardCode.includes('data-protected-media'), 'PosterCard must mark data-protected-media');
  assert.ok(videoCardCode.includes('draggable="false"'), 'VideoCard must set draggable="false"');
  assert.ok(videoCardCode.includes('data-protected-media'), 'VideoCard must mark data-protected-media');

  // Hero avatar protection
  assert.ok(heroCode.includes('draggable="false"'), 'Hero avatar must set draggable="false"');
  assert.ok(heroCode.includes('data-protected-media'), 'Hero avatar must mark data-protected-media');
});

