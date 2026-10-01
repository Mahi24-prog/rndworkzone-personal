---
name: Lumina Intelligence
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
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#2a1700'
  on-tertiary-container: '#b87500'
  error: '#EF4444'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  accent-blue: '#3B82F6'
  pale-blue: '#EFF6FF'
  slate-muted: '#64748B'
  border-light: '#CBD5E1'
  success: '#10B981'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.5'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.7'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  hint:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1100px
  content-max: 820px
  gutter: 24px
  section-gap-lg: 80px
  section-gap-md: 48px
  component-gap: 16px
  stack-sm: 8px
---

## Brand & Style

The design system embodies **Luxury SaaS Minimalism** with an **AI-first** narrative. It targets high-level executives, consultants, and investors who require clarity over noise. The aesthetic is inspired by the precision of Linear and the expansive, technical elegance of OpenAI.

The brand personality is **Authoritative, Precise, and Visionary**. The UI should evoke a sense of "calm intelligence"—where complex data is distilled into effortless insights. 

### Design Style: Modern Enterprise Luxury
- **Minimalism:** Use of expansive whitespace to denote premium quality and focus.
- **Glassmorphism:** Subtle translucent layers for navigation and floating panels to imply depth and technical sophistication.
- **AI-Human Hybrid:** High-tech geometric accents (Space Grotesk) paired with grounded, readable typography (Inter) to represent the HILAR (Human-in-the-Loop AI Research) methodology.
- **Tactile Depth:** Elements use soft, navy-tinted shadows rather than harsh blacks, creating a "lifted" feel that is sophisticated and modern.

## Colors

The palette is anchored by **Deep Navy (#0F172A)**, providing an enterprise-grade foundation of trust and authority. **Vibrant Blue (#2563EB)** serves as the primary interactive engine, used for calls to action and critical focus states.

### Palette Strategy
- **Primary (Navy):** Used for text, deep-background surfaces, and primary branding elements.
- **Secondary (Blue):** The "Intelligence" color. Used for progress indicators, primary buttons, and links.
- **Tertiary (Gold):** Used sparingly as an "Expertise" accent—eyebrows, highlights in text, or premium badges.
- **Neutral (Soft Slate):** A sophisticated off-white background that reduces eye strain compared to pure white, maintaining a "luxury paper" feel.

**Gradients:** Use subtle linear gradients from `primary` to a slightly lighter navy for headers, and from `secondary` to `accent-blue` for primary buttons to create a sense of luminosity.

## Typography

The typographic system relies on the contrast between the technical, geometric **Space Grotesk** and the highly legible, professional **Inter**.

- **Headlines:** Space Grotesk should be used for all display and headline levels. Tighten letter spacing on larger sizes to maintain a "pre-print" editorial look.
- **Body:** Inter is used for all long-form content and UI labels. A slightly increased line-height (1.6-1.7) is essential for readability in research-heavy contexts.
- **Specialty:** Use `label-caps` for eyebrows and section dividers to provide clear structural hierarchy without adding visual weight.

## Layout & Spacing

This design system utilizes a **centered fixed-grid philosophy** for content-heavy pages to ensure high readability, while leveraging a **fluid 12-column grid** for dashboard views.

### Spacing Principles
- **Focus Areas:** Main research forms and articles are constrained to an `820px` readable measure.
- **Rhythm:** An 8px base unit drives all spacing. 
- **Desktop:** 12-column grid with 24px gutters. Margins are dynamic but never drop below 40px.
- **Mobile:** 4-column grid with 16px gutters and 20px side margins.
- **White Space:** Sections should be separated by generous vertical gaps (`section-gap-lg`) to allow the brand to "breathe" and feel premium.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layering** and **Tinted Shadows**. We avoid pure black shadows to prevent the UI from looking "dirty."

- **Base Layer:** `Soft Slate (#F8FAFC)` background.
- **Card Layer:** Pure `White (#FFFFFF)` surfaces with a very soft Navy-tinted shadow (`rgba(15, 23, 42, 0.08)`).
- **Floating Layer:** Navbars and Modals use **Glassmorphism**. A background blur of `12px` with a semi-transparent white fill (`rgba(255, 255, 255, 0.8)`) and a subtle `1px` border in `pale-blue`.
- **Interactive Depth:** On hover, buttons and cards should "lift" using a translateY(-2px) transform and a slightly more diffused shadow to simulate physical proximity to the user.

## Shapes

The shape language is **generously rounded**, moving away from "sharp" enterprise software toward a more "approachable intelligence."

- **Containers/Cards:** Use a `20px` radius for large parent containers to feel modern and premium.
- **UI Elements:** Buttons, inputs, and chips use a `12px` radius.
- **Pill Shapes:** Reserved for badges, tags, and status indicators (e.g., "Active," "New") to create a distinct visual secondary class of information.
- **Borders:** Use thin `1px` borders in `border-light` for most elements. For AI-focused sections, use a `1.5px` border to give them more structural "weight."

## Components

### Buttons
- **Primary:** Gradient fill (`vibrant blue` to `accent blue`), white text, `12px` radius. Subtle lift on hover.
- **Secondary:** Transparent background with a `primary navy` 1px border.
- **Tertiary/Ghost:** No border, navy text, used for less frequent actions.

### Input Fields
- **Default:** White background, `1.5px` border in `border-light`. 
- **Focus:** Border changes to `vibrant blue` with a soft blue outer glow (halo).
- **Labels:** Use `Inter` SemiBold at `14px` with high contrast against the field.

### Cards
- **Research Cards:** White background, `20px` radius, soft navy shadow. 
- **AI Summary Cards:** Subtle `pale-blue` background with a `1px` dashed border to distinguish AI-generated content from static content.

### Status Indicators
- **Success:** Pill-shaped, light green background with dark green text.
- **Warning/AI Note:** Warm gold background (`#FFF7ED`) with `92400E` text for specific "Human-Validation" notes.

### Lists & Steps
- **Vertical Steps:** Use the `primary navy` for step icons/numbers. Use a thin vertical line to connect steps, creating a clear process-oriented flow.