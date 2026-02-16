
import React, { useEffect, useState, useMemo } from 'react';
import { motion, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const springConfig = { damping: 30, stiffness: 300 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  const binaryContent = useMemo(() => {
    let result = '';
    const characters = '01';
    for (let i = 0; i < 5000; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 10);
      cursorY.set(e.clientY - 10);
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const overlay = document.querySelector('.binary-overlay') as HTMLElement;
      if (overlay) {
        overlay.style.opacity = '1';
        overlay.style.maskImage = `radial-gradient(circle 120px at ${e.clientX}px ${e.clientY}px, black 0%, transparent 100%)`;
        overlay.style.webkitMaskImage = `radial-gradient(circle 120px at ${e.clientX}px ${e.clientY}px, black 0%, transparent 100%)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  return (
    <>
      <div className="binary-overlay">
        {binaryContent}
      </div>
      <motion.div
        className="fixed top-0 left-0 w-5 h-5 border border-white/20 pointer-events-none z-[9999] flex items-center justify-center hidden md:flex"
        style={{ x: cursorX, y: cursorY } as any}
      />
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 bg-white rounded-full pointer-events-none z-[9999] hidden md:block"
        {...({
          animate: { x: mousePosition.x - 2, y: mousePosition.y - 2 },
          transition: { duration: 0.1 }
        } as any)}
      />
    </>
  );
};
