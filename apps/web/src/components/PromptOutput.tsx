'use client';

import { useState } from 'react';

interface PromptOutputProps {
  positivePrompt: string;
  negativePrompt: string;
}

export function PromptOutput({ positivePrompt, negativePrompt }: PromptOutputProps) {
  const [copiedPos, setCopiedPos] = useState(false);
  const [copiedNeg, setCopiedNeg] = useState(false);

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
            ✦ Positive Prompt
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
            {copiedPos ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <div className="prompt-output">
          {positivePrompt || (
            <span style={{ color: 'var(--text-muted)' }}>
              Select modules to generate your prompt...
            </span>
          )}
        </div>
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
            ✦ Negative Prompt
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
            {copiedNeg ? '✓ Copied' : 'Copy'}
          </button>
        </div>
        <div className="prompt-output">
          {negativePrompt || (
            <span style={{ color: 'var(--text-muted)' }}>
              Negative prompt will appear here...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
