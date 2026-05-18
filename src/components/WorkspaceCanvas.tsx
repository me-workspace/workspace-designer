'use client';

import type { WorkspaceSelection, Chair as ChairType } from '@/types';

interface Props {
  selection: WorkspaceSelection;
}

export default function WorkspaceCanvas({ selection }: Props) {
  const { desk, chair, accessories } = selection;
  const monitorQty = accessories['monitor']?.quantity ?? 0;
  const hasLamp    = (accessories['lamp']?.quantity    ?? 0) > 0;
  const plantQty   = accessories['plant']?.quantity    ?? 0;
  const hasWebcam  = (accessories['webcam']?.quantity  ?? 0) > 0;
  const hasHub     = (accessories['hub']?.quantity     ?? 0) > 0;
  const hasCharger = (accessories['charger']?.quantity ?? 0) > 0;
  const isEmpty = !desk && !chair;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#EAE4DA' }}>

      {/* Wall */}
      <div style={{
        position: 'absolute', inset: '0 0 44% 0',
        background: 'linear-gradient(180deg, #ECE6DC 0%, #E0D9CE 100%)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.018) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
        }} />
      </div>

      {/* Floor */}
      <div style={{
        position: 'absolute', inset: '56% 0 0 0',
        background: 'linear-gradient(180deg, #D5CEBC 0%, #C8C0AC 100%)',
      }}>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            position: 'absolute', left: 0, right: 0,
            top: `${i * 22 + 4}%`, height: '1px',
            background: 'rgba(0,0,0,0.05)',
          }} />
        ))}
      </div>

      {/* Baseboard */}
      <div style={{
        position: 'absolute', inset: '55% 0 auto 0', height: '3px',
        background: '#B8B0A0',
      }} />
      <div style={{
        position: 'absolute', inset: '56.2% 0 auto 0', height: '7px',
        background: 'linear-gradient(180deg, #C4BEB0 0%, #B8B2A4 100%)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }} />

      {/* Window */}
      <Window />

      {/* Wall art */}
      <div style={{
        position: 'absolute', top: '6%', left: '5%',
        width: '7%', height: '0', paddingBottom: '9%',
        border: '3px solid #C0B8AC', borderRadius: '2px',
        background: '#F0E8DC',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, #D4A855 0%, #8B6534 100%)',
          opacity: 0.55,
        }} />
        <div style={{
          position: 'absolute', top: '30%', left: '15%', right: '15%', height: '2px',
          background: 'rgba(255,255,255,0.3)',
        }} />
      </div>

      {/* Empty state */}
      {isEmpty && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: 56, marginBottom: 14, opacity: 0.18 }}>🏝</div>
          <p style={{ color: '#9A8E80', fontWeight: 600, fontSize: 15 }}>Your workspace is empty</p>
          <p style={{ color: '#B0A494', fontSize: 13, marginTop: 5 }}>← Choose a desk to get started</p>
        </div>
      )}

      {/* Rug */}
      {(desk || chair) && (
        <div style={{
          position: 'absolute',
          left: '20%', right: '20%',
          top: '56%', height: '30%',
          background: '#C8C0B4',
          borderRadius: '50%',
          opacity: 0.45,
          filter: 'blur(4px)',
        }} />
      )}

      {/* Desk */}
      {desk && (
        <div className="animate-float-in" style={{
          position: 'absolute',
          left: desk.style === 'lshaped' ? '6%' : '10%',
          right: desk.style === 'lshaped' ? '3%' : '10%',
          top: '24%', height: '38%',
        }}>
          {/* Surface */}
          <div style={{
            position: 'absolute', inset: 0,
            borderRadius: '14px 14px 8px 8px',
            background: `linear-gradient(175deg, ${desk.surfaceColor} 0%, ${desk.edgeColor} 100%)`,
            boxShadow: '0 12px 50px rgba(26,21,16,0.28), 0 4px 12px rgba(26,21,16,0.18)',
            overflow: 'hidden',
          }}>
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} style={{
                position: 'absolute', left: 0, right: 0,
                top: `${8 + i * 10}%`, height: '1px',
                background: `${desk.grainColor}50`,
              }} />
            ))}

            {/* Items */}
            <div style={{ position: 'absolute', inset: '3% 3% 3% 3%' }}>
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
                <div className="animate-float-in" style={{
                  position: 'absolute', left: '50%', width: '26%',
                  top: '2%', height: '65%',
                }}>
                  <MonitorItem hasWebcam={hasWebcam} />
                </div>
              )}
              {monitorQty >= 3 && (
                <div className="animate-float-in" style={{
                  position: 'absolute', right: hasLamp ? '14%' : '1%', width: '16%',
                  top: '8%', height: '50%',
                }}>
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
                  position: 'absolute',
                  right: hasLamp ? '25%' : '13%',
                  bottom: '6%', width: '9%', height: '17%',
                }}>
                  <ChargerItem />
                </div>
              )}
            </div>
          </div>

          {/* Front edge */}
          <div style={{
            position: 'absolute', left: 0, right: 0,
            bottom: '-10px', height: '11px',
            background: desk.edgeColor,
            borderRadius: '0 0 5px 5px',
            boxShadow: '0 6px 20px rgba(26,21,16,0.22)',
          }} />

          {/* Legs */}
          <DeskLeg side="left"  color={desk.edgeColor} isStanding={desk.style === 'standing'} />
          <DeskLeg side="right" color={desk.edgeColor} isStanding={desk.style === 'standing'} />

          {/* Standing motor bar */}
          {desk.style === 'standing' && (
            <div style={{
              position: 'absolute', left: '30%', right: '30%',
              bottom: '-22px', height: '9px',
              background: '#888', borderRadius: '3px',
            }} />
          )}
        </div>
      )}

      {/* L-shaped return */}
      {desk?.style === 'lshaped' && (
        <div className="animate-float-in" style={{
          position: 'absolute',
          right: '3%', width: '20%',
          top: '24%', height: '22%',
          background: `linear-gradient(175deg, ${desk.surfaceColor} 0%, ${desk.edgeColor} 100%)`,
          borderRadius: '12px 12px 0 0',
          boxShadow: '0 8px 30px rgba(26,21,16,0.2)',
        }} />
      )}

      {/* Chair — always positioned at bottom, never overlaps desk */}
      {chair && (
        <div className="animate-float-in" style={{
          position: 'absolute',
          bottom: '5%',
          left: '50%', transform: 'translateX(-50%)',
          width: '17%', height: '25%',
        }}>
          <ChairItem chair={chair} />
        </div>
      )}

      {/* Caption */}
      {(desk || chair) && (
        <div style={{
          position: 'absolute', bottom: 6, left: 0, right: 0,
          textAlign: 'center',
        }}>
          <span style={{ fontSize: 11, color: '#9A8E80', letterSpacing: '0.07em' }}>
            {[
              desk?.name,
              chair?.name,
              monitorQty > 0 ? `${monitorQty}× Monitor` : '',
              hasLamp ? 'Lamp' : '',
              plantQty > 0 ? `${plantQty}× Plant` : '',
            ].filter(Boolean).join('  ·  ')}
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ─── */

function Window() {
  return (
    <div style={{
      position: 'absolute', top: '5%', right: '6%',
      width: '15%', height: '0', paddingBottom: '24%',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        border: '3px solid #A8BBC4',
        borderRadius: '8px 8px 4px 4px',
        background: '#BFCFD8',
        boxShadow: 'inset 0 0 24px rgba(180,210,225,0.4), 0 4px 20px rgba(0,0,0,0.1)',
        overflow: 'hidden',
      }}>
        {/* Sky */}
        <div style={{
          position: 'absolute', inset: 3,
          background: 'linear-gradient(180deg, #89CFED 0%, #B4E0E8 55%, #C8EDD8 100%)',
          borderRadius: '5px 5px 2px 2px',
          overflow: 'hidden',
        }}>
          {/* Sun */}
          <div style={{
            position: 'absolute', top: '10%', right: '18%',
            width: '18%', height: '0', paddingBottom: '18%',
            background: '#FFF0A0',
            borderRadius: '50%',
            boxShadow: '0 0 14px #FFE44070',
          }} />
          {/* Clouds */}
          <div style={{
            position: 'absolute', top: '22%', left: '5%',
            width: '35%', height: '12%',
            background: 'rgba(255,255,255,0.7)',
            borderRadius: '20px',
          }} />
          {/* Palm silhouette */}
          <div style={{
            position: 'absolute', bottom: '15%', left: '-4%',
            width: '55%', height: '42%',
            background: '#2D6A3A',
            clipPath: 'polygon(0 100%, 12% 5%, 25% 100%, 38% 8%, 52% 100%, 65% 12%, 100% 100%)',
            opacity: 0.72,
          }} />
        </div>
        {/* Window bars */}
        <div style={{ position: 'absolute', top: '49%', left: 0, right: 0, height: '2px', background: '#A8BBC4' }} />
        <div style={{ position: 'absolute', left: '49%', top: 0, bottom: 0, width: '2px', background: '#A8BBC4' }} />
      </div>
      {/* Sill */}
      <div style={{
        position: 'absolute', bottom: '-7px', left: '-6px', right: '-6px',
        height: '7px', background: '#C4BCB0', borderRadius: '0 0 4px 4px',
      }} />
    </div>
  );
}

function DeskLeg({ side, color, isStanding }: { side: 'left' | 'right'; color: string; isStanding: boolean }) {
  return (
    <div style={{
      position: 'absolute',
      [side]: '5%',
      bottom: '-36px',
      width: '2.5%', height: isStanding ? '34px' : '28px',
      background: color,
      borderRadius: '0 0 4px 4px',
    }} />
  );
}

function MonitorItem({ hasWebcam, small }: { hasWebcam?: boolean; small?: boolean }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Bezel */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '74%',
        background: '#1A1A1A',
        borderRadius: small ? '3px' : '5px',
        boxShadow: '0 6px 24px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.3)',
      }}>
        {/* Screen */}
        <div style={{
          position: 'absolute', top: '7%', left: '5%', right: '5%', bottom: '7%',
          background: 'linear-gradient(155deg, #1E3A5F 0%, #0D2040 100%)',
          borderRadius: '2px', overflow: 'hidden',
        }}>
          <div style={{ padding: '10% 8%' }}>
            {[78, 52, 65, 42, 58, 33].map((w, i) => (
              <div key={i} style={{
                height: '9%', width: `${w}%`, marginBottom: '7%',
                background: ['#3A6A9A','#2A5A8A','#1E4A7A','#3A6A9A','#486AAA','#2A5A8A'][i],
                borderRadius: '2px', opacity: 0.7,
              }} />
            ))}
          </div>
          <div style={{
            position: 'absolute', left: '12%', top: '40%',
            width: '2px', height: '11%',
            background: '#58D4FF', opacity: 0.9,
          }} />
        </div>
      </div>
      {/* Webcam */}
      {hasWebcam && (
        <div style={{
          position: 'absolute', top: '-5%', left: '50%',
          transform: 'translateX(-50%)',
          width: '10%', height: '0', paddingBottom: '10%',
          background: '#222', borderRadius: '50%', border: '1px solid #444',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '25%', left: '25%',
            width: '50%', height: '50%',
            background: '#FF3333', borderRadius: '50%',
          }} />
        </div>
      )}
      {/* Stand */}
      <div style={{
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        bottom: '14%', width: '12%', height: '14%',
        background: '#2A2A2A',
      }} />
      {/* Base */}
      <div style={{
        position: 'absolute', left: '24%', right: '24%', bottom: '2%',
        height: '10%', background: '#1A1A1A', borderRadius: '3px',
      }} />
    </div>
  );
}

