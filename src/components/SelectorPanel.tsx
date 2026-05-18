'use client';

import { Desk, Chair, Accessory, WorkspaceSelection } from '@/types';
import { DESKS, CHAIRS, ACCESSORIES, CATEGORY_LABELS } from '@/data/products';

interface Props {
  selection: WorkspaceSelection;
  onDeskChange: (desk: Desk) => void;
  onChairChange: (chair: Chair) => void;
  onAccessoryChange: (accessory: Accessory, delta: number) => void;
}

function formatIDR(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

const CATEGORY_ICONS: Record<string, string> = {
  display: '🖥',
  lighting: '💡',
  nature: '🌿',
  tech: '⚡',
};

export default function SelectorPanel({ selection, onDeskChange, onChairChange, onAccessoryChange }: Props) {
  const accessoriesByCategory = ACCESSORIES.reduce<Record<string, Accessory[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Desk */}
      <Section title="Desk" subtitle="Choose your surface">
        <div className="space-y-2">
          {DESKS.map(desk => (
            <ProductCard
              key={desk.id}
              name={desk.name}
              tagline={desk.tagline}
              price={desk.price}
              selected={selection.desk?.id === desk.id}
              onClick={() => onDeskChange(desk)}
              accent={desk.surfaceColor}
            />
          ))}
        </div>
      </Section>

      <Divider />

      {/* Chair */}
      <Section title="Chair" subtitle="Find your seat">
        <div className="space-y-2">
          {CHAIRS.map(chair => (
            <ProductCard
              key={chair.id}
              name={chair.name}
              tagline={chair.tagline}
              price={chair.price}
              selected={selection.chair?.id === chair.id}
              onClick={() => onChairChange(chair)}
              accent={chair.seatColor}
            />
          ))}
        </div>
      </Section>

      <Divider />

      {/* Accessories */}
      <Section title="Accessories" subtitle="Build it out">
        <div className="space-y-4">
          {Object.entries(accessoriesByCategory).map(([category, items]) => (
            <div key={category}>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#9A8E80] mb-2">
                {CATEGORY_ICONS[category]} {CATEGORY_LABELS[category]}
              </p>
              <div className="space-y-2">
                {items.map(accessory => {
                  const qty = selection.accessories[accessory.id]?.quantity ?? 0;
                  return (
                    <AccessoryCard
                      key={accessory.id}
                      accessory={accessory}
                      quantity={qty}
                      onAdd={() => onAccessoryChange(accessory, 1)}
                      onRemove={() => onAccessoryChange(accessory, -1)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <div className="h-4" />
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="px-5 py-4">
      <div className="mb-3">
        <h2 className="text-sm font-bold text-[#1A1510] tracking-tight">{title}</h2>
        <p className="text-xs text-[#9A8E80] mt-0.5">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="mx-5 border-t border-[#E8E0D0]" />;
}

function ProductCard({
  name,
  tagline,
  price,
  selected,
  onClick,
  accent,
}: {
  name: string;
  tagline: string;
  price: number;
  selected: boolean;
  onClick: () => void;
  accent: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl px-3 py-2.5 transition-all duration-200 cursor-pointer border ${
        selected
          ? 'bg-[#1A1510] border-[#1A1510] text-white shadow-md'
          : 'bg-white border-[#E8E0D0] text-[#1A1510] hover:border-[#C4B8A8] hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {/* Color swatch */}
        <span
          className="w-3 h-3 rounded-full flex-shrink-0 ring-1 ring-black/10"
          style={{ backgroundColor: accent }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-1">
            <span className="text-sm font-semibold truncate">{name}</span>
            <span className={`text-xs font-medium flex-shrink-0 ${selected ? 'text-white/70' : 'text-[#9A8E80]'}`}>
              {formatIDR(price)}<span className="opacity-60">/mo</span>
            </span>
          </div>
          <p className={`text-xs mt-0.5 truncate ${selected ? 'text-white/70' : 'text-[#9A8E80]'}`}>{tagline}</p>
        </div>
        {selected && (
          <span className="text-white/80 flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6.5" stroke="currentColor" />
              <path d="M4 7l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>
    </button>
  );
}

function AccessoryCard({
  accessory,
  quantity,
  onAdd,
  onRemove,
}: {
  accessory: Accessory;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const active = quantity > 0;
  return (
    <div
      className={`rounded-xl px-3 py-2.5 border transition-all duration-200 ${
        active ? 'bg-[#F0F9F7] border-[#0E8C7E]/30' : 'bg-white border-[#E8E0D0]'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-[#1A1510] truncate">{accessory.name}</span>
            <span className="text-xs text-[#9A8E80]">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(accessory.price)}/mo
            </span>
          </div>
          <p className="text-xs text-[#9A8E80] mt-0.5 truncate">{accessory.tagline}</p>
        </div>

        {/* Quantity controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {quantity > 0 && (
            <button
              onClick={onRemove}
              className="w-6 h-6 rounded-full bg-[#E8E0D0] hover:bg-[#D8D0C0] text-[#1A1510] flex items-center justify-center text-sm font-bold transition-colors"
            >
              −
            </button>
          )}
          {quantity > 0 && (
            <span className="text-sm font-bold text-[#0E8C7E] w-4 text-center">{quantity}</span>
          )}
          {quantity < accessory.maxQuantity && (
            <button
              onClick={onAdd}
              className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                quantity === 0
                  ? 'bg-[#1A1510] hover:bg-[#2A2520] text-white'
                  : 'bg-[#0E8C7E] hover:bg-[#0A7068] text-white'
              }`}
            >
              +
            </button>
          )}
          {quantity === accessory.maxQuantity && accessory.maxQuantity > 0 && (
            <span className="text-xs text-[#9A8E80] italic">max</span>
          )}
        </div>
      </div>
    </div>
  );
}
