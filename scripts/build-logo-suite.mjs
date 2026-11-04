import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const PUB_LOGOS = path.join(ROOT, 'public', 'images', 'logos');
const DIST_LOGOS = path.join(ROOT, 'dist', 'images', 'logos');
const PUB_IMAGES = path.join(ROOT, 'public', 'images');
const DIST_IMAGES = path.join(ROOT, 'dist', 'images');
const PUB_DIR = path.join(ROOT, 'public');
const DIST_DIR = path.join(ROOT, 'dist');

fs.mkdirSync(PUB_LOGOS, { recursive: true });
fs.mkdirSync(DIST_LOGOS, { recursive: true });

// =============================================================================
// VECTOR SVG DEFINITIONS (6 CONCEPTS: MARKS + FULL HORIZONTAL LOCKUPS)
// Visual rules: Pure mathematical precision, Swiss / Dieter Rams / Linear.
// Palette: #0F172A (Carbon Slate), #0052CC (Cobalt Titanium), #0284C7 (Blueprint Cyan), #059669 (Status Emerald)
// Zero em dashes anywhere!
// =============================================================================

export const CONCEPTS = [
  // ---------------------------------------------------------------------------
  // CONCEPT 01: Hypervisor Blade Stack & Signal Node (Flagship Default)
  // ---------------------------------------------------------------------------
  {
    id: 'concept-01',
    slug: 'concept-01-hypervisor-blades',
    name: 'Hypervisor Blade Stack & Signal Node',
    badge: 'FLAGSHIP DEFAULT',
    description: 'Three precision isometric server rack blades stacked with hairline surgical spacing, forming an architectural T and S negative-space channel, anchored by a live emerald status LED and Cobalt Titanium vector chassis.',
    technicalDetails: 'Blade pitch: 3.5mm equivalent // Negative-space TS optical axis // Status: Active-Active',
    markSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="10" fill="#0F172A"/>
  <rect x="2.5" y="2.5" width="59" height="59" rx="7.5" stroke="#1E293B" stroke-width="1"/>
  
  <!-- Calibrated Grid Hairlines -->
  <line x1="8" y1="32" x2="56" y2="32" stroke="#1E293B" stroke-width="0.75" stroke-dasharray="2 2"/>
  <line x1="32" y1="8" x2="32" y2="56" stroke="#1E293B" stroke-width="0.75" stroke-dasharray="2 2"/>

  <!-- Blade 1: Top Server Tray (Crossbar of T) -->
  <path d="M 12 14 H 52 V 22 H 12 Z" fill="url(#c1-grad-top)"/>
  <path d="M 12 14 L 16 18 V 22 L 12 22 Z" fill="#003D99" opacity="0.6"/>
  <rect x="18" y="17" width="5" height="2" fill="#38BDF8"/>
  <rect x="25" y="17" width="5" height="2" fill="#38BDF8"/>
  <rect x="32" y="17" width="5" height="2" fill="#38BDF8"/>
  <!-- Telemetry LED -->
  <circle cx="47" cy="18" r="2.2" fill="#059669"/>
  <circle cx="47" cy="18" r="0.9" fill="#A7F3D0"/>

  <!-- Blade 2: Middle Tray (T-Stem / S-Upper Turn) -->
  <path d="M 22 26 H 42 V 34 H 22 Z" fill="url(#c1-grad-mid)"/>
  <path d="M 42 26 H 52 V 34 H 47 V 30 H 42 Z" fill="#0284C7"/>
  <rect x="25" y="29" width="4" height="2" fill="#FFFFFF" opacity="0.85"/>
  <rect x="32" y="29" width="4" height="2" fill="#38BDF8"/>
  <line x1="12" y1="30" x2="19" y2="30" stroke="#0284C7" stroke-width="1.5" stroke-linecap="round"/>

  <!-- Blade 3: Bottom Tray (S-Base Return) -->
  <path d="M 12 38 H 22 V 42 H 16 V 46 H 52 V 50 H 12 Z" fill="url(#c1-grad-bot)"/>
  <rect x="24" y="47" width="5" height="2" fill="#38BDF8"/>
  <rect x="31" y="47" width="5" height="2" fill="#38BDF8"/>
  <circle cx="47" cy="48" r="1.5" fill="#0284C7"/>

  <!-- Micro Signal Traces -->
  <line x1="22" y1="14" x2="22" y2="50" stroke="#38BDF8" stroke-width="0.75" opacity="0.35"/>
  <line x1="42" y1="14" x2="42" y2="50" stroke="#38BDF8" stroke-width="0.75" opacity="0.35"/>

  <!-- Corner Datum Marks -->
  <circle cx="6" cy="6" r="1.2" fill="#0284C7"/>
  <circle cx="58" cy="6" r="1.2" fill="#0284C7"/>
  <circle cx="6" cy="58" r="1.2" fill="#0284C7"/>
  <circle cx="58" cy="58" r="1.2" fill="#059669"/>

  <defs>
    <linearGradient id="c1-grad-top" x1="12" y1="14" x2="52" y2="22" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0052CC"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
    <linearGradient id="c1-grad-mid" x1="22" y1="26" x2="42" y2="34" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0284C7"/>
      <stop offset="100%" stop-color="#0052CC"/>
    </linearGradient>
    <linearGradient id="c1-grad-bot" x1="12" y1="38" x2="52" y2="50" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0052CC"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
  </defs>
</svg>`,
    fullSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 72" fill="none">
  <!-- Mark Container on Left -->
  <g transform="translate(10, 8)">
    <rect width="56" height="56" rx="9" fill="#0F172A"/>
    <rect x="2" y="2" width="52" height="52" rx="7" stroke="#1E293B" stroke-width="1"/>
    
    <!-- Blade 1 -->
    <path d="M 10 12 H 46 V 19 H 10 Z" fill="#0052CC"/>
    <rect x="15" y="15" width="4" height="2" fill="#38BDF8"/>
    <rect x="21" y="15" width="4" height="2" fill="#38BDF8"/>
    <rect x="27" y="15" width="4" height="2" fill="#38BDF8"/>
    <circle cx="42" cy="15.5" r="2" fill="#059669"/>

    <!-- Blade 2 -->
    <path d="M 19 23 H 37 V 30 H 19 Z" fill="#0284C7"/>
    <path d="M 37 23 H 46 V 30 H 42 V 26 H 37 Z" fill="#0284C7"/>
    <rect x="22" y="26" width="3.5" height="1.8" fill="#FFFFFF" opacity="0.9"/>
    <rect x="28" y="26" width="3.5" height="1.8" fill="#38BDF8"/>

    <!-- Blade 3 -->
    <path d="M 10 34 H 19 V 37 H 14 V 41 H 46 V 44 H 10 Z" fill="#0052CC"/>
    <rect x="21" y="41.5" width="4" height="1.8" fill="#38BDF8"/>
    <rect x="27" y="41.5" width="4" height="1.8" fill="#38BDF8"/>
    <circle cx="42" cy="42.5" r="1.3" fill="#0284C7"/>

    <!-- Corner Datum -->
    <circle cx="5" cy="5" r="1" fill="#0284C7"/>
    <circle cx="51" cy="5" r="1" fill="#0284C7"/>
    <circle cx="5" cy="51" r="1" fill="#0284C7"/>
    <circle cx="51" cy="51" r="1" fill="#059669"/>
  </g>

  <!-- Precision Hairline Divider -->
  <line x1="78" y1="14" x2="78" y2="58" stroke="#CBD5E1" stroke-width="1.25"/>

  <!-- Typographic Hierarchy -->
  <text x="92" y="34" font-family="'Space Grotesk', 'Segoe UI', -apple-system, system-ui, Arial, sans-serif" font-size="21" font-weight="800" letter-spacing="0.03em" fill="#0F172A">TECHNOLOGY <tspan fill="#0052CC">SPECIALIST</tspan></text>
  <text x="92" y="52" font-family="'JetBrains Mono', 'Consolas', 'SF Mono', monospace" font-size="10.5" font-weight="600" letter-spacing="0.1em" fill="#64748B">INFRASTRUCTURE &amp; VIRTUALIZATION // EST. 1990</text>
</svg>`
  },

  // ---------------------------------------------------------------------------
  // CONCEPT 02: Swiss Grid TS Monogram
  // ---------------------------------------------------------------------------
  {
    id: 'concept-02',
    slug: 'concept-02-swiss-circuit-monogram',
    name: 'Swiss Grid TS Monogram',
    badge: 'ARCHITECTURAL GRID',
    description: 'Mathematical 8x8 architectural grid constructing an interlocking T + S out of continuous 4.5px precision traces with 90° and 45° machinic mitered corners.',
    technicalDetails: '8x8 modular matrix // 4.5px trace width // Machinic miters // Emerald terminus',
    markSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="10" fill="#0F172A"/>
  <rect x="2.5" y="2.5" width="59" height="59" rx="7.5" stroke="#1E293B" stroke-width="1"/>

  <!-- 8x8 Calibration Grid -->
  <g stroke="#1E293B" stroke-width="0.5" stroke-dasharray="1 3">
    <line x1="14" y1="8" x2="14" y2="56"/>
    <line x1="20" y1="8" x2="20" y2="56"/>
    <line x1="26" y1="8" x2="26" y2="56"/>
    <line x1="32" y1="8" x2="32" y2="56"/>
    <line x1="38" y1="8" x2="38" y2="56"/>
    <line x1="44" y1="8" x2="44" y2="56"/>
    <line x1="50" y1="8" x2="50" y2="56"/>
    <line x1="8" y1="14" x2="56" y2="14"/>
    <line x1="8" y1="20" x2="56" y2="20"/>
    <line x1="8" y1="26" x2="56" y2="26"/>
    <line x1="8" y1="32" x2="56" y2="32"/>
    <line x1="8" y1="38" x2="56" y2="38"/>
    <line x1="8" y1="44" x2="56" y2="44"/>
    <line x1="8" y1="50" x2="56" y2="50"/>
  </g>

  <!-- T Trace (Cobalt Titanium) -->
  <path d="M 14 16 H 50 M 32 16 V 48" stroke="#0052CC" stroke-width="4.5" stroke-linecap="square"/>
  
  <!-- S Trace (Interlocking Machinic Circuit) -->
  <path d="M 46 22 H 24 L 20 26 V 30 L 24 34 H 40 L 44 38 V 44 L 40 48 H 14" stroke="#38BDF8" stroke-width="4" stroke-linecap="square" stroke-linejoin="miter"/>

  <!-- Precision Junction Terminus Nodes -->
  <circle cx="14" cy="16" r="2.5" fill="#FFFFFF"/>
  <circle cx="50" cy="16" r="2.5" fill="#0052CC"/>
  <circle cx="32" cy="48" r="2.5" fill="#0284C7"/>
  <circle cx="14" cy="48" r="2.8" fill="#059669"/>

  <!-- Optical Calibration Reticle Ticks -->
  <line x1="6" y1="6" x2="10" y2="6" stroke="#64748B" stroke-width="1"/>
  <line x1="6" y1="6" x2="6" y2="10" stroke="#64748B" stroke-width="1"/>
  <line x1="58" y1="6" x2="54" y2="6" stroke="#64748B" stroke-width="1"/>
  <line x1="58" y1="6" x2="58" y2="10" stroke="#64748B" stroke-width="1"/>
</svg>`,
    fullSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 72" fill="none">
  <!-- Mark Container on Left -->
  <g transform="translate(10, 8)">
    <rect width="56" height="56" rx="9" fill="#0F172A"/>
    <rect x="2" y="2" width="52" height="52" rx="7" stroke="#1E293B" stroke-width="1"/>

    <!-- T Trace -->
    <path d="M 12 14 H 44 M 28 14 V 42" stroke="#0052CC" stroke-width="4" stroke-linecap="square"/>
    
    <!-- S Trace -->
    <path d="M 40 20 H 21 L 18 23 V 27 L 21 30 H 35 L 38 33 V 39 L 35 42 H 12" stroke="#38BDF8" stroke-width="3.5" stroke-linecap="square" stroke-linejoin="miter"/>

    <!-- Terminus Nodes -->
    <circle cx="12" cy="14" r="2" fill="#FFFFFF"/>
    <circle cx="44" cy="14" r="2" fill="#0052CC"/>
    <circle cx="12" cy="42" r="2.5" fill="#059669"/>
  </g>

  <!-- Divider -->
  <line x1="78" y1="14" x2="78" y2="58" stroke="#CBD5E1" stroke-width="1.25"/>

  <!-- Typography -->
  <text x="92" y="34" font-family="'Space Grotesk', 'Segoe UI', -apple-system, system-ui, Arial, sans-serif" font-size="21" font-weight="800" letter-spacing="0.03em" fill="#0F172A">TECHNOLOGY <tspan fill="#0052CC">SPECIALIST</tspan></text>
  <text x="92" y="52" font-family="'JetBrains Mono', 'Consolas', 'SF Mono', monospace" font-size="10.5" font-weight="600" letter-spacing="0.1em" fill="#64748B">INFRASTRUCTURE &amp; VIRTUALIZATION // EST. 1990</text>
</svg>`
  },

  // ---------------------------------------------------------------------------
  // CONCEPT 03: Fiber Topology Matrix
  // ---------------------------------------------------------------------------
  {
    id: 'concept-03',
    slug: 'concept-03-fiber-topology-matrix',
    name: 'Enterprise Switch & Routing Matrix',
    badge: 'NETWORK TOPOLOGY',
    description: 'Clean interconnected network fabric cube and hexagonal aperture representing redundant multi-path routing, VLAN segmentation, and zero-downtime cluster topology.',
    technicalDetails: '6-Node Ring + Leaf-Spine Core // Multi-path failover // VLAN segregation',
    markSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="10" fill="#0F172A"/>
  <rect x="2.5" y="2.5" width="59" height="59" rx="7.5" stroke="#1E293B" stroke-width="1"/>

  <!-- Hexagonal Isometric Fabric Cube Facets -->
  <!-- Top Face -->
  <polygon points="32,12 49,21 32,31 15,21" fill="#0284C7" fill-opacity="0.35"/>
  <!-- Left Face -->
  <polygon points="15,21 32,31 32,50 15,40" fill="#0052CC" fill-opacity="0.45"/>
  <!-- Right Face -->
  <polygon points="32,31 49,21 49,40 32,50" fill="#0F172A" fill-opacity="0.6"/>

  <!-- Fiber Bus Routing Paths -->
  <g stroke="#38BDF8" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <!-- Perimeter Ring -->
    <polygon points="32,12 49,21 49,40 32,50 15,40 15,21" fill="none" stroke="#0052CC" stroke-width="2"/>
    <!-- Leaf-Spine Links -->
    <line x1="32" y1="12" x2="32" y2="31"/>
    <line x1="15" y1="21" x2="32" y2="31"/>
    <line x1="49" y1="21" x2="32" y2="31"/>
    <line x1="15" y1="40" x2="32" y2="31"/>
    <line x1="49" y1="40" x2="32" y2="31"/>
    <line x1="32" y1="50" x2="32" y2="31"/>
  </g>

  <!-- Peripheral Edge Switch Nodes -->
  <circle cx="32" cy="12" r="2.8" fill="#FFFFFF"/>
  <circle cx="49" cy="21" r="2.8" fill="#0284C7"/>
  <circle cx="49" cy="40" r="2.8" fill="#0052CC"/>
  <circle cx="32" cy="50" r="2.8" fill="#0284C7"/>
  <circle cx="15" cy="40" r="2.8" fill="#0052CC"/>
  <circle cx="15" cy="21" r="2.8" fill="#38BDF8"/>

  <!-- Central Root Bridge Core (Emerald Status Pulse) -->
  <circle cx="32" cy="31" r="4.5" fill="#059669"/>
  <circle cx="32" cy="31" r="2" fill="#FFFFFF"/>
</svg>`,
    fullSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 72" fill="none">
  <!-- Mark Container on Left -->
  <g transform="translate(10, 8)">
    <rect width="56" height="56" rx="9" fill="#0F172A"/>
    <rect x="2" y="2" width="52" height="52" rx="7" stroke="#1E293B" stroke-width="1"/>

    <!-- Hex Facets -->
    <polygon points="28,10 43,18 28,27 13,18" fill="#0284C7" fill-opacity="0.35"/>
    <polygon points="13,18 28,27 28,44 13,35" fill="#0052CC" fill-opacity="0.45"/>
    <polygon points="28,27 43,18 43,35 28,44" fill="#0F172A" fill-opacity="0.6"/>

    <!-- Spine Links -->
    <polygon points="28,10 43,18 43,35 28,44 13,35 13,18" fill="none" stroke="#0052CC" stroke-width="1.75"/>
    <line x1="28" y1="10" x2="28" y2="27" stroke="#38BDF8" stroke-width="1.5"/>
    <line x1="13" y1="18" x2="28" y2="27" stroke="#38BDF8" stroke-width="1.5"/>
    <line x1="43" y1="18" x2="28" y2="27" stroke="#38BDF8" stroke-width="1.5"/>
    <line x1="13" y1="35" x2="28" y2="27" stroke="#38BDF8" stroke-width="1.5"/>
    <line x1="43" y1="35" x2="28" y2="27" stroke="#38BDF8" stroke-width="1.5"/>
    <line x1="28" y1="44" x2="28" y2="27" stroke="#38BDF8" stroke-width="1.5"/>

    <!-- Peripheral Nodes -->
    <circle cx="28" cy="10" r="2.2" fill="#FFFFFF"/>
    <circle cx="43" cy="18" r="2.2" fill="#0284C7"/>
    <circle cx="43" cy="35" r="2.2" fill="#0052CC"/>
    <circle cx="28" cy="44" r="2.2" fill="#0284C7"/>
    <circle cx="13" cy="35" r="2.2" fill="#0052CC"/>
    <circle cx="13" cy="18" r="2.2" fill="#38BDF8"/>

    <!-- Center Hub -->
    <circle cx="28" cy="27" r="3.5" fill="#059669"/>
    <circle cx="28" cy="27" r="1.5" fill="#FFFFFF"/>
  </g>

  <!-- Divider -->
  <line x1="78" y1="14" x2="78" y2="58" stroke="#CBD5E1" stroke-width="1.25"/>

  <!-- Typography -->
  <text x="92" y="34" font-family="'Space Grotesk', 'Segoe UI', -apple-system, system-ui, Arial, sans-serif" font-size="21" font-weight="800" letter-spacing="0.03em" fill="#0F172A">TECHNOLOGY <tspan fill="#0052CC">SPECIALIST</tspan></text>
  <text x="92" y="52" font-family="'JetBrains Mono', 'Consolas', 'SF Mono', monospace" font-size="10.5" font-weight="600" letter-spacing="0.1em" fill="#64748B">INFRASTRUCTURE &amp; VIRTUALIZATION // EST. 1990</text>
</svg>`
  },

  // ---------------------------------------------------------------------------
  // CONCEPT 04: Dieter Rams Technical Spec Plate
  // ---------------------------------------------------------------------------
  {
    id: 'concept-04',
    slug: 'concept-04-rams-industrial-badge',
    name: 'Dieter Rams Technical Spec Plate',
    badge: 'INDUSTRIAL SPEC',
    description: 'Exposed structural chassis frame divided into a precision instrument plate: [ TS | 1990 ] with tabular technical typography and a 4-bar status indicator LED strip.',
    technicalDetails: 'Hardware instrument bezel // 4-segment telemetry // Tabular numerals',
    markSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <!-- Outer Beveled Chassis Frame -->
  <rect x="4" y="6" width="56" height="52" rx="4" fill="#0F172A" stroke="#334155" stroke-width="1.5"/>
  <rect x="6.5" y="8.5" width="51" height="47" rx="2.5" stroke="#1E293B" stroke-width="1"/>

  <!-- 4 Corner Allen Screws -->
  <circle cx="9" cy="11" r="1.5" fill="#475569"/>
  <line x1="8" y1="11" x2="10" y2="11" stroke="#0F172A" stroke-width="0.8"/>
  <circle cx="55" cy="11" r="1.5" fill="#475569"/>
  <line x1="54" y1="11" x2="56" y2="11" stroke="#0F172A" stroke-width="0.8"/>
  <circle cx="9" cy="53" r="1.5" fill="#475569"/>
  <line x1="8" y1="53" x2="10" y2="53" stroke="#0F172A" stroke-width="0.8"/>
  <circle cx="55" cy="53" r="1.5" fill="#475569"/>
  <line x1="54" y1="53" x2="56" y2="53" stroke="#0F172A" stroke-width="0.8"/>

  <!-- Internal Divider -->
  <line x1="33" y1="12" x2="33" y2="52" stroke="#334155" stroke-width="1.2"/>

  <!-- Left Compartment: TS Architectural Glyph -->
  <!-- T -->
  <path d="M 12 18 H 28 M 20 18 V 36" stroke="#FFFFFF" stroke-width="3" stroke-linecap="square"/>
  <!-- S -->
  <path d="M 28 22 C 27 20 25 19 22 19 C 18 19 16 21 16 24 C 16 28 28 27 28 32 C 28 35 25 37 21 37 C 17 37 15 35 15 32" stroke="#38BDF8" stroke-width="3" fill="none" stroke-linecap="square"/>
  <!-- Sub Label Left -->
  <text x="13" y="47" font-family="'JetBrains Mono', monospace" font-size="6.5" font-weight="700" fill="#64748B">SPEC</text>

  <!-- Right Compartment: Technical Metadata & Status -->
  <text x="44" y="24" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="8.5" font-weight="800" fill="#FFFFFF" letter-spacing="0.05em">1990</text>
  <!-- Cobalt Bar -->
  <rect x="36" y="27" width="16" height="2.5" fill="#0052CC"/>
  <!-- 4-Bar LED Array -->
  <rect x="36" y="33" width="3" height="4" fill="#059669"/>
  <rect x="40.5" y="33" width="3" height="4" fill="#059669"/>
  <rect x="45" y="33" width="3" height="4" fill="#059669"/>
  <rect x="49.5" y="33" width="3" height="4" fill="#0284C7"/>
  <text x="44" y="47" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="5.5" font-weight="700" fill="#64748B" letter-spacing="0.08em">36 YRS</text>
</svg>`,
    fullSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 72" fill="none">
  <!-- Mark Container on Left -->
  <g transform="translate(10, 8)">
    <rect x="2" y="2" width="52" height="52" rx="4" fill="#0F172A" stroke="#334155" stroke-width="1.5"/>
    <circle cx="6" cy="6" r="1.2" fill="#475569"/>
    <circle cx="50" cy="6" r="1.2" fill="#475569"/>
    <circle cx="6" cy="50" r="1.2" fill="#475569"/>
    <circle cx="50" cy="50" r="1.2" fill="#475569"/>

    <line x1="28" y1="8" x2="28" y2="48" stroke="#334155" stroke-width="1"/>

    <!-- Left: TS -->
    <path d="M 9 14 H 23 M 16 14 V 32" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="square"/>
    <path d="M 23 18 C 22 16 20 15 17 15 C 14 15 12 17 12 20 C 12 23 23 23 23 28 C 23 31 20 33 17 33 C 14 33 12 31 12 28" stroke="#38BDF8" stroke-width="2.6" fill="none" stroke-linecap="square"/>
    <text x="10" y="42" font-family="'JetBrains Mono', monospace" font-size="5.5" font-weight="700" fill="#64748B">SPEC</text>

    <!-- Right: Spec Data -->
    <text x="39" y="21" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="7.5" font-weight="800" fill="#FFFFFF">1990</text>
    <rect x="31" y="24" width="16" height="2" fill="#0052CC"/>
    <rect x="31" y="29" width="3" height="3" fill="#059669"/>
    <rect x="35.5" y="29" width="3" height="3" fill="#059669"/>
    <rect x="40" y="29" width="3" height="3" fill="#059669"/>
    <rect x="44.5" y="29" width="3" height="3" fill="#0284C7"/>
    <text x="39" y="42" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="5" font-weight="700" fill="#64748B">36 YRS</text>
  </g>

  <!-- Divider -->
  <line x1="78" y1="14" x2="78" y2="58" stroke="#CBD5E1" stroke-width="1.25"/>

  <!-- Typography -->
  <text x="92" y="34" font-family="'Space Grotesk', 'Segoe UI', -apple-system, system-ui, Arial, sans-serif" font-size="21" font-weight="800" letter-spacing="0.03em" fill="#0F172A">TECHNOLOGY <tspan fill="#0052CC">SPECIALIST</tspan></text>
  <text x="92" y="52" font-family="'JetBrains Mono', 'Consolas', 'SF Mono', monospace" font-size="10.5" font-weight="600" letter-spacing="0.1em" fill="#64748B">INFRASTRUCTURE &amp; VIRTUALIZATION // EST. 1990</text>
</svg>`
  },

  // ---------------------------------------------------------------------------
  // CONCEPT 05: Active-Active Cluster Mirror
  // ---------------------------------------------------------------------------
  {
    id: 'concept-05',
    slug: 'concept-05-dual-cluster-failover',
    name: 'Active-Active Cluster Mirror',
    badge: 'FAILOVER SYMMETRY',
    description: 'Two mirrored geometric chevrons and nodes locked in high-availability symmetry symbolizing VMware ESXi and Hyper-V synchronous replication and redundant SIP trunking.',
    technicalDetails: '180° HA symmetry // Sub-millisecond sync heartbeat // Chevrons TS flow',
    markSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="10" fill="#0F172A"/>
  <rect x="2.5" y="2.5" width="59" height="59" rx="7.5" stroke="#1E293B" stroke-width="1"/>

  <!-- Cluster Node A (Primary - Cobalt Titanium) -->
  <path d="M 12 16 H 30 L 36 24 H 20 L 16 32 H 28 L 24 40 H 12 Z" fill="url(#c5-node-a)"/>
  <circle cx="16" cy="20" r="1.8" fill="#FFFFFF"/>
  <circle cx="24" cy="20" r="1.8" fill="#38BDF8"/>

  <!-- Cluster Node B (Mirrored Replica - Blueprint Cyan) -->
  <path d="M 52 48 H 34 L 28 40 H 44 L 48 32 H 36 L 40 24 H 52 Z" fill="url(#c5-node-b)"/>
  <circle cx="48" cy="44" r="1.8" fill="#FFFFFF"/>
  <circle cx="40" cy="44" r="1.8" fill="#0052CC"/>

  <!-- Central Synchronous Heartbeat Replication Bridge -->
  <path d="M 24 32 L 28 27 L 36 37 L 40 32" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  
  <!-- Center Quorum Witness Node -->
  <circle cx="32" cy="32" r="3.5" fill="#059669"/>
  <circle cx="32" cy="32" r="1.5" fill="#FFFFFF"/>

  <!-- Corner Datum Marks -->
  <circle cx="6" cy="6" r="1.2" fill="#0052CC"/>
  <circle cx="58" cy="6" r="1.2" fill="#0284C7"/>
  <circle cx="6" cy="58" r="1.2" fill="#0284C7"/>
  <circle cx="58" cy="58" r="1.2" fill="#059669"/>

  <defs>
    <linearGradient id="c5-node-a" x1="12" y1="16" x2="36" y2="40" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0052CC"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
    <linearGradient id="c5-node-b" x1="52" y1="48" x2="28" y2="24" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0284C7"/>
      <stop offset="100%" stop-color="#38BDF8"/>
    </linearGradient>
  </defs>
</svg>`,
    fullSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 72" fill="none">
  <!-- Mark Container on Left -->
  <g transform="translate(10, 8)">
    <rect width="56" height="56" rx="9" fill="#0F172A"/>
    <rect x="2" y="2" width="52" height="52" rx="7" stroke="#1E293B" stroke-width="1"/>

    <!-- Node A -->
    <path d="M 10 14 H 26 L 31 21 H 17 L 14 28 H 24 L 21 35 H 10 Z" fill="#0052CC"/>
    <circle cx="14" cy="17.5" r="1.5" fill="#FFFFFF"/>

    <!-- Node B -->
    <path d="M 46 42 H 30 L 25 35 H 39 L 42 28 H 32 L 35 21 H 46 Z" fill="#0284C7"/>
    <circle cx="42" cy="38.5" r="1.5" fill="#FFFFFF"/>

    <!-- Heartbeat Bridge -->
    <path d="M 21 28 L 25 24 L 31 32 L 35 28" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="28" cy="28" r="3" fill="#059669"/>
    <circle cx="28" cy="28" r="1.2" fill="#FFFFFF"/>
  </g>

  <!-- Divider -->
  <line x1="78" y1="14" x2="78" y2="58" stroke="#CBD5E1" stroke-width="1.25"/>

  <!-- Typography -->
  <text x="92" y="34" font-family="'Space Grotesk', 'Segoe UI', -apple-system, system-ui, Arial, sans-serif" font-size="21" font-weight="800" letter-spacing="0.03em" fill="#0F172A">TECHNOLOGY <tspan fill="#0052CC">SPECIALIST</tspan></text>
  <text x="92" y="52" font-family="'JetBrains Mono', 'Consolas', 'SF Mono', monospace" font-size="10.5" font-weight="600" letter-spacing="0.1em" fill="#64748B">INFRASTRUCTURE &amp; VIRTUALIZATION // EST. 1990</text>
</svg>`
  },

  // ---------------------------------------------------------------------------
  // CONCEPT 06: Pure Architectural Wordmark + Telemetry Pulse
  // ---------------------------------------------------------------------------
  {
    id: 'concept-06',
    slug: 'concept-06-minimal-architectural-wordmark',
    name: 'Pure Architectural Wordmark + 42U Scale Rule',
    badge: 'TYPOGRAPHIC AUTHORITY',
    description: 'Ultra-clean typographic authority lockup with a precision vertical rack-unit 42U scale rule, calibrated hairline ticks, and live status indicator.',
    technicalDetails: '42U chassis rule // Oscilloscope pulse // Swiss editorial typography',
    markSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <rect width="64" height="64" rx="10" fill="#0F172A"/>
  <rect x="2.5" y="2.5" width="59" height="59" rx="7.5" stroke="#1E293B" stroke-width="1"/>

  <!-- 42U Calibrated Rack Rail Ticks (Left & Right) -->
  <g stroke="#334155" stroke-width="1">
    <line x1="8" y1="12" x2="13" y2="12"/>
    <line x1="8" y1="17" x2="11" y2="17"/>
    <line x1="8" y1="22" x2="13" y2="22"/>
    <line x1="8" y1="27" x2="11" y2="27"/>
    <line x1="8" y1="32" x2="14" y2="32" stroke="#0284C7"/>
    <line x1="8" y1="37" x2="11" y2="37"/>
    <line x1="8" y1="42" x2="13" y2="42"/>
    <line x1="8" y1="47" x2="11" y2="47"/>
    <line x1="8" y1="52" x2="13" y2="52"/>

    <line x1="51" y1="12" x2="56" y2="12"/>
    <line x1="53" y1="17" x2="56" y2="17"/>
    <line x1="51" y1="22" x2="56" y2="22"/>
    <line x1="53" y1="27" x2="56" y2="27"/>
    <line x1="50" y1="32" x2="56" y2="32" stroke="#059669"/>
    <line x1="53" y1="37" x2="56" y2="37"/>
    <line x1="51" y1="42" x2="56" y2="42"/>
    <line x1="53" y1="47" x2="56" y2="47"/>
    <line x1="51" y1="52" x2="56" y2="52"/>
  </g>

  <!-- Vertical Rail Guidelines -->
  <line x1="14" y1="10" x2="14" y2="54" stroke="#1E293B" stroke-width="1"/>
  <line x1="50" y1="10" x2="50" y2="54" stroke="#1E293B" stroke-width="1"/>

  <!-- Architectural Central Glyph: TS Monolithic Forms -->
  <!-- T -->
  <path d="M 18 18 H 34 M 26 18 V 46" stroke="#0052CC" stroke-width="4.5" stroke-linecap="square"/>
  <!-- S -->
  <path d="M 46 24 C 44 20 40 18 36 18 C 30 18 28 22 28 26 C 28 32 46 30 46 38 C 46 43 41 46 36 46 C 30 46 27 42 27 38" stroke="#FFFFFF" stroke-width="4.5" fill="none" stroke-linecap="square"/>

  <!-- Telemetry Pulse Wave Across Datum -->
  <path d="M 14 32 L 24 32 L 27 27 L 31 37 L 34 32 L 50 32" stroke="#059669" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  
  <!-- Top Beacon Node -->
  <circle cx="32" cy="11" r="2.2" fill="#059669"/>
  <circle cx="32" cy="11" r="1" fill="#A7F3D0"/>
</svg>`,
    fullSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 72" fill="none">
  <!-- Mark Container on Left -->
  <g transform="translate(10, 8)">
    <rect width="56" height="56" rx="9" fill="#0F172A"/>
    <rect x="2" y="2" width="52" height="52" rx="7" stroke="#1E293B" stroke-width="1"/>

    <!-- Calibrated 42U Rack Ticks -->
    <line x1="6" y1="12" x2="10" y2="12" stroke="#334155" stroke-width="1"/>
    <line x1="6" y1="20" x2="10" y2="20" stroke="#334155" stroke-width="1"/>
    <line x1="6" y1="28" x2="11" y2="28" stroke="#0284C7" stroke-width="1.2"/>
    <line x1="6" y1="36" x2="10" y2="36" stroke="#334155" stroke-width="1"/>
    <line x1="6" y1="44" x2="10" y2="44" stroke="#334155" stroke-width="1"/>

    <line x1="46" y1="12" x2="50" y2="12" stroke="#334155" stroke-width="1"/>
    <line x1="46" y1="20" x2="50" y2="20" stroke="#334155" stroke-width="1"/>
    <line x1="45" y1="28" x2="50" y2="28" stroke="#059669" stroke-width="1.2"/>
    <line x1="46" y1="36" x2="50" y2="36" stroke="#334155" stroke-width="1"/>
    <line x1="46" y1="44" x2="50" y2="44" stroke="#334155" stroke-width="1"/>

    <!-- Central TS Glyph -->
    <path d="M 15 16 H 29 M 22 16 V 40" stroke="#0052CC" stroke-width="3.8" stroke-linecap="square"/>
    <path d="M 41 21 C 39 18 36 16 32 16 C 27 16 25 19 25 23 C 25 28 41 27 41 33 C 41 38 37 40 32 40 C 27 40 25 37 25 34" stroke="#FFFFFF" stroke-width="3.8" fill="none" stroke-linecap="square"/>

    <!-- Telemetry Pulse -->
    <path d="M 12 28 L 21 28 L 24 23 L 28 33 L 31 28 L 44 28" stroke="#059669" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <circle cx="28" cy="10" r="1.8" fill="#059669"/>
  </g>

  <!-- Divider -->
  <line x1="78" y1="14" x2="78" y2="58" stroke="#CBD5E1" stroke-width="1.25"/>

  <!-- Typography -->
  <text x="92" y="34" font-family="'Space Grotesk', 'Segoe UI', -apple-system, system-ui, Arial, sans-serif" font-size="21" font-weight="800" letter-spacing="0.03em" fill="#0F172A">TECHNOLOGY <tspan fill="#0052CC">SPECIALIST</tspan></text>
  <text x="92" y="52" font-family="'JetBrains Mono', 'Consolas', 'SF Mono', monospace" font-size="10.5" font-weight="600" letter-spacing="0.1em" fill="#64748B">INFRASTRUCTURE &amp; VIRTUALIZATION // EST. 1990</text>
</svg>`
  }
];

