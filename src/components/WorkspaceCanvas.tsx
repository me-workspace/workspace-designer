'use client';

import type { WorkspaceSelection, Chair as ChairType } from '@/types';

interface Props {
  selection: WorkspaceSelection;
  qty?: number;
}

const G = '#4ade80'; // accent green

export default function WorkspaceCanvas({ selection, qty = 1 }: Props) {
  const { desk, chair, accessories } = selection;
  const monitorQty = accessories['monitor']?.quantity ?? 0;
  const hasLamp    = (accessories['lamp']?.quantity    ?? 0) > 0;
  const plantQty   = accessories['plant']?.quantity    ?? 0;
  const hasWebcam  = (accessories['webcam']?.quantity  ?? 0) > 0;
  const hasHub     = (accessories['hub']?.quantity     ?? 0) > 0;
  const hasCharger = (accessories['charger']?.quantity ?? 0) > 0;
  const isEmpty = !desk && !chair;

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: '#0d0d10',
      backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
      overflow: 'hidden',
      borderRadius: '12px',
    }}>

      {/* Stage spotlight */}
      <div style={{
        position: 'absolute', top: '-20%', left: '15%', right: '15%', height: '80%',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Wall */}
      <div style={{
        position: 'absolute', inset: '0 0 42% 0',
        background: 'linear-gradient(180deg, #111116 0%, #0e0e13 100%)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }} />
      </div>

      {/* Floor */}
      <div style={{
        position: 'absolute', inset: '58% 0 0 0',
        background: 'linear-gradient(180deg, #0a0a0d 0%, #080808 100%)',
      }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            position: 'absolute', left: 0, right: 0,
            top: `${i * 26 + 6}%`, height: '1px',
            background: 'rgba(255,255,255,0.03)',
          }} />
        ))}
      </div>

      {/* Baseboard */}
      <div style={{ position: 'absolute', inset: '55.5% 0 auto 0', height: '2px', background: '#1f1f26' }} />
      <div style={{ position: 'absolute', inset: '57% 0 auto 0', height: '8px', background: 'linear-gradient(180deg, #1a1a20 0%, #141418 100%)' }} />

      {/* Window */}
      <DarkWindow />

      {/* Wall art */}
      <div style={{
        position: 'absolute', top: '5%', left: '4.5%',
        width: '6%', height: '0', paddingBottom: '8%',
        border: '2px solid #2a2a32', borderRadius: '2px',
        background: '#161620', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: '4px', background: 'linear-gradient(135deg, #1a2a3a 0%, #0a1020 100%)', opacity: 0.8 }} />
        <div style={{ position: 'absolute', top: '35%', left: '15%', right: '15%', height: '1px', background: G, opacity: 0.3 }} />
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            border: `1.5px solid #2c2c34`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 16, color: '#3c3c44', fontSize: 22,
          }}>+</div>
          <p style={{ color: '#52525b', fontWeight: 600, fontSize: 14, letterSpacing: '0.02em' }}>Start designing</p>
          <p style={{ color: '#3f3f46', fontSize: 12, marginTop: 5 }}>← Pick a desk to begin</p>
        </div>
      )}

      {/* Rug */}
      {(desk || chair) && (
        <div style={{
          position: 'absolute', left: '22%', right: '22%',
          top: '56%', height: '28%',
          background: 'rgba(74,222,128,0.04)',
          borderRadius: '50%',
          filter: 'blur(8px)',
        }} />
      )}

      {/* Desk */}
      {desk && (
        <div className="animate-float-in" style={{
          position: 'absolute',
          left: desk.style === 'lshaped' ? '6%' : '10%',
          right: desk.style === 'lshaped' ? '3%' : '10%',
          top: '24%', height: '37%',
        }}>
          {/* Surface */}
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '12px 12px 6px 6px',
            background: `linear-gradient(170deg, ${desk.surfaceColor} 0%, ${desk.edgeColor} 100%)`,
            boxShadow: `0 16px 60px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)`,
            overflow: 'hidden',
          }}>
            {/* Wood grain */}
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} style={{
                position: 'absolute', left: 0, right: 0,
                top: `${8 + i * 10}%`, height: '1px',
                background: `${desk.grainColor}40`,
              }} />
            ))}

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
                <div className="animate-float-in" style={{
                  position: 'absolute',
                  left: monitorQty >= 2 ? '22%' : '28%',
                  width: monitorQty >= 2 ? '26%' : '44%',
                  top: '2%', height: '65%',
                }}>
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
                <div className="animate-scale-in" style={{
                  position: 'absolute', right: hasLamp ? '25%' : '13%', bottom: '6%', width: '9%', height: '17%',
                }}>
                  <ChargerItem />
                </div>
              )}
            </div>
          </div>

          {/* Front edge */}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: '-9px', height: '10px',
            background: desk.edgeColor,
            borderRadius: '0 0 4px 4px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          }} />

          {/* Legs */}
          {['5%', 'calc(95% - 2.5%)'].map((left, i) => (
            <div key={i} style={{
              position: 'absolute', left, bottom: '-36px',
              width: '2.5%', height: desk.style === 'standing' ? '34px' : '28px',
              background: desk.edgeColor,
              borderRadius: '0 0 3px 3px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }} />
          ))}

          {desk.style === 'standing' && (
            <div style={{
              position: 'absolute', left: '30%', right: '30%', bottom: '-22px',
              height: '9px', background: '#2a2a30', borderRadius: '3px',
            }} />
          )}
        </div>
      )}

      {/* L-shaped return */}
      {desk?.style === 'lshaped' && (
        <div className="animate-float-in" style={{
          position: 'absolute', right: '3%', width: '20%', top: '24%', height: '22%',
          background: `linear-gradient(170deg, ${desk.surfaceColor} 0%, ${desk.edgeColor} 100%)`,
          borderRadius: '10px 10px 0 0',
          boxShadow: '0 10px 30px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        }} />
      )}

      {/* Chair */}
      {chair && (
        <div className="animate-float-in" style={{
          position: 'absolute', bottom: '5%',
          left: '50%', transform: 'translateX(-50%)',
          width: '17%', height: '25%',
        }}>
          <ChairItem chair={chair} />
        </div>
      )}

      {/* Quantity badge */}
      {qty > 1 && (
        <div style={{
          position: 'absolute', top: 12, right: 12,
          background: 'rgba(74,222,128,0.12)',
          border: '1px solid rgba(74,222,128,0.3)',
          borderRadius: '6px',
          padding: '4px 10px',
          fontSize: 11, fontWeight: 700,
          color: G, letterSpacing: '0.06em',
        }}>
          ×{qty} WORKSPACES
        </div>
      )}

      {/* Caption */}
      {(desk || chair) && (
        <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center' }}>
          <span style={{ fontSize: 10, color: '#52525b', letterSpacing: '0.08em' }}>
            {[desk?.name, chair?.name, monitorQty > 0 ? `${monitorQty}× Monitor` : '', hasLamp ? 'Lamp' : '', plantQty > 0 ? `${plantQty}× Plant` : '']
              .filter(Boolean).join('  ·  ')}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function DarkWindow() {
  return (
    <div style={{
      position: 'absolute', top: '4%', right: '5.5%',
      width: '14%', height: '0', paddingBottom: '22%',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        border: '2px solid #252530', borderRadius: '6px 6px 3px 3px',
        background: '#0a1828', overflow: 'hidden',
        boxShadow: 'inset 0 0 30px rgba(100,180,240,0.08), 0 0 40px rgba(100,180,240,0.04)',
      }}>
        {/* Night sky */}
        <div style={{
          position: 'absolute', inset: 2,
          background: 'linear-gradient(180deg, #05101e 0%, #0a1828 40%, #0d2010 100%)',
          borderRadius: '4px 4px 2px 2px', overflow: 'hidden',
        }}>
          {/* Stars */}
          {[[15,12],[30,8],[55,15],[70,6],[85,20],[42,5],[62,25]].map(([x,y],i) => (
            <div key={i} style={{
              position: 'absolute', left: `${x}%`, top: `${y}%`,
              width: 1.5, height: 1.5,
              background: 'rgba(255,255,255,0.7)', borderRadius: '50%',
            }} />
          ))}
          {/* Moon */}
          <div style={{
            position: 'absolute', top: '8%', right: '15%',
            width: '18%', height: '0', paddingBottom: '18%',
            background: '#e8e0c8', borderRadius: '50%',
            boxShadow: '0 0 10px rgba(232,224,200,0.4)',
          }} />
          {/* Palm silhouette */}
          <div style={{
            position: 'absolute', bottom: '18%', left: '-5%',
            width: '55%', height: '40%',
            background: '#0a1a0a',
            clipPath: 'polygon(0 100%, 12% 5%, 25% 100%, 38% 8%, 52% 100%, 65% 10%, 100% 100%)',
          }} />
          {/* City lights glow at horizon */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '22%',
            background: 'linear-gradient(0deg, rgba(255,140,40,0.12) 0%, transparent 100%)',
          }} />
        </div>
        {/* Window bars */}
        <div style={{ position: 'absolute', top: '49%', left: 0, right: 0, height: '2px', background: '#1e1e28' }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '49%', width: '2px', background: '#1e1e28' }} />
      </div>
      {/* Sill */}
      <div style={{
        position: 'absolute', bottom: '-6px', left: '-5px', right: '-5px',
        height: '6px', background: '#1a1a22', borderRadius: '0 0 3px 3px',
      }} />
    </div>
  );
}

function MonitorItem({ hasWebcam, small }: { hasWebcam?: boolean; small?: boolean }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Screen glow */}
      <div style={{
        position: 'absolute', top: '5%', left: '-10%', right: '-10%', height: '70%',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(74,222,128,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Bezel */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '74%',
        background: '#1a1a1e',
        borderRadius: small ? '3px' : '5px',
        boxShadow: '0 8px 28px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
      }}>
        {/* Screen */}
        <div style={{
          position: 'absolute', top: '6%', left: '4%', right: '4%', bottom: '6%',
          background: 'linear-gradient(160deg, #0d1a0d 0%, #091409 100%)',
          borderRadius: '2px', overflow: 'hidden',
        }}>
          {/* Code lines with green tint */}
          <div style={{ padding: '8% 10%' }}>
            {[
              { w: 45, c: G },
              { w: 72, c: '#2a6a4a' },
              { w: 58, c: '#2a4a3a' },
              { w: 38, c: G },
              { w: 65, c: '#2a6a4a' },
              { w: 30, c: '#1a3a2a' },
            ].map(({ w, c }, i) => (
              <div key={i} style={{
                height: '9%', width: `${w}%`, marginBottom: '7%',
                background: c, borderRadius: '1px', opacity: 0.6,
              }} />
            ))}
          </div>
          <div style={{
            position: 'absolute', left: '13%', top: '40%',
            width: '1.5px', height: '11%',
            background: G, opacity: 0.9,
          }} />
        </div>
      </div>
      {/* Webcam */}
      {hasWebcam && (
        <div style={{
          position: 'absolute', top: '-4%', left: '50%',
          transform: 'translateX(-50%)',
          width: '9%', height: '0', paddingBottom: '9%',
          background: '#151518', borderRadius: '50%',
          border: '1px solid #2a2a30', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '28%', left: '28%',
            width: '44%', height: '44%',
            background: G, borderRadius: '50%', opacity: 0.7,
          }} />
        </div>
      )}
      <div style={{
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        bottom: '14%', width: '12%', height: '14%',
        background: '#2a2a2e',
      }} />
      <div style={{
        position: 'absolute', left: '24%', right: '24%', bottom: '2%',
        height: '10%', background: '#1e1e22', borderRadius: '3px',
      }} />
    </div>
  );
}

function LampItem() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{
        position: 'absolute', top: '20%', left: '-90%', right: '-90%', height: '38%',
        background: 'radial-gradient(ellipse, rgba(255,220,100,0.14) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '4%', left: '-22%', right: '-22%', height: '18%',
        background: 'linear-gradient(180deg, #ffe850 0%, #ffcc10 100%)',
        borderRadius: '50%',
        boxShadow: '0 0 18px rgba(255,220,40,0.5)',
      }} />
      <div style={{
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        top: '22%', width: '10%', height: '38%',
        background: '#2a2a32', borderRadius: '2px',
      }} />
      <div style={{
        position: 'absolute', left: '28%', top: '56%',
        width: '42%', height: '9%',
        background: '#2a2a32', borderRadius: '2px',
        transform: 'rotate(-12deg)',
      }} />
      <div style={{
        position: 'absolute', left: '14%', right: '14%', bottom: '3%',
        height: '12%', background: '#222228', borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
      }} />
    </div>
  );
}

