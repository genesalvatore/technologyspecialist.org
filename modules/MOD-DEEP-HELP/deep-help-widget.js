/**
 * MOD-DEEP-HELP + MOD-AI-CONCIERGE - Dual-Mode Embeddable Widget
 *
 * 1. Public Visitor Mode (`data-user-role="visitor"` or public website pages):
 *    - Positions a site-branded floating Concierge launcher in the lower-right (`bottom: 24px; right: 24px`).
 *    - Opens directly in a compact lower-right Live Chat Drawer (`390px x 560px`) with zero internal Site Owner Docs,
 *      zero Pinboard/Leads/Social Command references, and zero internal daily cap (`48/50`) exposure.
 *    - Uses a per-visitor Consultation Session Counter (`visitorRemaining` / `visitorLimit`) that guides prospective
 *      customers to request an estimate or call the business directly after their complimentary Q&A turns.
 *
 * 2. Site Owner / Admin Portal Mode (`data-user-role="admin"` | `"owner"` or inside `/portal` | `/admin`):
 *    - Opens the full Site Owner Help Center & Multi-Level Documentation modal + Admin AI Co-Pilot.
 */
(function () {
  if (typeof window === 'undefined' || window.__GT_DEEP_HELP_LOADED__) return;
  window.__GT_DEEP_HELP_LOADED__ = true;

  const scriptEl = document.currentScript || document.querySelector('script[src*="deep-help.js"]');
  const attr = (name) => (scriptEl && scriptEl.getAttribute(name)) || '';

  const siteKey = attr('data-site-key') || window.GT_SITE_KEY || 'greentreehosting-board';
  const rawRole = (attr('data-user-role') || window.GT_USER_ROLE || '').toLowerCase().trim();
  const pathName = (window.location && window.location.pathname) || '/';
  const isPortalPath = /^\/(portal|admin|dashboard|command)/i.test(pathName) || window.location.hostname === 'command.greentreehosting.com';
  const isPublicVisitor = rawRole === 'visitor' || (rawRole !== 'admin' && rawRole !== 'owner' && !isPortalPath);
  const userRole = isPublicVisitor ? 'visitor' : (rawRole || 'admin');

  const pinboardAccess = (attr('data-pinboard-access') || 'true') !== 'false';
  const commandHost = attr('data-command-host') || 'https://command.greentreehosting.com';

  let catalogData = null;
  let aiProfile = null;
  let activeTopicId = 'getting-started';
  let viewMode = isPublicVisitor ? 'ai' : 'summary';
  let searchQuery = '';
  let chatMessages = [];
  let chatLoading = false;
  let isDrawerOpen = false;
  let localVisitorLimit = 6;
  let localVisitorUsed = 0;

  // v1.4 State: 'full' (pill), 'mini' (tiny 38px orb), or 'closed' (hidden completely until reopened via menu)
  const posStorageKey = `gt_concierge_pos_${siteKey}`;
  const stateStorageKey = `gt_concierge_state_${siteKey}`;
  let fabState = 'full';
  try {
    const savedState = sessionStorage.getItem(stateStorageKey) || localStorage.getItem(stateStorageKey);
    if (savedState === 'mini' || savedState === 'closed' || savedState === 'full') {
      fabState = savedState;
    } else if (typeof window !== 'undefined' && window.innerWidth <= 640) {
      // Default to compact mini-orb on small mobile screens or keep full with 1-tap minimize
      fabState = attr('data-mobile-default') === 'mini' ? 'mini' : 'full';
    }
  } catch (e) {}

  let customPos = null; // { right: px, bottom: px }
  try {
    const rawPos = localStorage.getItem(posStorageKey);
    if (rawPos) {
      const parsed = JSON.parse(rawPos);
      if (parsed && typeof parsed.right === 'number' && typeof parsed.bottom === 'number') {
        customPos = parsed;
      }
    }
  } catch (e) {}

  function setFabState(nextState) {
    fabState = nextState;
    try {
      sessionStorage.setItem(stateStorageKey, nextState);
      if (nextState === 'mini' || nextState === 'full') {
        localStorage.setItem(stateStorageKey, nextState);
      }
    } catch (e) {}
    updateFabBranding();
  }

  function escHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatInlineMarkdown(raw) {
    let s = escHtml(raw)
      .replace(/\s*\u2014\s*/g, ' - ')
      .replace(/\bSovereign\s+/gi, '');
    s = s.replace(/`([^`]+)`/g, '<code style="background:#f1f5f9;color:#0f172a;padding:1px 5px;border-radius:4px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;">$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong style="font-weight:700;color:#0f172a;">$1</strong>');
    s = s.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,!?:;]|$)/g, '$1<em>$2</em>');
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g, '<a href="$2" style="color:#059669;font-weight:700;text-decoration:underline;">$1</a>');
    return s;
  }

  function formatChatMarkdown(text) {
    if (!text) return '';
    const cleaned = String(text)
      .replace(/\r\n/g, '\n')
      .replace(/\s*\u2014\s*/g, ' - ')
      .replace(/\bSovereign\s+/gi, '');
    const lines = cleaned.split('\n');
    const out = [];
    let inUl = false;
    let inOl = false;

    const closeLists = () => {
      if (inUl) { out.push('</ul>'); inUl = false; }
      if (inOl) { out.push('</ol>'); inOl = false; }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        closeLists();
        continue;
      }

      const hMatch = line.match(/^(#{1,4})\s+(.+)$/);
      if (hMatch) {
        closeLists();
        out.push(`<div style="font-weight:800;font-size:13.5px;color:#0f172a;margin:8px 0 4px;">${formatInlineMarkdown(hMatch[2])}</div>`);
        continue;
      }

      const ulMatch = line.match(/^([*\-\u2022])\s+(.+)$/);
      if (ulMatch) {
        if (inOl) { out.push('</ol>'); inOl = false; }
        if (!inUl) {
          out.push('<ul style="margin:6px 0;padding-left:18px;list-style-type:disc;">');
          inUl = true;
        }
        out.push(`<li style="margin-bottom:5px;line-height:1.48;">${formatInlineMarkdown(ulMatch[2])}</li>`);
        continue;
      }

      const olMatch = line.match(/^(\d+)\.\s+(.+)$/);
      if (olMatch) {
        if (inUl) { out.push('</ul>'); inUl = false; }
        if (!inOl) {
          out.push('<ol style="margin:6px 0;padding-left:18px;list-style-type:decimal;">');
          inOl = true;
        }
        out.push(`<li style="margin-bottom:5px;line-height:1.48;">${formatInlineMarkdown(olMatch[2])}</li>`);
        continue;
      }

      closeLists();
      out.push(`<div style="margin-bottom:7px;line-height:1.52;">${formatInlineMarkdown(line)}</div>`);
    }

    closeLists();
    return out.join('');
  }

  // Domain-appropriate custom vector icons (zero generic robot emojis on public sites)
  function getSvgIcon(iconType, accentColor) {
    const stroke = accentColor || 'currentColor';
    switch (iconType) {
      case 'tree-shield':
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-7"/><path d="M9 15c-3 0-5-2-5-5 0-2.2 1.5-4.1 3.5-4.7C8.2 3.4 9.9 2 12 2s3.8 1.4 4.5 3.3C18.5 5.9 20 7.8 20 10c0 3-2 5-5 5H9z"/><path d="M8 22h8"/></svg>`;
      case 'bolt-shield':
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`;
      case 'cloud-nodes':
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><circle cx="12" cy="13" r="1.5"/></svg>`;
      case 'compass-star':
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`;
      case 'radar-shield':
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="3"/></svg>`;
      case 'lock-shield':
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>`;
      default:
        return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`;
    }
  }

  // Detect host page brand colors and title if not explicitly configured
  function detectHostPageBrand() {
    let detectedPrimary = '';
    let detectedAccent = '';
    try {
      const rootStyle = getComputedStyle(document.documentElement);
      const cssCandidates = ['--brand-primary', '--primary', '--color-primary', '--forest', '--navy'];
      for (const v of cssCandidates) {
        const val = rootStyle.getPropertyValue(v).trim();
        if (val && val.startsWith('#')) { detectedPrimary = val; break; }
      }
      const accentCandidates = ['--brand-accent', '--accent', '--gold', '--color-accent'];
      for (const v of accentCandidates) {
        const val = rootStyle.getPropertyValue(v).trim();
        if (val && val.startsWith('#')) { detectedAccent = val; break; }
      }
      if (!detectedPrimary) {
        const headerEl = document.querySelector('header, nav, .navbar');
        if (headerEl) {
          const bg = getComputedStyle(headerEl).backgroundColor;
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent' && bg !== 'rgb(255, 255, 255)') {
            detectedPrimary = bg;
          }
        }
      }
    } catch (e) {}
    const rawDocTitle = (document.title || '').split(/[| - –·-]/)[0].trim();
    return {
      brandPrimary: detectedPrimary || '#0F172A',
      brandAccent: detectedAccent || '#10B981',
      pageTitle: rawDocTitle || 'Project Concierge'
    };
  }

  function resolveTheme() {
    const hostBrand = detectHostPageBrand();
    const serverTheme = (aiProfile && aiProfile.theme) || {};
    const isMorningStar = siteKey.includes('morningstar') || (window.location.hostname || '').includes('morningstartree');

    const brandPrimary =
      attr('data-brand-primary') ||
      attr('data-brand-color') ||
      serverTheme.brandPrimary ||
      (isMorningStar ? '#091E16' : hostBrand.brandPrimary);

    const brandAccent =
      attr('data-brand-accent') ||
      serverTheme.brandAccent ||
      (isMorningStar ? '#C59B27' : hostBrand.brandAccent);

    const surfaceBg =
      attr('data-surface-bg') ||
      serverTheme.surfaceBg ||
      (isMorningStar ? '#FAF7F2' : '#F8FAFC');

    const rawFabEyebrow =
      attr('data-fab-eyebrow') ||
      serverTheme.fabEyebrow ||
      (isMorningStar ? '24/7 Arborist Chat' : 'Online Concierge');
    const fabEyebrow = String(rawFabEyebrow).replace(/\bSovereign\b/gi, 'Enterprise').replace(/\s+/g, ' ').trim();

    const rawFabLabel =
      attr('data-fab-label') ||
      serverTheme.fabLabel ||
      (isMorningStar ? 'Ask 1-888-TREE-DOC' : 'Ask a Question');
    const fabLabel = String(rawFabLabel).replace(/\bSovereign\b/gi, 'Enterprise').replace(/\s+/g, ' ').trim();

    const rawHeaderTitle =
      attr('data-brand-name') ||
      serverTheme.headerTitle ||
      (isMorningStar ? 'Morning Star Tree Company Inc.' : (aiProfile && aiProfile.siteTitle) || hostBrand.pageTitle);
    const headerTitle = String(rawHeaderTitle).replace(/\bSovereign\b/gi, 'Enterprise').replace(/\s+/g, ' ').trim();

    const headerSubtitle =
      attr('data-header-subtitle') ||
      serverTheme.headerSubtitle ||
      (isMorningStar ? 'Est. 1980 · Crane Tree Removal, Pruning & 24/7 Storm Dispatch' : 'Instant Service Answers & Priority Estimate Intake');

    const iconType =
      attr('data-fab-icon') ||
      serverTheme.iconType ||
      (isMorningStar ? 'tree-shield' : 'chat-spark');

    const logoUrl =
      attr('data-logo-url') ||
      serverTheme.logoUrl ||
      (isMorningStar ? 'https://whereismorningstartree.com/assets/images/morningstar-crest-emblem.jpg' : '');

    const directPhone =
      attr('data-direct-phone') ||
      serverTheme.directPhone ||
      (isMorningStar ? '1-888-TREE-DOC (888-873-3362)' : '');

    const directPhoneHref =
      attr('data-direct-phone-href') ||
      serverTheme.directPhoneHref ||
      (isMorningStar ? 'tel:18888733362' : '');

    const ctaLabel =
      attr('data-cta-label') ||
      serverTheme.ctaLabel ||
      (isMorningStar ? 'Request Free Tree Estimate →' : 'Request Estimate / Contact Us →');

    const ctaHref = attr('data-cta-href') || serverTheme.ctaHref || '';
    const ctaSelector = attr('data-cta-selector') || serverTheme.ctaSelector || '#estimate, #quote, #contact, form';

    return {
      brandPrimary,
      brandAccent,
      surfaceBg,
      fabEyebrow,
      fabLabel,
      headerTitle,
      headerSubtitle,
      iconType,
      logoUrl,
      directPhone,
      directPhoneHref,
      ctaLabel,
      ctaHref,
      ctaSelector
    };
  }

  const style = document.createElement('style');
  style.textContent = `
    .gt-dh-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99998;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px 8px 8px;
      border-radius: 999px;
      background: var(--gt-brand-primary, #0F172A);
      color: #ffffff;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      border: 1.5px solid var(--gt-brand-accent, #C59B27);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.32), 0 0 0 1px rgba(255, 255, 255, 0.08) inset;
      cursor: pointer;
      transition: box-shadow 0.18s ease, opacity 0.18s ease;
      text-align: left;
      user-select: none;
      -webkit-user-select: none;
      touch-action: none;
    }
    .gt-dh-fab:hover {
      box-shadow: 0 16px 38px rgba(0, 0, 0, 0.44);
    }
    .gt-dh-fab.gt-dh-dragging,
    .gt-dh-visitor-drawer.gt-dh-dragging {
      transition: none !important;
      cursor: grabbing !important;
    }
    .gt-dh-fab.gt-dh-state-closed,
    .gt-dh-fab.gt-dh-hidden-by-menu {
      display: none !important;
    }
    .gt-dh-fab.gt-dh-state-mini {
      padding: 5px;
      gap: 0;
      border-radius: 999px;
    }
    .gt-dh-grab-handle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 28px;
      border-radius: 6px;
      color: rgba(255, 255, 255, 0.65);
      cursor: grab;
      flex-shrink: 0;
      transition: background 0.15s ease, color 0.15s ease;
    }
    .gt-dh-grab-handle:hover {
      background: rgba(255, 255, 255, 0.14);
      color: #ffffff;
    }
    .gt-dh-grab-handle:active {
      cursor: grabbing;
    }
    .gt-dh-fab-main {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      cursor: pointer;
      padding-right: 4px;
    }
    .gt-dh-fab-badge {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid var(--gt-brand-accent, #C59B27);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
    }
    .gt-dh-fab.gt-dh-state-mini .gt-dh-fab-badge {
      width: 36px;
      height: 36px;
    }
    .gt-dh-fab-dot {
      position: absolute;
      bottom: -1px;
      right: -1px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #22c55e;
      border: 2px solid var(--gt-brand-primary, #0F172A);
    }
    .gt-dh-fab-text {
      display: flex;
      flex-direction: column;
      line-height: 1.15;
    }
    .gt-dh-fab-eyebrow {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--gt-brand-accent, #C59B27);
    }
    .gt-dh-fab-label {
      font-size: 12.5px;
      font-weight: 800;
      color: #ffffff;
      margin-top: 2px;
      white-space: nowrap;
    }
    .gt-dh-fab-controls {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      margin-left: 2px;
      padding-left: 6px;
      border-left: 1px solid rgba(255, 255, 255, 0.18);
    }
    .gt-dh-fab-ctrl-btn {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.22);
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.9);
      font-size: 11px;
      font-weight: 800;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
      transition: background 0.15s ease, transform 0.15s ease;
    }
    .gt-dh-fab-ctrl-btn:hover {
      background: rgba(255, 255, 255, 0.25);
      color: #ffffff;
      transform: scale(1.08);
    }
    .gt-dh-mini-close {
      position: absolute;
      top: -5px;
      right: -5px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #0f172a;
      color: #ffffff;
      border: 1px solid rgba(255,255,255,0.45);
      font-size: 9px;
      font-weight: 800;
      display: none;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
      box-shadow: 0 2px 6px rgba(0,0,0,0.35);
    }
    .gt-dh-fab.gt-dh-state-mini:hover .gt-dh-mini-close {
      display: inline-flex;
    }
    .gt-dh-drawer-grab-bar {
      width: 100%;
      padding: 6px 12px 2px;
      cursor: grab;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      user-select: none;
      -webkit-user-select: none;
      touch-action: none;
    }
    .gt-dh-drawer-grab-bar:active {
      cursor: grabbing;
    }
    .gt-dh-drawer-grab-pill {
      width: 44px;
      height: 4px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.42);
      transition: background 0.15s ease, width 0.15s ease;
    }
    .gt-dh-drawer-grab-bar:hover .gt-dh-drawer-grab-pill {
      background: rgba(255, 255, 255, 0.78);
      width: 54px;
    }
    .gt-dh-visitor-drawer {
      position: fixed;
      bottom: 84px;
      right: 24px;
      width: 392px;
      max-width: calc(100vw - 24px);
      height: 560px;
      max-height: calc(100vh - 110px);
      z-index: 99999;
      background: #ffffff;
      color: #0f172a;
      border-radius: 18px;
      border: 1px solid rgba(15, 23, 42, 0.14);
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.32), 0 4px 16px rgba(0, 0, 0, 0.12);
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .gt-dh-visitor-drawer.open {
      display: flex;
      animation: gtDhSlideUp 0.18s ease-out;
    }
    @keyframes gtDhSlideUp {
      from { opacity: 0; transform: translateY(12px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .gt-dh-starter-chip {
      text-align: left;
      padding: 8px 12px;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #1e293b;
      font-size: 12px;
      font-weight: 600;
      line-height: 1.35;
      cursor: pointer;
      transition: border-color 0.15s ease, background 0.15s ease;
    }
    .gt-dh-starter-chip:hover {
      border-color: var(--gt-brand-primary, #0F172A);
      background: #f8fafc;
    }
    .gt-dh-backdrop {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(9, 13, 24, 0.76);
      backdrop-filter: blur(6px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 24px;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .gt-dh-backdrop.open { display: flex; }
    .gt-dh-modal {
      width: 100%;
      max-width: 1220px;
      height: 86vh;
      background: #ffffff;
      color: #1e293b;
      border-radius: 16px;
      box-shadow: 0 25px 70px rgba(0,0,0,0.45);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    @media (max-width: 767px) {
      .gt-dh-fab {
        bottom: 72px;
        right: 12px;
        padding: 6px 8px 6px 6px;
      }
      .gt-dh-visitor-drawer {
        bottom: 72px;
        right: 10px;
        width: calc(100vw - 20px);
        max-width: 400px;
        height: calc(100vh - 96px);
        max-height: 520px;
      }
    }
  `;
  document.head.appendChild(style);

  const fab = document.createElement('div');
  fab.className = 'gt-dh-fab';
  fab.setAttribute('role', 'button');
  fab.setAttribute('tabindex', '0');
  fab.setAttribute('aria-label', 'Open Concierge Chat');

  const visitorDrawer = document.createElement('div');
  visitorDrawer.className = 'gt-dh-visitor-drawer';

  const backdrop = document.createElement('div');
  backdrop.className = 'gt-dh-backdrop';

  function applyPositionStyles() {
    if (customPos && typeof customPos.right === 'number' && typeof customPos.bottom === 'number') {
      const maxRight = Math.max(8, (window.innerWidth || 360) - 56);
      const maxBottom = Math.max(8, (window.innerHeight || 640) - 56);
      const clampedRight = Math.min(Math.max(8, customPos.right), maxRight);
      const clampedBottom = Math.min(Math.max(8, customPos.bottom), maxBottom);
      fab.style.right = `${clampedRight}px`;
      fab.style.bottom = `${clampedBottom}px`;
      fab.style.left = 'auto';
      fab.style.top = 'auto';

      const drawerRight = Math.min(Math.max(8, clampedRight), Math.max(8, (window.innerWidth || 360) - 320));
      const drawerBottom = Math.min(Math.max(64, clampedBottom + 54), Math.max(64, (window.innerHeight || 640) - 240));
      visitorDrawer.style.right = `${drawerRight}px`;
      visitorDrawer.style.bottom = `${drawerBottom}px`;
      visitorDrawer.style.left = 'auto';
      visitorDrawer.style.top = 'auto';
    } else {
      fab.style.right = '';
      fab.style.bottom = '';
      fab.style.left = '';
      fab.style.top = '';
      visitorDrawer.style.right = '';
      visitorDrawer.style.bottom = '';
      visitorDrawer.style.left = '';
      visitorDrawer.style.top = '';
    }
  }

  function getGripDotsSvg() {
    return `<svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor" aria-hidden="true"><circle cx="3" cy="3" r="1.3"/><circle cx="7" cy="3" r="1.3"/><circle cx="3" cy="8" r="1.3"/><circle cx="7" cy="8" r="1.3"/><circle cx="3" cy="13" r="1.3"/><circle cx="7" cy="13" r="1.3"/></svg>`;
  }

  function updateFabBranding() {
    const t = resolveTheme();
    document.documentElement.style.setProperty('--gt-brand-primary', t.brandPrimary);
    document.documentElement.style.setProperty('--gt-brand-accent', t.brandAccent);
    fab.style.background = t.brandPrimary;
    fab.style.borderColor = t.brandAccent;

    fab.classList.toggle('gt-dh-state-mini', isPublicVisitor && fabState === 'mini');
    fab.classList.toggle('gt-dh-state-closed', isPublicVisitor && fabState === 'closed');
    applyPositionStyles();

    if (isPublicVisitor && fabState === 'mini') {
      fab.innerHTML = `
        <span class="gt-dh-grab-handle" data-gt-drag-handle="true" title="Drag to move icon" style="width:12px;height:24px;">
          ${getGripDotsSvg()}
        </span>
        <span class="gt-dh-fab-main" data-fab-action="open" title="${escHtml(t.fabLabel)} (Click to open)">
          <span class="gt-dh-fab-badge" style="border-color:${escHtml(t.brandAccent)};">
            ${getSvgIcon(t.iconType, t.brandAccent)}
            <span class="gt-dh-fab-dot" style="border-color:${escHtml(t.brandPrimary)};"></span>
          </span>
        </span>
        <button type="button" class="gt-dh-mini-close" data-fab-action="close" title="Close chat button (Reopen anytime from site menu)" aria-label="Close chat button">✕</button>
      `;
    } else {
      fab.innerHTML = `
        <span class="gt-dh-grab-handle" data-gt-drag-handle="true" title="Grab bar: drag to move chat button">
          ${getGripDotsSvg()}
        </span>
        <span class="gt-dh-fab-main" data-fab-action="open">
          <span class="gt-dh-fab-badge" style="border-color:${escHtml(t.brandAccent)};">
            ${getSvgIcon(t.iconType, t.brandAccent)}
            <span class="gt-dh-fab-dot" style="border-color:${escHtml(t.brandPrimary)};"></span>
          </span>
          <span class="gt-dh-fab-text">
            <span class="gt-dh-fab-eyebrow" style="color:${escHtml(t.brandAccent)};">${escHtml(t.fabEyebrow)}</span>
            <span class="gt-dh-fab-label">${escHtml(t.fabLabel)}</span>
          </span>
        </span>
        ${isPublicVisitor ? `
          <span class="gt-dh-fab-controls">
            <button type="button" class="gt-dh-fab-ctrl-btn" data-fab-action="mini" title="Minimize to small icon" aria-label="Minimize chat button">–</button>
            <button type="button" class="gt-dh-fab-ctrl-btn" data-fab-action="close" title="Close chat completely (Reopen from menu)" aria-label="Close chat button">✕</button>
          </span>
        ` : ''}
      `;
    }
    injectMenuReopenLinks();
  }

  function triggerContactCta() {
    const t = resolveTheme();
    if (t.ctaHref) {
      window.location.href = t.ctaHref;
      return;
    }
    const selectors = (t.ctaSelector || '#estimate, #quote, #contact, form').split(',').map((s) => s.trim());
    let targetEl = null;
    for (const sel of selectors) {
      if (!sel) continue;
      try {
        const el = document.querySelector(sel);
        if (el) { targetEl = el; break; }
      } catch (e) {}
    }
    if (targetEl) {
      isDrawerOpen = false;
      visitorDrawer.classList.remove('open');
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        const firstInput = targetEl.querySelector('input:not([type="hidden"]), textarea, select');
        if (firstInput && typeof firstInput.focus === 'function') firstInput.focus();
      }, 450);
    } else if (t.directPhoneHref) {
      window.location.href = t.directPhoneHref;
    }
  }

  async function loadProfileAndCatalog() {
    try {
      const requests = [
        fetch(`${commandHost}/api/command/ai-concierge?siteKey=${encodeURIComponent(siteKey)}`)
      ];
      // Only load Site Owner documentation catalog when in Admin/Portal mode
      if (!isPublicVisitor) {
        requests.push(
          fetch(`${commandHost}/api/command/deep-help?siteKey=${encodeURIComponent(siteKey)}&role=${encodeURIComponent(userRole)}&pinboardAccess=${pinboardAccess}`)
        );
      }
      const responses = await Promise.all(requests);
      const aiRes = responses[0];
      if (aiRes && aiRes.ok) {
        const aiData = await aiRes.json();
        if (aiData && aiData.ok && aiData.profile) {
          aiProfile = aiData.profile;
          if (typeof aiProfile.visitorLimit === 'number' && aiProfile.visitorLimit > 0) {
            localVisitorLimit = aiProfile.visitorLimit;
          }
          if (typeof aiProfile.visitorUsed === 'number') {
            localVisitorUsed = aiProfile.visitorUsed;
          }
        }
      }
      if (!isPublicVisitor && responses[1] && responses[1].ok) {
        const catData = await responses[1].json();
        if (catData && catData.ok) {
          catalogData = catData.catalog;
          if (catalogData.categories && catalogData.categories[0] && catalogData.categories[0].topics[0]) {
            activeTopicId = catalogData.categories[0].topics[0].id;
          }
        }
      }
      updateFabBranding();
    } catch (err) {
      console.warn('[MOD-AI-CONCIERGE] Offline fallback:', err);
    }
  }

  function extractLivePageContext() {
    try {
      const url = (window.location && window.location.href) || '';
      const title = document.title || '';
      const metaEl = document.querySelector('meta[name="description"]');
      const metaDesc = (metaEl && metaEl.getAttribute('content')) || '';
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4'))
        .map((el) => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim())
        .filter((t) => t.length > 2 && !t.includes('Concierge'))
        .slice(0, 28);
      const mainNode = document.querySelector('main, article, #root, body');
      let bodyText = '';
      if (mainNode) {
        const clone = mainNode.cloneNode(true);
        clone.querySelectorAll('script, style, noscript, .gt-dh-visitor-drawer, .gt-dh-backdrop, .gt-dh-fab').forEach((n) => n.remove());
        bodyText = (clone.innerText || clone.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 3400);
      }
      return [
        `URL: ${url}`,
        `Title: ${title}`,
        metaDesc ? `Description: ${metaDesc}` : '',
        headings.length ? `Headings: ${headings.join(' | ')}` : '',
        bodyText ? `Visible Text: ${bodyText}` : ''
      ].filter(Boolean).join('\n').slice(0, 4200);
    } catch (e) {
      return '';
    }
  }

  async function sendAiQuestion(questionText) {
    const q = String(questionText || '').trim();
    if (!q || chatLoading) return;
    chatMessages.push({ role: 'user', text: q });
    chatLoading = true;
    viewMode = 'ai';
    renderActiveSurface();
    const payload = JSON.stringify({
      siteKey,
      message: q,
      pageContext: extractLivePageContext(),
      history: chatMessages.slice(0, -1)
    });
    try {
      let res = await fetch(`${commandHost}/api/command/ai-concierge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
      });
      if (!res.ok) {
        await new Promise((r) => setTimeout(r, 1200));
        res = await fetch(`${commandHost}/api/command/ai-concierge`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload
        });
      }
      const data = await res.json();
      if (data && data.ok) {
        if (data.profile) {
          aiProfile = Object.assign({}, aiProfile || {}, data.profile);
          if (typeof aiProfile.visitorLimit === 'number' && aiProfile.visitorLimit > 0) {
            localVisitorLimit = aiProfile.visitorLimit;
          }
          if (typeof aiProfile.visitorUsed === 'number') {
            localVisitorUsed = aiProfile.visitorUsed;
          } else {
            localVisitorUsed += 1;
          }
        } else {
          localVisitorUsed += 1;
        }
        chatMessages.push({
          role: 'model',
          text: data.reply || 'Please let us know how we can assist with your question.',
          capped: Boolean(data.capped)
        });
      } else {
        chatMessages.push({
          role: 'model',
          text: (data && data.reply) || 'Our concierge is refreshing site data right now. Please try your question again in a moment.'
        });
      }
    } catch (e) {
      chatMessages.push({
        role: 'model',
        text: 'Connection briefly interrupted. Please click Send again to retry your question.'
      });
    }
    chatLoading = false;
    renderActiveSurface();
  }

  function renderVisitorDrawer() {
    const t = resolveTheme();
    const visitorLimit = localVisitorLimit || 6;
    const visitorRemaining = Math.max(0, visitorLimit - localVisitorUsed);
    const isSessionExhausted = visitorRemaining <= 0;

    const starters = (aiProfile && aiProfile.starters && aiProfile.starters.length)
      ? aiProfile.starters
      : [
          'What services do you provide and what areas do you serve?',
          'How do I request an estimate or schedule service?',
          'What project details should I share for a fast quote?'
        ];

    visitorDrawer.innerHTML = `
      <!-- Top Grab Bar + Branded Business Header (Draggable) -->
      <div data-gt-drag-handle="true" style="background:${escHtml(t.brandPrimary)};color:#ffffff;border-bottom:2px solid ${escHtml(t.brandAccent)};user-select:none;-webkit-user-select:none;">
        <div class="gt-dh-drawer-grab-bar" data-gt-drag-handle="true" title="Grab bar: drag to move chat window">
          <div class="gt-dh-drawer-grab-pill"></div>
        </div>
        <div style="padding:6px 14px 12px;display:flex;align-items:center;justify-content:space-between;gap:10px;">
          <div style="display:flex;align-items:center;gap:10px;min-width:0;cursor:grab;" data-gt-drag-handle="true">
            ${t.logoUrl ? `
              <img src="${escHtml(t.logoUrl)}" alt="" onerror="this.style.display='none'" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:1.5px solid ${escHtml(t.brandAccent)};flex-shrink:0;background:#fff;pointer-events:none;" />
            ` : `
              <div style="width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,0.1);border:1.5px solid ${escHtml(t.brandAccent)};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                ${getSvgIcon(t.iconType, t.brandAccent)}
              </div>
            `}
            <div style="min-width:0;">
              <div style="font-size:13.5px;font-weight:800;color:#ffffff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(t.headerTitle)}</div>
              <div style="font-size:10.5px;color:rgba(255,255,255,0.82);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escHtml(t.headerSubtitle)}</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:4px;flex-shrink:0;">
            <button type="button" id="gt-dh-visitor-mini" title="${fabState === 'mini' ? 'Restore full button size' : 'Shrink launcher to tiny icon'}" style="height:28px;padding:0 8px;border-radius:7px;border:1px solid rgba(255,255,255,0.24);background:rgba(255,255,255,0.08);color:#ffffff;font-weight:700;font-size:10.5px;cursor:pointer;">
              ${fabState === 'mini' ? 'Full Pill' : 'Mini Icon'}
            </button>
            <button type="button" id="gt-dh-visitor-hide" title="Close & hide button completely (Reopen anytime from site menu)" style="height:28px;padding:0 8px;border-radius:7px;border:1px solid rgba(255,255,255,0.24);background:rgba(255,255,255,0.08);color:#ffffff;font-weight:700;font-size:10.5px;cursor:pointer;">
              Hide
            </button>
            <button type="button" id="gt-dh-visitor-close" aria-label="Close chat window" title="Minimize chat window" style="width:28px;height:28px;border-radius:7px;border:1px solid rgba(255,255,255,0.24);background:rgba(255,255,255,0.12);color:#ffffff;font-weight:800;font-size:12.5px;cursor:pointer;">✕</button>
          </div>
        </div>
      </div>

      <!-- Visitor Consultation Session Meter (Guides Visitor to Direct Contact) -->
      <div style="padding:8px 14px;background:#f8fafc;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:11.5px;">
        <div style="display:flex;align-items:center;gap:6px;color:#334155;font-weight:600;">
          <span style="width:7px;height:7px;border-radius:50%;background:${isSessionExhausted ? '#f59e0b' : '#22c55e'};display:inline-block;"></span>
          <span>${isSessionExhausted ? 'Instant Q&A session complete' : `${visitorRemaining} of ${visitorLimit} instant answers available`}</span>
        </div>
        <div style="display:flex;align-items:center;gap:10px;">
          ${customPos ? `
            <button type="button" id="gt-dh-reset-pos" style="border:none;background:transparent;color:#64748b;font-weight:700;font-size:10.5px;cursor:pointer;padding:0;" title="Reset chat position to lower-right corner">
              Reset Dock
            </button>
          ` : ''}
          <button type="button" id="gt-dh-top-cta" style="border:none;background:transparent;color:${escHtml(t.brandPrimary)};font-weight:800;font-size:11.5px;cursor:pointer;text-decoration:underline;padding:0;">
            Get Direct Quote →
          </button>
        </div>
      </div>

      <!-- Chat Conversation Body -->
      <div id="gt-dh-chat-scroll" style="flex:1;padding:14px;background:${escHtml(t.surfaceBg)};overflow-y:auto;display:flex;flex-direction:column;gap:10px;">
        <div style="align-self:flex-start;max-width:90%;padding:11px 14px;border-radius:12px 12px 12px 4px;background:#ffffff;color:#0f172a;border:1px solid #e2e8f0;font-size:13px;line-height:1.5;box-shadow:0 1px 3px rgba(0,0,0,0.04);">
          Welcome to <strong>${escHtml(t.headerTitle)}</strong>. Select a common question below or type your project question for an instant answer:
        </div>

        ${chatMessages.length === 0 ? `
          <div style="display:flex;flex-direction:column;gap:6px;margin-top:2px;">
            ${starters.map((s) => `
              <button class="gt-dh-starter-chip" data-ai-starter="${escHtml(s)}">
                ${escHtml(s)}
              </button>
            `).join('')}
          </div>
        ` : ''}

        ${chatMessages.map((m) => `
          <div style="align-self:${m.role === 'user' ? 'flex-end' : 'flex-start'};max-width:86%;padding:10px 14px;border-radius:${m.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px'};background:${m.role === 'user' ? escHtml(t.brandPrimary) : '#ffffff'};color:${m.role === 'user' ? '#ffffff' : '#0f172a'};border:${m.role === 'user' ? `1px solid ${escHtml(t.brandAccent)}` : '1px solid #cbd5e1'};font-size:13px;line-height:1.52;white-space:${m.role === 'user' ? 'pre-wrap' : 'normal'};box-shadow:0 1px 3px rgba(0,0,0,0.05);">${m.role === 'user' ? escHtml(m.text) : formatChatMarkdown(m.text)}</div>
        `).join('')}

        ${chatLoading ? `
          <div style="align-self:flex-start;padding:9px 13px;border-radius:12px;background:#ffffff;border:1px solid #cbd5e1;color:#475569;font-size:12.5px;font-weight:600;">
            Preparing answer...
          </div>
        ` : ''}

        ${isSessionExhausted ? `
          <div style="margin-top:4px;padding:12px 14px;border-radius:12px;background:#ffffff;border:1.5px solid ${escHtml(t.brandAccent)};box-shadow:0 4px 12px rgba(0,0,0,0.06);">
            <div style="font-size:12.5px;font-weight:800;color:#0f172a;margin-bottom:4px;">Ready for an exact quote or priority dispatch?</div>
            <div style="font-size:12px;color:#475569;line-height:1.45;margin-bottom:10px;">
              You've used your complimentary instant answers for this visit. Connect directly with our team so we can review your project:
            </div>
            <div style="display:flex;flex-direction:column;gap:6px;">
              <button id="gt-dh-handoff-cta" style="width:100%;padding:9px 12px;border-radius:8px;border:1px solid ${escHtml(t.brandAccent)};background:${escHtml(t.brandPrimary)};color:#ffffff;font-weight:800;font-size:12.5px;cursor:pointer;">
                ${escHtml(t.ctaLabel)}
              </button>
              ${t.directPhone ? `
                <a href="${escHtml(t.directPhoneHref || '#')}" style="display:block;text-align:center;padding:8px 12px;border-radius:8px;border:1px solid #cbd5e1;background:#f8fafc;color:#0f172a;font-weight:800;font-size:12px;text-decoration:none;">
                  Call ${escHtml(t.directPhone)}
                </a>
              ` : ''}
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Input Form + Direct Estimate CTA Footer -->
      <div style="padding:10px 12px;background:#ffffff;border-top:1px solid #e2e8f0;">
        ${!isSessionExhausted ? `
          <form id="gt-dh-visitor-form" style="display:flex;gap:8px;margin-bottom:8px;">
            <input id="gt-dh-visitor-input" type="text" maxlength="450" placeholder="Type your question..." style="flex:1;padding:9px 12px;border-radius:9px;border:1px solid #cbd5e1;font-size:13px;color:#0f172a;outline:none;" />
            <button type="submit" style="padding:9px 15px;border-radius:9px;border:1px solid ${escHtml(t.brandAccent)};background:${escHtml(t.brandPrimary)};color:#ffffff;font-weight:800;font-size:12.5px;cursor:pointer;white-space:nowrap;">
              Send
            </button>
          </form>
        ` : ''}
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <button id="gt-dh-footer-cta" style="flex:1;padding:7px 10px;border-radius:8px;border:1px solid #cbd5e1;background:#f8fafc;color:#0f172a;font-weight:700;font-size:11.5px;cursor:pointer;text-align:center;">
            ${escHtml(t.ctaLabel)}
          </button>
          ${t.directPhone ? `
            <a href="${escHtml(t.directPhoneHref || '#')}" style="padding:7px 10px;border-radius:8px;border:1px solid ${escHtml(t.brandAccent)};background:${escHtml(t.surfaceBg)};color:#0f172a;font-weight:800;font-size:11.5px;text-decoration:none;white-space:nowrap;">
              ${escHtml(t.directPhone.split(' ')[0])}
            </a>
          ` : ''}
        </div>
      </div>
    `;

    const scrollBox = visitorDrawer.querySelector('#gt-dh-chat-scroll');
    if (scrollBox) scrollBox.scrollTop = scrollBox.scrollHeight;

    const closeBtn = visitorDrawer.querySelector('#gt-dh-visitor-close');
    if (closeBtn) {
      closeBtn.onclick = () => {
        isDrawerOpen = false;
        visitorDrawer.classList.remove('open');
      };
    }

    const miniBtn = visitorDrawer.querySelector('#gt-dh-visitor-mini');
    if (miniBtn) {
      miniBtn.onclick = () => {
        const next = fabState === 'mini' ? 'full' : 'mini';
        isDrawerOpen = false;
        visitorDrawer.classList.remove('open');
        setFabState(next);
      };
    }

    const hideBtn = visitorDrawer.querySelector('#gt-dh-visitor-hide');
    if (hideBtn) {
      hideBtn.onclick = () => {
        isDrawerOpen = false;
        visitorDrawer.classList.remove('open');
        setFabState('closed');
      };
    }

    const resetPosBtn = visitorDrawer.querySelector('#gt-dh-reset-pos');
    if (resetPosBtn) {
      resetPosBtn.onclick = () => {
        customPos = null;
        try { localStorage.removeItem(posStorageKey); } catch (e) {}
        applyPositionStyles();
        renderVisitorDrawer();
      };
    }

    const topCta = visitorDrawer.querySelector('#gt-dh-top-cta');
    if (topCta) topCta.onclick = triggerContactCta;

    const footerCta = visitorDrawer.querySelector('#gt-dh-footer-cta');
    if (footerCta) footerCta.onclick = triggerContactCta;

    const handoffCta = visitorDrawer.querySelector('#gt-dh-handoff-cta');
    if (handoffCta) handoffCta.onclick = triggerContactCta;

    visitorDrawer.querySelectorAll('[data-ai-starter]').forEach((btn) => {
      btn.onclick = () => sendAiQuestion(btn.getAttribute('data-ai-starter'));
    });

    const vForm = visitorDrawer.querySelector('#gt-dh-visitor-form');
    if (vForm) {
      vForm.onsubmit = (e) => {
        e.preventDefault();
        const inp = visitorDrawer.querySelector('#gt-dh-visitor-input');
        if (inp && inp.value) sendAiQuestion(inp.value);
      };
    }
  }

  // Site Owner / Admin Portal Modal (`userRole === 'admin' | 'owner'`)
  function renderAdminModal() {
    if (!catalogData) {
      backdrop.innerHTML = `<div class="gt-dh-modal" style="padding:32px;align-items:center;justify-content:center;">Loading Site Owner Documentation &amp; AI Co-Pilot...</div>`;
      return;
    }
    const allTopics = [];
    catalogData.categories.forEach((cat) => cat.topics.forEach((t) => allTopics.push(t)));
    const activeTopic = allTopics.find((t) => t.id === activeTopicId) || allTopics[0];
    const isComplete = viewMode === 'complete';
    const isAi = viewMode === 'ai';
    const agentName = (aiProfile && aiProfile.agentName) || 'GreenTree Live AI Concierge';
    const dailyRem = aiProfile ? `${aiProfile.dailyRemaining}/${aiProfile.dailyCap}` : 'Active';
    const starters = (aiProfile && aiProfile.starters) || [
      'How does this platform work?',
      'What are the core features available here?',
      'How can I request support or a custom quote?'
    ];

    backdrop.innerHTML = `
      <div class="gt-dh-modal">
        <div style="padding:18px 26px;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;background:#f8fafc;">
          <div>
            <div style="font-size:22px;font-weight:800;color:#0f172a;">${escHtml(catalogData.docTitle)}</div>
            <div style="font-size:13px;color:#64748b;margin-top:2px;">${escHtml(catalogData.docSubtitle)}</div>
          </div>
          <div style="display:flex;align-items:center;gap:10px;">
            <button id="gt-dh-open-ai" style="padding:7px 14px;border-radius:999px;border:1px solid #10b981;background:${isAi ? '#059669' : '#ecfdf5'};color:${isAi ? '#ffffff' : '#047857'};font-weight:800;font-size:12px;cursor:pointer;">
              Live AI Co-Pilot (Owner Plan: ${escHtml(dailyRem)} today)
            </button>
            <span style="padding:4px 10px;border-radius:999px;font-size:11px;font-weight:700;background:#ede9fe;color:#6d28d9;text-transform:uppercase;">Role: ${escHtml(userRole)}</span>
            <button id="gt-dh-close" style="padding:7px 14px;border-radius:8px;border:1px solid #cbd5e1;background:#fff;color:#334155;font-weight:700;cursor:pointer;">✕ Close</button>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:280px 1fr;flex:1;overflow:hidden;">
          <div style="border-right:1px solid #e2e8f0;padding:16px;overflow-y:auto;background:#fcfcfd;">
            <button id="gt-dh-side-ai" style="width:100%;text-align:left;padding:10px 12px;border-radius:10px;border:1px solid #10b981;cursor:pointer;display:flex;align-items:center;justify-content:space-between;font-size:13px;font-weight:800;background:${isAi ? 'linear-gradient(90deg,#059669,#10b981)' : '#ecfdf5'};color:${isAi ? '#fff' : '#065f46'};margin-bottom:14px;">
              <span>Ask AI Co-Pilot</span>
              <span style="font-size:10px;padding:2px 6px;border-radius:99px;background:rgba(0,0,0,0.12);">LIVE</span>
            </button>
            <div style="font-size:12px;font-weight:700;color:#475569;margin-bottom:8px;">Owner Documentation</div>
            <input id="gt-dh-search" type="text" placeholder="Search documentation..." value="${escHtml(searchQuery)}" style="width:100%;padding:8px 12px;border:1px solid #cbd5e1;border-radius:8px;font-size:12.5px;margin-bottom:14px;box-sizing:border-box;" />
            ${catalogData.categories.map((cat) => {
              const filtered = cat.topics.filter((t) => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
              if (!filtered.length) return '';
              return `
                <div style="margin-bottom:14px;">
                  <div style="font-size:10.5px;font-weight:800;color:#64748b;letter-spacing:0.06em;padding:4px 8px;margin-bottom:4px;">${escHtml(cat.label)}</div>
                  ${filtered.map((t) => {
                    const isActive = !isAi && t.id === (activeTopic && activeTopic.id);
                    return `
                      <button data-topic-id="${escHtml(t.id)}" style="width:100%;text-align:left;padding:8px 10px;border-radius:8px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;font-size:13px;font-weight:${isActive ? '700' : '500'};background:${isActive ? 'linear-gradient(90deg,#0f172a,#1e293b)' : 'transparent'};color:${isActive ? '#fff' : '#334155'};margin-bottom:2px;">
                        <span><span style="margin-right:7px;">${escHtml(t.icon || '📘')}</span>${escHtml(t.title)}</span>
                        ${t.badge ? `<span style="font-size:10px;padding:1px 6px;border-radius:99px;background:${isActive ? 'rgba(255,255,255,0.22)' : '#f1f5f9'};color:${isActive ? '#fff' : '#334155'};">${escHtml(t.badge)}</span>` : ''}
                      </button>
                    `;
                  }).join('')}
                </div>
              `;
            }).join('')}
          </div>
          <div style="padding:26px 34px;overflow-y:auto;background:#ffffff;display:flex;flex-direction:column;">
            ${isAi ? `
              <div style="padding:16px 20px;border-radius:12px;background:linear-gradient(90deg,#0f172a,#1e293b);color:#fff;display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">
                <div>
                  <div style="font-size:16px;font-weight:800;color:#4ade80;">${escHtml(agentName)}</div>
                  <div style="font-size:12px;color:#cbd5e1;margin-top:3px;">Site Owner Daily Allocation: ${escHtml(dailyRem)} remaining today</div>
                </div>
                <span style="padding:4px 10px;border-radius:999px;font-size:11px;font-weight:800;background:rgba(74,222,128,0.18);color:#4ade80;border:1px solid rgba(74,222,128,0.35);">OWNER PORTAL</span>
              </div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
                ${starters.map((s) => `
                  <button data-ai-starter="${escHtml(s)}" style="padding:7px 12px;border-radius:999px;border:1px solid #cbd5e1;background:#f8fafc;color:#1e293b;font-size:12px;font-weight:600;cursor:pointer;">
                    ${escHtml(s)}
                  </button>
                `).join('')}
              </div>
              <div style="flex:1;min-height:260px;padding:16px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;overflow-y:auto;margin-bottom:14px;display:flex;flex-direction:column;gap:12px;">
                ${chatMessages.length === 0 ? `
                  <div style="margin:auto;text-align:center;color:#64748b;font-size:13.5px;">
                    Select a starter prompt above or ask <strong>${escHtml(agentName)}</strong> a question below.
                  </div>
                ` : chatMessages.map((m) => `
                  <div style="align-self:${m.role === 'user' ? 'flex-end' : 'flex-start'};max-width:82%;padding:12px 16px;border-radius:12px;background:${m.role === 'user' ? '#0f172a' : '#ffffff'};color:${m.role === 'user' ? '#ffffff' : '#0f172a'};border:${m.role === 'user' ? 'none' : '1px solid #cbd5e1'};font-size:13.5px;line-height:1.55;white-space:${m.role === 'user' ? 'pre-wrap' : 'normal'};">${m.role === 'user' ? escHtml(m.text) : formatChatMarkdown(m.text)}</div>
                `).join('')}
                ${chatLoading ? `<div style="align-self:flex-start;padding:10px 14px;border-radius:12px;background:#ffffff;border:1px solid #cbd5e1;color:#64748b;font-size:13px;">Thinking...</div>` : ''}
              </div>
              <form id="gt-dh-ai-form" style="display:flex;gap:10px;">
                <input id="gt-dh-ai-input" type="text" placeholder="Ask ${escHtml(agentName)}..." style="flex:1;padding:11px 14px;border-radius:10px;border:1px solid #cbd5e1;font-size:13.5px;" />
                <button type="submit" style="padding:11px 20px;border-radius:10px;border:none;background:#059669;color:#fff;font-weight:800;font-size:13.5px;cursor:pointer;">Send →</button>
              </form>
            ` : activeTopic ? `
              <div style="padding:14px 18px;border-radius:12px;background:#f8fafc;border:1px solid #cbd5e1;display:flex;justify-content:space-between;align-items:center;margin-bottom:26px;">
                <div>
                  <div style="font-size:14px;font-weight:800;color:#0f172a;">
                    ${isComplete ? 'Complete Operational Guide' : 'Summary View'}
                  </div>
                  <div style="font-size:12.5px;color:#475569;margin-top:2px;">
                    ${isComplete ? 'Step-by-step site owner documentation' : 'Quick overview with essential highlights'}
                  </div>
                </div>
                <button id="gt-dh-toggle-mode" style="padding:8px 16px;border-radius:999px;border:1px solid #0f172a;background:${isComplete ? '#0f172a' : '#ffffff'};color:${isComplete ? '#ffffff' : '#0f172a'};font-weight:700;font-size:12.5px;cursor:pointer;white-space:nowrap;">
                  ${isComplete ? 'Switch to Summary View' : 'View Complete Guide →'}
                </button>
              </div>
              <div style="text-align:center;margin-bottom:28px;">
                <h2 style="margin:0;font-size:26px;font-weight:800;color:#0f172a;">${escHtml(activeTopic.title)}</h2>
                <p style="margin:6px auto 0;max-width:640px;font-size:14.5px;color:#64748b;">${escHtml(activeTopic.subtitle)}</p>
              </div>
              ${!isComplete ? `
                <div style="padding:20px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;margin-bottom:20px;">
                  <div style="font-size:16px;font-weight:800;color:#0f172a;margin-bottom:6px;">${escHtml(activeTopic.summary.leadTitle)}</div>
                  <p style="margin:0 0 14px;font-size:14px;color:#334155;line-height:1.6;">${escHtml(activeTopic.summary.leadText)}</p>
                  <div style="display:grid;gap:12px;">
                    ${(activeTopic.summary.highlights || []).map((h) => `
                      <div style="padding:14px 16px;border-radius:10px;background:#ffffff;border:1px solid #e2e8f0;">
                        <div style="font-size:14px;font-weight:700;color:#0f172a;margin-bottom:4px;">${escHtml(h.icon || '•')} ${escHtml(h.title)}</div>
                        <div style="font-size:13.5px;color:#475569;line-height:1.55;">${escHtml(h.text)}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : `
                <div style="padding:20px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;margin-bottom:20px;">
                  <p style="margin:0 0 16px;font-size:14px;color:#334155;line-height:1.65;">${escHtml(activeTopic.complete.overview)}</p>
                  ${(activeTopic.complete.steps || []).map((s) => `
                    <div style="padding:14px 16px;border-radius:10px;background:#ffffff;border:1px solid #e2e8f0;margin-bottom:10px;display:flex;gap:12px;">
                      <div style="width:28px;height:28px;border-radius:50%;background:#0f172a;color:#fff;font-weight:800;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${escHtml(s.step)}</div>
                      <div>
                        <div style="font-size:14px;font-weight:700;color:#0f172a;">${escHtml(s.title)}</div>
                        <div style="font-size:13.5px;color:#475569;margin-top:3px;line-height:1.55;">${escHtml(s.detail)}</div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            ` : ''}
          </div>
        </div>
      </div>
    `;

    const closeBtn = backdrop.querySelector('#gt-dh-close');
    if (closeBtn) closeBtn.onclick = () => backdrop.classList.remove('open');

    const openAiBtn = backdrop.querySelector('#gt-dh-open-ai');
    if (openAiBtn) openAiBtn.onclick = () => { viewMode = viewMode === 'ai' ? 'summary' : 'ai'; renderAdminModal(); };

    const sideAiBtn = backdrop.querySelector('#gt-dh-side-ai');
    if (sideAiBtn) sideAiBtn.onclick = () => { viewMode = 'ai'; renderAdminModal(); };

    const toggleBtn = backdrop.querySelector('#gt-dh-toggle-mode');
    if (toggleBtn) {
      toggleBtn.onclick = () => {
        viewMode = viewMode === 'summary' ? 'complete' : 'summary';
        renderAdminModal();
      };
    }

    const searchInput = backdrop.querySelector('#gt-dh-search');
    if (searchInput) {
      searchInput.oninput = (e) => {
        searchQuery = e.target.value;
        renderAdminModal();
      };
    }

    backdrop.querySelectorAll('[data-topic-id]').forEach((btn) => {
      btn.onclick = () => {
        activeTopicId = btn.getAttribute('data-topic-id');
        viewMode = 'summary';
        renderAdminModal();
      };
    });

    backdrop.querySelectorAll('[data-ai-starter]').forEach((btn) => {
      btn.onclick = () => sendAiQuestion(btn.getAttribute('data-ai-starter'));
    });

    const aiForm = backdrop.querySelector('#gt-dh-ai-form');
    if (aiForm) {
      aiForm.onsubmit = (e) => {
        e.preventDefault();
        const inp = backdrop.querySelector('#gt-dh-ai-input');
        if (inp && inp.value) sendAiQuestion(inp.value);
      };
    }
  }

  function renderActiveSurface() {
    if (isPublicVisitor) {
      renderVisitorDrawer();
    } else {
      renderAdminModal();
    }
  }

  function closeHostMenus() {
    try {
      // 1. Standard #mobileMenu (e.g. goindustrialsupplies.com, spoke templates)
      const mobileMenu = document.getElementById('mobileMenu');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        if (typeof window.toggleMobileMenu === 'function') {
          try { window.toggleMobileMenu(); } catch (e) { mobileMenu.classList.add('hidden'); }
        } else {
          mobileMenu.classList.add('hidden');
        }
      }
      // 2. Slide-over #mobile-drawer (e.g. kettletownestate.com)
      const mobileDrawer = document.getElementById('mobile-drawer');
      if (mobileDrawer && !mobileDrawer.classList.contains('pointer-events-none')) {
        if (typeof window.toggleMobileMenu === 'function') {
          try { window.toggleMobileMenu(); } catch (e) {}
        }
      }
      // 3. Generic open mobile navs
      document.querySelectorAll('#mobile-menu, [id*="mobileMenu"], [id*="mobile-menu"], [id*="mobile-nav"], .mobile-menu').forEach((el) => {
        if (el.id === 'mobile-drawer') return;
        if (el.classList.contains('open') || el.classList.contains('active') || el.classList.contains('show')) {
          el.classList.remove('open', 'active', 'show');
          el.classList.add('hidden');
        }
      });
      // 4. Desktop Mega-Menus
      if (typeof window.closeAllMegaMenus === 'function') {
        try { window.closeAllMegaMenus(); } catch (e) {}
      }
      document.querySelectorAll('.megamenu-panel-unified, .mega-menu, .megamenu, [id^="mega-"]').forEach((panel) => {
        panel.classList.remove('open', 'active', 'show');
        if (panel.classList.contains('megamenu-panel-unified')) {
          panel.classList.add('hidden');
        }
      });
      const megaBackdrop = document.getElementById('megamenuBackdrop');
      if (megaBackdrop) megaBackdrop.classList.add('hidden');
    } catch (e) {}
    setTimeout(checkMobileMenuOverlap, 60);
  }

  async function openConciergeChat(restoreFullPill) {
    closeHostMenus();
    if (isPublicVisitor) {
      if (fabState === 'closed' || restoreFullPill) {
        setFabState(restoreFullPill ? 'full' : 'mini');
      }
      isDrawerOpen = true;
      visitorDrawer.classList.add('open');
      applyPositionStyles();
      if (!aiProfile) await loadProfileAndCatalog();
      renderVisitorDrawer();
      setTimeout(() => {
        const inp = visitorDrawer.querySelector('#gt-dh-visitor-input');
        if (inp && typeof inp.focus === 'function') inp.focus();
      }, 120);
    } else {
      backdrop.classList.add('open');
      if (!catalogData) await loadProfileAndCatalog();
      renderAdminModal();
    }
  }

  function isElementVisibleMenu(el) {
    if (!el) return false;
    if (el.classList.contains('hidden') || el.classList.contains('pointer-events-none') || el.classList.contains('translate-x-full')) {
      return false;
    }
    const st = window.getComputedStyle(el);
    if (st.display === 'none' || st.visibility === 'hidden' || parseFloat(st.opacity) === 0) {
      return false;
    }
    const rect = el.getBoundingClientRect();
    return rect.width > 120 && rect.height > 120;
  }

  function checkMobileMenuOverlap() {
    if (!isPublicVisitor) return;
    try {
      const candidates = document.querySelectorAll('#mobileMenu, #mobile-drawer, #mobile-menu, [id*="mobileMenu"], [id*="mobile-menu"], [id*="mobile-nav"], .mobile-menu');
      let anyMenuOpen = false;
      candidates.forEach((el) => {
        if (isElementVisibleMenu(el)) anyMenuOpen = true;
      });
      fab.classList.toggle('gt-dh-hidden-by-menu', anyMenuOpen);
    } catch (e) {}
  }

  function injectMenuReopenLinks() {
    if (typeof document === 'undefined' || !isPublicVisitor) return;
    const t = resolveTheme();
    const labelText = t.fabLabel || 'Ask Concierge';
    const eyebrowText = t.fabEyebrow || 'Live AI Concierge';

    // 1. Inject into Mobile Hamburger Menus (#mobileMenu, #mobile-drawer-container, #mobile-menu, .mobile-menu, etc.)
    const mobileContainers = document.querySelectorAll(
      '#mobileMenu, #mobile-drawer-container, #mobile-menu, #mobile-menu-drawer, #site-nav-drawer, .mobile-menu:not(button)'
    );
    mobileContainers.forEach((menuEl) => {
      if (menuEl.querySelector('[data-gt-concierge-menu-link="mobile"]')) {
        const lbl = menuEl.querySelector('[data-gt-concierge-menu-label]');
        if (lbl) lbl.textContent = `${eyebrowText}: ${labelText}`;
        return;
      }
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('data-gt-concierge-menu-link', 'mobile');
      btn.setAttribute('data-open-concierge', 'true');
      btn.style.cssText = `
        width: 100%;
        margin-top: 10px;
        padding: 11px 14px;
        border-radius: 8px;
        background: ${t.brandPrimary};
        color: #ffffff;
        border: 1.5px solid ${t.brandAccent};
        font-family: system-ui, -apple-system, sans-serif;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: 0.03em;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        cursor: pointer;
        text-align: left;
        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
      `;
      btn.innerHTML = `
        <span style="display:inline-flex;align-items:center;gap:8px;">
          <span style="width:8px;height:8px;border-radius:50%;background:#22c55e;display:inline-block;flex-shrink:0;"></span>
          <span data-gt-concierge-menu-label="true">${escHtml(eyebrowText)}: ${escHtml(labelText)}</span>
        </span>
        <span style="color:${escHtml(t.brandAccent)};font-size:11px;font-weight:800;white-space:nowrap;">OPEN CHAT →</span>
      `;
      menuEl.appendChild(btn);
    });

    // 2. Inject into Desktop Mega-Menu Bottom Bars (.megamenu-bottom-bar)
    const megaBottomBars = document.querySelectorAll('.megamenu-bottom-bar');
    megaBottomBars.forEach((barEl) => {
      if (barEl.querySelector('[data-gt-concierge-menu-link="mega"]')) return;
      const targetRow = barEl.querySelector('div') || barEl;
      const sep = document.createElement('span');
      sep.textContent = '•';
      sep.style.margin = '0 4px';
      const link = document.createElement('a');
      link.href = '#open-concierge';
      link.setAttribute('data-gt-concierge-menu-link', 'mega');
      link.setAttribute('data-open-concierge', 'true');
      link.style.cssText = `
        display: inline-flex;
        align-items: center;
        gap: 5px;
        font-weight: 800;
        color: ${t.brandPrimary};
        text-decoration: underline;
        cursor: pointer;
      `;
      link.innerHTML = `<span style="width:6px;height:6px;border-radius:50%;background:#22c55e;display:inline-block;"></span><span>${escHtml(labelText)} (Live Chat)</span>`;
      targetRow.appendChild(sep);
      targetRow.appendChild(link);
    });

    // 3. Inject into Generic Desktop Mega-Menu Panels that lack .megamenu-bottom-bar
    const megaPanels = document.querySelectorAll('.megamenu-panel-unified, .mega-menu, .megamenu, [id^="mega-"]');
    megaPanels.forEach((panelEl) => {
      if (panelEl.querySelector('.megamenu-bottom-bar') || panelEl.querySelector('[data-gt-concierge-menu-link]')) return;
      const footerBar = document.createElement('div');
      footerBar.setAttribute('data-gt-concierge-menu-link', 'mega-panel');
      footerBar.style.cssText = `
        margin-top: 10px;
        padding-top: 8px;
        border-top: 1px solid rgba(148, 163, 184, 0.25);
        display: flex;
        align-items: center;
        justify-content: flex-end;
      `;
      footerBar.innerHTML = `
        <a href="#open-concierge" data-open-concierge="true" style="display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:800;color:${escHtml(t.brandAccent)};text-decoration:none;padding:4px 10px;border-radius:6px;background:${escHtml(t.brandPrimary)};border:1px solid ${escHtml(t.brandAccent)};">
          <span style="width:6px;height:6px;border-radius:50%;background:#22c55e;display:inline-block;"></span>
          <span>${escHtml(labelText)} →</span>
        </a>
      `;
      panelEl.appendChild(footerBar);
    });
  }

  // Drag-to-move engine (supports both floating launcher grab bar & open drawer top grab bar)
  let wasDragged = false;
  function initDragToMove() {
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startRight = 24;
    let startBottom = 24;

    function getCurrentDockPos() {
      if (customPos && typeof customPos.right === 'number' && typeof customPos.bottom === 'number') {
        return { right: customPos.right, bottom: customPos.bottom };
      }
      const rect = (isDrawerOpen && visitorDrawer.classList.contains('open'))
        ? visitorDrawer.getBoundingClientRect()
        : fab.getBoundingClientRect();
      return {
        right: Math.max(8, Math.round((window.innerWidth || 360) - rect.right)),
        bottom: Math.max(8, Math.round((window.innerHeight || 640) - rect.bottom))
      };
    }

    function onPointerDown(clientX, clientY, target) {
      if (!target) return false;
      // Do not start drag if clicking a control button, input, or link
      if (target.closest('button, input, textarea, a, [data-ai-starter]')) return false;
      const isHandle = Boolean(target.closest('[data-gt-drag-handle="true"]'));
      const isFabSurface = Boolean(target.closest('.gt-dh-fab'));
      if (!isHandle && !isFabSurface) return false;

      const pos = getCurrentDockPos();
      dragging = true;
      wasDragged = false;
      startX = clientX;
      startY = clientY;
      startRight = pos.right;
      startBottom = pos.bottom;
      return true;
    }

    function onPointerMove(clientX, clientY) {
      if (!dragging) return;
      const dx = clientX - startX;
      const dy = clientY - startY;
      if (!wasDragged && Math.hypot(dx, dy) < 6) return;
      wasDragged = true;
      fab.classList.add('gt-dh-dragging');
      visitorDrawer.classList.add('gt-dh-dragging');

      const maxRight = Math.max(8, (window.innerWidth || 360) - 56);
      const maxBottom = Math.max(8, (window.innerHeight || 640) - 56);
      customPos = {
        right: Math.min(Math.max(8, Math.round(startRight - dx)), maxRight),
        bottom: Math.min(Math.max(8, Math.round(startBottom - dy)), maxBottom)
      };
      applyPositionStyles();
    }

    function onPointerUp() {
      if (!dragging) return;
      dragging = false;
      fab.classList.remove('gt-dh-dragging');
      visitorDrawer.classList.remove('gt-dh-dragging');
      if (wasDragged && customPos) {
        try { localStorage.setItem(posStorageKey, JSON.stringify(customPos)); } catch (e) {}
        setTimeout(() => { wasDragged = false; }, 60);
      }
    }

    document.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      onPointerDown(e.clientX, e.clientY, e.target);
    });
    document.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      onPointerMove(e.clientX, e.clientY);
    });
    document.addEventListener('mouseup', onPointerUp);

    document.addEventListener('touchstart', (e) => {
      if (!e.touches || e.touches.length !== 1) return;
      const touch = e.touches[0];
      onPointerDown(touch.clientX, touch.clientY, e.target);
    }, { passive: true });
    document.addEventListener('touchmove', (e) => {
      if (!dragging || !e.touches || e.touches.length !== 1) return;
      const touch = e.touches[0];
      onPointerMove(touch.clientX, touch.clientY);
      if (wasDragged && e.cancelable) e.preventDefault();
    }, { passive: false });
    document.addEventListener('touchend', onPointerUp);
    window.addEventListener('resize', applyPositionStyles);
  }

  fab.onclick = async (e) => {
    if (wasDragged) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const actionBtn = e.target && e.target.closest && e.target.closest('[data-fab-action]');
    const action = actionBtn ? actionBtn.getAttribute('data-fab-action') : 'open';

    if (isPublicVisitor) {
      if (action === 'mini') {
        e.stopPropagation();
        isDrawerOpen = false;
        visitorDrawer.classList.remove('open');
        setFabState('mini');
        return;
      }
      if (action === 'close') {
        e.stopPropagation();
        isDrawerOpen = false;
        visitorDrawer.classList.remove('open');
        setFabState('closed');
        return;
      }
      isDrawerOpen = !isDrawerOpen;
      if (isDrawerOpen) {
        visitorDrawer.classList.add('open');
        applyPositionStyles();
        if (!aiProfile) await loadProfileAndCatalog();
        renderVisitorDrawer();
      } else {
        visitorDrawer.classList.remove('open');
      }
    } else {
      backdrop.classList.add('open');
      if (!catalogData) await loadProfileAndCatalog();
      renderAdminModal();
    }
  };

  // Global event delegation for [data-open-concierge] and #open-concierge links anywhere on the site
  document.addEventListener('click', (e) => {
    const trigger = e.target && e.target.closest && e.target.closest('[data-open-concierge], a[href="#open-concierge"], a[href="#concierge"]');
    if (trigger) {
      e.preventDefault();
      openConciergeChat(true);
      return;
    }
    setTimeout(checkMobileMenuOverlap, 50);
  });

  // Expose public programmatic controller on window
  window.GreenTreeConcierge = {
    open: () => openConciergeChat(true),
    close: () => {
      isDrawerOpen = false;
      visitorDrawer.classList.remove('open');
    },
    minimize: () => {
      isDrawerOpen = false;
      visitorDrawer.classList.remove('open');
      setFabState('mini');
    },
    hideCompletely: () => {
      isDrawerOpen = false;
      visitorDrawer.classList.remove('open');
      setFabState('closed');
    },
    resetPosition: () => {
      customPos = null;
      try { localStorage.removeItem(posStorageKey); } catch (e) {}
      applyPositionStyles();
    }
  };

  function mountWidget() {
    if (!document.body) return;
    updateFabBranding();
    if (!fab.parentNode) document.body.appendChild(fab);
    if (isPublicVisitor) {
      if (!visitorDrawer.parentNode) document.body.appendChild(visitorDrawer);
    } else {
      if (!backdrop.parentNode) document.body.appendChild(backdrop);
    }
    initDragToMove();
    injectMenuReopenLinks();
    checkMobileMenuOverlap();
    try {
      const obs = new MutationObserver(() => {
        checkMobileMenuOverlap();
        injectMenuReopenLinks();
      });
      obs.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class', 'style', 'aria-expanded'] });
    } catch (e) {}
    loadProfileAndCatalog();
    wireUniversalTelemetryV2();
  }

  // Universal Fleet Matomo Engagement, Dwell, Scroll & Hot-Spot Engine (`GTS-TEL-006`)
  function wireUniversalTelemetryV2() {
    try {
      if (window.__GT_TELEMETRY_V2_ACTIVE__) return;
      if (navigator.globalPrivacyControl === true || navigator.doNotTrack === '1' || window.doNotTrack === '1') return;
      window.__GT_TELEMETRY_V2_ACTIVE__ = true;

      const paq = (window._paq = window._paq || []);
      paq.push(['enableHeartBeatTimer', 5]);
      paq.push(['trackVisibleContentImpressions', true, 750]);

      let pageEnterMs = Date.now();
      let maxScrollPct = 0;
      let exitFlushed = false;
      let firedFoldScroll = false;
      let currentPath = window.location.pathname || '/';
      const firedScrolls = new Set();
      const observedSections = new Map();
      const firedSections = new Set();
      let timers = [];
      let sectionObserver = null;

      function startPageTimers() {
        currentPath = window.location.pathname || '/';
        pageEnterMs = Date.now();
        maxScrollPct = 0;
        exitFlushed = false;
        firedFoldScroll = false;
        firedScrolls.clear();
        firedSections.clear();
        timers.forEach((id) => window.clearTimeout(id));
        timers = [];
        observedSections.forEach((tid) => window.clearTimeout(tid));
        observedSections.clear();
        if (sectionObserver) sectionObserver.disconnect();

        [3, 5, 10, 15, 30, 45, 60, 90, 120, 180, 300].forEach((sec) => {
          const id = window.setTimeout(() => {
            if (document.visibilityState === 'visible') {
              paq.push(['trackEvent', 'On-Page Timer', 'Dwell ' + sec + 's', currentPath, sec]);
            }
          }, sec * 1000);
          timers.push(id);
        });

        window.setTimeout(() => {
          if (typeof IntersectionObserver === 'undefined') return;
          sectionObserver = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                const el = entry.target;
                const h = el.querySelector && el.querySelector('h1, h2, h3, summary');
                const raw = h ? h.textContent : el.getAttribute('aria-label') || el.textContent || el.tagName;
                const label = String(raw || '').replace(/\s+/g, ' ').trim().slice(0, 72);
                if (!label || firedSections.has(label)) return;
                if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
                  if (!observedSections.has(el)) {
                    const tid = window.setTimeout(() => {
                      if (document.visibilityState === 'visible' && !firedSections.has(label)) {
                        firedSections.add(label);
                        paq.push(['trackEvent', 'Hot Spot - Section', 'Read: ' + label, currentPath, 3]);
                      }
                    }, 3000);
                    observedSections.set(el, tid);
                  }
                } else if (observedSections.has(el)) {
                  window.clearTimeout(observedSections.get(el));
                  observedSections.delete(el);
                }
              });
            },
            { threshold: [0.35] }
          );
          document.querySelectorAll('main section, main article, main pre, main table, main details, section, article').forEach((el) => {
            sectionObserver.observe(el);
          });
        }, 400);
      }

      window.addEventListener(
        'scroll',
        function () {
          const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
          if (scrollTop >= 150 && !firedFoldScroll) {
            firedFoldScroll = true;
            paq.push(['trackEvent', 'Scroll Depth', 'Scrolled Past Fold (150px)', currentPath, 5]);
          }
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight <= 0) return;
          const pct = Math.min(100, Math.round((scrollTop / docHeight) * 100));
          if (pct > maxScrollPct) maxScrollPct = pct;
          [10, 25, 50, 75, 90, 100].forEach((threshold) => {
            if (pct >= threshold && !firedScrolls.has(threshold)) {
              firedScrolls.add(threshold);
              paq.push(['trackEvent', 'Scroll Depth', 'Scrolled ' + threshold + '%', currentPath, threshold]);
            }
          });
        },
        { passive: true }
      );

      function flushExitDwell(reason) {
        if (exitFlushed) return;
        const elapsedSec = Math.max(1, Math.round((Date.now() - pageEnterMs) / 1000));
        exitFlushed = true;
        paq.push([
          'trackEvent',
          'Dwell Time',
          'Total Dwell ' + elapsedSec + 's (Max Scroll ' + maxScrollPct + '% | ' + reason + ')',
          currentPath,
          elapsedSec
        ]);
      }

      document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'hidden') flushExitDwell('tab-hidden');
        else exitFlushed = false;
      });
      window.addEventListener('pagehide', function () {
        flushExitDwell('pagehide');
      });

      document.addEventListener('click', function (e) {
        const rawTarget = e.target;
        if (!rawTarget || !rawTarget.tagName) return;
        if (rawTarget.closest && rawTarget.closest('.gt-dh-visitor-drawer, .gt-dh-fab')) return;
        const vw = Math.max(1, window.innerWidth || 1);
        const docH = Math.max(1, document.documentElement.scrollHeight || window.innerHeight || 1);
        const xPct = Math.round((e.clientX / vw) * 100);
        const yPct = Math.round(((e.clientY + window.scrollY) / docH) * 100);
        const interactive = rawTarget.closest ? rawTarget.closest('a, button, summary, pre, table, h2, h3') : null;
        const hotspotEl = interactive || rawTarget;
        const tag = (hotspotEl.tagName || 'el').toLowerCase();
        const snippet = String(hotspotEl.textContent || hotspotEl.getAttribute('aria-label') || tag)
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 64);
        paq.push([
          'trackEvent',
          'Hot Spot - Click',
          tag.toUpperCase() + ': ' + (snippet || 'element'),
          currentPath + ' @ (' + xPct + '% X, ' + yPct + '% Y)'
        ]);
      });

      document.addEventListener('copy', function () {
        const sel = (window.getSelection && window.getSelection().toString() || '').replace(/\s+/g, ' ').trim();
        if (!sel) return;
        paq.push(['trackEvent', 'Hot Spot - Copy', 'Copied: ' + sel.slice(0, 72), currentPath, sel.length]);
      });

      startPageTimers();
    } catch (e) {}
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    mountWidget();
  } else {
    document.addEventListener('DOMContentLoaded', mountWidget);
  }
})();
