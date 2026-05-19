import type { DeskItem, SeatingItem, DeviceItem } from '@/model/types';

/* ════════ Catalog ════════
   Plain data. Generic renderers interpret each item's `spec`,
   so breadth costs one object per item — not one component.   */

export const DESKS: DeskItem[] = [
  {
    id: 'solo', category: 'desk', name: 'Solo', price: 550000,
    tagline: 'Clean lines. Zero distractions.',
    description: 'Compact 120×60 cm solid oak desk. Built-in cable tray, adjustable leveling feet.',
    tags: ['compact', 'oak'],
    spec: { shape: 'straight', height: 'fixed', legStyle: 'panel', surfaceColor: '#D4B886', edgeColor: '#A07840', grainColor: '#C4A870', widthScale: 1 },
  },
  {
    id: 'nook', category: 'desk', name: 'Nook', price: 480000,
    tagline: 'Small footprint. Big focus.',
    description: 'Petite 100×55 cm birch desk on slim hairpin legs. Made for tight corners and studios.',
    tags: ['compact', 'birch', 'hairpin'],
    spec: { shape: 'straight', height: 'fixed', legStyle: 'hairpin', surfaceColor: '#E4D2A8', edgeColor: '#B89F70', grainColor: '#D2BE92', widthScale: 0.86 },
  },
  {
    id: 'drift', category: 'desk', name: 'Drift', price: 640000,
    tagline: 'Mid-century warmth.',
    description: 'Teak 130×65 cm desk with tapered A-frame legs. A nod to the islands.',
    tags: ['teak', 'a-frame', 'warm'],
    spec: { shape: 'straight', height: 'fixed', legStyle: 'a-frame', surfaceColor: '#C08A52', edgeColor: '#8A5E30', grainColor: '#A87842', widthScale: 1.05 },
  },
  {
    id: 'canvas', category: 'desk', name: 'Canvas', price: 590000,
    tagline: 'A blank white slate.',
    description: 'Matte-white 130×65 cm desk on hairpin legs. Pairs with anything, hides nothing.',
    tags: ['white', 'minimal', 'hairpin'],
    spec: { shape: 'straight', height: 'fixed', legStyle: 'hairpin', surfaceColor: '#ECEAE3', edgeColor: '#BCB9AE', grainColor: '#DAD7CC', widthScale: 1.05 },
  },
  {
    id: 'panorama', category: 'desk', name: 'Panorama', price: 850000,
    tagline: 'Spread out. Think bigger.',
    description: 'Spacious L-shaped 160×80 cm walnut desk. Seamless corner join, hidden cable spine.',
    tags: ['l-shaped', 'walnut', 'spacious'],
    spec: { shape: 'l-shaped', height: 'fixed', legStyle: 'a-frame', surfaceColor: '#9A6A3A', edgeColor: '#6A4420', grainColor: '#7A5430', widthScale: 1.3 },
  },
  {
    id: 'atlas', category: 'desk', name: 'Atlas', price: 1150000,
    tagline: 'The executive command post.',
    description: 'Commanding U-shaped 180×90 cm dark-walnut desk. Drawer bank, wrap-around surface.',
    tags: ['u-shaped', 'walnut', 'executive'],
    spec: { shape: 'u-shaped', height: 'fixed', legStyle: 'panel', surfaceColor: '#6E4A2A', edgeColor: '#4A3018', grainColor: '#573A22', widthScale: 1.4 },
  },
  {
    id: 'rise', category: 'desk', name: 'Rise', price: 950000,
    tagline: 'Sit. Stand. Repeat.',
    description: 'Electric height-adjustable 140×70 cm. 4 memory presets, whisper-quiet motor. Bamboo surface.',
    tags: ['standing', 'bamboo', 'motorised'],
    spec: { shape: 'straight', height: 'standing', legStyle: 'pillar', surfaceColor: '#E8D4A0', edgeColor: '#B8A070', grainColor: '#D4C090', widthScale: 1.1 },
  },
  {
    id: 'summit', category: 'desk', name: 'Summit', price: 1080000,
    tagline: 'Stand tall, all day.',
    description: 'Premium charcoal standing desk, 150×75 cm. Dual motors, anti-collision, app control.',
    tags: ['standing', 'charcoal', 'premium'],
    spec: { shape: 'straight', height: 'standing', legStyle: 'pillar', surfaceColor: '#3C3A36', edgeColor: '#26241F', grainColor: '#312E29', widthScale: 1.15 },
  },
  {
    id: 'delta', category: 'desk', name: 'Delta', price: 1240000,
    tagline: 'A corner that rises.',
    description: 'L-shaped electric standing desk in pale ash. The corner office, minus the office.',
    tags: ['l-shaped', 'standing', 'ash'],
    spec: { shape: 'l-shaped', height: 'standing', legStyle: 'pillar', surfaceColor: '#C6C0B4', edgeColor: '#918B7E', grainColor: '#B0A99C', widthScale: 1.3 },
  },
];

