/**
 * MOD-DEEP-HELP - Godfather Multi-Level Role-Aware Deep Help & Granular Web App Access Engine
 * Sourced & generalized from C:\repos-greentree\compliancepro-platform
 *
 * Features:
 *  1. Multi-level collapsible Contents hierarchy (BASICS, FEATURES, PROJECT MANAGER GUIDES, ADMINISTRATION, HELP & SUPPORT)
 *  2. Dual-mode inside every topic:
 *     - Summary View (Quick Guide): Fast overview, key takeaways, 3-step quick start
 *     - Complete Guide (Full Guide): Step-by-step documentation, callout boxes, role tables, pro tips, troubleshooting
 *  3. Universal Help + Custom Per-Tenant / Per-App Help merge engine (supports custom topic overrides & additions)
 *  4. Granular Web App User Matrix:
 *     - Per-user checkboxes for Visual Pin Board access (`pinboardAccess`, `pinboardTeamView`)
 *     - Super-Admin link visibility gates (`leadsQuotes`, `socialCommand`, `commercialAddons`, `billingGateways`)
 *       so Web Apps like `oneem.sonitor.com` hide commercial website tools from non-Super-Admins by default.
 */

export const HELP_CATEGORIES = [
  { id: 'basics', label: 'BASICS', order: 1, roles: ['user', 'pm', 'admin', 'super_admin'] },
  { id: 'features', label: 'FEATURES', order: 2, roles: ['user', 'pm', 'admin', 'super_admin'] },
  { id: 'pm-guides', label: 'PROJECT MANAGER GUIDES', order: 3, roles: ['pm', 'admin', 'super_admin'] },
  { id: 'admin', label: 'ADMINISTRATION', order: 4, roles: ['admin', 'super_admin'] },
  { id: 'help', label: 'HELP & SUPPORT', order: 5, roles: ['user', 'pm', 'admin', 'super_admin'] }
];

