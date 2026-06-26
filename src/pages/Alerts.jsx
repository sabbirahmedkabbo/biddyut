import { useState, useEffect } from 'react';
import AlertCard from '../components/AlertCard';
import { ALERT_POOL, NEW_ALERTS_POOL } from '../data/alerts';

const DIVISIONS = ['All','Dhaka','Chittagong','Rajshahi','Khulna','Sylhet','Barisal','Rangpur','Mymensingh'];
const SEVERITIES = ['All','Critical','High','Medium','Low'];
const STAGES = ['All',1,2,3,4,5,6,7];

const HEATMAP_DATA = {
  Dhaka: { alerts: 18, critical: 4, color: '#fee2e2', text: '#991b1b' },
  Chittagong: { alerts: 14, critical: 3, color: '#ffedd5', text: '#9a3412' },
  Rajshahi: { alerts: 7, critical: 2, color: '#fef3c7', text: '#92400e' },
  Khulna: { alerts: 5, critical: 1, color: '#fef9c3', text: '#713f12' },
  Sylhet: { alerts: 6, critical: 2, color: '#fef3c7', text: '#92400e' },
  Barisal: { alerts: 8, critical: 2, color: '#ffedd5', text: '#9a3412' },
  Rangpur: { alerts: 4, critical: 0, color: '#d1fae5', text: '#065f46' },
  Mymensingh: { alerts: 5, critical: 1, color: '#fef9c3', text: '#713f12' },
};

let alertIdCounter = 925;

