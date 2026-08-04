# Deliverable 6: Design System & Design Tokens Specification

## 1. Design System Tokens & Foundations

### 1.1 Color Palette & Theme Tokens

The platform implements a curated, high-contrast, premium dark/light mode token architecture using HSL CSS Variables.

#### Dark Mode Palette (Default Core Application)

```css
:root[data-theme="dark"] {
  /* Surface & Background Colors */
  --bg-app: hsl(224, 25%, 6%);             /* Ultra-deep obsidian canvas */
  --bg-surface-primary: hsl(222, 20%, 10%); /* Main card & module background */
  --bg-surface-secondary: hsl(220, 18%, 14%);/* Elevated drawers & modals */
  --bg-surface-tertiary: hsl(218, 16%, 18%); /* Hover states & active items */
  --border-subtle: hsl(218, 14%, 22%);      /* Clean thin borders */
  --border-strong: hsl(216, 18%, 32%);      /* Focused inputs & active borders */

  /* Text & Foreground Tokens */
  --text-primary: hsl(210, 20%, 98%);       /* High contrast white titles */
  --text-secondary: hsl(215, 15%, 75%);     /* Subtitles & body text */
  --text-muted: hsl(215, 12%, 50%);         /* Captions & disabled labels */

  /* Brand & Accent Colors */
  --accent-primary: hsl(250, 85%, 65%);     /* Deep Electric Violet (Primary Brand) */
  --accent-primary-hover: hsl(250, 90%, 72%);
  --accent-cyan: hsl(190, 95%, 50%);        /* WASM Engine & Data Highlighting */
  --accent-emerald: hsl(150, 80%, 45%);     /* Health Score Good & Valid Status */
  --accent-amber: hsl(38, 92%, 50%);        /* Warnings & AI Refactor Suggestions */
  --accent-rose: hsl(350, 85%, 60%);        /* Errors & Security Violations */

  /* Glassmorphism & Elevation Masks */
  --glass-bg: rgba(15, 20, 32, 0.75);
  --glass-border: rgba(255, 255, 255, 0.08);
  --glass-blur: blur(16px);
  --shadow-elevation-low: 0 2px 8px rgba(0, 0, 0, 0.4);
  --shadow-elevation-high: 0 12px 32px rgba(0, 0, 0, 0.7);
}
```

#### Light Mode Palette (Executive & Public Web View)

```css
:root[data-theme="light"] {
  --bg-app: hsl(210, 20%, 98%);
  --bg-surface-primary: hsl(0, 0%, 100%);
  --bg-surface-secondary: hsl(210, 15%, 95%);
  --bg-surface-tertiary: hsl(214, 12%, 90%);
  --border-subtle: hsl(214, 15%, 85%);
  --border-strong: hsl(214, 20%, 70%);

  --text-primary: hsl(222, 25%, 10%);
  --text-secondary: hsl(218, 15%, 35%);
  --text-muted: hsl(218, 10%, 55%);

  --accent-primary: hsl(250, 85%, 58%);
  --accent-primary-hover: hsl(250, 90%, 50%);
  --accent-cyan: hsl(190, 95%, 42%);
  --accent-emerald: hsl(150, 80%, 38%);
  --accent-amber: hsl(38, 92%, 45%);
  --accent-rose: hsl(350, 85%, 52%);

  --glass-bg: rgba(255, 255, 255, 0.85);
  --glass-border: rgba(0, 0, 0, 0.06);
  --glass-blur: blur(12px);
  --shadow-elevation-low: 0 2px 6px rgba(0, 0, 0, 0.06);
  --shadow-elevation-high: 0 10px 28px rgba(0, 0, 0, 0.12);
}
```

---

### 1.2 Typography & Scale Systems

