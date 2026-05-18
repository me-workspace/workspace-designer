'use client';

import type { WorkspaceDesign, Station } from '@/model/types';
import { getDesk, getSeating, getDevice, layoutStation } from '@/model/design';
import DeskGlyph from './glyphs/DeskGlyph';
import SeatingGlyph from './glyphs/SeatingGlyph';
import DeviceGlyph from './glyphs/DeviceGlyph';

interface Props {
  design: WorkspaceDesign;
}

const G = '#4ade80'; // brand green

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

export default function WorkspaceCanvas({ design }: Props) {
  const template = design.stations[0];
  const teamSize = design.stations.length;
  const isEmpty = !template.deskId && !template.seatingId;
  const slots = buildSlots(teamSize).sort((a, b) => b.d - a.d);
  const baseH = teamSize === 1 ? 74 : 60;

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
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: 12, background: '#0e0a07' }}>

      {/* Wall */}
      <div style={{ position: 'absolute', inset: '0 0 63% 0', background: 'linear-gradient(180deg,#241b14 0%,#1a130d 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 82% 6%, rgba(255,150,70,0.26) 0%, transparent 62%)' }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,200,150,0.016) 1px,transparent 1px),linear-gradient(90deg,rgba(255,200,150,0.016) 1px,transparent 1px)',
          backgroundSize: '58px 58px',
        }} />
      </div>

      {/* Horizon */}
      <div style={{ position: 'absolute', top: '37%', left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(255,165,85,0.55),transparent)' }} />
      <div style={{ position: 'absolute', top: '37%', left: 0, right: 0, height: '13%', background: 'linear-gradient(180deg,rgba(255,140,60,0.12),transparent)', pointerEvents: 'none' }} />

      {/* Floor */}
      <div style={{ position: 'absolute', inset: '37% 0 0 0', background: 'linear-gradient(180deg,#17110b 0%,#0b0805 100%)' }}>
        <PerspectiveFloor />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% -4%, rgba(255,150,70,0.16) 0%, transparent 56%)' }} />
      </div>

      {/* Baseboard */}
      <div style={{ position: 'absolute', top: '36.3%', left: 0, right: 0, height: '7px', background: 'linear-gradient(180deg,#2c2117,#1a130d)' }} />

      <SunsetWindow />
      <WallArt />

      {/* Sun beam */}
      <div style={{
        position: 'absolute', top: 0, right: '4%', width: '52%', height: '100%',
        background: 'linear-gradient(202deg, rgba(255,170,90,0.13) 0%, transparent 44%)',
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
      {!isEmpty && slots.map(s => {
        const scale = 0.42 + Math.pow(1 - s.d, 1.4) * 0.58;
        const bottom = 2.5 + (1 - Math.pow(1 - s.d, 1.85)) * 36;
        const blur = s.d > 0.62 ? (s.d - 0.62) * 4 : 0;
        const station = design.stations[s.idx] ?? template;
        return (
          <div key={s.idx} style={{
            position: 'absolute', left: `${s.x}%`, bottom: `${bottom}%`,
            height: `${baseH}%`, aspectRatio: '1.18',
            transform: `translateX(-50%) scale(${scale})`, transformOrigin: 'bottom center',
            zIndex: Math.round((1 - s.d) * 100) + 10,
            filter: `brightness(${1 - s.d * 0.3}) saturate(${1 - s.d * 0.22})${blur ? ` blur(${blur}px)` : ''}`,
          }}>
            <div className="animate-rise-in" style={{ position: 'relative', width: '100%', height: '100%', animationDelay: `${s.idx * 0.06}s` }}>
              <Workstation station={station} />
            </div>
          </div>
        );
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

      {/* Caption */}
      {!isEmpty && caption && (
        <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center', zIndex: 200, pointerEvents: 'none' }}>
          <span style={{ fontSize: 10, color: '#9a8268', letterSpacing: '0.07em' }}>{caption}</span>
        </div>
      )}

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 250, boxShadow: 'inset 0 0 90px rgba(0,0,0,0.55)' }} />
    </div>
  );
}

/* ════════ One workstation ════════ */

function Workstation({ station }: { station: Station }) {
  const desk = getDesk(station.deskId);
  const seating = getSeating(station.seatingId);
  const laid = layoutStation(station);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* contact shadow */}
      <div style={{ position: 'absolute', bottom: '-2%', left: '7%', right: '7%', height: '10%', background: 'radial-gradient(ellipse,rgba(0,0,0,0.62) 0%,transparent 70%)' }} />

      {/* desk */}
      {desk && (
        <div style={{ position: 'absolute', left: '1%', right: '1%', top: 0, height: '56%' }}>
          <DeskGlyph spec={desk.spec} />
        </div>
      )}

      {/* devices on the surface */}
      {desk && (
        <div style={{ position: 'absolute', left: '5%', right: '5%', top: '2%', height: '42%' }}>
          {laid.map(ld => (
            <div key={ld.placed.uid} className="animate-scale-in" style={{
              position: 'absolute',
              left: `${ld.rect.x * 100}%`, top: `${ld.rect.y * 100}%`,
              width: `${ld.rect.w * 100}%`, height: `${ld.rect.h * 100}%`,
            }}>
              <DeviceGlyph spec={ld.device.spec} />
            </div>
          ))}
        </div>
      )}

      {/* chair */}
      {seating && (
        <div style={{ position: 'absolute', bottom: '1%', left: '50%', transform: 'translateX(-50%)', width: '24%', height: '50%' }}>
          <SeatingGlyph spec={seating.spec} />
        </div>
      )}
    </div>
  );
}

