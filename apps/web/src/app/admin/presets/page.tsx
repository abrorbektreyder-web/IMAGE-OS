'use client';

import { useState, useEffect } from 'react';

type Preset = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  promptChunk: string;
  isActive: boolean;
  sortOrder: number;
  category: { name: string; slug: string };
};

type Category = {
  id: string;
  name: string;
  slug: string;
};

const API = 'http://localhost:3001/api/v1';

export default function AdminPresetsPage() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [selected, setSelected] = useState<Preset | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('ALL');

  // Form state
  const [form, setForm] = useState({
    categoryId: '',
    slug: '',
    name: '',
    description: '',
    promptChunk: '',
    isActive: true,
    sortOrder: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [presetsRes, catsRes] = await Promise.all([
      fetch(`${API}/knowledge/presets`),
      fetch(`${API}/knowledge/categories`),
    ]);
    setPresets(await presetsRes.json());
    setCategories(await catsRes.json());
    setLoading(false);
  }

  function openAdd() {
    setForm({ categoryId: categories[0]?.id || '', slug: '', name: '', description: '', promptChunk: '', isActive: true, sortOrder: 0 });
    setModal('add');
  }

  function openEdit(p: Preset) {
    setSelected(p);
    setForm({
      categoryId: categories.find(c => c.slug === p.category.slug)?.id || '',
      slug: p.slug,
      name: p.name,
      description: p.description || '',
      promptChunk: p.promptChunk,
      isActive: p.isActive,
      sortOrder: p.sortOrder,
    });
    setModal('edit');
  }

  async function handleSave() {
    const url = modal === 'add'
      ? `${API}/knowledge/presets`
      : `${API}/knowledge/presets/${selected!.id}`;
    const method = modal === 'add' ? 'POST' : 'PATCH';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setModal(null);
    loadData();
  }

  async function handleDelete() {
    if (!deleteId) return;
    await fetch(`${API}/knowledge/presets/${deleteId}`, { method: 'DELETE' });
    setDeleteId(null);
    loadData();
  }

  const filtered = presets.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'ALL' || p.category.slug === filterCat;
    return matchSearch && matchCat;
  });

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: 6,
    fontSize: 14,
    color: '#111827',
    outline: 'none',
    background: '#FFF',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>Presets</h1>
          <p style={{ fontSize: 14, color: '#6B7280', margin: '4px 0 0' }}>
            {presets.length} ta preset boshqarilmoqda
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 18px',
            background: '#111827',
            color: '#FFF',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Yangi Preset
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Qidirish..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, maxWidth: 240 }}
        />
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          style={{ ...inputStyle, maxWidth: 180 }}
        >
          <option value="ALL">Barcha kategoriyalar</option>
          {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{
        background: '#FFF',
        border: '1px solid #E5E7EB',
        borderRadius: 12,
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              {['Nomi', 'Kategoriya', 'Slug', 'Holat', 'Tartib', ''].map(h => (
                <th key={h} style={{
                  padding: '10px 16px',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: '#374151',
                  fontSize: 12,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#9CA3AF' }}>Yuklanmoqda...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#9CA3AF' }}>Hech narsa topilmadi</td></tr>
            ) : filtered.map((p, i) => (
              <tr key={p.id} style={{
                borderBottom: i < filtered.length - 1 ? '1px solid #F3F4F6' : 'none',
                transition: 'background 0.1s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F9FAFB')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#111827' }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{p.description?.slice(0, 40)}</div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    display: 'inline-flex',
                    padding: '2px 8px',
                    background: '#F3F4F6',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 500,
                    color: '#374151',
                  }}>{p.category.name}</span>
                </td>
                <td style={{ padding: '12px 16px', color: '#6B7280', fontFamily: 'monospace', fontSize: 12 }}>{p.slug}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '2px 8px',
                    background: p.isActive ? '#DCFCE7' : '#FEE2E2',
                    color: p.isActive ? '#166534' : '#991B1B',
                    borderRadius: 100,
                    fontSize: 12,
                    fontWeight: 500,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.isActive ? '#22C55E' : '#EF4444' }} />
                    {p.isActive ? 'Faol' : "Nofaol"}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#6B7280' }}>{p.sortOrder}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => openEdit(p)}
                      style={{
                        padding: '5px 12px',
                        border: '1px solid #D1D5DB',
                        borderRadius: 6,
                        background: '#FFF',
                        cursor: 'pointer',
                        fontSize: 12,
                        color: '#374151',
                        fontWeight: 500,
                      }}
                    >Tahrirlash</button>
                    <button
                      onClick={() => setDeleteId(p.id)}
                      style={{
                        padding: '5px 12px',
                        border: '1px solid #FECACA',
                        borderRadius: 6,
                        background: '#FFF5F5',
                        cursor: 'pointer',
                        fontSize: 12,
                        color: '#DC2626',
                        fontWeight: 500,
                      }}
                    >O'chirish</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}>
          <div style={{
            background: '#FFF',
            borderRadius: 16,
            padding: 32,
            width: '100%',
            maxWidth: 520,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 24px' }}>
              {modal === 'add' ? 'Yangi Preset' : "Presetni tahrirlash"}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Kategoriya</label>
                <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))} style={inputStyle}>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Nomi</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="Preset nomi" />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Slug</label>
                  <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} style={inputStyle} placeholder="w1, l2..." />
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Tavsif</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={inputStyle} placeholder="Qisqa tavsif" />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Prompt Chunk</label>
                <textarea
                  value={form.promptChunk}
                  onChange={e => setForm(f => ({ ...f, promptChunk: e.target.value }))}
                  rows={3}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="AI uchun vizual tavsif..."
                />
              </div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Tartib raqami</label>
                  <input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: Number(e.target.value) }))} style={{ ...inputStyle, width: 80 }} />
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 16 }}>
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                  <span style={{ fontSize: 14, color: '#374151' }}>Faol</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 28, justifyContent: 'flex-end' }}>
              <button onClick={() => setModal(null)} style={{
                padding: '9px 20px', border: '1px solid #D1D5DB', borderRadius: 8,
                background: '#FFF', cursor: 'pointer', fontSize: 14, color: '#374151', fontWeight: 500,
              }}>Bekor qilish</button>
              <button onClick={handleSave} style={{
                padding: '9px 20px', border: 'none', borderRadius: 8,
                background: '#111827', color: '#FFF', cursor: 'pointer', fontSize: 14, fontWeight: 600,
              }}>Saqlash</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}>
          <div style={{
            background: '#FFF', borderRadius: 16, padding: 32, maxWidth: 400, width: '100%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{
              width: 48, height: 48,
              background: '#FEE2E2', borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
              </svg>
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>Presetni o'chirish</h3>
            <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 24px' }}>Bu amalni ortga qaytarib bo'lmaydi. Rostdan ham o'chirmoqchimisiz?</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteId(null)} style={{
                padding: '9px 20px', border: '1px solid #D1D5DB', borderRadius: 8,
                background: '#FFF', cursor: 'pointer', fontSize: 14, color: '#374151', fontWeight: 500,
              }}>Bekor qilish</button>
              <button onClick={handleDelete} style={{
                padding: '9px 20px', border: 'none', borderRadius: 8,
                background: '#DC2626', color: '#FFF', cursor: 'pointer', fontSize: 14, fontWeight: 600,
              }}>Ha, o'chir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
