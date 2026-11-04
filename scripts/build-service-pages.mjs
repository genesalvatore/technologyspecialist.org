import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');

// Define all 10 practice areas
const services = [
  {
    code: 'SYS-01',
    slug: 'microsoft-365',
    category: 'Cloud & Identity Governance',
    title: 'Microsoft Office & M365 Organization Management',
    shortTitle: 'Microsoft 365 Architecture',
    metaDesc: 'Enterprise Microsoft 365 administration, Entra ID Conditional Access, Exchange Online DMARC p=reject, Intune security baselines, and Copilot readiness by Steve Cormier.',
    schematic: '/images/schematics/m365-tenant-posture.svg',
    schematicAlt: 'Microsoft 365 and Entra ID Tenant Posture Architectural Schematic',
    lead: 'Architectural tenant governance, Entra ID zero-trust posture, strict email deliverability enforcement, and data boundary protection for organizations running on Microsoft 365.',
    metrics: [
      { label: 'DMARC POSTURE', value: 'p=reject (100% Strict)', sub: 'Zero executive spoofing risk' },
      { label: 'MFA ADOPTION', value: 'FIDO2 / Number Match', sub: 'Passkey & conditional access' },
      { label: 'PRIVILEGE MODEL', value: 'Zero Standing Admin', sub: 'Entra PIM just-in-time access' },
      { label: 'BACKUP RETENTION', value: 'Air-Gapped Immutable', sub: 'Exchange & SharePoint BCDR' }
    ],
    capabilities: [
      {
        area: 'Entra ID & Identity Posture',
        desc: 'Risk-based Conditional Access policies, FIDO2 hardware passkey enforcement, trusted compliance device binding, impossible travel detection, and automated sign-in token protection.'
      },
      {
        area: 'Exchange Online & Mail Flow',
        desc: 'Strict DMARC p=reject implementation, dual-selector 2048-bit DKIM key rotation, hardened SPF -all syntax, inbound anti-phishing threshold tuning, and Zero-Hour Auto Purge (ZAP).'
      },
      {
        area: 'SharePoint & Teams Data Governance',
        desc: 'Comprehensive permission audits, elimination of anonymous public file sharing links, Microsoft Purview sensitivity labeling, containerized guest access, and DLP exfiltration blocks.'
      },
      {
        area: 'Intune MDM & Device Compliance',
        desc: 'Automated BitLocker encryption key escrow to Entra ID, Windows Autopilot zero-touch enrollment profiles, and Mobile Application Management (MAM) protection for iOS and Android.'
      },
      {
        area: 'Licensing Optimization & Sizing',
        desc: 'Exhaustive SKU review (Business Premium vs E3/E5) eliminating redundant third-party SaaS subscriptions (standalone anti-spam, duplicate MDM, expensive e-sign).'
      },
      {
        area: 'Copilot Pre-Activation Sanitization',
        desc: 'Pre-AI permission hardening across all document libraries to ensure Microsoft 365 Copilot never indexes or surfaces confidential HR, payroll, or executive records to unauthorized staff.'
      }
    ],
    platforms: [
      { category: 'Identity & Access', items: ['Microsoft Entra ID (P1/P2)', 'Privileged Identity Management (PIM)', 'Conditional Access', 'Self-Service Password Reset (SSPR)'] },
      { category: 'Productivity & Mail', items: ['Exchange Online Protection (EOP)', 'SharePoint Online', 'Microsoft Teams', 'OneDrive for Business'] },
      { category: 'Security & Compliance', items: ['Microsoft Defender for Office 365', 'Microsoft Purview DLP', 'DMARC Analyzer', 'eDiscovery Standard'] },
      { category: 'Device Management', items: ['Microsoft Intune', 'Windows Autopilot', 'Apple Business Manager Integration', 'Android Enterprise Work Profile'] }
    ],
    caseStudy: {
      headline: 'Healthcare Organization: Zero-Trust M365 Transformation',
      challenge: 'An 85-seat healthcare services provider experienced recurring executive email spoofing attempts and possessed over 140 unmonitored public SharePoint document links created by former contractors.',
      solution: 'Steve Cormier conducted an exhaustive tenant audit, implemented strict DMARC p=reject with 2048-bit DKIM rotation, deployed Entra ID Conditional Access requiring FIDO2 number matching, revoked all external sharing links, and established Purview sensitivity labels.',
      result: 'Zero email spoofing compromises over 24 months, complete compliance with HIPAA Technical Safeguards, and a 28% monthly licensing cost reduction through Business Premium consolidation.'
    }
  },
  {
    code: 'SYS-02',
    slug: 'virtualization',
    category: 'Compute & Hypervisor Infrastructure',
    title: 'Virtual Machine & Server Management (VMware ESXi & Windows Hyper-V)',
    shortTitle: 'Virtual Machines & Servers',
    metaDesc: 'Enterprise VMware ESXi and Windows Server Hyper-V cluster architecture, NVMe SAN storage fabrics, live migration, and immutable BCDR by Steve Cormier.',
    schematic: '/images/schematics/hypervisor-cluster.svg',
    schematicAlt: 'High Availability Hypervisor Cluster Fabric Architectural Schematic',
    lead: 'Mission-critical hypervisor cluster engineering, all-flash storage networking, zero-downtime workload migrations, and hardened server virtualization built for continuous uptime.',
    metrics: [
      { label: 'CLUSTER UPTIME', value: '99.999% Availability', sub: 'Dual-node failover redundancy' },
      { label: 'STORAGE FABRIC', value: 'All-Flash NVMe SAN', sub: '125,000 IOPS @ 0.4ms latency' },
      { label: 'NETWORK BACKBONE', value: 'Dual 10GbE SFP+', sub: 'Active/Active LACP trunking' },
      { label: 'FAILOVER RECOVERY', value: 'Sub-Second vMotion', sub: 'Live migration with zero drop' }
    ],
    capabilities: [
      {
        area: 'High-Availability Hypervisor Clusters',
        desc: 'VMware vSphere ESXi 7.0/8.0 and Windows Server 2022/2025 Hyper-V Failover Clusters, automated VM restart upon physical host failure, and proactive DRS load distribution.'
      },
      {
        area: 'SAN, NAS & All-Flash Storage Fabrics',
        desc: 'High-performance iSCSI, NFS, and NVMe-oF multipath IO (MPIO) architectures, dual-controller storage fabrics, thin provisioning, and real-time disk health telemetry.'
      },
      {
        area: 'P2V & Cross-Platform Migrations',
        desc: 'Live physical-to-virtual (P2V) server conversions, cross-hypervisor migrations (Broadcom/VMware to Windows Hyper-V or Proxmox VE), and zero-downtime data migrations.'
      },
      {
        area: 'Immutable Backup & Replication',
        desc: 'Veeam Backup & Replication and Nakivo appliances paired with Linux hardened repositories utilizing immutable write-once-read-many (WORM) retention flags.'
      },
      {
        area: 'Compute Sizing & NUMA Profiling',
        desc: 'Precise virtual CPU to physical core ratio allocation, NUMA node boundary alignment, memory ballooning prevention, and high-performance SQL/ERP tuning.'
      },
      {
        area: 'Out-of-Band Remote Management',
        desc: 'Hardened Dell iDRAC9, HPE iLO 5/6, and Cisco IMC configuration isolated on air-gapped management VLANs with cryptographic certificate authentication.'
      }
    ],
    platforms: [
      { category: 'Hypervisors', items: ['VMware vSphere ESXi 7.0/8.0', 'VMware vCenter Server', 'Windows Server 2022/2025 Hyper-V', 'Proxmox VE Cluster'] },
      { category: 'Storage Stacks', items: ['Dell PowerVault ME5', 'Synology Enterprise RackStation', 'TrueNAS Enterprise', 'iSCSI / NFS v4.1 / NVMe-oF'] },
      { category: 'Backup & DR', items: ['Veeam Backup & Replication', 'Linux Hardened Repository', 'Nakivo Backup & Replication', 'Storage Replica'] },
      { category: 'Hardware Platforms', items: ['Dell PowerEdge R660/R760', 'HPE ProLiant Gen10/Gen11', 'Intel Xeon Scalable', 'AMD EPYC Genoa/Bergamo'] }
    ],
    caseStudy: {
      headline: 'Manufacturing Plant: Aging Physical Servers to High-Availability Cluster',
      challenge: 'A Central Florida manufacturing facility relied on five aging, standalone physical servers with single power supplies and outdated mechanical disk arrays that threatened production halts.',
      solution: 'Steve Cormier engineered a dual-node Dell PowerEdge R660 high-availability cluster with 512GB ECC RAM per host, redundant 10GbE SFP+ uplinks, and a 48TB all-flash NVMe SAN, converting all physical servers to virtual machines after hours.',
      result: '100% elimination of single points of failure, backup execution window reduced from 7 hours to 22 minutes, and zero minutes of production downtime during transition.'
    }
  },
  {
    code: 'SYS-03',
    slug: 'hardening',
    category: 'Security & Hardening Architecture',
    title: 'Server & Network Hardening',
    shortTitle: 'Server & Network Hardening',
    metaDesc: 'CIS Benchmark Level 2 server hardening, zero-trust network segmentation, Active Directory privilege tiering, and attack surface reduction by Steve Cormier.',
    schematic: '/images/schematics/vlan-firewall-matrix.svg',
    schematicAlt: 'VLAN Firewall Matrix and East-West Segmentation Architectural Schematic',
    lead: 'Defensive systems engineering, CIS Benchmark OS lockdowns, zero-trust East-West network segmentation, and Active Directory privilege tiering to eliminate ransomware lateral movement.',
    metrics: [
      { label: 'COMPLIANCE BASELINE', value: 'CIS Level 2 Hardened', sub: 'GPO & DSC automated baselines' },
      { label: 'ATTACK SURFACE', value: '92% Exposure Reduction', sub: 'Legacy protocols eliminated' },
      { label: 'PRIVILEGE TIERING', value: 'Tier 0 / 1 / 2 Model', sub: 'Zero cross-tier admin tokens' },
      { label: 'CRYPTOGRAPHY', value: 'TLS 1.3 Strict Ciphers', sub: 'AES-256 GCM authenticated' }
    ],
    capabilities: [
      {
        area: 'CIS Benchmark OS Hardening',
        desc: 'Automated Group Policy and PowerShell DSC baselines implementing Center for Internet Security (CIS) Level 1 and Level 2 security controls across Windows Server and Linux hosts.'
      },
      {
        area: 'East-West Internal Segmentation',
        desc: 'Elimination of flat corporate networks through Layer 3 inter-VLAN stateful inspection, restricting lateral traffic between endpoints, application tiers, and database engines.'
      },
      {
        area: 'Active Directory Privilege Tiering',
        desc: 'Strict structural separation between Tier 0 (Domain Controllers, PKI), Tier 1 (Member Servers, Storage), and Tier 2 (Workstations), blocking Pass-the-Hash and Kerberoasting attacks.'
      },
      {
        area: 'Attack Surface Reduction',
        desc: 'Systematic disabling of insecure legacy protocols including SMBv1, NetBIOS over TCP/IP, LLMNR, NTLMv1, TLS 1.0/1.1, and unauthenticated RPC services.'
      },
      {
        area: 'Local Administrator Password Solution',
        desc: 'Deployment of Windows LAPS with automated, randomized 24-character local administrator passwords escrowed cryptographically to Entra ID or Active Directory.'
      },
      {
        area: 'Immutable Audit Logging & Syslog',
        desc: 'Centralized forwarding of Windows Security Event Logs, Sysmon telemetry, and firewall flows to an isolated, tamper-proof syslog vault for rapid incident forensics.'
      }
    ],
    platforms: [
      { category: 'Standards & Frameworks', items: ['CIS Benchmarks Level 1 & 2', 'NIST SP 800-53 Rev 5', 'MITRE ATT&CK Mitigation Matrix', 'HIPAA Security Rule § 164.312'] },
      { category: 'Identity Hardening', items: ['Windows LAPS', 'Active Directory Administrative Tiering', 'Kerberos Armoring', 'Protected Users Group'] },
      { category: 'Perimeter & Firewalls', items: ['Fortinet FortiOS', 'pfSense Plus Hardware Appliance', 'OPNsense Core', 'Palo Alto Networks PAN-OS'] },
      { category: 'Telemetry & Auditing', items: ['Sysmon (System Monitor)', 'Elastic Agent / Beats', 'Graylog Immutable Syslog', 'Snort / Suricata IDS'] }
    ],
    caseStudy: {
      headline: 'Commercial Contractor: Flat Subnet Remediation & Cyber Insurance Compliance',
      challenge: 'A commercial contractor was denied cyber insurance renewal due to a flat 192.168.1.0/24 subnet, shared local administrator credentials across 65 workstations, and unsegmented HVAC controller access.',
      solution: 'Steve Cormier re-engineered the network into five isolated 802.1Q VLANs with strict firewall rules, enforced CIS Level 2 GPO baselines, deployed Microsoft LAPS, and disabled LLMNR/NBT-NS.',
      result: 'Achieved 100% sign-off from the cyber insurance underwriter, reduced external attack surface by 92%, and quarantined building automation systems from production corporate data.'
    }
  },
  {
    code: 'SYS-04',
    slug: 'voip-ippbx',
    category: 'Telephony & Voice Systems',
    title: 'VoIP Phone Systems & IP-PBX SIP Trunking',
    shortTitle: 'VoIP Phone Systems & SIP',
    metaDesc: 'Enterprise IP-PBX phone systems, redundant carrier SIP trunking, QoS voice VLAN prioritization, and E911 compliance by Steve Cormier.',
    schematic: '/images/schematics/voip-sip-topology.svg',
    schematicAlt: 'VoIP SIP Trunking and Quality of Service Network Schematic',
    lead: 'Carrier-grade IP-PBX telephony architecture, redundant SIP trunk routing, Layer 2/3 QoS voice prioritization, and dynamic E911 compliance for modern distributed businesses.',
    metrics: [
      { label: 'VOICE QUALITY', value: 'MOS Score 4.4+ Peak', sub: 'Zero audible jitter or packet drop' },
      { label: 'QOS PRIORITY', value: 'DSCP 46 / EF Tagged', sub: 'Layer 2/3 strict priority queue' },
      { label: 'CARRIER DIVERSITY', value: 'Dual Active/Standby', sub: 'Sub-second SIP trunk failover' },
      { label: 'E911 COMPLIANCE', value: 'RAY BAUMS & Karis Law', sub: 'Automated dispatchable address' }
    ],
    capabilities: [
      {
        area: 'Enterprise IP-PBX Telephony Architecture',
        desc: 'On-premises appliance, cloud-hosted, and hybrid IP-PBX deployments featuring automated multi-level attendants (IVR), department hunt groups, and dynamic holiday routing.'
      },
      {
        area: 'Redundant SIP Trunking & Failover',
        desc: 'Dual-carrier SIP trunk connections with automated route advance, disaster recovery call forwarding to mobile devices, and uncompressed HD voice audio codecs.'
      },
      {
        area: 'Voice VLAN Segmentation & DSCP QoS',
        desc: 'Dedicated 802.1Q voice VLANs configured with 802.1p CoS and DiffServ DSCP 46 Expedited Forwarding (EF) queues to prevent voice stutter during peak file transfers.'
      },
      {
        area: 'Remote Workforce Mobile Softphones',
        desc: 'Hardened WebRTC and SIP-over-TLS softphones for iOS, Android, macOS, and Windows with push notification wake-up and encrypted audio streams.'
      },
      {
        area: 'E911 Dispatchable Location Compliance',
        desc: 'Full regulatory compliance with Kari’s Law (direct 911 dialing without prefix) and RAY BAUM’S Act (automated desk-level dispatchable location transmission).'
      },
      {
        area: 'Call Recording & CRM Integration',
        desc: 'Encrypted call recording archives, voicemail-to-email transcription, and bi-directional CRM screen pop integration for sales and customer support teams.'
      }
    ],
    platforms: [
      { category: 'IP-PBX Platforms', items: ['3CX Titanium / Enterprise', 'FreePBX / Asterisk Engine', 'Grandstream UCM Enterprise', 'Yeastar S-Series'] },
      { category: 'Voice Hardware', items: ['Yealink T4U / T5 Series Gigabit', 'Poly VVX HD Voice Phones', 'Grandstream GRP Series', 'Fanvil SIP Paging Endpoints'] },
      { category: 'Carrier & Trunking', items: ['Bandwidth.com Direct SIP', 'Telnyx Enterprise Trunking', 'Twilio Elastic SIP', 'Flowroute Carrier Services'] },
      { category: 'Codecs & Protocols', items: ['SIP RFC 3261', 'SRTP (Secure RTP)', 'TLS 1.3 Signaling', 'G.722 HD Audio / Opus Wideband'] }
    ],
    caseStudy: {
      headline: 'Regional Logistics Hub: Slashing $3,400/Mo Telecom Bills',
      challenge: 'A multi-branch distribution business paid $3,400 monthly for legacy copper analog PRI circuits that dropped calls during rainstorms and lacked remote work capabilities.',
      solution: 'Steve Cormier deployed a redundant IP-PBX platform with dual active/standby carrier SIP trunks over primary fiber and cellular backup, installed 65 Yealink gigabit PoE desktop phones, and mapped dynamic E911 locations.',
      result: 'Telecom billing reduced from $3,400/mo to $680/mo (80% recurring cost reduction), call completion rate reached 99.999%, and remote staff gained seamless mobile softphone access.'
    }
  },
  {
    code: 'SYS-05',
    slug: 'network-management',
    category: 'Network & Core Switching Fabric',
    title: 'Enterprise Network Management',
    shortTitle: 'Enterprise Network Mgmt',
    metaDesc: 'Managed Layer 2/3 core switching, enterprise Wi-Fi 6E/7 controller deployments, multi-WAN BGP failover, and WireGuard site-to-site VPNs by Steve Cormier.',
    schematic: '/images/schematics/network-l2-l3-topology.svg',
    schematicAlt: 'Enterprise Layer 2/3 Switching and Multi-WAN Network Fabric Schematic',
    lead: 'Rock-solid enterprise network engineering, managed Layer 2/3 core switching, multi-gigabit Wi-Fi 6E/7 coverage, multi-WAN carrier failover, and deep packet diagnostics.',
    metrics: [
      { label: 'SWITCHING CAPACITY', value: 'Line-Rate Multi-Gig', sub: 'Non-blocking backplane fabric' },
      { label: 'CORE AGGREGATION', value: '20Gbps MLAG Bond', sub: 'Cross-switch link redundancy' },
      { label: 'WIRELESS PROTOCOL', value: 'Wi-Fi 6E & Wi-Fi 7', sub: '802.1X enterprise certificate auth' },
      { label: 'TUNNEL ENCRYPTION', value: 'WireGuard & IPsec', sub: 'AES-256 GCM hardware offload' }
    ],
    capabilities: [
      {
        area: 'Managed Layer 2/3 Core Switching',
        desc: 'Core, distribution, and access tier switch architecture with multi-chassis link aggregation (MLAG), Rapid Spanning Tree (RSTP/MSTP) loop protection, and 802.1Q trunking.'
      },
      {
        area: 'High-Density Enterprise Wi-Fi',
        desc: 'Predictive RF spectrum planning, 6GHz Wi-Fi 6E/7 deployment, dynamic channel power allocation, 802.1X EAP-TLS certificate security, and 802.11r/k/v fast seamless roaming.'
      },
      {
        area: 'Multi-WAN Failover & Dynamic Routing',
        desc: 'Dual-carrier WAN integration with sub-second health probing, BGP/OSPF dynamic routing, and policy-based routing (PBR) prioritizing mission-critical cloud traffic.'
      },
      {
        area: 'Site-to-Site & Mesh VPN Networks',
        desc: 'High-throughput WireGuard and IPsec VPN mesh connecting corporate headquarters, branch sites, and colocation facilities with automated tunnel health monitoring.'
      },
      {
        area: 'Packet-Level Diagnostics & Telemetry',
        desc: 'Real-time NetFlow/sFlow collector analysis, SNMPv3 encrypted metrics, port mirroring for deep packet inspection, and automated rogue DHCP server suppression.'
      },
      {
        area: 'Power over Ethernet (PoE++) Architecture',
        desc: 'Dedicated 802.3bt PoE++ budget management ensuring uninterrupted power delivery to high-draw access points, pan-tilt-zoom security cameras, and VoIP touchscreens.'
      }
    ],
    platforms: [
      { category: 'Switching & Routing', items: ['Cisco Catalyst / CBS Series', 'Aruba CX 6000 / 6100 Series', 'Ubiquiti UniFi Enterprise Switching', 'MikroTik Cloud Router Switches'] },
      { category: 'Wireless Architecture', items: ['UniFi Wi-Fi 6E / Wi-Fi 7 Pro', 'Aruba Instant On / AP Series', 'Ruckus Unleashed Controller', 'Ekahau Site Survey Tooling'] },
      { category: 'Firewalls & Gateways', items: ['pfSense Plus Netgate Appliances', 'OPNsense High-Availability CARP', 'Fortinet FortiGate Next-Gen', 'WireGuard Mesh Network'] },
      { category: 'Protocols & Standards', items: ['802.1Q VLAN Tagging', '802.1X Dynamic RADIUS EAP', '802.3ad LACP Trunking', 'BGP / OSPF / RSTP / VRRP'] }
    ],
    caseStudy: {
      headline: '40,000 Sq Ft Industrial Warehouse: Eliminating Wireless Dead Zones',
      challenge: 'A Central Florida logistics facility experienced constant handheld scanner disconnects, stalled picking orders, and severe RF attenuation caused by metal racking and structural steel.',
      solution: 'Steve Cormier performed an on-site RF spectrum analysis, deployed dual 48-port PoE++ core switches with 10G fiber backbones, installed 14 enterprise Wi-Fi 6E APs with directional antenna profiling, and configured 802.11r fast roaming.',
      result: 'Zero wireless drops across 100% of the 40,000 sq ft facility, roaming handover latency dropped from 1,200ms to under 18ms, and daily warehouse picking throughput increased by 22%.'
    }
  },
  {
    code: 'SYS-06',
    slug: 'mobile-device-management',
    category: 'Endpoint & Mobility Architecture',
    title: 'Mobile Device Management (MDM)',
    shortTitle: 'Mobile Device Management',
    metaDesc: 'Enterprise Mobile Device Management (MDM), Microsoft Intune, Apple Business Manager zero-touch provisioning, and BYOD containerization by Steve Cormier.',
    schematic: '/images/schematics/mdm-conditional-access.svg',
    schematicAlt: 'Mobile Device Management and Zero-Trust Posture Architectural Schematic',
    lead: 'Unified mobile endpoint governance, zero-touch Apple and Android device enrollment, air-gapped BYOD application protection, and rapid cryptographic remote wiping.',
    metrics: [
      { label: 'PROVISIONING METHOD', value: 'Zero-Touch Enrollment', sub: 'Apple ABM & Windows Autopilot' },
      { label: 'BYOD ISOLATION', value: 'MAM Sandbox Container', sub: 'Cut/copy/paste strictly blocked' },
      { label: 'COMPLIANCE AUDIT', value: 'Real-Time Evaluation', sub: 'Automated jailbreak/root lock' },
      { label: 'REMOTE WIPE SPEED', value: 'Sub-60 Second Erase', sub: 'Instant cryptographic purging' }
    ],
    capabilities: [
      {
        area: 'Zero-Touch Automated Provisioning',
        desc: 'Integration with Apple Business Manager (ABM), Android Enterprise Zero-Touch, and Windows Autopilot to deliver corporate-ready hardware directly to users without IT unboxing.'
      },
      {
        area: 'BYOD Containerization (MAM)',
        desc: 'Mobile Application Management without enrollment, isolating corporate Outlook, Teams, and OneDrive files inside an encrypted sandbox while preserving personal privacy on employee-owned phones.'
      },
      {
        area: 'Conditional Access Posture Checks',
        desc: 'Blocking authentication requests from devices that fail compliance benchmarks (outdated OS versions, disabled screen lock passcodes, detected root/jailbreak, or missing disk encryption).'
      },
      {
        area: 'Selective & Full Remote Wipe',
        desc: 'Instant cryptographic erasure of corporate credentials and cached files upon employee termination or lost device report, without touching personal photos or apps.'
      },
      {
        area: 'Automated Certificate & Wi-Fi Push',
        desc: 'Seamless distribution of enterprise 802.1X certificates, always-on VPN configuration profiles, and corporate Wi-Fi credentials without exposing passwords to end users.'
      },
      {
        area: 'Kiosk & Single-App Lock Mode',
        desc: 'Locking warehouse handhelds, retail POS tablets, and healthcare check-in terminals into single-app kiosk modes preventing user tampering and unauthorized web browsing.'
      }
    ],
    platforms: [
      { category: 'MDM Platforms', items: ['Microsoft Intune Endpoint Manager', 'Apple Business Manager (ABM)', 'Android Enterprise / Samsung Knox', 'Windows Autopilot Deployment'] },
      { category: 'Supported Operating Systems', items: ['Apple iOS 16/17/18', 'Apple iPadOS & macOS Sonoma/Sequoia', 'Android 12 through 15', 'Windows 10 / 11 Enterprise & Pro'] },
      { category: 'Authentication & SCEP', items: ['SCEP / NDES Certificate Delivery', 'FIDO2 WebAuthn Passkeys', 'Microsoft Authenticator Push', 'Intune Company Portal'] },
      { category: 'Policy Engines', items: ['App Protection Policies (MAM)', 'Device Compliance Baselines', 'BitLocker Hardware Encryption', 'FileVault 2 Encryption Key Escrow'] }
    ],
    caseStudy: {
      headline: 'Legal Practice: Air-Gapping Client Records on Mobile Devices',
      challenge: 'A Central Florida legal firm had 45 attorneys accessing confidential litigation documents on personal iPhones and iPads without corporate encryption, risking severe client privilege breaches.',
      solution: 'Steve Cormier deployed Microsoft Intune Mobile Application Management (MAM) with Conditional Access, enforced biometric FaceID unlock on corporate apps, disabled cut/copy/paste into personal apps, and enabled one-click corporate wipe.',
      result: '100% of confidential client documents air-gapped from personal apps, complete compliance with Florida Bar digital privacy guidelines, and zero loss of personal employee data.'
    }
  },
  {
    code: 'SYS-07',
    slug: 'remote-desktop',
    category: 'Virtual Workspace & RDS',
    title: 'Remote Desktop & Workforce Infrastructure',
    shortTitle: 'Remote Desktop Services',
    metaDesc: 'Hardened Remote Desktop Services (RDS), Windows Server terminal farms, MFA remote gateways, and FSLogix profile containers by Steve Cormier.',
    schematic: '/images/schematics/rds-workforce-topology.svg',
    schematicAlt: 'Hardened Remote Desktop and Virtual Workforce Fabric Architectural Schematic',
    lead: 'Hardened remote workspace engineering, secure DMZ reverse proxy gateways, multi-factor authentication, low-latency session farms, and sub-3-second profile load times.',
    metrics: [
      { label: 'GATEWAY SECURITY', value: 'Port 443 HTTPS Only', sub: 'Zero port 3389 RDP exposed to WAN' },
      { label: 'SESSION LATENCY', value: 'Sub-15ms Local Fabric', sub: 'Sub-45ms broadband connection' },
      { label: 'CONCURRENT CAPACITY', value: '10 to 250+ Sessions', sub: 'Load-balanced RDSH session hosts' },
      { label: 'LOGON DURATION', value: 'FSLogix Sub-3 Seconds', sub: 'Instant dynamic profile mount' }
    ],
    capabilities: [
      {
        area: 'Hardened DMZ Gateway Architecture',
        desc: 'Terminating external remote workforce connections exclusively over HTTPS port 443 with strict TLS 1.3 ciphers, completely sealing internal RDP port 3389 from Internet attack.'
      },
      {
        area: 'Mandatory Multi-Factor Authentication',
        desc: 'Integrating Microsoft Entra ID MFA, Duo Security, or RADIUS push approvals at the gateway layer before any internal session connection is permitted.'
      },
      {
        area: 'High-Availability RDSH Server Farms',
        desc: 'Load-balanced Windows Server 2022/2025 Remote Desktop Session Host clusters with connection broker intelligence, automated session reconnection, and maintenance draining.'
      },
      {
        area: 'FSLogix Dynamic Profile Containers',
        desc: 'Eliminating roaming profile corruption by storing user profiles in VHDX containers mounted dynamically over SMB3, cutting logon times from 45 seconds to under 3 seconds.'
      },
      {
        area: 'Granular Data Loss Prevention Policies',
        desc: 'Group Policy lockdown of client drive redirection, clipboard sharing, printer passthrough, and screen capture based on user security classification and network location.'
      },
      {
        area: 'GPU-Accelerated Remote Sessions',
        desc: 'Discrete Device Assignment (DDA) allocating physical graphics hardware to virtual desktops for smooth CAD rendering, architectural modeling, and high-DPI multi-monitor displays.'
      }
    ],
    platforms: [
      { category: 'RDS Infrastructure', items: ['Windows Server 2022/2025 RDS', 'Remote Desktop Gateway (RDGW)', 'Remote Desktop Connection Broker', 'Remote Desktop Web Access'] },
      { category: 'Profile & Acceleration', items: ['FSLogix Profile & Office Containers', 'Azure Virtual Desktop (AVD)', 'Citrix Virtual Apps Integration', 'RemoteFX / GPU Hardware Passthrough'] },
      { category: 'Security & Auth', items: ['Microsoft Entra MFA Gateway', 'Duo Security RDS Proxy', 'Network Level Authentication (NLA)', 'TLS 1.3 Strict Cipher Suites'] },
      { category: 'Client Endpoints', items: ['Microsoft Remote Desktop Client', 'Dell Wyse Thin Clients', 'IGEL OS Thin Endpoints', 'Windows / macOS / iOS Clients'] }
    ],
    caseStudy: {
      headline: 'Accounting Firm: Supporting 50 Remote Accountants During Tax Season',
      challenge: 'A CPA firm with 50 accountants faced severe performance slowdowns, broken roaming profiles, and security vulnerabilities from employees accessing tax databases via unsecured RDP ports.',
      solution: 'Steve Cormier built a 3-node Windows Server 2025 RDSH farm behind a hardened DMZ RD Gateway with Duo MFA, migrated user profiles to high-speed FSLogix containers, and locked down local drive mapping.',
      result: 'Logon times plummeted from 52 seconds to 2.8 seconds, 100% elimination of Internet-exposed RDP ports, and zero downtime across the entire high-intensity tax season.'
    }
  },
  {
    code: 'SYS-08',
    slug: 'onsite-support',
    category: 'Field Engineering & Physical Infrastructure',
    title: 'Onsite Engineering & Field Support',
    shortTitle: 'Onsite Support & Dispatch',
    metaDesc: 'Direct Central Florida onsite IT engineering dispatch, server rack elevation buildouts, structured cabling diagnostics, and hardware recovery by Steve Cormier.',
    schematic: '/images/schematics/rack-elevation.svg',
    schematicAlt: 'Server Rack Elevation and Power Distribution Architectural Schematic',
    lead: 'Rapid physical onsite dispatch across Orlando, Kissimmee, and Central Florida. Server rack buildouts, structured cabling certification, and emergency hardware recovery led directly by Steve Cormier.',
    metrics: [
      { label: 'DISPATCH TERRITORY', value: 'Orlando & Kissimmee', sub: 'Orange, Osceola & Seminole Counties' },
      { label: 'EMERGENCY SLA', value: '1-to-2 Hour Rapid Arrival', sub: 'Direct dispatch: (407) 917-5250' },
      { label: 'FIELD PRINCIPAL', value: 'Steve Cormier Onsite', sub: '36 years hands-on field experience' },
      { label: 'DIAGNOSTIC GEAR', value: 'Fluke Network Analyzers', sub: 'Hardware hot-spares on truck' }
    ],
    capabilities: [
      {
        area: 'Orlando & Kissimmee Emergency Onsite Dispatch',
        desc: 'Rapid physical presence for critical server room outages, hardware failures, severed network links, and power disruptions across Central Florida business corridors.'
      },
      {
        area: 'Server Rack Buildouts & Elevation Standards',
        desc: 'Professional 42U rack mounting, PDU power phase balancing, clean patch panel termination, velcro cable combing, and cold-aisle/hot-aisle thermal airflow optimization.'
      },
      {
        area: 'Structured Cabling Certification & Repair',
        desc: 'Testing and certification of Category 6/6A copper and OM3/OM4 fiber optic runs using calibrated Fluke Networks analyzers for wiremap, near-end crosstalk (NEXT), and loss.'
      },
      {
        area: 'Physical Hardware Triage & Recovery',
        desc: 'Motherboard replacements, hot-spare RAID disk rebuilds, power supply replacements, IPMI/iDRAC provisioning, and SAN shelf component swaps.'
      },
      {
        area: 'Office Relocations & Datacenter Moves',
        desc: 'White-glove un-racking, secure physical transport, precision re-racking, structured cabling cutovers, and carrier ISP fiber turn-up during evening and weekend maintenance windows.'
      },
      {
        area: 'UPS & Power Distribution Architecture',
        desc: 'Installation of commercial APC and Eaton online double-conversion UPS units, automatic transfer switches (ATS), and remote SNMP battery health monitoring.'
      }
    ],
    platforms: [
      { category: 'Enclosures & Racks', items: ['APC NetShelter SX 42U / 48U', 'Tripp Lite SmartRack Enclosures', 'Dell PowerEdge Toolless Rails', 'Chatsworth Cable Management'] },
      { category: 'Cabling & Fiber', items: ['Cat6 / Cat6A Solid Copper UTP', 'OM3 / OM4 Multi-Mode 10G Fiber', 'OS2 Single-Mode Carrier Fiber', 'LC / SC Polish & Fusion Splicing'] },
      { category: 'Diagnostic Equipment', items: ['Fluke Networks DSX CableAnalyzer', 'Optical Time-Domain Reflectometer (OTDR)', 'Tone & Probe Wire Tracers', 'Thermal Imaging Cameras'] },
      { category: 'Power Infrastructure', items: ['APC Smart-UPS On-Line RT', 'Eaton 9PX Double-Conversion UPS', 'APC Automatic Transfer Switches (ATS)', 'CyberPower Switched PDUs'] }
    ],
    caseStudy: {
      headline: 'Kissimmee Medical Facility: Emergency Lightning Surge Recovery',
      challenge: 'A lightning strike at 7:15 AM fried the main UPS battery backup and core access switch at a busy Kissimmee medical center, threatening cancellation of 80 patient appointments.',
      solution: 'Steve Cormier arrived onsite within 38 minutes carrying a pre-configured enterprise managed switch and commercial online UPS, bypassed the fried gear, patched the core VLANs, and verified electronic health record server connectivity.',
      result: 'All clinical systems returned to 100% operational status by 8:30 AM before the first scheduled patient entered the clinic, preventing tens of thousands of dollars in lost billing.'
    }
  },
  {
    code: 'SYS-09',
    slug: 'it-consultancy',
    category: 'Strategic Advisory & vCTO',
    title: 'Principal IT Consultancy & Systems Architecture',
    shortTitle: 'IT Consultancy & vCTO',
    metaDesc: '36 years of vendor-neutral IT consultancy, infrastructure audits, M&A technical due diligence, and capital planning since 1990 by Steve Cormier.',
    schematic: '/images/schematics/consultancy-audit-roadmap.svg',
    schematicAlt: 'Principal Architectural Audit and Lifecycle Roadmap Schematic',
    lead: 'Vendor-neutral systems architecture, comprehensive infrastructure audits, M&A technical due diligence, and strategic cap-ex budgeting backed by 36 years of executive technology leadership.',
    metrics: [
      { label: 'INDUSTRY EXPERIENCE', value: '36 Years Systems Leadership', sub: 'Established 1990 in Orlando, FL' },
      { label: 'VENDOR POSITION', value: '100% Vendor Neutral', sub: 'Zero reseller quotas or kickbacks' },
      { label: 'ADVISORY SCOPE', value: 'vCTO & Cap-Ex Budgeting', sub: 'M&A diligence & lifecycle planning' },
      { label: 'PRINCIPAL ENGAGEMENT', value: 'Direct Steve Cormier', sub: 'Air Force vet & VP Support' }
    ],
    capabilities: [
      {
        area: '36-Year Vendor-Neutral Infrastructure Audits',
        desc: 'Uncompromising technical assessments examining physical cabling, hypervisors, storage arrays, Active Directory health, licensing compliance, and security postures.'
      },
      {
        area: 'M&A Technical Due Diligence',
        desc: 'Pre-acquisition evaluations identifying hidden IT debt, unpatched legacy liabilities, software licensing compliance risks, and domain consolidation requirements for corporate buyers.'
      },
      {
        area: 'Cap-Ex & Op-Ex Strategic Lifecycle Roadmaps',
        desc: '3-to-5 year capital expense budgeting plans that align hardware refresh cycles with corporate growth, eliminating emergency capital calls and bloated vendor pricing.'
      },
      {
        area: 'Disaster Recovery (BCDR) Formulations',
        desc: 'Drafting documented, attested business continuity runbooks with validated Recovery Point Objectives (RPO) and Recovery Time Objectives (RTO) proven through simulated drills.'
      },
      {
        area: 'Carrier Contract & Telecom RFP Evaluation',
        desc: 'Objective, vendor-neutral analysis of fiber DIA proposals, cloud telephony contracts, and software licensing enterprise agreements to slash vendor margins.'
      },
      {
        area: 'Virtual CTO & Executive Governance',
        desc: 'Executive-level technology representation during board meetings, compliance audits, investor technical reviews, and strategic enterprise planning sessions.'
      }
    ],
    platforms: [
      { category: 'Governance & Frameworks', items: ['NIST Cybersecurity Framework (CSF)', 'CIS Critical Security Controls', 'ITIL Service Management', 'HIPAA / PCI-DSS Audit Prep'] },
      { category: 'Auditing Tooling', items: ['Network Topology Mapping', 'Active Directory Analyzer', 'Vulnerability Assessment Scanners', 'Telecom Billing Audit Tools'] },
      { category: 'Strategic Documents', items: ['Executive Risk Registers', '3-5 Year IT Cap-Ex Budgets', 'BCDR Operational Runbooks', 'M&A Technical Diligence Memorandums'] },
      { category: 'Vendor Oversight', items: ['Tier-1 ISP Contract Audits', 'Microsoft Enterprise Agreements', 'Hardware Warranty Refresh Sizing', 'Colocation & Datacenter SLAs'] }
    ],
    caseStudy: {
      headline: 'Private Equity M&A: Identifying $140,000 in Hidden IT Liabilities',
      challenge: 'A private equity group was 14 days from closing the acquisition of an Orlando engineering firm whose internal IT documentation was sparse and unverified.',
      solution: 'Steve Cormier performed an intensive 72-hour on-site architectural audit, discovering that primary CAD file servers were five years past warranty, offsite backups had failed silently for six months, and software licenses were under-reported.',
      result: 'Armed with the architectural risk memorandum, the buyer negotiated a $140,000 purchase price reduction and implemented a turnkey modernization plan immediately upon close.'
    }
  },
  {
    code: 'SYS-10',
    slug: 'ai-implementation',
    category: 'Enterprise AI & Automation',
    title: 'Enterprise AI Implementation, Copilot Governance & Workflow Automation',
    shortTitle: 'Enterprise AI & Copilot',
    metaDesc: 'Enterprise AI implementation, Microsoft 365 Copilot permission audits, sovereign air-gapped LLM deployment, and support workflow automation by Steve Cormier.',
    schematic: '/images/schematics/ai-rag-copilot-pipeline.svg',
    schematicAlt: 'Enterprise AI Architecture, Copilot Governance and RAG Pipeline Schematic',
    lead: 'Practical enterprise artificial intelligence deployment, pre-Copilot permission governance, sovereign air-gapped LLM systems, and intelligent workflow automation built for data sovereignty.',
    metrics: [
      { label: 'DATA SOVEREIGNTY', value: '100% Air-Gapped Option', sub: 'Zero data leakage to external models' },
      { label: 'COPILOT AUDITING', value: 'Zero Sensitive Oversharing', sub: 'SharePoint & Purview ACL lockdown' },
      { label: 'WORKFLOW TRIAGE', value: '65% Resolution Speedup', sub: 'Tier-1 ticket deflection agents' },
      { label: 'AUDIT PROVENANCE', value: 'Cryptographic Citation', sub: 'Verifiable document chunk provenance' }
    ],
    capabilities: [
      {
        area: 'Microsoft 365 Copilot Permission Auditing',
        desc: 'Exhaustive pre-AI security audit across SharePoint, Teams, and OneDrive to ensure confidential HR files, executive salaries, and strategic memos are never indexed or exposed by Copilot to unauthorized staff.'
      },
      {
        area: 'Private & Sovereign LLM Deployment',
        desc: 'On-premises and sovereign cloud deployment of open-weight models (Llama 3, Mistral, Qwen) using Ollama and vLLM where corporate data never leaves your hardware boundary.'
      },
      {
        area: 'Enterprise Retrieval-Augmented Generation (RAG)',
        desc: 'High-accuracy vector knowledge bases built on PostgreSQL 16 pgvector, BM25 hybrid search, and strict document-level access controls with verifiable citations.'
      },
      {
        area: 'Helpdesk & Ticket Triage Automation',
        desc: 'Intelligent triage and ticket routing agents built on Steve’s 16+ years architecting global customer support organizations in enterprise healthcare RTLS, deflecting routine issues and accelerating escalations.'
      },
      {
        area: 'AI Security Policy & Inbound Prompt WAF',
        desc: 'Enforcing Data Loss Prevention (DLP) guardrails, automated redaction of sensitive PII/secrets in outbound prompts, and protection against prompt injection attacks.'
      },
      {
        area: 'Executive & Staff Enablement Workshops',
        desc: 'Practical, no-nonsense staff training on workflow prompt engineering, safe AI utilization, and measurable productivity improvements without corporate exposure.'
      }
    ],
    platforms: [
      { category: 'Enterprise AI Engines', items: ['Microsoft 365 Copilot', 'Microsoft Purview AI Hub', 'Ollama Sovereign Server', 'vLLM Inference Engine'] },
      { category: 'Vector & Data Stacks', items: ['PostgreSQL 16 with pgvector', 'Hybrid BM25 Keyword Search', 'LlamaIndex Enterprise Framework', 'Sentence-Transformers'] },
      { category: 'Automation & Guardrails', items: ['NeMo Guardrails Prompt WAF', 'Presidio PII Redaction Engine', 'Webhook Workflow Automation', 'SmarterMail AI Triage Relay'] },
      { category: 'Open-Weight Models', items: ['Llama 3.3 70B & 8B', 'Mistral Large 2 & Nemo', 'DeepSeek R1 Distill Stacks', 'Qwen 2.5 Coder & Instruct'] }
    ],
    caseStudy: {
      headline: 'Engineering Consultancy: Safe Microsoft 365 Copilot Rollout',
      challenge: 'A 70-person engineering consultancy halted its Microsoft 365 Copilot rollout after a pilot user discovered internal executive salary spreadsheets during an innocent Copilot search prompt.',
      solution: 'Steve Cormier conducted an automated permissions remediation across 240 SharePoint libraries, enforced Microsoft Purview sensitivity labels, established restricted Copilot user security groups, and deployed outbound DLP guardrails.',
      result: 'Safely re-launched Copilot across all 70 engineers with zero data leakage incidents, boosting technical report and RFP proposal drafting speed by 40%.'
    }
  }
];