export const SEATING: SeatingItem[] = [
  {
    id: 'breeze', category: 'seating', name: 'Breeze', price: 420000,
    tagline: 'Breathable mesh. All-day comfort.',
    description: "Ergonomic mesh-back task chair. Adjustable lumbar, 4D armrests. Ideal for Bali's heat.",
    tags: ['mesh', 'breathable', 'task'],
    spec: { style: 'mesh', seatColor: '#38383d', backColor: '#48484f', baseColor: '#28282d', hasArmrests: true, hasHeadrest: false },
  },
  {
    id: 'flux', category: 'seating', name: 'Flux', price: 460000,
    tagline: 'Mesh, with a pop of teal.',
    description: 'Lightweight mesh task chair with a teal frame. Springy, fun, surprisingly supportive.',
    tags: ['mesh', 'colourful', 'light'],
    spec: { style: 'mesh', seatColor: '#0e6e6e', backColor: '#138a8a', baseColor: '#0b5252', hasArmrests: true, hasHeadrest: false },
  },
  {
    id: 'zen', category: 'seating', name: 'Zen', price: 580000,
    tagline: 'Engineered for deep work.',
    description: 'High-end ergonomic task chair with dynamic lumbar, synchro tilt, ocean-plastic shell.',
    tags: ['ergonomic', 'synchro-tilt', 'sustainable'],
    spec: { style: 'ergonomic', seatColor: '#0D6E63', backColor: '#0A5A52', baseColor: '#0D6E63', hasArmrests: true, hasHeadrest: false },
  },
  {
    id: 'pulse', category: 'seating', name: 'Pulse', price: 620000,
    tagline: 'Ergonomics with a headrest.',
    description: 'Full ergonomic chair with adjustable headrest and dynamic lumbar. Built for long sessions.',
    tags: ['ergonomic', 'headrest'],
    spec: { style: 'ergonomic', seatColor: '#2f3a44', backColor: '#26313a', baseColor: '#1c242b', hasArmrests: true, hasHeadrest: true },
  },
  {
    id: 'anchor', category: 'seating', name: 'Anchor', price: 680000,
    tagline: 'The executive throne.',
    description: 'Premium leather executive chair. High back, reclining mechanism, padded headrest.',
    tags: ['leather', 'executive', 'reclining'],
    spec: { style: 'leather', seatColor: '#2a2a2f', backColor: '#343439', baseColor: '#1a1a1f', hasArmrests: true, hasHeadrest: true },
  },
  {
    id: 'regent', category: 'seating', name: 'Regent', price: 820000,
    tagline: 'Cognac leather. Pure presence.',
    description: 'Hand-stitched cognac leather chair with a tufted back. The corner-office classic.',
    tags: ['leather', 'cognac', 'tufted'],
    spec: { style: 'leather', seatColor: '#7a4a2a', backColor: '#8a5732', baseColor: '#3a2418', hasArmrests: true, hasHeadrest: true },
  },
  {
    id: 'perch', category: 'seating', name: 'Perch', price: 220000,
    tagline: 'Quick sit. Quick stand.',
    description: 'Compact stool with a footring — the natural partner to a standing desk.',
    tags: ['stool', 'standing-desk'],
    spec: { style: 'stool', seatColor: '#3a3530', backColor: '#3a3530', baseColor: '#26221d', hasArmrests: false, hasHeadrest: false },
  },
  {
    id: 'haven', category: 'seating', name: 'Haven', price: 760000,
    tagline: 'Sink in and think.',
    description: 'A cushioned lounge chair for the reading corner of your workspace. Deep, soft, calm.',
    tags: ['lounge', 'cushioned', 'relax'],
    spec: { style: 'lounge', seatColor: '#5a4632', backColor: '#6a543c', baseColor: '#2e2418', hasArmrests: false, hasHeadrest: false },
  },
];

