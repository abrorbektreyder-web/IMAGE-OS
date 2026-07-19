# ImageOS — Master Design System

## 🎨 Style: Dark Luxury Glassmorphism
Professional AI creative platform. Ultra-dark base with premium glass overlays, subtle neon-violet accents, and cinematic quality rendering.

---

## Color Palette (Semantic Tokens)

### Base (Dark Luxury)
```css
--color-bg-base:        #08080F;   /* Deep cosmic black */
--color-bg-surface:     #0F0F1A;   /* Card / Panel surface */
--color-bg-elevated:    #16162A;   /* Elevated elements */
--color-bg-overlay:     #1E1E35;   /* Hover, glass panels */
--color-border:         rgba(255,255,255,0.08);
--color-border-active:  rgba(139,92,246,0.5);
```

### Accent (Violet / Neon)
```css
--color-accent-primary:   #8B5CF6;   /* Primary violet */
--color-accent-secondary: #6D28D9;   /* Darker violet */
--color-accent-glow:      #A78BFA;   /* Hover glow */
--color-accent-neon:      #C4B5FD;   /* Active/selected */
```

### Status Colors
```css
--color-success:    #22C55E;
--color-warning:    #F59E0B;
--color-conflict:   #EF4444;
--color-info:       #3B82F6;
```

### Text
```css
--color-text-primary:   #F8F8FF;     /* Pure titles */
--color-text-secondary: #A1A1C7;     /* Labels, descriptions */
--color-text-muted:     #6B6B8F;     /* Placeholders */
--color-text-inverse:   #08080F;     /* Text on light surfaces */
```

---

## Typography

### Font Pairing
- **Headings:** `Plus Jakarta Sans` (700, 600) — Modern premium feel
- **Body / UI:** `Inter` (400, 500, 600) — Perfect for dense UI
- **Monospace (Prompts):** `JetBrains Mono` (400, 500) — Code / prompt output

### Google Fonts Import
```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Type Scale
```css
--font-xs:   0.75rem;   /* 12px  - Badges, labels */
--font-sm:   0.875rem;  /* 14px  - Helper text */
--font-base: 1rem;      /* 16px  - Body text */
--font-lg:   1.125rem;  /* 18px  - Sub-headings */
--font-xl:   1.25rem;   /* 20px  - Section titles */
--font-2xl:  1.5rem;    /* 24px  - Module headings */
--font-3xl:  2rem;      /* 32px  - Page headings */
--font-4xl:  2.5rem;    /* 40px  - Hero headings */
```

---

## Spacing System (8pt Grid)
```css
--space-1:   4px;
--space-2:   8px;
--space-3:   12px;
--space-4:   16px;
--space-5:   20px;
--space-6:   24px;
--space-8:   32px;
--space-10:  40px;
--space-12:  48px;
--space-16:  64px;
--space-20:  80px;
--space-24:  96px;
```

---

## Effects & Visual Language

### Glassmorphism Cards
```css
.glass-card {
  background: rgba(22, 22, 42, 0.6);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
}

.glass-card:hover {
  border-color: rgba(139, 92, 246, 0.4);
  box-shadow: 0 0 0 1px rgba(139,92,246,0.3),
              0 20px 40px -12px rgba(139,92,246,0.2);
}
```

### Selected State (Module Preset Card)
```css
.preset-card-selected {
  border: 1.5px solid #8B5CF6;
  background: rgba(139, 92, 246, 0.12);
  box-shadow: 0 0 20px rgba(139,92,246,0.25),
              inset 0 1px 0 rgba(255,255,255,0.08);
}
```

### Glow Button (Primary CTA)
```css
.btn-primary {
  background: linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%);
  border: none;
  border-radius: 10px;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 4px 24px rgba(139,92,246,0.4);
  transition: all 200ms ease;
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 32px rgba(139,92,246,0.6);
}
.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 12px rgba(139,92,246,0.4);
}
```

---

## Layout (3-Column Studio)

### Desktop (≥1280px)
```
[240px Left: Reference + Meta] [flex Center: Module Cards] [360px Right: Output + Validation]
```

### Tablet (768px–1279px)
```
[Center: Module Cards — Full Width]
[Bottom Sheet: Output Prompt]
```

### Mobile (< 768px)
```
[Stacked: Reference Image → Module Steps → Prompt Output]
```

---

## Component Patterns

### Module Preset Card
- `48px min-height`, `16px border-radius`
- Glassmorphism background
- Violet border on selected state
- Micro-animation: `transform: scale(0.98)` on press, `scale(1.0)` on release
- Checkmark icon (top-right corner) when selected

### Validation Badge
- `INFO` → Blue border + icon
- `WARNING` → Amber border + ⚠️ SVG icon
- `CONFLICT` → Red border + ✗ SVG icon + shake animation (150ms)

### Prompt Output Area
- Background: `#0A0A18`
- Font: `JetBrains Mono`
- Green syntax highlighting for identity lock section
- Violet highlighting for user-selected sections
- One-click copy button (top right corner of each box)

---

## Animation Rules

| Event | Duration | Easing |
|---|---|---|
| Preset card hover | 150ms | ease-out |
| Preset card select | 200ms | ease-out |
| Validation badge appear | 200ms | ease-out |
| Prompt text render | 300ms | ease-out |
| Page transition | 250ms | ease-in-out |
| Shake (conflict) | 300ms | ease-in-out |

---

## Anti-Patterns to Avoid

- ❌ Never use emoji as icons — use Lucide React icons only
- ❌ No white backgrounds — always use dark surface tokens
- ❌ No raw hex colors in components — always use CSS variables
- ❌ No horizontal scroll on any breakpoint
- ❌ No layout-shifting animations
- ❌ No blocking animations during API calls