function LampItem() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Glow spread */}
      <div style={{
        position: 'absolute', top: '24%', left: '-80%', right: '-80%', height: '35%',
        background: 'radial-gradient(ellipse, rgba(255,224,60,0.22) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      {/* Shade */}
      <div style={{
        position: 'absolute', top: '4%', left: '-25%', right: '-25%', height: '20%',
        background: 'linear-gradient(180deg, #FFE840 0%, #FFD010 100%)',
        borderRadius: '50%',
        boxShadow: '0 3px 14px rgba(255,215,30,0.45)',
      }} />
      {/* Vertical arm */}
      <div style={{
        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        top: '23%', width: '11%', height: '38%',
        background: '#AAAAAA', borderRadius: '2px',
      }} />
      {/* Horizontal arm */}
      <div style={{
        position: 'absolute', left: '30%', top: '58%',
        width: '40%', height: '9%',
        background: '#AAAAAA', borderRadius: '2px',
        transform: 'rotate(-10deg)',
      }} />
      {/* Base */}
      <div style={{
        position: 'absolute', left: '14%', right: '14%', bottom: '3%',
        height: '13%',
        background: 'linear-gradient(180deg, #999 0%, #888 100%)',
        borderRadius: '4px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
      }} />
    </div>
  );
}

function PlantItem({ small }: { small?: boolean }) {
  const s = small ? 0.8 : 1;
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Leaves cluster */}
      <div style={{ position: 'absolute', top: '2%', left: '-18%', right: '-18%', height: '58%' }}>
        <div style={{
          position: 'absolute', bottom: 0, left: '14%', right: '14%', height: '72%',
          background: '#2D8B45', borderRadius: '50%',
          boxShadow: '0 4px 12px rgba(0,0,0,0.22)',
        }} />
        <div style={{ position: 'absolute', bottom: '18%', left: '-4%', right: '38%', height: '62%', background: '#38A455', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '18%', left: '38%', right: '-4%', height: '62%', background: '#38A455', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '44%', left: '18%', right: '18%', height: '56%', background: '#44B460', borderRadius: '50%' }} />
      </div>
      {/* Pot */}
      <div style={{
        position: 'absolute', bottom: '2%', left: '18%', right: '18%', height: '36%',
        background: 'linear-gradient(180deg, #C97830 0%, #A05020 100%)',
        clipPath: 'polygon(6% 0%, 94% 0%, 100% 100%, 0% 100%)',
        borderRadius: '0 0 4px 4px',
      }} />
      <div style={{
        position: 'absolute', bottom: '34%', left: '12%', right: '12%', height: '7%',
        background: '#D88840', borderRadius: '2px',
      }} />
    </div>
  );
}

