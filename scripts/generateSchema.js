import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SAMPLE_PORTFOLIO_ITEMS, INITIAL_PROFILE } from '../src/data/defaultPortfolio.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaFilePath = path.resolve(__dirname, '../supabase_schema.sql');

function escapeSqlString(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

function escapeSqlDollar(str) {
  if (str === null || str === undefined) return 'NULL';
  return `$$${str}$$`;
}

function formatSqlArray(arr) {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return "'{}'::text[]";
  const items = arr.map(item => `'${String(item).replace(/'/g, "''")}'`).join(', ');
  return `ARRAY[${items}]::text[]`;
}

let sql = `-- ============================================================================
-- ADARSH PORTFOLIO - SUPABASE DATABASE SCHEMA & PRE-SEED SCRIPT
-- ============================================================================
-- Project: Adarsh A L | Graphic Designer & Video Editor Portfolio
-- Instructions:
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/ylnwdzlqmkfbleqyospr
-- 2. Go to the "SQL Editor" tab on the left sidebar.
-- 3. Click "New query", paste the entire contents of this file, and click "Run".
-- 4. All tables, storage buckets, RLS policies, and initial showcase items will be created.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. PORTFOLIO ITEMS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('video', 'poster')),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  sub_category TEXT,
  aspect_ratio TEXT,
  duration TEXT,
  dimensions TEXT,
  dpi TEXT,
  resolution TEXT,
  software TEXT[] DEFAULT '{}'::text[],
  client TEXT,
  year TEXT,
  description TEXT,
  thumbnail_url TEXT,
  vertical_thumb_url TEXT,
  video_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  accent TEXT DEFAULT 'gold',
  is_custom BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for category and created_at sorting
CREATE INDEX IF NOT EXISTS idx_portfolio_items_type ON public.portfolio_items(type);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_category ON public.portfolio_items(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_created_at ON public.portfolio_items(created_at DESC);

-- ----------------------------------------------------------------------------
-- 2. CREATOR PROFILE TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile (
  id TEXT PRIMARY KEY DEFAULT 'profile-main',
  name TEXT NOT NULL DEFAULT 'Adarsh A L',
  roles TEXT[] DEFAULT ARRAY['Graphic Designer', 'Video Editor']::text[],
  tagline TEXT DEFAULT 'Graphic Designer & Video Editor',
  bio TEXT,
  avatar_url TEXT DEFAULT '/assets/neon-creator.png',
  location TEXT DEFAULT 'Open for Gigs & Freelance',
  experience_years TEXT DEFAULT 'Active',
  projects_completed TEXT DEFAULT '50+',
  clients_satisfied TEXT DEFAULT '100%',
  socials JSONB DEFAULT '{"email": "adarsh.visuals@gmail.com", "instagram": "https://instagram.com", "youtube": "https://youtube.com", "behance": "https://behance.net", "vimeo": "https://vimeo.com"}'::jsonb,
  skills TEXT[] DEFAULT ARRAY['DaVinci Resolve', 'CapCut', 'Canva', 'AI Workflow', 'Social Media Design', 'Motion & Thumbnails']::text[],
  admin_password TEXT DEFAULT 'AdarshStudio#2026!',
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ----------------------------------------------------------------------------
-- 3. STORAGE BUCKET: portfolio-media
-- ----------------------------------------------------------------------------
-- Ensure storage extension and schema are active
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-media',
  'portfolio-media',
  true,
  524288000, -- 500MB max file size
  ARRAY[
    'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif', 'image/svg+xml', 'image/gif',
    'video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 524288000,
  allowed_mime_types = ARRAY[
    'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/avif', 'image/svg+xml', 'image/gif',
    'video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v'
  ];

-- ----------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
-- Enable RLS on portfolio_items
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view portfolio items" ON public.portfolio_items;
CREATE POLICY "Public can view portfolio items"
ON public.portfolio_items FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Public/Anon can insert portfolio items" ON public.portfolio_items;
CREATE POLICY "Public/Anon can insert portfolio items"
ON public.portfolio_items FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Public/Anon can update portfolio items" ON public.portfolio_items;
CREATE POLICY "Public/Anon can update portfolio items"
ON public.portfolio_items FOR UPDATE
USING (true);

DROP POLICY IF EXISTS "Public/Anon can delete portfolio items" ON public.portfolio_items;
CREATE POLICY "Public/Anon can delete portfolio items"
ON public.portfolio_items FOR DELETE
USING (true);

-- Enable RLS on profile
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view profile" ON public.profile;
CREATE POLICY "Public can view profile"
ON public.profile FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Public/Anon can insert profile" ON public.profile;
CREATE POLICY "Public/Anon can insert profile"
ON public.profile FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Public/Anon can update profile" ON public.profile;
CREATE POLICY "Public/Anon can update profile"
ON public.profile FOR UPDATE
USING (true);

DROP POLICY IF EXISTS "Public/Anon can delete profile" ON public.profile;
CREATE POLICY "Public/Anon can delete profile"
ON public.profile FOR DELETE
USING (true);

-- Storage bucket access policies on storage.objects
DROP POLICY IF EXISTS "Public media read access" ON storage.objects;
CREATE POLICY "Public media read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "Public/Anon media upload access" ON storage.objects;
CREATE POLICY "Public/Anon media upload access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "Public/Anon media update access" ON storage.objects;
CREATE POLICY "Public/Anon media update access"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio-media')
WITH CHECK (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "Public/Anon media delete access" ON storage.objects;
CREATE POLICY "Public/Anon media delete access"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-media');

-- ----------------------------------------------------------------------------
-- 5. PRE-SEED INITIAL CREATOR PROFILE
-- ----------------------------------------------------------------------------
INSERT INTO public.profile (
  id, name, roles, tagline, bio, avatar_url, location, experience_years, projects_completed, clients_satisfied, socials, skills, admin_password
) VALUES (
  'profile-main',
  ${escapeSqlString(INITIAL_PROFILE.name)},
  ${formatSqlArray(INITIAL_PROFILE.roles)},
  ${escapeSqlString(INITIAL_PROFILE.tagline)},
  ${escapeSqlDollar(INITIAL_PROFILE.bio)},
  ${escapeSqlString(INITIAL_PROFILE.avatarUrl)},
  ${escapeSqlString(INITIAL_PROFILE.location)},
  ${escapeSqlString(INITIAL_PROFILE.experienceYears)},
  ${escapeSqlString(INITIAL_PROFILE.projectsCompleted)},
  ${escapeSqlString(INITIAL_PROFILE.clientsSatisfied)},
  ${escapeSqlDollar(JSON.stringify(INITIAL_PROFILE.socials))}::jsonb,
  ${formatSqlArray(INITIAL_PROFILE.skills)},
  'AdarshStudio#2026!'
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  roles = EXCLUDED.roles,
  tagline = EXCLUDED.tagline,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url,
  location = EXCLUDED.location,
  experience_years = EXCLUDED.experience_years,
  projects_completed = EXCLUDED.projects_completed,
  clients_satisfied = EXCLUDED.clients_satisfied,
  socials = EXCLUDED.socials,
  skills = EXCLUDED.skills,
  admin_password = COALESCE(EXCLUDED.admin_password, public.profile.admin_password),
  updated_at = timezone('utc'::text, now());

-- ----------------------------------------------------------------------------
-- 6. PRE-SEED DEFAULT PORTFOLIO ITEMS (Videos & Posters)
-- ----------------------------------------------------------------------------
`;

for (const item of SAMPLE_PORTFOLIO_ITEMS) {
  sql += `
INSERT INTO public.portfolio_items (
  id, type, title, category, sub_category, aspect_ratio, duration, dimensions, dpi, resolution,
  software, client, year, description, thumbnail_url, vertical_thumb_url, video_url, image_url,
  featured, accent, is_custom
) VALUES (
  ${escapeSqlString(item.id)},
  ${escapeSqlString(item.type)},
  ${escapeSqlString(item.title)},
  ${escapeSqlString(item.category)},
  ${escapeSqlString(item.subCategory)},
  ${escapeSqlString(item.aspectRatio)},
  ${escapeSqlString(item.duration)},
  ${escapeSqlString(item.dimensions)},
  ${escapeSqlString(item.dpi)},
  ${escapeSqlString(item.resolution)},
  ${formatSqlArray(item.software)},
  ${escapeSqlString(item.client)},
  ${escapeSqlString(item.year)},
  ${escapeSqlDollar(item.description)},
  ${escapeSqlDollar(item.thumbnailUrl)},
  ${escapeSqlDollar(item.verticalThumbUrl)},
  ${escapeSqlString(item.videoUrl)},
  ${escapeSqlDollar(item.imageUrl)},
  ${item.featured ? 'true' : 'false'},
  ${escapeSqlString(item.accent || 'gold')},
  false
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  aspect_ratio = EXCLUDED.aspect_ratio,
  duration = EXCLUDED.duration,
  dimensions = EXCLUDED.dimensions,
  dpi = EXCLUDED.dpi,
  resolution = EXCLUDED.resolution,
  software = EXCLUDED.software,
  client = EXCLUDED.client,
  year = EXCLUDED.year,
  description = EXCLUDED.description,
  thumbnail_url = EXCLUDED.thumbnail_url,
  vertical_thumb_url = EXCLUDED.vertical_thumb_url,
  video_url = EXCLUDED.video_url,
  image_url = EXCLUDED.image_url,
  featured = EXCLUDED.featured,
  accent = EXCLUDED.accent;
`;
}

fs.writeFileSync(schemaFilePath, sql, 'utf8');
console.log(`Successfully generated ${schemaFilePath} (${sql.length} bytes)`);