// Helper: Global Navigation Bar
function renderHeader(activePath = '') {
  return `
  <!-- ===================================================================== -->
  <!-- 0. TOP TECHNICAL TELEMETRY BAR & STICKY ARCHITECTURAL HEADER          -->
  <!-- ===================================================================== -->
  <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md hairline-b">
    <!-- Monospace Telemetry Strip -->
    <div class="bg-brand-slate text-white text-[11px] font-mono font-bold tracking-wider uppercase py-2 px-4 hairline-b">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-2.5 min-w-0">
          <span class="inline-block w-2 h-2 rounded-none bg-emerald-400 animate-pulse shrink-0"></span>
          <span class="truncate">EST. 1990 // 36 YEARS ENTERPRISE INFRASTRUCTURE ENGINEERING &bull; CENTRAL FLORIDA ONSITE &amp; NATIONWIDE REMOTE</span>
        </div>
        <div class="flex items-center gap-4 text-[10px] shrink-0">
          <a href="#logo-studio" onclick="window.TS_LOGO_STUDIO?.openModal(); return false;" class="text-sky-300 hover:text-white transition-colors flex items-center gap-1.5 font-mono text-[10px] font-bold"><span class="w-1.5 h-1.5 bg-emerald-400 animate-pulse"></span>LOGO STUDIO (10)</a>
          <a href="tel:+14079175250" class="text-blue-200 hover:text-white transition-colors">DIRECT DISPATCH: (407) 917-5250</a>
          <span class="text-emerald-400 font-extrabold hidden sm:inline">&bull; STATUS: ALL MANAGED CLUSTERS NOMINAL</span>
        </div>
      </div>
    </div>

    <!-- Main Architectural Nav -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-20">
        <!-- Logo & Monogram Unit -->
        <a href="/" class="flex items-center gap-3 group shrink-0">
          <img id="site-header-logo" src="/images/logos/concept-01-mark.svg" onerror="this.onerror=null;this.src='/images/logo.png';" alt="Technology Specialist Logo" class="h-10 w-10 sm:h-11 sm:w-11 object-contain shrink-0" />
          <div class="flex flex-col justify-center whitespace-nowrap">
            <div class="font-heading text-base sm:text-lg font-extrabold tracking-tight text-brand-slate leading-none uppercase">
              TECHNOLOGY <span class="text-brand-cobalt">SPECIALIST</span>
            </div>
            <div class="font-mono text-[9px] sm:text-[10px] font-bold text-slate-500 tracking-widest uppercase mt-1 leading-none">
              EST. 1990 // ENTERPRISE SYSTEMS
            </div>
          </div>
        </a>

        <!-- Desktop Navigation Matrix -->
        <nav class="hidden lg:flex items-center gap-1 font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap">
          <a href="/services" data-mm-trigger="services" class="px-3 py-2 hover:text-brand-cobalt hover:bg-slate-50 transition-colors flex items-center gap-1 whitespace-nowrap ${activePath.startsWith('/services') ? 'text-brand-cobalt bg-slate-50' : ''}">
            <span>Practice Areas</span>
            <span class="text-[9px] text-slate-400">&darr;</span>
          </a>
          <a href="/about" data-mm-trigger="company" class="px-3 py-2 hover:text-brand-cobalt hover:bg-slate-50 transition-colors flex items-center gap-1 whitespace-nowrap ${activePath === '/about' ? 'text-brand-cobalt bg-slate-50' : ''}">
            <span>Leadership</span>
            <span class="text-[9px] text-slate-400">&darr;</span>
          </a>
          <a href="/tools" class="px-3 py-2 hover:text-brand-cobalt hover:bg-slate-50 transition-colors whitespace-nowrap ${activePath === '/tools' ? 'text-brand-cobalt font-extrabold' : ''}">Calculators</a>
          <a href="/logos" class="px-3 py-2 hover:text-brand-cobalt hover:bg-slate-50 transition-colors whitespace-nowrap ${activePath === '/logos' ? 'text-brand-cobalt font-extrabold' : ''}">Logo Studio</a>
        </nav>

        <!-- Header Action CTA -->
        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          <a href="/contact" class="px-4 py-2.5 bg-brand-cobalt hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-sm transition-colors whitespace-nowrap">
            Contact Steve
          </a>
          <!-- Mobile Menu Toggle Button -->
          <button type="button" data-mobile-menu-btn class="lg:hidden p-2 text-slate-700 hover:text-brand-cobalt border border-brand-line bg-white shrink-0" aria-label="Toggle Navigation Menu">
            <span class="sr-only">Open Menu</span>
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="square" stroke-linejoin="miter" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
  `;
}

