// Default Portfolio Data for Neon Creator
// Dual role: Graphic Designer & Video Editor
// Premium visual placeholders with rich metadata, cinematic descriptions, and tags

export const INITIAL_PROFILE = {
  name: "Neon Creator",
  roles: ["Graphic Designer", "Video Editor"],
  tagline: "Crafting High-Octane Visuals, Cinematic Edits & Iconic Key Art",
  bio: "Visual alchemist specializing in high-impact video editing, rhythm-synced motion, and high-fashion cyber-noir graphic design. Blending dark red & deep blue atmospheres with liquid gold and silver metallic aesthetics.",
  avatarUrl: "/assets/neon-creator.png",
  location: "Global / Remote",
  experienceYears: "6+ Years",
  projectsCompleted: "140+",
  clientsSatisfied: "85+",
  socials: {
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    behance: "https://behance.net",
    vimeo: "https://vimeo.com",
    email: "creator@neonstudio.design"
  },
  skills: [
    "Premiere Pro", "After Effects", "DaVinci Resolve", "Cinema 4D", 
    "Photoshop", "Illustrator", "Midjourney Pro", "Sound Design"
  ]
};

// High-fidelity SVG generators for video thumbnails and poster artwork
// so they look stunning, sharp, and load offline on any device immediately.

