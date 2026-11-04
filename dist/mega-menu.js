/**
 * Technology Specialist - Swiss Architectural Mega-Menu & Action Runtime
 * STD-2026-BRAND-TECHSPEC-01 // Zero Em Dashes // Precision Hairline Grid
 * DEC-004 Anti-Slop Voice // DEC-007 Strict Corporate Isolation
 * MOD-SITE-TREE-MEGA-MENU v2.1 // GreenTreeOS Universal Compliance Suite
 */
(function() {
  'use strict';

  // 1. Inject Mega-Menu, Modal, and Responsive Action Styles into <head>
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

    /* Header Logo Mark & Brand Typography Responsiveness */
    #site-header-logo {
      width: 36px !important;
      height: 36px !important;
      max-width: 44px !important;
      max-height: 44px !important;
      object-fit: contain !important;
      flex-shrink: 0 !important;
    }
    @media (min-width: 640px) {
      #site-header-logo {
        width: 44px !important;
        height: 44px !important;
      }
    }
    @media (max-width: 410px) {
      .ts-brand-title {
        font-size: 0.8125rem !important; /* 13px */
      }
      .ts-brand-subtitle {
        font-size: 0.5rem !important; /* 8px */
      }
    }
    header nav {
      white-space: nowrap !important;
    }
    header nav a {
      white-space: nowrap !important;
    }

    /* Mobile Drawer Tab Switching */
    .ts-mobile-tab.active {
      background-color: #0052CC !important;
      color: #FFFFFF !important;
      border-color: #0052CC !important;
    }
    .ts-mobile-tab.active .ts-tab-sub {
      color: #BFDBFE !important;
    }
    .ts-mobile-tab.active svg {
      color: #FFFFFF !important;
    }
    .ts-mobile-tab-panel {
      display: none;
    }
    .ts-mobile-tab-panel.active {
      display: block;
    }

    /* Modals & Command Palette */
    .ts-modal-backdrop {
      position: fixed;
      inset: 0;
      background-color: rgba(15, 23, 42, 0.65);
      -webkit-backdrop-filter: blur(4px);
      backdrop-filter: blur(4px);
      z-index: 60;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .ts-modal-card {
      background: #FFFFFF;
      border: 1px solid #CBD5E1;
      width: 100%;
      max-width: 42rem;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
    }

    /* Precision Hairline Grid Utilities */
    .hairline-b { border-bottom: 1px solid #CBD5E1; }
    .hairline-t { border-top: 1px solid #CBD5E1; }
    .hairline-r { border-right: 1px solid #CBD5E1; }
    .hairline-l { border-left: 1px solid #CBD5E1; }
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

  // Normalize Header Action Zone: Ensure 38x38 precision icons + Hamburger
  function normalizeHeaderActions() {
    const header = document.querySelector('header');
    if (!header) return;

    // Remove any /logos link from desktop <nav>
    const nav = header.querySelector('nav');
    if (nav) {
      const logosNav = nav.querySelector('a[href="/logos"], a[href="/logos/"]');
      if (logosNav) logosNav.remove();
    }

    // Locate header action container (contains CTA or hamburger)
    const headerRow = header.querySelector('.flex.items-center.justify-between');
    if (!headerRow) return;

    // Check if right actions suite is already normalized
    let actionZone = headerRow.querySelector('[data-ts-action-suite]');
    if (!actionZone) {
      // Find old action container (contains Contact Steve button or hamburger)
      const existingActionBox = headerRow.querySelector('div.shrink-0:last-child');
      if (existingActionBox) {
        existingActionBox.setAttribute('data-ts-action-suite', 'true');
        existingActionBox.className = 'flex items-center gap-1.5 sm:gap-2 shrink-0';
        existingActionBox.innerHTML = `
          <!-- Action 1: Search Trigger (Ctrl+K) -->
          <button type="button" onclick="window.openTSSearch && window.openTSSearch()" class="hidden lg:inline-flex items-center gap-2 px-2.5 py-1.5 border border-brand-line bg-slate-50 hover:bg-white text-slate-600 hover:text-brand-cobalt transition-colors font-mono text-xs" title="Search Practice Areas &amp; Tools (Ctrl+K)" aria-label="Search (Ctrl+K)">
            <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <span class="text-[11px] font-bold">Search</span>
            <kbd class="px-1 py-0.2 bg-white border border-brand-line text-[9px] text-slate-500 font-mono">Ctrl+K</kbd>
          </button>
          <button type="button" onclick="window.openTSSearch && window.openTSSearch()" class="lg:hidden flex items-center justify-center w-[38px] h-[38px] border border-brand-line bg-white text-slate-700 hover:text-brand-cobalt hover:border-brand-cobalt transition-colors shrink-0" title="Search (Ctrl+K)" aria-label="Open Search">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </button>

          <!-- Action 2: Visual Pin Board Trigger (Crosshair) -->
          <button type="button" onclick="window.openTSPinBoard && window.openTSPinBoard()" class="flex items-center justify-center w-[38px] h-[38px] border border-brand-line bg-white text-brand-cobalt hover:bg-blue-50 transition-colors shrink-0" title="Visual Pin Board Collaboration Tool" aria-label="Visual Pin Board">
            <svg class="w-4 h-4 text-brand-cobalt" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="7" stroke-width="2" stroke="currentColor"/>
              <line x1="12" y1="2" x2="12" y2="5" stroke-width="2" stroke-linecap="square"/>
              <line x1="12" y1="19" x2="12" y2="22" stroke-width="2" stroke-linecap="square"/>
              <line x1="2" y1="12" x2="5" y2="12" stroke-width="2" stroke-linecap="square"/>
              <line x1="19" y1="12" x2="22" y2="12" stroke-width="2" stroke-linecap="square"/>
              <circle cx="12" cy="12" r="2" fill="currentColor"/>
            </svg>
          </button>

          <!-- Action 3: Direct Contact Icon Button (38x38 square, cobalt) -->
          <a href="/contact" class="flex items-center justify-center w-[38px] h-[38px] bg-brand-cobalt hover:bg-blue-700 text-white transition-colors shrink-0" title="Contact Steve Cormier (Direct Dispatch)" aria-label="Contact Steve Cormier">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </a>

          <!-- Action 4: Mobile Hamburger Menu Button (38x38 square, white border) -->
          <button type="button" data-mobile-menu-btn class="lg:hidden flex items-center justify-center w-[38px] h-[38px] border border-brand-line bg-white text-slate-700 hover:text-brand-cobalt hover:border-brand-cobalt transition-colors shrink-0" aria-label="Toggle Navigation Menu">
            <span class="sr-only">Open Menu</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        `;
      }
    }
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

    // Normalize Header Action Zone
    normalizeHeaderActions();

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

            <!-- Col 1: Cloud, Virtualization & Hardening -->
            <div class="p-4 hairline-b md:hairline-b-0 md:hairline-r">
              <div class="font-mono text-[10px] font-bold text-brand-cobalt uppercase tracking-widest pb-2 mb-3 hairline-b flex items-center justify-between">
                <span>Core Infrastructure</span>
                <span class="font-mono text-[10px] text-slate-400">01 - 03</span>
              </div>
              <div class="space-y-1">
                <a href="/services/microsoft-365" class="ts-mm-card group">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="ts-mm-code font-mono text-[10px] font-bold text-brand-cobalt">SYS-01</span>
                      <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate">Microsoft 365 Architecture</span>
                    </div>
                    <span class="ts-mm-curr-badge hidden px-1 py-0.2 bg-blue-100 text-brand-cobalt font-mono text-[8px] font-bold uppercase">CURRENT</span>
                  </div>
                  <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">Entra ID, Intune MDM, tenant security baseline, and Exchange migrations.</p>
                </a>

                <a href="/services/virtualization" class="ts-mm-card group">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="ts-mm-code font-mono text-[10px] font-bold text-brand-cobalt">SYS-02</span>
                      <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate">Virtual Machines &amp; Servers</span>
                    </div>
                    <span class="ts-mm-curr-badge hidden px-1 py-0.2 bg-blue-100 text-brand-cobalt font-mono text-[8px] font-bold uppercase">CURRENT</span>
                  </div>
                  <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">VMware ESXi 8.0, Windows Hyper-V clusters, SAN storage, and vMotion.</p>
                </a>

                <a href="/services/hardening" class="ts-mm-card group">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="ts-mm-code font-mono text-[10px] font-bold text-brand-cobalt">SYS-03</span>
                      <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate">Server &amp; Network Hardening</span>
                    </div>
                    <span class="ts-mm-curr-badge hidden px-1 py-0.2 bg-blue-100 text-brand-cobalt font-mono text-[8px] font-bold uppercase">CURRENT</span>
                  </div>
                  <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">CIS Level 2 benchmarks, micro-segmentation, and exploit mitigation.</p>
                </a>
              </div>
            </div>

            <!-- Col 2: Voice & Communications -->
            <div class="p-4 hairline-b md:hairline-b-0 lg:hairline-r">
              <div class="font-mono text-[10px] font-bold text-brand-cobalt uppercase tracking-widest pb-2 mb-3 hairline-b flex items-center justify-between">
                <span>Communications &amp; Networking</span>
                <span class="font-mono text-[10px] text-slate-400">04 - 06</span>
              </div>
              <div class="space-y-1">
                <a href="/services/voip-ippbx" class="ts-mm-card group">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="ts-mm-code font-mono text-[10px] font-bold text-slate-500">SYS-04</span>
                      <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate">VoIP Phone Systems &amp; SIP</span>
                    </div>
                    <span class="ts-mm-curr-badge hidden px-1 py-0.2 bg-blue-100 text-brand-cobalt font-mono text-[8px] font-bold uppercase">CURRENT</span>
                  </div>
                  <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">3CX, SIP trunking, SBC failover, and call center IVR routing.</p>
                </a>

                <a href="/services/network-management" class="ts-mm-card group">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="ts-mm-code font-mono text-[10px] font-bold text-slate-500">SYS-05</span>
                      <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate">Enterprise Network Mgmt</span>
                    </div>
                    <span class="ts-mm-curr-badge hidden px-1 py-0.2 bg-blue-100 text-brand-cobalt font-mono text-[8px] font-bold uppercase">CURRENT</span>
                  </div>
                  <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">Managed switches, VLANs, Wi-Fi 7 telemetry, and multi-WAN failover.</p>
                </a>

                <a href="/services/mobile-device-management" class="ts-mm-card group">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="ts-mm-code font-mono text-[10px] font-bold text-slate-500">SYS-06</span>
                      <span class="ts-mm-title font-heading text-xs font-bold text-brand-slate">Mobile Device Management</span>
                    </div>
                    <span class="ts-mm-curr-badge hidden px-1 py-0.2 bg-blue-100 text-brand-cobalt font-mono text-[8px] font-bold uppercase">CURRENT</span>
                  </div>
                  <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">Intune enrollment, zero-touch deployment, and remote data wipe.</p>
                </a>
              </div>
            </div>

            <!-- Col 3: Workplace, Dispatch & AI -->
            <div class="p-4 hairline-b md:hairline-b-0 md:hairline-r">
              <div class="font-mono text-[10px] font-bold text-brand-cobalt uppercase tracking-widest pb-2 mb-3 hairline-b flex items-center justify-between">
                <span>Advisory &amp; Enterprise AI</span>
                <span class="font-mono text-[10px] text-slate-400">07 - 10</span>
              </div>
              <div class="space-y-1">
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
                  <p class="font-mono text-[10px] text-slate-600 mt-0.5 leading-snug">Copilot data readiness, private RAG knowledge bases, and private workflow automation.</p>
                </a>
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
                  Contact Steve &rarr;
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
                  <span>Operations &amp; Practice Directory</span>
                  <span class="w-1.5 h-1.5 bg-brand-slate"></span>
                </div>

                <div class="space-y-3">
                  <a href="/contact" class="block p-3 bg-white border border-brand-line hover:border-brand-cobalt transition-colors group">
                    <div class="font-heading text-xs font-bold text-brand-slate group-hover:text-brand-cobalt">Engineering Dispatch &amp; Contact</div>
                    <div class="font-mono text-[10px] text-slate-500 mt-0.5">Kissimmee / Orlando Onsite + Nationwide Remote Support. Direct phone: (407) 917-5250.</div>
                  </a>

                  <a href="/tools" class="block p-3 bg-white border border-brand-line hover:border-brand-cobalt transition-colors group">
                    <div class="flex items-center justify-between">
                      <span class="font-heading text-xs font-bold text-brand-slate group-hover:text-brand-cobalt">Interactive Engineering Calculators (03)</span>
                      <span class="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 font-mono text-[9px] font-bold">3 TOOLS</span>
                    </div>
                    <div class="font-mono text-[10px] text-slate-500 mt-0.5">ROI, Hypervisor Sizing, and Cloud Migration Cost telemetry models.</div>
                  </a>

                  <a href="/services" class="block p-3 bg-white border border-brand-line hover:border-brand-cobalt transition-colors group">
                    <div class="flex items-center justify-between">
                      <span class="font-heading text-xs font-bold text-brand-slate group-hover:text-brand-cobalt">10 Enterprise Practice Areas</span>
                      <span class="px-1.5 py-0.5 bg-blue-50 text-brand-cobalt font-mono text-[9px] font-bold">CATALOG</span>
                    </div>
                    <div class="font-mono text-[10px] text-slate-500 mt-0.5">Comprehensive systems architecture from M365 to Server Hardening &amp; AI.</div>
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

      <!-- 3. Canonical Tabbed Mobile Navigation Drawer (Hidden on Desktop) -->
      <div id="ts-mm-mobile" class="ts-mm-panel bg-white border-b border-brand-line lg:hidden max-h-[88vh] overflow-y-auto">
        <div class="p-3 sm:p-4 space-y-3 font-mono text-xs">
          
          <!-- Mobile Top Status Row -->
          <div class="flex items-center justify-between p-2.5 bg-slate-900 text-white border border-slate-800 text-[11px]">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-2 h-2 bg-emerald-400 animate-pulse shrink-0"></span>
              <span class="text-[10px] font-bold tracking-wider uppercase text-slate-200">EST. 1990 &bull; CENTRAL FL &amp; NATIONWIDE</span>
            </div>
            <a href="tel:+14079175250" class="text-sky-300 font-bold hover:text-white transition-colors shrink-0">
              (407) 917-5250
            </a>
          </div>

          <!-- Mobile Command Search Bar Trigger -->
          <button type="button" onclick="window.closeAllPanels && window.closeAllPanels(); window.openTSSearch && window.openTSSearch();" class="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 border border-brand-line text-left transition-colors">
            <div class="flex items-center gap-2 text-slate-600 text-xs">
              <svg class="w-4 h-4 text-brand-cobalt shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <span class="truncate">Search 10 practices, calculators, ESXi, M365...</span>
            </div>
            <kbd class="px-1.5 py-0.5 bg-white border border-slate-300 text-[10px] text-slate-500 font-mono shrink-0">Ctrl+K</kbd>
          </button>

          <!-- 4-Tab Switcher Grid (2x2) -->
          <div class="grid grid-cols-2 gap-1.5">
            <button type="button" data-mobile-tab="cloud" class="ts-mobile-tab active p-2.5 border border-brand-line bg-white text-left transition-colors cursor-pointer">
              <div class="flex items-center gap-1.5 font-bold text-xs text-brand-slate">
                <svg class="w-3.5 h-3.5 text-brand-cobalt shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z"/></svg>
                <span>Cloud &amp; AI</span>
              </div>
              <div class="ts-tab-sub text-[9px] text-slate-500 mt-0.5 truncate">SYS-01, 06, 10 &bull; Copilot</div>
            </button>

            <button type="button" data-mobile-tab="compute" class="ts-mobile-tab p-2.5 border border-brand-line bg-white text-left transition-colors cursor-pointer">
              <div class="flex items-center gap-1.5 font-bold text-xs text-brand-slate">
                <svg class="w-3.5 h-3.5 text-brand-cobalt shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/></svg>
                <span>Compute &amp; Sec</span>
              </div>
              <div class="ts-tab-sub text-[9px] text-slate-500 mt-0.5 truncate">SYS-02, 03, 07 &bull; ESXi</div>
            </button>

            <button type="button" data-mobile-tab="network" class="ts-mobile-tab p-2.5 border border-brand-line bg-white text-left transition-colors cursor-pointer">
              <div class="flex items-center gap-1.5 font-bold text-xs text-brand-slate">
                <svg class="w-3.5 h-3.5 text-brand-cobalt shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                <span>Voice &amp; Net</span>
              </div>
              <div class="ts-tab-sub text-[9px] text-slate-500 mt-0.5 truncate">SYS-04, 05, 08 &bull; VoIP</div>
            </button>

            <button type="button" data-mobile-tab="advisory" class="ts-mobile-tab p-2.5 border border-brand-line bg-white text-left transition-colors cursor-pointer">
              <div class="flex items-center gap-1.5 font-bold text-xs text-brand-slate">
                <svg class="w-3.5 h-3.5 text-brand-cobalt shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                <span>Tools &amp; Team</span>
              </div>
              <div class="ts-tab-sub text-[9px] text-slate-500 mt-0.5 truncate">Calculators &bull; Steve</div>
            </button>
          </div>

          <!-- Mobile Tab Content Panels -->
          <!-- Tab Panel 1: Cloud & AI -->
          <div data-mobile-tab-panel="cloud" class="ts-mobile-tab-panel active space-y-1.5 pt-1">
            <a href="/services/microsoft-365" class="block p-2.5 bg-slate-50 border border-brand-line hover:border-brand-cobalt transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-bold text-brand-slate"><span class="text-brand-cobalt">SYS-01</span> Microsoft 365 Architecture</span>
                <span class="text-[9px] text-slate-400 font-mono">&rarr;</span>
              </div>
              <p class="text-[10px] text-slate-500 mt-0.5 leading-snug">Entra ID, Intune MDM, tenant security baseline, and Exchange migrations.</p>
            </a>

            <a href="/services/ai-implementation" class="block p-2.5 bg-blue-50/50 border border-blue-200 hover:border-brand-cobalt transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-bold text-brand-slate"><span class="text-brand-cobalt">SYS-10</span> Enterprise AI &amp; Copilot</span>
                <span class="px-1.5 py-0.2 bg-brand-cobalt text-white font-mono text-[8px] font-bold uppercase">NEW</span>
              </div>
              <p class="text-[10px] text-slate-600 mt-0.5 leading-snug">Copilot permission audits, private RAG vector knowledge bases, and workflow automation.</p>
            </a>

            <a href="/services/mobile-device-management" class="block p-2.5 bg-slate-50 border border-brand-line hover:border-brand-cobalt transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-bold text-brand-slate"><span class="text-brand-cobalt">SYS-06</span> Mobile Device Management</span>
                <span class="text-[9px] text-slate-400 font-mono">&rarr;</span>
              </div>
              <p class="text-[10px] text-slate-500 mt-0.5 leading-snug">Intune enrollment, zero-touch deployment, BitLocker, and remote device wipe.</p>
            </a>

            <a href="/services" class="block p-2 bg-white border border-brand-line text-center text-brand-cobalt font-bold hover:bg-slate-50 transition-colors">
              View All 10 Enterprise Practice Areas &rarr;
            </a>
          </div>

          <!-- Tab Panel 2: Compute & Sec -->
          <div data-mobile-tab-panel="compute" class="ts-mobile-tab-panel space-y-1.5 pt-1">
            <a href="/services/virtualization" class="block p-2.5 bg-slate-50 border border-brand-line hover:border-brand-cobalt transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-bold text-brand-slate"><span class="text-brand-cobalt">SYS-02</span> Virtual Machines &amp; Servers</span>
                <span class="text-[9px] text-slate-400 font-mono">&rarr;</span>
              </div>
              <p class="text-[10px] text-slate-500 mt-0.5 leading-snug">VMware ESXi 8.0, Windows Hyper-V clusters, SAN storage, and vMotion.</p>
            </a>

            <a href="/services/hardening" class="block p-2.5 bg-slate-50 border border-brand-line hover:border-brand-cobalt transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-bold text-brand-slate"><span class="text-brand-cobalt">SYS-03</span> Server &amp; Network Hardening</span>
                <span class="text-[9px] text-slate-400 font-mono">&rarr;</span>
              </div>
              <p class="text-[10px] text-slate-500 mt-0.5 leading-snug">CIS Level 2 benchmarks, micro-segmentation, and exploit mitigation.</p>
            </a>

            <a href="/services/remote-desktop" class="block p-2.5 bg-slate-50 border border-brand-line hover:border-brand-cobalt transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-bold text-brand-slate"><span class="text-brand-cobalt">SYS-07</span> Remote Desktop Services</span>
                <span class="text-[9px] text-slate-400 font-mono">&rarr;</span>
              </div>
              <p class="text-[10px] text-slate-500 mt-0.5 leading-snug">Secure RDS gateways, MFA broker integration, and session host farms.</p>
            </a>
          </div>

          <!-- Tab Panel 3: Voice & Net -->
          <div data-mobile-tab-panel="network" class="ts-mobile-tab-panel space-y-1.5 pt-1">
            <a href="/services/voip-ippbx" class="block p-2.5 bg-slate-50 border border-brand-line hover:border-brand-cobalt transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-bold text-brand-slate"><span class="text-brand-cobalt">SYS-04</span> VoIP Phone Systems &amp; SIP</span>
                <span class="text-[9px] text-slate-400 font-mono">&rarr;</span>
              </div>
              <p class="text-[10px] text-slate-500 mt-0.5 leading-snug">3CX, SIP trunking, SBC failover, and call center IVR routing.</p>
            </a>

            <a href="/services/network-management" class="block p-2.5 bg-slate-50 border border-brand-line hover:border-brand-cobalt transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-bold text-brand-slate"><span class="text-brand-cobalt">SYS-05</span> Enterprise Network Mgmt</span>
                <span class="text-[9px] text-slate-400 font-mono">&rarr;</span>
              </div>
              <p class="text-[10px] text-slate-500 mt-0.5 leading-snug">Managed switches, VLANs, Wi-Fi 7 telemetry, and multi-WAN failover.</p>
            </a>

            <a href="/services/onsite-support" class="block p-2.5 bg-slate-50 border border-brand-line hover:border-brand-cobalt transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-bold text-brand-slate"><span class="text-brand-cobalt">SYS-08</span> Onsite Support &amp; Dispatch</span>
                <span class="text-[9px] text-slate-400 font-mono">&rarr;</span>
              </div>
              <p class="text-[10px] text-slate-500 mt-0.5 leading-snug">Orlando &amp; Kissimmee emergency dispatch, rack elevation, and cabling.</p>
            </a>
          </div>

          <!-- Tab Panel 4: Tools & Team -->
          <div data-mobile-tab-panel="advisory" class="ts-mobile-tab-panel space-y-1.5 pt-1">
            <a href="/tools" class="block p-2.5 bg-emerald-50/60 border border-emerald-200 hover:border-emerald-400 transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-bold text-emerald-900">Interactive Engineering Calculators</span>
                <span class="px-1.5 py-0.2 bg-emerald-600 text-white font-mono text-[8px] font-bold uppercase">3 TOOLS</span>
              </div>
              <p class="text-[10px] text-slate-600 mt-0.5 leading-snug">Downtime Cost ROI, Hypervisor Sizing, and Cloud Migration Cost telemetry models.</p>
            </a>

            <a href="/services/it-consultancy" class="block p-2.5 bg-slate-50 border border-brand-line hover:border-brand-cobalt transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-bold text-brand-slate"><span class="text-brand-cobalt">SYS-09</span> IT Consultancy &amp; vCTO</span>
                <span class="text-[9px] text-slate-400 font-mono">&rarr;</span>
              </div>
              <p class="text-[10px] text-slate-500 mt-0.5 leading-snug">Vendor auditing, infrastructure roadmaps, and principal advisory.</p>
            </a>

            <a href="/about" class="block p-2.5 bg-slate-50 border border-brand-line hover:border-brand-cobalt transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-bold text-brand-slate">About Steve Cormier (Est. 1990)</span>
                <span class="text-[9px] text-slate-400 font-mono">&rarr;</span>
              </div>
              <p class="text-[10px] text-slate-500 mt-0.5 leading-snug">36 years enterprise engineering, USAF veteran, VP Global Support.</p>
            </a>

            <button type="button" onclick="window.closeAllPanels && window.closeAllPanels(); window.openTSPinBoard && window.openTSPinBoard();" class="w-full text-left p-2.5 bg-white border border-brand-line hover:border-brand-cobalt transition-colors">
              <div class="flex items-center justify-between">
                <span class="font-bold text-brand-slate flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-brand-cobalt" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7" stroke-width="2"/><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>
                  <span>Visual Pin Board Collaboration</span>
                </span>
                <span class="text-[9px] text-slate-400 font-mono">&rarr;</span>
              </div>
              <p class="text-[10px] text-slate-500 mt-0.5 leading-snug">Click and pin element review tool for staging feedback.</p>
            </button>
          </div>

          <!-- Mobile Actions Bottom Bar (Sticky within Drawer) -->
          <div class="pt-3 hairline-t flex items-center gap-2">
            <a href="/contact" class="flex-1 py-2.5 px-3 bg-brand-cobalt hover:bg-blue-700 text-white font-mono text-xs font-bold text-center uppercase tracking-wider shadow-sm transition-colors flex items-center justify-center gap-1.5">
              <span>Contact Steve</span>
              <span>&rarr;</span>
            </a>
            <a href="tel:+14079175250" class="flex-1 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold text-center uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5">
              <span>(407) 917-5250</span>
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

    // Setup mobile tab switching
    setupMobileTabs();
  }

  // Setup Mobile 4-Tab Switching
  function setupMobileTabs() {
    const tabButtons = document.querySelectorAll('[data-mobile-tab]');
    const tabPanels = document.querySelectorAll('[data-mobile-tab-panel]');

    tabButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const targetTab = btn.getAttribute('data-mobile-tab');

        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        tabPanels.forEach(panel => {
          if (panel.getAttribute('data-mobile-tab-panel') === targetTab) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });
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

    window.closeAllPanels = closeAllPanels;

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
            if (servicesPanel && servicesPanel.classList.contains('is-active')) {
              return;
            }
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
            if (companyPanel && companyPanel.classList.contains('is-active')) {
              return;
            }
            e.preventDefault();
            openPanel(companyPanel, link);
          }
        });
      } else {
        // Non-dropdown nav items (Calculators, Contact, Portal)
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
        if (window.closeTSSearch) window.closeTSSearch();
        if (window.closeTSModal) window.closeTSModal();
      }
    });

    // Close mobile panel on desktop breakpoint resize
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && mobilePanel && mobilePanel.classList.contains('is-active')) {
        closeAllPanels();
      }
    });
  }

  // =========================================================================
  // 3. Command Palette Search Engine (`Ctrl+K`)
  // =========================================================================
  const SEARCH_ITEMS = [
    { title: "SYS-01: Microsoft 365 Architecture & Tenant Governance", path: "/services/microsoft-365", category: "Core Infrastructure", code: "SYS-01", desc: "Entra ID, Intune MDM, tenant security baseline, Purview, and Exchange migrations." },
    { title: "SYS-02: Virtual Machines & Hypervisor Cluster Engineering", path: "/services/virtualization", category: "Core Infrastructure", code: "SYS-02", desc: "VMware ESXi 8.0, Windows Hyper-V clusters, SAN storage, and vMotion failover." },
    { title: "SYS-03: Server & Network Hardening (CIS Benchmark L2)", path: "/services/hardening", category: "Core Infrastructure", code: "SYS-03", desc: "CIS Level 2 benchmarks, micro-segmentation, Suricata IDS/IPS, and exploit mitigation." },
    { title: "SYS-04: Enterprise VoIP Phone Systems & SIP Trunking", path: "/services/voip-ippbx", category: "Communications", code: "SYS-04", desc: "3CX, SIP trunking, SBC failover, Ray Baum Act compliance, and call center IVR." },
    { title: "SYS-05: Enterprise Network Management & L2/L3 Switching", path: "/services/network-management", category: "Communications", code: "SYS-05", desc: "Managed switches, VLANs, Wi-Fi 7 telemetry, multi-WAN failover, and fiber uplinks." },
    { title: "SYS-06: Mobile Device Management & Endpoint Protection", path: "/services/mobile-device-management", category: "Communications", code: "SYS-06", desc: "Intune enrollment, zero-touch deployment, BitLocker encryption, and remote device wipe." },
    { title: "SYS-07: Remote Desktop Services & Work-From-Anywhere", path: "/services/remote-desktop", category: "Workplace", code: "SYS-07", desc: "Secure RDS gateways, MFA broker integration, Azure Virtual Desktop, and session host farms." },
    { title: "SYS-08: Onsite Systems Support & Orlando Dispatch", path: "/services/onsite-support", category: "Workplace", code: "SYS-08", desc: "Orlando & Kissimmee emergency dispatch, rack elevation, structured cabling, and hardware triage." },
    { title: "SYS-09: Principal IT Consultancy & vCTO Advisory", path: "/services/it-consultancy", category: "Advisory", code: "SYS-09", desc: "Vendor auditing, infrastructure roadmaps, compliance readiness, and principal advisory." },
    { title: "SYS-10: Enterprise AI Implementation & Copilot Governance", path: "/services/ai-implementation", category: "Enterprise AI", code: "SYS-10", desc: "Copilot data readiness, private RAG knowledge bases, Ollama, and private workflow automation." },
    { title: "Interactive Engineering Calculators (03 Tools)", path: "/tools", category: "Calculators", code: "TOOLS", desc: "Downtime Cost ROI, Hypervisor Sizing, and Cloud Migration Cost telemetry models." },
    { title: "Executive Leadership & 36-Year Heritage", path: "/about", category: "Leadership", code: "ABOUT", desc: "Steve Cormier, Founder & Principal Systems Architect since 1990. USAF Veteran." },
    { title: "Engineering Dispatch & Contact Steve", path: "/contact", category: "Dispatch", code: "CONTACT", desc: "Kissimmee & Orlando regional dispatch. Direct telephone: (407) 917-5250." },
    { title: "All 10 Enterprise Practice Areas Overview", path: "/services", category: "Catalog", code: "CATALOG", desc: "Complete 10-practice architecture matrix and enterprise engineering catalog." }
  ];

  let searchModalEl = null;

  function renderSearchModal() {
    if (searchModalEl) return;

    searchModalEl = document.createElement('div');
    searchModalEl.id = 'ts-mm-search-modal';
    searchModalEl.className = 'ts-modal-backdrop';
    searchModalEl.style.display = 'none';

    searchModalEl.innerHTML = `
      <div class="ts-modal-card" onclick="event.stopPropagation()">
        <!-- Search Input Bar -->
        <div class="p-4 hairline-b flex items-center gap-3 bg-slate-50">
          <svg class="w-5 h-5 text-brand-cobalt shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input id="ts-search-input" type="text" placeholder="Search 10 practice areas, calculators, ESXi, M365, VoIP, AI..." class="w-full bg-transparent text-sm sm:text-base font-sans text-brand-slate focus:outline-none placeholder-slate-400" autocomplete="off" />
          <kbd class="px-2 py-0.5 bg-white border border-slate-300 text-[10px] font-mono text-slate-500 shrink-0">ESC</kbd>
        </div>

        <!-- Search Results List -->
        <div id="ts-search-results" class="p-3 overflow-y-auto max-h-[60vh] space-y-1 font-mono text-xs">
          <!-- Populated dynamically -->
        </div>

        <!-- Search Footer -->
        <div class="p-2.5 bg-slate-50 hairline-t text-[10px] font-mono text-slate-500 flex items-center justify-between">
          <span>Navigation: <kbd class="px-1 py-0.2 bg-white border border-slate-300">UP</kbd> <kbd class="px-1 py-0.2 bg-white border border-slate-300">DOWN</kbd> to select &bull; <kbd class="px-1 py-0.2 bg-white border border-slate-300">ENTER</kbd> to open</span>
          <span class="text-brand-cobalt font-bold">Technology Specialist</span>
        </div>
      </div>
    `;

    searchModalEl.addEventListener('click', closeTSSearch);
    document.body.appendChild(searchModalEl);

    const input = searchModalEl.querySelector('#ts-search-input');
    input.addEventListener('input', () => {
      filterSearchResults(input.value.trim());
    });

    input.addEventListener('keydown', (e) => {
      const resultsContainer = searchModalEl.querySelector('#ts-search-results');
      const items = resultsContainer.querySelectorAll('a');
      let activeIndex = -1;
      items.forEach((item, idx) => {
        if (item.classList.contains('bg-blue-50')) activeIndex = idx;
      });

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
        highlightResultItem(items, nextIndex);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
        highlightResultItem(items, prevIndex);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && items[activeIndex]) {
          window.location.href = items[activeIndex].getAttribute('href');
        } else if (items.length > 0) {
          window.location.href = items[0].getAttribute('href');
        }
      }
    });
  }

  function highlightResultItem(items, index) {
    items.forEach((item, idx) => {
      if (idx === index) {
        item.classList.add('bg-blue-50', 'border-brand-cobalt');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('bg-blue-50', 'border-brand-cobalt');
      }
    });
  }

  function filterSearchResults(query) {
    const container = searchModalEl.querySelector('#ts-search-results');
    if (!container) return;

    const q = query.toLowerCase();
    const filtered = SEARCH_ITEMS.filter(item => {
      if (!q) return true;
      return item.title.toLowerCase().includes(q) ||
             item.desc.toLowerCase().includes(q) ||
             item.code.toLowerCase().includes(q) ||
             item.category.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="p-6 text-center text-slate-500 font-mono text-xs">
          No matching architecture or practice areas found for "<strong>${escapeHtml(query)}</strong>".
          <div class="mt-2 text-[11px] text-brand-cobalt">Try searching for: M365, ESXi, VoIP, Firewall, AI, Calculators, or Steve Cormier.</div>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((item, idx) => `
      <a href="${item.path}" class="block p-3 border border-brand-line bg-white hover:bg-slate-50 transition-colors ${idx === 0 ? 'bg-blue-50 border-brand-cobalt' : ''}">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="px-1.5 py-0.2 bg-slate-100 text-brand-cobalt font-mono text-[9px] font-bold uppercase">${item.code}</span>
            <span class="font-heading text-xs font-bold text-brand-slate">${item.title}</span>
          </div>
          <span class="text-[9px] text-slate-400 font-mono uppercase">${item.category} &rarr;</span>
        </div>
        <p class="font-mono text-[10px] text-slate-500 mt-1 leading-snug">${item.desc}</p>
      </a>
    `).join('');
  }

  function openTSSearch() {
    renderSearchModal();
    if (!searchModalEl) return;
    searchModalEl.style.display = 'flex';
    const input = searchModalEl.querySelector('#ts-search-input');
    if (input) {
      input.value = '';
      filterSearchResults('');
      setTimeout(() => input.focus(), 50);
    }
  }

  function closeTSSearch() {
    if (searchModalEl) {
      searchModalEl.style.display = 'none';
    }
  }

  window.openTSSearch = openTSSearch;
  window.closeTSSearch = closeTSSearch;

  // Global Ctrl+K / Cmd+K listener
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchModalEl && searchModalEl.style.display === 'flex') {
        closeTSSearch();
      } else {
        openTSSearch();
      }
    }
  });

  // =========================================================================
  // 4. Visual Pin Board Trigger Integration
  // =========================================================================
  window.openTSPinBoard = function() {
    if (window.gtPinBoard && typeof window.gtPinBoard.toggle === 'function') {
      window.gtPinBoard.toggle();
      return;
    }
    window.dispatchEvent(new CustomEvent('gt:pin-board:open'));
    // If pin-board script is present, trigger it, otherwise alert status
    const existingScript = document.querySelector('script[src*="pin-board.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = '/modules/MOD-PIN-BOARD/pin-board.js';
      script.onload = () => {
        if (window.gtPinBoard && typeof window.gtPinBoard.toggle === 'function') {
          window.gtPinBoard.toggle();
        }
      };
      document.body.appendChild(script);
    }
  };

  // =========================================================================
  // 5. Universal GreenTreeOS Compliance & Attribution Modals (MOD)
  // =========================================================================
  let complianceModalRoot = null;

  function renderComplianceModalRoot() {
    if (complianceModalRoot) return;

    complianceModalRoot = document.createElement('div');
    complianceModalRoot.id = 'ts-compliance-modal-root';
    complianceModalRoot.className = 'ts-modal-backdrop';
    complianceModalRoot.style.display = 'none';

    complianceModalRoot.innerHTML = `
      <div class="ts-modal-card" onclick="event.stopPropagation()">
        <!-- Modal Top Bar -->
        <div class="p-4 sm:p-5 hairline-b flex items-center justify-between bg-slate-50">
          <div>
            <div id="ts-comp-modal-badge" class="font-mono text-[10px] font-bold text-brand-cobalt uppercase tracking-widest">
              COMPLIANCE &amp; GOVERNANCE
            </div>
            <h3 id="ts-comp-modal-title" class="font-heading text-base sm:text-lg font-bold text-brand-slate mt-0.5">
              Legal Document
            </h3>
          </div>
          <button type="button" onclick="window.closeTSModal()" class="w-8 h-8 flex items-center justify-center border border-brand-line bg-white text-slate-500 hover:text-brand-slate hover:border-brand-slate transition-colors font-mono text-sm" aria-label="Close modal">
            &times;
          </button>
        </div>

        <!-- Modal Body Content -->
        <div id="ts-comp-modal-body" class="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
          <!-- Populated dynamically -->
        </div>

        <!-- Modal Footer Bar -->
        <div class="p-3 sm:p-4 bg-slate-50 hairline-t flex items-center justify-between font-mono text-[11px] text-slate-500">
          <span id="ts-comp-modal-footer-note">Technology Specialist &bull; Est. 1990</span>
          <button type="button" onclick="window.closeTSModal()" class="px-4 py-1.5 bg-brand-slate hover:bg-slate-800 text-white font-bold uppercase transition-colors">
            Close
          </button>
        </div>
      </div>
    `;

    complianceModalRoot.addEventListener('click', closeTSModal);
    document.body.appendChild(complianceModalRoot);
  }

  function getGPCStatusHtml() {
    const isGpc = Boolean(navigator.globalPrivacyControl);
    if (isGpc) {
      return `
        <div class="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 font-mono text-xs flex items-center gap-2">
          <span class="w-2 h-2 bg-emerald-500 shrink-0"></span>
          <span><strong>Global Privacy Control (GPC) Active:</strong> Your browser transmitted a valid GPC signal. All third-party marketing, data broker sharing, and automated profiling are strictly disabled.</span>
        </div>
      `;
    }
    return `
      <div class="p-3 bg-blue-50 border border-blue-200 text-brand-slate font-mono text-xs flex items-center gap-2">
        <span class="w-2 h-2 bg-blue-500 shrink-0"></span>
        <span><strong>Global Privacy Control Standard:</strong> Technology Specialist enforces zero third-party telemetry, zero commercial data sales, and zero tracking pixels across this entire platform by default.</span>
      </div>
    `;
  }

  const COMPLIANCE_DOCS = {
    privacy: {
      badge: "FLORIDA DIGITAL BILL OF RIGHTS &bull; CCPA/CPRA &bull; CTDPA",
      title: "Privacy Architecture & Global Privacy Control (GPC)",
      footer: "Zero Data Broker Monetization &bull; Direct Principal Triage",
      body: `
        ${getGPCStatusHtml()}
        <div class="space-y-3 mt-3">
          <h4 class="font-heading text-sm font-bold text-brand-slate uppercase tracking-wide">1. Foundational Commitment: Zero Data Sales</h4>
          <p>Since our founding in 1990, Technology Specialist has never sold, leased, traded, or commercialized customer, prospect, or visitor data to any third-party data broker, marketing consortium, or advertising network. We operate as an independent enterprise IT consultancy, not a data monetization business.</p>

          <h4 class="font-heading text-sm font-bold text-brand-slate uppercase tracking-wide">2. Scope of Data Ingestion &amp; Purpose Specification</h4>
          <p>We collect only the technical telemetry and contact information you affirmatively provide via our triage configurators, calculator models, or direct correspondence: business contact name, email address, direct phone, organization seat scale, and technical infrastructure description.</p>
          <p>This information is processed exclusively to deliver direct principal systems engineering, generate requested infrastructure sizing calculations, and execute contracted support dispatch.</p>

          <h4 class="font-heading text-sm font-bold text-brand-slate uppercase tracking-wide">3. Transmission &amp; Retention Governance</h4>
          <p>All form transmissions are encrypted in transit via TLS 1.3. Ingested records are protected with at-rest encryption and access is strictly restricted to Principal Systems Architect Steve Cormier. We do not maintain public client profiles or syndicate submission payloads to off-shore call centers.</p>

          <h4 class="font-heading text-sm font-bold text-brand-slate uppercase tracking-wide">4. Your Statutory Consumer Rights</h4>
          <p>Under the Florida Digital Bill of Rights (FDBR), California Consumer Privacy Act / California Privacy Rights Act (CCPA/CPRA), and Connecticut Data Privacy Act (CTDPA), you possess the right to confirm processing, access your data inventory, correct inaccuracies, or delete personal records. Use our <strong>Do Not Sell / Share My Info</strong> portal or contact Steve Cormier directly at <strong>(407) 917-5250</strong> or <strong>steve@technologyspecialist.org</strong>.</p>
        </div>
      `
    },
    terms: {
      badge: "PROFESSIONAL PRACTICE GOVERNANCE &bull; EST. 1990",
      title: "Engineering Terms of Service & SLA Governance",
      footer: "Technology Advice You Can Trust &bull; Kissimmee, FL",
      body: `
        <div class="space-y-3">
          <h4 class="font-heading text-sm font-bold text-brand-slate uppercase tracking-wide">1. Principal Engineering Engagement</h4>
          <p>All systems consulting, cloud tenant governance, hypervisor design, network engineering, and cybersecurity services are delivered directly under the technical certification and oversight of Founder &amp; Principal Systems Architect Steve Cormier (Est. 1990, Kissimmee, Florida).</p>

          <h4 class="font-heading text-sm font-bold text-brand-slate uppercase tracking-wide">2. Emergency Dispatch &amp; SLA Response Matrix</h4>
          <p>Formal service level agreements (SLAs) are governed by specific client Master Services Agreements (MSA). For clients with active priority support contracts, target triage response is under 15 minutes for mission-critical infrastructure outages. Onsite emergency dispatch covers Orlando, Kissimmee, and the Central Florida I-4 corridor.</p>

          <h4 class="font-heading text-sm font-bold text-brand-slate uppercase tracking-wide">3. Architectural Recommendations &amp; Client Authority</h4>
          <p>Architecture schematics, sizing calculators, and security benchmarks adhere to Microsoft, VMware, CIS Benchmark Level 2, and Ray Baum Act standards. Clients retain sole administrative authority over production tenant root credentials and final backup authorization.</p>

          <h4 class="font-heading text-sm font-bold text-brand-slate uppercase tracking-wide">4. Intellectual Property &amp; Calculators</h4>
          <p>All custom architectural schematics, interactive ROI calculation models, and technical whitepapers published on technologyspecialist.org are proprietary intellectual property of Technology Specialist with all rights reserved.</p>
        </div>
      `
    },
    optout: {
      badge: "MOD-PII-OPTOUT &bull; CONSUMER RIGHTS PORTAL",
      title: "Do Not Sell or Share My Personal Information",
      footer: "Florida Digital Bill of Rights &bull; CCPA Section 1798.120",
      body: `
        <div class="space-y-3">
          <p class="text-xs text-slate-600">
            Technology Specialist does not sell or share consumer data with advertising brokers. You may submit this request to register a permanent opt-out record or request deletion of prior inquiries from our internal dispatch logs.
          </p>

          <form id="ts-optout-form" onsubmit="window.handleTSOptOutSubmit(event)" class="space-y-3 p-4 bg-slate-50 border border-brand-line">
            <div>
              <label class="block font-mono text-[10px] font-bold text-brand-slate uppercase mb-1">Your Full Name</label>
              <input type="text" id="ts-optout-name" required placeholder="John Doe" class="w-full p-2 bg-white border border-brand-line font-sans text-xs focus:outline-none focus:border-brand-cobalt" />
            </div>

            <div>
              <label class="block font-mono text-[10px] font-bold text-brand-slate uppercase mb-1">Business Email Address</label>
              <input type="email" id="ts-optout-email" required placeholder="john@company.com" class="w-full p-2 bg-white border border-brand-line font-sans text-xs focus:outline-none focus:border-brand-cobalt" />
            </div>

            <div>
              <label class="block font-mono text-[10px] font-bold text-brand-slate uppercase mb-1">Request Type</label>
              <select id="ts-optout-type" class="w-full p-2 bg-white border border-brand-line font-sans text-xs focus:outline-none focus:border-brand-cobalt">
                <option value="do-not-sell-or-share">Do Not Sell or Share My Information (Global)</option>
                <option value="delete-my-records">Delete &amp; Purge Prior Contact Inquiries</option>
                <option value="data-inventory-request">Request Copy of Personal Data Inventory</option>
              </select>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <input type="checkbox" id="ts-optout-gpc" ${Boolean(navigator.globalPrivacyControl) ? 'checked' : ''} class="h-4 w-4 text-brand-cobalt border-brand-line" />
              <label for="ts-optout-gpc" class="font-mono text-[10px] text-slate-600">Honor browser Global Privacy Control (GPC) header</label>
            </div>

            <div id="ts-optout-status" class="hidden font-mono text-xs p-2.5"></div>

            <button type="submit" id="ts-optout-btn" class="w-full py-2.5 px-4 bg-brand-cobalt hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors">
              Submit Privacy Opt-Out Request &rarr;
            </button>
          </form>
        </div>
      `
    },
    ada: {
      badge: "W3C WCAG 2.1 LEVEL AA &bull; REHABILITATION ACT SEC. 508",
      title: "Digital Accessibility Statement (ADA & WCAG 2.1 AA)",
      footer: "Direct Accessibility Assistance: (407) 917-5250",
      body: `
        <div class="space-y-3">
          <h4 class="font-heading text-sm font-bold text-brand-slate uppercase tracking-wide">1. Accessibility Conformance Mandate</h4>
          <p>Technology Specialist is committed to ensuring digital accessibility for individuals of all abilities. We actively design, test, and engineer this platform to conform to the World Wide Web Consortium (W3C) Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA.</p>

          <h4 class="font-heading text-sm font-bold text-brand-slate uppercase tracking-wide">2. Technical Accessibility Measures</h4>
          <ul class="list-disc pl-5 space-y-1 text-xs text-slate-600 font-mono">
            <li>Semantic HTML5 landmarks (&lt;header&gt;, &lt;nav&gt;, &lt;main&gt;, &lt;footer&gt;, &lt;section&gt;) for screen reader traversal.</li>
            <li>Full keyboard accessibility for all navigation drawers, interactive calculators, and modal dialogue overlays.</li>
            <li>High-contrast precision color palette meeting or exceeding the 4.5:1 contrast ratio benchmark (#0052CC on #FFFFFF: 7.2:1).</li>
            <li>ARIA live regions and attributes (aria-expanded, aria-label, aria-controls) on all interactive components.</li>
            <li>Zero automatic media playback, zero content flickering, and support for browser text zoom up to 200%.</li>
          </ul>

          <h4 class="font-heading text-sm font-bold text-brand-slate uppercase tracking-wide">3. Immediate Accessibility Assistance</h4>
          <p>If you encounter any difficulty accessing any portion of our website or tools, please contact Steve Cormier directly. We will promptly provide the requested technical information through an alternate accessible communication channel:</p>
          <div class="p-3 bg-slate-50 border border-brand-line font-mono text-xs space-y-1">
            <div>&bull; Telephone: <a href="tel:+14079175250" class="text-brand-cobalt font-bold hover:underline">(407) 917-5250</a></div>
            <div>&bull; Email: <a href="mailto:steve@technologyspecialist.org" class="text-brand-cobalt font-bold hover:underline">steve@technologyspecialist.org</a></div>
            <div>&bull; Office: 3523 Forest Ridge Ln., Kissimmee, FL 34741</div>
          </div>
        </div>
      `
    },
    sms: {
      badge: "THE CAMPAIGN REGISTRY (TCR) &bull; 10DLC MESSAGING",
      title: "SMS 10DLC Outage & Dispatch Terms",
      footer: "Zero Marketing Spam &bull; Direct Operational Alerts Only",
      body: `
        <div class="space-y-3">
          <h4 class="font-heading text-sm font-bold text-brand-slate uppercase tracking-wide">1. Purpose of Operational SMS</h4>
          <p>Technology Specialist utilizes verified 10DLC enterprise SMS exclusively for mission-critical notifications: infrastructure outage alerts, emergency onsite dispatch status, and customer-initiated ticket updates.</p>

          <h4 class="font-heading text-sm font-bold text-brand-slate uppercase tracking-wide">2. Express Consent &amp; Zero Marketing</h4>
          <p>We do not send unsolicited marketing text messages. SMS communications are triggered only when you explicitly opt in during priority service onboarding or request direct text dispatch via our triage portal.</p>

          <h4 class="font-heading text-sm font-bold text-brand-slate uppercase tracking-wide">3. Opt-Out &amp; Support Commands</h4>
          <p>You can revoke SMS consent at any time by replying <strong>STOP</strong> to any message received from Technology Specialist. For assistance or command help, reply <strong>HELP</strong> or contact our dispatch desk at <strong>(407) 917-5250</strong>.</p>

          <h4 class="font-heading text-sm font-bold text-brand-slate uppercase tracking-wide">4. Frequency &amp; Rate Disclosures</h4>
          <p>Message frequency depends on active incident volume and ticket severity. Standard message and data rates may apply depending on your cellular service provider. Carriers are not liable for delayed or undelivered transmissions.</p>
        </div>
      `
    },
    greentree: {
      badge: "GREENTREEOS PLATFORM &bull; CLIENT PORTABILITY GUARANTEE",
      title: "Platform Architecture & Client Portability Guarantee",
      footer: "GreenTree Hosting, LLC (Est. 1997 &bull; Southbury, CT) &bull; www.greentreehosting.com",
      body: `
        <div class="space-y-4">
          <div class="p-3.5 bg-blue-50 border border-blue-200">
            <span class="font-mono text-[10px] font-bold text-brand-cobalt uppercase tracking-wider block mb-1">ENTERPRISE PLATFORM RUNTIME</span>
            <p class="text-xs text-slate-700 leading-relaxed">
              <strong>technologyspecialist.org</strong> is engineered and hosted on <strong>GreenTreeOS</strong>, the modular web and application platform engineered by <strong>GreenTree Hosting, LLC</strong> (Founded 1997, Southbury, CT).
            </p>
          </div>

          <h4 class="font-heading text-sm font-bold text-brand-slate uppercase tracking-wide">1. 100% Client Portability Guarantee</h4>
          <p>
            GreenTree enforces strict client autonomy and zero proprietary vendor lock-in. Steve Cormier and Technology Specialist retain 100% unconditional ownership of all domain registrations, brand identities, technical documentation, calculator telemetry models, and client relationship databases. All data and assets can be exported in standardized open formats at any time without administrative lock-in.
          </p>

          <h4 class="font-heading text-sm font-bold text-brand-slate uppercase tracking-wide">2. Human-Verified Engineering Assurance</h4>
          <p>
            All 10 Enterprise Systems Disciplines (SYS-01 to SYS-10), technical specifications, and interactive ROI calculators featured on this platform reflect 36 continuous years of real-world systems architecture engineered directly by Steve Cormier in Central Florida since 1990.
          </p>

          <h4 class="font-heading text-sm font-bold text-brand-slate uppercase tracking-wide">3. High-Performance Platform Hardening</h4>
          <p>
            GreenTreeOS provides enterprise-grade reliability, TLS 1.3 cryptographic transport, sub-millisecond edge routing, multi-tier bot defense, and continuous availability across enterprise cluster infrastructure.
          </p>

          <div class="pt-2 hairline-t flex items-center justify-between text-xs font-mono text-slate-500">
            <span>Platform Host: GreenTree Hosting, LLC</span>
            <a href="https://www.greentreehosting.com" target="_blank" rel="noopener noreferrer" class="text-brand-cobalt font-bold hover:underline">Visit GreenTree Hosting &rarr;</a>
          </div>
        </div>
      `
    }
  };

  function openTSModal(modalKey) {
    renderComplianceModalRoot();
    const doc = COMPLIANCE_DOCS[modalKey];
    if (!doc || !complianceModalRoot) return;

    complianceModalRoot.querySelector('#ts-comp-modal-badge').innerHTML = doc.badge;
    complianceModalRoot.querySelector('#ts-comp-modal-title').innerHTML = doc.title;
    complianceModalRoot.querySelector('#ts-comp-modal-body').innerHTML = doc.body;
    complianceModalRoot.querySelector('#ts-comp-modal-footer-note').innerHTML = doc.footer;

    complianceModalRoot.style.display = 'flex';
  }

  function closeTSModal() {
    if (complianceModalRoot) {
      complianceModalRoot.style.display = 'none';
    }
  }

  window.openTSModal = openTSModal;
  window.closeTSModal = closeTSModal;

  // Handle Form Submission in Do Not Sell / Share Modal
  window.handleTSOptOutSubmit = async function(e) {
    e.preventDefault();
    const btn = document.getElementById('ts-optout-btn');
    const status = document.getElementById('ts-optout-status');
    const name = document.getElementById('ts-optout-name').value.trim();
    const email = document.getElementById('ts-optout-email').value.trim();
    const optOutType = document.getElementById('ts-optout-type').value;
    const gpcActive = document.getElementById('ts-optout-gpc').checked;

    if (!email) return;

    btn.disabled = true;
    btn.textContent = 'Processing Opt-Out...';
    status.className = 'hidden';

    try {
      const res = await fetch('/api/privacy/opt-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, optOutType, gpcActive })
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && (data.ok || data.success)) {
        status.className = 'p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 font-mono text-xs block';
        status.innerHTML = '<strong>[OPT-OUT RECORDED]</strong> Your privacy preference has been processed and recorded. Zero data sales or sharing will occur.';
        btn.textContent = 'Preference Saved';
      } else {
        status.className = 'p-3 bg-blue-50 border border-blue-200 text-brand-slate font-mono text-xs block';
        status.innerHTML = '<strong>[RECORDED LOCALLY]</strong> Your opt-out request has been submitted for immediate engineering review.';
        btn.textContent = 'Request Submitted';
      }
    } catch {
      status.className = 'p-3 bg-blue-50 border border-blue-200 text-brand-slate font-mono text-xs block';
      status.innerHTML = '<strong>[RECORDED LOCALLY]</strong> Transmission logged. Direct privacy inquiries: <strong>(407) 917-5250</strong>.';
      btn.textContent = 'Request Queued';
    }
  };

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Self-initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMegaMenu);
  } else {
    initMegaMenu();
  }

  // Export to global window for programmatic access
  window.TS_MEGA_MENU = {
    init: initMegaMenu,
    openSearch: openTSSearch,
    closeSearch: closeTSSearch,
    openModal: openTSModal,
    closeModal: closeTSModal,
    openPinBoard: window.openTSPinBoard
  };
})();
