# Revoras Design System v2 — "Gold"

_Supersedes v1 "Terra Jade" (frozen 2026-07-15, tagged `customer-experience-v1`).
This is the reference every screen consumes. Change these decisions here first,
deliberately — not per-page._

## Source of truth (in priority order)

1. **`src/app/globals.css`** — the actual token values (`:root` light, `.dark`
   dark) exposed to Tailwind via `@theme inline`. Editing a value here re-themes
   the whole app.
2. **`/design-system`** (route `src/app/design-system/page.tsx`) — the **living**
   showcase: every component rendered against the real tokens. Toggle the theme
   there to check light/dark. If a component isn't here, it isn't in the system.
3. **`src/components/ui/*`** (barrel: `@/components/ui`) — the component
   implementations. Pages import from the barrel; never re-implement a primitive.

If this doc and the code disagree, the code wins — then update this doc.

## The rule that keeps it consistent

Token **names** are frozen; only **values** define the look. Components use
semantic classes (`bg-surface`, `text-primary`, `bg-accent`, `text-on-surface`,
`shadow-elevated`, `rounded-2xl`). **Never** hardcode a hex in a component — if a
color is missing, add a token, don't inline it. This is why the v2 gold re-skin
re-themed ~90 files by editing one file.

---

## Color

Warm **gold** primary (brand) — a single accent, not a two-hue duo. Green
**secondary** = success, red **error** = destructive, amber **warning** = caution.

**The two themes are designed independently, not derived from each other.**
They share the brand, not the recipe:

| | Light | Dark |
|---|---|---|
| Personality | Warm off-white, airy | Black, graphite, white |
| Budget | ~85% light neutrals, ~15% gold | ~90% black/graphite, ~8% white, ~2% gold |
| Surfaces | Off-white (`#F8F7F4`), white cards | **Neutral** near-black — zero hue |

Gold is an **event, not a background**: it appears on the CTA, focus ring,
active nav, and selected chip — nothing else. If you are reaching for a gold
*surface*, that's the mistake this rule exists to prevent.

Every solid mid-tone fill (`--primary`, `--secondary`, `--error`, `--warning`)
pairs with **near-black text**, in both themes — each of those hexes is light
enough that white text fails WCAG AA on it. Container tones (`--primary-container`
etc.) keep the conventional light-tint + deep-hue-text pairing.

| Token | Light | Dark | Use for |
|---|---|---|---|
| `--primary` | `#C9A45C` | `#C9A45C` | Brand. Primary buttons, links, active nav, focus rings |
| `--primary-hover` | `#B98F40` | `#DDBB78` | Primary hover state |
| `--primary-foreground` | `#1C1C1C` | `#1C1400` | Text/icons **on** a primary fill |
| `--accent` | `#D8B876` | `#E0C285` | A second gold *step* (not a second hue) for rare double-emphasis |
| `--secondary` | `#4CAF50` | `#59C36A` | **Success only** (confirmed, paid, positive) |
| `--error` | `#E53935` | `#FF6B6B` | Destructive / failure only |
| `--warning` | `#F4B400` | `#F4B400` | Caution / pending only |
| `--background` | `#F8F7F4` | `#0C0C0D` | Page background |
| `--surface` / `--card` | `#FFFFFF` | `#171717` | Cards, sheets |
| `--foreground` / `--on-surface` | `#1C1C1C` | `#FFFFFF` | Body text |
| `--on-surface-variant` | `#6E6E6E` | `#B3B3B3` | Secondary text |
| `--muted` | `#979797` | `#808080` | Secondary/meta text |
| `--border` | `rgba(0,0,0,.08)` | `rgba(255,255,255,.08)` | Hairlines, dividers |

Dark nav is pinned to `#0A0A0A @72%` + blur + a white 8% hairline (`.glass-nav`),
deliberately *not* `--surface`: the nav reads as the darkest chrome on the page.

Full scale (surface-container-\*, on-\*-container, tertiary, inverse) lives in
`globals.css`. `--tertiary` aliases `--accent`, so legacy tertiary usages read gold.

