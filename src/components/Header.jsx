import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

export default function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const bst = new Date(time.getTime() + (6 * 60 - time.getTimezoneOffset()) * 60000);
  const hh = String(bst.getUTCHours()).padStart(2,'0');
  const mm = String(bst.getUTCMinutes()).padStart(2,'0');
  const ss = String(bst.getUTCSeconds()).padStart(2,'0');
  const dateStr = bst.toLocaleDateString('en-GB', {
    timeZone: 'UTC',
    weekday:'short',
    day:'2-digit',
    month:'short',
    year:'numeric'
  });

  return (
    <header className="header">
      <img
        className="header-emblem"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Emblem_of_Bangladesh.svg/800px-Emblem_of_Bangladesh.svg.png"
        alt="Emblem of Bangladesh"
      />
      <div className="header-title">
        <h1 className="bn">জ্বালানি মনিটর</h1>
        <p className="header-subtitle">Fuel Monitor System — Ministry of Power, Energy &amp; Mineral Resources</p>
      </div>

      <nav className="nav-links">
        <NavLink to="/" end className={({isActive})=>'nav-link'+(isActive?' active':'')}>Home</NavLink>
        <NavLink to="/pipeline" className={({isActive})=>'nav-link'+(isActive?' active':'')}>Pipeline</NavLink>
        <NavLink to="/alerts" className={({isActive})=>'nav-link'+(isActive?' active':'')}>Alerts</NavLink>
        <NavLink to="/prices" className={({isActive})=>'nav-link'+(isActive?' active':'')}>Prices</NavLink>
        <NavLink to="/stations" className={({isActive})=>'nav-link'+(isActive?' active':'')}>Stations</NavLink>
        <NavLink to="/reserves" className={({isActive})=>'nav-link'+(isActive?' active':'')}>Reserves</NavLink>
      </nav>

      <div className="header-right">
        <div className="header-ministry">
          Ministry of Power<br/>Energy &amp; Mineral Resources<br/>Government of Bangladesh
        </div>
        <div className="header-clock">
          <div className="time">{hh}:{mm}:{ss}</div>
          <div className="tz">BST (UTC+6) · {dateStr}</div>
        </div>
      </div>
    </header>
  );
}
