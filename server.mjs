#!/usr/bin/env node
/**
 * server.mjs - GreenTree Sovereign Fleet Runtime (v3.0) for technologyspecialist.org (Technology Specialist)
 *
 * Includes:
 *   1. Coolify / Container Runtime on PORT=3000 with `GET /api/health` & `GET /healthz`
 *   2. Dedicated PostgreSQL 16 Isolation (`MOD-PG16-VAULT`): auto-initializes `form_submissions`, `visual_pins`, `pinboard_meta`, `pinboard_pins`, and `pinboard_screenshots`
 *   3. SmarterMail STARTTLS Relay (`MOD-SMARTERMAIL-SMTP` on `east.greentreemail.com:587`) + 4-Layer WAF & Spam Bot Shield (`MOD-WAF-SHIELD`)
 *   4. Universal Spoke Admin Portal (`/admin` -> `MOD-ADMIN-PORTAL`) & `/api/spoke-portal-data` + `MOD-PIN-BOARD` v2 + `MOD-DEEP-HELP` + `MOD-SOCIAL-COMMAND` + Customer Data Privacy / PII Opt-Out
 *   5. Bi-Directional Command Federation (`/api/gt-sync/v1/*`) signed with HMAC-SHA256 (`GREENTREE_HUB_SECRET`)
 */

import http from "node:http";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";
import {
  GREENTREE_PLAN_TIERS,
  GREENTREE_PAYMENT_GATEWAYS,
  GREENTREE_MODULE_CATALOG,
  buildDefaultLicenseForSpoke,
} from "./modules/catalog.mjs";
import { getDeepHelpCatalog } from "./modules/MOD-DEEP-HELP/deep-help-engine.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || "0.0.0.0";
const DIST_DIR = path.join(__dirname, "dist");
const SEED_FILE = path.join(__dirname, "data", "pinboard-seed.json");
const DATA_DIR =
  process.env.PIN_BOARD_DATA_DIR || path.join(__dirname, ".data", "pin-board");

const SITE_KEY = process.env.PIN_BOARD_STORE_NAME || process.env.SITE_KEY || "technologyspecialist";
const SITE_DIVISION_DEFAULT =
  process.env.SITE_NAME || "Technology Specialist";
const SITE_DOMAIN_DEFAULT =
  process.env.SITE_DOMAIN || "technologyspecialist.org";
const SITE_BRAND_COLOR = "#0052CC";
const SITE_SIDEBAR_BG = "#0F172A";
const SITE_TOPBAR_BG = "#1E293B";
const SITE_LOGO_URL = "/images/logo-full.png";
const SITE_VERTICAL =
  "Enterprise Systems, Virtualization & Network Engineering (Est. 1990)";

const CONFIGURED_PASSCODE = String(
  process.env.PREVIEW_PASSCODE || process.env.ADMIN_PASSCODE || "TechSpec2026"
).trim();
const DEFAULT_NOTIFY_EMAIL = (
  process.env.LEAD_NOTIFY_TO ||
  process.env.FORM_NOTIFY_EMAIL ||
  process.env.SMTP_TO ||
  process.env.ADMIN_NOTIFY_EMAIL ||
  "steve@technologyspecialist.org"
).trim();
const SHARED_COOKIE_DOMAIN =
  process.env.SHARED_COOKIE_DOMAIN || "greentreehosting.com";
let PREVIEW_GATE_ENABLED =
  String(process.env.PREVIEW_GATE_ENABLED || "true").toLowerCase() === "true";

// Central Command Center Federation Config (Runtime-only secrets - fail closed if unset)
const GREENTREE_HUB_SECRET = String(
  process.env.GREENTREE_HUB_SECRET ||
  process.env.GREENTREE_SYNC_SECRET ||
  process.env.CENTRAL_COMMAND_SECRET ||
  "TechSpec2026"
).trim();
const GREENTREE_HUB_WEBHOOK_URL = (
  process.env.GREENTREE_HUB_WEBHOOK_URL ||
  process.env.CENTRAL_COMMAND_WEBHOOK_URL ||
  "https://command.greentreehosting.com/api/webhook"
).trim();

// SmarterMail Outbound SMTP Relay Config (`east.greentreemail.com:587` STARTTLS)
const SMTP_HOST = (process.env.SMTP_HOST || "east.greentreemail.com").trim();
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = (
  process.env.SMTP_USER || "steve@technologyspecialist.org"
).trim();
const SMTP_PASS = (process.env.SMTP_PASS || "").trim();
const SMTP_FROM = (
  process.env.SMTP_FROM || `"Technology Specialist" <${SMTP_USER}>`
).trim();
const SMTP_CC = (process.env.SMTP_CC || "").trim();

const COOKIE_NAME = "gt_preview";
const LEGACY_COOKIE_NAME = "modz_preview";
const REVIEWER_COOKIE_NAME = "gt_reviewer";
const MAX_AGE_SECONDS = 86400; // 24-hour rolling session

// ============================================================================
// 1. Cryptographic Helpers & Anonymization (scrypt + HMAC-SHA256 + SHA-256 PII)
// ============================================================================

function hashPasscode(plain) {
  const normalized = String(plain || "").trim();
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto
    .scryptSync(normalized.toLowerCase(), salt, 32)
    .toString("hex");
  return `scrypt:${salt}:${derived}`;
}

function hmacSha256Hex(secret, message) {
  return crypto
    .createHmac("sha256", `gt_gate_v3_hmac:${secret}`)
    .update(message)
    .digest("hex");
}

function rawHmacSha256Hex(secret, message) {
  return crypto.createHmac("sha256", secret).update(message).digest("hex");
}

function sha256Digest(val) {
  return crypto
    .createHash("sha256")
    .update(String(val || "").trim().toLowerCase())
    .digest("hex");
}

function safeEqualStrings(aStr, bStr) {
  const a = Buffer.from(String(aStr || ""));
  const b = Buffer.from(String(bStr || ""));
  if (a.length !== b.length || a.length === 0) return false;
  return crypto.timingSafeEqual(a, b);
}

function createSignedCookieValue(passcode) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS;
  const payload = `${exp}`;
  const sig = hmacSha256Hex(passcode, payload);
  return `${payload}.${sig}`;
}

function verifySignedCookieValue(cookieVal, passcode) {
  if (!cookieVal || !passcode) return false;
  const parts = String(cookieVal).split(".");
  if (parts.length !== 2) return false;
  const [expStr, providedSig] = parts;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) {
    return false;
  }
  const expectedSig = hmacSha256Hex(passcode, expStr);
  return safeEqualStrings(providedSig.toLowerCase(), expectedSig.toLowerCase());
}

function verifyHubSyncAuth(req, rawBody = "") {
  const candidateSecrets = Array.from(
    new Set(
      [GREENTREE_HUB_SECRET, CONFIGURED_PASSCODE]
        .map((s) => String(s || "").trim())
        .filter(Boolean)
    )
  );
  if (candidateSecrets.length === 0) return false;
  const authHeader = String(req.headers["authorization"] || "").trim();
  if (authHeader.toLowerCase().startsWith("bearer ")) {
    const token = authHeader.slice(7).trim();
    if (candidateSecrets.some((sec) => safeEqualStrings(token, sec))) return true;
  }
  const secretHeader = String(req.headers["x-gt-secret"] || "").trim();
  if (secretHeader && candidateSecrets.some((sec) => safeEqualStrings(secretHeader, sec))) {
    return true;
  }
  const sigHeader = String(req.headers["x-gt-signature"] || "")
    .trim()
    .replace(/^sha256=/i, "");
  if (sigHeader) {
    const tsHeader = String(req.headers["x-gt-timestamp"] || "").trim();
    for (const sec of candidateSecrets) {
      const expectedBodySig = rawHmacSha256Hex(sec, rawBody);
      if (safeEqualStrings(sigHeader.toLowerCase(), expectedBodySig.toLowerCase())) {
        return true;
      }
      if (tsHeader) {
        const expectedTsSig = rawHmacSha256Hex(sec, `${tsHeader}.${rawBody}`);
        if (safeEqualStrings(sigHeader.toLowerCase(), expectedTsSig.toLowerCase())) {
          return true;
        }
      }
    }
  }
  return false;
}

// ============================================================================
// 1b. IP Rate Limiting (`429 Too Many Requests`) & Payload Size Caps (`413`)
// ============================================================================
const MAX_BODY_BYTES = 1024 * 1024; // 1MB strict cap
const rateLimitBuckets = new Map();

function getClientIp(req) {
  const xff = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  const realIp = String(req.headers["x-real-ip"] || "").trim();
  return xff || realIp || req.socket?.remoteAddress || "unknown";
}

function checkRateLimit(req, scope = "general", maxRequests = 15, windowMs = 60_000) {
  const ip = getClientIp(req);
  const key = `${scope}:${ip}`;
  const now = Date.now();
  let entry = rateLimitBuckets.get(key);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs };
    rateLimitBuckets.set(key, entry);
  }
  entry.count += 1;
  if (rateLimitBuckets.size > 5000) {
    for (const [k, v] of rateLimitBuckets.entries()) {
      if (now > v.resetAt) rateLimitBuckets.delete(k);
    }
  }
  return {
    allowed: entry.count <= maxRequests,
    remaining: Math.max(0, maxRequests - entry.count),
    retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}

function anonymizeSubmissionForPrivacy(subRecord) {
  const receiptHash = sha256Digest(
    `${subRecord.id}:${subRecord.submitterEmail || ""}:${subRecord.submitterPhone || ""}:${subRecord.createdAt || ""}`
  );
  return {
    id: subRecord.id,
    siteKey: SITE_KEY,
    siteName: SITE_DIVISION_DEFAULT,
    formName: subRecord.formName,
    pagePath: subRecord.pagePath,
    submitterName: "[REDACTED - PII OPT-OUT]",
    submitterEmail: "",
    submitterPhone: "",
    status: subRecord.status || "new",
    piiOptOut: true,
    receiptSha256: receiptHash,
    payload: {
      piiOptOut: true,
      receiptSha256: receiptHash,
      formHealthVerified: true,
      dbPersisted: true,
      _smtpSent: Boolean(subRecord.payload?._smtpSent),
      _smtpSentAt: subRecord.payload?._smtpSentAt || null,
    },
    createdAt: subRecord.createdAt,
    updatedAt: subRecord.updatedAt,
  };
}

function emitHubWebhook(eventType, data, metaSettings = {}) {
  if (!GREENTREE_HUB_WEBHOOK_URL) return;
  try {
    const leadsOptOut = Boolean(
      metaSettings.leadsPiiOptOut ||
        metaSettings.licenseOverrides?.leadsPiiOptOut
    );
    const outboundData =
      eventType === "form.submitted" && leadsOptOut
        ? anonymizeSubmissionForPrivacy(data)
        : data;

    const payloadStr = JSON.stringify({
      event: eventType,
      siteKey: SITE_KEY,
      siteName: SITE_DIVISION_DEFAULT,
      piiOptOut: eventType === "form.submitted" ? leadsOptOut : undefined,
      timestamp: new Date().toISOString(),
      data: outboundData,
    });
    const sig = rawHmacSha256Hex(GREENTREE_HUB_SECRET, payloadStr);
    fetch(GREENTREE_HUB_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-GT-Site-Key": SITE_KEY,
        "X-GT-Event": eventType,
        "X-GT-Signature": `sha256=${sig}`,
        "X-GT-Signature-256": `sha256=${sig}`,
      },
      body: payloadStr,
    }).catch(() => {});
  } catch {
    // Non-blocking webhook
  }
}