export const DEVICES: DeviceItem[] = [
  /* ── Displays ── */
  {
    id: 'monitor', category: 'device', name: '24" Monitor', price: 320000, maxPerStation: 3,
    tagline: 'IPS 144Hz. Crystal clear.',
    description: 'Full HD IPS display with HDMI, DisplayPort, USB-C. Adjustable stand.',
    tags: ['ips', '144hz', 'usb-c'],
    spec: { group: 'display', glyph: 'monitor', primaryColor: '#1a1a1e', accentColor: '#4ade80', footprint: { w: 0.27, h: 0.58 }, defaultSlot: 'desk-back' },
  },
  {
    id: 'monitor-27', category: 'device', name: '27" QHD Monitor', price: 420000, maxPerStation: 3,
    tagline: 'More pixels. More room.',
    description: '27-inch 1440p IPS panel, 165Hz, height + tilt + swivel stand.',
    tags: ['qhd', '165hz', '27-inch'],
    spec: { group: 'display', glyph: 'monitor', primaryColor: '#19191d', accentColor: '#4ade80', footprint: { w: 0.32, h: 0.62 }, defaultSlot: 'desk-back' },
  },
  {
    id: 'ultrawide', category: 'device', name: '34" Ultrawide', price: 680000, maxPerStation: 1,
    tagline: 'One screen to rule them.',
    description: 'Curved 34-inch ultrawide, 3440×1440. Replaces a dual-monitor setup.',
    tags: ['ultrawide', 'curved', '34-inch'],
    spec: { group: 'display', glyph: 'monitor', primaryColor: '#18181c', accentColor: '#4ade80', footprint: { w: 0.52, h: 0.5 }, defaultSlot: 'desk-back' },
  },
  {
    id: 'tablet', category: 'device', name: 'Tablet + Stand', price: 240000, maxPerStation: 1,
    tagline: 'Your second-screen sidekick.',
    description: '11-inch tablet on an angled stand — notes, references, video calls.',
    tags: ['tablet', 'second-screen'],
    spec: { group: 'display', glyph: 'tablet', primaryColor: '#1c1c20', accentColor: '#60a5fa', footprint: { w: 0.14, h: 0.3 }, defaultSlot: 'desk-right' },
  },

  /* ── Compute ── */
  {
    id: 'webcam', category: 'device', name: 'HD Webcam', price: 160000, maxPerStation: 1,
    tagline: '1080p 60fps. Auto-focus.',
    description: '1080p webcam, stereo noise-cancelling mic. Clips onto any monitor.',
    tags: ['1080p', 'auto-focus'],
    spec: { group: 'compute', glyph: 'webcam', primaryColor: '#151518', accentColor: '#4ade80', footprint: { w: 0.08, h: 0.1 }, defaultSlot: 'desk-back' },
  },
  {
    id: 'laptop', category: 'device', name: 'Laptop + Riser', price: 130000, maxPerStation: 1,
    tagline: 'Lift it to eye level.',
    description: 'Aluminium laptop riser with airflow — bring your own machine, sit up straight.',
    tags: ['riser', 'ergonomic'],
    spec: { group: 'compute', glyph: 'laptop', primaryColor: '#26262b', accentColor: '#9ca3af', footprint: { w: 0.3, h: 0.22 }, defaultSlot: 'desk-center' },
  },
  {
    id: 'mini-pc', category: 'device', name: 'Mini PC', price: 380000, maxPerStation: 1,
    tagline: 'A whole desktop, palm-sized.',
    description: 'Compact desktop PC — Ryzen, 32GB RAM, 1TB SSD. Tucks under the desk.',
    tags: ['desktop', 'compact'],
    spec: { group: 'compute', glyph: 'cpu-tower', primaryColor: '#1d1d22', accentColor: '#4ade80', footprint: { w: 0.16, h: 0.34 }, defaultSlot: 'floor' },
  },

  /* ── Audio ── */
  {
    id: 'speakers', category: 'device', name: 'Desk Speakers', price: 290000, maxPerStation: 1,
    tagline: 'Room-filling sound.',
    description: 'A pair of compact bookshelf speakers. Bluetooth + 3.5mm, warm balanced tone.',
    tags: ['bluetooth', 'stereo'],
    spec: { group: 'audio', glyph: 'speaker', primaryColor: '#222226', accentColor: '#fbbf24', footprint: { w: 0.11, h: 0.36 }, defaultSlot: 'desk-back' },
  },
  {
    id: 'headphones', category: 'device', name: 'Headphone Stand', price: 180000, maxPerStation: 1,
    tagline: 'A home for your cans.',
    description: 'Over-ear headphones on a weighted aluminium stand. ANC, 30-hour battery.',
    tags: ['anc', 'over-ear'],
    spec: { group: 'audio', glyph: 'headphones', primaryColor: '#26262b', accentColor: '#a78bfa', footprint: { w: 0.13, h: 0.34 }, defaultSlot: 'desk-right' },
  },

  /* ── Lighting ── */
  {
    id: 'lamp', category: 'device', name: 'LED Desk Lamp', price: 95000, maxPerStation: 1,
    tagline: 'Three colour temps.',
    description: 'Adjustable arm, 2700K–6500K, wireless charging base, USB-A port.',
    tags: ['adjustable', 'wireless-charging'],
    spec: { group: 'lighting', glyph: 'lamp', primaryColor: '#2a2a32', accentColor: '#ffe850', footprint: { w: 0.12, h: 0.82 }, defaultSlot: 'desk-right', emitsLight: true },
  },
  {
    id: 'key-light', category: 'device', name: 'Key Light', price: 175000, maxPerStation: 1,
    tagline: 'Look good on every call.',
    description: 'Edge-lit LED panel on a slim stem. Dimmable, temperature-adjustable, app-controlled.',
    tags: ['video-call', 'dimmable'],
    spec: { group: 'lighting', glyph: 'key-light', primaryColor: '#2c2c30', accentColor: '#fff4d2', footprint: { w: 0.34, h: 0.52 }, defaultSlot: 'desk-back', emitsLight: true },
  },

  /* ── Input ── */
  {
    id: 'keyboard', category: 'device', name: 'Mechanical Keyboard', price: 75000, maxPerStation: 1,
    tagline: 'Tactile. Quietly satisfying.',
    description: 'Low-profile mechanical keyboard, hot-swappable switches, USB-C.',
    tags: ['mechanical', 'low-profile'],
    spec: { group: 'input', glyph: 'keyboard', primaryColor: '#252528', accentColor: '#2e2e34', footprint: { w: 0.42, h: 0.16 }, defaultSlot: 'desk-center' },
  },
  {
    id: 'mouse', category: 'device', name: 'Wireless Mouse', price: 45000, maxPerStation: 1,
    tagline: 'Glides. Never tangles.',
    description: 'Silent wireless mouse, 6-button, rechargeable.',
    tags: ['wireless', 'silent'],
    spec: { group: 'input', glyph: 'mouse', primaryColor: '#2a2a2f', accentColor: '#1a1a1f', footprint: { w: 0.08, h: 0.13 }, defaultSlot: 'desk-front' },
  },
  {
    id: 'deskpad', category: 'device', name: 'Desk Pad', price: 35000, maxPerStation: 1,
    tagline: 'A softer surface.',
    description: 'Large felt + cork desk mat. Warms up the desk, quiets the keys.',
    tags: ['felt', 'large'],
    spec: { group: 'input', glyph: 'deskpad', primaryColor: '#3a3a42', accentColor: '#4a4a54', footprint: { w: 0.5, h: 0.12 }, defaultSlot: 'desk-front' },
  },

  /* ── Connectivity ── */
  {
    id: 'hub', category: 'device', name: 'USB-C Hub', price: 85000, maxPerStation: 1,
    tagline: 'One cable. All ports.',
    description: '7-in-1: 4K HDMI, USB-A ×3, SD+microSD, 100W pass-through charging.',
    tags: ['7-in-1', 'pass-through'],
    spec: { group: 'connectivity', glyph: 'hub', primaryColor: '#222228', accentColor: '#4ade80', footprint: { w: 0.15, h: 0.1 }, defaultSlot: 'desk-front' },
  },
  {
    id: 'charger', category: 'device', name: 'Wireless Charger', price: 110000, maxPerStation: 1,
    tagline: '15W Qi2. Just set it down.',
    description: 'Qi2-compatible 15W pad. Works with iPhone and Android.',
    tags: ['qi2', '15w'],
    spec: { group: 'connectivity', glyph: 'charger', primaryColor: '#222228', accentColor: '#4ade80', footprint: { w: 0.1, h: 0.1 }, defaultSlot: 'desk-front' },
  },
  {
    id: 'dock', category: 'device', name: 'Thunderbolt Dock', price: 220000, maxPerStation: 1,
    tagline: 'A docking command centre.',
    description: 'Thunderbolt 4 dock: dual 4K out, 2.5GbE, 90W charging, six extra ports.',
    tags: ['thunderbolt', 'dual-4k'],
    spec: { group: 'connectivity', glyph: 'dock', primaryColor: '#202024', accentColor: '#4ade80', footprint: { w: 0.18, h: 0.12 }, defaultSlot: 'desk-front' },
  },

  /* ── Comfort ── */
  {
    id: 'monitor-arm', category: 'device', name: 'Monitor Arm', price: 130000, maxPerStation: 1,
    tagline: 'Float your screen.',
    description: 'Gas-spring monitor arm. Frees the desk, dials in the perfect height.',
    tags: ['gas-spring', 'vesa'],
    spec: { group: 'comfort', glyph: 'monitor-arm', primaryColor: '#26262b', accentColor: '#3a3a42', footprint: { w: 0.1, h: 0.42 }, defaultSlot: 'desk-back' },
  },
  {
    id: 'footrest', category: 'device', name: 'Footrest', price: 70000, maxPerStation: 1,
    tagline: 'Give your legs a lift.',
    description: 'Angle-adjustable footrest with a textured top. Better posture, less fatigue.',
    tags: ['posture', 'adjustable'],
    spec: { group: 'comfort', glyph: 'footrest', primaryColor: '#2e2e34', accentColor: '#3e3e46', footprint: { w: 0.3, h: 0.2 }, defaultSlot: 'floor' },
  },

  /* ── Nature ── */
  {
    id: 'plant', category: 'device', name: 'Tropical Plant', price: 65000, maxPerStation: 2,
    tagline: 'Bali, on your desk.',
    description: 'Curated pothos or succulent in a ceramic pot. Swapped monthly.',
    tags: ['greenery', 'curated'],
    spec: { group: 'nature', glyph: 'plant', primaryColor: '#2a8838', accentColor: '#1e7030', footprint: { w: 0.14, h: 0.5 }, defaultSlot: 'desk-left' },
  },
  {
    id: 'succulent', category: 'device', name: 'Succulent Trio', price: 40000, maxPerStation: 2,
    tagline: 'Tiny green, zero fuss.',
    description: 'Three small succulents in matte pots. The lowest-maintenance desk green there is.',
    tags: ['succulent', 'low-maintenance'],
    spec: { group: 'nature', glyph: 'plant', primaryColor: '#3aa84c', accentColor: '#2a8838', footprint: { w: 0.09, h: 0.22 }, defaultSlot: 'desk-left' },
  },
  {
    id: 'hanging-plant', category: 'device', name: 'Hanging Plant', price: 80000, maxPerStation: 1,
    tagline: 'Greenery, overhead.',
    description: 'A trailing pothos in a wall-mounted pot. Softens the corner above the desk.',
    tags: ['trailing', 'wall'],
    spec: { group: 'nature', glyph: 'plant', primaryColor: '#2a8838', accentColor: '#1e7030', footprint: { w: 0.16, h: 0.3 }, defaultSlot: 'wall' },
  },

  /* ── Decor ── */
  {
    id: 'art', category: 'device', name: 'Framed Print', price: 90000, maxPerStation: 1,
    tagline: 'A wall worth looking up to.',
    description: 'A curated framed art print. Choose abstract, photographic, or typographic.',
    tags: ['art', 'wall'],
    spec: { group: 'decor', glyph: 'art', primaryColor: '#2c2118', accentColor: '#e8703a', footprint: { w: 0.28, h: 0.32 }, defaultSlot: 'wall' },
  },
  {
    id: 'books', category: 'device', name: 'Bookend Set', price: 55000, maxPerStation: 1,
    tagline: 'A little library.',
    description: 'A weighted bookend pair with a starter shelf of design titles.',
    tags: ['books', 'shelf'],
    spec: { group: 'decor', glyph: 'books', primaryColor: '#7a4a2a', accentColor: '#c4455f', footprint: { w: 0.16, h: 0.22 }, defaultSlot: 'desk-left' },
  },
  {
    id: 'trinket', category: 'device', name: 'Ceramic Mug', price: 30000, maxPerStation: 1,
    tagline: 'Coffee not included.',
    description: 'A hand-thrown ceramic mug from a Bali studio. Small joys matter.',
    tags: ['ceramic', 'local'],
    spec: { group: 'decor', glyph: 'mug', primaryColor: '#d8d2c4', accentColor: '#4ade80', footprint: { w: 0.07, h: 0.11 }, defaultSlot: 'desk-front' },
  },
];