export const UNIVERSAL_HELP_TOPICS = [
  {
    id: 'getting-started',
    categoryId: 'basics',
    order: 1,
    title: 'Getting Started',
    icon: '✨',
    badge: null,
    scope: 'universal',
    roles: ['user', 'pm', 'admin', 'super_admin'],
    subtitle: 'Your fast-track orientation to the workspace, navigation, and role-based tools.',
    summary: {
      leadTitle: 'Welcome to Your Platform Workspace',
      leadText: 'Your workspace dynamically adapts to your assigned role and enabled modules. You only see the tools, documentation, and navigation links assigned to your account.',
      highlights: [
        {
          icon: '🧭',
          title: 'Role-Adaptive Navigation',
          text: 'Standard users see core operational tools and assigned modules. Project Managers and Administrators unlock supervisor workflows and user permission controls.'
        },
        {
          icon: '📌',
          title: 'Visual Pin Board (When Enabled for Your Account)',
          text: 'If your Administrator has checked Pinboard Access for your profile, you can drop visual pins directly onto any screen to report issues or request changes.'
        },
        {
          icon: '📖',
          title: 'Dual-Level Documentation (Summary vs. Complete Guide)',
          text: 'Every topic in this Help Center starts in Summary View for fast scanning. Flip the top-right toggle at any time to unlock the Complete Guide with step-by-step instructions.'
        }
      ],
      quickSteps: [
        'Verify your active role badge in the top header bar.',
        'Use the left Contents search bar to filter topics by keyword in real time.',
        'Toggle "Full Guide" in the top-right banner whenever you need deep step-by-step walkthroughs.'
      ]
    },
    complete: {
      overview: 'This Complete Guide walks through authentication, workspace orientation, role-based navigation filtering, and how Universal Help merges with your organization\'s Custom Application Help.',
      callouts: [
        {
          type: 'purple',
          icon: '🔄',
          title: 'Smart Hybrid Documentation - Universal + Custom App Help',
          body: 'This Help Center combines Universal Platform Guides (such as Visual Pin Board, Profile Security, and Role Administration) with Custom Application Modules tailored specifically to your web application or site.'
        },
        {
          type: 'blue',
          icon: '🔒',
          title: 'Zero-Clutter Granular Portal View',
          body: 'Enterprise web applications (such as OneEM and CompliancePro) automatically hide commercial marketing tools (Leads, Quotes, Social Syndication, Billing) for standard users and app admins unless explicitly enabled by a Super-Admin.'
        }
      ],
      steps: [
        {
          step: '1',
          title: 'Sign In & Confirm Your Role Scope',
          detail: 'Upon login, your session token binds your role (Standard User, Project Manager/Supervisor, App Admin, or Super-Admin) and checks your per-user feature flags such as Visual Pin Board access.'
        },
        {
          step: '2',
          title: 'Navigate Using the Left Contents Tree',
          detail: 'Categories in the left sidebar automatically expand or collapse. Click any category header (BASICS, FEATURES, PROJECT MANAGER GUIDES, ADMINISTRATION, HELP & SUPPORT) to toggle its child topics.'
        },
        {
          step: '3',
          title: 'Switch Between Summary View and Complete Guide',
          detail: 'Use the toggle switch in the lavender banner at the top of any article to switch between a 60-second executive summary and the full technical operating procedure.'
        },
        {
          step: '4',
          title: 'Launch Contextual Help Anytime via the "?" Button',
          detail: 'Click the floating "?" button in the bottom-right corner of the application from any screen to search documentation or open the quick FAQ drawer without leaving your current task.'
        }
      ],
      proTips: [
        'Press Ctrl+K or use the Contents search box to instantly filter across both Summary and Complete Guide content.',
        'Administrators can add custom site-specific help topics directly from the Deep Help Builder.'
      ],
      troubleshooting: [
        {
          issue: 'I do not see the Visual Pin Board button on my screen.',
          resolution: 'Ask your App Administrator to open User Access & Pinboard Checkboxes and enable the "Pinboard Access" checkbox next to your user account.'
        },
        {
          issue: 'Why are Administration or PM Guides hidden in my sidebar?',
          resolution: 'The Contents sidebar is role-gated. Standard User accounts only display BASICS, FEATURES, and HELP & SUPPORT to keep the interface clean and focused.'
        }
      ]
    }
  },
  {
    id: 'workflow-guide',
    categoryId: 'basics',
    order: 2,
    title: 'Workflow Guide',
    icon: '→',
    badge: '✨',
    highlight: true,
    scope: 'universal',
    roles: ['user', 'pm', 'admin', 'super_admin'],
    subtitle: 'End-to-end operational lifecycle from daily task execution to visual issue resolution.',
    summary: {
      leadTitle: 'End-to-End Platform Workflow',
      leadText: 'Understand how daily operations, visual feedback pins, supervisor triage, and administrative governance connect in a single closed loop.',
      highlights: [
        {
          icon: '1️⃣',
          title: 'Stage 1: Daily Application Operations',
          text: 'Complete your assigned projects, lifecycle milestones, or training modules using the core workspace views.'
        },
        {
          icon: '2️⃣',
          title: 'Stage 2: Contextual Pinning & Feedback',
          text: 'Authorized Pinboard users click any element on screen to drop a numbered pin with automatic viewport and browser telemetry.'
        },
        {
          icon: '3️⃣',
          title: 'Stage 3: Triage, Verification & Closure',
          text: 'Project Managers and Admins review pinned items, assign severity, push fixes, and mark items Resolved with an audit trail.'
        }
      ],
      quickSteps: [
        'Execute your daily workflow inside your assigned application view.',
        'If you spot a bug, floorplan discrepancy, or content update, activate Pin Mode and click the exact spot.',
        'Track status transitions from Open -> In Progress -> Resolved.'
      ]
    },
    complete: {
      overview: 'The Workflow Guide maps the interaction between Frontline Users, Project Managers / Supervisors, App Administrators, and Super-Admins across connected web applications.',
      callouts: [
        {
          type: 'purple',
          icon: '⚡',
          title: 'Closed-Loop Operational Accountability',
          body: 'Every action taken inside the application or on the Visual Pin Board is anchored to an authenticated user, a timestamp, and a specific application route.'
        }
      ],
      steps: [
        {
          step: '1',
          title: 'Role Assignment & Feature Gating (App Admin)',
          detail: 'The App Admin configures user accounts and checks the Pinboard Access box for team members who are authorized to submit visual pins and QA reports.'
        },
        {
          step: '2',
          title: 'In-App Execution & Contextual Pin Capture (Authorized User)',
          detail: 'While working in the web app (e.g., reviewing an RTLS floorplan in OneEM or completing a module in CompliancePro), the user clicks the Pinboard launcher, clicks the exact UI coordinate, selects Severity (Critical, Major, Minor, Question), and submits.'
        },
        {
          step: '3',
          title: 'Central & Local Triage (PM / App Admin)',
          detail: 'Pins appear immediately in the application\'s Pinboard Drawer and sync to the Command Portal. Supervisors filter by status or severity, reply in the thread, and assign resolution.'
        },
        {
          step: '4',
          title: 'Verification & Audit Archival',
          detail: 'Once resolved, the reporter or supervisor verifies the fix on the live URL and transitions the pin to Resolved.'
        }
      ],
      proTips: [
        'Use the "Jump to Pin Context" link inside any pin card to open the exact page URL and scroll directly to the pinned coordinate.',
        'Filter pins by "My Pins Only" vs "All Team Pins" depending on your assigned permission checkbox.'
      ],
      troubleshooting: [
        {
          issue: 'A pin appears slightly offset on a different monitor aspect ratio.',
          resolution: 'Pins record relative X/Y viewport percentages plus the DOM selector metadata. Check the captured viewport dimensions badge on the pin card.'
        }
      ]
    }
  },
  {
    id: 'user-guide',
    categoryId: 'basics',
    order: 3,
    title: 'User Guide',
    icon: '📖',
    badge: null,
    scope: 'universal',
    roles: ['user', 'pm', 'admin', 'super_admin'],
    subtitle: 'Essential day-to-day navigation, search shortcuts, notifications, and workspace preferences.',
    summary: {
      leadTitle: 'Standard User Handbook',
      leadText: 'Everything a frontline team member needs to navigate the interface cleanly, manage notifications, and access assigned tools.',
      highlights: [
        {
          icon: '🔍',
          title: 'Instant Global Search',
          text: 'Filter documentation, projects, and assigned records immediately from the search bar.'
        },
        {
          icon: '🔔',
          title: 'Status Badges & Alerts',
          text: 'Color-coded badges indicate real-time status: Emerald (Active/Complete), Amber (In Progress/Review), Red (Action Required).'
        }
      ],
      quickSteps: [
        'Check your dashboard summary cards upon login for any overdue or high-priority items.',
        'Use the role switcher or profile menu in the top right to review your active permissions.',
        'Bookmark frequently used help articles or toggle Full Guide mode for detailed reference.'
      ]
    },
    complete: {
      overview: 'This complete user manual covers interface layout, keyboard shortcuts, browser compatibility, and session security.',
      callouts: [
        {
          type: 'emerald',
          icon: '✅',
          title: 'Designed for Zero Training Friction',
          body: 'All primary actions are accessible within two clicks from your home dashboard, with contextual "?" help available on every screen.'
        }
      ],
      steps: [
        {
          step: '1',
          title: 'Understanding the 3-Zone Workspace Layout',
          detail: 'The interface is divided into: (1) Top Identity & Context Header, (2) Left Collapsible Navigation / Contents Sidebar, and (3) Primary Action Canvas.'
        },
        {
          step: '2',
          title: 'Using Filters & Search',
          detail: 'All data tables and documentation trees support instant client-side filtering without page reloads.'
        },
        {
          step: '3',
          title: 'Exporting & Sharing Direct Links',
          detail: 'Deep links preserve your active tab and topic selection so you can share exact documentation sections or pin IDs with teammates.'
        }
      ],
      proTips: [
        'Keep Summary View active for rapid daily lookup; flip to Complete Guide when onboarding new staff.'
      ],
      troubleshooting: [
        {
          issue: 'Changes made by my administrator are not showing up yet.',
          resolution: 'Click the Refresh button in the top bar or reload the browser tab to pull the latest permission matrix.'
        }
      ]
    }
  },
  {
    id: 'visual-pin-board',
    categoryId: 'features',
    order: 2,
    title: 'Visual Pin Board',
    icon: '📌',
    badge: 'MOD-PIN-BOARD',
    scope: 'universal',
    requiresPinboardAccess: true,
    roles: ['user', 'pm', 'admin', 'super_admin'],
    subtitle: 'Drop interactive visual pins on any screen to report bugs, annotate floorplans, or request changes.',
    summary: {
      leadTitle: 'Interactive Visual Pinning & Markup (`MOD-PIN-BOARD`)',
      leadText: 'Available to users whose administrator has enabled the Pinboard Access checkbox. Click anywhere on the live application to drop a numbered pin with full context.',
      highlights: [
        {
          icon: '🎯',
          title: 'Point-and-Click Coordinate Capture',
          text: 'Captures exact X/Y screen coordinates, page route, DOM element target, and browser viewport dimensions automatically.'
        },
        {
          icon: '🚦',
          title: 'Severity & Lifecycle Tracking',
          text: 'Tag every pin as Critical, Major, Minor, or Enhancement and track it from Open to In Progress and Resolved.'
        }
      ],
      quickSteps: [
        'Click the "📌 Pin Mode" toggle button in the floating toolbar.',
        'Click the exact element, floorplan room, or button on screen that needs attention.',
        'Enter your title, severity, and notes, then click Save Pin.'
      ]
    },
    complete: {
      overview: 'The Visual Pin Board (`MOD-PIN-BOARD`) eliminates vague bug reports and email screenshots by anchoring conversations directly to the live DOM inside web apps (like OneEM) and websites.',
      callouts: [
        {
          type: 'purple',
          icon: '🔐',
          title: 'Granular Per-User Checkbox Control',
          body: 'In web applications like OneEM, not every end user needs the Pinboard. App Administrators selectively check `[x] Pinboard Access` for QA testers, super-users, field engineers, and project managers.'
        },
        {
          type: 'blue',
          icon: '🛰️',
          title: 'Automatic Telemetry Attachment',
          body: 'Every pin automatically records the active URL path, user identity, role, screen resolution, and timestamp so engineers can reproduce the exact state.'
        }
      ],
      steps: [
        {
          step: '1',
          title: 'Activate Pin Drop Mode',
          detail: 'Click the floating Pinboard button in the bottom toolbar. Your cursor turns into a precision crosshair indicating Pin Drop Mode is active.'
        },
        {
          step: '2',
          title: 'Click Target Element & Classify',
          detail: 'Click the exact spot on the page. A compact modal opens at that coordinate. Enter a clear summary title, select Category (Bug / UI / Floorplan / Data / Question), and choose Severity.'
        },
        {
          step: '3',
          title: 'Collaborate via Threaded Replies',
          detail: 'Team members with "View Team Pins" enabled can click any numbered pin badge on screen to read the thread, add diagnostic notes, or attach resolution details.'
        },
        {
          step: '4',
          title: 'Resolve & Archive',
          detail: 'Project Managers or Admins switch the pin status to Resolved once verified. Resolved pins are hidden from the active canvas overlay so your screen stays clean, while remaining searchable in the Pin History drawer.'
        }
      ],
      proTips: [
        'Toggle "Hide Pins Overlay" at any time when you want an unobstructed view of the application.',
        'Include expected vs. actual behavior in your pin note for 2x faster engineering turnaround.'
      ],
      troubleshooting: [
        {
          issue: 'I cannot see pins created by other users.',
          resolution: 'Your account may be set to "Own Pins Only". Ask your App Administrator to check "Can View Team Pins" in the User Pinboard Access Matrix.'
        }
      ]
    }
  },
  {
    id: 'profile-management',
    categoryId: 'features',
    order: 9,
    title: 'Profile Management',
    icon: '👤',
    badge: null,
    scope: 'universal',
    roles: ['user', 'pm', 'admin', 'super_admin'],
    subtitle: 'Manage your account credentials, notification preferences, and assigned permission scope.',
    summary: {
      leadTitle: 'Your Account & Security Profile',
      leadText: 'Review your active role assignment, verify which application modules are enabled for your user ID, and update your security credentials.',
      highlights: [
        {
          icon: '🛡️',
          title: 'Role & Permission Transparency',
          text: 'Your profile card displays your current role (User, PM, Admin, Super-Admin) and whether Visual Pin Board access is active.'
        },
        {
          icon: '🔑',
          title: 'Session & Password Hygiene',
          text: 'Update your password and review active browser sessions at any time.'
        }
      ],
      quickSteps: [
        'Open your Profile panel from the top-right user badge.',
        'Verify your email address and notification preferences for pin replies and project updates.',
        'Contact your App Admin if you need Pinboard Access or supervisor permissions enabled.'
      ]
    },
    complete: {
      overview: 'Complete reference for managing personal user settings, password rotation, email digest triggers, and viewing your effective permission matrix.',
      callouts: [
        {
          type: 'blue',
          icon: '🆔',
          title: 'Single Source of Identity',
          body: 'Your user profile governs both your in-app capabilities (such as Pinboard checkboxes) and which levels of Deep Help documentation appear in your sidebar.'
        }
      ],
      steps: [
        {
          step: '1',
          title: 'Inspecting Effective Permissions',
          detail: 'Open Profile Management to view your assigned Role Tier, Organization/Tenant binding (`siteKey`), and active module entitlements.'
        },
        {
          step: '2',
          title: 'Configuring Notification Triggers',
          detail: 'Choose whether to receive immediate email notifications when an engineer or administrator replies to a Visual Pin you submitted.'
        }
      ],
      proTips: [
        'If you administer multiple sites or apps, your profile badge indicates which tenant context you are currently viewing.'
      ],
      troubleshooting: [
        {
          issue: 'My role was upgraded to Project Manager, but I still see the Standard User sidebar.',
          resolution: 'Sign out and sign back in, or use the Role Preview switcher in the Command Portal to refresh your active session claims.'
        }
      ]
    }
  },
  {
    id: 'pm-guide',
    categoryId: 'pm-guides',
    order: 1,
    title: 'PM & Supervisor Guide',
    icon: '📋',
    badge: 'PM / SUPERVISOR',
    scope: 'universal',
    roles: ['pm', 'admin', 'super_admin'],
    subtitle: 'Supervising project execution, triaging team pins, and managing milestone sign-offs.',
    summary: {
      leadTitle: 'Project Manager & Supervisor Operations',
      leadText: 'This section is visible only to Project Managers, App Administrators, and Super-Admins. Learn how to oversee team progress and triage field escalations.',
      highlights: [
        {
          icon: '📊',
          title: 'Milestone & Readiness Tracking',
          text: 'Monitor completion rates, open blockers, and unassigned action items across your project cohort.'
        },
        {
          icon: '📌',
          title: 'Team Pinboard Triage Queue',
          text: 'Review all pins submitted by authorized team members, prioritize critical blockers, and coordinate resolution.'
        }
      ],
      quickSteps: [
        'Review the open Pinboard Queue filtered by Critical and Major severity each morning.',
        'Assign owners and target resolution dates to open project blockers.',
        'Verify completed items before closing milestones.'
      ]
    },
    complete: {
      overview: 'Project Managers bridge frontline application users and system administrators. This Complete Guide covers triage SLAs, escalation paths, and quality verification.',
      callouts: [
        {
          type: 'purple',
          icon: '👁️',
          title: 'Role-Gated Visibility',
          body: 'Standard users do not see the PROJECT MANAGER GUIDES category in their Help Center sidebar. Only users with role `pm`, `admin`, or `super_admin` have access to these workflows.'
        }
      ],
      steps: [
        {
          step: '1',
          title: 'Audit Open Pins Across Your Project Scope',
          detail: 'Open the Visual Pin Board manager to view every pin submitted by users in your tenant. Sort by Severity (Critical first) and Page Route.'
        },
        {
          step: '2',
          title: 'Validate Reproduction Details',
          detail: 'Click into the pin card to inspect the exact URL, coordinate marker, and user commentary. Add supervisor guidance or escalate to engineering.'
        },
        {
          step: '3',
          title: 'Sign Off & Close Loop',
          detail: 'When a fix or content update is deployed, verify it on the live view and mark the pin Resolved so the submitting user receives confirmation.'
        }
      ],
      proTips: [
        'Ask your App Admin to grant Pinboard Access to your lead field technicians so they can pin issues directly from tablets or laptops on site.'
      ],
      troubleshooting: [
        {
          issue: 'A team member needs to submit pins on a floorplan but does not have the Pin button.',
          resolution: 'Coordinate with an App Admin to check the "Pinboard Access" box for that user in the Administration -> User Management matrix.'
        }
      ]
    }
  },
  {
    id: 'admin-overview',
    categoryId: 'admin',
    order: 1,
    title: 'Admin Overview',
    icon: '🛡️',
    badge: 'ADMIN ONLY',
    scope: 'universal',
    roles: ['admin', 'super_admin'],
    subtitle: 'Architectural overview of tenant administration, user permission checkboxes, and module governance.',
    summary: {
      leadTitle: 'Administrator Command Reference',
      leadText: 'Restricted to App Administrators and Super-Admins. Manage who can access the Visual Pin Board, customize tenant help articles, and govern privacy controls.',
      highlights: [
        {
          icon: '☑️',
          title: 'Granular User Pinboard Checkboxes',
          text: 'Selectively enable or disable Visual Pin Board access per individual user inside your web application.'
        },
        {
          icon: '🧱',
          title: 'Web App vs. Commercial Site Separation',
          text: 'Web applications (`appType: web_app`) automatically suppress commercial website tabs (Leads, Quotes, Social, Billing) unless a Super-Admin explicitly enables them for a specific administrator.'
        },
        {
          icon: '📚',
          title: 'Custom Help Topic Authoring',
          text: 'Add or override custom documentation topics (with both Summary View and Complete Guide) tailored to your application.'
        }
      ],
      quickSteps: [
        'Open the User Pinboard & Access Matrix to checkbox which app users can use the Pinboard.',
        'Review your tenant\'s Custom Help topics in the Deep Help Builder.',
        'Super-Admins: configure which Command Portal navigation links are visible to each App Admin.'
      ]
    },
    complete: {
      overview: 'This Complete Administrator Guide explains the multi-tenant security model, the difference between Web App tenants (like OneEM) and Commercial Website tenants, and how to govern per-user capabilities.',
      callouts: [
        {
          type: 'purple',
          icon: '🏛️',
          title: 'Why Web Apps Have Granular Portal Views',
          body: 'Enterprise web apps like OneEM (`oneem.sonitor.com`) have completely different licensing and operational tools than commercial lead-generation websites. Leads, Quotes, Social Syndication, and Commercial Add-Ons do not belong in view for anyone except a Super-Admin or an Admin for whom a Super-Admin explicitly turns those links ON.'
        }
      ],
      steps: [
        {
          step: '1',
          title: 'Manage Per-User Pinboard Checkboxes',
          detail: 'Navigate to Administration -> User Pinboard & Access Matrix. For each user in your web app, toggle `[x] Pinboard Access` and `[x] Can View Team Pins`. Changes take effect immediately.'
        },
        {
          step: '2',
          title: 'Assign User Help Tiers',
          detail: 'Set each user\'s Help & Portal Role (`Standard User`, `Project Manager`, or `App Admin`) to control which documentation categories appear in their left Contents sidebar.'
        },
        {
          step: '3',
          title: 'Author Custom Tenant Help (Summary + Complete Guide)',
          detail: 'Use the Custom Help Topic Composer to publish new guides specific to your deployment. Every custom topic supports both a Quick Summary View and a Complete Full Guide.'
        },
        {
          step: '4',
          title: 'Super-Admin Link Visibility Overrides (Super-Admin Only)',
          detail: 'Super-Admins can check or uncheck navigation link visibility (`Leads & Quotes`, `Social Command`, `Commercial Add-Ons`, `Billing & Gateways`) per individual App Admin.'
        }
      ],
      proTips: [
        'Use the "Preview Portal As Role / User" selector at the top of the Command Portal to verify exactly what an App Admin, PM, or Standard User sees.'
      ],
      troubleshooting: [
        {
          issue: 'An App Admin on OneEM asks why they cannot see Leads & Quotes or Commercial Billing.',
          resolution: 'By design, Web App licenses hide commercial website tools for all non-Super-Admins. A Super-Admin can toggle specific links ON for that Admin if required.'
        }
      ]
    }
  },
  {
    id: 'user-pinboard-permissions',
    categoryId: 'admin',
    order: 2,
    title: 'User Management & Pinboard Checkboxes',
    icon: '☑️',
    badge: 'GRANULAR ACCESS',
    scope: 'universal',
    roles: ['admin', 'super_admin'],
    subtitle: 'Selectively grant Visual Pin Board access and role visibility to specific users in your web app.',
    summary: {
      leadTitle: 'Per-User Pinboard Checkbox Matrix',
      leadText: 'In enterprise web apps like OneEM, you control exactly which users can see and use the Visual Pin Board via simple checkboxes.',
      highlights: [
        {
          icon: '📌',
          title: 'Checkbox 1: Pinboard Access (`pinboardAccess`)',
          text: 'When checked, the floating Pinboard launcher and pin overlay are enabled for that user inside the web app.'
        },
        {
          icon: '👥',
          title: 'Checkbox 2: View All Team Pins (`pinboardTeamView`)',
          text: 'When checked, the user can view and comment on pins dropped by other team members. When unchecked, they only see their own pins.'
        },
        {
          icon: '🎚️',
          title: 'Role Tier Selector (`user` | `pm` | `admin`)',
          text: 'Determines whether the user sees only Standard User help or unlocks Project Manager and Administration guides.'
        }
      ],
      quickSteps: [
        'Select your application tenant (e.g., OneEM `oneem.sonitor.com`).',
        'Locate the user in the App User Access Matrix.',
        'Check or uncheck "Pinboard Access" and "View Team Pins" - updates save and apply immediately.'
      ]
    },
    complete: {
      overview: 'Detailed administrative procedure for provisioning users, toggling per-user Visual Pin Board entitlements, and auditing Super-Admin navigation link overrides.',
      callouts: [
        {
          type: 'emerald',
          icon: '⚡',
          title: 'Instant Zero-Deploy Entitlement Updates',
          body: 'Checking or unchecking Pinboard Access for a user updates the central entitlement state immediately without requiring a container rebuild or application redeploy.'
        }
      ],
      steps: [
        {
          step: '1',
          title: 'Filter by Application / Tenant',
          detail: 'In the Command Portal or App Admin Portal, select the target Web App (such as `oneem-sonitor` or `compliancepro-sonitor`).'
        },
        {
          step: '2',
          title: 'Toggle User Pinboard Checkboxes',
          detail: 'Check `[x] Pinboard Access` for users who should be able to drop pins on screens and floorplans. Uncheck it for general read-only users to keep their UI completely distraction-free.'
        },
        {
          step: '3',
          title: 'Configure Super-Admin Link Visibility (Super-Admin Only)',
          detail: 'For any user with the `App Admin` role, Super-Admins see an additional set of checkboxes (`Show Leads & Quotes`, `Show Social Command`, `Show Commercial Add-Ons`, `Show Billing`). Leave these unchecked for pure Web App admins.'
        }
      ],
      proTips: [
        'Grant "Pinboard Access" + "Own Pins Only" to external customer testers so they can submit feedback without seeing internal engineering pins.'
      ],
      troubleshooting: [
        {
          issue: 'Can an App Admin turn on Commercial Billing or Leads links for themselves?',
          resolution: 'No. Only a Super-Admin can toggle commercial portal navigation links ON or OFF for an App Admin.'
        }
      ]
    }
  },
  {
    id: 'faq-knowledge-search',
    categoryId: 'help',
    order: 1,
    title: 'FAQ & Knowledge Search',
    icon: '❓',
    badge: null,
    scope: 'universal',
    roles: ['user', 'pm', 'admin', 'super_admin'],
    subtitle: 'Frequently asked questions across workspace access, Visual Pin Board, and custom application tools.',
    summary: {
      leadTitle: 'Top Frequently Asked Questions',
      leadText: 'Quick answers to the most common questions from standard users, project managers, and administrators.',
      highlights: [
        {
          icon: '💡',
          title: 'How do I switch from Summary View to the Full Guide?',
          text: 'Click the "Toggle to view Full Guide ->" switch in the top-right corner of any documentation banner.'
        },
        {
          icon: '📌',
          title: 'How do I get access to the Visual Pin Board in my web app?',
          text: 'Your App Administrator can enable it for your account with a single checkbox in the User Pinboard Access Matrix.'
        },
        {
          icon: '🔒',
          title: 'Why does my portal view only show Pinboard and Deep Help?',
          text: 'Web App portals are streamlined for your specific role. Commercial marketing tools (Leads, Quotes, Social, Billing) are hidden unless a Super-Admin enables them for your admin account.'
        }
      ],
      quickSteps: [
        'Type any keyword in the top-left Contents search bar to filter all topics.',
        'Flip to the Complete Guide on this page for the full categorized FAQ directory.',
        'Drop a Question pin on any screen if you need contextual assistance from your admin.'
      ]
    },
    complete: {
      overview: 'Complete categorized FAQ database covering General Navigation, Visual Pin Board, Role Permissions, and Privacy.',
      callouts: [
        {
          type: 'blue',
          icon: '💬',
          title: 'Need App-Specific Help?',
          body: 'Look for topics badged with your application name in the FEATURES and PROJECT MANAGER GUIDES sections of the left sidebar.'
        }
      ],
      steps: [
        {
          step: 'Q1',
          title: 'What is the difference between Universal Help and Custom App Help?',
          detail: 'Universal Help covers shared platform capabilities (like Visual Pin Board, User Checkboxes, and Profile Management). Custom App Help contains guides written specifically for your application (such as OneEM RTLS Floorplans or CompliancePro Training Modules).'
        },
        {
          step: 'Q2',
          title: 'Can each customer or web app have its own custom help articles?',
          detail: 'Yes. Every site or web app key (`siteKey`) merges the Universal Help base with its own custom tenant knowledge pack and any custom topics created in the Deep Help Builder.'
        },
        {
          step: 'Q3',
          title: 'How do privacy opt-outs work for commercial spokes?',
          detail: 'Commercial customers can opt out of central PII aggregation for Leads/Quotes and Social Content while maintaining anonymized SHA-256 operational health telemetry.'
        }
      ],
      proTips: [
        'Admins can add new FAQ items or custom workflow guides for their specific site in under 60 seconds using the "+ Add Custom Help Topic" button.'
      ],
      troubleshooting: []
    }
  }
];