// OpenGraph Social Card (1200x630)
export function createOgCardSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" fill="none">
  <!-- Blueprint Background with Precision Hairlines -->
  <rect width="1200" height="630" fill="#FAFAFC"/>
  <defs>
    <pattern id="og-grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD5E1" stroke-width="0.75" opacity="0.6"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#og-grid)"/>

  <!-- Outer Border Frame -->
  <rect x="24" y="24" width="1152" height="582" fill="white" stroke="#CBD5E1" stroke-width="2"/>
  
  <!-- Top Technical Strip -->
  <rect x="24" y="24" width="1152" height="42" fill="#0F172A"/>
  <circle cx="50" cy="45" r="5" fill="#059669"/>
  <text x="68" y="49" font-family="'JetBrains Mono', 'Consolas', monospace" font-size="13" font-weight="700" fill="#A7F3D0" letter-spacing="0.15em">EST. 1990 // 36 YEARS ENTERPRISE SYSTEMS ENGINEERING &#8226; CENTRAL FLORIDA &amp; NATIONWIDE</text>
  <text x="1140" y="49" text-anchor="end" font-family="'JetBrains Mono', 'Consolas', monospace" font-size="13" font-weight="700" fill="#38BDF8" letter-spacing="0.1em">DIRECT: (407) 917-5250</text>

  <!-- Left Side: Authoritative Typographic Hierarchy -->
  <g transform="translate(70, 130)">
    <!-- Category Pill -->
    <rect x="0" y="0" width="340" height="30" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1"/>
    <rect x="0" y="0" width="6" height="30" fill="#0052CC"/>
    <text x="18" y="20" font-family="'JetBrains Mono', 'Consolas', monospace" font-size="11" font-weight="700" fill="#0052CC" letter-spacing="0.15em">ENTERPRISE INFRASTRUCTURE</text>

    <!-- Headline -->
    <text x="0" y="85" font-family="'Space Grotesk', 'Segoe UI', -apple-system, Arial, sans-serif" font-size="52" font-weight="800" fill="#0F172A" letter-spacing="-0.02em">
      <tspan x="0" dy="0">Enterprise Systems,</tspan>
      <tspan x="0" dy="62">Virtualization &amp; Networks.</tspan>
      <tspan x="0" dy="62" fill="#0052CC">Principal-Led Since 1990.</tspan>
    </text>

    <!-- Subtext -->
    <text x="0" y="280" font-family="'Plus Jakarta Sans', 'Segoe UI', Arial, sans-serif" font-size="19" font-weight="500" fill="#475569">
      <tspan x="0" dy="0">VMware ESXi &#8226; Microsoft Hyper-V &#8226; 365 Governance &#8226; VoIP SIP</tspan>
      <tspan x="0" dy="30" font-family="'JetBrains Mono', 'Consolas', monospace" font-size="15" fill="#059669" font-weight="700">Managed directly by Steve Cormier. Zero helpdesk runaround.</tspan>
    </text>
  </g>

  <!-- Right Side: Flagship Hypervisor Blade Mark Graphic (Enlarged) -->
  <g transform="translate(860, 140)">
    <rect width="260" height="260" rx="36" fill="#0F172A" stroke="#1E293B" stroke-width="4"/>
    
    <!-- Top Blade -->
    <rect x="46" y="52" width="168" height="34" rx="4" fill="#0052CC"/>
    <rect x="68" y="65" width="16" height="8" rx="2" fill="#38BDF8"/>
    <rect x="92" y="65" width="16" height="8" rx="2" fill="#38BDF8"/>
    <rect x="116" y="65" width="16" height="8" rx="2" fill="#38BDF8"/>
    <circle cx="188" cy="69" r="8" fill="#059669"/>
    <circle cx="188" cy="69" r="4" fill="#A7F3D0"/>

    <!-- Mid Blade -->
    <rect x="88" y="104" width="84" height="34" rx="4" fill="#0284C7"/>
    <rect x="172" y="104" width="42" height="34" rx="4" fill="#0284C7"/>
    <rect x="100" y="117" width="16" height="8" rx="2" fill="#FFFFFF"/>
    <rect x="124" y="117" width="16" height="8" rx="2" fill="#38BDF8"/>

    <!-- Bot Blade -->
    <rect x="46" y="156" width="168" height="34" rx="4" fill="#0052CC"/>
    <rect x="92" y="169" width="16" height="8" rx="2" fill="#38BDF8"/>
    <rect x="116" y="169" width="16" height="8" rx="2" fill="#38BDF8"/>
    <circle cx="188" cy="173" r="6" fill="#0284C7"/>
  </g>

  <!-- Bottom Technical Strip -->
  <rect x="24" y="556" width="1152" height="50" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1"/>
  <text x="50" y="586" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600" fill="#64748B" letter-spacing="0.1em">ORLANDO / CENTRAL FL ONSITE &#8226; NATIONWIDE SECURE REMOTE &#8226; technologyspecialist.org</text>
  <text x="1140" y="586" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="700" fill="#0052CC">36 CONSECUTIVE YEARS (1990 - 2026)</text>
