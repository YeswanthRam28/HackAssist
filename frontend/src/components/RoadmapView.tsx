import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Step {
    id: number;
    title: string;
    description: string;
    x: number;
    y: number;
}

export const RoadmapView: React.FC = () => {
    const [steps, setSteps] = useState<Step[]>([]);
    const [svgPath, setSvgPath] = useState('');

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/roadmap', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ project_title: "My Project", theme: "AI", tech_stack: ["React"] }),
                });
                const data = await response.json();
                setSteps(data.steps);
                setSvgPath(data.svg_path);
            } catch (error) {
                console.error("Failed to fetch roadmap:", error);
            }
        };

        fetchRoadmap();
    }, []);

    return (
        <div className="relative w-full max-w-4xl mx-auto py-24 bg-black/50 rounded-3xl border border-white/5 backdrop-blur-sm overflow-hidden min-h-[500px]">
            <div className="absolute inset-0 z-0">
                <svg className="w-full h-full" viewBox="0 0 600 300">
                    <motion.path
                        d={svgPath}
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeDasharray="1000"
                        initial={{ strokeDashoffset: 1000 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                        opacity="0.1"
                    />
                </svg>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 px-12">
                {steps.map((step) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: step.id * 0.2 }}
                        className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-white/20 transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-mono text-xs mb-4 group-hover:scale-110 transition-transform">
                            {step.id}
                        </div>
                        <h3 className="text-white font-serif text-xl mb-2">{step.title}</h3>
                        <p className="text-gray-500 text-xs leading-relaxed uppercase tracking-wider font-mono">
                            {step.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