**Signature:** a single-hue gold gradient (deep → bright gold, a tonal shift, not
a hue shift). Utilities: `.brand-gradient` (fills — hero bands, CTAs) and
`.brand-gradient-text` (headline accent words). Both are theme-aware in dark,
where a section-sized gradient would blow the 2% accent budget:
`.brand-gradient-text` resolves **white → gold** (the phrase lands on the brand
instead of the whole line reading gold), and `.brand-banner` (the full-bleed
marketing band) drops the wash entirely for charcoal + a faint gold glow + a
white hairline.

**Semantic discipline:** primary = the one brand action color; secondary =
success state, never decoration; error = destructive only; warning = caution
only. Don't reach for raw Tailwind palette colors (`bg-green-500`) — use tokens.

---

## Typography

Loaded via `<link>` in `layout.tsx`; exposed as `font-*` utilities.

| Utility | Family | Use |
|---|---|---|
| `font-headline` | Hanken Grotesk (500–800) | Headlines, section titles, card names, logo |
| `font-body` | Manrope (400–600) | Body, labels, UI text (default on `<body>`) |
| `font-label` | Manrope | Buttons/eyebrows/meta — aliases body; one voice, not a third face |

Scale is Tailwind's default (`text-sm … text-7xl`). Headlines are
`font-extrabold tracking-tight`; hero display `text-5xl→text-7xl`.

## Interaction & scale — FROZEN v1

These are the "forgotten" values that cause drift. Future screens **reuse these**;
they do not invent new ones. Anything CSS-expressible is a token in `globals.css`;
JS-side sizes live in `@/lib/design-tokens` (`ICON_SIZE`).

**Motion** (`globals.css`)

| Token | Value | For |
|---|---|---|
| `--duration-fast` | 150ms | Hovers, small state flips |
| `--duration-base` | 250ms | Default; cards, inputs, theme transition |
| `--duration-slow` | 400ms | Sheets, image zoom, page-level moves |
| `--ease-out` | `cubic-bezier(.22,1,.36,1)` | Default easing (enter) |
| `--ease-in-out` | `cubic-bezier(.65,0,.35,1)` | Symmetric moves |

Usage: `duration-(--duration-base) ease-(--ease-out)`. Hover lift =
`hover:-translate-y-0.5` (**2px**). Image zoom = `group-hover:scale-105`. Theme
transitions gated on `.theme-ready` (no first-paint flash).

**Radius** — `--radius` 4px · `-lg` 8px · `-xl` 12px · `-2xl` 24px · `-btn` 16px ·
`-input` 16px · `-dialog` 28px. Cards `rounded-2xl`; buttons `rounded-btn`;
inputs/textarea/select `rounded-input`; dialogs/modals/bottom-sheet drawers
`rounded-dialog`; pills/search/chips/avatars `rounded-full`; compact nested
tiles (ProfessionalCard/ServiceCard rows) `rounded-xl`.

**Elevation (theme-aware)** — `.shadow-soft` (resting card) → `.shadow-elevated`
(hover / raised) → `.shadow-floating` (search bar, popovers, floating chips).
Card hover = soft→elevated. Never hardcode `shadow-[0_..rgba(0,0,0,..)]`.

**Z-index** — token scale only (`--z-dropdown` 1000 · `--z-sticky` 1100 ·
`--z-drawer` 1200 · `--z-modal` 1310 · `--z-popover` 1320 · `--z-toast` 1400 ·
`--z-tooltip` 1500). Never magic numbers — this is what fixed the Drawer/Select
overlay bugs. A raw `z-40` on the booking wizard's mobile CTA is what let the
tab bar (`--z-sticky`) render on top of it; the CTA was untappable on phones and
desktop-only screenshots never showed it.

**One fixed bar per screen edge.** `BottomNav` is `fixed bottom-0` at
`--z-sticky`, so a page-level action bar at the same edge always loses. Focused
funnel routes (`/user/book`, `/user/checkout`) therefore render their own action
bar and `CustomerNav` hides the tab bar there — a checkout must not offer tab
navigation competing with "Pay". Any new bottom action bar either lives on a
funnel route or must not coexist with the tab bar. Match funnel paths exactly or
by path segment: `/user/bookings` starts with `/user/book` and is NOT a funnel.

