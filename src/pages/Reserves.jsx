import { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend } from 'chart.js';
import { RESERVE_DATA, RESERVE_HISTORY } from '../data/reserves';
import { DEMAND_FORECAST, RESERVE_ADEQUACY_INDEX } from '../data/forecast';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Filler, Tooltip, Legend);

const FUEL_NAMES = { LNG:'LNG', CrudeOil:'Crude Oil', Diesel:'Diesel', Petrol:'Petrol', FurnaceOil:'Furnace Oil' };
const FUEL_BN = { LNG:'তরলীকৃত গ্যাস', CrudeOil:'অপরিশোধিত তেল', Diesel:'ডিজেল', Petrol:'পেট্রোল', FurnaceOil:'ফার্নেস ওয়েল' };
const FUEL_COLORS= { LNG:'#006A4E', CrudeOil:'#8b5cf6', Diesel:'#F42A41', Petrol:'#f59e0b', FurnaceOil:'#14b8a6' };

function CircularGauge({ fuel, data }) {
  const pct = Math.round((data.currentDays / data.targetDays) * 100);
  const isCrit = data.currentDays < data.criticalDays;
  const isWarn = data.currentDays < data.targetDays * 0.6;
  const color = isCrit ? '#F42A41' : isWarn ? '#f59e0b' : '#22c55e';

  const doughnutData = {
    datasets: [{
      data: [Math.min(pct, 100), Math.max(0, 100-pct)],
      backgroundColor: [color, '#e5e7eb'],
      borderWidth: 0,
    }],
  };

  return (
    <div className="gauge-card card" style={{padding:"clamp(12px, 3vw, 20px)"}}>
      <div className="gauge-label">{FUEL_NAMES[fuel]}</div>
      <div style={{fontFamily:'var(--font-bn)',fontSize:"clamp(9px, 2vw, 10px)",color:'#6b7685',marginBottom:"clamp(12px, 3vw, 20px)"}}>{FUEL_BN[fuel]}</div>
      <div style={{position:'relative',width:"clamp(100px, 20vw, 140px)",margin:'0 auto'}}>
        <Doughnut data={doughnutData} options={{
          cutout:'72%',
          plugins:{legend:{display:false},tooltip:{enabled:false}},
          animation:{duration:600},
        }} height={"clamp(100, 20vw, 140)"} />
        <div style={{
          position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
          textAlign:'center',
        }}>
          <div className={`gauge-days ${isCrit?'crit':isWarn?'warn':'ok'}`}>
            {data.currentDays.toFixed(1)}
          </div>
          <div className="gauge-sub">days</div>
        </div>
      </div>
      <div style={{marginTop:"clamp(12px, 3vw, 20px)",fontSize:"clamp(10px, 2vw, 11px)",textAlign:'center'}}>
        <div style={{color:'#6b7685'}}>{data.currentMT.toLocaleString()} MT</div>
        <div style={{fontSize:"clamp(9px, 1.5vw, 10px)",color:'#9ca3af'}}>of {data.capacityMT.toLocaleString()} MT capacity</div>
        {isCrit && <div style={{color:'#F42A41',fontWeight:700,marginTop:"clamp(12px, 3vw, 20px)",fontSize:"clamp(10px, 2vw, 11px)"}}>⚠ CRITICAL — Below 15 days</div>}
        {!isCrit && isWarn && <div style={{color:'#f59e0b',fontWeight:700,marginTop:"clamp(12px, 3vw, 20px)",fontSize:"clamp(10px, 2vw, 11px)"}}>⚡ WARNING</div>}
      </div>
      <div style={{marginTop:"clamp(12px, 3vw, 20px)"}}>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:"clamp(8px, 1.5vw, 9px)",color:'#9ca3af',marginBottom:"clamp(8px, 2vw, 12px)"}}>
          <span>0</span><span>Target: {data.targetDays}d</span>
        </div>
        <div style={{background:'#e5e7eb',height:4,position:'relative'}}>
          <div style={{width:`${Math.min(pct,100)}%`,height:'100%',background:color,transition:'width 0.5s'}} />
          <div style={{position:'absolute',left:`${(data.criticalDays/data.targetDays)*100}%`,top:-2,bottom:-2,width:2,background:'#F42A41'}} />
        </div>
        <div style={{fontSize:"clamp(8px, 1.5vw, 9px)",color:'#6b7685',marginTop:"clamp(8px, 2vw, 12px)"}}>Red line = critical threshold ({data.criticalDays} days)</div>
      </div>
    </div>
  );
}

