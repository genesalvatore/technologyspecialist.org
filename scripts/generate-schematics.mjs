import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const pubDir = path.join(rootDir, 'public', 'images', 'schematics');
const distDir = path.join(rootDir, 'dist', 'images', 'schematics');
fs.mkdirSync(pubDir, { recursive: true });
fs.mkdirSync(distDir, { recursive: true });

// 1. SYS-05: network-l2-l3-topology.svg
const networkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" fill="none" style="background:#0F172A;">
  <defs>
    <pattern id="grid-net" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" stroke-width="0.8"/>
    </pattern>
  </defs>
  <rect width="800" height="500" fill="url(#grid-net)"/>
  <!-- Telemetry Header -->
  <rect x="20" y="20" width="760" height="36" fill="#1E293B" rx="1"/>
  <text x="35" y="42" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" fill="#38BDF8">SYS-05 // ENTERPRISE L2/L3 SWITCHING &amp; MULTI-WAN FABRIC</text>
  <text x="480" y="42" font-family="JetBrains Mono, monospace" font-size="11" fill="#94A3B8">BGP &bull; OSPF &bull; 10GbE CORE &bull; 802.1Q TRUNKS</text>
  <circle cx="755" cy="38" r="4" fill="#10B981"/>

  <!-- Dual WAN Tier -->
  <rect x="50" y="75" width="320" height="75" fill="#132338" stroke="#0284C7" stroke-width="1.5" rx="2"/>
  <rect x="50" y="75" width="320" height="24" fill="#0C4A6E"/>
  <text x="65" y="91" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#FFFFFF">WAN 1: FIBER DIA 1000/1000 Mbps [ACTIVE]</text>
  <text x="65" y="116" font-family="JetBrains Mono, monospace" font-size="9" fill="#38BDF8">IP: Static /29 &bull; BGP AS-64512 &bull; SLA: 99.999%</text>
  <text x="65" y="133" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#10B981">&bull; LATENCY: 3.2ms &bull; PACKET LOSS: 0.00%</text>

  <rect x="430" y="75" width="320" height="75" fill="#132338" stroke="#334155" stroke-width="1.5" rx="2"/>
  <rect x="430" y="75" width="320" height="24" fill="#1E293B"/>
  <text x="445" y="91" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#E2E8F0">WAN 2: COAX / 5G BACKUP 500/50 Mbps [HOT STANDBY]</text>
  <text x="445" y="116" font-family="JetBrains Mono, monospace" font-size="9" fill="#94A3B8">Auto-Failover Health Probe (1.1.1.1 / 8.8.8.8 ICMP 1s)</text>
  <text x="445" y="133" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#F59E0B">&bull; SYNC STATE: SYNCHRONIZED &bull; CARRIER READY</text>

  <!-- Router Core Tier -->
  <rect x="180" y="175" width="440" height="75" fill="#0F172A" stroke="#0052CC" stroke-width="2" rx="2"/>
  <text x="200" y="198" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" fill="#FFFFFF">HA FIREWALL &amp; CORE ROUTER PAIR (VRRP / CARP)</text>
  <text x="200" y="218" font-family="JetBrains Mono, monospace" font-size="9" fill="#38BDF8">Cross-Chassis LACP &bull; Hardware IPsec Offload &bull; State Synchronization</text>
  <text x="200" y="235" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#94A3B8">SFP+ Trunk 1 (10G) &bull; SFP+ Trunk 2 (10G) &bull; Jumbo Frames 9000 MTU</text>

  <!-- Connectors -->
  <line x1="210" y1="150" x2="280" y2="175" stroke="#0284C7" stroke-width="2" stroke-dasharray="3 3"/>
  <line x1="590" y1="150" x2="520" y2="175" stroke="#64748B" stroke-width="2" stroke-dasharray="3 3"/>

  <!-- Core Switches L2/L3 -->
  <rect x="60" y="280" width="320" height="95" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5" rx="2"/>
  <text x="75" y="302" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#38BDF8">SWITCH 01 (CORE A) - 48-PORT PoE++</text>
  <text x="75" y="322" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#E2E8F0">Ports 1-24: 2.5GbE PoE 802.3bt (Wi-Fi 7 APs)</text>
  <text x="75" y="338" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#E2E8F0">Ports 25-44: 1GbE Access (Workstations, VoIP)</text>
  <text x="75" y="354" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#38BDF8">Ports 45-48: 10GbE SFP+ MLAG Interconnect</text>

  <rect x="420" y="280" width="320" height="95" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5" rx="2"/>
  <text x="435" y="302" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#38BDF8">SWITCH 02 (CORE B) - 48-PORT PoE++</text>
  <text x="435" y="322" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#E2E8F0">Ports 1-24: 2.5GbE PoE 802.3bt (Redundant APs)</text>
  <text x="435" y="338" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#E2E8F0">Ports 25-44: 1GbE Access (CCTV, Access Control)</text>
  <text x="435" y="354" font-family="JetBrains Mono, monospace" font-size="8.5" fill="#38BDF8">Ports 45-48: 10GbE SFP+ MLAG Interconnect</text>

  <line x1="380" y1="327" x2="420" y2="327" stroke="#10B981" stroke-width="3"/>
  <text x="383" y="320" font-family="JetBrains Mono, monospace" font-size="7.5" font-weight="700" fill="#10B981">20G MLAG</text>

  <!-- Distribution Endpoints -->
  <rect x="60" y="405" width="155" height="65" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="72" y="424" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#FFFFFF">VLAN 10: SERVERS</text>
  <text x="72" y="440" font-family="JetBrains Mono, monospace" font-size="8" fill="#94A3B8">10.10.10.0/24</text>
  <text x="72" y="455" font-family="JetBrains Mono, monospace" font-size="8" fill="#10B981">&bull; Isolated East-West</text>

  <rect x="235" y="405" width="155" height="65" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="247" y="424" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#FFFFFF">VLAN 20: VOIP VOICE</text>
  <text x="247" y="440" font-family="JetBrains Mono, monospace" font-size="8" fill="#94A3B8">10.10.20.0/24</text>
  <text x="247" y="455" font-family="JetBrains Mono, monospace" font-size="8" fill="#38BDF8">&bull; DSCP 46 / EF QoS</text>

  <rect x="410" y="405" width="155" height="65" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="422" y="424" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#FFFFFF">VLAN 30: USERS</text>
  <text x="422" y="440" font-family="JetBrains Mono, monospace" font-size="8" fill="#94A3B8">10.10.30.0/23</text>
  <text x="422" y="455" font-family="JetBrains Mono, monospace" font-size="8" fill="#38BDF8">&bull; 802.1X Dynamic EAP</text>

  <rect x="585" y="405" width="155" height="65" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="597" y="424" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#FFFFFF">VLAN 40: GUEST / IOT</text>
  <text x="597" y="440" font-family="JetBrains Mono, monospace" font-size="8" fill="#94A3B8">10.10.40.0/24</text>
  <text x="597" y="455" font-family="JetBrains Mono, monospace" font-size="8" fill="#EF4444">&bull; Strict Zero-Trust Jail</text>
