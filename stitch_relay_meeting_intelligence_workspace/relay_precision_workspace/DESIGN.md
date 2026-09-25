---
name: Relay Precision Workspace
colors:
  surface: '#faf9fb'
  surface-dim: '#dbd9dc'
  surface-bright: '#faf9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f6'
  surface-container: '#efedf0'
  surface-container-high: '#e9e7ea'
  surface-container-highest: '#e3e2e4'
  on-surface: '#1b1c1e'
  on-surface-variant: '#434656'
  inverse-surface: '#303032'
  inverse-on-surface: '#f2f0f3'
  outline: '#747688'
  outline-variant: '#c4c5d9'
  surface-tint: '#1049f1'
  primary: '#003fdd'
  on-primary: '#ffffff'
  primary-container: '#2b59ff'
  on-primary-container: '#ecedff'
  inverse-primary: '#b9c3ff'
  secondary: '#3755c3'
  on-secondary: '#ffffff'
  secondary-container: '#708cfd'
  on-secondary-container: '#00217a'
  tertiary: '#982e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c23d00'
  on-tertiary-container: '#ffe9e3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b9c3ff'
  on-primary-fixed: '#001356'
  on-primary-fixed-variant: '#0035be'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#b8c4ff'
  on-secondary-fixed: '#001453'
  on-secondary-fixed-variant: '#173bab'
  tertiary-fixed: '#ffdbd0'
  tertiary-fixed-dim: '#ffb59d'
  on-tertiary-fixed: '#390c00'
  on-tertiary-fixed-variant: '#832600'
  background: '#faf9fb'
  on-background: '#1b1c1e'
  surface-variant: '#e3e2e4'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: 2.5rem
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 1.625rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.625rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.375rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.6875rem
    fontWeight: '500'
    lineHeight: 0.875rem
    letterSpacing: 0.03em
  code-snippet:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system delivers an architectural, calm, and high-density intelligence environment engineered for teams navigating complex discussions. Instead of the chatty, consumer-leaning interfaces common in transcription and meeting assistants, the interface prioritizes structured clarity, rigorous typographic hierarchy, and deliberate information architecture reminiscent of precision technical workstations and Swiss editorial design.

The aesthetic fuses **Modern Precision Minimalist** structure with an **Instrumental Workspace** discipline:
- **Calm, High-Information Density:** Screen real estate is conserved through precise spatial economy, crisp hairline divisions, and low visual vibration.
- **Editorial Legibility:** Ultra-dark carbon ink text against warm architectural neutrals provides enduring optical comfort across long working sessions.
- **Technical Rigor:** Monospaced metadata tags, structured telemetry, and discrete status indicators transform freeform spoken conversation into durable knowledge artifacts.
- **Restraint Over Spectacle:** Completely free of saturated fluorescent gradients, heavy drop shadows, or frosted glassmorphism. Visual priority is dictated by spatial layout, contrast ratios, and structural rules.

## Colors

The palette establishes an architectural foundation using tactile warm-greys, carbon inks, and an intentional, singular cobalt blue accent.

### Base Canvases & Borders
- **Canvas Base:** `#F8F8F7` (App backdrop and ambient space)
- **Surface Layer 1:** `#FFFFFF` (Active analytical cards, transcripts, inputs)
- **Surface Layer 2:** `#F3F3F1` (Subordinate panels, toolbars, sidebar navigation)
- **Surface Layer 3:** `#EBEBE8` (Nested containers, metadata blocks, hovered table rows)
- **Hairline Border Primary:** `#E2E2DE` (Component boundaries, column separators)
- **Hairline Border Subtle:** `#EDEDEA` (Internal row dividers, non-essential separations)
- **Hairline Border Focus / Active:** `#D6D6D1` (Selected states, perimeter borders)

### Ink & Typography Contrast
- **Ink Primary:** `#141517` (Headlines, active metrics, primary body text)
- **Ink Secondary:** `#2C2E33` (Secondary labels, structural captions, action prompts)
- **Ink Muted:** `#636771` (Timestamps, keyboard hints, passive text)
- **Ink Tertiary:** `#8E929C` (Disabled states, column headers, meta counters)

### Interactive Accent: Precision Cobalt
- **Accent Primary:** `#2B59FF` (Focused active states, primary actions, critical selections)
- **Accent Deep:** `#1E40AF` (Hover on primary buttons, pressed states)
- **Accent Highlight:** `#EEF2FF` (Active item backdrop, selected row highlight)
- **Accent Border Tint:** `#CAD7FE` (Selected card outlines, active focus boundary)

### Restrained Semantic System
- **Affirmative / Decision / Completed:** Deep Sage `#15803D`, background tint `#ECFDF5`, border `#BBF7D0`
- **Attention / Open Action / Risk:** Warm Amber `#B45309`, background tint `#FFFBEB`, border `#FDE68A`
- **Critical / Drop / Revocation:** Crimson `#B91C1C`, background tint `#FEF2F2`, border `#FECACA`

## Typography

The typographic system utilizes **Inter** for conversational prose, headlines, and interface structure, paired systematically with **JetBrains Mono** for technical indicators, speaker timestamps, keybindings, and structural indices.

### Usage Principles
- **Headlines:** Set tight with deliberate negative letter-spacing to impart an authoritative, editorial finish.
- **Transcript Text (`body-md` / `body-lg`):** Calibrated for prolonged scanning with an optimal measure of 65–75 characters per line and comfortable vertical leading.
- **Metadata & Timestamps:** Never set in standard sans-serif. Always format speaker timestamps (`00:14:32`), category tags (`[DECISION]`), keyboard shortcuts (`⌘K`), and token counts using `label-md` or `label-sm` in JetBrains Mono.
- **Numbers & Metrics:** Tabular figures are enforced across all numeric outputs to maintain rigid visual alignment across dashboards and multi-speaker tables.