**Icon sizes** (`ICON_SIZE` from `@/lib/design-tokens`) — `sm` 16 · `md` 20 ·
`lg` 24. Pass to lucide's `size`; don't hardcode pixel sizes.

**Avatar** (`Avatar` `size`) — `sm` 28 · `md` 40 · `lg` 56 · `xl` 80 px.

**Badge** (`Badge` `tone`) — `rounded-full px-2.5 py-0.5 text-xs`; tones
neutral / primary / success / warning / danger, optional `dot`. One size.

**Card** (`Card`) — `padding`: `sm` 16 · `md` 24 (default) · `lg` 32; `elevation`:
flat / soft (default) / elevated. `CardFooter` = `mt-5 pt-5` top border.

**Container widths** (`Container` `width`) — `md` `max-w-3xl` (768, customer
reading/detail) · `lg` `max-w-6xl` (1152, dashboards/data) · `full`. Gutters
`px-4 md:px-6`. Marketing/hero full-bleed use `max-w-screen-2xl px-5 md:px-8`.

**Section & page spacing** — `Section` stacks with `gap-4`; its title row is
`text-xl font-semibold` + `text-sm text-muted mt-1` description. Page bodies stack
sections with `gap-10` (and `py-8`). Rails: `grid grid-cols-2 md:grid-cols-4
gap-4`; horizontal chip rows `gap-2`.

**Breakpoints** — Tailwind defaults (`sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280
· `2xl` 1536). **`md` is the mobile boundary**: `BottomNav` is `md:hidden`,
desktop multi-column / sticky layouts start at `md`. Deliberately no custom
breakpoint set.

---

## Components (from `@/components/ui`)

Primitives: Button, Input, Textarea, Select, Checkbox, RadioGroup, Switch, Badge,
Avatar, Chip, Divider, Tooltip, Spinner. Layout: Card, Container, Section,
PageHeader, Modal, Drawer, Sidebar, TopNav, BottomNav, AppShell. Feedback: Toast,
EmptyState, Skeleton (+ Card/ListItem variants), ErrorState, ConfirmDialog. Data:
ListItem, Tabs, Pagination, DataTable, StatCard, ScheduleGrid, Timeline. Booking
domain: RatingDisplay, TrustBadges, CategoryChip, **BusinessCard**,
ProfessionalCard, ServiceCard, BookingCard, TimeSlotPicker. All shown live at
`/design-system`.

**Buttons** — `intent`: primary | secondary | outline | ghost | danger; `size`:
sm | md | icon; `loading`/`disabled`. **Badges** — `tone`: neutral | primary |
success | warning | danger, optional `dot`. Booking status badges mirror
`bookings.status` exactly.

### Signature patterns (reuse, don't reinvent)

- **Floating search bar:** rounded-full surface card, `.shadow-floating`, leading
  lucide icon + placeholder, gold Search button. On the hero it's two fields
  (what + location); inline it's one. See `SplashHero` / `HomeHero`.
- **Studio card:** `BusinessCard`. Has a **branded placeholder** (gold wash +
  studio monogram) when `imageUrl` is missing — always pass real data through
  it; don't build a bespoke card.
- **CTA band:** `.brand-gradient` panel with `.grainy-overlay`, white text, a
  white pill button. See the Become-a-Host band on the landing.
- **Section rail:** heading + optional "See all" link + a responsive card grid.

## Navigation & chrome

- Marketing pages: `Navbar` (logo, links, theme toggle, Log in / Sign up, mobile
  menu) + `Footer` (multi-column).
- Customer app: `CustomerNav` (`TopNav` + mobile `BottomNav`) — logo, links,
  theme toggle, notifications bell + unread badge, `UserMenu`, Book Now +
  `UserFooter`.
- Theme toggle: `ThemeToggleButton` everywhere (single `useTheme` source).

---

## Rollout order (after freeze)

Business Detail → Professional Profile → Search Results → Booking flow →
Customer Dashboard → Business Dashboard → Admin. Each **consumes** the above; if a
screen needs something new, add it to `/design-system` + this doc first, then use
it — so the system grows deliberately instead of drifting per page.
