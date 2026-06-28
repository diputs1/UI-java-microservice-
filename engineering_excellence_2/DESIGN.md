---
name: Engineering Excellence
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fd'
  on-secondary-container: '#57657b'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001e2f'
  on-tertiary-container: '#008cc7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  marketing-h1:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  marketing-h2:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  admin-h1:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
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
  xl: 48px
  container-max: 1280px
  sidebar-width: 260px
---

## Brand & Style
The design system is engineered for technical precision and high-trust transactions. It balances a high-conversion consumer experience with a data-dense administrative engine. The brand personality is authoritative yet efficient, utilizing a **Corporate Modern** style that leans into systematic utility. 

For the **Customer App**, the interface prioritizes clarity and momentum, using whitespace to drive conversion. For the **Admin Operations Console**, the aesthetic shifts toward information density and functional density, ensuring operators can manage complex microservice sagas at a glance. The emotional response is one of "stability under load"—professional, reliable, and technically superior.

## Colors
The palette is rooted in a professional **Slate/Navy foundation** to communicate engineering rigor. 

- **Primary (#0F172A):** Used for core branding, headers, and primary navigation in the Admin console.
- **Secondary (#334155):** Used for supporting text and iconography.
- **Action/Tertiary (#0EA5E9):** A high-visibility blue for links and primary calls to action.
- **Functional Tokens:**
  - **Success Green:** High-saturation for checkout completions and healthy microservice heartbeats.
  - **Warning Amber:** Used for pending states, outbox lag, and inventory thresholds.
  - **Error Red:** High-contrast for failed sagas, inventory conflicts, and system alerts.

## Typography
This design system utilizes **Inter** for its neutral, systematic character. It differentiates between marketing-heavy customer views and utility-heavy admin views through two distinct scales.

- **Customer Scale:** Leverages `marketing-h1` and `marketing-h2` with tighter letter spacing to create visual impact and authority.
- **Admin Scale:** Uses a compressed hierarchy. `admin-h1` is sized conservatively to preserve vertical space.
- **Technical Readability:** `data-mono` (JetBrains Mono) is introduced for ID strings, SKU codes, and payload logs within the Admin Console to ensure unambiguous character recognition.

## Layout & Spacing
The system employs an **8px grid** with a 4px baseline for micro-adjustments. 

- **Customer App:** Uses a **Fluid Grid** with a max-width container of 1280px. Margins are generous (24px - 48px) to provide a premium, uncluttered shopping experience. Navigation is a **Top-nav/Mega-menu** structure.
- **Admin Console:** Uses a **Fixed Sidebar + Fluid Content** model. The sidebar remains static at 260px. Content utilizes high-density spacing (8px - 16px) to maximize the amount of visible data in tables and dashboards.
- **Breakpoints:**
  - **Mobile (<768px):** Single column, 16px gutters.
  - **Tablet (768px - 1024px):** 8-column grid.
  - **Desktop (>1024px):** 12-column grid.

## Elevation & Depth
Hierarchy is established through **Tonal Layers** and crisp, low-opacity shadows. 

- **Level 0 (Background):** Neutral Gray (#F8FAFC) for the Admin console to reduce eye strain.
- **Level 1 (Cards/Surface):** White (#FFFFFF) with a 1px border (#E2E8F0).
- **Level 2 (Dropdowns/Modals):** Soft ambient shadows (Y: 4, Blur: 12, Opacity: 0.05) to suggest interaction without heavy visual weight.
- **Administrative Depth:** In the Admin console, use "In-set" shadows for data inputs to signify editable fields versus read-only system data.

## Shapes
The shape language is **Soft (0.25rem/4px)**. This choice reinforces the "Engineering" aspect of the brand—clean, geometric, and precise. 

- **Standard Buttons:** 4px radius.
- **Product Cards:** 8px (`rounded-lg`) to feel more approachable for consumers.
- **Status Badges:** Fully pill-shaped (999px) for immediate visual distinction from square-format data cells.

## Components

### Shared Components
- **Buttons:** Primary (Slate), Secondary (Outline), and Ghost. Active/Hover states use a 10% brightness shift.
- **Status Badges:** Compact pills with light background tints and dark text for Success, Warning, and Error.
- **System Health Indicators:** 8px Status Dots with a pulse animation for "Critical" errors. Small sparklines for 24h microservice latency.

### Customer-Only Components
- **Product Cards:** Vertical layout, high-contrast pricing, and "Add to Cart" as a secondary-on-hover interaction.
- **Checkout Stepper:** Horizontal progress bar with numbered circles. Completed steps use Success Green; active steps use Tertiary Blue.

### Admin-Only Components
- **Data Tables:** High-density (32px row height), sortable headers, and hover-state row highlighting.
- **Side-Nav:** Vertical icons with text labels, using a "Collapsed" state for small viewports.
- **Code Blocks:** Monospaced containers for viewing JSON payloads from the API Gateway (Port 5000).

### UX States
- **Loading:** Shimmer (Skeleton) patterns that match the layout of the final component.
- **Empty:** Centered illustration with a clear "Call to Action" button.
- **Error/Permission Denied:** Full-page "Interrupted Saga" screen with a technical error code and "Back to Dashboard" link.

### API Mapping Strategy
All components are wired to the **API Gateway (Port 5000)**. 
- Customer components map to `/v1/products` and `/v1/orders`.
- Admin components map to `/v1/admin/inventory` and `/v1/admin/health`.
- Data tables use standardized pagination headers (`X-Total-Count`).