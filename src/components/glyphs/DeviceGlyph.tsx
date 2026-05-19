import type { DeviceSpec } from '@/model/types';

/* Draws a device from its DeviceSpec. Fills its container. */
export default function DeviceGlyph({ spec }: { spec: DeviceSpec }) {
  const p = spec.primaryColor;
  const a = spec.accentColor;
  switch (spec.glyph) {
    case 'monitor':     return <Monitor p={p} a={a} />;
    case 'keyboard':    return <Keyboard p={p} a={a} />;
    case 'mouse':       return <Mouse p={p} a={a} />;
    case 'lamp':        return <Lamp p={p} a={a} />;
    case 'plant':       return <Plant p={p} a={a} />;
    case 'webcam':      return <Webcam p={p} a={a} />;
    case 'hub':         return <Hub p={p} a={a} />;
    case 'charger':     return <Charger p={p} a={a} />;
    case 'tablet':      return <Tablet p={p} a={a} />;
    case 'laptop':      return <Laptop p={p} a={a} />;
    case 'cpu-tower':   return <CpuTower p={p} a={a} />;
    case 'dock':        return <Dock p={p} a={a} />;
    case 'speaker':     return <Speaker p={p} a={a} />;
    case 'headphones':  return <Headphones p={p} a={a} />;
    case 'key-light':   return <KeyLight p={p} a={a} />;
    case 'deskpad':     return <DeskPad p={p} a={a} />;
    case 'monitor-arm': return <MonitorArm p={p} a={a} />;
    case 'footrest':    return <Footrest p={p} a={a} />;
    case 'art':         return <Art p={p} a={a} />;
    case 'books':       return <Books p={p} a={a} />;
    case 'mug':         return <Mug p={p} a={a} />;
    default:            return <Generic p={p} a={a} />;
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

function Tablet({ p, a }: GP) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', bottom: '2%', left: '24%', right: '24%', height: '14%', background: '#222228', borderRadius: '2px', transform: 'skewX(-14deg)' }} />
      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '88%', background: p, borderRadius: '5px', boxShadow: '0 6px 18px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)' }}>
        <div style={{ position: 'absolute', inset: '6%', background: `linear-gradient(160deg,${a}cc,${a}55)`, borderRadius: '2px' }} />
      </div>
    </div>
  );
}

function Laptop({ p, a }: GP) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* riser */}
      <div style={{ position: 'absolute', bottom: 0, left: '30%', right: '30%', height: '16%', background: '#26262b', borderRadius: '2px' }} />
      {/* screen */}
      <div style={{ position: 'absolute', top: 0, left: '14%', right: '14%', height: '62%', background: p, borderRadius: '4px 4px 0 0', boxShadow: '0 6px 18px rgba(0,0,0,0.6)' }}>
        <div style={{ position: 'absolute', inset: '7%', background: `linear-gradient(160deg,${a}bb,#0d140d)`, borderRadius: '2px' }} />
      </div>
      {/* base / keyboard deck */}
      <div style={{ position: 'absolute', bottom: '14%', left: '8%', right: '8%', height: '14%', background: `linear-gradient(180deg,${a}40,${p})`, borderRadius: '2px 2px 4px 4px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }} />
    </div>
  );
}

function CpuTower({ p, a }: GP) {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: `linear-gradient(165deg,${p},#101013)`, borderRadius: '4px',
      boxShadow: '0 6px 18px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
    }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{ position: 'absolute', left: '18%', right: '18%', top: `${14 + i * 9}%`, height: '3%', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }} />
      ))}
      <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: '12%', width: '14%', height: '7%', background: a, borderRadius: '50%', boxShadow: `0 0 8px ${a}` }} />
    </div>
  );
}

function Dock({ p, a }: GP) {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: `linear-gradient(180deg,${p},#141417)`, borderRadius: '4px',
      boxShadow: '0 3px 10px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', gap: '8%', padding: '0 12%',
    }}>
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{ flex: 1, height: '30%', background: '#34343c', borderRadius: '1px' }} />
      ))}
      <div style={{ position: 'absolute', left: '8%', top: '50%', transform: 'translateY(-50%)', width: '7%', height: '24%', background: a, borderRadius: '50%', boxShadow: `0 0 6px ${a}` }} />
    </div>
  );
}

function Speaker({ p, a }: GP) {
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: `linear-gradient(165deg,${p},#141417)`, borderRadius: '4px',
      boxShadow: '0 5px 16px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
    }}>
      <div style={{ position: 'absolute', top: '8%', left: '50%', transform: 'translateX(-50%)', width: '34%', height: 0, paddingBottom: '34%', background: '#1a1a1e', borderRadius: '50%', border: `1.5px solid ${a}` }} />
      <div style={{ position: 'absolute', bottom: '12%', left: '50%', transform: 'translateX(-50%)', width: '62%', height: 0, paddingBottom: '62%', background: 'radial-gradient(circle,#26262c 30%,#121214 70%)', borderRadius: '50%', border: `2px solid ${a}99` }} />
    </div>
  );
}

