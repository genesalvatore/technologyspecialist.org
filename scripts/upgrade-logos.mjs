import fs from 'node:fs';

['public/logos/index.html', 'dist/logos/index.html'].forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let html = fs.readFileSync(filePath, 'utf8');
  if (!html.includes('/mega-menu.js')) {
    html = html.replace('<script src="/logo-studio.js" defer></script>', '<script src="/logo-studio.js" defer></script>\n  <script src="/mega-menu.js" defer></script>');
  }
  
  const oldNav = `<nav class="hidden md:flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700">
          <a href="#vector-section" class="px-3 py-2 hover:text-brand-cobalt hover:bg-slate-50 transition-colors">Vector Systems (06)</a>
          <a href="#ai-section" class="px-3 py-2 hover:text-brand-cobalt hover:bg-slate-50 transition-colors">AI Studio (04)</a>
          <a href="#specs" class="px-3 py-2 hover:text-brand-cobalt hover:bg-slate-50 transition-colors">Design Specs</a>
          <a href="/" class="px-3 py-2 text-brand-cobalt hover:bg-slate-50 transition-colors font-extrabold">&larr; Return to Home</a>
        </nav>`;

  const newNav = `<nav class="hidden lg:flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700">
          <a href="/services" data-mm-trigger="services" class="px-3 py-2 hover:text-brand-cobalt hover:bg-slate-50 transition-colors flex items-center gap-1"><span>Practice Areas (10)</span><span class="text-[9px] text-slate-400">&darr;</span></a>
          <a href="/about" data-mm-trigger="company" class="px-3 py-2 hover:text-brand-cobalt hover:bg-slate-50 transition-colors flex items-center gap-1"><span>Leadership</span><span class="text-[9px] text-slate-400">&darr;</span></a>
          <a href="/tools" class="px-3 py-2 hover:text-brand-cobalt hover:bg-slate-50 transition-colors">Calculators (03)</a>
          <a href="/logos" class="px-3 py-2 text-brand-cobalt bg-blue-50/60 font-extrabold transition-colors">Logo Studio (10)</a>
          <a href="/contact" class="px-3 py-2 hover:text-brand-cobalt hover:bg-slate-50 transition-colors">Contact &amp; Dispatch</a>
          <a href="/admin/" class="px-3 py-2 text-slate-500 hover:text-brand-slate hover:bg-slate-50 transition-colors">Portal</a>
        </nav>`;

  if (html.includes(oldNav)) {
    html = html.replace(oldNav, newNav);
  }

  // Add mobile menu button if missing
  if (!html.includes('data-mobile-menu-btn')) {
    html = html.replace(
      '<div class="flex items-center gap-3">\n          <a href="tel:+14079175250" class="px-4 py-2 bg-brand-cobalt hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-sm transition-colors">\n            (407) 917-5250\n          </a>\n        </div>',
      '<div class="flex items-center gap-3">\n          <a href="tel:+14079175250" class="hidden sm:inline-flex px-4 py-2 bg-brand-cobalt hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-sm transition-colors">\n            (407) 917-5250\n          </a>\n          <button data-mobile-menu-btn class="lg:hidden p-2 text-slate-700 hover:text-brand-cobalt border border-brand-line bg-white">\n            <span class="sr-only">Open Menu</span>\n            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>\n          </button>\n        </div>'
    );
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Updated ' + filePath);
});
