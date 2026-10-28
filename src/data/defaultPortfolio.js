// Default Portfolio Data for Adarsh A L
// Dual role: Graphic Designer & Video Editor
// Authentic freelance visual content for gyms, small businesses, creators & brands

export const INITIAL_PROFILE = {
  name: "Adarsh A L",
  roles: ["Graphic Designer", "Video Editor"],
  tagline: "Graphic Designer & Video Editor",
  bio: "I’m a young graphic designer and video editor focused on creating clean, engaging and modern visual content. I mainly work on social media graphics, promotional posters, advertisements, thumbnails and video editing.\n\nI use DaVinci Resolve, Canva and CapCut to create and edit visual content. I also use AI tools to improve my creative workflow, explore ideas and make my final work better and more effective. I’m currently building my freelance portfolio and looking to work with gyms, small businesses, creators, brands and other clients who need quality visual content.",
  avatarUrl: "/assets/neon-creator.png",
  location: "Open for Gigs & Freelance",
  experienceYears: "Active",
  projectsCompleted: "50+",
  clientsSatisfied: "100%",
  socials: {
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    behance: "https://behance.net",
    vimeo: "https://vimeo.com",
    email: "adarsh.visuals@gmail.com"
  },
  skills: [
    "DaVinci Resolve", "CapCut", "Canva", "AI Workflow", 
    "Social Media Design", "Motion & Thumbnails"
  ]
};

// ============================================================================
// RICH VIDEO THUMBNAIL GENERATORS (Uniform 16:9 Master Aspect Ratio)
// ============================================================================