## Layout & Spacing

The workspace uses a dense, proportioned structural column system designed around multi-pane productivity. Content conforms strictly to a 4px modular baseline grid.

### Layout Model
- **Master-Detail Triple Pane (Desktop > 1280px):**
  - Left persistent navigational utility column: 240px fixed.
  - Central dynamic agenda and meeting workspace: Fluid minimum 560px, flexible flex-1.
  - Right intelligence inspector / actionable synthesis drawer: 380px fixed.
- **Dividers:** Columns are bounded by continuous 1px `#E2E2DE` hairline rules without empty gutters between card panes.
- **Responsive Adaptations:**
  - **Desktop (1024px+):** Fluid content zones with fixed sidebars. Margins at `2rem`, internal module gaps at `0.75rem`.
  - **Tablet (768px - 1023px):** Inspector drawer collides into an overlay sheet or secondary tab; navigation collapses to a 56px icon strip.
  - **Mobile (< 768px):** Single-column stacked mode. Navigation converts to an anchoring bottom bar. Margin reduces to `1rem` and gutter to `1rem`. Transcripts and summaries switch via high-level segmented tabs.

## Elevation & Depth

This design system avoids soft, floating drop shadows, diffuse Gaussian blurs, and pseudo-realistic skeuomorphism. Depth is communicated strictly via **Tonal Tiering**, **Micro-Offsets**, and **Hairline Outlines**.

### Elevation Tiers
1. **Tier 0 (Base Canvas):** Background foundation at `#F8F8F7`. Non-interactive, zero elevation.
2. **Tier 1 (Resting Panel / Card):** `#FFFFFF` surfaces nested within base canvas, separated exclusively by a 1px solid `#E2E2DE` border.
3. **Tier 2 (Interactive Floating / Menus / Dropdowns):** `#FFFFFF` with a crisp double-layer micro-offset:
   - Outer structure: `0 1px 3px rgba(20, 21, 23, 0.05), 0 4px 12px rgba(20, 21, 23, 0.04)`
   - Border definition: 1px solid `#D6D6D1`
4. **Tier 3 (Modal Dialogs / Command Palettes):** `#FFFFFF` framed by a subtle inset highlight (`inset 0 1px 0 rgba(255, 255, 255, 0.8)`), wrapped in 1px solid `#141517` at 15% opacity, with a supporting base shadow of `0 12px 32px -8px rgba(20, 21, 23, 0.12)`.
5. **Inset Well (Code, Quotes, Transcript Extracts):** `#F3F3F1` with an interior boundary outline `inset 0 0 0 1px #E2E2DE`.

## Shapes

The geometric architecture is engineered for precision and compact tool density. Corner radii are restrained and consistent:

- **Base Components (Buttons, Input Fields, Badges):** `6px` radius (`rounded-sm`).
- **Cards & Panes:** `8px` radius (`rounded-lg`).
- **Flyouts, Popovers, & Modals:** `8px` radius.
- **Pill Exceptions:** Rounded pills (`9999px`) are restricted strictly to speaker avatar badges and audio scrubber playhead scrubbers. Standard data chips, tags, and status items retain standard `4px` or `6px` radii.

## Components

### Buttons
- **Primary:** Background `#2B59FF`, text `#FFFFFF`, border `1px solid #1E40AF`. Hover shifts background to `#1E40AF`. Height: 32px (compact), 36px (default). Internal horizontal padding: 12px. Font: `body-sm` (Inter Semi-Bold).
- **Secondary / Ghost:** Background `#FFFFFF`, text `#141517`, border `1px solid #E2E2DE`. Hover shifts background to `#F3F3F1` and border to `#D6D6D1`.
- **Keyboard Affordance:** Explicit inline shortcut indicators (`⌘K`, `E`) using JetBrains Mono at 10px on right-aligned button edges.

### Inputs & Search Bars
- Background `#FFFFFF`, text `#141517`, placeholder `#8E929C`.
- Resting border: `1px solid #E2E2DE`.
- Focus state: `1px solid #2B59FF` paired with an inner box-shadow ring `0 0 0 1px #2B59FF`. No fuzzy or glowing focus rings.

### Badges, Chips & Meta Tags
- Always rectangular with a `4px` corner radius.
- Font: `label-sm` (JetBrains Mono).
- **Decision:** Sage text `#15803D`, background `#ECFDF5`, border `1px solid #BBF7D0`.
- **Action Item:** Amber text `#B45309`, background `#FFFBEB`, border `1px solid #FDE68A`.
- **Neutral / Topic:** Slate text `#636771`, background `#F3F3F1`, border `1px solid #E2E2DE`.

### Transcripts & Lists
- Transcripts organize by speaker segments with left-aligned monospaced timestamps (`00:04:12`) in `#8E929C`.
- Hovering a transcript turn displays a solid `#F8F8F7` row tint with an interactive action rail (extract task, highlight, share).
- Active playback turn highlights with a `2px` left border in `#2B59FF` and background tint `#EEF2FF`.

### Checkboxes & Action Toggle Items
- Size: 14px x 14px with `3px` radius.
- Resting state: White fill with a `1.5px` solid `#D6D6D1` border.
- Checked state: `#2B59FF` fill with a crisp white hairline checkmark vector.
- Strike-through text on checked action items adopts `#8E929C` with immediate real-time sync telemetry.

### Intelligent Summary Cards
- White `#FFFFFF` container with `1px solid #E2E2DE` framing.
- Header contains an editorial title paired with high-precision action buttons (Copy Markdown, Branch, Push to Linear/Jira).
- Nested sub-panels reside in `#F8F8F7` with `1px solid #EDEDEA`.