/**
 * Custom Tenant / Application Help Packs (`tenants/<siteKey>`)
 * Merged dynamically with UNIVERSAL_HELP_TOPICS based on active siteKey and user role.
 */
export const TENANT_HELP_PACKS = {
  'oneem-sonitor': {
    siteKey: 'oneem-sonitor',
    siteName: 'OneEM Enterprise Lifecycle & RTLS Platform (oneem.sonitor.com)',
    appType: 'web_app',
    docTitle: 'Documentation',
    docSubtitle: 'Everything you need to know about using the OneEM Enterprise Lifecycle & RTLS Platform',
    accentColor: '#7c3aed',
    customTopics: [
      {
        id: 'oneem-dashboard-overview',
        categoryId: 'features',
        order: 1,
        title: 'OneEM Dashboard & Hospital Lifecycle',
        icon: '🏥',
        badge: 'ONEEM APP',
        scope: 'custom',
        roles: ['user', 'pm', 'admin', 'super_admin'],
        subtitle: 'Navigate hospital RTLS deployments, lifecycle phases, and active engineering tasks.',
        summary: {
          leadTitle: 'OneEM Lifecycle Command Overview',
          leadText: 'OneEM manages the complete lifecycle of clinical RTLS deployments from site survey and floorplan CAD ingestion to BOM allocation, commissioning, and ongoing hospital support.',
          highlights: [
            {
              icon: '🗺️',
              title: 'Hospital & Campus Hierarchy',
              text: 'Drill down from Health System -> Campus -> Building -> Floor -> Clinical Room & Zone.'
            },
            {
              icon: '📌',
              title: 'In-App Visual Pinning on Floorplans & Screens',
              text: 'Users with Pinboard Access enabled by an OneEM Admin can drop visual pins directly onto floorplan views, BOM tables, or commissioning checklists.'
            }
          ],
          quickSteps: [
            'Select your active Hospital Project from the top project switcher.',
            'Review phase readiness badges across Survey, Design, Install, and Commissioning.',
            'Use the Visual Pin Board (if enabled for your user account) to flag floorplan or hardware discrepancies.'
          ]
        },
        complete: {
          overview: 'The OneEM Complete Guide covers multi-building hospital project structures, RTLS gateway/transmitter lifecycle tracking, and how field engineers collaborate using visual pins.',
          callouts: [
            {
              type: 'purple',
              icon: '🔄',
              title: 'One Platform from Site Survey to Live Clinical Operations',
              body: 'Every room, ultrasound transmitter, gateway, and Cisco AP cross-reference lives in a single structured lifecycle database.'
            }
          ],
          steps: [
            {
              step: '1',
              title: 'Select Hospital Deployment & Building Floor',
              detail: 'Open the Projects workspace and choose the target hospital campus and floor level to inspect room-level RTLS coverage and device counts.'
            },
            {
              step: '2',
              title: 'Inspect Bill of Materials (BOM) & Sensor Assignments',
              detail: 'Verify transmitter models, power profiles, and mounting specifications per room before field installation.'
            },
            {
              step: '3',
              title: 'Pin Field Discrepancies Directly on the View',
              detail: 'If a room layout changed due to hospital renovation or a gateway mount location needs adjustment, click 📌 Pin Mode and click the exact room or row to notify the Project Manager.'
            }
          ],
          proTips: [
            'Tag floorplan pins with the exact Room ID in the title (e.g., "HPG-6FL-RM-613 Transmitter Offset") for rapid engineering lookup.'
          ],
          troubleshooting: [
            {
              issue: 'I am an OneEM field user and do not see the Pinboard icon.',
              resolution: 'Ask your OneEM Administrator to check the "Pinboard Access" box next to your name in the OneEM User Access Matrix.'
            }
          ]
        }
      },
      {
        id: 'oneem-floorplan-pinning',
        categoryId: 'features',
        order: 3,
        title: 'Floorplan & BOM Visual Pinning',
        icon: '🗺️',
        badge: 'ONEEM APP',
        scope: 'custom',
        requiresPinboardAccess: true,
        roles: ['user', 'pm', 'admin', 'super_admin'],
        subtitle: 'How authorized OneEM users pin room changes, transmitter relocations, and UI issues.',
        summary: {
          leadTitle: 'Pinning Inside OneEM (`oneem.sonitor.com`)',
          leadText: 'When your OneEM Admin enables Pinboard Access for your account, you can drop precision markers on any OneEM screen without leaving your workflow.',
          highlights: [
            {
              icon: '📍',
              title: 'Room-Level Precision',
              text: 'Drop pins directly on floorplan maps, device allocation tables, or lifecycle milestone cards.'
            },
            {
              icon: '⚡',
              title: 'Direct Sync to OneEM Command Triage',
              text: 'Every pin is scoped strictly to `oneem-sonitor` and visible only to authorized OneEM team members and administrators.'
            }
          ],
          quickSteps: [
            'Open the specific floorplan or BOM screen in OneEM.',
            'Click the 📌 Pinboard button and click the exact room or table cell.',
            'Select Severity and submit - your OneEM Project Manager is notified immediately.'
          ]
        },
        complete: {
          overview: 'Step-by-step SOP for field engineers, clinical deployment specialists, and QA reviewers using the Visual Pin Board inside OneEM.',
          callouts: [
            {
              type: 'blue',
              icon: '🔒',
              title: 'Strict Tenant Isolation',
              body: 'OneEM pins, users, and help documentation are completely isolated to the `oneem-sonitor` application license.'
            }
          ],
          steps: [
            {
              step: '1',
              title: 'Verify Your OneEM Pinboard Entitlement',
              detail: 'Confirm that the 📌 Pinboard launcher appears in your OneEM interface (controlled by your OneEM Admin via the User Checkbox Matrix).'
            },
            {
              step: '2',
              title: 'Drop a Contextual Marker',
              detail: 'Click the target location, describe the physical or software observation, and select whether it blocks installation (Critical/Major) or is a documentation update (Minor).'
            },
            {
              step: '3',
              title: 'Track Engineering Resolution',
              detail: 'Open the Pinboard drawer in OneEM to see replies from the Lead Architect or Project Manager and verify when the update is marked Resolved.'
            }
          ],
          proTips: [
            'Include the hardware MAC or Serial ID in the pin description when reporting device-specific commissioning issues.'
          ],
          troubleshooting: []
        }
      },
      {
        id: 'oneem-pm-commissioning',
        categoryId: 'pm-guides',
        order: 2,
        title: 'RTLS Commissioning & QA Workflow',
        icon: '📡',
        badge: 'ONEEM PM',
        scope: 'custom',
        roles: ['pm', 'admin', 'super_admin'],
        subtitle: 'Project Manager guide for governing hospital installation sign-offs and resolving field pins.',
        summary: {
          leadTitle: 'Managing OneEM Hospital Rollouts',
          leadText: 'Guide for OneEM Project Managers overseeing field engineering teams, BOM lock-downs, and clinical room validation.',
          highlights: [
            {
              icon: '✅',
              title: 'Phase Gate Verification',
              text: 'Ensure all Critical and Major floorplan pins are resolved before advancing a hospital floor from Install to Clinical Go-Live.'
            }
          ],
          quickSteps: [
            'Filter the OneEM Pinboard by open Critical items before daily standup.',
            'Assign field technicians Pinboard Access checkboxes during active hospital walk-throughs.',
            'Export resolved pin logs as part of the hospital commissioning sign-off package.'
          ]
        },
        complete: {
          overview: 'Complete Project Manager operating procedure for OneEM deployments, combining lifecycle milestone governance with visual pin triage.',
          callouts: [
            {
              type: 'purple',
              icon: '🏥',
              title: 'Clinical Grade Auditability',
              body: 'Every floorplan adjustment and commissioning note pinned in OneEM preserves a permanent timestamped audit trail.'
            }
          ],
          steps: [
            {
              step: '1',
              title: 'Pre-Deployment User Provisioning',
              detail: 'Work with the OneEM Admin to check `[x] Pinboard Access` for all field engineers assigned to the hospital walk-through.'
            },
            {
              step: '2',
              title: 'Daily Floorplan & BOM Triage',
              detail: 'Review pins submitted from the hospital floor, update CAD/BOM parameters, and reply in-thread.'
            },
            {
              step: '3',
              title: 'Go-Live Sign-Off',
              detail: 'Verify zero open Critical pins prior to customer handover.'
            }
          ],
          proTips: [],
          troubleshooting: []
        }
      }
    ]
  },

  'compliancepro-sonitor': {
    siteKey: 'compliancepro-sonitor',
    siteName: 'Sonitor Training & Compliance Platform (compliancepro-sonitor)',
    appType: 'web_app',
    docTitle: 'Documentation',
    docSubtitle: 'Everything you need to know about using the Sonitor Training & Compliance Platform',
    accentColor: '#9333ea',
    customTopics: [
      {
        id: 'pro-benefits',
        categoryId: 'basics',
        order: 4,
        title: 'PRO & PRO+ Benefits',
        icon: '✨',
        badge: null,
        scope: 'custom',
        roles: ['user', 'pm', 'admin', 'super_admin'],
        subtitle: 'Enterprise capabilities unlocked in CompliancePro PRO & PRO+ tiers.',
        summary: {
          leadTitle: 'CompliancePro Enterprise Tier Capabilities',
          leadText: 'Overview of automated compliance tracking, reusable training modules, digital certificates, and multi-project assessment workflows.',
          highlights: [
            {
              icon: '🎓',
              title: 'Centralized Reusable Training Library',
              text: 'Create a training module once and assign it across unlimited projects without content duplication.'
            },
            {
              icon: '🏅',
              title: 'Automated Verifiable Certificates',
              text: 'Issue tamper-evident completion certificates immediately upon passing required assessments.'
            }
          ],
          quickSteps: [
            'Browse your assigned Projects and Training Modules from the Features menu.',
            'Complete required quizzes to unlock your completion certificate.',
            'Use the Summary / Full Guide toggle on any topic for deep step-by-step instructions.'
          ]
        },
        complete: {
          overview: 'Detailed breakdown of CompliancePro enterprise features across standard learners, project managers, and platform administrators.',
          callouts: [
            {
              type: 'purple',
              icon: '🚀',
              title: 'The Godfather Help Standard',
              body: 'CompliancePro pioneered the dual-mode Summary View + Complete Guide help system now deployed across the entire GreenTree Command ecosystem.'
            }
          ],
          steps: [
            {
              step: '1',
              title: 'Role-Based Learning Paths',
              detail: 'Learners are automatically enrolled in the exact training modules and quizzes required for their project group.'
            },
            {
              step: '2',
              title: 'Real-Time Supervisor Compliance Dashboards',
              detail: 'Project Managers track completion percentages, assessment scores, and expiring certifications in real time.'
            }
          ],
          proTips: [],
          troubleshooting: []
        }
      },
      {
        id: 'training-modules',
        categoryId: 'features',
        order: 3,
        title: 'Training Modules',
        icon: '🎓',
        badge: null,
        scope: 'custom',
        roles: ['user', 'pm', 'admin', 'super_admin'],
        subtitle: 'Access comprehensive training materials, infographics, and educational content.',
        summary: {
          leadTitle: 'Your Learning Library',
          leadText: 'Training modules contain all the information you need to learn new skills and stay compliant. Take your time, review materials carefully, and ask questions if anything is unclear!',
          highlights: [
            {
              icon: '🔄',
              title: 'Smart Content Management - One Training, Many Projects',
              text: 'Training modules are centralized and reusable. A single training document like "OSHA Safety Standards" can be assigned to unlimited projects without duplication. This means admins create content once and deploy it everywhere, while you get consistent, up-to-date training across all your projects!'
            },
            {
              icon: '📑',
              title: 'Multi-Format Interactive Content',
              text: 'Study rich HTML guides, embedded video walkthroughs, downloadable SOP PDFs, and interactive checkpoints.'
            }
          ],
          quickSteps: [
            'Select "Training Modules" from your navigation bar or project view.',
            'Read through all sections of the assigned module at your own pace.',
            'Click "Mark Complete" or proceed directly to the linked Quiz & Assessment.'
          ]
        },
        complete: {
          overview: 'Complete guide to navigating, completing, and managing centralized Training Modules across single or multiple compliance projects.',
          callouts: [
            {
              type: 'purple',
              icon: '🔄',
              title: 'Smart Content Management - One Training, Many Projects',
              body: 'Training modules are centralized and reusable. When an administrator updates a master training module, every linked project automatically reflects the latest revision while preserving historical completion records.'
            },
            {
              type: 'emerald',
              icon: '💡',
              title: 'Progress Auto-Save',
              body: 'Your reading progress and section checkpoints are saved automatically so you can resume on any device.'
            }
          ],
          steps: [
            {
              step: '1',
              title: 'Launching an Assigned Module',
              detail: 'Open your active Project or click Training Modules. Modules are badged as Not Started, In Progress, or Completed.'
            },
            {
              step: '2',
              title: 'Reviewing Materials & Attachments',
              detail: 'Read through the structured lessons, inspect visual infographics, and download any attached reference checklists.'
            },
            {
              step: '3',
              title: 'Completing the Linked Assessment',
              detail: 'Once all module sections are reviewed, launch the linked Quiz to validate comprehension and generate your certificate.'
            }
          ],
          proTips: [
            'Use the search bar inside the Training Library to filter modules by project tag or compliance category.'
          ],
          troubleshooting: [
            {
              issue: 'The "Start Quiz" button is locked on my training module.',
              resolution: 'Ensure you have scrolled through all required sections of the training module and clicked "Acknowledge / Complete Reading" at the bottom.'
            }
          ]
        }
      },
      {
        id: 'quizzes-assessments',
        categoryId: 'features',
        order: 4,
        title: 'Quizzes & Assessments',
        icon: '✅',
        badge: null,
        scope: 'custom',
        roles: ['user', 'pm', 'admin', 'super_admin'],
        subtitle: 'Validate your knowledge with interactive quizzes, instant grading, and retake guidance.',
        summary: {
          leadTitle: 'Taking Quizzes & Compliance Assessments',
          leadText: 'Assessments verify mastery of your assigned training modules and automatically unlock your completion certificates upon reaching the passing threshold.',
          highlights: [
            {
              icon: '🎯',
              title: 'Instant Scoring & Feedback',
              text: 'See your score immediately upon submission along with guidance on any missed questions.'
            }
          ],
          quickSteps: [
            'Complete the prerequisite Training Module first.',
            'Answer all multiple-choice or scenario questions and click Submit Assessment.',
            'Download your Certificate once you achieve the required passing score.'
          ]
        },
        complete: {
          overview: 'Full walk-through of quiz formats, passing thresholds, attempt limits, and supervisor review workflows.',
          callouts: [
            {
              type: 'blue',
              icon: '🏅',
              title: 'Automatic Certificate Issuance',
              body: 'Passing an assessment immediately triggers certificate generation and updates your project compliance matrix.'
            }
          ],
          steps: [
            {
              step: '1',
              title: 'Start Assessment Session',
              detail: 'Verify the passing score requirement (typically 80% or 100% for critical safety modules) before beginning.'
            },
            {
              step: '2',
              title: 'Submit & Review Results',
              detail: 'Review your graded scorecard. If a retake is needed, review the highlighted training section and launch a new attempt.'
            }
          ],
          proTips: [],
          troubleshooting: []
        }
      },
      {
        id: 'certificates',
        categoryId: 'features',
        order: 5,
        title: 'Certificates',
        icon: '🏅',
        badge: null,
        scope: 'custom',
        roles: ['user', 'pm', 'admin', 'super_admin'],
        subtitle: 'View, download, and verify your official training completion certificates.',
        summary: {
          leadTitle: 'Your Official Compliance Certificates',
          leadText: 'Every completed training and assessment track generates a verifiable PDF certificate with your name, completion date, and unique verification ID.',
          highlights: [
            {
              icon: '📄',
              title: '1-Click PDF Download',
              text: 'Download print-ready certificates for your personnel file or hospital credentialing packet.'
            }
          ],
          quickSteps: [
            'Navigate to Features -> Certificates.',
            'Click "Download PDF" or "Copy Verification Link" on any earned certificate.'
          ]
        },
        complete: {
          overview: 'Complete guide to certificate storage, expiration tracking, renewal alerts, and third-party verification.',
          callouts: [],
          steps: [
            {
              step: '1',
              title: 'Accessing Earned Certificates',
              detail: 'All earned certificates are permanently archived in your Certificates tab with issue dates and renewal timelines.'
            }
          ],
          proTips: [],
          troubleshooting: []
        }
      }
    ]
  },

  'commercial-default': {
    siteKey: 'commercial-default',
    siteName: 'GreenTree Commercial Spoke Website',
    appType: 'commercial_site',
    docTitle: 'Documentation & Site Owner Help Center',
    docSubtitle: 'Everything you need to know about managing your website, Pinboard, Leads, Social Command, and Privacy',
    accentColor: '#10b981',
    customTopics: [
      {
        id: 'commercial-leads-quotes',
        categoryId: 'features',
        order: 4,
        title: 'Leads, Quotes & Form Telemetry',
        icon: '📥',
        badge: 'COMMERCIAL SITE',
        scope: 'custom',
        commercialOnly: true,
        roles: ['admin', 'super_admin'],
        subtitle: 'Manage inbound customer quote requests, form delivery receipts, and PII privacy controls.',
        summary: {
          leadTitle: 'Inbound Leads & Quote CRM (`MOD-QUOTE-CRM`)',
          leadText: 'Track every contact form and quote request submitted on your website, with cryptographic proof of PostgreSQL storage and SmarterMail SMTP delivery.',
          highlights: [
            {
              icon: '🛡️',
              title: 'PII Opt-Out with Anonymized Health Receipts',
              text: 'You can opt out of sharing customer contact PII with the central Command Portal at any time while GreenTree retains an anonymized SHA-256 operational receipt proving your forms and email delivery are working 100%.'
            }
          ],
          quickSteps: [
            'Open the Leads & Quote CRM tab to view and respond to customer inquiries.',
            'Configure your PII privacy preference under Data Privacy & Central Aggregation Controls.'
          ]
        },
        complete: {
          overview: 'Complete guide to inbound lead capture, automated SMTP notifications, and zero-trust PII redaction controls.',
          callouts: [
            {
              type: 'emerald',
              icon: '🩺',
              title: 'Guaranteed Form Health Monitoring Without Exposing PII',
              body: 'Even when Customer PII Opt-Out is enabled, the system records HTTP 200 form ingestion, local database persistence, and SMTP 250 OK delivery codes so broken forms are detected immediately.'
            }
          ],
          steps: [
            {
              step: '1',
              title: 'Reviewing Inbound Leads',
              detail: 'Inspect lead contact details, requested service type, and source page URL in your local Admin Portal.'
            },
            {
              step: '2',
              title: 'Toggling Central PII Opt-Out',
              detail: 'In Privacy Controls, toggle "Opt-Out of Central Leads/Quotes PII Aggregation" if you want customer names, emails, and phones masked in the central GreenTree Command view.'
            }
          ],
          proTips: [],
          troubleshooting: []
        }
      },
      {
        id: 'commercial-social-command',
        categoryId: 'features',
        order: 5,
        title: 'Social & Facebook Command',
        icon: '📣',
        badge: 'MOD-SOCIAL-COMMAND',
        scope: 'custom',
        commercialOnly: true,
        roles: ['admin', 'super_admin'],
        subtitle: 'Publish and schedule posts across your Facebook Pages and Administered Groups via Graph API v21.0.',
        summary: {
          leadTitle: 'Multi-Profile Facebook Page & Group Syndication',
          leadText: 'Connect your Facebook profiles, managed Pages, and administered Groups to publish immediately or schedule queued syndication with zero monthly SaaS fees.',
          highlights: [
            {
              icon: '🔗',
              title: 'Official Meta Graph API v21.0',
              text: 'Uses long-lived User and Page tokens for compliant publishing to Pages and Groups you administer.'
            },
            {
              icon: '🩺',
              title: 'Remote Connector Health Telemetry',
              text: 'If you opt out of central social content aggregation, Command still monitors your remote connector heartbeat and token validity.'
            }
          ],
          quickSteps: [
            'Connect your Facebook profile and Page/Group targets in Social & FB Command.',
            'Compose your post, check the target Pages/Groups, and choose Publish Now or Schedule.'
          ]
        },
        complete: {
          overview: 'Full operating guide for `MOD-SOCIAL-COMMAND`, including Meta Developer token exchange, multi-group queue staggering, and privacy opt-out.',
          callouts: [],
          steps: [
            {
              step: '1',
              title: 'Bind Profile to Your Customer Account',
              detail: 'Every social profile and target Page/Group is strictly bound to your `siteKey`.'
            },
            {
              step: '2',
              title: 'Schedule or Dispatch Campaigns',
              detail: 'The 60-second background scheduler dispatches queued posts automatically and logs the returned Facebook Graph post ID.'
            }
          ],
          proTips: [],
          troubleshooting: []
        }
      }
    ]
  }
};

