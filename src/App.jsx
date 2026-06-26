import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Pipeline from './pages/Pipeline';
import Alerts from './pages/Alerts';
import Prices from './pages/Prices';
import Stations from './pages/Stations';
import Reserves from './pages/Reserves';
import './styles/global.css';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Header />
      <div className="app-body">
        <Sidebar />
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app-layout">
              <Header />
              <Home />
              <Footer />
            </div>
          }
        />
        <Route
          path="/pipeline"
          element={<AppLayout><Pipeline /></AppLayout>}
        />
        <Route
          path="/alerts"
          element={<AppLayout><Alerts /></AppLayout>}
        />
        <Route
          path="/prices"
          element={<AppLayout><Prices /></AppLayout>}
        />
        <Route
          path="/stations"
          element={<AppLayout><Stations /></AppLayout>}
        />
        <Route
          path="/reserves"
          element={<AppLayout><Reserves /></AppLayout>}
        />
      </Routes>
    </BrowserRouter>
  );
}