export const createPosterSvgDataUri = (title, subtitle, primaryColor, accentColor, motif = 'geometric') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#050814" />
        <stop offset="40%" stop-color="${primaryColor}" />
        <stop offset="100%" stop-color="#02040a" />
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFF3D6" />
        <stop offset="50%" stop-color="#F5D061" />
        <stop offset="100%" stop-color="#9E6B18" />
      </linearGradient>
      <linearGradient id="silver" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="50%" stop-color="#CBD5E1" />
        <stop offset="100%" stop-color="#64748B" />
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="${accentColor}" stop-opacity="0"/>
      </radialGradient>
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.07 0" />
      </filter>
    </defs>
    
    <!-- Base Background -->
    <rect width="800" height="1100" fill="url(#bg)" />
    <rect width="800" height="1100" fill="url(#glow)" />
    
    <!-- Grid overlay -->
    <g opacity="0.15" stroke="#FFFFFF" stroke-width="0.5">
      <line x1="100" y1="0" x2="100" y2="1100"/>
      <line x1="700" y1="0" x2="700" y2="1100"/>
      <line x1="0" y1="150" x2="800" y2="150"/>
      <line x1="0" y1="950" x2="800" y2="950"/>
      <circle cx="400" cy="480" r="280" fill="none" stroke-dasharray="4,4"/>
      <circle cx="400" cy="480" r="190" fill="none"/>
    </g>

    <!-- Artistic Centerpiece -->
    <g transform="translate(400, 480)">
      ${motif === 'cinema' ? `
        <!-- Cinema Star/Shield -->
        <polygon points="0,-180 50,-50 180,0 50,50 0,180 -50,50 -180,0 -50,-50" fill="none" stroke="url(#gold)" stroke-width="3"/>
        <circle cx="0" cy="0" r="90" fill="none" stroke="url(#silver)" stroke-width="1.5" stroke-dasharray="6,4"/>
        <polygon points="0,-100 25,-25 100,0 25,25 0,100 -25,25 -100,0 -25,-25" fill="${accentColor}" fill-opacity="0.25"/>
      ` : motif === 'space' ? `
        <!-- Orbital Planets & Rings -->
        <circle cx="0" cy="0" r="110" fill="none" stroke="url(#gold)" stroke-width="2"/>
        <ellipse cx="0" cy="0" rx="220" ry="70" fill="none" stroke="url(#silver)" stroke-width="2" transform="rotate(-25)"/>
        <circle cx="0" cy="0" r="70" fill="${primaryColor}" stroke="url(#gold)" stroke-width="3"/>
        <circle cx="-130" cy="-60" r="18" fill="url(#silver)"/>
      ` : motif === 'fashion' ? `
        <!-- Monolith Minimalist Shape -->
        <rect x="-110" y="-160" width="220" height="320" fill="none" stroke="url(#silver)" stroke-width="2"/>
        <rect x="-80" y="-130" width="160" height="260" fill="url(#gold)" fill-opacity="0.2" stroke="url(#gold)" stroke-width="1.5"/>
        <line x1="-140" y1="0" x2="140" y2="0" stroke="url(#gold)" stroke-width="1"/>
      ` : `
        <!-- Abstract Cyber Prism -->
        <polygon points="0,-150 130,75 -130,75" fill="none" stroke="url(#gold)" stroke-width="3"/>
        <polygon points="0,150 130,-75 -130,-75" fill="none" stroke="url(#silver)" stroke-width="2"/>
        <circle cx="0" cy="0" r="45" fill="${accentColor}" fill-opacity="0.4"/>
      `}
    </g>

    <!-- Noise texture layer -->
    <rect width="800" height="1100" filter="url(#noise)" opacity="0.8" />

    <!-- Poster Typography -->
    <text x="100" y="120" font-family="'Syne', 'Plus Jakarta Sans', sans-serif" font-size="16" letter-spacing="8" fill="#F5D061" font-weight="700">LIMITED EDITION PRINT // VOL. 04</text>
    <text x="700" y="120" font-family="'Space Grotesk', monospace" font-size="14" letter-spacing="4" fill="#94A3B8" text-anchor="end">EST. 2026</text>

    <!-- Main Title -->
    <text x="400" y="850" font-family="'Cinzel', serif" font-size="44" font-weight="900" letter-spacing="6" fill="#FFFFFF" text-anchor="middle">${title}</text>
    <text x="400" y="895" font-family="'Space Grotesk', monospace" font-size="18" font-weight="500" letter-spacing="10" fill="#E5A93C" text-anchor="middle">${subtitle}</text>

    <!-- Metadata Bottom -->
    <line x1="100" y1="930" x2="700" y2="930" stroke="rgba(245,208,97,0.3)" stroke-width="1"/>
    <text x="100" y="975" font-family="'Space Grotesk', monospace" font-size="12" letter-spacing="3" fill="#64748B">DIRECTOR'S CUT</text>
    <text x="100" y="995" font-family="'Space Grotesk', monospace" font-size="13" letter-spacing="2" fill="#CBD5E1">NEON CREATIVE STUDIO</text>
    <text x="700" y="975" font-family="'Space Grotesk', monospace" font-size="12" letter-spacing="3" fill="#64748B" text-anchor="end">COLOR PALETTE</text>
    <text x="700" y="995" font-family="'Space Grotesk', monospace" font-size="13" letter-spacing="2" fill="#F5D061" text-anchor="end">GOLD &amp; DARK RUBY</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const createVideoThumbSvgDataUri = (title, duration, tag, primaryColor, accentColor) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
    <defs>
      <linearGradient id="vidBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#030712" />
        <stop offset="50%" stop-color="${primaryColor}" />
        <stop offset="100%" stop-color="#050814" />
      </linearGradient>
      <radialGradient id="vidGlow" cx="60%" cy="40%" r="60%">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="goldText" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="60%" stop-color="#F5D061" />
        <stop offset="100%" stop-color="#E5A93C" />
      </linearGradient>
    </defs>

    <rect width="1280" height="720" fill="url(#vidBg)"/>
    <rect width="1280" height="720" fill="url(#vidGlow)"/>

    <!-- Subtle timeline lines & waveform -->
    <g opacity="0.25">
      <line x1="80" y1="200" x2="1200" y2="200" stroke="#CBD5E1" stroke-dasharray="8,8"/>
      <line x1="80" y1="520" x2="1200" y2="520" stroke="#CBD5E1" stroke-dasharray="8,8"/>
      <!-- Audio bars -->
      <path d="M 120 500 L 120 460 M 135 500 L 135 440 M 150 500 L 150 470 M 165 500 L 165 420 M 180 500 L 180 480 M 195 500 L 195 430 M 210 500 L 210 450" stroke="#38BDF8" stroke-width="4" stroke-linecap="round"/>
    </g>

    <!-- Cinematic Center Play Button -->
    <g transform="translate(640, 320)">
      <circle cx="0" cy="0" r="64" fill="rgba(11, 17, 34, 0.75)" stroke="#F5D061" stroke-width="3"/>
      <polygon points="-14,-24 24,0 -14,24" fill="#FFFFFF"/>
      <circle cx="0" cy="0" r="76" fill="none" stroke="rgba(245, 208, 97, 0.3)" stroke-width="1.5" stroke-dasharray="10,6"/>
    </g>

    <!-- Aspect Badge -->
    <rect x="80" y="60" width="160" height="36" rx="18" fill="rgba(245, 208, 97, 0.15)" stroke="#F5D061" stroke-width="1"/>
    <text x="160" y="84" font-family="'Space Grotesk', sans-serif" font-size="14" font-weight="700" fill="#F5D061" text-anchor="middle" letter-spacing="2">${tag.toUpperCase()}</text>

    <!-- Duration Badge -->
    <rect x="1100" y="60" width="100" height="36" rx="6" fill="rgba(0, 0, 0, 0.8)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
    <text x="1150" y="84" font-family="'Space Grotesk', monospace" font-size="14" font-weight="600" fill="#FFFFFF" text-anchor="middle">${duration}</text>

    <!-- Title and Subtitle -->
    <text x="80" y="610" font-family="'Syne', sans-serif" font-size="36" font-weight="800" fill="url(#goldText)" letter-spacing="2">${title}</text>
    <text x="80" y="650" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="500" fill="#94A3B8">Cinematic Grade • Rhythm Cut • Sound Design • 4K Master</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const INITIAL_PORTFOLIO_ITEMS = [
  // ================= VIDEO EDITING ITEMS =================
  {
    id: "vid-1",
    type: "video",
    title: "CYBERPUNK 2099 - Cinematic Trailer",
    category: "Video Editing",
    subCategory: "Cinematic & Trailers",
    aspectRatio: "16:9",
    duration: "01:45",
    resolution: "4K UHD 60fps",
    software: ["DaVinci Resolve", "Premiere Pro", "After Effects"],
    client: "Nebula Games Studios",
    year: "2026",
    description: "High-octane pacing, custom glitch transitions, dynamic speed ramping, and heavy filmic color grading with dark ruby and cyan hues.",
    thumbnailUrl: createVideoThumbSvgDataUri("CYBERPUNK 2099", "01:45", "Cinematic", "#2A0815", "#E11D48"),
    videoUrl: null, // Will use interactive player simulator or custom uploaded file
    featured: true,
    accent: "gold"
  },
  {
    id: "vid-2",
    type: "video",
    title: "VELOCITY X - Hypercar Commercial Reel",
    category: "Video Editing",
    subCategory: "Reels & Commercials",
    aspectRatio: "9:16",
    duration: "00:42",
    resolution: "4K Vertical",
    software: ["Premiere Pro", "Blender 3D", "Soundly"],
    client: "Apex Automobili",
    year: "2026",
    description: "Rhythm-synced cuts with custom engine acoustics and 3D camera tracking. Tailored for mobile Instagram Reels & TikTok engagement.",
    thumbnailUrl: createVideoThumbSvgDataUri("VELOCITY X // REEL", "00:42", "9:16 Vertical", "#06182A", "#38BDF8"),
    videoUrl: null,
    featured: true,
    accent: "silver"
  },
  {
    id: "vid-3",
    type: "video",
    title: "MIDNIGHT DYSFUNCTION - Music Video",
    category: "Video Editing",
    subCategory: "Music Videos",
    aspectRatio: "16:9",
    duration: "03:15",
    resolution: "4K DCI Anamorphic",
    software: ["DaVinci Resolve Studio", "After Effects"],
    client: "Sony Music / Neon Records",
    year: "2025",
    description: "Multi-layered kinetic typography, custom retro halation, optical flow slow motion, and stylized film burns.",
    thumbnailUrl: createVideoThumbSvgDataUri("MIDNIGHT DYSFUNCTION", "03:15", "Music Video", "#1A0626", "#F5D061"),
    videoUrl: null,
    featured: false,
    accent: "gold"
  },
  {
    id: "vid-4",
    type: "video",
    title: "OBSIDIAN - Luxury Watch Brand Film",
    category: "Video Editing",
    subCategory: "Reels & Commercials",
    aspectRatio: "16:9",
    duration: "01:10",
    resolution: "4K ProRes 4444",
    software: ["Premiere Pro", "DaVinci Resolve"],
    client: "Kronos Geneva",
    year: "2025",
    description: "Ultra-sleek macro editing, tactile sound design, liquid gold lighting balance, and high-fashion micro-cuts.",
    thumbnailUrl: createVideoThumbSvgDataUri("OBSIDIAN LUXURY", "01:10", "Commercial", "#0C0F1D", "#E2E8F0"),
    videoUrl: null,
    featured: true,
    accent: "silver"
  },
  {
    id: "vid-5",
    type: "video",
    title: "TOKYO DRIFT REVISION - Viral Reel",
    category: "Video Editing",
    subCategory: "Reels & Commercials",
    aspectRatio: "9:16",
    duration: "00:28",
    resolution: "1080x1920 60fps",
    software: ["CapCut Pro", "After Effects", "Premiere"],
    client: "Street Syndicate",
    year: "2026",
    description: "Viral hook pacing, audio bass drops synced down to individual frames, custom motion blur zooms and red trail VFX.",
    thumbnailUrl: createVideoThumbSvgDataUri("TOKYO DRIFT // SYNC", "00:28", "9:16 Vertical", "#2B0B14", "#FF3366"),
    videoUrl: null,
    featured: false,
    accent: "gold"
  },
  {
    id: "vid-6",
    type: "video",
    title: "NEO TOKYO DOCUMENTARY - Mini Doc",
    category: "Video Editing",
    subCategory: "Cinematic & Trailers",
    aspectRatio: "16:9",
    duration: "04:30",
    resolution: "4K Film Print",
    software: ["Premiere Pro", "DaVinci Resolve", "Izotope RX"],
    client: "NHK World / Indie Doc",
    year: "2025",
    description: "Deep narrative storytelling with multi-track ambient soundscapes, archival film grading, and clean subtitling.",
    thumbnailUrl: createVideoThumbSvgDataUri("NEO TOKYO DOC", "04:30", "Mini Doc", "#061A29", "#38BDF8"),
    videoUrl: null,
    featured: false,
    accent: "silver"
  },

  // ================= POSTER DESIGNING ITEMS =================
  {
    id: "pos-1",
    type: "poster",
    title: "SYNTHESIS: THE RESISTANCE",
    category: "Poster Designing",
    subCategory: "Movie & Key Art",
    aspectRatio: "4:5",
    dimensions: "27\" x 40\" (Cinema One-Sheet)",
    dpi: "300 DPI CMYK Ready",
    software: ["Photoshop", "Illustrator", "Blender"],
    client: "Warner Bros Indie / Pitch Art",
    year: "2026",
    description: "Cyber-noir cinematic feature film poster featuring high-contrast gold metallic iconography set against a deep crimson nebula.",
    thumbnailUrl: createPosterSvgDataUri("SYNTHESIS", "THE RESISTANCE", "#3B0713", "#E11D48", "cinema"),
    imageUrl: createPosterSvgDataUri("SYNTHESIS", "THE RESISTANCE", "#3B0713", "#E11D48", "cinema"),
    featured: true,
    accent: "gold"
  },
  {
    id: "pos-2",
    type: "poster",
    title: "ECHOES OF THE COSMOS",
    category: "Poster Designing",
    subCategory: "Music & Festivals",
    aspectRatio: "4:5",
    dimensions: "18\" x 24\" Screenprint",
    dpi: "300 DPI Fine Art Print",
    software: ["Photoshop", "Cinema 4D"],
    client: "Sonar Sound Festival",
    year: "2026",
    description: "Deep space electro-ambient festival visual identity with silver metallic celestial rings and midnight sapphire glow.",
    thumbnailUrl: createPosterSvgDataUri("ECHOES", "SONAR FESTIVAL 2026", "#081536", "#38BDF8", "space"),
    imageUrl: createPosterSvgDataUri("ECHOES", "SONAR FESTIVAL 2026", "#081536", "#38BDF8", "space"),
    featured: true,
    accent: "silver"
  },
  {
    id: "pos-3",
    type: "poster",
    title: "AURA APPAREL - SS26 HAUTE COUTURE",
    category: "Poster Designing",
    subCategory: "Fashion & Editorial",
    aspectRatio: "4:5",
    dimensions: "24\" x 36\" Billboard Print",
    dpi: "300 DPI Pantone Spot",
    software: ["InDesign", "Photoshop", "Lightroom"],
    client: "Maison Aura Paris",
    year: "2026",
    description: "Swiss modernist typographic hierarchy with warm gold foil stamping, brutalist editorial framing, and sleek dark textures.",
    thumbnailUrl: createPosterSvgDataUri("AURA", "HAUTE COUTURE SS26", "#1C0D02", "#F5D061", "fashion"),
    imageUrl: createPosterSvgDataUri("AURA", "HAUTE COUTURE SS26", "#1C0D02", "#F5D061", "fashion"),
    featured: true,
    accent: "gold"
  },
  {
    id: "pos-4",
    type: "poster",
    title: "HYPERDRIVE CHAMPIONSHIP",
    category: "Poster Designing",
    subCategory: "Movie & Key Art",
    aspectRatio: "4:5",
    dimensions: "20\" x 30\" Event Poster",
    dpi: "300 DPI RGB / CMYK",
    software: ["Photoshop", "Illustrator"],
    client: "Apex Esports League",
    year: "2025",
    description: "High-energy esports key visual with neon light trails, chrome typography, and deep crimson speed lines.",
    thumbnailUrl: createPosterSvgDataUri("HYPERDRIVE", "ESPORTS FINALS", "#2D0812", "#FF2A5F", "geometric"),
    imageUrl: createPosterSvgDataUri("HYPERDRIVE", "ESPORTS FINALS", "#2D0812", "#FF2A5F", "geometric"),
    featured: false,
    accent: "gold"
  },
  {
    id: "pos-5",
    type: "poster",
    title: "RETROGRADE VIBES // VINYL COVER",
    category: "Poster Designing",
    subCategory: "Music & Festivals",
    aspectRatio: "1:1",
    dimensions: "12\" x 12\" Vinyl Gatefold",
    dpi: "300 DPI Matte Finish",
    software: ["Illustrator", "Photoshop"],
    client: "Retrowave Collective",
    year: "2025",
    description: "Vintage halftone lithograph styling with chrome metallic lettering and dual-tone ruby and cobalt gradient map.",
    thumbnailUrl: createPosterSvgDataUri("RETROGRADE", "DELUXE EDITION VINYL", "#0B1528", "#60A5FA", "geometric"),
    imageUrl: createPosterSvgDataUri("RETROGRADE", "DELUXE EDITION VINYL", "#0B1528", "#60A5FA", "geometric"),
    featured: false,
    accent: "silver"
  },
  {
    id: "pos-6",
    type: "poster",
    title: "METROPOLIS ARCHIVES",
    category: "Poster Designing",
    subCategory: "Fashion & Editorial",
    aspectRatio: "4:5",
    dimensions: "A1 (594 x 841 mm)",
    dpi: "300 DPI Architectural Print",
    software: ["Photoshop", "AutoCAD", "Illustrator"],
    client: "Tokyo Biennale of Design",
    year: "2025",
    description: "Monolithic brutalist grid composition exploring futuristic urban density with brushed steel accents and obsidian depths.",
    thumbnailUrl: createPosterSvgDataUri("METROPOLIS", "ARCHITECTURAL BIENNALE", "#080C14", "#E2E8F0", "geometric"),
    imageUrl: createPosterSvgDataUri("METROPOLIS", "ARCHITECTURAL BIENNALE", "#080C14", "#E2E8F0", "geometric"),
    featured: false,
    accent: "silver"
  }
];