// Helper: Global Structural Blueprint Footer
function renderFooter() {
  return `
  <!-- ===================================================================== -->
  <!-- STRUCTURAL BLUEPRINT FOOTER                                           -->
  <!-- ===================================================================== -->
  <footer class="bg-white hairline-t mt-16">
    <!-- Top Footer Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <!-- Col 1: Identity & Credentials -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <img src="/images/logos/concept-01-hypervisor-blades.svg" alt="Technology Specialist" class="h-10 w-auto object-contain" />
          </div>
          <p class="text-xs text-slate-600 leading-relaxed font-normal">
            Technology Specialist provides mission-critical enterprise virtualization, M365 tenant governance, VoIP telephony, network engineering, and enterprise AI implementation. Principal-led by Steve Cormier since 1990.
          </p>
          <div class="font-mono text-[10px] text-slate-500 bg-slate-50 p-3 border border-brand-line space-y-1">
            <div class="text-brand-slate font-bold">Steve Cormier, Principal Systems Architect</div>
            <div>&bull; 36 Years Enterprise Architecture (Est. 1990)</div>
            <div>&bull; VP Global Technical &amp; Customer Support, Enterprise RTLS (2010 - Pres.)</div>
            <div>&bull; U.S. Air Force Veteran (Security Police, Offutt AFB)</div>
            <div>&bull; Microsoft Certified Systems Professional</div>
            <div>&bull; Lead Instructor, Track Day Xperience (TDX) @ Sebring</div>
          </div>
          <div class="font-mono text-[10px] text-slate-500">
            <div>3523 Forest Ridge Ln. &bull; Kissimmee, FL 34741</div>
            <div class="text-brand-slate font-bold mt-1">Direct Dispatch: <a href="tel:+14079175250" class="text-brand-cobalt hover:underline">(407) 917-5250</a></div>
          </div>
        </div>

        <!-- Col 2: Practice Areas 01-05 -->
        <div>
          <span class="font-mono text-[10px] font-bold text-brand-slate uppercase tracking-wider block mb-3 pb-1 border-b border-brand-line">
            PRACTICE MATRIX (PART I)
          </span>
          <ul class="space-y-2 font-mono text-xs text-slate-600">
            <li><a href="/services/microsoft-365" class="hover:text-brand-cobalt transition-colors">SYS-01: Microsoft 365 Architecture</a></li>
            <li><a href="/services/virtualization" class="hover:text-brand-cobalt transition-colors">SYS-02: VMware ESXi &amp; Hyper-V</a></li>
            <li><a href="/services/hardening" class="hover:text-brand-cobalt transition-colors">SYS-03: Server &amp; Network Hardening</a></li>
            <li><a href="/services/voip-ippbx" class="hover:text-brand-cobalt transition-colors">SYS-04: VoIP &amp; SIP Trunking</a></li>
            <li><a href="/services/network-management" class="hover:text-brand-cobalt transition-colors">SYS-05: Enterprise L2/L3 Network</a></li>
          </ul>
        </div>

        <!-- Col 3: Practice Areas 06-10 -->
        <div>
          <span class="font-mono text-[10px] font-bold text-brand-slate uppercase tracking-wider block mb-3 pb-1 border-b border-brand-line">
            PRACTICE MATRIX (PART II)
          </span>
          <ul class="space-y-2 font-mono text-xs text-slate-600">
            <li><a href="/services/mobile-device-management" class="hover:text-brand-cobalt transition-colors">SYS-06: Mobile Device Management</a></li>
            <li><a href="/services/remote-desktop" class="hover:text-brand-cobalt transition-colors">SYS-07: Remote Desktop Farms</a></li>
            <li><a href="/services/onsite-support" class="hover:text-brand-cobalt transition-colors">SYS-08: Onsite Central FL Support</a></li>
            <li><a href="/services/it-consultancy" class="hover:text-brand-cobalt transition-colors">SYS-09: Principal IT Consultancy</a></li>
            <li><a href="/services/ai-implementation" class="hover:text-brand-cobalt text-brand-cobalt font-bold transition-colors">SYS-10: Enterprise AI &amp; Copilot</a></li>
          </ul>
        </div>

        <!-- Col 4: Platform & Direct Dispatch -->
        <div>
          <span class="font-mono text-[10px] font-bold text-brand-slate uppercase tracking-wider block mb-3 pb-1 border-b border-brand-line">
            SOVEREIGN PLATFORM &amp; ACCESS
          </span>
          <div class="font-mono text-[11px] text-slate-600 space-y-2 mb-4">
            <div>&bull; Runtime: GreenTree Sovereign Spoke v3.0</div>
            <div>&bull; Vault: Dedicated PostgreSQL 16</div>
            <div>&bull; Telemetry: East-West Air-Gapped Monitoring</div>
            <div>&bull; Security: CIS Level 2 Benchmarks</div>
          </div>
          <div class="space-y-2">
            <a href="/about" class="block w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-brand-slate border border-brand-line text-center font-mono text-[11px] font-bold uppercase tracking-wider transition-colors">
              About Steve Cormier &rarr;
            </a>
            <a href="/contact" class="block w-full py-2 px-3 bg-brand-cobalt hover:bg-blue-700 text-white text-center font-mono text-[11px] font-bold uppercase tracking-wider transition-colors">
              Dispatch Request &rarr;
            </a>
          </div>
        </div>

      </div>
    </div>

    <!-- Bottom Copyright & SLA Strip -->
    <div class="bg-slate-50 py-4 px-4 sm:px-6 lg:px-8 hairline-t text-[11px] font-mono text-slate-500">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div>
          &copy; 1990 - 2026 Technology Specialist. All rights reserved. Technology Advice You Can Trust.
        </div>
        <div class="flex items-center gap-3">
          <span>Kissimmee, FL 34741</span>
          <span>&bull;</span>
          <a href="tel:+14079175250" class="text-brand-slate font-bold hover:underline">(407) 917-5250</a>
          <span>&bull;</span>
          <a href="/logos" class="text-brand-cobalt hover:underline">Vector Logo Studio</a>
        </div>
      </div>
    </div>
  </footer>
  `;
}

