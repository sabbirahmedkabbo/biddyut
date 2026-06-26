import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import emblemImage from '../assets/emblem.svg';

export default function Header() {
  const [time, setTime] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Bangladesh Standard Time (BST) is UTC+6 (Dhaka time)
  const bstTime = new Date(time.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));
  const hh = String(bstTime.getHours()).padStart(2, '0');
  const mm = String(bstTime.getMinutes()).padStart(2, '0');
  const ss = String(bstTime.getSeconds()).padStart(2, '0');
  const dateStr = bstTime.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="header">
      <img
        className="header-emblem"
        src={emblemImage}
        alt="Emblem of Bangladesh"
      />
      <div className="header-title">
        <h1 className="bn">জ্বালানি মনিটর</h1>
        <p className="header-subtitle">Fuel Monitor · Ministry of Power, Energy &amp; Mineral Resources</p>
      </div>

      <button
        className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation"
        type="button"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
        <NavLink
          to="/"
          end
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          onClick={closeMenu}
        >
          Home
        </NavLink>
        <NavLink
          to="/pipeline"
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          onClick={closeMenu}
        >
          Pipeline
        </NavLink>
        <NavLink
          to="/alerts"
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          onClick={closeMenu}
        >
          Alerts
        </NavLink>
        <NavLink
          to="/prices"
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          onClick={closeMenu}
        >
          Prices
        </NavLink>
        <NavLink
          to="/stations"
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          onClick={closeMenu}
        >
          Stations
        </NavLink>
        <NavLink
          to="/reserves"
          className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
          onClick={closeMenu}
        >
          Reserves
        </NavLink>
      </nav>

      <div className="header-right">
        <div className="header-ministry">
          Ministry of Power<br />Energy &amp; Mineral Resources<br />Bangladesh
        </div>
        <div className="header-clock">
          <div className="time">{hh}:{mm}:{ss}</div>
          <div className="tz">ঢাকা সময় (BST) • {dateStr}</div>
        </div>
      </div>
    </header>
  );
}
