import type { Desk, Chair, Accessory } from '@/types';

export const DESKS: Desk[] = [
  {
    id: 'solo',
    name: 'Solo',
    tagline: 'Clean lines. Zero distractions.',
    description: 'Compact 120×60 cm solid oak desk. Built-in cable management tray, adjustable leveling feet.',
    price: 550000,
    style: 'minimal',
    surfaceColor: '#D4B886',
    edgeColor: '#A07840',
    grainColor: '#C4A870',
    widthScale: 1,
  },
  {
    id: 'panorama',
    name: 'Panorama',
    tagline: 'Spread out. Think bigger.',
    description: 'Spacious L-shaped 160×80 cm walnut desk. Seamless corner join, hidden cable spine, drawer unit.',
    price: 850000,
    style: 'lshaped',
    surfaceColor: '#9A6A3A',
    edgeColor: '#6A4420',
    grainColor: '#7A5430',
    widthScale: 1.3,
  },
  {
    id: 'rise',
    name: 'Rise',
    tagline: 'Sit. Stand. Repeat.',
    description: 'Electric height-adjustable 140×70 cm. 4 memory presets, whisper-quiet motor. Bamboo surface.',
    price: 950000,
    style: 'standing',
    surfaceColor: '#E8D4A0',
    edgeColor: '#B8A070',
    grainColor: '#D4C090',
    widthScale: 1.1,
  },
];

export const CHAIRS: Chair[] = [
  {
    id: 'breeze',
    name: 'Breeze',
    tagline: 'Breathable mesh. All-day comfort.',
    description: 'Ergonomic mesh-back task chair. Adjustable lumbar, 4D armrests. Ideal for Bali\'s heat.',
    price: 420000,
    style: 'mesh',
    seatColor: '#38383d',
    backColor: '#48484f',
    baseColor: '#28282d',
  },
  {
    id: 'anchor',
    name: 'Anchor',
    tagline: 'The executive throne.',
    description: 'Premium leather executive chair. High back, reclining mechanism, padded headrest.',
    price: 680000,
    style: 'leather',
    seatColor: '#2a2a2f',
    backColor: '#343439',
    baseColor: '#1a1a1f',
  },
  {
    id: 'zen',
    name: 'Zen',
    tagline: 'Engineered for deep work.',
    description: 'High-end ergonomic task chair with dynamic lumbar, synchro tilt, ocean-plastic shell.',
    price: 580000,
    style: 'ergonomic',
    seatColor: '#0D6E63',
    backColor: '#0A5A52',
    baseColor: '#0D6E63',
  },
];

export const ACCESSORIES: Accessory[] = [
  { id: 'monitor',  name: '24" Monitor',       tagline: 'IPS 144Hz. Crystal clear.',    description: 'Full HD IPS display with HDMI, DisplayPort, USB-C. Adjustable stand.',        price: 320000, category: 'display',  maxQuantity: 3 },
  { id: 'lamp',     name: 'LED Desk Lamp',      tagline: 'Three colour temps.',          description: 'Adjustable arm, 2700K–6500K, wireless charging base, USB-A port.',            price: 95000,  category: 'lighting', maxQuantity: 1 },
  { id: 'plant',    name: 'Tropical Plant',     tagline: 'Bali, on your desk.',          description: 'Curated pothos or succulent in a ceramic pot. Swapped monthly.',               price: 65000,  category: 'nature',   maxQuantity: 2 },
  { id: 'webcam',   name: 'HD Webcam',          tagline: '1080p 60fps. Auto-focus.',     description: '1080p webcam, stereo noise-cancelling mic. Clips onto any monitor.',           price: 160000, category: 'tech',     maxQuantity: 1 },
  { id: 'hub',      name: 'USB-C Hub',          tagline: 'One cable. All ports.',        description: '7-in-1: 4K HDMI, USB-A ×3, SD+microSD, 100W pass-through charging.',          price: 85000,  category: 'tech',     maxQuantity: 1 },
  { id: 'charger',  name: 'Wireless Charger',   tagline: '15W Qi2. Just set it down.',  description: 'Qi2-compatible 15W pad. Works with iPhone and Android.',                       price: 110000, category: 'tech',     maxQuantity: 1 },
];

export const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  display:  { label: 'Displays',  icon: '⬜' },
  lighting: { label: 'Lighting',  icon: '◎' },
  nature:   { label: 'Nature',    icon: '◈' },
  tech:     { label: 'Tech',      icon: '◻' },
};

export interface PackagePreset {
  id: string;
  name: string;
  tagline: string;
  badge: string;
  color: string;
  monthlyTotal: number;
  deskId: string;
  chairId: string;
  accessories: Record<string, number>;
}

export const PACKAGE_PRESETS: PackagePreset[] = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Clean and minimal. Just get working.',
    badge: 'BEST VALUE',
    color: '#4ade80',
    monthlyTotal: 970000,
    deskId: 'solo',
    chairId: 'breeze',
    accessories: {},
  },
  {
    id: 'nomad',
    name: 'Nomad',
    tagline: 'One monitor, good chair, all you need.',
    badge: 'POPULAR',
    color: '#60a5fa',
    monthlyTotal: 1785000,
    deskId: 'rise',
    chairId: 'zen',
    accessories: { monitor: 1, lamp: 1 },
  },
  {
    id: 'studio',
    name: 'Studio',
    tagline: 'Dual monitors, full desk. Maximum output.',
    badge: 'FULL SETUP',
    color: '#a78bfa',
    monthlyTotal: 3195000,
    deskId: 'panorama',
    chairId: 'anchor',
    accessories: { monitor: 2, lamp: 1, plant: 1, webcam: 1 },
  },
];