// Generate Master Directory Page: /services/index.html
function generateServicesMasterPage() {
  const activePath = '/services';
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Enterprise Systems Practice Catalog (10 Practices) | Technology Specialist</title>
  <meta name="description" content="Complete 10-Practice Enterprise Engineering Catalog and SLA Comparison Matrix. Principal systems architecture by Steve Cormier since 1990." />
  <meta name="author" content="Steve Cormier - Technology Specialist" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" id="site-favicon" />
  <link rel="alternate icon" type="image/png" href="/favicon-32x32.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <meta property="og:image" content="/images/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="twitter:image" content="/images/og-image.png" />
  <meta property="twitter:card" content="summary_large_image" />

  <!-- Logo Studio Client Runtime & Mega Menu -->
  <script src="/logo-studio.js" defer></script>
  <script src="/mega-menu.js" defer></script>

  <!-- Google Fonts: Space Grotesk, Plus Jakarta Sans, JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
            heading: ['Space Grotesk', 'sans-serif'],
          },
          colors: {
            brand: {
              cobalt: '#0052CC',
              cyan: '#0284C7',
              slate: '#0F172A',
              card: '#FFFFFF',
              surface: '#FAFAFC',
              silver: '#F1F5F9',
              line: '#CBD5E1',
              darkLine: '#334155',
              success: '#059669',
            }
          }
        }
      }
    }
  </script>

  <style>
    :root {
      --color-brand: #0052CC;
      --color-cyan: #0284C7;
      --color-slate: #0F172A;
      --color-surface: #FAFAFC;
      --color-hairline: #CBD5E1;
      --color-success: #059669;
    }
    body {
      background-color: #FAFAFC;
      color: #0F172A;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .blueprint-bg {
      background-image: linear-gradient(to right, rgba(203, 213, 225, 0.45) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(203, 213, 225, 0.45) 1px, transparent 1px);
      background-size: 28px 28px;
    }
    .hairline-grid {
      border: 1px solid #CBD5E1;
    }
    .hairline-b {
      border-bottom: 1px solid #CBD5E1;
    }
    .hairline-t {
      border-top: 1px solid #CBD5E1;
    }
    .hairline-r {
      border-right: 1px solid #CBD5E1;
    }
    .hairline-l {
      border-left: 1px solid #CBD5E1;
    }
  </style>