function Headphones({ p, a }: GP) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', left: '46%', right: '46%', top: '24%', bottom: '6%', background: '#26262b' }} />
      <div style={{ position: 'absolute', left: '30%', right: '30%', bottom: 0, height: '8%', background: '#26262b', borderRadius: '50%' }} />
      {/* headband */}
      <div style={{ position: 'absolute', top: '4%', left: '22%', right: '22%', height: '40%', border: `3px solid ${p}`, borderBottom: 'none', borderRadius: '50% 50% 0 0' }} />
      {/* ear cups */}
      <div style={{ position: 'absolute', top: '30%', left: '14%', width: '20%', height: '24%', background: p, borderRadius: '40%', boxShadow: `inset 0 0 0 2px ${a}66` }} />
      <div style={{ position: 'absolute', top: '30%', right: '14%', width: '20%', height: '24%', background: p, borderRadius: '40%', boxShadow: `inset 0 0 0 2px ${a}66` }} />
    </div>
  );
}

function KeyLight({ p, a }: GP) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', top: '-6%', left: '-14%', right: '-14%', height: '64%', background: `radial-gradient(ellipse,${a}3a 0%,transparent 68%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '4%', left: '4%', right: '4%', height: '40%', background: `linear-gradient(180deg,#ffffff,${a})`, borderRadius: '4px', boxShadow: `0 0 16px ${a}aa, 0 0 0 2px ${p}` }} />
      <div style={{ position: 'absolute', left: '47%', right: '47%', top: '42%', height: '42%', background: p }} />
      <div style={{ position: 'absolute', left: '34%', right: '34%', bottom: '2%', height: '12%', background: p, borderRadius: '3px' }} />
    </div>
  );
}

function DeskPad({ p, a }: GP) {
  return (
    <div style={{
      width: '100%', height: '100%',
      background: `linear-gradient(160deg,${a},${p})`,
      borderRadius: '7px',
      boxShadow: '0 3px 10px rgba(0,0,0,0.4), inset 0 0 0 1.5px rgba(255,255,255,0.05)',
    }} />
  );
}

function MonitorArm({ p, a }: GP) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', bottom: 0, left: '32%', right: '32%', height: '9%', background: p, borderRadius: '2px' }} />
      <div style={{ position: 'absolute', left: '44%', right: '44%', top: '14%', bottom: '6%', background: p, borderRadius: '2px' }} />
      <div style={{ position: 'absolute', top: '16%', left: '20%', right: '12%', height: '8%', background: a, borderRadius: '3px', transform: 'rotate(-8deg)' }} />
      <div style={{ position: 'absolute', top: '4%', left: '14%', width: '24%', height: '20%', background: p, borderRadius: '2px' }} />
    </div>
  );
}

function Footrest({ p, a }: GP) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg,${a},${p})`, clipPath: 'polygon(0 100%, 14% 18%, 100% 0, 100% 100%)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} />
      {[0, 1, 2, 3].map(i => (
        <div key={i} style={{ position: 'absolute', right: `${10 + i * 20}%`, top: `${8 + i * 6}%`, width: '2px', height: '20%', background: 'rgba(255,255,255,0.08)', transform: 'rotate(20deg)' }} />
      ))}
    </div>
  );
}

function Art({ p, a }: GP) {
  return (
    <div style={{
      width: '100%', height: '100%', background: p, borderRadius: '2px',
      padding: '8%', boxShadow: '0 6px 16px rgba(0,0,0,0.55)',
    }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', background: `linear-gradient(155deg,${a} 0%,#c4455f 55%,#3a2348 100%)`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', bottom: '18%', left: '20%', width: '26%', height: '26%', background: '#ffd98a', borderRadius: '50%' }} />
      </div>
    </div>
  );
}

function Books({ p, a }: GP) {
  const spines = [
    { c: p, h: 92 }, { c: a, h: 100 }, { c: '#2a8838', h: 84 },
    { c: '#d8d2c4', h: 96 }, { c: '#60a5fa', h: 78 },
  ];
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', gap: '6%' }}>
      {spines.map((s, i) => (
        <div key={i} style={{ flex: 1, height: `${s.h}%`, background: s.c, borderRadius: '1px 1px 0 0', boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.12)' }} />
      ))}
    </div>
  );
}

function Mug({ p, a }: GP) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{ position: 'absolute', right: '6%', top: '34%', width: '30%', height: '40%', borderRadius: '50%', border: `3px solid ${p}` }} />
      <div style={{ position: 'absolute', left: '14%', right: '20%', top: '26%', bottom: '6%', background: `linear-gradient(180deg,${p},#b8b1a2)`, borderRadius: '3px 3px 6px 6px' }} />
      <div style={{ position: 'absolute', left: '18%', right: '24%', top: '20%', height: '12%', background: a, borderRadius: '50%', opacity: 0.5 }} />
    </div>
  );
}

function Generic({ p, a }: GP) {
  return (
    <div style={{ width: '100%', height: '100%', background: `linear-gradient(180deg,${p},#161618)`, borderRadius: '4px', boxShadow: '0 3px 10px rgba(0,0,0,0.5)', border: `1px solid ${a}33` }} />
  );
}