/* ════════ Room pieces ════════ */

function PerspectiveFloor() {
  const rays = [-45, -18, 2, 18, 32, 50, 68, 82, 98, 118, 145];
  const depths = [1, 2, 3, 4, 5, 6].map(i => 100 * (1 - Math.pow(1 - i / 6, 1.85)));
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      {rays.map((x, i) => (
        <line key={`r${i}`} x1={x} y1={100} x2={50} y2={0} stroke="rgba(255,170,90,0.11)" strokeWidth={0.22} />
      ))}
      {depths.map((y, i) => (
        <line key={`d${i}`} x1={0} y1={y} x2={100} y2={y} stroke="rgba(255,165,85,0.09)" strokeWidth={0.3} />
      ))}
    </svg>
  );
}

function SunsetWindow() {
  return (
    <div style={{ position: 'absolute', top: '4.5%', right: '6%', width: '22%' }}>
      <div style={{
        position: 'relative', width: '100%', paddingBottom: '116%',
        border: '3px solid #2c2118', borderRadius: '8px 8px 4px 4px',
        boxShadow: '0 0 55px rgba(255,150,60,0.3), inset 0 0 28px rgba(255,140,50,0.15)',
      }}>
        <div style={{
          position: 'absolute', inset: '3px', borderRadius: '5px 5px 2px 2px', overflow: 'hidden',
          background: 'linear-gradient(180deg,#1f2150 0%,#5b3568 25%,#a8455f 45%,#dd6a37 63%,#f59b3e 79%,#ffc862 91%,#ffe39c 100%)',
        }}>
          {[[16, 16, 32], [58, 11, 26], [34, 27, 22]].map(([x, y, w], i) => (
            <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${w}%`, height: '3.5%', background: 'rgba(80,36,54,0.5)', borderRadius: '10px' }} />
          ))}
          <div className="animate-sun-glow" style={{
            position: 'absolute', bottom: '21%', left: '50%', transform: 'translateX(-50%)',
            width: '38%', height: 0, paddingBottom: '38%',
            background: 'radial-gradient(circle,#fff4d2 0%,#ffd26c 54%,#ff9d3c 100%)',
            borderRadius: '50%', boxShadow: '0 0 38px 13px rgba(255,180,80,0.6)',
          }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '21%', background: 'linear-gradient(180deg,#bb5c3a 0%,#6e3550 100%)' }}>
            <div style={{ position: 'absolute', inset: '0 46%', background: 'linear-gradient(180deg,rgba(255,212,124,0.85),transparent)' }} />
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
