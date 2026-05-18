import type {
  DeskItem, SeatingItem, DeviceItem, ZoneItem, DeviceSlot,
  EnvironmentConfig, PlacedDevice, PlacedZone, Station, WorkspaceDesign, Price,
} from './types';
import { DESKS, SEATING, DEVICES, ZONES, PRESETS } from '@/data/catalog';

/* ════════ Catalog lookups ════════ */

export const deskById = new Map<string, DeskItem>(DESKS.map((d): [string, DeskItem] => [d.id, d]));
export const seatingById = new Map<string, SeatingItem>(SEATING.map((s): [string, SeatingItem] => [s.id, s]));
export const deviceById = new Map<string, DeviceItem>(DEVICES.map((d): [string, DeviceItem] => [d.id, d]));

export const getDesk = (id: string | null) => (id ? deskById.get(id) : undefined);
export const getSeating = (id: string | null) => (id ? seatingById.get(id) : undefined);
export const getDevice = (id: string) => deviceById.get(id);

export const zoneById = new Map<string, ZoneItem>(ZONES.map((z): [string, ZoneItem] => [z.id, z]));
export const getZone = (id: string) => zoneById.get(id);

/* ════════ Ids ════════ */

let _seq = 0;
function uid(prefix: string): string {
  _seq += 1;
  return `${prefix}-${_seq}-${Math.random().toString(36).slice(2, 7)}`;
}

/* ════════ Defaults ════════ */

export const DEFAULT_ENVIRONMENT: EnvironmentConfig = {
  roomStyle: 'studio',
  timeOfDay: 'sunset',
  lightWarmth: 0.8,
  brightness: 0.7,
};

export function emptyStation(id = 'station-seed'): Station {
  return { uid: id, deskId: null, seatingId: null, devices: [] };
}

export function emptyDesign(): WorkspaceDesign {
  return {
    environment: { ...DEFAULT_ENVIRONMENT },
    stations: [emptyStation()],
    zones: [],
    stationsLinked: true,
  };
}

function cloneStation(s: Station): Station {
  return {
    uid: uid('station'),
    deskId: s.deskId,
    seatingId: s.seatingId,
    devices: s.devices.map(d => ({ ...d, uid: uid('dev'), offset: { ...d.offset } })),
  };
}

/* ════════ Station edits ════════ */

export function deviceCount(station: Station, deviceId: string): number {
  return station.devices.filter(d => d.deviceId === deviceId).length;
}

export function addDevice(station: Station, deviceId: string): Station {
  const device = deviceById.get(deviceId);
  if (!device) return station;
  if (deviceCount(station, deviceId) >= device.maxPerStation) return station;
  const placed: PlacedDevice = {
    uid: uid('dev'),
    deviceId,
    slot: device.spec.defaultSlot,
    offset: { x: 0, y: 0 },
    pinned: false,
  };
  return { ...station, devices: [...station.devices, placed] };
}

export function removeDevice(station: Station, deviceId: string): Station {
  for (let i = station.devices.length - 1; i >= 0; i--) {
    if (station.devices[i].deviceId === deviceId) {
      return { ...station, devices: station.devices.filter((_, j) => j !== i) };
    }
  }
  return station;
}

/* ════════ Design edits ════════ */

/** Apply an edit to the design's stations. While linked, station 0 is the
    template and every other station mirrors it. */
export function editStation(design: WorkspaceDesign, mutate: (s: Station) => Station): WorkspaceDesign {
  if (design.stationsLinked) {
    const template = mutate(design.stations[0] ?? emptyStation());
    const stations = [template, ...design.stations.slice(1).map(() => cloneStation(template))];
    return { ...design, stations };
  }
  return { ...design, stations: design.stations.map(mutate) };
}

/** Resize the office. While linked, clones the template station. */
export function setStationCount(design: WorkspaceDesign, n: number): WorkspaceDesign {
  const template = design.stations[0] ?? emptyStation();
  const stations: Station[] = [template];
  for (let i = 1; i < n; i++) stations.push(cloneStation(template));
  return { ...design, stations };
}

export function presetToDesign(presetId: string): WorkspaceDesign {
  const base = emptyDesign();
  const preset = PRESETS.find(p => p.id === presetId);
  if (!preset) return base;
  let station: Station = { ...emptyStation(), deskId: preset.deskId, seatingId: preset.seatingId };
  for (const [deviceId, count] of Object.entries(preset.devices)) {
    for (let i = 0; i < count; i++) station = addDevice(station, deviceId);
  }
  return { ...base, stations: [station] };
}

/* ════════ Zones ════════ */

const ZONE_SPOTS = [
  { x: 0.12, y: 0.55 }, { x: 0.88, y: 0.55 },
  { x: 0.09, y: 0.24 }, { x: 0.91, y: 0.24 },
  { x: 0.28, y: 0.82 }, { x: 0.72, y: 0.82 },
];

export function zoneCount(design: WorkspaceDesign, zoneId: string): number {
  return design.zones.filter(z => z.zoneId === zoneId).length;
}

