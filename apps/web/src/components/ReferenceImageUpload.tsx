'use client';

import { useRef, useState } from 'react';

interface ReferenceImageUploadProps {
  onUpload: (file: File, previewUrl: string) => void;
}

export function ReferenceImageUpload({ onUpload }: ReferenceImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onUpload(file, url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`upload-area${preview ? ' has-image' : ''}${dragging ? ' dragging' : ''}`}
      style={{ minHeight: preview ? 200 : 160 }}
      onClick={() => !preview && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {preview ? (
        <div style={{ position: 'relative', width: '100%' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Reference"
            style={{
              width: '100%',
              height: 220,
              objectFit: 'cover',
              borderRadius: 12,
              display: 'block',
            }}
          />
          {/* Change button overlay */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              background: 'rgba(8,8,15,0.85)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              color: '#A1A1C7',
              fontSize: 12,
              fontWeight: 500,
              padding: '5px 12px',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
          >
            Change
          </button>
        </div>
      ) : (
        <>
          {/* Upload Icon */}
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(139,92,246,0.7)" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17,8 12,3 7,8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500 }}>
            Drop reference image here
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 11 }}>
            or click to browse — JPG, PNG, WEBP
          </p>
        </>
      )}
    </div>
  );
}
