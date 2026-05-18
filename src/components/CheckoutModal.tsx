'use client';

import { useState } from 'react';
import type { WorkspaceDesign } from '@/model/types';
import { getDesk, getSeating, getDevice, getZone, stationTotal, designTotal } from '@/model/design';

interface Props {
  design: WorkspaceDesign;
  onClose: () => void;
}

const idr = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

export default function CheckoutModal({ design, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const station = design.stations[0];
  const teamSize = design.stations.length;
  const perStation = stationTotal(station);
  const total = designTotal(design);
  const stationsSubtotal = perStation * teamSize;

  const stationItems: { name: string; price: number; qty: number }[] = [];
  const desk = getDesk(station.deskId);
  if (desk) stationItems.push({ name: `${desk.name} Desk`, price: desk.price, qty: 1 });
  const seating = getSeating(station.seatingId);
  if (seating) stationItems.push({ name: `${seating.name} Chair`, price: seating.price, qty: 1 });
  const counts = new Map<string, number>();
  for (const d of station.devices) counts.set(d.deviceId, (counts.get(d.deviceId) ?? 0) + 1);
  counts.forEach((n, id) => {
    const dev = getDevice(id);
    if (dev) stationItems.push({ name: dev.name, price: dev.price, qty: n });
  });

  const zoneItems: { name: string; price: number }[] = [];
  for (const z of design.zones) {
    const zone = getZone(z.zoneId);
    if (zone) zoneItems.push({ name: zone.name, price: zone.price });
  }
  const zonesTotal = zoneItems.reduce((s, z) => s + z.price, 0);
  const empty = stationItems.length === 0 && zoneItems.length === 0;

  const handleRent = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1400);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="animate-slide-up" style={{
        width: '100%', maxWidth: 420,
        background: '#1c1c1f', borderRadius: 18, border: '1px solid #2c2c2f',
        overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      }}>
        {submitted ? (
          <SuccessView onClose={onClose} />
        ) : (
          <>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 20px 16px', borderBottom: '1px solid #2c2c2f',
            }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: '#f2f2f7' }}>Your Setup</h2>
                <p style={{ fontSize: 11, color: '#71717a', marginTop: 2 }}>
                  {teamSize > 1 ? `Office for ${teamSize} · review before renting` : 'Review before renting'}
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: '#2c2c2f', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#71717a', fontSize: 14, fontWeight: 700,
                }}
              >✕</button>
            </div>

            {/* Line items */}
            <div style={{ padding: '14px 20px', maxHeight: 240, overflowY: 'auto' }}>
              {empty ? (
                <p style={{ fontSize: 12, color: '#71717a', textAlign: 'center', padding: '16px 0' }}>
                  Nothing selected yet.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {stationItems.length > 0 && (
                    <SectionLabel>{teamSize > 1 ? 'Per workspace' : 'Workspace'}</SectionLabel>
                  )}
                  {stationItems.map((item, i) => (
                    <LineRow key={`s${i}`} name={item.name} qty={item.qty} amount={item.price * item.qty} />
                  ))}
                  {zoneItems.length > 0 && (
                    <>
                      <SectionLabel>Shared zones</SectionLabel>
                      {zoneItems.map((z, i) => (
                        <LineRow key={`z${i}`} name={z.name} qty={1} amount={z.price} />
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Totals + CTA */}
            <div style={{ padding: '14px 20px 20px', borderTop: '1px solid #2c2c2f' }}>
              <TotalRow label="Per workspace" amount={perStation} />
              {teamSize > 1 && <TotalRow label={`× ${teamSize} workspaces`} amount={stationsSubtotal} />}
              {zoneItems.length > 0 && <TotalRow label={`Shared zones (${zoneItems.length})`} amount={zonesTotal} />}

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '10px 0 14px', paddingTop: 10, borderTop: '1px solid #2c2c2f' }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#f2f2f7' }}>Total</span>
                <span style={{ fontSize: 19, fontWeight: 800, color: '#4ade80' }}>
                  {idr(total)}<span style={{ fontSize: 9, color: '#52525b', fontWeight: 400 }}>/mo</span>
                </span>
              </div>

              <p style={{ fontSize: 10, color: '#52525b', marginBottom: 14, lineHeight: 1.5 }}>
                Free delivery anywhere in Bali · Cancel anytime with 7 days notice · Swap items monthly
              </p>

              <button
                onClick={handleRent}
                disabled={empty || loading}
                style={{
                  width: '100%', padding: '12px 0', borderRadius: 10,
                  background: !empty && !loading ? '#4ade80' : '#2c2c2f',
                  color: !empty && !loading ? '#09090b' : '#3f3f46',
                  border: 'none', cursor: empty ? 'not-allowed' : 'pointer',
                  fontSize: 13, fontWeight: 800, letterSpacing: '0.01em', transition: 'all 0.15s',
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <svg className="animate-spin" width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <circle cx="7.5" cy="7.5" r="5.5" stroke="#09090b" strokeWidth="2" strokeDasharray="25" strokeDashoffset="8" />
                    </svg>
                    Processing…
                  </span>
                ) : (
                  `Rent ${teamSize > 1 ? `${teamSize} Workspaces` : 'My Setup'} →`
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 10, fontWeight: 700, color: '#52525b', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 2 }}>
      {children}
    </p>
  );
}

function LineRow({ name, qty, amount }: { name: string; qty: number; amount: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
      <span style={{ fontSize: 12, color: '#d4d4d8' }}>
        {qty > 1 && <span style={{ color: '#52525b', marginRight: 4 }}>{qty}×</span>}
        {name}
      </span>
      <span style={{ fontSize: 11, color: '#71717a', flexShrink: 0 }}>
        {idr(amount)}<span style={{ fontSize: 9 }}>/mo</span>
      </span>
    </div>
  );
}

function TotalRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 5 }}>
      <span style={{ fontSize: 12, color: '#71717a' }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#a1a1aa' }}>
        {idr(amount)}<span style={{ fontSize: 9, color: '#52525b' }}>/mo</span>
      </span>
    </div>
  );
}

function SuccessView({ onClose }: { onClose: () => void }) {
  return (
    <div className="animate-fade-up" style={{ padding: '40px 24px', textAlign: 'center' }}>
      <div style={{
        width: 52, height: 52, borderRadius: '50%',
        background: 'rgba(74,222,128,0.12)', border: '1.5px solid rgba(74,222,128,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 16px', color: '#4ade80', fontSize: 22, fontWeight: 700,
      }}>✓</div>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f2f2f7', marginBottom: 8 }}>
        You&apos;re all set!
      </h2>
      <p style={{ fontSize: 12, color: '#71717a', lineHeight: 1.6, marginBottom: 6 }}>
        Your workspace is reserved. Our team will reach out within 24 hours to confirm delivery.
      </p>
      <p style={{ fontSize: 11, color: '#52525b', marginBottom: 28 }}>
        Questions? hello@monis.rent
      </p>
      <button
        onClick={onClose}
        style={{
          padding: '10px 24px', borderRadius: 10,
          background: '#4ade80', color: '#09090b',
          border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 800,
        }}
      >
        Back to designer
      </button>
    </div>
  );
}
