'use client';

import { useState, useCallback, useEffect } from 'react';
import { ReferenceImageUpload } from '@/components/ReferenceImageUpload';
import { PresetCard } from '@/components/PresetCard';
import { PromptOutput } from '@/components/PromptOutput';

// ============================================================
// Static preset data (will come from API in V2)
// ============================================================
const MODULES = [
  {
    id: 'WARDROBE',
    label: 'Wardrobe',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
      </svg>
    ),
    presets: [
      { id: 'w1', name: 'Silk Evening Gown', description: 'Floor-length, deep navy, off-shoulder' },
      { id: 'w2', name: 'Casual Linen Shirt', description: 'Relaxed fit, cream white' },
      { id: 'w3', name: 'Leather Biker Jacket', description: 'Black, fitted, moto-style' },
      { id: 'w4', name: 'Athleisure Set', description: 'Sports bra + leggings, minimal' },
      { id: 'w5', name: 'Business Suit', description: 'Tailored charcoal, slim fit' },
      { id: 'w6', name: 'Summer Dress', description: 'Floral midi, flowing fabric' },
    ],
  },
  {
    id: 'LOCATION',
    label: 'Location',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    presets: [
      { id: 'l1', name: 'Penthouse Rooftop', description: 'Manhattan skyline, dusk' },
      { id: 'l2', name: 'Parisian Street', description: 'Cobblestone, Haussmann buildings' },
      { id: 'l3', name: 'Luxury Bedroom', description: 'Marble, king-size, ambient lighting' },
      { id: 'l4', name: 'Desert Landscape', description: 'Red sand dunes, golden hour' },
      { id: 'l5', name: 'Modern Studio', description: 'White backdrop, seamless floor' },
      { id: 'l6', name: 'Tropical Beach', description: 'Turquoise water, palm trees' },
    ],
  },
  {
    id: 'TIME_OF_DAY',
    label: 'Time of Day',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
    ),
    presets: [
      { id: 't1', name: 'Golden Hour', description: 'Warm glow, 30 min before sunset' },
      { id: 't2', name: 'Blue Hour', description: 'Twilight, cool blue tones' },
      { id: 't3', name: 'Midday Sun', description: 'Harsh overhead, high contrast' },
      { id: 't4', name: 'Overcast Morning', description: 'Soft diffused, no shadows' },
      { id: 't5', name: 'Night', description: 'Artificial lighting, dark background' },
      { id: 't6', name: 'Sunrise', description: 'Pale pink & orange horizon' },
    ],
  },
  {
    id: 'WEATHER',
    label: 'Weather',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
      </svg>
    ),
    presets: [
      { id: 'we1', name: 'Clear Sky', description: 'No clouds, vivid colors' },
      { id: 'we2', name: 'Light Rain', description: 'Wet streets, soft reflections' },
      { id: 'we3', name: 'Heavy Rain', description: 'Dramatic storm, rain streaks' },
      { id: 'we4', name: 'Light Snow', description: 'Snowflakes, winter mood' },
      { id: 'we5', name: 'Fog / Mist', description: 'Ethereal, reduced visibility' },
      { id: 'we6', name: 'Windy', description: 'Hair and clothes in motion' },
    ],
  },
  {
    id: 'POSE',
    label: 'Pose',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="5" r="2"/>
        <path d="M10.5 7.5L8 17l4-2 4 2-2.5-9.5"/>
        <line x1="12" y1="15" x2="12" y2="21"/>
      </svg>
    ),
    presets: [
      { id: 'p1', name: 'Walking Forward', description: 'Natural stride, confident' },
      { id: 'p2', name: 'Standing Straight', description: 'Frontal, composed, editorial' },
      { id: 'p3', name: 'Sitting Casually', description: 'Relaxed seated, candid' },
      { id: 'p4', name: 'Looking Over Shoulder', description: '3/4 back view, glancing' },
      { id: 'p5', name: 'Dynamic Action', description: 'Movement blur, energetic' },
      { id: 'p6', name: 'Lying Down', description: 'Horizontal, resting mood' },
    ],
  },
  {
    id: 'LIGHTING',
    label: 'Lighting',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    presets: [
      { id: 'li1', name: 'Rembrandt Lighting', description: 'Dramatic triangle shadow on cheek' },
      { id: 'li2', name: 'Butterfly Lighting', description: 'Overhead, glamour shadow under nose' },
      { id: 'li3', name: 'Rim / Backlight', description: 'Edge glow, silhouette definition' },
      { id: 'li4', name: 'Natural Window', description: 'Soft side lighting, realistic' },
      { id: 'li5', name: 'Neon RGB', description: 'Cyberpunk multi-color gels' },
      { id: 'li6', name: 'Cinematic Moody', description: 'Low-key, deep shadows, atmosphere' },
    ],
  },
  {
    id: 'CAMERA',
    label: 'Camera',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
    presets: [
      { id: 'c1', name: '85mm Portrait', description: 'f/1.4, shallow DOF, creamy bokeh' },
      { id: 'c2', name: '35mm Street', description: 'f/8, everything in focus, wide' },
      { id: 'c3', name: '50mm Standard', description: 'Natural perspective, versatile' },
      { id: 'c4', name: '24mm Wide Angle', description: 'Environmental, dramatic foreground' },
      { id: 'c5', name: '200mm Telephoto', description: 'Compressed background, isolated subject' },
      { id: 'c6', name: 'Macro Close-up', description: 'Extreme detail, texture focus' },
    ],
  },
  {
    id: 'NEGATIVE_PROMPT',
    label: 'Negative',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
      </svg>
    ),
    presets: [],
  },
];

