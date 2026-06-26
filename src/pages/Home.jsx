import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LiveTicker from '../components/LiveTicker';
import { STATIONS } from '../data/stations';
import { PIPELINE_STAGES } from '../data/pipeline';
import { ALERT_POOL } from '../data/alerts';

const DEPOT_LOCATIONS = [
  { name: 'Chittagong Port Terminal', lat: 22.709, lng: 91.797, type: 'import' },
  { name: 'Patenga Primary Depot', lat: 22.72, lng: 91.81, type: 'primary' },
  { name: 'Godnail Depot', lat: 23.615, lng: 90.501, type: 'primary' },
  { name: 'Dhaka Secondary Depot', lat: 23.755, lng: 90.39, type: 'secondary' },
  { name: 'Rajshahi Depot', lat: 24.374, lng: 88.601, type: 'secondary' },
  { name: 'Khulna Depot', lat: 22.845, lng: 89.535, type: 'secondary' },
  { name: 'Sylhet Depot', lat: 24.899, lng: 91.872, type: 'secondary' },
  { name: 'Barisal Depot', lat: 22.701, lng: 90.364, type: 'secondary' },
  { name: 'Rangpur Depot', lat: 25.745, lng: 89.275, type: 'secondary' },
  { name: 'Mymensingh Depot', lat: 24.746, lng: 90.407, type: 'secondary' },
];

function useLiveNumbers(initial, variance = 0.03) {
  const [val, setVal] = useState(initial);
  useEffect(() => {
    const t = setInterval(() => {
      setVal(v => Math.round(v * (1 + (Math.random()-0.5)*variance*2)));
    }, 3000);
    return () => clearInterval(t);
  }, [variance]);
  return val;
}

