'use client';

import type { Desk, Chair, Accessory, WorkspaceSelection } from '@/types';
import { DESKS, CHAIRS, ACCESSORIES } from '@/data/products';

interface Props {
  selection: WorkspaceSelection;
  onDeskChange: (desk: Desk) => void;
  onChairChange: (chair: Chair) => void;
  onAccessoryChange: (accessory: Accessory, delta: number) => void;
}

const idr = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  display:  { label: 'Displays',  icon: '🖥' },
  lighting: { label: 'Lighting',  icon: '💡' },
  nature:   { label: 'Nature',    icon: '🌿' },
  tech:     { label: 'Tech',      icon: '⚡' },
};

const DESK_ICONS: Record<string, string> = {
  minimal:  '▭',
  lshaped:  '⌐',
  standing: '↕',
};

const CHAIR_ICONS: Record<string, string> = {
  mesh:     '⠿',
  leather:  '◼',
  ergonomic:'◕',
};

export default function SelectorPanel({ selection, onDeskChange, onChairChange, onAccessoryChange }: Props) {
  const byCategory = ACCESSORIES.reduce<Record<string, Accessory[]>>((acc, a) => {
    (acc[a.category] ??= []).push(a);
    return acc;
  }, {});

  const step1Done = !!selection.desk;
  const step2Done = !!selection.chair;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>

      {/* Header */}
      <div style={{
        padding: '16px 20px 12px',
        borderBottom: '1px solid #EAE4DA',
        background: '#FAF7F2',
      }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#B0A494', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>
          Configure
        </p>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1A1510' }}>Build your workspace</h2>
        {/* Progress bar */}
        <div style={{ display: 'flex', gap: 5, marginTop: 10 }}>
          {['Desk', 'Chair', 'Extras'].map((label, i) => {
            const done = i === 0 ? step1Done : i === 1 ? step2Done : false;
            const active = i === 0 ? true : i === 1 ? step1Done : step1Done && step2Done;
            return (
              <div key={label} style={{ flex: 1 }}>
                <div style={{
                  height: 3, borderRadius: 2,
                  background: done ? '#0E8C7E' : active ? '#D4C8B8' : '#E8E4DC',
                  transition: 'background 0.3s',
                }} />
                <p style={{
                  fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: done ? '#0E8C7E' : active ? '#9A8E80' : '#C4B8A8',
                  marginTop: 3,
                }}>
                  {done ? '✓ ' : ''}{label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1 — Desk */}
      <StepSection step={1} label="Desk" hint="Pick your surface" complete={step1Done}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {DESKS.map(desk => (
            <DeskCard
              key={desk.id}
              desk={desk}
              selected={selection.desk?.id === desk.id}
              onClick={() => onDeskChange(desk)}
            />
          ))}
        </div>
      </StepSection>

      <Divider />

      {/* Step 2 — Chair */}
      <StepSection step={2} label="Chair" hint="Find your seat" complete={step2Done}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {CHAIRS.map(chair => (
            <ChairCard
              key={chair.id}
              chair={chair}
              selected={selection.chair?.id === chair.id}
              onClick={() => onChairChange(chair)}
            />
          ))}
        </div>
      </StepSection>

      <Divider />

      {/* Step 3 — Accessories */}
      <StepSection step={3} label="Accessories" hint="Add the extras">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Object.entries(byCategory).map(([cat, items]) => {
            const meta = CATEGORY_META[cat];
            return (
              <div key={cat}>
                <p style={{
                  fontSize: 10, fontWeight: 700, color: '#9A8E80',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  marginBottom: 6,
                }}>
                  {meta.icon} {meta.label}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {items.map(acc => {
                    const qty = selection.accessories[acc.id]?.quantity ?? 0;
                    return (
                      <AccessoryCard
                        key={acc.id}
                        acc={acc}
                        qty={qty}
                        onAdd={() => onAccessoryChange(acc, 1)}
                        onRemove={() => onAccessoryChange(acc, -1)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </StepSection>

      <div style={{ height: 16 }} />
    </div>
  );
}

function StepSection({ step, label, hint, complete, children }: {
  step: number; label: string; hint: string; complete?: boolean; children: React.ReactNode;
}) {
  return (
    <div style={{ padding: '16px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 22, height: 22,
          borderRadius: '50%',
          background: complete ? '#0E8C7E' : '#1A1510',
          color: 'white',
          fontSize: 10, fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {complete ? '✓' : step}
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#1A1510', lineHeight: 1 }}>{label}</p>
          <p style={{ fontSize: 11, color: '#9A8E80', marginTop: 2 }}>{hint}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, margin: '0 20px', background: '#EAE4DA' }} />;
}

function DeskCard({ desk, selected, onClick }: { desk: Desk; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left',
        background: selected ? '#1A1510' : 'white',
        border: `1.5px solid ${selected ? '#1A1510' : '#EAE4DA'}`,
        borderRadius: 12,
        padding: '10px 12px',
        cursor: 'pointer',
        transition: 'all 0.18s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLElement).style.borderColor = '#C4B8A8'; }}
      onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLElement).style.borderColor = '#EAE4DA'; }}
    >
      {/* Desk color strip */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
        background: `linear-gradient(180deg, ${desk.surfaceColor}, ${desk.edgeColor})`,
        borderRadius: '12px 0 0 12px',
      }} />
      <div style={{ paddingLeft: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              fontSize: 10,
              color: selected ? 'rgba(255,255,255,0.5)' : '#9A8E80',
              fontFamily: 'monospace',
            }}>
              {DESK_ICONS[desk.style]}
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: selected ? 'white' : '#1A1510' }}>
              {desk.name}
            </span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: selected ? 'rgba(255,255,255,0.65)' : '#9A8E80', whiteSpace: 'nowrap' }}>
            {idr(desk.price)}<span style={{ fontSize: 9, opacity: 0.7 }}>/mo</span>
          </span>
        </div>
        <p style={{ fontSize: 11, color: selected ? 'rgba(255,255,255,0.6)' : '#9A8E80', marginTop: 3 }}>
          {desk.tagline}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
          {desk.description.split(',').slice(0, 2).map(f => f.trim().split(' ').slice(0, 3).join(' ')).map((tag, i) => (
            <span key={i} style={{
              fontSize: 9, fontWeight: 600, letterSpacing: '0.04em',
              padding: '2px 6px', borderRadius: 10,
              background: selected ? 'rgba(255,255,255,0.12)' : '#F4EFE8',
              color: selected ? 'rgba(255,255,255,0.65)' : '#7A6E60',
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

function ChairCard({ chair, selected, onClick }: { chair: Chair; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left',
        background: selected ? '#1A1510' : 'white',
        border: `1.5px solid ${selected ? '#1A1510' : '#EAE4DA'}`,
        borderRadius: 12,
        padding: '10px 12px',
        cursor: 'pointer',
        transition: 'all 0.18s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLElement).style.borderColor = '#C4B8A8'; }}
      onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLElement).style.borderColor = '#EAE4DA'; }}
    >
      {/* Chair color strip */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
        background: chair.seatColor,
        borderRadius: '12px 0 0 12px',
      }} />
      <div style={{ paddingLeft: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
              background: chair.seatColor,
              border: `1px solid ${selected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
            }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: selected ? 'white' : '#1A1510' }}>
              {chair.name}
            </span>
          </div>
          <span style={{ fontSize: 11, fontWeight: 600, color: selected ? 'rgba(255,255,255,0.65)' : '#9A8E80', whiteSpace: 'nowrap' }}>
            {idr(chair.price)}<span style={{ fontSize: 9, opacity: 0.7 }}>/mo</span>
          </span>
        </div>
        <p style={{ fontSize: 11, color: selected ? 'rgba(255,255,255,0.6)' : '#9A8E80', marginTop: 3 }}>
          {chair.tagline}
        </p>
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          <span style={{
            fontSize: 9, fontWeight: 600, letterSpacing: '0.04em',
            padding: '2px 6px', borderRadius: 10,
            background: selected ? 'rgba(255,255,255,0.12)' : '#F4EFE8',
            color: selected ? 'rgba(255,255,255,0.65)' : '#7A6E60',
            textTransform: 'capitalize',
          }}>
            {chair.style}
          </span>
        </div>
      </div>
    </button>
  );
}

function AccessoryCard({ acc, qty, onAdd, onRemove }: {
  acc: Accessory; qty: number; onAdd: () => void; onRemove: () => void;
}) {
  const active = qty > 0;
  return (
    <div style={{
      background: active ? '#F0F9F7' : 'white',
      border: `1.5px solid ${active ? '#0E8C7E40' : '#EAE4DA'}`,
      borderRadius: 10,
      padding: '8px 10px',
      display: 'flex', alignItems: 'center', gap: 8,
      transition: 'all 0.18s',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#1A1510' }}>{acc.name}</span>
          <span style={{ fontSize: 10, color: '#9A8E80' }}>{idr(acc.price)}/mo</span>
        </div>
        <p style={{ fontSize: 10, color: '#9A8E80', marginTop: 2, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {acc.tagline}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
        {qty > 0 && (
          <button
            onClick={onRemove}
            style={{
              width: 22, height: 22, borderRadius: '50%',
              background: '#EAE4DA', border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 700, color: '#1A1510',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1,
            }}
          >−</button>
        )}
        {qty > 0 && (
          <span style={{ fontSize: 13, fontWeight: 700, color: '#0E8C7E', width: 14, textAlign: 'center' }}>{qty}</span>
        )}
        {qty < acc.maxQuantity ? (
          <button
            onClick={onAdd}
            style={{
              width: 22, height: 22, borderRadius: '50%',
              background: qty === 0 ? '#1A1510' : '#0E8C7E',
              border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 700, color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              lineHeight: 1,
            }}
          >+</button>
        ) : (
          <span style={{ fontSize: 9, color: '#9A8E80', fontStyle: 'italic' }}>max</span>
        )}
      </div>
    </div>
  );
}
