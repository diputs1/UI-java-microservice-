---
name: Engineering Excellence
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002113'
  on-tertiary-container: '#009668'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 20px
  container-max: 1440px
---

## Brand & Style
The design system is engineered for high-performance technical environments, specifically tailored for Java microservices orchestration. The brand personality is precise, authoritative, and reliable—evoking the feeling of a well-tuned machine or a mission-control dashboard.

The aesthetic follows a **Modern Corporate/Technical** style with a focus on data density and visual clarity. It utilizes a structured grid, high-contrast states, and subtle technical accents like monospaced typography to denote system-level information. The goal is to provide engineers with a high-bandwidth information display that minimizes cognitive load through clear hierarchy and logical groupings.

## Colors
This design system utilizes a sophisticated technical palette. The **Primary (Deep Tech Blue)** is used for structural navigation and core branding to establish authority. **Corporate Blue** serves as the active phase color, indicating movement and current focus. **System Green** is reserved strictly for health indicators, completion states, and "Ready" statuses.

Neutral tones leverage the Slate scale to provide soft transitions between surfaces without losing the crispness required for technical documentation. Backgrounds should remain neutral to allow the colored status indicators to pop.

## Typography
The typography system balances readability with technical utility. **Inter** is the workhorse for UI elements, headings, and body text, providing a neutral and modern feel. **JetBrains Mono** is introduced for system-level data, status labels, and architectural snippets to distinguish "code/system" information from "content/narrative."

Hierarchy is established through weight and color rather than just size. Use `label-caps` for metadata like version numbers or environment names (e.g., PROD, STAGING).

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for the main container (1440px) with a fluid internal 12-column system. This ensures that complex dashboards maintain a predictable structure on ultra-wide monitors used by engineers.

Spacing is tight and systematic, based on a 4px baseline grid to allow for high data density. Margin and padding should be used generously between major architectural sections (24px - 32px), but kept compact within technical cards (12px - 16px) to maximize the "at-a-glance" information display.

## Elevation & Depth
This design system uses **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows to maintain a clean, "flat-modern" technical look. 

- **Level 0 (Background):** Slate-50 (#F8FAFC) for the canvas.
- **Level 1 (Cards/Containers):** Pure white surface with a 1px border (#E2E8F0).
- **Level 2 (Modals/Overlays):** White surface with a subtle 4px blur shadow, 5% opacity, used only for temporary interactions.

Depth is communicated through "recessed" areas (using a darker neutral background) for code blocks or timeline tracks, giving them a structural, grounded feel.

## Shapes
The shape language is **Soft** (4px / 0.25rem). This slight rounding softens the technical edge of the data-heavy UI without making it feel overly consumer-focused or "playful." 

- **Primary Buttons & Cards:** 4px radius.
- **Tags & Status Pills:** 2px radius (near-sharp) for a more industrial feel.
- **Icon Containers:** Circular for standard icons, 4px rounded-square for technology logos (Spring, Docker).

## Components

### Technical Spec Cards
Cards feature a header with a `label-caps` category and a technology icon (Docker, Spring). Content uses `code-md` for technical parameters. The footer of the card should include a "Health" bar utilizing the System Green.

### Kanban Phase Progress
Columns represent phases (Build, Test, Deploy). Each column head includes a count pill and a progress percentage. Active phases are highlighted with a 2px left-border using Corporate Blue.

### Readiness Checklist
Uses a custom checkbox style. Checked items transition from Slate-400 to System Green. Each item has a sub-label in `label-sm` showing the timestamp or user who verified the requirement.

### Deployment Timeline
A horizontal track component. Milestones are represented by vertical lines. The "Current Position" is marked by a pulsing Corporate Blue dot. Completed segments are solid System Green; future segments are dashed Slate-300.

### Architecture Snippets
Small, read-only code windows using `code-md` typography on a Slate-900 background with syntax highlighting tailored for Java/YAML.

### Buttons
- **Primary:** Deep Tech Blue background, white text, 4px radius.
- **Ghost:** No background, 1px border, used for secondary actions like "View Logs."