export default function Alerts() {
  const [alerts, setAlerts] = useState([...ALERT_POOL]);
  const [tab, setTab] = useState('all');
  const [divFilter, setDivFilter] = useState('All');
  const [sevFilter, setSevFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');

  useEffect(() => {
    const t = setInterval(() => {
      const template = NEW_ALERTS_POOL[Math.floor(Math.random()*NEW_ALERTS_POOL.length)];
      const newAlert = {
        ...template,
        id: `ALT-2026-0${alertIdCounter++}`,
        time: new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}) + ' BST',
        status: 'open',
      };
      setAlerts(prev => [newAlert, ...prev]);
    }, 5000 + Math.random()*3000);
    return () => clearInterval(t);
  }, []);

  const handleFlag = (id) => {
    setAlerts(prev => prev.map(a =>
      a.id === id ? {...a, status: a.status === 'under_review' ? 'open' : 'under_review'} : a
    ));
  };

  const filtered = alerts.filter(a => {
    if (tab === 'review' && a.status !== 'under_review') return false;
    if (tab === 'resolved' && a.status !== 'resolved') return false;
    if (tab === 'open' && a.status !== 'open') return false;
    if (divFilter !== 'All' && a.division !== divFilter) return false;
    if (sevFilter !== 'All' && a.severity !== sevFilter) return false;
    if (stageFilter !== 'All' && a.stage !== stageFilter) return false;
    return true;
  });

  const counts = {
    total: alerts.length,
    open: alerts.filter(a=>a.status==='open').length,
    review: alerts.filter(a=>a.status==='under_review').length,
    resolved: alerts.filter(a=>a.status==='resolved').length,
    critical: alerts.filter(a=>a.severity==='Critical'&&a.status==='open').length,
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h2>Alert & Anomaly Centre</h2>
          <div className="bn">সতর্কতা ও অসামঞ্জস্য কেন্দ্র</div>
        </div>
        <div className="page-header-meta">
          <span style={{color:'#22c55e',fontWeight:700}}>● LIVE</span> — Auto-generates every 5–8s
        </div>
      </div>

      <div className="stat-grid" style={{marginBottom:"clamp(12px, 3vw, 20px)"}}>
        <div className="stat-card">
          <div className="stat-label">Total Today · মোট আজ</div>
          <div className="stat-value">{counts.total}</div>
          <div className="stat-meta">All pipeline stages</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-label">Open · খোলা</div>
          <div className="stat-value warning">{counts.open}</div>
          <div className="stat-meta">Awaiting action</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Under Review · পর্যালোচনাধীন</div>
          <div className="stat-value" style={{color:'#7c3aed'}}>{counts.review}</div>
          <div className="stat-meta">Flagged for investigation</div>
        </div>
        <div className="stat-card critical">
          <div className="stat-label">Critical Open · সংকটজনক</div>
          <div className="stat-value critical">{counts.critical}</div>
          <div className="stat-meta">Immediate action required</div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr',gap:"clamp(12px, 3vw, 20px)",alignItems:'start'}}>
        <div>
          <div className="filter-bar">
            <select className="filter-select" value={divFilter} onChange={e=>setDivFilter(e.target.value)}>
              {DIVISIONS.map(d => <option key={d}>{d}</option>)}
            </select>
            <select className="filter-select" value={sevFilter} onChange={e=>setSevFilter(e.target.value)}>
              {SEVERITIES.map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="filter-select" value={stageFilter} onChange={e=>setStageFilter(e.target.value)}>
              {STAGES.map(s => <option key={s}>{s==='All'?'All Stages':`Stage ${s}`}</option>)}
            </select>
          </div>

          <div style={{display:'flex',gap:"clamp(12px, 3vw, 20px)",marginBottom:"clamp(12px, 3vw, 20px)"}}>
            {[['all','All Alerts'],['open','Open'],['review','Under Review'],['resolved','Resolved']].map(([k,l])=>(
              <button key={k} onClick={()=>setTab(k)} style={{
                padding:'6px 14px',fontSize:11,fontWeight:600,border:'1px solid',borderRadius:0,cursor:'pointer',
                background: tab===k?'#006A4E':'white',
                color: tab===k?'white':'#6b7685',
                borderColor: tab===k?'#006A4E':'#d8dde3',
              }}>
                {l} ({k==='all'?counts.total:k==='open'?counts.open:k==='review'?counts.review:counts.resolved})
              </button>
            ))}
          </div>

          <div style={{fontSize:11,color:'#6b7685',marginBottom:"clamp(12px, 3vw, 20px)"}}>Showing {filtered.length} alert{filtered.length!==1?'s':''}</div>

          <div style={{maxHeight:'clamp(300px, 60vh, 600px)',overflowY:'auto'}}>
            {filtered.length === 0 ? (
              <div style={{padding:"clamp(12px, 3vw, 20px)",textAlign:'center',color:'#6b7685',fontSize:12}}>No alerts match the current filters.</div>
            ) : (
              filtered.map(a => <AlertCard key={a.id} alert={a} onFlag={handleFlag} />)
            )}
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:"clamp(12px, 3vw, 20px)"}}>
          <div className="card">
            <div className="card-header">
              <h3>Division Anomaly Heatmap · বিভাগীয় অসামঞ্জস্য</h3>
            </div>
            <div className="card-body">
              <div className="heatmap-grid">
                {Object.entries(HEATMAP_DATA).map(([div, data]) => (
                  <div key={div} className="heatmap-cell" style={{background:data.color,border:`1px solid ${data.text}22`}}>
                    <div className="heatmap-division" style={{color:data.text}}>{div}</div>
                    <div className="heatmap-score" style={{color:data.text}}>{data.alerts}</div>
                    <div className="heatmap-label">alerts</div>
                    {data.critical > 0 && (
                      <div style={{fontSize:9,color:'#991b1b',fontWeight:700,marginTop:"clamp(12px, 3vw, 20px)"}}>{data.critical} CRITICAL</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>Severity Breakdown · তীব্রতা বিশ্লেষণ</h3></div>
            <div className="card-body" style={{padding:'12px 16px'}}>
              {['Critical','High','Medium','Low'].map(sev => {
                const cnt = alerts.filter(a=>a.severity===sev).length;
                const pct = Math.round((cnt/alerts.length)*100);
                const colors = {Critical:'#F42A41',High:'#f97316',Medium:'#f59e0b',Low:'#22c55e'};
                return (
                  <div key={sev} style={{marginBottom:"clamp(12px, 3vw, 20px)"}}>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:"clamp(12px, 3vw, 20px)"}}>
                      <span className={`badge badge-${sev}`}>{sev}</span>
                      <span style={{fontWeight:700}}>{cnt} ({pct}%)</span>
                    </div>
                    <div style={{background:'#e5e7eb',height:6}}>
                      <div style={{width:`${pct}%`,height:'100%',background:colors[sev]}} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>Stage Breakdown · পর্যায় বিশ্লেষণ</h3></div>
            <div className="card-body" style={{padding:'8px 16px'}}>
              {[1,2,3,4,5,6,7].map(s => {
                const cnt = alerts.filter(a=>a.stage===s).length;
                return (
                  <div key={s} style={{display:'flex',alignItems:'center',gap:"clamp(12px, 3vw, 20px)",padding:'5px 0',borderBottom:'1px solid #f1f5f9',fontSize:11}}>
                    <span style={{fontWeight:700,color:'#006A4E',width:16}}>S{s}</span>
                    <span style={{flex:1,color:'#374151'}}>{['Import Terminal','Primary Depot','Secondary Depot','Dealer/Distributor','Filling Station','Consumer Delivery','Quality Check'][s-1]}</span>
                    <span style={{fontWeight:700,background:'#f1f5f9',padding:'1px 6px',minWidth:24,textAlign:'center'}}>{cnt}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
