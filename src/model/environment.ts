import type { EnvironmentConfig, RoomStyle, TimeOfDay } from './types';

/* ════════ Environment resolver ════════
   Turns an EnvironmentConfig (room style · time of day · warmth ·
   brightness) into concrete colours the canvas paints with.        */

/* ── colour helpers ── */
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));
const hx = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
function toRgb(h: string): [number, number, number] {
  const x = h.replace('#', '');
  return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)];
}
function mix(a: string, b: string, t: number): string {
  const A = toRgb(a), B = toRgb(b);
  return '#' + hx(A[0] + (B[0] - A[0]) * t) + hx(A[1] + (B[1] - A[1]) * t) + hx(A[2] + (B[2] - A[2]) * t);
}
function shade(h: string, f: string | number): string {
  const [r, g, b] = toRgb(h);
  const k = typeof f === 'number' ? f : 1;
  return '#' + hx(r * k) + hx(g * k) + hx(b * k);
}
function rgba(h: string, alpha: number): string {
  const [r, g, b] = toRgb(h);
  return `rgba(${r},${g},${b},${clamp(alpha, 0, 1)})`;
}

const COOL = '#8fb8e8';
const WARM = '#ff9a44';

const ROOM_BASE: Record<RoomStyle, { wall: string; floor: string }> = {
  studio:     { wall: '#241b14', floor: '#15100b' },
  villa:      { wall: '#3a2f24', floor: '#2a1d12' },
  loft:       { wall: '#2b2b30', floor: '#1c1c20' },
  'open-air': { wall: '#2e2820', floor: '#241a10' },
};

interface TimeBase {
  wallMul: number; floorMul: number; ambient: number; vignette: number;
  stars: boolean; moon: boolean; sunShow: boolean;
  sky: string; sea: [string, string];
}

const TIME: Record<TimeOfDay, TimeBase> = {
  day: {
    wallMul: 1.55, floorMul: 1.4, ambient: 0.5, vignette: 0.3, stars: false, moon: false, sunShow: true,
    sky: 'linear-gradient(180deg,#3d7fc4 0%,#6aa6d8 42%,#a9cfe6 72%,#dbeaf2 100%)',
    sea: ['#2f6f9a', '#1f4f72'],
  },
  sunset: {
    wallMul: 1.0, floorMul: 1.0, ambient: 0.72, vignette: 0.5, stars: false, moon: false, sunShow: true,
    sky: 'linear-gradient(180deg,#1f2150 0%,#5b3568 25%,#a8455f 45%,#dd6a37 63%,#f59b3e 79%,#ffc862 91%,#ffe39c 100%)',
    sea: ['#bb5c3a', '#6e3550'],
  },
  night: {
    wallMul: 0.6, floorMul: 0.58, ambient: 0.42, vignette: 0.72, stars: true, moon: true, sunShow: false,
    sky: 'linear-gradient(180deg,#05060f 0%,#0b1228 45%,#142042 75%,#22305a 100%)',
    sea: ['#16243e', '#0a1020'],
  },
};

export interface ResolvedEnv {
  rootBg: string;
  wall: [string, string];
  wallWash: string;
  floor: [string, string];
  floorGrid: string;
  baseboard: string;
  horizon: string;
  lightPool: string;
  beam: string;
  vignette: number;
  window: {
    sky: string;
    clouds: boolean;
    stars: boolean;
    moon: boolean;
    sun: { show: boolean; fill: string; glow: string; bottom: string };
    sea: [string, string];
  };
}

export function resolveEnvironment(env: EnvironmentConfig): ResolvedEnv {
  const room = ROOM_BASE[env.roomStyle];
  const t = TIME[env.timeOfDay];
  const b = 0.62 + env.brightness * 0.7;
  const light = mix(COOL, WARM, env.lightWarmth);
  const ambient = t.ambient * (0.5 + env.brightness * 0.85);

  return {
    rootBg: shade(room.floor, 0.7),
    wall: [shade(room.wall, t.wallMul * b), shade(room.wall, t.wallMul * b * 0.74)],
    wallWash: rgba(light, 0.18 * ambient + 0.05),
    floor: [shade(room.floor, t.floorMul * b), shade(room.floor, t.floorMul * b * 0.55)],
    floorGrid: rgba(light, 0.13),
    baseboard: shade(room.wall, t.wallMul * b * 1.25),
    horizon: rgba(light, 0.5),
    lightPool: rgba(light, 0.15 * ambient + 0.04),
    beam: rgba(light, 0.14 * ambient),
    vignette: t.vignette,
    window: {
      sky: t.sky,
      clouds: !t.stars,
      stars: t.stars,
      moon: t.moon,
      sun: {
        show: t.sunShow,
        fill: env.timeOfDay === 'day' ? '#fff8e0' : '#ffd26c',
        glow: light,
        bottom: env.timeOfDay === 'day' ? '64%' : '21%',
      },
      sea: t.sea,
    },
  };
}

/* ── Quick scene presets ── */

export interface EnvPreset {
  id: string;
  name: string;
  tagline: string;
  env: EnvironmentConfig;
}

export const ENV_PRESETS: EnvPreset[] = [
  { id: 'sunset',  name: 'Bali Sunset',     tagline: 'Golden hour, warm studio.',  env: { roomStyle: 'studio',   timeOfDay: 'sunset', lightWarmth: 0.82, brightness: 0.7 } },
  { id: 'morning', name: 'Bright Morning',  tagline: 'Airy villa, full daylight.', env: { roomStyle: 'villa',    timeOfDay: 'day',    lightWarmth: 0.4,  brightness: 0.95 } },
  { id: 'night',   name: 'Night Owl',       tagline: 'Quiet loft after dark.',     env: { roomStyle: 'loft',     timeOfDay: 'night',  lightWarmth: 0.6,  brightness: 0.42 } },
  { id: 'deck',    name: 'Open Deck',       tagline: 'Open-air, sunset breeze.',   env: { roomStyle: 'open-air', timeOfDay: 'sunset', lightWarmth: 0.7,  brightness: 0.82 } },
];