function PlantItem({ small }: { small?: boolean }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', top: '2%', left: '-16%', right: '-16%', height: '58%' }}>
        <div style={{ position: 'absolute', bottom: 0, left: '14%', right: '14%', height: '72%', background: '#1a5c28', borderRadius: '50%', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }} />
        <div style={{ position: 'absolute', bottom: '18%', left: '-4%', right: '38%', height: '62%', background: '#1e7030', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '18%', left: '38%', right: '-4%', height: '62%', background: '#1e7030', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '44%', left: '18%', right: '18%', height: '56%', background: '#2a8838', borderRadius: '50%' }} />
      </div>
      <div style={{
        position: 'absolute', bottom: '2%', left: '18%', right: '18%', height: '36%',
        background: 'linear-gradient(180deg, #3a2010 0%, #281408 100%)',
        clipPath: 'polygon(6% 0%, 94% 0%, 100% 100%, 0% 100%)',
      }} />
      <div style={{ position: 'absolute', bottom: '34%', left: '12%', right: '12%', height: '6%', background: '#4a2818', borderRadius: '2px' }} />
    </div>
  );
}

function KeyboardItem() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #252528 0%, #1e1e22 100%)',
      borderRadius: '5px',
      boxShadow: '0 3px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
      padding: '7% 5%',
      display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: '10%',
    }}>
      {[12,11,10].map((keys, row) => (
        <div key={row} style={{ display: 'grid', gridTemplateColumns: `repeat(${keys}, 1fr)`, gap: '7%' }}>
          {Array.from({ length: keys }, (_, i) => (
            <div key={i} style={{
              background: '#2e2e34',
              borderRadius: '2px',
              boxShadow: '0 1px 0 #181820',
            }} />
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
      background: 'linear-gradient(175deg, #2a2a2f 0%, #1e1e24 100%)',
      borderRadius: '50% 50% 40% 40% / 55% 55% 40% 40%',
      boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    }}>
      <div style={{
        position: 'absolute', top: '14%', left: '32%', right: '32%', height: '26%',
        background: '#1a1a1f', borderRadius: '2px',
      }} />
    </div>
  );
}

function HubItem() {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #222228 0%, #18181e 100%)',
      borderRadius: '5px',
      boxShadow: '0 3px 10px rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '0 10%',
    }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width: '20%', height: '38%', background: '#2c2c34', borderRadius: '2px' }} />
      ))}
      <div style={{
        position: 'absolute', right: '7%',
        width: '10%', height: '10%',
        background: G, borderRadius: '50%',
        boxShadow: `0 0 8px ${G}80`,
      }} />
    </div>
  );
}

