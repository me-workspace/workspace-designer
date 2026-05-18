import type { DeskItem, SeatingItem, DeviceItem } from '@/model/types';

/* ════════ Starter catalog ════════
   Phase 1: re-expresses the original 3 desks / 3 chairs / 8 devices
   as plain data. Phase 2 expands this into a deep library.        */

export const DESKS: DeskItem[] = [
  {
    id: 'solo', category: 'desk', name: 'Solo', price: 550000,
    tagline: 'Clean lines. Zero distractions.',
    description: 'Compact 120×60 cm solid oak desk. Built-in cable tray, adjustable leveling feet.',
    tags: ['compact', 'oak', 'cable-managed'],
    spec: { shape: 'straight', height: 'fixed', legStyle: 'panel', surfaceColor: '#D4B886', edgeColor: '#A07840', grainColor: '#C4A870', widthScale: 1 },
  },
  {
    id: 'panorama', category: 'desk', name: 'Panorama', price: 850000,
    tagline: 'Spread out. Think bigger.',
    description: 'Spacious L-shaped 160×80 cm walnut desk. Seamless corner join, hidden cable spine, drawer unit.',
    tags: ['l-shaped', 'walnut', 'spacious'],
    spec: { shape: 'l-shaped', height: 'fixed', legStyle: 'a-frame', surfaceColor: '#9A6A3A', edgeColor: '#6A4420', grainColor: '#7A5430', widthScale: 1.3 },
  },
  {
    id: 'rise', category: 'desk', name: 'Rise', price: 950000,
    tagline: 'Sit. Stand. Repeat.',
    description: 'Electric height-adjustable 140×70 cm. 4 memory presets, whisper-quiet motor. Bamboo surface.',
    tags: ['standing', 'bamboo', 'motorised'],
    spec: { shape: 'straight', height: 'standing', legStyle: 'pillar', surfaceColor: '#E8D4A0', edgeColor: '#B8A070', grainColor: '#D4C090', widthScale: 1.1 },
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
    id: 'anchor', category: 'seating', name: 'Anchor', price: 680000,
    tagline: 'The executive throne.',
    description: 'Premium leather executive chair. High back, reclining mechanism, padded headrest.',
    tags: ['leather', 'executive', 'reclining'],
    spec: { style: 'leather', seatColor: '#2a2a2f', backColor: '#343439', baseColor: '#1a1a1f', hasArmrests: true, hasHeadrest: true },
  },
  {
    id: 'zen', category: 'seating', name: 'Zen', price: 580000,
    tagline: 'Engineered for deep work.',
    description: 'High-end ergonomic task chair with dynamic lumbar, synchro tilt, ocean-plastic shell.',
    tags: ['ergonomic', 'synchro-tilt', 'sustainable'],
    spec: { style: 'ergonomic', seatColor: '#0D6E63', backColor: '#0A5A52', baseColor: '#0D6E63', hasArmrests: true, hasHeadrest: false },
  },
];

export const DEVICES: DeviceItem[] = [
  {
    id: 'monitor', category: 'device', name: '24" Monitor', price: 320000, maxPerStation: 3,
    tagline: 'IPS 144Hz. Crystal clear.',
    description: 'Full HD IPS display with HDMI, DisplayPort, USB-C. Adjustable stand.',
    tags: ['ips', '144hz', 'usb-c'],
    spec: { group: 'display', glyph: 'monitor', primaryColor: '#1a1a1e', accentColor: '#4ade80', footprint: { w: 0.27, h: 0.58 }, defaultSlot: 'desk-back' },
  },
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
    id: 'lamp', category: 'device', name: 'LED Desk Lamp', price: 95000, maxPerStation: 1,
    tagline: 'Three colour temps.',
    description: 'Adjustable arm, 2700K–6500K, wireless charging base, USB-A port.',
    tags: ['adjustable', 'wireless-charging'],
    spec: { group: 'lighting', glyph: 'lamp', primaryColor: '#2a2a32', accentColor: '#ffe850', footprint: { w: 0.12, h: 0.82 }, defaultSlot: 'desk-right', emitsLight: true },
  },
  {
    id: 'plant', category: 'device', name: 'Tropical Plant', price: 65000, maxPerStation: 2,
    tagline: 'Bali, on your desk.',
    description: 'Curated pothos or succulent in a ceramic pot. Swapped monthly.',
    tags: ['greenery', 'curated'],
    spec: { group: 'nature', glyph: 'plant', primaryColor: '#2a8838', accentColor: '#1e7030', footprint: { w: 0.14, h: 0.5 }, defaultSlot: 'desk-left' },
  },
  {
    id: 'webcam', category: 'device', name: 'HD Webcam', price: 160000, maxPerStation: 1,
    tagline: '1080p 60fps. Auto-focus.',
    description: '1080p webcam, stereo noise-cancelling mic. Clips onto any monitor.',
    tags: ['1080p', 'auto-focus'],
    spec: { group: 'compute', glyph: 'webcam', primaryColor: '#151518', accentColor: '#4ade80', footprint: { w: 0.08, h: 0.1 }, defaultSlot: 'desk-back' },
  },
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
    id: 'studio', name: 'Studio', tagline: 'Dual monitors, full desk. Maximum output.',
    badge: 'FULL SETUP', color: '#a78bfa',
    deskId: 'panorama', seatingId: 'anchor',
    devices: { monitor: 2, keyboard: 1, mouse: 1, lamp: 1, plant: 1, webcam: 1 },
  },
];
