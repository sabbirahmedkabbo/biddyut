import { useState, useEffect } from 'react';
import { PIPELINE_STAGES } from '../data/pipeline';
import MiniSparkline from '../components/MiniSparkline';

function StageModal({ stage, onClose }) {
  if (!stage) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Stage {stage.id}: {stage.name}</h3>
            <div className="bn">{stage.nameBn}</div>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))',gap:"clamp(12px, 3vw, 20px)",marginBottom:"clamp(12px, 3vw, 20px)"}}>
            <div>
              <div style={{fontSize:"clamp(10px, 2vw, 11px)",fontWeight:700,color:'#006A4E',marginBottom:"clamp(12px, 3vw, 20px)",textTransform:'uppercase',letterSpacing:0.5}}>Current Volume</div>
              <div style={{fontSize:36,fontWeight:900,color:'#1a2130',marginBottom:"clamp(12px, 3vw, 20px)"}}>{stage.volumeToday.toLocaleString()}</div>
              <div style={{fontSize:11,color:'#6b7685'}}>
                of {stage.capacity.toLocaleString()} {stage.unit} capacity
                <br/>({Math.round((stage.volumeToday/stage.capacity)*100)}%)
              </div>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:'#006A4E',marginBottom:"clamp(12px, 3vw, 20px)",textTransform:'uppercase',letterSpacing:0.5}}>Flow Rate</div>
              <div style={{fontSize:36,fontWeight:900,color:'#1a2130',marginBottom:"clamp(12px, 3vw, 20px)"}}>{stage.flowRate.toLocaleString()}</div>
              <div style={{fontSize:11,color:'#6b7685'}}>MT per hour</div>
            </div>
          </div>

          <div style={{background:'#f8f9fb',padding:"clamp(12px, 3vw, 20px)",marginBottom:"clamp(12px, 3vw, 20px)"}}>
            <div style={{fontSize:11,fontWeight:700,color:'#006A4E',marginBottom:"clamp(12px, 3vw, 20px)"}}>24-Hour Volume Trend</div>
            <MiniSparkline data={stage.spark} width={400} height={80} />
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))',gap:"clamp(12px, 3vw, 20px)",marginBottom:"clamp(12px, 3vw, 20px)"}}>
            <div>
              <div style={{fontSize:"clamp(9px, 2vw, 10px)",fontWeight:600,color:'#6b7685',marginBottom:"clamp(8px, 2vw, 12px)",textTransform:'uppercase'}}>Status</div>
              <span className={`badge badge-${stage.status}`}>{stage.status.toUpperCase()}</span>
            </div>
            <div>
              <div style={{fontSize:10,fontWeight:600,color:'#6b7685',marginBottom:"clamp(12px, 3vw, 20px)",textTransform:'uppercase'}}>Temperature</div>
              <div style={{fontSize:14,fontWeight:700,color:'#1a2130'}}>
                {stage.temperature ? `${stage.temperature}°C` : 'N/A'}
              </div>
            </div>
            <div>
              <div style={{fontSize:10,fontWeight:600,color:'#6b7685',marginBottom:"clamp(12px, 3vw, 20px)",textTransform:'uppercase'}}>Officer in Charge</div>
              <div style={{fontSize:12,fontWeight:600,color:'#1a2130'}}>{stage.officer}</div>
            </div>
            <div>
              <div style={{fontSize:10,fontWeight:600,color:'#6b7685',marginBottom:"clamp(12px, 3vw, 20px)",textTransform:'uppercase'}}>Last Inspection</div>
              <div style={{fontSize:12,fontWeight:600,color:'#1a2130'}}>{stage.lastInspection}</div>
            </div>
          </div>

          <div>
            <div style={{fontSize:11,fontWeight:700,color:'#006A4E',marginBottom:"clamp(12px, 3vw, 20px)",textTransform:'uppercase',letterSpacing:0.5}}>Description</div>
            <div style={{fontSize:12,color:'#4a5568',lineHeight:1.6}}>{stage.description}</div>
          </div>

          {stage.anomalies.length > 0 && (
            <div style={{marginTop:"clamp(12px, 3vw, 20px)",paddingTop:16,borderTop:'1px solid #d8dde3'}}>
              <div style={{fontSize:11,fontWeight:700,color:'#F42A41',marginBottom:"clamp(12px, 3vw, 20px)",textTransform:'uppercase',letterSpacing:0.5}}>⚠ Active Anomalies</div>
              {stage.anomalies.map((anom, i) => (
                <div key={i} style={{fontSize:11,color:'#374151',padding:"clamp(12px, 3vw, 20px)",background:'#fff5f5',borderLeft:'3px solid #F42A41',marginBottom:"clamp(12px, 3vw, 20px)"}}>
                  {anom}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Pipeline() {
  const [stages, setStages] = useState(PIPELINE_STAGES);
  const [selectedStage, setSelectedStage] = useState(null);

  useEffect(() => {
    const t = setInterval(() => {
      setStages(prev => prev.map(s => ({
        ...s,
        volumeToday: Math.round(s.volumeToday * (1 + (Math.random()-0.5)*0.06)),
        flowRate: Math.round(s.flowRate * (1 + (Math.random()-0.5)*0.06)),
        spark: [...s.spark.slice(1), Math.round(s.spark[s.spark.length-1] * (1 + (Math.random()-0.5)*0.04))],
      })));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h2>Supply Chain Pipeline Dashboard</h2>
          <div className="bn">সরবরাহ শৃঙ্খল পাইপলাইন পর্যবেক্ষণ</div>
        </div>
        <div className="page-header-meta">
          7-stage real-time flow visualization<br/>
          <span style={{fontSize:10,color:'#22c55e'}}>● LIVE — Updates every 3s</span>
        </div>
      </div>

      <div className="stat-grid" style={{marginBottom:"clamp(12px, 3vw, 20px)"}}>
        <div className="stat-card">
          <div className="stat-label">Total Daily Flow</div>
          <div className="stat-value">{Math.round(stages.reduce((s,v)=>s+v.volumeToday,0)/7).toLocaleString()}</div>
          <div className="stat-meta">Average across all stages</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">System Capacity Utilisation</div>
          <div className="stat-value">{Math.round((stages.reduce((s,v)=>s+v.volumeToday,0) / stages.reduce((s,v)=>s+v.capacity,0))*100)}%</div>
          <div className="stat-meta">Of maximum throughput</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-label">Stages with Anomalies</div>
          <div className="stat-value warning">{stages.filter(s=>s.anomalies.length>0).length}</div>
          <div className="stat-meta">Requiring attention</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">System Health</div>
          <div className="stat-value" style={{color:stages.every(s=>s.status==='operational')?'#22c55e':'#f59e0b'}}>
            {stages.every(s=>s.status==='operational')?'HEALTHY':'MONITORING'}
          </div>
          <div className="stat-meta">Overall system status</div>
        </div>
      </div>

      <div className="card" style={{marginBottom:"clamp(12px, 3vw, 20px)"}}>
        <div className="card-header">
          <h3>7-Stage Pipeline Flow Diagram · পাইপলাইন প্রবাহ চিত্র</h3>
          <span className="bn">Click each stage for detailed analysis</span>
        </div>
        <div className="pipeline-container">
          <div className="pipeline-flow">
            {stages.map((stage, idx) => (
              <div key={stage.id}>
                <div
                  className={`pipeline-stage ${stage.status}`}
                  onClick={() => setSelectedStage(stage)}
                  style={{cursor:'pointer'}}
                >
                  <div className="stage-num">Stage {stage.id}</div>
                  <div className="stage-name">{stage.name}</div>
                  <div className="stage-name-bn">{stage.nameBn}</div>
                  <div className="stage-volume">{stage.volumeToday.toLocaleString()}</div>
                  <div className="stage-unit">{stage.unit}</div>
                  <div className="stage-loc">{stage.location}</div>
                  <div className={`stage-indicator ${stage.status}`} />
                </div>
                {idx < stages.length - 1 && (
                  <div className="pipeline-arrow">
                    <div className={`arrow-line arrow-${stage.status}`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr',gap:"clamp(12px, 3vw, 20px)",maxWidth:'100%'}}>
        <div className="card">
          <div className="card-header">
            <h3>Stage Status Overview · স্তর স্থিতি সংক্ষিপ্ত</h3>
          </div>
          <div className="card-body" style={{padding:"clamp(12px, 3vw, 20px)"}}>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Stage</th>
                  <th>Name · নাম</th>
                  <th>Volume</th>
                  <th>Flow Rate</th>
                  <th>Status</th>
                  <th>Anomalies</th>
                </tr>
              </thead>
              <tbody>
                {stages.map(s => (
                  <tr key={s.id} onClick={() => setSelectedStage(s)} style={{cursor:'pointer'}}>
                    <td style={{fontWeight:700,color:'#006A4E'}}>S{s.id}</td>
                    <td><div style={{fontWeight:600}}>{s.name}</div><div style={{fontSize:10,color:'#6b7685',fontFamily:'var(--font-bn)'}}>{s.nameBn}</div></td>
                    <td style={{fontVariantNumeric:'tabular-nums'}}>{s.volumeToday.toLocaleString()} {s.unit}</td>
                    <td style={{fontVariantNumeric:'tabular-nums'}}>{s.flowRate.toLocaleString()} MT/h</td>
                    <td><span className={`badge badge-${s.status}`}>{s.status}</span></td>
                    <td style={{textAlign:'center'}}>{s.anomalies.length > 0 ? <span style={{color:'#F42A41',fontWeight:700}}>⚠ {s.anomalies.length}</span> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="card">
            <div className="card-header">
              <h3>System Status · সিস্টেম স্থিতি</h3>
            </div>
            <div className="card-body" style={{padding:"clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)"}}>
              {stages.map(s => (
                <div key={s.id} style={{display:'flex',alignItems:'center',gap:"clamp(12px, 3vw, 20px)",padding:'8px 0',borderBottom:'1px solid #f1f5f9',fontSize:11}}>
                  <div className={`stage-indicator ${s.status}`} style={{position:'static',flexShrink:0}} />
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600,color:'#1a2130'}}>S{s.id}</div>
                    <div style={{fontSize:10,color:'#6b7685'}}>{s.name}</div>
                  </div>
                  <span className={`badge badge-${s.status}`} style={{fontSize:9}}>{s.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedStage && <StageModal stage={selectedStage} onClose={() => setSelectedStage(null)} />}
    </div>
  );
}
