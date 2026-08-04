# Deliverable 3, 4 & 5: Information Architecture, Screen & Component Inventory

## 1. Information Architecture & Navigation Taxonomy

```
+-----------------------------------------------------------------------------------+
|                           DASHBOARD CAPSULE AI SITE MAP                           |
+-----------------------------------------------------------------------------------+
│
├── PUBLIC LANDING WEBSITE (/ public)
│   ├── Landing Page (/)
│   ├── Product Features (/features)
│   │   ├── AI Validation & Optimization (/features/ai-engine)
│   │   ├── Secure .dcaps Viewer (/features/viewer)
│   │   └── Security & Zero Trust (/features/security)
│   ├── Enterprise Pricing (/pricing)
│   ├── Documentation & API Docs (/docs)
│   ├── Engineering Blog (/blog)
│   └── Trust & Security Center (/security)
│
├── AUTHENTICATION FLOW (/auth)
│   ├── Login (/auth/login)
│   ├── Enterprise SSO Login (/auth/sso)
│   ├── User Signup (/auth/signup)
│   ├── Forgot / Reset Password (/auth/reset-password)
│   └── MFA Verification (/auth/mfa)
│
├── APP PLATFORM SHELL (/app) [Authenticated Workspace]
│   ├── Workspace Dashboard (/app/dashboard)
│   ├── Projects & Workspaces (/app/projects)
│   │   ├── Workspace Detail (/app/projects/[workspace_id])
│   │   └── Project Settings (/app/projects/[workspace_id]/settings)
│   ├── Ingestion & Conversion Hub (/app/import)
│   │   ├── Upload Step (/app/import/upload)
│   │   ├── AI Validation Review (/app/import/[job_id]/validation)
│   │   ├── AI Optimization Tuning (/app/import/[job_id]/optimization)
│   │   └── Capsule Compiler Step (/app/import/[job_id]/build)
│   ├── Capsule Repository (/app/capsules)
│   │   ├── Capsule Detail & Metadata (/app/capsules/[capsule_id])
│   │   └── Capsule Version History (/app/capsules/[capsule_id]/versions)
│   ├── AI Intelligence Hub (/app/ai)
│   │   ├── AI Health Score Directory (/app/ai/health)
│   │   ├── Auto Documentation Library (/app/ai/docs)
│   │   └── Custom AI Prompt Studio (/app/ai/prompts)
│   ├── Analytics & Telemetry (/app/analytics)
│   │   ├── Usage & View Insights (/app/analytics/views)
│   │   ├── Interactive Heatmaps (/app/analytics/heatmaps)
│   │   └── Performance Diagnostics (/app/analytics/performance)
│   ├── Sharing & Access Control (/app/sharing)
│   │   ├── Active Shared Links (/app/sharing/links)
│   │   ├── Access Policy Templates (/app/sharing/policies)
│   │   └── Domain Whitelists (/app/sharing/domains)
│   └── User Center
│       ├── User Profile Settings (/app/user/profile)
│       └── Notification Center (/app/user/notifications)
│
├── STANDALONE WASM VIEWER RUNTIME (/view)
│   ├── Secure Capsule Viewer (/view/[share_token])
│   ├── Passcode Authentication Screen (/view/[share_token]/auth)
│   └── Embedded AI Copilot Panel Overlay
│
├── ORGANIZATION & ADMIN MANAGEMENT (/admin)
│   ├── Tenant Overview & Metrics (/admin/overview)
│   ├── Organization Settings (/admin/organization)
│   ├── User & IAM Directory (/admin/users)
│   │   ├── User Detail & Roles (/admin/users/[user_id])
│   │   └── SCIM Provisioning Logs (/admin/users/scim)
│   ├── Security & Key Management (/admin/security)
│   ├── Immutable Audit Logs (/admin/audit-logs)
│   ├── Plugin & Integration Marketplace (/admin/marketplace)
│   ├── Subscription & Billing (/admin/billing)
│   │   ├── Usage Invoices (/admin/billing/invoices)
│   │   └── Payment Methods (/admin/billing/payment)
│   └── Platform System Health (/admin/system-health)
│
└── SYSTEM & UTILITY PAGES
    ├── 404 Not Found (/404)
    ├── 500 Internal Server Error (/500)
    ├── Maintenance Mode (/maintenance)
    └── Offline WASM Fallback Screen (/offline)
```

---

## 2. Screen Inventory Specification

### 2.1 Core Workspace Screens

