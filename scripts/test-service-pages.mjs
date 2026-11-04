import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const baseDirs = [
  path.join(rootDir, 'public'),
  path.join(rootDir, 'dist')
];

const slugs = [
  '',
  'microsoft-365',
  'virtualization',
  'hardening',
  'voip-ippbx',
  'network-management',
  'mobile-device-management',
  'remote-desktop',
  'onsite-support',
  'it-consultancy',
  'ai-implementation'
];

let errors = 0;

for (const base of baseDirs) {
  for (const slug of slugs) {
    const pagePath = slug === '' 
      ? path.join(base, 'services', 'index.html')
      : path.join(base, 'services', slug, 'index.html');

    if (!fs.existsSync(pagePath)) {
      console.error('MISSING FILE:', pagePath);
      errors++;
      continue;
    }

    const content = fs.readFileSync(pagePath, 'utf8');

    // 1. Check for em dashes
    if (content.includes('—')) {
      console.error('EM DASH FOUND IN:', pagePath);
      errors++;
    }

    // 2. Check for required scripts
    if (!content.includes('src="/logo-studio.js"')) {
      console.error('MISSING logo-studio.js in:', pagePath);
      errors++;
    }
    if (!content.includes('src="/mega-menu.js"')) {
      console.error('MISSING mega-menu.js in:', pagePath);
      errors++;
    }

    // 3. Check for TDX Sebring credential
    if (!content.includes('Track Day Xperience') && !content.includes('TDX')) {
      console.error('MISSING Track Day Xperience in:', pagePath);
      errors++;
    }

    // 4. Check for Air Force veteran
    if (!content.includes('Air Force Veteran') && !content.includes('Air Force veteran')) {
      console.error('MISSING Air Force in:', pagePath);
      errors++;
    }

    // 5. Check for phone number
    if (!content.includes('407) 917-5250')) {
      console.error('MISSING phone number in:', pagePath);
      errors++;
    }

    // 6. Check schematics referenced
    const svgMatches = content.match(/src="(\/images\/schematics\/[^"]+)"/g) || [];
    for (const m of svgMatches) {
      const rel = m.replace('src="', '').replace('"', '');
      const diskPath = path.join(base, rel.replace(/^\//, ''));
      if (!fs.existsSync(diskPath)) {
        console.error('MISSING REFERENCED SVG:', diskPath, 'from', pagePath);
        errors++;
      }
    }
  }
}

if (errors === 0) {
  console.log('SUCCESS: All 22 HTML files (11 in public, 11 in dist) passed 100% of architectural tests!');
} else {
  console.error(`Found ${errors} errors.`);
  process.exit(1);
}
