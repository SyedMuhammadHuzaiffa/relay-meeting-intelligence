---
name: Relay
colors:
  surface: '#fbf8fc'
  surface-dim: '#dcd9dd'
  surface-bright: '#fbf8fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2f7'
  surface-container: '#f0edf1'
  surface-container-high: '#eae7eb'
  surface-container-highest: '#e4e1e6'
  on-surface: '#1b1b1e'
  on-surface-variant: '#434655'
  inverse-surface: '#303033'
  inverse-on-surface: '#f3f0f4'
  outline: '#747687'
  outline-variant: '#c4c5d8'
  surface-tint: '#1c4ee3'
  primary: '#003bc4'
  on-primary: '#ffffff'
  primary-container: '#2554e8'
  on-primary-container: '#dadfff'
  inverse-primary: '#b8c4ff'
  secondary: '#006c4a'
  on-secondary: '#ffffff'
  secondary-container: '#82f5c1'
  on-secondary-container: '#00714e'
  tertiary: '#753d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#985100'
  on-tertiary-container: '#ffd9bf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#0037b9'
  secondary-fixed: '#85f8c4'
  secondary-fixed-dim: '#68dba9'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#fbf8fc'
  on-background: '#1b1b1e'
  surface-variant: '#e4e1e6'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: -0.01em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 12px
    letterSpacing: 0.04em
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
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system embodies high-craft technical minimalism tailored for operators, executives, and knowledge workers processing high volumes of conversational data. It rejects playful SaaS clichés, noisy gradients, and novelty blurs in favor of architectural precision, calm structural density, and typographic discipline.

The visual tone is analytical yet tactile—evoking the focus of a high-end IDE crossed with the restraint of an editorial broadsheet. Interfaces prioritize information density, rapid scanning, and semantic clarity, treating transcripts, action items, and executive summaries with clinical legibility and authoritative quietness.

## Colors

The palette balances warm organic substrate tones with technical digital ink. 

### Canvas & Surfaces
- **Canvas Base:** `#F8F8F6` (warm off-white foundation for application backdrops).
- **Surface Level 1:** `#FFFFFF` (crisp white for primary cards, sidebars, and transcription sheets).
- **Surface Level 2 (Recessed/Muted):** `#F0F0EC` (subtle warmth for codeblocks, timestamp rails, and toolbars).
- **Surface Level 3 (Hover/Active):** `#E7E7E2` (interactive hover states for secondary surfaces).
- **Hairline Dividing Lines:** `#E4E4DF` (structural 1px separations).

### Typography & Foreground
- **Ink Primary:** `#18181B` (high-contrast deep zinc for primary readings, headlines, and critical metrics).
- **Ink Secondary:** `#71717A` (medium zinc for transcript body, meta descriptions, and non-active icons).
- **Ink Muted:** `#A1A1AA` (subtle zinc for keyboard shortcuts, disabled items, and ghost rules).

### Product Accent & Semantics
- **Cobalt Accent:** `#2554E8` with active highlight `#1D44BF` and surface wash `#EEF4FF`. Reserved strictly for primary intents, active filters, search matches, and current playback states.
- **Success / Decision:** `#059669` with surface tint `#ECFDF5`. Applied to confirmed decisions, consensus markers, and completed agenda items.
- **Warning / Action Pending:** `#D97706` with surface tint `#FFFBEB`. Used for unresolved follow-ups, blocking dependencies, and priority flags.

## Typography

Typographic hierarchy enforces dense, structured scannability:

- **Geist (Proportional UI):** Powers structural narrative, executive summaries, dialogue feeds, and control labels. Tight letter-spacing keeps titles compact and technical.
- **JetBrains Mono (Monospaced Technical):** Deployed for all metadata dimensions—speaker timestamps (e.g., `04:12.8`), keyboard accelerator indicators (`⌘K`), statistical aggregates, sentiment indicators, and status tags.
- Tabular figures must remain enabled across numerical tables and timeline readouts to prevent visual jitter during playback.

## Layout & Spacing

The workspace uses a rigid multi-pane operational layout anchored to an 8px grid (with 4px micro-steps).

