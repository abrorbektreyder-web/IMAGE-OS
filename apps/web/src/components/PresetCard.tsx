'use client';

interface PresetCardProps {
  name: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
}

export function PresetCard({ name, description, selected, onClick }: PresetCardProps) {
  return (
    <button
      className={`preset-card${selected ? ' selected' : ''}`}
      onClick={onClick}
      style={{
        width: '100%',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 13,
          fontWeight: 600,
          color: selected ? 'var(--accent-neon)' : 'var(--text-primary)',
          marginBottom: description ? 2 : 0,
          lineHeight: 1.3,
        }}>
          {name}
        </p>
        {description && (
          <p style={{
            fontSize: 11,
            color: 'var(--text-muted)',
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {description}
          </p>
        )}
      </div>

      {/* Checkmark */}
      {selected && (
        <div style={{
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: 'var(--accent-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2">
            <polyline points="2,6 5,9 10,3"/>
          </svg>
        </div>
      )}
    </button>
  );
}