export default function Reserves() {
  const [reserves, setReserves] = useState(RESERVE_DATA);

  useEffect(() => {
    const t = setInterval(() => {
      setReserves(prev => {
        const next = {};
        Object.entries(prev).forEach(([k,v]) => {
          next[k] = {...v, currentDays: +(v.currentDays + (Math.random()-0.51)*0.05).toFixed(2)};
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const historyChart = {
    labels: RESERVE_HISTORY.map(d => d.month),
    datasets: Object.keys(FUEL_COLORS).map(fuel => ({
      label: FUEL_NAMES[fuel],
      data: RESERVE_HISTORY.map(d => d[fuel] || 0),
      borderColor: FUEL_COLORS[fuel],
      backgroundColor: 'transparent',
      tension: 0.3,
      pointRadius: 3,
      borderWidth: 2,
    })),
  };

  const forecastChart = {
    labels: DEMAND_FORECAST.map(d => String(d.year)),
    datasets: [
      {
        label: 'VECM Scenario 4 (CPD WP153)',
        data: DEMAND_FORECAST.map(d => d.vecm),
        borderColor: '#006A4E',
        backgroundColor: 'rgba(0,106,78,0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 5,
      },
      {
        label: 'IEPMP Projection',
        data: DEMAND_FORECAST.map(d => d.iepmp),
        borderColor: '#F42A41',
        borderDash: [6,3],
        backgroundColor: 'transparent',
        tension: 0.3,
        pointRadius: 5,
        spanGaps: true,
      },
    ],
  };

  const adequacyColor = RESERVE_ADEQUACY_INDEX < 40 ? '#F42A41' : RESERVE_ADEQUACY_INDEX < 65 ? '#f59e0b' : '#22c55e';
  const totalDays = Object.values(reserves).reduce((s,v) => s + v.currentDays, 0) / Object.keys(reserves).length;

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: { legend: { position:'bottom', labels:{font:{size:11}} } },
    scales: {
      y: { grid:{color:'rgba(0,0,0,0.04)'}, ticks:{font:{size:11}} },
      x: { ticks:{font:{size:10}} },
    },
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h2>National Stock Reserve Monitor</h2>
          <div className="bn">জাতীয় জ্বালানি মজুদ পর্যবেক্ষণ</div>
        </div>
        <div className="page-header-meta">
          Target: 30-day reserve · Critical: 15 days<br/>
          <span style={{fontSize:10,color:'#22c55e'}}>● Live — Updates every 4s</span>
        </div>
      </div>

      <div className="card" style={{marginBottom:"clamp(12px, 3vw, 20px)",background:'#006A4E',border:'none'}}>
        <div style={{padding:"clamp(12px, 3vw, 20px) clamp(16px, 4vw, 24px)",display:'flex',flexDirection:'column',gap:"clamp(12px, 3vw, 20px)",alignItems:'stretch'}}>
          <div>
            <div style={{fontSize:"clamp(10px, 2vw, 11px)",fontWeight:700,color:'rgba(255,255,255,0.6)',textTransform:'uppercase',letterSpacing:1}}>Reserve Adequacy Index · মজুদ পর্যাপ্ততা সূচক</div>
            <div style={{fontSize:"clamp(36px, 10vw, 56px)",fontWeight:900,color:'white',lineHeight:1}}>{RESERVE_ADEQUACY_INDEX}</div>
            <div style={{fontSize:"clamp(12px, 3vw, 14px)",color:'rgba(255,255,255,0.7)'}}>/100 composite score</div>
          </div>
          <div style={{flex:1}}>
            <div style={{background:'rgba(255,255,255,0.15)',height:24,borderRadius:0,overflow:'hidden',position:'relative'}}>
              <div style={{width:`${RESERVE_ADEQUACY_INDEX}%`,height:'100%',background:adequacyColor,transition:'width 0.5s'}} />
              <div style={{position:'absolute',left:'66%',top:0,bottom:0,width:2,background:'rgba(255,255,255,0.4)'}} />
            </div>
            <div style={{display:'flex',flexWrap:'wrap',justifyContent:'space-between',fontSize:"clamp(9px, 1.5vw, 10px)",color:'rgba(255,255,255,0.5)',marginTop:"clamp(8px, 2vw, 12px)"}}>
              <span>0 — Critical</span>
              <span>66 — Adequate</span>
              <span>100 — Optimal</span>
            </div>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:"clamp(10px, 2vw, 11px)",color:'rgba(255,255,255,0.6)'}}>Avg Reserve Days</div>
            <div style={{fontSize:"clamp(28px, 8vw, 36px)",fontWeight:900,color:'#fbbf24'}}>{totalDays.toFixed(1)}</div>
            <div style={{fontSize:"clamp(10px, 2vw, 11px)",color:'rgba(255,255,255,0.6)'}}>days across all fuels</div>
          </div>
        </div>
      </div>

      <div className="gauge-grid" style={{marginBottom:"clamp(12px, 3vw, 20px)"}}>
        {Object.entries(reserves).map(([fuel, data]) => (
          <CircularGauge key={fuel} fuel={fuel} data={data} />
        ))}
      </div>

      <div className="card" style={{marginBottom:"clamp(12px, 3vw, 20px)"}}>
        <div className="card-header"><h3>Days of Reserve — Critical Threshold View</h3></div>
        <div className="card-body" style={{padding:"clamp(12px, 3vw, 20px)"}}>
          <table className="gov-table">
            <thead>
              <tr>
                <th>Fuel Type · জ্বালানি</th>
                <th>Current Reserve (Days)</th>
                <th>Target (Days)</th>
                <th>Critical Threshold</th>
                <th>Current Stock (MT)</th>
                <th>Capacity (MT)</th>
                <th>Utilisation</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(reserves).map(([fuel, data]) => {
                const pct = Math.round((data.currentMT/data.capacityMT)*100);
                const isCrit = data.currentDays < data.criticalDays;
                const isWarn = !isCrit && data.currentDays < data.targetDays * 0.6;
                return (
                  <tr key={fuel}>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:"clamp(12px, 3vw, 20px)"}}>
                        <div style={{width:12,height:12,background:FUEL_COLORS[fuel],flexShrink:0}} />
                        <div>
                          <div style={{fontWeight:700}}>{FUEL_NAMES[fuel]}</div>
                          <div style={{fontSize:10,color:'#6b7685',fontFamily:'var(--font-bn)'}}>{FUEL_BN[fuel]}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{
                        fontSize:22,fontWeight:900,fontVariantNumeric:'tabular-nums',
                        color: isCrit?'#F42A41':isWarn?'#f59e0b':'#006A4E'
                      }}>
                        {data.currentDays.toFixed(1)}
                      </span>
                    </td>
                    <td>{data.targetDays}</td>
                    <td style={{color:'#F42A41',fontWeight:700}}>{data.criticalDays} days</td>
                    <td style={{fontVariantNumeric:'tabular-nums'}}>{data.currentMT.toLocaleString()}</td>
                    <td style={{fontVariantNumeric:'tabular-nums'}}>{data.capacityMT.toLocaleString()}</td>
                    <td>
                      <div style={{width:80,background:'#e5e7eb',height:6}}>
                        <div style={{width:`${pct}%`,height:'100%',background:FUEL_COLORS[fuel]}} />
                      </div>
                      <div style={{fontSize:9,color:'#6b7685'}}>{pct}%</div>
                    </td>
                    <td>
                      <span className={`badge ${isCrit?'badge-critical':isWarn?'badge-warning':'badge-operational'}`}>
                        {isCrit?'CRITICAL':isWarn?'WARNING':'ADEQUATE'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="chart-grid" style={{marginBottom:"clamp(12px, 3vw, 20px)"}}>
        <div className="card">
          <div className="card-header">
            <h3>6-Month Reserve History (Days)</h3>
            <span className="bn">৬ মাসের মজুদ ইতিহাস</span>
          </div>
          <div className="card-body">
            <Line data={historyChart} options={chartOpts} height={220} />
            <div style={{marginTop:"clamp(12px, 3vw, 20px)",padding:"clamp(12px, 3vw, 20px)",background:'#fff7ed',border:'1px solid #fed7aa',fontSize:11,color:'#9a3412'}}>
              ⚠ Note: LNG and Furnace Oil reserves have declined consistently over 6 months. Procurement action required.
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>National Energy Demand Forecast (MTOE)</h3>
            <span className="bn">জাতীয় শক্তি চাহিদা পূর্বাভাস · CPD VECM WP153</span>
          </div>
          <div className="card-body">
            <Line data={forecastChart} options={chartOpts} height={220} />
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(120px, 1fr))',gap:"clamp(12px, 3vw, 20px)",marginTop:"clamp(12px, 3vw, 20px)"}}>
              {DEMAND_FORECAST.filter(d=>[2026,2030,2041,2050].includes(d.year)).map(d => (
                <div key={d.year} className="forecast-milestone">
                  <div className="forecast-year" style={{fontSize:"clamp(12px, 2.5vw, 14px)"}}>{d.year}</div>
                  <div className="forecast-val" style={{fontSize:"clamp(16px, 4vw, 20px)"}}>{d.vecm}</div>
                  <div className="forecast-unit" style={{fontSize:"clamp(9px, 1.5vw, 10px)"}}>MTOE (VECM)</div>
                  {d.iepmp && <div style={{fontSize:"clamp(10px, 2vw, 11px)",color:'#F42A41',marginTop:"clamp(8px, 2vw, 12px)"}}>{d.iepmp} IEPMP</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
