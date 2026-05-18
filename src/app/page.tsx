'use client';

import { useState, useMemo } from 'react';
import { Desk, Chair, Accessory, WorkspaceSelection } from '@/types';
import WorkspaceCanvas from '@/components/WorkspaceCanvas';
import SelectorPanel from '@/components/SelectorPanel';
import CheckoutModal from '@/components/CheckoutModal';

const INITIAL_SELECTION: WorkspaceSelection = {
  desk: null,
  chair: null,
  accessories: {},
};

function computeTotal(selection: WorkspaceSelection): number {
  let total = 0;
  if (selection.desk) total += selection.desk.price;
  if (selection.chair) total += selection.chair.price;
  for (const { item, quantity } of Object.values(selection.accessories)) {
    total += item.price * quantity;
  }
  return total;
}

function formatIDR(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

export default function Page() {
  const [selection, setSelection] = useState<WorkspaceSelection>(INITIAL_SELECTION);
  const [showCheckout, setShowCheckout] = useState(false);

  const total = useMemo(() => computeTotal(selection), [selection]);

  const handleDeskChange = (desk: Desk) => {
    setSelection(prev => ({ ...prev, desk }));
  };

  const handleChairChange = (chair: Chair) => {
    setSelection(prev => ({ ...prev, chair }));
  };

  const handleAccessoryChange = (accessory: Accessory, delta: number) => {
    setSelection(prev => {
      const current = prev.accessories[accessory.id]?.quantity ?? 0;
      const next = Math.min(Math.max(current + delta, 0), accessory.maxQuantity);
      if (next === 0) {
        const { [accessory.id]: _, ...rest } = prev.accessories;
        return { ...prev, accessories: rest };
      }
      return {
        ...prev,
        accessories: {
          ...prev.accessories,
          [accessory.id]: { item: accessory, quantity: next },
        },
      };
    });
  };

  const canCheckout = selection.desk !== null || selection.chair !== null;
  const itemCount =
    (selection.desk ? 1 : 0) +
    (selection.chair ? 1 : 0) +
    Object.values(selection.accessories).reduce((s, { quantity }) => s + quantity, 0);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F7F2EA]">
      {/* ── Header ── */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-[#E8E0D0] bg-[#F7F2EA] z-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🏝</span>
          <div>
            <span className="text-sm font-bold text-[#1A1510] tracking-tight">monis.rent</span>
            <span className="hidden sm:inline text-xs text-[#9A8E80] ml-2">· Workspace Designer</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {itemCount > 0 && (
            <span className="text-xs text-[#9A8E80]">
              {itemCount} item{itemCount !== 1 ? 's' : ''} · <span className="text-[#1A1510] font-semibold">{formatIDR(total)}/mo</span>
            </span>
          )}
          <button
            onClick={() => setShowCheckout(true)}
            disabled={!canCheckout}
            className="px-4 py-2 rounded-xl bg-[#FF6B35] hover:bg-[#E85C25] disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-semibold transition-all duration-150 active:scale-[0.97] shadow-sm"
          >
            Rent Setup →
          </button>
        </div>
      </header>

      {/* ── Main ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Selector Panel */}
        <aside className="w-72 lg:w-80 shrink-0 border-r border-[#E8E0D0] bg-[#F7F2EA] overflow-hidden flex flex-col">
          <SelectorPanel
            selection={selection}
            onDeskChange={handleDeskChange}
            onChairChange={handleChairChange}
            onAccessoryChange={handleAccessoryChange}
          />
        </aside>

        {/* Right: Workspace Canvas */}
        <main className="flex-1 p-4 lg:p-6 overflow-hidden flex flex-col gap-3">
          {/* Canvas label */}
          <div className="flex items-center justify-between shrink-0">
            <h1 className="text-xs font-semibold uppercase tracking-widest text-[#9A8E80]">
              Preview
            </h1>
            {!selection.desk && !selection.chair && (
              <span className="text-xs text-[#B0A494] italic">← Start by choosing a desk</span>
            )}
          </div>

          {/* Canvas */}
          <div className="flex-1 min-h-0 rounded-2xl overflow-hidden border border-[#E8E0D0] shadow-sm">
            <WorkspaceCanvas selection={selection} />
          </div>

          {/* Description panel when something is selected */}
          {(selection.desk || selection.chair) && (
            <div className="shrink-0 flex gap-3 overflow-x-auto pb-0.5">
              {selection.desk && (
                <InfoPill
                  label={selection.desk.name}
                  desc={selection.desk.description}
                  color={selection.desk.surfaceColor}
                />
              )}
              {selection.chair && (
                <InfoPill
                  label={selection.chair.name}
                  desc={selection.chair.description}
                  color={selection.chair.seatColor}
                />
              )}
            </div>
          )}
        </main>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutModal
          selection={selection}
          total={total}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </div>
  );
}

function InfoPill({ label, desc, color }: { label: string; desc: string; color: string }) {
  return (
    <div className="flex-shrink-0 max-w-xs bg-white border border-[#E8E0D0] rounded-xl px-3 py-2 flex items-start gap-2">
      <span className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ring-1 ring-black/10" style={{ backgroundColor: color }} />
      <div className="min-w-0">
        <p className="text-xs font-bold text-[#1A1510]">{label}</p>
        <p className="text-xs text-[#9A8E80] mt-0.5 line-clamp-2">{desc}</p>
      </div>
    </div>
  );
}