</svg>`;

// 2. SYS-06: mdm-conditional-access.svg
const mdmSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" fill="none" style="background:#0F172A;">
  <defs>
    <pattern id="grid-mdm" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" stroke-width="0.8"/>
    </pattern>
  </defs>
  <rect width="800" height="500" fill="url(#grid-mdm)"/>
  <!-- Telemetry Header -->
  <rect x="20" y="20" width="760" height="36" fill="#1E293B" rx="1"/>
  <text x="35" y="42" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" fill="#38BDF8">SYS-06 // MOBILE DEVICE MANAGEMENT &amp; ZERO-TRUST POSTURE</text>
  <text x="460" y="42" font-family="JetBrains Mono, monospace" font-size="11" fill="#94A3B8">INTUNE &bull; ABM &bull; KNOX &bull; CONDITIONAL ACCESS</text>
  <circle cx="755" cy="38" r="4" fill="#10B981"/>

  <!-- Fleet Tier (Left Column) -->
  <rect x="40" y="80" width="200" height="380" fill="#132338" stroke="#0284C7" stroke-width="1.5" rx="2"/>
  <rect x="40" y="80" width="200" height="28" fill="#0C4A6E"/>
  <text x="55" y="99" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#FFFFFF">ENROLLED FLEET NODES</text>

  <rect x="55" y="120" width="170" height="65" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="65" y="139" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" fill="#E2E8F0">APPLE iOS / macOS</text>
  <text x="65" y="156" font-family="JetBrains Mono, monospace" font-size="8" fill="#94A3B8">Apple Business Manager (ABM)</text>
  <text x="65" y="171" font-family="JetBrains Mono, monospace" font-size="8" fill="#10B981">&bull; Supervised Mode Active</text>

  <rect x="55" y="200" width="170" height="65" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="65" y="219" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" fill="#E2E8F0">ANDROID ENTERPRISE</text>
  <text x="65" y="236" font-family="JetBrains Mono, monospace" font-size="8" fill="#94A3B8">Samsung Knox &bull; Work Profile</text>
  <text x="65" y="251" font-family="JetBrains Mono, monospace" font-size="8" fill="#10B981">&bull; Hardware Keystore Bound</text>

  <rect x="55" y="280" width="170" height="65" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="65" y="299" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" fill="#E2E8F0">WINDOWS 11 FLEET</text>
  <text x="65" y="316" font-family="JetBrains Mono, monospace" font-size="8" fill="#94A3B8">Windows Autopilot &bull; BitLocker</text>
  <text x="65" y="331" font-family="JetBrains Mono, monospace" font-size="8" fill="#10B981">&bull; TPM 2.0 Attestation</text>

  <rect x="55" y="360" width="170" height="80" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="65" y="379" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#E2E8F0">BYOD CONTAINER</text>
  <text x="65" y="396" font-family="JetBrains Mono, monospace" font-size="8" fill="#94A3B8">MAM Without Enrollment</text>
  <text x="65" y="411" font-family="JetBrains Mono, monospace" font-size="8" fill="#38BDF8">Cut/Copy/Paste Air-Gapped</text>
  <text x="65" y="426" font-family="JetBrains Mono, monospace" font-size="8" fill="#F59E0B">&bull; Selective Remote Wipe</text>

  <!-- Middle Policy Engine Tier -->
  <rect x="280" y="80" width="240" height="380" fill="#0F172A" stroke="#0052CC" stroke-width="2" rx="2"/>
  <rect x="280" y="80" width="240" height="28" fill="#0052CC"/>
  <text x="295" y="99" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#FFFFFF">CONDITIONAL ACCESS ENGINE</text>

  <rect x="295" y="125" width="210" height="55" fill="#1E293B" stroke="#38BDF8" stroke-width="1" rx="1"/>
  <text x="305" y="145" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">GATE 1: DEVICE COMPLIANCE</text>
  <text x="305" y="162" font-family="JetBrains Mono, monospace" font-size="8" fill="#E2E8F0">OS Patched &bull; Root/Jailbreak Check</text>

  <rect x="295" y="195" width="210" height="55" fill="#1E293B" stroke="#38BDF8" stroke-width="1" rx="1"/>
  <text x="305" y="215" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">GATE 2: IDENTITY VERIFICATION</text>
  <text x="305" y="232" font-family="JetBrains Mono, monospace" font-size="8" fill="#E2E8F0">FIDO2 Passkey &bull; Number Match MFA</text>

  <rect x="295" y="265" width="210" height="55" fill="#1E293B" stroke="#38BDF8" stroke-width="1" rx="1"/>
  <text x="305" y="285" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">GATE 3: CONTEXT &amp; LOCATION</text>
  <text x="305" y="302" font-family="JetBrains Mono, monospace" font-size="8" fill="#E2E8F0">Named Geo IP &bull; Impossible Travel Block</text>

  <rect x="295" y="335" width="210" height="55" fill="#1E293B" stroke="#38BDF8" stroke-width="1" rx="1"/>
  <text x="305" y="355" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">GATE 4: APP PROTECTION POLICY</text>
  <text x="305" y="372" font-family="JetBrains Mono, monospace" font-size="8" fill="#E2E8F0">Encrypted App Sandbox &bull; Screen Lock</text>

  <rect x="295" y="405" width="210" height="40" fill="#10B981" fill-opacity="0.1" stroke="#10B981" stroke-width="1" rx="1"/>
  <text x="305" y="428" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#10B981">&radic; ALL 4 EVALUATED IN REAL-TIME</text>

  <!-- Connectors -->
  <line x1="240" y1="270" x2="280" y2="270" stroke="#38BDF8" stroke-width="2" stroke-dasharray="2 2"/>
  <line x1="520" y1="270" x2="560" y2="270" stroke="#10B981" stroke-width="2"/>

  <!-- Target SaaS & Core Tier -->
  <rect x="560" y="80" width="200" height="380" fill="#132338" stroke="#10B981" stroke-width="1.5" rx="2"/>
  <rect x="560" y="80" width="200" height="28" fill="#065F46"/>
  <text x="575" y="99" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#FFFFFF">PROTECTED RESOURCES</text>

  <rect x="575" y="125" width="170" height="65" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="585" y="145" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#E2E8F0">M365 &amp; SHAREPOINT</text>
  <text x="585" y="162" font-family="JetBrains Mono, monospace" font-size="8" fill="#94A3B8">Exchange, OneDrive, Teams</text>
  <text x="585" y="177" font-family="JetBrains Mono, monospace" font-size="8" fill="#10B981">&bull; Session Token Bound</text>

  <rect x="575" y="205" width="170" height="65" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="585" y="225" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#E2E8F0">CORPORATE CRM &amp; ERP</text>
  <text x="585" y="242" font-family="JetBrains Mono, monospace" font-size="8" fill="#94A3B8">SSO SAML 2.0 / OIDC</text>
  <text x="585" y="257" font-family="JetBrains Mono, monospace" font-size="8" fill="#10B981">&bull; Ephemeral Access Only</text>

  <rect x="575" y="285" width="170" height="65" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="585" y="305" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#E2E8F0">ON-PREM SERVER RDS</text>
  <text x="585" y="322" font-family="JetBrains Mono, monospace" font-size="8" fill="#94A3B8">App Proxy / Azure PIM</text>
  <text x="585" y="337" font-family="JetBrains Mono, monospace" font-size="8" fill="#10B981">&bull; Zero Public Port Open</text>

  <rect x="575" y="365" width="170" height="80" fill="#0F172A" stroke="#EF4444" stroke-width="1" rx="1"/>
  <text x="585" y="385" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#EF4444">NON-COMPLIANT DROP</text>
  <text x="585" y="402" font-family="JetBrains Mono, monospace" font-size="8" fill="#94A3B8">Instant Revoke &bull; Wipe</text>
  <text x="585" y="417" font-family="JetBrains Mono, monospace" font-size="8" fill="#94A3B8">Alert Dispatched via SIEM</text>
  <text x="585" y="432" font-family="JetBrains Mono, monospace" font-size="8" fill="#EF4444">&bull; ZERO LEAKAGE</text>
</svg>`;