export default function Home() {
  const [feed, setFeed] = useState(() =>
    ALERT_POOL.slice(0,5).map(a => ({
      time: a.time,
      text: `[${a.severity}] ${a.location} — ${a.description.substring(0,90)}…`
    }))
  );

  const stockLevel = useLiveNumbers(74, 0.005);
  const importVol = useLiveNumbers(42500, 0.01);
  const activeAlerts = useLiveNumbers(ALERT_POOL.filter(a=>a.status==='open').length, 0.02);
  const stationsOnline = useLiveNumbers(4187, 0.002);

  useEffect(() => {
    const t = setInterval(() => {
      const stage = PIPELINE_STAGES[Math.floor(Math.random()*PIPELINE_STAGES.length)];
      const text = `[${new Date().toLocaleTimeString('en-GB')} BST] Stage ${stage.id} "${stage.name}" — Flow: ${(stage.flowRate * (0.97 + Math.random()*0.06)).toFixed(0)} MT/hr`;
      setFeed(prev => [{time: new Date().toLocaleTimeString('en-GB'), text}, ...prev].slice(0,30));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const depotColor = (type) => type === 'import' ? '#F42A41' : type === 'primary' ? '#C8A84B' : '#006A4E';

  return (
    <div className="home-layout">
      <LiveTicker />

      <div className="status-strip">
        <span style={{fontSize:"clamp(10px, 2vw, 12px)",color:'rgba(255,255,255,0.5)',fontWeight:700,marginRight:"clamp(4px, 2vw, 8px)"}}>PIPELINE STATUS:</span>
        {PIPELINE_STAGES.map(s => (
          <div key={s.id} className="status-strip-item">
            <div className={`status-dot ${s.status==='operational'?'ok':s.status==='warning'?'warn':'crit'}`} />
            <span className="status-stage-name">S{s.id}: {s.name}</span>
          </div>
        ))}
      </div>

      <div className="home-stats">
        <div className="home-stat">
          <div className="home-stat-label">National Stock Level · জাতীয় মজুদ</div>
          <div className="home-stat-value" style={{color:'#006A4E'}}>{stockLevel}%</div>
          <div className="home-stat-sub">Composite fuel reserve index</div>
        </div>
        <div className="home-stat">
          <div className="home-stat-label">Import Volume Today · আজকের আমদানি</div>
          <div className="home-stat-value" style={{color:'#006A4E'}}>{importVol.toLocaleString()}</div>
          <div className="home-stat-sub">Metric tonnes received at Chittagong</div>
        </div>
        <div className="home-stat">
          <div className="home-stat-label">Active Alerts · সক্রিয় সতর্কতা</div>
          <div className="home-stat-value" style={{color:'#F42A41'}}>{activeAlerts}</div>
          <div className="home-stat-sub">Open incidents across pipeline</div>
        </div>
        <div className="home-stat">
          <div className="home-stat-label">Stations Online · স্টেশন সক্রিয়</div>
          <div className="home-stat-value" style={{color:'#006A4E'}}>{stationsOnline.toLocaleString()}</div>
          <div className="home-stat-sub">of 4,200+ registered stations</div>
        </div>
      </div>

      <div className="hero">
        <div className="hero-text">
          <div className="hero-title">Bangladesh Fuel Supply Chain<br/>Monitoring System</div>
          <div className="hero-title-bn">বাংলাদেশ জ্বালানি সরবরাহ শৃঙ্খল পর্যবেক্ষণ ব্যবস্থা</div>
          <div className="hero-desc">
            Real-time monitoring of all 7 stages of Bangladesh's national fuel supply chain —
            from Chittagong import terminals to end consumers across 64 districts.
            Powered by MPEMR, BERC, Petrobangla, and BPC integrated data streams.
          </div>
          <div className="hero-cta">
            <Link to="/pipeline" className="btn-primary">Enter Monitoring Dashboard →</Link>
            <Link to="/alerts" className="btn-secondary">View Alert Centre ⚠</Link>
          </div>
        </div>
        <div className="hero-map">
          <MapContainer
            center={[23.685, 90.356]}
            zoom={6}
            style={{height:'100%',width:'100%'}}
            zoomControl={false}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {DEPOT_LOCATIONS.map((d,i) => (
              <CircleMarker
                key={i}
                center={[d.lat, d.lng]}
                radius={d.type==='import'?10:d.type==='primary'?8:6}
                pathOptions={{
                  color: depotColor(d.type),
                  fillColor: depotColor(d.type),
                  fillOpacity: 0.9,
                  weight: 2,
                }}
              >
                <Popup>{d.name}</Popup>
              </CircleMarker>
            ))}
            {STATIONS.filter((_,i)=>i%5===0).map(s => (
              <CircleMarker
                key={s.id}
                center={[s.lat, s.lng]}
                radius={3}
                pathOptions={{
                  color: s.status==='operational'?'#22c55e':s.status==='warning'?'#f59e0b':'#F42A41',
                  fillColor: s.status==='operational'?'#22c55e':s.status==='warning'?'#f59e0b':'#F42A41',
                  fillOpacity: 0.8,
                  weight: 1,
                }}
              >
                <Popup>{s.name} — Stock: {s.stockPct}%</Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>

      <div className="home-content">
        <div>
          <div className="live-feed">
            <div className="live-feed-header">
              <div className="live-dot" />
              <h3>LIVE FEED — জ্বালানি ঘটনা প্রবাহ</h3>
              <span style={{marginLeft:'auto',fontSize:"clamp(10px, 2vw, 11px)"}}>Auto-updates every 3s</span>
            </div>
            <div className="feed-list">
              {feed.map((item, i) => (
                <div key={i} className="feed-item">
                  <div className="feed-time">{item.time}</div>
                  <div className="feed-text">{item.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:"clamp(12px, 3vw, 20px)"}}>
          <div className="card">
            <div className="card-header">
              <h3>Pipeline Stage Status · পাইপলাইন স্তর</h3>
            </div>
            <div className="card-body" style={{padding:'8px 0'}}>
              {PIPELINE_STAGES.map(s => (
                <div key={s.id} style={{display:'flex',alignItems:'center',padding:'7px 16px',borderBottom:'1px solid #f1f5f9',gap:"clamp(12px, 3vw, 20px)"}}>
                  <div className={`stage-indicator ${s.status}`} style={{position:'static',flexShrink:0}} />
                  <div style={{flex:1}}>
                    <div style={{fontSize:11,fontWeight:700,color:'#1a2130'}}>S{s.id} · {s.name}</div>
                    <div style={{fontSize:10,color:'#6b7685',fontFamily:'var(--font-bn)'}}>{s.nameBn}</div>
                  </div>
                  <div style={{fontSize:11,fontVariantNumeric:'tabular-nums',fontWeight:600,color:'#006A4E'}}>
                    {s.volumeToday.toLocaleString()} {s.unit}
                  </div>
                  <span className={`badge badge-${s.status}`}>{s.status.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header" style={{background:'#991b1b'}}>
              <h3>⚠ Critical Alerts · সংকটজনক সতর্কতা</h3>
            </div>
            <div className="card-body" style={{padding:'8px 16px'}}>
              {ALERT_POOL.filter(a=>a.severity==='Critical').slice(0,4).map(a => (
                <div key={a.id} style={{borderLeft:'3px solid #F42A41',paddingLeft:10,marginBottom:"clamp(12px, 3vw, 20px)"}}>
                  <div style={{fontSize:10,fontWeight:700,color:'#991b1b'}}>{a.id} · {a.time}</div>
                  <div style={{fontSize:11,color:'#374151',marginTop:"clamp(12px, 3vw, 20px)"}}>{a.description.substring(0,100)}…</div>
                  <div style={{fontSize:10,color:'#6b7685',marginTop:"clamp(12px, 3vw, 20px)"}}>{a.location}</div>
                </div>
              ))}
              <Link to="/alerts" style={{fontSize:11,color:'#006A4E',fontWeight:600,textDecoration:'none'}}>View all alerts →</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="home-map-section">
        <div className="card">
          <div className="card-header">
            <h3>National Station Network Map · জাতীয় স্টেশন মানচিত্র</h3>
            <span className="bn" style={{fontSize:"clamp(9px, 2vw, 10px)",color:'rgba(255,255,255,0.6)'}}>50 monitored stations shown · সকল বিভাগ</span>
          </div>
          <div className="map-container">
            <MapContainer center={[23.685, 90.356]} zoom={7} style={{height:'100%',width:'100%'}}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
              {STATIONS.map(s => (
                <CircleMarker
                  key={s.id}
                  center={[s.lat, s.lng]}
                  radius={s.status==='critical'?9:s.status==='warning'?7:6}
                  pathOptions={{
                    color: s.status==='operational'?'#006A4E':s.status==='warning'?'#f59e0b':'#F42A41',
                    fillColor: s.status==='operational'?'#22c55e':s.status==='warning'?'#fbbf24':'#F42A41',
                    fillOpacity: 0.85,
                    weight: 2,
                  }}
                >
                  <Popup>
                    <b>{s.name}</b><br/>
                    {s.division} · {s.district}<br/>
                    Stock: <b>{s.stockPct}%</b> · Status: <b>{s.status}</b><br/>
                    Last Supply: {s.lastSupply}
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
          <div style={{padding:"clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)",background:'#f8f9fb',borderTop:'1px solid #e5e7eb',fontSize:"clamp(9px, 2vw, 10px)",color:'#6b7685',display:'flex',flexWrap:'wrap',gap:"clamp(8px, 2vw, 12px)"}}>
            <span><span style={{color:'#22c55e',fontWeight:700}}>●</span> Operational</span>
            <span><span style={{color:'#f59e0b',fontWeight:700}}>●</span> Warning</span>
            <span><span style={{color:'#F42A41',fontWeight:700}}>●</span> Critical</span>
            <span style={{marginLeft:'auto',minWidth:'100%',textAlign:'right'}}>Data: BPC/BERC Station Registry · Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
