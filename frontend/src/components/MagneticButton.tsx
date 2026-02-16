
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({ children, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    /* Fix: Casting animate and transition to any to resolve TS IntrinsicAttributes error */
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...({
        animate: { x, y },
        transition: { type: "spring", stiffness: 150, damping: 15, mass: 0.1 }
      } as any)}
      className="relative"
    >
      <button
        onClick={onClick}
        className="px-10 py-4 glass rounded-full font-mono text-xs uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors duration-500 overflow-hidden group"
      >
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-0" />
      </button>
    </motion.div>
  );
};
