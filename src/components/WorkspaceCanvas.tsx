'use client';

import type { WorkspaceSelection, Chair as ChairType } from '@/types';

interface Props {
  selection: WorkspaceSelection;
  qty?: number;
}

const G = '#4ade80'; // brand green — plants, screens, accent

/* ── Office floor layout ──
   Desks fan out into the room as a pyramid: one hero in front,
   widening rows receding toward the horizon.                       */
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
    const d = R === 1 ? 0 : r / (R - 1);          // depth: 0 = front, 1 = horizon
    const span = 70 - d * 6;                       // back rows pull in slightly
    for (let i = 0; i < n; i++) {
      const x = n === 1 ? 50 : 50 + (i - (n - 1) / 2) * (span / n);
      slots.push({ d, x, idx: idx++ });
    }
  });
  return slots;
}

export default function WorkspaceCanvas({ selection, qty = 1 }: Props) {
  const { desk, chair, accessories } = selection;
  const isEmpty = !desk && !chair;
  const slots = buildSlots(qty).sort((a, b) => b.d - a.d); // paint back-to-front
  const baseH = qty === 1 ? 74 : 60;

  const monitorQty = accessories['monitor']?.quantity ?? 0;
  const plantQty = accessories['plant']?.quantity ?? 0;
  const hasLamp = (accessories['lamp']?.quantity ?? 0) > 0;
  const caption = [
    desk && `${desk.name} desk`,
    chair && `${chair.name} chair`,
    monitorQty > 0 && `${monitorQty}× monitor`,
    hasLamp && 'lamp',
    plantQty > 0 && `${plantQty}× plant`,
  ].filter(Boolean).join('   ·   ');

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      overflow: 'hidden', borderRadius: 12, background: '#0e0a07',
    }}>

      {/* ───── Room: wall ───── */}
      <div style={{ position: 'absolute', inset: '0 0 63% 0', background: 'linear-gradient(180deg,#241b14 0%,#1a130d 100%)' }}>
        {/* warm wash spilling from the window */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 82% 6%, rgba(255,150,70,0.26) 0%, transparent 62%)' }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,200,150,0.016) 1px,transparent 1px),linear-gradient(90deg,rgba(255,200,150,0.016) 1px,transparent 1px)',
          backgroundSize: '58px 58px',
        }} />
      </div>

      {/* ───── Horizon ───── */}
      <div style={{ position: 'absolute', top: '37%', left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(255,165,85,0.55),transparent)' }} />
      <div style={{ position: 'absolute', top: '37%', left: 0, right: 0, height: '13%', background: 'linear-gradient(180deg,rgba(255,140,60,0.12),transparent)', pointerEvents: 'none' }} />

      {/* ───── Room: floor ───── */}
      <div style={{ position: 'absolute', inset: '37% 0 0 0', background: 'linear-gradient(180deg,#17110b 0%,#0b0805 100%)' }}>
        <PerspectiveFloor />
        {/* warm light pool */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% -4%, rgba(255,150,70,0.16) 0%, transparent 56%)' }} />
      </div>

      {/* Baseboard */}
      <div style={{ position: 'absolute', top: '36.3%', left: 0, right: 0, height: '7px', background: 'linear-gradient(180deg,#2c2117,#1a130d)' }} />

      {/* Window + wall art */}
      <SunsetWindow />
      <WallArt />

      {/* Sun beam raking across the room */}
      <div style={{
        position: 'absolute', top: 0, right: '4%', width: '52%', height: '100%',
        background: 'linear-gradient(202deg, rgba(255,170,90,0.13) 0%, transparent 44%)',
        transform: 'skewX(-13deg)', transformOrigin: 'top right', pointerEvents: 'none',
      }} />

      {/* ───── Empty state ───── */}
      {isEmpty && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 60 }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%',
            border: '1.5px solid rgba(255,170,90,0.32)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16, color: 'rgba(255,180,100,0.75)', fontSize: 24,
          }}>+</div>
          <p style={{ color: '#e0cdb0', fontWeight: 600, fontSize: 14, letterSpacing: '0.02em' }}>Start designing your studio</p>
          <p style={{ color: '#7c6650', fontSize: 12, marginTop: 5 }}>← Pick a desk to begin</p>
        </div>
      )}

      {/* ───── Workstations on the floor ───── */}
      {!isEmpty && slots.map(s => {
        const scale = 0.42 + Math.pow(1 - s.d, 1.4) * 0.58;     // front 1.0 → horizon 0.42
        const bottom = 2.5 + (1 - Math.pow(1 - s.d, 1.85)) * 36; // front low → horizon high
        const blur = s.d > 0.62 ? (s.d - 0.62) * 4 : 0;          // atmospheric haze
        return (
          <div key={s.idx} style={{
            position: 'absolute', left: `${s.x}%`, bottom: `${bottom}%`,
            height: `${baseH}%`, aspectRatio: '1.18',
            transform: `translateX(-50%) scale(${scale})`, transformOrigin: 'bottom center',
            zIndex: Math.round((1 - s.d) * 100) + 10,
            filter: `brightness(${1 - s.d * 0.3}) saturate(${1 - s.d * 0.22})${blur ? ` blur(${blur}px)` : ''}`,
          }}>
            <div className="animate-rise-in" style={{ position: 'relative', width: '100%', height: '100%', animationDelay: `${s.idx * 0.06}s` }}>
              <Workstation selection={selection} />
            </div>
          </div>
        );
      })}

      {/* ───── Office badge ───── */}
      {qty > 1 && !isEmpty && (
        <div style={{
          position: 'absolute', top: 12, left: 12, zIndex: 200,
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(20,14,9,0.82)', backdropFilter: 'blur(6px)',
          border: '1px solid rgba(255,170,90,0.28)', borderRadius: 8, padding: '5px 11px',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: G, boxShadow: `0 0 6px ${G}` }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#ffce8a', letterSpacing: '0.04em' }}>
            Office for {qty} · {qty} identical setups
          </span>
        </div>
      )}

      {/* ───── Caption ───── */}
      {!isEmpty && caption && (
        <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center', zIndex: 200, pointerEvents: 'none' }}>
          <span style={{ fontSize: 10, color: '#9a8268', letterSpacing: '0.07em' }}>{caption}</span>
        </div>
      )}

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 250, boxShadow: 'inset 0 0 90px rgba(0,0,0,0.55)' }} />
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
          {/* clouds */}
          {[[16, 16, 32], [58, 11, 26], [34, 27, 22]].map(([x, y, w], i) => (
            <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${w}%`, height: '3.5%', background: 'rgba(80,36,54,0.5)', borderRadius: '10px' }} />
          ))}
          {/* sun */}
          <div className="animate-sun-glow" style={{
            position: 'absolute', bottom: '21%', left: '50%', transform: 'translateX(-50%)',
            width: '38%', height: 0, paddingBottom: '38%',
            background: 'radial-gradient(circle,#fff4d2 0%,#ffd26c 54%,#ff9d3c 100%)',
            borderRadius: '50%', boxShadow: '0 0 38px 13px rgba(255,180,80,0.6)',
          }} />
          {/* sea */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '21%', background: 'linear-gradient(180deg,#bb5c3a 0%,#6e3550 100%)' }}>
            <div style={{ position: 'absolute', inset: '0 46%', background: 'linear-gradient(180deg,rgba(255,212,124,0.85),transparent)' }} />
          </div>
          {/* palm silhouettes */}
          <div style={{
            position: 'absolute', bottom: '16%', left: '-6%', width: '46%', height: '40%',
            background: '#1c0f12',
            clipPath: 'polygon(0 100%, 14% 6%, 27% 100%, 40% 10%, 54% 100%, 67% 12%, 100% 100%)',
          }} />
        </div>
        {/* mullions */}
        <div style={{ position: 'absolute', top: '49%', left: '3px', right: '3px', height: '3px', background: '#2c2118' }} />
        <div style={{ position: 'absolute', left: '49%', top: '3px', bottom: '3px', width: '3px', background: '#2c2118' }} />
      </div>
      {/* sill */}
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

/* ════════ One full workstation (desk + accessories + chair) ════════ */

function Workstation({ selection }: { selection: WorkspaceSelection }) {
  const { desk, chair, accessories } = selection;
  const monitorQty = accessories['monitor']?.quantity ?? 0;
  const hasLamp = (accessories['lamp']?.quantity ?? 0) > 0;
  const plantQty = accessories['plant']?.quantity ?? 0;
  const hasWebcam = (accessories['webcam']?.quantity ?? 0) > 0;
  const hasHub = (accessories['hub']?.quantity ?? 0) > 0;
  const hasCharger = (accessories['charger']?.quantity ?? 0) > 0;

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* contact shadow */}
      <div style={{ position: 'absolute', bottom: '-2%', left: '7%', right: '7%', height: '10%', background: 'radial-gradient(ellipse,rgba(0,0,0,0.62) 0%,transparent 70%)' }} />

      {/* ── Desk ── */}
      {desk && (
        <div style={{ position: 'absolute', left: '1%', right: '1%', top: 0, height: '53%' }}>
          {/* L-shaped raised return */}
          {desk.style === 'lshaped' && (
            <div style={{
              position: 'absolute', right: '3%', top: '-13%', width: '28%', height: '30%',
              background: `linear-gradient(170deg,${desk.surfaceColor},${desk.edgeColor})`,
              borderRadius: '8px 8px 3px 3px',
              boxShadow: '0 10px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
            }} />
          )}

          {/* Surface (clipped — wood grain) */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '12px 12px 6px 6px',
            background: `linear-gradient(170deg,${desk.surfaceColor} 0%,${desk.edgeColor} 100%)`,
            boxShadow: '0 18px 52px rgba(0,0,0,0.7), 0 4px 14px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
            overflow: 'hidden',
          }}>
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: `${8 + i * 10}%`, height: '1px', background: `${desk.grainColor}40` }} />
            ))}
            {/* warm rim light from the window */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '34%', background: 'linear-gradient(180deg,rgba(255,205,140,0.2),transparent)' }} />
          </div>

          {/* Desk items */}
          <div style={{ position: 'absolute', inset: '3%' }}>
            {plantQty >= 1 && (
              <div className="animate-scale-in" style={{ position: 'absolute', left: '1%', top: '3%', width: '10%', height: '68%' }}>
                <PlantItem />
              </div>
            )}
            {plantQty >= 2 && (
              <div className="animate-scale-in" style={{ position: 'absolute', left: '12%', top: '8%', width: '8%', height: '55%' }}>
                <PlantItem small />
              </div>
            )}
            {monitorQty >= 1 && (
              <div className="animate-float-in" style={{ position: 'absolute', left: monitorQty >= 2 ? '22%' : '28%', width: monitorQty >= 2 ? '26%' : '44%', top: '2%', height: '65%' }}>
                <MonitorItem hasWebcam={hasWebcam && monitorQty === 1} />
              </div>
            )}
            {monitorQty >= 2 && (
              <div className="animate-float-in" style={{ position: 'absolute', left: '50%', width: '26%', top: '2%', height: '65%' }}>
                <MonitorItem hasWebcam={hasWebcam} />
              </div>
            )}
            {monitorQty >= 3 && (
              <div className="animate-float-in" style={{ position: 'absolute', right: hasLamp ? '14%' : '1%', width: '16%', top: '8%', height: '50%' }}>
                <MonitorItem small />
              </div>
            )}
            {hasLamp && (
              <div className="animate-float-in" style={{ position: 'absolute', right: '0%', top: '2%', width: '12%', height: '78%' }}>
                <LampItem />
              </div>
            )}
            {hasHub && (
              <div className="animate-scale-in" style={{ position: 'absolute', left: '1%', bottom: '2%', width: '14%', height: '22%' }}>
                <HubItem />
              </div>
            )}
            <div style={{ position: 'absolute', left: '22%', right: '18%', bottom: '4%', height: '23%' }}>
              <KeyboardItem />
            </div>
            <div style={{ position: 'absolute', right: hasLamp ? '13%' : '2%', bottom: '5%', width: '10%', height: '20%' }}>
              <MouseItem />
            </div>
            {hasCharger && (
              <div className="animate-scale-in" style={{ position: 'absolute', right: hasLamp ? '25%' : '13%', bottom: '6%', width: '9%', height: '17%' }}>
                <ChargerItem />
              </div>
            )}
          </div>

          {/* Front edge */}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: '-7%', height: '7%', background: desk.edgeColor, borderRadius: '0 0 4px 4px', boxShadow: '0 10px 24px rgba(0,0,0,0.6)' }} />

          {/* Legs */}
          {['7%', 'calc(93% - 3%)'].map((left, i) => (
            <div key={i} style={{
              position: 'absolute', left, bottom: desk.style === 'standing' ? '-32%' : '-26%',
              width: '3%', height: desk.style === 'standing' ? '32%' : '26%',
              background: desk.edgeColor, borderRadius: '0 0 3px 3px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }} />
          ))}
          {desk.style === 'standing' && (
            <div style={{ position: 'absolute', left: '32%', right: '32%', bottom: '-21%', height: '7%', background: '#2a2118', borderRadius: '3px' }} />
          )}
        </div>
      )}

      {/* ── Chair ── */}
      {chair && (
        <div style={{ position: 'absolute', bottom: '1%', left: '50%', transform: 'translateX(-50%)', width: '23%', height: '49%' }}>
          <ChairItem chair={chair} />
        </div>
      )}
    </div>
  );
}

/* ════════ Desk items ════════ */

function MonitorItem({ hasWebcam, small }: { hasWebcam?: boolean; small?: boolean }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', top: '5%', left: '-10%', right: '-10%', height: '70%', background: 'radial-gradient(ellipse at 50% 50%, rgba(74,222,128,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '74%',
        background: '#1a1a1e', borderRadius: small ? '3px' : '5px',
        boxShadow: '0 8px 28px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
      }}>
        <div style={{ position: 'absolute', top: '6%', left: '4%', right: '4%', bottom: '6%', background: 'linear-gradient(160deg,#0d1a0d 0%,#091409 100%)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ padding: '8% 10%' }}>
            {[
              { w: 45, c: G }, { w: 72, c: '#2a6a4a' }, { w: 58, c: '#2a4a3a' },
              { w: 38, c: G }, { w: 65, c: '#2a6a4a' }, { w: 30, c: '#1a3a2a' },
            ].map(({ w, c }, i) => (
              <div key={i} style={{ height: '9%', width: `${w}%`, marginBottom: '7%', background: c, borderRadius: '1px', opacity: 0.6 }} />
            ))}
          </div>
          <div style={{ position: 'absolute', left: '13%', top: '40%', width: '1.5px', height: '11%', background: G, opacity: 0.9 }} />
        </div>
      </div>
      {hasWebcam && (
        <div style={{ position: 'absolute', top: '-4%', left: '50%', transform: 'translateX(-50%)', width: '9%', height: 0, paddingBottom: '9%', background: '#151518', borderRadius: '50%', border: '1px solid #2a2a30', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '28%', left: '28%', width: '44%', height: '44%', background: G, borderRadius: '50%', opacity: 0.7 }} />
        </div>
      )}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '14%', width: '12%', height: '14%', background: '#2a2a2e' }} />
      <div style={{ position: 'absolute', left: '24%', right: '24%', bottom: '2%', height: '10%', background: '#1e1e22', borderRadius: '3px' }} />
    </div>
  );
}

function LampItem() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', top: '20%', left: '-90%', right: '-90%', height: '38%', background: 'radial-gradient(ellipse, rgba(255,220,100,0.16) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '4%', left: '-22%', right: '-22%', height: '18%', background: 'linear-gradient(180deg,#ffe850 0%,#ffcc10 100%)', borderRadius: '50%', boxShadow: '0 0 18px rgba(255,220,40,0.55)' }} />
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '22%', width: '10%', height: '38%', background: '#2a2a32', borderRadius: '2px' }} />
      <div style={{ position: 'absolute', left: '28%', top: '56%', width: '42%', height: '9%', background: '#2a2a32', borderRadius: '2px', transform: 'rotate(-12deg)' }} />
      <div style={{ position: 'absolute', left: '14%', right: '14%', bottom: '3%', height: '12%', background: '#222228', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }} />
    </div>
  );
}

function PlantItem({ small }: { small?: boolean }) {
  void small;
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', top: '2%', left: '-16%', right: '-16%', height: '58%' }}>
        <div style={{ position: 'absolute', bottom: 0, left: '14%', right: '14%', height: '72%', background: '#1a5c28', borderRadius: '50%', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }} />
        <div style={{ position: 'absolute', bottom: '18%', left: '-4%', right: '38%', height: '62%', background: '#1e7030', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '18%', left: '38%', right: '-4%', height: '62%', background: '#1e7030', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '44%', left: '18%', right: '18%', height: '56%', background: '#2a8838', borderRadius: '50%' }} />
      </div>
      <div style={{ position: 'absolute', bottom: '2%', left: '18%', right: '18%', height: '36%', background: 'linear-gradient(180deg,#3a2010 0%,#281408 100%)', clipPath: 'polygon(6% 0%, 94% 0%, 100% 100%, 0% 100%)' }} />
      <div style={{ position: 'absolute', bottom: '34%', left: '12%', right: '12%', height: '6%', background: '#4a2818', borderRadius: '2px' }} />
    </div>
  );
}

function KeyboardItem() {
  return (
    <div style={{
      width: '100%', height: '100%', background: 'linear-gradient(180deg,#252528 0%,#1e1e22 100%)',
      borderRadius: '5px', boxShadow: '0 3px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
      padding: '7% 5%', display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: '10%',
    }}>
      {[12, 11, 10].map((keys, row) => (
        <div key={row} style={{ display: 'grid', gridTemplateColumns: `repeat(${keys}, 1fr)`, gap: '7%' }}>
          {Array.from({ length: keys }, (_, i) => (
            <div key={i} style={{ background: '#2e2e34', borderRadius: '2px', boxShadow: '0 1px 0 #181820' }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function MouseItem() {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: 'linear-gradient(175deg,#2a2a2f 0%,#1e1e24 100%)',
      borderRadius: '50% 50% 40% 40% / 55% 55% 40% 40%', boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    }}>
      <div style={{ position: 'absolute', top: '14%', left: '32%', right: '32%', height: '26%', background: '#1a1a1f', borderRadius: '2px' }} />
    </div>
  );
}

function HubItem() {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: 'linear-gradient(180deg,#222228 0%,#18181e 100%)', borderRadius: '5px',
      boxShadow: '0 3px 10px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 10%',
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: '20%', height: '38%', background: '#2c2c34', borderRadius: '2px' }} />
      ))}
      <div style={{ position: 'absolute', right: '7%', width: '10%', height: '10%', background: G, borderRadius: '50%', boxShadow: `0 0 8px ${G}80` }} />
    </div>
  );
}

function ChargerItem() {
  return (
    <div style={{
      width: '100%', height: '100%', background: 'linear-gradient(180deg,#222228 0%,#18181e 100%)',
      borderRadius: '50%', boxShadow: '0 3px 10px rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ width: '42%', height: '42%', background: `radial-gradient(circle, ${G} 0%, #008840 100%)`, borderRadius: '50%', opacity: 0.6, boxShadow: `0 0 8px ${G}40` }} />
    </div>
  );
}

function ChairItem({ chair }: { chair: ChairType }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', bottom: '-5%', left: '10%', right: '10%', height: '10%', background: 'rgba(0,0,0,0.25)', borderRadius: '50%', filter: 'blur(5px)' }} />
      {chair.style === 'mesh' && (
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '44%', background: chair.backColor, borderRadius: '10px 10px 5px 5px', boxShadow: '0 4px 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: '5px', backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(255,255,255,0.05) 5px, rgba(255,255,255,0.05) 6px), repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(255,255,255,0.05) 5px, rgba(255,255,255,0.05) 6px)' }} />
        </div>
      )}
      {chair.style === 'leather' && (
        <div style={{ position: 'absolute', top: 0, left: '6%', right: '6%', height: '47%', background: `linear-gradient(180deg,${chair.backColor} 0%,${chair.seatColor} 100%)`, borderRadius: '12px 12px 6px 6px', boxShadow: '0 4px 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)' }}>
          {[[28, 32], [72, 32], [50, 56], [28, 75], [72, 75]].map(([x, y], i) => (
            <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: '9%', height: '11%', background: 'rgba(0,0,0,0.2)', borderRadius: '50%', transform: 'translate(-50%,-50%)' }} />
          ))}
        </div>
      )}
      {chair.style === 'ergonomic' && (
        <div style={{ position: 'absolute', top: 0, left: '8%', right: '8%', height: '46%', background: chair.backColor, borderRadius: '40% 40% 20% 20% / 30% 30% 14% 14%', boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
          <div style={{ position: 'absolute', bottom: '24%', left: '10%', right: '10%', height: '7%', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }} />
        </div>
      )}
      <div style={{ position: 'absolute', top: '38%', left: '5%', right: '5%', height: '40%', background: `linear-gradient(155deg,${chair.seatColor} 0%,${chair.baseColor} 100%)`, borderRadius: '10px', boxShadow: '0 6px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)' }}>
        <div style={{ position: 'absolute', top: '8%', left: '10%', right: '10%', height: '22%', background: 'rgba(255,255,255,0.05)', borderRadius: '5px' }} />
      </div>
      <div style={{ position: 'absolute', left: 0, top: '44%', width: '9%', height: '26%', background: chair.backColor, borderRadius: '4px' }} />
      <div style={{ position: 'absolute', right: 0, top: '44%', width: '9%', height: '26%', background: chair.backColor, borderRadius: '4px' }} />
      <div style={{ position: 'absolute', bottom: '2%', left: '50%', transform: 'translateX(-50%)', width: '82%', height: '18%' }}>
        <svg viewBox="0 0 100 36" style={{ width: '100%', height: '100%' }}>
          {[-64, -32, 0, 32, 64].map((a, i) => {
            const r = (a * Math.PI) / 180;
            return <line key={i} x1="50" y1="18" x2={50 + Math.cos(r) * 44} y2={18 + Math.sin(r) * 14} stroke={chair.baseColor} strokeWidth="7" strokeLinecap="round" />;
          })}
          <circle cx="50" cy="18" r="8" fill={chair.baseColor} />
          {[-64, -32, 0, 32, 64].map((a, i) => {
            const r = (a * Math.PI) / 180;
            return <circle key={i} cx={50 + Math.cos(r) * 44} cy={18 + Math.sin(r) * 14} r="5" fill="#3a3a3a" />;
          })}
        </svg>
      </div>
    </div>
  );
}
