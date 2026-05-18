import type { DeviceSpec } from '@/model/types';

/* Draws a device from its DeviceSpec. Fills its container. */
export default function DeviceGlyph({ spec }: { spec: DeviceSpec }) {
  const p = spec.primaryColor;
  const a = spec.accentColor;
  switch (spec.glyph) {
    case 'monitor':  return <Monitor p={p} a={a} />;
    case 'keyboard': return <Keyboard p={p} a={a} />;
    case 'mouse':    return <Mouse p={p} a={a} />;
    case 'lamp':     return <Lamp p={p} a={a} />;
    case 'plant':    return <Plant p={p} a={a} />;
    case 'webcam':   return <Webcam p={p} a={a} />;
    case 'hub':      return <Hub p={p} a={a} />;
    case 'charger':  return <Charger p={p} a={a} />;
    default:         return <Generic p={p} a={a} />;
  }
}

type GP = { p: string; a: string };

function Monitor({ p, a }: GP) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', top: '5%', left: '-10%', right: '-10%', height: '70%', background: `radial-gradient(ellipse,${a}1f 0%,transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '74%', background: p, borderRadius: '5px', boxShadow: '0 8px 28px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)' }}>
        <div style={{ position: 'absolute', top: '6%', left: '4%', right: '4%', bottom: '6%', background: 'linear-gradient(160deg,#0d1a0d,#091409)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ padding: '8% 10%' }}>
            {[45, 72, 58, 38, 65, 30].map((w, i) => (
              <div key={i} style={{ height: '9%', width: `${w}%`, marginBottom: '7%', background: i % 3 === 0 ? a : `${a}66`, borderRadius: '1px', opacity: 0.6 }} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '14%', width: '12%', height: '14%', background: '#2a2a2e' }} />
      <div style={{ position: 'absolute', left: '24%', right: '24%', bottom: '2%', height: '10%', background: '#1e1e22', borderRadius: '3px' }} />
    </div>
  );
}

function Keyboard({ p, a }: GP) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: `linear-gradient(180deg,${p} 0%,#1e1e22 100%)`,
      borderRadius: '5px', boxShadow: '0 3px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
      padding: '7% 5%', display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: '10%',
    }}>
      {[12, 11, 10].map((keys, row) => (
        <div key={row} style={{ display: 'grid', gridTemplateColumns: `repeat(${keys}, 1fr)`, gap: '7%' }}>
          {Array.from({ length: keys }, (_, i) => (
            <div key={i} style={{ background: a, borderRadius: '2px', boxShadow: '0 1px 0 #181820' }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function Mouse({ p, a }: GP) {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: `linear-gradient(175deg,${p} 0%,#1e1e24 100%)`,
      borderRadius: '50% 50% 40% 40% / 55% 55% 40% 40%', boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    }}>
      <div style={{ position: 'absolute', top: '14%', left: '32%', right: '32%', height: '26%', background: a, borderRadius: '2px' }} />
    </div>
  );
}

function Lamp({ p, a }: GP) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', top: '20%', left: '-90%', right: '-90%', height: '38%', background: `radial-gradient(ellipse, ${a}29 0%, transparent 65%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '4%', left: '-22%', right: '-22%', height: '18%', background: `linear-gradient(180deg,${a} 0%,#ffcc10 100%)`, borderRadius: '50%', boxShadow: `0 0 18px ${a}8c` }} />
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '22%', width: '10%', height: '38%', background: p, borderRadius: '2px' }} />
      <div style={{ position: 'absolute', left: '28%', top: '56%', width: '42%', height: '9%', background: p, borderRadius: '2px', transform: 'rotate(-12deg)' }} />
      <div style={{ position: 'absolute', left: '14%', right: '14%', bottom: '3%', height: '12%', background: '#222228', borderRadius: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }} />
    </div>
  );
}

function Plant({ p, a }: GP) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', top: '2%', left: '-16%', right: '-16%', height: '58%' }}>
        <div style={{ position: 'absolute', bottom: 0, left: '14%', right: '14%', height: '72%', background: '#1a5c28', borderRadius: '50%', boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }} />
        <div style={{ position: 'absolute', bottom: '18%', left: '-4%', right: '38%', height: '62%', background: a, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '18%', left: '38%', right: '-4%', height: '62%', background: a, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '44%', left: '18%', right: '18%', height: '56%', background: p, borderRadius: '50%' }} />
      </div>
      <div style={{ position: 'absolute', bottom: '2%', left: '18%', right: '18%', height: '36%', background: 'linear-gradient(180deg,#3a2010 0%,#281408 100%)', clipPath: 'polygon(6% 0%, 94% 0%, 100% 100%, 0% 100%)' }} />
      <div style={{ position: 'absolute', bottom: '34%', left: '12%', right: '12%', height: '6%', background: '#4a2818', borderRadius: '2px' }} />
    </div>
  );
}

function Webcam({ p, a }: GP) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', bottom: 0, left: '22%', right: '22%', height: '28%', background: p, borderRadius: '2px' }} />
      <div style={{ position: 'absolute', top: '6%', left: 0, right: 0, height: '64%', background: p, borderRadius: '42%', border: '1px solid #2a2a30' }}>
        <div style={{ position: 'absolute', inset: '28%', background: a, borderRadius: '50%', opacity: 0.85, boxShadow: `0 0 6px ${a}` }} />
      </div>
    </div>
  );
}

function Hub({ p, a }: GP) {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: `linear-gradient(180deg,${p} 0%,#18181e 100%)`, borderRadius: '5px',
      boxShadow: '0 3px 10px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 10%',
    }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: '20%', height: '38%', background: '#2c2c34', borderRadius: '2px' }} />
      ))}
      <div style={{ position: 'absolute', right: '7%', width: '10%', height: '10%', background: a, borderRadius: '50%', boxShadow: `0 0 8px ${a}80` }} />
    </div>
  );
}

function Charger({ p, a }: GP) {
  return (
    <div style={{
      width: '100%', height: '100%', background: `linear-gradient(180deg,${p} 0%,#18181e 100%)`,
      borderRadius: '50%', boxShadow: '0 3px 10px rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ width: '42%', height: '42%', background: `radial-gradient(circle, ${a} 0%, #008840 100%)`, borderRadius: '50%', opacity: 0.6, boxShadow: `0 0 8px ${a}40` }} />
    </div>
  );
}

function Generic({ p, a }: GP) {
  return (
    <div style={{ width: '100%', height: '100%', background: `linear-gradient(180deg,${p},#161618)`, borderRadius: '4px', boxShadow: '0 3px 10px rgba(0,0,0,0.5)', border: `1px solid ${a}33` }} />
  );
}