| Screen ID | Screen Name | Route Path | Primary Purpose & Key UI Layout Elements |
| :--- | :--- | :--- | :--- |
| **SCR-01** | Landing Home | `/` | Hero section, interactive `.dcaps` simulator preview, feature matrix, customer logos, CTA buttons. |
| **SCR-02** | Login | `/auth/login` | Email/password input card, "Sign in with Okta/Azure AD" SSO button, MFA redirect link, branding background. |
| **SCR-03** | Main Dashboard | `/app/dashboard` | Top metric stats (Total Capsules, Total Views, Avg Health Score), Recent Capsules grid, Activity timeline feed. |
| **SCR-04** | Import Wizard | `/app/import/upload` | Drag-and-drop zone for `.pbix` / `.pbit`, file size limit indicators, auto-optimization toggle checkbox. |
| **SCR-05** | Import Progress | `/app/import/[id]/progress` | Multi-stage step tracker (Unzipping $\rightarrow$ VertiPaq AST Parsing $\rightarrow$ Schema Extraction) with live progress bar. |
| **SCR-06** | AI Validation | `/app/import/[id]/validation` | Split screen: Left side shows extracted AST issues (unused columns, broken measures); Right side shows AI fix code diff. |
| **SCR-07** | AI Optimization | `/app/import/[id]/optimization` | DAX rewrite proposals, visual aggregation recommendations, 1-click "Approve & Refactor" bulk action bar. |
| **SCR-08** | Capsule Builder | `/app/import/[id]/build` | Binary compiler screen displaying compressed size savings (-65%), ECDSA key signing, and `.dcaps` export output. |
| **SCR-09** | Secure Viewer | `/view/[token]` | Frameless high-perf canvas runtime, top navigation toolbar, filter bar, AI Copilot right-drawer, zero Power BI branding. |
| **SCR-10** | AI Copilot Overlay| Embedded in `/view` | Collapsible side drawer with NLQ chat box, voice waveform recorder, visual filter triggers, and DAX metric explainers. |
| **SCR-11** | Health Score | `/app/ai/health` | Circular 0-100 score gauge, 4 sub-dimensional bars (Performance, Security, Design, Accessibility), recommendation action list. |
| **SCR-12** | AI Documentation | `/app/ai/docs` | Auto-generated Markdown documentation tree: Executive Summary, Data Dictionary, DAX Lineage Graph. |
| **SCR-13** | Sharing Manager | `/app/sharing` | Table of active links, expiration counters, passcode toggles, dynamic watermark text input, download permission switches. |
| **SCR-14** | User Management | `/admin/users` | Datatable of organization users, RBAC role dropdowns, SCIM sync status indicators, "Invite Member" modal. |
| **SCR-15** | Audit Logs | `/admin/audit-logs` | ClickHouse query table with filterable columns (Timestamp, Actor, Action, Resource, IP Address, Geolocation, Status). |
| **SCR-16** | Admin Billing | `/admin/billing` | Current plan tier badge, active seat/capsule counters, Stripe card element, invoice download table. |

### 2.2 System States & Edge Screens

- **SCR-EMPTY-01 (Empty Workspace)**: Clean illustration, "No Capsules Ingested Yet", prominent `Import Your First PBIX` primary button, quick video walkthrough link.
- **SCR-LOADING-01 (WASM Engine Initialization)**: Sleek skeleton canvas loader, pulsing key exchange cryptographic animation, percentage progress indicator (`Decrypting .dcaps Payload...`).
- **SCR-ERROR-01 (Passcode / Signature Failure)**: Red alert banner, "Digital Signature Verification Failed - File May Be Tampered With", contact administrator button.

---

## 3. Reusable UI Component Library Inventory

```
packages/ui-kit/src/components/
├── primitives/                    # Low-level Atomic UI Components
│   ├── Button/                    # Variants: Primary, Secondary, Ghost, Destructive, WASM Accent
│   ├── Input/                     # Text, Password, Search, File Dropzone
│   ├── Dropdown/                  # Select, Multi-select, Context Menu
│   ├── Modal/                     # Dialog, Alert Modal, Fullscreen Drawer
│   ├── Card/                      # Standard Card, Metric Stat Card, Capsule Preview Card
│   ├── Badge/                     # Health Score Badge, Status Badge (Draft, Published, Encrypted)
│   ├── Tooltip/                   # Rich Tooltip with Markdown Support
│   ├── Tabs/                      # Segmented Control Tabs, Underline Navigation Tabs
│   ├── Avatar/                    # User Avatar, Multi-user Stacked Group
│   └── Skeleton/                  # Pulse Card Skeleton, Chart Skeleton Loader
│
├── data-display/                  # Complex Data Representation Components
│   ├── DataTable/                 # Virtualized Datatable with Column Reordering, Sort & Filter
│   ├── CodeDiffViewer/            # Side-by-Side DAX Code Diff Engine (Monaco-based)
│   ├── MetricCard/                # Stat value, sparkline, trend percentage change
│   ├── HeatmapCanvas/             # Interactive click/hover user attention heatmap
│   └── GaugeChart/                # Radial health score gauge (0-100) with animated needle
│
├── dashboard-viewer/              # High-Performance WASM Canvas Components
│   ├── CanvasContainer/           # Responsive WebGL / Canvas viewport container
│   ├── FilterToolbar/             # Floating Slicer bar (Date Range, Dropdown, Checkbox)
│   ├── VisualWidgetWrapper/       # Widget container with fullscreen, export image, drill-down buttons
│   ├── WatermarkOverlay/          # Dynamic diagonal text watermark overlay layer
│   └── ExportModal/               # PDF / High-res PNG export configuration dialog
│
└── ai-copilot/                    # Conversational AI & Intelligence Components
    ├── AIChatWindow/              # Streaming conversation thread, code blocks, suggested follow-ups
    ├── VoiceInputButton/          # Microphone wave pulse animation, speech-to-text listener
    ├── HealthScoreSummaryCard/    # Multidimensional breakdown (Performance, Security, Design)
    └── DocumentationTree/         # Interactive Markdown TOC & Data Lineage DAG graph viewer
```