// ============================================================
// Standard Negative Prompt (mirrors backend constant)
// ============================================================
const STANDARD_NEGATIVE =
  'low quality, blurry, bad anatomy, extra fingers, deformed face, wrong proportions, watermark, text, cartoon, anime, cgi, duplicate person, identity drift, plastic skin';

// ============================================================
// Main Page
// ============================================================
export default function HomePage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState('WARDROBE');
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [customNotes, setCustomNotes] = useState<Record<string, string>>({});
  const [negCustom, setNegCustom] = useState('');

  // Apply theme to <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const handleUpload = useCallback((file: File, url: string) => {
    setReferenceFile(file);
    setPreviewUrl(url);
  }, []);

  const togglePreset = (moduleId: string, presetId: string) => {
    setSelections((prev) => ({
      ...prev,
      [moduleId]: prev[moduleId] === presetId ? '' : presetId,
    }));
  };

  const currentModule = MODULES.find((m) => m.id === activeModule);

  // ── Build positive prompt ──────────────────────────────────
  const buildPositive = () => {
    const parts: string[] = [];
    parts.push('[IDENTITY LOCK ACTIVE] Preserve exact person from reference image. Maintain identical facial structure, skin tone, hairstyle, and body proportions.');
    for (const mod of MODULES) {
      if (mod.id === 'NEGATIVE_PROMPT') continue;
      const selId = selections[mod.id];
      const preset = selId ? mod.presets.find((p) => p.id === selId) : null;
      const note = customNotes[mod.id]?.trim();
      if (preset || note) {
        let chunk = '';
        if (preset) chunk = `${mod.label}: ${preset.name}${preset.description ? ` — ${preset.description}` : ''}`;
        if (note) chunk = chunk ? `${chunk}. Note: ${note}` : `${mod.label}: ${note}`;
        parts.push(chunk);
      }
    }
    return parts.length > 1 ? parts.join('\n\n') : '';
  };

  // ── Build negative prompt ──────────────────────────────────
  const buildNegative = () => {
    const base = STANDARD_NEGATIVE;
    return negCustom.trim() ? `${base}, ${negCustom.trim()}` : base;
  };

  const positivePrompt = buildPositive();
  const negativePrompt = buildNegative();
  const selectionCount = Object.values(selections).filter(Boolean).length;

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* ── Top Navbar ────────────────────────────────────── */}
      <header style={{
        height: 56,
        borderBottom: '1px solid var(--border-default)',
        background: 'rgba(8,8,15,0.9)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Logo */}
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(139,92,246,0.4)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.01em' }}>
            Image<span style={{ color: 'var(--accent-primary)' }}>OS</span>
          </span>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            background: 'rgba(139,92,246,0.15)',
            border: '1px solid rgba(139,92,246,0.3)',
            color: 'var(--accent-neon)',
            borderRadius: 4,
            padding: '2px 6px',
            letterSpacing: '0.05em',
          }}>
            V1
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {selectionCount} module{selectionCount !== 1 ? 's' : ''} selected
          </span>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
              border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 200ms ease',
              color: 'var(--text-secondary)',
            }}
          >
            {theme === 'dark' ? (
              /* Sun icon */
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              /* Moon icon */
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 600, color: 'white',
          }}>
            U
          </div>
        </div>
      </header>

      {/* ── Main Layout ───────────────────────────────────── */}
      <main style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '260px 1fr 360px',
        gap: 0,
        height: 'calc(100dvh - 56px)',
        overflow: 'hidden',
      }}>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            LEFT PANEL — Reference Image + Project Info
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <aside style={{
          borderRight: '1px solid var(--border-default)',
          background: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          overflowY: 'auto',
        }}>
          {/* Section header */}
          <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border-default)' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              Identity Source
            </p>
            <ReferenceImageUpload onUpload={handleUpload} />

            {referenceFile && (
              <div style={{
                marginTop: 10,
                padding: '8px 10px',
                background: 'rgba(34,197,94,0.08)',
                border: '1px solid rgba(34,197,94,0.25)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#22C55E" strokeWidth="2">
                  <polyline points="2,6 5,9 10,3"/>
                </svg>
                <span style={{ fontSize: 11, color: '#86EFAC', fontWeight: 500 }}>Identity Lock Active</span>
              </div>
            )}
          </div>

          {/* Identity Lock Info */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-default)' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              Identity Lock
            </p>
            <div style={{
              background: 'rgba(139,92,246,0.06)',
              border: '1px solid rgba(139,92,246,0.15)',
              borderRadius: 10,
              padding: '10px 12px',
            }}>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                🔒 Facial structure, skin tone, hairstyle, and body proportions are automatically preserved — no configuration needed.
              </p>
            </div>
          </div>

          {/* Selection Summary */}
          <div style={{ padding: '14px 16px', flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Selected
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {MODULES.filter((m) => m.id !== 'NEGATIVE_PROMPT').map((mod) => {
                const selId = selections[mod.id];
                const preset = selId ? mod.presets.find((p) => p.id === selId) : null;
                return (
                  <div
                    key={mod.id}
                    onClick={() => setActiveModule(mod.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '7px 10px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      background: activeModule === mod.id ? 'rgba(139,92,246,0.1)' : 'transparent',
                      transition: 'background 150ms ease',
                    }}
                  >
                    <span style={{ color: preset ? 'var(--accent-primary)' : 'var(--text-muted)', flexShrink: 0 }}>
                      {mod.icon}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 0 }}>
                        {mod.label}
                      </p>
                      {preset ? (
                        <p style={{ fontSize: 11, color: 'var(--accent-neon)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {preset.name}
                        </p>
                      ) : (
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>Not selected</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            CENTER — Visual Module Selector
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--bg-base)',
        }}>
          {/* Module Tabs */}
          <div style={{
            borderBottom: '1px solid var(--border-default)',
            padding: '10px 16px',
            display: 'flex',
            gap: 4,
            overflowX: 'auto',
            flexShrink: 0,
          }}>
            {MODULES.map((mod) => (
              <button
                key={mod.id}
                className={`module-tab${activeModule === mod.id ? ' active' : ''}`}
                onClick={() => setActiveModule(mod.id)}
              >
                {mod.icon}
                {mod.label}
                {selections[mod.id] && mod.id !== 'NEGATIVE_PROMPT' && (
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    display: 'inline-block',
                    marginLeft: 2,
                  }} />
                )}
              </button>
            ))}
          </div>

          {/* Module Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
            {currentModule && (
              <div className="animate-fade-in" key={activeModule}>
                <div style={{ marginBottom: 14 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
                    {currentModule.label}
                  </h2>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {activeModule === 'NEGATIVE_PROMPT'
                      ? 'Add custom negative terms to further refine your output.'
                      : `Choose a ${currentModule.label.toLowerCase()} preset or add custom notes below.`}
                  </p>
                </div>

                {/* Preset Grid */}
                {currentModule.presets.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                    gap: 8,
                    marginBottom: 16,
                  }}>
                    {currentModule.presets.map((preset) => (
                      <PresetCard
                        key={preset.id}
                        name={preset.name}
                        description={preset.description}
                        selected={selections[activeModule] === preset.id}
                        onClick={() => togglePreset(activeModule, preset.id)}
                      />
                    ))}
                  </div>
                )}

                {/* Custom Note / Negative Input */}
                {activeModule === 'NEGATIVE_PROMPT' ? (
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
                      Additional negative terms (comma separated)
                    </label>
                    <textarea
                      className="imageos-textarea"
                      value={negCustom}
                      onChange={(e) => setNegCustom(e.target.value)}
                      placeholder="e.g. sunglasses, hat, beard, smiling..."
                      rows={4}
                    />
                  </div>
                ) : (
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
                      Custom note for {currentModule.label} (optional)
                    </label>
                    <textarea
                      className="imageos-textarea"
                      value={customNotes[activeModule] ?? ''}
                      onChange={(e) =>
                        setCustomNotes((prev) => ({ ...prev, [activeModule]: e.target.value }))
                      }
                      placeholder={`e.g. "knee-length", "unbuttoned", "with hood up"...`}
                      rows={3}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            RIGHT PANEL — Prompt Output
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <aside style={{
          borderLeft: '1px solid var(--border-default)',
          background: 'var(--bg-surface)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid var(--border-default)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700 }}>Prompt Output</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  Updates in real-time as you select
                </p>
              </div>
              {positivePrompt && (
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#22C55E',
                  boxShadow: '0 0 8px rgba(34,197,94,0.6)',
                  animation: 'pulse-glow 2s ease-in-out infinite',
                }} />
              )}
            </div>
          </div>

          {/* Prompt boxes */}
          <div style={{ padding: 14, flex: 1 }}>
            <PromptOutput
              positivePrompt={positivePrompt}
              negativePrompt={negativePrompt}
            />
          </div>

          {/* Status info */}
          <div style={{
            padding: '12px 14px',
            borderTop: '1px solid var(--border-default)',
            flexShrink: 0,
          }}>
            {!referenceFile && (
              <div className="badge-info" style={{ width: '100%', justifyContent: 'flex-start', marginBottom: 8 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Upload a reference image to activate Identity Lock
              </div>
            )}
            <div style={{
              display: 'flex',
              gap: 6,
              fontSize: 11,
              color: 'var(--text-muted)',
            }}>
              <span>V1 — Local Mode</span>
              <span>·</span>
              <span>{selectionCount} modules</span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