</head>
<body class="blueprint-bg text-brand-slate antialiased">

  ${renderHeader(activePath)}

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    
    <!-- Breadcrumb -->
    <nav class="font-mono text-[11px] text-slate-500 mb-6 flex items-center gap-2 uppercase tracking-wider" aria-label="Breadcrumb">
      <a href="/" class="hover:text-brand-cobalt">Home</a>
      <span>/</span>
      <span class="text-brand-slate font-bold">Services Directory</span>
    </nav>

    <!-- Hero Header -->
    <section class="hairline-grid bg-white p-6 sm:p-10 mb-10 shadow-sm">
      <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 hairline-b">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-100 border border-brand-line font-mono text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-4">
            <span class="w-1.5 h-1.5 bg-brand-cobalt"></span>
            CATALOG // 10 SPECIALIZED ARCHITECTURAL PRACTICES
          </div>
          <h1 class="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-slate tracking-tight">
            Enterprise Systems Engineering Catalog
          </h1>
          <p class="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            For 36 years since 1990, Technology Specialist has delivered vendor-neutral infrastructure engineering, hypervisor clustering, identity hardening, and practical enterprise AI. Every practice area is designed, implemented, and maintained directly under Principal Systems Architect Steve Cormier.
          </p>
        </div>

        <div class="font-mono text-xs text-slate-500 bg-slate-50 p-4 border border-brand-line shrink-0 space-y-1.5">
          <div class="text-brand-slate font-bold uppercase tracking-wide">Emergency Direct Dispatch</div>
          <div class="text-lg font-bold text-brand-cobalt">
            <a href="tel:+14079175250" class="hover:underline">(407) 917-5250</a>
          </div>
          <div class="text-[10px] text-slate-500">Central Florida Onsite &bull; Nationwide Remote</div>
        </div>
      </div>

      <!-- Quick Metrics Bar -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 font-mono text-xs">
        <div>
          <span class="text-[10px] text-slate-500 uppercase block">Principal Experience</span>
          <span class="font-bold text-base text-brand-slate">36 Years (1990)</span>
        </div>
        <div>
          <span class="text-[10px] text-slate-500 uppercase block">Active Practices</span>
          <span class="font-bold text-base text-brand-slate">10 Full Disciplines</span>
        </div>
        <div>
          <span class="text-[10px] text-slate-500 uppercase block">Response SLA</span>
          <span class="font-bold text-base text-brand-cobalt">&lt; 15 Min Priority</span>
        </div>
        <div>
          <span class="text-[10px] text-slate-500 uppercase block">Vendor Position</span>
          <span class="font-bold text-base text-emerald-600">100% Vendor Neutral</span>
        </div>
      </div>
    </section>

    <!-- Master 10-Practice Grid -->
    <section class="mb-14">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="font-heading text-2xl font-bold text-brand-slate uppercase tracking-tight">
            Comprehensive Practice Matrix
          </h2>
          <p class="font-mono text-xs text-slate-500 mt-1">Select any practice area below for deep-dive specifications, schematics, and case blueprints.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${services.map(svc => `
        <article class="hairline-grid bg-white p-6 sm:p-7 flex flex-col justify-between hover:border-brand-cobalt transition-colors group">
          <div>
            <div class="flex items-center justify-between pb-3 mb-4 hairline-b font-mono text-xs">
              <span class="font-bold text-brand-cobalt bg-blue-50 px-2 py-0.5 border border-blue-200">${svc.code}</span>
              <span class="text-[10px] text-slate-500 uppercase tracking-wider">${svc.category}</span>
            </div>

            <h3 class="font-heading text-xl font-bold text-brand-slate group-hover:text-brand-cobalt transition-colors">
              <a href="/services/${svc.slug}">${svc.title}</a>
            </h3>

            <p class="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              ${svc.lead}
            </p>

            <!-- Key Capabilities List -->
            <div class="mt-5 pt-4 hairline-t space-y-1.5 font-mono text-[11px] text-slate-600">
              ${svc.capabilities.slice(0, 3).map(cap => `
              <div class="flex items-start gap-2">
                <span class="text-brand-cobalt font-bold shrink-0">&bull;</span>
                <span><strong>${cap.area}:</strong> ${cap.desc.split(',')[0]}.</span>
              </div>
              `).join('')}
            </div>
          </div>

          <div class="mt-6 pt-4 hairline-t flex items-center justify-between font-mono text-xs">
            <span class="text-slate-500 text-[10px]">SLA: <strong>${svc.metrics[0].value}</strong></span>
            <a href="/services/${svc.slug}" class="inline-flex items-center gap-1 font-bold text-brand-cobalt hover:underline">
              <span>View Full Specification</span>
              <span>&rarr;</span>
            </a>
          </div>
        </article>
        `).join('')}
      </div>
    </section>

    <!-- Enterprise SLA & Support Tier Comparison Matrix -->
    <section class="hairline-grid bg-white p-6 sm:p-10 mb-14 shadow-sm">
      <div class="mb-6 pb-4 hairline-b">
        <span class="font-mono text-[10px] font-bold text-brand-cobalt uppercase tracking-widest block mb-1">
          OPERATIONAL READINESS &bull; SLA MATRIX
        </span>
        <h2 class="font-heading text-2xl font-bold text-brand-slate">
          Support Tiers &amp; Service Level Agreements
        </h2>
        <p class="text-xs text-slate-600 mt-1">Direct escalation pathways with guaranteed response time windows and principal engineering lead.</p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left font-mono text-xs border border-brand-line">
          <thead>
            <tr class="bg-brand-slate text-white text-[11px] uppercase tracking-wider">
              <th class="p-3 border-r border-slate-700">Service Tier</th>
              <th class="p-3 border-r border-slate-700">Target Response</th>
              <th class="p-3 border-r border-slate-700">Coverage Window</th>
              <th class="p-3 border-r border-slate-700">Dispatch Mode</th>
              <th class="p-3">Included Practices</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-brand-line">
            <tr class="hover:bg-slate-50">
              <td class="p-3 font-bold text-brand-slate border-r border-brand-line">Tier 1: Critical Incident</td>
              <td class="p-3 text-red-600 font-bold border-r border-brand-line">&lt; 15 Minutes</td>
              <td class="p-3 border-r border-brand-line">24/7/365 Continuous</td>
              <td class="p-3 border-r border-brand-line">Direct Phone / Rapid Dispatch</td>
              <td class="p-3">Hypervisor outage, SAN failover, ransomware containment, WAN drop</td>
            </tr>
            <tr class="hover:bg-slate-50 bg-slate-50/50">
              <td class="p-3 font-bold text-brand-slate border-r border-brand-line">Tier 2: Managed Operations</td>
              <td class="p-3 text-brand-cobalt font-bold border-r border-brand-line">&lt; 1 Hour</td>
              <td class="p-3 border-r border-brand-line">Mon - Fri, 7 AM - 7 PM EST</td>
              <td class="p-3 border-r border-brand-line">Postgres Lead Vault / Portal</td>
              <td class="p-3">M365 user administration, VLAN modifications, backup audits, VoIP adjustments</td>
            </tr>
            <tr class="hover:bg-slate-50">
              <td class="p-3 font-bold text-brand-slate border-r border-brand-line">Tier 3: Strategic Architecture</td>
              <td class="p-3 font-bold text-slate-700 border-r border-brand-line">Scheduled Sprints</td>
              <td class="p-3 border-r border-brand-line">Project Maintenance Windows</td>
              <td class="p-3 border-r border-brand-line">Onsite Audit / Exec Reviews</td>
              <td class="p-3">Enterprise AI integration, M&amp;A due diligence, datacenter cutovers, 5yr CapEx</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Steve Cormier Architectural Pedigree Banner -->
    <section class="hairline-grid bg-white p-6 sm:p-8 mb-14">
      <div class="flex flex-col md:flex-row items-center gap-6">
        <img src="/images/steve/steve-cormier-portrait.png" alt="Steve Cormier" class="w-24 h-24 sm:w-28 sm:h-28 object-cover border border-brand-line shrink-0" onerror="this.src='/images/logo.png';" />
        <div class="flex-1">
          <div class="font-mono text-[10px] font-bold text-brand-cobalt uppercase tracking-wider mb-1">
            PRINCIPAL ENGINEERING GOVERNANCE // SINCE 1990
          </div>
          <h3 class="font-heading text-xl font-bold text-brand-slate">
            Direct Principal Accountability on Every System
          </h3>
          <p class="text-xs text-slate-600 mt-2 leading-relaxed">
            Technology Specialist is not an anonymous call center or rotating technician dispatch. Every architecture plan, hypervisor migration, firewall rule, and AI deployment is overseen personally by Steve Cormier. U.S. Air Force Veteran (Security Police, Offutt AFB), VP of Technical &amp; Customer Support in Enterprise Healthcare RTLS since 2010, Microsoft Certified, and Lead Instructor for Track Day Xperience (TDX) at Sebring International Raceway.
          </p>
        </div>
        <div class="shrink-0 flex flex-col gap-2 w-full md:w-auto">
          <a href="/about" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-brand-slate font-mono text-xs font-bold uppercase tracking-wider text-center border border-brand-line transition-colors">
            Read Full Biography &rarr;
          </a>
          <a href="/contact" class="px-4 py-2.5 bg-brand-cobalt hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider text-center transition-colors">
            Contact Steve Direct &rarr;
          </a>
        </div>
      </div>
    </section>

  </main>

  ${renderFooter()}

