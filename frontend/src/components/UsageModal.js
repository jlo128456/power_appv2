import React, { useMemo } from "react";
import { createPortal } from "react-dom";

export default function UsageModal({ open, onClose, usage = [] }) {
  const { max, items, ticks } = useMemo(() => {
    const vals = usage.map(u => Number(u.usage ?? u.kwh_used ?? 0));
    const rawMax = Math.max(1, ...vals);
    // round max to a “nice” number and make 4 tick steps
    const step = Math.pow(10, String(Math.ceil(rawMax)).length - 1) / 2; // 5, 50, 500 ...
    const niceMax = Math.ceil(rawMax / step) * step;
    const mapped = usage.map((u, i) => ({
      key: `${u.month ?? i}-${i}`,
      month: String(u.month ?? i + 1),
      value: Number(u.usage ?? u.kwh_used ?? 0),
    }));
    const t = Array.from({ length: 5 }, (_, i) => (niceMax * i) / 4);
    return { max: niceMax, items: mapped, ticks: t };
  }, [usage]);

  if (!open) return null;

  const W = 620, H = 340, padL = 54, padB = 46, padT = 28, padR = 16;
  const innerW = W - padL - padR, innerH = H - padT - padB;
  const bw = items.length ? innerW / items.length : innerW;
  const y = v => padT + innerH - (v / max) * innerH;
  const x = i => padL + i * bw + bw * 0.15;

  const node = (
    <div className="modal-overlay open" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Usage History</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div className="chart-wrap">
          <svg className="bar-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="barGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#5aa5ff"/>
                <stop offset="100%" stopColor="#2e7dd7"/>
              </linearGradient>
              <filter id="soft" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="1.2" stdDeviation="1.2" floodOpacity=".18"/>
              </filter>
            </defs>

            {/* gridlines + y labels */}
            {ticks.map((t, i) => (
              <g key={`g-${i}`}>
                <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} className="grid" />
                <text x={padL - 8} y={y(t)} className="y-tick" textAnchor="end" dominantBaseline="middle">
                  {Math.round(t)} kWh
                </text>
              </g>
            ))}

            {/* x axis line */}
            <line className="axis" x1={padL} y1={padT + innerH} x2={W - padR} y2={padT + innerH} />

            {/* bars */}
            {items.map((d, i) => {
              const barW = bw * 0.7, h = (d.value / max) * innerH, yy = padT + innerH - h;
              return (
                <g key={d.key} className="bar">
                  <rect x={x(i)} y={yy} width={barW} height={h} rx="6" fill="url(#barGrad)" filter="url(#soft)" />
                  <text className="bar-val" x={x(i) + barW / 2} y={yy - 6} textAnchor="middle">
                    {d.value}
                  </text>
                  <text className="bar-label" x={x(i) + barW / 2} y={padT + innerH + 18} textAnchor="middle">
                    {d.month}
                  </text>
                </g>
              );
            })}

            {/* axis titles */}
            <text className="axis-title" x={padL} y={padT - 10}>kWh</text>
            <text className="axis-title" x={W - padR} y={padT + innerH + 34} textAnchor="end">Month</text>
          </svg>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
