import fs from 'node:fs';
import path from 'node:path';

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');

  // Add Calculators (03) link to nav if missing
  if (!html.includes('href="/tools"')) {
    html = html.replace(
      '<a href="/logos"',
      '<a href="/tools" class="px-2.5 py-2 hover:text-brand-cobalt hover:bg-slate-50 transition-colors">Calculators (03)</a>\n          <a href="/logos"'
    );
  }

  // Update telemetry strip if needed
  if (!html.includes('href="/tools"') && html.includes('LOGO STUDIO (10)')) {
    html = html.replace(
      '<a href="/logos"',
      '<a href="/tools" class="text-sky-300 hover:text-white transition-colors flex items-center gap-1.5 font-mono text-[10px] font-bold"><span class="w-1.5 h-1.5 bg-emerald-400 animate-pulse"></span>CALCULATORS (03)</a>\n          <a href="/logos"'
    );
  }

  fs.writeFileSync(filePath, html, 'utf8');
}

const dirs = ['public/services', 'dist/services'];
dirs.forEach(baseDir => {
  if (!fs.existsSync(baseDir)) return;
  updateFile(path.join(baseDir, 'index.html'));
  const entries = fs.readdirSync(baseDir, { withFileTypes: true });
  entries.forEach(entry => {
    if (entry.isDirectory()) {
      updateFile(path.join(baseDir, entry.name, 'index.html'));
    }
  });
});

console.log('Successfully injected /tools link across all service pages in public/ and dist/!');