</body>
</html>`;
}

// Generate Standalone Practice Page: /services/<slug>/index.html
function generateServiceDetailPage(svc) {
  const activePath = `/services/${svc.slug}`;
  const otherServices = services.filter(s => s.slug !== svc.slug);

  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${svc.code}: ${svc.title} | Technology Specialist</title>
  <meta name="description" content="${svc.metaDesc}" />
  <meta name="author" content="Steve Cormier - Technology Specialist" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" id="site-favicon" />
  <link rel="alternate icon" type="image/png" href="/favicon-32x32.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <meta property="og:image" content="/images/og-image.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="twitter:image" content="/images/og-image.png" />
  <meta property="twitter:card" content="summary_large_image" />

  <!-- Logo Studio Client Runtime & Mega Menu -->
  <script src="/logo-studio.js" defer></script>
  <script src="/mega-menu.js" defer></script>

  <!-- Google Fonts: Space Grotesk, Plus Jakarta Sans, JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
            heading: ['Space Grotesk', 'sans-serif'],
          },
          colors: {
            brand: {
              cobalt: '#0052CC',
              cyan: '#0284C7',
              slate: '#0F172A',
              card: '#FFFFFF',
              surface: '#FAFAFC',
              silver: '#F1F5F9',
              line: '#CBD5E1',
              darkLine: '#334155',
              success: '#059669',
            }
          }
        }
      }
    }
  </script>

  <style>
    :root {
      --color-brand: #0052CC;
      --color-cyan: #0284C7;
      --color-slate: #0F172A;
      --color-surface: #FAFAFC;
      --color-hairline: #CBD5E1;
      --color-success: #059669;
    }
    body {
      background-color: #FAFAFC;
      color: #0F172A;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .blueprint-bg {
      background-image: linear-gradient(to right, rgba(203, 213, 225, 0.45) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(203, 213, 225, 0.45) 1px, transparent 1px);
      background-size: 28px 28px;
    }
    .hairline-grid {
      border: 1px solid #CBD5E1;
    }
    .hairline-b {
      border-bottom: 1px solid #CBD5E1;
    }
    .hairline-t {
      border-top: 1px solid #CBD5E1;
    }
    .hairline-r {
      border-right: 1px solid #CBD5E1;
    }
    .hairline-l {
      border-left: 1px solid #CBD5E1;
    }
  </style>
</head>
<body class="blueprint-bg text-brand-slate antialiased">

  ${renderHeader(activePath)}

  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    
    <!-- Breadcrumb -->
    <nav class="font-mono text-[11px] text-slate-500 mb-6 flex items-center gap-2 uppercase tracking-wider" aria-label="Breadcrumb">
      <a href="/" class="hover:text-brand-cobalt">Home</a>
      <span>/</span>
      <a href="/services" class="hover:text-brand-cobalt">Services</a>
      <span>/</span>
      <span class="text-brand-slate font-bold">${svc.code}</span>
    </nav>

    <!-- Practice Hero Section -->
    <section class="hairline-grid bg-white p-6 sm:p-10 mb-8 shadow-sm">
      <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 hairline-b">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 px-2.5 py-1 bg-blue-50 border border-blue-200 font-mono text-[10px] font-bold uppercase tracking-wider text-brand-cobalt mb-4">
            <span class="w-1.5 h-1.5 bg-brand-cobalt"></span>
            ${svc.code} // ${svc.category.toUpperCase()}
          </div>
          <h1 class="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-slate tracking-tight">
            ${svc.title}
          </h1>
          <p class="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            ${svc.lead}
          </p>
        </div>

        <div class="shrink-0 flex flex-col gap-2 w-full lg:w-auto">
          <a href="/contact?service=${encodeURIComponent(svc.code)}" class="px-5 py-3 bg-brand-cobalt hover:bg-blue-700 text-white font-mono text-xs font-bold uppercase tracking-wider text-center shadow-sm transition-colors">
            Request Architecture Review &rarr;
          </a>
          <a href="tel:+14079175250" class="px-5 py-2.5 bg-white hover:bg-slate-50 text-brand-slate border border-brand-line font-mono text-xs font-bold text-center transition-colors">
            Direct Dispatch: (407) 917-5250
          </a>
        </div>
      </div>

      <!-- Architectural Schematic Viewer Container -->
      <div class="mt-8">
        <div class="flex items-center justify-between pb-2 mb-3 font-mono text-xs text-slate-500">
          <span class="font-bold text-brand-slate flex items-center gap-2">
            <span class="inline-block w-2 h-2 bg-emerald-500"></span>
            ARCHITECTURAL SCHEMATIC: ${svc.code} TOPOLOGY
          </span>
          <span class="text-[10px] text-slate-400">VECTOR SVG RENDERING &bull; AIR-GAPPED FABRIC</span>
        </div>
        <div class="border border-brand-line bg-slate-900 p-2 sm:p-4 overflow-hidden">
          <img src="${svc.schematic}" alt="${svc.schematicAlt}" class="w-full h-auto max-h-[520px] object-contain mx-auto" />
        </div>
      </div>
    </section>

    <!-- 4-Column Technical Metrics Bar -->
    <section class="hairline-grid bg-white p-6 sm:p-8 mb-10 shadow-sm">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
        ${svc.metrics.map((m, idx) => `
        <div class="${idx < 3 ? 'sm:border-r border-brand-line sm:pr-4' : ''}">
          <span class="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">${m.label}</span>
          <div class="font-heading text-lg sm:text-xl font-bold text-brand-slate tracking-tight">${m.value}</div>
          <p class="text-[11px] text-slate-500 mt-1">${m.sub}</p>
        </div>
        `).join('')}
      </div>
    </section>

    <!-- Deep-Dive Architectural Capabilities & Deliverables Table -->
    <section class="hairline-grid bg-white p-6 sm:p-10 mb-10 shadow-sm">
      <div class="mb-6 pb-4 hairline-b">
        <span class="font-mono text-[10px] font-bold text-brand-cobalt uppercase tracking-widest block mb-1">
          CAPABILITY CATALOG // ${svc.code}
        </span>
        <h2 class="font-heading text-2xl font-bold text-brand-slate">
          Architectural Capabilities &amp; Deliverables
        </h2>
        <p class="text-xs text-slate-600 mt-1">Specific technical interventions, deployment baselines, and governance deliverables included in this practice.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${svc.capabilities.map(cap => `
        <div class="p-4 bg-slate-50 border border-brand-line">
          <div class="flex items-center gap-2 mb-2 font-mono text-xs font-bold text-brand-slate">
            <span class="w-1.5 h-1.5 bg-brand-cobalt"></span>
            <span>${cap.area}</span>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed font-normal">
            ${cap.desc}
          </p>
        </div>
        `).join('')}
      </div>
    </section>

    <!-- Supported Platforms, Hardware & Protocols Matrix -->
    <section class="hairline-grid bg-white p-6 sm:p-10 mb-10 shadow-sm">
      <div class="mb-6 pb-4 hairline-b">
        <span class="font-mono text-[10px] font-bold text-brand-cobalt uppercase tracking-widest block mb-1">
          TECHNOLOGY ECOSYSTEM // PLATFORMS &amp; STANDARDS
        </span>
        <h2 class="font-heading text-2xl font-bold text-brand-slate">
          Supported Technology Stacks &amp; Protocols
        </h2>
        <p class="text-xs text-slate-600 mt-1">Vendor-neutral integration across enterprise hardware, hypervisors, and cloud environments.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
        ${svc.platforms.map(p => `
        <div class="space-y-3">
          <span class="font-bold text-brand-slate uppercase text-[11px] block pb-1 border-b border-brand-line">
            ${p.category}
          </span>
          <ul class="space-y-1.5 text-slate-600">
            ${p.items.map(item => `
            <li class="flex items-center gap-1.5">
              <span class="text-brand-cobalt font-bold">&bull;</span>
              <span>${item}</span>
            </li>
            `).join('')}
          </ul>
        </div>
        `).join('')}
      </div>
    </section>

    <!-- Case Architecture Blueprint -->
    <section class="hairline-grid bg-white p-6 sm:p-10 mb-10 shadow-sm">
      <div class="mb-6 pb-4 hairline-b">
        <span class="font-mono text-[10px] font-bold text-brand-cobalt uppercase tracking-widest block mb-1">
          PROVEN FIELD EXECUTION // CASE STUDY
        </span>
        <h2 class="font-heading text-2xl font-bold text-brand-slate">
          ${svc.caseStudy.headline}
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
        <div class="p-4 bg-red-50/40 border border-red-200">
          <span class="font-bold text-red-900 uppercase block mb-2 text-[11px]">The Challenge</span>
          <p class="text-slate-700 leading-relaxed font-sans text-xs">
            ${svc.caseStudy.challenge}
          </p>
        </div>

        <div class="p-4 bg-blue-50/40 border border-blue-200">
          <span class="font-bold text-brand-cobalt uppercase block mb-2 text-[11px]">Engineering Solution</span>
          <p class="text-slate-700 leading-relaxed font-sans text-xs">
            ${svc.caseStudy.solution}
          </p>
        </div>

        <div class="p-4 bg-emerald-50/40 border border-emerald-200">
          <span class="font-bold text-emerald-900 uppercase block mb-2 text-[11px]">Quantified Outcome</span>
          <p class="text-slate-700 leading-relaxed font-sans text-xs">
            ${svc.caseStudy.result}
          </p>
        </div>
      </div>
    </section>

    <!-- Direct Engagement CTA Bar -->
    <section class="bg-brand-slate text-white p-8 sm:p-10 hairline-grid mb-12">
      <div class="flex flex-col lg:flex-row items-center justify-between gap-6">
        <div>
          <span class="font-mono text-[10px] font-bold text-sky-400 uppercase tracking-widest block mb-2">
            DIRECT ENGAGEMENT WITH STEVE CORMIER
          </span>
          <h3 class="font-heading text-2xl sm:text-3xl font-bold">
            Ready to Architect Your ${svc.shortTitle}?
          </h3>
          <p class="font-mono text-xs text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Direct consultation with a 36-year Principal Systems Architect. Zero sales reps, zero vendor markups, and zero guesswork.
          </p>
        </div>

        <div class="shrink-0 flex flex-wrap items-center gap-3">
          <a href="tel:+14079175250" class="px-5 py-3 bg-white hover:bg-slate-100 text-brand-slate font-mono text-xs font-bold uppercase tracking-wider transition-colors">
            Call Direct: (407) 917-5250
          </a>
          <a href="/contact?service=${encodeURIComponent(svc.code)}" class="px-5 py-3 bg-brand-cobalt hover:bg-blue-600 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors">
            Request ${svc.code} Triage &rarr;
          </a>
        </div>
      </div>
    </section>

    <!-- Cross-Links: Other 9 Practice Areas -->
    <section class="hairline-grid bg-white p-6 sm:p-8">
      <div class="flex items-center justify-between pb-3 mb-4 hairline-b font-mono text-xs">
        <span class="font-bold text-brand-slate uppercase">Explore Other Practice Areas (9)</span>
        <a href="/services" class="text-brand-cobalt hover:underline">View All 10 &rarr;</a>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
        ${otherServices.map(other => `
        <a href="/services/${other.slug}" class="p-3 bg-slate-50 border border-brand-line hover:border-brand-cobalt hover:bg-white transition-colors group flex items-center justify-between">
          <div>
            <span class="text-[10px] font-bold text-brand-cobalt block">${other.code}</span>
            <span class="text-brand-slate font-bold group-hover:text-brand-cobalt">${other.shortTitle}</span>
          </div>
          <span class="text-slate-400 group-hover:text-brand-cobalt">&rarr;</span>
        </a>
        `).join('')}
      </div>
    </section>

  </main>

  ${renderFooter()}

</body>
</html>`;
}

