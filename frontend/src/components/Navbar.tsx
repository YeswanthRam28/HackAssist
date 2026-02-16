import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/store';

export const Navbar: React.FC = () => {
  const { userRole, setRole } = useStore();
  const location = useLocation();
  const isDashboard = location.pathname === '/app';

  return (
    <motion.nav
      {...({
        initial: { y: -50, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 0.5 }
      } as any)}
      className="fixed top-0 left-0 w-full z-50 px-10 py-8 flex justify-between items-center bg-black/50 backdrop-blur-sm border-b border-white/5"
    >
      <div className="flex items-center gap-12">
        <Link to="/" className="flex items-center gap-4">
          <div className="w-6 h-6 border border-white flex items-center justify-center font-bold text-[10px] text-white font-mono">
            H
          </div>
          <span className="font-mono text-[10px] font-bold tracking-[0.5em] uppercase hidden md:block">HackAssist AI</span>
        </Link>

        {isDashboard && (
          <div className="flex gap-4 p-1 bg-white/5 rounded-full border border-white/10">
            {(['student', 'faculty', 'hod'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setRole(role)}
                className={`px-4 py-1.5 rounded-full font-mono text-[8px] uppercase tracking-widest transition-all ${userRole === role
                  ? 'bg-white text-black'
                  : 'text-gray-500 hover:text-white'
                  }`}
              >
                {role}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="hidden md:flex gap-12">
        {['Journey', 'Tech', 'Features'].map((item) => (
          <Link
            key={item}
            to={item === 'Features' ? '/app' : '/'}
            className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/40 hover:text-white transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>

      <Link to="/app" className="border border-white/10 px-6 py-2 rounded-full font-mono text-[9px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">
        v2.5_CORE
      </Link>
    </motion.nav>
  );
};