/**
 * Custom Help Topics created dynamically at runtime by Admins / Super-Admins
 */
export const CUSTOM_USER_TOPICS = [];

/**
 * Primary Account Holder & Granular Access Registry (`APP_USER_REGISTRY`)
 *
 * Strictly zero mock/demo users. Each tenant entry represents the Primary Account Holder
 * for that customer or web application, isolated strictly by `siteKey`.
 */
export const APP_USER_REGISTRY = [
  {
    userId: 'usr-gene-superadmin',
    name: 'Gene Salvatore',
    email: 'gene@greentreehosting.com',
    title: 'Primary Account Holder & Super-Admin (GreenTree Hosting, LLC)',
    siteKey: 'greentreehosting-board',
    appType: 'super_admin',
    role: 'super_admin',
    pinboardAccess: true,
    pinboardTeamView: true,
    helpEditorAccess: true,
    adminVisibleLinks: {
      pinboard: true,
      deepHelp: true,
      appUsers: true,
      leadsQuotes: true,
      socialCommand: true,
      commercialAddons: true,
      billingGateways: true,
      fleetInfra: true
    }
  },
  {
    userId: 'usr-primary-oneem',
    name: 'OneEM Primary Account Holder',
    email: 'gene.salvatore@sonitor.com',
    title: 'Primary Account Holder (oneem.sonitor.com)',
    siteKey: 'oneem-sonitor',
    appType: 'web_app',
    role: 'admin',
    pinboardAccess: true,
    pinboardTeamView: true,
    helpEditorAccess: true,
    adminVisibleLinks: {
      pinboard: true,
      deepHelp: true,
      appUsers: true,
      leadsQuotes: false,
      socialCommand: false,
      commercialAddons: false,
      billingGateways: false,
      fleetInfra: false
    }
  },
  {
    userId: 'usr-primary-compliancepro',
    name: 'CompliancePro Primary Account Holder',
    email: 'gene.salvatore@sonitor.com',
    title: 'Primary Account Holder (compliancepro.sonitor.com)',
    siteKey: 'compliancepro-sonitor',
    appType: 'web_app',
    role: 'admin',
    pinboardAccess: true,
    pinboardTeamView: true,
    helpEditorAccess: true,
    adminVisibleLinks: {
      pinboard: true,
      deepHelp: true,
      appUsers: true,
      leadsQuotes: false,
      socialCommand: false,
      commercialAddons: false,
      billingGateways: false,
      fleetInfra: false
    }
  },
  {
    userId: 'usr-primary-cfelectrical',
    name: 'CF Electrical Service, LLC (Primary Account Holder)',
    email: 'contact@cfelectricalservice.com',
    title: 'Primary Account Holder (cfelectricalservice.com)',
    siteKey: 'cf-electrical-service',
    appType: 'commercial_site',
    role: 'admin',
    pinboardAccess: true,
    pinboardTeamView: true,
    helpEditorAccess: false,
    adminVisibleLinks: {
      pinboard: true,
      deepHelp: true,
      appUsers: true,
      leadsQuotes: true,
      socialCommand: true,
      commercialAddons: false,
      billingGateways: false,
      fleetInfra: false
    }
  },
  {
    userId: 'usr-primary-morningstar',
    name: 'Morning Star Tree Company Inc. (Primary Account Holder)',
    email: 'info@morningstartree.com',
    title: 'Primary Account Holder (whereismorningstartree.com)',
    siteKey: 'morningstartree-board',
    appType: 'commercial_site',
    role: 'admin',
    pinboardAccess: true,
    pinboardTeamView: true,
    helpEditorAccess: false,
    adminVisibleLinks: {
      pinboard: true,
      deepHelp: true,
      appUsers: true,
      leadsQuotes: true,
      socialCommand: true,
      commercialAddons: false,
      billingGateways: false,
      fleetInfra: false
    }
  },
  {
    userId: 'usr-primary-modztowing',
    name: "Modzelewski's Recovery & Heavy Hauling (Primary Account Holder)",
    email: 'modz@greentreemail.com',
    title: 'Primary Account Holder (modztowing.greentreehosting.com)',
    siteKey: 'modz-review-board',
    appType: 'commercial_site',
    role: 'admin',
    pinboardAccess: true,
    pinboardTeamView: true,
    helpEditorAccess: false,
    adminVisibleLinks: {
      pinboard: true,
      deepHelp: true,
      appUsers: true,
      leadsQuotes: true,
      socialCommand: true,
      commercialAddons: false,
      billingGateways: false,
      fleetInfra: false
    }
  },
  {
    userId: 'usr-primary-modzautobody',
    name: "Modzelewski's Auto Body Works (Primary Account Holder)",
    email: 'modz@greentreemail.com',
    title: 'Primary Account Holder (modzautobody.greentreehosting.com)',
    siteKey: 'modz-autobody-review-board',
    appType: 'commercial_site',
    role: 'admin',
    pinboardAccess: true,
    pinboardTeamView: true,
    helpEditorAccess: false,
    adminVisibleLinks: {
      pinboard: true,
      deepHelp: true,
      appUsers: true,
      leadsQuotes: true,
      socialCommand: true,
      commercialAddons: false,
      billingGateways: false,
      fleetInfra: false
    }
  },
  {
    userId: 'usr-primary-tbptransport',
    name: 'TBP Transportation LLC (Primary Account Holder)',
    email: 'dispatch@tbptransport.com',
    title: 'Primary Account Holder (tbptransport.greentreehosting.com)',
    siteKey: 'tbptransport',
    appType: 'commercial_site',
    role: 'admin',
    pinboardAccess: true,
    pinboardTeamView: true,
    helpEditorAccess: false,
    adminVisibleLinks: {
      pinboard: true,
      deepHelp: true,
      appUsers: true,
      leadsQuotes: true,
      socialCommand: true,
      commercialAddons: false,
      billingGateways: false,
      fleetInfra: false
    }
  },
  {
    userId: 'usr-primary-genetravels',
    name: 'GeneTravels.com (Primary Account Holder)',
    email: 'gene@genetravels.com',
    title: 'Primary Account Holder (genetravels.com)',
    siteKey: 'genetravels',
    appType: 'commercial_site',
    role: 'admin',
    pinboardAccess: true,
    pinboardTeamView: true,
    helpEditorAccess: true,
    adminVisibleLinks: {
      pinboard: true,
      deepHelp: true,
      appUsers: true,
      leadsQuotes: true,
      socialCommand: true,
      commercialAddons: false,
      billingGateways: false,
      fleetInfra: false
    }
  },
  {
    userId: 'usr-primary-hijackradar',
    name: 'HijackRadar.com (Primary Account Holder)',
    email: 'hijackradar@greentreemail.com',
    title: 'Primary Account Holder (hijackradar.com)',
    siteKey: 'hijackradar',
    appType: 'web_app',
    role: 'admin',
    pinboardAccess: true,
    pinboardTeamView: true,
    helpEditorAccess: true,
    adminVisibleLinks: {
      pinboard: true,
      deepHelp: true,
      appUsers: true,
      leadsQuotes: true,
      socialCommand: false,
      commercialAddons: false,
      billingGateways: false,
      fleetInfra: false
    }
  },
  {
    userId: 'usr-fpm-president',
    name: 'David C. McCartin (President - Primary Account Holder)',
    email: 'dave@goindustrialsupplies.com',
    title: 'President & Primary Account Holder (Frank P. McCartin Co., Inc.)',
    siteKey: 'goindustrialsupplies',
    appType: 'commercial_site',
    role: 'admin',
    pinboardAccess: true,
    pinboardTeamView: true,
    helpEditorAccess: true,
    adminVisibleLinks: {
      pinboard: true,
      deepHelp: true,
      appUsers: true,
      leadsQuotes: true,
      socialCommand: true,
      commercialAddons: false,
      billingGateways: false,
      fleetInfra: false
    }
  },
  {
    userId: 'usr-fpm-electrical',
    name: 'Electrical, Lighting & Electronics Counter Desk',
    email: 'ELE@goindustrialsupplies.com',
    title: 'Electrical & Electronics Counter (149 Congress St, Lowell, MA)',
    siteKey: 'goindustrialsupplies',
    appType: 'commercial_site',
    role: 'pm',
    pinboardAccess: true,
    pinboardTeamView: true,
    helpEditorAccess: false,
    adminVisibleLinks: {
      pinboard: true,
      deepHelp: true,
      appUsers: false,
      leadsQuotes: true,
      socialCommand: false,
      commercialAddons: false,
      billingGateways: false,
      fleetInfra: false
    }
  },
  {
    userId: 'usr-fpm-pvf',
    name: 'Plumbing, PVF, Steam & Pipe Threading Counter Desk',
    email: 'PVF@goindustrialsupplies.com',
    title: 'Plumbing, Steam Traps, Boiler & 4" Pipe Threading Desk',
    siteKey: 'goindustrialsupplies',
    appType: 'commercial_site',
    role: 'pm',
    pinboardAccess: true,
    pinboardTeamView: true,
    helpEditorAccess: false,
    adminVisibleLinks: {
      pinboard: true,
      deepHelp: true,
      appUsers: false,
      leadsQuotes: true,
      socialCommand: false,
      commercialAddons: false,
      billingGateways: false,
      fleetInfra: false
    }
  },
  {
    userId: 'usr-fpm-ar',
    name: 'Accounts Receivable, COMMBUYS FAC124 & MHEC Desk',
    email: 'ar@goindustrialsupplies.com',
    title: 'Finance, Credit Applications, ST-4/ST-5 & Municipal Contracts',
    siteKey: 'goindustrialsupplies',
    appType: 'commercial_site',
    role: 'pm',
    pinboardAccess: true,
    pinboardTeamView: true,
    helpEditorAccess: false,
    adminVisibleLinks: {
      pinboard: true,
      deepHelp: true,
      appUsers: false,
      leadsQuotes: true,
      socialCommand: false,
      commercialAddons: false,
      billingGateways: false,
      fleetInfra: false
    }
  }
];

