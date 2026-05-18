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

const CATEGORY_META: Record<string, { label: string }> = {
  display:  { label: 'Displays' },
  lighting: { label: 'Lighting' },
  nature:   { label: 'Nature' },
  tech:     { label: 'Tech' },
};

const DESK_ICONS: Record<string, string> = {
  minimal:  '▭',
  lshaped:  '⌐',
  standing: '↕',
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
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #1f1f22', flexShrink: 0 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#52525b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>
          Configure
        </p>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#f2f2f7' }}>Build your workspace</h2>
        <div style={{ display: 'flex', gap: 5, marginTop: 10 }}>
          {['Desk', 'Chair', 'Accessories'].map((label, i) => {
            const done = i === 0 ? step1Done : i === 1 ? step2Done : false;
            const active = i === 0 ? true : i === 1 ? step1Done : step1Done && step2Done;
            return (
              <div key={label} style={{ flex: 1 }}>
                <div style={{
                  height: 2, borderRadius: 2,
                  background: done ? '#4ade80' : active ? '#2c2c2f' : '#1c1c1f',
                  transition: 'background 0.3s',
                }} />
                <p style={{
                  fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: done ? '#4ade80' : active ? '#52525b' : '#3f3f46',
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {Object.entries(byCategory).map(([cat, items]) => {
            const meta = CATEGORY_META[cat];
            return (
              <div key={cat}>
                <p style={{
                  fontSize: 9, fontWeight: 700, color: '#52525b',
                  letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 5,
                }}>
                  {meta.label}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
    <div style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 20, height: 20, borderRadius: '50%',
          background: complete ? '#4ade80' : '#1c1c1f',
          border: `1.5px solid ${complete ? '#4ade80' : '#2c2c2f'}`,
          color: complete ? '#09090b' : '#52525b',
          fontSize: 9, fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, transition: 'all 0.2s',
        }}>
          {complete ? '✓' : step}
        </div>
        <div>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#f2f2f7', lineHeight: 1 }}>{label}</p>
          <p style={{ fontSize: 10, color: '#52525b', marginTop: 2 }}>{hint}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, margin: '0 16px', background: '#1f1f22' }} />;
}

function DeskCard({ desk, selected, onClick }: { desk: Desk; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left',
        background: selected ? 'rgba(74,222,128,0.06)' : '#111113',
        border: `1.5px solid ${selected ? 'rgba(74,222,128,0.35)' : '#1f1f22'}`,
        borderRadius: 10, padding: '9px 10px',
        cursor: 'pointer', transition: 'all 0.15s',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
        background: `linear-gradient(180deg, ${desk.surfaceColor}, ${desk.edgeColor})`,
        borderRadius: '10px 0 0 10px',
      }} />
      <div style={{ paddingLeft: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 9, color: selected ? '#4ade80' : '#52525b', fontFamily: 'monospace' }}>
              {DESK_ICONS[desk.style]}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: selected ? '#f2f2f7' : '#d4d4d8' }}>
              {desk.name}
            </span>
          </div>
          <span style={{ fontSize: 10, fontWeight: 600, color: selected ? '#4ade80' : '#52525b', whiteSpace: 'nowrap' }}>
            {idr(desk.price)}<span style={{ fontSize: 8 }}>/mo</span>
          </span>
        </div>
        <p style={{ fontSize: 10, color: selected ? '#a1a1aa' : '#71717a', marginTop: 2 }}>
          {desk.tagline}
        </p>
        {selected && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 5 }}>
            {desk.description.split(',').slice(0, 2).map(f => f.trim().split(' ').slice(0, 3).join(' ')).map((tag, i) => (
              <span key={i} style={{
                fontSize: 8, fontWeight: 600, letterSpacing: '0.04em',
                padding: '1px 5px', borderRadius: 8,
                background: 'rgba(74,222,128,0.1)', color: '#4ade80',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}
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
        background: selected ? 'rgba(74,222,128,0.06)' : '#111113',
        border: `1.5px solid ${selected ? 'rgba(74,222,128,0.35)' : '#1f1f22'}`,
        borderRadius: 10, padding: '9px 10px',
        cursor: 'pointer', transition: 'all 0.15s',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
        background: chair.seatColor,
        borderRadius: '10px 0 0 10px',
      }} />
      <div style={{ paddingLeft: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
              background: chair.seatColor,
              boxShadow: selected ? `0 0 6px ${chair.seatColor}60` : 'none',
            }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: selected ? '#f2f2f7' : '#d4d4d8' }}>
              {chair.name}
            </span>
          </div>
          <span style={{ fontSize: 10, fontWeight: 600, color: selected ? '#4ade80' : '#52525b', whiteSpace: 'nowrap' }}>
            {idr(chair.price)}<span style={{ fontSize: 8 }}>/mo</span>
          </span>
        </div>
        <p style={{ fontSize: 10, color: selected ? '#a1a1aa' : '#71717a', marginTop: 2 }}>
          {chair.tagline}
        </p>
        {selected && (
          <span style={{
            display: 'inline-block', marginTop: 5,
            fontSize: 8, fontWeight: 600, letterSpacing: '0.04em',
            padding: '1px 5px', borderRadius: 8,
            background: 'rgba(74,222,128,0.1)', color: '#4ade80', textTransform: 'capitalize',
          }}>
            {chair.style}
          </span>
        )}
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
      background: active ? 'rgba(74,222,128,0.05)' : '#111113',
      border: `1.5px solid ${active ? 'rgba(74,222,128,0.25)' : '#1f1f22'}`,
      borderRadius: 9, padding: '7px 10px',
      display: 'flex', alignItems: 'center', gap: 8,
      transition: 'all 0.15s',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: active ? '#d4d4d8' : '#a1a1aa' }}>{acc.name}</span>
          <span style={{ fontSize: 9, color: '#52525b' }}>{idr(acc.price)}/mo</span>
        </div>
        <p style={{ fontSize: 9, color: '#52525b', marginTop: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {acc.tagline}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        {qty > 0 && (
          <button
            onClick={onRemove}
            style={{
              width: 20, height: 20, borderRadius: '50%',
              background: '#1c1c1f', border: '1px solid #2c2c2f', cursor: 'pointer',
              fontSize: 12, fontWeight: 700, color: '#71717a',
              display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
            }}
          >−</button>
        )}
        {qty > 0 && (
          <span style={{ fontSize: 12, fontWeight: 700, color: '#4ade80', width: 12, textAlign: 'center' }}>{qty}</span>
        )}
        {qty < acc.maxQuantity ? (
          <button
            onClick={onAdd}
            style={{
              width: 20, height: 20, borderRadius: '50%',
              background: qty === 0 ? '#1c1c1f' : 'rgba(74,222,128,0.15)',
              border: `1px solid ${qty === 0 ? '#2c2c2f' : 'rgba(74,222,128,0.3)'}`,
              cursor: 'pointer', fontSize: 12, fontWeight: 700,
              color: qty === 0 ? '#71717a' : '#4ade80',
              display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
            }}
          >+</button>
        ) : (
          <span style={{ fontSize: 8, color: '#52525b', fontStyle: 'italic', marginLeft: 2 }}>max</span>
        )}
      </div>
    </div>
  );
}
