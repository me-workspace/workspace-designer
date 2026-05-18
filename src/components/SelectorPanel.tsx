'use client';

import { useState } from 'react';
import type { DeskItem, SeatingItem, DeviceItem, ZoneItem, DeviceGroup, PlacedZone, Station } from '@/model/types';
import { DESKS, SEATING, DEVICES, ZONES } from '@/data/catalog';
import { deviceCount } from '@/model/design';

interface Props {
  station: Station;
  zones: PlacedZone[];
  onDeskChange: (deskId: string) => void;
  onSeatingChange: (seatingId: string) => void;
  onDeviceChange: (deviceId: string, delta: number) => void;
  onZoneChange: (zoneId: string, delta: number) => void;
}

const idr = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const GROUP_LABEL: Record<DeviceGroup, string> = {
  display: 'Displays', compute: 'Compute', audio: 'Audio', lighting: 'Lighting',
  input: 'Input', connectivity: 'Connectivity', comfort: 'Comfort', nature: 'Nature', decor: 'Decor',
};
const GROUP_ORDER: DeviceGroup[] = ['display', 'input', 'lighting', 'compute', 'connectivity', 'comfort', 'audio', 'nature', 'decor'];

const SHAPE_ICON: Record<DeskItem['spec']['shape'], string> = {
  'straight': '▭', 'l-shaped': '⌐', 'u-shaped': '⊐',
};

