import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  INITIAL_PROFILE, 
  INITIAL_PORTFOLIO_ITEMS, 
  createPosterSvgDataUri, 
  createVideoThumbSvgDataUri 
} from '../src/data/defaultPortfolio.js';
import { formatTimecode } from '../src/utils/mediaUtils.js';
import QRCode from 'qrcode';

test('INITIAL_PROFILE contains required roles and avatar', () => {
  assert.equal(INITIAL_PROFILE.name, 'Neon Creator');
  assert.ok(INITIAL_PROFILE.roles.includes('Graphic Designer'), 'Must include Graphic Designer role');
  assert.ok(INITIAL_PROFILE.roles.includes('Video Editor'), 'Must include Video Editor role');
  assert.ok(INITIAL_PROFILE.avatarUrl.includes('neon-creator.png'), 'Must reference neon-creator avatar asset');
  assert.ok(INITIAL_PROFILE.skills.length >= 5, 'Must have diverse creative software skills');
});

test('INITIAL_PORTFOLIO_ITEMS has both Video Editing and Poster Designing items', () => {
  const videoItems = INITIAL_PORTFOLIO_ITEMS.filter(i => i.type === 'video');
  const posterItems = INITIAL_PORTFOLIO_ITEMS.filter(i => i.type === 'poster');

  assert.ok(videoItems.length >= 4, `Expected at least 4 video items, got ${videoItems.length}`);
  assert.ok(posterItems.length >= 4, `Expected at least 4 poster items, got ${posterItems.length}`);

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
  const videosOnly = INITIAL_PORTFOLIO_ITEMS.filter(item => item.type === 'video');
  const postersOnly = INITIAL_PORTFOLIO_ITEMS.filter(item => item.type === 'poster');
  assert.equal(videosOnly.length + postersOnly.length, INITIAL_PORTFOLIO_ITEMS.length);

  // Aspect ratio filter: 9:16 vertical reels
  const verticalReels = INITIAL_PORTFOLIO_ITEMS.filter(item => item.aspectRatio === '9:16');
  assert.ok(verticalReels.length >= 2, 'Should have vertical 9:16 reels for mobile');

  // Search filter
  const query = 'davinci';
  const matched = INITIAL_PORTFOLIO_ITEMS.filter(item => 
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

test('Hash navigation parser resolves correctly', () => {
  const parseCategoryFromHash = (hash) => {
    const clean = hash.replace(/^#\/?/, '').toLowerCase();
    if (clean === 'video' || clean === 'poster') return clean;
    return 'all';
  };

  assert.equal(parseCategoryFromHash('#video'), 'video');
  assert.equal(parseCategoryFromHash('#/video'), 'video');
  assert.equal(parseCategoryFromHash('#poster'), 'poster');
  assert.equal(parseCategoryFromHash('#/poster'), 'poster');
  assert.equal(parseCategoryFromHash('#all'), 'all');
  assert.equal(parseCategoryFromHash('#'), 'all');
  assert.equal(parseCategoryFromHash(''), 'all');
  assert.equal(parseCategoryFromHash('#unknown'), 'all');
});