function KeyboardItem() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #ECEAE2 0%, #DEDAD2 100%)',
      borderRadius: '5px',
      boxShadow: '0 3px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.5)',
      padding: '7% 5%',
      display: 'grid',
      gridTemplateRows: 'repeat(3, 1fr)',
      gap: '10%',
    }}>
      {[12, 11, 10].map((keys, row) => (
        <div key={row} style={{ display: 'grid', gridTemplateColumns: `repeat(${keys}, 1fr)`, gap: '7%' }}>
          {Array.from({ length: keys }, (_, i) => (
            <div key={i} style={{ background: '#C8C4BC', borderRadius: '2px', boxShadow: '0 1px 0 #B0ACA4' }} />
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
      background: 'linear-gradient(175deg, #E4E0D8 0%, #CCCAC2 100%)',
      borderRadius: '50% 50% 42% 42% / 60% 60% 40% 40%',
      boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
    }}>
      <div style={{
        position: 'absolute', top: '14%', left: '32%', right: '32%', height: '28%',
        background: '#B8B4AC', borderRadius: '2px',
      }} />
    </div>
  );
}

function HubItem() {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #3C3C3C 0%, #282828 100%)',
      borderRadius: '5px',
      boxShadow: '0 3px 10px rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: '0 10%',
    }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width: '20%', height: '40%', background: '#555', borderRadius: '2px' }} />
      ))}
      <div style={{
        position: 'absolute', right: '7%',
        width: '11%', height: '11%',
        background: '#00E5A0', borderRadius: '50%',
        boxShadow: '0 0 6px #00E5A080',
      }} />
    </div>
  );
}

