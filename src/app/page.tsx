'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Desk, Chair, Accessory, WorkspaceSelection, SavedPkg } from '@/types';
import WorkspaceCanvas from '@/components/WorkspaceCanvas';
import SelectorPanel from '@/components/SelectorPanel';
import CheckoutModal from '@/components/CheckoutModal';
import PackagesPanel from '@/components/PackagesPanel';
import { DESKS, CHAIRS, ACCESSORIES, PACKAGE_PRESETS } from '@/data/products';

const INITIAL: WorkspaceSelection = { desk: null, chair: null, accessories: {} };
const QTY_OPTIONS = [1, 3, 5, 10] as const;
type Qty = (typeof QTY_OPTIONS)[number];

const idr = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

function computeTotal(s: WorkspaceSelection) {
  let t = 0;
  if (s.desk) t += s.desk.price;
  if (s.chair) t += s.chair.price;
  for (const { item, quantity } of Object.values(s.accessories)) t += item.price * quantity;
  return t;
}

const STORAGE_KEY = 'monis_saved_packages';

export default function Page() {
  const [selection, setSelection] = useState<WorkspaceSelection>(INITIAL);
  const [qty, setQty] = useState<Qty>(1);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showPackages, setShowPackages] = useState(false);
  const [savedPackages, setSavedPackages] = useState<SavedPkg[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');

  const total = useMemo(() => computeTotal(selection), [selection]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSavedPackages(JSON.parse(raw));
    } catch {}
  }, []);

  const persistSaved = (pkgs: SavedPkg[]) => {
    setSavedPackages(pkgs);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pkgs)); } catch {}
  };

  const handleDeskChange = (desk: Desk) => setSelection(prev => ({ ...prev, desk }));
  const handleChairChange = (chair: Chair) => setSelection(prev => ({ ...prev, chair }));
  const handleAccessoryChange = (accessory: Accessory, delta: number) => {
    setSelection(prev => {
      const cur = prev.accessories[accessory.id]?.quantity ?? 0;
      const next = Math.min(Math.max(cur + delta, 0), accessory.maxQuantity);
      if (next === 0) {
        const { [accessory.id]: _, ...rest } = prev.accessories;
        return { ...prev, accessories: rest };
      }
      return { ...prev, accessories: { ...prev.accessories, [accessory.id]: { item: accessory, quantity: next } } };
    });
  };

  const applyPreset = useCallback((presetId: string) => {
    const preset = PACKAGE_PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    const desk = DESKS.find(d => d.id === preset.deskId) ?? null;
    const chair = CHAIRS.find(c => c.id === preset.chairId) ?? null;
    const accessories: WorkspaceSelection['accessories'] = {};
    for (const [id, q] of Object.entries(preset.accessories)) {
      const acc = ACCESSORIES.find(a => a.id === id);
      if (acc) accessories[id] = { item: acc, quantity: q };
    }
    setSelection({ desk, chair, accessories });
  }, []);

  const handleSave = () => {
    const name = saveName.trim() ||
      `Setup ${new Date().toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}`;
    const pkg: SavedPkg = { id: crypto.randomUUID(), name, createdAt: Date.now(), selection, total };
    persistSaved([pkg, ...savedPackages]);
    setSaveDialogOpen(false);
    setSaveName('');
    setShowPackages(true);
  };

  const handleDeletePkg = (id: string) => persistSaved(savedPackages.filter(p => p.id !== id));
  const handleLoadPkg = (pkg: SavedPkg) => { setSelection(pkg.selection); setShowPackages(false); };

  const canCheckout = selection.desk !== null || selection.chair !== null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#09090b', color: '#f2f2f7' }}>

      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 52, borderBottom: '1px solid #1f1f22',
        background: '#0d0d10', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: '#4ade80',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 900, color: '#09090b', letterSpacing: '-0.02em',
          }}>M</div>
          <div>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#f2f2f7', letterSpacing: '-0.01em' }}>monis.rent</span>
            <span style={{ fontSize: 11, color: '#52525b', marginLeft: 8 }}>Workspace Studio</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {total > 0 && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
              {qty > 1 && <span style={{ fontSize: 10, color: '#52525b' }}>{qty}× ·&nbsp;</span>}
              <span style={{ fontSize: 13, fontWeight: 700, color: '#4ade80' }}>{idr(total * qty)}</span>
              <span style={{ fontSize: 10, color: '#52525b' }}>/mo</span>
            </div>
          )}
          <button
            onClick={() => setShowPackages(p => !p)}
            style={{
              padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: showPackages ? 'rgba(74,222,128,0.1)' : '#1c1c1f',
              color: showPackages ? '#4ade80' : '#a1a1aa',
              border: `1px solid ${showPackages ? 'rgba(74,222,128,0.25)' : '#2c2c2f'}`,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            Packages{savedPackages.length > 0 ? ` (${savedPackages.length})` : ''}
          </button>
          <button
            onClick={() => setShowCheckout(true)}
            disabled={!canCheckout}
            style={{
              padding: '6px 16px', borderRadius: 8,
              background: canCheckout ? '#4ade80' : '#1c1c1f',
              color: canCheckout ? '#09090b' : '#3f3f46',
              border: 'none', cursor: canCheckout ? 'pointer' : 'not-allowed',
              fontSize: 12, fontWeight: 700, letterSpacing: '0.01em',
              transition: 'all 0.15s',
            }}
          >
            Rent Setup →
          </button>
        </div>
      </header>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left: Selector */}
        <aside style={{
          width: 272, flexShrink: 0, borderRight: '1px solid #1f1f22',
          background: '#0d0d10', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}>
          <SelectorPanel
            selection={selection}
            onDeskChange={handleDeskChange}
            onChairChange={handleChairChange}
            onAccessoryChange={handleAccessoryChange}
          />
        </aside>

        {/* Center: Canvas + bottom */}
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 16, gap: 12 }}>

          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#52525b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Live Preview
              </span>
              {qty > 1 && (
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                  background: 'rgba(74,222,128,0.08)', color: '#4ade80',
                  border: '1px solid rgba(74,222,128,0.2)', letterSpacing: '0.06em',
                }}>
                  ×{qty} WORKSPACES
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 10, color: '#52525b', marginRight: 2 }}>Desks:</span>
              {QTY_OPTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => setQty(q)}
                  style={{
                    width: 32, height: 24, borderRadius: 6,
                    background: qty === q ? '#4ade80' : '#1c1c1f',
                    color: qty === q ? '#09090b' : '#71717a',
                    border: `1px solid ${qty === q ? '#4ade80' : '#2c2c2f'}`,
                    fontSize: 11, fontWeight: qty === q ? 800 : 500,
                    cursor: 'pointer', transition: 'all 0.12s',
                  }}
                >
                  {q === 10 ? '10+' : q}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div style={{ flex: 1, minHeight: 0, borderRadius: 14, overflow: 'hidden', border: '1px solid #1f1f22' }}>
            <WorkspaceCanvas selection={selection} qty={qty} />
          </div>

          {/* Bottom bar */}
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, minHeight: 34 }}>
            {(selection.desk || selection.chair) ? (
              <div style={{ flex: 1, display: 'flex', gap: 5, overflow: 'hidden', flexWrap: 'nowrap' }}>
                {selection.desk && (
                  <InfoChip label={selection.desk.name} sub="desk" color={selection.desk.surfaceColor} />
                )}
                {selection.chair && (
                  <InfoChip label={selection.chair.name} sub="chair" color={selection.chair.seatColor} />
                )}
                {Object.values(selection.accessories).map(({ item, quantity }) => (
                  <InfoChip key={item.id} label={item.name} sub={`×${quantity}`} color="#4ade80" />
                ))}
              </div>
            ) : (
              <p style={{ flex: 1, fontSize: 11, color: '#3f3f46', fontStyle: 'italic' }}>
                ← Select a desk to start
              </p>
            )}

            {canCheckout && (
              saveDialogOpen ? (
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                  <input
                    autoFocus
                    value={saveName}
                    onChange={e => setSaveName(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSave();
                      if (e.key === 'Escape') { setSaveDialogOpen(false); setSaveName(''); }
                    }}
                    placeholder="Name this package…"
                    style={{
                      height: 30, padding: '0 10px', borderRadius: 8, width: 160,
                      background: '#1c1c1f', border: '1px solid #3f3f46',
                      color: '#f2f2f7', fontSize: 11, outline: 'none',
                    }}
                  />
                  <button onClick={handleSave} style={{
                    padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700,
                    background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)',
                    color: '#4ade80', cursor: 'pointer',
                  }}>Save</button>
                  <button onClick={() => { setSaveDialogOpen(false); setSaveName(''); }} style={{
                    width: 28, height: 28, borderRadius: 8, fontSize: 12,
                    background: '#1c1c1f', border: '1px solid #2c2c2f',
                    color: '#52525b', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>✕</button>
                </div>
              ) : (
                <button
                  onClick={() => setSaveDialogOpen(true)}
                  style={{
                    padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                    background: '#1c1c1f', border: '1px solid #2c2c2f',
                    color: '#71717a', cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                  }}
                >
                  Save Package
                </button>
              )
            )}
          </div>
        </main>

        {/* Right: Packages Panel */}
        {showPackages && (
          <aside style={{
            width: 264, flexShrink: 0, borderLeft: '1px solid #1f1f22',
            background: '#0d0d10', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          }}>
            <PackagesPanel
              savedPackages={savedPackages}
              onApplyPreset={applyPreset}
              onLoadPkg={handleLoadPkg}
              onDeletePkg={handleDeletePkg}
            />
          </aside>
        )}
      </div>

      {showCheckout && (
        <CheckoutModal
          selection={selection}
          total={total}
          qty={qty}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}

function InfoChip({ label, sub, color }: { label: string; sub: string; color: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 8, flexShrink: 0,
      background: '#111113', border: '1px solid #1f1f22',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 11, fontWeight: 600, color: '#a1a1aa' }}>{label}</span>
      <span style={{ fontSize: 10, color: '#52525b' }}>{sub}</span>
    </div>
  );
}
