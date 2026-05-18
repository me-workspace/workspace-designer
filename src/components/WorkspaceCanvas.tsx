'use client';

import { useRef, useState } from 'react';
import type { WorkspaceDesign, Station, ZoneItem, PlacedZone } from '@/model/types';
import { getDesk, getSeating, getDevice, getZone, layoutStation, hasPins, type LaidDevice } from '@/model/design';
import { resolveEnvironment, type ResolvedEnv } from '@/model/environment';
import DeskGlyph from './glyphs/DeskGlyph';
import SeatingGlyph from './glyphs/SeatingGlyph';
import DeviceGlyph from './glyphs/DeviceGlyph';
import ZoneGlyph from './glyphs/ZoneGlyph';

interface Props {
  design: WorkspaceDesign;
  onMoveDevice: (deviceUid: string, offset: { x: number; y: number }) => void;
  onMoveZone: (zoneUid: string, spot: { x: number; y: number }) => void;
  onResetLayout: () => void;
}

const G = '#4ade80';
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

/* ── Office floor: desks fan into the room as a widening pyramid ── */
function deskRows(qty: number): number[] {
  const map: Record<number, number[]> = { 1: [1], 3: [1, 2], 5: [1, 2, 2], 10: [1, 2, 3, 4] };
  if (map[qty]) return map[qty];
  const rows: number[] = [];
  let remaining = qty, r = 1;
  while (remaining > 0) { const take = Math.min(r, remaining); rows.push(take); remaining -= take; r++; }
  return rows;
}

interface Slot { d: number; x: number; idx: number }

function buildSlots(qty: number): Slot[] {
  const rows = deskRows(qty);
  const R = rows.length;
  const slots: Slot[] = [];
  let idx = 0;
  rows.forEach((n, r) => {
    const d = R === 1 ? 0 : r / (R - 1);
    const span = 70 - d * 6;
    for (let i = 0; i < n; i++) {
      const x = n === 1 ? 50 : 50 + (i - (n - 1) / 2) * (span / n);
      slots.push({ d, x, idx: idx++ });
    }
  });
  return slots;
}

