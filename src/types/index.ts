export interface Desk {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  style: 'minimal' | 'lshaped' | 'standing';
  surfaceColor: string;
  edgeColor: string;
  grainColor: string;
  widthScale: number;
}

export interface Chair {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  style: 'mesh' | 'leather' | 'ergonomic';
  seatColor: string;
  backColor: string;
  baseColor: string;
}

export interface Accessory {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  category: 'display' | 'lighting' | 'nature' | 'tech';
  maxQuantity: number;
}

export interface WorkspaceSelection {
  desk: Desk | null;
  chair: Chair | null;
  accessories: Record<string, { item: Accessory; quantity: number }>;
}

export interface SavedPkg {
  id: string;
  name: string;
  createdAt: number;
  selection: WorkspaceSelection;
  total: number;
}
