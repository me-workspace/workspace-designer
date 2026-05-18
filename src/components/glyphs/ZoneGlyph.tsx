import type { ZoneSpec } from '@/model/types';

/* Draws a zone (a furniture cluster) from a ZoneSpec. Fills its
   container; everything is bottom-anchored to sit on the floor. */
export default function ZoneGlyph({ spec }: { spec: ZoneSpec }) {
  const c = spec.palette;
  switch (spec.theme) {
    case 'coffee':   return <Coffee c={c} />;
    case 'relax':    return <Relax c={c} />;
    case 'outdoor':  return <Outdoor c={c} />;
    case 'storage':  return <Storage c={c} />;
    case 'meeting':  return <Meeting c={c} />;
    case 'wellness': return <Wellness c={c} />;
    default:         return null;
  }
}

type CP = { c: string[] };

function Shadow() {
  return <div style={{ position: 'absolute', bottom: '-3%', left: '4%', right: '4%', height: '12%', background: 'radial-gradient(ellipse,rgba(0,0,0,0.55) 0%,transparent 70%)' }} />;
}

function Coffee({ c }: CP) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Shadow />
      {/* counter */}
      <div style={{ position: 'absolute', bottom: 0, left: '8%', right: '8%', height: '38%', background: `linear-gradient(180deg,${c[0]},${c[1]})`, borderRadius: '3px', boxShadow: '0 8px 20px rgba(0,0,0,0.55)' }} />
      <div style={{ position: 'absolute', bottom: '37%', left: '5%', right: '5%', height: '5%', background: c[3], borderRadius: '2px' }} />
      {/* espresso machine */}
      <div style={{ position: 'absolute', bottom: '42%', left: '16%', width: '36%', height: '34%', background: `linear-gradient(180deg,${c[2]},#7e2438)`, borderRadius: '3px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
        <div style={{ position: 'absolute', bottom: '8%', left: '34%', width: '32%', height: '24%', background: '#1a1a1e', borderRadius: '0 0 2px 2px' }} />
        <div style={{ position: 'absolute', top: '14%', left: '20%', right: '20%', height: '14%', background: '#d8d2c4', borderRadius: '1px' }} />
      </div>
      {/* grinder */}
      <div style={{ position: 'absolute', bottom: '42%', right: '18%', width: '15%', height: '26%', background: c[1], borderRadius: '2px 2px 1px 1px' }} />
      {/* mugs */}
      {[0, 1, 2].map(i => (
        <div key={i} style={{ position: 'absolute', bottom: '42%', left: `${56 + i * 7}%`, width: '5%', height: '7%', background: c[3], borderRadius: '0 0 3px 3px' }} />
      ))}
    </div>
  );
}

function Relax({ c }: CP) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Shadow />
      {/* side table */}
      <div style={{ position: 'absolute', bottom: '4%', right: '2%', width: '15%', height: '20%', background: c[3], borderRadius: '2px' }} />
      <div style={{ position: 'absolute', bottom: '23%', right: '0%', width: '19%', height: '5%', background: c[2], borderRadius: '50%' }} />
      {/* backrest */}
      <div style={{ position: 'absolute', bottom: '24%', left: '4%', right: '22%', height: '40%', background: `linear-gradient(180deg,${c[0]},${c[1]})`, borderRadius: '10px 10px 4px 4px', boxShadow: '0 6px 18px rgba(0,0,0,0.5)' }} />
      {/* arms */}
      <div style={{ position: 'absolute', bottom: '10%', left: '2%', width: '12%', height: '34%', background: c[1], borderRadius: '8px 8px 3px 3px' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '66%', width: '12%', height: '34%', background: c[1], borderRadius: '8px 8px 3px 3px' }} />
      {/* seat */}
      <div style={{ position: 'absolute', bottom: '8%', left: '6%', right: '20%', height: '24%', background: c[0], borderRadius: '6px' }} />
      {/* cushions */}
      <div style={{ position: 'absolute', bottom: '30%', left: '12%', width: '20%', height: '18%', background: c[2], borderRadius: '5px', transform: 'rotate(-8deg)' }} />
      <div style={{ position: 'absolute', bottom: '30%', left: '40%', width: '20%', height: '18%', background: c[2], borderRadius: '5px', transform: 'rotate(7deg)' }} />
    </div>
  );
}