export default function SelectorPanel({ station, zones, onDeskChange, onSeatingChange, onDeviceChange, onZoneChange }: Props) {
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<Set<DeviceGroup>>(
    () => new Set(GROUP_ORDER.filter(g => g !== 'display')),
  );

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;
  const matches = (item: { name: string; tags: string[] }) =>
    !q || item.name.toLowerCase().includes(q) || item.tags.some(t => t.includes(q));

  const desks = DESKS.filter(matches);
  const seats = SEATING.filter(matches);
  const deviceGroups = GROUP_ORDER
    .map(g => ({ group: g, items: DEVICES.filter(d => d.spec.group === g && matches(d)) }))
    .filter(g => g.items.length > 0);
  const zoneList = ZONES.filter(matches);
  const zc = (id: string) => zones.filter(z => z.zoneId === id).length;

  const nothing = searching && !desks.length && !seats.length && !deviceGroups.length && !zoneList.length;
  const step1Done = !!station.deskId;
  const step2Done = !!station.seatingId;

  const toggle = (g: DeviceGroup) => setCollapsed(prev => {
    const next = new Set(prev);
    if (next.has(g)) next.delete(g); else next.add(g);
    return next;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>

      {/* Header */}
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #1f1f22', flexShrink: 0 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#52525b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>
          Configure
        </p>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#f2f2f7' }}>Build your workspace</h2>

        {/* Search */}
        <div style={{ position: 'relative', marginTop: 10 }}>
          <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#52525b' }}>⌕</span>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search desks, devices…"
            style={{
              width: '100%', height: 30, padding: '0 26px 0 24px', borderRadius: 8,
              background: '#111113', border: '1px solid #2c2c2f',
              color: '#f2f2f7', fontSize: 11, outline: 'none',
            }}
          />
          {searching && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
                width: 18, height: 18, borderRadius: '50%', border: 'none',
                background: '#2c2c2f', color: '#71717a', cursor: 'pointer', fontSize: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>
          )}
        </div>

        {!searching && (
          <div style={{ display: 'flex', gap: 5, marginTop: 10 }}>
            {['Desk', 'Chair', 'Devices'].map((label, i) => {
              const done = i === 0 ? step1Done : i === 1 ? step2Done : false;
              const active = i === 0 ? true : i === 1 ? step1Done : step1Done && step2Done;
              return (
                <div key={label} style={{ flex: 1 }}>
                  <div style={{ height: 2, borderRadius: 2, background: done ? '#4ade80' : active ? '#2c2c2f' : '#1c1c1f', transition: 'background 0.3s' }} />
                  <p style={{
                    fontSize: 9, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: done ? '#4ade80' : active ? '#52525b' : '#3f3f46', marginTop: 3,
                  }}>
                    {done ? '✓ ' : ''}{label}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {nothing && (
        <p style={{ padding: '24px 16px', fontSize: 11, color: '#52525b', textAlign: 'center', fontStyle: 'italic' }}>
          No matches for &ldquo;{query}&rdquo;.
        </p>
      )}

      {/* Desk */}
      {desks.length > 0 && (
        <>
          <StepSection step={1} label="Desk" hint={searching ? `${desks.length} match` : 'Pick your surface'} complete={step1Done}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {desks.map(desk => (
                <DeskCard key={desk.id} desk={desk} selected={station.deskId === desk.id} onClick={() => onDeskChange(desk.id)} />
              ))}
            </div>
          </StepSection>
          <Divider />
        </>
      )}

      {/* Chair */}
      {seats.length > 0 && (
        <>
          <StepSection step={2} label="Chair" hint={searching ? `${seats.length} match` : 'Find your seat'} complete={step2Done}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {seats.map(chair => (
                <SeatingCard key={chair.id} chair={chair} selected={station.seatingId === chair.id} onClick={() => onSeatingChange(chair.id)} />
              ))}
            </div>
          </StepSection>
          <Divider />
        </>
      )}

      {/* Devices */}
      {deviceGroups.length > 0 && (
        <StepSection step={3} label="Devices" hint="Add the extras">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {deviceGroups.map(({ group, items }) => {
              const open = searching || !collapsed.has(group);
              const selected = items.reduce((n, d) => n + deviceCount(station, d.id), 0);
              return (
                <div key={group}>
                  <button
                    onClick={() => toggle(group)}
                    disabled={searching}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 6,
                      background: 'transparent', border: 'none', padding: '3px 0',
                      cursor: searching ? 'default' : 'pointer',
                    }}
                  >
                    <span style={{ fontSize: 9, color: '#52525b', width: 8 }}>{open ? '▾' : '▸'}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#71717a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {GROUP_LABEL[group]}
                    </span>
                    <span style={{ fontSize: 9, color: '#3f3f46' }}>{items.length}</span>
                    {selected > 0 && (
                      <span style={{
                        marginLeft: 'auto', fontSize: 9, fontWeight: 800,
                        minWidth: 16, height: 16, padding: '0 4px', borderRadius: 8,
                        background: 'rgba(74,222,128,0.14)', color: '#4ade80',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{selected}</span>
                    )}
                  </button>
                  {open && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                      {items.map(dev => (
                        <DeviceCard
                          key={dev.id}
                          device={dev}
                          count={deviceCount(station, dev.id)}
                          onAdd={() => onDeviceChange(dev.id, 1)}
                          onRemove={() => onDeviceChange(dev.id, -1)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </StepSection>
      )}

      {/* Zones */}
      {zoneList.length > 0 && (
        <>
          <Divider />
          <StepSection step={4} label="Zones" hint={searching ? `${zoneList.length} match` : 'Build out the room'}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {zoneList.map(zone => (
                <ZoneCard
                  key={zone.id}
                  zone={zone}
                  added={zc(zone.id) > 0}
                  onAdd={() => onZoneChange(zone.id, 1)}
                  onRemove={() => onZoneChange(zone.id, -1)}
                />
              ))}
            </div>
          </StepSection>
        </>
      )}

      <div style={{ height: 16 }} />
    </div>
  );
}

function ZoneCard({ zone, added, onAdd, onRemove }: {
  zone: ZoneItem; added: boolean; onAdd: () => void; onRemove: () => void;
}) {
  return (
    <div style={{
      background: added ? 'rgba(74,222,128,0.05)' : '#111113',
      border: `1.5px solid ${added ? 'rgba(74,222,128,0.25)' : '#1f1f22'}`,
      borderRadius: 9, padding: '8px 10px',
      display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: added ? '#d4d4d8' : '#a1a1aa' }}>{zone.name}</span>
          <span style={{ fontSize: 9, color: '#52525b' }}>{idr(zone.price)}/mo</span>
        </div>
        <p style={{ fontSize: 9, color: '#52525b', marginTop: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {zone.tagline}
        </p>
      </div>
      <button
        onClick={added ? onRemove : onAdd}
        style={{
          flexShrink: 0, padding: '5px 10px', borderRadius: 7, fontSize: 10, fontWeight: 700, cursor: 'pointer',
          background: added ? 'rgba(74,222,128,0.14)' : '#1c1c1f',
          border: `1px solid ${added ? 'rgba(74,222,128,0.35)' : '#2c2c2f'}`,
          color: added ? '#4ade80' : '#a1a1aa',
        }}
      >
        {added ? '✓ Added' : 'Add'}
      </button>
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

function DeskCard({ desk, selected, onClick }: { desk: DeskItem; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left',
        background: selected ? 'rgba(74,222,128,0.06)' : '#111113',
        border: `1.5px solid ${selected ? 'rgba(74,222,128,0.35)' : '#1f1f22'}`,
        borderRadius: 10, padding: '9px 10px',
        cursor: 'pointer', transition: 'all 0.15s', position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
        background: `linear-gradient(180deg, ${desk.spec.surfaceColor}, ${desk.spec.edgeColor})`,
        borderRadius: '10px 0 0 10px',
      }} />
      <div style={{ paddingLeft: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 9, color: selected ? '#4ade80' : '#52525b', fontFamily: 'monospace' }}>
              {SHAPE_ICON[desk.spec.shape]}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: selected ? '#f2f2f7' : '#d4d4d8' }}>{desk.name}</span>
          </div>
          <span style={{ fontSize: 10, fontWeight: 600, color: selected ? '#4ade80' : '#52525b', whiteSpace: 'nowrap' }}>
            {idr(desk.price)}<span style={{ fontSize: 8 }}>/mo</span>
          </span>
        </div>
        <p style={{ fontSize: 10, color: selected ? '#a1a1aa' : '#71717a', marginTop: 2 }}>{desk.tagline}</p>
        {selected && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 5 }}>
            {desk.tags.map(tag => (
              <span key={tag} style={{
                fontSize: 8, fontWeight: 600, letterSpacing: '0.04em', padding: '1px 5px', borderRadius: 8,
                background: 'rgba(74,222,128,0.1)', color: '#4ade80',
              }}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

function SeatingCard({ chair, selected, onClick }: { chair: SeatingItem; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', textAlign: 'left',
        background: selected ? 'rgba(74,222,128,0.06)' : '#111113',
        border: `1.5px solid ${selected ? 'rgba(74,222,128,0.35)' : '#1f1f22'}`,
        borderRadius: 10, padding: '9px 10px',
        cursor: 'pointer', transition: 'all 0.15s', position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
        background: chair.spec.seatColor, borderRadius: '10px 0 0 10px',
      }} />
      <div style={{ paddingLeft: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
              background: chair.spec.seatColor,
              boxShadow: selected ? `0 0 6px ${chair.spec.seatColor}60` : 'none',
            }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: selected ? '#f2f2f7' : '#d4d4d8' }}>{chair.name}</span>
          </div>
          <span style={{ fontSize: 10, fontWeight: 600, color: selected ? '#4ade80' : '#52525b', whiteSpace: 'nowrap' }}>
            {idr(chair.price)}<span style={{ fontSize: 8 }}>/mo</span>
          </span>
        </div>
        <p style={{ fontSize: 10, color: selected ? '#a1a1aa' : '#71717a', marginTop: 2 }}>{chair.tagline}</p>
        {selected && (
          <span style={{
            display: 'inline-block', marginTop: 5,
            fontSize: 8, fontWeight: 600, letterSpacing: '0.04em', padding: '1px 5px', borderRadius: 8,
            background: 'rgba(74,222,128,0.1)', color: '#4ade80', textTransform: 'capitalize',
          }}>
            {chair.spec.style}
          </span>
        )}
      </div>
    </button>
  );
}

function DeviceCard({ device, count, onAdd, onRemove }: {
  device: DeviceItem; count: number; onAdd: () => void; onRemove: () => void;
}) {
  const active = count > 0;
  return (
    <div style={{
      background: active ? 'rgba(74,222,128,0.05)' : '#111113',
      border: `1.5px solid ${active ? 'rgba(74,222,128,0.25)' : '#1f1f22'}`,
      borderRadius: 9, padding: '7px 10px',
      display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: active ? '#d4d4d8' : '#a1a1aa' }}>{device.name}</span>
          <span style={{ fontSize: 9, color: '#52525b' }}>{idr(device.price)}/mo</span>
        </div>
        <p style={{ fontSize: 9, color: '#52525b', marginTop: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
          {device.tagline}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        {count > 0 && (
          <button onClick={onRemove} style={{
            width: 20, height: 20, borderRadius: '50%',
            background: '#1c1c1f', border: '1px solid #2c2c2f', cursor: 'pointer',
            fontSize: 12, fontWeight: 700, color: '#71717a',
            display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
          }}>−</button>
        )}
        {count > 0 && (
          <span style={{ fontSize: 12, fontWeight: 700, color: '#4ade80', width: 12, textAlign: 'center' }}>{count}</span>
        )}
        {count < device.maxPerStation ? (
          <button onClick={onAdd} style={{
            width: 20, height: 20, borderRadius: '50%',
            background: count === 0 ? '#1c1c1f' : 'rgba(74,222,128,0.15)',
            border: `1px solid ${count === 0 ? '#2c2c2f' : 'rgba(74,222,128,0.3)'}`,
            cursor: 'pointer', fontSize: 12, fontWeight: 700,
            color: count === 0 ? '#71717a' : '#4ade80',
            display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
          }}>+</button>
        ) : (
          <span style={{ fontSize: 8, color: '#52525b', fontStyle: 'italic', marginLeft: 2 }}>max</span>
        )}
      </div>
    </div>
  );
}
