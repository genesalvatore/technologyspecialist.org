import https from "node:https";

const TARGET_HOST = "148.113.149.8";
const VIRTUAL_HOST = "technologyspecialist.org";
const PASSCODE = "TechSpec2026";

const routes = [
  "/",
  "/about",
  "/contact",
  "/tools",
  "/logos",
  "/services",
  "/services/microsoft-365",
  "/services/virtualization",
  "/services/hardening",
  "/services/voip-ippbx",
  "/services/network-management",
  "/services/mobile-device-management",
  "/services/remote-desktop",
  "/services/onsite-support",
  "/services/it-consultancy",
  "/services/ai-implementation",
  "/api/mod/site-tree",
  "/api/admin/sticker-studio",
  "/sitemap.xml",
  "/robots.txt",
];

function fetchRoute(path) {
  return new Promise((resolve) => {
    const queryChar = path.includes("?") ? "&" : "?";
    const pathWithKey = `${path}${queryChar}key=${PASSCODE}`;
    const options = {
      hostname: TARGET_HOST,
      port: 443,
      path: pathWithKey,
      method: "GET",
      headers: {
        Host: VIRTUAL_HOST,
        "User-Agent": "FleetVerificationAgent/1.0",
      },
      rejectUnauthorized: false, // self-signed or staging cert on IP
    };

    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        let titleMatch = body.match(/<title>([^<]+)<\/title>/i);
        let title = titleMatch ? titleMatch[1].trim() : "";
        if (!title && res.headers["content-type"]?.includes("application/json")) {
          try {
            const j = JSON.parse(body);
            title = `JSON: ${j.routes ? `${j.routes.length} routes` : j.stickers ? `${j.stickers.length} stickers` : j.status || "object"}`;
          } catch {
            title = "JSON object";
          }
        } else if (!title && path.endsWith(".xml")) {
          title = "XML document";
        } else if (!title && path.endsWith(".txt")) {
          title = "Text file";
        }
        resolve({
          path,
          status: res.statusCode,
          contentType: res.headers["content-type"] || "",
          contentLength: body.length,
          title: title.slice(0, 75),
        });
      });
    });

    req.on("error", (err) => {
      resolve({ path, status: 0, error: err.message });
    });
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({ path, status: 0, error: "TIMEOUT" });
    });
    req.end();
  });
}

async function run() {
  console.log(`Starting live verification on APPS1 (${TARGET_HOST}) [Host: ${VIRTUAL_HOST}] with ?key=${PASSCODE}...\n`);
  let failed = 0;
  for (const r of routes) {
    const res = await fetchRoute(r);
    const ok = res.status === 200;
    if (!ok) failed++;
    console.log(
      `${ok ? "✅" : "❌"} ${res.status} [${r.padEnd(35)}] ${String(res.contentLength || 0).padStart(6)} bytes | ${res.title || res.error || ""}`
    );
  }
  console.log(`\nCompleted verification: ${routes.length - failed}/${routes.length} passed.`);
  process.exit(failed > 0 ? 1 : 0);
}

run();
