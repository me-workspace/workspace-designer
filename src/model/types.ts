/* ════════════════════════════════════════════════════════════════
   Workspace Designer — platform data model

   The whole platform is data-driven. Catalog items are plain data;
   a small set of generic renderers interpret each item's `spec`.
   Adding a desk / chair / device = adding one object, not a component.

   A user's design is a `WorkspaceDesign`:
     environment  — the room: style, time of day, lighting
     stations[]   — the desks; each = desk + seating + devices
     zones[]      — extras placed around the room (coffee, lounge…)
   ════════════════════════════════════════════════════════════════ */

/** Price, always IDR per month. */
export type Price = number;

/* ─────────────── Catalog: item categories ─────────────── */

export type ItemCategory = 'desk' | 'seating' | 'device' | 'zone';

/** Functional grouping for devices — drives catalog sectioning. */
export type DeviceGroup =
  | 'display'      // monitors, tablets
  | 'compute'      // laptops, towers, docks
  | 'audio'        // speakers, headphones
  | 'lighting'     // lamps, key lights
  | 'input'        // keyboards, mice, pads
  | 'connectivity' // hubs, chargers
  | 'comfort'      // footrests, monitor arms
  | 'nature'       // plants
  | 'decor';       // art, books, trinkets

/* ─────────────── Visual specs (renderer input) ─────────────── */

/** A generic renderer draws any desk from this spec. */
export interface DeskSpec {
  shape: 'straight' | 'l-shaped' | 'u-shaped';
  height: 'fixed' | 'standing';
  legStyle: 'panel' | 'a-frame' | 'hairpin' | 'pillar';
  surfaceColor: string;
  edgeColor: string;
  grainColor: string;
  /** Footprint width relative to a baseline desk (1 = standard). */
  widthScale: number;
}

/** A generic renderer draws any chair from this spec. */
export interface SeatingSpec {
  style: 'mesh' | 'leather' | 'ergonomic' | 'lounge' | 'stool';
  seatColor: string;
  backColor: string;
  baseColor: string;
  hasArmrests: boolean;
  hasHeadrest: boolean;
}

/** Where a device wants to live on or around a station. */
export type DeviceSlot =
  | 'desk-back' | 'desk-center' | 'desk-left' | 'desk-right'
  | 'desk-front' | 'floor' | 'wall';

/** Known device drawings. Add a glyph = add a renderer case. */
export type DeviceGlyph =
  | 'monitor' | 'laptop' | 'tablet' | 'webcam' | 'cpu-tower' | 'dock'
  | 'lamp' | 'key-light'
  | 'speaker' | 'headphones'
  | 'keyboard' | 'mouse' | 'deskpad'
  | 'hub' | 'charger'
  | 'monitor-arm' | 'footrest'
  | 'plant'
  | 'art' | 'books' | 'mug';

/** A generic renderer draws any device from this spec. */
export interface DeviceSpec {
  group: DeviceGroup;
  glyph: DeviceGlyph;
  primaryColor: string;
  accentColor: string;
  /** Footprint on the desk surface, normalised 0..1 of the surface. */
  footprint: { w: number; h: number };
  /** Slot the auto-layout drops this into by default. */
  defaultSlot: DeviceSlot;
  /** Casts a warm/cool glow into the scene. */
  emitsLight?: boolean;
}

/** A generic renderer draws any zone from this spec. */
export interface ZoneSpec {
  theme: 'coffee' | 'relax' | 'outdoor' | 'storage' | 'meeting' | 'wellness';
  /** Footprint on the floor, normalised 0..1 of the room. */
  footprint: { w: number; h: number };
  palette: string[];
}

/* ─────────────── Catalog items ─────────────── */

interface BaseItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: Price;
  tags: string[];
}

export interface DeskItem extends BaseItem {
  category: 'desk';
  spec: DeskSpec;
}

export interface SeatingItem extends BaseItem {
  category: 'seating';
  spec: SeatingSpec;
}

export interface DeviceItem extends BaseItem {
  category: 'device';
  spec: DeviceSpec;
  /** Cap per station (e.g. 3 monitors, 1 keyboard). */
  maxPerStation: number;
}

export interface ZoneItem extends BaseItem {
  category: 'zone';
  spec: ZoneSpec;
}

export type CatalogItem = DeskItem | SeatingItem | DeviceItem | ZoneItem;

/* ─────────────── Environment ─────────────── */

export type RoomStyle = 'studio' | 'villa' | 'loft' | 'open-air';
export type TimeOfDay = 'day' | 'sunset' | 'night';

export interface EnvironmentConfig {
  roomStyle: RoomStyle;
  timeOfDay: TimeOfDay;
  /** 0 = cool daylight, 1 = warm golden. */
  lightWarmth: number;
  /** 0 = dim, 1 = bright. */
  brightness: number;
}

/* ─────────────── Placed instances (the user's design) ─────────────── */

/** One device the user has added to a station. */
export interface PlacedDevice {
  uid: string;
  deviceId: string;            // → DeviceItem.id
  slot: DeviceSlot;
  /** Fine-tune offset within the slot, 0..1. Auto unless `pinned`. */
  offset: { x: number; y: number };
  /** User dragged it → keep position, skip auto-reflow. */
  pinned: boolean;
}

/** One desk setup: a desk, a chair, and its devices. */
export interface Station {
  uid: string;
  deskId: string | null;       // → DeskItem.id
  seatingId: string | null;    // → SeatingItem.id
  devices: PlacedDevice[];
}

/** A zone dropped into the room. */
export interface PlacedZone {
  uid: string;
  zoneId: string;              // → ZoneItem.id
  /** Floor position, 0..1 of the room. Auto unless `pinned`. */
  spot: { x: number; y: number };
  pinned: boolean;
}

/** The complete thing a user designs and rents. */
export interface WorkspaceDesign {
  environment: EnvironmentConfig;
  stations: Station[];
  zones: PlacedZone[];
  /** When true, editing one station mirrors to all (the simple path). */
  stationsLinked: boolean;
}

/** A saved design in localStorage. */
export interface SavedDesign {
  id: string;
  name: string;
  createdAt: number;
  design: WorkspaceDesign;
  /** Cached monthly total at save time. */
  total: Price;
}
