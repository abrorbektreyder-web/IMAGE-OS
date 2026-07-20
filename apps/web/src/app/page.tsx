'use client';

import { useState, useCallback, useEffect } from 'react';
import { ReferenceImageUpload } from '@/components/ReferenceImageUpload';
import { PresetCard } from '@/components/PresetCard';
import { PromptOutput } from '@/components/PromptOutput';
import { API_BASE } from '@/lib/api';

// ============================================================
// Icon Mapping for dynamic backend categories
// ============================================================
const ICON_MAP: Record<string, React.ReactNode> = {
  shirt: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
    </svg>
  ),
  'map-pin': (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  clock: (
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
  cloud: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
    </svg>
  ),
  user: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="5" r="2"/>
      <path d="M10.5 7.5L8 17l4-2 4 2-2.5-9.5"/>
      <line x1="12" y1="15" x2="12" y2="21"/>
    </svg>
  ),
  zap: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  camera: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  negative: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
    </svg>
  )
};

// ============================================================
// Standard Negative Prompt (mirrors backend constant)
// ============================================================
const STANDARD_NEGATIVE =
  'low quality, blurry, bad anatomy, extra fingers, deformed face, wrong proportions, watermark, text, cartoon, anime, cgi, duplicate person, identity drift, plastic skin, different person, face swap, beautified face, airbrushed skin, altered facial features';

// Auto-injected identity preservation prompt — the platform's core value.
const IDENTITY_PROMPT =
  '[IDENTITY LOCK] The reference image is the sole identity source — preserve exactly the same person. ' +
  'Keep facial structure and proportions, eyes, nose, lips, jawline, skin tone and texture, ' +
  'hairstyle, hairline and hair color, age, gender, ethnicity, hands and body proportions identical. ' +
  'Never beautify, restyle, or alter anatomy; never generate a different person. ' +
  'Change only what is explicitly requested below. ' +
  'Photorealistic, natural skin detail, ultra-consistent identity.';

// ============================================================
// O'zbekcha modul nomlari (faqat UI uchun — prompt inglizcha qoladi,
// chunki AI modellari inglizcha promptni aniqroq tushunadi)
// ============================================================
const UZ_MODULE_LABELS: Record<string, string> = {
  WARDROBE: 'Kiyim',
  LOCATION: 'Makon',
  TIME_OF_DAY: 'Kun vaqti',
  WEATHER: 'Ob-havo',
  POSE: 'Poza',
  LIGHTING: "Yorug'lik",
  CAMERA: 'Kamera',
  NEGATIVE_PROMPT: 'Negativ',
};

const uzLabel = (mod: { id: string; label: string }) =>
  UZ_MODULE_LABELS[mod.id] ?? mod.label;