export default function WorkspaceCanvas({ design, onMoveDevice, onMoveZone, onResetLayout }: Props) {
  const re = resolveEnvironment(design.environment);
  const template = design.stations[0];
  const teamSize = design.stations.length;
  const hasStations = !!template.deskId || !!template.seatingId;
  const isEmpty = !hasStations && design.zones.length === 0;
  const slots = buildSlots(teamSize).sort((a, b) => b.d - a.d);
  const baseH = teamSize === 1 ? 74 : 60;
  const pinned = hasPins(design);

  const desk = getDesk(template.deskId);
  const seating = getSeating(template.seatingId);
  const deviceCounts = new Map<string, number>();
  for (const d of template.devices) deviceCounts.set(d.deviceId, (deviceCounts.get(d.deviceId) ?? 0) + 1);
  const caption = [
    desk && `${desk.name} desk`,
    seating && `${seating.name} chair`,
    ...[...deviceCounts].map(([id, n]) => {
      const dev = getDevice(id);
      return dev ? `${n > 1 ? `${n}× ` : ''}${dev.name}` : '';
    }),
  ].filter(Boolean).join('   ·   ');

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 12, background: re.rootBg }}>

      {/* Wall */}
      <div style={{ position: 'absolute', inset: '0 0 63% 0', background: `linear-gradient(180deg,${re.wall[0]} 0%,${re.wall[1]} 100%)` }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 82% 6%, ${re.wallWash} 0%, transparent 62%)` }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.014) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.014) 1px,transparent 1px)',
          backgroundSize: '58px 58px',
        }} />
      </div>

      {/* Horizon */}
      <div style={{ position: 'absolute', top: '37%', left: 0, right: 0, height: '1px', background: `linear-gradient(90deg,transparent,${re.horizon},transparent)` }} />
      <div style={{ position: 'absolute', top: '37%', left: 0, right: 0, height: '13%', background: `linear-gradient(180deg,${re.lightPool},transparent)`, pointerEvents: 'none' }} />

      {/* Floor */}
      <div style={{ position: 'absolute', inset: '37% 0 0 0', background: `linear-gradient(180deg,${re.floor[0]} 0%,${re.floor[1]} 100%)` }}>
        <PerspectiveFloor color={re.floorGrid} />
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 70% -4%, ${re.lightPool} 0%, transparent 56%)` }} />
      </div>

      {/* Baseboard */}
      <div style={{ position: 'absolute', top: '36.3%', left: 0, right: 0, height: '7px', background: re.baseboard }} />

      <EnvWindow w={re.window} />
      <WallArt />

      {/* Sun beam */}
      <div style={{
        position: 'absolute', top: 0, right: '4%', width: '52%', height: '100%',
        background: `linear-gradient(202deg, ${re.beam} 0%, transparent 44%)`,
        transform: 'skewX(-13deg)', transformOrigin: 'top right', pointerEvents: 'none',
      }} />

      {/* Empty state */}
      {isEmpty && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%', border: '1.5px solid rgba(255,170,90,0.32)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16, color: 'rgba(255,180,100,0.75)', fontSize: 24,
          }}>+</div>
          <p style={{ color: '#e0cdb0', fontWeight: 600, fontSize: 14, letterSpacing: '0.02em' }}>Start designing your studio</p>
          <p style={{ color: '#7c6650', fontSize: 12, marginTop: 5 }}>← Pick a desk to begin</p>
        </div>
      )}

      {/* Workstations */}
      {hasStations && slots.map(s => {
        const scale = 0.42 + Math.pow(1 - s.d, 1.4) * 0.58;
        const bottom = 2.5 + (1 - Math.pow(1 - s.d, 1.85)) * 36;
        const blur = s.d > 0.62 ? (s.d - 0.62) * 4 : 0;
        const station = design.stations[s.idx] ?? template;
        const hero = s.d === 0;
        return (
          <div key={s.idx} style={{
            position: 'absolute', left: `${s.x}%`, bottom: `${bottom}%`,
            height: `${baseH}%`, aspectRatio: '1.18',
            transform: `translateX(-50%) scale(${scale})`, transformOrigin: 'bottom center',
            zIndex: Math.round((1 - s.d) * 100) + 10,
            filter: `brightness(${1 - s.d * 0.3}) saturate(${1 - s.d * 0.22})${blur ? ` blur(${blur}px)` : ''}`,
          }}>
            <div className="animate-rise-in" style={{ position: 'relative', width: '100%', height: '100%', animationDelay: `${s.idx * 0.06}s` }}>
              <Workstation station={station} interactive={hero} onDeviceMove={onMoveDevice} />
            </div>
          </div>
        );
      })}

      {/* Zones */}
      {design.zones.map(pz => {
        const zone = getZone(pz.zoneId);
        if (!zone) return null;
        return <PlacedZoneView key={pz.uid} pz={pz} zone={zone} onMove={onMoveZone} />;
      })}

      {/* Office badge */}
      {teamSize > 1 && !isEmpty && (
        <div style={{
          position: 'absolute', top: 12, left: 12, zIndex: 200,
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(20,14,9,0.82)', backdropFilter: 'blur(6px)',
          border: '1px solid rgba(255,170,90,0.28)', borderRadius: 8, padding: '5px 11px',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: G, boxShadow: `0 0 6px ${G}` }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#ffce8a', letterSpacing: '0.04em' }}>
            Office for {teamSize} · {teamSize} identical setups
          </span>
        </div>
      )}

      {/* Arrange hint / reset */}
      {!isEmpty && (
        pinned ? (
          <button
            onClick={onResetLayout}
            style={{
              position: 'absolute', top: 12, right: 12, zIndex: 210,
              background: 'rgba(20,14,9,0.82)', backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,170,90,0.3)', borderRadius: 8,
              padding: '5px 11px', cursor: 'pointer',
              fontSize: 11, fontWeight: 700, color: '#ffce8a',
            }}
          >
            ↺ Auto-arrange
          </button>
        ) : (
          <div style={{
            position: 'absolute', top: 12, right: 12, zIndex: 210,
            background: 'rgba(20,14,9,0.7)', backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8,
            padding: '5px 11px', fontSize: 10, color: '#9a8268', letterSpacing: '0.03em',
          }}>
            ✋ Drag items to rearrange
          </div>
        )
      )}

      {/* Caption */}
      {!isEmpty && caption && (
        <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center', zIndex: 200, pointerEvents: 'none' }}>
          <span style={{ fontSize: 10, color: '#9a8268', letterSpacing: '0.07em' }}>{caption}</span>
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 250, boxShadow: `inset 0 0 90px rgba(0,0,0,${re.vignette})` }} />
    </div>
  );
}

/* ════════ One workstation ════════ */

