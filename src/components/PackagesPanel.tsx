'use client';

import { useMemo } from 'react';
import type { SavedDesign } from '@/model/types';
import { PRESETS } from '@/data/catalog';
import { presetToDesign, designTotal } from '@/model/design';

interface Props {
  savedDesigns: SavedDesign[];
  onApplyPreset: (presetId: string) => void;
  onLoad: (design: SavedDesign) => void;
  onDelete: (id: string) => void;
}

const idr = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function PackagesPanel({ savedDesigns, onApplyPreset, onLoad, onDelete }: Props) {
  const presetTotals = useMemo(
    () => Object.fromEntries(PRESETS.map(p => [p.id, designTotal(presetToDesign(p.id))])),
    [],
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>

      {/* Header */}
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #1f1f22', flexShrink: 0 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#52525b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>
          Packages
        </p>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#f2f2f7' }}>Quick start</h2>
      </div>

      {/* Presets */}
      <div style={{ padding: '14px 16px' }}>
        <p style={{ fontSize: 9, fontWeight: 700, color: '#52525b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
          Presets
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {PRESETS.map(preset => (
            <div key={preset.id} style={{ background: '#111113', border: '1px solid #1f1f22', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: preset.color, boxShadow: `0 0 6px ${preset.color}80` }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#f2f2f7' }}>{preset.name}</span>
                </div>
                <span style={{
                  fontSize: 8, fontWeight: 800, letterSpacing: '0.08em', padding: '2px 6px', borderRadius: 6,
                  background: `${preset.color}1a`, color: preset.color,
                }}>
                  {preset.badge}
                </span>
              </div>
              <p style={{ fontSize: 10, color: '#71717a', marginBottom: 8, lineHeight: 1.4 }}>{preset.tagline}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: preset.color }}>
                  {idr(presetTotals[preset.id] ?? 0)}
                  <span style={{ fontSize: 9, fontWeight: 400, color: '#52525b' }}>/mo</span>
                </span>
                <button
                  onClick={() => onApplyPreset(preset.id)}
                  style={{
                    padding: '4px 10px', borderRadius: 7, fontSize: 10, fontWeight: 700,
                    background: `${preset.color}1a`, border: `1px solid ${preset.color}40`,
                    color: preset.color, cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  Apply →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ height: 1, margin: '0 16px', background: '#1f1f22' }} />

      {/* Saved designs */}
      <div style={{ padding: '14px 16px', flex: 1 }}>
        <p style={{ fontSize: 9, fontWeight: 700, color: '#52525b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
          Saved ({savedDesigns.length})
        </p>

        {savedDesigns.length === 0 ? (
          <div style={{ padding: '20px 0', textAlign: 'center' }}>
            <p style={{ fontSize: 11, color: '#3f3f46', fontStyle: 'italic' }}>No saved packages yet.</p>
            <p style={{ fontSize: 10, color: '#2c2c2f', marginTop: 4 }}>
              Build a setup and click &ldquo;Save Package&rdquo;
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {savedDesigns.map(sd => (
              <div key={sd.id} style={{
                background: '#111113', border: '1px solid #1f1f22', borderRadius: 10, padding: '9px 12px',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: '#d4d4d8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {sd.name}
                  </p>
                  <p style={{ fontSize: 9, color: '#52525b', marginTop: 1 }}>
                    {idr(sd.total)}/mo · {new Date(sd.createdAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => onLoad(sd)}
                  style={{
                    padding: '4px 8px', borderRadius: 6, fontSize: 9, fontWeight: 700,
                    background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)',
                    color: '#4ade80', cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  Load
                </button>
                <button
                  onClick={() => onDelete(sd.id)}
                  style={{
                    width: 22, height: 22, borderRadius: 6,
                    background: 'transparent', border: '1px solid #2c2c2f',
                    color: '#3f3f46', cursor: 'pointer', fontSize: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}
                >×</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