const SITE_BRAND_COLORS = {
  'cf-electrical-service': '#d97706',
  'morningstartree-board': '#15803d',
  'modz-review-board': '#d97706',
  'modz-autobody-review-board': '#2563eb',
  'tbptransport': '#d97706',
  'hijackradar': '#2563eb',
  'greentreehosting-board': '#16a34a',
  'geothermalma': '#16a34a',
  'ogdenwells': '#0284c7',
  'genetravels': '#0284c7',
  'goindustrialsupplies': '#01638A',
  'backstageimagesri': '#F59E0B',
  'oneem-sonitor': '#7c3aed',
  'compliancepro-sonitor': '#9333ea'
};

/**
 * Resolves the merged Help & Documentation payload (Universal + Custom Tenant/App Help)
 * filtered by `siteKey`, `role`, and `pinboardAccess`.
 */
export function getDeepHelpCatalog({ siteKey = 'oneem-sonitor', role = 'admin', pinboardAccess = true } = {}) {
  const tenantPack = TENANT_HELP_PACKS[siteKey] || (
    siteKey === 'compliancepro-sonitor'
      ? TENANT_HELP_PACKS['compliancepro-sonitor']
      : siteKey === 'oneem-sonitor'
        ? TENANT_HELP_PACKS['oneem-sonitor']
        : TENANT_HELP_PACKS['commercial-default']
  );

  const appType = tenantPack.appType || 'commercial_site';
  const accentColor = SITE_BRAND_COLORS[siteKey] || tenantPack.accentColor || '#2563eb';

  // Filter categories visible to this role
  const allowedCategories = HELP_CATEGORIES.filter(cat => cat.roles.includes(role));

  // Merge Universal + Tenant Custom + Runtime Custom topics
  const runtimeCustom = CUSTOM_USER_TOPICS.filter(t => t.siteKey === siteKey || t.siteKey === 'universal');
  const rawTopics = [
    ...UNIVERSAL_HELP_TOPICS,
    ...(tenantPack.customTopics || []),
    ...runtimeCustom
  ];

  // Filter topics by role, pinboard entitlement, and appType
  const visibleTopics = rawTopics.filter(topic => {
    if (topic.roles && !topic.roles.includes(role)) return false;
    if (topic.requiresPinboardAccess && !pinboardAccess && role === 'user') return false;
    if (topic.commercialOnly && appType === 'web_app' && role !== 'super_admin') return false;
    return true;
  });

  // Group into categories
  const categoriesWithTopics = allowedCategories.map(cat => {
    const topics = visibleTopics
      .filter(t => t.categoryId === cat.id)
      .sort((a, b) => (a.order || 99) - (b.order || 99));
    return {
      ...cat,
      topics
    };
  }).filter(cat => cat.topics.length > 0);

  return {
    siteKey,
    siteName: tenantPack.siteName,
    appType,
    docTitle: tenantPack.docTitle || 'Help & Documentation',
    docSubtitle: tenantPack.docSubtitle || 'Everything you need to know about using the platform',
    accentColor,
    role,
    pinboardAccess,
    totalTopics: visibleTopics.length,
    universalCount: visibleTopics.filter(t => t.scope === 'universal').length,
    customCount: visibleTopics.filter(t => t.scope === 'custom').length,
    categories: categoriesWithTopics
  };
}

