'use client';

import { useState, useMemo, useEffect } from 'react';
import type { WorkspaceDesign, SavedDesign, EnvironmentConfig } from '@/model/types';
import {
  emptyDesign, editStation, setStationCount, presetToDesign,
  designTotal, addDevice, removeDevice, addZone, removeZone,
  getDesk, getSeating, getDevice, getZone,
} from '@/model/design';
import WorkspaceCanvas from '@/components/WorkspaceCanvas';
import SelectorPanel from '@/components/SelectorPanel';
import CheckoutModal from '@/components/CheckoutModal';
import PackagesPanel from '@/components/PackagesPanel';
import EnvironmentPanel from '@/components/EnvironmentPanel';

const TEAM_OPTIONS = [1, 3, 5, 10] as const;
const STORAGE_KEY = 'monis_designs_v2';

const idr = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function Page() {
  const [design, setDesign] = useState<WorkspaceDesign>(emptyDesign);
  const [showCheckout, setShowCheckout] = useState(false);
  const [rightPanel, setRightPanel] = useState<'none' | 'packages' | 'scene'>('none');
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');

  const template = design.stations[0];
  const teamSize = design.stations.length;
  const total = useMemo(() => designTotal(design), [design]);

  const deviceCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const d of template.devices) m.set(d.deviceId, (m.get(d.deviceId) ?? 0) + 1);
    return [...m.entries()];
  }, [template]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSavedDesigns(JSON.parse(raw));
    } catch {}
  }, []);

  const persistSaved = (list: SavedDesign[]) => {
    setSavedDesigns(list);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
  };

  const handleDesk = (deskId: string) => setDesign(d => editStation(d, s => ({ ...s, deskId })));
  const handleSeating = (seatingId: string) => setDesign(d => editStation(d, s => ({ ...s, seatingId })));
  const handleDevice = (deviceId: string, delta: number) =>
    setDesign(d => editStation(d, s => (delta > 0 ? addDevice(s, deviceId) : removeDevice(s, deviceId))));
  const handlePreset = (presetId: string) => setDesign(presetToDesign(presetId));
  const handleTeamSize = (n: number) => setDesign(d => setStationCount(d, n));
  const handleReset = () => setDesign(emptyDesign());
  const handleEnv = (patch: Partial<EnvironmentConfig>) =>
    setDesign(d => ({ ...d, environment: { ...d.environment, ...patch } }));
  const handleZone = (zoneId: string, delta: number) =>
    setDesign(d => (delta > 0 ? addZone(d, zoneId) : removeZone(d, zoneId)));

  const handleSave = () => {
    const name = saveName.trim() ||
      `Setup ${new Date().toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}`;
    const sd: SavedDesign = { id: crypto.randomUUID(), name, createdAt: Date.now(), design, total };
    persistSaved([sd, ...savedDesigns]);
    setSaveDialogOpen(false);
    setSaveName('');
    setRightPanel('packages');
  };
  const handleDelete = (id: string) => persistSaved(savedDesigns.filter(s => s.id !== id));
  const handleLoad = (sd: SavedDesign) => { setDesign(sd.design); setRightPanel('none'); };

  const canCheckout = !!template.deskId || !!template.seatingId;
  const desk = getDesk(template.deskId);
  const seating = getSeating(template.seatingId);

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
              {teamSize > 1 && <span style={{ fontSize: 10, color: '#52525b' }}>{teamSize} desks ·&nbsp;</span>}
              <span style={{ fontSize: 13, fontWeight: 700, color: '#4ade80' }}>{idr(total)}</span>
              <span style={{ fontSize: 10, color: '#52525b' }}>/mo</span>
            </div>
          )}
          {canCheckout && (
            <button
              onClick={handleReset}
              style={{
                padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: '#1c1c1f', color: '#71717a', border: '1px solid #2c2c2f',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              Reset
            </button>
          )}
          <button
            onClick={() => setRightPanel(p => (p === 'scene' ? 'none' : 'scene'))}
            style={{
              padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: rightPanel === 'scene' ? 'rgba(74,222,128,0.1)' : '#1c1c1f',
              color: rightPanel === 'scene' ? '#4ade80' : '#a1a1aa',
              border: `1px solid ${rightPanel === 'scene' ? 'rgba(74,222,128,0.25)' : '#2c2c2f'}`,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            Scene
          </button>
          <button
            onClick={() => setRightPanel(p => (p === 'packages' ? 'none' : 'packages'))}
            style={{
              padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: rightPanel === 'packages' ? 'rgba(74,222,128,0.1)' : '#1c1c1f',
              color: rightPanel === 'packages' ? '#4ade80' : '#a1a1aa',
              border: `1px solid ${rightPanel === 'packages' ? 'rgba(74,222,128,0.25)' : '#2c2c2f'}`,
              cursor: 'pointer', transition: 'all 0.15s',
            }}
          >
            Packages{savedDesigns.length > 0 ? ` (${savedDesigns.length})` : ''}
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
            station={template}
            zones={design.zones}
            onDeskChange={handleDesk}
            onSeatingChange={handleSeating}
            onDeviceChange={handleDevice}
            onZoneChange={handleZone}
          />
        </aside>

        {/* Center: Canvas */}
        <main style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: 16, gap: 12 }}>

          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#52525b', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Your Studio
              </span>
              <p style={{ fontSize: 11, color: '#71717a', marginTop: 2 }}>
                {teamSize === 1 ? 'Solo workspace' : `Office for ${teamSize} — ${teamSize} identical setups`}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#52525b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Team size
              </span>
              <div style={{ display: 'flex', gap: 3, padding: 3, borderRadius: 9, background: '#1c1c1f', border: '1px solid #2c2c2f' }}>
                {TEAM_OPTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => handleTeamSize(q)}
                    style={{
                      minWidth: 38, height: 24, padding: '0 9px', borderRadius: 6,
                      background: teamSize === q ? '#4ade80' : 'transparent',
                      color: teamSize === q ? '#09090b' : '#71717a',
                      border: 'none', fontSize: 11, fontWeight: teamSize === q ? 800 : 600,
                      cursor: 'pointer', transition: 'all 0.12s',
                    }}
                  >
                    {q === 1 ? 'Solo' : q === 10 ? '10+' : q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div style={{ flex: 1, minHeight: 0, borderRadius: 14, overflow: 'hidden', border: '1px solid #1f1f22' }}>
            <WorkspaceCanvas design={design} />
          </div>

          {/* Bottom bar */}
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, minHeight: 34 }}>
            {(desk || seating || deviceCounts.length > 0 || design.zones.length > 0) ? (
              <div style={{ flex: 1, display: 'flex', gap: 5, overflow: 'hidden', flexWrap: 'nowrap' }}>
                {desk && <InfoChip label={desk.name} sub="desk" color={desk.spec.surfaceColor} />}
                {seating && <InfoChip label={seating.name} sub="chair" color={seating.spec.seatColor} />}
                {deviceCounts.map(([id, n]) => {
                  const dev = getDevice(id);
                  return dev ? <InfoChip key={id} label={dev.name} sub={`×${n}`} color={dev.spec.accentColor} /> : null;
                })}
                {design.zones.map(z => {
                  const zone = getZone(z.zoneId);
                  return zone ? <InfoChip key={z.uid} label={zone.name} sub="zone" color={zone.spec.palette[0]} /> : null;
                })}
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

        {/* Right panel */}
        {rightPanel !== 'none' && (
          <aside style={{
            width: 264, flexShrink: 0, borderLeft: '1px solid #1f1f22',
            background: '#0d0d10', overflow: 'hidden', display: 'flex', flexDirection: 'column',
          }}>
            {rightPanel === 'packages' ? (
              <PackagesPanel
                savedDesigns={savedDesigns}
                onApplyPreset={handlePreset}
                onLoad={handleLoad}
                onDelete={handleDelete}
              />
            ) : (
              <EnvironmentPanel environment={design.environment} onChange={handleEnv} />
            )}
          </aside>
        )}
      </div>

      {showCheckout && (
        <CheckoutModal design={design} onClose={() => setShowCheckout(false)} />
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
