# Deliverable 07: Design System & Storybook Component Guide

## 1. Design System Tokens & Foundations

The UI component library (`@dcaps/ui`) is engineered following a clean, Stripe/Linear-inspired dark/light theme paradigm.

### Component Primitive Catalog (`packages/ui/src/components`)
- **`Button`**: Primary, Secondary, Ghost, Destructive, and Outline variants with keyboard focus ring.
- **`Card`**: Obsidian background card container with border highlights and elevation shadow.
- **`Badge`**: Success, Warning, Error, Info, and Neutral status pills.
- **`MetricCard`**: Key metric stat box with percentage trend indicators and icon support.
- **`FileUploadDropzone`**: Drag-and-drop container accepting `.pbix` / `.pbit` files with progress bar.
- **`CommandPalette`**: Global `Cmd+K` keyboard search and navigation modal.
- **`ThemeProvider`**: HSL theme switcher with dark, light, and system color mode support.

---

## 2. Storybook Configuration (`.storybook/main.js`)

```js
module.exports = {
  stories: ['../packages/ui/src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
};
```

---

## 3. WCAG 2.2 AA Accessibility & Responsiveness Checklist

- **Keyboard Focus**: All components implement visible `focus:ring-2` focus rings.
- **Screen Reader Support**: Modals and command palettes manage focus traps and render `aria-expanded` and `aria-label` attributes.
- **Responsive Viewports**: Supports Mobile (375px), Tablet (768px), Laptop (1024px), Desktop (1440px), and Ultra-wide (1920px+).
