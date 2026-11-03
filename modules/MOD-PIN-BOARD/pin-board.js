/**
 * GreenTree Visual Pin Board & Preview Session Client (`assets/pin-board.js`)
 * Standalone, zero-dependency drop-in script for any website hosted on Netlify.
 *
 * Optional Configuration before loading this script:
 * <script>
 *   window.GREENTREE_PIN_CONFIG = {
 *     siteDivision: "Client Brand Name",
 *     defaultReviewer: "Client",
 *     sharedCookieDomain: "greentreehosting.com",
 *     boardUrl: "/admin/#feedback-board"
 *   };
 * </script>
 */
(function () {
  'use strict';
  if (window.__GREENTREE_PIN_BOARD_LOADED__) return;
  window.__GREENTREE_PIN_BOARD_LOADED__ = true;

  const CFG = Object.assign(
    {
      siteDivision: document.title.split('|')[0].trim() || 'Client Staging Preview',
      defaultReviewer: 'Client',
      sharedCookieDomain: 'greentreehosting.com',
      boardUrl: '/admin/#feedback-board',
      sessionTtlMs: 24 * 60 * 60 * 1000 // 24 hours matching server cookie Max-Age
    },
    window.GREENTREE_PIN_CONFIG || {}
  );


  // Helper: Convert hex color to rgb components
  function parseHexColor(hex) {
    if (!hex || typeof hex !== 'string') return null;
    var clean = hex.replace('#', '').trim();
    if (clean.length === 3) {
      clean = clean.split('').map(function (c) { return c + c; }).join('');
    }
    if (clean.length !== 6) return null;
    var num = parseInt(clean, 16);
    if (isNaN(num)) return null;
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  function hexToRgba(hex, alpha) {
    var rgb = parseHexColor(hex);
    if (!rgb) return 'rgba(245, 158, 11, ' + alpha + ')';
    return 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + alpha + ')';
  }

  function getReadableTextColor(hex) {
    var rgb = parseHexColor(hex);
    if (!rgb) return '#0F172A';
    var yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return yiq >= 148 ? '#0F172A' : '#FFFFFF';
  }

  // Auto-detect brand colors from document, config, or hostname
  function resolvePinTheme() {
    var userTheme = (CFG && CFG.theme) || {};
    var primary = userTheme.primary || userTheme.accent;
    var surface = userTheme.surface || userTheme.bg;

    // Check CSS variables on documentElement if not explicitly passed
    if (typeof window !== 'undefined' && window.getComputedStyle) {
      try {
        var compRoot = window.getComputedStyle(document.documentElement);
        if (!primary) {
          var cssAccent = compRoot.getPropertyValue('--brand-accent') ||
                          compRoot.getPropertyValue('--c-accent') ||
                          compRoot.getPropertyValue('--c-secondary') ||
                          compRoot.getPropertyValue('--color-primary');
          if (cssAccent && cssAccent.trim()) primary = cssAccent.trim();
        }
        if (!surface) {
          var cssDark = compRoot.getPropertyValue('--brand-primary') ||
                        compRoot.getPropertyValue('--c-dark') ||
                        compRoot.getPropertyValue('--color-navy');
          if (cssDark && cssDark.trim()) surface = cssDark.trim();
        }
      } catch (_) {}
    }

    // Auto-detect from meta theme-color if still unset
    if (!surface || !primary) {
      try {
        var metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme && metaTheme.content && metaTheme.content !== '#ffffff' && metaTheme.content !== '#000000') {
          var rgb = parseHexColor(metaTheme.content);
          if (rgb) {
            var yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
            if (yiq < 75 && !surface) {
              surface = metaTheme.content;
            } else if (!primary) {
              primary = metaTheme.content;
            }
          }
        }
      } catch (_) {}
    }

    // Auto-detect based on hostname patterns
    var host = (typeof window !== 'undefined' && window.location && window.location.hostname) ? window.location.hostname.toLowerCase() : '';
    if (host.indexOf('electricaldynamics') !== -1) {
      primary = primary || '#EA580C'; // EDI Conductor Copper-Orange
      surface = surface || '#0A2547'; // EDI Deep Cobalt Engineering Blue
    } else if (host.indexOf('goindustrialsupplies') !== -1) {
      primary = primary || '#3FA752'; // FPM Industrial Green
      surface = surface || '#0A1618'; // FPM Deep Charcoal / Industrial Night
    } else if (host.indexOf('cfelectrical') !== -1) {
      primary = primary || '#EA580C'; // CF Electrical Accent Amber/Orange
      surface = surface || '#0F1B32'; // CF Electrical Deep Navy
    } else if (host.indexOf('morningstartree') !== -1) {
      primary = primary || '#10B981'; // Morning Star Emerald
      surface = surface || '#09120E'; // Morning Star Forest Dark
    } else if (host.indexOf('modz') !== -1) {
      primary = primary || '#F59E0B'; // Modzelewska Amber Gold
      surface = surface || '#0B192C'; // Modzelewska Navy
    }

    // Default Fallbacks
    primary = primary || '#F59E0B';
    surface = surface || '#0F172A';

    var sRgb = parseHexColor(surface) || { r: 15, g: 23, b: 42 };

    return {
      primary: primary,
      primaryText: getReadableTextColor(primary),
      primaryLight: hexToRgba(primary, 0.12),
      primaryBorder: hexToRgba(primary, 0.40),
      surface: surface,
      surfaceGlass: 'rgba(' + sRgb.r + ',' + sRgb.g + ',' + sRgb.b + ',0.96)',
      surfaceText: getReadableTextColor(surface),
      accentText: primary
    };
  }

  const THEME = resolvePinTheme();

  const SESSION_STORAGE_KEY = 'gt_preview_session_deadline_v1';
  const FEEDBACK_STORAGE_KEY = 'gt_feedback_items_v1';
  const REVIEWER_STORAGE_KEY = 'gt_reviewer_name_v1';
  const REVIEWER_CONFIRMED_KEY = 'gt_reviewer_confirmed_v1';
  const PIN_DRAFT_KEY = 'gt_pin_draft_v1';
  const PINS_VISIBLE_KEY = 'gt_pins_visible_v1';
  const DOCK_COLLAPSED_KEY = 'gt_dock_collapsed_v1';
  const DOCK_POS_KEY = 'gt_dock_pos_v1';

  let feedbackItems = [];
  let feedbackSettings = {
    portalTitle: CFG.siteDivision + ' - Review & Intake Portal',
    portalSlug: '/admin/',
    defaultReviewerName: CFG.defaultReviewer,
    overlayEnabled: true,
    overlayMode: 'preview'
  };
  let pinModeActive = false;
  let pinsVisible = (function () {
    try {
      const v = localStorage.getItem(PINS_VISIBLE_KEY);
      if (v === '0') return false;
    } catch (_) {}
    return true;
  })();
  let pendingPinTarget = null;
  let pendingScreenshotDataUrl = '';
  let serverVerifiedReviewer = '';

  // 1. Expire any legacy host-only modz_reviewer cookie so only the server's Domain cookie applies
  try {
    if (window.location.hostname.indexOf(CFG.sharedCookieDomain) !== -1) {
      document.cookie = 'modz_reviewer=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'modz_reviewer=; path=/; max-age=0; Secure; SameSite=Lax';
    }
  } catch (_) {}

  // 2. 24-Hour Session Countdown Timer Helper
  function getSessionDeadline() {
    try {
      const raw = Number(localStorage.getItem(SESSION_STORAGE_KEY) || '0');
      if (raw > Date.now()) return raw;
    } catch (_) {}
    const next = Date.now() + CFG.sessionTtlMs;
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, String(next));
    } catch (_) {}
    return next;
  }

  function resetSessionDeadline() {
    const next = Date.now() + CFG.sessionTtlMs;
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, String(next));
    } catch (_) {}
    updateSessionTimerUI();
    return next;
  }

  function updateSessionTimerUI() {
    if (window.location.pathname.indexOf('/gate') === 0) return;
    const deadline = getSessionDeadline();
    const remainingMs = Math.max(0, deadline - Date.now());
    const totalSec = Math.ceil(remainingMs / 1000);
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    const label = document.getElementById('modzSessionTimerLabel');
    if (label) {
      if (remainingMs > 0) {
        label.textContent =
          hrs > 0
            ? 'Session: ' + hrs + 'h ' + String(mins).padStart(2, '0') + 'm'
            : 'Session: ' + String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
      } else {
        label.textContent = 'Renew Session (+24h)';
      }
    }
  }

  if (window.location.pathname.indexOf('/gate') !== 0) {
    setInterval(updateSessionTimerUI, 1000);
  }

  // 3. Reviewer Identity & Cookie Helpers
  function getCookieVal(name) {
    if (typeof document.cookie !== 'string') return '';
    const parts = document.cookie.split(';');
    const matches = [];
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i].trim();
      if (p.indexOf(name + '=') === 0) {
        try {
          matches.push(decodeURIComponent(p.slice(name.length + 1)).trim());
        } catch (_) {
          matches.push(p.slice(name.length + 1).trim());
        }
      }
    }
    if (!matches.length) return '';
    if (name === 'modz_reviewer') {
      for (let j = 0; j < matches.length; j++) {
        const low = (matches[j] || '').toLowerCase();
        if (low && low !== 'modz' && low !== 'client') {
          return matches[j];
        }
      }
    }
    return matches[0] || '';
  }

  function getCurrentReviewerName() {
    const fromCookie = (getCookieVal('modz_reviewer') || '').trim();
    if (fromCookie && fromCookie.toLowerCase() !== 'modz' && fromCookie.toLowerCase() !== 'client') {
      return fromCookie;
    }
    if (
      serverVerifiedReviewer &&
      serverVerifiedReviewer.toLowerCase() !== 'modz' &&
      serverVerifiedReviewer.toLowerCase() !== 'client'
    ) {
      return serverVerifiedReviewer;
    }
    let saved = '';
    try {
      saved = (localStorage.getItem(REVIEWER_STORAGE_KEY) || '').trim();
    } catch (_) {}
    if (saved && saved.toLowerCase() !== 'modz' && saved.toLowerCase() !== 'client') {
      return saved;
    }
    return fromCookie || serverVerifiedReviewer || saved || CFG.defaultReviewer;
  }

  function setCurrentReviewerName(name, writeCookie) {
    const cleaned =
      String(name || '')
        .replace(/[<>"]/g, '')
        .trim()
        .slice(0, 48) || CFG.defaultReviewer;
    serverVerifiedReviewer = cleaned;
    try {
      localStorage.setItem(REVIEWER_STORAGE_KEY, cleaned);
    } catch (_) {}
    if (writeCookie) {
      try {
        const isShared = window.location.hostname.indexOf(CFG.sharedCookieDomain) !== -1;
        const domainPart = isShared ? '; domain=.' + CFG.sharedCookieDomain : '';
        document.cookie =
          'modz_reviewer=' +
          encodeURIComponent(cleaned) +
          domainPart +
          '; path=/; max-age=86400; Secure; SameSite=Lax';
      } catch (_) {}
    }
    const badge = document.getElementById('modzDockReviewerName');
    if (badge) badge.textContent = cleaned;
    return cleaned;
  }

  function isReviewerNameConfirmed() {
    try {
      const current = getCurrentReviewerName().toLowerCase();
      if (current && current !== 'modz' && current !== 'client') return true;
      if (localStorage.getItem(REVIEWER_CONFIRMED_KEY) === '1') return true;
    } catch (_) {}
    return false;
  }

  function markReviewerNameConfirmed() {
    try {
      localStorage.setItem(REVIEWER_CONFIRMED_KEY, '1');
    } catch (_) {}
  }

  function loadPinDraft() {
    try {
      const raw = localStorage.getItem(PIN_DRAFT_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return null;
  }

  function savePinDraft(draftObj) {
    try {
      localStorage.setItem(PIN_DRAFT_KEY, JSON.stringify(draftObj));
    } catch (_) {}
  }

  function clearPinDraft() {
    try {
      localStorage.removeItem(PIN_DRAFT_KEY);
    } catch (_) {}
  }

  function formatPageLabel(pagePath) {
    if (!pagePath || pagePath === '/') return 'Home';
    const clean = pagePath.replace(/^\/+|\/+$/g, '');
    const seg = clean.split('/').pop() || clean;
    return seg
      .split('-')
      .map(function (w) {
        return w.charAt(0).toUpperCase() + w.slice(1);
      })
      .join(' ');
  }

  function loadLocalFeedback() {
    try {
      const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) feedbackItems = parsed;
      }
    } catch (_) {}
    return feedbackItems;
  }

  function saveLocalFeedback(items) {
    if (Array.isArray(items)) feedbackItems = items;
    try {
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbackItems));
    } catch (_) {}
  }

  // 4. DOM Selector & Real Pixel Screenshot Engine (html2canvas + Fallback)
  function getElementSelector(el) {
    if (!el || el.nodeType !== 1) return 'body';
    if (el.id) return '#' + el.id;
    const parts = [];
    let cur = el;
    let depth = 0;
    while (cur && cur.nodeType === 1 && cur.tagName !== 'HTML' && depth < 5) {
      let part = cur.tagName.toLowerCase();
      if (cur.id) {
        parts.unshift('#' + cur.id);
        break;
      }
      if (cur.parentElement) {
        const siblings = Array.from(cur.parentElement.children).filter(function (c) {
          return c.tagName === cur.tagName;
        });
        if (siblings.length > 1) {
          const idx = siblings.indexOf(cur) + 1;
          part += ':nth-of-type(' + idx + ')';
        }
      }
      parts.unshift(part);
      cur = cur.parentElement;
      depth++;
    }
    return parts.join(' > ') || 'body';
  }

  function findRelatedImage(el) {
    if (!el || el.nodeType !== 1) return null;
    if (el.tagName === 'IMG') return el;
    if (el.querySelector) {
      const childImg = el.querySelector('img');
      if (childImg) return childImg;
    }
    const card = el.closest && el.closest('figure, article, .group, section');
    if (card && card.querySelector) {
      return card.querySelector('img');
    }
    return null;
  }

  function getElementSnippet(el) {
    if (!el) return '';
    if (el.tagName === 'IMG') {
      return 'Image: ' + (el.getAttribute('alt') || el.getAttribute('src') || 'Photo');
    }
    const img = findRelatedImage(el);
    const txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (txt) return txt.slice(0, 140);
    if (img) return 'Image: ' + (img.getAttribute('alt') || img.getAttribute('src') || 'Photo');
    return el.tagName.toLowerCase();
  }

  let html2CanvasLoading = false;
  let html2CanvasCallbacks = [];
  function ensureHtml2Canvas(cb) {
    if (typeof window.html2canvas === 'function') {
      return cb(window.html2canvas);
    }
    html2CanvasCallbacks.push(cb);
    if (html2CanvasLoading) return;
    html2CanvasLoading = true;
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = function () {
      const list = html2CanvasCallbacks.slice();
      html2CanvasCallbacks = [];
      list.forEach(function (fn) {
        try {
          fn(window.html2canvas);
        } catch (_) {
          fn(null);
        }
      });
    };
    script.onerror = function () {
      const list = html2CanvasCallbacks.slice();
      html2CanvasCallbacks = [];
      list.forEach(function (fn) {
        fn(null);
      });
    };
    document.head.appendChild(script);
  }

  function generateElementSnapshot(el, relX, relY, callback) {
    try {
      if (!el || el.nodeType !== 1) return callback('');
      let captureTarget = el;
      const enclosingCard = el.closest && el.closest('figure, article, [data-subgallery-card]');
      if (enclosingCard && enclosingCard.offsetHeight > 0 && enclosingCard.offsetHeight < 900) {
        captureTarget = enclosingCard;
      } else if (
        el.parentElement &&
        el.parentElement !== document.body &&
        el.offsetHeight < 90 &&
        el.parentElement.offsetHeight < 650
      ) {
        captureTarget = el.parentElement;
      }

      ensureHtml2Canvas(function (h2c) {
        if (typeof h2c === 'function') {
          const hoverBox = document.getElementById('modzPinHoverBox');
          const prevHoverDisplay = hoverBox ? hoverBox.style.display : '';
          if (hoverBox) hoverBox.style.display = 'none';

          const targetRect = captureTarget.getBoundingClientRect();
          const compStyle = window.getComputedStyle(captureTarget);
          const bgColor =
            compStyle.backgroundColor &&
            compStyle.backgroundColor !== 'rgba(0, 0, 0, 0)' &&
            compStyle.backgroundColor !== 'transparent'
              ? compStyle.backgroundColor
              : '#0F172A';

          h2c(captureTarget, {
            useCORS: true,
            allowTaint: true,
            backgroundColor: bgColor,
            scale: Math.min(1.5, window.devicePixelRatio || 1),
            logging: false,
            width: Math.min(1200, Math.max(120, Math.ceil(targetRect.width))),
            height: Math.min(900, Math.max(60, Math.ceil(targetRect.height)))
          })
            .then(function (renderedCanvas) {
              if (hoverBox) hoverBox.style.display = prevHoverDisplay;
              const out = document.createElement('canvas');
              const maxW = 720;
              const maxH = 480;
              const ratio = Math.min(maxW / renderedCanvas.width, maxH / renderedCanvas.height, 1);
              out.width = Math.max(320, Math.round(renderedCanvas.width * ratio));
              out.height = Math.max(180, Math.round(renderedCanvas.height * ratio));
              const ctx = out.getContext('2d');
              ctx.fillStyle = bgColor;
              ctx.fillRect(0, 0, out.width, out.height);
              ctx.drawImage(renderedCanvas, 0, 0, out.width, out.height);

              const elRect = el.getBoundingClientRect();
              const pinX = Math.max(
                16,
                Math.min(
                  out.width - 16,
                  Math.round(
                    ((elRect.left - targetRect.left + elRect.width * (relX || 0.5)) /
                      Math.max(1, targetRect.width)) *
                      out.width
                  )
                )
              );
              const pinY = Math.max(
                16,
                Math.min(
                  out.height - 16,
                  Math.round(
                    ((elRect.top - targetRect.top + elRect.height * (relY || 0.5)) /
                      Math.max(1, targetRect.height)) *
                      out.height
                  )
                )
              );
              ctx.beginPath();
              ctx.arc(pinX, pinY, 10, 0, Math.PI * 2);
              ctx.fillStyle = hexToRgba(THEME.primary, 0.9);
              ctx.fill();
              ctx.lineWidth = 2.5;
              ctx.strokeStyle = '#FFFFFF';
              ctx.stroke();

              callback(out.toDataURL('image/jpeg', 0.82));
            })
            .catch(function () {
              if (hoverBox) hoverBox.style.display = prevHoverDisplay;
              fallbackCanvasSnapshot(el, callback);
            });
          return;
        }
        fallbackCanvasSnapshot(el, callback);
      });
    } catch (_) {
      callback('');
    }
  }

  function fallbackCanvasSnapshot(el, callback) {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 360;
      const ctx = canvas.getContext('2d');
      if (!ctx) return callback('');
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(0, 0, 640, 360);

      const snippet = getElementSnippet(el);
      const imgEl = findRelatedImage(el);
      if (imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
        try {
          const scale = Math.min(600 / imgEl.naturalWidth, 240 / imgEl.naturalHeight);
          const dw = imgEl.naturalWidth * scale;
          const dh = imgEl.naturalHeight * scale;
          ctx.drawImage(imgEl, (640 - dw) / 2, 20 + (240 - dh) / 2, dw, dh);
        } catch (_) {}
      }

      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.fillRect(0, 275, 640, 85);
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText((snippet || 'Selected Element').slice(0, 78), 16, 305);
      callback(canvas.toDataURL('image/jpeg', 0.8));
    } catch (_) {
      callback('');
    }
  }

  // 5. Server Sync & Top-Right Corner Marker Rendering
  function syncFeedbackWithServer(callback) {
    const localSnapshot = loadLocalFeedback().slice();
    fetch('/api/feedback', { method: 'GET', credentials: 'same-origin' })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (data) {
        if (data && data.ok) {
          if (data.settings) feedbackSettings = Object.assign(feedbackSettings, data.settings);
          if (data.reviewerName) {
            serverVerifiedReviewer = data.reviewerName;
            const low = data.reviewerName.toLowerCase();
            if ((low !== 'modz' && low !== 'client') || !localStorage.getItem(REVIEWER_STORAGE_KEY)) {
              setCurrentReviewerName(data.reviewerName, false);
            } else {
              const badge = document.getElementById('modzDockReviewerName');
              if (badge) badge.textContent = getCurrentReviewerName();
            }
          }
          if (Array.isArray(data.items)) {
            const serverById = {};
            data.items.forEach(function (si) {
              if (si && si.id) serverById[si.id] = si;
            });
            const unsyncedLocal = localSnapshot.filter(function (lp) {
              if (!lp || !lp.id) return false;
              const srv = serverById[lp.id];
              if (!srv) return true;
              if (!srv.commentText && lp.commentText) return true;
              if (srv.elementSelector === 'body' && lp.elementSelector && lp.elementSelector !== 'body') return true;
              return false;
            });

            if (unsyncedLocal.length > 0) {
              fetch('/api/feedback', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'sync_local_pins', items: unsyncedLocal })
              })
                .then(function (r2) {
                  return r2.ok ? r2.json() : null;
                })
                .then(function (syncResp) {
                  if (syncResp && Array.isArray(syncResp.items)) {
                    saveLocalFeedback(syncResp.items);
                    renderPagePins();
                  }
                })
                .catch(function () {});

              // Merge locally immediately so UI never flickers
              const mergedMap = {};
              data.items.forEach(function (si) {
                if (si && si.id) mergedMap[si.id] = si;
              });
              unsyncedLocal.forEach(function (lp) {
                mergedMap[lp.id] = Object.assign({}, mergedMap[lp.id] || {}, lp);
              });
              const mergedList = Object.keys(mergedMap)
                .map(function (k) { return mergedMap[k]; })
                .sort(function (a, b) { return (b.pinNumber || 0) - (a.pinNumber || 0); });
              saveLocalFeedback(mergedList);
            } else {
              saveLocalFeedback(data.items);
            }
          }
        }
        renderPagePins();
        if (callback) callback(feedbackItems);
      })
      .catch(function () {
        renderPagePins();
        if (callback) callback(feedbackItems);
      });
  }

  function getPageItems() {
    const curPath = window.location.pathname;
    return feedbackItems.filter(function (i) {
      return i.pagePath === curPath;
    });
  }

  function computeTicketProgress(ticket, now) {
    const nowMs = now || Date.now();
    const replies = Array.isArray(ticket.replies) ? ticket.replies : [];
    const agentReply = replies
      .slice()
      .reverse()
      .find(function (r) {
        return r && r.text && (r.text.toLowerCase().indexOf('fix now') !== -1 || (r.author && r.author.toLowerCase().indexOf('agent') !== -1));
      });
    const rawStart = agentReply
      ? new Date(agentReply.createdAt).getTime()
      : new Date(ticket.updatedAt || ticket.createdAt || nowMs).getTime();
    const startTime = isNaN(rawStart) ? nowMs : rawStart;
    const elapsedSecs = Math.max(0, Math.floor((nowMs - startTime) / 1000));

    let percent = 15;
    let stageNum = 1;
    let stageTitle = 'Analyzing Issue & AST';
    let stageDetail = 'Reading DOM element selector and page source';

    if (elapsedSecs < 15) {
      percent = Math.min(25, Math.floor(10 + (elapsedSecs / 15) * 15));
      stageNum = 1;
      stageTitle = 'Analyzing Issue & AST';
      stageDetail = 'Reading DOM element selector and page source';
    } else if (elapsedSecs < 45) {
      percent = Math.min(55, Math.floor(25 + ((elapsedSecs - 15) / 30) * 30));
      stageNum = 2;
      stageTitle = 'Patching Codebase';
      stageDetail = 'Implementing layout, copy & gallery modifications';
    } else if (elapsedSecs < 85) {
      percent = Math.min(82, Math.floor(55 + ((elapsedSecs - 45) / 40) * 27));
      stageNum = 3;
      stageTitle = 'Building & Verifying';
      stageDetail = 'Baking Sovereign layout & running security gate';
    } else if (elapsedSecs < 140) {
      percent = Math.min(94, Math.floor(82 + ((elapsedSecs - 85) / 55) * 12));
      stageNum = 4;
      stageTitle = 'Deploying to Cloud Metal';
      stageDetail = 'Syncing container & refreshing static assets';
    } else if (elapsedSecs <= 720) {
      percent = Math.min(98, Math.floor(94 + ((elapsedSecs - 140) / 60) * 4));
      stageNum = 4;
      stageTitle = 'Finalizing Health Check';
      stageDetail = 'Zero-downtime verification in progress';
    } else {
      percent = 99;
      stageNum = 4;
      stageTitle = 'Ready for Verification';
      stageDetail = 'Patch staged and awaiting final verification';
    }

    const elapsedFormatted =
      elapsedSecs > 720
        ? 'Staged ✓'
        : elapsedSecs < 60
          ? elapsedSecs + 's'
          : Math.floor(elapsedSecs / 60) + 'm ' + (elapsedSecs % 60) + 's';

    return {
      percent: percent,
      stageNum: stageNum,
      stageTitle: stageTitle,
      stageDetail: stageDetail,
      elapsedSecs: elapsedSecs,
      elapsedFormatted: elapsedFormatted
    };
  }

  function computeBoardSummary() {
    const total = feedbackItems.length;
    const queued = feedbackItems.filter(function (i) { return !i.status || i.status === 'open'; });
    const working = feedbackItems.filter(function (i) { return i.status === 'in_progress'; });
    const resolved = feedbackItems.filter(function (i) { return i.status === 'resolved'; });
    const completionPct = total > 0
      ? Math.round(((resolved.length + working.length * 0.5) / total) * 100)
      : 100;
    const primaryWorking = working[0] || null;
    const activeProgress = primaryWorking ? computeTicketProgress(primaryWorking, Date.now()) : null;
    return {
      total: total,
      queuedCount: queued.length,
      workingCount: working.length,
      resolvedCount: resolved.length,
      completionPct: completionPct,
      queued: queued,
      working: working,
      resolved: resolved,
      primaryWorking: primaryWorking,
      activeProgress: activeProgress
    };
  }

  function updateDockQueueStatusUI() {
    const btn = document.getElementById('modzDockQueueStatusBtn');
    const addBtn = document.getElementById('modzDockAddPinBtn');
    const isMobile = (window.innerWidth || document.documentElement.clientWidth || 1024) <= 768;
    if (addBtn && !pinModeActive) {
      addBtn.innerHTML = isMobile ? '<span>+ Pin</span>' : '<span>+ Pin Comment</span>';
    }
    if (!btn) return;
    const sum = computeBoardSummary();
    if (sum.workingCount > 0 && sum.primaryWorking && sum.activeProgress) {
      btn.style.background = 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)';
      btn.style.borderColor = '#60A5FA';
      if (isMobile) {
        btn.innerHTML =
          '<span style="display:inline-block;width:7px;height:7px;border-radius:9999px;background:#34D399;box-shadow:0 0 8px #34D399;flex-shrink:0;"></span>' +
          '<span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">⚡ #' + (sum.primaryWorking.pinNumber || sum.primaryWorking.id || 1) + ' (' + sum.activeProgress.percent + '%) &bull; ' + sum.activeProgress.stageTitle + ' | Q:' + sum.queuedCount + ' &bull; Done:' + sum.resolvedCount + '</span>';
      } else {
        btn.innerHTML =
          '<span style="display:inline-block;width:8px;height:8px;border-radius:9999px;background:#34D399;box-shadow:0 0 8px #34D399;"></span>' +
          '<span>⚡ Working (#' + (sum.primaryWorking.pinNumber || 1) + ' &bull; ' + sum.activeProgress.percent + '% &bull; ' + sum.activeProgress.stageTitle + ')</span>' +
          '<span style="padding:1px 6px;border-radius:6px;background:rgba(15,23,42,0.55);color:#FDE047;font-size:10px;font-weight:800;">Q:' + sum.queuedCount + ' &bull; Done:' + sum.resolvedCount + '</span>';
      }
    } else if (sum.workingCount === 0 && sum.queuedCount === 0 && sum.resolvedCount > 0) {
      btn.style.background = 'linear-gradient(135deg, #064E3B 0%, #047857 100%)';
      btn.style.borderColor = '#34D399';
      btn.innerHTML =
        '<span style="display:inline-block;width:7px;height:7px;border-radius:9999px;background:#34D399;box-shadow:0 0 8px #34D399;"></span>' +
        '<span style="color:#ECFDF5;font-weight:800;">✓ All ' + sum.resolvedCount + ' Pins Resolved (100%)</span>';
    } else {
      btn.style.background = '#0F172A';
      btn.style.borderColor = '#334155';
      btn.innerHTML =
        '<span style="display:inline-block;width:7px;height:7px;border-radius:9999px;background:' + (sum.queuedCount > 0 ? '#F59E0B' : '#10B981') + ';"></span>' +
        '<span>Queue: <strong style="color:#FBBF24;">' + sum.queuedCount + '</strong></span>' +
        '<span style="opacity:0.45;">|</span>' +
        '<span>Working: <strong style="color:#60A5FA;">' + sum.workingCount + '</strong></span>' +
        '<span style="opacity:0.45;">|</span>' +
        '<span>Done: <strong style="color:#34D399;">' + sum.resolvedCount + '</strong> (' + (sum.total > 0 ? sum.completionPct + '%' : 'Ready') + ')</span>';
    }
  }
  const updateDockStatusPill = updateDockQueueStatusUI;

  function hasFixedAncestor(el) {
    let cur = el;
    while (cur && cur.nodeType === 1 && cur !== document.body && cur !== document.documentElement) {
      try {
        const st = window.getComputedStyle(cur);
        if (st && st.position === 'fixed') return true;
      } catch (_) {}
      cur = cur.parentElement;
    }
    return false;
  }

  function renderPagePins() {
    if (window.location.pathname.indexOf('/gate') === 0) return;

    let layer = document.getElementById('modzPinsOverlayLayer');
    if (!layer) {
      layer = document.createElement('div');
      layer.id = 'modzPinsOverlayLayer';
      layer.className = 'pointer-events-none';
      layer.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:0;z-index:200000;';
      document.body.appendChild(layer);
    }
    layer.innerHTML = '';

    const pageItems = getPageItems();
    const countBadge = document.getElementById('modzDockPinCount');
    if (countBadge) countBadge.textContent = String(pageItems.length);
    const miniCount = document.getElementById('modzDockMiniCount');
    if (miniCount) miniCount.textContent = String(pageItems.length);
    const stateBadge = document.getElementById('modzDockPinsStateBadge');
    if (stateBadge) {
      stateBadge.textContent = pinsVisible ? 'ON' : 'OFF';
      stateBadge.style.background = pinsVisible ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)';
      stateBadge.style.color = pinsVisible ? '#6EE7B7' : '#FDA4AF';
      stateBadge.style.borderColor = pinsVisible ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.4)';
    }
    updateDockQueueStatusUI();

    if (!pinsVisible) return;

    const sameElementCounts = {};
    pageItems.forEach(function (item) {
      const selStr = item.elementSelector || item.selector || 'body';
      let targetEl = null;
      try {
        targetEl = document.querySelector(selStr);
      } catch (_) {}
      if (!targetEl) targetEl = document.body;

      let rect = targetEl.getBoundingClientRect();
      // If element is inside a currently-closed modal/drawer (zero box size), skip floating badge until modal opens
      if (targetEl !== document.body && rect.width === 0 && rect.height === 0) {
        const inClosedModal = targetEl.closest && targetEl.closest('[role="dialog"], .gt-pt-backdrop, [id*="Modal"], [id*="modal"], [id*="lightbox"], [id*="Lightbox"]');
        if (inClosedModal) return;
      }

      let walkEl = targetEl;
      while (rect.width === 0 && rect.height === 0 && walkEl && walkEl.parentElement && walkEl !== document.body) {
        walkEl = walkEl.parentElement;
        rect = walkEl.getBoundingClientRect();
      }
      const isFixed = hasFixedAncestor(walkEl);
      const scrollX = isFixed ? 0 : (window.pageXOffset || document.documentElement.scrollLeft);
      const scrollY = isFixed ? 0 : (window.pageYOffset || document.documentElement.scrollTop);

      const selKey = selStr;
      const idxOnEl = sameElementCounts[selKey] || 0;
      sameElementCounts[selKey] = idxOnEl + 1;

      // Anchor marker to the element's top-right corner, OUTSIDE the text box
      const rawRight = rect.right + scrollX + 6 - idxOnEl * 30;
      const leftPx = Math.max(14, Math.min(document.documentElement.clientWidth - 34, rawRight));
      const topPx = Math.max(isFixed ? 18 : 52, rect.top + scrollY - 14);

      const pinBtn = document.createElement('button');
      pinBtn.type = 'button';
      pinBtn.setAttribute('data-pin-id', item.id);
      pinBtn.title =
        '#' +
        item.pinNumber +
        ' (' +
        formatPageLabel(item.pagePath) +
        ') by ' +
        (item.reviewerName || item.authorName || 'Reviewer') +
        ': ' +
        (item.commentText || item.comment || '');

      const bgColor =
        item.status === 'resolved' ? '#10B981' : item.status === 'in_progress' ? '#3B82F6' : THEME.primary;
      const txtColor = item.status === 'in_progress' ? '#FFFFFF' : '#0F172A';

      pinBtn.style.cssText =
        'position:' + (isFixed ? 'fixed' : 'absolute') + ';left:' +
        (leftPx - 14) +
        'px;top:' +
        (topPx - 14) +
        'px;z-index:200001;pointer-events:auto;width:28px;height:28px;border-radius:9999px;background:' +
        bgColor +
        ';color:' +
        txtColor +
        ';border:2px solid #0F172A;font-family:monospace;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 10px 15px -3px rgba(0,0,0,0.4);';
      pinBtn.textContent = item.status === 'resolved' ? '✓' : String(item.pinNumber || '•');

      pinBtn.addEventListener('mouseenter', function () {
        if (walkEl && walkEl !== document.body) {
          walkEl.setAttribute('data-prev-outline', walkEl.style.outline || '');
          walkEl.style.outline = '2px dashed ' + THEME.primary;
          walkEl.style.outlineOffset = '4px';
        }
      });
      pinBtn.addEventListener('mouseleave', function () {
        if (walkEl && walkEl !== document.body) {
          walkEl.style.outline = walkEl.getAttribute('data-prev-outline') || '';
          walkEl.style.outlineOffset = '';
        }
      });
      pinBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openPinThreadModal(item.id);
      });

      layer.appendChild(pinBtn);
    });
  }

  function setPinMode(active) {
    pinModeActive = !!active;
    const banner = document.getElementById('modzPinModeBanner');
    const hoverBox = document.getElementById('modzPinHoverBox');
    const dockPinBtn = document.getElementById('modzDockAddPinBtn');

    if (pinModeActive) {
      document.body.style.cursor = 'crosshair';
      if (banner) banner.style.display = 'flex';
      if (dockPinBtn) {
        dockPinBtn.style.background = '#DC2626';
        dockPinBtn.style.color = '#FFFFFF';
        dockPinBtn.innerHTML = '<span>Cancel Pin (ESC)</span>';
      }
    } else {
      document.body.style.cursor = '';
      if (banner) banner.style.display = 'none';
      if (hoverBox) hoverBox.style.display = 'none';
      if (dockPinBtn) {
        dockPinBtn.style.background = THEME.primary;
        dockPinBtn.style.color = THEME.primaryText;
        dockPinBtn.innerHTML = '<span>+ Pin Comment</span>';
      }
    }
  }

  // 6. Composer & Thread Modals
  function openPinComposerModal(targetInfo) {
    pendingPinTarget = targetInfo;
    pendingScreenshotDataUrl = '';
    resetSessionDeadline();

    let modal = document.getElementById('modzPinComposerModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modzPinComposerModal';
      modal.style.cssText =
        'position:fixed;inset:0;z-index:200030;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(2,6,23,0.82);backdrop-filter:blur(4px);font-family:system-ui,-apple-system,sans-serif;';
      modal.innerHTML = `
        <div style="width:100%;max-width:512px;background:#FFFFFF;border-radius:16px;border:2px solid ${THEME.primary};overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.6);max-height:90vh;overflow-y:auto;" onclick="event.stopPropagation()">
          <div style="background:${THEME.surface};color:#FFFFFF;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #334155;">
            <div>
              <div style="font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:${THEME.accentText};font-weight:700;">In-Page Visual Review Pin</div>
              <div style="font-size:16px;font-weight:800;margin-top:2px;">Drop a Comment on This Element</div>
            </div>
            <button type="button" id="modzComposerCloseBtn" style="padding:6px 10px;border-radius:8px;background:#1E293B;color:#CBD5E1;border:1px solid #475569;font-family:monospace;font-size:12px;cursor:pointer;">Close &times;</button>
          </div>
          <form id="modzPinComposerForm" style="padding:20px;display:flex;flex-direction:column;gap:14px;font-size:12px;color:#1E293B;">
            <div style="padding:10px 12px;border-radius:10px;background:#F1F5F9;border:1px solid #E2E8F0;">
              <div style="font-family:monospace;font-size:10px;font-weight:700;text-transform:uppercase;color:#475569;">Pinned Element Target</div>
              <div id="modzComposerTargetSnippet" style="font-weight:600;color:#0F172A;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;"></div>
              <div id="modzComposerTargetSelector" style="font-family:monospace;font-size:10px;color:#64748B;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
              <div>
                <label style="display:block;font-family:monospace;font-size:10px;font-weight:700;text-transform:uppercase;color:#334155;margin-bottom:4px;">Your Name</label>
                <input id="modzComposerReviewer" type="text" maxlength="48" placeholder="Your name" style="width:100%;padding:8px 10px;border-radius:8px;border:1px solid #CBD5E1;font-weight:600;color:#0F172A;box-sizing:border-box;" />
              </div>
              <div>
                <label style="display:block;font-family:monospace;font-size:10px;font-weight:700;text-transform:uppercase;color:#334155;margin-bottom:4px;">Category</label>
                <select id="modzComposerCategory" style="width:100%;padding:8px 10px;border-radius:8px;border:1px solid #CBD5E1;font-weight:600;color:#0F172A;box-sizing:border-box;">
                  <option value="Copy / Text Edit">Copy / Text Edit</option>
                  <option value="Photo / Caption">Photo / Caption</option>
                  <option value="Design / Layout">Design / Layout</option>
                  <option value="Approved / Looks Great">Approved / Looks Great</option>
                </select>
              </div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                <label style="font-family:monospace;font-size:10px;font-weight:700;text-transform:uppercase;color:#334155;">Your Comment</label>
                <span id="modzDraftStatusLabel" style="font-family:monospace;font-size:10px;color:#047857;font-weight:700;display:none;">✓ Draft saved</span>
              </div>
              <textarea id="modzComposerText" rows="3" required placeholder="Type what you'd like changed here..." style="width:100%;padding:10px;border-radius:10px;border:2px solid #CBD5E1;color:#0F172A;font-size:13px;box-sizing:border-box;"></textarea>
            </div>
            <div style="padding:10px;border-radius:10px;background:#F8FAFC;border:1px solid #E2E8F0;">
              <div style="font-family:monospace;font-size:10px;font-weight:700;text-transform:uppercase;color:#334155;margin-bottom:6px;">Real Element Screenshot</div>
              <div id="modzComposerSnapPreviewWrap" style="display:none;border-radius:8px;overflow:hidden;border:1px solid #CBD5E1;background:#020617;">
                <img id="modzComposerSnapPreview" src="" alt="Snapshot preview" style="width:100%;max-height:140px;object-fit:contain;display:block;" />
              </div>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:10px;padding-top:4px;">
              <button type="button" id="modzComposerCancelBtn" style="padding:10px 16px;border-radius:10px;background:#F1F5F9;border:none;color:#334155;font-weight:700;cursor:pointer;">Cancel</button>
              <button type="submit" style="padding:10px 18px;border-radius:10px;background:${THEME.primary};border:none;color:${THEME.primaryText};font-weight:800;text-transform:uppercase;cursor:pointer;">Post Pin &rarr;</button>
            </div>
          </form>
        </div>
      `;
      document.body.appendChild(modal);

      function closeComposer() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeComposer();
      });
      modal.querySelector('#modzComposerCloseBtn').addEventListener('click', closeComposer);
      modal.querySelector('#modzComposerCancelBtn').addEventListener('click', closeComposer);

      function handleDraftChange() {
        resetSessionDeadline();
        const revVal = modal.querySelector('#modzComposerReviewer').value || '';
        const catVal = modal.querySelector('#modzComposerCategory').value || 'Copy / Text Edit';
        const txtVal = modal.querySelector('#modzComposerText').value || '';
        savePinDraft({ reviewer: revVal, category: catVal, text: txtVal, updatedAt: Date.now() });
        const draftLbl = modal.querySelector('#modzDraftStatusLabel');
        if (draftLbl && txtVal.trim().length > 0) draftLbl.style.display = 'inline';
      }

      modal.querySelector('#modzComposerText').addEventListener('input', handleDraftChange);
      modal.querySelector('#modzComposerReviewer').addEventListener('input', handleDraftChange);

      modal.querySelector('#modzPinComposerForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const reviewerInput = modal.querySelector('#modzComposerReviewer');
        const catSelect = modal.querySelector('#modzComposerCategory');
        const textInput = modal.querySelector('#modzComposerText');
        const reviewerName = setCurrentReviewerName(
          reviewerInput.value || getCurrentReviewerName() || CFG.defaultReviewer,
          true
        );
        markReviewerNameConfirmed();
        const commentText = (textInput.value || '').trim();
        if (!commentText) return;
        clearPinDraft();

        const nextPinNum =
          feedbackItems.reduce(function (m, i) {
            return Math.max(m, i.pinNumber || 0);
          }, 0) + 1;

        const payload = {
          action: 'create',
          id: 'pin-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
          pinNumber: nextPinNum,
          siteDivision: CFG.siteDivision,
          pagePath: window.location.pathname,
          pageTitle: document.title,
          elementSelector: pendingPinTarget ? pendingPinTarget.selector : 'body',
          elementSnippet: pendingPinTarget ? pendingPinTarget.snippet : '',
          imageSrc: pendingPinTarget ? pendingPinTarget.imageSrc : '',
          relX: pendingPinTarget ? pendingPinTarget.relX : 0.5,
          relY: pendingPinTarget ? pendingPinTarget.relY : 0.5,
          reviewerName: reviewerName,
          category: catSelect.value || 'Copy / Text Edit',
          status: 'open',
          commentText: commentText,
          screenshotDataUrl: pendingScreenshotDataUrl || '',
          reactions: {},
          replies: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        feedbackItems.unshift(payload);
        saveLocalFeedback(feedbackItems);
        renderPagePins();
        closeComposer();

        fetch('/api/feedback', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
          .then(function (r) {
            return r.ok ? r.json() : null;
          })
          .then(function (resp) {
            if (resp && Array.isArray(resp.items)) {
              saveLocalFeedback(resp.items);
              renderPagePins();
            }
          })
          .catch(function () {});
      });
    }

    modal.querySelector('#modzComposerTargetSnippet').textContent =
      targetInfo.snippet || 'Selected Page Element';
    modal.querySelector('#modzComposerTargetSelector').textContent = targetInfo.selector || 'body';

    const revInput = modal.querySelector('#modzComposerReviewer');
    const txtInput = modal.querySelector('#modzComposerText');
    const savedDraft = loadPinDraft();
    revInput.value = getCurrentReviewerName();
    txtInput.value = savedDraft && savedDraft.text ? savedDraft.text : '';

    generateElementSnapshot(targetInfo.el, targetInfo.relX, targetInfo.relY, function (dataUrl) {
      pendingScreenshotDataUrl = dataUrl || '';
      const wrap = modal.querySelector('#modzComposerSnapPreviewWrap');
      const img = modal.querySelector('#modzComposerSnapPreview');
      if (pendingScreenshotDataUrl) {
        img.src = pendingScreenshotDataUrl;
        wrap.style.display = 'block';
      } else {
        wrap.style.display = 'none';
      }
    });

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function dispatchFixNow(pinId, afterFn) {
    const item = feedbackItems.find(function (i) { return i.id === pinId; });
    if (!item) return;
    const author = getCurrentReviewerName();
    const nowIso = new Date().toISOString();
    item.status = 'in_progress';
    item.updatedAt = nowIso;
    if (!Array.isArray(item.replies)) item.replies = [];
    const replyText = '⚡ Fix Now dispatched by ' + author + ' - approved for autonomous implementation and deployment (Pin #' + (item.pinNumber || 1) + ').';
    item.replies.push({
      id: 'rep-' + Date.now(),
      author: author,
      text: replyText,
      createdAt: nowIso
    });
    saveLocalFeedback(feedbackItems);
    renderPagePins();
    fetch('/api/feedback', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'status', id: item.id, status: 'in_progress' })
    }).catch(function () {});
    fetch('/api/feedback', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reply', id: item.id, author: author, text: replyText })
    }).catch(function () {});
    if (afterFn) afterFn(item);
  }

  function openInPageSnapshotLightbox(shotUrl, pinNum, commentText) {
    if (!shotUrl) return;
    let lb = document.getElementById('modzSnapshotLightbox');
    if (!lb) {
      lb = document.createElement('div');
      lb.id = 'modzSnapshotLightbox';
      lb.style.cssText = 'position:fixed;inset:0;z-index:200060;background:rgba(2,6,23,0.92);backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;padding:24px;font-family:system-ui,-apple-system,sans-serif;';
      document.body.appendChild(lb);
      lb.addEventListener('click', function (e) {
        if (e.target === lb) lb.style.display = 'none';
      });
    }
    lb.innerHTML = `
      <div style="background:#0F172A;border:2px solid ${THEME.primary};border-radius:16px;max-width:960px;width:100%;max-height:92vh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 25px 60px rgba(0,0,0,0.85);" onclick="event.stopPropagation()">
        <div style="padding:14px 20px;background:#1E293B;border-bottom:1px solid #334155;display:flex;justify-content:space-between;align-items:center;gap:12px;">
          <div style="color:#FFFFFF;font-weight:800;font-size:14px;">
            <span style="padding:2px 8px;border-radius:6px;background:${THEME.primary};color:${THEME.primaryText};font-family:monospace;margin-right:8px;">#${pinNum || '•'}</span>
            ${(commentText || 'Pin Snapshot').replace(/</g, '&lt;')}
          </div>
          <button type="button" id="modzSnapLbClose" style="padding:6px 12px;border-radius:8px;background:#334155;color:#FFFFFF;border:none;font-family:monospace;font-weight:800;cursor:pointer;">Close &times;</button>
        </div>
        <div style="padding:20px;background:#020617;display:flex;align-items:center;justify-content:center;overflow:auto;max-height:78vh;">
          <img src="${shotUrl}" alt="Pin Snapshot" style="max-width:100%;max-height:72vh;object-fit:contain;border-radius:8px;" />
        </div>
      </div>
    `;
    lb.style.display = 'flex';
    lb.querySelector('#modzSnapLbClose').addEventListener('click', function () {
      lb.style.display = 'none';
    });
  }

  function openQueueStatusModal() {
    let modal = document.getElementById('modzQueueStatusModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modzQueueStatusModal';
      modal.style.cssText =
        'position:fixed;inset:0;z-index:200040;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(2,6,23,0.84);backdrop-filter:blur(6px);font-family:system-ui,-apple-system,sans-serif;';
      document.body.appendChild(modal);
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
    }

    let modalFilter = 'all';
    let modalViewMode = localStorage.getItem('gt_pin_view_mode') || 'cards';

    function renderQueueModalBody() {
      const sum = computeBoardSummary();
      const activeProg = sum.activeProgress;
      const autoFixMode = (feedbackSettings && feedbackSettings.pinAutoFixMode) || localStorage.getItem('gt_pin_autofix_mode') || 'approve';
      const filteredList = modalFilter === 'all'
        ? feedbackItems
        : feedbackItems.filter(function (p) { return (p.status || 'open') === modalFilter; });

      const workingBannerHtml = sum.primaryWorking && activeProg
        ? `
          <div style="padding:14px 16px;border-radius:14px;background:linear-gradient(135deg,#EFF6FF 0%,#EEF2FF 100%);border:2px solid #60A5FA;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="display:inline-block;width:10px;height:10px;border-radius:9999px;background:#2563EB;box-shadow:0 0 8px #2563EB;"></span>
                <span style="font-family:monospace;font-size:11px;font-weight:800;color:#1E3A8A;text-transform:uppercase;">⚡ ACTIVE WORKING TASK &bull; PIN #${sum.primaryWorking.pinNumber || 1} (${formatPageLabel(sum.primaryWorking.pagePath)})</span>
              </div>
              <span style="font-family:monospace;font-size:13px;font-weight:900;color:#1D4ED8;">${activeProg.percent}% COMPLETE &bull; Elapsed: ${activeProg.elapsedFormatted}</span>
            </div>
            <div style="margin-top:6px;font-size:13px;font-weight:700;color:#0F172A;">${sum.primaryWorking.commentText || sum.primaryWorking.title || 'Active Pin'}</div>
            <div style="margin-top:8px;display:flex;align-items:center;justify-content:space-between;font-family:monospace;font-size:11px;color:#1E40AF;font-weight:700;">
              <span>Stage ${activeProg.stageNum}/4: ${activeProg.stageTitle} - ${activeProg.stageDetail}</span>
              <span>Working Autonomously</span>
            </div>
            <div style="margin-top:8px;width:100%;height:10px;background:#DBEAFE;border-radius:9999px;overflow:hidden;">
              <div style="width:${activeProg.percent}%;height:100%;background:linear-gradient(90deg,#F59E0B 0%,#3B82F6 55%,#10B981 100%);border-radius:9999px;transition:width 0.5s ease;"></div>
            </div>
          </div>
        `
        : '';

      const rowsHtml = filteredList.length === 0
        ? '<div style="padding:28px;text-align:center;color:#64748B;font-size:13px;font-style:italic;">No pins match this filter. Click <strong>+ Pin Comment</strong> on the bar to drop a pin.</div>'
        : modalViewMode === 'list'
        ? `
          <div style="border:1px solid #E2E8F0;border-radius:12px;overflow-x:auto;-webkit-overflow-scrolling:touch;">
            <table style="width:100%;min-width:580px;border-collapse:collapse;font-size:12px;">
              <thead>
                <tr style="background:#F1F5F9;text-align:left;font-family:monospace;font-size:10px;text-transform:uppercase;color:#475569;">
                  <th style="padding:10px 12px;">Pin</th>
                  <th style="padding:10px 12px;">Status</th>
                  <th style="padding:10px 12px;">Page</th>
                  <th style="padding:10px 12px;">Comment</th>
                  <th style="padding:10px 12px;">Snapshot</th>
                  <th style="padding:10px 12px;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${filteredList.map(function (pin) {
                  const st = pin.status || 'open';
                  const prog = st === 'in_progress' ? computeTicketProgress(pin, Date.now()) : null;
                  const badgeStyle = st === 'resolved'
                    ? 'background:#DCFCE7;color:#166534;border:1px solid #86EFAC;'
                    : st === 'in_progress'
                    ? 'background:#DBEAFE;color:#1E40AF;border:1px solid #93C5FD;'
                    : 'background:#FEF3C7;color:#92400E;border:1px solid #FCD34D;';
                  const badgeLabel = st === 'resolved' ? 'DONE ✓' : st === 'in_progress' ? '⚡ ' + (prog ? prog.percent : 25) + '%' : 'OPEN';
                  const snippet = (pin.commentText || pin.title || 'Pin #' + pin.pinNumber).replace(/</g, '&lt;');
                  const shotUrl = pin.screenshotDataUrl || (pin.hasScreenshotBlob ? '/api/feedback/binary?id=' + encodeURIComponent(pin.id) : '');
                  return `
                    <tr style="border-top:1px solid #E2E8F0;background:#FFFFFF;">
                      <td style="padding:10px 12px;"><span style="padding:3px 8px;border-radius:6px;background:#0F172A;color:#FBBF24;font-family:monospace;font-size:11px;font-weight:800;">#${pin.pinNumber || '•'}</span></td>
                      <td style="padding:10px 12px;"><span style="padding:2px 7px;border-radius:6px;font-family:monospace;font-size:10px;font-weight:800;${badgeStyle}">${badgeLabel}</span></td>
                      <td style="padding:10px 12px;font-family:monospace;font-size:11px;color:#334155;font-weight:700;">${formatPageLabel(pin.pagePath)}</td>
                      <td style="padding:10px 12px;font-weight:600;color:#0F172A;">${snippet}</td>
                      <td style="padding:10px 12px;">
                        ${shotUrl ? `<button type="button" data-snap-pin="${pin.id}" style="padding:4px 8px;border-radius:6px;background:#0F172A;color:#F8FAFC;border:none;font-family:monospace;font-size:10px;cursor:pointer;">🔍 View</button>` : '<span style="color:#94A3B8;font-size:10px;"> - </span>'}
                      </td>
                      <td style="padding:10px 12px;">
                        <div style="display:flex;align-items:center;gap:5px;">
                          ${st !== 'resolved' && st !== 'in_progress' ? `<button type="button" data-fix-pin="${pin.id}" style="padding:4px 8px;border-radius:6px;background:#F59E0B;color:#0F172A;border:none;font-family:monospace;font-size:10px;font-weight:800;cursor:pointer;">⚡ Fix Now</button>` : ''}
                          <button type="button" data-open-pin="${pin.id}" style="padding:4px 8px;border-radius:6px;background:#E2E8F0;color:#0F172A;border:none;font-family:monospace;font-size:10px;font-weight:700;cursor:pointer;">Thread</button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `
        : filteredList.map(function (pin) {
            const st = pin.status || 'open';
            const prog = st === 'in_progress' ? computeTicketProgress(pin, Date.now()) : null;
            const badgeStyle = st === 'resolved'
              ? 'background:#DCFCE7;color:#166534;border:1px solid #86EFAC;'
              : st === 'in_progress'
              ? 'background:#DBEAFE;color:#1E40AF;border:1px solid #93C5FD;'
              : 'background:#FEF3C7;color:#92400E;border:1px solid #FCD34D;';
            const badgeLabel = st === 'resolved'
              ? 'DONE ✓ (100%)'
              : st === 'in_progress'
              ? '⚡ WORKING (' + (prog ? prog.percent : 25) + '%)'
              : 'IN QUEUE';
            const snippet = (pin.commentText || pin.title || 'Pin #' + pin.pinNumber).replace(/</g, '&lt;');
            const shotUrl = pin.screenshotDataUrl || (pin.hasScreenshotBlob ? '/api/feedback/binary?id=' + encodeURIComponent(pin.id) : '');
            return `
              <div style="padding:12px 14px;border-radius:12px;background:#F8FAFC;border:1px solid #E2E8F0;display:flex;flex-direction:column;gap:8px;">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
                  <div style="display:flex;align-items:center;gap:8px;">
                    <span style="padding:3px 8px;border-radius:9999px;background:#0F172A;color:#FBBF24;font-family:monospace;font-size:11px;font-weight:800;">#${pin.pinNumber || '•'}</span>
                    <span style="padding:2px 8px;border-radius:6px;font-family:monospace;font-size:10px;font-weight:800;${badgeStyle}">${badgeLabel}</span>
                    <span style="font-family:monospace;font-size:11px;color:#475569;font-weight:700;">${formatPageLabel(pin.pagePath)} &bull; ${pin.category || 'General'}</span>
                  </div>
                  <div style="display:flex;align-items:center;gap:6px;">
                    ${shotUrl ? `<button type="button" data-snap-pin="${pin.id}" style="padding:5px 9px;border-radius:8px;background:#1E293B;color:#F8FAFC;border:none;font-family:monospace;font-size:10px;font-weight:700;cursor:pointer;">🔍 Snapshot</button>` : ''}
                    ${st !== 'resolved' && st !== 'in_progress' ? `<button type="button" data-fix-pin="${pin.id}" style="padding:5px 10px;border-radius:8px;background:#F59E0B;color:#0F172A;border:none;font-family:monospace;font-size:11px;font-weight:800;cursor:pointer;">⚡ Fix Now</button>` : ''}
                    <select data-status-pin="${pin.id}" style="padding:4px 8px;border-radius:8px;border:1px solid #CBD5E1;background:#FFFFFF;color:#0F172A;font-family:monospace;font-size:10px;font-weight:700;cursor:pointer;">
                      <option value="open" ${st === 'open' ? 'selected' : ''}>IN QUEUE</option>
                      <option value="in_progress" ${st === 'in_progress' ? 'selected' : ''}>WORKING</option>
                      <option value="resolved" ${st === 'resolved' ? 'selected' : ''}>DONE ✓</option>
                    </select>
                    <button type="button" data-open-pin="${pin.id}" style="padding:5px 10px;border-radius:8px;background:#0F172A;color:#F8FAFC;border:none;font-family:monospace;font-size:10px;font-weight:700;cursor:pointer;">Thread (${(pin.replies || []).length})</button>
                  </div>
                </div>
                <div style="font-size:13px;font-weight:600;color:#0F172A;">${snippet}</div>
                ${prog ? `
                  <div style="display:flex;align-items:center;gap:10px;">
                    <div style="flex:1;height:6px;background:#DBEAFE;border-radius:9999px;overflow:hidden;">
                      <div style="width:${prog.percent}%;height:100%;background:linear-gradient(90deg,#F59E0B,#3B82F6,#10B981);"></div>
                    </div>
                    <span style="font-family:monospace;font-size:10px;font-weight:800;color:#1D4ED8;">${prog.stageTitle} (${prog.percent}% &bull; ${prog.elapsedFormatted})</span>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('');

      modal.innerHTML = `
        <div style="width:100%;max-width:860px;background:#FFFFFF;border-radius:18px;border:2px solid ${THEME.primary};overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.65);max-height:92vh;display:flex;flex-direction:column;" onclick="event.stopPropagation()">
          <div style="background:${THEME.surface};color:#FFFFFF;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;border-bottom:1px solid #334155;">
            <div>
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="display:inline-flex;align-items:center;gap:5px;padding:2px 8px;border-radius:9999px;background:rgba(16,185,129,0.2);border:1px solid rgba(52,211,153,0.45);color:#6EE7B7;font-family:monospace;font-size:10px;font-weight:800;">● AUTO-CHECK ON (3m)</span>
                <span style="font-family:monospace;font-size:10px;text-transform:uppercase;letter-spacing:0.08em;color:${THEME.accentText};font-weight:800;">OneEM Live Pin Board &amp; Sprint Console</span>
              </div>
              <div style="font-size:17px;font-weight:800;margin-top:3px;">Queue, Active Sprint &amp; Overall Progress (${sum.completionPct}%)</div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <!-- Auto-Fix vs Approve Slider -->
              <div style="display:inline-flex;background:#0F172A;border:1px solid #334155;border-radius:8px;padding:2px;">
                <button type="button" data-autofix-mode="approve" style="padding:5px 9px;border-radius:6px;border:none;font-family:monospace;font-size:10px;font-weight:800;cursor:pointer;${autoFixMode === 'approve' ? 'background:#F59E0B;color:#0F172A;' : 'background:transparent;color:#CBD5E1;'}">🛡️ Approve First</button>
                <button type="button" data-autofix-mode="auto" style="padding:5px 9px;border-radius:6px;border:none;font-family:monospace;font-size:10px;font-weight:800;cursor:pointer;${autoFixMode === 'auto' ? 'background:#10B981;color:#0F172A;' : 'background:transparent;color:#CBD5E1;'}">⚡ Auto-Fix</button>
              </div>
              <!-- Card / List Toggle -->
              <div style="display:inline-flex;background:#0F172A;border:1px solid #334155;border-radius:8px;padding:2px;">
                <button type="button" data-view-mode="cards" style="padding:5px 9px;border-radius:6px;border:none;font-family:monospace;font-size:10px;font-weight:800;cursor:pointer;${modalViewMode === 'cards' ? 'background:#2563EB;color:#FFFFFF;' : 'background:transparent;color:#CBD5E1;'}">🃏 Cards</button>
                <button type="button" data-view-mode="list" style="padding:5px 9px;border-radius:6px;border:none;font-family:monospace;font-size:10px;font-weight:800;cursor:pointer;${modalViewMode === 'list' ? 'background:#2563EB;color:#FFFFFF;' : 'background:transparent;color:#CBD5E1;'}">📋 List</button>
              </div>
              <a href="${CFG.boardUrl}" style="padding:6px 12px;border-radius:8px;background:#311042;color:#FDE047;border:1px solid #6B21A8;font-family:monospace;font-size:11px;font-weight:700;text-decoration:none;">/admin Board &nearr;</a>
              <button type="button" id="modzQueueCloseBtn" style="padding:6px 10px;border-radius:8px;background:#1E293B;color:#CBD5E1;border:1px solid #475569;font-family:monospace;font-size:12px;cursor:pointer;">Close &times;</button>
            </div>
          </div>
          <div style="padding:18px 20px;overflow-y:auto;display:flex;flex-direction:column;gap:14px;color:#0F172A;">
            <!-- Overall Progress Bar & 4 Interactive OneEM KPI Cards -->
            <div style="padding:12px 14px;border-radius:12px;background:#0F172A;color:#FFFFFF;">
              <div style="display:flex;align-items:center;justify-content:space-between;font-family:monospace;font-size:11px;font-weight:800;margin-bottom:6px;">
                <span style="color:#FBBF24;">OVERALL PIN BOARD COMPLETION STATUS</span>
                <span style="color:#34D399;">${sum.resolvedCount} of ${sum.total} Resolved (${sum.completionPct}%)</span>
              </div>
              <div style="width:100%;height:8px;background:#1E293B;border-radius:9999px;overflow:hidden;">
                <div style="width:${sum.completionPct}%;height:100%;background:linear-gradient(90deg,#F59E0B,#10B981);border-radius:9999px;transition:width 0.4s ease;"></div>
              </div>
              <div id="modzQueueKpiGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px;font-family:monospace;">
                <div data-kpi-filter="all" style="cursor:pointer;padding:8px 10px;border-radius:8px;background:#1E293B;border:${modalFilter === 'all' ? '2px solid #FBBF24' : '1px solid #334155'};">
                  <div style="font-size:9px;color:#94A3B8;text-transform:uppercase;">Total Pins</div>
                  <div style="font-size:18px;font-weight:900;color:#FFFFFF;">${sum.total}</div>
                </div>
                <div data-kpi-filter="open" style="cursor:pointer;padding:8px 10px;border-radius:8px;background:rgba(245,158,11,0.15);border:${modalFilter === 'open' ? '2px solid #F59E0B' : '1px solid rgba(245,158,11,0.4)'};">
                  <div style="font-size:9px;color:#FCD34D;text-transform:uppercase;">In Queue</div>
                  <div style="font-size:18px;font-weight:900;color:#FBBF24;">${sum.queuedCount}</div>
                </div>
                <div data-kpi-filter="in_progress" style="cursor:pointer;padding:8px 10px;border-radius:8px;background:rgba(59,130,246,0.18);border:${modalFilter === 'in_progress' ? '2px solid #60A5FA' : '1px solid rgba(96,165,250,0.45)'};">
                  <div style="font-size:9px;color:#93C5FD;text-transform:uppercase;">Working Now</div>
                  <div style="font-size:18px;font-weight:900;color:#60A5FA;">${sum.workingCount}</div>
                </div>
                <div data-kpi-filter="resolved" style="cursor:pointer;padding:8px 10px;border-radius:8px;background:rgba(16,185,129,0.18);border:${modalFilter === 'resolved' ? '2px solid #34D399' : '1px solid rgba(52,211,153,0.45)'};">
                  <div style="font-size:9px;color:#6EE7B7;text-transform:uppercase;">Completed ✓</div>
                  <div style="font-size:18px;font-weight:900;color:#34D399;">${sum.resolvedCount}</div>
                </div>
              </div>
            </div>

            ${workingBannerHtml}

            <div style="display:flex;flex-direction:column;gap:8px;">
              ${rowsHtml}
            </div>
          </div>
        </div>
      `;

      modal.querySelector('#modzQueueCloseBtn').addEventListener('click', function () {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      });

      modal.querySelectorAll('[data-kpi-filter]').forEach(function (card) {
        card.addEventListener('click', function () {
          modalFilter = card.getAttribute('data-kpi-filter') || 'all';
          renderQueueModalBody();
        });
      });

      modal.querySelectorAll('[data-view-mode]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          modalViewMode = btn.getAttribute('data-view-mode') || 'cards';
          try { localStorage.setItem('gt_pin_view_mode', modalViewMode); } catch (_) {}
          renderQueueModalBody();
        });
      });

      modal.querySelectorAll('[data-autofix-mode]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const nextM = btn.getAttribute('data-autofix-mode') === 'auto' ? 'auto' : 'approve';
          feedbackSettings.pinAutoFixMode = nextM;
          try { localStorage.setItem('gt_pin_autofix_mode', nextM); } catch (_) {}
          renderQueueModalBody();
          fetch('/api/feedback', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'settings', pinAutoFixMode: nextM })
          }).catch(function () {});
        });
      });

      modal.querySelectorAll('[data-snap-pin]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const pid = btn.getAttribute('data-snap-pin');
          const p = feedbackItems.find(function (i) { return i.id === pid; });
          if (!p) return;
          const sUrl = p.screenshotDataUrl || (p.hasScreenshotBlob ? '/api/feedback/binary?id=' + encodeURIComponent(p.id) : '');
          openInPageSnapshotLightbox(sUrl, p.pinNumber, p.commentText || p.title);
        });
      });

      modal.querySelectorAll('[data-fix-pin]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const pid = btn.getAttribute('data-fix-pin');
          dispatchFixNow(pid, function () {
            renderQueueModalBody();
          });
        });
      });

      modal.querySelectorAll('[data-status-pin]').forEach(function (sel) {
        sel.addEventListener('change', function () {
          const pid = sel.getAttribute('data-status-pin');
          const target = feedbackItems.find(function (i) { return i.id === pid; });
          if (!target) return;
          target.status = sel.value;
          target.updatedAt = new Date().toISOString();
          saveLocalFeedback(feedbackItems);
          renderPagePins();
          renderQueueModalBody();
          fetch('/api/feedback', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'status', id: target.id, status: target.status })
          }).catch(function () {});
        });
      });

      modal.querySelectorAll('[data-open-pin]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const pid = btn.getAttribute('data-open-pin');
          modal.style.display = 'none';
          openPinThreadModal(pid);
        });
      });
    }

    renderQueueModalBody();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function openPinThreadModal(pinId) {
    const item = feedbackItems.find(function (i) {
      return i.id === pinId;
    });
    if (!item) return;

    let modal = document.getElementById('modzPinThreadModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modzPinThreadModal';
      modal.style.cssText =
        'position:fixed;inset:0;z-index:200035;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(2,6,23,0.82);backdrop-filter:blur(4px);font-family:system-ui,-apple-system,sans-serif;';
      document.body.appendChild(modal);
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
    }

    const threadProg = item.status === 'in_progress' ? computeTicketProgress(item, Date.now()) : null;
    const progressBannerHtml = threadProg
      ? `
        <div style="padding:12px;border-radius:10px;background:#EFF6FF;border:1px solid #93C5FD;">
          <div style="display:flex;justify-content:space-between;font-family:monospace;font-size:11px;font-weight:800;color:#1E3A8A;">
            <span>⚡ WORKING: Stage ${threadProg.stageNum}/4 &bull; ${threadProg.stageTitle}</span>
            <span>${threadProg.percent}% (${threadProg.elapsedFormatted})</span>
          </div>
          <div style="margin-top:6px;width:100%;height:8px;background:#DBEAFE;border-radius:9999px;overflow:hidden;">
            <div style="width:${threadProg.percent}%;height:100%;background:linear-gradient(90deg,#F59E0B,#3B82F6,#10B981);border-radius:9999px;"></div>
          </div>
          <div style="margin-top:4px;font-family:monospace;font-size:10px;color:#1E40AF;">${threadProg.stageDetail}</div>
        </div>
      `
      : '';

    const repliesHtml =
      item.replies && item.replies.length
        ? item.replies
            .map(function (rep) {
              return (
                '<div style="padding:10px;border-radius:10px;background:#F8FAFC;border:1px solid #E2E8F0;margin-bottom:8px;">' +
                '<div style="display:flex;justify-content:space-between;font-family:monospace;font-size:11px;">' +
                '<strong>' +
                rep.author +
                '</strong><span style="color:#64748B;">' +
                (rep.createdAt || '').slice(0, 16).replace('T', ' ') +
                '</span></div>' +
                '<div style="margin-top:4px;font-size:12px;color:#334155;">' +
                rep.text +
                '</div></div>'
              );
            })
            .join('')
        : '<div style="font-size:12px;color:#94A3B8;font-style:italic;">No replies yet.</div>';

    modal.innerHTML = `
      <div style="width:100%;max-width:540px;background:#FFFFFF;border-radius:16px;border:2px solid ${THEME.primary};overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.6);max-height:90vh;overflow-y:auto;" onclick="event.stopPropagation()">
        <div style="background:${THEME.surface};color:#FFFFFF;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div style="font-family:monospace;font-size:10px;text-transform:uppercase;color:${THEME.accentText};font-weight:700;">Pin #${item.pinNumber} &bull; ${formatPageLabel(item.pagePath)} &bull; ${item.category}</div>
            <div style="font-size:15px;font-weight:800;margin-top:2px;">Posted by ${item.reviewerName}</div>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <select id="modzThreadStatusSelect" style="background:#1E293B;color:${THEME.accentText};border:1px solid #475569;border-radius:8px;padding:4px 8px;font-family:monospace;font-size:11px;font-weight:700;">
              <option value="open" ${item.status === 'open' ? 'selected' : ''}>IN QUEUE (OPEN)</option>
              <option value="in_progress" ${item.status === 'in_progress' ? 'selected' : ''}>WORKING (IN PROGRESS)</option>
              <option value="resolved" ${item.status === 'resolved' ? 'selected' : ''}>RESOLVED ✓ (100%)</option>
            </select>
            <button type="button" id="modzThreadCloseBtn" style="padding:4px 10px;border-radius:8px;background:#1E293B;color:#CBD5E1;border:1px solid #475569;cursor:pointer;">&times;</button>
          </div>
        </div>
        <div style="padding:20px;display:flex;flex-direction:column;gap:14px;font-size:12px;color:#1E293B;">
          ${progressBannerHtml}
          <div style="padding:12px;border-radius:10px;background:#FFFBEB;border:1px solid #FDE68A;">
            <div style="font-size:14px;font-weight:600;color:#0F172A;">${item.commentText}</div>
            <div style="font-family:monospace;font-size:10px;color:#64748B;margin-top:4px;">Target: ${item.elementSnippet || item.elementSelector}</div>
          </div>
          ${
            item.screenshotDataUrl
              ? `<div id="modzThreadSnapTrigger" style="cursor:pointer;border-radius:10px;overflow:hidden;border:1px solid #E2E8F0;background:#020617;" title="Click to open full-resolution snapshot modal"><img src="${item.screenshotDataUrl}" alt="Pin snapshot" style="width:100%;max-height:190px;object-fit:contain;display:block;" /><div style="background:#0F172A;color:#F8FAFC;font-family:monospace;font-size:10px;padding:4px 8px;text-align:center;">🔍 Click to Enlarge Snapshot Modal</div></div>`
              : ''
          }
          <div>
            <div style="font-family:monospace;font-size:10px;font-weight:700;text-transform:uppercase;color:#64748B;margin-bottom:6px;">Replies (${(item.replies || []).length})</div>
            <div style="max-height:160px;overflow-y:auto;">${repliesHtml}</div>
          </div>
          <form id="modzThreadReplyForm" style="display:flex;gap:8px;padding-top:8px;border-top:1px solid #E2E8F0;flex-wrap:wrap;">
            <input type="text" id="modzThreadReplyInput" required placeholder="Reply as ${getCurrentReviewerName()}..." style="flex:1;min-width:160px;padding:8px 12px;border-radius:10px;border:1px solid #CBD5E1;font-size:12px;" />
            <button type="submit" style="padding:8px 14px;border-radius:10px;background:${THEME.surface};color:${THEME.accentText};border:none;font-family:monospace;font-weight:700;font-size:12px;cursor:pointer;">Reply</button>
            ${
              item.status !== 'resolved'
                ? `<button type="button" id="modzThreadFixNowBtn" style="padding:8px 14px;border-radius:10px;background:#F59E0B;color:#0F172A;border:none;font-family:monospace;font-weight:800;font-size:12px;cursor:pointer;" title="Dispatch to autonomous agent and start live progress tracking">⚡ Fix Now</button>`
                : ''
            }
          </form>
        </div>
      </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    modal.querySelector('#modzThreadCloseBtn').addEventListener('click', function () {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    });

    const snapTrigger = modal.querySelector('#modzThreadSnapTrigger');
    if (snapTrigger && item.screenshotDataUrl) {
      snapTrigger.addEventListener('click', function () {
        openInPageSnapshotLightbox(item.screenshotDataUrl, item.pinNumber, item.commentText);
      });
    }

    const fixNowBtn = modal.querySelector('#modzThreadFixNowBtn');
    if (fixNowBtn) {
      fixNowBtn.addEventListener('click', function () {
        dispatchFixNow(item.id, function () {
          openPinThreadModal(item.id);
        });
      });
    }

    modal.querySelector('#modzThreadStatusSelect').addEventListener('change', function () {
      item.status = this.value;
      item.updatedAt = new Date().toISOString();
      saveLocalFeedback(feedbackItems);
      renderPagePins();
      openPinThreadModal(item.id);
      fetch('/api/feedback', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status', id: item.id, status: item.status })
      }).catch(function () {});
    });

    modal.querySelector('#modzThreadReplyForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const inp = modal.querySelector('#modzThreadReplyInput');
      const txt = (inp.value || '').trim();
      if (!txt) return;
      const author = getCurrentReviewerName();
      if (!item.replies) item.replies = [];
      item.replies.push({
        id: 'rep-' + Date.now(),
        author: author,
        text: txt,
        createdAt: new Date().toISOString()
      });
      saveLocalFeedback(feedbackItems);
      openPinThreadModal(item.id);
      fetch('/api/feedback', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reply', id: item.id, author: author, text: txt })
      }).catch(function () {});
    });
  }

  // 7. Initialize Floating Dock & Element Picker
  function initInPageReviewOverlay() {
    if (window.location.pathname.indexOf('/gate') === 0) return;
    if (document.getElementById('modzReviewDock')) return;

    if (!document.getElementById('modzPinBoardResponsiveStyles')) {
      const respStyle = document.createElement('style');
      respStyle.id = 'modzPinBoardResponsiveStyles';
      respStyle.textContent = `
        #modzDockDragMobileLabel {
          display: none;
        }
        @media (max-width: 768px) {
          #modzReviewDock {
            left: 8px;
            right: 8px;
            bottom: 8px;
            max-width: calc(100vw - 16px) !important;
          }
          #modzDockExpandedWrap {
            flex-wrap: wrap !important;
            justify-content: space-between !important;
            gap: 6px !important;
            padding: 8px 10px !important;
            border-radius: 14px !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          #modzDockDragHandle {
            flex: 1 1 100% !important;
            order: -2 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            padding: 6px 10px !important;
            background: rgba(255, 255, 255, 0.06) !important;
            border: 1px dashed rgba(245, 158, 11, 0.45) !important;
            border-radius: 9px !important;
            color: #FDE68A !important;
            cursor: grab !important;
            touch-action: none !important;
          }
          #modzDockDragMobileLabel {
            display: inline-flex !important;
            align-items: center;
            gap: 8px;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: #E2E8F0;
          }
          #modzDockReviewerBtn {
            display: none !important;
          }
          #modzDockQueueStatusBtn {
            flex: 1 1 100% !important;
            order: -1 !important;
            justify-content: center !important;
            text-align: center !important;
            max-width: 100% !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            padding: 8px 10px !important;
            min-height: 36px !important;
            font-size: 11.5px !important;
          }
          #modzDockAddPinBtn,
          #modzDockTogglePinsBtn,
          #modzDockBoardLink,
          #modzDockHelpBtn,
          #modzDockLogoutBtn,
          #modzDockCollapseBtn {
            padding: 8px 10px !important;
            min-height: 38px !important;
            font-size: 11.5px !important;
            flex: 1 1 auto !important;
            justify-content: center !important;
            text-align: center !important;
          }
          #modzQueueStatusModal,
          #modzPinComposerModal,
          #modzPinThreadModal,
          #modzSnapshotLightbox,
          #modzSnapshotLightboxModal,
          #modzPinHelpModal {
            padding: 10px !important;
          }
        }
        @media (max-width: 560px) {
          #modzQueueKpiGrid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `;
      document.head.appendChild(respStyle);
    }

    const modeBanner = document.createElement('div');
    modeBanner.id = 'modzPinModeBanner';
    modeBanner.style.cssText =
      'position:fixed;top:0;left:0;right:0;z-index:200025;background:' + THEME.surface + ';color:' + THEME.accentText + ';border-bottom:2px solid ' + THEME.primary + ';padding:10px 16px;text-align:center;font-family:monospace;font-size:12px;font-weight:800;display:none;align-items:center;justify-content:center;gap:12px;box-shadow:0 10px 25px rgba(0,0,0,0.4);';
    modeBanner.innerHTML =
      '<span>📌 TAP OR CLICK ANY PHOTO, TEXT, MODAL, OR SECTION TO DROP A PIN</span>' +
      '<button type="button" id="modzBannerCancelPinBtn" style="padding:4px 10px;border-radius:6px;background:#DC2626;color:#FFFFFF;border:none;font-family:monospace;font-size:11px;font-weight:700;cursor:pointer;">Cancel</button>';
    document.body.appendChild(modeBanner);
    modeBanner.querySelector('#modzBannerCancelPinBtn').addEventListener('click', function () {
      setPinMode(false);
    });

    const hoverBox = document.createElement('div');
    hoverBox.id = 'modzPinHoverBox';
    hoverBox.style.cssText =
      'position:fixed;pointer-events:none;z-index:200020;border:2px dashed ' + THEME.primary + ';background:' + THEME.primaryLight + ';border-radius:8px;display:none;transition:all 0.05s ease-out;';
    document.body.appendChild(hoverBox);

    let dockCollapsed = false;
    try {
      dockCollapsed = localStorage.getItem(DOCK_COLLAPSED_KEY) === '1';
    } catch (_) {}

    const dock = document.createElement('div');
    dock.id = 'modzReviewDock';
    dock.style.cssText =
      'position:fixed;bottom:14px;right:14px;z-index:200010;color:#FFFFFF;font-family:system-ui,-apple-system,sans-serif;user-select:none;touch-action:none;';
    dock.innerHTML = `
      <div id="modzDockExpandedWrap" style="background:${THEME.surfaceGlass};backdrop-filter:blur(8px);border:2px solid ${THEME.primary};border-radius:16px;padding:6px 8px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.5);display:${dockCollapsed ? 'none' : 'flex'};align-items:center;gap:6px;">
        <div id="modzDockDragHandle" style="padding:6px 5px;border-radius:8px;color:#94A3B8;cursor:grab;font-family:monospace;font-size:13px;line-height:1;display:flex;align-items:center;gap:6px;" title="Drag to move Pin Bar anywhere on screen"><span>&#8942;&#8942;</span><span id="modzDockDragMobileLabel"><span style="width:36px;height:4px;border-radius:9999px;background:#F59E0B;display:inline-block;"></span><span>Drag to Move</span></span></div>
        <button type="button" id="modzDockReviewerBtn" style="padding:7px 9px;border-radius:12px;background:#1E293B;border:1px solid #334155;font-family:monospace;font-size:11px;color:#CBD5E1;display:flex;align-items:center;gap:6px;cursor:pointer;" title="Tap to set your reviewer name">
          <span style="width:8px;height:8px;border-radius:9999px;background:#34D399;display:inline-block;"></span>
          <span id="modzDockReviewerName" style="font-weight:700;color:${THEME.accentText};">${getCurrentReviewerName()}</span>
        </button>
        <button type="button" id="modzDockAddPinBtn" style="background:${THEME.primary};color:${THEME.primaryText};border:none;font-family:monospace;font-size:12px;font-weight:800;padding:8px 12px;border-radius:12px;cursor:pointer;">
          <span>+ Pin Comment</span>
        </button>
        <button type="button" id="modzDockTogglePinsBtn" style="padding:7px 10px;border-radius:12px;background:#1E293B;border:1px solid #334155;font-family:monospace;font-size:11px;color:#E2E8F0;cursor:pointer;display:flex;align-items:center;gap:5px;" title="Toggle Pin Markers ON or OFF on this page">
          <span>Pins (<strong id="modzDockPinCount" style="color:${THEME.accentText};">0</strong>):</span>
          <span id="modzDockPinsStateBadge" style="padding:2px 6px;border-radius:6px;font-size:10px;font-weight:800;border:1px solid ${pinsVisible ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.4)'};background:${pinsVisible ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)'};color:${pinsVisible ? '#6EE7B7' : '#FDA4AF'};">${pinsVisible ? 'ON' : 'OFF'}</span>
        </button>
        <button type="button" id="modzDockQueueStatusBtn" style="padding:7px 10px;border-radius:12px;background:#0F172A;border:1px solid #334155;font-family:monospace;font-size:11px;color:#E2E8F0;cursor:pointer;display:flex;align-items:center;gap:6px;" title="View Live Pin Queue, Active Working Status &amp; Completion Percentage">
          <span style="display:inline-block;width:7px;height:7px;border-radius:9999px;background:#10B981;"></span>
          <span>Queue: <strong style="color:#FBBF24;">0</strong> | Working: <strong style="color:#60A5FA;">0</strong> | Done: <strong style="color:#34D399;">0</strong></span>
        </button>
        <a id="modzDockBoardLink" href="${CFG.boardUrl}" style="padding:7px 10px;border-radius:12px;background:#311042;border:1px solid #6B21A8;font-family:monospace;font-size:11px;font-weight:700;color:#FDE047;text-decoration:none;display:inline-flex;align-items:center;">
          Board &nearr;
        </a>
        <button type="button" id="modzDockHelpBtn" style="width:30px;height:30px;border-radius:10px;background:#1E293B;border:1px solid ${THEME.primaryBorder};color:${THEME.accentText};font-family:monospace;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;cursor:pointer;" title="How to use Pin Comments & Review Board" aria-label="How to use Pin Comments">?</button>
        <a href="/gate/?logout=1" id="modzDockLogoutBtn" style="padding:6px 8px;border-radius:10px;background:rgba(220,38,38,0.18);border:1px solid rgba(248,113,113,0.45);color:#FCA5A5;font-family:monospace;font-size:11px;font-weight:700;line-height:1;text-decoration:none;display:inline-flex;align-items:center;" title="Log out of Gate &amp; hide Pin Board">Exit</a>
        <button type="button" id="modzDockCollapseBtn" style="padding:6px 10px;border-radius:10px;background:#1E293B;border:1px solid #475569;color:#E2E8F0;font-family:monospace;font-size:11px;font-weight:800;line-height:1;cursor:pointer;display:inline-flex;align-items:center;gap:4px;" title="Minimize Pin Bar to small icon"><span style="font-size:14px;line-height:1;">&ndash;</span><span>Minimize</span></button>
      </div>
      <button type="button" id="modzDockCollapsedBtn" style="display:${dockCollapsed ? 'flex' : 'none'};align-items:center;gap:6px;background:${THEME.surfaceGlass};border:2px solid ${THEME.primary};color:${THEME.accentText};border-radius:9999px;padding:10px 14px;box-shadow:0 20px 25px -5px rgba(0,0,0,0.5);cursor:grab;" title="Click to expand Pin Bar (or drag to move)">
        <span style="font-size:15px;line-height:1;pointer-events:none;">&#128204;</span>
        <span id="modzDockMiniCount" style="font-family:monospace;font-size:11px;font-weight:800;background:${THEME.primary};color:${THEME.primaryText};padding:2px 6px;border-radius:9999px;pointer-events:none;">0</span>
      </button>
    `;
    document.body.appendChild(dock);

    function measureDockSize() {
      const prevLeft = dock.style.left;
      const prevRight = dock.style.right;
      dock.style.width = 'max-content';
      dock.style.maxWidth = 'calc(100vw - 16px)';
      dock.style.left = '0px';
      dock.style.right = 'auto';
      const rect = dock.getBoundingClientRect();
      const w = Math.max(rect.width || 0, dock.offsetWidth || 0, dock.scrollWidth || 0, 52);
      const h = Math.max(rect.height || 0, dock.offsetHeight || 0, 48);
      dock.style.left = prevLeft;
      dock.style.right = prevRight;
      return { w: w, h: h };
    }

    function applyDockPosition(leftPx, topPx, save) {
      const vw = document.documentElement.clientWidth || window.innerWidth;
      const vh = document.documentElement.clientHeight || window.innerHeight;
      if (vw <= 768 && !dockCollapsed) {
        const h = Math.max(dock.offsetHeight || 110, 80);
        const maxTop = Math.max(8, vh - h - 8);
        const clampedTop = Math.max(8, Math.min(maxTop, Math.round(topPx)));
        dock.style.left = '8px';
        dock.style.right = '8px';
        dock.style.width = 'auto';
        dock.style.top = clampedTop + 'px';
        dock.style.bottom = 'auto';
        if (save) {
          try {
            localStorage.setItem(DOCK_POS_KEY, JSON.stringify({ left: 8, top: clampedTop }));
          } catch (_) {}
        }
        return;
      }
      const size = measureDockSize();
      const maxLeft = Math.max(8, vw - size.w - 8);
      const maxTop = Math.max(8, vh - size.h - 8);
      const clampedLeft = Math.max(8, Math.min(maxLeft, Math.round(leftPx)));
      const clampedTop = Math.max(8, Math.min(maxTop, Math.round(topPx)));
      dock.style.left = clampedLeft + 'px';
      dock.style.top = clampedTop + 'px';
      dock.style.right = 'auto';
      dock.style.bottom = 'auto';
      if (save) {
        try {
          localStorage.setItem(
            DOCK_POS_KEY,
            JSON.stringify({ left: clampedLeft, top: clampedTop })
          );
        } catch (_) {}
      }
    }

    function applySavedDockPos() {
      updateDockQueueStatusUI();
      const vw = document.documentElement.clientWidth || window.innerWidth || 1024;
      try {
        const raw = localStorage.getItem(DOCK_POS_KEY);
        if (raw) {
          const pos = JSON.parse(raw);
          if (pos && typeof pos.left === 'number' && typeof pos.top === 'number') {
            applyDockPosition(pos.left, pos.top, false);
            return;
          }
        }
      } catch (_) {}
      if (vw <= 768 && !dockCollapsed) {
        dock.style.left = '8px';
        dock.style.right = '8px';
        dock.style.width = 'auto';
        dock.style.bottom = '8px';
        dock.style.top = 'auto';
      }
    }
    setTimeout(applySavedDockPos, 20);
    window.addEventListener('resize', applySavedDockPos, { passive: true });

    function setDockCollapsedState(collapsed, preserveAnchor) {
      const vw = document.documentElement.clientWidth || window.innerWidth;
      const prevRect = dock.getBoundingClientRect();
      const hadCustomPos = !!(dock.style.left && dock.style.left !== 'auto');
      const onRightHalf = prevRect.left + prevRect.width / 2 > vw / 2;

      dockCollapsed = !!collapsed;
      try {
        localStorage.setItem(DOCK_COLLAPSED_KEY, dockCollapsed ? '1' : '0');
      } catch (_) {}
      const exp = dock.querySelector('#modzDockExpandedWrap');
      const col = dock.querySelector('#modzDockCollapsedBtn');
      if (exp && col) {
        exp.style.display = dockCollapsed ? 'none' : 'flex';
        col.style.display = dockCollapsed ? 'flex' : 'none';
      }
      if (!dockCollapsed && vw <= 768) {
        applyDockPosition(8, prevRect.top, true);
        return;
      }
      if (preserveAnchor || hadCustomPos) {
        const newSize = measureDockSize();
        const targetLeft = onRightHalf ? prevRect.right - newSize.w : prevRect.left;
        applyDockPosition(targetLeft, prevRect.top, true);
      } else {
        setTimeout(applySavedDockPos, 10);
      }
    }

    let dragState = null;
    let suppressNextClick = false;
    let lastExpandAt = 0;
    function startDockDrag(e) {
      if (e.button !== undefined && e.button !== 0) return;
      // If user tapped a button inside the dock, don't trigger drag
      if (e.target && e.target.closest && e.target.closest('button, a, input, textarea, select')) {
        const isCollapsedBtn = e.target.closest('#modzDockCollapsedBtn');
        if (!isCollapsedBtn) return;
      }
      const rect = dock.getBoundingClientRect();
      const targetEl = e.currentTarget || dragHandle;
      dragState = {
        startX: e.clientX,
        startY: e.clientY,
        origLeft: rect.left,
        origTop: rect.top,
        moved: false,
        captured: false,
        targetEl: targetEl,
        startedOnCollapsed: !!(e.target && e.target.closest && e.target.closest('#modzDockCollapsedBtn')),
        pointerId: e.pointerId
      };
      if (targetEl && targetEl.setPointerCapture) {
        try {
          targetEl.setPointerCapture(e.pointerId);
          dragState.captured = true;
        } catch (_) {}
      }
      window.addEventListener('pointermove', moveDockDrag, { passive: false });
      window.addEventListener('pointerup', endDockDrag);
      window.addEventListener('pointercancel', endDockDrag);
    }
    function moveDockDrag(e) {
      if (!dragState) return;
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      if (!dragState.moved && Math.hypot(dx, dy) > 4) {
        dragState.moved = true;
      }
      if (!dragState.moved) return;
      e.preventDefault();
      const vw = document.documentElement.clientWidth || window.innerWidth;
      const maxTop = Math.max(8, window.innerHeight - dock.offsetHeight - 8);
      const nextTop = Math.min(Math.max(8, dragState.origTop + dy), maxTop);
      if (vw <= 768 && !dockCollapsed) {
        dock.style.left = '8px';
        dock.style.right = '8px';
        dock.style.width = 'auto';
        dock.style.top = Math.round(nextTop) + 'px';
        dock.style.bottom = 'auto';
        return;
      }
      const maxLeft = Math.max(8, window.innerWidth - dock.offsetWidth - 8);
      const nextLeft = Math.min(Math.max(8, dragState.origLeft + dx), maxLeft);
      dock.style.left = Math.round(nextLeft) + 'px';
      dock.style.top = Math.round(nextTop) + 'px';
      dock.style.right = 'auto';
      dock.style.bottom = 'auto';
    }
    function endDockDrag(e) {
      if (!dragState) return;
      window.removeEventListener('pointermove', moveDockDrag);
      window.removeEventListener('pointerup', endDockDrag);
      window.removeEventListener('pointercancel', endDockDrag);
      const wasMoved = dragState.moved;
      const wasCollapsedTap = !wasMoved && dragState.startedOnCollapsed && e && e.type === 'pointerup';
      if (wasMoved) {
        suppressNextClick = true;
        setTimeout(function () {
          suppressNextClick = false;
        }, 120);
        const rect = dock.getBoundingClientRect();
        try {
          localStorage.setItem(
            DOCK_POS_KEY,
            JSON.stringify({ left: Math.round(rect.left), top: Math.round(rect.top) })
          );
        } catch (_) {}
      }
      if (dragState.captured && dragState.targetEl && dragState.targetEl.releasePointerCapture) {
        try {
          dragState.targetEl.releasePointerCapture(dragState.pointerId);
        } catch (_) {}
      }
      dragState = null;
      if (wasCollapsedTap) {
        setTimeout(function () {
          if (dockCollapsed) {
            lastExpandAt = Date.now();
            setDockCollapsedState(false, true);
          }
        }, 20);
      }
    }

    const dragHandle = dock.querySelector('#modzDockDragHandle');
    const collapsedBtn = dock.querySelector('#modzDockCollapsedBtn');
    const expandedWrap = dock.querySelector('#modzDockExpandedWrap');
    [dragHandle, collapsedBtn, expandedWrap].forEach(function (el) {
      if (!el) return;
      el.addEventListener('pointerdown', startDockDrag);
    });

    dock.querySelector('#modzDockCollapseBtn').addEventListener('click', function (e) {
      if (Date.now() - lastExpandAt < 250) return;
      e.stopPropagation();
      setDockCollapsedState(true, true);
    });
    collapsedBtn.addEventListener('click', function (e) {
      if (suppressNextClick) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      lastExpandAt = Date.now();
      setDockCollapsedState(false, true);
    });

    dock.querySelector('#modzDockReviewerBtn').addEventListener('click', function () {
      const nextName = window.prompt('Enter your reviewer name:', getCurrentReviewerName());
      if (nextName !== null) {
        setCurrentReviewerName(nextName, true);
        markReviewerNameConfirmed();
      }
    });

    dock.querySelector('#modzDockAddPinBtn').addEventListener('click', function () {
      setPinMode(!pinModeActive);
    });

    dock.querySelector('#modzDockTogglePinsBtn').addEventListener('click', function () {
      pinsVisible = !pinsVisible;
      try {
        localStorage.setItem(PINS_VISIBLE_KEY, pinsVisible ? '1' : '0');
      } catch (_) {}
      renderPagePins();
    });

    const queueStatusBtn = dock.querySelector('#modzDockQueueStatusBtn');
    if (queueStatusBtn) {
      queueStatusBtn.addEventListener('click', function () {
        openQueueStatusModal();
      });
    }

    setInterval(function () {
      updateDockQueueStatusUI();
    }, 1000);

    setInterval(function () {
      syncFeedbackWithServer();
    }, 6000);

    function openPinHelpModal() {
      let modal = document.getElementById('modzPinHelpModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modzPinHelpModal';
        modal.style.cssText =
          'position:fixed;inset:0;z-index:200045;background:rgba(2,6,23,0.82);backdrop-filter:blur(6px);display:none;align-items:center;justify-content:center;padding:16px;font-family:system-ui,-apple-system,sans-serif;';
        modal.innerHTML = `
          <div style="background:#FFFFFF;border:2px solid ${THEME.primary};border-radius:18px;max-width:600px;width:100%;overflow:hidden;box-shadow:0 25px 50px -12px rgba(0,0,0,0.65);color:#0F172A;max-height:90vh;overflow-y:auto;">
            <div style="background:${THEME.surface};color:#FFFFFF;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #334155;">
              <div>
                <div style="font-family:monospace;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em;color:${THEME.accentText};">GreenTree Visual Pin Board (MOD-PIN-BOARD v2)</div>
                <div style="font-size:17px;font-weight:800;margin-top:2px;">How to Use the In-Page Pin Comment Board</div>
              </div>
              <button type="button" id="modzHelpCloseTop" style="padding:6px 10px;border-radius:8px;background:#0F172A;color:#CBD5E1;border:1px solid #334155;font-family:monospace;font-size:11px;cursor:pointer;">Close &times;</button>
            </div>
            <div style="padding:20px;display:flex;flex-direction:column;gap:12px;font-size:13px;color:#334155;">
              <div style="padding:12px 14px;border-radius:12px;background:#FFFBEB;border:1px solid #FDE68A;color:#0F172A;line-height:1.5;">
                <strong>Why we built this for you:</strong> Instead of writing long emails or trying to describe which photo or paragraph needs an edit, click <strong>directly on any photo, headline, or section</strong> to drop a numbered pin with an automatic visual snapshot.
              </div>
              <div style="display:flex;gap:12px;padding:12px;border-radius:12px;background:#F8FAFC;border:1px solid #E2E8F0;align-items:flex-start;">
                <span style="width:26px;height:26px;border-radius:9999px;background:${THEME.primary};color:${THEME.primaryText};font-family:monospace;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">1</span>
                <div>
                  <div style="font-weight:800;color:#0F172A;">Click "+ Pin Comment"</div>
                  <div style="font-size:12px;color:#475569;margin-top:2px;">Tap the gold <strong>+ Pin Comment</strong> button on the floating bar. Your cursor turns into a crosshair.</div>
                </div>
              </div>
              <div style="display:flex;gap:12px;padding:12px;border-radius:12px;background:#F8FAFC;border:1px solid #E2E8F0;align-items:flex-start;">
                <span style="width:26px;height:26px;border-radius:9999px;background:${THEME.primary};color:${THEME.primaryText};font-family:monospace;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">2</span>
                <div>
                  <div style="font-weight:800;color:#0F172A;">Tap Any Photo, Caption, or Paragraph</div>
                  <div style="font-size:12px;color:#475569;margin-top:2px;">Click the exact item you want to comment on. The system captures a real-pixel snapshot and records the exact page location.</div>
                </div>
              </div>
              <div style="display:flex;gap:12px;padding:12px;border-radius:12px;background:#F8FAFC;border:1px solid #E2E8F0;align-items:flex-start;">
                <span style="width:26px;height:26px;border-radius:9999px;background:${THEME.primary};color:${THEME.primaryText};font-family:monospace;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">3</span>
                <div>
                  <div style="font-weight:800;color:#0F172A;">Type Your Note &amp; Post Pin</div>
                  <div style="font-size:12px;color:#475569;margin-top:2px;">Enter your reviewer name once, type your note, and click <strong>Post Pin</strong>. It saves to your dedicated PostgreSQL database and notifies the team immediately.</div>
                </div>
              </div>
              <div style="display:flex;gap:12px;padding:12px;border-radius:12px;background:#F8FAFC;border:1px solid #E2E8F0;align-items:flex-start;">
                <span style="width:26px;height:26px;border-radius:9999px;background:#10B981;color:#0F172A;font-family:monospace;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">&#10003;</span>
                <div>
                  <div style="font-weight:800;color:#0F172A;">Track Replies &amp; Resolutions on the Command Center</div>
                  <div style="font-size:12px;color:#475569;margin-top:2px;">Click any numbered badge on a page to reply, or click <strong>Board &nearr;</strong> to view all pins inside your site's <code>/admin</code> Command Center.</div>
                </div>
              </div>
              <div style="display:flex;gap:12px;padding:12px;border-radius:12px;background:#F8FAFC;border:1px solid #E2E8F0;align-items:flex-start;">
                <span style="width:26px;height:26px;border-radius:9999px;background:#7E22CE;color:#FFFFFF;font-family:monospace;font-size:12px;font-weight:800;display:flex;align-items:center;justify-content:center;flex-shrink:0;">&#128204;</span>
                <div>
                  <div style="font-weight:800;color:#0F172A;">Hide Pins (ON/OFF), Shrink to Circle (&ndash;) &amp; Drag Anywhere (&#8942;&#8942;)</div>
                  <div style="font-size:12px;color:#475569;margin-top:2px;">Click <strong>Pins: ON / OFF</strong> to hide or show markers on the page, click <strong>&ndash;</strong> to collapse the bar into a small floating <strong>&#128204;</strong> circle (click <strong>&#128204;</strong> to expand it back), or grab <strong>&#8942;&#8942;</strong> to drag the bar anywhere on your screen.</div>
                </div>
              </div>
              <div style="padding-top:12px;border-top:1px solid #E2E8F0;display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
                <button type="button" id="modzHelpStartPinBtn" style="padding:10px 16px;border-radius:10px;background:${THEME.primary};color:${THEME.primaryText};border:none;font-family:monospace;font-size:12px;font-weight:800;cursor:pointer;">+ Start Dropping a Pin Now</button>
                <div style="display:flex;gap:8px;">
                  <a href="${CFG.boardUrl}" style="padding:10px 14px;border-radius:10px;background:#130D24;color:#FBBF24;font-family:monospace;font-size:12px;font-weight:700;text-decoration:none;">Open /admin Board &nearr;</a>
                  <button type="button" id="modzHelpCloseBottom" style="padding:10px 14px;border-radius:10px;background:#F1F5F9;color:#334155;border:1px solid #CBD5E1;font-size:12px;font-weight:700;cursor:pointer;">Got It</button>
                </div>
              </div>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
        const closeHelp = function () {
          modal.style.display = 'none';
          document.body.style.overflow = '';
        };
        modal.addEventListener('click', function (e) {
          if (e.target === modal) closeHelp();
        });
        modal.querySelector('#modzHelpCloseTop').addEventListener('click', closeHelp);
        modal.querySelector('#modzHelpCloseBottom').addEventListener('click', closeHelp);
        modal.querySelector('#modzHelpStartPinBtn').addEventListener('click', function () {
          closeHelp();
          setPinMode(true);
        });
      }
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    window.openModzPinHelp = openPinHelpModal;
    const helpBtn = dock.querySelector('#modzDockHelpBtn');
    if (helpBtn) helpBtn.addEventListener('click', openPinHelpModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && pinModeActive) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setPinMode(false);
      }
    }, true);

    const PIN_UI_SELECTOR =
      '#modzReviewDock, #modzPinComposerModal, #modzPinThreadModal, #modzQueueStatusModal, #modzPinHelpModal, #modzPinModeBanner';

    document.addEventListener(
      'mousemove',
      function (e) {
        if (!pinModeActive) return;
        const target = e.target;
        if (!target || (target.closest && target.closest(PIN_UI_SELECTOR))) {
          hoverBox.style.display = 'none';
          return;
        }
        const rect = target.getBoundingClientRect();
        hoverBox.style.display = 'block';
        hoverBox.style.left = rect.left + 'px';
        hoverBox.style.top = rect.top + 'px';
        hoverBox.style.width = rect.width + 'px';
        hoverBox.style.height = rect.height + 'px';
      },
      { passive: true, capture: true }
    );

    // Intercept pointerdown and mousedown in capture phase so modals/backdrops/buttons underneath do not close or fire when dropping a pin
    ['pointerdown', 'mousedown'].forEach(function (evName) {
      window.addEventListener(
        evName,
        function (e) {
          if (!pinModeActive) return;
          const target = e.target;
          if (!target || (target.closest && target.closest(PIN_UI_SELECTOR))) return;
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
        },
        true
      );
    });

    window.addEventListener(
      'click',
      function (e) {
        if (!pinModeActive) return;
        const target = e.target;
        if (!target || (target.closest && target.closest(PIN_UI_SELECTOR))) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const rect = target.getBoundingClientRect();
        const relX = rect.width > 0 ? Math.max(0.05, Math.min(0.95, (e.clientX - rect.left) / rect.width)) : 0.5;
        const relY = rect.height > 0 ? Math.max(0.05, Math.min(0.95, (e.clientY - rect.top) / rect.height)) : 0.5;
        const imgEl = target.tagName === 'IMG' ? target : target.querySelector ? target.querySelector('img') : null;

        setPinMode(false);
        openPinComposerModal({
          el: target,
          selector: getElementSelector(target),
          snippet: getElementSnippet(target),
          imageSrc: imgEl ? imgEl.getAttribute('src') : '',
          relX: Number(relX.toFixed(3)),
          relY: Number(relY.toFixed(3))
        });
      },
      true
    );

    window.addEventListener('resize', renderPagePins, { passive: true });
    window.addEventListener('scroll', renderPagePins, { passive: true });

    // Re-render pins automatically whenever any modal/dialog opens or closes on the page
    try {
      let modalObsTimer = null;
      const modalObs = new MutationObserver(function () {
        if (modalObsTimer) clearTimeout(modalObsTimer);
        modalObsTimer = setTimeout(renderPagePins, 80);
      });
      modalObs.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['class', 'style', 'open', 'hidden', 'aria-hidden']
      });
    } catch (_) {}

    syncFeedbackWithServer(function () {
      const params = new URLSearchParams(window.location.search);
      const jumpPinId = params.get('pin');
      if (jumpPinId) {
        const targetItem = feedbackItems.find(function (i) {
          return i.id === jumpPinId;
        });
        if (targetItem) {
          try {
            const el = document.querySelector(targetItem.elementSelector);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } catch (_) {}
          setTimeout(function () {
            openPinThreadModal(targetItem.id);
          }, 450);
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      updateSessionTimerUI();
      initInPageReviewOverlay();
    });
  } else {
    updateSessionTimerUI();
    initInPageReviewOverlay();
  }
})();