// ============================================================
// Main Page
// ============================================================
export default function HomePage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const [modules, setModules] = useState<any[]>([]);
  const [loadingModules, setLoadingModules] = useState(true);
  
  const [activeModule, setActiveModule] = useState('WARDROBE');
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [customNotes, setCustomNotes] = useState<Record<string, string>>({});
  const [negCustom, setNegCustom] = useState('');

  // ── Rasm generatsiyasi holati ──────────────────────────────
  const [generating, setGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [genError, setGenError] = useState('');

  // Fetch modules from API
  useEffect(() => {
    async function loadModules() {
      try {
        const res = await fetch(`${API_BASE}/knowledge/modules`);
        const data = await res.json();
        
        // Map database schema to frontend schema
        const mappedModules = data.map((mod: any) => ({
          id: mod.slug,
          label: mod.name,
          icon: ICON_MAP[mod.icon] || ICON_MAP['shirt'],
          presets: mod.presets.map((p: any) => ({
            id: p.slug,
            name: p.name,
            description: p.description,
            promptChunk: p.promptChunk
          })),
        }));

        // Append Negative Prompt virtual module
        mappedModules.push({
          id: 'NEGATIVE_PROMPT',
          label: 'Negative',
          icon: ICON_MAP['negative'],
          presets: [],
        });

        setModules(mappedModules);
      } catch (err) {
        console.error("Failed to load modules", err);
      } finally {
        setLoadingModules(false);
      }
    }
    loadModules();
  }, []);

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

  const currentModule = modules.find((m) => m.id === activeModule);

  // ── Build positive prompt ──────────────────────────────────
  const buildModulePrompt = () => {
    const parts: string[] = [];
    for (const mod of modules) {
      if (mod.id === 'NEGATIVE_PROMPT') continue;
      const selId = selections[mod.id];
      const preset = selId ? mod.presets.find((p: any) => p.id === selId) : null;
      const note = customNotes[mod.id]?.trim();
      if (preset || note) {
        let chunk = '';
        if (preset) chunk = `${mod.label}: ${preset.name}${preset.description ? ` — ${preset.description}` : ''}`;
        if (note) chunk = chunk ? `${chunk}. Note: ${note}` : `${mod.label}: ${note}`;
        parts.push(chunk);
      }
    }
    return parts.join('\n\n');
  };

  // ── Build negative prompt ──────────────────────────────────
  const buildNegative = () => {
    const base = STANDARD_NEGATIVE;
    return negCustom.trim() ? `${base}, ${negCustom.trim()}` : base;
  };

  const modulePrompt = buildModulePrompt();
  const positivePrompt = modulePrompt ? `${IDENTITY_PROMPT}\n\n${modulePrompt}` : '';
  const negativePrompt = buildNegative();
  const selectionCount = Object.values(selections).filter(Boolean).length;

  // ── File -> base64 data URI ────────────────────────────────
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // ── Rasm generatsiya qilish ────────────────────────────────
  const handleGenerate = async () => {
    if (!referenceFile || generating) return;
    setGenerating(true);
    setGenError('');
    setResultImage(null);
    try {
      const dataUri = await fileToBase64(referenceFile);
      const fullPrompt = positivePrompt
        ? `${positivePrompt}\n\n[AVOID] ${negativePrompt}`
        : `${IDENTITY_PROMPT}\n\n[AVOID] ${negativePrompt}`;

      const res = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: dataUri,
          mimeType: referenceFile.type || 'image/jpeg',
          prompt: fullPrompt,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Generatsiya amalga oshmadi.');
      }
      setResultImage(data.imageUrl);
    } catch (err: any) {
      setGenError(err?.message || 'Nomaʼlum xatolik yuz berdi.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg-base)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* ── Top Navbar ────────────────────────────────────── */}
      <header className="app-header" style={{
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
          <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.01em' }}>
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
          <span className="hide-mobile" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {selectionCount} ta modul tanlandi
          </span>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? "Yorug' rejimga o'tish" : "Tungi rejimga o'tish"}
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

          {/* User dropdown */}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setUserMenuOpen(o => !o)}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 600, color: 'white',
                cursor: 'pointer', userSelect: 'none',
              }}
            >
              U
            </div>

            {userMenuOpen && (
              <>
                {/* Backdrop */}
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                  onClick={() => setUserMenuOpen(false)}
                />
                {/* Dropdown */}
                <div style={{
                  position: 'absolute', top: 40, right: 0,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 10,
                  boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                  minWidth: 180,
                  zIndex: 100,
                  overflow: 'hidden',
                }}>
                  <a
                    href="/tryon"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 16px',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      fontSize: 13,
                      borderBottom: '1px solid var(--border-default)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 7h-3a2 2 0 0 1-2-2V2"/>
                      <path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z"/>
                      <path d="M3 15h6"/>
                      <path d="M3 18h6"/>
                    </svg>
                    Virtual kiyib ko'rish
                  </a>
                  <a
                    href="/admin/presets"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 16px',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      fontSize: 13,
                      borderBottom: '1px solid var(--border-default)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    Admin Panel
                  </a>
                  <button
                    onClick={async () => {
                      const { authClient } = await import('@/lib/auth-client');
                      await authClient.signOut();
                      window.location.href = '/login';
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 16px', width: '100%',
                      background: 'none', border: 'none',
                      color: '#F87171',
                      fontSize: 13, cursor: 'pointer',
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Chiqish
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Layout ───────────────────────────────────── */}
      <main className="app-main">

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            LEFT PANEL — Reference Image + Project Info
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <aside className="left-panel" style={{
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
              Qiyofa manbasi
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
                <span style={{ fontSize: 11, color: '#86EFAC', fontWeight: 500 }}>Qiyofa himoyasi faol</span>
              </div>
            )}
          </div>

          {/* Identity Lock Info */}
          <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-default)' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              Qiyofa himoyasi
            </p>
            <div style={{
              background: 'rgba(139,92,246,0.06)',
              border: '1px solid rgba(139,92,246,0.15)',
              borderRadius: 10,
              padding: '10px 12px',
            }}>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                🔒 Yuz tuzilishi, teri rangi, soch turmagi va tana proporsiyalari avtomatik saqlanadi — sozlash shart emas.
              </p>
            </div>
          </div>

          {/* Selection Summary */}
          <div style={{ padding: '14px 16px', flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
              Tanlanganlar
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {modules.filter((m) => m.id !== 'NEGATIVE_PROMPT').map((mod) => {
                const selId = selections[mod.id];
                const preset = selId ? mod.presets.find((p: any) => p.id === selId) : null;
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
                        {uzLabel(mod)}
                      </p>
                      {preset ? (
                        <p style={{ fontSize: 11, color: 'var(--accent-neon)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {preset.name}
                        </p>
                      ) : (
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>Tanlanmagan</p>
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
          {/* Module Tabs — wrap to new rows so every module is always visible */}
          <div className="module-tabs" style={{
            borderBottom: '1px solid var(--border-default)',
            padding: '10px 16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            flexShrink: 0,
          }}>
            {modules.map((mod) => (
              <button
                key={mod.id}
                className={`module-tab${activeModule === mod.id ? ' active' : ''}`}
                onClick={() => setActiveModule(mod.id)}
              >
                {mod.icon}
                {uzLabel(mod)}
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
                    {uzLabel(currentModule)}
                  </h2>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {activeModule === 'NEGATIVE_PROMPT'
                      ? "Natijani aniqlashtirish uchun qo'shimcha negativ so'zlar kiriting."
                      : "Tayyor variantni tanlang yoki quyida o'z izohingizni yozing."}
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
                    {currentModule.presets.map((preset: any) => (
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
                      Qo'shimcha negativ so'zlar (vergul bilan, inglizcha)
                    </label>
                    <textarea
                      className="imageos-textarea"
                      value={negCustom}
                      onChange={(e) => setNegCustom(e.target.value)}
                      placeholder="masalan: sunglasses, hat, beard, smiling..."
                      rows={4}
                    />
                  </div>
                ) : (
                  <div>
                    <label style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>
                      {uzLabel(currentModule)} uchun qo'shimcha izoh (ixtiyoriy, inglizcha)
                    </label>
                    <textarea
                      className="imageos-textarea"
                      value={customNotes[activeModule] ?? ''}
                      onChange={(e) =>
                        setCustomNotes((prev) => ({ ...prev, [activeModule]: e.target.value }))
                      }
                      placeholder={`masalan: "knee-length", "unbuttoned", "with hood up"...`}
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
        <aside className="right-panel" style={{
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
                <p style={{ fontSize: 13, fontWeight: 700 }}>Prompt natijasi</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                  Tanlovingizga qarab real vaqtda yangilanadi
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
              identityPrompt={IDENTITY_PROMPT}
              modulePrompt={modulePrompt}
              negativePrompt={negativePrompt}
            />
          </div>

          {/* Action / Generate */}
          <div style={{
            padding: '16px 16px',
            borderTop: '1px solid var(--border-default)',
            flexShrink: 0,
            background: 'var(--bg-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}>
            {!referenceFile && (
              <div className="badge-info" style={{ width: '100%', justifyContent: 'flex-start' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Generatsiyani faollashtirish uchun namuna rasm yuklang
              </div>
            )}
            
            {genError && (
              <div style={{
                padding: '8px 12px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 8,
                color: '#F87171',
                fontSize: 12,
                lineHeight: 1.5,
              }}>
                {genError}
              </div>
            )}

            <button
              disabled={!referenceFile || generating}
              style={{
                background: referenceFile ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : 'var(--bg-surface)',
                color: referenceFile ? '#FFF' : 'var(--text-muted)',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: 14,
                border: referenceFile ? 'none' : '1px solid var(--border-default)',
                cursor: !referenceFile || generating ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.2s',
                opacity: referenceFile ? (generating ? 0.8 : 1) : 0.6,
                boxShadow: referenceFile ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
              }}
              onClick={handleGenerate}
              onMouseEnter={(e) => {
                if(referenceFile && !generating) e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                if(referenceFile) e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {generating ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Yaratilmoqda...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  Rasm yaratish
                </>
              )}
            </button>

            <div style={{
              display: 'flex',
              gap: 6,
              fontSize: 11,
              color: 'var(--text-muted)',
              justifyContent: 'space-between',
            }}>
              <span>ImageOS · V1</span>
              <span>{selectionCount} ta modul tanlandi</span>
            </div>
          </div>
        </aside>
      </main>

      {/* ── Natija modali ─────────────────────────────────── */}
      {resultImage && (
        <div
          onClick={() => setResultImage(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: 16,
              padding: 20,
              maxWidth: 560,
              width: '100%',
              maxHeight: '90dvh',
              overflowY: 'auto',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <p style={{ fontSize: 15, fontWeight: 700 }}>✨ Tayyor rasm</p>
              <button
                onClick={() => setResultImage(null)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', fontSize: 22, lineHeight: 1, padding: 0,
                }}
              >
                ×
              </button>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resultImage}
              alt="Generatsiya natijasi"
              style={{ width: '100%', borderRadius: 12, display: 'block' }}
            />

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <a
                href={resultImage}
                download={`imageos-${Date.now()}.png`}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  color: '#FFF',
                  padding: '11px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Yuklab olish
              </a>
              <button
                onClick={() => { setResultImage(null); handleGenerate(); }}
                disabled={generating}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                  padding: '11px 16px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: generating ? 'not-allowed' : 'pointer',
                }}
              >
                Qayta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