// Function to write all files and verify zero em dashes
function buildAll() {
  console.log('Building Technology Specialist Multi-Page Service Architecture...');

  // 1. Build Master Directory
  const masterHtml = generateServicesMasterPage();
  
  const pubServicesDir = path.join(publicDir, 'services');
  const distServicesDir = path.join(distDir, 'services');
  fs.mkdirSync(pubServicesDir, { recursive: true });
  fs.mkdirSync(distServicesDir, { recursive: true });

  fs.writeFileSync(path.join(pubServicesDir, 'index.html'), masterHtml, 'utf8');
  fs.writeFileSync(path.join(distServicesDir, 'index.html'), masterHtml, 'utf8');
  console.log('Generated /services/index.html (in public/ and dist/)');

  // 2. Build 10 Practice Pages
  for (const svc of services) {
    const detailHtml = generateServiceDetailPage(svc);
    const pubSlugDir = path.join(pubServicesDir, svc.slug);
    const distSlugDir = path.join(distServicesDir, svc.slug);
    fs.mkdirSync(pubSlugDir, { recursive: true });
    fs.mkdirSync(distSlugDir, { recursive: true });

    fs.writeFileSync(path.join(pubSlugDir, 'index.html'), detailHtml, 'utf8');
    fs.writeFileSync(path.join(distSlugDir, 'index.html'), detailHtml, 'utf8');
    console.log(`Generated /services/${svc.slug}/index.html (${svc.code})`);
  }

  // 3. Strict Verification of Zero Em Dashes
  console.log('Verifying zero em dashes across all generated pages...');
  const checkDirs = [pubServicesDir, distServicesDir];
  let emDashCount = 0;

  function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const fullPath = path.join(dir, f);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (f.endsWith('.html')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const matches = content.match(/[—]|&mdash;|&#8212;/g);
        if (matches) {
          console.error(`EM DASH FOUND in ${fullPath}: ${matches.length} instances`);
          emDashCount += matches.length;
        }
      }
    }
  }

  for (const d of checkDirs) {
    scanDir(d);
  }

  if (emDashCount === 0) {
    console.log('PASSED: Exactly ZERO em dashes found across all 11 service pages!');
  } else {
    console.error(`FAILED: Found ${emDashCount} em dashes!`);
    process.exit(1);
  }
}

buildAll();
