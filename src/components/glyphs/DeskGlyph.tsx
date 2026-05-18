import type { DeskSpec } from '@/model/types';

/* Draws a desk from a DeskSpec. Fills its container absolutely.
   The surface occupies the top 83%; legs the bottom 17%.        */
export default function DeskGlyph({ spec }: { spec: DeskSpec }) {
  const { shape, height, legStyle, surfaceColor, edgeColor, grainColor } = spec;
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {(shape === 'l-shaped' || shape === 'u-shaped') && (
        <ReturnPanel side="right" surface={surfaceColor} edge={edgeColor} />
      )}
      {shape === 'u-shaped' && (
        <ReturnPanel side="left" surface={surfaceColor} edge={edgeColor} />
      )}

      {/* Surface */}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 0, bottom: '17%',
        borderRadius: '12px 12px 6px 6px',
        background: `linear-gradient(170deg,${surfaceColor} 0%,${edgeColor} 100%)`,
        boxShadow: '0 18px 52px rgba(0,0,0,0.7), 0 4px 14px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}>
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: `${8 + i * 10}%`, height: '1px', background: `${grainColor}40` }} />
        ))}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '34%', background: 'linear-gradient(180deg,rgba(255,205,140,0.2),transparent)' }} />
      </div>

      {/* Front edge */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: '13%', height: '5%', background: edgeColor, borderRadius: '0 0 4px 4px', boxShadow: '0 10px 24px rgba(0,0,0,0.6)' }} />

      <Legs style={legStyle} color={edgeColor} standing={height === 'standing'} />
    </div>
  );
}

function ReturnPanel({ side, surface, edge }: { side: 'left' | 'right'; surface: string; edge: string }) {
  return (
    <div style={{
      position: 'absolute', top: '-12%', height: '30%', width: '26%',
      ...(side === 'right' ? { right: '1%' } : { left: '1%' }),
      background: `linear-gradient(170deg,${surface},${edge})`,
      borderRadius: '8px 8px 3px 3px',
      boxShadow: '0 10px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
    }} />
  );
}

function Legs({ style, color, standing }: { style: DeskSpec['legStyle']; color: string; standing: boolean }) {
  const top = '83%';
  const crossbar = standing && (
    <div style={{ position: 'absolute', left: '33%', right: '33%', top: '90%', height: '4%', background: '#2a2118', borderRadius: '2px' }} />
  );

  if (style === 'pillar') {
    return (
      <>
        <div style={{ position: 'absolute', left: '42%', right: '42%', top, bottom: '3%', background: color, borderRadius: '0 0 3px 3px' }} />
        <div style={{ position: 'absolute', left: '28%', right: '28%', bottom: 0, height: '3%', background: color, borderRadius: '3px' }} />
        {crossbar}
      </>
    );
  }
  if (style === 'hairpin') {
    return (
      <>
        {['9%', '88%'].map((l, i) => (
          <div key={i} style={{ position: 'absolute', left: l, top, bottom: '1%', width: '1.8%', background: color, borderRadius: '2px' }} />
        ))}
        {crossbar}
      </>
    );
  }
  if (style === 'a-frame') {
    return (
      <>
        <div style={{ position: 'absolute', left: '6%', top, bottom: '1%', width: '10%', background: color, clipPath: 'polygon(0 0,100% 100%,0 100%)' }} />
        <div style={{ position: 'absolute', right: '6%', top, bottom: '1%', width: '10%', background: color, clipPath: 'polygon(100% 0,100% 100%,0 100%)' }} />
        {crossbar}
      </>
    );
  }
  // panel
  return (
    <>
      {['7%', '89%'].map((l, i) => (
        <div key={i} style={{ position: 'absolute', left: l, top, bottom: '1%', width: '4%', background: color, borderRadius: '0 0 3px 3px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} />
      ))}
      {crossbar}
    </>
  );
}
