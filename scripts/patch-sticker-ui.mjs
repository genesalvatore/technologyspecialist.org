import fs from 'node:fs';

const filePath = 'public/mod-sticker-studio-ui.js';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update getActiveTenantScope
const targetScope = `    var combined = (sk + ' ' + dom).toLowerCase();
    var isBackstage = combined.indexOf('backstage') !== -1;
    var isGeneTravels = combined.indexOf('genetravels') !== -1;
    var scopeKey = isBackstage ? 'backstageimagesri' : (isGeneTravels ? 'genetravels' : (sk || dom || 'default'));
    return {
      scopeKey: scopeKey,
      isBackstage: isBackstage,
      isGeneTravels: isGeneTravels,
      siteName: siteName || (isBackstage ? 'Backstage Images RI' : (isGeneTravels ? 'GeneTravels' : (dom || 'Brand Studio'))),
      domain: dom || (isBackstage ? 'backstageimagesri.com' : (isGeneTravels ? 'genetravels.com' : 'greentreehosting.com'))
    };`;

const replScope = `    var combined = (sk + ' ' + dom).toLowerCase();
    var isBackstage = combined.indexOf('backstage') !== -1;
    var isGeneTravels = combined.indexOf('genetravels') !== -1;
    var isTechSpec = combined.indexOf('technologyspecialist') !== -1 || combined.indexOf('techspec') !== -1;
    var scopeKey = isBackstage ? 'backstageimagesri' : (isGeneTravels ? 'genetravels' : (isTechSpec ? 'technologyspecialist' : (sk || dom || 'default')));
    return {
      scopeKey: scopeKey,
      isBackstage: isBackstage,
      isGeneTravels: isGeneTravels,
      isTechSpec: isTechSpec,
      siteName: siteName || (isBackstage ? 'Backstage Images RI' : (isGeneTravels ? 'GeneTravels' : (isTechSpec ? 'Technology Specialist' : (dom || 'Brand Studio')))),
      domain: dom || (isBackstage ? 'backstageimagesri.com' : (isGeneTravels ? 'genetravels.com' : (isTechSpec ? 'technologyspecialist.org' : 'greentreehosting.com')))
    };`;

content = content.replace(targetScope.replace(/\r\n/g, '\n'), replScope);
content = content.replace(targetScope.replace(/\n/g, '\r\n'), replScope.replace(/\n/g, '\r\n'));

// 2. Update getScopedInitialFolders
const targetFolders = `    } else if (scope.isGeneTravels) {
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
    }`;

const replFolders = `${targetFolders} else if (scope.isTechSpec) {
      base.push(
        { id: 'techspec-masters', name: '🖥️ Technology Specialist Master Badges', icon: '🖥️', parentId: null, isSystem: true },
        { id: 'ts-rack-badges', name: 'Rack & Hardware Asset Tags', icon: '🏷️', parentId: 'techspec-masters' },
        { id: 'ts-zero-trust', name: 'Zero-Trust & CIS Security Seals', icon: '🛡️', parentId: 'techspec-masters' },
        { id: 'ts-motorsport', name: 'Sebring & TDX Motorsport Decals', icon: '🏎️', parentId: 'techspec-masters' }
      );
    }`;

content = content.replace(targetFolders.replace(/\r\n/g, '\n'), replFolders);
content = content.replace(targetFolders.replace(/\n/g, '\r\n'), replFolders.replace(/\n/g, '\r\n'));

// 3. Update getScopedInitialStickers
const targetStickers = `    if (scope.isGeneTravels) {
      return INITIAL_STICKERS.filter(function (s) { return s.isGeneTravels === true && !s.isJohnny; }).map(function (s, idx) {
        return Object.assign({}, s, { inPrintPack: idx < 10 });
      });
    }
    return [];`;