/**
 * Adds or updates a Custom Help Topic (with both Summary View and Complete Guide)
 */
export function upsertCustomHelpTopic({
  siteKey = 'oneem-sonitor',
  categoryId = 'features',
  title,
  subtitle = '',
  icon = '📘',
  badge = 'CUSTOM GUIDE',
  roles = ['user', 'pm', 'admin', 'super_admin'],
  summaryLeadTitle = '',
  summaryLeadText = '',
  summaryHighlights = [],
  summaryQuickSteps = [],
  completeOverview = '',
  completeCalloutTitle = '',
  completeCalloutBody = '',
  completeSteps = [],
  proTips = [],
  troubleshooting = []
}) {
  if (!title) throw new Error('Topic title is required');
  const id = 'custom-' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36).slice(-4);
  const newTopic = {
    id,
    siteKey,
    categoryId,
    order: 50,
    title,
    icon,
    badge,
    scope: 'custom',
    roles,
    subtitle: subtitle || `Custom documentation guide for ${siteKey}`,
    summary: {
      leadTitle: summaryLeadTitle || title,
      leadText: summaryLeadText || subtitle,
      highlights: summaryHighlights.length > 0 ? summaryHighlights : [
        {
          icon: '✨',
          title: 'Key Operational Overview',
          text: summaryLeadText || 'Custom operational procedure tailored to your organization.'
        }
      ],
      quickSteps: summaryQuickSteps.length > 0 ? summaryQuickSteps : [
        'Review the summary highlights above.',
        'Toggle "Full Guide" in the top-right banner for step-by-step instructions.'
      ]
    },
    complete: {
      overview: completeOverview || summaryLeadText || `Complete step-by-step documentation for ${title}.`,
      callouts: completeCalloutTitle ? [
        {
          type: 'purple',
          icon: '💡',
          title: completeCalloutTitle,
          body: completeCalloutBody || ''
        }
      ] : [],
      steps: completeSteps.length > 0 ? completeSteps : [
        {
          step: '1',
          title: 'Follow Standard Operating Procedure',
          detail: completeOverview || summaryLeadText || 'Execute the workflow steps defined for this module.'
        }
      ],
      proTips,
      troubleshooting
    }
  };

  CUSTOM_USER_TOPICS.push(newTopic);
  return newTopic;
}

