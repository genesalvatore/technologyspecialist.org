/**
 * Technology Specialist - Brand Identity & Logo Studio (STD-2026-LOGO-STUDIO-01)
 * Interactive Switcher for 6 Precision Vector SVG Systems + 4 AI Studio Concepts
 * Authority: Gene Salvatore & Silas Salvatore
 * Voice Mandate: Direct, architectural, zero em dashes.
 */

(function initLogoStudio() {
  if (window.__TS_LOGO_STUDIO_INITIALIZED__) return;
  window.__TS_LOGO_STUDIO_INITIALIZED__ = true;

  const CONCEPTS = [
    {
      id: "concept-01",
      name: "Concept 01: Hypervisor Blade Stack & Signal Node",
      badge: "FLAGSHIP DEFAULT",
      type: "vector",
      svg: "/images/logos/concept-01-hypervisor-blades.svg",
      png: "/images/logos/concept-01-hypervisor-blades.png",
      markSvg: "/images/logos/concept-01-mark.svg",
      markPng: "/images/logos/concept-01-mark-512.png",
      desc: "Three precision isometric server rack planes forming subtle T and S negative space channels with a live emerald status node."
    },
    {
      id: "concept-02",
      name: "Concept 02: Swiss Grid TS Monogram & Circuit Matrix",
      badge: "SWISS GEOMETRY",
      type: "vector",
      svg: "/images/logos/concept-02-swiss-circuit-monogram.svg",
      png: "/images/logos/concept-02-swiss-circuit-monogram.png",
      markSvg: "/images/logos/concept-02-mark.svg",
      markPng: "/images/logos/concept-02-mark-512.png",
      desc: "Architectural typographic ligature on a 5x5 surgical coordinate grid with PCB copper trace geometry."
    },
    {
      id: "concept-03",
      name: "Concept 03: Enterprise Switch & Fiber Routing Topology",
      badge: "INFRASTRUCTURE",
      type: "vector",
      svg: "/images/logos/concept-03-fiber-topology-matrix.svg",
      png: "/images/logos/concept-03-fiber-topology-matrix.png",
      markSvg: "/images/logos/concept-03-mark.svg",
      markPng: "/images/logos/concept-03-mark-512.png",
      desc: "Multi-gigabit switch chassis ports radiating dual convergent fiber paths into a central routing nexus."
    },
    {
      id: "concept-04",
      name: "Concept 04: Dieter Rams Technical Spec Plate (TS // 1990)",
      badge: "DIETER RAMS",
      type: "vector",
      svg: "/images/logos/concept-04-rams-industrial-badge.svg",
      png: "/images/logos/concept-04-rams-industrial-badge.png",
      markSvg: "/images/logos/concept-04-mark.svg",
      markPng: "/images/logos/concept-04-mark-512.png",
      desc: "Structural chassis frame divided into a precision instrument plate [ TS | 1990 ] with tabular engineering typography."
    },
    {
      id: "concept-05",
      name: "Concept 05: Active-Active Cluster Mirror",
      badge: "HIGH AVAILABILITY",
      type: "vector",
      svg: "/images/logos/concept-05-dual-cluster-failover.svg",
      png: "/images/logos/concept-05-dual-cluster-failover.png",
      markSvg: "/images/logos/concept-05-mark.svg",
      markPng: "/images/logos/concept-05-mark-512.png",
      desc: "Mirrored geometric chevrons locked in high-availability failover symmetry for redundant virtualization and SIP trunks."
    },
    {
      id: "concept-06",
      name: "Concept 06: Pure Architectural Wordmark + 42U Scale Rule",
      badge: "TYPOGRAPHIC",
      type: "vector",
      svg: "/images/logos/concept-06-minimal-architectural-wordmark.svg",
      png: "/images/logos/concept-06-minimal-architectural-wordmark.png",
      markSvg: "/images/logos/concept-06-mark.svg",
      markPng: "/images/logos/concept-06-mark-512.png",
      desc: "Typographic authority lockup with a calibrated 42U vertical rack scale rule and telemetry pulse line."
    },
    {
      id: "ai-01",
      name: "AI Concept 01: Hexagonal Hypervisor Core",
      badge: "AI STUDIO",
      type: "ai",
      svg: "/images/logos/ts-logo-concept-ai-1.png",
      png: "/images/logos/ts-logo-concept-ai-1.png",
      markSvg: "/images/logos/ts-logo-concept-ai-1.png",
      markPng: "/images/logos/ts-logo-concept-ai-1.png",
      desc: "Chiseled geometric hexagon enclosing high-density server nodes in cobalt and cyan vector relief."
    },
    {
      id: "ai-02",
      name: "AI Concept 02: Monolithic Datacenter Node",
      badge: "AI STUDIO",
      type: "ai",
      svg: "/images/logos/ts-logo-concept-ai-2.png",
      png: "/images/logos/ts-logo-concept-ai-2.png",
      markSvg: "/images/logos/ts-logo-concept-ai-2.png",
      markPng: "/images/logos/ts-logo-concept-ai-2.png",
      desc: "Isometric data cube with illuminated fiber conduits and precision chamfered edges."
    },
    {
      id: "ai-03",
      name: "AI Concept 03: Precision Circuit Monogram",
      badge: "AI STUDIO",
      type: "ai",
      svg: "/images/logos/ts-logo-concept-ai-3.png",
      png: "/images/logos/ts-logo-concept-ai-3.png",
      markSvg: "/images/logos/ts-logo-concept-ai-3.png",
      markPng: "/images/logos/ts-logo-concept-ai-3.png",
      desc: "Clean architectural interlocking T-S monogram rendered in aerospace-grade brushed titanium."
    },
    {
      id: "ai-04",
      name: "AI Concept 04: Minimalist Geometric Crystal",
      badge: "AI STUDIO",
      type: "ai",
      svg: "/images/logos/ts-logo-concept-ai-4.png",
      png: "/images/logos/ts-logo-concept-ai-4.png",
      markSvg: "/images/logos/ts-logo-concept-ai-4.png",
      markPng: "/images/logos/ts-logo-concept-ai-4.png",
      desc: "Faceted low-poly infrastructure crystal symbolizing multi-tenant virtualization isolation."
    }
  ];

  function getStoredConceptId() {
    try {
      return localStorage.getItem("ts_active_logo_id") || "concept-01";
    } catch {
      return "concept-01";
    }
  }

  function applyConcept(conceptId, persist = true) {
    const concept = CONCEPTS.find(c => c.id === conceptId) || CONCEPTS[0];
    
    // Update header logo mark icon (swapping crisp square mark so wordmark is never duplicated)
    const headerLogos = document.querySelectorAll("#site-header-logo, #siteHeaderLogo, header a[href='/'] img, header a img");
    headerLogos.forEach(img => {
      img.src = concept.markSvg || concept.markPng || concept.svg;
      img.alt = concept.name;
    });

    // Update favicon
    const favicons = document.querySelectorAll("link[rel*='icon']");
    favicons.forEach(fav => {
      fav.href = concept.markSvg || concept.markPng;
    });

    if (persist) {
      try {
        localStorage.setItem("ts_active_logo_id", concept.id);
      } catch {}
    }

    // Update UI active buttons
    document.querySelectorAll(".ts-logo-apply-btn").forEach(btn => {
      const id = btn.getAttribute("data-concept-id");
      if (id === concept.id) {
        btn.textContent = "Active Live Header";
        btn.style.backgroundColor = "#059669";
        btn.style.borderColor = "#059669";
        btn.style.color = "#FFFFFF";
      } else {
        btn.textContent = "Apply to Header";
        btn.style.backgroundColor = "#FFFFFF";
        btn.style.borderColor = "#CBD5E1";
        btn.style.color = "#0F172A";
      }
    });
  }

  function injectStudioUI() {
    if (!document.getElementById("ts-logo-studio-responsive-styles")) {
      const studioStyle = document.createElement("style");
      studioStyle.id = "ts-logo-studio-responsive-styles";
      studioStyle.textContent = `
        @media (max-width: 768px) {
          #ts-logo-studio-launcher, #ts-logo-launcher {
            display: none !important;
          }
        }
      `;
      document.head.appendChild(studioStyle);
    }

    // 1. Inject Floating Launcher Button (Bottom Left)
    const launcher = document.createElement("button");
    launcher.id = "ts-logo-studio-launcher";
    launcher.type = "button";
    launcher.style.position = "fixed";
    launcher.style.bottom = "20px";
    launcher.style.left = "20px";
    launcher.style.zIndex = "9998";
    launcher.style.display = "flex";
    launcher.style.alignItems = "center";
    launcher.style.gap = "8px";
    launcher.style.padding = "10px 14px";
    launcher.style.backgroundColor = "#0F172A";
    launcher.style.color = "#FFFFFF";
    launcher.style.fontFamily = "'JetBrains Mono', monospace";
    launcher.style.fontSize = "11px";
    launcher.style.fontWeight = "700";
    launcher.style.letterSpacing = "0.08em";
    launcher.style.textTransform = "uppercase";
    launcher.style.border = "1px solid #334155";
    launcher.style.borderRadius = "0px";
    launcher.style.boxShadow = "0 10px 25px -5px rgba(15, 23, 42, 0.4)";
    launcher.style.maxWidth = "calc(100vw - 24px)";
    launcher.style.boxSizing = "border-box";
    launcher.style.whiteSpace = "nowrap";
    launcher.style.cursor = "pointer";
    launcher.style.transition = "transform 0.15s ease, background-color 0.15s ease";

    launcher.innerHTML = `
      <span style="width: 8px; height: 8px; background-color: #059669; display: inline-block;"></span>
      <span>Logo Studio (10)</span>
    `;

    launcher.onmouseenter = () => { launcher.style.backgroundColor = "#0052CC"; };
    launcher.onmouseleave = () => { launcher.style.backgroundColor = "#0F172A"; };
    launcher.onclick = () => toggleModal(true);

    document.body.appendChild(launcher);

    // 2. Inject Modal Overlay
    const modal = document.createElement("div");
    modal.id = "ts-logo-studio-modal";
    modal.style.position = "fixed";
    modal.style.inset = "0";
    modal.style.backgroundColor = "rgba(15, 23, 42, 0.75)";
    modal.style.backdropFilter = "blur(6px)";
    modal.style.zIndex = "9999";
    modal.style.display = "none";
    modal.style.padding = "24px";
    modal.style.overflowY = "auto";

    modal.innerHTML = `
      <div style="max-width: 1200px; margin: 0 auto; background-color: #FAFAFC; border: 1px solid #CBD5E1; box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25); color: #0F172A; font-family: 'Plus Jakarta Sans', sans-serif;">
        
        <!-- Header Strip -->
        <div style="background-color: #0F172A; color: #FFFFFF; padding: 16px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1E293B;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="width: 10px; height: 10px; background-color: #059669; display: inline-block;"></span>
            <div>
              <div style="font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; letter-spacing: -0.01em;">BRAND IDENTITY &amp; LOGO STUDIO</div>
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #94A3B8; letter-spacing: 0.1em; text-transform: uppercase;">Technology Specialist // 36 Years Engineering Heritage (1990 - 2026)</div>
            </div>
          </div>
          <button id="ts-logo-studio-close" type="button" style="background: none; border: 1px solid #334155; color: #FFFFFF; padding: 6px 12px; font-family: 'JetBrains Mono', monospace; font-size: 11px; cursor: pointer;">[ESC / CLOSE]</button>
        </div>

        <!-- Filter Sub-header -->
        <div style="background-color: #FFFFFF; padding: 12px 24px; border-bottom: 1px solid #CBD5E1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; gap: 8px;">
            <button class="ts-tab-btn" data-filter="all" style="padding: 6px 12px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; border: 1px solid #0052CC; background-color: #0052CC; color: #FFFFFF; cursor: pointer;">All Concepts (10)</button>
            <button class="ts-tab-btn" data-filter="vector" style="padding: 6px 12px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; border: 1px solid #CBD5E1; background-color: #FFFFFF; color: #0F172A; cursor: pointer;">Vector SVG Systems (6)</button>
            <button class="ts-tab-btn" data-filter="ai" style="padding: 6px 12px; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; border: 1px solid #CBD5E1; background-color: #FFFFFF; color: #0F172A; cursor: pointer;">AI Studio Concepts (4)</button>
          </div>
          <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #64748B;">Click 'Apply to Header' to preview any concept live on the site.</div>
        </div>

        <!-- Cards Grid -->
        <div id="ts-cards-container" style="padding: 24px; display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 20px;">
        </div>

        <!-- Footer -->
        <div style="padding: 16px 24px; background-color: #FFFFFF; border-top: 1px solid #CBD5E1; display: flex; align-items: center; justify-content: space-between; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #64748B;">
          <span>Principal Engineer: Steve Cormier // Orlando &amp; Nationwide</span>
          <span>Enterprise Cloud: GreenTreeOS Application Cluster</span>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Populate Cards
    renderCards("all");

    // Event Bindings
    document.getElementById("ts-logo-studio-close").onclick = () => toggleModal(false);
    modal.onclick = (e) => {
      if (e.target === modal) toggleModal(false);
    };

    document.querySelectorAll(".ts-tab-btn").forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll(".ts-tab-btn").forEach(b => {
          b.style.backgroundColor = "#FFFFFF";
          b.style.borderColor = "#CBD5E1";
          b.style.color = "#0F172A";
        });
        btn.style.backgroundColor = "#0052CC";
        btn.style.borderColor = "#0052CC";
        btn.style.color = "#FFFFFF";
        renderCards(btn.getAttribute("data-filter"));
      };
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display !== "none") {
        toggleModal(false);
      }
    });
  }

  function renderCards(filter = "all") {
    const container = document.getElementById("ts-cards-container");
    if (!container) return;
    container.innerHTML = "";

    const activeId = getStoredConceptId();
    const filtered = CONCEPTS.filter(c => filter === "all" || c.type === filter);

    filtered.forEach(c => {
      const card = document.createElement("div");
      card.style.backgroundColor = "#FFFFFF";
      card.style.border = "1px solid #CBD5E1";
      card.style.display = "flex";
      card.style.flexDirection = "column";
      card.style.justifyContent = "space-between";

      const isActive = c.id === activeId;

      card.innerHTML = `
        <div>
          <!-- Card Header -->
          <div style="padding: 14px 16px; border-bottom: 1px solid #CBD5E1; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-family: 'Space Grotesk', sans-serif; font-size: 13px; font-weight: 700; color: #0F172A;">${c.name}</div>
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #64748B; text-transform: uppercase;">TYPE: ${c.type === 'vector' ? 'VECTOR SVG SYSTEM' : 'AI STUDIO MARK'}</div>
            </div>
            <span style="font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700; padding: 2px 6px; background-color: ${c.badge === 'FLAGSHIP DEFAULT' ? '#ECFDF5' : '#EFF6FF'}; color: ${c.badge === 'FLAGSHIP DEFAULT' ? '#059669' : '#0052CC'}; border: 1px solid ${c.badge === 'FLAGSHIP DEFAULT' ? '#A7F3D0' : '#BFDBFE'};">${c.badge}</span>
          </div>

          <!-- Specimen Surfaces -->
          <div style="padding: 16px; display: flex; flex-direction: column; gap: 8px;">
            <!-- Light Surface -->
            <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; padding: 14px; display: flex; align-items: center; justify-content: center; min-height: 72px;">
              <img src="${c.svg}" alt="${c.name} on Light" style="max-height: 48px; max-width: 100%; object-contain;" />
            </div>

            <!-- Slate Surface -->
            <div style="background-color: #0F172A; border: 1px solid #1E293B; padding: 14px; display: flex; align-items: center; justify-content: center; min-height: 72px;">
              <img src="${c.svg}" alt="${c.name} on Slate" style="max-height: 48px; max-width: 100%; object-contain;" />
            </div>
          </div>

          <!-- Rationale -->
          <div style="padding: 0 16px 14px 16px; font-size: 11px; color: #475569; line-height: 1.4;">
            ${c.desc}
          </div>
        </div>

        <!-- Actions -->
        <div style="padding: 12px 16px; border-top: 1px solid #CBD5E1; background-color: #FAFAFC; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
          <button type="button" class="ts-logo-apply-btn" data-concept-id="${c.id}" style="flex: 1; padding: 8px 10px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; border: 1px solid ${isActive ? '#059669' : '#CBD5E1'}; background-color: ${isActive ? '#059669' : '#FFFFFF'}; color: ${isActive ? '#FFFFFF' : '#0F172A'}; cursor: pointer;">
            ${isActive ? 'Active Live Header' : 'Apply to Header'}
          </button>
          <a href="${c.svg}" download style="padding: 8px 10px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; border: 1px solid #CBD5E1; background-color: #FFFFFF; color: #0052CC; text-decoration: none;">SVG</a>
          <a href="${c.png}" download style="padding: 8px 10px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; border: 1px solid #CBD5E1; background-color: #FFFFFF; color: #0052CC; text-decoration: none;">PNG</a>
        </div>
      `;

      card.querySelector(".ts-logo-apply-btn").onclick = () => {
        applyConcept(c.id, true);
      };

      container.appendChild(card);
    });
  }

  function toggleModal(open) {
    const modal = document.getElementById("ts-logo-studio-modal");
    if (!modal) return;
    modal.style.display = open ? "block" : "none";
    document.body.style.overflow = open ? "hidden" : "";
  }

  function shouldMountStudioUI() {
    try {
      const path = window.location.pathname || "";
      const search = window.location.search || "";
      return (
        path.startsWith("/logos") ||
        path.startsWith("/admin") ||
        search.includes("logoStudio=1")
      );
    } catch {
      return false;
    }
  }

  // Auto-apply saved concept on initial load; only mount UI on admin or /logos routes
  function initStudio() {
    if (shouldMountStudioUI()) {
      injectStudioUI();
    }
    applyConcept(getStoredConceptId(), false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStudio);
  } else {
    initStudio();
  }
})();
