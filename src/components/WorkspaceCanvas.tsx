'use client';

import { WorkspaceSelection } from '@/types';

interface Props {
  selection: WorkspaceSelection;
}

export default function WorkspaceCanvas({ selection }: Props) {
  const { desk, chair, accessories } = selection;

  const monitorQty = accessories['monitor']?.quantity ?? 0;
  const hasLamp = (accessories['lamp']?.quantity ?? 0) > 0;
  const plantQty = accessories['plant']?.quantity ?? 0;
  const hasWebcam = (accessories['webcam']?.quantity ?? 0) > 0;
  const hasHub = (accessories['hub']?.quantity ?? 0) > 0;
  const hasCharger = (accessories['charger']?.quantity ?? 0) > 0;

  const isEmpty = !desk && !chair;

  const deskW = desk ? Math.round(420 * desk.widthScale) : 420;
  const deskH = 200;
  const deskX = (800 - deskW) / 2;
  const deskY = 170;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl bg-[#EDE8DF]">
      <svg
        viewBox="0 0 800 560"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#DDD8CF" strokeWidth="0.5" />
          </pattern>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#1A1510" floodOpacity="0.12" />
          </filter>
          <filter id="shadowSm" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#1A1510" floodOpacity="0.15" />
          </filter>
          <linearGradient id="deskGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={desk?.surfaceColor ?? '#C8A165'} />
            <stop offset="100%" stopColor={desk?.edgeColor ?? '#9A6E3A'} />
          </linearGradient>
          <linearGradient id="screenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E3A5F" />
            <stop offset="100%" stopColor="#0D2040" />
          </linearGradient>
          <linearGradient id="chairGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chair?.seatColor ?? '#2A2A2A'} />
            <stop offset="100%" stopColor={chair?.baseColor ?? '#111'} />
          </linearGradient>
        </defs>

        {/* Floor */}
        <rect width="800" height="560" fill="#EDE8DF" />
        <rect width="800" height="560" fill="url(#grid)" />

        {/* Soft vignette */}
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor="transparent" />
          <stop offset="100%" stopColor="#00000010" />
        </radialGradient>
        <rect width="800" height="560" fill="url(#vignette)" />

        {/* empty state */}
        {isEmpty && (
          <g>
            <text x="400" y="240" textAnchor="middle" fontSize="64" opacity="0.15">🏝</text>
            <text x="400" y="310" textAnchor="middle" fontSize="18" fill="#9A8E80" fontWeight="500">
              Your workspace is empty
            </text>
            <text x="400" y="336" textAnchor="middle" fontSize="14" fill="#B0A494">
              Pick a desk to get started →
            </text>
          </g>
        )}

        {/* desk */}
        {desk && (
          <g className="animate-float-in" key={`desk-${desk.id}`}>
            {/* Rug under desk */}
            <ellipse
              cx={deskX + deskW / 2}
              cy={deskY + deskH + 80}
              rx={deskW / 2 + 40}
              ry={120}
              fill="#D6CFC4"
              opacity="0.5"
            />

            {/* Desk shadow */}
            <rect
              x={deskX + 4}
              y={deskY + 6}
              width={deskW}
              height={deskH}
              rx="16"
              fill="#1A1510"
              opacity="0.12"
              filter="url(#shadow)"
            />

            {/* Desk surface */}
            <rect
              x={deskX}
              y={deskY}
              width={deskW}
              height={deskH}
              rx="14"
              fill="url(#deskGrad)"
            />

            {/* Wood grain lines */}
            {Array.from({ length: 7 }, (_, i) => (
              <line
                key={i}
                x1={deskX + 12}
                y1={deskY + 20 + i * 25}
                x2={deskX + deskW - 12}
                y2={deskY + 20 + i * 25}
                stroke={desk.grainColor}
                strokeWidth="0.6"
                opacity="0.45"
              />
            ))}

            {/* Desk front edge */}
            <rect
              x={deskX}
              y={deskY + deskH - 10}
              width={deskW}
              height="10"
              rx="0"
              fill={desk.edgeColor}
              opacity="0.7"
            />

            {/* Desk legs */}
            <rect x={deskX + 16} y={deskY + deskH} width="14" height="28" rx="3" fill={desk.edgeColor} />
            <rect x={deskX + deskW - 30} y={deskY + deskH} width="14" height="28" rx="3" fill={desk.edgeColor} />

            {/* L-shaped extension for Panorama */}
            {desk.style === 'lshaped' && (
              <g>
                <rect
                  x={deskX + deskW - 10}
                  y={deskY + 20}
                  width="120"
                  height={deskH - 30}
                  rx="10"
                  fill="url(#deskGrad)"
                />
                {Array.from({ length: 5 }, (_, i) => (
                  <line
                    key={i}
                    x1={deskX + deskW - 4}
                    y1={deskY + 30 + i * 28}
                    x2={deskX + deskW + 108}
                    y2={deskY + 30 + i * 28}
                    stroke={desk.grainColor}
                    strokeWidth="0.6"
                    opacity="0.4"
                  />
                ))}
                <rect
                  x={deskX + deskW + 84}
                  y={deskY + deskH}
                  width="14"
                  height="28"
                  rx="3"
                  fill={desk.edgeColor}
                />
              </g>
            )}

            {/* Standing desk motor bar */}
            {desk.style === 'standing' && (
              <rect
                x={deskX + deskW / 2 - 60}
                y={deskY + deskH}
                width="120"
                height="8"
                rx="4"
                fill="#888880"
              />
            )}


            {/* Keyboard — always shown when desk is selected */}
            <g className="animate-fade-up">
              <rect
                x={deskX + deskW / 2 - 90}
                y={deskY + deskH - 52}
                width="180"
                height="34"
                rx="5"
                fill="#E2DDD5"
                filter="url(#shadowSm)"
              />
              <rect
                x={deskX + deskW / 2 - 87}
                y={deskY + deskH - 49}
                width="174"
                height="28"
                rx="4"
                fill="#D6D0C8"
              />
              {/* Key rows */}
              {[0, 1, 2].map(row =>
                Array.from({ length: row === 0 ? 12 : row === 1 ? 11 : 10 }, (_, col) => (
                  <rect
                    key={`key-${row}-${col}`}
                    x={deskX + deskW / 2 - 83 + col * 14 + (row === 1 ? 7 : row === 2 ? 14 : 0)}
                    y={deskY + deskH - 46 + row * 9}
                    width="10"
                    height="7"
                    rx="1.5"
                    fill="#C8C0B8"
                  />
                ))
              )}
            </g>

            {/* Mouse */}
            <g className="animate-fade-up">
              <ellipse
                cx={deskX + deskW / 2 + 112}
                cy={deskY + deskH - 38}
                rx="14"
                ry="18"
                fill="#E0DAD2"
                filter="url(#shadowSm)"
              />
              <ellipse
                cx={deskX + deskW / 2 + 112}
                cy={deskY + deskH - 43}
                rx="9"
                ry="3"
                fill="#C8C0B8"
              />
            </g>

            {/* Hub */}
            {hasHub && (
              <g className="animate-scale-in">
                <rect
                  x={deskX + deskW / 2 - 160}
                  y={deskY + deskH - 50}
                  width="48"
                  height="24"
                  rx="5"
                  fill="#3A3A3A"
                  filter="url(#shadowSm)"
                />
                {[0, 1, 2].map(i => (
                  <rect key={i} x={deskX + deskW / 2 - 150 + i * 14} y={deskY + deskH - 44} width="8" height="12" rx="2" fill="#555" />
                ))}
                <circle cx={deskX + deskW / 2 - 119} cy={deskY + deskH - 36} r="3" fill="#00E5A0" />
              </g>
            )}

            {/* Wireless charger */}
            {hasCharger && (
              <g className="animate-scale-in">
                <ellipse
                  cx={deskX + deskW / 2 + 155}
                  cy={deskY + deskH - 80}
                  rx="22"
                  ry="5"
                  fill="#2A2A2A"
                  filter="url(#shadowSm)"
                />
                <ellipse cx={deskX + deskW / 2 + 155} cy={deskY + deskH - 82} rx="22" ry="5" fill="#333" />
                <circle cx={deskX + deskW / 2 + 155} cy={deskY + deskH - 82} r="8" fill="#444" />
                <circle cx={deskX + deskW / 2 + 155} cy={deskY + deskH - 82} r="4" fill="#00E5FF" opacity="0.6" />
              </g>
            )}

            {monitorQty >= 1 && (
              <g key="monitor-1" className="animate-float-in">
                {/* Stand */}
                <rect
                  x={deskX + deskW / 2 - (monitorQty >= 2 ? 80 : 10)}
                  y={deskY + 115}
                  width="20"
                  height="40"
                  rx="4"
                  fill="#1A1A1A"
                />
                <rect
                  x={deskX + deskW / 2 - (monitorQty >= 2 ? 90 : 20)}
                  y={deskY + 152}
                  width="40"
                  height="8"
                  rx="3"
                  fill="#1A1A1A"
                />
                {/* Monitor body */}
                <rect
                  x={deskX + deskW / 2 - (monitorQty >= 2 ? 158 : 88)}
                  y={deskY + 18}
                  width="156"
                  height="102"
                  rx="6"
                  fill="#1A1A1A"
                  filter="url(#shadow)"
                />
                {/* Screen */}
                <rect
                  x={deskX + deskW / 2 - (monitorQty >= 2 ? 154 : 84)}
                  y={deskY + 22}
                  width="148"
                  height="90"
                  rx="4"
                  fill="url(#screenGrad)"
                />
                {/* Screen content */}
                <rect x={deskX + deskW / 2 - (monitorQty >= 2 ? 148 : 78)} y={deskY + 30} width="80" height="6" rx="2" fill="#2A4A70" opacity="0.8" />
                <rect x={deskX + deskW / 2 - (monitorQty >= 2 ? 148 : 78)} y={deskY + 42} width="120" height="4" rx="1" fill="#2A4A70" opacity="0.5" />
                <rect x={deskX + deskW / 2 - (monitorQty >= 2 ? 148 : 78)} y={deskY + 52} width="96" height="4" rx="1" fill="#2A4A70" opacity="0.5" />
                <rect x={deskX + deskW / 2 - (monitorQty >= 2 ? 148 : 78)} y={deskY + 62} width="60" height="4" rx="1" fill="#2A4A70" opacity="0.4" />
                {/* Cursor blink */}
                <rect x={deskX + deskW / 2 - (monitorQty >= 2 ? 82 : 12)} y={deskY + 62} width="2" height="12" rx="1" fill="#58D4FF" opacity="0.8" />
                {/* Webcam */}
                {hasWebcam && (
                  <g>
                    <circle
                      cx={deskX + deskW / 2 - (monitorQty >= 2 ? 80 : 10)}
                      cy={deskY + 16}
                      r="5"
                      fill="#333"
                    />
                    <circle
                      cx={deskX + deskW / 2 - (monitorQty >= 2 ? 80 : 10)}
                      cy={deskY + 16}
                      r="3"
                      fill="#111"
                    />
                    <circle
                      cx={deskX + deskW / 2 - (monitorQty >= 2 ? 80 : 10)}
                      cy={deskY + 16}
                      r="1.5"
                      fill="#FF3333"
                      opacity="0.9"
                    />
                  </g>
                )}
              </g>
            )}

            {/* Monitor 2 */}
            {monitorQty >= 2 && (
              <g key="monitor-2" className="animate-float-in">
                <rect x={deskX + deskW / 2 + 60} y={deskY + 115} width="20" height="40" rx="4" fill="#1A1A1A" />
                <rect x={deskX + deskW / 2 + 50} y={deskY + 152} width="40" height="8" rx="3" fill="#1A1A1A" />
                <rect
                  x={deskX + deskW / 2 + 2}
                  y={deskY + 18}
                  width="156"
                  height="102"
                  rx="6"
                  fill="#1A1A1A"
                  filter="url(#shadow)"
                />
                <rect x={deskX + deskW / 2 + 6} y={deskY + 22} width="148" height="90" rx="4" fill="url(#screenGrad)" />
                <rect x={deskX + deskW / 2 + 12} y={deskY + 30} width="60" height="6" rx="2" fill="#2A4A70" opacity="0.7" />
                <rect x={deskX + deskW / 2 + 12} y={deskY + 42} width="100" height="4" rx="1" fill="#2A4A70" opacity="0.5" />
                <rect x={deskX + deskW / 2 + 12} y={deskY + 52} width="80" height="4" rx="1" fill="#2A4A70" opacity="0.4" />
                <rect x={deskX + deskW / 2 + 12} y={deskY + 66} width="50" height="30" rx="3" fill="#1A3A5A" opacity="0.6" />
              </g>
            )}

            {/* Monitor 3 */}
            {monitorQty >= 3 && (
              <g key="monitor-3" className="animate-float-in">
                <rect x={deskX + deskW / 2 + 206} y={deskY + 125} width="14" height="34" rx="3" fill="#1A1A1A" />
                <rect
                  x={deskX + deskW / 2 + 162}
                  y={deskY + 28}
                  width="100"
                  height="66"
                  rx="5"
                  fill="#1A1A1A"
                />
                <rect x={deskX + deskW / 2 + 166} y={deskY + 32} width="92" height="56" rx="3" fill="url(#screenGrad)" />
              </g>
            )}

            {hasLamp && (
              <g key="lamp" className="animate-float-in">
                {/* Base */}
                <ellipse
                  cx={deskX + deskW - 48}
                  cy={deskY + deskH - 20}
                  rx="18"
                  ry="7"
                  fill="#8A8A8A"
                  filter="url(#shadowSm)"
                />
                {/* Arm */}
                <line
                  x1={deskX + deskW - 48}
                  y1={deskY + deskH - 20}
                  x2={deskX + deskW - 48}
                  y2={deskY + 80}
                  stroke="#AAAAAA"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <line
                  x1={deskX + deskW - 48}
                  y1={deskY + 80}
                  x2={deskX + deskW - 20}
                  y2={deskY + 55}
                  stroke="#AAAAAA"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                {/* Shade */}
                <ellipse cx={deskX + deskW - 10} cy={deskY + 48} rx="22" ry="12" fill="#F5E060" />
                <ellipse cx={deskX + deskW - 10} cy={deskY + 48} rx="18" ry="9" fill="#FFE840" />
                {/* Glow */}
                <radialGradient id="lampGlow" cx="50%" cy="100%" r="80%">
                  <stop offset="0%" stopColor="#FFE840" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#FFE840" stopOpacity="0" />
                </radialGradient>
                <ellipse cx={deskX + deskW - 10} cy={deskY + 80} rx="50" ry="30" fill="url(#lampGlow)" />
              </g>
            )}

            {plantQty >= 1 && (
              <g key="plant-1" className="animate-float-in">
                {/* Pot */}
                <path
                  d={`M ${deskX + 32} ${deskY + deskH - 18} L ${deskX + 28} ${deskY + deskH - 42} L ${deskX + 56} ${deskY + deskH - 42} L ${deskX + 52} ${deskY + deskH - 18} Z`}
                  fill="#B8602A"
                />
                <ellipse cx={deskX + 42} cy={deskY + deskH - 42} rx="14" ry="5" fill="#C87030" />
                <ellipse cx={deskX + 42} cy={deskY + deskH - 18} rx="12" ry="4" fill="#A05020" />
                {/* Leaves */}
                <circle cx={deskX + 42} cy={deskY + deskH - 72} r="20" fill="#2D8B45" />
                <circle cx={deskX + 28} cy={deskY + deskH - 65} r="14" fill="#38A455" />
                <circle cx={deskX + 56} cy={deskY + deskH - 65} r="14" fill="#38A455" />
                <circle cx={deskX + 42} cy={deskY + deskH - 84} r="11" fill="#44B460" />
              </g>
            )}
            {plantQty >= 2 && (
              <g key="plant-2" className="animate-float-in">
                <path
                  d={`M ${deskX + 78} ${deskY + deskH - 16} L ${deskX + 74} ${deskY + deskH - 36} L ${deskX + 96} ${deskY + deskH - 36} L ${deskX + 92} ${deskY + deskH - 16} Z`}
                  fill="#B8602A"
                />
                <ellipse cx={deskX + 85} cy={deskY + deskH - 36} rx="11" ry="4" fill="#C87030" />
                <circle cx={deskX + 85} cy={deskY + deskH - 58} r="15" fill="#2D8B45" />
                <circle cx={deskX + 74} cy={deskY + deskH - 54} r="10" fill="#38A455" />
                <circle cx={deskX + 96} cy={deskY + deskH - 54} r="10" fill="#38A455" />
              </g>
            )}
          </g>
        )}

        {/* chair */}
        {chair && (
          <g
            key={`chair-${chair.id}`}
            className="animate-float-in"
            transform={`translate(${400 - 60}, ${deskY + deskH + 30})`}
          >
            {/* Chair shadow */}
            <ellipse cx="60" cy="108" rx="54" ry="20" fill="#1A1510" opacity="0.10" />

            {/* Seat */}
            <rect x="10" y="28" width="100" height="72" rx="14" fill={chair.seatColor} filter="url(#shadowSm)" />

            {/* Seat highlight */}
            <rect x="16" y="34" width="88" height="20" rx="8" fill={chair.seatColor} opacity="0.6" />
            <rect x="16" y="34" width="88" height="10" rx="6" fill="white" opacity="0.07" />

            {/* Back */}
            {chair.style === 'mesh' && (
              <g>
                <rect x="18" y="-48" width="84" height="82" rx="10" fill={chair.backColor} />
                {/* Mesh pattern */}
                {Array.from({ length: 5 }, (_, row) =>
                  Array.from({ length: 6 }, (_, col) => (
                    <rect
                      key={`mesh-${row}-${col}`}
                      x={24 + col * 13}
                      y={-42 + row * 15}
                      width="9"
                      height="11"
                      rx="2"
                      fill={chair.seatColor}
                      opacity="0.4"
                    />
                  ))
                )}
                {/* Headrest knob */}
                <rect x="40" y="-58" width="40" height="14" rx="6" fill={chair.backColor} />
              </g>
            )}
            {chair.style === 'leather' && (
              <g>
                <rect x="14" y="-65" width="92" height="98" rx="12" fill={chair.backColor} filter="url(#shadowSm)" />
                <rect x="20" y="-58" width="80" height="84" rx="9" fill={chair.seatColor} opacity="0.5" />
                {/* Tufting */}
                {[[40, -35], [80, -35], [60, -12], [40, 11], [80, 11]].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="3" fill={chair.backColor} opacity="0.6" />
                ))}
                {/* Headrest */}
                <rect x="22" y="-80" width="76" height="20" rx="8" fill={chair.backColor} />
              </g>
            )}
            {chair.style === 'ergonomic' && (
              <g>
                <path
                  d={`M 20 -50 Q 10 -30 16 28 L 104 28 Q 110 -30 100 -50 Q 80 -75 60 -78 Q 40 -75 20 -50 Z`}
                  fill={chair.backColor}
                  filter="url(#shadowSm)"
                />
                <path
                  d={`M 26 -44 Q 18 -26 22 28 L 98 28 Q 102 -26 94 -44 Q 76 -68 60 -70 Q 44 -68 26 -44 Z`}
                  fill={chair.seatColor}
                  opacity="0.5"
                />
                {/* Lumbar */}
                <path d="M 22 10 Q 60 20 98 10" stroke={chair.backColor} strokeWidth="5" fill="none" opacity="0.5" />
              </g>
            )}

            {/* Armrests */}
            <rect x="-4" y="36" width="16" height="40" rx="6" fill={chair.backColor} />
            <rect x="108" y="36" width="16" height="40" rx="6" fill={chair.backColor} />
            <rect x="-8" y="52" width="20" height="12" rx="4" fill={chair.seatColor} opacity="0.7" />
            <rect x="108" y="52" width="20" height="12" rx="4" fill={chair.seatColor} opacity="0.7" />

            {/* Base star */}
            {[-72, -36, 0, 36, 72].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const x2 = 60 + Math.cos(rad) * 44;
              const y2 = 98 + Math.sin(rad) * 18;
              return (
                <line key={i} x1="60" y1="98" x2={x2} y2={y2} stroke={chair.baseColor} strokeWidth="6" strokeLinecap="round" />
              );
            })}
            <circle cx="60" cy="98" r="9" fill={chair.baseColor} />
            {/* Casters */}
            {[-72, -36, 0, 36, 72].map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const cx = 60 + Math.cos(rad) * 44;
              const cy = 98 + Math.sin(rad) * 18;
              return <circle key={i} cx={cx} cy={cy} r="5" fill="#555" />;
            })}
          </g>
        )}

        {/* Bottom label */}
        {(desk || chair) && (
          <text x="400" y="536" textAnchor="middle" fontSize="11" fill="#9A8E80" letterSpacing="0.08em">
            {[desk?.name, chair?.name, monitorQty > 0 ? `${monitorQty}× Monitor` : '', hasLamp ? 'Lamp' : '', plantQty > 0 ? `${plantQty}× Plant` : '']
              .filter(Boolean)
              .join('  ·  ')}
          </text>
        )}
      </svg>
    </div>
  );
}