/**
 * Updates a user's granular Pinboard checkboxes or Super-Admin navigation link visibility
 */
export function updateAppUserPermissions({
  userId,
  pinboardAccess,
  pinboardTeamView,
  helpEditorAccess,
  role,
  adminVisibleLinks,
  actorRole = 'admin'
}) {
  const user = APP_USER_REGISTRY.find(u => u.userId === userId);
  if (!user) return null;

  if (typeof pinboardAccess === 'boolean') user.pinboardAccess = pinboardAccess;
  if (typeof pinboardTeamView === 'boolean') user.pinboardTeamView = pinboardTeamView;
  if (typeof helpEditorAccess === 'boolean') user.helpEditorAccess = helpEditorAccess;
  if (role && ['user', 'pm', 'admin', 'super_admin'].includes(role)) {
    // Only super_admin can promote someone to super_admin
    if (role !== 'super_admin' || actorRole === 'super_admin') {
      user.role = role;
    }
  }
  // Only Super-Admin can toggle commercial / platform navigation links for Admins
  if (adminVisibleLinks && typeof adminVisibleLinks === 'object' && actorRole === 'super_admin') {
    user.adminVisibleLinks = {
      ...user.adminVisibleLinks,
      ...adminVisibleLinks
    };
  }
  user.updatedAt = new Date().toISOString();
  return user;
}

