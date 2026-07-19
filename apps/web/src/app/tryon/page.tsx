'use client';

import { useState } from 'react';
import { ReferenceImageUpload } from '@/components/ReferenceImageUpload';
import { API_BASE } from '@/lib/api';

export default function TryonPage() {
  const [humanFile, setHumanFile] = useState<File | null>(null);
  const [garmentFile, setGarmentFile] = useState<File | null>(null);
  const [humanPreview, setHumanPreview] = useState<string | null>(null);
  const [garmentPreview, setGarmentPreview] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [clothType, setClothType] = useState('upper'); // 'upper', 'lower', 'dresses'

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleTryOn = async () => {
    if (!humanFile || !garmentFile) return;
    
    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const humanBase64 = await toBase64(humanFile);
      const garmentBase64 = await toBase64(garmentFile);

      const res = await fetch(`${API_BASE}/tryon/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          humanImageBase64: humanBase64,
          garmentImageBase64: garmentBase64,
          mimeType: humanFile.type,
          clothType,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'API request failed');
      }

      const data = await res.json();
      if (data.imageUrl) {
        setResultImage(data.imageUrl);
      } else {
        throw new Error('No image returned from the AI model');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'var(--bg-default)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-inter)',
    }}>
      <header style={{
        height: 56,
        borderBottom: '1px solid var(--border-default)',
        background: 'var(--bg-surface)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <a href="/" style={{ color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Back</span>
          </a>
          <h1 style={{ fontSize: 16, fontWeight: 600, margin: 0, paddingLeft: 12, borderLeft: '1px solid var(--border-default)' }}>
            Virtual Try-On <span style={{ fontSize: 10, background: 'var(--bg-elevated)', padding: '2px 6px', borderRadius: 4, marginLeft: 8 }}>IDM-VTON</span>
          </h1>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
        <div className="tryon-grid">
          
          {/* Left: Inputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>1. Upload Person Image</h2>
              <ReferenceImageUpload 
                onUpload={(file, url) => { setHumanFile(file); setHumanPreview(url); }}
                title="Drop person image here"
                subtitle="Clear front-facing photo of a person"
              />
            </div>

            <div>
              <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>2. Upload Garment Image</h2>
              <ReferenceImageUpload 
                onUpload={(file, url) => { setGarmentFile(file); setGarmentPreview(url); }}
                title="Drop clothing image here"
                subtitle="Clear image of the clothing item (flat lay or on mannequin)"
              />
            </div>

            <div>
              <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>3. Select Cloth Type</h2>
              <div style={{ display: 'flex', gap: 12 }}>
                {['upper', 'lower', 'dresses'].map(type => (
                  <button
                    key={type}
                    onClick={() => setClothType(type)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: clothType === type ? 'rgba(139,92,246,0.1)' : 'var(--bg-surface)',
                      border: `1px solid ${clothType === type ? '#8B5CF6' : 'var(--border-default)'}`,
                      color: clothType === type ? '#8B5CF6' : 'var(--text-secondary)',
                      borderRadius: 8,
                      fontWeight: 500,
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleTryOn}
              disabled={!humanFile || !garmentFile || loading}
              style={{
                background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                color: 'white',
                border: 'none',
                padding: '16px',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 600,
                cursor: (!humanFile || !garmentFile || loading) ? 'not-allowed' : 'pointer',
                opacity: (!humanFile || !garmentFile || loading) ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 16,
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"/>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Processing Try-On...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  Generate Try-On
                </>
              )}
            </button>
            {error && (
              <p style={{ color: '#F87171', fontSize: 13, background: 'rgba(248,113,113,0.1)', padding: 12, borderRadius: 8, margin: 0 }}>
                {error}
              </p>
            )}
          </div>

          {/* Right: Output */}
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-default)',
            borderRadius: 16,
            overflow: 'hidden',
            aspectRatio: '3/4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {resultImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img 
                src={resultImage} 
                alt="Try-on Result" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, color: 'var(--text-muted)' }}>
                <div className="animate-pulse" style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-elevated)' }} />
                <p style={{ fontSize: 14 }}>AI is rendering your outfit...</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
                <p style={{ fontSize: 14 }}>Result will appear here</p>
              </div>
            )}
            
            {/* Download Button overlay */}
            {resultImage && (
              <a 
                href={resultImage}
                target="_blank"
                download="tryon-result.jpg"
                style={{
                  position: 'absolute',
                  bottom: 20,
                  right: 20,
                  background: 'rgba(8,8,15,0.85)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 8,
                  color: 'white',
                  padding: '10px 16px',
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download HD
              </a>
            )}
          </div>
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
      `}} />
    </div>
  );
}
