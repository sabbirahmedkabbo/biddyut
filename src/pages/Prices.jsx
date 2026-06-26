import { useState, useEffect, useRef } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { LNG_PRICE_HISTORY, IMPORT_VOLUME_BY_FUEL, COUNTRY_COMPARISON, PRICE_SHOCK_THRESHOLD } from '../data/prices';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Filler, Tooltip, Legend);

function playAlarmSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [0,0.3,0.6,0.9].forEach(delay => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = 'square';
      gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.25);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.3);
    });
  } catch(e) {}
}

function ShockOverlay({ price, onDismiss }) {
  useEffect(() => {
    playAlarmSound();
    const t = setTimeout(onDismiss, 2000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className="shock-overlay" onClick={onDismiss}>
      <div className="shock-text">⚠ PRICE SHOCK ALERT ⚠</div>
      <div className="shock-sub">LNG Spot: ${price}/MMBtu — Exceeds ASPS Threshold (${PRICE_SHOCK_THRESHOLD})</div>
      <div style={{fontSize:14,color:'rgba(255,255,255,0.7)',marginTop:"clamp(12px, 3vw, 20px)"}}>সতর্কতা: বৈশ্বিক শক্তি মূল্য সীমা অতিক্রম করেছে</div>
    </div>
  );
}

function useLivePrice(initial, variance = 0.008) {
  const [price, setPrice] = useState(initial);
  const [trend, setTrend] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      const delta = (Math.random()-0.48) * initial * variance;
      setPrice(p => {
        const n = +(p + delta).toFixed(2);
        setTrend(n - p);
        return n;
      });
    }, 2000);
    return () => clearInterval(t);
  }, [initial, variance]);
  return [price, trend];
}