* **Primary Font Family**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`, sans-serif.
* **Monospace Font Family (DAX / SQL / Code)**: `JetBrains Mono`, `Fira Code`, monospace.

| Token Name | Font Size | Line Height | Font Weight | Usage Context |
| :--- | :--- | :--- | :--- | :--- |
| `--font-display` | 44px (2.75rem) | 1.15 | 800 (ExtraBold) | Hero headlines, landing callouts |
| `--font-h1` | 32px (2.00rem) | 1.20 | 700 (Bold) | Main page titles, dashboard names |
| `--font-h2` | 24px (1.50rem) | 1.25 | 600 (SemiBold) | Section headers, modal titles |
| `--font-h3` | 18px (1.125rem)| 1.35 | 600 (SemiBold) | Card titles, widget headers |
| `--font-body-lg` | 16px (1.00rem) | 1.50 | 400 (Regular) | Primary body text, lead paragraphs |
| `--font-body` | 14px (0.875rem)| 1.50 | 400 / 500 | Standard table cells, inputs, buttons |
| `--font-caption` | 12px (0.75rem) | 1.40 | 500 (Medium) | Tooltips, badges, timestamp captions |
| `--font-mono` | 13px (0.8125rem)|1.45 | 400 (Regular) | DAX formulas, SQL queries, raw AST |

---

### 1.3 Spacing, Radius & Grid Layout System

```css
/* 8pt Metric Grid System */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;

/* Border Radius Tokens */
--radius-sm: 4px;   /* Badge, tooltip, small pill */
--radius-md: 8px;   /* Buttons, inputs, dropdown items */
--radius-lg: 12px;  /* Standard cards, dialog modals */
--radius-xl: 20px;  /* Floating action bars, drawers */
--radius-full: 9999px; /* Avatars, round pill toggles */
```

---

### 1.4 Responsive Breakpoints & Grid Boundaries

| Breakpoint Code | Screen Width | Target Device Class | Sidebar Behavior |
| :--- | :--- | :--- | :--- |
| `xs` | `< 640px` | Mobile Portrait | Sidebar hidden (Bottom navigation bar) |
| `sm` | `640px - 767px` | Mobile Landscape | Sidebar hidden (Hamburger drawer) |
| `md` | `768px - 1023px` | Tablet Portrait | Collapsed icon-only sidebar (64px) |
| `lg` | `1024px - 1279px` | Laptop / Tablet Landscape | Expanded sidebar (240px) |
| `xl` | `1280px - 1535px` | Desktop Workstation | Full expanded sidebar + AI Copilot Drawer |
| `2xl` | `≥ 1536px` | Ultra-wide Monitors | Max content width capped at 1920px |

---

## 2. Micro-Animations & Motion Design Rules

1. **Duration Standards**:
   - Fast Micro-interactions (Hover, Click feedback): `100ms - 150ms`.
   - Structural Transitions (Modal open, Drawer slide, Tab switch): `200ms - 300ms`.
   - Complex Data Hydration (Health Gauge fill, Chart transition): `500ms - 800ms`.
2. **Easing Functions**:
   - Standard Motion: `cubic-bezier(0.4, 0.0, 0.2, 1)` (Material Standard Ease).
   - Enter Transition: `cubic-bezier(0.0, 0.0, 0.2, 1)` (Ease Out).
   - Exit Transition: `cubic-bezier(0.4, 0.0, 1, 1)` (Ease In).

---

## 3. Accessibility & WCAG 2.1 AA Compliance Standards

- **Contrast Ratios**: Minimum `4.5:1` contrast ratio for all standard body text against background surfaces; `3.0:1` for large text ($\ge 24\text{px}$).
- **Keyboard Navigation**: 100% full keyboard focusability across all interactive components using visible focus rings (`--accent-primary` 2px outline with offset).
- **Screen Reader Support**: All visual charts render semantic ARIA labels, `aria-expanded` states on accordions/drawers, and `role="status"` live region alerts for AI Copilot streaming.
- **Colorblind Safe Palette**: Visual charts do not rely solely on red/green encoding; patterns, shape markers, and distinct high-contrast hues are used.