function Workstation({ station, interactive, onDeviceMove }: {
  station: Station;
  interactive: boolean;
  onDeviceMove: (uid: string, offset: { x: number; y: number }) => void;
}) {
  const desk = getDesk(station.deskId);
  const seating = getSeating(station.seatingId);
  const laid = layoutStation(station);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', bottom: '-2%', left: '7%', right: '7%', height: '10%', background: 'radial-gradient(ellipse,rgba(0,0,0,0.62) 0%,transparent 70%)' }} />

      {desk && (
        <div style={{ position: 'absolute', left: '1%', right: '1%', top: 0, height: '56%' }}>
          <DeskGlyph spec={desk.spec} />
        </div>
      )}

      {desk && (
        <div style={{ position: 'absolute', left: '5%', right: '5%', top: '2%', height: '42%' }}>
          {laid.map(ld => (
            <PlacedDeviceView key={ld.placed.uid} ld={ld} draggable={interactive} onMove={onDeviceMove} />
          ))}
        </div>
      )}

      {seating && (
        <div style={{ position: 'absolute', bottom: '1%', left: '50%', transform: 'translateX(-50%)', width: '24%', height: '50%' }}>
          <SeatingGlyph spec={seating.spec} />
        </div>
      )}
    </div>
  );
}

function PlacedDeviceView({ ld, draggable, onMove }: {
  ld: LaidDevice;
  draggable: boolean;
  onMove: (uid: string, offset: { x: number; y: number }) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const fp = ld.device.spec.footprint;

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const onMv = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const layer = ref.current?.parentElement;
    if (!layer) return;
    const r = layer.getBoundingClientRect();
    const x = clamp((e.clientX - r.left) / r.width - fp.w / 2, 0, 1 - fp.w);
    const y = clamp((e.clientY - r.top) / r.height - fp.h / 2, 0, 1 - fp.h);
    onMove(ld.placed.uid, { x, y });
  };
  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  };

  return (
    <div
      ref={ref}
      onPointerDown={onDown}
      onPointerMove={onMv}
      onPointerUp={onUp}
      style={{
        position: 'absolute',
        left: `${ld.rect.x * 100}%`, top: `${ld.rect.y * 100}%`,
        width: `${ld.rect.w * 100}%`, height: `${ld.rect.h * 100}%`,
        cursor: draggable ? (dragging ? 'grabbing' : 'grab') : 'default',
        touchAction: draggable ? 'none' : undefined,
        zIndex: dragging ? 60 : undefined,
        filter: dragging ? 'drop-shadow(0 6px 10px rgba(0,0,0,0.6))' : undefined,
      }}
    >
      <DeviceGlyph spec={ld.device.spec} />
    </div>
  );
}

function PlacedZoneView({ pz, zone, onMove }: {
  pz: PlacedZone;
  zone: ZoneItem;
  onMove: (uid: string, spot: { x: number; y: number }) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const depth = pz.spot.y;
  const scale = (0.5 + (1 - depth) * 0.5) * (0.7 + zone.spec.footprint.w);
  const bottom = 3 + (1 - Math.pow(1 - depth, 1.85)) * 40;
  const blur = depth > 0.66 ? (depth - 0.66) * 5 : 0;

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
  };
  const onMv = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const root = ref.current?.parentElement;
    if (!root) return;
    const r = root.getBoundingClientRect();
    const x = clamp((e.clientX - r.left) / r.width, 0.05, 0.95);
    const y = clamp((0.99 - (e.clientY - r.top) / r.height) / 0.6, 0, 1);
    onMove(pz.uid, { x, y });
  };
  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  };

  return (
    <div
      ref={ref}
      onPointerDown={onDown}
      onPointerMove={onMv}
      onPointerUp={onUp}
      style={{
        position: 'absolute', left: `${pz.spot.x * 100}%`, bottom: `${bottom}%`,
        height: '40%', aspectRatio: '1.1',
        transform: `translateX(-50%) scale(${scale})`, transformOrigin: 'bottom center',
        zIndex: dragging ? 240 : Math.round((1 - depth) * 100) + 10,
        filter: `brightness(${1 - depth * 0.34}) saturate(${1 - depth * 0.24})${blur ? ` blur(${blur}px)` : ''}`,
        cursor: dragging ? 'grabbing' : 'grab',
        touchAction: 'none',
      }}
    >
      <div className="animate-rise-in" style={{ position: 'relative', width: '100%', height: '100%' }}>
        <ZoneGlyph spec={zone.spec} />
      </div>
    </div>
  );
}

/* ════════ Room pieces ════════ */