export default function Prices() {
  const [lngSpot, lngTrend] = useLivePrice(26.25, 0.01);
  const [crude, crudeTrend] = useLivePrice(82.45, 0.006);
  const [diesel, dieselTrend] = useLivePrice(718.50, 0.005);
  const [petrol, petrolTrend] = useLivePrice(692.30, 0.005);
  const [furnace, furnaceTrend] = useLivePrice(485.00, 0.007);
  const [lpg, lpgTrend] = useLivePrice(578.00, 0.006);

  const [shockShown, setShockShown] = useState(false);
  const shockFired = useRef(lngSpot >= PRICE_SHOCK_THRESHOLD);

  useEffect(() => {
    if (lngSpot >= PRICE_SHOCK_THRESHOLD && !shockFired.current) {
      shockFired.current = true;
      setShockShown(true);
    }
    if (lngSpot < PRICE_SHOCK_THRESHOLD) shockFired.current = false;
  }, [lngSpot]);

  const lngChartData = {
    labels: LNG_PRICE_HISTORY.map(d => d.month),
    datasets: [
      {
        label: 'LNG Spot Price ($/MMBtu)',
        data: LNG_PRICE_HISTORY.map(d => d.spot),
        borderColor: '#F42A41',
        backgroundColor: 'rgba(244,42,65,0.08)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
      },
      {
        label: 'Bangladesh Contract Price',
        data: LNG_PRICE_HISTORY.map(d => d.contract),
        borderColor: '#006A4E',
        borderDash: [6,3],
        backgroundColor: 'transparent',
        tension: 0,
        pointRadius: 3,
      },
      {
        label: `ASPS Threshold ($${PRICE_SHOCK_THRESHOLD})`,
        data: LNG_PRICE_HISTORY.map(() => PRICE_SHOCK_THRESHOLD),
        borderColor: '#f59e0b',
        borderDash: [4,4],
        backgroundColor: 'transparent',
        tension: 0,
        pointRadius: 0,
        borderWidth: 1.5,
      },
    ],
  };

  const volChartData = {
    labels: IMPORT_VOLUME_BY_FUEL.map(d => d.month),
    datasets: [
      { label:'LNG', data: IMPORT_VOLUME_BY_FUEL.map(d=>d.LNG), backgroundColor:'rgba(0,106,78,0.75)', stack:'a' },
      { label:'Diesel', data: IMPORT_VOLUME_BY_FUEL.map(d=>d.Diesel), backgroundColor:'rgba(244,42,65,0.75)', stack:'a' },
      { label:'Petrol', data: IMPORT_VOLUME_BY_FUEL.map(d=>d.Petrol), backgroundColor:'rgba(200,168,75,0.75)', stack:'a' },
      { label:'Crude Oil', data: IMPORT_VOLUME_BY_FUEL.map(d=>d.CrudeOil), backgroundColor:'rgba(99,102,241,0.75)', stack:'a' },
      { label:'Furnace Oil', data: IMPORT_VOLUME_BY_FUEL.map(d=>d.FurnaceOil), backgroundColor:'rgba(20,184,166,0.75)', stack:'a' },
    ],
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { position:'bottom', labels:{font:{size:11}} } },
    scales: {
      y: { grid:{color:'rgba(0,0,0,0.04)'}, ticks:{font:{size:11}} },
      x: { ticks:{font:{size:10}} },
    },
  };

  const gaugeShockPct = Math.min((lngSpot / (PRICE_SHOCK_THRESHOLD * 1.8)) * 100, 100);
  const gaugeOver = lngSpot >= PRICE_SHOCK_THRESHOLD;

  const priceItems = [
    {label:'Crude Oil', bn:'অপরিশোধিত তেল', val:crude, trend:crudeTrend, unit:'$/barrel'},
    {label:'LNG Spot', bn:'তরলীকৃত গ্যাস', val:lngSpot, trend:lngTrend, unit:'$/MMBtu'},
    {label:'Diesel', bn:'ডিজেল', val:diesel, trend:dieselTrend, unit:'$/MT'},
    {label:'Petrol', bn:'পেট্রোল', val:petrol, trend:petrolTrend, unit:'$/MT'},
    {label:'Furnace Oil', bn:'ফার্নেস ওয়েল', val:furnace, trend:furnaceTrend, unit:'$/MT'},
    {label:'LPG', bn:'এলপিজি', val:lpg, trend:lpgTrend, unit:'$/MT'},
  ];

  return (
    <div className="main-content">
      {shockShown && <ShockOverlay price={lngSpot.toFixed(2)} onDismiss={()=>setShockShown(false)} />}

      <div className="page-header">
        <div>
          <h2>Import &amp; Price Monitor</h2>
          <div className="bn">আমদানি ও মূল্য পর্যবেক্ষণ</div>
        </div>
        <div className="page-header-meta">
          Live commodity prices · Real-time feed<br/>
          <span style={{fontSize:10,color:'#22c55e'}}>● LIVE — Updates every 2s</span>
        </div>
      </div>

      <div className="price-grid" style={{marginBottom:"clamp(12px, 3vw, 20px)"}}>
        {priceItems.map(p => (
          <div key={p.label} className="price-card">
            <div className="price-commodity">{p.label}</div>
            <div className="price-value" style={{color: p.label==='LNG Spot'&&p.val>=PRICE_SHOCK_THRESHOLD?'#F42A41':'#1a2130'}}>
              ${p.val.toFixed(2)}
            </div>
            <div className="price-unit">{p.unit}</div>
            <div className={`price-change ${p.trend>=0?'up':'down'}`}>
              {p.trend>=0?'▲':'▼'} {Math.abs(p.trend).toFixed(2)} ({((Math.abs(p.trend)/p.val)*100).toFixed(2)}%)
            </div>
            <div style={{fontFamily:'var(--font-bn)',fontSize:11,color:'#6b7685',marginTop:"clamp(12px, 3vw, 20px)"}}>{p.bn}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{marginBottom:"clamp(12px, 3vw, 20px)",borderLeft:`4px solid ${gaugeOver?'#F42A41':'#006A4E'}`}}>
        <div className="card-header" style={{background: gaugeOver?'#991b1b':'#006A4E'}}>
          <h3>{gaugeOver?'⚠ PRICE SHOCK DETECTED':'Price Shock Detector · মূল্য ধাক্কা সনাক্তকারী'}</h3>
          <span className="bn">ASPS সীমা: ${PRICE_SHOCK_THRESHOLD}/MMBtu</span>
        </div>
        <div className="card-body">
          <div style={{display:'flex',alignItems:'center',gap:"clamp(12px, 3vw, 20px)"}}>
            <div style={{flex:1}}>
              <div style={{display:'flex',flexWrap:'wrap',justifyContent:'space-between',fontSize:"clamp(10px, 2vw, 11px)",marginBottom:"clamp(12px, 3vw, 20px)",gap:"clamp(8px, 2vw, 12px)"}}>
                <span>Current LNG Spot: <b>${lngSpot.toFixed(2)}/MMBtu</b></span>
                <span>ASPS Trigger: <b>${PRICE_SHOCK_THRESHOLD}/MMBtu</b></span>
              </div>
              <div style={{background:'#e5e7eb',height:24,position:'relative',overflow:'hidden',borderRadius:0}}>
                <div style={{
                  width:`${gaugeShockPct}%`,height:'100%',
                  background: gaugeOver ? '#F42A41' : gaugeShockPct>70?'#f59e0b':'#22c55e',
                  transition:'width 0.5s,background 0.3s',
                }} />
                <div style={{
                  position:'absolute',left:`${(PRICE_SHOCK_THRESHOLD/(PRICE_SHOCK_THRESHOLD*1.8))*100}%`,
                  top:0,bottom:0,width:2,background:'#1a2130',
                }}>
                  <div style={{position:'absolute',top:'100%',left:-20,fontSize:9,whiteSpace:'nowrap',color:'#6b7685',marginTop:"clamp(12px, 3vw, 20px)"}}>THRESHOLD</div>
                </div>
              </div>
              <div style={{fontSize:"clamp(10px, 2vw, 11px)",color:'#6b7685',marginTop:"clamp(12px, 3vw, 20px)"}}>
                Global Energy Price Index: <b style={{color:gaugeOver?'#F42A41':'#006A4E'}}>{gaugeShockPct.toFixed(1)}%</b> of maximum tracked range
                {gaugeOver && <span style={{color:'#F42A41',fontWeight:700,marginLeft:"clamp(8px, 2vw, 12px)",display:'block',marginTop:"clamp(8px, 2vw, 12px)"}}>⚠ ABOVE ASPS TRIGGER THRESHOLD</span>}
              </div>
            </div>
            <div style={{textAlign:'center',minWidth:"clamp(80px, 20vw, 100px)"}}>
              <div style={{fontSize:"clamp(24px, 6vw, 36px)",fontWeight:900,color:gaugeOver?'#F42A41':'#006A4E'}}>
                {gaugeOver ? '🔴' : gaugeShockPct>70 ? '🟡' : '🟢'}
              </div>
              <div style={{fontSize:"clamp(10px, 2vw, 11px)",fontWeight:700,color:gaugeOver?'#F42A41':'#006A4E'}}>
                {gaugeOver?'SHOCK':'NORMAL'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="chart-grid" style={{marginBottom:"clamp(12px, 3vw, 20px)"}}>
        <div className="card">
          <div className="card-header">
            <h3>LNG Spot vs Contract Price — 12 Months</h3>
            <span className="bn">এলএনজি বাজার মূল্য বনাম চুক্তি মূল্য</span>
          </div>
          <div className="card-body">
            <Line data={lngChartData} options={chartOpts} height={220} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Import Volume by Fuel Type — Monthly (000 MT)</h3>
            <span className="bn">জ্বালানি ধরন অনুযায়ী আমদানির পরিমাণ</span>
          </div>
          <div className="card-body">
            <Bar data={volChartData} options={{...chartOpts, scales:{...chartOpts.scales,x:{stacked:true},y:{stacked:true}}}} height={220} />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Regional Price Comparison · আঞ্চলিক মূল্য তুলনা</h3>
          <span className="bn">বাংলাদেশ বনাম প্রতিবেশী দেশ</span>
        </div>
        <div className="card-body" style={{padding:"clamp(12px, 3vw, 20px)"}}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>Country · দেশ</th>
                <th>Crude Oil ($/barrel)</th>
                <th>LNG ($/MMBtu)</th>
                <th>Diesel ($/MT)</th>
                <th>Petrol ($/MT)</th>
                <th>LNG vs BD</th>
              </tr>
            </thead>
            <tbody>
              {COUNTRY_COMPARISON.map(c => (
                <tr key={c.country} style={c.country==='Bangladesh'?{background:'#e8f5f0'}:{}}>
                  <td style={{fontWeight:c.country==='Bangladesh'?700:400,color:c.country==='Bangladesh'?'#006A4E':'inherit'}}>
                    {c.country==='Bangladesh'?'🇧🇩 ':c.country==='India'?'🇮🇳 ':c.country==='Pakistan'?'🇵🇰 ':'🇱🇰 '}
                    {c.country}
                  </td>
                  <td>${c.crudeOil.toFixed(2)}</td>
                  <td style={{fontWeight:700,color:c.lng>PRICE_SHOCK_THRESHOLD?'#F42A41':'inherit'}}>${c.lng.toFixed(2)}</td>
                  <td>${c.diesel.toFixed(2)}</td>
                  <td>${c.petrol.toFixed(2)}</td>
                  <td>
                    {c.country==='Bangladesh'
                      ? <span style={{color:'#006A4E',fontWeight:700}}>Baseline</span>
                      : c.lng > COUNTRY_COMPARISON[0].lng
                        ? <span style={{color:'#22c55e'}}>▼ {((c.lng-COUNTRY_COMPARISON[0].lng)/COUNTRY_COMPARISON[0].lng*100).toFixed(1)}% higher</span>
                        : <span style={{color:'#F42A41'}}>▲ {((COUNTRY_COMPARISON[0].lng-c.lng)/COUNTRY_COMPARISON[0].lng*100).toFixed(1)}% lower</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
