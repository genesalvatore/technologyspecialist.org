/**
 * Technology Specialist - Swiss Architectural Mega-Menu Runtime
 * STD-2026-BRAND-TECHSPEC-01 // Zero Em Dashes // Precision Hairline Grid
 * DEC-004 Anti-Slop Voice // DEC-007 Strict Corporate Isolation
 */
(function() {
  'use strict';

  // 1. Inject Mega-Menu CSS into <head>
  const style = document.createElement('style');
  style.id = 'ts-mega-menu-styles';
  style.textContent = `
    /* Viewport & Body Overflow Hardening (clip preserves position: sticky) */
    html, body {
      overflow-x: clip !important;
      max-width: 100vw !important;
      width: 100% !important;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }

    /* Enforce Sticky Header Positioning */
    header {
      position: -webkit-sticky !important;
      position: sticky !important;
      top: 0 !important;
      z-index: 50 !important;
    }
    header > div:not(#ts-mega-menu-root) {
      position: relative;
      z-index: 50;
    }
    #ts-mega-menu-root {
      position: static;
      width: 100%;
    }

    /* Fixed Viewport Backdrop (appended to document.body) */
    #ts-mm-backdrop {
      position: fixed !important;
      inset: 0 !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 40 !important;
      background-color: rgba(15, 23, 42, 0.45);
      -webkit-backdrop-filter: blur(2px);
      backdrop-filter: blur(2px);
      visibility: hidden;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    #ts-mm-backdrop.is-active {
      visibility: visible !important;
      opacity: 1 !important;
      pointer-events: auto !important;
    }

    /* Dropdown Mega-Menu Panels */
    .ts-mm-panel {
      position: absolute;
      left: 0;
      right: 0;
      top: 100%;
      width: 100%;
      z-index: 50 !important;
      visibility: hidden;
      opacity: 0;
      pointer-events: none;
      transform: translateY(-6px);
      transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                  visibility 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08);
    }
    .ts-mm-panel.is-active {
      visibility: visible !important;
      opacity: 1 !important;
      pointer-events: auto !important;
      transform: translateY(0) !important;
    }

    /* Active Nav Trigger State */
    [data-mm-trigger] {
      position: relative;
      transition: color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
    }
    [data-mm-trigger].is-trigger-active {
      color: #0052CC !important;
      background-color: #EFF6FF !important;
      box-shadow: inset 0 -2px 0 0 #0052CC !important;
    }
    [data-mm-trigger] .ts-mm-arrow,
    [data-mm-trigger] span:last-child {
      display: inline-block;
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    [data-mm-trigger].is-trigger-active .ts-mm-arrow,
    [data-mm-trigger].is-trigger-active span:last-child {
      transform: rotate(180deg);
      color: #0052CC !important;
    }

    /* Mega-Menu Card Styling & Current Active Indicator */
    .ts-mm-card {
      display: block;
      padding: 0.625rem 0.75rem;
      border: 1px solid transparent;
      transition: background-color 0.15s ease, border-color 0.15s ease;
      text-decoration: none;
    }
    .ts-mm-card:hover {
      background-color: #F8FAFC;
      border-color: #CBD5E1;
    }
    .ts-mm-card:hover .ts-mm-code {
      color: #0052CC;
    }
    .ts-mm-card:hover .ts-mm-title {
      color: #0052CC;
    }
    .ts-mm-card.is-current {
      background-color: #EFF6FF !important;
      border-color: #93C5FD !important;
    }
    .ts-mm-card.is-current .ts-mm-code {
      color: #0052CC !important;
    }
    .ts-mm-card.is-current .ts-mm-title {
      color: #0052CC !important;
    }

    /* Mobile and Responsive Utilities */
    @media (max-width: 639px) {
      #site-header-logo {
        max-width: 165px !important;
        height: 32px !important;
      }
      .ts-telemetry-hide-mobile {
        display: none !important;
      }
    }
    @media (max-width: 768px) {
      #ts-logo-studio-launcher, #ts-logo-launcher {
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

  function markCurrentPages() {
    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    const links = document.querySelectorAll('.ts-mm-card, #ts-mm-mobile a');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const cleanHref = href.replace(/\/$/, '') || '/';
      if (cleanHref === currentPath) {
        link.classList.add('is-current');
        const badge = link.querySelector('.ts-mm-curr-badge');
        if (badge) badge.classList.remove('hidden');
      }
    });
  }

  // Template for Mega-Menu Containers
  function initMegaMenu() {
    const header = document.querySelector('header');
    if (!header) return;

    // Check if already injected
    if (document.getElementById('ts-mega-menu-root')) return;

    // Enforce sticky header and prevent Tailwind relative class from overriding sticky
    header.classList.remove('relative');
    header.classList.add('sticky', 'top-0', 'z-50');

    // 1. Append backdrop directly to document.body to avoid header backdrop-blur containment
    let backdrop = document.getElementById('ts-mm-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'ts-mm-backdrop';
      backdrop.className = 'ts-mm-backdrop';
      document.body.appendChild(backdrop);
    }

    // 2. Build Root Mega-Menu Panel Container inside <header>
    const root = document.createElement('div');
    root.id = 'ts-mega-menu-root';
    root.className = 'w-full';

    root.innerHTML = `
      <!-- 1. Practice Areas (10) Mega-Menu Panel -->
      <div id="ts-mm-services" class="ts-mm-panel bg-white border-b border-brand-line">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="hairline-grid bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

            <!-- Col 1: SYS-01 to SYS-03 (Infrastructure, Compute & Hardening) -->
            <div class="p-5 hairline-b md:hairline-b-0 md:hairline-r flex flex-col justify-between">
              <div>
                <div class="font-mono text-[10px] font-bold text-brand-cobalt uppercase tracking-widest pb-3 mb-3 hairline-b flex items-center justify-between">
                  <span>01 // Cloud, VM &amp; Hardening</span>
                  <span class="w-1.5 h-1.5 bg-brand-cobalt"></span>
                </div>
                <div class="space-y-2">
                  <a href="/services/microsoft-365" class="ts-mm-card group">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="ts-mm-code font-mono text-[10px] font-bold text-slate-500">SYS-01</span>
                        <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate">Microsoft 365 Architecture</span>
                      </div>
                      <span class="ts-mm-curr-badge hidden px-1 py-0.2 bg-blue-100 text-brand-cobalt font-mono text-[8px] font-bold uppercase">CURRENT</span>
                    </div>
                    <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">Tenant governance, Entra ID, DMARC p=reject, and Exchange Online.</p>
                  </a>

                  <a href="/services/virtualization" class="ts-mm-card group">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="ts-mm-code font-mono text-[10px] font-bold text-slate-500">SYS-02</span>
                        <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate">Virtual Machines &amp; Servers</span>
                      </div>
                      <span class="ts-mm-curr-badge hidden px-1 py-0.2 bg-blue-100 text-brand-cobalt font-mono text-[8px] font-bold uppercase">CURRENT</span>
                    </div>
                    <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">VMware ESXi 8.0, Windows Hyper-V clusters, SAN storage, and vMotion.</p>
                  </a>

                  <a href="/services/hardening" class="ts-mm-card group">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="ts-mm-code font-mono text-[10px] font-bold text-slate-500">SYS-03</span>
                        <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate">Server &amp; Network Hardening</span>
                      </div>
                      <span class="ts-mm-curr-badge hidden px-1 py-0.2 bg-blue-100 text-brand-cobalt font-mono text-[8px] font-bold uppercase">CURRENT</span>
                    </div>
                    <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">CIS Level 2 benchmarks, East-West firewall rules, and immutable recovery.</p>
                  </a>
                </div>
              </div>
            </div>

            <!-- Col 2: SYS-04 to SYS-06 (Communications, Networking & Endpoints) -->
            <div class="p-5 hairline-b md:hairline-b-0 lg:hairline-r flex flex-col justify-between">
              <div>
                <div class="font-mono text-[10px] font-bold text-brand-cobalt uppercase tracking-widest pb-3 mb-3 hairline-b flex items-center justify-between">
                  <span>02 // Voice, Network &amp; MDM</span>
                  <span class="w-1.5 h-1.5 bg-brand-cobalt"></span>
                </div>
                <div class="space-y-2">
                  <a href="/services/voip-ippbx" class="ts-mm-card group">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="ts-mm-code font-mono text-[10px] font-bold text-slate-500">SYS-04</span>
                        <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate">VoIP Phone Systems &amp; SIP</span>
                      </div>
                      <span class="ts-mm-curr-badge hidden px-1 py-0.2 bg-blue-100 text-brand-cobalt font-mono text-[8px] font-bold uppercase">CURRENT</span>
                    </div>
                    <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">IP-PBX telephony, carrier SIP trunks, QoS DSCP priority, and E911 compliance.</p>
                  </a>

                  <a href="/services/network-management" class="ts-mm-card group">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="ts-mm-code font-mono text-[10px] font-bold text-slate-500">SYS-05</span>
                        <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate">Enterprise Network Mgmt</span>
                      </div>
                      <span class="ts-mm-curr-badge hidden px-1 py-0.2 bg-blue-100 text-brand-cobalt font-mono text-[8px] font-bold uppercase">CURRENT</span>
                    </div>
                    <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">L2/L3 core switching, commercial Wi-Fi 6E/7, and WireGuard mesh tunnels.</p>
                  </a>

                  <a href="/services/mobile-device-management" class="ts-mm-card group">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="ts-mm-code font-mono text-[10px] font-bold text-slate-500">SYS-06</span>
                        <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate">Mobile Device Management</span>
                      </div>
                      <span class="ts-mm-curr-badge hidden px-1 py-0.2 bg-blue-100 text-brand-cobalt font-mono text-[8px] font-bold uppercase">CURRENT</span>
                    </div>
                    <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">Intune compliance, MAM airlock wiping, iOS and Android endpoint policy.</p>
                  </a>
                </div>
              </div>
            </div>

            <!-- Col 3: SYS-07 to SYS-10 (Remote, Onsite, Advisory & AI) -->
            <div class="p-5 hairline-b md:hairline-b-0 md:hairline-r flex flex-col justify-between">
              <div>
                <div class="font-mono text-[10px] font-bold text-brand-cobalt uppercase tracking-widest pb-3 mb-3 hairline-b flex items-center justify-between">
                  <span>03 // Hybrid, Field &amp; AI</span>
                  <span class="w-1.5 h-1.5 bg-brand-cobalt"></span>
                </div>
                <div class="space-y-1.5">
                  <a href="/services/remote-desktop" class="ts-mm-card group">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="ts-mm-code font-mono text-[10px] font-bold text-slate-500">SYS-07</span>
                        <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate">Remote Desktop Services</span>
                      </div>
                      <span class="ts-mm-curr-badge hidden px-1 py-0.2 bg-blue-100 text-brand-cobalt font-mono text-[8px] font-bold uppercase">CURRENT</span>
                    </div>
                    <p class="font-mono text-[10px] text-slate-500 mt-0.5 leading-snug">Secure RDS gateways, MFA broker integration, and session host farms.</p>
                  </a>

                  <a href="/services/onsite-support" class="ts-mm-card group">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="ts-mm-code font-mono text-[10px] font-bold text-slate-500">SYS-08</span>
                        <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate">Onsite Support &amp; Dispatch</span>
                      </div>
                      <span class="ts-mm-curr-badge hidden px-1 py-0.2 bg-blue-100 text-brand-cobalt font-mono text-[8px] font-bold uppercase">CURRENT</span>
                    </div>
                    <p class="font-mono text-[10px] text-slate-500 mt-0.5 leading-snug">Orlando &amp; Kissimmee emergency dispatch, rack elevation, and cabling.</p>
                  </a>

                  <a href="/services/it-consultancy" class="ts-mm-card group">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="ts-mm-code font-mono text-[10px] font-bold text-slate-500">SYS-09</span>
                        <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate">IT Consultancy &amp; vCTO</span>
                      </div>
                      <span class="ts-mm-curr-badge hidden px-1 py-0.2 bg-blue-100 text-brand-cobalt font-mono text-[8px] font-bold uppercase">CURRENT</span>
                    </div>
                    <p class="font-mono text-[10px] text-slate-500 mt-0.5 leading-snug">Vendor auditing, infrastructure roadmaps, and principal advisory.</p>
                  </a>

                  <a href="/services/ai-implementation" class="ts-mm-card group bg-blue-50/50 border-blue-200">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-1.5">
                        <span class="ts-mm-code font-mono text-[10px] font-bold text-brand-cobalt">SYS-10</span>
                        <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate">Enterprise AI &amp; Copilot</span>
                      </div>
                      <span class="px-1.5 py-0.5 bg-brand-cobalt text-white font-mono text-[8px] font-bold uppercase tracking-wider">NEW</span>
                    </div>
                    <p class="font-mono text-[10px] text-slate-600 mt-0.5 leading-snug">Copilot data readiness, private RAG knowledge bases, and sovereign automation.</p>
                  </a>
                </div>
              </div>
            </div>

            <!-- Col 4: Catalog, Tools & Dispatch Panel -->
            <div class="p-5 bg-slate-50 flex flex-col justify-between">
              <div>
                <div class="font-mono text-[10px] font-bold text-brand-slate uppercase tracking-widest pb-3 mb-3 hairline-b flex items-center justify-between">
                  <span>Catalog, Tools &amp; Dispatch</span>
                  <span class="text-emerald-600 font-extrabold flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 bg-emerald-500 animate-pulse"></span>
                    ACTIVE
                  </span>
                </div>

                <div class="space-y-3 mb-5">
                  <div class="font-mono text-[11px] text-slate-700">
                    <strong class="text-brand-slate block text-xs">Steve Cormier</strong>
                    <span class="text-slate-600">Founder &amp; Principal Systems Architect</span>
                    <div class="text-[10px] text-slate-500 mt-0.5">Est. 1990 &bull; Central Florida Regional Office</div>
                  </div>
                  <div class="font-mono text-[10px] text-slate-600 bg-white p-2.5 border border-brand-line space-y-1">
                    <div>&bull; Phone: <a href="tel:+14079175250" class="text-brand-cobalt font-bold hover:underline">(407) 917-5250</a></div>
                    <div>&bull; Onsite: Orlando / Kissimmee / I-4 Corridor</div>
                    <div>&bull; SLA: 15-Minute Critical Response</div>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <a href="/tools" class="flex items-center justify-between w-full py-2 px-3 bg-white hover:bg-slate-100 text-brand-slate border border-brand-line font-mono text-[11px] font-bold uppercase tracking-wider transition-colors">
                  <span>3 Calculators (ROI &amp; Cloud)</span>
                  <span class="text-brand-cobalt font-bold">&rarr;</span>
                </a>
                <a href="/services" class="flex items-center justify-between w-full py-2 px-3 bg-white hover:bg-slate-100 text-brand-slate border border-brand-line font-mono text-[11px] font-bold uppercase tracking-wider transition-colors">
                  <span>All 10 Practice Areas</span>
                  <span class="text-brand-cobalt font-bold">&rarr;</span>
                </a>
                <a href="/contact" class="block w-full py-2.5 px-3 bg-brand-cobalt hover:bg-blue-700 text-white text-center font-mono text-[11px] font-bold uppercase tracking-wider shadow-sm transition-colors">
                  Request Dispatch &rarr;
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- 2. Company & Leadership Mega-Menu Panel -->
      <div id="ts-mm-company" class="ts-mm-panel bg-white border-b border-brand-line">
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
                      Founder &amp; Principal Systems Architect | VP of Global Technical &amp; Customer Support
                    </p>
                    <p class="text-xs text-slate-600 mt-2 leading-relaxed">
                      Leading global technical support, enterprise diagnostic architecture, and healthcare escalation engineering since 2010. 36 years operating IT network design, server virtualization (VMware ESXi &amp; Windows Hyper-V clusters), and mission-critical systems in Orlando and Central Florida since 1990. U.S. Air Force Veteran (Security Police, Offutt AFB), Criminal Justice degree, Microsoft Certified, and Lead Instructor for Track Day Xperience (TDX) at Sebring International Raceway.
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
                    VP Global Support // RTLS
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
                  <span>Operations, Tools &amp; Brand Systems</span>
                  <span class="w-1.5 h-1.5 bg-brand-slate"></span>
                </div>

                <div class="space-y-3">
                  <a href="/contact" class="block p-3 bg-white border border-brand-line hover:border-brand-cobalt transition-colors group">
                    <div class="font-heading text-xs font-bold text-brand-slate group-hover:text-brand-cobalt">Engineering Dispatch &amp; Contact</div>
                    <div class="font-mono text-[10px] text-slate-500 mt-0.5">Kissimmee / Orlando Onsite + Nationwide Remote Support. Direct phone: (407) 917-5250.</div>
                  </a>

                  <a href="/tools" class="block p-3 bg-white border border-brand-line hover:border-brand-cobalt transition-colors group">
                    <div class="flex items-center justify-between">
                      <span class="font-heading text-xs font-bold text-brand-slate group-hover:text-brand-cobalt">Interactive Engineering Calculators</span>
                      <span class="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-mono text-[9px] font-bold">3 TOOLS</span>
                    </div>
                    <div class="font-mono text-[10px] text-slate-500 mt-0.5">ROI, Hypervisor Sizing, and Cloud Migration Cost telemetry models.</div>
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
      <div id="ts-mm-mobile" class="ts-mm-panel bg-white border-b border-brand-line lg:hidden max-h-[85vh] overflow-y-auto">
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

    // Mark current active pages
    markCurrentPages();

    // Setup interactive triggers
    setupTriggers();
  }

  function setupTriggers() {
    const header = document.querySelector('header');
    const servicesPanel = document.getElementById('ts-mm-services');
    const companyPanel = document.getElementById('ts-mm-company');
    const mobilePanel = document.getElementById('ts-mm-mobile');
    const backdrop = document.getElementById('ts-mm-backdrop');

    let closeTimer = null;

    function cancelClose() {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    }

    function scheduleClose(delay = 180) {
      cancelClose();
      closeTimer = setTimeout(() => {
        closeAllPanels();
      }, delay);
    }

    function openPanel(panel, activeTrigger = null) {
      cancelClose();

      // Deactivate other panels
      [servicesPanel, companyPanel, mobilePanel].forEach(p => {
        if (p && p !== panel) p.classList.remove('is-active');
      });

      // Reset all trigger highlights
      document.querySelectorAll('[data-mm-trigger]').forEach(t => {
        t.classList.remove('is-trigger-active');
      });

      if (panel) {
        panel.classList.add('is-active');

        // Apply active trigger styling
        if (activeTrigger) {
          activeTrigger.classList.add('is-trigger-active');
        } else {
          if (panel === servicesPanel) {
            const trigger = document.querySelector('[data-mm-trigger="services"]');
            if (trigger) trigger.classList.add('is-trigger-active');
          } else if (panel === companyPanel) {
            const trigger = document.querySelector('[data-mm-trigger="company"]');
            if (trigger) trigger.classList.add('is-trigger-active');
          }
        }

        if (backdrop) backdrop.classList.add('is-active');
        if (panel === mobilePanel) {
          updateHamburgerIcons(true);
        }
      }
    }

    function closeAllPanels() {
      cancelClose();
      [servicesPanel, companyPanel, mobilePanel].forEach(p => {
        if (p) p.classList.remove('is-active');
      });
      document.querySelectorAll('[data-mm-trigger]').forEach(t => {
        t.classList.remove('is-trigger-active');
      });
      if (backdrop) backdrop.classList.remove('is-active');
      updateHamburgerIcons(false);
    }

    // Backdrop click / touch to dismiss
    if (backdrop) {
      backdrop.addEventListener('click', closeAllPanels);
      backdrop.addEventListener('touchend', (e) => {
        e.preventDefault();
        closeAllPanels();
      });
    }

    // Keep desktop panels open when cursor enters them; close with grace timer on leave
    [servicesPanel, companyPanel].forEach(panel => {
      if (!panel) return;
      panel.addEventListener('mouseenter', () => {
        cancelClose();
      });
      panel.addEventListener('mouseleave', () => {
        scheduleClose(180);
      });
    });

    // Close on mobile drawer link click
    if (mobilePanel) {
      mobilePanel.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link) {
          closeAllPanels();
        }
      });
    }

    // Header mouseleave handler: cleanly closes if moving cursor up/out
    if (header) {
      header.addEventListener('mouseleave', () => {
        if (window.innerWidth >= 1024) {
          scheduleClose(180);
        }
      });
    }

    // Desktop hover & click triggers
    const allLinks = document.querySelectorAll('header nav a, [data-mm-trigger]');
    allLinks.forEach(link => {
      const text = (link.textContent || '').trim().toUpperCase();
      const triggerType = link.dataset.mmTrigger;
      const isServices = triggerType === 'services' || text.includes('PRACTICE') || text.includes('SERVICES');
      const isCompany = triggerType === 'company' || text.includes('ABOUT') || text.includes('LEADERSHIP') || text.includes('COMPANY') || text.includes('SINCE 1990') || text.includes('HERITAGE');

      if (isServices) {
        // Services trigger
        link.addEventListener('mouseenter', () => {
          if (window.innerWidth >= 1024) {
            cancelClose();
            openPanel(servicesPanel, link);
          }
        });
        link.addEventListener('mouseleave', () => {
          if (window.innerWidth >= 1024) {
            scheduleClose(180);
          }
        });
        link.addEventListener('click', (e) => {
          if (window.innerWidth >= 1024) {
            // If panel already open, allow regular click navigation to /services
            if (servicesPanel && servicesPanel.classList.contains('is-active')) {
              return;
            }
            // If closed, open panel and prevent default jump
            e.preventDefault();
            openPanel(servicesPanel, link);
          }
        });
      } else if (isCompany) {
        // Company / Leadership trigger
        link.addEventListener('mouseenter', () => {
          if (window.innerWidth >= 1024) {
            cancelClose();
            openPanel(companyPanel, link);
          }
        });
        link.addEventListener('mouseleave', () => {
          if (window.innerWidth >= 1024) {
            scheduleClose(180);
          }
        });
        link.addEventListener('click', (e) => {
          if (window.innerWidth >= 1024) {
            // If panel already open, allow regular click navigation to /about
            if (companyPanel && companyPanel.classList.contains('is-active')) {
              return;
            }
            // If closed, open panel and prevent default jump
            e.preventDefault();
            openPanel(companyPanel, link);
          }
        });
      } else {
        // Non-dropdown nav items (Calculators, Logo Studio, Contact, Portal)
        // 120ms delay before closing open mega-menu to preserve diagonal mouse paths into panel
        link.addEventListener('mouseenter', () => {
          if (window.innerWidth >= 1024) {
            scheduleClose(120);
          }
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
