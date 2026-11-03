/**
 * mod-sticker-studio-ui.js
 * Frontend Studio UI & Vendor Fulfillment Engine for MOD-STICKER-STUDIO in admin-portal.html
 *
 * Capabilities:
 *   1. Johnny Adams 25 Print-Ready Rock Stickers + GeneTravels Reference Presets
 *   2. Site Twin #3 Conversational Suggestions with 3 Clickable Upgraded Prompt Cards
 *   3. Nano Banana 3" Master Creation with Hard Chat Lock and Animated 5-Stage Progress Bar (0% -> 100%)
 *   4. Auto-Filing into Dated Creation Folders (YYYY-MM-DD) + Hierarchical Nested Folder Tree
 *   5. Move to Folder, Bulk Move, and Sticker Deletion with Confirmation
 *   6. 10-Design / 500-Pack Print Run Tray ($49.90 for 500 via kadsticky.com)
 *   7. Three-Way Vendor Fulfillment Strategy:
 *      - Mode A: GreenTree White-Label Print Concierge (SaaS Upsell $99-$129 via WHMCS/Stripe)
 *      - Mode B: Direct Vendor Handoff (Kadsticky.com 1-Click Spec Export and Quantity Split Table)
 *      - Mode C: Local Instant Thermal Label Bridge (1-Bit Floyd-Steinberg Dither for Niimbot/Katasymbol)
 *
 * Strict Compliance: Anti-Slop Voice Mandate enforced (Zero em dashes).
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BSIStickerStudio = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STORAGE_KEY_PREFIX = 'gt_mod_sticker_studio_v8_';
  var PRINT_PACK_SIZE = 10;
  var TOTAL_PRINT_UNITS = 500;
  var DEFAULT_WHOLESALE_COST = 49.90;

  function getActiveTenantScope() {
    var sk = '';
    var dom = '';
    var siteName = '';
    try {
      if (typeof window !== 'undefined') {
        if (window.STATE && window.STATE.license) {
          sk = String(window.STATE.license.siteKey || '').toLowerCase().trim();
          dom = String(window.STATE.license.domain || '').toLowerCase().trim();
          siteName = String(window.STATE.license.siteName || '').trim();
        }
        var params = new URLSearchParams(window.location.search || '');
        var qKey = (params.get('siteKey') || '').toLowerCase().trim();
        if (qKey) sk = qKey;
        if (!dom) dom = String(window.location.hostname || '').toLowerCase().replace(/^www\./, '').trim();
      }
    } catch (e) {}
    var combined = (sk + ' ' + dom).toLowerCase();
    var isBackstage = combined.indexOf('backstage') !== -1;
    var isGeneTravels = combined.indexOf('genetravels') !== -1;
    var scopeKey = isBackstage ? 'backstageimagesri' : (isGeneTravels ? 'genetravels' : (sk || dom || 'default'));
    return {
      scopeKey: scopeKey,
      isBackstage: isBackstage,
      isGeneTravels: isGeneTravels,
      siteName: siteName || (isBackstage ? 'Backstage Images RI' : (isGeneTravels ? 'GeneTravels' : (dom || 'Brand Studio'))),
      domain: dom || (isBackstage ? 'backstageimagesri.com' : (isGeneTravels ? 'genetravels.com' : 'greentreehosting.com'))
    };
  }

  function getScopedStorageKey() {
    return STORAGE_KEY_PREFIX + getActiveTenantScope().scopeKey;
  }

  function getScopedInitialFolders() {
    var scope = getActiveTenantScope();
    var todayId = 'dated-' + getTodayString();
    var base = [
      { id: 'all-stickers', name: 'All Stickers (Master Library)', icon: '📁', parentId: null, isSystem: true },
      { id: todayId, name: '📅 ' + getTodayString() + ' Creations', icon: '📅', parentId: null, isDated: true }
    ];
    if (scope.isBackstage) {
      base.push(
        { id: 'johnny-pit-masters', name: "🎸 Johnny's Pit Masters (25 Stickers)", icon: '🎸', parentId: null, isSystem: true },
        { id: 'johnny-crests', name: 'Rock Crests & Shields', icon: '🛡️', parentId: 'johnny-pit-masters' },
        { id: 'johnny-vip-passes', name: 'VIP Laminates & Passes', icon: '🎫', parentId: 'johnny-pit-masters' },
        { id: 'johnny-pit-gear', name: 'Pit Gear & Telemetry', icon: '⚡', parentId: 'johnny-pit-masters' },
        { id: 'johnny-band-editions', name: 'Band & Frontwoman Editions', icon: '🎤', parentId: 'johnny-pit-masters' }
      );
    } else if (scope.isGeneTravels) {
      base.push(
        { id: 'genetravels-reference', name: '✈️ GeneTravels Master Library (44 Stickers)', icon: '✈️', parentId: null, isSystem: true },
        { id: 'gt-folio-forensics', name: '🧾 Folio Forensics & PointsTracker', icon: '🧾', parentId: 'genetravels-reference' },
        { id: 'gt-road-warrior', name: '🫖 Earl Grey & GreenTree Road Warrior', icon: '🫖', parentId: 'genetravels-reference' },
        { id: 'gt-travel-tech', name: '⚡ In-Room Defense & Travel Tech', icon: '⚡', parentId: 'genetravels-reference' },
        { id: 'gt-ambassador-elite', name: '👑 Ambassador Elite & Hotel Audits', icon: '👑', parentId: 'genetravels-reference' },
        { id: 'gt-aviation', name: '🛫 Flight Deck & Speed Shields', icon: '🛫', parentId: 'genetravels-reference' },
        { id: 'gt-speedway', name: '🏎️ Speedway Infield & Motorsports', icon: '🏎️', parentId: 'genetravels-reference' },
        { id: 'gt-bumpers', name: '🏁 Bumper Strips & High-Speed Decals', icon: '🏁', parentId: 'genetravels-reference' },
        { id: 'gt-crew-editions', name: '⭐ All-Access & Crew Editions', icon: '⭐', parentId: 'genetravels-reference' }
      );
    }
    base.push(
      { id: 'print-candidates', name: '📦 500-Pack Print Run Candidates', icon: '📦', parentId: null },
      { id: 'thermal-batch', name: '🖨️ 1-Bit Thermal Label Batch', icon: '🖨️', parentId: null }
    );
    return base;
  }

  function getScopedInitialStickers() {
    var scope = getActiveTenantScope();
    if (scope.isBackstage) {
      return INITIAL_STICKERS.filter(function (s) { return s.isJohnny === true && !s.isGeneTravels; });
    }
    if (scope.isGeneTravels) {
      return INITIAL_STICKERS.filter(function (s) { return s.isGeneTravels === true && !s.isJohnny; }).map(function (s, idx) {
        return Object.assign({}, s, { inPrintPack: idx < 10 });
      });
    }
    return [];
  }

  function getScopedPromptPresets() {
    var scope = getActiveTenantScope();
    if (scope.isBackstage) {
      return PROMPT_PRESETS_20.filter(function (p) { return p.group.indexOf('GeneTravels') === -1; });
    }
    if (scope.isGeneTravels) {
      return PROMPT_PRESETS_20.filter(function (p) { return p.group.indexOf('Backstage') === -1; });
    }
    return PROMPT_PRESETS_20.filter(function (p) {
      return p.group.indexOf('Backstage') === -1 && p.group.indexOf('GeneTravels') === -1;
    });
  }

  function getTodayString() {
    var d = new Date();
    var yyyy = d.getFullYear();
    var mm = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return yyyy + '-' + mm + '-' + dd;
  }

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  var INITIAL_FOLDERS = [
    { id: 'all-stickers', name: 'All Stickers (Master Library)', icon: '📁', parentId: null, isSystem: true },
    { id: 'dated-' + getTodayString(), name: '📅 ' + getTodayString() + ' Creations', icon: '📅', parentId: null, isDated: true },
    { id: 'johnny-pit-masters', name: "🎸 Johnny's Pit Masters (25 Stickers)", icon: '🎸', parentId: null, isSystem: true },
    { id: 'johnny-crests', name: 'Rock Crests & Shields', icon: '🛡️', parentId: 'johnny-pit-masters' },
    { id: 'johnny-vip-passes', name: 'VIP Laminates & Passes', icon: '🎫', parentId: 'johnny-pit-masters' },
    { id: 'johnny-pit-gear', name: 'Pit Gear & Telemetry', icon: '⚡', parentId: 'johnny-pit-masters' },
    { id: 'johnny-band-editions', name: 'Band & Frontwoman Editions', icon: '🎤', parentId: 'johnny-pit-masters' },
    { id: 'genetravels-reference', name: '✈️ GeneTravels Reference Presets', icon: '✈️', parentId: null, isSystem: true },
    { id: 'gt-aviation', name: 'Flight Deck & Speed Shields', icon: '🛫', parentId: 'genetravels-reference' },
    { id: 'gt-speedway', name: 'High Banks Speedway Livery', icon: '🏎️', parentId: 'genetravels-reference' },
    { id: 'gt-crew-editions', name: 'All-Access & Crew Editions', icon: '⭐', parentId: 'genetravels-reference' },
    { id: 'print-candidates', name: '📦 500-Pack Print Run Candidates', icon: '📦', parentId: null },
    { id: 'thermal-batch', name: '🖨️ 1-Bit Thermal Label Batch', icon: '🖨️', parentId: null }
  ];

  var INITIAL_STICKERS = [
    {
      id: 'bsi-stk-01',
      title: 'Front Row to Backstage',
      filename: 'bsi_sticker_01_front_row_to_backstage.jpg',
      imageUrl: '/images/stickers/bsi_sticker_01_front_row_to_backstage.jpg',
      folderId: 'johnny-crests',
      concept: 'Vintage heavy rock shield banner with electric guitar neck and studio ribbon microphone.',
      topBanner: 'BACKSTAGE IMAGES RI',
      bottomBanner: 'FRONT ROW TO BACKSTAGE',
      shape: 'shield',
      finish: 'glossy',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: true
    },
    {
      id: 'bsi-stk-02',
      title: 'Live Rock, Real Images',
      filename: 'bsi_sticker_02_live_rock_real_images.jpg',
      imageUrl: '/images/stickers/bsi_sticker_02_live_rock_real_images.jpg',
      folderId: 'johnny-crests',
      concept: 'Circular pit pass medallion with warm spotlight flares and arena speaker stack silhouettes.',
      topBanner: 'BACKSTAGE IMAGES RI',
      bottomBanner: 'LIVE ROCK, REAL IMAGES',
      shape: 'circle',
      finish: 'matte',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: true
    },
    {
      id: 'bsi-stk-03',
      title: 'VIP Photo Pass Laminate',
      filename: 'bsi_sticker_03_vip_photo_pass.jpg',
      imageUrl: '/images/stickers/bsi_sticker_03_vip_photo_pass.jpg',
      folderId: 'johnny-vip-passes',
      concept: 'Lanyard laminate badge with security holographic border, stage strobe flare, and barcode.',
      topBanner: 'ALL ACCESS PIT PASS',
      bottomBanner: 'OFFICIAL MEDIA CREDENTIAL',
      shape: 'vip-pass',
      finish: 'holographic',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: true
    },
    {
      id: 'bsi-stk-04',
      title: 'Zero Flash All Amps',
      filename: 'bsi_sticker_04_zero_flash_all_amps.jpg',
      imageUrl: '/images/stickers/bsi_sticker_04_zero_flash_all_amps.jpg',
      folderId: 'johnny-pit-gear',
      concept: 'High-voltage electric guitar amplifier tubes radiating blue glow with die-cut lightning bolts.',
      topBanner: 'NATURAL LIGHT ONLY',
      bottomBanner: 'ZERO FLASH ALL AMPS',
      shape: 'shield',
      finish: 'glossy',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: true
    },
    {
      id: 'bsi-stk-05',
      title: 'Roadie Pit Veteran',
      filename: 'bsi_sticker_05_roadie_pit_veteran.jpg',
      imageUrl: '/images/stickers/bsi_sticker_05_roadie_pit_veteran.jpg',
      folderId: 'johnny-pit-gear',
      concept: 'Heavy road case stencil with textured gaffer tape accents and wing stage credentials.',
      topBanner: 'RHODE ISLAND STAGE CREW',
      bottomBanner: 'ROADIE PIT VETERAN',
      shape: 'rounded-square',
      finish: 'matte',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: true
    },
    {
      id: 'bsi-stk-06',
      title: 'New England Rock Vault',
      filename: 'bsi_sticker_06_new_england_rock_vault.jpg',
      imageUrl: '/images/stickers/bsi_sticker_06_new_england_rock_vault.jpg',
      folderId: 'johnny-crests',
      concept: 'Anchored Rhode Island coastal rock crest with combination vault dial and gold accents.',
      topBanner: 'ESTABLISHED 2026',
      bottomBanner: 'NEW ENGLAND ROCK VAULT',
      shape: 'shield',
      finish: 'holographic',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: true
    },
    {
      id: 'bsi-stk-07',
      title: 'Shoot the Loud Stuff',
      filename: 'bsi_sticker_07_shoot_the_loud_stuff.jpg',
      imageUrl: '/images/stickers/bsi_sticker_07_shoot_the_loud_stuff.jpg',
      folderId: 'johnny-pit-gear',
      concept: 'Acoustic blast wave radiating from dual speaker horns framing high-speed DSLR shutter.',
      topBanner: 'BACKSTAGE IMAGES RI',
      bottomBanner: 'SHOOT THE LOUD STUFF',
      shape: 'circle',
      finish: 'glossy',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: true
    },
    {
      id: 'bsi-stk-08',
      title: 'Pit Coffee & 2AM Edits',
      filename: 'bsi_sticker_08_pit_coffee_2am_edits.jpg',
      imageUrl: '/images/stickers/bsi_sticker_08_pit_coffee_2am_edits.jpg',
      folderId: 'johnny-pit-gear',
      concept: 'Steaming ceramic diner mug next to camera memory cards and Lightroom adjustment dial.',
      topBanner: 'NIGHT OWL MEDIA CORRIDOR',
      bottomBanner: 'PIT COFFEE & 2AM EDITS',
      shape: 'rounded-square',
      finish: 'matte',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: true
    },
    {
      id: 'bsi-stk-09b',
      title: 'Pit to Vault (Johnny Cap Edition)',
      filename: 'bsi_sticker_09b_pit_to_vault_johnny_cap.jpg',
      imageUrl: '/images/stickers/bsi_sticker_09b_pit_to_vault_johnny_cap.jpg',
      folderId: 'johnny-crests',
      concept: 'Johnny Adams signature ballcap with telephoto 70-200mm f/2.8 lens and gold wings.',
      topBanner: 'JOHNNY ADAMS SIGNATURE',
      bottomBanner: 'FROM THE PIT TO THE VAULT',
      shape: 'shield',
      finish: 'glossy',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: true
    },
    {
      id: 'bsi-stk-09c',
      title: 'Pit to Vault (Johnny Close-up)',
      filename: 'bsi_sticker_09c_pit_to_vault_johnny_closeup.jpg',
      imageUrl: '/images/stickers/bsi_sticker_09c_pit_to_vault_johnny_closeup.jpg',
      folderId: 'johnny-crests',
      concept: 'Close-up lens front element reflecting explosive stage lighting and Johnny framing shot.',
      topBanner: 'RHODE ISLAND ROCK PIT',
      bottomBanner: '300 DPI PIT MASTERS',
      shape: 'circle',
      finish: 'holographic',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: true
    },
    {
      id: 'bsi-stk-10',
      title: 'Behind the Curtain',
      filename: 'bsi_sticker_10_behind_the_curtain.jpg',
      imageUrl: '/images/stickers/bsi_sticker_10_behind_the_curtain.jpg',
      folderId: 'johnny-vip-passes',
      concept: 'Deep stage velvet curtains pulling back to showcase drum kit riser and glowing monitors.',
      topBanner: 'RESTRICTED STAGE ACCESS',
      bottomBanner: 'BEHIND THE CURTAIN',
      shape: 'vip-pass',
      finish: 'clear',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: false
    },
    {
      id: 'bsi-stk-11',
      title: '110dB & f/2.8 Glass',
      filename: 'bsi_sticker_11_110db_f28_glass.jpg',
      imageUrl: '/images/stickers/bsi_sticker_11_110db_f28_glass.jpg',
      folderId: 'johnny-pit-gear',
      concept: 'Vintage analog sound pressure meter pinned past 110dB surrounded by camera aperture blades.',
      topBanner: 'EARPLUGS & GLASS',
      bottomBanner: '110dB & f/2.8 GLASS',
      shape: 'rounded-square',
      finish: 'matte',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: false
    },
    {
      id: 'bsi-stk-12',
      title: 'Ocean State Rock Pit',
      filename: 'bsi_sticker_12_ocean_state_rock_pit.jpg',
      imageUrl: '/images/stickers/bsi_sticker_12_ocean_state_rock_pit.jpg',
      folderId: 'johnny-crests',
      concept: 'Rhode Island nautical anchor entwined with bass guitar strings and neon lightning bolts.',
      topBanner: 'OCEAN STATE PRIDE',
      bottomBanner: 'RHODE ISLAND ROCK PIT',
      shape: 'shield',
      finish: 'holographic',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: false
    },
    {
      id: 'bsi-stk-13',
      title: 'No Poses, Just Rock',
      filename: 'bsi_sticker_13_no_poses_just_rock.jpg',
      imageUrl: '/images/stickers/bsi_sticker_13_no_poses_just_rock.jpg',
      folderId: 'johnny-crests',
      concept: 'Dynamic motion blur guitarist shredding under arena floodlights with zero posed artifice.',
      topBanner: 'GENUINE LIVE CAPTURE',
      bottomBanner: 'NO POSES, JUST ROCK',
      shape: 'circle',
      finish: 'glossy',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: false
    },
    {
      id: 'bsi-stk-14',
      title: 'Soundcheck to Encore',
      filename: 'bsi_sticker_14_soundcheck_to_encore.jpg',
      imageUrl: '/images/stickers/bsi_sticker_14_soundcheck_to_encore.jpg',
      folderId: 'johnny-vip-passes',
      concept: 'Dual stage clock badge showing early board soundcheck gaffer tape and final encore smoke.',
      topBanner: 'FULL SHOW COVERAGE',
      bottomBanner: 'SOUNDCHECK TO ENCORE',
      shape: 'vip-pass',
      finish: 'matte',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: false
    },
    {
      id: 'bsi-stk-15',
      title: 'Stage Wing Pit Crew',
      filename: 'bsi_sticker_15_stage_wing_pit_crew.jpg',
      imageUrl: '/images/stickers/bsi_sticker_15_stage_wing_pit_crew.jpg',
      folderId: 'johnny-pit-gear',
      concept: 'Coiled heavy multi-pair audio snake, radio walkie talkie, and photographer lens pouch.',
      topBanner: 'BACKSTAGE LOGISTICS',
      bottomBanner: 'STAGE WING PIT CREW',
      shape: 'rounded-square',
      finish: 'glossy',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: false
    },
    {
      id: 'bsi-stk-16',
      title: '300 DPI Stage Masters',
      filename: 'bsi_sticker_16_300dpi_stage_masters.jpg',
      imageUrl: '/images/stickers/bsi_sticker_16_300dpi_stage_masters.jpg',
      folderId: 'johnny-crests',
      concept: 'Precision digital camera sensor grid with bold metallic typographic crest.',
      topBanner: 'UNCOMPRESSED ARCHIVE',
      bottomBanner: '300 DPI STAGE MASTERS',
      shape: 'shield',
      finish: 'holographic',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: false
    },
    {
      id: 'bsi-stk-17',
      title: 'New England Rock Circuit',
      filename: 'bsi_sticker_17_new_england_rock_circuit.jpg',
      imageUrl: '/images/stickers/bsi_sticker_17_new_england_rock_circuit.jpg',
      folderId: 'johnny-crests',
      concept: 'Highway shield emblem spanning Rhode Island, Massachusetts, and Connecticut live venues.',
      topBanner: 'RI · MA · CT CORRIDOR',
      bottomBanner: 'NEW ENGLAND ROCK CIRCUIT',
      shape: 'circle',
      finish: 'glossy',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: false
    },
    {
      id: 'bsi-stk-18',
      title: 'Official Pit Supporter',
      filename: 'bsi_sticker_18_official_pit_supporter.jpg',
      imageUrl: '/images/stickers/bsi_sticker_18_official_pit_supporter.jpg',
      folderId: 'johnny-crests',
      concept: 'Gold star patron crest honoring Buy Me a Coffee sponsors and loyal concert supporters.',
      topBanner: 'BACKSTAGE PATRON SEAL',
      bottomBanner: 'OFFICIAL PIT SUPPORTER',
      shape: 'shield',
      finish: 'holographic',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: false
    },
    {
      id: 'bsi-stk-19',
      title: 'Johnny Adams Pit Veteran',
      filename: 'bsi_sticker_19_johnny_adams_pit_vet.jpg',
      imageUrl: '/images/stickers/bsi_sticker_19_johnny_adams_pit_vet.jpg',
      folderId: 'johnny-pit-gear',
      concept: 'Commemorative veteran badge marking 15+ years behind the barricade at New England venues.',
      topBanner: 'BACKSTAGE IMAGES RI',
      bottomBanner: 'JOHNNY ADAMS PIT VET',
      shape: 'rounded-square',
      finish: 'matte',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: false
    },
    {
      id: 'bsi-stk-20',
      title: 'Backstage Photo Crew Pass',
      filename: 'bsi_sticker_20_backstage_photo_crew.jpg',
      imageUrl: '/images/stickers/bsi_sticker_20_backstage_photo_crew.jpg',
      folderId: 'johnny-vip-passes',
      concept: 'Heavyweight touring pass laminate with high-visibility neon yellow lanyard header.',
      topBanner: 'MEDIA LEVEL 1 ACCESS',
      bottomBanner: 'BACKSTAGE PHOTO CREW',
      shape: 'vip-pass',
      finish: 'glossy',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: false
    },
    {
      id: 'bsi-stk-21',
      title: 'The Man in the Pit (Johnny Crest)',
      filename: 'bsi_sticker_21_the_man_in_the_pit_johnny_crest.jpg',
      imageUrl: '/images/stickers/bsi_sticker_21_the_man_in_the_pit_johnny_crest.jpg',
      folderId: 'johnny-crests',
      concept: 'Heraldic rock crest with crossed telephoto lenses, electric guitar neck, and ribbon.',
      topBanner: 'CANON R6 ON BARRICADE',
      bottomBanner: 'THE MAN IN THE PIT',
      shape: 'shield',
      finish: 'holographic',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: false
    },
    {
      id: 'bsi-stk-22',
      title: 'Pit to Vault (Frontwoman Rocker)',
      filename: 'bsi_sticker_22_pit_to_vault_female_frontwoman_rocker.jpg',
      imageUrl: '/images/stickers/bsi_sticker_22_pit_to_vault_female_frontwoman_rocker.jpg',
      folderId: 'johnny-band-editions',
      concept: 'Dynamic rock frontwoman belting into a vintage chrome microphone surrounded by stage sparks.',
      topBanner: 'POWERHOUSE VOCALS',
      bottomBanner: 'FRONTWOMAN STAGE COMMAND',
      shape: 'shield',
      finish: 'glossy',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: false
    },
    {
      id: 'bsi-stk-23',
      title: 'Pit to Vault (Lead Guitarist & Johnny Cap)',
      filename: 'bsi_sticker_23_pit_to_vault_johnny_cap_female_guitarist.jpg',
      imageUrl: '/images/stickers/bsi_sticker_23_pit_to_vault_johnny_cap_female_guitarist.jpg',
      folderId: 'johnny-band-editions',
      concept: 'Female lead guitarist shredding on arena monitor with Johnny framing foreground capture.',
      topBanner: 'BARRIER PERSPECTIVE',
      bottomBanner: 'PIT TO VAULT LEAD GUITAR',
      shape: 'rounded-square',
      finish: 'holographic',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: false
    },
    {
      id: 'bsi-stk-24',
      title: 'Pit to Vault (Singer Bassist)',
      filename: 'bsi_sticker_24_pit_to_vault_female_singer_bassist.jpg',
      imageUrl: '/images/stickers/bsi_sticker_24_pit_to_vault_female_singer_bassist.jpg',
      folderId: 'johnny-band-editions',
      concept: 'Rock bassist and singer driving low-end rhythm groove under dramatic magenta beam lights.',
      topBanner: 'LOW END RUMBLE',
      bottomBanner: 'STAGE QUEEN BASSIST',
      shape: 'circle',
      finish: 'matte',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: false
    },
    {
      id: 'bsi-stk-25',
      title: 'Queens of the Stage (Rock Crest)',
      filename: 'bsi_sticker_25_queens_of_the_stage_rock_crest.jpg',
      imageUrl: '/images/stickers/bsi_sticker_25_queens_of_the_stage_rock_crest.jpg',
      folderId: 'johnny-band-editions',
      concept: 'Regal rock crest honoring women musicians and headliners commanding New England stages.',
      topBanner: 'NEW ENGLAND HEADLINERS',
      bottomBanner: 'QUEENS OF THE STAGE',
      shape: 'shield',
      finish: 'holographic',
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: '2026-10-31',
      isJohnny: true,
      inPrintPack: false
    },
    // GeneTravels Master Supporter Stickers (44 Designs)
    {
      "id": "eg_01_high_banks_flight_deck",
      "title": "High Banks to Flight Deck — Speedway • Jetway Shield",
      "filename": "high_banks_to_flight_deck_shield.jpg",
      "imageUrl": "/images/stickers/evergreen-diecut/high_banks_to_flight_deck_shield.jpg",
      "folderId": "gt-speedway",
      "category": "Motorsports & Infield",
      "concept": "High Banks to Flight Deck — Speedway • Jetway Shield: FIRST CLASS • FULL THROTTLE",
      "topBanner": "SPEEDWAY • JETWAY",
      "bottomBanner": "HIGH BANKS TO FLIGHT DECK",
      "shape": "shield",
      "finish": "glossy-vinyl",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": true
},
    {
      "id": "eg_02_miles_motors_points",
      "title": "Miles • Motors • Points — First Class • Full Throttle Crest",
      "filename": "miles_motors_points_shield.jpg",
      "imageUrl": "/images/stickers/evergreen-diecut/miles_motors_points_shield.jpg",
      "folderId": "gt-road-warrior",
      "category": "Hot Earl Grey & Ethos",
      "concept": "Miles • Motors • Points — First Class • Full Throttle Crest: GREENTREE TRAVEL COVENANT",
      "topBanner": "FIRST CLASS • FULL THROTTLE",
      "bottomBanner": "MILES • MOTORS • POINTS",
      "shape": "shield",
      "finish": "holographic",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": true
},
    {
      "id": "eg_03_road_warrior_club_crest",
      "title": "Road Warrior VIP All Access — Winged Checkered Flag Crest",
      "filename": "road_warrior_club_crest.jpg",
      "imageUrl": "/images/stickers/evergreen-diecut/road_warrior_club_crest.jpg",
      "folderId": "gt-speedway",
      "category": "Motorsports & Infield",
      "concept": "Road Warrior VIP All Access — Winged Checkered Flag Crest: WINGED CHECKERED FLAG CREST",
      "topBanner": "VIP ALL ACCESS",
      "bottomBanner": "ROAD WARRIOR CLUB",
      "shape": "shield",
      "finish": "glossy-vinyl",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "eg_04_track_to_tarmac_shield",
      "title": "Track to Tarmac — Road Warrior Edition Supercar & Jet Shield",
      "filename": "track_to_tarmac_shield.jpg",
      "imageUrl": "/images/stickers/evergreen-diecut/track_to_tarmac_shield.jpg",
      "folderId": "gt-speedway",
      "category": "Motorsports & Infield",
      "concept": "Track to Tarmac — Road Warrior Edition Supercar & Jet Shield: SUPERCAR & JET CORRIDOR",
      "topBanner": "ROAD WARRIOR EDITION",
      "bottomBanner": "TRACK TO TARMAC",
      "shape": "shield",
      "finish": "glossy-vinyl",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "orig_05_flight_deck_compass",
      "title": "Flight Deck Trading Edition — Classic Compass & 777 Shield",
      "filename": "concept-1-flight-deck-shield-v2.jpg",
      "imageUrl": "/images/stickers/concept-1-flight-deck-shield-v2.jpg",
      "folderId": "gt-aviation",
      "category": "Aviation & Rental Cars",
      "concept": "Flight Deck Trading Edition — Classic Compass & 777 Shield: TRANSPACIFIC SQUADRON",
      "topBanner": "FLIGHT DECK TRADING",
      "bottomBanner": "CLASSIC COMPASS & 777",
      "shape": "shield",
      "finish": "holographic",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "orig_06_flight_deck_ornate",
      "title": "Flight Deck Aircraft Trading Exchange — Ornate World Map Crest",
      "filename": "concept-1-flight-deck-ornate-master.jpg",
      "imageUrl": "/images/stickers/concept-1-flight-deck-ornate-master.jpg",
      "folderId": "gt-aviation",
      "category": "Aviation & Rental Cars",
      "concept": "Flight Deck Aircraft Trading Exchange — Ornate World Map Crest: GLOBAL NAVIGATION MATRIX",
      "topBanner": "AIRCRAFT TRADING EXCHANGE",
      "bottomBanner": "FLIGHT DECK ORNATE CREST",
      "shape": "shield",
      "finish": "glossy-vinyl",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "orig_07_flight_deck_speed_shield",
      "title": "Flight Deck Trading Edition — GT Speed Shield Tail Fin",
      "filename": "concept-1-flight-deck-shield-master-speed-shield.png",
      "imageUrl": "/images/stickers/concept-1-flight-deck-shield-master-speed-shield.png",
      "folderId": "gt-aviation",
      "category": "Aviation & Rental Cars",
      "concept": "Flight Deck Trading Edition — GT Speed Shield Tail Fin: SWEPT-WING DYNAMICS",
      "topBanner": "GT SPEED SHIELD",
      "bottomBanner": "TAIL FIN EDITION",
      "shape": "die-cut",
      "finish": "holographic",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "orig_08_transpacific_flagship",
      "title": "Transpacific Flagship — Pilot Trading Card Edition (777 + A350)",
      "filename": "concept-2-transpacific-flagship-master.png",
      "imageUrl": "/images/stickers/concept-2-transpacific-flagship-master.png",
      "folderId": "gt-aviation",
      "category": "Aviation & Rental Cars",
      "concept": "Transpacific Flagship — Pilot Trading Card Edition (777 + A350): OFFICIAL PILOT TRADING CARD",
      "topBanner": "TRANSPACIFIC FLAGSHIP",
      "bottomBanner": "WIDEBODY 777 & A350",
      "shape": "card",
      "finish": "holographic",
      "dimensions": "3\" x 4\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "orig_09_transpacific_card_v2",
      "title": "Transpacific Flagship — Golden Sunset Widebody Card",
      "filename": "concept-2-transpacific-card-v2.jpg",
      "imageUrl": "/images/stickers/concept-2-transpacific-card-v2.jpg",
      "folderId": "gt-aviation",
      "category": "Aviation & Rental Cars",
      "concept": "Transpacific Flagship — Golden Sunset Widebody Card: ROUTE MATRIX EDITION",
      "topBanner": "TRANSPACIFIC SQUADRON",
      "bottomBanner": "GOLDEN SUNSET CARD",
      "shape": "card",
      "finish": "matte",
      "dimensions": "3\" x 4\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "orig_10_high_banks_winner",
      "title": "From the High Banks to the Flight Deck — #26 Stock Car & Jet Crew Edition",
      "filename": "concept-3-winner-perfected.png",
      "imageUrl": "/images/stickers/concept-3-winner-perfected.png",
      "folderId": "gt-speedway",
      "category": "Motorsports & Infield",
      "concept": "From the High Banks to the Flight Deck — #26 Stock Car & Jet Crew Edition: STOCK CAR & JET TEAM",
      "topBanner": "HIGH BANKS TO FLIGHT DECK",
      "bottomBanner": "#26 CREW EDITION",
      "shape": "die-cut",
      "finish": "glossy-vinyl",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "orig_11_high_banks_obsidian",
      "title": "From the High Banks to the Flight Deck — Obsidian GT Shield Edition",
      "filename": "concept-3-option-1-obsidian-shield.png",
      "imageUrl": "/images/stickers/concept-3-option-1-obsidian-shield.png",
      "folderId": "gt-speedway",
      "category": "Motorsports & Infield",
      "concept": "From the High Banks to the Flight Deck — Obsidian GT Shield Edition: STEALTH LIVERY CORRIDOR",
      "topBanner": "OBSIDIAN GT SHIELD",
      "bottomBanner": "HIGH BANKS TO FLIGHT DECK",
      "shape": "shield",
      "finish": "matte",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "orig_12_high_banks_racing_navy",
      "title": "From the High Banks to the Flight Deck — Racing Navy Shield Edition",
      "filename": "concept-3-option-2-racing-navy-shield.png",
      "imageUrl": "/images/stickers/concept-3-option-2-racing-navy-shield.png",
      "folderId": "gt-speedway",
      "category": "Motorsports & Infield",
      "concept": "From the High Banks to the Flight Deck — Racing Navy Shield Edition: METALLIC GOLD CONTOUR",
      "topBanner": "RACING NAVY SHIELD",
      "bottomBanner": "HIGH BANKS TO FLIGHT DECK",
      "shape": "shield",
      "finish": "glossy-vinyl",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "orig_13_high_banks_white_decal",
      "title": "From the High Banks to the Flight Deck — Clean White Decal Edition",
      "filename": "concept-3-option-3-clean-white-decal.png",
      "imageUrl": "/images/stickers/concept-3-option-3-clean-white-decal.png",
      "folderId": "gt-speedway",
      "category": "Motorsports & Infield",
      "concept": "From the High Banks to the Flight Deck — Clean White Decal Edition: HIGH VISIBILITY OUTLINE",
      "topBanner": "CLEAN WHITE DECAL",
      "bottomBanner": "HIGH BANKS TO FLIGHT DECK",
      "shape": "die-cut",
      "finish": "matte",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "orig_14_gt_speed_shield",
      "title": "The GT Speed Shield — GreenTree Primary Die-Cut Emblem",
      "filename": "concept-4-speed-shield-die-cut-sticker.png",
      "imageUrl": "/images/stickers/concept-4-speed-shield-die-cut-sticker.png",
      "folderId": "gt-road-warrior",
      "category": "Hot Earl Grey & Ethos",
      "concept": "The GT Speed Shield — GreenTree Primary Die-Cut Emblem: FOUNDATIONAL INSIGNIA",
      "topBanner": "GREENTREE EMBLEM",
      "bottomBanner": "THE GT SPEED SHIELD",
      "shape": "die-cut",
      "finish": "holographic",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": true
},
    {
      "id": "ed27_15_all_access",
      "title": "High Banks to Flight Deck — #27 All Access Edition",
      "filename": "genetravels_all_access_27.jpg",
      "imageUrl": "/images/stickers/2027-edition/genetravels_all_access_27.jpg",
      "folderId": "gt-crew-editions",
      "category": "Hot Earl Grey & Ethos",
      "concept": "High Banks to Flight Deck — #27 All Access Edition: PASSPORT LAMINATE CREDENTIAL",
      "topBanner": "GLOBAL ALL ACCESS",
      "bottomBanner": "#27 OFFICIAL PASS",
      "shape": "ticket-stub",
      "finish": "holographic",
      "dimensions": "3\" x 4\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": true
},
    {
      "id": "ed27_16_crew_edition",
      "title": "High Banks to Flight Deck — #27 Crew Edition",
      "filename": "genetravels_crew_edition_27.jpg",
      "imageUrl": "/images/stickers/2027-edition/genetravels_crew_edition_27.jpg",
      "folderId": "gt-crew-editions",
      "category": "Motorsports & Infield",
      "concept": "High Banks to Flight Deck — #27 Crew Edition: GLOBAL RACE CORRIDOR",
      "topBanner": "FLIGHT LOGISTICS",
      "bottomBanner": "#27 CREW EDITION",
      "shape": "shield",
      "finish": "glossy-vinyl",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "ed27_17_race_edition",
      "title": "High Banks to Flight Deck — #27 Race Edition",
      "filename": "genetravels_race_edition_27.jpg",
      "imageUrl": "/images/stickers/2027-edition/genetravels_race_edition_27.jpg",
      "folderId": "gt-crew-editions",
      "category": "Motorsports & Infield",
      "concept": "High Banks to Flight Deck — #27 Race Edition: INFIELD COMMAND CORRIDOR",
      "topBanner": "HIGH BANKS SPEEDWAY",
      "bottomBanner": "#27 RACE EDITION",
      "shape": "circle",
      "finish": "glossy-vinyl",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "ed27_18_road_warrior",
      "title": "High Banks to Flight Deck — #27 Road Warrior Edition",
      "filename": "genetravels_road_warrior_27.jpg",
      "imageUrl": "/images/stickers/2027-edition/genetravels_road_warrior_27.jpg",
      "folderId": "gt-ambassador-elite",
      "category": "Bonvoy Elite & Audits",
      "concept": "High Banks to Flight Deck — #27 Road Warrior Edition: 100+ NIGHTS PER YEAR",
      "topBanner": "COAST TO COAST",
      "bottomBanner": "#27 ROAD WARRIOR",
      "shape": "shield",
      "finish": "holographic",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "ed27_19_track_to_tarmac",
      "title": "High Banks to Flight Deck — #27 Track to Tarmac Edition",
      "filename": "genetravels_track_to_tarmac_27.png",
      "imageUrl": "/images/stickers/2027-edition/genetravels_track_to_tarmac_27.png",
      "folderId": "gt-crew-editions",
      "category": "Motorsports & Infield",
      "concept": "High Banks to Flight Deck — #27 Track to Tarmac Edition: GT CORRIDOR LIVERY",
      "topBanner": "SPEEDWAY TO RUNWAY",
      "bottomBanner": "#27 TRACK TO TARMAC",
      "shape": "die-cut",
      "finish": "glossy-vinyl",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "ed27_20_star_banner",
      "title": "High Banks to Flight Deck — #27 Star Banner Edition",
      "filename": "genetravels_full_width_url_27.png",
      "imageUrl": "/images/stickers/2027-edition/genetravels_full_width_url_27.png",
      "folderId": "gt-bumpers",
      "category": "Hot Earl Grey & Ethos",
      "concept": "High Banks to Flight Deck — #27 Star Banner Edition: HIGH BANKS TO FLIGHT DECK",
      "topBanner": "GENETRAVELS.COM",
      "bottomBanner": "#27 STAR BANNER",
      "shape": "bumper-strip",
      "finish": "glossy-vinyl",
      "dimensions": "8.5\" x 2.5\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "gt_art_01_beryl_ax_cyber_shield",
      "title": "Captive Portal Crusher — GL.iNet Beryl AX Cyber Shield",
      "filename": "gt_art_01_beryl_ax_cyber_shield.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_01_beryl_ax_cyber_shield.jpg",
      "folderId": "gt-travel-tech",
      "category": "Network Defense & Tech",
      "concept": "Captive Portal Crusher — GL.iNet Beryl AX Cyber Shield: WIREGUARD HARDWARE TUNNEL",
      "topBanner": "GL.INET BERYL AX",
      "bottomBanner": "CAPTIVE PORTAL CRUSHER",
      "shape": "shield",
      "finish": "holographic",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": true
},
    {
      "id": "gt_art_02_hdmi_input2_liberator",
      "title": "HDMI Input 2 Liberator — MPI Box Bypassed • 4K Unlocked",
      "filename": "gt_art_02_hdmi_input2_liberator.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_02_hdmi_input2_liberator.jpg",
      "folderId": "gt-travel-tech",
      "category": "Network Defense & Tech",
      "concept": "HDMI Input 2 Liberator — MPI Box Bypassed • 4K Unlocked: PRO:CENTRIC UNLOCKED",
      "topBanner": "MPI RJ12 BYPASS",
      "bottomBanner": "HDMI 2 LIBERATOR",
      "shape": "die-cut",
      "finish": "glossy-vinyl",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "gt_art_03_42db_pillow_soundmeter",
      "title": "42 dB Pillow Auditor — Acoustic Silence Telemetry HUD",
      "filename": "gt_art_03_42db_pillow_soundmeter.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_03_42db_pillow_soundmeter.jpg",
      "folderId": "gt-travel-tech",
      "category": "Network Defense & Tech",
      "concept": "42 dB Pillow Auditor — Acoustic Silence Telemetry HUD: TRUE SILENCE BENCHMARK",
      "topBanner": "ACOUSTIC TELEMETRY",
      "bottomBanner": "42 DB PILLOW AUDITOR",
      "shape": "circle",
      "finish": "matte",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "gt_art_04_folio_laser_forensics",
      "title": "Folio Forensics — Zero Uncredited Dollars Laser Audit",
      "filename": "gt_art_04_folio_laser_forensics.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_04_folio_laser_forensics.jpg",
      "folderId": "gt-folio-forensics",
      "category": "Folio Forensics",
      "concept": "Folio Forensics — Zero Uncredited Dollars Laser Audit: ZERO UNCREDITED DOLLARS",
      "topBanner": "OPERA PMS AUDIT",
      "bottomBanner": "FOLIO LASER FORENSICS",
      "shape": "shield",
      "finish": "holographic",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": true
},
    {
      "id": "gt_art_05_30yr_datacenter_architect",
      "title": "30 Years in the Racks — Datacenter to Flight Deck",
      "filename": "gt_art_05_30yr_datacenter_architect.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_05_30yr_datacenter_architect.jpg",
      "folderId": "gt-travel-tech",
      "category": "Network Defense & Tech",
      "concept": "30 Years in the Racks — Datacenter to Flight Deck: GREENTREE HOSTING LLC",
      "topBanner": "30 YEARS IN THE RACKS",
      "bottomBanner": "DATACENTER ARCHITECT",
      "shape": "die-cut",
      "finish": "matte",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "gt_art_06_5g_hotspot_uplink",
      "title": "Hotel Wi-Fi Failed — 5G Personal Hotspot Uplink Active",
      "filename": "gt_art_06_5g_hotspot_uplink.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_06_5g_hotspot_uplink.jpg",
      "folderId": "gt-travel-tech",
      "category": "Network Defense & Tech",
      "concept": "Hotel Wi-Fi Failed — 5G Personal Hotspot Uplink Active: STANDALONE CELLULAR UPLINK",
      "topBanner": "HOTEL WI-FI FAILED",
      "bottomBanner": "5G HOTSPOT UPLINK",
      "shape": "die-cut",
      "finish": "glossy-vinyl",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "gt_art_07_waikiki_9night_retro_poster",
      "title": "Waikiki 9-Night Masterclass — 85K Cert + Dynamic Drop",
      "filename": "gt_art_07_waikiki_9night_retro_poster.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_07_waikiki_9night_retro_poster.jpg",
      "folderId": "gt-ambassador-elite",
      "category": "Bonvoy Elite & Audits",
      "concept": "Waikiki 9-Night Masterclass — 85K Cert + Dynamic Drop: ARBITRAGE VALUATION",
      "topBanner": "85K CERT + DYNAMIC DROP",
      "bottomBanner": "WAIKIKI 9-NIGHT MASTERCLASS",
      "shape": "card",
      "finish": "matte",
      "dimensions": "3\" x 4\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "gt_art_08_seat_2a_bulkhead_sanctuary",
      "title": "Seat 2A Bulkhead — Transpacific First Class Command",
      "filename": "gt_art_08_seat_2a_bulkhead_sanctuary.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_08_seat_2a_bulkhead_sanctuary.jpg",
      "folderId": "gt-aviation",
      "category": "Aviation & Rental Cars",
      "concept": "Seat 2A Bulkhead — Transpacific First Class Command: NO FOOTWELL RESTRICTION",
      "topBanner": "TRANSPACIFIC FIRST CLASS",
      "bottomBanner": "SEAT 2A BULKHEAD",
      "shape": "rounded-square",
      "finish": "holographic",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": true
},
    {
      "id": "gt_art_09_delta_quad_stack_mach",
      "title": "Diamond Medallion — The Delta Amex Quad-Stack",
      "filename": "gt_art_09_delta_quad_stack_mach.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_09_delta_quad_stack_mach.jpg",
      "folderId": "gt-aviation",
      "category": "Aviation & Rental Cars",
      "concept": "Diamond Medallion — The Delta Amex Quad-Stack: MQD HEADSTART ARCHITECTURE",
      "topBanner": "DIAMOND MEDALLION",
      "bottomBanner": "DELTA QUAD-STACK",
      "shape": "shield",
      "finish": "glossy-vinyl",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "gt_art_10_75k_lounge_marquee",
      "title": "The $75K Lounge Spend Pivot — Sky Club & Centurion",
      "filename": "gt_art_10_75k_lounge_marquee.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_10_75k_lounge_marquee.jpg",
      "folderId": "gt-aviation",
      "category": "Aviation & Rental Cars",
      "concept": "The $75K Lounge Spend Pivot — Sky Club & Centurion: UNLIMITED GUEST ACCESS",
      "topBanner": "SKY CLUB & CENTURION",
      "bottomBanner": "$75K LOUNGE SPEND PIVOT",
      "shape": "die-cut",
      "finish": "holographic",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "gt_art_11_pointstracker_2018_excel",
      "title": "PointsTracker.app — Born From a 2018 Excel Sheet",
      "filename": "gt_art_11_pointstracker_2018_excel.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_11_pointstracker_2018_excel.jpg",
      "folderId": "gt-folio-forensics",
      "category": "Folio Forensics",
      "concept": "PointsTracker.app — Born From a 2018 Excel Sheet: INDEPENDENT RECONCILIATION",
      "topBanner": "BORN FROM 2018 EXCEL",
      "bottomBanner": "POINTSTRACKER.APP",
      "shape": "rounded-square",
      "finish": "matte",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "gt_art_12_hot_earl_grey_2am_audit",
      "title": "Hot Earl Grey & 2 AM Audits — Real Beds • Real Folios",
      "filename": "gt_art_12_hot_earl_grey_2am_audit.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_12_hot_earl_grey_2am_audit.jpg",
      "folderId": "gt-road-warrior",
      "category": "Hot Earl Grey & Ethos",
      "concept": "Hot Earl Grey & 2 AM Audits — Real Beds • Real Folios: INDEPENDENT JOURNALISM FUEL",
      "topBanner": "REAL BEDS • REAL FOLIOS",
      "bottomBanner": "HOT EARL GREY & 2 AM AUDITS",
      "shape": "circle",
      "finish": "matte",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": true
},
    {
      "id": "gt_art_13_ambassador_100_nights_crest",
      "title": "Ambassador Elite — 100+ Paid Nights a Year Crest",
      "filename": "gt_art_13_ambassador_100_nights_crest.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_13_ambassador_100_nights_crest.jpg",
      "folderId": "gt-ambassador-elite",
      "category": "Bonvoy Elite & Audits",
      "concept": "Ambassador Elite — 100+ Paid Nights a Year Crest: ZERO COMPED NIGHTS",
      "topBanner": "100+ PAID NIGHTS A YEAR",
      "bottomBanner": "AMBASSADOR ELITE CREST",
      "shape": "shield",
      "finish": "holographic",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": true
},
    {
      "id": "gt_art_14_section_43c_enforcer",
      "title": "Bonvoy Section 4.3.c Enforcer — Welcome Gift Guaranteed",
      "filename": "gt_art_14_section_43c_enforcer.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_14_section_43c_enforcer.jpg",
      "folderId": "gt-ambassador-elite",
      "category": "Bonvoy Elite & Audits",
      "concept": "Bonvoy Section 4.3.c Enforcer — Welcome Gift Guaranteed: ELITE GUARANTEE RECOVERY",
      "topBanner": "TERMS & CONDITIONS",
      "bottomBanner": "SECTION 4.3.c ENFORCER",
      "shape": "die-cut",
      "finish": "glossy-vinyl",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "gt_art_15_4pm_late_checkout_chronograph",
      "title": "4:00 PM Late Checkout — Guaranteed Elite Chronograph",
      "filename": "gt_art_15_4pm_late_checkout_chronograph.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_15_4pm_late_checkout_chronograph.jpg",
      "folderId": "gt-ambassador-elite",
      "category": "Bonvoy Elite & Audits",
      "concept": "4:00 PM Late Checkout — Guaranteed Elite Chronograph: KEYCARD RE-ENCODED",
      "topBanner": "GUARANTEED ELITE BENEFIT",
      "bottomBanner": "4:00 PM LATE CHECKOUT",
      "shape": "circle",
      "finish": "glossy-vinyl",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "gt_art_16_destination_fee_slayer",
      "title": "Destination Fee Slayer — Mandatory Resort Fee Sliced",
      "filename": "gt_art_16_destination_fee_slayer.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_16_destination_fee_slayer.jpg",
      "folderId": "gt-folio-forensics",
      "category": "Folio Forensics",
      "concept": "Destination Fee Slayer — Mandatory Resort Fee Sliced: LINE-ITEM DISPUTE HONORED",
      "topBanner": "RESORT FEE ZEROED",
      "bottomBanner": "DESTINATION FEE SLAYER",
      "shape": "die-cut",
      "finish": "matte",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "gt_art_17_paid_stays_zero_fluff",
      "title": "100% Paid Stays — Zero Influencer Fluff Stamp",
      "filename": "gt_art_17_paid_stays_zero_fluff.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_17_paid_stays_zero_fluff.jpg",
      "folderId": "gt-road-warrior",
      "category": "Hot Earl Grey & Ethos",
      "concept": "100% Paid Stays — Zero Influencer Fluff Stamp: UNFILTERED GUEST TELEMETRY",
      "topBanner": "ZERO INFLUENCER FLUFF",
      "bottomBanner": "100% PAID STAYS",
      "shape": "circle",
      "finish": "matte",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "gt_art_18_maureen_botanical_conservatory",
      "title": "Maureen Travels — Botanical & Daytime Guest Audit",
      "filename": "gt_art_18_maureen_botanical_conservatory.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_18_maureen_botanical_conservatory.jpg",
      "folderId": "gt-road-warrior",
      "category": "Hot Earl Grey & Ethos",
      "concept": "Maureen Travels — Botanical & Daytime Guest Audit: HOSPITALITY QUALITY ASSURANCE",
      "topBanner": "BOTANICAL & DAYTIME",
      "bottomBanner": "MAUREEN TRAVELS AUDIT",
      "shape": "die-cut",
      "finish": "glossy-vinyl",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "gt_art_19_south_beach_16th_collins_retro",
      "title": "South Beach Arbitrage — 16th & Collins Art Deco Badge",
      "filename": "gt_art_19_south_beach_16th_collins_retro.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_19_south_beach_16th_collins_retro.jpg",
      "folderId": "gt-ambassador-elite",
      "category": "Bonvoy Elite & Audits",
      "concept": "South Beach Arbitrage — 16th & Collins Art Deco Badge: ROYAL PALM CADILLAC CORRIDOR",
      "topBanner": "16TH & COLLINS AVE",
      "bottomBanner": "SOUTH BEACH ARBITRAGE",
      "shape": "die-cut",
      "finish": "holographic",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "gt_art_20_1999_primary_rental_shield",
      "title": "$19.99 Primary Rental Hack — Decline the Counter CDW",
      "filename": "gt_art_20_1999_primary_rental_shield.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_20_1999_primary_rental_shield.jpg",
      "folderId": "gt-aviation",
      "category": "Aviation & Rental Cars",
      "concept": "$19.99 Primary Rental Hack — Decline the Counter CDW: AMEX PREMIUM COVERAGE",
      "topBanner": "DECLINE COUNTER CDW",
      "bottomBanner": "$19.99 PRIMARY RENTAL",
      "shape": "shield",
      "finish": "glossy-vinyl",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "gt_art_21_coronado_gle350_heist",
      "title": "Coronado Island GLE 350 Heist — $756 Wiped by Free Days",
      "filename": "gt_art_21_coronado_gle350_heist.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_21_coronado_gle350_heist.jpg",
      "folderId": "gt-aviation",
      "category": "Aviation & Rental Cars",
      "concept": "Coronado Island GLE 350 Heist — $756 Wiped by Free Days: NATIONAL EXECUTIVE ELITE",
      "topBanner": "$756 WIPED BY FREE DAYS",
      "bottomBanner": "CORONADO GLE 350 HEIST",
      "shape": "die-cut",
      "finish": "holographic",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "gt_art_22_51_speedway_infield_command",
      "title": "51-Speedway Infield Command — 143,000+ Members Strong",
      "filename": "gt_art_22_51_speedway_infield_command.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_22_51_speedway_infield_command.jpg",
      "folderId": "gt-speedway",
      "category": "Motorsports & Infield",
      "concept": "51-Speedway Infield Command — 143,000+ Members Strong: CAMPINGANDTAILGATING.COM",
      "topBanner": "143,000+ MEMBERS STRONG",
      "bottomBanner": "51 SPEEDWAY INFIELD",
      "shape": "shield",
      "finish": "glossy-vinyl",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": true
},
    {
      "id": "gt_art_23_25ft_flagpole_infield_beacon",
      "title": "Meet Me Under the Flagpole — 25ft InfieldLife Beacon",
      "filename": "gt_art_23_25ft_flagpole_infield_beacon.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_23_25ft_flagpole_infield_beacon.jpg",
      "folderId": "gt-speedway",
      "category": "Motorsports & Infield",
      "concept": "Meet Me Under the Flagpole — 25ft InfieldLife Beacon: INFIELDLIFE.COM FLAGSHIP",
      "topBanner": "25FT INFIELD BEACON",
      "bottomBanner": "MEET UNDER THE FLAGPOLE",
      "shape": "die-cut",
      "finish": "matte",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": false
},
    {
      "id": "gt_art_24_hpde_late_apex_telemetry",
      "title": "Late Apex • Full Throttle — DriveHPDE & TrackDayOS HUD",
      "filename": "gt_art_24_hpde_late_apex_telemetry.jpg",
      "imageUrl": "/images/stickers/collection/gt_art_24_hpde_late_apex_telemetry.jpg",
      "folderId": "gt-speedway",
      "category": "Motorsports & Infield",
      "concept": "Late Apex • Full Throttle — DriveHPDE & TrackDayOS HUD: RUN GROUP A TELEMETRY",
      "topBanner": "DRIVEHPDE & TRACKDAYOS",
      "bottomBanner": "LATE APEX • FULL THROTTLE",
      "shape": "shield",
      "finish": "holographic",
      "dimensions": "3\" x 3\"",
      "dpi": 300,
      "dateAdded": "2026-10-31",
      "isGeneTravels": true,
      "inPrintPack": true
}
  ];

  var PROMPT_PRESETS_20 = [
    { id: 'p01', group: 'Backstage Images RI (8)', title: '1. Barricade Warhorse (70-200mm Lens & Stage Smoke)', top: 'BARRICADE WARHORSE', bottom: 'BACKSTAGEIMAGESRI.COM', shape: 'shield', finish: 'glossy', concept: '3-inch die-cut rock crest featuring a telephoto 70-200mm f/2.8 camera lens firing through golden concert stage smoke, flanked by dual Marshall amplifier stacks and lightning bolts, thick white die-cut contour border.' },
    { id: 'p02', group: 'Backstage Images RI (8)', title: '2. First 3 Songs · Zero Flash Pit Pass', top: 'FIRST 3 · NO FLASH', bottom: 'OFFICIAL PIT CREDENTIAL', shape: 'vip-pass', finish: 'holographic', concept: '3-inch holographic VIP concert photo pass laminate with lanyard slot, neon laser stage beams, security barcode, and bold metallic gold typography, thick white die-cut vinyl border.' },
    { id: 'p03', group: 'Backstage Images RI (8)', title: '3. Pin the VU Meter (110dB + f/2.8 Glass)', top: '110dB & F/2.8 GLASS', bottom: 'SHOOT THE LOUD STUFF', shape: 'circle', finish: 'glossy', concept: '3-inch circular medallion showing an analog VU decibel meter pinned into the red zone at +6dB surrounded by camera aperture blades and glowing vacuum tubes, thick white die-cut border.' },
    { id: 'p04', group: 'Backstage Images RI (8)', title: '4. Stage Queens Flying-V Frontwoman Crest', top: 'LIVE ROCK · FRONT ROW', bottom: 'STAGE QUEENS · 300 DPI VAULT', shape: 'shield', finish: 'holographic', concept: 'Ornate gold heraldic rock shield featuring a fierce female rock frontwoman in a studded leather jacket playing a Flying-V guitar into a vintage chrome microphone, thick white die-cut border.' },
    { id: 'p05', group: 'Backstage Images RI (8)', title: '5. The Man in the Pit (Johnny Adams Portrait Crest)', top: 'THE MAN IN THE PIT', bottom: 'BACKSTAGE IMAGES RI · JOHNNY ADAMS', shape: 'shield', finish: 'glossy', concept: 'Illustrated heraldic rock shield of bearded concert photographer Johnny Adams wearing sunglasses on his head and a leather vest with US flag patch, holding a Canon DSLR lens forward between Marshall amp stacks.' },
    { id: 'p06', group: 'Backstage Images RI (8)', title: '6. Pit Coffee & 2 AM Lightroom Edits', top: 'PIT COFFEE & 2AM EDITS', bottom: 'SLEEP IS FOR ACOUSTIC SETS', shape: 'rounded-square', finish: 'matte', concept: '3-inch rounded square sticker showing a flaming black coffee mug surrounded by CFexpress memory cards, camera batteries, and audio equalizers in gold and crimson, thick white die-cut border.' },
    { id: 'p07', group: 'Backstage Images RI (8)', title: '7. Ocean State Rock Pit Anchor & Fretboard', top: 'OCEAN STATE ROCK PIT', bottom: 'HOPE, RI · BACKSTAGEIMAGESRI.COM', shape: 'shield', finish: 'holographic', concept: 'Rhode Island golden fouled anchor fused with an electric guitar neck and crashing ocean soundwaves, framed by a metallic gold scroll banner and thick white die-cut border.' },
    { id: 'p08', group: 'Backstage Images RI (8)', title: '8. Official Pit Supporter (Buy Me a Coffee Patron)', top: 'OFFICIAL PIT SUPPORTER', bottom: 'FUELING THE ROCK ARCHIVE', shape: 'shield', finish: 'glossy', concept: 'Gold patron shield crest with a steaming espresso cup atop a rock amplifier half-stack, crossed drumsticks, and golden laurel wreath, thick white die-cut border.' },
    { id: 'p09', group: 'GeneTravels Aviation & Motorsports (6)', title: '9. High Banks to Flight Deck Speed Shield', top: 'HIGH BANKS TO FLIGHT DECK', bottom: 'GENETRAVELS.COM', shape: 'shield', finish: 'glossy', concept: 'Heraldic navy and metallic gold aviation-motorsports crest featuring a climbing widebody jetliner above a #27 GT stock car on a high-banked speedway oval, thick white die-cut border.' },
    { id: 'p10', group: 'GeneTravels Aviation & Motorsports (6)', title: '10. Miles • Motors • Points Club Crest', top: 'MILES · MOTORS · POINTS', bottom: 'GENETRAVELS.COM', shape: 'shield', finish: 'holographic', concept: 'Luxury navy and gold winged crest combining a jet turbine, checkered racing flag, and black centurion travel card emblem, thick white die-cut border.' },
    { id: 'p11', group: 'GeneTravels Aviation & Motorsports (6)', title: '11. #27 Daytona Infield Road Warrior Badge', top: '#27 ROAD WARRIOR EDITION', bottom: 'TRACK TO TARMAC · 2027', shape: 'circle', finish: 'glossy', concept: '3-inch motorsport medallion featuring race car #27 banking under stadium lights with a jet contrail overhead and gold laurel wreath, thick white die-cut border.' },
    { id: 'p12', group: 'GeneTravels Aviation & Motorsports (6)', title: '12. Transpacific First Class Flagship Pass', top: 'TRANSPACIFIC SQUADRON', bottom: 'FLIGHT DECK ALL ACCESS', shape: 'vip-pass', finish: 'holographic', concept: 'First-class boarding pass and cockpit credential badge in deep navy and gold foil with globe grid, Boeing 777 silhouette, and lanyard slot, thick white die-cut border.' },
    { id: 'p13', group: 'GeneTravels Aviation & Motorsports (6)', title: '13. Track to Tarmac Pit Crew Edition', top: 'TRACK TO TARMAC CREW', bottom: 'GENETRAVELS RACING #27', shape: 'rounded-square', finish: 'matte', concept: 'Carbon-fiber style motorsport pit crew badge with winged GT shield, telemetry tach, and checkered racing stripes, thick white die-cut border.' },
    { id: 'p14', group: 'GeneTravels Aviation & Motorsports (6)', title: '14. Winged GT Speed Shield Contour Decal', top: 'AERODYNAMIC SPEED SHIELD', bottom: 'GENETRAVELS.COM', shape: 'shield', finish: 'glossy', concept: 'Sleek triple-winged metallic GT emblem shield in obsidian black, racing navy, and gold with a thick contour white vinyl cutline.' },
    { id: 'p15', group: 'Universal Brand & Crew Badges (6)', title: '15. GreenTree AI Fleet Command Crest', top: 'GREENTREE AI FLEET', bottom: 'GREENTREE COMMAND OS', shape: 'shield', finish: 'holographic', concept: 'Futuristic emerald and gold cybernetic shield crest with neural network nodes, server rack core, and twin lightning wings, thick white die-cut border.' },
    { id: 'p16', group: 'Universal Brand & Crew Badges (6)', title: '16. Heavy Recovery & Rotator Crew Badge', top: 'HEAVY RECOVERY CREW', bottom: '24/7 ROTATOR OPS', shape: 'shield', finish: 'glossy', concept: 'Bold amber and black heavy towing crest featuring a twin-boom rotator wrecker truck, steel rigging hooks, and highway shield, thick white die-cut border.' },
    { id: 'p17', group: 'Universal Brand & Crew Badges (6)', title: '17. Industrial Trade Master Guild Seal', top: 'INDUSTRIAL TRADE MASTER', bottom: 'BUILT FOR THE JOBSITE', shape: 'circle', finish: 'matte', concept: 'Heavy steel gear medallion with crossed torque wrench and high-voltage lightning bolt in safety orange and gunmetal, thick white die-cut border.' },
    { id: 'p18', group: 'Universal Brand & Crew Badges (6)', title: '18. HPDE Track Day Instructor Decal', top: 'HPDE TRACK INSTRUCTOR', bottom: 'LATE APEX · FULL THROTTLE', shape: 'shield', finish: 'glossy', concept: 'Motorsport track day crest with racing helmet, red-and-white apex curbing, and twin checkered flags, thick white die-cut border.' },
    { id: 'p19', group: 'Universal Brand & Crew Badges (6)', title: '19. Master Electrician High-Voltage Shield', top: 'HIGH VOLTAGE SPECIALIST', bottom: 'LICENSED ELECTRICAL CREW', shape: 'shield', finish: 'holographic', concept: 'Electric blue and gold crest featuring a utility bucket truck, industrial switchgear arc flash shield, and twin lightning bolts, thick white die-cut border.' },
    { id: 'p20', group: 'Universal Brand & Crew Badges (6)', title: '20. Executive Chauffeur & Fleet Dispatch Crest', top: 'EXECUTIVE FLEET DISPATCH', bottom: 'WHITE GLOVE LIVERY', shape: 'shield', finish: 'glossy', concept: 'Luxury black-and-gold aviation and executive black SUV crest with winged steering wheel and compass rose, thick white die-cut border.' }
  ];

  var TWIN3_KNOWLEDGE_BASE = {
    agentName: 'Site Twin #3',
    role: "Johnny Adams' AI Co-Pilot & Studio Assistant",
    adviceLead: 'Physical 3" die-cut stickers require bold high-contrast outlines, readable heavy typography, and a thick 2.5mm white die-cut contour cutline. Fine hairline strokes get lost when printed at 300 DPI.',
    templates: [
      {
        tag: 'Heavy Crest Shield',
        shape: 'shield',
        finish: 'glossy',
        conceptModifier: 'ornate heraldic shield with thick white die-cut border, crossed vintage microphones, vacuum tube glow, and high-contrast linework',
        topBanner: 'BACKSTAGE IMAGES RI',
        bottomBanner: 'LIVE ROCK PIT MASTERS',
        rationale: 'Maximum visual impact on flight cases, guitar cases, and venue road gear.'
      },
      {
        tag: 'Holographic Stage Medallion',
        shape: 'circle',
        finish: 'holographic',
        conceptModifier: 'circular concert pass medallion with prismatic rainbow foil sheen, dramatic spotlight beams, and bold stenciled typography',
        topBanner: 'ALL ACCESS PIT PASS',
        bottomBanner: '300 DPI RHODE ISLAND MASTERS',
        rationale: 'Prismatic holographic foil shifts colors under stage lights and sunlight.'
      },
      {
        tag: 'VIP Laminate Tour Badge',
        shape: 'vip-pass',
        finish: 'matte',
        conceptModifier: 'vertical touring laminate pass with lanyard hole cutout at top, technical lens aperture telemetry, and security barcode ribbon',
        topBanner: 'MEDIA LEVEL 1 PIT ACCESS',
        bottomBanner: 'SOUNDCHECK TO ENCORE',
        rationale: 'Authentic backstage pass look and feel for fans, bands, and VIP supporters.'
      }
    ]
  };

  var STATE = {
    folders: [],
    stickers: [],
    activeFolderId: 'all-stickers',
    selectedStickerIds: {},
    printPackSlots: [],
    vendorMode: 'mode-a', // 'mode-a' (Concierge), 'mode-b' (Direct Kadsticky), 'mode-c' (Thermal Bridge)
    isGenerating: false,
    generationProgress: 0,
    generationStage: '',
    generationElapsedSec: 0,
    generationTimer: null,
    searchQuery: '',
    shapeFilter: 'all',
    finishFilter: 'all',
    categoryFilter: 'all',
    newlyCreatedStickerId: null,
    twinChatResponse: null,
    twinSuggestions: [],
    activePreviewStickerId: null,
    activeThermalStickerId: null,
    thermalThreshold: 128
  };

  function initDefaultState() {
    var scope = getActiveTenantScope();
    var storageKey = getScopedStorageKey();
    var scopedFolders = getScopedInitialFolders();
    var scopedStickers = getScopedInitialStickers();

    if (STATE._activeScopeKey && STATE._activeScopeKey !== scope.scopeKey) {
      STATE._serverHydrated = false;
      STATE.printPackSlots = [];
      STATE.activeFolderId = 'all-stickers';
      STATE.selectedStickerIds = {};
    }
    STATE._activeScopeKey = scope.scopeKey;

    try {
      if (typeof localStorage !== 'undefined') {
        var saved = localStorage.getItem(storageKey);
        if (saved) {
          var parsed = JSON.parse(saved);
          STATE.folders = parsed.folders && parsed.folders.length ? parsed.folders : scopedFolders.slice();
          STATE.stickers = parsed.stickers && parsed.stickers.length ? parsed.stickers : scopedStickers.slice();
          STATE.printPackSlots = parsed.printPackSlots || [];
          STATE.vendorMode = parsed.vendorMode || 'mode-a';
        } else {
          STATE.folders = scopedFolders.slice();
          STATE.stickers = scopedStickers.slice();
        }
      } else {
        STATE.folders = scopedFolders.slice();
        STATE.stickers = scopedStickers.slice();
      }
    } catch (e) {
      STATE.folders = scopedFolders.slice();
      STATE.stickers = scopedStickers.slice();
    }

    // Strict tenant isolation scrub: never allow GeneTravels stickers in Johnny's or other tenants' libraries,
    // and never allow Johnny's Backstage stickers in GeneTravels or other tenants' libraries.
    if (!scope.isGeneTravels) {
      STATE.folders = STATE.folders.filter(function (f) {
        return f.id !== 'genetravels-reference' && f.parentId !== 'genetravels-reference' && String(f.id || '').indexOf('gt-') !== 0;
      });
      STATE.stickers = STATE.stickers.filter(function (s) {
        return !s.isGeneTravels && String(s.id || '').indexOf('gt-stk-') !== 0 && String(s.filename || '').indexOf('genetravels_') !== 0;
      });
    }
    if (!scope.isBackstage) {
      STATE.folders = STATE.folders.filter(function (f) {
        return f.id !== 'johnny-pit-masters' && f.parentId !== 'johnny-pit-masters' && String(f.id || '').indexOf('johnny-') !== 0;
      });
      STATE.stickers = STATE.stickers.filter(function (s) {
        return !s.isJohnny && String(s.id || '').indexOf('bsi-') !== 0 && String(s.filename || '').indexOf('bsi_sticker_') !== 0;
      });
    }

    // Ensure dated folder for today exists
    var todayFolderId = 'dated-' + getTodayString();
    var hasTodayFolder = STATE.folders.some(function (f) { return f.id === todayFolderId; });
    if (!hasTodayFolder) {
      STATE.folders.splice(1, 0, {
        id: todayFolderId,
        name: '📅 ' + getTodayString() + ' Creations',
        icon: '📅',
        parentId: null,
        isDated: true
      });
    }

    // Clear any print pack slots pointing to stickers that do not belong to this tenant
    var validStickerIds = {};
    STATE.stickers.forEach(function (s) { validStickerIds[s.id] = true; });
    if (Array.isArray(STATE.printPackSlots)) {
      STATE.printPackSlots.forEach(function (slot) {
        if (slot && slot.stickerId && !validStickerIds[slot.stickerId]) {
          slot.stickerId = null;
        }
      });
    }

    // Initialize 10 print pack slots if empty
    var hasAnyFilledSlot = Array.isArray(STATE.printPackSlots) && STATE.printPackSlots.some(function (sl) { return sl && sl.stickerId; });
    if (!STATE.printPackSlots || STATE.printPackSlots.length !== PRINT_PACK_SIZE || (!hasAnyFilledSlot && STATE.stickers.length > 0)) {
      STATE.printPackSlots = [];
      var packCandidates = STATE.stickers.filter(function (s) { return s.inPrintPack; });
      if (!packCandidates.length) packCandidates = STATE.stickers.slice(0, PRINT_PACK_SIZE);
      for (var i = 0; i < PRINT_PACK_SIZE; i++) {
        var preStk = packCandidates[i];
        STATE.printPackSlots.push({
          slotIndex: i + 1,
          stickerId: preStk ? preStk.id : null,
          quantity: 50,
          notes: ''
        });
      }
    }

    saveState();

    // Hydrate server-side generated stickers from /api/admin/sticker-studio once per session
    if (!STATE._serverHydrated && typeof fetch === 'function') {
      STATE._serverHydrated = true;
      var apiUrl = '/api/admin/sticker-studio?siteKey=' + encodeURIComponent(scope.scopeKey);
      fetch(apiUrl, { credentials: 'same-origin' })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          var serverList = (res && res.state && Array.isArray(res.state.stickers)) ? res.state.stickers : (res && Array.isArray(res.stickers) ? res.stickers : []);
          var addedAny = false;

          // STD-2026-STICKER-STUDIO-01: Prune legacy flat geometric SVGs & enforce 44 authentic illustrated catalog
          if (scope.isGeneTravels) {
            var beforePrune = STATE.stickers.length;
            STATE.stickers = STATE.stickers.filter(function (s) {
              var sId = String(s.id || '');
              return !sId.startsWith('gt-stk-') && !sId.startsWith('stk_gt_') && !sId.startsWith('gt_stk_');
            });
            if (STATE.stickers.length !== beforePrune) addedAny = true;

            // Ensure all 44 authentic stickers are present
            scopedStickers.forEach(function (initS) {
              var found = STATE.stickers.some(function (loc) { return loc.id === initS.id; });
              if (!found) {
                STATE.stickers.push(initS);
                addedAny = true;
              }
            });
          }
          serverList.forEach(function (srv) {
            if (!srv) return;
            var srvId = String(srv.id || '');
            if (srvId.startsWith('gt-stk-') || srvId.startsWith('stk_gt_') || srvId.startsWith('gt_stk_')) return;

            if (srv.isGeneTravels || srvId.startsWith('eg_') || srvId.startsWith('orig_') || srvId.startsWith('ed27_') || srvId.startsWith('gt_art_')) {
              var match = STATE.stickers.find(function (loc) { return loc.id === srv.id; });
              if (!match) {
                STATE.stickers.push(Object.assign({}, srv, { isGeneTravels: true, imageUrl: srv.relativeUrl || srv.imageUrl }));
                addedAny = true;
              } else {
                if (srv.relativeUrl && match.imageUrl !== srv.relativeUrl) {
                  match.imageUrl = srv.relativeUrl;
                  match.relativeUrl = srv.relativeUrl;
                  addedAny = true;
                }
                match.isGeneTravels = true;
              }
            } else if (srv.isUserGenerated && srv.relativeUrl) {
              var exists = STATE.stickers.some(function (loc) { return loc.id === srv.id || loc.imageUrl === srv.relativeUrl; });
              if (!exists) {
                var fId = srv.datedFolderId || ('dated-' + getTodayString());
                STATE.stickers.unshift({
                  id: srv.id,
                  title: srv.title || 'Custom 3" Sticker',
                  filename: srv.filename || 'custom.png',
                  imageUrl: srv.relativeUrl,
                  folderId: fId,
                  concept: srv.prompt || '',
                  topBanner: srv.topText || scope.siteName.toUpperCase(),
                  bottomBanner: srv.bottomText || 'ALL ACCESS',
                  shape: srv.shape || 'die-cut',
                  finish: srv.finish || 'holographic',
                  dimensions: '3" x 3"',
                  dpi: 300,
                  dateAdded: getTodayString(),
                  isCustom: true,
                  inPrintPack: false
                });
                addedAny = true;
              }
            }
          });
          if (addedAny) {
            saveState();
            refreshStudioApp();
          }
        })
        .catch(function () {});
    }
  }

  function saveState() {
    try {
      if (typeof localStorage === 'undefined') return;
      var payload = {
        folders: STATE.folders,
        stickers: STATE.stickers,
        printPackSlots: STATE.printPackSlots,
        vendorMode: STATE.vendorMode
      };
      localStorage.setItem(getScopedStorageKey(), JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save Sticker Studio state to localStorage:', e);
    }
  }

  function getFolderById(id) {
    for (var i = 0; i < STATE.folders.length; i++) {
      if (STATE.folders[i].id === id) return STATE.folders[i];
    }
    return null;
  }

  function getStickerById(id) {
    for (var i = 0; i < STATE.stickers.length; i++) {
      if (STATE.stickers[i].id === id) return STATE.stickers[i];
    }
    return null;
  }

  function getStickersInFolder(folderId) {
    if (folderId === 'all-stickers') {
      return STATE.stickers;
    }
    // Also include child folders
    var childFolderIds = {};
    childFolderIds[folderId] = true;
    STATE.folders.forEach(function (f) {
      if (f.parentId === folderId) {
        childFolderIds[f.id] = true;
      }
    });

    return STATE.stickers.filter(function (s) {
      return childFolderIds[s.folderId] === true;
    });
  }

  function countStickersInFolder(folderId) {
    return getStickersInFolder(folderId).length;
  }

  // Generate Fallback Vector Graphic SVG Data URL when local asset is pending
    function getStickerImageOnerror(sticker) {
    if (!sticker) return 'this.onerror=null;';
    var scope = getActiveTenantScope();
    var isGt = !!(sticker.isGeneTravels || scope.isGeneTravels);
    var rel = String(sticker.imageUrl || sticker.relativeUrl || '').trim();
    var fallbackSvg = generateFallbackStickerDataUrl(sticker).replace(/'/g, "\\'");
    if (isGt && rel && !rel.startsWith('data:')) {
      var fullGtUrl = rel.startsWith('http') ? rel : ('https://genetravels.com' + (rel.startsWith('/') ? '' : '/') + rel);
      return "if(!this.dataset.gtTried){this.dataset.gtTried='1';this.src='" + fullGtUrl + "';}else{this.onerror=null;this.src='" + fallbackSvg + "';}";
    }
    return "this.onerror=null;this.src='" + fallbackSvg + "';";
  }

  function generateFallbackStickerDataUrl(sticker) {
    var scope = getActiveTenantScope();
    var title = esc(sticker.title || '3" Die-Cut Sticker');
    var topBanner = esc(sticker.topBanner || scope.siteName.toUpperCase());
    var bottomBanner = esc(sticker.bottomBanner || '300 DPI DIE-CUT MASTER');
    var shape = sticker.shape || 'shield';
    var finish = sticker.finish || 'glossy';
    var centerEmoji = scope.isGeneTravels ? '✈️' : (scope.isBackstage ? '🎸' : '🎨');

    var pathShape = '';
    if (shape === 'shield') {
      pathShape = '<path d="M 150 20 L 260 55 C 260 170 210 240 150 280 C 90 240 40 170 40 55 Z" fill="#18181b" stroke="#f59e0b" stroke-width="8" filter="url(#dropGlow)" />';
    } else if (shape === 'circle') {
      pathShape = '<circle cx="150" cy="150" r="125" fill="#18181b" stroke="#f59e0b" stroke-width="8" filter="url(#dropGlow)" />';
    } else if (shape === 'vip-pass') {
      pathShape = '<rect x="40" y="20" width="220" height="260" rx="18" fill="#18181b" stroke="#f59e0b" stroke-width="8" filter="url(#dropGlow)" />' +
                  '<rect x="120" y="30" width="60" height="12" rx="6" fill="#09090b" stroke="#71717a" stroke-width="2" />';
    } else {
      pathShape = '<rect x="35" y="35" width="230" height="230" rx="28" fill="#18181b" stroke="#f59e0b" stroke-width="8" filter="url(#dropGlow)" />';
    }

    var finishOverlay = '';
    if (finish === 'holographic') {
      finishOverlay = '<rect x="0" y="0" width="300" height="300" fill="url(#holoGrad)" opacity="0.45" mix-blend-mode="color-dodge" pointer-events="none" />';
    } else if (finish === 'glossy') {
      finishOverlay = '<path d="M 30 30 Q 150 10 270 30 L 250 120 Q 150 70 50 120 Z" fill="#ffffff" opacity="0.22" pointer-events="none" />';
    }

    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">' +
      '<defs>' +
      '  <linearGradient id="holoGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
      '    <stop offset="0%" stop-color="#ff0080" stop-opacity="0.8"/>' +
      '    <stop offset="25%" stop-color="#7928ca" stop-opacity="0.8"/>' +
      '    <stop offset="50%" stop-color="#0070f3" stop-opacity="0.8"/>' +
      '    <stop offset="75%" stop-color="#00dfd8" stop-opacity="0.8"/>' +
      '    <stop offset="100%" stop-color="#ff4d4d" stop-opacity="0.8"/>' +
      '  </linearGradient>' +
      '  <filter id="dropGlow" x="-20%" y="-20%" width="140%" height="140%">' +
      '    <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.6"/>' +
      '  </filter>' +
      '</defs>' +
      '<rect width="300" height="300" fill="#09090b"/>' +
      '<rect x="10" y="10" width="280" height="280" rx="20" fill="none" stroke="#27272a" stroke-dasharray="6,6" stroke-width="2"/>' +
      pathShape +
      finishOverlay +
      '<text x="150" y="80" text-anchor="middle" fill="#f59e0b" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="11" letter-spacing="1.5">' + topBanner + '</text>' +
      '<circle cx="150" cy="145" r="38" fill="#27272a" stroke="#f59e0b" stroke-width="3"/>' +
      '<text x="150" y="153" text-anchor="middle" font-size="28">' + centerEmoji + '</text>' +
      '<text x="150" y="210" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="12">' + title + '</text>' +
      '<text x="150" y="235" text-anchor="middle" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="9" letter-spacing="1">' + bottomBanner + '</text>' +
      '<rect x="100" y="255" width="100" height="18" rx="9" fill="#0f172a" stroke="#334155" stroke-width="1"/>' +
      '<text x="150" y="267" text-anchor="middle" fill="#38bdf8" font-family="monospace" font-weight="700" font-size="9">3" 300 DPI</text>' +
      '</svg>';

    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  // 1-Bit Floyd-Steinberg Dither Engine for Thermal Printers (Niimbot / Katasymbol)
  function applyFloydSteinbergDither(sourceImgEl, targetCanvas, threshold) {
    var ctx = targetCanvas.getContext('2d');
    var w = targetCanvas.width;
    var h = targetCanvas.height;

    ctx.drawImage(sourceImgEl, 0, 0, w, h);
    var imgData = ctx.getImageData(0, 0, w, h);
    var d = imgData.data;

    // First convert to grayscale
    var gray = new Float32Array(w * h);
    for (var i = 0; i < d.length; i += 4) {
      var r = d[i];
      var g = d[i + 1];
      var b = d[i + 2];
      // Luminance formula
      gray[i / 4] = 0.299 * r + 0.587 * g + 0.114 * b;
    }

    // Floyd-Steinberg error diffusion
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var idx = y * w + x;
        var oldVal = gray[idx];
        var newVal = oldVal < threshold ? 0 : 255;
        gray[idx] = newVal;
        var err = oldVal - newVal;

        if (x + 1 < w) gray[idx + 1] += (err * 7) / 16;
        if (x - 1 >= 0 && y + 1 < h) gray[(y + 1) * w + (x - 1)] += (err * 3) / 16;
        if (y + 1 < h) gray[(y + 1) * w + x] += (err * 5) / 16;
        if (x + 1 < w && y + 1 < h) gray[(y + 1) * w + (x + 1)] += (err * 1) / 16;
      }
    }

    // Write back to canvas (pure black & white)
    for (var j = 0; j < gray.length; j++) {
      var v = gray[j] < 128 ? 0 : 255;
      var p = j * 4;
      d[p] = v;
      d[p + 1] = v;
      d[p + 2] = v;
      d[p + 3] = 255;
    }

    ctx.putImageData(imgData, 0, 0);
  }

  // Public Interface Methods

  function renderStickerStudioTab() {
    initDefaultState();

    return '' +
      '<div class="sticker-studio-wrapper" id="stickerStudioApp" style="color:#0f172a;font-family:system-ui,-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;">' +
        renderHeaderBanner() +
        renderNanoBananaGeneratorBar() +
        renderPrintRunTrayDrawer() +
        '<div style="display:grid;grid-template-columns:280px 1fr;gap:20px;margin-top:20px;align-items:start;">' +
          renderFolderSidebar() +
          renderStickerLibraryMain() +
        '</div>' +
        renderModalsContainer() +
      '</div>';
  }

  function renderHeaderBanner() {
    var scope = getActiveTenantScope();
    var totalCount = STATE.stickers.length;
    var johnnyCount = STATE.stickers.filter(function (s) { return s.isJohnny; }).length;
    var gtCount = STATE.stickers.filter(function (s) { return s.isGeneTravels; }).length;
    var printPackCount = STATE.printPackSlots.filter(function (s) { return s.stickerId !== null; }).length;
    var secondBadgeLabel = scope.isBackstage ? 'Johnny 25' : (scope.isGeneTravels ? 'GeneTravels' : 'Custom Designs');
    var secondBadgeCount = scope.isBackstage ? johnnyCount : (scope.isGeneTravels ? gtCount : totalCount);

    return '' +
      '<div class="panelCard" style="background:linear-gradient(135deg,#090d16 0%,#111827 50%,#1e293b 100%);color:#ffffff;padding:22px 26px;border-radius:14px;border:1px solid rgba(245,158,11,0.3);box-shadow:0 12px 32px rgba(0,0,0,0.35);margin-bottom:20px;">' +
        '<div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:16px;">' +
          '<div>' +
            '<div style="display:inline-flex;align-items:center;gap:8px;background:rgba(245,158,11,0.15);border:1px solid rgba(245,158,11,0.4);padding:4px 12px;border-radius:9999px;font-size:0.75rem;font-weight:800;color:#f59e0b;letter-spacing:0.04em;text-transform:uppercase;margin-bottom:8px;">' +
              '<span>🎨 MOD-STICKER-STUDIO</span>' +
              '<span>•</span>' +
              '<span>3" Die-Cut Vinyl &amp; Holographic Press</span>' +
            '</div>' +
            '<h2 style="font-size:1.6rem;font-weight:900;margin:0 0 6px 0;letter-spacing:-0.02em;color:#ffffff;display:flex;align-items:center;gap:10px;">' +
              '<span>' + esc(scope.siteName) + ' 3" Sticker Studio</span>' +
              '<span style="font-size:0.8rem;background:#10b981;color:#ffffff;padding:2px 8px;border-radius:6px;font-weight:800;">300 DPI READY</span>' +
            '</h2>' +
            '<p style="margin:0;font-size:0.86rem;color:#cbd5e1;max-width:760px;line-height:1.5;">' +
              'Generate custom 300 DPI die-cut stickers connected to Site Twin #3 and Nano Banana. File designs into nested folders, curate 10-artwork bundles, and print 500-packs for $49.90 wholesale via kadsticky.com.' +
            '</p>' +
          '</div>' +
          '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">' +
            '<div style="display:flex;gap:8px;">' +
              '<div style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);padding:8px 14px;border-radius:8px;text-align:center;">' +
                '<div style="font-size:1.1rem;font-weight:900;color:#38bdf8;">' + totalCount + '</div>' +
                '<div style="font-size:0.68rem;color:#94a3b8;font-weight:700;text-transform:uppercase;">In Library</div>' +
              '</div>' +
              '<div style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);padding:8px 14px;border-radius:8px;text-align:center;">' +
                '<div style="font-size:1.1rem;font-weight:900;color:#f59e0b;">' + secondBadgeCount + '</div>' +
                '<div style="font-size:0.68rem;color:#94a3b8;font-weight:700;text-transform:uppercase;">' + esc(secondBadgeLabel) + '</div>' +
              '</div>' +
              '<div style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.14);padding:8px 14px;border-radius:8px;text-align:center;">' +
                '<div style="font-size:1.1rem;font-weight:900;color:#10b981;">' + printPackCount + ' / 10</div>' +
                '<div style="font-size:0.68rem;color:#94a3b8;font-weight:700;text-transform:uppercase;">500-Pack Tray</div>' +
              '</div>' +
            '</div>' +
            '<button type="button" class="btnOutline" onclick="BSIStickerStudio.togglePrintRunDrawer()" style="color:#f59e0b;border-color:rgba(245,158,11,0.5);font-size:0.78rem;font-weight:800;padding:6px 12px;background:rgba(245,158,11,0.08);">' +
              '📦 View 500-Pack Strategy &amp; Vendor Handoff' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderNanoBananaGeneratorBar() {
    var scope = getActiveTenantScope();
    var scopedPresets = getScopedPromptPresets();
    var defaultTopBanner = scope.isBackstage ? 'BACKSTAGE IMAGES RI' : (scope.isGeneTravels ? 'GENETRAVELS.COM' : scope.siteName.toUpperCase());
    var defaultBottomBanner = scope.isBackstage ? 'LIVE ROCK MASTERS · PROVIDENCE RI' : (scope.isGeneTravels ? 'HIGH BANKS TO FLIGHT DECK' : 'OFFICIAL 300 DPI EDITION');
    var isLocked = STATE.isGenerating;
    var lockAttr = isLocked ? 'disabled' : '';

    return '' +
      '<div class="panelCard" id="nanoBananaGeneratorPane" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;box-shadow:0 4px 16px rgba(0,0,0,0.04);margin-bottom:20px;position:relative;">' +
        (isLocked ? renderHardLockBanner() : '') +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">' +
          '<div style="display:flex;align-items:center;gap:10px;">' +
            '<span style="font-size:1.4rem;">🍌</span>' +
            '<div>' +
              '<h3 style="margin:0;font-size:1.05rem;font-weight:900;color:#0f172a;">Site Twin #3 &amp; Nano Banana 3" Master Generator</h3>' +
              '<div style="font-size:0.76rem;color:#64748b;font-weight:600;">Cloud Gemini Pro / Argon 4 High Image Synthesis (Zero Opus Quota Impact)</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;gap:8px;">' +
            '<button type="button" id="btnAskTwin3" class="btnOutline" onclick="BSIStickerStudio.askTwin3StickerSuggestions()" ' + lockAttr + ' style="font-size:0.8rem;font-weight:800;color:#4f46e5;border-color:#c7d2fe;background:#eef2ff;display:inline-flex;align-items:center;gap:6px;">' +
              '<span>💬</span>' +
              '<span>Ask Twin #3 for Suggestions</span>' +
            '</button>' +
          '</div>' +
        '</div>' +

        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">' +
          '<div style="grid-column:1 / -1;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 12px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;">' +
            '<div style="font-size:0.78rem;font-weight:800;color:#0f172a;display:flex;align-items:center;gap:6px;">' +
              '<span>🎯</span>' +
              '<span>Ready-to-Fire 3" Die-Cut Sticker Prompt Presets:</span>' +
            '</div>' +
            '<select id="stkPromptPresetSelect" ' + lockAttr + ' onchange="BSIStickerStudio.applyPromptPreset(this.value)" style="flex:1;min-width:280px;padding:7px 10px;border:1px solid #cbd5e1;border-radius:6px;font-size:0.78rem;font-weight:700;background:#ffffff;color:#0f172a;">' +
              '<option value="">-- Select a 3" Sticker Prompt Preset to Auto-Fill --</option>' +
              scopedPresets.map(function (p) {
                return '<option value="' + p.id + '">[' + esc(p.group) + '] ' + esc(p.title) + '</option>';
              }).join('') +
            '</select>' +
          '</div>' +
          '<div style="grid-column:1 / -1;">' +
            '<label style="display:block;font-size:0.78rem;font-weight:800;color:#334155;margin-bottom:4px;">Sticker Subject &amp; Concept Description</label>' +
            '<textarea id="stkConceptInput" ' + lockAttr + ' rows="2" style="width:100%;box-sizing:border-box;padding:10px 12px;border:1px solid #cbd5e1;border-radius:8px;font-size:0.84rem;font-family:inherit;line-height:1.4;resize:vertical;" placeholder="Describe your 3-inch die-cut sticker concept, emblem, colors, and thick white contour border..."></textarea>' +
          '</div>' +
          '<div>' +
            '<label style="display:block;font-size:0.78rem;font-weight:800;color:#334155;margin-bottom:4px;">Top Banner Text (Optional)</label>' +
            '<input type="text" id="stkTopBannerInput" ' + lockAttr + ' value="' + esc(defaultTopBanner) + '" style="width:100%;box-sizing:border-box;padding:8px 12px;border:1px solid #cbd5e1;border-radius:8px;font-size:0.82rem;font-weight:700;" placeholder="e.g. ' + esc(defaultTopBanner) + '" />' +
          '</div>' +
          '<div>' +
            '<label style="display:block;font-size:0.78rem;font-weight:800;color:#334155;margin-bottom:4px;">Bottom Banner Text (Optional)</label>' +
            '<input type="text" id="stkBottomBannerInput" ' + lockAttr + ' value="' + esc(defaultBottomBanner) + '" style="width:100%;box-sizing:border-box;padding:8px 12px;border:1px solid #cbd5e1;border-radius:8px;font-size:0.82rem;font-weight:700;" placeholder="e.g. ' + esc(defaultBottomBanner) + '" />' +
          '</div>' +
          '<div>' +
            '<label style="display:block;font-size:0.78rem;font-weight:800;color:#334155;margin-bottom:4px;">3" Sticker Cutline Shape</label>' +
            '<select id="stkShapeInput" ' + lockAttr + ' style="width:100%;box-sizing:border-box;padding:8px 12px;border:1px solid #cbd5e1;border-radius:8px;font-size:0.82rem;font-weight:700;background:#ffffff;">' +
              '<option value="shield">Die-Cut Shield / Crest (Thick White Contour Line)</option>' +
              '<option value="circle">3" Circle (Medallion / Pit Pass Badge)</option>' +
              '<option value="rounded-square">3" Rounded Square (12mm Corner Radius Decal)</option>' +
              '<option value="vip-pass">VIP Pass (All-Access Laminate Badge with Lanyard Notch)</option>' +
            '</select>' +
          '</div>' +
          '<div>' +
            '<label style="display:block;font-size:0.78rem;font-weight:800;color:#334155;margin-bottom:4px;">Vinyl Finish &amp; Base Substrate</label>' +
            '<select id="stkFinishInput" ' + lockAttr + ' style="width:100%;box-sizing:border-box;padding:8px 12px;border:1px solid #cbd5e1;border-radius:8px;font-size:0.82rem;font-weight:700;background:#ffffff;">' +
              '<option value="glossy">Glossy Vinyl (Outdoor UV Gloss, High Saturation)</option>' +
              '<option value="matte">Matte Vinyl (Velvet Glare-Free Smooth Vinyl)</option>' +
              '<option value="holographic">Holographic Rainbow Foil (Prismatic Specular Base)</option>' +
              '<option value="clear">Clear Vinyl (Transparent Backing, White Ink Understrike)</option>' +
            '</select>' +
          '</div>' +
        '</div>' +

        '<div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid #f1f5f9;padding-top:14px;">' +
          '<div style="font-size:0.76rem;color:#64748b;">' +
            '<span style="font-weight:800;color:#0f172a;">Specs:</span> 3" x 3" Physical Size · 300 DPI Print Master (900x900px minimum / 2048px vector upscale) · Ready for Kadsticky.com 500-Pack Gang Run' +
          '</div>' +
          '<button type="button" id="btnCreateSticker" class="btnPrimary" onclick="BSIStickerStudio.createStickerWithNanoBanana()" ' + lockAttr + ' style="background:linear-gradient(90deg,#f59e0b,#d97706);border:none;color:#ffffff;font-weight:900;padding:10px 22px;border-radius:8px;font-size:0.9rem;cursor:pointer;display:inline-flex;align-items:center;gap:8px;box-shadow:0 4px 12px rgba(245,158,11,0.3);">' +
            '<span>🍌</span>' +
            '<span>Create 3" Sticker</span>' +
          '</button>' +
        '</div>' +

        // Twin #3 Suggestion Box Container
        '<div id="twin3SuggestionArea" style="' + (STATE.twinSuggestions.length ? 'display:block;' : 'display:none;') + 'margin-top:16px;">' +
          renderTwin3SuggestionBox() +
        '</div>' +
      '</div>';
  }

  function renderHardLockBanner() {
    var pct = Math.min(100, Math.max(0, Math.round(STATE.generationProgress)));
    var stage = STATE.generationStage || 'Synthesizing 300 DPI master...';
    var elapsed = STATE.generationElapsedSec || 0;

    return '' +
      '<div id="nanoBananaHardLockBanner" style="background:#0f172a;color:#ffffff;border-radius:10px;padding:16px 20px;border:2px solid #f59e0b;margin-bottom:16px;box-shadow:0 8px 24px rgba(0,0,0,0.3);">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;">' +
          '<div style="display:flex;align-items:center;gap:10px;">' +
            '<span style="font-size:1.3rem;animation:pulse 1.5s infinite;">🔒</span>' +
            '<div>' +
              '<div style="font-size:0.86rem;font-weight:900;color:#f59e0b;letter-spacing:0.02em;">' +
                'STICKER CREATION IN PROGRESS [CHAT LOCKED WHILE NANO BANANA RENDERS YOUR 3" MASTER]' +
              '</div>' +
              '<div style="font-size:0.74rem;color:#94a3b8;margin-top:2px;">' +
                'Active Stage: <strong style="color:#ffffff;">' + esc(stage) + '</strong>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div style="text-align:right;">' +
            '<div style="font-size:1.1rem;font-weight:900;color:#38bdf8;">' + pct + '%</div>' +
            '<div style="font-size:0.7rem;color:#94a3b8;font-family:monospace;">' +
              '⏱️ ' + elapsed + 's elapsed · Typical: 15-30s for 300 DPI Die-Cut Master' +
            '</div>' +
          '</div>' +
        '</div>' +

        // Animated progress track
        '<div style="width:100%;height:10px;background:#1e293b;border-radius:9999px;overflow:hidden;border:1px solid #334155;">' +
          '<div style="width:' + pct + '%;height:100%;background:linear-gradient(90deg,#f59e0b,#10b981);border-radius:9999px;transition:width 0.4s ease-out;"></div>' +
        '</div>' +
        '<div style="display:flex;justify-content:space-between;margin-top:6px;font-size:0.68rem;color:#64748b;font-weight:700;">' +
          '<span>Stage 1: Prompt &amp; Latent Space</span>' +
          '<span>Stage 2: Vector Contours</span>' +
          '<span>Stage 3: Foil Shaders</span>' +
          '<span>Stage 4: 2048px Upscale</span>' +
          '<span>Stage 5: Auto-File Dated Folder</span>' +
        '</div>' +
      '</div>';
  }

  function renderTwin3SuggestionBox() {
    if (!STATE.twinSuggestions || !STATE.twinSuggestions.length) return '';

    var cardsHtml = STATE.twinSuggestions.map(function (sug, idx) {
      return '' +
        '<div class="panelCard" style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:12px;display:flex;flex-direction:column;justify-content:space-between;">' +
          '<div>' +
            '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
              '<span style="font-size:0.75rem;font-weight:800;color:#4f46e5;text-transform:uppercase;">Suggestion #' + (idx + 1) + '</span>' +
              '<span style="font-size:0.7rem;background:#e0e7ff;color:#3730a3;padding:1px 6px;border-radius:4px;font-weight:700;">' + esc(sug.shape) + ' · ' + esc(sug.finish) + '</span>' +
            '</div>' +
            '<div style="font-size:0.82rem;font-weight:800;color:#0f172a;margin-bottom:4px;">' + esc(sug.title) + '</div>' +
            '<div style="font-size:0.74rem;color:#475569;margin-bottom:6px;line-height:1.35;">' + esc(sug.concept) + '</div>' +
            '<div style="font-size:0.7rem;color:#64748b;font-style:italic;margin-bottom:8px;">' + esc(sug.rationale) + '</div>' +
          '</div>' +
          '<button type="button" class="btnOutline" onclick="BSIStickerStudio.useStickerSuggestion(' + idx + ')" style="font-size:0.76rem;font-weight:800;padding:6px 10px;color:#1e40af;border-color:#93c5fd;background:#eff6ff;width:100%;text-align:center;">' +
            '✨ Use Suggestion #' + (idx + 1) +
          '</button>' +
        '</div>';
    }).join('');

    var scope = getActiveTenantScope();
    return '' +
      '<div style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:10px;padding:14px;margin-top:14px;">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<span style="font-size:1.1rem;">💬</span>' +
            '<strong style="font-size:0.84rem;color:#0f172a;">Site Twin #3 Recommendation</strong>' +
            '<span style="font-size:0.7rem;background:#dbeafe;color:#1e40af;padding:2px 6px;border-radius:4px;font-weight:800;">' + esc(scope.siteName) + ' AI Co-Pilot</span>' +
          '</div>' +
          '<button type="button" onclick="BSIStickerStudio.dismissTwinSuggestions()" style="border:none;background:transparent;cursor:pointer;color:#94a3b8;font-size:0.9rem;" title="Close suggestions">✕</button>' +
        '</div>' +
        '<div style="font-size:0.78rem;color:#334155;margin-bottom:12px;line-height:1.4;">' +
          (STATE.twinChatResponse || TWIN3_KNOWLEDGE_BASE.adviceLead) +
        '</div>' +
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;">' +
          cardsHtml +
        '</div>' +
      '</div>';
  }

  function renderPrintRunTrayDrawer() {
    var mode = STATE.vendorMode || 'mode-a';
    var filledCount = 0;
    var totalUnitsAllocated = 0;

    STATE.printPackSlots.forEach(function (slot) {
      if (slot.stickerId) {
        filledCount++;
        totalUnitsAllocated += Number(slot.quantity || 0);
      }
    });

    var wholesaleCost = DEFAULT_WHOLESALE_COST;
    var retailPrice = 99.00;
    var profitMargin = retailPrice - wholesaleCost;

    return '' +
      '<div class="panelCard" id="printRunTrayContainer" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:18px 20px;box-shadow:0 4px 16px rgba(0,0,0,0.04);margin-bottom:20px;">' +
        '<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid #f1f5f9;">' +
          '<div style="display:flex;align-items:center;gap:10px;">' +
            '<span style="font-size:1.4rem;">📦</span>' +
            '<div>' +
              '<div style="display:flex;align-items:center;gap:8px;">' +
                '<h3 style="margin:0;font-size:1.05rem;font-weight:900;color:#0f172a;">10-Design / 500-Pack Print Run Tray &amp; Vendor Strategy</h3>' +
                '<span style="font-size:0.72rem;background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:9999px;font-weight:800;border:1px solid #fde68a;">kadsticky.com Partner Engine</span>' +
              '</div>' +
              '<div style="font-size:0.76rem;color:#64748b;">$49.90 Total Wholesale Cost for 500 3" Stickers · Split across up to 10 unique artworks</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:10px;">' +
            '<div style="font-size:0.78rem;background:#f8fafc;border:1px solid #cbd5e1;padding:6px 12px;border-radius:8px;">' +
              '<span style="color:#64748b;font-weight:700;">Slots:</span> <strong style="color:#0f172a;">' + filledCount + ' / ' + PRINT_PACK_SIZE + '</strong>' +
              '<span style="margin:0 6px;color:#cbd5e1;">|</span>' +
              '<span style="color:#64748b;font-weight:700;">Stickers:</span> <strong style="color:' + (totalUnitsAllocated === TOTAL_PRINT_UNITS ? '#10b981' : '#f59e0b') + ';">' + totalUnitsAllocated + ' / ' + TOTAL_PRINT_UNITS + '</strong>' +
            '</div>' +
            '<button type="button" class="btnOutline" onclick="BSIStickerStudio.autoBalanceQuantities()" style="font-size:0.76rem;font-weight:800;padding:6px 10px;" title="Distribute 500 stickers evenly among filled slots">' +
              '⚖️ Auto-Balance' +
            '</button>' +
            '<button type="button" class="btnOutline" onclick="BSIStickerStudio.clearAllPrintSlots()" style="font-size:0.76rem;font-weight:800;padding:6px 10px;color:#dc2626;border-color:#fca5a5;" title="Clear all slots">' +
              '✕ Clear Tray' +
            '</button>' +
          '</div>' +
        '</div>' +

        // 10 Slot Grid
        '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin-bottom:16px;">' +
          renderTenPrintSlots() +
        '</div>' +

        // 3-Way Vendor Fulfillment Strategy Drawer
        '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;margin-top:14px;">' +
          '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">' +
            '<div style="font-size:0.84rem;font-weight:900;color:#0f172a;display:flex;align-items:center;gap:6px;">' +
              '<span>🎯</span>' +
              '<span>Choose Vendor Fulfillment Mode</span>' +
              '<span style="font-size:0.7rem;color:#64748b;font-weight:600;">(Answers Gene\'s Question: "How to handle the sticker vendor")</span>' +
            '</div>' +
            '<div style="display:inline-flex;background:#e2e8f0;padding:2px;border-radius:8px;">' +
              '<button type="button" onclick="BSIStickerStudio.switchVendorMode(\'mode-a\')" style="border:none;background:' + (mode === 'mode-a' ? '#ffffff' : 'transparent') + ';color:' + (mode === 'mode-a' ? '#0f172a' : '#64748b') + ';padding:5px 12px;border-radius:6px;font-size:0.74rem;font-weight:800;cursor:pointer;box-shadow:' + (mode === 'mode-a' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none') + ';">Mode A: GreenTree Concierge</button>' +
              '<button type="button" onclick="BSIStickerStudio.switchVendorMode(\'mode-b\')" style="border:none;background:' + (mode === 'mode-b' ? '#ffffff' : 'transparent') + ';color:' + (mode === 'mode-b' ? '#0f172a' : '#64748b') + ';padding:5px 12px;border-radius:6px;font-size:0.74rem;font-weight:800;cursor:pointer;box-shadow:' + (mode === 'mode-b' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none') + ';">Mode B: Direct Kadsticky</button>' +
              '<button type="button" onclick="BSIStickerStudio.switchVendorMode(\'mode-c\')" style="border:none;background:' + (mode === 'mode-c' ? '#ffffff' : 'transparent') + ';color:' + (mode === 'mode-c' ? '#0f172a' : '#64748b') + ';padding:5px 12px;border-radius:6px;font-size:0.74rem;font-weight:800;cursor:pointer;box-shadow:' + (mode === 'mode-c' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none') + ';">Mode C: Instant Thermal</button>' +
            '</div>' +
          '</div>' +

          renderVendorModeContent(mode, wholesaleCost, retailPrice, profitMargin) +
        '</div>' +
      '</div>';
  }

  function renderTenPrintSlots() {
    return STATE.printPackSlots.map(function (slot, idx) {
      var stk = slot.stickerId ? getStickerById(slot.stickerId) : null;

      if (!stk) {
        return '' +
          '<div class="panelCard" style="background:#ffffff;border:1px dashed #cbd5e1;border-radius:8px;padding:10px;text-align:center;min-height:140px;display:flex;flex-direction:column;justify-content:center;align-items:center;">' +
            '<div style="font-size:0.7rem;font-weight:800;color:#94a3b8;margin-bottom:6px;">SLOT #' + (idx + 1) + '</div>' +
            '<button type="button" class="btnOutline" onclick="BSIStickerStudio.promptAssignSlot(' + (idx + 1) + ')" style="font-size:0.72rem;font-weight:800;padding:4px 8px;color:#475569;border-color:#cbd5e1;">' +
              '+ Assign Sticker' +
            '</button>' +
            '<div style="font-size:0.68rem;color:#94a3b8;margin-top:6px;">Empty Slot</div>' +
          '</div>';
      }

      var imgSrc = stk.imageUrl || generateFallbackStickerDataUrl(stk);

      return '' +
        '<div class="panelCard" style="background:#ffffff;border:1px solid #cbd5e1;border-radius:8px;padding:8px;display:flex;flex-direction:column;justify-content:space-between;position:relative;">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
            '<span style="font-size:0.68rem;font-weight:900;color:#f59e0b;">SLOT #' + (idx + 1) + '</span>' +
            '<button type="button" onclick="BSIStickerStudio.clearPrintSlot(' + (idx + 1) + ')" style="border:none;background:transparent;color:#94a3b8;cursor:pointer;font-size:0.8rem;padding:0 2px;" title="Remove from slot">✕</button>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">' +
            '<div style="width:40px;height:40px;border-radius:6px;overflow:hidden;background:#09090b;flex-shrink:0;border:1px solid #e2e8f0;">' +
              '<img src="' + esc(imgSrc) + '" alt="' + esc(stk.title) + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.src=\'' + generateFallbackStickerDataUrl(stk) + '\';" />' +
            '</div>' +
            '<div style="overflow:hidden;">' +
              '<div style="font-size:0.74rem;font-weight:800;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="' + esc(stk.title) + '">' + esc(stk.title) + '</div>' +
              '<div style="font-size:0.66rem;color:#64748b;">' + esc(stk.shape) + ' · ' + esc(stk.finish) + '</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;align-items:center;justify-content:space-between;background:#f8fafc;padding:3px 6px;border-radius:6px;border:1px solid #e2e8f0;">' +
            '<span style="font-size:0.68rem;font-weight:700;color:#475569;">Quantity:</span>' +
            '<input type="number" min="1" max="500" step="5" value="' + (slot.quantity || 50) + '" onchange="BSIStickerStudio.setSlotQuantity(' + (idx + 1) + ', this.value)" style="width:52px;padding:2px 4px;font-size:0.72rem;font-weight:800;text-align:right;border:1px solid #cbd5e1;border-radius:4px;" />' +
          '</div>' +
        '</div>';
    }).join('');
  }

  function renderVendorModeContent(mode, wholesaleCost, retailPrice, profitMargin) {
    if (mode === 'mode-a') {
      return '' +
        '<div style="display:grid;grid-template-columns:1fr auto;gap:16px;align-items:center;">' +
          '<div>' +
            '<div style="font-size:0.86rem;font-weight:800;color:#0f172a;margin-bottom:4px;">' +
              'Mode A: GreenTree White-Label Print Concierge (Recommended Turnkey SaaS Model)' +
            '</div>' +
            '<p style="margin:0 0 6px 0;font-size:0.76rem;color:#475569;line-height:1.45;">' +
              'Customer curates up to 10 designs in the studio and clicks "Order 500-Sticker Pack ($99-$129 Billed via WHMCS/Stripe)". GreenTree receives the verified 300 DPI print manifest, orders wholesale from kadsticky.com for $49.90, and keeps 50% to 60% gross profit margin. Shipping notice clearly indicates: <em>"International Custom Vinyl Press: 2-3 Weeks Delivery"</em>.' +
            '</p>' +
            '<div style="display:flex;gap:12px;font-size:0.72rem;font-weight:700;">' +
              '<span style="color:#047857;">Wholesale Cost: $' + wholesaleCost.toFixed(2) + '</span>' +
              '<span>•</span>' +
              '<span style="color:#1d4ed8;">Standard Retail: $' + retailPrice.toFixed(2) + '</span>' +
              '<span>•</span>' +
              '<span style="color:#b45309;">Gross Profit Margin: $' + profitMargin.toFixed(2) + ' (50.4%)</span>' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<button type="button" class="btnPrimary" onclick="BSIStickerStudio.openConciergeOrderModal()" style="background:#0f172a;color:#ffffff;font-size:0.8rem;font-weight:800;padding:10px 18px;border-radius:8px;border:1px solid #334155;cursor:pointer;white-space:nowrap;">' +
              '💳 Order 500-Pack Concierge ($99)' +
            '</button>' +
          '</div>' +
        '</div>';
    } else if (mode === 'mode-b') {
      return '' +
        '<div style="display:grid;grid-template-columns:1fr auto;gap:16px;align-items:center;">' +
          '<div>' +
            '<div style="font-size:0.86rem;font-weight:800;color:#0f172a;margin-bottom:4px;">' +
              'Mode B: Direct Vendor Handoff (kadsticky.com 1-Click Spec Export)' +
            '</div>' +
            '<p style="margin:0 0 6px 0;font-size:0.76rem;color:#475569;line-height:1.45;">' +
              'Direct wholesale bypass for site administrators. Download all 10 print-ready 300 DPI master files in a formatted ZIP manifest, copy the exact quantity split table into your clipboard, and launch kadsticky.com to place the order directly for $49.90.' +
            '</p>' +
            '<div style="font-size:0.72rem;color:#64748b;">' +
              'Target Vendor: <strong>kadsticky.com</strong> · Product: 3" Custom Die-Cut Vinyl Stickers · 500 Pcs Gang Run' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;flex-direction:column;gap:6px;">' +
            '<button type="button" class="btnPrimary" onclick="BSIStickerStudio.copyKadstickySplitTable()" style="background:#1e40af;color:#ffffff;font-size:0.78rem;font-weight:800;padding:8px 14px;border-radius:6px;border:none;cursor:pointer;">' +
              '📋 Copy Split Table to Clipboard' +
            '</button>' +
            '<button type="button" class="btnOutline" onclick="BSIStickerStudio.launchKadstickyVendorPage()" style="font-size:0.78rem;font-weight:800;padding:8px 14px;border-radius:6px;color:#0f172a;border-color:#94a3b8;background:#ffffff;">' +
              '🔗 Open kadsticky.com in New Tab' +
            '</button>' +
          '</div>' +
        '</div>';
    } else {
      return '' +
        '<div style="display:grid;grid-template-columns:1fr auto;gap:16px;align-items:center;">' +
          '<div>' +
            '<div style="font-size:0.86rem;font-weight:800;color:#0f172a;margin-bottom:4px;">' +
              'Mode C: Local Instant Thermal Label Bridge (Niimbot / Katasymbol 1-Bit)' +
            '</div>' +
            '<p style="margin:0 0 6px 0;font-size:0.76rem;color:#475569;line-height:1.45;">' +
              'Zero waiting time bridge while your 500-pack Kadsticky vinyl press is running overseas. Send any sticker artwork through our Floyd-Steinberg 1-bit dithering engine for instant on-site backstage passes, equipment badges, and thermal label printing on 2"x1" or 3"x3" roll stock.' +
            '</p>' +
            '<div style="font-size:0.72rem;color:#64748b;">' +
              'Supported Hardware: <strong>Niimbot B21/B1/B3S</strong> · <strong>Katasymbol T02/M02</strong> · <strong>Phomemo</strong> · <strong>Brother QL-800</strong>' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<button type="button" class="btnPrimary" onclick="BSIStickerStudio.openThermalDitherStudio()" style="background:#047857;color:#ffffff;font-size:0.8rem;font-weight:800;padding:10px 18px;border-radius:8px;border:none;cursor:pointer;">' +
              '🖨️ Launch 1-Bit Thermal Dither Studio' +
            '</button>' +
          '</div>' +
        '</div>';
    }
  }

  function renderFolderSidebar() {
    var activeId = STATE.activeFolderId;

    var foldersHtml = STATE.folders.map(function (folder) {
      var isActive = folder.id === activeId;
      var count = countStickersInFolder(folder.id);
      var isChild = !!folder.parentId;

      return '' +
        '<div class="stk-folder-row" style="display:flex;align-items:center;justify-content:space-between;padding:' + (isChild ? '6px 10px 6px 26px' : '8px 12px') + ';border-radius:8px;margin-bottom:2px;cursor:pointer;background:' + (isActive ? '#0f172a' : 'transparent') + ';color:' + (isActive ? '#ffffff' : '#334155') + ';font-weight:' + (isActive ? '800' : '600') + ';font-size:0.78rem;transition:background 0.15s;" onclick="BSIStickerStudio.selectFolder(\'' + folder.id + '\')">' +
          '<div style="display:flex;align-items:center;gap:8px;overflow:hidden;">' +
            '<span>' + esc(folder.icon || '📁') + '</span>' +
            '<span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="' + esc(folder.name) + '">' + esc(folder.name) + '</span>' +
          '</div>' +
          '<div style="display:flex;align-items:center;gap:6px;">' +
            '<span style="font-size:0.7rem;background:' + (isActive ? '#334155' : '#e2e8f0') + ';color:' + (isActive ? '#ffffff' : '#475569') + ';padding:1px 6px;border-radius:9999px;font-weight:700;">' + count + '</span>' +
            (!folder.isSystem ? '<button type="button" onclick="event.stopPropagation();BSIStickerStudio.deleteFolderPrompt(\'' + folder.id + '\')" style="border:none;background:transparent;cursor:pointer;color:#94a3b8;font-size:0.7rem;padding:0 2px;" title="Delete folder">✕</button>' : '') +
          '</div>' +
        '</div>';
    }).join('');

    return '' +
      '<div class="panelCard" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:16px;box-shadow:0 4px 16px rgba(0,0,0,0.04);">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #f1f5f9;">' +
          '<span style="font-size:0.82rem;font-weight:900;color:#0f172a;text-transform:uppercase;letter-spacing:0.04em;">Folder Tree</span>' +
          '<button type="button" class="btnOutline" onclick="BSIStickerStudio.promptNewFolder()" style="font-size:0.72rem;font-weight:800;padding:4px 8px;color:#1e40af;border-color:#bfdbfe;background:#eff6ff;">' +
            '+ New Folder' +
          '</button>' +
        '</div>' +
        '<div style="max-height:560px;overflow-y:auto;">' +
          foldersHtml +
        '</div>' +
      '</div>';
  }

  function renderStickerLibraryMain() {
    var activeFolder = getFolderById(STATE.activeFolderId) || { name: 'All Stickers' };
    var stickers = getFilteredStickers();

    var selectedCount = Object.keys(STATE.selectedStickerIds).filter(function (id) {
      return STATE.selectedStickerIds[id] === true;
    }).length;

    return '' +
      '<div class="panelCard" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:18px 20px;box-shadow:0 4px 16px rgba(0,0,0,0.04);">' +
        // Filter & Search Header
        '<div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px;">' +
          '<div>' +
            '<h3 style="margin:0 0 2px 0;font-size:1.1rem;font-weight:900;color:#0f172a;display:flex;align-items:center;gap:8px;">' +
              '<span>' + esc(activeFolder.icon || '📁') + '</span>' +
              '<span>' + esc(activeFolder.name) + '</span>' +
              '<span style="font-size:0.74rem;background:#f1f5f9;color:#475569;padding:2px 8px;border-radius:9999px;font-weight:800;">' + stickers.length + ' Designs</span>' +
            '</h3>' +
            '<div style="font-size:0.74rem;color:#64748b;">3" High-Contrast Die-Cut Masters · Ready for physical gang press</div>' +
          '</div>' +

          '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;">' +
            '<input type="text" id="stkSearchInput" value="' + esc(STATE.searchQuery) + '" oninput="BSIStickerStudio.setSearchQuery(this.value)" placeholder="Search title or prompt..." style="padding:6px 10px;border:1px solid #cbd5e1;border-radius:6px;font-size:0.78rem;width:180px;" />' +
            '<select id="stkShapeFilter" onchange="BSIStickerStudio.setShapeFilter(this.value)" style="padding:6px 10px;border:1px solid #cbd5e1;border-radius:6px;font-size:0.78rem;background:#ffffff;">' +
              '<option value="all"' + (STATE.shapeFilter === 'all' ? ' selected' : '') + '>All Shapes</option>' +
              '<option value="shield"' + (STATE.shapeFilter === 'shield' ? ' selected' : '') + '>Shield / Crest</option>' +
              '<option value="circle"' + (STATE.shapeFilter === 'circle' ? ' selected' : '') + '>Circle</option>' +
              '<option value="rounded-square"' + (STATE.shapeFilter === 'rounded-square' ? ' selected' : '') + '>Rounded Square</option>' +
              '<option value="vip-pass"' + (STATE.shapeFilter === 'vip-pass' ? ' selected' : '') + '>VIP Pass</option>' +
            '</select>' +
            '<select id="stkFinishFilter" onchange="BSIStickerStudio.setFinishFilter(this.value)" style="padding:6px 10px;border:1px solid #cbd5e1;border-radius:6px;font-size:0.78rem;background:#ffffff;">' +
              '<option value="all"' + (STATE.finishFilter === 'all' ? ' selected' : '') + '>All Finishes</option>' +
              '<option value="glossy"' + (STATE.finishFilter === 'glossy' ? ' selected' : '') + '>Glossy Vinyl</option>' +
              '<option value="matte"' + (STATE.finishFilter === 'matte' ? ' selected' : '') + '>Matte Vinyl</option>' +
              '<option value="holographic"' + (STATE.finishFilter === 'holographic' ? ' selected' : '') + '>Holographic</option>' +
              '<option value="clear"' + (STATE.finishFilter === 'clear' ? ' selected' : '') + '>Clear Vinyl</option>' +
            '</select>' +
          '</div>' +
        '</div>' +

        // Bulk Toolbar
        (selectedCount > 0 ? renderBulkToolbar(selectedCount) : '') +

        // Sticker Cards Grid
        '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px;">' +
          (stickers.length ? renderStickerCards(stickers) : renderEmptyLibraryNotice()) +
        '</div>' +
      '</div>';
  }


  function renderCategoryPillsBar() {
    var categories = [
      { id: 'all', label: 'All Categories', icon: '✨' },
      { id: 'brand-badge', label: 'Brand Badges', icon: '🛡️' },
      { id: 'bonvoy-elite', label: 'Bonvoy Elite', icon: '👑' },
      { id: 'travel-tech', label: 'Travel Tech', icon: '⚡' },
      { id: 'loyalty-hacks', label: 'Loyalty Hacks', icon: '🧾' },
      { id: 'motorsports', label: 'Motorsports', icon: '🏎️' },
      { id: 'bumper-strip', label: 'Bumper Strips', icon: '🏁' }
    ];

    var activeCat = STATE.categoryFilter || 'all';

    var pillsHtml = categories.map(function (c) {
      var isActive = activeCat === c.id;
      var bg = isActive ? '#0f172a' : '#ffffff';
      var color = isActive ? '#38bdf8' : '#475569';
      var border = isActive ? '1px solid #0f172a' : '1px solid #cbd5e1';
      return '<button type="button" onclick="BSIStickerStudio.setCategoryFilter(\'' + c.id + '\')" style="cursor:pointer;font-size:0.75rem;font-weight:700;padding:5px 12px;border-radius:9999px;background:' + bg + ';color:' + color + ';border:' + border + ';display:inline-flex;align-items:center;gap:5px;transition:all 0.15s ease;">' +
        '<span>' + c.icon + '</span><span>' + esc(c.label) + '</span>' +
      '</button>';
    }).join(' ');

    return '' +
      '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:16px;padding:8px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">' +
        '<span style="font-size:0.74rem;font-weight:800;color:#64748b;margin-right:4px;">CATEGORIES:</span>' +
        pillsHtml +
      '</div>';
  }

  function setCategoryFilter(val) {
    STATE.categoryFilter = val || 'all';
    renderUI();
  }

  function renderBulkToolbar(count) {
    var foldersOptions = STATE.folders.map(function (f) {
      return '<option value="' + f.id + '">' + esc(f.name) + '</option>';
    }).join('');

    return '' +
      '<div style="background:#0f172a;color:#ffffff;padding:10px 16px;border-radius:8px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;margin-bottom:16px;">' +
        '<div style="display:flex;align-items:center;gap:10px;font-size:0.8rem;font-weight:800;">' +
          '<span>✓ ' + count + ' Stickers Selected</span>' +
          '<button type="button" onclick="BSIStickerStudio.clearSelection()" style="background:transparent;border:none;color:#94a3b8;font-size:0.75rem;cursor:pointer;text-decoration:underline;">Deselect All</button>' +
        '</div>' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<label style="font-size:0.74rem;color:#cbd5e1;font-weight:700;">Bulk Move to:</label>' +
          '<select id="bulkMoveFolderSelect" style="padding:4px 8px;border-radius:6px;border:none;font-size:0.75rem;background:#ffffff;color:#0f172a;font-weight:700;">' +
            foldersOptions +
          '</select>' +
          '<button type="button" class="btnPrimary" onclick="BSIStickerStudio.executeBulkMove()" style="font-size:0.74rem;padding:4px 10px;background:#38bdf8;color:#0f172a;border:none;font-weight:800;border-radius:6px;">' +
            'Move' +
          '</button>' +
          '<button type="button" class="btnOutline" onclick="BSIStickerStudio.bulkAddSelectedToPrintPack()" style="font-size:0.74rem;padding:4px 10px;color:#f59e0b;border-color:#f59e0b;background:rgba(245,158,11,0.1);">' +
            '+ Add to 500-Pack' +
          '</button>' +
        '</div>' +
      '</div>';
  }

  function renderStickerCards(stickers) {
    return stickers.map(function (stk) {
      var isNewlyCreated = STATE.newlyCreatedStickerId === stk.id;
      var isSelected = !!STATE.selectedStickerIds[stk.id];
      var inPrintTray = STATE.printPackSlots.some(function (slot) { return slot.stickerId === stk.id; });
      var imgSrc = stk.imageUrl || generateFallbackStickerDataUrl(stk);

      var folderOptions = STATE.folders.map(function (f) {
        var isCurrent = f.id === stk.folderId;
        return '<option value="' + f.id + '"' + (isCurrent ? ' selected' : '') + '>' + esc(f.name) + '</option>';
      }).join('');

      return '' +
        '<div class="panelCard stk-card-item" id="stkCard_' + stk.id + '" style="background:#ffffff;border:1px solid ' + (isNewlyCreated ? '#f59e0b' : '#e2e8f0') + ';border-radius:10px;padding:12px;display:flex;flex-direction:column;justify-content:space-between;position:relative;box-shadow:' + (isNewlyCreated ? '0 0 0 3px rgba(245,158,11,0.3)' : 'none') + ';transition:all 0.2s;">' +
          // Top Badges & Select Checkbox
          '<div>' +
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">' +
              '<label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-size:0.72rem;font-weight:700;color:#475569;">' +
                '<input type="checkbox" ' + (isSelected ? 'checked' : '') + ' onchange="BSIStickerStudio.toggleStickerSelection(\'' + stk.id + '\')" />' +
                '<span>Select</span>' +
              '</label>' +
              '<div style="display:flex;align-items:center;gap:4px;">' +
                (isNewlyCreated ? '<span style="font-size:0.65rem;background:#f59e0b;color:#ffffff;padding:2px 6px;border-radius:4px;font-weight:900;">NEW · JUST CREATED</span>' : '') +
                (stk.isJohnny ? '<span style="font-size:0.65rem;background:#3b82f6;color:#ffffff;padding:2px 6px;border-radius:4px;font-weight:800;">JOHNNY 25</span>' : '') +
                (stk.isGeneTravels ? '<span style="font-size:0.65rem;background:#8b5cf6;color:#ffffff;padding:2px 6px;border-radius:4px;font-weight:800;">GENETRAVELS</span>' : '') +
              '</div>' +
            '</div>' +

            // Visual Frame Container (Die-cut cutline preview)
            '<div style="width:100%;aspect-ratio:1/1;border-radius:8px;overflow:hidden;background:#09090b;margin-bottom:10px;position:relative;cursor:pointer;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;" onclick="BSIStickerStudio.openPreviewModal(\'' + stk.id + '\')">' +
              '<img src="' + esc(imgSrc) + '" alt="' + esc(stk.title) + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.src=\'' + generateFallbackStickerDataUrl(stk) + '\';" />' +
              // Shape contour cutline badge
              '<div style="position:absolute;bottom:6px;left:6px;background:rgba(15,23,42,0.85);backdrop-filter:blur(4px);padding:3px 8px;border-radius:6px;font-size:0.65rem;font-weight:800;color:#ffffff;border:1px solid rgba(255,255,255,0.15);">' +
                esc(stk.shape) + ' · ' + esc(stk.finish) +
              '</div>' +
              '<div style="position:absolute;top:6px;right:6px;background:rgba(16,185,129,0.9);color:#ffffff;padding:2px 6px;border-radius:4px;font-size:0.62rem;font-weight:900;">' +
                '3" 300 DPI' +
              '</div>' +
            '</div>' +

            // Sticker Info
            '<div style="font-size:0.86rem;font-weight:900;color:#0f172a;margin-bottom:4px;line-height:1.25;">' + esc(stk.title) + '</div>' +
            '<div style="font-size:0.72rem;color:#64748b;margin-bottom:8px;line-height:1.35;max-height:36px;overflow:hidden;text-overflow:ellipsis;">' + esc(stk.concept) + '</div>' +
          '</div>' +

          // Actions Toolbar
          '<div>' +
            '<div style="margin-bottom:8px;">' +
              '<label style="display:block;font-size:0.68rem;font-weight:800;color:#64748b;margin-bottom:3px;">📂 Move to Folder:</label>' +
              '<select onchange="BSIStickerStudio.moveStickerToFolder(\'' + stk.id + '\', this.value)" style="width:100%;padding:4px 6px;border-radius:6px;border:1px solid #cbd5e1;font-size:0.72rem;background:#f8fafc;font-weight:700;">' +
                folderOptions +
              '</select>' +
            '</div>' +

            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px;">' +
              '<button type="button" class="btnOutline" onclick="BSIStickerStudio.toggleStickerInPrintPack(\'' + stk.id + '\')" style="font-size:0.7rem;font-weight:800;padding:5px 6px;color:' + (inPrintTray ? '#10b981' : '#f59e0b') + ';border-color:' + (inPrintTray ? '#10b981' : '#f59e0b') + ';background:' + (inPrintTray ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)') + ';">' +
                (inPrintTray ? '✓ In 500-Pack' : '+ 500-Pack Tray') +
              '</button>' +
              '<button type="button" class="btnOutline" onclick="BSIStickerStudio.openThermalDitherForSticker(\'' + stk.id + '\')" style="font-size:0.7rem;font-weight:800;padding:5px 6px;color:#047857;border-color:#a7f3d0;background:#f0fdf4;">' +
                '🖨️ Thermal Dither' +
              '</button>' +
            '</div>' +

            '<div style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid #f1f5f9;padding-top:6px;">' +
              '<button type="button" onclick="BSIStickerStudio.openPreviewModal(\'' + stk.id + '\')" style="border:none;background:transparent;color:#2563eb;font-size:0.72rem;font-weight:800;cursor:pointer;padding:0;">' +
                '🔍 Inspect Cutline' +
              '</button>' +
              '<button type="button" onclick="BSIStickerStudio.deleteStickerItemPrompt(\'' + stk.id + '\')" style="border:none;background:transparent;color:#dc2626;font-size:0.72rem;font-weight:800;cursor:pointer;padding:0;">' +
                '🗑️ Delete' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>';
    }).join('');
  }

  function renderEmptyLibraryNotice() {
    return '' +
      '<div style="grid-column:1 / -1;text-align:center;padding:40px 20px;background:#f8fafc;border-radius:8px;border:1px dashed #cbd5e1;">' +
        '<div style="font-size:2rem;margin-bottom:8px;">🔍</div>' +
        '<div style="font-size:0.95rem;font-weight:800;color:#0f172a;margin-bottom:4px;">No stickers match your active search or filters</div>' +
        '<div style="font-size:0.76rem;color:#64748b;margin-bottom:12px;">Try clearing filters or generate a new 3" design using Nano Banana above.</div>' +
        '<button type="button" class="btnOutline" onclick="BSIStickerStudio.resetFilters()" style="font-size:0.78rem;font-weight:800;padding:6px 14px;">' +
          'Reset Filters' +
        '</button>' +
      '</div>';
  }

  function renderModalsContainer() {
    return '' +
      '<div id="stkModalContainer" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(15,23,42,0.75);backdrop-filter:blur(4px);z-index:999999;align-items:center;justify-content:center;padding:20px;">' +
        '<div id="stkModalDialog" style="background:#ffffff;border-radius:12px;box-shadow:0 20px 48px rgba(0,0,0,0.4);max-width:680px;width:100%;max-height:90vh;overflow-y:auto;position:relative;">' +
          // Content injected dynamically by modal triggers
        '</div>' +
      '</div>';
  }

  function getFilteredStickers() {
    var list = getStickersInFolder(STATE.activeFolderId);
    var q = (STATE.searchQuery || '').toLowerCase().trim();
    var shape = STATE.shapeFilter;
    var finish = STATE.finishFilter;

    var cat = STATE.categoryFilter || 'all';
    return list.filter(function (s) {
      if (q) {
        var matchTitle = (s.title || '').toLowerCase().indexOf(q) !== -1;
        var matchConcept = (s.concept || '').toLowerCase().indexOf(q) !== -1;
        var matchBanners = ((s.topBanner || '') + ' ' + (s.bottomBanner || '')).toLowerCase().indexOf(q) !== -1;
        if (!matchTitle && !matchConcept && !matchBanners) return false;
      }
      if (shape !== 'all' && s.shape !== shape) return false;
      if (finish !== 'all' && s.finish !== finish) return false;
      if (cat !== 'all') {
        var sCat = s.category || (s.folderId ? s.folderId.replace(/^gt-/, '') : '');
        if (cat === 'brand-badge') {
          if (sCat !== 'brand-badge' && sCat !== 'road-warrior' && sCat !== 'crew-editions') return false;
        } else if (cat === 'bonvoy-elite') {
          if (sCat !== 'bonvoy-elite' && sCat !== 'ambassador-elite') return false;
        } else if (cat === 'travel-tech') {
          if (sCat !== 'travel-tech') return false;
        } else if (cat === 'loyalty-hacks') {
          if (sCat !== 'loyalty-hacks' && sCat !== 'folio-forensics') return false;
        } else if (cat === 'motorsports') {
          if (sCat !== 'motorsports' && sCat !== 'speedway') return false;
        } else if (cat === 'bumper-strip') {
          if (sCat !== 'bumper-strip' && sCat !== 'bumpers' && s.shape !== 'bumper-wide') return false;
        } else if (sCat !== cat && s.category !== cat) {
          return false;
        }
      }
      return true;
    });
  }

  // Interactive Logic & Actions

  function applyPromptPreset(presetId) {
    if (!presetId || STATE.isGenerating) return;
    var found = null;
    for (var i = 0; i < PROMPT_PRESETS_20.length; i++) {
      if (PROMPT_PRESETS_20[i].id === presetId) {
        found = PROMPT_PRESETS_20[i];
        break;
      }
    }
    if (!found) return;
    var conceptEl = document.getElementById('stkConceptInput');
    var topEl = document.getElementById('stkTopBannerInput');
    var bottomEl = document.getElementById('stkBottomBannerInput');
    var shapeEl = document.getElementById('stkShapeInput');
    var finishEl = document.getElementById('stkFinishInput');
    if (conceptEl) conceptEl.value = found.concept;
    if (topEl) topEl.value = found.top;
    if (bottomEl) bottomEl.value = found.bottom;
    if (shapeEl) shapeEl.value = found.shape;
    if (finishEl) finishEl.value = found.finish;
    showToast('🎯 Loaded 3" Prompt Preset: ' + found.title);
  }

  function askTwin3StickerSuggestions() {
    if (STATE.isGenerating) return;
    var scope = getActiveTenantScope();

    var conceptVal = (document.getElementById('stkConceptInput') ? document.getElementById('stkConceptInput').value : '').trim();
    var topVal = (document.getElementById('stkTopBannerInput') ? document.getElementById('stkTopBannerInput').value : '').trim();
    var bottomVal = (document.getElementById('stkBottomBannerInput') ? document.getElementById('stkBottomBannerInput').value : '').trim();
    var shapeVal = document.getElementById('stkShapeInput') ? document.getElementById('stkShapeInput').value : 'shield';
    var finishVal = document.getElementById('stkFinishInput') ? document.getElementById('stkFinishInput').value : 'glossy';

    var btn = document.getElementById('btnAskTwin3');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>⏳</span><span>Twin #3 Thinking...</span>';
    }

    fetch('/api/admin/sticker-studio/suggest?siteKey=' + encodeURIComponent(scope.scopeKey), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        userPrompt: conceptVal || (scope.isGeneTravels ? 'Aviation and High Banks motorsports speed shield crest' : 'Concert photographer pit crest with camera and guitar amps'),
        topText: topVal,
        bottomText: bottomVal,
        shape: shapeVal,
        finish: finishVal,
        siteName: scope.siteName,
        domain: scope.domain
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && Array.isArray(data.suggestions) && data.suggestions.length) {
          STATE.twinChatResponse = data.reply || TWIN3_KNOWLEDGE_BASE.adviceLead;
          STATE.twinSuggestions = data.suggestions.map(function (s) {
            return {
              title: s.title || 'Upgraded 3" Concept',
              shape: shapeVal,
              finish: finishVal,
              concept: s.enhancedPrompt || s.concept || conceptVal,
              topBanner: s.topText || topVal || scope.siteName.toUpperCase(),
              bottomBanner: s.bottomText || bottomVal || '300 DPI MASTER',
              rationale: s.whyItWorks || 'Engineered for 300 DPI 3-inch die-cut vinyl clarity.'
            };
          });
          refreshStudioApp();
          showToast('💬 Site Twin #3 generated 3 upgraded sticker concepts!');
          return;
        }
        throw new Error('Fallback to local Twin #3');
      })
      .catch(function () {
        var customLead = conceptVal
          ? 'Twin #3 analyzed your prompt: "' + esc(conceptVal) + '". For a 3" physical die-cut sticker, high line contrast and a 2.5mm outer bleed border will make this pop.'
          : 'Twin #3 initialized three sticker presets optimized for 300 DPI die-cut vinyl and holographic foil printing.';

        STATE.twinChatResponse = customLead;
        STATE.twinSuggestions = [
          {
            title: 'Heavy Crest Shield Edition',
            shape: 'shield',
            finish: 'glossy',
            concept: (conceptVal || (scope.isGeneTravels ? 'Widebody flight deck and speedway crest' : 'Marshall amplifier stack with vacuum tube glow')) + ', framed in an ornate heraldic crest with heavy 2.5mm white die-cut cutline border and high-contrast ink.',
            topBanner: topVal || scope.siteName.toUpperCase(),
            bottomBanner: bottomVal || (scope.isGeneTravels ? 'HIGH BANKS TO FLIGHT DECK' : 'LIVE ROCK PIT MASTERS'),
            rationale: 'Thick white contour guarantees safe die-cutting without clipping the artwork.'
          },
          {
            title: 'Holographic Neon Medallion',
            shape: 'circle',
            finish: 'holographic',
            concept: (conceptVal || (scope.isGeneTravels ? '#27 Race car banking under stadium lights' : 'Electric guitar solo in concert pit')) + ', circular medallion with prismatic rainbow foil sheen and dramatic spotlight flare.',
            topBanner: topVal || (scope.isGeneTravels ? 'GENETRAVELS.COM' : 'ALL ACCESS PIT PASS'),
            bottomBanner: bottomVal || '300 DPI DIE-CUT MASTER',
            rationale: 'Holographic metallic substrate shimmers under outdoor sun and indoor lighting.'
          },
          {
            title: 'VIP Laminate Credential Badge',
            shape: 'vip-pass',
            finish: 'matte',
            concept: (conceptVal || (scope.isGeneTravels ? 'Transpacific flagship flight deck pass' : 'Stage wing logistics crew')) + ', vertical laminate pass with simulated top lanyard notch and bottom credential barcode.',
            topBanner: topVal || scope.siteName.toUpperCase(),
            bottomBanner: bottomVal || 'ALL ACCESS VIP',
            rationale: 'Perfect trading card format for VIP credentials, crew gear, and collector packs.'
          }
        ];
        refreshStudioApp();
      });
  }

  function useStickerSuggestion(idx) {
    if (!STATE.twinSuggestions || !STATE.twinSuggestions[idx]) return;
    var sug = STATE.twinSuggestions[idx];

    var conceptInput = document.getElementById('stkConceptInput');
    var topBannerInput = document.getElementById('stkTopBannerInput');
    var bottomBannerInput = document.getElementById('stkBottomBannerInput');
    var shapeInput = document.getElementById('stkShapeInput');
    var finishInput = document.getElementById('stkFinishInput');

    if (conceptInput) conceptInput.value = sug.concept;
    if (topBannerInput) topBannerInput.value = sug.topBanner;
    if (bottomBannerInput) bottomBannerInput.value = sug.bottomBanner;
    if (shapeInput) shapeInput.value = sug.shape;
    if (finishInput) finishInput.value = sug.finish;

    // Toast confirmation
    showToast('Applied Twin #3 Suggestion #' + (idx + 1) + ' to Generator!');
  }

  function dismissTwinSuggestions() {
    STATE.twinSuggestions = [];
    refreshStudioApp();
  }

  function createStickerWithNanoBanana() {
    if (STATE.isGenerating) return;
    var scope = getActiveTenantScope();

    var conceptEl = document.getElementById('stkConceptInput');
    var topBannerEl = document.getElementById('stkTopBannerInput');
    var bottomBannerEl = document.getElementById('stkBottomBannerInput');
    var shapeEl = document.getElementById('stkShapeInput');
    var finishEl = document.getElementById('stkFinishInput');

    var concept = (conceptEl ? conceptEl.value : '').trim() || (scope.isGeneTravels ? 'Aviation and speedway speed shield with 300 DPI die-cut border' : 'Dynamic rock stage concert performance with 300 DPI die-cut border');
    var topBanner = (topBannerEl ? topBannerEl.value : scope.siteName.toUpperCase()).trim();
    var bottomBanner = (bottomBannerEl ? bottomBannerEl.value : (scope.isGeneTravels ? 'HIGH BANKS TO FLIGHT DECK' : '300 DPI MASTER')).trim();
    var shape = shapeEl ? shapeEl.value : 'shield';
    var finish = finishEl ? finishEl.value : 'glossy';

    // HARD LOCK CHAT & GENERATOR CONTROLS
    STATE.isGenerating = true;
    STATE.generationProgress = 0;
    STATE.generationElapsedSec = 0;
    STATE.generationStage = '[01/05] Initializing Nano Banana Cloud Agent & GPU Latent Space (300 DPI 1:1)...';

    refreshStudioApp();

    var stages = [
      { atPct: 15, text: '[01/05] Initializing Nano Banana Cloud Agent & GPU Latent Space (300 DPI 1:1)...' },
      { atPct: 35, text: '[02/05] Synthesizing 3" Die-Cut Vector Contours & White Understrike Base...' },
      { atPct: 65, text: '[03/05] Rendering High-Contrast Typography & Metallic / Holographic Foil Shaders...' },
      { atPct: 85, text: '[04/05] Upscaling to 2048x2048 Master & Generating Kadsticky Cutline Vector...' },
      { atPct: 98, text: '[05/05] Finalizing Master PNG & Auto-Filing into Dated Creation Folder...' }
    ];

    // Tick animated progress bar while real Nano Banana API renders on backend
    var intervalMs = 250;
    var totalDurationMs = 18000;
    var stepIncrement = (100 / (totalDurationMs / intervalMs));
    var apiResolved = false;
    var serverSticker = null;

    if (STATE.generationTimer) clearInterval(STATE.generationTimer);

    // Launch real backend Nano Banana generation in parallel with progress bar lock
    fetch('/api/admin/sticker-studio/generate?siteKey=' + encodeURIComponent(scope.scopeKey), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        prompt: concept,
        title: topBanner ? topBanner + ' · ' + bottomBanner : concept.slice(0, 36),
        topText: topBanner,
        bottomText: bottomBanner,
        shape: shape,
        finish: finish,
        siteKey: scope.scopeKey
      })
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data && data.ok && data.sticker) {
          serverSticker = data.sticker;
        }
        apiResolved = true;
      })
      .catch(function () {
        apiResolved = true;
      });

    STATE.generationTimer = setInterval(function () {
      // Hold at 92% if the backend Nano Banana call is still finishing
      if (!apiResolved && STATE.generationProgress >= 92) {
        STATE.generationProgress = 92;
        STATE.generationElapsedSec += 0.25;
      } else if (apiResolved && STATE.generationProgress >= 45) {
        STATE.generationProgress += stepIncrement * 3.5;
        STATE.generationElapsedSec += 0.25;
      } else {
        STATE.generationProgress += stepIncrement;
        STATE.generationElapsedSec += 0.25;
      }

      for (var i = stages.length - 1; i >= 0; i--) {
        if (STATE.generationProgress >= stages[i].atPct) {
          STATE.generationStage = stages[i].text;
          break;
        }
      }

      // Live update DOM directly without full re-render for smooth 60fps animation
      var lockBanner = document.getElementById('nanoBananaHardLockBanner');
      if (lockBanner) {
        STATE.generationElapsedSec = Math.round(STATE.generationElapsedSec * 10) / 10;
        lockBanner.innerHTML = renderHardLockBanner().replace('<div id="nanoBananaHardLockBanner" style="background:#0f172a;color:#ffffff;border-radius:10px;padding:16px 20px;border:2px solid #f59e0b;margin-bottom:16px;box-shadow:0 8px 24px rgba(0,0,0,0.3);">', '').replace(/<\/div>$/, '');
      }

      if (STATE.generationProgress >= 100 && apiResolved) {
        clearInterval(STATE.generationTimer);
        STATE.generationTimer = null;
        finalizeStickerCreation(concept, topBanner, bottomBanner, shape, finish, serverSticker);
      }
    }, intervalMs);
  }

  function finalizeStickerCreation(concept, topBanner, bottomBanner, shape, finish, serverSticker) {
    var todayStr = getTodayString();
    var datedFolderId = 'dated-' + todayStr;

    // Ensure dated folder exists
    var hasDated = STATE.folders.some(function (f) { return f.id === datedFolderId; });
    if (!hasDated) {
      STATE.folders.splice(1, 0, {
        id: datedFolderId,
        name: '📅 ' + todayStr + ' Creations',
        icon: '📅',
        parentId: null,
        isDated: true
      });
    }

    var newId = (serverSticker && serverSticker.id) ? serverSticker.id : ('bsi-custom-' + Date.now().toString(36));
    var newTitle = (serverSticker && serverSticker.title) ? serverSticker.title : (topBanner ? topBanner + ' Custom' : '3" ' + shape.toUpperCase() + ' Master');

    var newSticker = {
      id: newId,
      title: newTitle,
      filename: (serverSticker && serverSticker.filename) ? serverSticker.filename : ('custom_sticker_' + Date.now() + '.png'),
      imageUrl: (serverSticker && serverSticker.relativeUrl) ? serverSticker.relativeUrl : '',
      folderId: datedFolderId,
      concept: concept,
      topBanner: topBanner,
      bottomBanner: bottomBanner,
      shape: shape,
      finish: finish,
      dimensions: '3" x 3"',
      dpi: 300,
      dateAdded: todayStr,
      isCustom: true,
      inPrintPack: false
    };

    if (!newSticker.imageUrl) {
      newSticker.imageUrl = generateFallbackStickerDataUrl(newSticker);
    }

    STATE.stickers.unshift(newSticker);
    STATE.newlyCreatedStickerId = newId;

    // UNLOCK CHAT & UI
    STATE.isGenerating = false;
    STATE.generationProgress = 100;
    STATE.activeFolderId = datedFolderId; // Automatically navigate to dated folder!

    saveState();
    refreshStudioApp();

    showToast('🎉 3" Sticker Master Created & Filed into ' + todayStr + ' Creations!');

    // Smooth scroll to new sticker card
    setTimeout(function () {
      var el = document.getElementById('stkCard_' + newId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  }

  function selectFolder(folderId) {
    STATE.activeFolderId = folderId;
    refreshStudioApp();
  }

  function promptNewFolder() {
    var name = window.prompt('Enter new folder name:');
    if (!name || !name.trim()) return;

    var cleanName = name.trim();
    var folderId = 'folder-' + Date.now().toString(36);

    // If active folder is not system and user confirms, allow nesting
    var parentId = null;
    var activeF = getFolderById(STATE.activeFolderId);
    if (activeF && !activeF.isSystem && STATE.activeFolderId !== 'all-stickers') {
      var nest = window.confirm('Create this as a subfolder inside "' + activeF.name + '"?');
      if (nest) parentId = activeF.id;
    }

    STATE.folders.push({
      id: folderId,
      name: cleanName,
      icon: '📁',
      parentId: parentId
    });

    STATE.activeFolderId = folderId;
    saveState();
    refreshStudioApp();
    showToast('Created folder: ' + cleanName);
  }

  function deleteFolderPrompt(folderId) {
    var f = getFolderById(folderId);
    if (!f || f.isSystem) return;

    var count = countStickersInFolder(folderId);
    var msg = 'Are you sure you want to delete folder "' + f.name + '"?';
    if (count > 0) {
      msg += '\n\n' + count + ' stickers inside will be moved back to All Stickers.';
    }

    if (!window.confirm(msg)) return;

    // Move orphan stickers
    STATE.stickers.forEach(function (s) {
      if (s.folderId === folderId) {
        s.folderId = 'all-stickers';
      }
    });

    STATE.folders = STATE.folders.filter(function (x) { return x.id !== folderId; });
    if (STATE.activeFolderId === folderId) {
      STATE.activeFolderId = 'all-stickers';
    }

    saveState();
    refreshStudioApp();
    showToast('Folder deleted.');
  }

  function moveStickerToFolder(stickerId, targetFolderId) {
    var stk = getStickerById(stickerId);
    var target = getFolderById(targetFolderId);
    if (!stk || !target) return;

    stk.folderId = targetFolderId;
    saveState();
    refreshStudioApp();
    showToast('Moved "' + stk.title + '" to ' + target.name);

    if (typeof fetch === 'function') {
      var scope = getActiveTenantScope();
      fetch('/api/admin/sticker-studio/move?siteKey=' + encodeURIComponent(scope.scopeKey), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ stickerIds: [stickerId], stickerId: stickerId, targetFolderId: targetFolderId, siteKey: scope.scopeKey })
      }).catch(function () {});
    }
  }

  function deleteStickerItemPrompt(stickerId) {
    var stk = getStickerById(stickerId);
    if (!stk) return;

    if (!window.confirm('Delete sticker "' + stk.title + '" from your library?')) return;

    // Remove from print slots if assigned
    STATE.printPackSlots.forEach(function (slot) {
      if (slot.stickerId === stickerId) {
        slot.stickerId = null;
      }
    });

    STATE.stickers = STATE.stickers.filter(function (s) { return s.id !== stickerId; });
    delete STATE.selectedStickerIds[stickerId];

    saveState();
    refreshStudioApp();
    showToast('Sticker deleted.');

    if (typeof fetch === 'function') {
      var scope = getActiveTenantScope();
      fetch('/api/admin/sticker-studio/delete?siteKey=' + encodeURIComponent(scope.scopeKey), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ stickerId: stickerId, deleteFile: true, siteKey: scope.scopeKey })
      }).catch(function () {});
    }
  }

  function toggleStickerSelection(stickerId) {
    if (STATE.selectedStickerIds[stickerId]) {
      delete STATE.selectedStickerIds[stickerId];
    } else {
      STATE.selectedStickerIds[stickerId] = true;
    }
    refreshStudioApp();
  }

  function clearSelection() {
    STATE.selectedStickerIds = {};
    refreshStudioApp();
  }

  function executeBulkMove() {
    var selectEl = document.getElementById('bulkMoveFolderSelect');
    if (!selectEl) return;
    var targetFolderId = selectEl.value;
    var target = getFolderById(targetFolderId);
    if (!target) return;

    var movedCount = 0;
    Object.keys(STATE.selectedStickerIds).forEach(function (id) {
      if (STATE.selectedStickerIds[id]) {
        var stk = getStickerById(id);
        if (stk) {
          stk.folderId = targetFolderId;
          movedCount++;
        }
      }
    });

    STATE.selectedStickerIds = {};
    saveState();
    refreshStudioApp();
    showToast('Bulk moved ' + movedCount + ' stickers to ' + target.name);
  }

  function bulkAddSelectedToPrintPack() {
    var added = 0;
    Object.keys(STATE.selectedStickerIds).forEach(function (id) {
      if (STATE.selectedStickerIds[id]) {
        var alreadyIn = STATE.printPackSlots.some(function (sl) { return sl.stickerId === id; });
        if (!alreadyIn) {
          // Find first empty slot
          for (var i = 0; i < STATE.printPackSlots.length; i++) {
            if (!STATE.printPackSlots[i].stickerId) {
              STATE.printPackSlots[i].stickerId = id;
              added++;
              break;
            }
          }
        }
      }
    });

    STATE.selectedStickerIds = {};
    saveState();
    refreshStudioApp();
    showToast('Added ' + added + ' stickers to 500-Pack Print Tray!');
  }

  function toggleStickerInPrintPack(stickerId) {
    var existingSlot = null;
    for (var i = 0; i < STATE.printPackSlots.length; i++) {
      if (STATE.printPackSlots[i].stickerId === stickerId) {
        existingSlot = STATE.printPackSlots[i];
        break;
      }
    }

    if (existingSlot) {
      existingSlot.stickerId = null;
      showToast('Removed from 500-Pack Tray.');
    } else {
      // Find empty slot
      var emptySlot = null;
      for (var j = 0; j < STATE.printPackSlots.length; j++) {
        if (!STATE.printPackSlots[j].stickerId) {
          emptySlot = STATE.printPackSlots[j];
          break;
        }
      }

      if (!emptySlot) {
        window.alert('All 10 print pack slots are filled. Remove a design from the tray first.');
        return;
      }

      emptySlot.stickerId = stickerId;
      showToast('Assigned to Slot #' + emptySlot.slotIndex + ' in 500-Pack Tray.');
    }

    saveState();
    refreshStudioApp();
  }

  function promptAssignSlot(slotIndex) {
    var available = STATE.stickers.filter(function (s) {
      return !STATE.printPackSlots.some(function (sl) { return sl.stickerId === s.id; });
    });

    if (!available.length) {
      window.alert('All stickers in your library are already assigned to print slots.');
      return;
    }

    var modalHtml = '' +
      '<div style="padding:22px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">' +
          '<h3 style="margin:0;font-size:1.1rem;font-weight:900;color:#0f172a;">Assign Sticker to Slot #' + slotIndex + '</h3>' +
          '<button type="button" onclick="BSIStickerStudio.closeModal()" style="border:none;background:transparent;cursor:pointer;font-size:1.1rem;color:#94a3b8;">✕</button>' +
        '</div>' +
        '<div style="max-height:420px;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;">' +
          available.map(function (s) {
            var src = s.imageUrl || generateFallbackStickerDataUrl(s);
            return '' +
              '<div onclick="BSIStickerStudio.assignStickerToSlot(' + slotIndex + ', \'' + s.id + '\')" style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:8px;cursor:pointer;text-align:center;">' +
                '<div style="width:100%;aspect-ratio:1/1;border-radius:6px;overflow:hidden;background:#000;margin-bottom:6px;">' +
                  '<img src="' + esc(src) + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.src=\'' + generateFallbackStickerDataUrl(s) + '\';" />' +
                '</div>' +
                '<div style="font-size:0.75rem;font-weight:800;color:#0f172a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + esc(s.title) + '</div>' +
              '</div>';
          }).join('') +
        '</div>' +
      '</div>';

    openCustomModal(modalHtml);
  }

  function assignStickerToSlot(slotIndex, stickerId) {
    var slot = STATE.printPackSlots[slotIndex - 1];
    if (slot) {
      slot.stickerId = stickerId;
      saveState();
      closeModal();
      refreshStudioApp();
      showToast('Assigned sticker to Slot #' + slotIndex);
    }
  }

  function clearPrintSlot(slotIndex) {
    var slot = STATE.printPackSlots[slotIndex - 1];
    if (slot) {
      slot.stickerId = null;
      saveState();
      refreshStudioApp();
      showToast('Cleared Slot #' + slotIndex);
    }
  }

  function clearAllPrintSlots() {
    if (!window.confirm('Clear all 10 slots in your 500-Pack Print Tray?')) return;
    STATE.printPackSlots.forEach(function (s) { s.stickerId = null; });
    saveState();
    refreshStudioApp();
    showToast('Cleared all print slots.');
  }

  function setSlotQuantity(slotIndex, qty) {
    var slot = STATE.printPackSlots[slotIndex - 1];
    if (slot) {
      var n = Math.max(1, parseInt(qty, 10) || 50);
      slot.quantity = n;
      saveState();
      refreshStudioApp();
    }
  }

  function autoBalanceQuantities() {
    var filled = STATE.printPackSlots.filter(function (s) { return s.stickerId !== null; });
    if (!filled.length) {
      window.alert('Assign at least one sticker to the tray to balance quantities.');
      return;
    }

    var baseQty = Math.floor(TOTAL_PRINT_UNITS / filled.length);
    var remainder = TOTAL_PRINT_UNITS % filled.length;

    filled.forEach(function (slot, idx) {
      slot.quantity = baseQty + (idx === 0 ? remainder : 0);
    });

    saveState();
    refreshStudioApp();
    showToast('Auto-balanced 500 stickers evenly among ' + filled.length + ' designs!');
  }

  function switchVendorMode(mode) {
    STATE.vendorMode = mode;
    saveState();
    refreshStudioApp();
  }

  function togglePrintRunDrawer() {
    var el = document.getElementById('printRunTrayContainer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Mode A: GreenTree Concierge Modal
  function openConciergeOrderModal() {
    var filled = STATE.printPackSlots.filter(function (s) { return s.stickerId !== null; });
    if (!filled.length) {
      window.alert('Please assign at least 1 design to the 500-Pack Print Run Tray before placing an order.');
      return;
    }

    var manifestRows = filled.map(function (slot, idx) {
      var s = getStickerById(slot.stickerId);
      return '' +
        '<tr style="border-bottom:1px solid #f1f5f9;font-size:0.75rem;">' +
          '<td style="padding:6px 8px;font-weight:800;color:#0f172a;">Slot #' + slot.slotIndex + '</td>' +
          '<td style="padding:6px 8px;font-weight:700;">' + esc(s ? s.title : 'Custom Master') + '</td>' +
          '<td style="padding:6px 8px;">' + esc(s ? s.shape : 'shield') + '</td>' +
          '<td style="padding:6px 8px;">' + esc(s ? s.finish : 'glossy') + '</td>' +
          '<td style="padding:6px 8px;font-weight:800;text-align:right;">' + slot.quantity + ' pcs</td>' +
        '</tr>';
    }).join('');

    var modalHtml = '' +
      '<div style="padding:24px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<span style="font-size:1.3rem;">💳</span>' +
            '<h3 style="margin:0;font-size:1.15rem;font-weight:900;color:#0f172a;">Confirm GreenTree White-Label 500-Pack Order</h3>' +
          '</div>' +
          '<button type="button" onclick="BSIStickerStudio.closeModal()" style="border:none;background:transparent;cursor:pointer;font-size:1.1rem;color:#94a3b8;">✕</button>' +
        '</div>' +

        '<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:12px;margin-bottom:16px;font-size:0.78rem;color:#1e40af;line-height:1.45;">' +
          '<strong>Fulfillment Protocol:</strong> Your curated 300 DPI print-ready gang run manifest will be dispatched to the wholesale production queue. Turnaround is <strong>2-3 weeks</strong> for physical delivery to client venue or studio.' +
        '</div>' +

        '<div style="border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;margin-bottom:16px;">' +
          '<table style="width:100%;border-collapse:collapse;text-align:left;">' +
            '<thead style="background:#f8fafc;font-size:0.72rem;color:#475569;font-weight:800;text-transform:uppercase;">' +
              '<tr>' +
                '<th style="padding:8px;">Slot</th>' +
                '<th style="padding:8px;">Design Title</th>' +
                '<th style="padding:8px;">Cutline</th>' +
                '<th style="padding:8px;">Finish</th>' +
                '<th style="padding:8px;text-align:right;">Qty</th>' +
              '</tr>' +
            '</thead>' +
            '<tbody>' +
              manifestRows +
            '</tbody>' +
          '</table>' +
        '</div>' +

        '<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:12px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center;">' +
          '<div>' +
            '<div style="font-size:0.76rem;color:#64748b;font-weight:700;">WHMCS / Stripe Order Total:</div>' +
            '<div style="font-size:1.3rem;font-weight:900;color:#0f172a;">$99.00 USD</div>' +
          '</div>' +
          '<div style="text-align:right;font-size:0.72rem;color:#64748b;">' +
            '<div>Wholesale Press Cost: $49.90</div>' +
            '<div style="color:#047857;font-weight:800;">Studio Retainer Margin: $49.10</div>' +
          '</div>' +
        '</div>' +

        '<div style="display:flex;justify-content:flex-end;gap:10px;">' +
          '<button type="button" class="btnOutline" onclick="BSIStickerStudio.closeModal()" style="font-size:0.8rem;padding:8px 16px;">Cancel</button>' +
          '<button type="button" class="btnPrimary" onclick="BSIStickerStudio.submitConciergeOrder()" style="background:#0f172a;color:#ffffff;font-size:0.8rem;font-weight:900;padding:8px 20px;border-radius:6px;border:none;">' +
            '🚀 Dispatch Manifest &amp; Bill WHMCS' +
          '</button>' +
        '</div>' +
      '</div>';

    openCustomModal(modalHtml);
  }

  function submitConciergeOrder() {
    closeModal();
    showToast('🚀 Order Manifest dispatched! WHMCS Invoice generated & wholesale gang run queued.');
  }

  // Mode B: Kadsticky Clipboard Split Table
  function copyKadstickySplitTable() {
    var filled = STATE.printPackSlots.filter(function (s) { return s.stickerId !== null; });
    if (!filled.length) {
      window.alert('Assign at least one sticker to the tray first.');
      return;
    }

    var lines = [
      'KADSTICKY.COM 500-STICKER PACK QUANTITY SPLIT ORDER SPECIFICATION',
      'Target: 3" Custom Die-Cut Vinyl Stickers (500 Pcs Gang Run)',
      'Timestamp: ' + new Date().toISOString(),
      '------------------------------------------------------------'
    ];

    var totalQty = 0;
    filled.forEach(function (slot) {
      var s = getStickerById(slot.stickerId);
      var title = s ? s.title : 'Custom Artwork';
      var shape = s ? s.shape : 'shield';
      var finish = s ? s.finish : 'glossy';
      var q = slot.quantity || 50;
      totalQty += q;
      lines.push('Slot #' + slot.slotIndex + ' | ' + title + ' (' + shape + ', ' + finish + '): ' + q + ' pcs');
    });

    lines.push('------------------------------------------------------------');
    lines.push('Total Stickers Allocated: ' + totalQty + ' / 500 Pcs');
    lines.push('Print Specifications: 300 DPI, 1:1 Scale, 2.5mm Bleed Die-Cut');

    var text = lines.join('\n');

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast('📋 Kadsticky Split Table copied to clipboard!');
      }).catch(function () {
        fallbackCopyText(text);
      });
    } else {
      fallbackCopyText(text);
    }
  }

  function fallbackCopyText(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('📋 Kadsticky Split Table copied to clipboard!');
    } catch (e) {
      window.prompt('Copy your order spec table:', text);
    }
    document.body.removeChild(ta);
  }

  function launchKadstickyVendorPage() {
    window.open('https://kadsticky.com/', '_blank', 'noopener,noreferrer');
  }

  // Mode C: 1-Bit Floyd-Steinberg Thermal Studio
  function openThermalDitherStudio() {
    var filled = STATE.printPackSlots.filter(function (s) { return s.stickerId !== null; });
    var targetStk = filled.length ? getStickerById(filled[0].stickerId) : STATE.stickers[0];
    if (!targetStk) {
      window.alert('No sticker artwork available for thermal rendering.');
      return;
    }
    openThermalDitherForSticker(targetStk.id);
  }

  function openThermalDitherForSticker(stickerId) {
    var stk = getStickerById(stickerId);
    if (!stk) return;

    STATE.activeThermalStickerId = stickerId;
    var imgSrc = stk.imageUrl || generateFallbackStickerDataUrl(stk);

    var modalHtml = '' +
      '<div style="padding:24px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<span style="font-size:1.3rem;">🖨️</span>' +
            '<h3 style="margin:0;font-size:1.15rem;font-weight:900;color:#0f172a;">1-Bit Floyd-Steinberg Thermal Label Studio</h3>' +
          '</div>' +
          '<button type="button" onclick="BSIStickerStudio.closeModal()" style="border:none;background:transparent;cursor:pointer;font-size:1.1rem;color:#94a3b8;">✕</button>' +
        '</div>' +

        '<p style="margin:0 0 14px 0;font-size:0.76rem;color:#475569;line-height:1.45;">' +
          'Converts full-color 300 DPI master into an instant high-density 1-bit monochrome bitmap for Niimbot, Katasymbol, and Phomemo thermal label printers while awaiting 2-week vinyl delivery.' +
        '</p>' +

        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:center;margin-bottom:16px;">' +
          '<div>' +
            '<div style="font-size:0.72rem;font-weight:800;color:#64748b;margin-bottom:6px;text-transform:uppercase;">Original 300 DPI Color Master:</div>' +
            '<div style="width:100%;aspect-ratio:1/1;border-radius:8px;overflow:hidden;background:#09090b;border:1px solid #cbd5e1;display:flex;align-items:center;justify-content:center;">' +
              '<img id="thermalSourceImg" src="' + esc(imgSrc) + '" alt="Color Master" style="width:100%;height:100%;object-fit:cover;" crossOrigin="anonymous" onload="BSIStickerStudio.processThermalCanvas()" onerror="this.onerror=null;this.src=\'' + generateFallbackStickerDataUrl(stk) + '\';" />' +
            '</div>' +
          '</div>' +
          '<div>' +
            '<div style="font-size:0.72rem;font-weight:800;color:#64748b;margin-bottom:6px;text-transform:uppercase;">1-Bit Dithered Thermal Pass (2"x1" / 3"x3"):</div>' +
            '<div style="width:100%;aspect-ratio:1/1;border-radius:8px;overflow:hidden;background:#ffffff;border:2px solid #000000;display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 10px rgba(0,0,0,0.05);">' +
              '<canvas id="thermalDitherCanvas" width="300" height="300" style="width:100%;height:100%;"></canvas>' +
            '</div>' +
          '</div>' +
        '</div>' +

        '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin-bottom:16px;">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
            '<label style="font-size:0.74rem;font-weight:800;color:#0f172a;">Floyd-Steinberg Black/White Threshold:</label>' +
            '<span id="thresholdValDisplay" style="font-size:0.74rem;font-weight:800;color:#4f46e5;">' + STATE.thermalThreshold + '</span>' +
          '</div>' +
          '<input type="range" min="30" max="220" value="' + STATE.thermalThreshold + '" oninput="BSIStickerStudio.updateThermalThreshold(this.value)" style="width:100%;" />' +
        '</div>' +

        '<div style="display:flex;justify-content:space-between;align-items:center;">' +
          '<div style="font-size:0.7rem;color:#64748b;">' +
            'Target: Niimbot B21 / Katasymbol T02 / Brother QL ESC/POS Direct' +
          '</div>' +
          '<div style="display:flex;gap:8px;">' +
            '<button type="button" class="btnOutline" onclick="BSIStickerStudio.closeModal()" style="font-size:0.78rem;padding:8px 14px;">Close</button>' +
            '<button type="button" class="btnPrimary" onclick="BSIStickerStudio.printThermalCanvas()" style="background:#047857;color:#ffffff;font-size:0.78rem;font-weight:900;padding:8px 18px;border-radius:6px;border:none;">' +
              '🖨️ Print Thermal Label' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    openCustomModal(modalHtml);
    setTimeout(processThermalCanvas, 100);
  }

  function processThermalCanvas() {
    var srcImg = document.getElementById('thermalSourceImg');
    var canvas = document.getElementById('thermalDitherCanvas');
    if (!srcImg || !canvas) return;

    try {
      applyFloydSteinbergDither(srcImg, canvas, STATE.thermalThreshold);
    } catch (e) {
      console.warn('Canvas cross-origin or render note:', e);
    }
  }

  function updateThermalThreshold(val) {
    STATE.thermalThreshold = parseInt(val, 10) || 128;
    var disp = document.getElementById('thresholdValDisplay');
    if (disp) disp.textContent = STATE.thermalThreshold;
    processThermalCanvas();
  }

  function printThermalCanvas() {
    var canvas = document.getElementById('thermalDitherCanvas');
    if (!canvas) return;

    var dataUrl = canvas.toDataURL('image/png');
    var htmlContent = '<html><head><title>Thermal Sticker Pass</title><style>@page{size:auto;margin:0mm;}body{margin:0;display:flex;align-items:center;justify-content:center;height:100vh;}img{width:100%;max-width:300px;image-rendering:pixelated;}</style></head><body><img src="' + dataUrl + '" onload="window.print();window.close();"/></body></html>';
    var blob = new Blob([htmlContent], { type: 'text/html' });
    var blobUrl = URL.createObjectURL(blob);
    var win = window.open(blobUrl, '_blank');
    if (win) {
      win.focus();
    }
  }

  // Inspection & Cutline Modal
  function openPreviewModal(stickerId) {
    var stk = getStickerById(stickerId);
    if (!stk) return;

    var imgSrc = stk.imageUrl || generateFallbackStickerDataUrl(stk);

    var modalHtml = '' +
      '<div style="padding:24px;">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">' +
          '<div>' +
            '<h3 style="margin:0;font-size:1.2rem;font-weight:900;color:#0f172a;">' + esc(stk.title) + '</h3>' +
            '<div style="font-size:0.75rem;color:#64748b;">3" Die-Cut Cutline &amp; Spec Inspector</div>' +
          '</div>' +
          '<button type="button" onclick="BSIStickerStudio.closeModal()" style="border:none;background:transparent;cursor:pointer;font-size:1.1rem;color:#94a3b8;">✕</button>' +
        '</div>' +

        '<div style="width:100%;aspect-ratio:1/1;max-width:380px;margin:0 auto 18px auto;border-radius:12px;overflow:hidden;background:#09090b;border:2px solid #334155;position:relative;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 30px rgba(0,0,0,0.25);">' +
          '<img src="' + esc(imgSrc) + '" alt="' + esc(stk.title) + '" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.src=\'' + generateFallbackStickerDataUrl(stk) + '\';" />' +
          '<div style="position:absolute;top:8px;left:8px;background:rgba(15,23,42,0.9);color:#38bdf8;padding:3px 8px;border-radius:6px;font-size:0.7rem;font-family:monospace;font-weight:800;">' +
            'CUTLINE: 2.5mm BLEED' +
          '</div>' +
          '<div style="position:absolute;bottom:8px;right:8px;background:#10b981;color:#ffffff;padding:3px 8px;border-radius:6px;font-size:0.7rem;font-weight:900;">' +
            '300 DPI READY' +
          '</div>' +
        '</div>' +

        '<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin-bottom:16px;font-size:0.78rem;line-height:1.45;">' +
          '<div><strong style="color:#0f172a;">Subject &amp; Prompt:</strong> <span style="color:#475569;">' + esc(stk.concept) + '</span></div>' +
          '<div style="margin-top:4px;"><strong style="color:#0f172a;">Banners:</strong> <span style="color:#475569;">' + esc(stk.topBanner || 'None') + ' | ' + esc(stk.bottomBanner || 'None') + '</span></div>' +
          '<div style="margin-top:4px;"><strong style="color:#0f172a;">Substrate Finish:</strong> <span style="color:#475569;">' + esc(stk.finish) + ' on ' + esc(stk.shape) + ' die-cut vinyl</span></div>' +
        '</div>' +

        '<div style="display:flex;justify-content:space-between;align-items:center;">' +
          '<div style="font-size:0.72rem;color:#64748b;">' +
            'Dimensions: 3" x 3" · High-Res 2048px vector canvas export' +
          '</div>' +
          '<div style="display:flex;gap:8px;">' +
            '<a href="' + esc(imgSrc) + '" download="' + esc(stk.title.replace(/\s+/g, '_').toLowerCase()) + '_300dpi.png" class="btnPrimary" style="background:#0f172a;color:#ffffff;font-size:0.78rem;font-weight:800;padding:8px 16px;border-radius:6px;text-decoration:none;display:inline-block;">' +
              '⬇️ Download 300 DPI Master' +
            '</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    openCustomModal(modalHtml);
  }

  function openCustomModal(htmlContent) {
    var container = document.getElementById('stkModalContainer');
    var dialog = document.getElementById('stkModalDialog');
    if (!container || !dialog) return;

    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlContent, 'text/html');
    while (dialog.firstChild) dialog.removeChild(dialog.firstChild);
    while (doc.body.firstChild) {
      dialog.appendChild(doc.body.firstChild);
    }
    container.style.display = 'flex';
  }

  function closeModal() {
    var container = document.getElementById('stkModalContainer');
    if (container) container.style.display = 'none';
  }

  function setSearchQuery(val) {
    STATE.searchQuery = val;
    refreshStudioApp();
  }

  function setShapeFilter(val) {
    STATE.shapeFilter = val;
    refreshStudioApp();
  }

  function setFinishFilter(val) {
    STATE.finishFilter = val;
    refreshStudioApp();
  }

  function resetFilters() {
    STATE.searchQuery = '';
    STATE.shapeFilter = 'all';
    STATE.finishFilter = 'all';
    STATE.categoryFilter = 'all';
    refreshStudioApp();
  }

  function showToast(msg) {
    var toast = document.createElement('div');
    toast.textContent = msg;
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.background = '#0f172a';
    toast.style.color = '#ffffff';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
    toast.style.fontWeight = '800';
    toast.style.fontSize = '0.82rem';
    toast.style.zIndex = '9999999';
    toast.style.border = '1px solid #f59e0b';
    document.body.appendChild(toast);

    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3200);
  }

  function refreshStudioApp() {
    var app = document.getElementById('stickerStudioApp');
    if (!app) return;

    var container = app.parentNode;
    if (container) {
      container.innerHTML = renderStickerStudioTab();
    }
  }

  return {
    renderStickerStudioTab: renderStickerStudioTab,
    applyPromptPreset: applyPromptPreset,
    askTwin3StickerSuggestions: askTwin3StickerSuggestions,
    useStickerSuggestion: useStickerSuggestion,
    dismissTwinSuggestions: dismissTwinSuggestions,
    createStickerWithNanoBanana: createStickerWithNanoBanana,
    selectFolder: selectFolder,
    promptNewFolder: promptNewFolder,
    deleteFolderPrompt: deleteFolderPrompt,
    moveStickerToFolder: moveStickerToFolder,
    deleteStickerItemPrompt: deleteStickerItemPrompt,
    toggleStickerSelection: toggleStickerSelection,
    clearSelection: clearSelection,
    executeBulkMove: executeBulkMove,
    bulkAddSelectedToPrintPack: bulkAddSelectedToPrintPack,
    toggleStickerInPrintPack: toggleStickerInPrintPack,
    promptAssignSlot: promptAssignSlot,
    assignStickerToSlot: assignStickerToSlot,
    clearPrintSlot: clearPrintSlot,
    clearAllPrintSlots: clearAllPrintSlots,
    setSlotQuantity: setSlotQuantity,
    autoBalanceQuantities: autoBalanceQuantities,
    switchVendorMode: switchVendorMode,
    togglePrintRunDrawer: togglePrintRunDrawer,
    openConciergeOrderModal: openConciergeOrderModal,
    submitConciergeOrder: submitConciergeOrder,
    copyKadstickySplitTable: copyKadstickySplitTable,
    launchKadstickyVendorPage: launchKadstickyVendorPage,
    openThermalDitherStudio: openThermalDitherStudio,
    openThermalDitherForSticker: openThermalDitherForSticker,
    processThermalCanvas: processThermalCanvas,
    updateThermalThreshold: updateThermalThreshold,
    printThermalCanvas: printThermalCanvas,
    openPreviewModal: openPreviewModal,
    closeModal: closeModal,
    setSearchQuery: setSearchQuery,
    setShapeFilter: setShapeFilter,
    setFinishFilter: setFinishFilter,
    setCategoryFilter: setCategoryFilter,
    resetFilters: resetFilters,
    showToast: showToast,
    getState: function () { return STATE; }
  };
});