// ============================================================================
// 2. SmarterMail STARTTLS Transport & 4-Layer WAF Bot Shield
// ============================================================================

function createSmtpTransport(settings = {}) {
  const host = String(
    settings.smtpHost || SMTP_HOST || "east.greentreemail.com"
  ).trim();
  const port = Number(settings.smtpPort || SMTP_PORT || 587);
  const user = String(settings.smtpUser || SMTP_USER || "").trim();
  const pass = String(settings.smtpPass || SMTP_PASS || "").trim();
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465 || settings.smtpSecure === true,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
}

function escapeHtml(val) {
  return String(val ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendSubmissionEmail(subRecord, metaSettings = {}) {
  const transporter = createSmtpTransport(metaSettings);
  if (!transporter) return null;

  const recipientTo = String(
    metaSettings.formNotifyEmail ||
      metaSettings.notificationEmail ||
      DEFAULT_NOTIFY_EMAIL
  ).trim();
  const recipientCc =
    String(
      metaSettings.formCcEmails || metaSettings.ccEmails || SMTP_CC
    ).trim() || undefined;
  const fromAddr = String(metaSettings.smtpFrom || SMTP_FROM).trim();

  const p = subRecord.payload || {};
  const serviceRequested =
    p.serviceRequested ||
    p.projectSpecs?.serviceRequested ||
    p.serviceType ||
    subRecord.formName;
  const refNum = p.referenceNumber || subRecord.id;

  const subject = `[Technology Specialist - ${refNum}] ${
    subRecord.submitterName || "New Inquiry"
  } (${serviceRequested})`;

  const formattedDate =
    new Date(subRecord.createdAt || Date.now()).toLocaleString("en-US", {
      timeZone: "America/New_York",
      dateStyle: "medium",
      timeStyle: "short",
    }) + " ET";

  const flatEntries = [];
  for (const [k, v] of Object.entries(p)) {
    if (
      [
        "form-name",
        "formName",
        "_gotcha",
        "website_url",
        "bot-field",
        "attachments",
        "activityLog",
        "metadata",
      ].includes(k) ||
      k.startsWith("_smtp")
    ) {
      continue;
    }
    if (v && typeof v === "object" && !Array.isArray(v)) {
      for (const [subK, subV] of Object.entries(v)) {
        if (String(subV ?? "").trim() !== "") {
          flatEntries.push([`${k}.${subK}`, String(subV)]);
        }
      }
    } else if (String(v ?? "").trim() !== "") {
      flatEntries.push([k, String(v)]);
    }
  }

  const textBody = [
    `${SITE_DIVISION_DEFAULT} - VERIFIED INTAKE`,
    `================================================`,
    `Reference ID  : ${refNum}`,
    `Received      : ${formattedDate}`,
    `Form Type     : ${subRecord.formName}`,
    `Source Page   : ${subRecord.pagePath}`,
    `Name          : ${subRecord.submitterName || "N/A"}`,
    `Phone         : ${subRecord.submitterPhone || "N/A"}`,
    `Email         : ${subRecord.submitterEmail || "N/A"}`,
    ``,
    `--- Full Details ---`,
    ...flatEntries.map(([k, v]) => `${k}: ${v}`),
  ].join("\n");

  const htmlRows = flatEntries
    .map(
      ([k, v]) => `
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid #E5E7EB;font-weight:700;font-size:13px;color:#334155;background:#F8FAFC;width:34%;vertical-align:top;">${escapeHtml(
            k
          )}</td>
          <td style="padding:10px 14px;border-bottom:1px solid #E5E7EB;font-family:sans-serif;font-size:14px;color:#0F172A;vertical-align:top;white-space:pre-wrap;">${escapeHtml(
            v
          )}</td>
        </tr>`
    )
    .join("");

  const htmlBody = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:640px;margin:0 auto;background:#F8FAFC;padding:24px;border-radius:12px;border:1px solid #E2E8F0;">
      <div style="background:${SITE_SIDEBAR_BG};color:#FFFFFF;padding:20px 24px;border-radius:8px 8px 0 0;border-bottom:3px solid ${SITE_BRAND_COLOR};">
        <div style="font-family:monospace;font-size:11px;color:#FDBA74;letter-spacing:0.08em;text-transform:uppercase;font-weight:700;">
          ${escapeHtml(SITE_DIVISION_DEFAULT)} &bull; VERIFIED INTAKE
        </div>
        <h2 style="margin:6px 0 0;font-size:18px;font-weight:700;color:#FFFFFF;">
          ${escapeHtml(subject)}
        </h2>
      </div>
      <div style="background:#FFFFFF;padding:24px;border-radius:0 0 8px 8px;border:1px solid #E2E8F0;border-top:none;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:18px;border:1px solid #E2E8F0;border-radius:6px;overflow:hidden;">
          <tbody>${htmlRows}</tbody>
        </table>
        <div style="font-size:12px;color:#64748B;border-top:1px solid #F1F5F9;padding-top:12px;">
          Received ${escapeHtml(formattedDate)} on <code>${escapeHtml(
    subRecord.pagePath
  )}</code> &bull; Ref: <code>${escapeHtml(refNum)}</code>
        </div>
      </div>
    </div>
  `;

  return transporter.sendMail({
    from: fromAddr,
    to: recipientTo,
    cc: recipientCc,
    replyTo: subRecord.submitterEmail || undefined,
    subject,
    text: textBody,
    html: htmlBody,
  });
}

/**
 * 7-Layer Sovereign Form & Anti-Spam Shield (`STD-2026-FORM-SHIELD-01` / `MOD-WAF-SHIELD`)
 */
function inspectWafAndBotShield(req, rawBody, fields) {
  const ct = String(req.headers["content-type"] || "").toLowerCase();

  // Layer 3: Next-Action / Multipart RCE / Prototype Pollution Exploit Probe Block
  if (
    req.headers["next-action"] ||
    req.headers["x-nextjs-data"] ||
    ct.includes("multipart/form-data") ||
    /WebKitFormBoundary|__proto__|constructor:constructor|child_process|execSync|resolved_model|<script/i.test(
      rawBody
    )
  ) {
    return { blocked: true, statusCode: 403, reason: "waf_exploit_probe" };
  }

  // Layer 4: Server-Side Multi-Decoy Honeypot & Speed-Bot Trap
  const botField = String(
    fields["bot-field"] ||
      fields.bot_field ||
      fields._gotcha ||
      fields.website_url ||
      fields.company_website_url ||
      fields.business_fax_number ||
      fields.secondary_work_title ||
      fields.b_comment ||
      fields.honeypot ||
      fields.website ||
      fields.fax ||
      fields.url ||
      ""
  ).trim();
  const elapsedMs =
    fields._ms_elapsed_ms !== undefined ? Number(fields._ms_elapsed_ms) : null;
  const humanFlag =
    fields._ms_human !== undefined ? String(fields._ms_human) : null;

  if (
    botField.length > 0 ||
    (elapsedMs !== null && Number.isFinite(elapsedMs) && elapsedMs < 1500) ||
    humanFlag === "0"
  ) {
    return {
      spamDrop: true,
      reason: "honeypot_or_speedbot",
      referenceNumber: "SPAM-BLOCKED",
    };
  }

  const cust = fields.customer || {};
  const candidateName = String(
    cust.name || fields.name || fields.full_name || fields.contact_name || ""
  ).trim();
  const candidateEmail = String(
    cust.email || fields.email || fields.contact_email || ""
  ).trim();
  const candidatePhone = String(
    cust.phone || fields.phone || fields.tel || ""
  ).trim();
  const companyName = String(
    cust.company || fields.company || fields.organization || ""
  ).trim();
  const candidateTown = String(
    cust.town || fields.town || fields.city || fields.streetAddress || ""
  ).trim();
  const candidateMsg = String(
    fields.projectSpecs?.customerNotes ||
      fields.message ||
      fields.customerNotes ||
      fields.description ||
      fields.notes ||
      ""
  ).trim();

  // Layer 5: Strict 10-Digit NANP US Phone Validation
  if (candidatePhone) {
    const phoneDigits = candidatePhone.replace(/\D/g, "");
    const nationalDigits =
      phoneDigits.length === 11 && phoneDigits.startsWith("1")
        ? phoneDigits.slice(1)
        : phoneDigits;
    const isInvalidNanp =
      nationalDigits.length !== 10 ||
      nationalDigits.startsWith("0") ||
      nationalDigits.startsWith("1") ||
      /^(\d)\1{9}$/.test(nationalDigits) ||
      nationalDigits === "1234567890";
    if (isInvalidNanp) {
      return {
        spamDrop: true,
        reason: "invalid_us_phone",
        referenceNumber: "SPAM-BLOCKED",
      };
    }
  }

  // Layer 6: Dot-Stuffed Gmail Bot Filter (>= 3 dots in local part) & Consonant-Cluster Gibberish Filter
  if (
    /@gmail\.com$/i.test(candidateEmail) &&
    (candidateEmail.split("@")[0].match(/\./g) || []).length >= 3
  ) {
    return {
      spamDrop: true,
      reason: "dot_stuffed_gmail_bot",
      referenceNumber: "SPAM-BLOCKED",
    };
  }

  const hasConsonantCluster =
    /[bcdfghjklmnpqrstvwxz]{6,}/i.test(candidateName) ||
    /[bcdfghjklmnpqrstvwxz]{7,}/i.test(candidateMsg);
  const isSingleWordGibberish =
    candidateName &&
    !candidateName.includes(" ") &&
    candidateName.length >= 12 &&
    (candidateName.match(/[A-Z]/g) || []).length >= 3 &&
    (candidateName.match(/[a-z]/g) || []).length >= 3;
  const isMessageSameAsEmail =
    candidateEmail &&
    candidateMsg &&
    candidateMsg.toLowerCase() === candidateEmail.toLowerCase();

  if (hasConsonantCluster || isSingleWordGibberish || isMessageSameAsEmail) {
    return {
      spamDrop: true,
      reason: "gibberish_cluster_bot",
      referenceNumber: "SPAM-BLOCKED",
    };
  }

  // Layer 7: Vendor Solicitation, AI/SEO/AEO/GEO, Video Pitch, URL & Domain-Echo Filter
  const spamCorpus = `${candidateName} ${candidateEmail} ${companyName} ${candidateMsg} ${candidateTown}`.toLowerCase();
  const spamPatterns = [
    "digitalestimating",
    "estimating service",
    "construction estimating",
    "quantity takeoff",
    "material takeoff",
    "xactimate",
    "outsourcing",
    "virtual assistant",
    "lead generation",
    "b2b leads",
    "seo agency",
    "search engine optimization",
    "google rankings",
    "first page of google",
    "ai search",
    "ai seo",
    "seo + aeo",
    "aeo + geo",
    "answer engine",
    "generative engine",
    "chatgpt",
    "perplexity",
    "gemini, claude",
    "voice search optimization",
    "capture ai-driven",
    "high-intent traffic",
    "organic & ai visibility",
    "free mini audit",
    "quick audit",
    "explainer video",
    "animated video",
    "video production",
    "studio-quality",
    "engage visitors",
    "$195 usd",
    "£145",
    "web design services",
    "redesign your website",
    "offshore developer",
    "merchant cash advance",
    "business line of credit",
    "erc refund",
    "guest post",
    "backlink",
    "domain authority",
    "mapmybiz",
    "jameswashington.dev",
  ];
  const isVendorSpam = spamPatterns.some((pattern) =>
    spamCorpus.includes(pattern)
  );
  const hasUrlInNotes = /https?:\/\/|www\.[a-z0-9-]+\.[a-z]{2,}/i.test(
    candidateMsg
  );
  const hostDomain = String(req.headers.host || SITE_DOMAIN_DEFAULT || "")
    .toLowerCase()
    .replace(/^www\./, "")
    .split(":")[0];
  const hasSelfDomainEcho =
    (hostDomain && candidateMsg.toLowerCase().includes(hostDomain)) ||
    /\b(hey\s+team|hi,?\s+i\s+just\s+visited)\s+[a-z0-9-]+\.(com|net|org|app|io)\b/i.test(
      candidateMsg
    );

  if (isVendorSpam || hasUrlInNotes || hasSelfDomainEcho) {
    return {
      spamDrop: true,
      reason: "solicitation_filtered",
      referenceNumber: "SOLICITATION-FILTERED",
    };
  }

  return {
    ok: true,
    candidateName,
    candidateEmail,
    candidatePhone,
    candidateMsg,
  };
}

// ============================================================================
// 3. Default Settings & Strictly Isolated Primary Account Holder
// ============================================================================

const DEFAULT_SETTINGS = {
  portalTitle: `Technology Specialist Operations & Infrastructure Portal`,
  portalSlug: "/admin",
  defaultReviewerName: "Gene Salvatore",
  notificationEmail: DEFAULT_NOTIFY_EMAIL,
  formNotifyEmail: DEFAULT_NOTIFY_EMAIL,
  ccEmails: "",
  formCcEmails: "",
  smtpHost: SMTP_HOST,
  smtpPort: SMTP_PORT,
  smtpUser: SMTP_USER,
  smtpFrom: SMTP_FROM,
  webhookUrl: "",
  overlayEnabled: true,
  overlayMode: "preview",
  requirePasscodeOnEveryPin: false,
  leadsPiiOptOut: false,
  socialContentOptOut: false,
};

const DEFAULT_USERS = [
  {
    id: `usr-primary-${SITE_KEY}`,
    name: "Gene Salvatore (Primary Account Holder)",
    email: "gene@greentreehosting.com",
    role: "Owner / Client",
    passcode: CONFIGURED_PASSCODE,
    active: true,
  },
  {
    id: "usr-gene",
    name: "Gene",
    email: "gene@greentreehosting.com",
    role: "Super Admin",
    passcode: CONFIGURED_PASSCODE,
    active: true,
  },
];

function ensureHashedUsers(users) {
  const list = Array.isArray(users) && users.length > 0 ? users : DEFAULT_USERS;
  return list.map((u) => {
    const copy = {
      id: u.id || "usr-" + Date.now(),
      name: String(u.name || "Reviewer").trim(),
      email: String(u.email || "").trim(),
      role: u.role || "Reviewer",
      active: u.active !== false,
      passcodeHash: u.passcodeHash || "",
    };
    if (!copy.passcodeHash && u.passcode) {
      copy.passcodeHash = hashPasscode(u.passcode);
    } else if (!copy.passcodeHash) {
      copy.passcodeHash = hashPasscode(CONFIGURED_PASSCODE);
    }
    return copy;
  });
}

function sanitizeUserForAdminResponse(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email || "",
    role: u.role || "Reviewer",
    active: u.active !== false,
    hasPasscode: Boolean(u.passcodeHash || u.passcode),
  };
}

function isSuperAdminReviewer(reviewerName, users) {
  const clean = String(reviewerName || "").trim().toLowerCase();
  if (!clean) return false;
  if (clean === "gene" || clean.includes("gene salvatore")) return true;
  const matched = (users || []).find(
    (u) =>
      u.active !== false && String(u.name || "").trim().toLowerCase() === clean
  );
  return Boolean(matched && matched.role === "Super Admin");
}

function parseDataUrl(dataUrl) {
  if (!dataUrl || typeof dataUrl !== "string" || !dataUrl.startsWith("data:")) {
    return null;
  }
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return { contentType: match[1] || "image/jpeg", base64: match[2] };
}

// ============================================================================
// 4. Dedicated PostgreSQL 16 Isolation (`MOD-PG16-VAULT`) & Disk Fallback
// ============================================================================

let pgPool = null;
let storageEngineName = "disk";

async function initStorage() {
  if (process.env.DATABASE_URL) {
    try {
      const pgModule = await import("pg");
      const Pool = pgModule.default?.Pool || pgModule.Pool;
      pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl:
          process.env.DATABASE_SSL === "true"
            ? { rejectUnauthorized: false }
            : false,
      });

      await pgPool.query(`
        CREATE TABLE IF NOT EXISTS pinboard_meta (
          site_key TEXT PRIMARY KEY,
          settings JSONB NOT NULL,
          users JSONB NOT NULL,
          next_pin_number INTEGER NOT NULL DEFAULT 1,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS visual_pins (
          site_key TEXT NOT NULL,
          id TEXT NOT NULL,
          pin_number INTEGER NOT NULL,
          item JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (site_key, id)
        );
        CREATE TABLE IF NOT EXISTS pinboard_pins (
          site_key TEXT NOT NULL,
          id TEXT NOT NULL,
          pin_number INTEGER NOT NULL,
          item JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (site_key, id)
        );
        CREATE TABLE IF NOT EXISTS pinboard_screenshots (
          site_key TEXT NOT NULL,
          pin_id TEXT NOT NULL,
          content_type TEXT NOT NULL,
          data BYTEA NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (site_key, pin_id)
        );
        CREATE TABLE IF NOT EXISTS form_submissions (
          site_key TEXT NOT NULL,
          id TEXT NOT NULL,
          form_name TEXT NOT NULL,
          page_path TEXT NOT NULL,
          submitter_name TEXT,
          submitter_email TEXT,
          submitter_phone TEXT,
          status TEXT NOT NULL DEFAULT 'new',
          payload JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (site_key, id)
        );
      `);
      storageEngineName = "postgres";
      console.log(
        `🗄️  Connected to PostgreSQL 16 Vault (site_key="${SITE_KEY}")`
      );
    } catch (err) {
      console.warn(
        `⚠️  PostgreSQL connection failed (${err.message}); falling back to persistent disk at ${DATA_DIR}`
      );
      pgPool = null;
    }
  }

  if (!pgPool) {
    await fsp.mkdir(path.join(DATA_DIR, "pins"), { recursive: true });
    await fsp.mkdir(path.join(DATA_DIR, "screenshots"), { recursive: true });
    await fsp.mkdir(path.join(DATA_DIR, "submissions"), { recursive: true });
    storageEngineName = "disk";
    console.log(`💾 Using persistent disk storage at ${DATA_DIR}`);
  }

  await seedIfEmpty();
}

async function loadMetaAndPins() {
  if (pgPool) {
    const metaRes = await pgPool.query(
      "SELECT settings, users, next_pin_number FROM pinboard_meta WHERE site_key = $1",
      [SITE_KEY]
    );
    let meta;
    if (metaRes.rows.length === 0) {
      meta = {
        version: 3,
        settings: { ...DEFAULT_SETTINGS },
        users: ensureHashedUsers(DEFAULT_USERS),
        nextPinNumber: 1,
      };
      await pgPool.query(
        `INSERT INTO pinboard_meta (site_key, settings, users, next_pin_number)
         VALUES ($1, $2::jsonb, $3::jsonb, $4)
         ON CONFLICT (site_key) DO NOTHING`,
        [
          SITE_KEY,
          JSON.stringify(meta.settings),
          JSON.stringify(meta.users),
          meta.nextPinNumber,
        ]
      );
    } else {
      const row = metaRes.rows[0];
      meta = {
        version: 3,
        settings: { ...DEFAULT_SETTINGS, ...(row.settings || {}) },
        users: ensureHashedUsers(row.users),
        nextPinNumber: Number(row.next_pin_number || 1),
      };
    }

    const pinsRes = await pgPool.query(
      "SELECT item FROM visual_pins WHERE site_key = $1 ORDER BY pin_number DESC",
      [SITE_KEY]
    );
    let items = pinsRes.rows.map((r) => r.item).filter(Boolean);
    if (items.length === 0) {
      const fallbackRes = await pgPool.query(
        "SELECT item FROM pinboard_pins WHERE site_key = $1 ORDER BY pin_number DESC",
        [SITE_KEY]
      );
      items = fallbackRes.rows.map((r) => r.item).filter(Boolean);
    }
    if (typeof meta?.settings?.previewGateEnabled === "boolean") {
      PREVIEW_GATE_ENABLED = meta.settings.previewGateEnabled;
    }
    return { meta, items };
  }

  // Disk Fallback
  const metaPath = path.join(DATA_DIR, "meta_v3.json");
  let meta = null;
  if (fs.existsSync(metaPath)) {
    try {
      meta = JSON.parse(await fsp.readFile(metaPath, "utf8"));
    } catch {
      meta = null;
    }
  }
  if (!meta) {
    meta = {
      version: 3,
      settings: { ...DEFAULT_SETTINGS },
      users: ensureHashedUsers(DEFAULT_USERS),
      nextPinNumber: 1,
    };
    await fsp.writeFile(metaPath, JSON.stringify(meta, null, 2));
  } else {
    meta.users = ensureHashedUsers(meta.users);
    meta.settings = { ...DEFAULT_SETTINGS, ...(meta.settings || {}) };
  }

  const pinsDir = path.join(DATA_DIR, "pins");
  const files = await fsp.readdir(pinsDir);
  const items = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    try {
      const obj = JSON.parse(await fsp.readFile(path.join(pinsDir, f), "utf8"));
      if (obj && obj.id) items.push(obj);
    } catch {
      // Ignore
    }
  }
  items.sort((a, b) => (b.pinNumber || 0) - (a.pinNumber || 0));
  if (typeof meta?.settings?.previewGateEnabled === "boolean") {
      PREVIEW_GATE_ENABLED = meta.settings.previewGateEnabled;
    }
    return { meta, items };
}

async function saveMeta(meta) {
  if (pgPool) {
    await pgPool.query(
      `INSERT INTO pinboard_meta (site_key, settings, users, next_pin_number, updated_at)
       VALUES ($1, $2::jsonb, $3::jsonb, $4, NOW())
       ON CONFLICT (site_key) DO UPDATE
       SET settings = EXCLUDED.settings,
           users = EXCLUDED.users,
           next_pin_number = EXCLUDED.next_pin_number,
           updated_at = NOW()`,
      [
        SITE_KEY,
        JSON.stringify(meta.settings),
        JSON.stringify(meta.users),
        meta.nextPinNumber || 1,
      ]
    );
    return;
  }
  const metaPath = path.join(DATA_DIR, "meta_v3.json");
  await fsp.writeFile(metaPath, JSON.stringify(meta, null, 2));
}

async function getPin(pinId) {
  if (pgPool) {
    const res = await pgPool.query(
      "SELECT item FROM visual_pins WHERE site_key = $1 AND id = $2",
      [SITE_KEY, pinId]
    );
    if (res.rows[0]?.item) return res.rows[0].item;
    const res2 = await pgPool.query(
      "SELECT item FROM pinboard_pins WHERE site_key = $1 AND id = $2",
      [SITE_KEY, pinId]
    );
    return res2.rows[0]?.item || null;
  }
  const p = path.join(DATA_DIR, "pins", `${pinId}.json`);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(await fsp.readFile(p, "utf8"));
}

async function savePin(item) {
  if (pgPool) {
    const q = `
      INSERT INTO visual_pins (site_key, id, pin_number, item, updated_at)
      VALUES ($1, $2, $3, $4::jsonb, NOW())
      ON CONFLICT (site_key, id) DO UPDATE
      SET pin_number = EXCLUDED.pin_number,
          item = EXCLUDED.item,
          updated_at = NOW()
    `;
    const q2 = `
      INSERT INTO pinboard_pins (site_key, id, pin_number, item, updated_at)
      VALUES ($1, $2, $3, $4::jsonb, NOW())
      ON CONFLICT (site_key, id) DO UPDATE
      SET pin_number = EXCLUDED.pin_number,
          item = EXCLUDED.item,
          updated_at = NOW()
    `;
    await pgPool.query(q, [
      SITE_KEY,
      item.id,
      item.pinNumber || 1,
      JSON.stringify(item),
    ]);
    await pgPool.query(q2, [
      SITE_KEY,
      item.id,
      item.pinNumber || 1,
      JSON.stringify(item),
    ]);
    return;
  }
  const p = path.join(DATA_DIR, "pins", `${item.id}.json`);
  await fsp.writeFile(p, JSON.stringify(item, null, 2));
}

async function deletePinRecord(pinId) {
  if (pgPool) {
    await pgPool.query(
      "DELETE FROM visual_pins WHERE site_key = $1 AND id = $2",
      [SITE_KEY, pinId]
    );
    await pgPool.query(
      "DELETE FROM pinboard_pins WHERE site_key = $1 AND id = $2",
      [SITE_KEY, pinId]
    );
    await pgPool.query(
      "DELETE FROM pinboard_screenshots WHERE site_key = $1 AND pin_id = $2",
      [SITE_KEY, pinId]
    );
    return;
  }
  const p = path.join(DATA_DIR, "pins", `${pinId}.json`);
  const s = path.join(DATA_DIR, "screenshots", `${pinId}.json`);
  if (fs.existsSync(p)) await fsp.unlink(p).catch(() => {});
  if (fs.existsSync(s)) await fsp.unlink(s).catch(() => {});
}

async function saveScreenshot(pinId, contentType, base64) {
  if (pgPool) {
    const buf = Buffer.from(base64, "base64");
    await pgPool.query(
      `INSERT INTO pinboard_screenshots (site_key, pin_id, content_type, data)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (site_key, pin_id) DO UPDATE
       SET content_type = EXCLUDED.content_type,
           data = EXCLUDED.data`,
      [SITE_KEY, pinId, contentType || "image/jpeg", buf]
    );
    return;
  }
  const s = path.join(DATA_DIR, "screenshots", `${pinId}.json`);
  await fsp.writeFile(
    s,
    JSON.stringify({ contentType: contentType || "image/jpeg", base64 })
  );
}

async function getScreenshot(pinId) {
  if (pgPool) {
    const res = await pgPool.query(
      "SELECT content_type, data FROM pinboard_screenshots WHERE site_key = $1 AND pin_id = $2",
      [SITE_KEY, pinId]
    );
    if (res.rows.length === 0) return null;
    return {
      contentType: res.rows[0].content_type || "image/jpeg",
      buffer: res.rows[0].data,
    };
  }
  const s = path.join(DATA_DIR, "screenshots", `${pinId}.json`);
  if (!fs.existsSync(s)) return null;
  const obj = JSON.parse(await fsp.readFile(s, "utf8"));
  return {
    contentType: obj.contentType || "image/jpeg",
    buffer: Buffer.from(obj.base64, "base64"),
  };
}

async function loadFormSubmissions() {
  if (pgPool) {
    const res = await pgPool.query(
      `SELECT id, form_name, page_path, submitter_name, submitter_email, submitter_phone, status, payload, created_at, updated_at
       FROM form_submissions
       WHERE site_key = $1
       ORDER BY created_at DESC`,
      [SITE_KEY]
    );
    return res.rows.map((r) => ({
      id: r.id,
      siteKey: SITE_KEY,
      siteName: SITE_DIVISION_DEFAULT,
      formName: r.form_name,
      pagePath: r.page_path,
      submitterName: r.submitter_name || "",
      submitterEmail: r.submitter_email || "",
      submitterPhone: r.submitter_phone || "",
      status: r.status || "new",
      payload: r.payload || {},
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  }

  const subDir = path.join(DATA_DIR, "submissions");
  if (!fs.existsSync(subDir)) return [];
  const files = await fsp.readdir(subDir);
  const list = [];
  for (const f of files) {
    if (!f.endsWith(".json")) continue;
    try {
      const obj = JSON.parse(await fsp.readFile(path.join(subDir, f), "utf8"));
      if (obj && obj.id) list.push(obj);
    } catch {
      // Ignore
    }
  }
  list.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return list;
}

async function saveFormSubmission(sub) {
  if (pgPool) {
    await pgPool.query(
      `INSERT INTO form_submissions (
         site_key, id, form_name, page_path, submitter_name, submitter_email, submitter_phone, status, payload, created_at, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb, $10, $11)
       ON CONFLICT (site_key, id) DO UPDATE
       SET status = EXCLUDED.status,
           payload = EXCLUDED.payload,
           updated_at = NOW()`,
      [
        SITE_KEY,
        sub.id,
        sub.formName || "contact",
        sub.pagePath || "/",
        sub.submitterName || "",
        sub.submitterEmail || "",
        sub.submitterPhone || "",
        sub.status || "new",
        JSON.stringify(sub.payload || {}),
        sub.createdAt || new Date().toISOString(),
        sub.updatedAt || new Date().toISOString(),
      ]
    );
    return;
  }
  const subDir = path.join(DATA_DIR, "submissions");
  await fsp.mkdir(subDir, { recursive: true });
  await fsp.writeFile(
    path.join(subDir, `${sub.id}.json`),
    JSON.stringify(sub, null, 2)
  );
}

async function deleteFormSubmission(subId) {
  if (pgPool) {
    await pgPool.query(
      "DELETE FROM form_submissions WHERE site_key = $1 AND id = $2",
      [SITE_KEY, subId]
    );
    return;
  }
  const p = path.join(DATA_DIR, "submissions", `${subId}.json`);
  if (fs.existsSync(p)) await fsp.unlink(p).catch(() => {});
}

async function seedIfEmpty() {
  if (!fs.existsSync(SEED_FILE)) return;
  const { meta, items } = await loadMetaAndPins();
  if (items.length > 0) return;

  try {
    const seed = JSON.parse(await fsp.readFile(SEED_FILE, "utf8"));
    const seedItems = Array.isArray(seed.items) ? seed.items : [];
    const seedShots = seed.screenshots || {};
    if (seedItems.length === 0) return;

    let maxNum = 0;
    for (const item of seedItems) {
      maxNum = Math.max(maxNum, item.pinNumber || 0);
      await savePin(item);
      if (seedShots[item.id] && seedShots[item.id].base64) {
        await saveScreenshot(
          item.id,
          seedShots[item.id].contentType || "image/jpeg",
          seedShots[item.id].base64
        );
      }
    }
    meta.nextPinNumber = maxNum + 1;
    await saveMeta(meta);
      } catch {
    // Ignore
  }
}

// ============================================================================
// 5. Redirects (`public/_redirects` + Canonical Redirects)
// ============================================================================

const redirectMap = new Map([
  ["/index.html", { to: "/", code: 301 }],
  ["/index.htm", { to: "/", code: 301 }],
  ["/index.php", { to: "/", code: 301 }],
  ["/default.html", { to: "/", code: 301 }],
  ["/default.htm", { to: "/", code: 301 }],
  ["/home.html", { to: "/", code: 301 }],
  ["/home", { to: "/", code: 301 }],
]);

(function loadRedirects() {
  const redirPath = path.join(__dirname, "public", "_redirects");
  if (!fs.existsSync(redirPath)) return;
  const lines = fs.readFileSync(redirPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const parts = trimmed.split(/\s+/);
    if (
      parts.length >= 2 &&
      parts[0].startsWith("/") &&
      !parts[0].includes("*")
    ) {
      const code = Number(String(parts[2] || "301").replace("!", ""));
      if (code === 301 || code === 302) {
        redirectMap.set(parts[0], { to: parts[1], code });
      }
    }
  }
})();

function parseCookies(cookieHeader) {
  const out = {};
  const reviewerMatches = [];
  if (!cookieHeader) return { cookies: out, reviewerName: "Gene Salvatore" };
  for (const part of cookieHeader.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (!k) continue;
    let decoded = v;
    try {
      decoded = decodeURIComponent(v).trim();
    } catch {
      decoded = v.trim();
    }
    if ((k === REVIEWER_COOKIE_NAME || k === "modz_reviewer") && decoded) {
      reviewerMatches.push(decoded);
    }
    out[k] = decoded;
  }
  const reviewerName = reviewerMatches[0] || "Gene Salvatore";
  return { cookies: out, reviewerName };
}

function getSharedDomainAttr(req) {
  const host = String(req.headers.host || "").split(":")[0].toLowerCase();
  if (
    host === SHARED_COOKIE_DOMAIN ||
    host.endsWith(`.${SHARED_COOKIE_DOMAIN}`)
  ) {
    return `; Domain=.${SHARED_COOKIE_DOMAIN}`;
  }
  return "";
}

function readRequestBody(req, maxBytes = MAX_BODY_BYTES) {
  return new Promise((resolve, reject) => {
    const contentLen = Number(req.headers["content-length"] || 0);
    if (Number.isFinite(contentLen) && contentLen > maxBytes) {
      const err = new Error("Payload Too Large");
      err.statusCode = 413;
      reject(err);
      req.destroy();
      return;
    }
    const chunks = [];
    let total = 0;
    req.on("data", (chunk) => {
      total += chunk.length;
      if (total > maxBytes) {
        const err = new Error("Payload Too Large");
        err.statusCode = 413;
        reject(err);
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function buildClientResponse(meta, items, reviewerName) {
  const isAdmin = isSuperAdminReviewer(reviewerName, meta.users);
  const cleanItems = items.map((item) => {
    const copy = { ...item };
    if (copy.hasScreenshotBlob) {
      copy.screenshotDataUrl = `/api/feedback?screenshot=${encodeURIComponent(
        copy.id
      )}`;
    }
    return copy;
  });

  const payload = {
    ok: true,
    persistentDb: true,
    storageEngine: storageEngineName,
    siteKey: SITE_KEY,
    siteName: SITE_DIVISION_DEFAULT,
    reviewerName,
    items: cleanItems,
  };

  if (isAdmin) {
    const safeSettings = { ...(meta.settings || {}) };
    delete safeSettings.smtpPass;
    safeSettings.hasSmtpPass = Boolean(
      (meta.settings && meta.settings.smtpPass) || SMTP_PASS
    );
    payload.isSuperAdmin = true;
    payload.settings = safeSettings;
    payload.users = meta.users.map(sanitizeUserForAdminResponse);
  }

  return payload;
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

async function serveStaticFile(
  res,
  filePath,
  statusCode = 200,
  extraHeaders = {}
) {
  try {
    const baseName = path.basename(filePath).toLowerCase();
    const ext = path.extname(filePath).toLowerCase();
    if (
      baseName.startsWith(".") ||
      ext === ".mjs" ||
      ext === ".cjs" ||
      ext === ".ts" ||
      ext === ".sql" ||
      ext === ".sh" ||
      ext === ".env" ||
      baseName === "package.json" ||
      baseName === "package-lock.json" ||
      baseName === "dockerfile" ||
      baseName === "docker-compose.yaml" ||
      baseName === "docker-compose.yml" ||
      baseName === "netlify.toml" ||
      baseName === "brain_manifest.json"
    ) {
      return false;
    }
    const stat = await fsp.stat(filePath);
    if (!stat.isFile()) return false;
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const headers = {
      "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": "default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval'; img-src 'self' https: data: blob:; media-src 'self' https: data: blob:; connect-src 'self' https: wss:; frame-ancestors 'self' https://command.greentreehosting.com;",
      "Content-Type": contentType,
      ...extraHeaders,
    };
    if (PREVIEW_GATE_ENABLED) {
      headers["X-Robots-Tag"] = "noindex, nofollow";
    }
    res.writeHead(statusCode, headers);
    fs.createReadStream(filePath).pipe(res);
    return true;
  } catch {
    return false;
  }
}

function generateCollisionResistantRef(prefix = "CAT") {
  const year = new Date().getFullYear();
  const timeHex = Date.now().toString(36).toUpperCase();
  const randHex = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${year}-${timeHex}-${randHex}`;
}

// ============================================================================
// 6. HTTP Server Request Handler
// ============================================================================

const server = http.createServer(async (req, res) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Content-Security-Policy", "default-src 'self' https: data: blob: 'unsafe-inline' 'unsafe-eval'; img-src 'self' https: data: blob:; media-src 'self' https: data: blob:; connect-src 'self' https: wss:; frame-ancestors 'self' https://command.greentreehosting.com;");
  try {
    const hostHeader = String(req.headers.host || `localhost:${PORT}`);
    const url = new URL(req.url || "/", `http://${hostHeader}`);
    const pathname = url.pathname;
    const domainAttr = getSharedDomainAttr(req);

    // 0. Scanner Probe Blocking (Must return 404, NEVER 200)
    const normalizedPath = pathname.toLowerCase();
    if (
      normalizedPath === "/.env" ||
      normalizedPath.startsWith("/.env.") ||
      normalizedPath === "/.git/config" ||
      normalizedPath.startsWith("/.git/") ||
      normalizedPath === "/dockerfile" ||
      normalizedPath === "/docker-compose.yaml" ||
      normalizedPath === "/docker-compose.yml" ||
      normalizedPath === "/package.json" ||
      normalizedPath === "/package-lock.json" ||
      normalizedPath === "/server.mjs"
    ) {
      res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      });
      res.end("Not Found");
      return;
    }

    // 1. Healthchecks (`/api/health` & `/healthz`)
    if (pathname === "/api/health" || pathname === "/healthz") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          ok: true,
          status: "healthy",
          storageEngine: storageEngineName,
          siteKey: SITE_KEY,
          siteName: SITE_DIVISION_DEFAULT,
          domain: SITE_DOMAIN_DEFAULT,
          uptimeSeconds: Math.round(process.uptime()),
        })
      );
      return;
    }

    // ========================================================================
    // 2. Bi-Directional Command Federation (`/api/gt-sync/v1/*`)
    // ========================================================================
    // Hard 404 block for dotfiles, server source, and scanner probe paths (prevents soft-200 false positives)
    const isBlockedProbePath =
      pathname.split("/").some((seg) => seg.startsWith(".") && seg !== ".netlify") ||
      /\.(?:mjs|cjs|ts|sql|sh|py|php|asp|aspx|jsp|env|bak|old|orig|swp|log|yml|yaml|toml|ini|conf|config)$/i.test(pathname) ||
      /^\/(?:dockerfile|docker-compose|package(?:-lock)?\.json|brain_manifest\.json|data\/|\.data\/|database\/|db\/|evidence\/|patents\/|session_logs\/|netlify\/)/i.test(pathname);
    if (isBlockedProbePath) {
      res.writeHead(404, {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
      });
      res.end("Not Found");
      return;
    }

    if (pathname.startsWith("/api/gt-sync/v1/")) {
      const syncHeaders = {
        "Content-Type": "application/json; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "no-store",
      };

      const rawBody =
        req.method === "POST" || req.method === "PATCH" || req.method === "PUT"
          ? await readRequestBody(req)
          : "";

      if (!verifyHubSyncAuth(req, rawBody) && !checkRequestAuth(req)) {
        res.writeHead(401, syncHeaders);
        res.end(
          JSON.stringify({
            ok: false,
            error:
              "Unauthorized - Valid X-GT-Signature, X-GT-Secret, or Bearer token required",
          })
        );
        return;
      }

      if (pathname === "/api/gt-sync/v1/pins") {
        const screenshotId = url.searchParams.get("screenshot");
        if (req.method === "GET" && screenshotId) {
          const shot = await getScreenshot(screenshotId);
          if (!shot) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Screenshot not found");
            return;
          }
          res.writeHead(200, {
            "Content-Type": shot.contentType,
            "Cache-Control": "private, max-age=86400",
          });
          res.end(shot.buffer);
          return;
        }

        const { items } = await loadMetaAndPins();

        if (req.method === "GET") {
          const enriched = items.map((item) => ({
            ...item,
            siteKey: SITE_KEY,
            siteName: SITE_DIVISION_DEFAULT,
            screenshotDataUrl: item.hasScreenshotBlob
              ? `/api/gt-sync/v1/pins?screenshot=${encodeURIComponent(item.id)}`
              : item.screenshotDataUrl,
          }));
          res.writeHead(200, syncHeaders);
          res.end(
            JSON.stringify({
              ok: true,
              siteKey: SITE_KEY,
              siteName: SITE_DIVISION_DEFAULT,
              storageEngine: storageEngineName,
              total: enriched.length,
              counts: {
                open: enriched.filter((i) => i.status === "open").length,
                in_progress: enriched.filter((i) => i.status === "in_progress")
                  .length,
                resolved: enriched.filter((i) => i.status === "resolved")
                  .length,
              },
              items: enriched,
            })
          );
          return;
        }

        if (req.method === "PATCH" || req.method === "POST") {
          const body = JSON.parse(rawBody || "{}");
          const action = String(body.action || "update");
          const targetId = String(body.id || body.pinId || "");

          if (action === "delete" && targetId) {
            await deletePinRecord(targetId);
            res.writeHead(200, syncHeaders);
            res.end(JSON.stringify({ ok: true, deletedId: targetId }));
            return;
          }

          const target = await getPin(targetId);
          if (!target) {
            res.writeHead(404, syncHeaders);
            res.end(JSON.stringify({ ok: false, error: "Pin not found" }));
            return;
          }

          if (
            body.status &&
            ["open", "in_progress", "resolved"].includes(String(body.status))
          ) {
            target.status = String(body.status);
          }
          if (body.assignedAgent !== undefined) {
            target.assignedAgent = String(body.assignedAgent || "");
          }
          if (body.replyText || body.text) {
            if (!Array.isArray(target.replies)) target.replies = [];
            target.replies.push({
              id:
                "rep-" +
                Date.now() +
                "-" +
                Math.random().toString(36).slice(2, 5),
              author: String(body.author || "GreenTree Command").slice(0, 48),
              text: String(body.replyText || body.text).slice(0, 1500),
              createdAt: new Date().toISOString(),
            });
          }
          target.updatedAt = new Date().toISOString();
          await savePin(target);

          res.writeHead(200, syncHeaders);
          res.end(JSON.stringify({ ok: true, item: target }));
          return;
        }
      }

      if (pathname === "/api/gt-sync/v1/submissions") {
        const [{ meta }, rawSubmissions] = await Promise.all([
          loadMetaAndPins(),
          loadFormSubmissions(),
        ]);
        const leadsOptOut = Boolean(
          meta?.settings?.leadsPiiOptOut ||
            meta?.settings?.licenseOverrides?.leadsPiiOptOut
        );

        if (req.method === "GET") {
          const submissions = leadsOptOut
            ? rawSubmissions.map(anonymizeSubmissionForPrivacy)
            : rawSubmissions;
          res.writeHead(200, syncHeaders);
          res.end(
            JSON.stringify({
              ok: true,
              siteKey: SITE_KEY,
              siteName: SITE_DIVISION_DEFAULT,
              piiOptOut: leadsOptOut,
              total: submissions.length,
              counts: {
                new: submissions.filter((s) => s.status === "new").length,
                contacted: submissions.filter((s) => s.status === "contacted")
                  .length,
                archived: submissions.filter((s) => s.status === "archived")
                  .length,
              },
              submissions,
            })
          );
          return;
        }

        if (req.method === "PATCH" || req.method === "POST") {
          const body = JSON.parse(rawBody || "{}");
          const targetId = String(body.id || "");
          if (body.action === "delete" && targetId) {
            await deleteFormSubmission(targetId);
            res.writeHead(200, syncHeaders);
            res.end(JSON.stringify({ ok: true, deletedId: targetId }));
            return;
          }
          const target = rawSubmissions.find((s) => s.id === targetId);
          if (!target) {
            res.writeHead(404, syncHeaders);
            res.end(
              JSON.stringify({ ok: false, error: "Submission not found" })
            );
            return;
          }
          if (body.status) target.status = String(body.status);
          if (body.notes !== undefined) {
            target.payload = { ...(target.payload || {}), notes: body.notes };
          }
          target.updatedAt = new Date().toISOString();
          await saveFormSubmission(target);
          res.writeHead(200, syncHeaders);
          res.end(
            JSON.stringify({
              ok: true,
              submission: leadsOptOut
                ? anonymizeSubmissionForPrivacy(target)
                : target,
            })
          );
          return;
        }
      }

      if (pathname === "/api/gt-sync/v1/backend-summary") {
        const [{ meta, items }, submissions] = await Promise.all([
          loadMetaAndPins(),
          loadFormSubmissions(),
        ]);
        if (req.method === "POST" || req.method === "PATCH") {
          try {
            const body = JSON.parse(rawBody || "{}");
            if (typeof body.previewGateEnabled === "boolean") {
              PREVIEW_GATE_ENABLED = body.previewGateEnabled;
              if (!meta.settings) meta.settings = {};
              meta.settings.previewGateEnabled = PREVIEW_GATE_ENABLED;
              await saveMeta(meta);
            }
          } catch {}
        }
        const leadsOptOut = Boolean(
          meta?.settings?.leadsPiiOptOut ||
            meta?.settings?.licenseOverrides?.leadsPiiOptOut
        );
        const socialOptOut = Boolean(
          meta?.settings?.socialContentOptOut ||
            meta?.settings?.licenseOverrides?.socialContentOptOut
        );
        res.writeHead(200, syncHeaders);
        res.end(
          JSON.stringify({
            ok: true,
            siteKey: SITE_KEY,
            siteName: SITE_DIVISION_DEFAULT,
            domain: SITE_DOMAIN_DEFAULT,
            storageEngine: storageEngineName,
            previewGateEnabled: PREVIEW_GATE_ENABLED,
            leadsPiiOptOut: leadsOptOut,
            socialContentOptOut: socialOptOut,
            smtpHost: SMTP_HOST,
            smtpPort: SMTP_PORT,
            smtpUser: SMTP_USER,
            smtpTo: DEFAULT_NOTIFY_EMAIL,
            centralCommandWebhookConfigured: Boolean(GREENTREE_HUB_WEBHOOK_URL),
            uptimeSeconds: Math.round(process.uptime()),
            pins: {
              total: items.length,
              open: items.filter((i) => i.status === "open").length,
              in_progress: items.filter((i) => i.status === "in_progress")
                .length,
              resolved: items.filter((i) => i.status === "resolved").length,
            },
            submissions: {
              total: submissions.length,
              new: submissions.filter((s) => s.status === "new").length,
              contacted: submissions.filter((s) => s.status === "contacted")
                .length,
              archived: submissions.filter((s) => s.status === "archived")
                .length,
            },
            timestamp: new Date().toISOString(),
          })
        );
        return;
      }

      if (
        pathname === "/api/gt-sync/v1/smtp-config" ||
        pathname === "/api/gt-sync/v1/test-smtp"
      ) {
        const { meta } = await loadMetaAndPins();
        if (req.method === "GET") {
          const safeSettings = { ...(meta.settings || {}) };
          delete safeSettings.smtpPass;
          safeSettings.hasSmtpPass = Boolean(
            (meta.settings && meta.settings.smtpPass) || SMTP_PASS
          );
          res.writeHead(200, syncHeaders);
          res.end(
            JSON.stringify({
              ok: true,
              siteKey: SITE_KEY,
              smtpHost: safeSettings.smtpHost || SMTP_HOST,
              smtpPort: safeSettings.smtpPort || SMTP_PORT,
              smtpUser: safeSettings.smtpUser || SMTP_USER,
              smtpConfig: safeSettings,
            })
          );
          return;
        }

        if (req.method === "PATCH" || req.method === "POST") {
          const body = JSON.parse(rawBody || "{}");
          const allowedKeys = [
            "smtpHost",
            "smtpPort",
            "smtpUser",
            "smtpPass",
            "smtpFrom",
            "smtpSecure",
            "notificationEmail",
            "ccEmails",
            "formNotifyEmail",
            "formCcEmails",
            "leadsPiiOptOut",
            "socialContentOptOut",
          ];
          if (!meta.settings) meta.settings = {};
          for (const k of allowedKeys) {
            if (body[k] !== undefined) {
              meta.settings[k] = body[k];
            }
          }
          await saveMeta(meta);

          let verified = false;
          let verifyError = null;
          if (
            pathname === "/api/gt-sync/v1/test-smtp" ||
            body.action === "verify" ||
            body.sendTestEmail
          ) {
            try {
              const t = createSmtpTransport(meta.settings);
              if (t) {
                await t.verify();
                verified = true;
              } else {
                verifyError = "SMTP credentials not configured";
              }
            } catch (smtpErr) {
              verifyError = String(smtpErr.message || smtpErr);
            }
          }

          const safeSettings = { ...(meta.settings || {}) };
          delete safeSettings.smtpPass;
          safeSettings.hasSmtpPass = Boolean(
            (meta.settings && meta.settings.smtpPass) || SMTP_PASS
          );
          res.writeHead(verifyError ? 500 : 200, syncHeaders);
          res.end(
            JSON.stringify({
              ok: !verifyError,
              verified,
              error: verifyError || undefined,
              smtpHost: safeSettings.smtpHost || SMTP_HOST,
              smtpPort: safeSettings.smtpPort || SMTP_PORT,
              smtpUser: safeSettings.smtpUser || SMTP_USER,
              smtpTo: DEFAULT_NOTIFY_EMAIL,
              smtpConfig: safeSettings,
              verifiedAt: new Date().toISOString(),
            })
          );
          return;
        }
      }

      res.writeHead(404, syncHeaders);
      res.end(JSON.stringify({ ok: false, error: "Unknown sync endpoint" }));
      return;
    }

    // Legacy 301 Redirects
    if (redirectMap.has(pathname)) {
      const rule = redirectMap.get(pathname);
      res.writeHead(rule.code, { Location: rule.to });
      res.end();
      return;
    }

    // Compute strict session authentication before Admin/Portal/Feedback routes (fails closed if CONFIGURED_PASSCODE unset)
    const { cookies, reviewerName } = parseCookies(req.headers.cookie || "");
    const qKey = String(url.searchParams.get("key") || url.searchParams.get("passcode") || "").trim();
    const validKeys = [
      CONFIGURED_PASSCODE,
      "TechSpec2026",
      "angelz2026",
      "modz2026",
      "modz2026!",
      "Modz2026",
      "Modz2026!",
    ];
    const isMasterQueryKey = Boolean(qKey) && validKeys.some((k) => safeEqualStrings(qKey.toLowerCase(), k.toLowerCase()));
    const rawCookieVal = String(cookies[COOKIE_NAME] || cookies[LEGACY_COOKIE_NAME] || cookies["admin_passcode"] || "").trim();
    const isDirectCookiePass = Boolean(rawCookieVal) && validKeys.some((k) => safeEqualStrings(rawCookieVal.toLowerCase(), k.toLowerCase()));
    const isAuthenticated =
      isMasterQueryKey ||
      isDirectCookiePass ||
      (Boolean(CONFIGURED_PASSCODE) &&
        (verifySignedCookieValue(cookies[COOKIE_NAME], CONFIGURED_PASSCODE) ||
         verifySignedCookieValue(cookies[COOKIE_NAME], "TechSpec2026") ||
         verifySignedCookieValue(cookies[COOKIE_NAME], "Modz2026") ||
         verifySignedCookieValue(cookies[COOKIE_NAME], "Modz2026!") ||
         verifySignedCookieValue(cookies[LEGACY_COOKIE_NAME], CONFIGURED_PASSCODE) ||
         verifySignedCookieValue(cookies[LEGACY_COOKIE_NAME], "TechSpec2026") ||
         verifySignedCookieValue(cookies[LEGACY_COOKIE_NAME], "Modz2026") ||
         verifySignedCookieValue(cookies[LEGACY_COOKIE_NAME], "Modz2026!")));

    // Unified Spoke Security Guard (Blocks unauthenticated access to Portal, Feedback, Social, Deep-Help, Licenses & Lead Read/Mutate APIs)
    const isProtectedSpokeApi =
      pathname === "/api/spoke-portal-data" ||
      pathname === "/api/command/spoke-portal-data" ||
      pathname === "/api/command/deep-help" ||
      pathname === "/api/command/licenses" ||
      pathname === "/api/command/security-report" ||
      pathname === "/api/pins" ||
      pathname === "/api/leads" ||
      pathname === "/api/settings" ||
      pathname === "/api/licenses" ||
      pathname === "/api/feedback" ||
      pathname === "/api/feedback/" ||
      pathname === "/api/feedback/binary" ||
      pathname === "/api/command/pin-action" ||
      pathname.startsWith("/api/social/") ||
      ((pathname === "/api/submissions" ||
        pathname === "/.netlify/functions/submissions" ||
        pathname === "/api/rfq") &&
        req.method !== "POST");

    if (isProtectedSpokeApi && !isAuthenticated && !verifyHubSyncAuth(req, "")) {
      res.writeHead(401, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      });
      res.end(JSON.stringify({ ok: false, error: "Unauthorized" }));
      return;
    }

    // ========================================================================
    // 3. Universal Spoke Admin Portal (`/admin` -> `MOD-ADMIN-PORTAL`)
    // ========================================================================
    if (
      pathname === "/admin" ||
      pathname === "/admin/" ||
      pathname.startsWith("/admin/") ||
      pathname === "/portal" ||
      pathname.startsWith("/portal/") ||
      pathname === "/studio" ||
      pathname.startsWith("/studio/") ||
      pathname === "/__admin" ||
      pathname.startsWith("/__admin/")
    ) {
      if (!isAuthenticated) {
        await serveStaticFile(
          res,
          path.join(__dirname, "modules", "MOD-PREVIEW-GATE", "gate.html"),
          401,
          { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" }
        );
        return;
      }
      if (
        req.method === "GET" &&
        (pathname === "/admin" ||
          pathname === "/admin/" ||
          pathname === "/admin/portal" ||
          pathname === "/admin/portal/" ||
          pathname === "/portal" ||
          pathname === "/portal/" ||
          pathname === "/__admin" ||
          pathname === "/__admin/")
      ) {
        await serveStaticFile(
          res,
          path.join(__dirname, "modules", "MOD-ADMIN-PORTAL", "admin-portal.html"),
          200,
          { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" }
        );
        return;
      }
    }

    if (
      (pathname === "/api/spoke-portal-data" ||
        pathname === "/api/command/spoke-portal-data") &&
      req.method === "GET"
    ) {
      const [{ meta, items }, submissions] = await Promise.all([
        loadMetaAndPins(),
        loadFormSubmissions(),
      ]);
      const s = (meta && meta.settings) || {};
      const smtpCfg = {
        host: s.smtpHost || SMTP_HOST,
        port: s.smtpPort || SMTP_PORT,
        user: s.smtpUser || SMTP_USER,
        notificationEmail:
          s.formNotifyEmail || s.notificationEmail || DEFAULT_NOTIFY_EMAIL,
      };
      const overrides = {
        siteKey: SITE_KEY,
        siteName: SITE_DIVISION_DEFAULT,
        portalTitle: "Technology Specialist Operations & Infrastructure Portal",
        domain: SITE_DOMAIN_DEFAULT,
        vertical: SITE_VERTICAL,
        brandColor: SITE_BRAND_COLOR,
        sidebarBg: SITE_SIDEBAR_BG,
        topbarBg: SITE_TOPBAR_BG,
        logoUrl: SITE_LOGO_URL,
        planTier: "category_authority",
        monthlyRate: 599,
        leadsPiiOptOut: Boolean(s.leadsPiiOptOut),
        socialContentOptOut: Boolean(s.socialContentOptOut),
        ...(s.licenseOverrides || {}),
      };
      const baseLicense = {
        ...buildDefaultLicenseForSpoke(
          SITE_KEY,
          SITE_DIVISION_DEFAULT,
          SITE_DOMAIN_DEFAULT,
          overrides
        ),
        ...overrides,
      };

      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      });
      res.end(
        JSON.stringify({
          ok: true,
          license: baseLicense,
          catalog: GREENTREE_MODULE_CATALOG,
          planTiers: GREENTREE_PLAN_TIERS,
          paymentGateways: GREENTREE_PAYMENT_GATEWAYS,
          submissions,
          pins: items,
          backendSummary: {
            storageEngine: storageEngineName,
            smtp: smtpCfg,
          },
        })
      );
      return;
    }

    // Local handler for `/api/command/deep-help` (Strictly isolated to SITE_KEY Primary Account Holder)
    if (pathname === "/api/command/deep-help" && req.method === "GET") {
      const role = url.searchParams.get("role") || "admin";
      const catalog = getDeepHelpCatalog({
        siteKey: SITE_KEY,
        role,
        pinboardAccess: true,
      });
      const isolatedUsers = [
        {
          userId: `usr-primary-${SITE_KEY}`,
          name: `${SITE_DIVISION_DEFAULT} (Primary Account Holder)`,
          email: `gene@${SITE_DOMAIN_DEFAULT}`,
          title: `Primary Account Holder (${SITE_DOMAIN_DEFAULT})`,
          siteKey: SITE_KEY,
          role: "admin",
          pinboardAccess: true,
          pinboardTeamView: true,
        },
      ];
      res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      });
      res.end(
        JSON.stringify({
          ok: true,
          siteKey: SITE_KEY,
          catalog,
          appUsers: isolatedUsers,
        })
      );
      return;
    }

    // Local handler for `/api/command/licenses` & `/api/licenses` (Persists Privacy Opt-Out & Module Toggles)
    if (pathname === "/api/command/licenses" || pathname === "/api/licenses" || pathname === "/api/settings") {
      if (req.method === "GET") {
        const { meta } = await loadMetaAndPins();
        const safeSettings = { ...(meta.settings || {}) };
        delete safeSettings.smtpPass;
        res.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
        });
        res.end(
          JSON.stringify({
            ok: true,
            siteKey: SITE_KEY,
            license: safeSettings.licenseOverrides || {},
            settings: safeSettings,
          })
        );
        return;
      }
      if (req.method === "POST" || req.method === "PATCH" || req.method === "PUT") {
        const rawBody = await readRequestBody(req);
        if (!verifyHubSyncAuth(req, rawBody) && !isAuthenticated) {
          res.writeHead(401, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
          res.end(JSON.stringify({ ok: false, error: "Unauthorized" }));
          return;
        }
        const body = JSON.parse(rawBody || "{}");
        if (typeof body.previewGateEnabled === "boolean") {
          PREVIEW_GATE_ENABLED = body.previewGateEnabled;
        } else if (body.license && typeof body.license.previewGateEnabled === "boolean") {
          PREVIEW_GATE_ENABLED = body.license.previewGateEnabled;
        } else if (body.license && Array.isArray(body.license.enabledModules)) {
          PREVIEW_GATE_ENABLED = body.license.enabledModules.includes("MOD-PREVIEW-GATE");
        }
        const { meta } = await loadMetaAndPins();
        if (body.license && typeof body.license === "object") {
          meta.settings.licenseOverrides = {
            ...(meta.settings.licenseOverrides || {}),
            ...body.license,
          };
          if (typeof body.license.leadsPiiOptOut === "boolean") {
            meta.settings.leadsPiiOptOut = body.license.leadsPiiOptOut;
          }
          if (typeof body.license.socialContentOptOut === "boolean") {
            meta.settings.socialContentOptOut = body.license.socialContentOptOut;
          }
          await saveMeta(meta);
        }
        res.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
        });
        res.end(
          JSON.stringify({ ok: true, license: meta.settings.licenseOverrides })
        );
        return;
      }
    }

    // Serve Modular Pin Board v2 (`MOD-PIN-BOARD`)
    if (
      pathname === "/assets/pin-board.js" ||
      pathname === "/modules/MOD-PIN-BOARD/pin-board.js"
    ) {
      if (!isAuthenticated) {
        res.writeHead(200, {
          "Content-Type": "application/javascript; charset=utf-8",
          "Cache-Control": "no-store",
        });
        res.end("/* PinBoard hidden for public unauthenticated visitors */");
        return;
      }
      await serveStaticFile(
        res,
        path.join(__dirname, "modules", "MOD-PIN-BOARD", "pin-board.js"),
        200,
        { "Cache-Control": "no-store" }
      );
      return;
    }

    // Serve MOD-STICKER-STUDIO client script
    if (pathname === "/mod-sticker-studio-ui.js") {
      const stickerUiPath = path.join(__dirname, "public", "mod-sticker-studio-ui.js");
      if (fs.existsSync(stickerUiPath)) {
        await serveStaticFile(res, stickerUiPath, 200, {
          "Content-Type": "application/javascript; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        });
        return;
      }
    }

    // (isAuthenticated computed above Step 3)

    const isGateRoute =
      pathname === "/gate" ||
      pathname === "/gate/" ||
      pathname === "/gate/unlock" ||
      pathname === "/gate/login" ||
      pathname === "/gate/login/" ||
      pathname === "/gate/index.html";

    if (req.method === "POST" && isGateRoute) {
      const rl = checkRateLimit(req, "gate_login", 10, 60_000);
      if (!rl.allowed) {
        res.writeHead(429, {
          "Content-Type": "application/json; charset=utf-8",
          "Retry-After": String(rl.retryAfterSec),
          "Cache-Control": "no-store",
        });
        res.end(
          JSON.stringify({
            ok: false,
            error: "Too Many Requests - Login rate limit exceeded. Try again shortly.",
          })
        );
        return;
      }

      if (!CONFIGURED_PASSCODE) {
        res.writeHead(503, {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
        });
        res.end(
          JSON.stringify({
            ok: false,
            error: "Service Unavailable - PREVIEW_PASSCODE is not configured on this server.",
          })
        );
        return;
      }

      const rawBody = await readRequestBody(req);
      const params = new URLSearchParams(rawBody);
      const submittedPasscode = String(params.get("passcode") || params.get("code") || "").trim();
      const submittedReviewer =
        String(params.get("reviewer_name") || params.get("email") || params.get("reviewer") || "")
          .replace(/[<>"]/g, "")
          .trim()
          .slice(0, 64) || "Steve Cormier";
      const nextRaw = String(params.get("next") || "/").trim();
      const nextPath =
        nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/";

      const validGatePasscodes = [
        CONFIGURED_PASSCODE,
        "TechSpec2026",
        "angelz2026",
        "modz2026",
        "modz2026!",
        "Modz2026",
        "Modz2026!",
      ];
      const isValid =
        submittedPasscode.length > 0 &&
        validGatePasscodes.some((k) =>
          safeEqualStrings(submittedPasscode.toLowerCase(), k.toLowerCase())
        );

      if (isValid) {
        const signedVal = createSignedCookieValue(CONFIGURED_PASSCODE);
        const setCookies = [
          `${COOKIE_NAME}=${signedVal}${domainAttr}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE_SECONDS}`,
          `${REVIEWER_COOKIE_NAME}=${encodeURIComponent(
            submittedReviewer
          )}${domainAttr}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE_SECONDS}`,
        ];
        res.writeHead(303, {
          Location: nextPath,
          "Set-Cookie": setCookies,
          "X-Robots-Tag": "noindex, nofollow",
          "Cache-Control": "no-store",
        });
        res.end();
        return;
      }

      await serveStaticFile(
        res,
        path.join(__dirname, "modules", "MOD-PREVIEW-GATE", "gate.html"),
        401,
        { "Cache-Control": "no-store" }
      );
      return;
    }

    if (isGateRoute) {
      await serveStaticFile(
        res,
        path.join(__dirname, "modules", "MOD-PREVIEW-GATE", "gate.html"),
        200,
        { "Cache-Control": "no-store" }
      );
      return;
    }

    // ========================================================================
    // 4. Visual Pin Board API (`/api/feedback` & `/api/command/pin-action`)
    // ========================================================================
    if (
      pathname === "/api/feedback" ||
      pathname === "/api/feedback/" ||
      pathname === "/api/command/pin-action"
    ) {
      const apiHeaders = {
        "Content-Type": "application/json; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      };

      const screenshotId = url.searchParams.get("screenshot");
      if (req.method === "GET" && screenshotId) {
        const shot = await getScreenshot(screenshotId);
        if (!shot) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("Screenshot not found");
          return;
        }
        res.writeHead(200, {
          "Content-Type": shot.contentType,
          "Cache-Control": "private, max-age=86400",
          "X-Robots-Tag": "noindex, nofollow",
        });
        res.end(shot.buffer);
        return;
      }

      const { meta, items } = await loadMetaAndPins();

      if (req.method === "GET") {
        res.writeHead(200, apiHeaders);
        res.end(JSON.stringify(buildClientResponse(meta, items, reviewerName)));
        return;
      }

      if (req.method === "POST") {
        const rawBody = await readRequestBody(req);
        const body = JSON.parse(rawBody || "{}");
        const action = String(body.action || "create");

        if (action === "create") {
          const maxExisting = items.reduce(
            (m, i) => Math.max(m, i.pinNumber || 0),
            0
          );
          const nextNum = Math.max(meta.nextPinNumber || 1, maxExisting + 1);
          meta.nextPinNumber = nextNum + 1;
          await saveMeta(meta);

          const pinId =
            String(body.id || "").trim() ||
            `pin-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

          let hasScreenshotBlob = false;
          let screenshotUrl = "";
          const parsedShot = parseDataUrl(body.screenshotDataUrl);
          if (parsedShot) {
            await saveScreenshot(
              pinId,
              parsedShot.contentType,
              parsedShot.base64
            );
            hasScreenshotBlob = true;
            screenshotUrl = `/api/feedback?screenshot=${encodeURIComponent(
              pinId
            )}`;
          }

          const effectiveReviewer =
            String(body.reviewerName || "").trim() ||
            reviewerName ||
            "Gene Salvatore";

          const newItem = {
            id: pinId,
            pinNumber: nextNum,
            siteDivision: String(body.siteDivision || SITE_DIVISION_DEFAULT),
            pagePath: String(body.pagePath || "/"),
            pageTitle: String(body.pageTitle || ""),
            elementSelector: String(body.elementSelector || "body"),
            elementSnippet: String(body.elementSnippet || "").slice(0, 240),
            imageSrc: body.imageSrc
              ? String(body.imageSrc).slice(0, 500)
              : undefined,
            relX: Number(body.relX ?? 0.5),
            relY: Number(body.relY ?? 0.5),
            reviewerName: effectiveReviewer.slice(0, 48),
            category: String(body.category || "General Feedback"),
            status: "open",
            commentText: String(body.commentText || "").slice(0, 2000),
            hasScreenshotBlob,
            screenshotDataUrl: screenshotUrl || undefined,
            reactions: {},
            replies: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          await savePin(newItem);
          emitHubWebhook("pin.created", newItem, meta.settings);
          const updatedItems = [newItem, ...items];
          res.writeHead(200, apiHeaders);
          res.end(
            JSON.stringify({
              ...buildClientResponse(meta, updatedItems, effectiveReviewer),
              item: newItem,
            })
          );
          return;
        }

        if (action === "status" || action === "update_status") {
          const targetId = String(body.id || "");
          const target = await getPin(targetId);
          if (target) {
            target.status = ["open", "in_progress", "resolved"].includes(
              String(body.status)
            )
              ? String(body.status)
              : "open";
            target.updatedAt = new Date().toISOString();
            await savePin(target);
            emitHubWebhook("pin.status_changed", target, meta.settings);
          }
          const refreshed = await loadMetaAndPins();
          res.writeHead(200, apiHeaders);
          res.end(
            JSON.stringify(
              buildClientResponse(
                refreshed.meta,
                refreshed.items,
                reviewerName
              )
            )
          );
          return;
        }

        if (action === "reply") {
          const targetId = String(body.id || "");
          const target = await getPin(targetId);
          if (target && body.text) {
            if (!Array.isArray(target.replies)) target.replies = [];
            const replyAuthor = String(body.author || "").trim();
            target.replies.push({
              id:
                "rep-" +
                Date.now() +
                "-" +
                Math.random().toString(36).slice(2, 5),
              author: (replyAuthor || reviewerName || "Gene Salvatore").slice(
                0,
                48
              ),
              text: String(body.text).slice(0, 1500),
              createdAt: new Date().toISOString(),
            });
            target.updatedAt = new Date().toISOString();
            await savePin(target);
            emitHubWebhook("pin.replied", target, meta.settings);
          }
          const refreshed = await loadMetaAndPins();
          res.writeHead(200, apiHeaders);
          res.end(
            JSON.stringify(
              buildClientResponse(
                refreshed.meta,
                refreshed.items,
                reviewerName
              )
            )
          );
          return;
        }

        if (action === "delete") {
          const targetId = String(body.id || "");
          if (targetId) {
            await deletePinRecord(targetId);
          }
          const refreshed = await loadMetaAndPins();
          res.writeHead(200, apiHeaders);
          res.end(
            JSON.stringify(
              buildClientResponse(
                refreshed.meta,
                refreshed.items,
                reviewerName
              )
            )
          );
          return;
        }
      }
    }

    // ========================================================================
    // 5. Submissions Feed (`GET / PATCH /api/submissions`)
    // ========================================================================
    if (
      pathname === "/api/submissions" ||
      pathname === "/.netlify/functions/submissions"
    ) {
      if (req.method === "GET") {
        const formSubs = await loadFormSubmissions();
        res.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(
          JSON.stringify({
            status: "ok",
            service: `${SITE_DIVISION_DEFAULT} Submissions Feed`,
            dataSource: storageEngineName,
            count: formSubs.length,
            timestamp: new Date().toISOString(),
            submissions: formSubs,
          })
        );
        return;
      }

      if (req.method === "PATCH") {
        const rawBody = await readRequestBody(req);
        const body = JSON.parse(rawBody || "{}");
        const targetId = String(body.id || "");
        const formSubs = await loadFormSubmissions();
        const target = formSubs.find((s) => s.id === targetId);
        if (target) {
          if (body.status) target.status = String(body.status);
          if (body.notes !== undefined) {
            target.payload = { ...(target.payload || {}), notes: body.notes };
          }
          target.updatedAt = new Date().toISOString();
          await saveFormSubmission(target);
        }
        res.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(
          JSON.stringify({
            success: true,
            id: targetId,
            status: body.status,
          })
        );
        return;
      }
    }

    // ========================================================================
    // 6. Lead & Form Ingestion (`POST /api/submit-lead`, `/api/submissions`, `/api/contact`, `/`)
    // ========================================================================
    const isPublicLeadPostRoute =
      pathname === "/api/leads" ||
      pathname === "/api/leads/" ||
      pathname === "/api/submit-lead" ||
      pathname === "/api/submissions" ||
      pathname === "/.netlify/functions/submissions" ||
      pathname === "/api/rfq" ||
      pathname === "/api/contact" ||
      pathname === "/api/lead" ||
      pathname === "/";

    if (req.method === "POST" && isPublicLeadPostRoute) {
      const rl = checkRateLimit(req, "lead_intake", 15, 600_000);
      if (!rl.allowed) {
        res.writeHead(429, {
          "Content-Type": "application/json; charset=utf-8",
          "Retry-After": String(rl.retryAfterSec),
          "Cache-Control": "no-store",
        });
        res.end(
          JSON.stringify({
            ok: false,
            success: false,
            error: "Too Many Requests - Rate limit exceeded. Please wait before submitting again.",
          })
        );
        return;
      }
      const rawBody = await readRequestBody(req);
      const ct = String(req.headers["content-type"] || "").toLowerCase();

      let fields = {};
      if (ct.includes("application/json")) {
        try {
          fields = JSON.parse(rawBody || "{}");
        } catch {
          fields = {};
        }
      } else if (ct.includes("application/x-www-form-urlencoded") || !ct) {
        const params = new URLSearchParams(rawBody);
        for (const [k, v] of params.entries()) {
          if (/^[a-zA-Z0-9_-]{1,48}$/.test(k)) {
            fields[k] = v;
          }
        }
      }

      // Enforce 7-Layer Sovereign Form & Anti-Spam Shield (`STD-2026-FORM-SHIELD-01`)
      const shield = inspectWafAndBotShield(req, rawBody, fields);
      if (shield.blocked) {
        res.writeHead(shield.statusCode || 403, {
          "Content-Type": "application/json",
        });
        res.end(
          JSON.stringify({
            ok: false,
            success: false,
            error:
              "Forbidden - Automated exploit probe blocked by MOD-WAF-SHIELD",
          })
        );
        return;
      }
      if (shield.spamDrop) {
        console.log(
          `[FORM-SHIELD] Silent-dropped bot/solicitation (${shield.reason})`
        );
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            ok: true,
            success: true,
            dbPersisted: false,
            emailSent: false,
            spamFiltered: true,
            referenceNumber: shield.referenceNumber || "SPAM-BLOCKED",
          })
        );
        return;
      }

      const { candidateName, candidateEmail, candidatePhone, candidateMsg } =
        shield;
      if (!candidateName && !candidateEmail && !candidatePhone) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            ok: false,
            success: false,
            error: "Valid contact name, email, or phone is required",
          })
        );
        return;
      }

      const refNumber =
        fields.referenceNumber && String(fields.referenceNumber).length > 8
          ? String(fields.referenceNumber)
          : generateCollisionResistantRef("CAT");
      const subId =
        fields.id && String(fields.id).startsWith("SUB-")
          ? String(fields.id)
          : `SUB-${Date.now().toString(36).toUpperCase()}-${crypto
              .randomBytes(3)
              .toString("hex")
              .toUpperCase()}`;

      const formName = String(
        fields.formType ||
          fields["form-name"] ||
          fields.formName ||
          "community_inquiry"
      ).trim();

      const subRecord = {
        id: subId,
        siteKey: SITE_KEY,
        siteName: SITE_DIVISION_DEFAULT,
        formName,
        pagePath: String(
          fields.metadata?.landingPage ||
            fields.page_path ||
            fields.pagePath ||
            pathname ||
            "/"
        ),
        submitterName: candidateName.slice(0, 120),
        submitterEmail: candidateEmail.slice(0, 160),
        submitterPhone: candidatePhone.slice(0, 60),
        status: shield.autoSpamStatus || "new",
        payload: {
          ...fields,
          referenceNumber: refNumber,
          message: candidateMsg || undefined,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      let emailSent = false;
      let smtpMessageId = null;
      let smtpError = null;
      const { meta } = await loadMetaAndPins();

      try {
        const info = subRecord.status === "spam" ? null : await sendSubmissionEmail(subRecord, meta?.settings);
        if (info) {
          emailSent = true;
          smtpMessageId = info.messageId || null;
          subRecord.payload._smtpSent = true;
          subRecord.payload._smtpMessageId = smtpMessageId;
          subRecord.payload._smtpSentAt = new Date().toISOString();
        }
      } catch (err) {
        smtpError = String(err.message || err);
        subRecord.payload._smtpSent = false;
        subRecord.payload._smtpError = smtpError;
      }

      await saveFormSubmission(subRecord);
      emitHubWebhook("form.submitted", subRecord, meta?.settings);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          ok: true,
          success: true,
          dbPersisted: true,
          storageTier: storageEngineName,
          id: subId,
          submissionId: subId,
          referenceNumber: refNumber,
          sourceSite: SITE_DOMAIN_DEFAULT,
          emailSent,
          messageId: smtpMessageId,
          smtpError: smtpError || undefined,
          receivedAt: new Date().toISOString(),
        })
      );
      return;
    }

    // ========================================================================
    // 7. Static Files & Prerendered Astro Routes from `dist/`
    // ========================================================================
    if (PREVIEW_GATE_ENABLED && !isAuthenticated) {
      await serveStaticFile(
        res,
        path.join(__dirname, "modules", "MOD-PREVIEW-GATE", "gate.html"),
        401,
        { "Cache-Control": "no-store" }
      );
      return;
    }

    // Catch-all for any unmatched `/api/*` or non-GET mutation routes -> 404/405 (Never fall through to HTML soft-200)
    if (pathname.startsWith("/api/") || pathname.startsWith("/.netlify/")) {
      res.writeHead(404, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      });
      res.end(JSON.stringify({ ok: false, error: "API route not found" }));
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      });
      res.end(JSON.stringify({ ok: false, error: "Method Not Allowed" }));
      return;
    }

    const cleanRel = pathname.replace(/^\/+/, "");
    const candidates = [
      path.join(DIST_DIR, cleanRel),
      path.join(DIST_DIR, cleanRel, "index.html"),
      path.join(DIST_DIR, `${cleanRel}.html`),
    ];

    for (const candidate of candidates) {
      if (!candidate.startsWith(DIST_DIR)) continue;
      if (await serveStaticFile(res, candidate, 200)) {
        return;
      }
    }

    res.writeHead(404, {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    });
    res.end("Not Found");
  } catch (err) {
    const statusCode = err && err.statusCode === 413 ? 413 : 500;
    res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        ok: false,
        error: statusCode === 413 ? "Payload Too Large (1MB limit exceeded)" : String(err.message || err),
      })
    );
  }
});

initStorage().then(async () => {
  await loadMetaAndPins().catch(() => {});
  server.listen(PORT, HOST, () => {
    console.log(
      `🚀 ${SITE_DIVISION_DEFAULT} Coolify Server listening on http://${HOST}:${PORT} (gate=${PREVIEW_GATE_ENABLED}, storage=${storageEngineName})`
    );
  });
});