function ChargerItem() {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(180deg, #3A3A3A 0%, #282828 100%)',
      borderRadius: '50%',
      boxShadow: '0 3px 10px rgba(0,0,0,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        width: '44%', height: '44%',
        background: 'radial-gradient(circle, #00E5FF 0%, #006688 100%)',
        borderRadius: '50%', opacity: 0.75,
      }} />
    </div>
  );
}

function ChairItem({ chair }: { chair: ChairType }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Shadow */}
      <div style={{
        position: 'absolute', bottom: '-6%', left: '8%', right: '8%', height: '12%',
        background: 'rgba(0,0,0,0.14)', borderRadius: '50%', filter: 'blur(5px)',
      }} />

      {/* Back */}
      {chair.style === 'mesh' && (
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: '44%',
          background: chair.backColor, borderRadius: '10px 10px 5px 5px',
          boxShadow: '0 4px 18px rgba(0,0,0,0.3)', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: '5px',
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(255,255,255,0.07) 5px, rgba(255,255,255,0.07) 6px), repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(255,255,255,0.07) 5px, rgba(255,255,255,0.07) 6px)`,
          }} />
        </div>
      )}
      {chair.style === 'leather' && (
        <div style={{
          position: 'absolute', top: 0, left: '6%', right: '6%', height: '47%',
          background: `linear-gradient(180deg, ${chair.backColor} 0%, ${chair.seatColor} 100%)`,
          borderRadius: '12px 12px 6px 6px',
          boxShadow: '0 4px 18px rgba(0,0,0,0.3)',
        }}>
          {[[28,32],[72,32],[50,58],[28,76],[72,76]].map(([x,y],i) => (
            <div key={i} style={{
              position: 'absolute', left: `${x}%`, top: `${y}%`,
              width: '9%', height: '11%',
              background: 'rgba(0,0,0,0.18)', borderRadius: '50%',
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
          boxShadow: '0 4px 18px rgba(0,0,0,0.3)',
        }}>
          <div style={{
            position: 'absolute', bottom: '25%', left: '10%', right: '10%', height: '8%',
            background: 'rgba(255,255,255,0.1)', borderRadius: '4px',
          }} />
        </div>
      )}

      {/* Seat */}
      <div style={{
        position: 'absolute', top: '38%', left: '5%', right: '5%', height: '40%',
        background: `linear-gradient(155deg, ${chair.seatColor} 0%, ${chair.baseColor} 100%)`,
        borderRadius: '10px',
        boxShadow: '0 6px 22px rgba(0,0,0,0.28)',
      }}>
        <div style={{
          position: 'absolute', top: '8%', left: '10%', right: '10%', height: '24%',
          background: 'rgba(255,255,255,0.07)', borderRadius: '6px',
        }} />
      </div>

      {/* Armrests */}
      <div style={{ position: 'absolute', left: '0', top: '44%', width: '9%', height: '26%', background: chair.backColor, borderRadius: '4px' }} />
      <div style={{ position: 'absolute', right: '0', top: '44%', width: '9%', height: '26%', background: chair.backColor, borderRadius: '4px' }} />

      {/* Base star */}
      <div style={{ position: 'absolute', bottom: '2%', left: '50%', transform: 'translateX(-50%)', width: '82%', height: '18%' }}>
        <svg viewBox="0 0 100 36" style={{ width: '100%', height: '100%' }}>
          {[-64,-32,0,32,64].map((a, i) => {
            const r = (a * Math.PI) / 180;
            return <line key={i} x1="50" y1="18" x2={50 + Math.cos(r)*44} y2={18 + Math.sin(r)*14} stroke={chair.baseColor} strokeWidth="7" strokeLinecap="round" />;
          })}
          <circle cx="50" cy="18" r="8" fill={chair.baseColor} />
          {[-64,-32,0,32,64].map((a, i) => {
            const r = (a * Math.PI) / 180;
            return <circle key={i} cx={50 + Math.cos(r)*44} cy={18 + Math.sin(r)*14} r="5" fill="#505050" />;
          })}
        </svg>
      </div>
    </div>
  );
}
