# DESIGN.md

## AgencyHires Redesign System

Version: 2.0 - Next.js 16 + React 19 + Tailwind CSS 4

This document defines the visual language, design philosophy, UX standards, component behavior, and implementation rules for the AgencyHires redesign.

**Tech Stack:**

- Next.js 16.2 (App Router)
- React 19.2
- Tailwind CSS 4
- TypeScript
- Geist Font Family
- Cloudflare Workers (via @opennextjs/cloudflare)
- Vite+ tooling

The goal is to ensure all future AI-generated UI remains:

- professional
- operational
- trustworthy
- restrained
- enterprise-grade

This is NOT a flashy startup landing page.

The aesthetic target is:

- Linear
- Vercel
- Ashby
- Stripe Docs
- Notion Enterprise
- Ramp

---

# 1. Core Philosophy

## Brand Positioning

AgencyHires is NOT:

- a social app
- a crypto startup
- an AI toy
- a futuristic design experiment

AgencyHires IS:

- operational infrastructure
- hiring operations
- talent deployment
- systems-oriented recruiting
- enterprise staffing

The design must communicate:

> "These people have process."

Not:

> "These people discovered animations."

---

# 2. Design Principles

## PRIORITIZE

### Calm Interfaces

Use restraint.

### Information Density

Prioritize meaningful content over decoration.

### Trust Through Structure

Clear spacing, typography, hierarchy, and layout create trust.

### Operational Aesthetic

The interface should resemble software infrastructure.

### Sharp Hierarchy

Every section must have:

- clear title
- supporting text
- single primary action

---

# 3. NEVER USE

## Forbidden Styles

DO NOT USE:

- gradients
- neon glow
- glassmorphism-heavy UI
- floating blobs
- excessive animations
- random icon spam
- oversized shadows
- colorful borders
- rainbow accents
- "AI startup" aesthetics

DO NOT USE:

- `bg-gradient-*`
- `shadow-purple-*`
- `animate-pulse` on large sections
- animated backgrounds
- excessive motion

---

# 4. Visual Language

## Color Palette

Use neutral zinc/slate palette.

### Primary Colors

Configure via Tailwind CSS 4 `@theme inline` in `app/globals.css`:

```css
@theme inline {
  --color-background: #09090b; /* zinc-950 */
  --color-surface: #18181b; /* zinc-900 */
  --color-elevated: #27272a; /* zinc-800 */
  --color-border: #3f3f46; /* zinc-700 */

  --color-text-primary: #fafafa; /* zinc-50 */
  --color-text-secondary: #a1a1aa; /* zinc-400 */
  --color-text-muted: #71717a; /* zinc-500 */

  --color-accent: #4ade80; /* emerald-400 */
  --color-danger: #fb7185; /* rose-400 */
}
```

Use in components:

```tsx
className = "bg-[--color-surface] text-[--color-text-primary] border-[--color-border]";
```

Or standard Tailwind utilities:

```tsx
className = "bg-zinc-900 text-zinc-50 border-zinc-700";
```

---

# 5. Typography System

## Font

**PRIMARY FONT:**

- Geist Sans (`--font-geist-sans`) - for UI and body text
- Geist Mono (`--font-geist-mono`) - for code and technical content

Font loading via Next.js `next/font/google`:

