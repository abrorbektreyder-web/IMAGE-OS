'use client';

import { useState } from 'react';

interface PromptOutputProps {
  /** Full prompt (identity + modules) — what the Copy button copies */
  positivePrompt: string;
  /** Auto-injected identity preservation block */
  identityPrompt: string;
  /** User-selected module chunks only */
  modulePrompt: string;
  negativePrompt: string;
}

export function PromptOutput({
  positivePrompt,
  identityPrompt,
  modulePrompt,
  negativePrompt,
}: PromptOutputProps) {
  const [copiedPos, setCopiedPos] = useState(false);
  const [copiedNeg, setCopiedNeg] = useState(false);
  const [identityOpen, setIdentityOpen] = useState(false);

  const copy = async (text: string, which: 'pos' | 'neg') => {
    await navigator.clipboard.writeText(text);
    if (which === 'pos') {
      setCopiedPos(true);
      setTimeout(() => setCopiedPos(false), 2000);
    } else {
      setCopiedNeg(true);
      setTimeout(() => setCopiedNeg(false), 2000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Positive Prompt */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#86EFAC', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ✦ Pozitiv prompt
          </span>
          <button
            onClick={() => copy(positivePrompt, 'pos')}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6,
              color: copiedPos ? '#86EFAC' : 'var(--text-muted)',
              fontSize: 11,
              fontWeight: 500,
              padding: '3px 10px',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            {copiedPos ? '✓ Nusxalandi' : 'Nusxalash'}
          </button>
        </div>

        {modulePrompt ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Identity Lock — the platform's core value, always embedded */}
            <div className="identity-lock-block">
              <button
                className="identity-lock-header"
                onClick={() => setIdentityOpen((v) => !v)}
                aria-expanded={identityOpen}
              >
                <span className="identity-lock-title">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Qiyofa himoyasi
                </span>
                <span className="identity-lock-meta">
                  nusxaga avto qo'shiladi
                  <svg
                    width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    style={{
                      transform: identityOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform 150ms ease',
                    }}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>
              {identityOpen && (
                <div className="identity-lock-body">{identityPrompt}</div>
              )}
            </div>

            {/* User-selected modules */}
            <div className="prompt-output">{modulePrompt}</div>
          </div>
        ) : (
          <div className="prompt-output">
            <span style={{ color: 'var(--text-muted)' }}>
              Prompt yaratish uchun modullarni tanlang...
            </span>
          </div>
        )}
      </div>

      {/* Negative Prompt */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#FCA5A5', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ✦ Negativ prompt
          </span>
          <button
            onClick={() => copy(negativePrompt, 'neg')}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6,
              color: copiedNeg ? '#86EFAC' : 'var(--text-muted)',
              fontSize: 11,
              fontWeight: 500,
              padding: '3px 10px',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            {copiedNeg ? '✓ Nusxalandi' : 'Nusxalash'}
          </button>
        </div>
        <div className="prompt-output">
          {negativePrompt || (
            <span style={{ color: 'var(--text-muted)' }}>
              Negativ prompt shu yerda chiqadi...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