/* ════════ Quick-start presets ════════ */

export interface CatalogPreset {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  color: string;
  deskId: string;
  seatingId: string;
  /** deviceId → count */
  devices: Record<string, number>;
}

export const PRESETS: CatalogPreset[] = [
  {
    id: 'starter', name: 'Starter', tagline: 'Clean and minimal. Just get working.',
    badge: 'BEST VALUE', color: '#4ade80',
    deskId: 'solo', seatingId: 'breeze',
    devices: { keyboard: 1, mouse: 1 },
  },
  {
    id: 'nomad', name: 'Nomad', tagline: 'One monitor, good chair, all you need.',
    badge: 'POPULAR', color: '#60a5fa',
    deskId: 'rise', seatingId: 'zen',
    devices: { monitor: 1, keyboard: 1, mouse: 1, lamp: 1 },
  },
  {
    id: 'creator', name: 'Creator', tagline: 'Camera, light and sound, dialled in.',
    badge: 'ON CAMERA', color: '#fbbf24',
    deskId: 'drift', seatingId: 'flux',
    devices: { 'monitor-27': 1, keyboard: 1, mouse: 1, webcam: 1, 'key-light': 1, speakers: 1, plant: 1 },
  },
  {
    id: 'studio', name: 'Studio', tagline: 'Dual screens, full desk. Maximum output.',
    badge: 'FULL SETUP', color: '#a78bfa',
    deskId: 'panorama', seatingId: 'anchor',
    devices: { monitor: 2, keyboard: 1, mouse: 1, lamp: 1, plant: 1, webcam: 1, hub: 1 },
  },
];
