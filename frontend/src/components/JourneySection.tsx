
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const slides = [
  {
    title: "Discover",
    subtitle: "Recommendation Agent",
    description: "Scan thousands of hackathons globally. Our AI matches your skills, interests, and academic schedule to the perfect competitive arena.",
  },
  {
    title: "Team Up",
    subtitle: "Formation Agent",
    description: "Connect with the perfect squad. Our agent analyzes peer repositories and skill sets to suggest the Python wiz or Frontend maestro you're missing.",
  },
  {
    title: "Build",
    subtitle: "Roadmap & Idea Agent",
    description: "Transform fuzzy concepts into structured roadmaps. Get day-wise milestones, tech-stack suggestions, and MVP features generated in seconds.",
  },
  {
    title: "Win",
    subtitle: "Success Analytics",
    description: "Post-submission performance review and faculty tracking. Watch your growth curve from first commit to the winner's podium.",
  }
];

export const JourneySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Start the horizontal movement slightly after the section enters view
  const x = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "-75%"]);
  
  // Progress line drawn based on scroll
  const pathLength = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  return (
    <div ref={containerRef} className="relative h-[450vh] bg-black">
      {/* Animated Roadmap SVG Line - Minimal Gray */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] pointer-events-none z-0 opacity-10 px-20">
        <svg width="100%" height="1" viewBox="0 0 1000 1" preserveAspectRatio="none">
          <motion.line 
            x1="0" y1="0.5" x2="1000" y2="0.5" 
            stroke="white" strokeWidth="1" 
            style={{ pathLength: pathLength as any }}
          />
        </svg>
      </div>

      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Entrance Label */}
        <div className="absolute top-24 left-10 md:left-24 font-mono text-[9px] uppercase tracking-[0.8em] text-white/20">
          The Student Journey • Phase Sequence
        </div>

        <motion.div style={{ x } as any} className="flex gap-60 px-24 md:px-60">
          {slides.map((slide, index) => (
            <div key={index} className="flex-shrink-0 w-[85vw] md:w-[75vw] h-[60vh] flex flex-col justify-center relative group">
              <div className="max-w-4xl">
                <div className="flex items-center gap-10 mb-12">
                  <span className="font-serif italic text-white text-8xl md:text-[10rem] opacity-5 select-none transition-opacity group-hover:opacity-10">0{index + 1}</span>
                  <div className="flex flex-col">
                    <div className="h-[1px] w-20 bg-white/20 mb-4" />
                    <span className="font-mono text-white/30 text-[10px] tracking-[0.6em] uppercase whitespace-nowrap">{slide.subtitle}</span>
                  </div>
                </div>
                
                <h2 className="font-serif text-7xl md:text-9xl mb-12 group-hover:translate-x-6 transition-transform duration-1000 ease-out leading-[0.85] tracking-tighter">
                  {slide.title}
                </h2>
                
                <p className="text-gray-500 text-lg md:text-2xl leading-relaxed max-w-2xl font-light tracking-tight">
                  {slide.description}
                </p>
                
                <div className="mt-16 flex gap-10 items-center">
                  <div className="flex gap-3">
                    <div className="w-1 h-1 rounded-full bg-white opacity-40" />
                    <div className="w-1 h-1 rounded-full bg-white opacity-10" />
                    <div className="w-1 h-1 rounded-full bg-white opacity-10" />
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.6em] text-gray-700">Module Integrity Verified</div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Background Gradient for Depth */}
      <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
};
