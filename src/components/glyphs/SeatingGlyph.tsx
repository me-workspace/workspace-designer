import type { SeatingSpec } from '@/model/types';

/* Draws a chair from a SeatingSpec. Fills its container absolutely. */
export default function SeatingGlyph({ spec }: { spec: SeatingSpec }) {
  const { style, seatColor, backColor, baseColor, hasArmrests, hasHeadrest } = spec;
  const hasBack = style !== 'stool';

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {/* contact shadow */}
      <div style={{ position: 'absolute', bottom: '-5%', left: '10%', right: '10%', height: '10%', background: 'rgba(0,0,0,0.28)', borderRadius: '50%', filter: 'blur(5px)' }} />

      {/* headrest */}
      {hasHeadrest && hasBack && (
        <div style={{ position: 'absolute', top: '-7%', left: '32%', right: '32%', height: '11%', background: backColor, borderRadius: '8px', boxShadow: '0 3px 12px rgba(0,0,0,0.5)' }} />
      )}

      {/* backrest */}
      {hasBack && <Back style={style} seatColor={seatColor} backColor={backColor} />}

      {/* armrests */}
      {hasArmrests && hasBack && (
        <>
          <div style={{ position: 'absolute', left: 0, top: '44%', width: '9%', height: '26%', background: backColor, borderRadius: '4px' }} />
          <div style={{ position: 'absolute', right: 0, top: '44%', width: '9%', height: '26%', background: backColor, borderRadius: '4px' }} />
        </>
      )}

      {/* seat */}
      <div style={{
        position: 'absolute', left: '5%', right: '5%',
        top: hasBack ? '38%' : '22%',
        height: style === 'lounge' ? '44%' : '40%',
        background: `linear-gradient(155deg,${seatColor} 0%,${baseColor} 100%)`,
        borderRadius: style === 'lounge' ? '14px' : '10px',
        boxShadow: '0 6px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)',
      }}>
        <div style={{ position: 'absolute', top: '8%', left: '10%', right: '10%', height: '22%', background: 'rgba(255,255,255,0.05)', borderRadius: '5px' }} />
      </div>

      <Base style={style} color={baseColor} />
    </div>
  );
}

function Back({ style, seatColor, backColor }: { style: SeatingSpec['style']; seatColor: string; backColor: string }) {
  if (style === 'mesh') {
    return (
      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '44%', background: backColor, borderRadius: '10px 10px 5px 5px', boxShadow: '0 4px 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: '5px', backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(255,255,255,0.05) 5px, rgba(255,255,255,0.05) 6px), repeating-linear-gradient(90deg, transparent, transparent 5px, rgba(255,255,255,0.05) 5px, rgba(255,255,255,0.05) 6px)' }} />
      </div>
    );
  }
  if (style === 'leather') {
    return (
      <div style={{ position: 'absolute', top: 0, left: '6%', right: '6%', height: '47%', background: `linear-gradient(180deg,${backColor} 0%,${seatColor} 100%)`, borderRadius: '12px 12px 6px 6px', boxShadow: '0 4px 20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)' }}>
        {[[28, 32], [72, 32], [50, 56], [28, 75], [72, 75]].map(([x, y], i) => (
          <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: '9%', height: '11%', background: 'rgba(0,0,0,0.2)', borderRadius: '50%', transform: 'translate(-50%,-50%)' }} />
        ))}
      </div>
    );
  }
  if (style === 'lounge') {
    return (
      <div style={{ position: 'absolute', top: '4%', left: '3%', right: '3%', height: '44%', background: `linear-gradient(180deg,${backColor},${seatColor})`, borderRadius: '20px 20px 8px 8px', boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }} />
    );
  }
  // ergonomic
  return (
    <div style={{ position: 'absolute', top: 0, left: '8%', right: '8%', height: '46%', background: backColor, borderRadius: '40% 40% 20% 20% / 30% 30% 14% 14%', boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
      <div style={{ position: 'absolute', bottom: '24%', left: '10%', right: '10%', height: '7%', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }} />
    </div>
  );
}

function Base({ style, color }: { style: SeatingSpec['style']; color: string }) {
  if (style === 'stool' || style === 'lounge') {
    return (
      <div style={{ position: 'absolute', bottom: '1%', left: '50%', transform: 'translateX(-50%)', width: '72%', height: '20%' }}>
        <svg viewBox="0 0 100 30" style={{ width: '100%', height: '100%' }}>
          {[18, 50, 82].map((x, i) => (
            <line key={i} x1="50" y1="3" x2={x} y2="27" stroke={color} strokeWidth="6" strokeLinecap="round" />
          ))}
        </svg>
      </div>
    );
  }
  // wheeled office base
  return (
    <div style={{ position: 'absolute', bottom: '2%', left: '50%', transform: 'translateX(-50%)', width: '82%', height: '18%' }}>
      <svg viewBox="0 0 100 36" style={{ width: '100%', height: '100%' }}>
        {[-64, -32, 0, 32, 64].map((a, i) => {
          const r = (a * Math.PI) / 180;
          return <line key={i} x1="50" y1="18" x2={50 + Math.cos(r) * 44} y2={18 + Math.sin(r) * 14} stroke={color} strokeWidth="7" strokeLinecap="round" />;
        })}
        <circle cx="50" cy="18" r="8" fill={color} />
        {[-64, -32, 0, 32, 64].map((a, i) => {
          const r = (a * Math.PI) / 180;
          return <circle key={i} cx={50 + Math.cos(r) * 44} cy={18 + Math.sin(r) * 14} r="5" fill="#3a3a3a" />;
        })}
      </svg>
    </div>
  );
}