function ChargerItem() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #222228 0%, #18181e 100%)',
      borderRadius: '50%',
      boxShadow: '0 3px 10px rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: '42%', height: '42%',
        background: `radial-gradient(circle, ${G} 0%, #008840 100%)`,
        borderRadius: '50%', opacity: 0.6,
        boxShadow: `0 0 8px ${G}40`,
      }} />
    </div>
  );
}

function ChairItem({ chair }: { chair: ChairType }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{
        position: 'absolute', bottom: '-5%', left: '10%', right: '10%', height: '10%',
        background: 'rgba(0,0,0,0.25)', borderRadius: '50%', filter: 'blur(5px)',
      }} />
      {chair.style === 'mesh' && (
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: '44%',
          background: chair.backColor, borderRadius: '10px 10px 5px 5px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: '5px',
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(255,255,255,0.05) 5px, rgba(255,255,255,0.05) 6px), repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(255,255,255,0.05) 5px, rgba(255,255,255,0.05) 6px)`,
          }} />
        </div>
      )}
      {chair.style === 'leather' && (
        <div style={{
          position: 'absolute', top: 0, left: '6%', right: '6%', height: '47%',
          background: `linear-gradient(180deg, ${chair.backColor} 0%, ${chair.seatColor} 100%)`,
          borderRadius: '12px 12px 6px 6px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        }}>
          {[[28,32],[72,32],[50,56],[28,75],[72,75]].map(([x,y],i) => (
            <div key={i} style={{
              position: 'absolute', left: `${x}%`, top: `${y}%`,
              width: '9%', height: '11%', background: 'rgba(0,0,0,0.2)', borderRadius: '50%',
              transform: 'translate(-50%,-50%)',
            }} />
          ))}
        </div>
      )}
      {chair.style === 'ergonomic' && (
        <div style={{
          position: 'absolute', top: 0, left: '8%', right: '8%', height: '46%',
          background: chair.backColor,
          borderRadius: '40% 40% 20% 20% / 30% 30% 14% 14%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
        }}>
          <div style={{ position: 'absolute', bottom: '24%', left: '10%', right: '10%', height: '7%', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }} />
        </div>
      )}
      <div style={{
        position: 'absolute', top: '38%', left: '5%', right: '5%', height: '40%',
        background: `linear-gradient(155deg, ${chair.seatColor} 0%, ${chair.baseColor} 100%)`,
        borderRadius: '10px',
        boxShadow: '0 6px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
      }}>
        <div style={{ position: 'absolute', top: '8%', left: '10%', right: '10%', height: '22%', background: 'rgba(255,255,255,0.05)', borderRadius: '5px' }} />
      </div>
      <div style={{ position: 'absolute', left: '0', top: '44%', width: '9%', height: '26%', background: chair.backColor, borderRadius: '4px' }} />
      <div style={{ position: 'absolute', right: '0', top: '44%', width: '9%', height: '26%', background: chair.backColor, borderRadius: '4px' }} />
      <div style={{ position: 'absolute', bottom: '2%', left: '50%', transform: 'translateX(-50%)', width: '82%', height: '18%' }}>
        <svg viewBox="0 0 100 36" style={{ width: '100%', height: '100%' }}>
          {[-64,-32,0,32,64].map((a, i) => {
            const r = (a * Math.PI) / 180;
            return <line key={i} x1="50" y1="18" x2={50 + Math.cos(r)*44} y2={18 + Math.sin(r)*14} stroke={chair.baseColor} strokeWidth="7" strokeLinecap="round" />;
          })}
          <circle cx="50" cy="18" r="8" fill={chair.baseColor} />
          {[-64,-32,0,32,64].map((a, i) => {
            const r = (a * Math.PI) / 180;
            return <circle key={i} cx={50 + Math.cos(r)*44} cy={18 + Math.sin(r)*14} r="5" fill="#3a3a3a" />;
          })}
        </svg>
      </div>
    </div>
  );
}
