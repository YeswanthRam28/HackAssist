
import React from 'react';
import { motion } from 'framer-motion';
import { DecodingText } from './DecodingText';

const ImpactPillar = ({ index, title, description }: { index: string, title: string, description: string }) => (
  <motion.div 
    {...({
      initial: { opacity: 0, y: 20 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.6, delay: 0.1 * parseInt(index) },
      viewport: { once: true }
    } as any)}
    className="relative group border-l border-white/10 pl-8 py-4"
  >
    <div className="absolute left-0 top-0 h-0 w-[1px] bg-white group-hover:h-full transition-all duration-700 ease-in-out" />
    <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.4em] mb-2 block">Pillar {index}</span>
    <h3 className="font-serif text-2xl mb-4 group-hover:pl-2 transition-all duration-300">
      <DecodingText text={title} />
    </h3>
    <p className="text-gray-500 text-sm leading-relaxed font-light">
      {description}
    </p>
  </motion.div>
);

export const InnovationDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        {/* Left Column: Context */}
        <motion.div
          {...({
            initial: { opacity: 0, x: -30 },
            whileInView: { opacity: 1, x: 0 },
            transition: { duration: 0.8 },
            viewport: { once: true }
          } as any)}
        >
          <span className="font-mono text-white/40 text-[10px] tracking-[0.5em] uppercase mb-4 block">The Value Proposition</span>
          <h2 className="font-serif text-6xl md:text-7xl mb-10 leading-none">
            Why this <br/>
            <span className="italic">Matters.</span>
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-12 font-light max-w-md">
            HackAssists AI isn't just a tool; it's a structural upgrade for the modern department. We close the loop between classroom theory and real-world victory.
          </p>
          
          <div className="flex flex-col gap-10">
             <div className="flex items-start gap-6">
                <div className="w-10 h-[1px] bg-white/20 mt-3" />
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white mb-2">Institutional Impact</h4>
                  <p className="text-gray-500 text-xs uppercase tracking-widest leading-loose">
                    Transforming the department into an <br/>autonomous innovation engine.
                  </p>
                </div>
             </div>
             <div className="flex items-start gap-6">
                <div className="w-10 h-[1px] bg-white/20 mt-3" />
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white mb-2">Student Trajectory</h4>
                  <p className="text-gray-500 text-xs uppercase tracking-widest leading-loose">
                    Accelerating the transition from <br/>learner to world-class engineer.
                  </p>
                </div>
             </div>
          </div>
        </motion.div>

        {/* Right Column: Aesthetic Impact Manifesto */}
        <div className="relative">
          {/* Decorative background grid */}
          <div className="absolute -inset-10 opacity-[0.03] pointer-events-none overflow-hidden">
             <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          </div>

          <motion.div
            {...({
              initial: { opacity: 0, scale: 0.95 },
              whileInView: { opacity: 1, scale: 1 },
              transition: { duration: 1, ease: "circOut" },
              viewport: { once: true }
            } as any)}
            className="glass p-12 md:p-16 rounded-3xl relative border border-white/5 shadow-2xl overflow-hidden"
          >
            {/* Minimalist Scanning Element */}
            <motion.div 
              animate={{ y: [0, 400, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-10"
            />

            <div className="space-y-12 relative z-20">
              <ImpactPillar 
                index="01"
                title="Scalable Mentorship"
                description="Expertise is rare. Our AI Democratizes 24/7 technical mentorship, ensuring no student hits a dead end, regardless of faculty bandwidth."
              />
              <ImpactPillar 
                index="02"
                title="The Bridge"
                description="Faculty gain immediate, real-time oversight into what students are building, their tech stack preferences, and their innovation pace."
              />
              <ImpactPillar 
                index="03"
                title="Global Benchmarks"
                description="Theory meets reality. We equip students to compete and win at international hackathons, elevating the entire department's prestige."
              />
            </div>

            <div className="mt-16 pt-8 border-t border-white/5 flex justify-between items-end">
               <div className="font-mono text-[9px] text-gray-600 uppercase tracking-[0.5em]">
                  Unified Ecosystem <br/>
                  Standard 2.5-A
               </div>
               <div className="text-right">
                  <span className="font-serif text-4xl italic opacity-10">Manifesto</span>
               </div>
            </div>
          </motion.div>

          {/* Floating badge for added aesthetic */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 glass p-4 rounded-xl border border-white/10 hidden md:block"
          >
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-white opacity-40 animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-[0.4em]">Neural Standard</span>
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