export function addZone(design: WorkspaceDesign, zoneId: string): WorkspaceDesign {
  if (!zoneById.has(zoneId) || zoneCount(design, zoneId) > 0) return design;
  const spot = ZONE_SPOTS[design.zones.length % ZONE_SPOTS.length];
  const placed: PlacedZone = { uid: uid('zone'), zoneId, spot: { ...spot }, pinned: false };
  return { ...design, zones: [...design.zones, placed] };
}

export function removeZone(design: WorkspaceDesign, zoneId: string): WorkspaceDesign {
  const idx = design.zones.findIndex(z => z.zoneId === zoneId);
  if (idx === -1) return design;
  return { ...design, zones: design.zones.filter((_, i) => i !== idx) };
}

/* ════════ Hybrid placement — drag to fine-tune ════════ */

/** Pin a device to a dragged position on the desk surface (0..1 coords). */
export function moveDevice(design: WorkspaceDesign, deviceUid: string, offset: { x: number; y: number }): WorkspaceDesign {
  return editStation(design, s => ({
    ...s,
    devices: s.devices.map(d => (d.uid === deviceUid ? { ...d, offset, pinned: true } : d)),
  }));
}

/** Pin a zone to a dragged spot on the floor (0..1 coords). */
export function moveZone(design: WorkspaceDesign, zoneUid: string, spot: { x: number; y: number }): WorkspaceDesign {
  return {
    ...design,
    zones: design.zones.map(z => (z.uid === zoneUid ? { ...z, spot, pinned: true } : z)),
  };
}

export function hasPins(design: WorkspaceDesign): boolean {
  return design.stations.some(s => s.devices.some(d => d.pinned)) || design.zones.some(z => z.pinned);
}

/** Drop every manual pin so the auto-layout takes over again. */
export function resetArrangement(design: WorkspaceDesign): WorkspaceDesign {
  return {
    ...design,
    stations: design.stations.map(s => ({
      ...s,
      devices: s.devices.map(d => ({ ...d, pinned: false, offset: { x: 0, y: 0 } })),
    })),
    zones: design.zones.map((z, i) => ({ ...z, pinned: false, spot: { ...ZONE_SPOTS[i % ZONE_SPOTS.length] } })),
  };
}

/* ════════ Pricing ════════ */

export function stationTotal(station: Station): Price {
  let t = 0;
  if (station.deskId) t += deskById.get(station.deskId)?.price ?? 0;
  if (station.seatingId) t += seatingById.get(station.seatingId)?.price ?? 0;
  for (const d of station.devices) t += deviceById.get(d.deviceId)?.price ?? 0;
  return t;
}

export function designTotal(design: WorkspaceDesign): Price {
  const stations = design.stations.reduce((sum, s) => sum + stationTotal(s), 0);
  const zones = design.zones.reduce((sum, z) => sum + (zoneById.get(z.zoneId)?.price ?? 0), 0);
  return stations + zones;
}

/* ════════ Auto-layout ════════
   Resolves each device to a rect on the desk surface (0..1 coords).
   Pinned devices keep their stored offset; the rest flow into their slot. */

export interface Rect { x: number; y: number; w: number; h: number }

const SLOT_REGIONS: Record<DeviceSlot, Rect> = {
  'desk-back':   { x: 0.13, y: 0.0,  w: 0.74, h: 0.6 },
  'desk-left':   { x: 0.0,  y: 0.06, w: 0.15, h: 0.62 },
  'desk-right':  { x: 0.85, y: 0.0,  w: 0.15, h: 0.82 },
  'desk-center': { x: 0.28, y: 0.62, w: 0.44, h: 0.34 },
  'desk-front':  { x: 0.05, y: 0.8,  w: 0.9,  h: 0.18 },
  'floor':       { x: 0.2,  y: 1.08, w: 0.6,  h: 0.3 },
  'wall':        { x: 0.1,  y: -0.5, w: 0.3,  h: 0.35 },
};

export interface LaidDevice {
  placed: PlacedDevice;
  device: DeviceItem;
  rect: Rect;
}

export function layoutStation(station: Station): LaidDevice[] {
  const bySlot = new Map<DeviceSlot, PlacedDevice[]>();
  for (const pd of station.devices) {
    const arr = bySlot.get(pd.slot);
    if (arr) arr.push(pd);
    else bySlot.set(pd.slot, [pd]);
  }

  const out: LaidDevice[] = [];
  bySlot.forEach((items, slot) => {
    const region = SLOT_REGIONS[slot];
    items.forEach((pd, i) => {
      const device = deviceById.get(pd.deviceId);
      if (!device) return;
      const fp = device.spec.footprint;
      let rect: Rect;
      if (pd.pinned) {
        rect = { x: pd.offset.x, y: pd.offset.y, w: fp.w, h: fp.h };
      } else {
        const cellW = region.w / items.length;
        const w = Math.min(fp.w, cellW * 0.94);
        const cx = region.x + cellW * (i + 0.5);
        rect = { x: cx - w / 2, y: region.y, w, h: fp.h };
      }
      out.push({ placed: pd, device, rect });
    });
  });
  return out;
}