function PerspectiveFloor({ color }: { color: string }) {
  const rays = [-45, -18, 2, 18, 32, 50, 68, 82, 98, 118, 145];
  const depths = [1, 2, 3, 4, 5, 6].map(i => 100 * (1 - Math.pow(1 - i / 6, 1.85)));
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      {rays.map((x, i) => (
        <line key={`r${i}`} x1={x} y1={100} x2={50} y2={0} stroke={color} strokeWidth={0.22} />
      ))}
      {depths.map((y, i) => (
        <line key={`d${i}`} x1={0} y1={y} x2={100} y2={y} stroke={color} strokeWidth={0.3} />
      ))}
    </svg>
  );
}

function EnvWindow({ w }: { w: ResolvedEnv['window'] }) {
  return (
    <div style={{ position: 'absolute', top: '4.5%', right: '6%', width: '22%' }}>
      <div style={{
        position: 'relative', width: '100%', paddingBottom: '116%',
        border: '3px solid #2c2118', borderRadius: '8px 8px 4px 4px',
        boxShadow: `0 0 50px ${w.sun.glow}55, inset 0 0 26px rgba(0,0,0,0.3)`,
      }}>
        <div style={{ position: 'absolute', inset: '3px', borderRadius: '5px 5px 2px 2px', overflow: 'hidden', background: w.sky }}>
          {w.clouds && [[16, 16, 32], [58, 11, 26], [34, 27, 22]].map(([x, y, cw], i) => (
            <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${cw}%`, height: '3.5%', background: 'rgba(255,255,255,0.22)', borderRadius: '10px' }} />
          ))}
          {w.stars && [[12, 10], [26, 18], [40, 8], [55, 22], [68, 12], [82, 24], [90, 9], [20, 30], [48, 32], [74, 36], [34, 44], [62, 6]].map(([x, y], i) => (
            <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: 2, height: 2, background: 'rgba(255,255,255,0.85)', borderRadius: '50%' }} />
          ))}
          {w.moon && (
            <div style={{ position: 'absolute', top: '14%', left: '24%', width: '20%', height: 0, paddingBottom: '20%', background: 'radial-gradient(circle,#fdf6e0,#cfc6a8)', borderRadius: '50%', boxShadow: '0 0 22px 6px rgba(240,235,210,0.4)' }} />
          )}
          {w.sun.show && (
            <div className="animate-sun-glow" style={{
              position: 'absolute', bottom: w.sun.bottom, left: '50%', transform: 'translateX(-50%)',
              width: '38%', height: 0, paddingBottom: '38%',
              background: `radial-gradient(circle,${w.sun.fill} 0%,#ffd26c 54%,#ff9d3c 100%)`,
              borderRadius: '50%', boxShadow: `0 0 38px 13px ${w.sun.glow}99`,
            }} />
          )}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '21%', background: `linear-gradient(180deg,${w.sea[0]} 0%,${w.sea[1]} 100%)` }}>
            <div style={{ position: 'absolute', inset: '0 46%', background: `linear-gradient(180deg,${w.sun.glow}cc,transparent)` }} />
          </div>
          <div style={{
            position: 'absolute', bottom: '16%', left: '-6%', width: '46%', height: '40%',
            background: '#1c0f12',
            clipPath: 'polygon(0 100%, 14% 6%, 27% 100%, 40% 10%, 54% 100%, 67% 12%, 100% 100%)',
          }} />
        </div>
        <div style={{ position: 'absolute', top: '49%', left: '3px', right: '3px', height: '3px', background: '#2c2118' }} />
        <div style={{ position: 'absolute', left: '49%', top: '3px', bottom: '3px', width: '3px', background: '#2c2118' }} />
      </div>
      <div style={{ position: 'absolute', bottom: '-7px', left: '-6px', right: '-6px', height: '7px', background: '#2c2118', borderRadius: '0 0 3px 3px' }} />
    </div>
  );
}

function WallArt() {
  return (
    <div style={{
      position: 'absolute', top: '6%', left: '5%', width: '7%', height: 0, paddingBottom: '9%',
      border: '2px solid #2c2118', borderRadius: '2px', background: '#1a120c', overflow: 'hidden',
      boxShadow: '0 6px 16px rgba(0,0,0,0.55)',
    }}>
      <div style={{ position: 'absolute', inset: '3px', background: 'linear-gradient(160deg,#e8703a 0%,#c4455f 52%,#3a2348 100%)' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '20%', width: '24%', height: '24%', background: '#ffd98a', borderRadius: '50%', boxShadow: '0 0 8px rgba(255,217,138,0.6)' }} />
    </div>
  );
}
