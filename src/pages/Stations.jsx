import { useState, useEffect } from 'react';
import { STATIONS as INITIAL_STATIONS } from '../data/stations';
import MiniSparkline from '../components/MiniSparkline';

const DIVISIONS = ['All','Dhaka','Chittagong','Rajshahi','Khulna','Sylhet','Barisal','Rangpur','Mymensingh'];
const STATUSES = ['All','operational','warning','critical'];

function StockBar({pct}) {
  const color = pct > 60 ? '#22c55e' : pct > 30 ? '#f59e0b' : '#F42A41';
  return (
    <div style={{display:'inline-flex',alignItems:'center',gap:6}}>
      <div style={{width:60,background:'#e5e7eb',height:6,flexShrink:0}}>
        <div style={{width:`${pct}%`,height:'100%',background:color}} />
      </div>
      <span className={pct>60?'stock-high':pct>30?'stock-med':'stock-low'} style={{fontSize:11}}>{pct}%</span>
    </div>
  );
}

function HoardingScore({score}) {
  const color = score > 70 ? '#F42A41' : score > 40 ? '#f59e0b' : '#22c55e';
  return <span style={{fontWeight:700,color}}>{score}</span>;
}

function ExpandedRow({ station }) {
  const complaints = [
    { date: '2026-06-25', text: 'Consumer reported pump measurement discrepancy', status: 'Open' },
    { date: '2026-06-22', text: 'Price above displayed board rate', status: 'Resolved' },
    { date: '2026-06-20', text: 'Queue management — excessive wait time', status: 'Resolved' },
  ].slice(0, station.anomalyFlag ? 3 : 1);

  return (
    <tr className="expanded">
      <td colSpan={9}>
        <div className="expanded-content">
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))',gap:"clamp(12px, 3vw, 20px)"}}>
            <div>
              <div style={{fontSize:"clamp(10px, 2vw, 11px)",fontWeight:700,color:'#006A4E',marginBottom:"clamp(12px, 3vw, 20px)"}}>7-Day Stock Trend</div>
              <MiniSparkline data={station.weeklyStock} color={station.stockPct>60?'#22c55e':station.stockPct>30?'#f59e0b':'#F42A41'} width={180} height={50} />
              <div style={{fontSize:10,color:'#6b7685',marginTop:"clamp(12px, 3vw, 20px)"}}>
                {station.weeklyStock.map((v,i) => (
                  <span key={i} style={{marginRight:4,fontVariantNumeric:'tabular-nums'}}>{v}%</span>
                ))}
              </div>
            </div>
            <div>
              <div style={{fontSize:"clamp(10px, 2vw, 11px)",fontWeight:700,color:'#006A4E',marginBottom:"clamp(12px, 3vw, 20px)"}}>Complaint Log</div>
              {complaints.map((c,i) => (
                <div key={i} style={{fontSize:"clamp(10px, 2vw, 11px)",borderBottom:'1px solid #e5e7eb',paddingBottom:6,marginBottom:"clamp(8px, 2vw, 12px)"}}>
                  <span style={{color:'#6b7685'}}>{c.date}</span> — {c.text}
                  <span style={{marginLeft:"clamp(4px, 1vw, 8px)",fontSize:"clamp(8px, 1.5vw, 9px)",fontWeight:700,color:c.status==='Open'?'#F42A41':'#22c55e'}}>[{c.status}]</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{fontSize:"clamp(10px, 2vw, 11px)",fontWeight:700,color:'#006A4E',marginBottom:"clamp(12px, 3vw, 20px)"}}>Officer Contact</div>
              <div style={{fontSize:11,color:'#374151',lineHeight:2}}>
                <div>Station ID: <b>{station.id}</b></div>
                <div>Lat/Lng: {station.lat}, {station.lng}</div>
                <div>Last Supply: <b>{station.lastSupply}</b></div>
                <div>Hoarding Score: <HoardingScore score={station.hoardingScore} />/100</div>
                {station.anomalyFlag && <div style={{color:'#F42A41',fontWeight:700}}>⚠ ANOMALY FLAG ACTIVE</div>}
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

function exportCSV(stations) {
  const headers = ['ID','Name','Division','District','Status','Stock%','Last Supply','Hoarding Score','Anomaly Flag'];
  const rows = stations.map(s => [
    s.id, `"${s.name}"`, s.division, s.district, s.status, s.stockPct, s.lastSupply, s.hoardingScore, s.anomalyFlag?'YES':'NO'
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], {type:'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href=url;
  a.download='bfscms_stations.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function Stations() {
  const [stations, setStations] = useState(INITIAL_STATIONS);
  const [search, setSearch] = useState('');
  const [divFilter, setDivFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expanded, setExpanded] = useState(null);
  const [sortCol, setSortCol] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => {
    const t = setInterval(() => {
      setStations(prev => prev.map(s => ({
        ...s,
        stockPct: Math.max(5, Math.min(99, s.stockPct + (Math.random()-0.5) * 0.4)),
      })));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const filtered = stations.filter(s => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.id.toLowerCase().includes(search.toLowerCase()) && !s.district.toLowerCase().includes(search.toLowerCase())) return false;
    if (divFilter !== 'All' && s.division !== divFilter) return false;
    if (statusFilter !== 'All' && s.status !== statusFilter) return false;
    return true;
  }).sort((a,b) => {
    let va = a[sortCol], vb = b[sortCol];
    if (typeof va === 'string') va = va.toLowerCase(), vb = vb.toLowerCase();
    return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });

  const doSort = (col) => {
    if (sortCol === col) setSortDir(d => d==='asc'?'desc':'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const Th = ({col, children}) => (
    <th onClick={() => doSort(col)} style={{cursor:'pointer',userSelect:'none'}}>
      {children} {sortCol===col?(sortDir==='asc'?'▲':'▼'):''}
    </th>
  );

  const counts = {
    op: stations.filter(s=>s.status==='operational').length,
    warn: stations.filter(s=>s.status==='warning').length,
    crit: stations.filter(s=>s.status==='critical').length,
    anomaly: stations.filter(s=>s.anomalyFlag).length,
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div>
          <h2>Station Network Monitor</h2>
          <div className="bn">স্টেশন নেটওয়ার্ক পর্যবেক্ষণ</div>
        </div>
        <div className="page-header-meta">50 stations monitored · 8 divisions</div>
      </div>

      <div className="stat-grid" style={{marginBottom:"clamp(12px, 3vw, 20px)"}}>
        <div className="stat-card"><div className="stat-label">Operational</div><div className="stat-value">{counts.op}</div><div className="stat-meta">Normal operations</div></div>
        <div className="stat-card warning"><div className="stat-label">Warning</div><div className="stat-value warning">{counts.warn}</div><div className="stat-meta">Stock or compliance issues</div></div>
        <div className="stat-card critical"><div className="stat-label">Critical</div><div className="stat-value critical">{counts.crit}</div><div className="stat-meta">Immediate intervention needed</div></div>
        <div className="stat-card gold"><div className="stat-label">Anomaly Flags</div><div className="stat-value" style={{color:'#C8A84B'}}>{counts.anomaly}</div><div className="stat-meta">Under monitoring</div></div>
      </div>

      <div className="filter-bar">
        <input
          className="filter-input"
          placeholder="Search by name, ID, or district…"
          value={search}
          onChange={e=>setSearch(e.target.value)}
          style={{minWidth:"clamp(150px, 30vw, 240px)"}}
        />
        <select className="filter-select" value={divFilter} onChange={e=>setDivFilter(e.target.value)}>
          {DIVISIONS.map(d=><option key={d}>{d}</option>)}
        </select>
        <select className="filter-select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
          {STATUSES.map(s=><option key={s} value={s}>{s==='All'?'All Statuses':s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
        <span style={{fontSize:11,color:'#6b7685',alignSelf:'center'}}>
          Showing {filtered.length} of {stations.length} stations
        </span>
        <button className="export-btn" onClick={()=>exportCSV(filtered)}>⬇ Export CSV</button>
      </div>

      <div className="card">
        <div className="card-body" style={{padding:"clamp(12px, 3vw, 20px)",overflowX:'auto'}}>
          <table className="gov-table">
            <thead>
              <tr>
                <Th col="id">Station ID</Th>
                <Th col="name">Name · নাম</Th>
                <Th col="division">Division</Th>
                <Th col="district">District</Th>
                <Th col="status">Status</Th>
                <Th col="stockPct">Stock Level</Th>
                <Th col="lastSupply">Last Supply</Th>
                <Th col="hoardingScore">Hoarding Risk</Th>
                <th>Anomaly</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <>
                  <tr
                    key={s.id}
                    onClick={() => setExpanded(expanded===s.id?null:s.id)}
                    style={{cursor:'pointer'}}
                    className={expanded===s.id?'expanded':''}
                  >
                    <td data-label="Station ID" style={{fontWeight:700,color:'#006A4E',fontVariantNumeric:'tabular-nums'}}>{s.id}</td>
                    <td data-label="Name" style={{fontWeight:600}}>{s.name}</td>
                    <td data-label="Division">{s.division}</td>
                    <td data-label="District">{s.district}</td>
                    <td data-label="Status"><span className={`badge badge-${s.status}`}>{s.status.toUpperCase()}</span></td>
                    <td data-label="Stock Level"><StockBar pct={Math.round(s.stockPct)} /></td>
                    <td data-label="Last Supply" style={{fontSize:11,fontVariantNumeric:'tabular-nums'}}>{s.lastSupply}</td>
                    <td data-label="Hoarding Risk"><HoardingScore score={s.hoardingScore} /></td>
                    <td data-label="Anomaly">{s.anomalyFlag?<span style={{color:'#F42A41',fontWeight:700}}>⚠ YES</span>:<span style={{color:'#22c55e'}}>✓ No</span>}</td>
                  </tr>
                  {expanded === s.id && <ExpandedRow key={`exp-${s.id}`} station={s} />}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
