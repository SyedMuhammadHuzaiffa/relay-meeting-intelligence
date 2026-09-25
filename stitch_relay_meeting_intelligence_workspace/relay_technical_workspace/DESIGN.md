---
name: Relay Technical Workspace
colors:
  surface: '#f9f9ff'
  surface-dim: '#d8dae2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3fb'
  surface-container: '#eceef6'
  surface-container-high: '#e6e8f0'
  surface-container-highest: '#e0e2ea'
  on-surface: '#181c21'
  on-surface-variant: '#46464b'
  inverse-surface: '#2d3037'
  inverse-on-surface: '#eff0f9'
  outline: '#76777b'
  outline-variant: '#c7c6cb'
  surface-tint: '#5e5e62'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1f'
  on-primary-container: '#848387'
  inverse-primary: '#c7c6ca'
  secondary: '#164be0'
  on-secondary: '#ffffff'
  secondary-container: '#3d67fa'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002111'
  on-tertiary-container: '#2f9563'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3e2e6'
  primary-fixed-dim: '#c7c6ca'
  on-primary-fixed: '#1b1b1f'
  on-primary-fixed-variant: '#46464a'
  secondary-fixed: '#dde1ff'
  secondary-fixed-dim: '#b7c4ff'
  on-secondary-fixed: '#001453'
  on-secondary-fixed-variant: '#0037b8'
  tertiary-fixed: '#94f7bc'
  tertiary-fixed-dim: '#78daa2'
  on-tertiary-fixed: '#002111'
  on-tertiary-fixed-variant: '#005231'
  background: '#f9f9ff'
  on-background: '#181c21'
  surface-variant: '#e0e2ea'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Geist
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Geist
    fontSize: 1.125rem
    fontWeight: '500'
    lineHeight: 1.5rem
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Geist
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.4375rem
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.3125rem
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Geist
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.1875rem
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
    letterSpacing: 0.04em
  code-inline:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.125rem
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system is engineered for engineering and product leadership workspaces where executive decisions, architectural trade-offs, and critical commitments converge. It operates on the ethos of an **Executive Engineering Cockpit**: high-density, authoritative, and strictly utilitarian. It replaces decorative enterprise chrome with structural hierarchy, dense typographical calibration, and hairline divisions.

### Visual Aesthetic & Philosophy
- **Instrument Precision:** Surfaces act as high-fidelity paper sheets and instrument displays. Avoid decorative drop shadows, pillowy radii, and gratuitous card nesting.
- **Cognitive Ergonomics:** Information is partitioned through spatial alignment, strict typographic contrast, and hairline dividers rather than elevated containers. Surfaces exist solely where logical isolation accelerates comprehension.
- **Architectural Semantics:** Decisions, commitments, and actions carry distinct geometric weights and symbolic anchors (e.g., authoritative rhombus nodes for architectural decisions versus actionable check targets for commitments).
- **Target Audience:** Staff+ Engineers, Engineering Directors, and VP of Products who require immediate scan speed, exact meeting telemetry, and clear traceability without visual friction.

## Colors

The palette establishes an analog, editorial baseline using a warm neutral canvas paired with carbon ink typography. Accent colors are treated with surgical restraint—reserved solely for confirmed states, interactive telemetry, and focused scrubbers.

### Palette Architecture
- **Canvas Base:** `#FBF9F6` (Primary workspace canvas) and `#F6F5F2` (Secondary workspace canvas / structural pane background).
- **Surface Elevation:** `#FFFFFF` (Floating panels, command menus, and popovers only).
- **Primary Ink (Carbon):** `#121316` (Headings, active values, primary reading track).
- **Secondary Slate:** `#666970` (Subtitles, metadata keys, timestamps, inactive icons).
- **Muted Slate:** `#8E9199` (Secondary labels, keyboard shortcuts, disabled context).
- **Hairline Border:** `#E5E4DE` (Default structural borders, grid seams, hairline row dividers).
- **Precision Cobalt (Accent):** `#2454E8` (Playback playheads, active tabs, confirmed action buttons, focused command triggers).
- **Decision Amber (Semantic):** `#9E5D0A` with background `#FDF6E9` (Explicit architectural consensus, unblocked trade-offs).
- **Commitment Emerald (Tertiary):** `#0D8050` with background `#EDF7F2` (Verified action items, closed initiatives).
- **Blocker Crimson:** `#C7302B` with background `#FDF1F0` (Stalled decisions, flagged dependencies).

## Typography

The typography pairs **Geist** for proportional UI and analytical narratives with **JetBrains Mono** for technical telemetry, speaker attribution stamps, timestamps, and metric readouts.

### Font Rules & Calibration
- **Tabular Figures:** Always apply `font-variant-numeric: tabular-nums` to numerical outputs, durations, transcript counter offsets, and metric gauges.
- **Negative Tracking:** Apply negative tracking (`-0.02em` to `-0.01em`) on all headings above 18px to ensure tight display rhythm standard in modern engineering platforms.
- **Mono Hierarchy:** `label-md` and `label-sm` are strictly uppercase or capitalized keys (e.g., `DECISION // ARCH`, `00:42:19`, `RFC-409`). Never use mono fonts for long-form prose or transcript body lines.

## Layout & Spacing

