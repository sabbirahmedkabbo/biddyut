import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', bn: 'হোম', end: true, icon: '⌂' },
  { to: '/pipeline', label: 'Supply Pipeline', bn: 'সরবরাহ পাইপলাইন', icon: '⟶' },
  { to: '/alerts', label: 'Alert Centre', bn: 'সতর্কতা কেন্দ্র', icon: '⚠' },
  { to: '/prices', label: 'Price Monitor', bn: 'মূল্য পর্যবেক্ষণ', icon: '$' },
  { to: '/stations', label: 'Station Network', bn: 'স্টেশন নেটওয়ার্ক', icon: '⛽' },
  { to: '/reserves', label: 'Stock Reserves', bn: 'মজুদ ভাণ্ডার', icon: '▣' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-label">Navigation · নেভিগেশন</div>
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({isActive}) => 'sidebar-link' + (isActive ? ' active' : '')}
          >
            <span style={{fontSize:14}}>{l.icon}</span>
            <span>
              {l.label}
              <span className="bn-label">{l.bn}</span>
            </span>
          </NavLink>
        ))}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">System · সিস্টেম</div>
        <div style={{padding:'8px 16px'}}>
          <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginBottom:4}}>Data Source</div>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.7)'}}>Petrobangla · BPC · BERC</div>
          <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginTop:8,marginBottom:4}}>Update Cycle</div>
          <div style={{fontSize:11,color:'rgba(255,255,255,0.7)'}}>Real-time (3s interval)</div>
          <div style={{fontSize:10,color:'rgba(255,255,255,0.4)',marginTop:8,marginBottom:4}}>Environment</div>
          <div style={{fontSize:11,color:'#4ade80'}}>● LIVE</div>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Quick Stats</div>
        <div style={{padding:'8px 16px',fontSize:11,color:'rgba(255,255,255,0.6)',lineHeight:2}}>
          <div>Active Stations: <span style={{color:'#4ade80',fontWeight:700}}>4,200+</span></div>
          <div>Districts Covered: <span style={{color:'#4ade80',fontWeight:700}}>64</span></div>
          <div>Divisions: <span style={{color:'#4ade80',fontWeight:700}}>8</span></div>
          <div>Pipeline Stages: <span style={{color:'#fbbf24',fontWeight:700}}>7</span></div>
        </div>
      </div>

      <div style={{padding:'12px 16px',marginTop:'auto'}}>
        <div style={{fontSize:9,color:'rgba(255,255,255,0.3)',lineHeight:1.6,textAlign:'center',borderTop:'1px solid rgba(255,255,255,0.08)',paddingTop:10}}>
          BFSCMS v2.6.1<br/>
          <span style={{color:'rgba(200,168,75,0.5)'}}>OFFICIAL USE ONLY</span>
        </div>
      </div>
    </aside>
  );
}