export const createVideoThumbSvgDataUri = (title, duration, tag, primaryColor, accentColor, sceneType = 'fitness') => {
  const commonDefs = `
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#040508" />
        <stop offset="50%" stop-color="${primaryColor || '#140508'}" />
        <stop offset="100%" stop-color="#020305" />
      </linearGradient>
      <linearGradient id="goldSheen" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="50%" stop-color="#DFBA73" />
        <stop offset="100%" stop-color="#C5A059" />
      </linearGradient>
      <linearGradient id="silverSheen" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="60%" stop-color="#CBD5E1" />
        <stop offset="100%" stop-color="#94A3B8" />
      </linearGradient>
      <radialGradient id="centerFlare" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${accentColor || '#DFBA73'}" stop-opacity="0.55"/>
        <stop offset="60%" stop-color="${accentColor || '#DFBA73'}" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="cyanFlare" cx="60%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.45"/>
        <stop offset="70%" stop-color="#0284C7" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <filter id="filmGrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.04 0" />
      </filter>
    </defs>
  `;

  // Letterbox Cinema Matte bars (2.39:1 scope overlay with Creator Camera HUD)
  const letterboxBars = `
    <!-- Cinema Scope Letterbox Bars -->
    <rect x="0" y="0" width="1280" height="46" fill="#040508"/>
    <rect x="0" y="674" width="1280" height="46" fill="#040508"/>
    
    <!-- Camera Recording HUD Top -->
    <g transform="translate(40, 28)">
      <circle cx="8" cy="0" r="5" fill="#EF4444"/>
      <text x="22" y="4" font-family="'Space Grotesk', monospace" font-size="11" font-weight="700" fill="#EF4444" letter-spacing="2">REC</text>
      <text x="75" y="4" font-family="'Space Grotesk', monospace" font-size="11" font-weight="600" fill="#E2E8F0" letter-spacing="1">00:00:28:12</text>
      <text x="640" y="4" font-family="'Space Grotesk', monospace" font-size="10" font-weight="500" fill="#94A3B8" text-anchor="middle" letter-spacing="3">4K UHD • 60 FPS • DAVINCI COLOR</text>
      <text x="1200" y="4" font-family="'Space Grotesk', monospace" font-size="11" font-weight="700" fill="#DFBA73" text-anchor="end" letter-spacing="2">${duration}</text>
    </g>

    <!-- Lower-Third Frame Metadata -->
    <g transform="translate(40, 700)">
      <text x="0" y="4" font-family="'Cinzel', serif" font-size="12" font-weight="700" fill="#FFFFFF" letter-spacing="2">${title.toUpperCase()}</text>
      <text x="1200" y="4" font-family="'Space Grotesk', monospace" font-size="10" font-weight="500" fill="#64748B" text-anchor="end" letter-spacing="2">EDITED &amp; GRADED BY ADARSH A L // CAPCUT • DAVINCI</text>
    </g>
  `;

  const cleanTitle = (title || '').toUpperCase();
  let sceneContent = '';

  if (cleanTitle.includes('FITNESS') || cleanTitle.includes('GYM') || sceneType === 'fitness') {
    // 1. High-Energy Fitness / Gym Hype Reel (with 9:16 vertical safe framing)
    sceneContent = `
      <!-- Dark Gym Industrial Atmosphere -->
      <rect width="1280" height="720" fill="url(#bgGrad)"/>
      <circle cx="640" cy="360" r="340" fill="#3B0A11" opacity="0.5"/>

      <!-- Athletic Red / Gold Speed Streaks -->
      <g opacity="0.6">
        <line x1="160" y1="120" x2="1120" y2="600" stroke="#DC2626" stroke-width="2" stroke-dasharray="16,24"/>
        <line x1="200" y1="100" x2="1160" y2="580" stroke="#DFBA73" stroke-width="1.5" stroke-dasharray="8,16"/>
        <line x1="120" y1="600" x2="1080" y2="120" stroke="#DC2626" stroke-width="2" stroke-dasharray="16,24"/>
      </g>

      <!-- Centerpiece: Heavy Barbell & Powerlifting Plates Silhouette -->
      <g transform="translate(640, 360)">
        <!-- Barbell Bar -->
        <rect x="-380" y="-8" width="760" height="16" rx="4" fill="#1E293B" stroke="#DFBA73" stroke-width="1.5"/>
        
        <!-- Grip Knurling Marks -->
        <line x1="-120" y1="-8" x2="-120" y2="8" stroke="#DFBA73" stroke-width="2"/>
        <line x1="120" y1="-8" x2="120" y2="8" stroke="#DFBA73" stroke-width="2"/>

        <!-- Left Olympic Plates -->
        <rect x="-320" y="-130" width="28" height="260" rx="8" fill="#0A0E17" stroke="#DC2626" stroke-width="3"/>
        <rect x="-285" y="-115" width="24" height="230" rx="6" fill="#0F172A" stroke="#DFBA73" stroke-width="2"/>
        <rect x="-255" y="-100" width="22" height="200" rx="6" fill="#0A0E17" stroke="#CBD5E1" stroke-width="2"/>

        <!-- Right Olympic Plates -->
        <rect x="292" y="-130" width="28" height="260" rx="8" fill="#0A0E17" stroke="#DC2626" stroke-width="3"/>
        <rect x="261" y="-115" width="24" height="230" rx="6" fill="#0F172A" stroke="#DFBA73" stroke-width="2"/>
        <rect x="233" y="-100" width="22" height="200" rx="6" fill="#0A0E17" stroke="#CBD5E1" stroke-width="2"/>

        <!-- Center Glowing Iron Brand Icon -->
        <circle cx="0" cy="0" r="85" fill="#07090E" stroke="url(#goldSheen)" stroke-width="3"/>
        <circle cx="0" cy="0" r="75" fill="none" stroke="#DC2626" stroke-width="1" stroke-dasharray="6,4"/>
        <text x="0" y="-12" font-family="'Cinzel', serif" font-size="18" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">IRON VAULT</text>
        <text x="0" y="14" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" fill="#DFBA73" text-anchor="middle" letter-spacing="3">FITNESS HYPE REEL</text>
        <text x="0" y="32" font-family="'Space Grotesk', monospace" font-size="8" font-weight="600" fill="#DC2626" text-anchor="middle" letter-spacing="2">60 FPS • BASS SYNCED</text>
      </g>

      <!-- Heart Rate / BPM Energy Pulse Line across bottom -->
      <path d="M 280,520 L 480,520 L 510,480 L 530,550 L 555,450 L 580,530 L 600,520 L 1000,520" stroke="#DC2626" stroke-width="2.5" fill="none" opacity="0.6"/>

      <!-- 9:16 Vertical Safe Frame Guidelines for Director / Editor Monitor -->
      <path d="M 440,90 L 440,60 L 470,60" stroke="#DFBA73" stroke-width="2" fill="none" opacity="0.7"/>
      <path d="M 810,60 L 840,60 L 840,90" stroke="#DFBA73" stroke-width="2" fill="none" opacity="0.7"/>
      <path d="M 440,630 L 440,660 L 470,660" stroke="#DFBA73" stroke-width="2" fill="none" opacity="0.7"/>
      <path d="M 810,660 L 840,660 L 840,630" stroke="#DFBA73" stroke-width="2" fill="none" opacity="0.7"/>
      <rect x="520" y="66" width="240" height="22" rx="11" fill="rgba(0, 0, 0, 0.85)" stroke="rgba(223, 186, 115, 0.4)" stroke-width="1"/>
      <text x="640" y="81" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" fill="#DFBA73" text-anchor="middle" letter-spacing="3">VERTICAL 9:16 SAFE REEL</text>
    `;
  } else if (cleanTitle.includes('CREATOR') || cleanTitle.includes('YOUTUBE') || sceneType === 'creator') {
    // 2. Creator / YouTube Dynamic Kinetic Edit (Talking head with clean pop-ins & captions)
    sceneContent = `
      <!-- Modern Creator Studio Dark Slate Backdrop -->
      <rect width="1280" height="720" fill="url(#bgGrad)"/>
      <rect width="1280" height="720" fill="url(#cyanFlare)"/>
      <circle cx="640" cy="340" r="300" fill="#0B132B" opacity="0.5"/>

      <!-- Creator Studio Microphone Silhouette on Arm -->
      <g transform="translate(380, 420)">
        <path d="M -80,180 L -30,0 L -10,-40" stroke="#334155" stroke-width="5" fill="none"/>
        <circle cx="-10" cy="-40" r="8" fill="#DFBA73"/>
        <!-- Studio Mic Capsule -->
        <rect x="-35" y="-120" width="50" height="80" rx="25" fill="#0A0E17" stroke="#38BDF8" stroke-width="2.5"/>
        <line x1="-35" y1="-80" x2="15" y2="-80" stroke="#DFBA73" stroke-width="2"/>
        <rect x="-42" y="-100" width="64" height="40" rx="10" fill="none" stroke="#64748B" stroke-width="1.5" stroke-dasharray="2,3"/>
      </g>

      <!-- Center Dynamic Pop-In Caption Plate (High Retention Kinetic Text) -->
      <g transform="translate(640, 360)">
        <rect x="-240" y="-55" width="480" height="110" rx="20" fill="rgba(7, 10, 18, 0.92)" stroke="#38BDF8" stroke-width="2"/>
        <text x="0" y="-12" font-family="'Space Grotesk', sans-serif" font-size="28" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
          HOW TO HOOK <tspan fill="#DFBA73">100%</tspan> OF VIEWERS
        </text>
        
        <!-- Animated Tag with Lightning Icon -->
        <rect x="-140" y="12" width="280" height="26" rx="13" fill="#DFBA73" />
        <text x="0" y="29" font-family="'Space Grotesk', monospace" font-size="11" font-weight="800" fill="#040508" text-anchor="middle" letter-spacing="2">
          ⚡ AUTO-CAPTIONS &amp; SOUND DESIGN
        </text>
      </g>

      <!-- Retention Curve Overlay in Corner -->
      <g transform="translate(880, 220)">
        <rect x="0" y="0" width="260" height="110" rx="14" fill="rgba(4, 7, 14, 0.85)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
        <text x="18" y="26" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" fill="#94A3B8" letter-spacing="1">AUDIENCE RETENTION</text>
        <text x="242" y="26" font-family="'Space Grotesk', monospace" font-size="11" font-weight="700" fill="#10B981" text-anchor="end">+48.2%</text>
        <!-- Retention Line Graph -->
        <path d="M 18,85 C 60,60 120,65 170,45 S 230,40 242,38" fill="none" stroke="#10B981" stroke-width="3"/>
        <circle cx="242" cy="38" r="4" fill="#10B981"/>
      </g>

      <!-- Audio EQ Spectrum Bars -->
      <g transform="translate(640, 520)" opacity="0.8">
        <rect x="-90" y="-10" width="6" height="20" rx="3" fill="#38BDF8"/>
        <rect x="-70" y="-22" width="6" height="44" rx="3" fill="#DFBA73"/>
        <rect x="-50" y="-15" width="6" height="30" rx="3" fill="#38BDF8"/>
        <rect x="-30" y="-30" width="6" height="60" rx="3" fill="#DFBA73"/>
        <rect x="-10" y="-45" width="6" height="90" rx="3" fill="#EF4444"/>
        <rect x="10" y="-38" width="6" height="76" rx="3" fill="#DFBA73"/>
        <rect x="30" y="-25" width="6" height="50" rx="3" fill="#38BDF8"/>
        <rect x="50" y="-18" width="6" height="36" rx="3" fill="#DFBA73"/>
        <rect x="70" y="-12" width="6" height="24" rx="3" fill="#38BDF8"/>
        <rect x="90" y="-8" width="6" height="16" rx="3" fill="#94A3B8"/>
      </g>
    `;
  } else if (cleanTitle.includes('CAFE') || cleanTitle.includes('STREETWEAR') || cleanTitle.includes('PROMO') || sceneType === 'cafe') {
    // 3. Local Café / Streetwear Promo Video (Cinematic 16:9 warm color grade)
    sceneContent = `
      <!-- Warm Artisanal Studio Lighting -->
      <rect width="1280" height="720" fill="url(#bgGrad)"/>
      <circle cx="640" cy="360" r="320" fill="#2E1605" opacity="0.6"/>

      <!-- Warm Sunbeam Rays passing through cafe window -->
      <g opacity="0.25">
        <polygon points="200,40 500,40 850,720 400,720" fill="url(#goldSheen)"/>
        <polygon points="520,40 800,40 1150,720 700,720" fill="url(#goldSheen)"/>
      </g>

      <!-- Centerpiece: Artisanal Espresso Ceramic Cup with Latte Art -->
      <g transform="translate(640, 390)">
        <!-- Saucer -->
        <ellipse cx="0" cy="70" rx="190" ry="32" fill="#0A0E17" stroke="url(#goldSheen)" stroke-width="2.5"/>
        <ellipse cx="0" cy="70" rx="140" ry="22" fill="#05070A" stroke="#DFBA73" stroke-width="1"/>

        <!-- Ceramic Cup Body -->
        <path d="M -110,-20 C -110,60 -60,80 0,80 C 60,80 110,60 110,-20 Z" fill="#0A0E17" stroke="#334155" stroke-width="2.5"/>
        <ellipse cx="0" cy="-20" rx="110" ry="32" fill="#1C0D05" stroke="url(#goldSheen)" stroke-width="2"/>
        
        <!-- Rich Crema & Rosette Pattern -->
        <ellipse cx="0" cy="-20" rx="94" ry="26" fill="#451A03"/>
        <path d="M 0,-34 Q 15,-20 0,-6 Q -15,-20 0,-34" fill="#DFBA73" opacity="0.9"/>
        <circle cx="0" cy="-20" r="14" fill="#DFBA73" opacity="0.85"/>
        <circle cx="0" cy="-10" r="8" fill="#FDE68A" opacity="0.9"/>

        <!-- Cup Handle -->
        <path d="M 105,-10 C 150,-10 150,50 100,55" fill="none" stroke="url(#goldSheen)" stroke-width="7"/>

        <!-- Rising Aromatic Steam Waves -->
        <g stroke="#DFBA73" stroke-width="2" fill="none" opacity="0.45">
          <path d="M -30,-60 Q -50,-110 -20,-160 Q 10,-210 -15,-250"/>
          <path d="M 0,-60 Q 20,-110 -10,-160 Q -30,-210 5,-250"/>
          <path d="M 30,-60 Q 10,-110 40,-160 Q 60,-210 25,-250"/>
        </g>
      </g>

      <!-- Grade & Pacing Stamp Card -->
      <g transform="translate(180, 260)">
        <rect x="0" y="0" width="220" height="85" rx="12" fill="rgba(6, 10, 18, 0.85)" stroke="rgba(223, 186, 115, 0.3)" stroke-width="1"/>
        <text x="18" y="26" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" fill="#DFBA73" letter-spacing="2">COLOR GRADING</text>
        <text x="18" y="48" font-family="'Cinzel', serif" font-size="15" font-weight="700" fill="#FFFFFF">KODAK 2383 PRINT</text>
        <text x="18" y="68" font-family="'Space Grotesk', monospace" font-size="9" fill="#94A3B8" letter-spacing="1">CINEMATIC 16:9 PACING</text>
      </g>
    `;
  } else {
    // 4. DJ Gig / Music Event Aftermovie Reel (with 9:16 safe crop)
    sceneContent = `
      <!-- Concert Arena Deep Night Atmosphere -->
      <rect width="1280" height="720" fill="url(#bgGrad)"/>
      <circle cx="640" cy="300" r="380" fill="#2B0B3A" opacity="0.45"/>

      <!-- Stage Spotlights Beaming Over Dancefloor -->
      <g opacity="0.45">
        <polygon points="120,40 640,360 220,720" fill="url(#goldSheen)" opacity="0.3"/>
        <polygon points="1160,40 640,360 1060,720" fill="url(#goldSheen)" opacity="0.3"/>
        <polygon points="340,40 640,340 500,720" fill="#38BDF8" opacity="0.2"/>
        <polygon points="940,40 640,340 780,720" fill="#38BDF8" opacity="0.2"/>
      </g>

      <!-- DJ Console & Turntable Setup Silhouette -->
      <g transform="translate(640, 420)">
        <!-- Mixer Stand -->
        <rect x="-240" y="-20" width="480" height="140" rx="12" fill="#07090E" stroke="#334155" stroke-width="2"/>
        <!-- Left Deck Platter -->
        <circle cx="-130" cy="40" r="55" fill="#0A0E17" stroke="#DFBA73" stroke-width="2"/>
        <circle cx="-130" cy="40" r="20" fill="#1E293B" stroke="#EF4444" stroke-width="1.5"/>
        <!-- Right Deck Platter -->
        <circle cx="130" cy="40" r="55" fill="#0A0E17" stroke="#DFBA73" stroke-width="2"/>
        <circle cx="130" cy="40" r="20" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5"/>
        <!-- Center Mixer Sliders & Crossfader -->
        <rect x="-35" y="10" width="70" height="60" rx="6" fill="#0F172A" stroke="#DFBA73" stroke-width="1"/>
        <line x1="-20" y1="20" x2="-20" y2="55" stroke="#94A3B8" stroke-width="2"/>
        <line x1="0" y1="20" x2="0" y2="55" stroke="#DFBA73" stroke-width="2"/>
        <line x1="20" y1="20" x2="20" y2="55" stroke="#94A3B8" stroke-width="2"/>
      </g>

      <!-- Cheering Crowd Hands Silhouette in Foreground -->
      <g fill="#040508" opacity="0.85">
        <path d="M 280,680 Q 300,580 320,680 Z"/>
        <path d="M 330,680 Q 350,560 370,680 Z"/>
        <path d="M 420,680 Q 435,590 450,680 Z"/>
        <path d="M 830,680 Q 850,570 870,680 Z"/>
        <path d="M 910,680 Q 930,550 950,680 Z"/>
        <path d="M 980,680 Q 995,590 1010,680 Z"/>
      </g>

      <!-- 9:16 Safe Frame Guidelines for Mobile Director Monitor -->
      <path d="M 440,90 L 440,60 L 470,60" stroke="#DFBA73" stroke-width="2" fill="none" opacity="0.7"/>
      <path d="M 810,60 L 840,60 L 840,90" stroke="#DFBA73" stroke-width="2" fill="none" opacity="0.7"/>
      <path d="M 440,630 L 440,660 L 470,660" stroke="#DFBA73" stroke-width="2" fill="none" opacity="0.7"/>
      <path d="M 810,660 L 840,660 L 840,630" stroke="#DFBA73" stroke-width="2" fill="none" opacity="0.7"/>
      <rect x="520" y="66" width="240" height="22" rx="11" fill="rgba(0, 0, 0, 0.85)" stroke="rgba(223, 186, 115, 0.4)" stroke-width="1"/>
      <text x="640" y="81" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" fill="#DFBA73" text-anchor="middle" letter-spacing="3">VERTICAL 9:16 AFTERMOVIE</text>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
    ${commonDefs}
    ${sceneContent}
    ${letterboxBars}
    <rect width="1280" height="720" filter="url(#filmGrain)" opacity="0.45" pointer-events="none"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// ============================================================================
// AUTHENTIC 9:16 VERTICAL REEL GENERATOR (For Authentic Theater Modal Player)
// ============================================================================

export const createVerticalReelSvgDataUri = (title, duration, tag, primaryColor, accentColor, sceneType = 'fitness') => {
  const isGym = sceneType === 'fitness' || (title || '').toUpperCase().includes('FITNESS') || (title || '').toUpperCase().includes('GYM');

  const defs = `
    <defs>
      <linearGradient id="vBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#040508" />
        <stop offset="35%" stop-color="${primaryColor || '#140508'}" />
        <stop offset="70%" stop-color="#080e1c" />
        <stop offset="100%" stop-color="#020305" />
      </linearGradient>
      <linearGradient id="vGold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="50%" stop-color="#DFBA73" />
        <stop offset="100%" stop-color="#C5A059" />
      </linearGradient>
      <radialGradient id="vFlare" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${accentColor || '#DFBA73'}" stop-opacity="0.6"/>
        <stop offset="50%" stop-color="${accentColor || '#DFBA73'}" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <filter id="vFilmGrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.045 0" />
      </filter>
    </defs>
  `;

  let scene = '';
  if (isGym) {
    scene = `
      <!-- Dynamic Vertical Red / Gold Lighting -->
      <circle cx="360" cy="580" r="260" fill="#3B0A11" opacity="0.65"/>
      <ellipse cx="360" cy="580" rx="300" ry="80" fill="url(#vFlare)"/>

      <!-- Heavy Barbell Stack in Vertical Perspective -->
      <g transform="translate(360, 560)">
        <rect x="-300" y="-8" width="600" height="16" rx="4" fill="#1E293B" stroke="#DFBA73" stroke-width="2"/>
        <!-- Olympic Plates -->
        <rect x="-240" y="-120" width="24" height="240" rx="6" fill="#0A0E17" stroke="#DC2626" stroke-width="3"/>
        <rect x="-210" y="-105" width="20" height="210" rx="6" fill="#0F172A" stroke="#DFBA73" stroke-width="2"/>
        <rect x="190" y="-105" width="20" height="210" rx="6" fill="#0F172A" stroke="#DFBA73" stroke-width="2"/>
        <rect x="216" y="-120" width="24" height="240" rx="6" fill="#0A0E17" stroke="#DC2626" stroke-width="3"/>
        <!-- Center Iron Shield -->
        <circle cx="0" cy="0" r="75" fill="#07090E" stroke="url(#vGold)" stroke-width="3"/>
        <text x="0" y="-8" font-family="'Cinzel', serif" font-size="18" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">IRON VAULT</text>
        <text x="0" y="16" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" fill="#DFBA73" text-anchor="middle" letter-spacing="2">HYPE REEL</text>
      </g>

      <!-- Bold Vertical Kinetic Workout Headlines -->
      <g transform="translate(360, 800)">
        <rect x="-180" y="-30" width="360" height="60" rx="14" fill="rgba(6, 9, 16, 0.88)" stroke="#DC2626" stroke-width="1.5"/>
        <text x="0" y="8" font-family="'Space Grotesk', sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
          UNLEASH <tspan fill="#DFBA73">EVERY REP</tspan>
        </text>
      </g>
    `;
  } else {
    // DJ Gig / Music Aftermovie vertical scene
    scene = `
      <!-- Concert Vertical Beams & Laser Grid -->
      <circle cx="360" cy="500" r="280" fill="#2E083D" opacity="0.6"/>
      <g opacity="0.5">
        <line x1="80" y1="120" x2="360" y2="700" stroke="#DFBA73" stroke-width="2"/>
        <line x1="640" y1="120" x2="360" y2="700" stroke="#DFBA73" stroke-width="2"/>
        <line x1="180" y1="120" x2="360" y2="700" stroke="#38BDF8" stroke-width="2"/>
        <line x1="540" y1="120" x2="360" y2="700" stroke="#38BDF8" stroke-width="2"/>
      </g>

      <!-- DJ Console Silhouette -->
      <g transform="translate(360, 620)">
        <rect x="-180" y="-15" width="360" height="100" rx="12" fill="#060910" stroke="#DFBA73" stroke-width="2"/>
        <circle cx="-90" cy="35" r="40" fill="#0A0E17" stroke="#DC2626" stroke-width="2"/>
        <circle cx="90" cy="35" r="40" fill="#0A0E17" stroke="#38BDF8" stroke-width="2"/>
        <circle cx="0" cy="35" r="16" fill="#1E293B"/>
      </g>

      <!-- Crowd Energy Silhouette -->
      <g fill="#020305" opacity="0.9">
        <path d="M 60,1100 Q 80,980 100,1100 Z"/>
        <path d="M 140,1100 Q 160,940 180,1100 Z"/>
        <path d="M 320,1100 Q 360,920 400,1100 Z"/>
        <path d="M 520,1100 Q 550,950 580,1100 Z"/>
        <path d="M 620,1100 Q 640,990 660,1100 Z"/>
      </g>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1280" width="720" height="1280">
    ${defs}
    <rect width="720" height="1280" fill="url(#vBgGrad)"/>

    <!-- Subtle 9:16 Mobile Safe Area Guidelines -->
    <line x1="36" y1="110" x2="684" y2="110" stroke="rgba(255,255,255,0.08)" stroke-dasharray="6,8"/>
    <line x1="36" y1="1140" x2="684" y2="1140" stroke="rgba(255,255,255,0.08)" stroke-dasharray="6,8"/>

    ${scene}

    <!-- Top Cinema Mobile HUD -->
    <g transform="translate(36, 68)">
      <circle cx="8" cy="0" r="5" fill="#EF4444"/>
      <text x="22" y="4" font-family="'Space Grotesk', monospace" font-size="12" font-weight="700" fill="#EF4444" letter-spacing="2">REC</text>
      <text x="80" y="4" font-family="'Space Grotesk', monospace" font-size="11" font-weight="600" fill="#E2E8F0" letter-spacing="1">9:16 MOBILE MASTER</text>
      <text x="648" y="4" font-family="'Space Grotesk', monospace" font-size="12" font-weight="700" fill="#DFBA73" text-anchor="end" letter-spacing="2">${duration}</text>
    </g>

    <!-- Side Audio Sync Waveform Indicator -->
    <g transform="translate(680, 480)" opacity="0.6">
      <rect x="0" y="0" width="3" height="30" rx="1.5" fill="#DFBA73"/>
      <rect x="0" y="40" width="3" height="55" rx="1.5" fill="#DC2626"/>
      <rect x="0" y="105" width="3" height="40" rx="1.5" fill="#38BDF8"/>
      <rect x="0" y="155" width="3" height="65" rx="1.5" fill="#DFBA73"/>
      <rect x="0" y="230" width="3" height="35" rx="1.5" fill="#E2E8F0"/>
    </g>

    <!-- Lower-Third Mobile Card -->
    <g transform="translate(40, 1190)">
      <text x="0" y="0" font-family="'Cinzel', serif" font-size="20" font-weight="800" fill="#FFFFFF" letter-spacing="2">${title.toUpperCase()}</text>
      <text x="0" y="22" font-family="'Space Grotesk', monospace" font-size="11" font-weight="600" fill="#DFBA73" letter-spacing="2">VERTICAL REEL // 60FPS • ADARSH A L</text>
      <text x="640" y="22" font-family="'Space Grotesk', monospace" font-size="10" font-weight="500" fill="#64748B" text-anchor="end" letter-spacing="2">9:16 CAPCUT &amp; DAVINCI</text>
    </g>

    <rect width="720" height="1280" filter="url(#vFilmGrain)" opacity="0.45" pointer-events="none"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// ============================================================================
// RICH GRAPHIC DESIGN & POSTER GENERATORS (4:5, 1:1 Square & 16:9 Thumbnail)
// ============================================================================

export const createPosterSvgDataUri = (title, subtitle, primaryColor, accentColor, motif = 'fitness', aspectRatio = '4:5') => {
  // 1:1 SQUARE POSTER / SOCIAL CAROUSEL
  if (aspectRatio === '1:1') {
    const squareSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900" width="900" height="900">
      <defs>
        <linearGradient id="sqBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#040508" />
          <stop offset="50%" stop-color="${primaryColor || '#170c04'}" />
          <stop offset="100%" stop-color="#020305" />
        </linearGradient>
        <linearGradient id="sqGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="35%" stop-color="#DFBA73" />
          <stop offset="100%" stop-color="#C5A059" />
        </linearGradient>
        <radialGradient id="sqNebula" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stop-color="${accentColor || '#DFBA73'}" stop-opacity="0.4"/>
          <stop offset="60%" stop-color="${accentColor || '#DFBA73'}" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
        <filter id="sqGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.05 0" />
        </filter>
      </defs>

      <!-- Base Canvas -->
      <rect width="900" height="900" fill="url(#sqBg)" />
      <rect width="900" height="900" fill="url(#sqNebula)" />

      <!-- Hairline Border -->
      <rect x="40" y="40" width="820" height="820" rx="16" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>

      <!-- Centerpiece: Gourmet Culinary Dish / Local Cafe Emblem -->
      <g transform="translate(450, 410)">
        <circle cx="0" cy="0" r="180" fill="#080C14" stroke="url(#sqGold)" stroke-width="3"/>
        <circle cx="0" cy="0" r="160" fill="none" stroke="#334155" stroke-width="1.5" stroke-dasharray="8,6"/>
        <circle cx="0" cy="0" r="140" fill="#14080D" stroke="#DFBA73" stroke-width="1"/>

        <!-- Cloche / Dining Iconography -->
        <path d="M -70,25 C -70,-50 70,-50 70,25 Z" fill="none" stroke="url(#sqGold)" stroke-width="3"/>
        <circle cx="0" cy="-55" r="9" fill="url(#sqGold)"/>
        <line x1="-85" y1="35" x2="85" y2="35" stroke="#DFBA73" stroke-width="4" stroke-linecap="round"/>

        <!-- Promotional 20% Off Badge -->
        <rect x="-80" y="70" width="160" height="34" rx="17" fill="#DFBA73"/>
        <text x="0" y="92" font-family="'Space Grotesk', monospace" font-size="12" font-weight="900" fill="#040508" text-anchor="middle" letter-spacing="2">WEEKEND 20% OFF</text>
      </g>

      <!-- Top Typography: Local Business Campaign -->
      <text x="80" y="100" font-family="'Space Grotesk', monospace" font-size="11" letter-spacing="4" fill="#DFBA73" font-weight="700">LOCAL BUSINESS SOCIAL CAMPAIGN // CAROUSEL 01</text>
      <text x="820" y="100" font-family="'Space Grotesk', monospace" font-size="10" letter-spacing="3" fill="#94A3B8" text-anchor="end">1080 x 1080 FEED</text>

      <!-- Main Headline & Subtitle -->
      <text x="80" y="700" font-family="'Cinzel', serif" font-size="36" font-weight="900" letter-spacing="4" fill="#FFFFFF">${title}</text>
      <text x="80" y="740" font-family="'Space Grotesk', monospace" font-size="14" font-weight="600" letter-spacing="6" fill="#DFBA73">${subtitle}</text>

      <!-- Carousel Pagination Dots (Slide 1 of 5) -->
      <g transform="translate(80, 785)">
        <circle cx="6" cy="0" r="5" fill="#DFBA73"/>
        <circle cx="26" cy="0" r="4" fill="#475569"/>
        <circle cx="44" cy="0" r="4" fill="#475569"/>
        <circle cx="62" cy="0" r="4" fill="#475569"/>
        <circle cx="80" cy="0" r="4" fill="#475569"/>
        <text x="110" y="4" font-family="'Space Grotesk', monospace" font-size="10" fill="#94A3B8" letter-spacing="2">SWIPE TO EXPLORE // 1/5</text>
      </g>

      <!-- Bottom Studio Notes -->
      <line x1="80" y1="815" x2="820" y2="815" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      <text x="80" y="845" font-family="'Space Grotesk', monospace" font-size="9" letter-spacing="2" fill="#64748B">
        SOCIAL MEDIA DESIGN &amp; BRANDING BY ADARSH A L • ALL RIGHTS RESERVED
      </text>

      <rect width="900" height="900" filter="url(#sqGrain)" opacity="0.45" pointer-events="none"/>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(squareSvg)}`;
  }

  // 16:9 YOUTUBE THUMBNAIL MOCKUP
  if (aspectRatio === '16:9') {
    const thumbSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
      <defs>
        <linearGradient id="ytBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#04060B" />
          <stop offset="60%" stop-color="${primaryColor || '#070D1A'}" />
          <stop offset="100%" stop-color="#020305" />
        </linearGradient>
        <linearGradient id="ytGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FFFBEB" />
          <stop offset="50%" stop-color="#FDE047" />
          <stop offset="100%" stop-color="#EAB308" />
        </linearGradient>
        <radialGradient id="ytGlow" cx="30%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.35"/>
          <stop offset="60%" stop-color="#0284C7" stop-opacity="0.08"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
        <filter id="ytGrain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.04 0" />
        </filter>
      </defs>

      <rect width="1280" height="720" fill="url(#ytBg)"/>
      <rect width="1280" height="720" fill="url(#ytGlow)"/>

      <!-- Expressive Creator Silhouette with Vibrant Blue/Gold Rim Lighting -->
      <g transform="translate(320, 420)">
        <!-- Rim Light Glow -->
        <ellipse cx="0" cy="-30" rx="140" ry="170" fill="#38BDF8" opacity="0.25"/>
        <path d="M -110,240 C -110,60 -60,-20 0,-20 C 60,-20 110,60 110,240 Z" fill="#060910" stroke="#38BDF8" stroke-width="3"/>
        <circle cx="0" cy="-90" r="75" fill="#080C14" stroke="url(#ytGold)" stroke-width="3"/>
      </g>

      <!-- Right Side: Bold 3D Kinetic Viral Typography -->
      <g transform="translate(700, 220)">
        <!-- High-CTR Verified Badge -->
        <rect x="0" y="0" width="170" height="32" rx="16" fill="#10B981"/>
        <text x="85" y="21" font-family="'Space Grotesk', monospace" font-size="12" font-weight="900" fill="#040508" text-anchor="middle" letter-spacing="2">★ 14.8% CTR</text>

        <!-- Giant Bold Text (YouTube Viral Format) -->
        <text x="0" y="110" font-family="'Space Grotesk', sans-serif" font-size="76" font-weight="900" fill="#FFFFFF" letter-spacing="-1">
          HOW I MADE
        </text>
        <text x="0" y="195" font-family="'Space Grotesk', sans-serif" font-size="82" font-weight="900" fill="url(#ytGold)" letter-spacing="-1">
          $10,000 / MO
        </text>
        <text x="0" y="270" font-family="'Space Grotesk', sans-serif" font-size="44" font-weight="800" fill="#E2E8F0" letter-spacing="1">
          WITHOUT CLIENT CALLS
        </text>

        <!-- Glowing Neon Pointer Arrow -->
        <g transform="translate(360, 310)">
          <path d="M -80,-40 L 0,0 L -80,40 L -60,0 Z" fill="#FDE047" stroke="#000000" stroke-width="2"/>
        </g>
      </g>

      <!-- Bottom Designer Stamp -->
      <rect x="40" y="650" width="340" height="34" rx="8" fill="rgba(6, 9, 16, 0.85)" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      <text x="56" y="672" font-family="'Space Grotesk', monospace" font-size="10" font-weight="700" fill="#DFBA73" letter-spacing="2">
        HIGH-CTR THUMBNAIL // ADARSH A L
      </text>

      <rect width="1280" height="720" filter="url(#ytGrain)" opacity="0.4" pointer-events="none"/>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(thumbSvg)}`;
  }

  // 4:5 POSTER (Gym Promotion, Event Flyer, or Streetwear Merch Print)
  const isGymPoster = motif === 'fitness' || (title || '').toUpperCase().includes('TITAN') || (title || '').toUpperCase().includes('FITNESS');
  const isFlyer = motif === 'flyer' || (title || '').toUpperCase().includes('HORIZON') || (title || '').toUpperCase().includes('DJ');

  let centerArt = '';
  if (isGymPoster) {
    centerArt = `
      <!-- Bold Gym Athletic Frame -->
      <polygon points="0,-160 140,0 0,160 -140,0" fill="none" stroke="url(#posterGold)" stroke-width="3"/>
      <rect x="-100" y="-100" width="200" height="200" fill="none" stroke="#DC2626" stroke-width="1.5" stroke-dasharray="8,6"/>
      <!-- Heavy Barbell Silhouette -->
      <rect x="-170" y="-6" width="340" height="12" rx="3" fill="#DFBA73"/>
      <rect x="-130" y="-55" width="16" height="110" rx="4" fill="#DC2626"/>
      <rect x="114" y="-55" width="16" height="110" rx="4" fill="#DC2626"/>
      <circle cx="0" cy="0" r="42" fill="#0A0E17" stroke="url(#posterGold)" stroke-width="2"/>
      <text x="0" y="6" font-family="'Cinzel', serif" font-size="16" font-weight="900" fill="#FFFFFF" text-anchor="middle">TITAN</text>
    `;
  } else if (isFlyer) {
    centerArt = `
      <!-- DJ Event / Music Flyer Turntable Celestial Rings -->
      <circle cx="0" cy="0" r="140" fill="none" stroke="url(#posterGold)" stroke-width="2"/>
      <ellipse cx="0" cy="0" rx="220" ry="70" fill="none" stroke="url(#posterSilver)" stroke-width="1.5" transform="rotate(-20)"/>
      <circle cx="0" cy="0" r="75" fill="#0B132B" stroke="url(#posterGold)" stroke-width="3"/>
      <!-- Waveform graphic -->
      <path d="M -50,0 Q -25,-30 0,0 Q 25,30 50,0" fill="none" stroke="#38BDF8" stroke-width="3"/>
    `;
  } else {
    // Modern Typographic Streetwear / Merch Print
    centerArt = `
      <!-- Brutalist Streetwear Minimal Monolith -->
      <rect x="-130" y="-170" width="260" height="340" fill="none" stroke="url(#posterSilver)" stroke-width="2"/>
      <rect x="-95" y="-135" width="190" height="270" fill="url(#posterGold)" fill-opacity="0.08" stroke="url(#posterGold)" stroke-width="1"/>
      <line x1="-160" y1="0" x2="160" y2="0" stroke="url(#posterGold)" stroke-width="1.5"/>
      <circle cx="0" cy="0" r="48" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
      <!-- Technical Coordinate Stamp -->
      <text x="0" y="5" font-family="'Space Grotesk', monospace" font-size="8" font-weight="700" fill="#DFBA73" text-anchor="middle" letter-spacing="3">12.9716° N / 77.5946° E</text>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
    <defs>
      <linearGradient id="posterBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#040508" />
        <stop offset="45%" stop-color="${primaryColor || '#140508'}" />
        <stop offset="100%" stop-color="#020305" />
      </linearGradient>
      <linearGradient id="posterGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="35%" stop-color="#DFBA73" />
        <stop offset="100%" stop-color="#C5A059" />
      </linearGradient>
      <linearGradient id="posterSilver" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="50%" stop-color="#CBD5E1" />
        <stop offset="100%" stop-color="#94A3B8" />
      </linearGradient>
      <radialGradient id="nebulaGlow" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stop-color="${accentColor || '#DFBA73'}" stop-opacity="0.4"/>
        <stop offset="60%" stop-color="${accentColor || '#DFBA73'}" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
      <filter id="archivalGrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.05 0" />
      </filter>
    </defs>
    
    <rect width="800" height="1000" fill="url(#posterBg)" />
    <rect width="800" height="1000" fill="url(#nebulaGlow)" />
    
    <!-- Modernist Grid Guides -->
    <g opacity="0.1" stroke="#FFFFFF" stroke-width="0.75">
      <line x1="80" y1="0" x2="80" y2="1000"/>
      <line x1="720" y1="0" x2="720" y2="1000"/>
      <line x1="0" y1="120" x2="800" y2="120"/>
      <line x1="0" y1="840" x2="800" y2="840"/>
    </g>

    <!-- Centerpiece Graphic -->
    <g transform="translate(400, 440)">
      ${centerArt}
    </g>

    <!-- Top Editorial Header Typography -->
    <text x="80" y="95" font-family="'Space Grotesk', monospace" font-size="11" letter-spacing="5" fill="#DFBA73" font-weight="700">GRAPHIC DESIGN &amp; POSTER ART</text>
    <text x="720" y="95" font-family="'Space Grotesk', monospace" font-size="10" letter-spacing="4" fill="#94A3B8" text-anchor="end">2026 ARCHIVE</text>

    <!-- Main Title & Subtitle Section -->
    <text x="400" y="750" font-family="'Cinzel', serif" font-size="34" font-weight="900" letter-spacing="5" fill="#FFFFFF" text-anchor="middle">${title}</text>
    <text x="400" y="790" font-family="'Space Grotesk', monospace" font-size="13" font-weight="600" letter-spacing="7" fill="#DFBA73" text-anchor="middle">${subtitle}</text>

    <!-- Hairline Separator -->
    <line x1="80" y1="830" x2="720" y2="830" stroke="rgba(223, 186, 115, 0.3)" stroke-width="1"/>

    <!-- Metadata Block -->
    <g transform="translate(80, 860)">
      <text x="0" y="15" font-family="'Space Grotesk', monospace" font-size="9" letter-spacing="3" fill="#64748B">DESIGNER</text>
      <text x="0" y="32" font-family="'Space Grotesk', monospace" font-size="11" letter-spacing="2" fill="#E2E8F0" font-weight="600">ADARSH A L</text>

      <text x="320" y="15" font-family="'Space Grotesk', monospace" font-size="9" letter-spacing="3" fill="#64748B" text-anchor="middle">FORMAT / PRINT</text>
      <text x="320" y="32" font-family="'Space Grotesk', monospace" font-size="11" letter-spacing="2" fill="#DFBA73" text-anchor="middle" font-weight="600">300 DPI CMYK READY</text>

      <text x="640" y="15" font-family="'Space Grotesk', monospace" font-size="9" letter-spacing="3" fill="#64748B" text-anchor="end">APPLICATION</text>
      <text x="640" y="32" font-family="'Space Grotesk', monospace" font-size="11" letter-spacing="2" fill="#E2E8F0" text-anchor="end" font-weight="600">POSTER &amp; SOCIAL</text>
    </g>

    <text x="400" y="955" font-family="'Space Grotesk', monospace" font-size="9" letter-spacing="3" fill="#475569" text-anchor="middle">
      DESIGNED BY ADARSH A L • FREELANCE VISUAL CREATIVE • ALL RIGHTS RESERVED
    </text>

    <rect width="800" height="1000" filter="url(#archivalGrain)" opacity="0.45" pointer-events="none"/>
  </svg>`;
  
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// ============================================================================
// INITIAL PORTFOLIO SHOWCASE ITEMS (AUTHENTIC FREELANCE WORK)
// ============================================================================

// Empty by default - only real client uploads appear in Adarsh's portfolio
export const INITIAL_PORTFOLIO_ITEMS = [];

export const SAMPLE_PORTFOLIO_ITEMS = [
  {
    id: "vid-1",
    type: "video",
    title: "IRON VAULT FITNESS - High-Energy Hype Reel",
    category: "Video Editing",
    subCategory: "Gym & Fitness",
    aspectRatio: "9:16",
    duration: "00:30",
    resolution: "1080x1920 60fps",
    software: ["CapCut", "DaVinci Resolve", "AI Workflow"],
    client: "Iron Vault Gym",
    year: "2026",
    description: "High-intensity vertical gym hype reel. Rhythmic bass-synced jump cuts, speed ramping on heavy lifts, custom punch zooms, and energetic DaVinci color grading.",
    thumbnailUrl: createVideoThumbSvgDataUri("IRON VAULT FITNESS", "00:30", "Gym Reel", "#3b0a11", "#dfba73", "fitness"),
    verticalThumbUrl: createVerticalReelSvgDataUri("IRON VAULT FITNESS", "00:30", "Gym Reel", "#3b0a11", "#dfba73", "fitness"),
    videoUrl: null,
    featured: true,
    accent: "gold"
  },
  {
    id: "vid-2",
    type: "video",
    title: "CREATOR MASTERCLASS - Kinetic YouTube Edit",
    category: "Video Editing",
    subCategory: "Creator & YouTube",
    aspectRatio: "16:9",
    duration: "02:15",
    resolution: "4K UHD 60fps",
    software: ["DaVinci Resolve", "CapCut", "AI Workflow"],
    client: "Alex Rivera / Tech Creator",
    year: "2026",
    description: "Retention-optimized YouTube talking head edit. Seamless dynamic punch-ins, custom sound design, auto-synced animated captions, and clean b-roll transitions.",
    thumbnailUrl: createVideoThumbSvgDataUri("CREATOR MASTERCLASS", "02:15", "Kinetic Edit", "#081224", "#38bdf8", "creator"),
    videoUrl: null,
    featured: true,
    accent: "silver"
  },
  {
    id: "vid-3",
    type: "video",
    title: "ROAST & CO. - Artisanal Café Promo",
    category: "Video Editing",
    subCategory: "Brand & Promo",
    aspectRatio: "16:9",
    duration: "01:05",
    resolution: "4K UHD 24fps",
    software: ["DaVinci Resolve", "Canva", "AI Workflow"],
    client: "Roast & Co. Artisanal Coffee",
    year: "2026",
    description: "Cinematic commercial highlighting espresso extraction, morning cafe atmosphere, and barista craft. Warm amber color grade and crisp Foley sound design.",
    thumbnailUrl: createVideoThumbSvgDataUri("ROAST & CO. CAFE", "01:05", "Cafe Promo", "#170c04", "#dfba73", "cafe"),
    videoUrl: null,
    featured: true,
    accent: "gold"
  },
  {
    id: "vid-4",
    type: "video",
    title: "PULSE NIGHTCLUB - DJ Gig Aftermovie",
    category: "Video Editing",
    subCategory: "Event & Music",
    aspectRatio: "9:16",
    duration: "00:45",
    resolution: "1080x1920 60fps",
    software: ["CapCut", "DaVinci Resolve", "AI Workflow"],
    client: "Pulse Nightclub & Local Gig",
    year: "2026",
    description: "Dynamic vertical aftermovie for a local music gig. Beat-synced cuts down to individual frames, crowd energy transitions, strobe accents, and mobile-first pacing.",
    thumbnailUrl: createVideoThumbSvgDataUri("PULSE DJ GIG", "00:45", "9:16 Reel", "#1a0b22", "#dfba73", "gig"),
    verticalThumbUrl: createVerticalReelSvgDataUri("PULSE DJ GIG", "00:45", "9:16 Reel", "#1a0b22", "#dfba73", "gig"),
    videoUrl: null,
    featured: false,
    accent: "gold"
  },

  // ================= POSTER DESIGNING ITEMS =================
  {
    id: "pos-1",
    type: "poster",
    title: "TITAN STRENGTH - 12-Week Transformation",
    category: "Poster Designing",
    subCategory: "Gym & Fitness",
    aspectRatio: "4:5",
    dimensions: "18\" x 24\" (Gym Poster / Social Ad)",
    dpi: "300 DPI High-Res",
    software: ["Canva", "Photoshop", "AI Workflow"],
    client: "Titan Strength & Fitness Club",
    year: "2026",
    description: "High-contrast motivational fitness poster with bold typography, dark gritty textures, and clear membership promo callouts.",
    thumbnailUrl: createPosterSvgDataUri("TITAN STRENGTH", "12-WEEK TRANSFORMATION", "#3b0a11", "#dfba73", "fitness", "4:5"),
    imageUrl: createPosterSvgDataUri("TITAN STRENGTH", "12-WEEK TRANSFORMATION", "#3b0a11", "#dfba73", "fitness", "4:5"),
    featured: true,
    accent: "gold"
  },
  {
    id: "pos-2",
    type: "poster",
    title: "NEON HORIZON - Weekend DJ Night Flyer",
    category: "Poster Designing",
    subCategory: "Event Flyers",
    aspectRatio: "4:5",
    dimensions: "A3 Event Flyer (300 DPI)",
    dpi: "300 DPI Print & Digital",
    software: ["Canva", "Photoshop"],
    client: "The Velvet Lounge / Local Gig",
    year: "2026",
    description: "Modern dark-aesthetic club flyer featuring sleek metallic typography, dark crimson/gold accents, date badges, and lineup layout.",
    thumbnailUrl: createPosterSvgDataUri("NEON HORIZON", "WEEKEND DJ SESSIONS", "#081224", "#cbd5e1", "flyer", "4:5"),
    imageUrl: createPosterSvgDataUri("NEON HORIZON", "WEEKEND DJ SESSIONS", "#081224", "#cbd5e1", "flyer", "4:5"),
    featured: true,
    accent: "silver"
  },
  {
    id: "pos-3",
    type: "poster",
    title: "HOW I SCALED MY BUSINESS - High-CTR Thumbnail",
    category: "Poster Designing",
    subCategory: "Thumbnails & Social",
    aspectRatio: "16:9",
    dimensions: "1280 x 720 (YouTube HD)",
    dpi: "Web RGB 300 DPI",
    software: ["Photoshop", "Canva", "AI Workflow"],
    client: "Creator YouTube Channel",
    year: "2026",
    description: "High-CTR YouTube thumbnail designed for viral engagement. Clean subject cutout with rim lighting, bold high-contrast headline, and expressive layout.",
    thumbnailUrl: createPosterSvgDataUri("SCALE TO 100K", "VIRAL CTR THUMBNAIL", "#070d1a", "#dfba73", "thumbnail", "16:9"),
    imageUrl: createPosterSvgDataUri("SCALE TO 100K", "VIRAL CTR THUMBNAIL", "#070d1a", "#dfba73", "thumbnail", "16:9"),
    featured: true,
    accent: "gold"
  },
  {
    id: "pos-4",
    type: "poster",
    title: "URBAN BITES - Instagram Promo Carousel",
    category: "Poster Designing",
    subCategory: "Social Media Graphics",
    aspectRatio: "1:1",
    dimensions: "1080 x 1080 px (Square Feed)",
    dpi: "Social Ready 300 DPI",
    software: ["Canva", "Photoshop"],
    client: "Urban Bites Gourmet Kitchen",
    year: "2026",
    description: "Modern social media campaign creative for a local restaurant. Clean product hierarchy, discount promo badges, and appetite-inducing layout.",
    thumbnailUrl: createPosterSvgDataUri("URBAN BITES", "SPECIAL MENU CAROUSEL", "#170c04", "#cbd5e1", "social", "1:1"),
    imageUrl: createPosterSvgDataUri("URBAN BITES", "SPECIAL MENU CAROUSEL", "#170c04", "#cbd5e1", "social", "1:1"),
    featured: false,
    accent: "silver"
  },
  {
    id: "pos-5",
    type: "poster",
    title: "KINETIC DISCIPLINE - Streetwear Print",
    category: "Poster Designing",
    subCategory: "Brand & Merch",
    aspectRatio: "4:5",
    dimensions: "24\" x 36\" (Merch & Print)",
    dpi: "300 DPI Vector Ready",
    software: ["Canva", "Illustrator", "Photoshop"],
    client: "Origin Streetwear Co.",
    year: "2026",
    description: "Brutalist typographic streetwear apparel back-print and poster combining modern sans-serif typography, coordinate stamps, and minimalist grid structure.",
    thumbnailUrl: createPosterSvgDataUri("KINETIC DISCIPLINE", "STREETWEAR MERCH PRINT", "#060910", "#dfba73", "merch", "4:5"),
    imageUrl: createPosterSvgDataUri("KINETIC DISCIPLINE", "STREETWEAR MERCH PRINT", "#060910", "#dfba73", "merch", "4:5"),
    featured: false,
    accent: "gold"
  }
];
