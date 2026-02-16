
import React, { useState, useEffect, Suspense } from 'react';
import { Navbar } from './components/Navbar';
import { CustomCursor } from './components/CustomCursor';
import { useSmoothScroll } from './hooks/useSmoothScroll';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useSmoothScroll();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
        <div className="w-16 h-[1px] bg-white/10 relative overflow-hidden mb-6">
          <div className="absolute inset-0 bg-white translate-x-[-100%] animate-[shimmer_2s_infinite]" style={{ animation: 'shimmer 1.5s infinite ease-in-out' }} />
        </div>
        <h2 className="font-mono text-[10px] tracking-[0.8em] text-white/30 uppercase">Syncing Neural Core</h2>
        <style>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-black selection:bg-white selection:text-black">
        <CustomCursor />
        <Navbar />

        <Suspense fallback={<div className="h-20 bg-black flex items-center justify-center font-mono text-[10px] text-white/20">Accessing Node...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<DashboardPage />} />
          </Routes>
        </Suspense>

        <footer className="py-24 border-t border-white/5 text-center bg-black">
          <p className="font-mono text-[10px] uppercase tracking-[0.6em] text-gray-700">
            Neural Infrastructure • Department of Intelligent Systems • 2025
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