The workspace enforces a fixed-panel, high-density cockpit layout. The viewport defaults to full-bleed structural segments partitioned by hairline borders rather than floating card-based gutters.

### Layout Model
- **Structural Blueprint:** 3-pane workbench (Left: Meeting Ledger & Context [280px fixed]; Center: Primary Synthesis & Transcript Canvas [flex-grow, min 560px, max 840px content column]; Right: Intelligence Inspector & Action Rail [340px fixed]).
- **Border Partitioning:** Panes abut one another separated by `1px solid #E5E4DE`. Canvas gutters are zeroed between structural panes; internal padding governs content breathing room.
- **Responsive Adaptations:**
  - **Desktop (>= 1280px):** All three panes persistent.
  - **Tablet (768px - 1279px):** Left pane collapses to an icon sidebar or drawer; Inspector becomes a tabbed view over the primary canvas.
  - **Mobile (< 768px):** Single vertical stack with bottom navigation sheet; margin drops from `1.5rem` to `1rem`; primary transcript body shifts to full viewport width.

## Elevation & Depth

This system intentionally bypasses conventional shadow-based Material/Skeuomorphic layers. Depth is constructed strictly through **tonal stacking** and **hairline contours**.

### Depth Layers
1. **Bedrock Surface (`#F6F5F2`):** Outer scaffolding, splitters, sidebars, and structural headers.
2. **Sheet Surface (`#FBF9F6`):** The working analytical document, transcript tracks, and synthesis blocks.
3. **Active/Raised Surface (`#FFFFFF`):** Reserved solely for interactive contextual layers: dropdown menus, command palettes (`Cmd+K`), and scrub flyouts.
4. **Shadow Treatment:** Used only on Tier 3 overlays: `0 4px 16px -2px rgba(18, 19, 22, 0.06), 0 0 0 1px #E5E4DE`. No cards within the main viewport canvas carry box shadows.

## Shapes

The design system uses a strict **Soft (`roundedness: 1`)** standard. Radii are purposefully understated to preserve the technical, calibrated look of an industrial software terminal.

### Radii Specifications
- **Micro Radii (`0.125rem` / `2px`):** Checkbox targets, inline code snippets, telemetry chips, audio playhead nodes.
- **Standard UI Elements (`0.25rem` / `4px`):** Inputs, buttons, context tags, dropdown items, decision cards.
- **Overlay Panels (`0.5rem` / `8px`):** Command palletes, modal dialogs, flyout sheets.
- **Never Pill:** Avoid full pill shapes (`rounded-full`) for buttons or status chips. Chips must remain crisp and squared off (`4px`).

## Components

### 1. Buttons
- **Primary:** Solid carbon `#121316` background, `#FFFFFF` text, `4px` border radius, `h-8` (32px height), `px-3` padding. On hover: `#2454E8` transition.
- **Secondary:** Surface `#FFFFFF`, border `1px solid #E5E4DE`, text `#121316`. On hover: border `#666970`.
- **Tertiary / Ghost:** No border, background transparent, text `#666970`. On hover: `#F6F5F2` background, text `#121316`.

### 2. Semantic Nodes: Decisions vs. Actions
- **Decision Token (The Rhombus):** 
  - Visual: An authoritative diamond/rhombus glyph (`◆`) in `#9E5D0A`.
  - Container: Embedded row or block with `1px solid #E5E4DE` left-accented by `2px solid #9E5D0A`. Background: `#FDF6E9` at 40% opacity.
  - Meta: Accompanied by JetBrains Mono label `DECISION` and owner handle.
- **Action Item (The Commit Target):**
  - Visual: Custom `14px` square checkbox with `2px` border radius (`#E5E4DE`, checked `#0D8050`).
  - Container: Minimal hairline-separated row, no card wrapping. Hover reveals keyboard assign trigger and due date shortcut.
  - State: Completed tasks display text in `#8E9199` with normal weight; checkbox fills `#0D8050` with white checkmark.

### 3. Audio & Scrub Telemetry Bar
- Flat bar height: `28px`.
- Waveform / Activity Track: Discrete hairline bars with height proportional to speaker dominance.
- Playhead Scrubber: Crisp `#2454E8` vertical hairline line (`1.5px`) with a micro rectangular handle (`4px x 10px`) indicating current timestamp.

### 4. Input Fields & Search
- Background: `#FFFFFF`.
- Border: `1px solid #E5E4DE`. Focus state: `1px solid #2454E8`, no fuzzy outer glow or ring offset; sharp focus outline.
- Typography: Geist Sans `0.875rem` (`body-md`), placeholder in `#8E9199`.

### 5. Chips & Metadata Badges
- Height: `20px`. Padding: `0 6px`. Font: JetBrains Mono `0.6875rem` (`label-sm`).
- Shape: `2px` roundedness.
- Palette: `#F6F5F2` background, `1px solid #E5E4DE`, `#666970` text. Semantic variants use subtle tinted fills (`#EDF7F2` for resolved, `#FDF6E9` for pending consensus).

### 6. Elimination of Card Wraps
- Information chunks must not be wrapped in self-contained rounded cards with borders and shadows.
- Grouping is executed via subtle alternating background fills (`#F6F5F2` vs `#FBF9F6`), continuous vertical guide hairlines, or section divider lines (`border-b border-[#E5E4DE]`).