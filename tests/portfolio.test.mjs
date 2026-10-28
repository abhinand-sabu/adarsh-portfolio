import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  INITIAL_PROFILE, 
  INITIAL_PORTFOLIO_ITEMS, 
  createPosterSvgDataUri, 
  createVideoThumbSvgDataUri 
} from '../src/data/defaultPortfolio.js';

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
