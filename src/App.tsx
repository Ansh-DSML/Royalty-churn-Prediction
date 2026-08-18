import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { brandProfile } from './data/mockData';
import Overview from './pages/Overview';
import UnitDetail from './pages/UnitDetail';
import ChurnRiskForecast from './pages/ChurnRiskForecast';
import RevenueRecoveryForecast from './pages/RevenueRecoveryForecast';
import { Layers } from 'lucide-react';

function Header({ onHowItWorksClick }: { onHowItWorksClick: () => void }) {
  return (
    <header className="bg-surface-dark text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Layers className="h-6 w-6 text-brand-500" />
          <Link to="/" className="text-xl font-semibold tracking-tight">Meridian</Link>
          <span className="text-slate-400 text-sm ml-4 pl-4 border-l border-slate-700">
            {brandProfile.name}
          </span>
        </div>
        <button 
          onClick={onHowItWorksClick}
          className="text-sm text-slate-300 hover:text-white px-3 py-1.5 rounded-md border border-slate-700 hover:bg-slate-800 transition-colors"
        >
          How Meridian Works
        </button>
      </div>
    </header>
  );
}

function HowItWorksModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900">
          ✕
        </button>
        <h2 className="text-2xl font-semibold text-slate-900 mb-8">How Meridian Works</h2>
        
        <div className="flex items-center justify-between mb-8">
          <div className="w-1/3 bg-slate-50 p-6 rounded-lg border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Your Existing Systems</h3>
            <div className="space-y-3">
              <div className="bg-white border border-slate-200 p-3 rounded shadow-sm text-center font-medium">Compass (CRM)</div>
              <div className="bg-white border border-slate-200 p-3 rounded shadow-sm text-center font-medium">MiraPay (Payments)</div>
              <div className="bg-white border border-slate-200 p-3 rounded shadow-sm text-center font-medium">Broadly (Reputation)</div>
            </div>
          </div>
          
          <div className="w-1/6 flex flex-col items-center">
            <div className="h-0.5 w-full bg-brand-500 relative">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-brand-500 rotate-45"></div>
            </div>
            <span className="text-xs font-semibold text-brand-600 mt-2 uppercase tracking-wide">Reads Only</span>
          </div>
          
          <div className="w-1/3 bg-surface-dark text-white p-6 rounded-lg border border-slate-800 shadow-xl">
            <div className="flex items-center space-x-2 mb-4 justify-center">
              <Layers className="h-5 w-5 text-brand-500" />
              <h3 className="text-lg font-semibold tracking-tight">Meridian</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-800 border border-slate-700 p-3 rounded shadow-sm text-center text-sm">Cross-System Benchmarking</div>
              <div className="bg-slate-800 border border-slate-700 p-3 rounded shadow-sm text-center text-sm">Churn Risk Forecast</div>
              <div className="bg-slate-800 border border-slate-700 p-3 rounded shadow-sm text-center text-sm">Revenue Recovery Forecast</div>
            </div>
          </div>
        </div>
        
        <p className="text-slate-600 text-center text-lg max-w-2xl mx-auto">
          Meridian never becomes your system of record. It reads what you already have and shows you what those systems can't tell you on their own — including which franchisees are quietly at risk, and where reported revenue doesn't add up.
        </p>
      </div>
    </div>
  );
}

function App() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Header onHowItWorksClick={() => setModalOpen(true)} />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/unit/:id" element={<UnitDetail />} />
            <Route path="/churn-forecast" element={<ChurnRiskForecast />} />
            <Route path="/recovery-forecast" element={<RevenueRecoveryForecast />} />
          </Routes>
        </main>
        <HowItWorksModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </Router>
  );
}

export default App;