function Outdoor({ c }: CP) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Shadow />
      {/* rack posts */}
      <div style={{ position: 'absolute', bottom: 0, left: '20%', width: '6%', height: '24%', background: c[3], borderRadius: '2px' }} />
      <div style={{ position: 'absolute', bottom: 0, right: '20%', width: '6%', height: '24%', background: c[3], borderRadius: '2px' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '14%', right: '14%', height: '5%', background: c[3], borderRadius: '2px' }} />
      {/* boards leaning */}
      <div style={{ position: 'absolute', bottom: '8%', left: '26%', width: '15%', height: '88%', background: `linear-gradient(160deg,${c[0]},#b5701f)`, borderRadius: '50%', transform: 'rotate(-13deg)', transformOrigin: 'bottom center', boxShadow: '0 6px 16px rgba(0,0,0,0.5)' }}>
        <div style={{ position: 'absolute', top: '6%', bottom: '6%', left: '46%', width: '8%', background: 'rgba(255,255,255,0.25)' }} />
      </div>
      <div style={{ position: 'absolute', bottom: '8%', right: '26%', width: '15%', height: '92%', background: `linear-gradient(160deg,${c[1]},#1f6a9a)`, borderRadius: '50%', transform: 'rotate(11deg)', transformOrigin: 'bottom center', boxShadow: '0 6px 16px rgba(0,0,0,0.5)' }}>
        <div style={{ position: 'absolute', top: '6%', bottom: '6%', left: '46%', width: '8%', background: 'rgba(255,255,255,0.22)' }} />
      </div>
    </div>
  );
}

function Storage({ c }: CP) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Shadow />
      <div style={{ position: 'absolute', bottom: 0, left: '14%', right: '14%', height: '92%', background: `linear-gradient(180deg,${c[0]},${c[1]})`, borderRadius: '3px', boxShadow: '0 8px 22px rgba(0,0,0,0.55), inset 0 0 0 2px rgba(0,0,0,0.25)' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ position: 'absolute', left: '4%', right: '4%', top: `${20 + i * 26}%`, height: '3%', background: 'rgba(0,0,0,0.4)' }} />
        ))}
        {/* bins */}
        <div style={{ position: 'absolute', left: '10%', width: '34%', height: '15%', top: '4%', background: c[2], borderRadius: '2px' }} />
        <div style={{ position: 'absolute', right: '10%', width: '30%', height: '15%', top: '30%', background: c[3], borderRadius: '2px' }} />
        <div style={{ position: 'absolute', left: '12%', width: '28%', height: '15%', top: '56%', background: c[3], borderRadius: '2px' }} />
        <div style={{ position: 'absolute', right: '12%', width: '32%', height: '15%', top: '56%', background: c[2], borderRadius: '2px' }} />
      </div>
    </div>
  );
}

function Meeting({ c }: CP) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Shadow />
      {/* stools */}
      {[[14, 8], [78, 8], [46, 0]].map(([x, y], i) => (
        <div key={i} style={{ position: 'absolute', bottom: `${10 + y}%`, left: `${x}%`, width: '16%', height: '22%' }}>
          <div style={{ position: 'absolute', bottom: 0, left: '36%', width: '28%', height: '70%', background: c[3] }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: c[2], borderRadius: '50%' }} />
        </div>
      ))}
      {/* table */}
      <div style={{ position: 'absolute', bottom: '14%', left: '38%', width: '8%', height: '34%', background: c[1] }} />
      <div style={{ position: 'absolute', bottom: '38%', left: '14%', right: '14%', height: '22%', background: `linear-gradient(180deg,${c[0]},${c[1]})`, borderRadius: '50%', boxShadow: '0 8px 20px rgba(0,0,0,0.55)' }} />
    </div>
  );
}

function Wellness({ c }: CP) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <Shadow />
      {/* mat */}
      <div style={{ position: 'absolute', bottom: '6%', left: '8%', right: '26%', height: '20%', background: `linear-gradient(180deg,${c[0]},#3a6e54)`, borderRadius: '40%', boxShadow: '0 5px 14px rgba(0,0,0,0.45)' }} />
      {/* cushion */}
      <div style={{ position: 'absolute', bottom: '20%', left: '20%', width: '24%', height: '16%', background: c[2], borderRadius: '50%' }} />
      {/* plant */}
      <div style={{ position: 'absolute', bottom: '6%', right: '6%', width: '24%', height: '34%', background: c[3], borderRadius: '4px 4px 6px 6px', clipPath: 'polygon(12% 0,88% 0,100% 100%,0 100%)' }} />
      <div style={{ position: 'absolute', bottom: '34%', right: '2%', width: '32%', height: '58%' }}>
        <div style={{ position: 'absolute', bottom: 0, left: '34%', width: '12%', height: '58%', background: '#3a5a2a' }} />
        <div style={{ position: 'absolute', top: 0, left: '8%', width: '40%', height: '62%', background: c[1], borderRadius: '60% 10% 60% 10%' }} />
        <div style={{ position: 'absolute', top: '6%', right: '6%', width: '42%', height: '60%', background: c[1], borderRadius: '10% 60% 10% 60%' }} />
        <div style={{ position: 'absolute', top: '24%', left: '28%', width: '40%', height: '54%', background: '#3aa84c', borderRadius: '60% 60% 30% 30%' }} />
      </div>
    </div>
  );
}