/**
 * Adds a new user to an Application / Tenant (e.g., adding a user in OneEM and checking their Pinboard box)
 */
export function createAppUser({
  name,
  email,
  title = 'Application User',
  siteKey = 'oneem-sonitor',
  appType = 'web_app',
  role = 'user',
  pinboardAccess = true,
  pinboardTeamView = false,
  helpEditorAccess = false
}) {
  const userId = 'usr-' + siteKey.split('-')[0] + '-' + Date.now().toString(36).slice(-5);
  const newUser = {
    userId,
    name,
    email,
    title,
    siteKey,
    appType,
    role,
    pinboardAccess: Boolean(pinboardAccess),
    pinboardTeamView: Boolean(pinboardTeamView),
    helpEditorAccess: Boolean(helpEditorAccess),
    adminVisibleLinks: {
      pinboard: Boolean(pinboardAccess),
      deepHelp: true,
      appUsers: role === 'admin' || role === 'super_admin',
      leadsQuotes: appType === 'commercial_site' && role === 'admin',
      socialCommand: appType === 'commercial_site' && role === 'admin',
      commercialAddons: false,
      billingGateways: false,
      fleetInfra: false
    },
    createdAt: new Date().toISOString()
  };
  APP_USER_REGISTRY.push(newUser);
  return newUser;
}