- **Grid Architecture:** Multi-column split views (Navigation Rail: 240px fixed, Primary Stream/Canvas: fluid flex-1 with a max-width of 880px for optimal reading, Utility Inspector: 360px fixed).
- **Responsive Adaptations:**
  - **Desktop (>= 1280px):** 3-pane open layout with simultaneous transcript, live summary, and contextual artifact drawer.
  - **Tablet (768px - 1279px):** Inspector collapses to an off-canvas drawer; navigation collapses into an icon-only 56px rail.
  - **Mobile (< 768px):** Single-column stacked flow with bottom tab bar switching between transcript, synthesis, and action lists.
- **Density Standard:** Vertical padding within lists and table cells remains compact (`space-sm` to `space-md`) to ensure power users can view multi-turn conversational context without excessive scrolling.

## Elevation & Depth

Visual separation relies predominantly on surface tonality and hairline boundaries rather than high-elevation shadows.

- **Hairline Outlines:** All containers, cards, and floating palettes use a 1px solid border (`#E4E4DF`).
- **Low-Frequency Ambient Shadows:**
  - **Base Layer (Cards, Inline Blocks):** `0 1px 2px rgba(24, 24, 27, 0.04)`.
  - **Overlay Layer (Dropdowns, Command Palette, Flyouts):** `0 4px 12px -2px rgba(24, 24, 27, 0.06), 0 1px 3px rgba(24, 24, 27, 0.04)`.
  - **Modal / Global Focus:** `0 16px 32px -8px rgba(24, 24, 27, 0.08), 0 0 0 1px #E4E4DF`.
- **Tonal Layering:** Floating panels sit on crisp white (`#FFFFFF`) against the tinted warm-gray canvas (`#F8F8F6`). Recessed modules (like quoted transcripts or audio waveforms) sink inward via `#F0F0EC` backgrounds with no drop shadow.

## Shapes

The geometric signature is disciplined, architectural, and compact:

- Standard controls, badges, and inline surfaces leverage `6px` radius (`0.375rem`).
- Large panel containers, modals, and main viewport splitters utilize `8px` radius (`0.5rem`).
- Monospace metadata badges, keyboard chips, and avatars employ a tighter `4px` radius (`0.25rem`).
- Full pill rounding is restricted exclusively to audio playback position handles and status presence pips; cards and inputs never feature stadium/pill geometry.

## Components

### Buttons
- **Primary:** Solid `#2554E8` background, white text, 1px border (`#1D44BF`), `6px` radius. Subtle inner top highlight via `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15)`.
- **Secondary / Subtle:** `#FFFFFF` background, `#18181B` text, 1px solid `#E4E4DF`. Hover transitions to `#F0F0EC`.
- **Ghost:** Transparent background, `#71717A` text; shifts to `#18181B` text with `#F0F0EC` fill on hover.

### Inputs & Search Bars
- Background: `#FFFFFF` resting, border: 1px solid `#E4E4DF`.
- Height: 32px for compact controls, 36px for global search.
- Focus: Border shifts to `#2554E8` accompanied by a crisp `0 0 0 2px rgba(37, 84, 232, 0.15)` ring. Monospaced keyboard shortcut indicators (e.g., `⌘K`) are embedded flush right.

### Chips & Badges
- Constructed with `label-md` or `label-sm` (JetBrains Mono).
- **Decision:** `#ECFDF5` background, `#059669` text, `#A7F3D0` border.
- **Action Required:** `#FFFBEB` background, `#D97706` text, `#FDE68A` border.
- **Neutral Timestamp / Speaker ID:** `#F0F0EC` background, `#71717A` text, `#E4E4DF` border.

### Transcript & Agenda Cards
- Crisp white substrate with hairline `#E4E4DF` borders.
- Hover states do not lift vertically; instead, they shift border color to `#D4D4CE` and reveal hidden micro-actions (copy quote, link to timestamp, add to action items) in an absolute top-right cluster.

### Selection & Checkboxes
- 16x16px squares with `4px` radius.
- Inactive: `#FFFFFF` fill with 1px `#D4D4CE` outline.
- Selected: Solid `#2554E8` fill with a sharp white checkmark glyph.