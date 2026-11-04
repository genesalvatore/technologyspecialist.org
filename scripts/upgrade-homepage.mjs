import fs from 'node:fs';
import path from 'node:path';

const indexPath = path.join(process.cwd(), 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Script in head
if (!html.includes('/mega-menu.js')) {
  html = html.replace(
    '<script src="/logo-studio.js" defer></script>',
    '<script src="/logo-studio.js" defer></script>\n  <script src="/mega-menu.js" defer></script>'
  );
}

// 2. Telemetry strip
const oldTelem = `<a href="#logo-studio" onclick="window.TS_LOGO_STUDIO?.openModal(); return false;" class="text-sky-300 hover:text-white transition-colors flex items-center gap-1.5 font-mono text-[10px] font-bold"><span class="w-1.5 h-1.5 bg-emerald-400 animate-pulse"></span>LOGO STUDIO (10)</a>`;
const newTelem = `<a href="/tools" class="text-sky-300 hover:text-white transition-colors flex items-center gap-1.5 font-mono text-[10px] font-bold"><span class="w-1.5 h-1.5 bg-emerald-400 animate-pulse"></span>CALCULATORS (03)</a>
          <a href="/logos" class="text-sky-300 hover:text-white transition-colors flex items-center gap-1.5 font-mono text-[10px] font-bold">LOGO STUDIO (10)</a>`;
html = html.replace(oldTelem, newTelem);

// 3. Main desktop nav
const oldNav = `<nav class="hidden lg:flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700">
          <a href="#matrix" class="px-3 py-2 hover:text-brand-cobalt hover:bg-slate-50 transition-colors">Practice Matrix (09)</a>
          <a href="#inspector" class="px-3 py-2 hover:text-brand-cobalt hover:bg-slate-50 transition-colors">Hypervisor Inspector</a>
          <a href="#triage" class="px-3 py-2 hover:text-brand-cobalt hover:bg-slate-50 transition-colors">Architecture Triage</a>
          <a href="#heritage" class="px-3 py-2 hover:text-brand-cobalt hover:bg-slate-50 transition-colors">Since 1990</a>
          <a href="/logos" class="px-3 py-2 text-brand-cobalt hover:text-blue-700 hover:bg-blue-50 font-bold transition-colors">Logo Studio (10)</a>
          <a href="/admin/" class="px-3 py-2 text-slate-500 hover:text-brand-slate hover:bg-slate-50 transition-colors">Portal</a>
        </nav>`;

const newNav = `<nav class="hidden lg:flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700">
          <a href="/services" data-mm-trigger="services" class="px-3 py-2 hover:text-brand-cobalt hover:bg-slate-50 transition-colors flex items-center gap-1"><span>Practice Areas (10)</span><span class="text-[9px] text-slate-400">&darr;</span></a>
          <a href="/about" data-mm-trigger="company" class="px-3 py-2 hover:text-brand-cobalt hover:bg-slate-50 transition-colors flex items-center gap-1"><span>Leadership</span><span class="text-[9px] text-slate-400">&darr;</span></a>
          <a href="/tools" class="px-3 py-2 hover:text-brand-cobalt hover:bg-slate-50 transition-colors">Calculators (03)</a>
          <a href="/logos" class="px-3 py-2 hover:text-brand-cobalt hover:bg-slate-50 transition-colors">Logo Studio (10)</a>
          <a href="/contact" class="px-3 py-2 hover:text-brand-cobalt hover:bg-slate-50 transition-colors">Contact &amp; Dispatch</a>
          <a href="/admin/" class="px-3 py-2 text-slate-500 hover:text-brand-slate hover:bg-slate-50 transition-colors">Portal</a>
        </nav>`;
html = html.replace(oldNav, newNav);

// 4. Header action CTA with mobile button
const oldAction = `<div class="flex items-center gap-3">
          <a href="tel:+14079175250" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 border border-brand-line bg-white hover:bg-slate-50 font-mono text-xs font-bold text-brand-slate transition-colors">
            <span>(407) 917-5250</span>
          </a>
          <a href="#triage" class="px-4 py-2.5 bg-brand-cobalt hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-sm transition-colors">
            Request Engineering Support
          </a>
        </div>`;

const newAction = `<div class="flex items-center gap-3">
          <a href="tel:+14079175250" class="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 border border-brand-line bg-white hover:bg-slate-50 font-mono text-xs font-bold text-brand-slate transition-colors">
            <span>(407) 917-5250</span>
          </a>
          <a href="/contact" class="px-4 py-2.5 bg-brand-cobalt hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-sm transition-colors">
            Request Dispatch
          </a>
          <button data-mobile-menu-btn class="lg:hidden p-2 text-slate-700 hover:text-brand-cobalt border border-brand-line bg-white">
            <span class="sr-only">Open Menu</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>`;
html = html.replace(oldAction, newAction);

// 5. Hero button updates
html = html.replace(
  'href="#triage" class="px-6 py-3.5 bg-brand-cobalt hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider shadow transition-colors flex items-center gap-2"',
  'href="/contact" class="px-6 py-3.5 bg-brand-cobalt hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider shadow transition-colors flex items-center gap-2"'
);

// 6. Practice Matrix header
html = html.replace(
  'The 9 Enterprise Systems Disciplines',
  'The 10 Enterprise Systems Disciplines'
);
html = html.replace(
  'SYS-01 THROUGH SYS-09 &bull; EXPAND ANY DISCIPLINE FOR PROTOCOL SPECS',
  'SYS-01 THROUGH SYS-10 &bull; EXPAND ANY DISCIPLINE FOR PROTOCOL SPECS'
);

// 7. Add dedicated page buttons to Practice Matrix cards
const servicePages = [
  { id: 'drawer-01', code: 'SYS-01', slug: 'microsoft-365' },
  { id: 'drawer-02', code: 'SYS-02', slug: 'virtualization' },
  { id: 'drawer-03', code: 'SYS-03', slug: 'hardening' },
  { id: 'drawer-04', code: 'SYS-04', slug: 'voip-ippbx' },
  { id: 'drawer-05', code: 'SYS-05', slug: 'network-management' },
  { id: 'drawer-06', code: 'SYS-06', slug: 'mobile-device-management' },
  { id: 'drawer-07', code: 'SYS-07', slug: 'remote-desktop' },
  { id: 'drawer-08', code: 'SYS-08', slug: 'onsite-support' },
  { id: 'drawer-09', code: 'SYS-09', slug: 'it-consultancy' }
];

servicePages.forEach(sp => {
  const targetClosing = `</div>\n        </div>\n      </div>`; // at end of each card
  // Let's find each drawer's closing div and add the link
  const drawerEnd = `</div>\n      </div>\n\n      <!-- ${sp.code}`;
  const linkHtml = `<div class="mt-2 pt-2 border-t border-brand-line">
            <a href="/services/${sp.slug}" class="block w-full py-1.5 bg-slate-100 hover:bg-brand-cobalt hover:text-white text-brand-slate text-center font-mono text-[10px] font-bold uppercase tracking-wider transition-colors">
              Dedicated ${sp.code} Page &rarr;
            </a>
          </div>\n        </div>\n      </div>\n\n      <!-- ${sp.code}`;
  // replace if matches
  if (html.includes(drawerEnd)) {
    html = html.replace(drawerEnd, linkHtml);
  }
});

// For SYS-09 (last before grid ends):
const sys09Drawer = `<div id="drawer-09" class="spec-drawer-content font-mono text-[10px] text-slate-600 mt-2 bg-slate-50 p-3 border border-brand-line space-y-1.5">
          <div class="font-bold text-brand-slate uppercase">Protocols &amp; Platforms:</div>
          <div>&bull; SOC 2 Type II, HIPAA Security Rule, and NIST 800-171 gap assessments</div>
          <div>&bull; vCTO quarterly executive steering and multi-year budget models</div>
          <div>&bull; Vendor SLA negotiation, telecom carrier RFP defense, and audit logging</div>
          <div>&bull; Mergers &amp; acquisitions IT due diligence and systems consolidation</div>
          <div>&bull; Cloud vs. on-premises total cost of ownership (TCO) modeling</div>
        </div>
      </div>

    </div>
  </section>`;

const sys09WithLinkAndSys10 = `<div id="drawer-09" class="spec-drawer-content font-mono text-[10px] text-slate-600 mt-2 bg-slate-50 p-3 border border-brand-line space-y-1.5">
          <div class="font-bold text-brand-slate uppercase">Protocols &amp; Platforms:</div>
          <div>&bull; SOC 2 Type II, HIPAA Security Rule, and NIST 800-171 gap assessments</div>
          <div>&bull; vCTO quarterly executive steering and multi-year budget models</div>
          <div>&bull; Vendor SLA negotiation, telecom carrier RFP defense, and audit logging</div>
          <div>&bull; Mergers &amp; acquisitions IT due diligence and systems consolidation</div>
          <div>&bull; Cloud vs. on-premises total cost of ownership (TCO) modeling</div>
        </div>
        <div class="mt-2 pt-2 border-t border-brand-line">
          <a href="/services/it-consultancy" class="block w-full py-1.5 bg-slate-100 hover:bg-brand-cobalt hover:text-white text-brand-slate text-center font-mono text-[10px] font-bold uppercase tracking-wider transition-colors">
            Dedicated SYS-09 Page &rarr;
          </a>
        </div>
      </div>

      <!-- SYS-10: Enterprise AI Implementation & Copilot Governance -->
      <div class="p-6 md:col-span-2 lg:col-span-3 bg-blue-50/40 hairline-t flex flex-col justify-between hover:bg-blue-50/70 transition-colors">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div class="lg:col-span-7">
            <div class="flex items-center gap-2 font-mono text-[10px] font-bold mb-2">
              <span class="text-brand-cobalt">SYS-10 // AI-IMPLEMENTATION</span>
              <span class="bg-brand-cobalt text-white px-2 py-0.5">NEW DISCIPLINE</span>
            </div>
            <h3 class="font-heading text-xl font-bold text-brand-slate mb-2">
              Enterprise AI Implementation, Copilot Governance &amp; Workflow Automation
            </h3>
            <p class="text-xs text-slate-600 leading-relaxed mb-4">
              Microsoft 365 Copilot data readiness and SharePoint permission ACL audits, private RAG vector knowledge bases, automated helpdesk ticket triage, and sovereign security guardrails ensuring enterprise data never leaks into public LLM training sets.
            </p>
            <div class="font-mono text-[10px] text-slate-500 space-y-1 bg-white p-2.5 border border-brand-line">
              <div>&bull; READINESS: SharePoint / OneDrive ACL permission scrubbing before Copilot indexation</div>
              <div>&bull; ARCHITECTURE: Private local vector databases (pgvector) and hybrid on-prem RAG pipelines</div>
              <div>&bull; AUTOMATION: Autonomous tier-1 support routing, webhook telemetry, and runbook bots</div>
            </div>
          </div>
          <div class="lg:col-span-5 flex flex-col justify-between h-full space-y-3">
            <div class="p-3 bg-white border border-brand-line font-mono text-[11px] space-y-1.5">
              <div class="font-bold text-brand-slate uppercase text-[10px]">AI Implementation Scope:</div>
              <div>&bull; Microsoft 365 Copilot Licensing &amp; Scoping</div>
              <div>&bull; Private RAG Knowledge Bases</div>
              <div>&bull; Zero-Data-Retention Security Boundaries</div>
            </div>
            <div class="flex flex-col sm:flex-row gap-2">
              <a href="/services/ai-implementation" class="flex-1 py-2.5 bg-brand-cobalt hover:bg-blue-700 text-white text-center font-mono text-xs font-bold uppercase tracking-wider transition-colors">
                Dedicated SYS-10 Page &rarr;
              </a>
              <a href="/tools#calc-audit" class="flex-1 py-2.5 bg-white hover:bg-slate-50 border border-brand-line text-brand-slate text-center font-mono text-xs font-bold uppercase tracking-wider transition-colors">
                60-Sec AI Audit &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>`;

if (html.includes(sys09Drawer)) {
  html = html.replace(sys09Drawer, sys09WithLinkAndSys10);
}

// 8. Insert Executive Principal Spotlight right before Section 4 (Heritage)
const spotlightHtml = `  <!-- ===================================================================== -->
  <!-- 3.5 EXECUTIVE PRINCIPAL SPOTLIGHT (STEVE CORMIER)                     -->
  <!-- ===================================================================== -->
  <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="hairline-grid bg-white shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0">
      
      <!-- Photo Column (4 Cols) -->
      <div class="lg:col-span-4 p-6 sm:p-8 bg-slate-50 hairline-b lg:hairline-b-0 lg:hairline-r flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-3 font-mono text-[10px] text-slate-500 pb-2 hairline-b">
            <span>PRINCIPAL SPOTLIGHT</span>
            <span class="text-brand-cobalt font-bold">EST. 1990</span>
          </div>
          <div class="bg-white p-2 border border-brand-line shadow-sm">
            <img src="/images/steve/steve-cormier-portrait.png" alt="Steve Cormier" class="w-full h-auto object-cover border border-slate-200" />
            <div class="mt-2.5 pt-2 hairline-t flex items-center justify-between font-mono text-[10px] text-slate-500">
              <span class="font-bold text-brand-slate">STEVE CORMIER</span>
              <span>ORLANDO / KISSIMMEE</span>
            </div>
          </div>
          
          <div class="mt-4 space-y-1.5 font-mono text-[11px]">
            <div class="bg-white p-2 border border-brand-line flex items-center justify-between">
              <span class="text-slate-500 text-[10px]">PRACTICE:</span>
              <span class="font-bold text-brand-slate">Founder (1990 - Pres.)</span>
            </div>
            <div class="bg-white p-2 border border-brand-line flex items-center justify-between">
              <span class="text-slate-500 text-[10px]">SONITOR:</span>
              <span class="font-bold text-brand-cobalt">VP Support (2010 - Pres.)</span>
            </div>
            <div class="bg-white p-2 border border-brand-line flex items-center justify-between">
              <span class="text-slate-500 text-[10px]">MOTORSPORT:</span>
              <span class="font-bold text-slate-800">Lead Instructor TDX</span>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-3 hairline-t">
          <a href="/about" class="block w-full py-2 bg-slate-100 hover:bg-slate-200 text-brand-slate text-center font-mono text-xs font-bold uppercase tracking-wider transition-colors">
            View Full Biography &rarr;
          </a>
        </div>
      </div>

      <!-- Credentials & Narrative Column (8 Cols) -->
      <div class="lg:col-span-8 p-6 sm:p-10 flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-2 mb-3">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 font-mono text-[10px] font-bold text-brand-cobalt uppercase tracking-widest">
              <span class="w-1.5 h-1.5 bg-brand-cobalt"></span>
              EXECUTIVE LEADERSHIP &bull; DIRECT PRINCIPAL ENGINEERING
            </span>
          </div>

          <h2 class="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-brand-slate mb-2">
            Steve Cormier
          </h2>
          <p class="font-heading text-base sm:text-lg text-brand-cobalt font-semibold mb-4">
            Founder &amp; Principal Systems Architect, Technology Specialist<br />
            Vice President, Technical &amp; Customer Support at Sonitor Technologies
          </p>

          <div class="p-3 bg-slate-50 border border-brand-line mb-5 font-mono text-xs text-slate-600 flex flex-wrap items-center gap-2">
            <span class="px-2 py-0.5 bg-white border border-brand-line font-bold text-brand-slate">U.S. Air Force Veteran</span>
            <span class="px-2 py-0.5 bg-white border border-brand-line font-bold text-brand-slate">Microsoft Certified</span>
            <span class="px-2 py-0.5 bg-white border border-brand-line font-bold text-brand-slate">B.S. Criminal Justice</span>
            <span class="px-2 py-0.5 bg-white border border-brand-line font-bold text-brand-cobalt">Lead Instructor, Track Day Xperience (TDX)</span>
          </div>

          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
            Steve Cormier has led support at Sonitor since 2010, first as Director of Support and now as Vice President, Technical &amp; Customer Support. He built a complete global support organization, diagnostic tooling, and escalation processes supporting major healthcare providers as their highest-level technical resource and final point of escalation.
          </p>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
            Before Sonitor, Steve served on active duty in the U.S. Air Force Security Police at Offutt Air Force Base in Nebraska. Since 1990, he has operated his own IT network design, server virtualization (VMware ESXi and Windows Hyper-V), and support business for Orlando and Central Florida organizations. Off the clock, Steve is the Lead Instructor for Track Day Xperience (TDX) at Sebring International Raceway, bringing track-tested telemetry precision to enterprise systems architecture.
          </p>
        </div>

        <div class="mt-6 pt-5 hairline-t flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <a href="/about" class="px-5 py-2.5 bg-brand-cobalt hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors">
              Read Full Executive Biography &rarr;
            </a>
            <a href="/contact" class="px-5 py-2.5 bg-slate-50 hover:bg-white text-brand-slate border border-brand-line font-mono text-xs font-bold uppercase tracking-wider transition-colors">
              Consult with Steve &rarr;
            </a>
          </div>
          <div class="font-mono text-xs text-slate-500">
            Direct Line: <strong class="text-brand-slate">(407) 917-5250</strong>
          </div>
        </div>
      </div>

    </div>
  </section>

`;

const heritageComment = '<!-- ===================================================================== -->\n  <!-- 4. HERITAGE & PRINCIPAL SYSTEMS ENGINEERING ("SINCE 1990")            -->';
if (html.includes(heritageComment)) {
  html = html.replace(heritageComment, spotlightHtml + heritageComment);
}

// 9. Update Footer links
html = html.replace(
  '<li><a href="#matrix" class="hover:text-brand-cobalt">SYS-01: Microsoft 365 &amp; Entra ID</a></li>',
  '<li><a href="/services/microsoft-365" class="hover:text-brand-cobalt">SYS-01: Microsoft 365 &amp; Entra ID</a></li>'
);
html = html.replace(
  '<li><a href="#matrix" class="hover:text-brand-cobalt">SYS-02: VMware ESXi &amp; Hyper-V</a></li>',
  '<li><a href="/services/virtualization" class="hover:text-brand-cobalt">SYS-02: VMware ESXi &amp; Hyper-V</a></li>'
);
html = html.replace(
  '<li><a href="#matrix" class="hover:text-brand-cobalt">SYS-03: Server &amp; Network Hardening</a></li>',
  '<li><a href="/services/hardening" class="hover:text-brand-cobalt">SYS-03: Server &amp; Network Hardening</a></li>'
);
html = html.replace(
  '<li><a href="#matrix" class="hover:text-brand-cobalt">SYS-04: VoIP &amp; SIP Trunking</a></li>',
  '<li><a href="/services/voip-ippbx" class="hover:text-brand-cobalt">SYS-04: VoIP &amp; SIP Trunking</a></li>'
);
html = html.replace(
  '<li><a href="#matrix" class="hover:text-brand-cobalt">SYS-05: Enterprise L2/L3 Network</a></li>',
  '<li><a href="/services/network-management" class="hover:text-brand-cobalt">SYS-05: Enterprise L2/L3 Network</a></li>'
);
html = html.replace(
  '<li><a href="#matrix" class="hover:text-brand-cobalt">SYS-06: Mobile Device Management</a></li>',
  '<li><a href="/services/mobile-device-management" class="hover:text-brand-cobalt">SYS-06: Mobile Device Management</a></li>'
);
html = html.replace(
  '<li><a href="#matrix" class="hover:text-brand-cobalt">SYS-07: Remote Desktop Farms</a></li>',
  '<li><a href="/services/remote-desktop" class="hover:text-brand-cobalt">SYS-07: Remote Desktop Farms</a></li>'
);
html = html.replace(
  '<li><a href="#matrix" class="hover:text-brand-cobalt">SYS-08: Onsite Central FL Support</a></li>',
  '<li><a href="/services/onsite-support" class="hover:text-brand-cobalt">SYS-08: Onsite Central FL Support</a></li>'
);
html = html.replace(
  '<li><a href="#matrix" class="hover:text-brand-cobalt">SYS-09: Principal IT Consultancy</a></li>',
  '<li><a href="/services/it-consultancy" class="hover:text-brand-cobalt">SYS-09: Principal IT Consultancy</a></li>\n            <li><a href="/services/ai-implementation" class="hover:text-brand-cobalt font-bold text-brand-cobalt">SYS-10: Enterprise AI &amp; Copilot</a></li>'
);
html = html.replace(
  '<li><a href="#triage" class="hover:text-brand-cobalt text-brand-cobalt font-bold">&bull; Infrastructure Triage</a></li>',
  '<li><a href="/tools" class="hover:text-brand-cobalt text-sky-600 font-bold">&bull; Engineering Calculators (03)</a></li>\n            <li><a href="/about" class="hover:text-brand-cobalt">&bull; About Steve Cormier (Est. 1990)</a></li>\n            <li><a href="/contact" class="hover:text-brand-cobalt text-brand-cobalt font-bold">&bull; Dispatch &amp; Consultation</a></li>'
);

// Save to root index.html, public/index.html and dist/index.html
fs.writeFileSync('index.html', html, 'utf8');
fs.mkdirSync('public', { recursive: true });
fs.writeFileSync('public/index.html', html, 'utf8');
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/index.html', html, 'utf8');

console.log('Successfully upgraded homepage index.html across root, public, and dist!');
