'use client';

import type { EnvironmentConfig, RoomStyle, TimeOfDay } from '@/model/types';
import { ENV_PRESETS } from '@/model/environment';

interface Props {
  environment: EnvironmentConfig;
  onChange: (patch: Partial<EnvironmentConfig>) => void;
}

const ROOM_STYLES: { id: RoomStyle; name: string; hint: string }[] = [
  { id: 'studio', name: 'Studio', hint: 'Warm & focused' },
  { id: 'villa', name: 'Villa', hint: 'Bright & airy' },
  { id: 'loft', name: 'Loft', hint: 'Cool & industrial' },
  { id: 'open-air', name: 'Open-air', hint: 'Tropical & open' },
];

const TIMES: { id: TimeOfDay; name: string; icon: string }[] = [
  { id: 'day', name: 'Day', icon: '☀' },
  { id: 'sunset', name: 'Sunset', icon: '◐' },
  { id: 'night', name: 'Night', icon: '☾' },
];

export default function EnvironmentPanel({ environment, onChange }: Props) {
  const sameAsPreset = (e: EnvironmentConfig) =>
    e.roomStyle === environment.roomStyle && e.timeOfDay === environment.timeOfDay &&
    e.lightWarmth === environment.lightWarmth && e.brightness === environment.brightness;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>

      {/* Header */}
      <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid #1f1f22', flexShrink: 0 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: '#52525b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>
          Environment
        </p>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#f2f2f7' }}>Set the scene</h2>
      </div>

      {/* Presets */}
      <Section label="Quick scenes">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {ENV_PRESETS.map(p => {
            const active = sameAsPreset(p.env);
            return (
              <button
                key={p.id}
                onClick={() => onChange(p.env)}
                style={{
                  width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 9,
                  background: active ? 'rgba(74,222,128,0.07)' : '#111113',
                  border: `1.5px solid ${active ? 'rgba(74,222,128,0.35)' : '#1f1f22'}`,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: active ? '#f2f2f7' : '#d4d4d8' }}>{p.name}</span>
                  {active && <span style={{ fontSize: 9, fontWeight: 700, color: '#4ade80' }}>ACTIVE</span>}
                </div>
                <p style={{ fontSize: 10, color: '#71717a', marginTop: 2 }}>{p.tagline}</p>
              </button>
            );
          })}
        </div>
      </Section>

      <Divider />

      {/* Room style */}
      <Section label="Room style">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
          {ROOM_STYLES.map(r => {
            const active = environment.roomStyle === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onChange({ roomStyle: r.id })}
                style={{
                  textAlign: 'left', padding: '8px 9px', borderRadius: 9,
                  background: active ? 'rgba(74,222,128,0.07)' : '#111113',
                  border: `1.5px solid ${active ? 'rgba(74,222,128,0.35)' : '#1f1f22'}`,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <p style={{ fontSize: 11, fontWeight: 700, color: active ? '#f2f2f7' : '#d4d4d8' }}>{r.name}</p>
                <p style={{ fontSize: 9, color: '#52525b', marginTop: 1 }}>{r.hint}</p>
              </button>
            );
          })}
        </div>
      </Section>

      <Divider />

      {/* Time of day */}
      <Section label="Time of day">
        <div style={{ display: 'flex', gap: 5 }}>
          {TIMES.map(t => {
            const active = environment.timeOfDay === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onChange({ timeOfDay: t.id })}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 9,
                  background: active ? 'rgba(74,222,128,0.1)' : '#111113',
                  border: `1.5px solid ${active ? 'rgba(74,222,128,0.4)' : '#1f1f22'}`,
                  cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                }}
              >
                <span style={{ fontSize: 14, color: active ? '#4ade80' : '#71717a' }}>{t.icon}</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: active ? '#f2f2f7' : '#71717a' }}>{t.name}</span>
              </button>
            );
          })}
        </div>
      </Section>

      <Divider />

      {/* Sliders */}
      <Section label="Lighting">
        <Slider
          label="Light warmth" lo="Cool" hi="Warm"
          value={environment.lightWarmth}
          onChange={v => onChange({ lightWarmth: v })}
        />
        <div style={{ height: 12 }} />
        <Slider
          label="Brightness" lo="Dim" hi="Bright"
          value={environment.brightness}
          onChange={v => onChange({ brightness: v })}
        />
      </Section>

      <div style={{ height: 16 }} />
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '14px 16px' }}>
      <p style={{ fontSize: 9, fontWeight: 700, color: '#52525b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, margin: '0 16px', background: '#1f1f22' }} />;
}

function Slider({ label, lo, hi, value, onChange }: {
  label: string; lo: string; hi: string; value: number; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#d4d4d8' }}>{label}</span>
        <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 700 }}>{Math.round(value * 100)}%</span>
      </div>
      <input
        type="range" min={0} max={1} step={0.05} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: '#4ade80', cursor: 'pointer' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
        <span style={{ fontSize: 9, color: '#52525b' }}>{lo}</span>
        <span style={{ fontSize: 9, color: '#52525b' }}>{hi}</span>
      </div>
    </div>
  );
}
