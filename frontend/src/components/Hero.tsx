
import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';
import { MagneticButton } from './MagneticButton';
import { DecodingText } from './DecodingText';

gsap.registerPlugin(ScrollTrigger);

const NeuralCore = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  const particleCount = 4000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 1.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.1;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.05, 0.1);
  });

  return (
    <group ref={groupRef}>
      <Points positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.012}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.8}
        />
      </Points>

      <mesh>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.02} blending={THREE.AdditiveBlending} />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.05} blending={THREE.AdditiveBlending} />
      </mesh>

      <Float speed={3} rotationIntensity={0.8} floatIntensity={0.5}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[2.8, 0.003, 16, 100]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
        </mesh>
      </Float>
    </group>
  );
};

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasContainerRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      // Zoom the 3D core
      gsap.to(canvasContainerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        scale: 15,
        opacity: 0,
        ease: "power2.inOut",
      });

      // Fade out content
      gsap.to(contentRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "20% top",
          scrub: true,
        },
        y: -100,
        opacity: 0,
        ease: "power2.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const navigate = useNavigate();

  return (
    <div ref={containerRef} className="relative h-[250vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Background Canvas */}
        <div ref={canvasContainerRef} className="absolute inset-0 z-0 origin-center">
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <NeuralCore />
          </Canvas>
        </div>

        {/* Hero Content Overlay */}
        <div ref={contentRef} className="relative z-10 container mx-auto px-6 h-full flex flex-col items-center justify-center text-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-mono text-white/40 text-[10px] tracking-[0.6em] uppercase mb-6">
              Neural Infrastructure Protocol
            </p>
            <h1 className="font-serif text-6xl md:text-8xl lg:text-[10rem] leading-none mb-8 tracking-tighter text-white">
              <DecodingText text="From Idea to" /><br />
              <span className="italic font-light">
                <DecodingText text="Victory." />
              </span>
            </h1>
            <p className="font-mono text-gray-500 max-w-xl mx-auto text-[10px] md:text-xs mb-12 leading-relaxed uppercase tracking-[0.4em]">
              The Ultimate AI Mentor for the <br /> Elite Engineering Collective.
            </p>
            <div className="pointer-events-auto flex justify-center">
              <MagneticButton onClick={() => navigate('/app')}>
                Initialize Core
              </MagneticButton>
            </div>
          </motion.div>
        </div>

        {/* Progress Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20">
          <span className="font-mono text-[8px] uppercase tracking-[0.6em] text-white">Descend into Core</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent" />
        </div>
      </div>
    </div>
  );
};
