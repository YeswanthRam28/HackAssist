import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Hackathon {
    hackathon_id: number;
    name: string;
    description: string;
    skills_required: string[];
    deadline: string;
}

export const HackathonExplorer: React.FC = () => {
    const [hackathons, setHackathons] = useState<Hackathon[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHackathons = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/hackathons');
                const data = await response.json();
                setHackathons(data);
            } catch (error) {
                console.error("Failed to fetch hackathons:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHackathons();
    }, []);

    if (isLoading) {
        return <div className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Scanning Neural Channels...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hackathons.map((hack) => (
                    <motion.div
                        key={hack.hackathon_id}
                        whileHover={{ y: -5 }}
                        className="p-6 glass rounded-xl border border-white/5 hover:border-white/20 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-serif text-xl text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                                {hack.name}
                            </h3>
                            <span className="font-mono text-[9px] text-white/30 uppercase border border-white/10 px-2 py-1 rounded">
                                Active
                            </span>
                        </div>

                        <p className="text-gray-500 text-xs mb-6 line-clamp-2 leading-relaxed">
                            {hack.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {hack.skills_required?.slice(0, 3).map((skill, i) => (
                                <span key={i} className="font-mono text-[8px] uppercase tracking-tighter text-white/40 bg-white/5 px-2 py-1 rounded-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>

                        <div className="flex justify-between items-center text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">
                            <span>Deadline: {new Date(hack.deadline).toLocaleDateString()}</span>
                            <button className="text-white hover:text-blue-400 transition-colors">
                                Initialize →
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
            {hackathons.length === 0 && (
                <div className="p-12 text-center glass rounded-xl border border-white/5">
                    <p className="font-mono text-[10px] text-white/20 uppercase">No active missions found in current sector.</p>
                </div>
            )}
        </div>
    );
};