const replStickers = `    if (scope.isGeneTravels) {
      return INITIAL_STICKERS.filter(function (s) { return s.isGeneTravels === true && !s.isJohnny; }).map(function (s, idx) {
        return Object.assign({}, s, { inPrintPack: idx < 10 });
      });
    }
    if (scope.isTechSpec) {
      return [
        {
          id: 'ts-sticker-01',
          name: 'ENGINEERED BY TECHNOLOGY SPECIALIST // EST. 1990',
          imageUrl: '/images/logos/concept-01-hypervisor-blades-1200w.png',
          folderId: 'ts-rack-badges',
          concept: 'High-contrast industrial server rack badge with dual hypervisor blade icon and Est. 1990 heritage mark.',
          inPrintPack: true
        },
        {
          id: 'ts-sticker-02',
          name: 'ZERO-TRUST HARDENED // CIS LEVEL 2',
          imageUrl: '/images/logos/concept-04-rams-industrial-badge-1200w.png',
          folderId: 'ts-zero-trust',
          concept: 'Dieter Rams circular industrial hardware asset seal certified for CIS Benchmark Level 2 server lockdown.',
          inPrintPack: true
        },
        {
          id: 'ts-sticker-03',
          name: 'HYPERVISOR CLUSTER ACTIVE // ESXI + HYPER-V',
          imageUrl: '/images/logos/concept-05-dual-cluster-failover-1200w.png',
          folderId: 'ts-rack-badges',
          concept: 'Dual-node high-availability clustering and live vMotion failover badge for server chassis.',
          inPrintPack: true
        },
        {
          id: 'ts-sticker-04',
          name: 'USAF SECURITY POLICE VETERAN // OFFUTT AFB',
          imageUrl: '/images/logos/concept-02-swiss-circuit-monogram-1200w.png',
          folderId: 'ts-zero-trust',
          concept: 'Precision Swiss circuit monogram honoring Steve Cormiers United States Air Force Security Police service at Offutt AFB.',
          inPrintPack: true
        },
        {
          id: 'ts-sticker-05',
          name: 'SEBRING TRACK DAY XPERIENCE // LEAD INSTRUCTOR TELEMETRY',
          imageUrl: '/images/steve/steve-sebring-pitlane.jpg',
          folderId: 'ts-motorsport',
          concept: 'Sebring International Raceway pit-lane badge featuring Lead Instructor telemetry coaching credentials.',
          inPrintPack: true
        },
        {
          id: 'ts-sticker-06',
          name: 'ENTERPRISE FIBER TOPOLOGY // 10G/40G CORE FABRIC',
          imageUrl: '/images/logos/concept-03-fiber-topology-matrix-1200w.png',
          folderId: 'ts-rack-badges',
          concept: 'Optical fiber mesh topology badge for high-density core switching and SAN fabric cabinets.',
          inPrintPack: true
        },
        {
          id: 'ts-sticker-07',
          name: 'TECHNOLOGY SPECIALIST // INDUSTRIAL ASSET PLATE',
          imageUrl: '/images/logos/concept-06-minimal-architectural-wordmark-1200w.png',
          folderId: 'ts-rack-badges',
          concept: 'Die-cut brushed aluminum asset plate with architectural typography and Kissimmee Florida coordinates.',
          inPrintPack: true
        },
        {
          id: 'ts-sticker-08',
          name: 'ENTERPRISE AI READY // M365 COPILOT GOVERNED',
          imageUrl: '/images/schematics/ai-rag-copilot-pipeline.svg',
          folderId: 'ts-zero-trust',
          concept: 'Neural pipeline and SharePoint governance badge verifying M365 Copilot data readiness.',
          inPrintPack: true
        }
      ];
    }
    return [];`;

content = content.replace(targetStickers.replace(/\r\n/g, '\n'), replStickers);
content = content.replace(targetStickers.replace(/\n/g, '\r\n'), replStickers.replace(/\n/g, '\r\n'));

fs.writeFileSync(filePath, content, 'utf8');
fs.writeFileSync('dist/mod-sticker-studio-ui.js', content, 'utf8');
console.log('Successfully patched mod-sticker-studio-ui.js in public and dist!');