</svg>`;
}

async function run() {
  console.log('Writing 6 SVG Logo Systems (12 files) + rendering PNGs...');

  for (const c of CONCEPTS) {
    const markFileName = `${c.id}-mark.svg`;
    const fullFileName = `${c.slug}.svg`;

    // 1. Save SVGs to public/images/logos/
    fs.writeFileSync(path.join(PUB_LOGOS, markFileName), c.markSvg, 'utf8');
    fs.writeFileSync(path.join(PUB_LOGOS, fullFileName), c.fullSvg, 'utf8');

    // 2. Save SVGs to dist/images/logos/
    fs.writeFileSync(path.join(DIST_LOGOS, markFileName), c.markSvg, 'utf8');
    fs.writeFileSync(path.join(DIST_LOGOS, fullFileName), c.fullSvg, 'utf8');

    // 3. Render High-Res PNGs (mark: 512x512, full: 1200x240, standard: 360x72)
    const markBuffer = Buffer.from(c.markSvg);
    const fullBuffer = Buffer.from(c.fullSvg);

    // Render mark 512x512
    const markPng512 = await sharp(markBuffer).resize(512, 512).png().toBuffer();
    fs.writeFileSync(path.join(PUB_LOGOS, `${c.id}-mark-512.png`), markPng512);
    fs.writeFileSync(path.join(DIST_LOGOS, `${c.id}-mark-512.png`), markPng512);

    // Render full 1200x240
    const fullPng1200 = await sharp(fullBuffer).resize(1200, 240).png().toBuffer();
    fs.writeFileSync(path.join(PUB_LOGOS, `${c.slug}-1200w.png`), fullPng1200);
    fs.writeFileSync(path.join(DIST_LOGOS, `${c.slug}-1200w.png`), fullPng1200);

    // Render full 360x72 standard
    const fullPng360 = await sharp(fullBuffer).resize(360, 72).png().toBuffer();
    fs.writeFileSync(path.join(PUB_LOGOS, `${c.slug}.png`), fullPng360);
    fs.writeFileSync(path.join(DIST_LOGOS, `${c.slug}.png`), fullPng360);

    console.log(`Generated concept: ${c.id} (${c.name})`);
  }

  // ---------------------------------------------------------------------------
  // Set Concept 01 as Default Flagship Identity across the site
  // ---------------------------------------------------------------------------
  const flagship = CONCEPTS[0];
  const flagshipMarkBuf = Buffer.from(flagship.markSvg);
  const flagshipFullBuf = Buffer.from(flagship.fullSvg);

  // Favicon SVG
  fs.writeFileSync(path.join(PUB_DIR, 'favicon.svg'), flagship.markSvg, 'utf8');
  fs.writeFileSync(path.join(DIST_DIR, 'favicon.svg'), flagship.markSvg, 'utf8');

  // Images Logo SVG
  fs.writeFileSync(path.join(PUB_IMAGES, 'logo.svg'), flagship.fullSvg, 'utf8');
  fs.writeFileSync(path.join(DIST_IMAGES, 'logo.svg'), flagship.fullSvg, 'utf8');

  // Favicon 32x32 PNG
  const fav32 = await sharp(flagshipMarkBuf).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(PUB_DIR, 'favicon-32x32.png'), fav32);
  fs.writeFileSync(path.join(DIST_DIR, 'favicon-32x32.png'), fav32);

  // Apple Touch Icon (180x180 PNG)
  const apple180 = await sharp(flagshipMarkBuf).resize(180, 180).png().toBuffer();
  fs.writeFileSync(path.join(PUB_DIR, 'apple-touch-icon.png'), apple180);
  fs.writeFileSync(path.join(DIST_DIR, 'apple-touch-icon.png'), apple180);

  // Main logo.png and logo-full.png
  const fullPng = await sharp(flagshipFullBuf).resize(720, 144).png().toBuffer();
  fs.writeFileSync(path.join(PUB_IMAGES, 'logo.png'), fullPng);
  fs.writeFileSync(path.join(DIST_IMAGES, 'logo.png'), fullPng);
  fs.writeFileSync(path.join(PUB_IMAGES, 'logo-full.png'), fullPng);
  fs.writeFileSync(path.join(DIST_IMAGES, 'logo-full.png'), fullPng);

  // Logo mark PNG
  const markPng = await sharp(flagshipMarkBuf).resize(256, 256).png().toBuffer();
  fs.writeFileSync(path.join(PUB_IMAGES, 'logo-mark.png'), markPng);
  fs.writeFileSync(path.join(DIST_IMAGES, 'logo-mark.png'), markPng);

  // OpenGraph Image (1200x630 PNG)
  const ogSvg = createOgCardSvg();
  fs.writeFileSync(path.join(PUB_IMAGES, 'og-image.svg'), ogSvg, 'utf8');
  fs.writeFileSync(path.join(DIST_IMAGES, 'og-image.svg'), ogSvg, 'utf8');
  const ogPng = await sharp(Buffer.from(ogSvg)).resize(1200, 630).png().toBuffer();
  fs.writeFileSync(path.join(PUB_IMAGES, 'og-image.png'), ogPng);
  fs.writeFileSync(path.join(DIST_IMAGES, 'og-image.png'), ogPng);

  console.log('Successfully generated all flagship identity files!');
}

run().catch(err => {
  console.error('Build logo suite failed:', err);
  process.exit(1);
});
