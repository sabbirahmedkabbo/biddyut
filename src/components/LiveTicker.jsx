import { useState, useEffect } from 'react';
import { ALERT_POOL } from '../data/alerts';
import { PIPELINE_STAGES } from '../data/pipeline';

const EVENTS = [
  'Import Terminal Chittagong — 42,500 MT received today',
  'Godnail Depot Narayanganj — Volume discrepancy ALERT — Audit initiated',
  'Station DHK-002 Mirpur — Hoarding risk score 67 — Field team deployed',
  'LNG spot price: $26.25/MMBtu — 139% above contract rate',
  'Rajshahi Station RAJ-003 — Stock CRITICAL at 11% — Supply convoy en route',
  'Pirojpur Barisal — Station BAR-004 stock at 19% — Emergency resupply ordered',
  'Chittagong Port — MT Surma LNG tanker delayed 36 hours',
  'Sylhet SYL-003 — Dealer refusing to sell — BERC enforcement dispatched',
  'Khulna Depot KHU-T02 — Overpressure detected — Safety valve activated',
  'Quality check passed: 142 samples tested today — 2 violations flagged',
  'National fuel reserve adequacy index: 64/100',
  'Dhaka Metro LNG supply restored — 12 industrial consumers back online',
];

export default function LiveTicker() {
  const [items, setItems] = useState([...EVENTS, ...EVENTS]);

  useEffect(() => {
    const t = setInterval(() => {
      setItems(prev => {
        const next = [...prev];
        next.push(EVENTS[Math.floor(Math.random() * EVENTS.length)]);
        return next.slice(-40);
      });
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="ticker-wrapper">
      <div className="ticker-label">⚡ LIVE FEED</div>
      <div style={{flex:1,overflow:'hidden'}}>
        <div className="ticker-track">
          {items.map((item, i) => (
            <span key={i} className="ticker-item">
              <span className="ticker-dot">◆</span> {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
