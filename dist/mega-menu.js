/**
 * Technology Specialist - Swiss Architectural Mega-Menu Runtime
 * STD-2026-BRAND-TECHSPEC-01 // Zero Em Dashes // Precision Hairline Grid
 */
(function() {
  'use strict';

  // Inject Mega-Menu CSS into <head>
  const style = document.createElement('style');
  style.id = 'ts-mega-menu-styles';
  style.textContent = `
    /* Global Mobile Viewport & Overflow Hardening */
    html, body {
      overflow-x: hidden !important;
      max-width: 100vw !important;
      width: 100% !important;
      position: relative;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    .ts-mm-panel {
      display: none;
      opacity: 0;
      transform: translateY(-4px);
      transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06);
    }
    .ts-mm-panel.is-active {
      display: block;
      opacity: 1;
      transform: translateY(0);
    }
    .ts-mm-link:hover .ts-mm-code {
      color: #0052CC;
    }
    .ts-mm-link:hover .ts-mm-title {
      color: #0052CC;
    }
    .ts-mm-backdrop {
      display: none;
    }
    .ts-mm-backdrop.is-active {
      display: block;
    }
    header > div:not(#ts-mega-menu-root) {
      position: relative;
      z-index: 50;
    }
    #ts-mm-backdrop {
      z-index: 40 !important;
    }
    #ts-mm-services, #ts-mm-company, #ts-mm-mobile {
      z-index: 50 !important;
    }
    @media (max-width: 639px) {
      #site-header-logo {
        max-width: 165px !important;
        height: 32px !important;
      }
      .ts-telemetry-hide-mobile {
        display: none !important;
      }
    }
    .overflow-x-auto {
      max-width: 100% !important;
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch;
    }
    table {
      max-width: 100%;
    }
  `;
  document.head.appendChild(style);

  const HAMBURGER_SVG = '<path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
  const CLOSE_SVG = '<path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';

  function updateHamburgerIcons(isOpen) {
    const buttons = document.querySelectorAll('[data-mobile-menu-btn], #mobile-menu-btn, .mobile-menu-btn, header button.lg\\:hidden');
    buttons.forEach(btn => {
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      btn.setAttribute('aria-label', isOpen ? 'Close Navigation Menu' : 'Open Navigation Menu');
      const svg = btn.querySelector('svg');
      if (svg) {
        svg.innerHTML = isOpen ? CLOSE_SVG : HAMBURGER_SVG;
      }
      const sr = btn.querySelector('.sr-only');
      if (sr) {
        sr.textContent = isOpen ? 'Close Menu' : 'Open Menu';
      }
    });
  }

  // Template for Mega-Menu Containers
  function initMegaMenu() {
    const header = document.querySelector('header');
    if (!header) return;

    // Check if already injected
    if (document.getElementById('ts-mega-menu-root')) return;

    if (!header.classList.contains('relative')) {
      header.classList.add('relative');
    }

    const root = document.createElement('div');
    root.id = 'ts-mega-menu-root';
    root.className = 'w-full';

    root.innerHTML = `
      <!-- Backdrop overlay -->
      <div id="ts-mm-backdrop" class="ts-mm-backdrop fixed inset-0 top-0 bg-slate-900/40 backdrop-blur-[2px] z-40"></div>

      <!-- 1. Practice Areas (10) Mega-Menu Panel -->
      <div id="ts-mm-services" class="ts-mm-panel absolute left-0 right-0 top-full w-full bg-white border-b border-brand-line z-50 shadow-2xl">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="hairline-grid bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            
            <!-- Col 1: Cloud, AI & Endpoint Governance -->
            <div class="p-5 hairline-b md:hairline-b-0 md:hairline-r flex flex-col justify-between">
              <div>
                <div class="font-mono text-[10px] font-bold text-brand-cobalt uppercase tracking-widest pb-3 mb-3 hairline-b flex items-center justify-between">
                  <span>01 // Cloud &amp; AI</span>
                  <span class="w-1.5 h-1.5 bg-brand-cobalt"></span>
                </div>
                <ul class="space-y-4">
                  <li>
                    <a href="/services/microsoft-365" class="ts-mm-link group block">
                      <div class="flex items-center gap-2">
                        <span class="ts-mm-code font-mono text-[10px] font-bold text-slate-500 group-hover:text-brand-cobalt">SYS-01</span>
                        <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate group-hover:text-brand-cobalt">Microsoft 365 Architecture</span>
                      </div>
                      <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">Tenant governance, Entra ID, DMARC p=reject, and Exchange Online.</p>
                    </a>
                  </li>
                  <li>
                    <a href="/services/ai-implementation" class="ts-mm-link group block bg-blue-50/50 p-2 border border-blue-100 -mx-2">
                      <div class="flex items-center justify-between">
                        <span class="ts-mm-code font-mono text-[10px] font-bold text-brand-cobalt">SYS-10</span>
                        <span class="px-1.5 py-0.5 bg-brand-cobalt text-white font-mono text-[9px] font-bold uppercase tracking-wider">NEW // AI</span>
                      </div>
                      <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate group-hover:text-brand-cobalt block mt-1">Enterprise AI &amp; Copilot</span>
                      <p class="font-mono text-[10px] text-slate-600 mt-1 leading-snug">Copilot data readiness, private RAG knowledge bases, and workflow automation.</p>
                    </a>
                  </li>
                  <li>
                    <a href="/services/mobile-device-management" class="ts-mm-link group block">
                      <div class="flex items-center gap-2">
                        <span class="ts-mm-code font-mono text-[10px] font-bold text-slate-500 group-hover:text-brand-cobalt">SYS-06</span>
                        <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate group-hover:text-brand-cobalt">Mobile Device Management</span>
                      </div>
                      <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">Intune compliance, MAM airlock wiping, iOS and Android endpoint policy.</p>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Col 2: Virtualization, Servers & Hardening -->
            <div class="p-5 hairline-b md:hairline-b-0 lg:hairline-r flex flex-col justify-between">
              <div>
                <div class="font-mono text-[10px] font-bold text-brand-cobalt uppercase tracking-widest pb-3 mb-3 hairline-b flex items-center justify-between">
                  <span>02 // Compute &amp; Hardening</span>
                  <span class="w-1.5 h-1.5 bg-brand-cobalt"></span>
                </div>
                <ul class="space-y-4">
                  <li>
                    <a href="/services/virtualization" class="ts-mm-link group block">
                      <div class="flex items-center gap-2">
                        <span class="ts-mm-code font-mono text-[10px] font-bold text-slate-500 group-hover:text-brand-cobalt">SYS-02</span>
                        <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate group-hover:text-brand-cobalt">Virtual Machines &amp; Servers</span>
                      </div>
                      <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">VMware ESXi 8.0, Windows Hyper-V clusters, SAN storage, and vMotion.</p>
                    </a>
                  </li>
                  <li>
                    <a href="/services/hardening" class="ts-mm-link group block">
                      <div class="flex items-center gap-2">
                        <span class="ts-mm-code font-mono text-[10px] font-bold text-slate-500 group-hover:text-brand-cobalt">SYS-03</span>
                        <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate group-hover:text-brand-cobalt">Server &amp; Network Hardening</span>
                      </div>
                      <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">CIS Level 2 benchmarks, East-West firewall rules, and immutable recovery.</p>
                    </a>
                  </li>
                  <li>
                    <a href="/services/remote-desktop" class="ts-mm-link group block">
                      <div class="flex items-center gap-2">
                        <span class="ts-mm-code font-mono text-[10px] font-bold text-slate-500 group-hover:text-brand-cobalt">SYS-07</span>
                        <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate group-hover:text-brand-cobalt">Remote Desktop Services</span>
                      </div>
                      <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">Secure RDS gateways, MFA broker integration, session host farms, and IPsec.</p>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Col 3: Network, VoIP & Field Engineering -->
            <div class="p-5 hairline-b md:hairline-b-0 md:hairline-r flex flex-col justify-between">
              <div>
                <div class="font-mono text-[10px] font-bold text-brand-cobalt uppercase tracking-widest pb-3 mb-3 hairline-b flex items-center justify-between">
                  <span>03 // Network &amp; Voice</span>
                  <span class="w-1.5 h-1.5 bg-brand-cobalt"></span>
                </div>
                <ul class="space-y-4">
                  <li>
                    <a href="/services/voip-ippbx" class="ts-mm-link group block">
                      <div class="flex items-center gap-2">
                        <span class="ts-mm-code font-mono text-[10px] font-bold text-slate-500 group-hover:text-brand-cobalt">SYS-04</span>
                        <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate group-hover:text-brand-cobalt">VoIP Phone Systems &amp; SIP</span>
                      </div>
                      <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">IP-PBX telephony, carrier SIP trunks, QoS DSCP priority, and E911 compliance.</p>
                    </a>
                  </li>
                  <li>
                    <a href="/services/network-management" class="ts-mm-link group block">
                      <div class="flex items-center gap-2">
                        <span class="ts-mm-code font-mono text-[10px] font-bold text-slate-500 group-hover:text-brand-cobalt">SYS-05</span>
                        <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate group-hover:text-brand-cobalt">Enterprise Network Mgmt</span>
                      </div>
                      <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">L2/L3 core switching, commercial Wi-Fi 6E/7, and WireGuard mesh tunnels.</p>
                    </a>
                  </li>
                  <li>
                    <a href="/services/onsite-support" class="ts-mm-link group block">
                      <div class="flex items-center gap-2">
                        <span class="ts-mm-code font-mono text-[10px] font-bold text-slate-500 group-hover:text-brand-cobalt">SYS-08</span>
                        <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate group-hover:text-brand-cobalt">Onsite Support &amp; Dispatch</span>
                      </div>
                      <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">Orlando &amp; Kissimmee emergency dispatch, rack elevation, structured cabling.</p>
                    </a>
                  </li>
                  <li>
                    <a href="/services/it-consultancy" class="ts-mm-link group block">
                      <div class="flex items-center gap-2">
                        <span class="ts-mm-code font-mono text-[10px] font-bold text-slate-500 group-hover:text-brand-cobalt">SYS-09</span>
                        <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate group-hover:text-brand-cobalt">IT Consultancy &amp; vCTO</span>
                      </div>
                      <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">Vendor auditing, infrastructure roadmaps, compliance, and principal advisory.</p>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Col 4: Executive Dispatch & Catalog Panel -->
            <div class="p-5 bg-slate-50 flex flex-col justify-between">
              <div>
                <div class="font-mono text-[10px] font-bold text-brand-slate uppercase tracking-widest pb-3 mb-3 hairline-b flex items-center justify-between">
                  <span>Catalog &amp; Dispatch</span>
                  <span class="text-emerald-600 font-extrabold">&bull; ACTIVE</span>
                </div>
                
                <div class="space-y-3 mb-6">
                  <div class="font-mono text-[11px] text-slate-600">
                    <strong class="text-brand-slate block">Steve Cormier</strong>
                    <span>Founder &amp; Principal Systems Architect</span>
                    <div class="text-[10px] text-slate-500 mt-0.5">Est. 1990 &bull; Central Florida</div>
                  </div>
                  <div class="font-mono text-[10px] text-slate-500 bg-white p-2.5 border border-brand-line space-y-1">
                    <div>&bull; Phone: <a href="tel:+14079175250" class="text-brand-cobalt font-bold hover:underline">(407) 917-5250</a></div>
                    <div>&bull; Onsite: Orlando / Kissimmee</div>
                    <div>&bull; SLA: 15-Min Critical Response</div>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <a href="/services" class="block w-full py-2.5 px-3 bg-white hover:bg-slate-100 text-brand-slate border border-brand-line text-center font-mono text-[11px] font-bold uppercase tracking-wider transition-colors">
                  View All 10 Services &rarr;
                </a>
                <a href="/contact" class="block w-full py-2.5 px-3 bg-brand-cobalt hover:bg-blue-700 text-white text-center font-mono text-[11px] font-bold uppercase tracking-wider transition-colors">
                  Dispatch Request &rarr;
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- 2. Company & Leadership Mega-Menu Panel -->
      <div id="ts-mm-company" class="ts-mm-panel absolute left-0 right-0 top-full w-full bg-white border-b border-brand-line z-50 shadow-2xl">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="hairline-grid bg-white grid grid-cols-1 md:grid-cols-12">
            
            <!-- Col 1: Steve Cormier & Pedigree (7 Cols) -->
            <div class="md:col-span-7 p-6 hairline-b md:hairline-b-0 md:hairline-r flex flex-col justify-between">
              <div>
                <div class="font-mono text-[10px] font-bold text-brand-cobalt uppercase tracking-widest pb-3 mb-4 hairline-b flex items-center justify-between">
                  <span>Executive Leadership &amp; Career Architecture</span>
                  <span class="font-mono text-[10px] text-slate-400">EST. 1990 // 36 YRS</span>
                </div>
                <div class="flex items-start gap-4">
                  <img src="/images/steve/steve-cormier-portrait.png" alt="Steve Cormier" class="w-16 h-16 object-cover border border-brand-line shrink-0" onerror="this.style.display='none';" />
                  <div>
                    <h3 class="font-heading text-base font-bold text-brand-slate">
                      <a href="/about" class="hover:text-brand-cobalt transition-colors">Steve Cormier</a>
                    </h3>
                    <p class="font-mono text-[11px] text-brand-cobalt font-bold">
                      Founder &amp; Principal Systems Architect | VP of Technical &amp; Customer Support
                    </p>
                    <p class="text-xs text-slate-600 mt-2 leading-relaxed">
                      Leading global technical support and healthcare escalation architecture at Sonitor since 2010. 36 years operating IT network design and virtualization in Orlando since 1990. U.S. Air Force Veteran (Security Police, Offutt AFB), Criminal Justice degree, Microsoft Certified, and Lead Instructor for Track Day Xperience (TDX) at Sebring International Raceway.
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 pt-4 hairline-t font-mono text-[10px] text-slate-600">
                  <div class="bg-slate-50 p-2 border border-brand-line">
                    <span class="text-brand-cobalt font-bold block">1990 - PRES</span>
                    Technology Specialist
                  </div>
                  <div class="bg-slate-50 p-2 border border-brand-line">
                    <span class="text-brand-cobalt font-bold block">2010 - PRES</span>
                    VP Support @ Sonitor
                  </div>
                  <div class="bg-slate-50 p-2 border border-brand-line">
                    <span class="text-brand-cobalt font-bold block">LEAD INSTR</span>
                    Track Day Xperience
                  </div>
                </div>
              </div>

              <div class="mt-4 pt-3 flex items-center justify-between">
                <a href="/about" class="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-brand-cobalt hover:underline uppercase">
                  Read Full Executive Biography &amp; Track Record &rarr;
                </a>
              </div>
            </div>

            <!-- Col 2: Directory & Tools (5 Cols) -->
            <div class="md:col-span-5 p-6 bg-slate-50 flex flex-col justify-between">
              <div>
                <div class="font-mono text-[10px] font-bold text-brand-slate uppercase tracking-widest pb-3 mb-4 hairline-b flex items-center justify-between">
                  <span>Operations &amp; Brand Systems</span>
                  <span class="w-1.5 h-1.5 bg-brand-slate"></span>
                </div>

                <div class="space-y-3">
                  <a href="/contact" class="block p-3 bg-white border border-brand-line hover:border-brand-cobalt transition-colors group">
                    <div class="font-heading text-xs font-bold text-brand-slate group-hover:text-brand-cobalt">Engineering Dispatch &amp; Contact</div>
                    <div class="font-mono text-[10px] text-slate-500 mt-0.5">Kissimmee / Orlando Onsite + Nationwide Remote Support. Direct phone: (407) 917-5250.</div>
                  </a>

                  <a href="/logos" class="block p-3 bg-white border border-brand-line hover:border-brand-cobalt transition-colors group">
                    <div class="flex items-center justify-between">
                      <span class="font-heading text-xs font-bold text-brand-slate group-hover:text-brand-cobalt">Brand Identity &amp; Logo Studio</span>
                      <span class="px-1.5 py-0.5 bg-blue-50 text-brand-cobalt font-mono text-[9px] font-bold">10 CONCEPTS</span>
                    </div>
                    <div class="font-mono text-[10px] text-slate-500 mt-0.5">Interactive vector and neural AI logo systems with live palette inspector.</div>
                  </a>

                  <a href="/admin/" class="block p-3 bg-white border border-brand-line hover:border-brand-cobalt transition-colors group">
                    <div class="font-heading text-xs font-bold text-brand-slate group-hover:text-brand-cobalt">Customer Command Center &amp; Portal</div>
                    <div class="font-mono text-[10px] text-slate-500 mt-0.5">Visual Pin Board, Site Tree Mega-Menu, and secure lead CRM management.</div>
                  </a>
                </div>
              </div>

              <div class="mt-4 pt-3 hairline-t font-mono text-[10px] text-slate-500 flex items-center justify-between">
                <span>Central Florida Regional Office</span>
                <span class="font-bold text-brand-slate">Kissimmee, FL 34741</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- 3. Mobile Navigation Drawer (Hidden on Desktop) -->
      <div id="ts-mm-mobile" class="ts-mm-panel absolute left-0 right-0 top-full w-full bg-white border-b border-brand-line z-50 lg:hidden max-h-[85vh] overflow-y-auto shadow-2xl">
        <div class="p-4 space-y-3 font-mono text-xs">
          <!-- Direct Phone Dispatch Strip -->
          <div class="flex items-center justify-between p-3 bg-brand-slate text-white border border-slate-800">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-2 h-2 bg-emerald-400 animate-pulse shrink-0"></span>
              <span class="text-[10px] font-bold tracking-wider uppercase">Direct Dispatch</span>
            </div>
            <a href="tel:+14079175250" class="text-sky-300 font-bold text-xs hover:text-white transition-colors">
              (407) 917-5250
            </a>
          </div>

          <!-- Navigation Links Matrix -->
          <div class="space-y-1">
            <a href="/" class="block px-3 py-2 bg-slate-50 text-brand-slate font-bold hover:bg-slate-100">Home</a>
            <a href="/about" class="block px-3 py-2 text-brand-slate font-bold hover:bg-slate-100">About Steve Cormier (Est. 1990)</a>
            
            <!-- Practice Areas Accordion / Group -->
            <div class="pt-1">
              <a href="/services" class="block px-3 py-2 bg-slate-100 text-brand-slate font-bold flex items-center justify-between">
                <span>All 10 Practice Areas</span>
                <span class="text-[10px] text-brand-cobalt uppercase font-bold">SYS-01 &ndash; SYS-10</span>
              </a>
              <div class="pl-2 pr-1 py-1 space-y-0.5 border-l-2 border-brand-line my-1 bg-slate-50/50">
                <a href="/services/microsoft-365" class="block py-1.5 px-2 text-[11px] text-slate-700 hover:text-brand-cobalt hover:bg-white"><span class="font-bold text-brand-cobalt">SYS-01</span> Microsoft 365 Architecture</a>
                <a href="/services/virtualization" class="block py-1.5 px-2 text-[11px] text-slate-700 hover:text-brand-cobalt hover:bg-white"><span class="font-bold text-brand-cobalt">SYS-02</span> Virtual Machines &amp; Servers</a>
                <a href="/services/hardening" class="block py-1.5 px-2 text-[11px] text-slate-700 hover:text-brand-cobalt hover:bg-white"><span class="font-bold text-brand-cobalt">SYS-03</span> Server &amp; Network Hardening</a>
                <a href="/services/voip-ippbx" class="block py-1.5 px-2 text-[11px] text-slate-700 hover:text-brand-cobalt hover:bg-white"><span class="font-bold text-brand-cobalt">SYS-04</span> VoIP Phone Systems &amp; SIP</a>
                <a href="/services/network-management" class="block py-1.5 px-2 text-[11px] text-slate-700 hover:text-brand-cobalt hover:bg-white"><span class="font-bold text-brand-cobalt">SYS-05</span> Enterprise Network Mgmt</a>
                <a href="/services/mobile-device-management" class="block py-1.5 px-2 text-[11px] text-slate-700 hover:text-brand-cobalt hover:bg-white"><span class="font-bold text-brand-cobalt">SYS-06</span> Mobile Device Management</a>
                <a href="/services/remote-desktop" class="block py-1.5 px-2 text-[11px] text-slate-700 hover:text-brand-cobalt hover:bg-white"><span class="font-bold text-brand-cobalt">SYS-07</span> Remote Desktop Services</a>
                <a href="/services/onsite-support" class="block py-1.5 px-2 text-[11px] text-slate-700 hover:text-brand-cobalt hover:bg-white"><span class="font-bold text-brand-cobalt">SYS-08</span> Onsite Support &amp; Dispatch</a>
                <a href="/services/it-consultancy" class="block py-1.5 px-2 text-[11px] text-slate-700 hover:text-brand-cobalt hover:bg-white"><span class="font-bold text-brand-cobalt">SYS-09</span> IT Consultancy &amp; vCTO</a>
                <a href="/services/ai-implementation" class="block py-1.5 px-2 text-[11px] text-brand-cobalt font-bold bg-blue-50 border border-blue-200"><span class="font-bold text-brand-cobalt">SYS-10</span> Enterprise AI &amp; Copilot (NEW)</a>
              </div>
            </div>

            <a href="/tools" class="block px-3 py-2 text-brand-slate font-bold hover:bg-slate-100 flex items-center justify-between">
              <span>Calculators (03)</span>
              <span class="text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold uppercase">ROI &amp; Cloud</span>
            </a>
            <a href="/logos" class="block px-3 py-2 text-brand-slate font-bold hover:bg-slate-100 flex items-center justify-between">
              <span>Brand Identity &amp; Logo Studio (10)</span>
              <span class="text-[9px] px-1.5 py-0.5 bg-blue-100 text-brand-cobalt font-bold uppercase">10 Concepts</span>
            </a>
            <a href="/admin/" class="block px-3 py-2 text-slate-600 hover:text-brand-slate hover:bg-slate-100 flex items-center justify-between">
              <span>Customer Portal &amp; Command Center</span>
              <span class="text-[9px] text-slate-400 uppercase">&rarr;</span>
            </a>
            <a href="/contact" class="block px-3 py-3 bg-brand-cobalt hover:bg-blue-700 text-white font-bold text-center uppercase tracking-wider shadow-sm transition-colors mt-2">
              Request Dispatch &amp; Contact &rarr;
            </a>
          </div>
        </div>
      </div>
    `;

    // Append root directly inside header
    header.appendChild(root);

    // Setup interactive triggers
    setupTriggers();
  }

  function setupTriggers() {
    const servicesPanel = document.getElementById('ts-mm-services');
    const companyPanel = document.getElementById('ts-mm-company');
    const mobilePanel = document.getElementById('ts-mm-mobile');
    const backdrop = document.getElementById('ts-mm-backdrop');

    let closeTimer = null;

    function openPanel(panel) {
      if (closeTimer) clearTimeout(closeTimer);
      [servicesPanel, companyPanel, mobilePanel].forEach(p => {
        if (p && p !== panel) p.classList.remove('is-active');
      });
      if (panel) {
        panel.classList.add('is-active');
        if (backdrop) backdrop.classList.add('is-active');
        if (panel === mobilePanel) {
          updateHamburgerIcons(true);
        }
      }
    }

    function closeAllPanels() {
      if (closeTimer) clearTimeout(closeTimer);
      [servicesPanel, companyPanel, mobilePanel].forEach(p => {
        if (p) p.classList.remove('is-active');
      });
      if (backdrop) backdrop.classList.remove('is-active');
      updateHamburgerIcons(false);
    }

    if (backdrop) {
      backdrop.addEventListener('click', closeAllPanels);
      backdrop.addEventListener('touchend', (e) => {
        e.preventDefault();
        closeAllPanels();
      });
    }

    // Keep desktop panels open when hovering inside them
    [servicesPanel, companyPanel].forEach(panel => {
      if (!panel) return;
      panel.addEventListener('mouseenter', () => {
        if (closeTimer) clearTimeout(closeTimer);
      });
      panel.addEventListener('mouseleave', () => {
        closeAllPanels();
      });
    });

    // Close panel on link click inside mobile drawer
    if (mobilePanel) {
      mobilePanel.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link) {
          closeAllPanels();
        }
      });
    }

    // Desktop hover triggers for Practice Areas and About/Leadership
    const allLinks = document.querySelectorAll('header nav a, [data-mm-trigger]');
    allLinks.forEach(link => {
      const text = (link.textContent || '').trim().toUpperCase();
      const href = link.getAttribute('href') || '';

      if (link.dataset.mmTrigger === 'services' || text.includes('PRACTICE') || text.includes('SERVICES')) {
        link.addEventListener('mouseenter', () => {
          if (window.innerWidth >= 1024) openPanel(servicesPanel);
        });
        link.addEventListener('click', (e) => {
          if (window.innerWidth >= 1024) {
            e.preventDefault();
            servicesPanel && servicesPanel.classList.contains('is-active') ? closeAllPanels() : openPanel(servicesPanel);
          }
        });
      } else if (link.dataset.mmTrigger === 'company' || text.includes('ABOUT') || text.includes('LEADERSHIP') || text.includes('COMPANY') || text.includes('SINCE 1990') || text.includes('HERITAGE')) {
        link.addEventListener('mouseenter', () => {
          if (window.innerWidth >= 1024) openPanel(companyPanel);
        });
        link.addEventListener('click', (e) => {
          if (window.innerWidth >= 1024 && href === '#heritage') {
            e.preventDefault();
            companyPanel && companyPanel.classList.contains('is-active') ? closeAllPanels() : openPanel(companyPanel);
          }
        });
      } else {
        link.addEventListener('mouseenter', () => {
          if (window.innerWidth >= 1024) closeAllPanels();
        });
      }
    });

    // Universal Mobile Hamburger button handler with event delegation and debounce
    let lastToggleTime = 0;
    function handleMobileToggle(e) {
      const btn = e.target.closest('[data-mobile-menu-btn], #mobile-menu-btn, .mobile-menu-btn, header button.lg\\:hidden');
      if (!btn) return;
      const now = Date.now();
      if (now - lastToggleTime < 250) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      lastToggleTime = now;
      e.preventDefault();
      e.stopPropagation();

      if (mobilePanel) {
        if (mobilePanel.classList.contains('is-active')) {
          closeAllPanels();
        } else {
          openPanel(mobilePanel);
        }
      }
    }

    document.addEventListener('click', handleMobileToggle);
    document.addEventListener('touchend', handleMobileToggle, { passive: false });

    // Keyboard navigation (Escape key closes)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeAllPanels();
      }
    });

    // Close mobile panel on desktop breakpoint resize
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && mobilePanel && mobilePanel.classList.contains('is-active')) {
        closeAllPanels();
      }
    });
  }

  // Self-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMegaMenu);
  } else {
    initMegaMenu();
  }

  // Export to global window for programmatic access
  window.TS_MEGA_MENU = {
    init: initMegaMenu
  };
})();