// 3. SYS-07: rds-workforce-topology.svg
const rdsSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" fill="none" style="background:#0F172A;">
  <defs>
    <pattern id="grid-rds" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" stroke-width="0.8"/>
    </pattern>
  </defs>
  <rect width="800" height="500" fill="url(#grid-rds)"/>
  <!-- Telemetry Header -->
  <rect x="20" y="20" width="760" height="36" fill="#1E293B" rx="1"/>
  <text x="35" y="42" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" fill="#38BDF8">SYS-07 // HARDENED REMOTE DESKTOP &amp; VIRTUAL WORKFORCE FABRIC</text>
  <text x="480" y="42" font-family="JetBrains Mono, monospace" font-size="11" fill="#94A3B8">RDS FARM &bull; MFA GATEWAY &bull; LOW-LATENCY RDP</text>
  <circle cx="755" cy="38" r="4" fill="#10B981"/>

  <!-- Remote Users (Left) -->
  <rect x="40" y="80" width="180" height="380" fill="#132338" stroke="#0284C7" stroke-width="1.5" rx="2"/>
  <rect x="40" y="80" width="180" height="28" fill="#0C4A6E"/>
  <text x="55" y="99" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#FFFFFF">REMOTE WORKFORCE</text>

  <rect x="55" y="130" width="150" height="70" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="65" y="150" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#E2E8F0">ENGINEERING CAD</text>
  <text x="65" y="167" font-family="JetBrains Mono, monospace" font-size="8" fill="#94A3B8">GPU-Accelerated RemoteFX</text>
  <text x="65" y="182" font-family="JetBrains Mono, monospace" font-size="8" fill="#10B981">&bull; 60 FPS Sub-15ms Latency</text>

  <rect x="55" y="225" width="150" height="70" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="65" y="245" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#E2E8F0">BRANCH OFFICES</text>
  <text x="65" y="262" font-family="JetBrains Mono, monospace" font-size="8" fill="#94A3B8">Zero-Client Thin Endpoints</text>
  <text x="65" y="277" font-family="JetBrains Mono, monospace" font-size="8" fill="#38BDF8">&bull; Auto-Boot to Session</text>

  <rect x="55" y="320" width="150" height="70" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="65" y="340" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#E2E8F0">FIELD EXECUTIVES</text>
  <text x="65" y="357" font-family="JetBrains Mono, monospace" font-size="8" fill="#94A3B8">Laptops, Tablets &amp; Phones</text>
  <text x="65" y="372" font-family="JetBrains Mono, monospace" font-size="8" fill="#10B981">&bull; Adaptive Bandwidth</text>

  <!-- DMZ RDS Gateway (Center) -->
  <rect x="260" y="80" width="240" height="380" fill="#0F172A" stroke="#0052CC" stroke-width="2" rx="2"/>
  <rect x="260" y="80" width="240" height="28" fill="#0052CC"/>
  <text x="275" y="99" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#FFFFFF">HARDENED DMZ GATEWAY PAIR</text>

  <rect x="275" y="125" width="210" height="65" fill="#1E293B" stroke="#38BDF8" stroke-width="1" rx="1"/>
  <text x="285" y="145" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">PORT 443 / HTTPS ONLY</text>
  <text x="285" y="162" font-family="JetBrains Mono, monospace" font-size="8" fill="#E2E8F0">Port 3389 RDP Sealed from WAN</text>
  <text x="285" y="177" font-family="JetBrains Mono, monospace" font-size="8" fill="#10B981">&bull; TLS 1.3 Strict Cipher Suites</text>

  <rect x="275" y="205" width="210" height="65" fill="#1E293B" stroke="#38BDF8" stroke-width="1" rx="1"/>
  <text x="285" y="225" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">RADIUS / DUO / ENTRA MFA</text>
  <text x="285" y="242" font-family="JetBrains Mono, monospace" font-size="8" fill="#E2E8F0">Push Approval &bull; Hardware Token</text>
  <text x="285" y="257" font-family="JetBrains Mono, monospace" font-size="8" fill="#10B981">&bull; Brute Force Lockout Guard</text>

  <rect x="275" y="285" width="210" height="65" fill="#1E293B" stroke="#38BDF8" stroke-width="1" rx="1"/>
  <text x="285" y="305" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">RD CONNECTION BROKER</text>
  <text x="285" y="322" font-family="JetBrains Mono, monospace" font-size="8" fill="#E2E8F0">Load Balancing &bull; Session Reconnection</text>
  <text x="285" y="337" font-family="JetBrains Mono, monospace" font-size="8" fill="#38BDF8">&bull; High-Availability SQL DB</text>

  <rect x="275" y="365" width="210" height="80" fill="#1E293B" stroke="#38BDF8" stroke-width="1" rx="1"/>
  <text x="285" y="385" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">SESSION HOST CONTROLS</text>
  <text x="285" y="402" font-family="JetBrains Mono, monospace" font-size="8" fill="#E2E8F0">Clipboard Redirection Filter</text>
  <text x="285" y="417" font-family="JetBrains Mono, monospace" font-size="8" fill="#E2E8F0">Drive Mapping Restriction</text>
  <text x="285" y="432" font-family="JetBrains Mono, monospace" font-size="8" fill="#10B981">&bull; Watermarked VDI Sessions</text>

  <!-- Connectors -->
  <line x1="220" y1="270" x2="260" y2="270" stroke="#0284C7" stroke-width="2" stroke-dasharray="2 2"/>
  <line x1="500" y1="270" x2="540" y2="270" stroke="#10B981" stroke-width="2"/>

  <!-- Internal Farm (Right) -->
  <rect x="540" y="80" width="220" height="380" fill="#132338" stroke="#0284C7" stroke-width="1.5" rx="2"/>
  <rect x="540" y="80" width="220" height="28" fill="#0C4A6E"/>
  <text x="555" y="99" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" fill="#FFFFFF">INTERNAL RDSH CLUSTER</text>

  <rect x="555" y="120" width="190" height="65" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="565" y="140" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#E2E8F0">RDSH NODE 01 [256GB ECC]</text>
  <text x="565" y="157" font-family="JetBrains Mono, monospace" font-size="8" fill="#94A3B8">Windows Server 2025 RDS</text>
  <text x="565" y="172" font-family="JetBrains Mono, monospace" font-size="8" fill="#10B981">&bull; 40 Concurrent Sessions Active</text>

  <rect x="555" y="195" width="190" height="65" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="565" y="215" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#E2E8F0">RDSH NODE 02 [256GB ECC]</text>
  <text x="565" y="232" font-family="JetBrains Mono, monospace" font-size="8" fill="#94A3B8">Windows Server 2025 RDS</text>
  <text x="565" y="247" font-family="JetBrains Mono, monospace" font-size="8" fill="#10B981">&bull; 38 Concurrent Sessions Active</text>

  <rect x="555" y="270" width="190" height="80" fill="#0F172A" stroke="#38BDF8" stroke-width="1" rx="1"/>
  <text x="565" y="290" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#38BDF8">FSLogix PROFILE CONTAINERS</text>
  <text x="565" y="307" font-family="JetBrains Mono, monospace" font-size="8" fill="#E2E8F0">VHDX Mounted at Logon (&lt;2s)</text>
  <text x="565" y="322" font-family="JetBrains Mono, monospace" font-size="8" fill="#94A3B8">All-Flash NVMe Storage Target</text>
  <text x="565" y="337" font-family="JetBrains Mono, monospace" font-size="8" fill="#10B981">&bull; Outlook OST &amp; Teams Cached</text>

  <rect x="555" y="360" width="190" height="85" fill="#0F172A" stroke="#10B981" stroke-width="1" rx="1"/>
  <text x="565" y="380" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#10B981">IMMUTABLE BACKUP AGENT</text>
  <text x="565" y="397" font-family="JetBrains Mono, monospace" font-size="8" fill="#E2E8F0">Hourly Differential Snapshots</text>
  <text x="565" y="412" font-family="JetBrains Mono, monospace" font-size="8" fill="#94A3B8">Daily Air-Gapped Offsite Sync</text>
  <text x="565" y="427" font-family="JetBrains Mono, monospace" font-size="8" fill="#10B981">&bull; RPO: 15min &bull; RTO: 30min</text>
