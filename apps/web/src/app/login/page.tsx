'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { signIn, signUp } from '@/lib/auth-client';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await signIn.email({ email, password }, {
          onSuccess: () => router.push('/'),
          onError: (ctx) => setError(ctx.error.message),
        });
      } else {
        await signUp.email({ email, password, name }, {
          onSuccess: () => router.push('/'),
          onError: (ctx) => setError(ctx.error.message),
        });
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    await signIn.social({ provider: 'google', callbackURL: '/' });
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(135deg, #0A0A0F 0%, #0F0F1A 50%, #0A0A0F 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: "'Manrope', sans-serif",
    }}>
      {/* Background glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 60%)',
      }} />

      <div style={{
        width: '100%',
        maxWidth: 400,
        background: 'rgba(16,16,28,0.95)',
        border: '1px solid rgba(99,102,241,0.15)',
        borderRadius: 20,
        padding: '40px 36px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            borderRadius: 12,
            marginBottom: 16,
            boxShadow: '0 8px 24px rgba(99,102,241,0.3)',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#F8FAFC', margin: 0 }}>
            ImageOS
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(148,163,184,0.7)', marginTop: 4 }}>
            {mode === 'login' ? 'Hisobingizga kiring' : 'Yangi hisob yarating'}
          </p>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogle}
          disabled={loading}
          style={{
            width: '100%',
            padding: '11px 16px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 10,
            color: '#F8FAFC',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            transition: 'all 0.2s',
            marginBottom: 24,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.09)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          {/* Google Icon */}
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.4 5.6-5 7.3v6h8.1c4.8-4.4 7.2-10.9 7.2-17.4z"/>
            <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.8-5.8l-8.1-6c-2.1 1.4-4.8 2.2-7.7 2.2-5.9 0-10.9-4-12.7-9.3H3v6.2C6.9 42.9 14.9 48 24 48z"/>
            <path fill="#FBBC05" d="M11.3 29.1c-.5-1.4-.8-2.9-.8-4.5s.3-3.1.8-4.5v-6.2H3C1.1 17.5 0 20.6 0 24s1.1 6.5 3 9.1l8.3-6z"/>
            <path fill="#EA4335" d="M24 9.5c3.3 0 6.3 1.1 8.6 3.4l6.4-6.4C34.9 2.8 29.5.5 24 .5 14.9.5 6.9 5.6 3 13.9l8.3 6.2c1.8-5.4 6.8-9.3 12.7-9.3v-.3z"/>
          </svg>
          Google orqali kirish
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
          <span style={{ fontSize: 12, color: 'rgba(148,163,184,0.5)' }}>yoki</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: 'rgba(148,163,184,0.8)', display: 'block', marginBottom: 6 }}>
                Ism
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ismingiz"
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8,
                  color: '#F8FAFC',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'rgba(148,163,184,0.8)', display: 'block', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 8,
                color: '#F8FAFC',
                fontSize: 14,
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>

          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: 'rgba(148,163,184,0.8)', display: 'block', marginBottom: 6 }}>
              Parol
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%',
                  padding: '10px 42px 10px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8,
                  color: '#F8FAFC',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
                style={{
                  position: 'absolute',
                  right: 6,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  padding: 8,
                  cursor: 'pointer',
                  color: 'rgba(148,163,184,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#F8FAFC'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(148,163,184,0.7)'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{
              padding: '8px 12px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8,
              color: '#F87171',
              fontSize: 13,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              color: '#FFF',
              border: 'none',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
              marginTop: 4,
            }}
          >
            {loading ? 'Yuklanmoqda...' : mode === 'login' ? 'Kirish' : "Ro'yxatdan o'tish"}
          </button>
        </form>

        {/* Toggle mode */}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'rgba(148,163,184,0.6)' }}>
          {mode === 'login' ? "Hisobingiz yo'qmi? " : 'Hisobingiz bormi? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            style={{
              background: 'none',
              border: 'none',
              color: '#818CF8',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              padding: 0,
            }}
          >
            {mode === 'login' ? "Ro'yxatdan o'ting" : 'Kirish'}
          </button>
        </p>
      </div>
    </div>
  );
}