```tsx
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

Geist is configured in Tailwind via `@theme inline`:

```css
@theme inline {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

Avoid:

- Poppins
- Montserrat
- Orbitron
- Inter (Geist is superior)
- decorative fonts

---

## Typography Scale

### Hero Heading

```tsx
className="
text-5xl
md:text-7xl
font-semibold
tracking-tight
leading-[0.95]
"
```

### Section Heading

```tsx
className="
text-3xl
md:text-4xl
font-semibold
tracking-tight
"
```

### Body Text

```tsx
className="
text-base
leading-7
text-zinc-400
"
```

### Small Labels

```tsx
className="
text-sm
text-zinc-500
font-medium
"
```

---

# 6. Layout System

## Containers

ALWAYS use constrained layouts.

```tsx
className = "max-w-7xl mx-auto px-6";
```

For text-heavy sections:

```tsx
className = "max-w-3xl";
```

---

## Section Spacing

Desktop:

```tsx
className = "py-32";
```

Mobile:

```tsx
className = "py-24";
```

---

## Grid Philosophy

Use:

- 2-column grids
- 3-column grids
- asymmetric layouts

Avoid:

- cramped 4-column grids on desktop
- masonry layouts
- Pinterest aesthetics

---

# 7. Component Standards

## Border Radius

Preferred:

```tsx
rounded-xl
rounded-2xl
```

Avoid:

```tsx
rounded-full
rounded-[999px]
```

---

## Borders

Use borders heavily.

```tsx
border border-zinc-800
```

Borders create structure and professionalism.

---

## Shadows

Minimal shadows only.

Allowed:

```tsx
shadow - sm;
```

Avoid:

- glow shadows
- colored shadows
- giant blur shadows

---

# 8. Button System

## Primary Button

```tsx
<Button
  className="
  bg-white
  text-black
  hover:bg-zinc-200
  rounded-xl
  h-11
  px-5
  font-medium
  "
>
```

---

## Secondary Button

```tsx
<Button
  variant="outline"
  className="
  border-zinc-700
  bg-transparent
  hover:bg-zinc-900
  rounded-xl
  "
>
```

---

# 9. Card System

## Standard Card

```tsx
<Card
  className="
  bg-zinc-900/60
  border-zinc-800
  rounded-2xl
  backdrop-blur-sm
  "
>
```

---

## Card Content Rules

Cards should contain:

- metrics
- process
- comparisons
- operational information

Avoid decorative cards.

---

# 10. Motion Guidelines

## Motion Philosophy

Motion should:

- support clarity
- never become the feature

---

## Allowed Motion

Use:

- opacity fade
- subtle translate-y
- hover border color
- tiny scale changes

Duration:

```css
150ms - 250ms
```

---

## Forbidden Motion

DO NOT USE:

- parallax
- floating UI
- bouncing elements
- rotating decorations
- animated gradients
- cursor trails
- blob animations

---

# 11. Content Hierarchy

Each section must follow:

1. Label (optional)
2. Heading
3. Supporting paragraph
4. Visual/proof
5. CTA

---

# 12. Information Architecture

Preferred landing page order:

## 1. Hero

Clear value proposition.

## 2. Metrics Strip

Immediate proof.

## 3. Process Section

Explain how hiring works.

## 4. Vetting System

Show candidate quality controls.

## 5. Compensation Comparison

Demonstrate savings.

## 6. Case Studies

Real operational outcomes.

## 7. FAQ

Reduce friction.

## 8. Final CTA

Single conversion target.

---

# 13. Hero Section Rules

Hero sections must:

- focus on trust
- focus on outcomes
- avoid buzzwords

---

## GOOD

"Hire elite global talent without bloated agency costs."

---

## BAD

"Revolutionizing AI-powered workforce synergy."

---

# 14. Icons

Use icons sparingly.

Icons should support:

- process
- verification
- operations
- systems

Avoid:

- random decorative Lucide icons
- emoji aesthetics
- oversized icons

---

# 15. Preferred UI Elements

Prioritize:

- timelines
- dashboards
- process flows
- evaluation scorecards
- compensation tables
- operational metrics
- hiring pipeline previews

Avoid:

- abstract illustrations
- generic SaaS graphics
- floating 3D objects

---

# 16. Component Architecture

Build custom components using React 19 patterns:

**React Server Components (RSC):**

- Use `async` components for data fetching
- Default to Server Components
- Mark with `"use client"` only when needed (interactivity, hooks, browser APIs)

**Component Patterns:**

```tsx
// Server Component (default)
export default async function MetricsCard() {
  const data = await fetchMetrics();

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h3 className="text-lg font-medium">{data.title}</h3>
      <p className="text-zinc-400">{data.description}</p>
    </div>
  );
}

// Client Component (interactive)
("use client");

import { useState } from "react";

export function InteractiveCard() {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-2xl p-6"
    >
      {/* interactive content */}
    </button>
  );
}
```

Avoid component libraries - build custom UI using Tailwind utilities.

---

# 17. Tailwind CSS 4 Configuration

## CSS-Based Configuration

Tailwind CSS 4 uses `@import "tailwindcss"` and `@theme inline` instead of JS config files.

**Configure in `app/globals.css`:**

```css
@import "tailwindcss";

@theme inline {
  /* Colors */
  --color-background: #09090b;
  --color-surface: #18181b;

  /* Fonts */
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  /* Spacing, borders, shadows */
  --radius-card: 1rem;
  --shadow-subtle: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
```

**PostCSS Config:**

```js
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

## Utility Grouping Standards

GOOD:

```tsx
className="
bg-zinc-900
border border-zinc-800
rounded-2xl
p-6
"
```

BAD:

```tsx
className="
bg-[#121212]
border-[#282828]
rounded-[27px]
p-[23px]
"
```

**Prefer standard utilities over arbitrary values** - only use arbitrary values `[...]` for one-off custom values.

---

# 18. Responsive Philosophy

Mobile is NOT desktop compressed.

On mobile:

- reduce visual complexity
- stack sections vertically
- simplify layouts
- preserve spacing rhythm

---

# 19. Accessibility

Minimum standards:

- visible focus states
- contrast-safe text
- semantic HTML
- keyboard navigable
- reduced motion support

---

# 20. Technical Philosophy

## Next.js 16 + React 19 Patterns

**Prefer:**

- React Server Components (RSC) by default
- `async/await` in Server Components for data fetching
- Static rendering (`export const dynamic = 'force-static'`)
- Server Actions for mutations
- Edge Runtime (`export const runtime = 'edge'`)
- Partial Prerendering (PPR)
- Low-JS interactions
- Semantic HTML
- Composable sections

**File Structure:**

```
app/
├── layout.tsx           # Root layout (Server Component)
├── page.tsx             # Home page (Server Component)
├── globals.css          # Tailwind CSS 4 config
├── api/
│   └── route.ts         # API Route Handlers
└── [feature]/
    ├── page.tsx         # Feature page
    └── components/
        ├── server.tsx   # Server Components
        └── client.tsx   # "use client" components
```

**Cloudflare Workers Deployment:**

- Deploy via `@opennextjs/cloudflare`
- Use Edge Runtime for optimal performance
- Leverage Cloudflare KV/D1/R2 when needed
- Keep bundle size minimal

**Avoid:**

- Animation-heavy hydration
- Unnecessary "use client" directives
- Giant dependencies
- Complex state management libraries
- Heavy client-side routing

---

# 21. Development Workflow (Vite+)

This project uses **Vite+** (`vp`), a unified toolchain for the web.

## Common Commands

```bash
# Development
vp dev                    # Start Next.js dev server
vp build                  # Build for production
vp preview                # Preview production build

# Code Quality
vp check                  # Run format, lint, type checks
vp lint                   # Lint code
vp fmt                    # Format code
vp test                   # Run tests

# Package Management
vp install / vp i         # Install dependencies
vp add <package>          # Add package
vp remove <package>       # Remove package
vp outdated               # Check for updates

# Cloudflare Deployment
npm run deploy            # Deploy to Cloudflare Workers
npm run preview           # Preview on Cloudflare
```

## Pre-commit Checklist

Before committing code:

```bash
vp check                  # Format, lint, type check
vp test                   # Run tests
vp build                  # Verify build succeeds
```

---

# 22. AI Generation Rules

When generating UI:

- prefer restraint over creativity
- prefer hierarchy over decoration
- prefer clarity over novelty

The interface should feel:

- investor-ready
- operational
- scalable
- measurable
- process-driven

NOT:

- experimental
- trendy
- futuristic
- flashy

---

# 23. Final Design Goal

The final product should feel like:

> "A premium operational hiring platform trusted by serious companies."

NOT:

> "A startup template generated from a prompt."

---

# 24. Example Next.js 16 Section

```tsx
// app/sections/vetting-system.tsx
// Server Component (default)

interface VettingItem {
  title: string;
  description: string;
}

const items: VettingItem[] = [
  {
    title: "Technical Screen",
    description: "Live coding, architecture discussion, system design.",
  },
  {
    title: "Communication Check",
    description: "Written and verbal clarity, timezone alignment.",
  },
  {
    title: "Trial Period",
    description: "2-week paid trial with real project work.",
  },
];

export default function VettingSystemSection() {
  return (
    <section className="py-32 border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <p className="text-sm text-zinc-500 mb-4">Vetting System</p>

          <h2 className="text-4xl font-semibold tracking-tight text-white">
            Every candidate passes a multi-stage evaluation process.
          </h2>

          <p className="mt-6 text-base leading-7 text-zinc-400">
            We evaluate communication, technical execution, operational reliability, and long-term
            fit before deployment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {items.map((item) => (
            <div
              key={item.title}
              className="
                bg-zinc-900/60
                border border-zinc-800
                rounded-2xl
                p-6
                backdrop-blur-sm
              "
            >
              <h3 className="text-lg font-medium text-white">{item.title}</h3>

              <p className="mt-3 text-zinc-400 leading-6">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**With Data Fetching (React Server Component):**

```tsx
// app/sections/metrics.tsx
export default async function MetricsSection() {
  // Fetch data directly in Server Component
  const metrics = await fetch("https://api.example.com/metrics", {
    next: { revalidate: 3600 }, // Revalidate every hour
  }).then((res) => res.json());

  return (
    <section className="py-24 bg-zinc-950 border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <div className="text-5xl font-bold text-white">{metric.value}</div>
              <div className="text-sm text-zinc-500 mt-2">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

# 25. Success Criteria

A successful redesign should make users think:

- "This company is organized."
- "This looks enterprise-ready."
- "I trust this process."
- "This feels operationally mature."

A failed redesign makes users think:

- "This is another AI-generated SaaS template."

---