</svg>`;

// 4. SYS-09: consultancy-audit-roadmap.svg
const consultancySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" fill="none" style="background:#0F172A;">
  <defs>
    <pattern id="grid-audit" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" stroke-width="0.8"/>
    </pattern>
  </defs>
  <rect width="800" height="500" fill="url(#grid-audit)"/>
  <!-- Telemetry Header -->
  <rect x="20" y="20" width="760" height="36" fill="#1E293B" rx="1"/>
  <text x="35" y="42" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" fill="#38BDF8">SYS-09 // PRINCIPAL ARCHITECTURAL AUDIT &amp; LIFECYCLE ROADMAP</text>
  <text x="480" y="42" font-family="JetBrains Mono, monospace" font-size="11" fill="#94A3B8">36-YEAR VENDOR-NEUTRAL FRAMEWORK</text>
  <circle cx="755" cy="38" r="4" fill="#10B981"/>

  <!-- 4-Phase Lifecycle Process Flow -->
  <!-- Phase 1 -->
  <rect x="35" y="80" width="165" height="380" fill="#132338" stroke="#0284C7" stroke-width="1.5" rx="2"/>
  <rect x="35" y="80" width="165" height="28" fill="#0C4A6E"/>
  <text x="45" y="99" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" fill="#FFFFFF">PHASE 1: DISCOVERY</text>

  <rect x="45" y="120" width="145" height="75" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="53" y="139" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">TOPOLOGY SCAN</text>
  <text x="53" y="156" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">SNMP, ARP &amp; L2/L3 map</text>
  <text x="53" y="171" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#94A3B8">Active Directory audit</text>
  <text x="53" y="186" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#10B981">&bull; Zero blind spots</text>

  <rect x="45" y="205" width="145" height="75" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="53" y="224" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">TELECOM &amp; ISP AUDIT</text>
  <text x="53" y="241" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">Bill &amp; contract analysis</text>
  <text x="53" y="256" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#94A3B8">SIP trunk &amp; PRI review</text>
  <text x="53" y="271" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#10B981">&bull; 20-40% savings found</text>

  <rect x="45" y="290" width="145" height="85" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="53" y="309" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">VULNERABILITY SCAN</text>
  <text x="53" y="326" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">Open ports &amp; weak ciphers</text>
  <text x="53" y="341" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#94A3B8">Ransomware exposure check</text>
  <text x="53" y="356" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#F59E0B">&bull; CIS Benchmark baseline</text>

  <rect x="45" y="385" width="145" height="60" fill="#1E293B" stroke="#38BDF8" stroke-width="1" rx="1"/>
  <text x="53" y="405" font-family="JetBrains Mono, monospace" font-size="8" font-weight="700" fill="#FFFFFF">DELIVERABLE:</text>
  <text x="53" y="422" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#38BDF8">Inventory &amp; Risk Register</text>
  <text x="53" y="437" font-family="JetBrains Mono, monospace" font-size="7" fill="#94A3B8">Fully attested documentation</text>

  <!-- Phase 2 -->
  <rect x="225" y="80" width="165" height="380" fill="#132338" stroke="#0284C7" stroke-width="1.5" rx="2"/>
  <rect x="225" y="80" width="165" height="28" fill="#0C4A6E"/>
  <text x="235" y="99" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" fill="#FFFFFF">PHASE 2: BLUEPRINT</text>

  <rect x="235" y="120" width="145" height="75" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="243" y="139" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">TARGET ARCHITECTURE</text>
  <text x="243" y="156" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">Hypervisor sizing (RAM/IOPS)</text>
  <text x="243" y="171" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#94A3B8">M365 SKU optimization</text>
  <text x="243" y="186" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#10B981">&bull; Future-proof 5yr scope</text>

  <rect x="235" y="205" width="145" height="75" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="243" y="224" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">DR / BCDR FORMULATION</text>
  <text x="243" y="241" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">RPO &lt; 15m / RTO &lt; 1hr</text>
  <text x="243" y="256" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#94A3B8">3-2-1-1-0 Backup Model</text>
  <text x="243" y="271" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#10B981">&bull; Air-gapped immutability</text>

  <rect x="235" y="290" width="145" height="85" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="243" y="309" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">CAPEX / OPEX ROADMAP</text>
  <text x="243" y="326" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">Hardware refresh cycle</text>
  <text x="243" y="341" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#94A3B8">Warranty status audit</text>
  <text x="243" y="356" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#38BDF8">&bull; Clear ROI projections</text>

  <rect x="235" y="385" width="145" height="60" fill="#1E293B" stroke="#38BDF8" stroke-width="1" rx="1"/>
  <text x="243" y="405" font-family="JetBrains Mono, monospace" font-size="8" font-weight="700" fill="#FFFFFF">DELIVERABLE:</text>
  <text x="243" y="422" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#38BDF8">Architectural Blueprint</text>
  <text x="243" y="437" font-family="JetBrains Mono, monospace" font-size="7" fill="#94A3B8">Schematic diagrams &amp; quotes</text>

  <!-- Phase 3 -->
  <rect x="415" y="80" width="165" height="380" fill="#132338" stroke="#0284C7" stroke-width="1.5" rx="2"/>
  <rect x="415" y="80" width="165" height="28" fill="#0C4A6E"/>
  <text x="425" y="99" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" fill="#FFFFFF">PHASE 3: EXECUTION</text>

  <rect x="425" y="120" width="145" height="75" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="433" y="139" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">AFTER-HOURS CUTOVER</text>
  <text x="433" y="156" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">Zero midday disruption</text>
  <text x="433" y="171" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#94A3B8">Staged live migrations</text>
  <text x="433" y="186" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#10B981">&bull; Fallback rollback plan</text>

  <rect x="425" y="205" width="145" height="75" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="433" y="224" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">SAN &amp; FABRIC BUILD</text>
  <text x="433" y="241" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">10G/25G SFP+ structured cabling</text>
  <text x="433" y="256" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#94A3B8">LACP bond &amp; multipath IO</text>
  <text x="433" y="271" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#10B981">&bull; Full redundancy tested</text>

  <rect x="425" y="290" width="145" height="85" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="433" y="309" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">IDENTITY LOCKDOWN</text>
  <text x="433" y="326" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">PIM Tier 0/1/2 separation</text>
  <text x="433" y="341" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#94A3B8">FIDO2 passkey enforcement</text>
  <text x="433" y="356" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#10B981">&bull; 100% MFA coverage</text>

  <rect x="425" y="385" width="145" height="60" fill="#1E293B" stroke="#38BDF8" stroke-width="1" rx="1"/>
  <text x="433" y="405" font-family="JetBrains Mono, monospace" font-size="8" font-weight="700" fill="#FFFFFF">DELIVERABLE:</text>
  <text x="433" y="422" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#38BDF8">Cutover Verification</text>
  <text x="433" y="437" font-family="JetBrains Mono, monospace" font-size="7" fill="#94A3B8">Post-deploy sign-off matrix</text>

  <!-- Phase 4 -->
  <rect x="605" y="80" width="160" height="380" fill="#132338" stroke="#10B981" stroke-width="1.5" rx="2"/>
  <rect x="605" y="80" width="160" height="28" fill="#065F46"/>
  <text x="615" y="99" font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" fill="#FFFFFF">PHASE 4: GOVERNANCE</text>

  <rect x="615" y="120" width="140" height="75" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="623" y="139" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#10B981">24/7 TELEMETRY</text>
  <text x="623" y="156" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">SNMP, syslog &amp; cloud alarms</text>
  <text x="623" y="171" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#94A3B8">Heartbeat health monitoring</text>
  <text x="623" y="186" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#10B981">&bull; &lt;15m response SLA</text>

  <rect x="615" y="205" width="140" height="75" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="623" y="224" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#10B981">QUARTERLY REVIEWS</text>
  <text x="623" y="241" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">Executive QBR presentation</text>
  <text x="623" y="256" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#94A3B8">Cap-ex budgeting updates</text>
  <text x="623" y="271" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#38BDF8">&bull; Strategic alignment</text>

  <rect x="615" y="290" width="140" height="85" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="623" y="309" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#10B981">DR DRILL RUNBOOK</text>
  <text x="623" y="326" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">Semi-annual live test</text>
  <text x="623" y="341" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#94A3B8">Sandbox restore verification</text>
  <text x="623" y="356" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#10B981">&bull; Attested compliance</text>

  <rect x="615" y="385" width="140" height="60" fill="#1E293B" stroke="#10B981" stroke-width="1" rx="1"/>
  <text x="623" y="405" font-family="JetBrains Mono, monospace" font-size="8" font-weight="700" fill="#FFFFFF">DELIVERABLE:</text>
  <text x="623" y="422" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#10B981">Ongoing SLA Assurance</text>
  <text x="623" y="437" font-family="JetBrains Mono, monospace" font-size="7" fill="#94A3B8">Sovereign peace of mind</text>
</svg>`;

