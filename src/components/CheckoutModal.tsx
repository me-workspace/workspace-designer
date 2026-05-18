'use client';

import { WorkspaceSelection } from '@/types';
import { useState } from 'react';

interface Props {
  selection: WorkspaceSelection;
  total: number;
  onClose: () => void;
}

function formatIDR(amount: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
}

export default function CheckoutModal({ selection, total, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const items = [
    ...(selection.desk ? [{ name: `${selection.desk.name} Desk`, price: selection.desk.price, qty: 1 }] : []),
    ...(selection.chair ? [{ name: `${selection.chair.name} Chair`, price: selection.chair.price, qty: 1 }] : []),
    ...Object.values(selection.accessories).map(({ item, quantity }) => ({
      name: item.name,
      price: item.price,
      qty: quantity,
    })),
  ];

  const handleRent = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-backdrop"
      style={{ background: 'rgba(26,21,16,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-[#F7F2EA] rounded-2xl overflow-hidden shadow-2xl animate-slide-up">
        {submitted ? (
          <SuccessView onClose={onClose} />
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E8E0D0]">
              <div>
                <h2 className="text-lg font-bold text-[#1A1510]">Your Setup</h2>
                <p className="text-sm text-[#9A8E80] mt-0.5">Review before renting</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#E8E0D0] hover:bg-[#D8D0C0] flex items-center justify-center transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 1l10 10M11 1L1 11" stroke="#1A1510" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Line items */}
            <div className="px-6 py-4 space-y-2 max-h-64 overflow-y-auto">
              {items.length === 0 ? (
                <p className="text-sm text-[#9A8E80] text-center py-4">Nothing selected yet.</p>
              ) : (
                items.map((item, i) => (
                  <div key={i} className="flex items-baseline justify-between gap-2">
                    <span className="text-sm text-[#1A1510]">
                      {item.qty > 1 && <span className="text-[#9A8E80] mr-1">{item.qty}×</span>}
                      {item.name}
                    </span>
                    <span className="text-sm text-[#9A8E80] flex-shrink-0">
                      {formatIDR(item.price * item.qty)}<span className="text-xs">/mo</span>
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Total + CTA */}
            <div className="px-6 pb-6 pt-2 border-t border-[#E8E0D0]">
              <div className="flex items-baseline justify-between mb-4 pt-3">
                <span className="text-base font-bold text-[#1A1510]">Monthly total</span>
                <span className="text-xl font-bold text-[#1A1510]">
                  {formatIDR(total)}<span className="text-sm font-normal text-[#9A8E80]">/mo</span>
                </span>
              </div>

              <p className="text-xs text-[#9A8E80] mb-4">
                Free delivery to anywhere in Bali · Cancel anytime with 7 days notice · Swap items monthly
              </p>

              <button
                onClick={handleRent}
                disabled={items.length === 0 || loading}
                className="w-full py-3.5 rounded-xl bg-[#FF6B35] hover:bg-[#E85C25] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="2" strokeDasharray="28" strokeDashoffset="10" />
                    </svg>
                    Processing…
                  </span>
                ) : (
                  'Rent My Setup →'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SuccessView({ onClose }: { onClose: () => void }) {
  return (
    <div className="px-6 py-10 text-center animate-fade-up">
      <div className="text-5xl mb-4">🏝</div>
      <h2 className="text-xl font-bold text-[#1A1510] mb-2">You&apos;re all set!</h2>
      <p className="text-sm text-[#9A8E80] mb-1">
        Your workspace is reserved. Our team will reach out within 24 hours to confirm delivery.
      </p>
      <p className="text-xs text-[#B0A494] mb-8">
        Questions? hello@monis.rent
      </p>
      <button
        onClick={onClose}
        className="px-6 py-2.5 rounded-xl bg-[#1A1510] text-white text-sm font-semibold hover:bg-[#2A2520] transition-colors"
      >
        Back to designer
      </button>
    </div>
  );
}
