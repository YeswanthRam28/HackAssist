
import React from 'react';
import { motion } from 'framer-motion';

const techStack = [
  "GEMINI 2.5",
  "LANGGRAPH",
  "RAG ENGINE",
  "FASTAPI",
  "STREAMLIT",
  "GROK",
  "PYTHON",
  "REACT",
  "THREE.JS",
  "NEXT-GEN AI",
  "24/7 MENTOR",
  "INNOVATION RADAR"
];

const TickerRow = ({ speed = 20, reverse = false }: { speed?: number, reverse?: boolean }) => {
  const repeatedTech = [...techStack, ...techStack, ...techStack];

  return (
    <div className="flex overflow-hidden select-none">
      <motion.div
        animate={{ x: reverse ? [0, -1920] : [-1920, 0] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
        className="flex whitespace-nowrap gap-16 py-8 items-center"
      >
        {repeatedTech.map((item, i) => (
          <div key={i} className="flex items-center gap-16">
            <span className="font-mono text-4xl md:text-6xl font-black tracking-tighter text-white/5 hover:text-white transition-colors duration-700 cursor-default uppercase">
              {item}
            </span>
            <div className="w-1 h-1 bg-white/10" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export const TechStackParallax: React.FC = () => {
  return (
    <div className="relative py-32 bg-[#050505] overflow-hidden">
      <div className="container mx-auto px-6 mb-20">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <span className="font-mono text-white/30 text-[10px] tracking-[0.5em] uppercase block mb-4">Neural Infrastructure</span>
            <h2 className="font-serif text-5xl md:text-7xl max-w-2xl leading-tight">
              A Unified ecosystem.
            </h2>
          </div>
          <p className="font-mono text-[9px] text-gray-600 max-w-[200px] uppercase leading-relaxed tracking-[0.3em] text-right">
            System Integrity: 100% <br/>
            Neural Latency: 4ms <br/>
            Distributed Core
          </p>
        </div>
      </div>

      <div className="relative border-y border-white/5">
        <TickerRow speed={40} />
        <TickerRow speed={60} reverse />
      </div>

      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />
    </div>
  );
};