// 5. SYS-10: ai-rag-copilot-pipeline.svg
const aiSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" fill="none" style="background:#0F172A;">
  <defs>
    <pattern id="grid-ai" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" stroke-width="0.8"/>
    </pattern>
  </defs>
  <rect width="800" height="500" fill="url(#grid-ai)"/>
  <!-- Telemetry Header -->
  <rect x="20" y="20" width="760" height="36" fill="#1E293B" rx="1"/>
  <text x="35" y="42" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" fill="#38BDF8">SYS-10 // ENTERPRISE AI ARCHITECTURE, COPILOT GOVERNANCE &amp; RAG</text>
  <text x="480" y="42" font-family="JetBrains Mono, monospace" font-size="11" fill="#94A3B8">SOVEREIGN LLM &bull; DLP GUARDRAILS &bull; AGENTS</text>
  <circle cx="755" cy="38" r="4" fill="#10B981"/>

  <!-- Col 1: Corporate Data Boundary & Permission Sanitization -->
  <rect x="35" y="80" width="170" height="380" fill="#132338" stroke="#0284C7" stroke-width="1.5" rx="2"/>
  <rect x="35" y="80" width="170" height="28" fill="#0C4A6E"/>
  <text x="45" y="99" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#FFFFFF">1. PERMISSION AUDIT</text>

  <rect x="45" y="125" width="150" height="65" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="55" y="145" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#E2E8F0">SHAREPOINT SITES</text>
  <text x="55" y="162" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#EF4444">Oversharing &amp; Public Links</text>
  <text x="55" y="177" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#10B981">&bull; ACL Remediation First</text>

  <rect x="45" y="205" width="150" height="65" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="55" y="225" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#E2E8F0">PURVIEW SENSITIVITY</text>
  <text x="55" y="242" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#94A3B8">Automated Labeling (PII, IP)</text>
  <text x="55" y="257" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#38BDF8">&bull; Cryptographic Seals</text>

  <rect x="45" y="285" width="150" height="65" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="55" y="305" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#E2E8F0">FILE REPOSITORIES</text>
  <text x="55" y="322" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#94A3B8">NAS / On-Prem SAN Shares</text>
  <text x="55" y="337" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#10B981">&bull; Clean indexing target</text>

  <rect x="45" y="365" width="150" height="75" fill="#10B981" fill-opacity="0.1" stroke="#10B981" stroke-width="1" rx="1"/>
  <text x="55" y="385" font-family="JetBrains Mono, monospace" font-size="8" font-weight="700" fill="#10B981">PRE-AI PREREQUISITE</text>
  <text x="55" y="402" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">Prevent Copilot from exposing</text>
  <text x="55" y="417" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">payroll or executive files</text>
  <text x="55" y="430" font-family="JetBrains Mono, monospace" font-size="7" fill="#10B981">&bull; ZERO UNAUTHORIZED LEAKS</text>

  <!-- Col 2: Copilot & Sovereign RAG Pipeline -->
  <rect x="225" y="80" width="170" height="380" fill="#0F172A" stroke="#0052CC" stroke-width="2" rx="2"/>
  <rect x="225" y="80" width="170" height="28" fill="#0052CC"/>
  <text x="235" y="99" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#FFFFFF">2. RAG &amp; VECTOR PIPELINE</text>

  <rect x="235" y="125" width="150" height="65" fill="#1E293B" stroke="#38BDF8" stroke-width="1" rx="1"/>
  <text x="245" y="145" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">EMBEDDINGS ENGINE</text>
  <text x="245" y="162" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">Text Chunking &bull; Tokenizer</text>
  <text x="245" y="177" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#10B981">&bull; pgvector in Postgres 16</text>

  <rect x="235" y="205" width="150" height="65" fill="#1E293B" stroke="#38BDF8" stroke-width="1" rx="1"/>
  <text x="245" y="225" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">HYBRID SEARCH</text>
  <text x="245" y="242" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">BM25 Exact + Cosine Distance</text>
  <text x="245" y="257" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#10B981">&bull; Top-K Relevant Context</text>

  <rect x="235" y="285" width="150" height="65" fill="#1E293B" stroke="#38BDF8" stroke-width="1" rx="1"/>
  <text x="245" y="305" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">SOVEREIGN AIR-GAP</text>
  <text x="245" y="322" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">On-Prem Ollama / vLLM</text>
  <text x="245" y="337" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#10B981">&bull; Data never leaves cluster</text>

  <rect x="235" y="365" width="150" height="75" fill="#1E293B" stroke="#38BDF8" stroke-width="1" rx="1"/>
  <text x="245" y="385" font-family="JetBrains Mono, monospace" font-size="8" font-weight="700" fill="#38BDF8">AUDITABLE PROVENANCE</text>
  <text x="245" y="402" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">Every generation cites</text>
  <text x="245" y="417" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">exact document and chunk</text>
  <text x="245" y="430" font-family="JetBrains Mono, monospace" font-size="7" fill="#10B981">&bull; ZERO HALLUCINATION</text>

  <!-- Col 3: DLP & Guardrails -->
  <rect x="415" y="80" width="170" height="380" fill="#132338" stroke="#0284C7" stroke-width="1.5" rx="2"/>
  <rect x="415" y="80" width="170" height="28" fill="#0C4A6E"/>
  <text x="425" y="99" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#FFFFFF">3. DLP &amp; GUARDRAILS</text>

  <rect x="425" y="125" width="150" height="65" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="435" y="145" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">INBOUND PROMPT WAF</text>
  <text x="435" y="162" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">Prompt Injection Defense</text>
  <text x="435" y="177" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#10B981">&bull; Jailbreak Filtering</text>

  <rect x="425" y="205" width="150" height="65" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="435" y="225" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">OUTBOUND REDACTION</text>
  <text x="435" y="242" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">SSN, Credit Card, Secrets</text>
  <text x="435" y="257" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#10B981">&bull; Auto-Redacted in Transit</text>

  <rect x="425" y="285" width="150" height="65" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="435" y="305" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#38BDF8">COPILOT POLICIES</text>
  <text x="435" y="322" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">Tenant-level web grounding toggle</text>
  <text x="435" y="337" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#10B981">&bull; Commercial data protection</text>

  <rect x="425" y="365" width="150" height="75" fill="#1E293B" stroke="#38BDF8" stroke-width="1" rx="1"/>
  <text x="435" y="385" font-family="JetBrains Mono, monospace" font-size="8" font-weight="700" fill="#38BDF8">TAMPER-PROOF LOGS</text>
  <text x="435" y="402" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">Complete query audit log</text>
  <text x="435" y="417" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">Stored in encrypted Postgres</text>
  <text x="435" y="430" font-family="JetBrains Mono, monospace" font-size="7" fill="#10B981">&bull; FULL COMPLIANCE READY</text>

  <!-- Col 4: Workflow Automation & Support Agents -->
  <rect x="605" y="80" width="160" height="380" fill="#132338" stroke="#10B981" stroke-width="1.5" rx="2"/>
  <rect x="605" y="80" width="160" height="28" fill="#065F46"/>
  <text x="615" y="99" font-family="JetBrains Mono, monospace" font-size="9" font-weight="700" fill="#FFFFFF">4. WORKFLOW AGENTS</text>

  <rect x="615" y="125" width="140" height="65" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="623" y="145" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#10B981">TIER-1 HELPDESK</text>
  <text x="623" y="162" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">Automated triage &amp; reset</text>
  <text x="623" y="177" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#10B981">&bull; Instant 24/7 deflection</text>

  <rect x="615" y="205" width="140" height="65" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="623" y="225" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#10B981">INFRA TRIAGE AGENT</text>
  <text x="623" y="242" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">Correlates syslogs &amp; alarms</text>
  <text x="623" y="257" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#38BDF8">&bull; Escalates to Steve direct</text>

  <rect x="615" y="285" width="140" height="65" fill="#0F172A" stroke="#334155" stroke-width="1" rx="1"/>
  <text x="623" y="305" font-family="JetBrains Mono, monospace" font-size="8.5" font-weight="700" fill="#10B981">STAFF ENABLEMENT</text>
  <text x="623" y="322" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">Custom prompt libraries</text>
  <text x="623" y="337" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#10B981">&bull; Hands-on team training</text>

  <rect x="615" y="365" width="140" height="75" fill="#1E293B" stroke="#10B981" stroke-width="1" rx="1"/>
  <text x="623" y="385" font-family="JetBrains Mono, monospace" font-size="8" font-weight="700" fill="#10B981">OPERATIONAL OUTCOME</text>
  <text x="623" y="402" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">Cut resolution times 65%</text>
  <text x="623" y="417" font-family="JetBrains Mono, monospace" font-size="7.5" fill="#E2E8F0">while locking down data</text>
  <text x="623" y="430" font-family="JetBrains Mono, monospace" font-size="7" fill="#10B981">&bull; 100% AUDITABLE</text>
</svg>`;

const schematics = [
  { name: 'network-l2-l3-topology.svg', content: networkSvg },
  { name: 'mdm-conditional-access.svg', content: mdmSvg },
  { name: 'rds-workforce-topology.svg', content: rdsSvg },
  { name: 'consultancy-audit-roadmap.svg', content: consultancySvg },
  { name: 'ai-rag-copilot-pipeline.svg', content: aiSvg },
];

for (const s of schematics) {
  fs.writeFileSync(path.join(pubDir, s.name), s.content, 'utf8');
  fs.writeFileSync(path.join(distDir, s.name), s.content, 'utf8');
  console.log('Saved schematic:', s.name);
}
console.log('All 5 additional schematics created in public/ and dist/');
