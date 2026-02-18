import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/store';
import { useNavigate } from 'react-router-dom';

interface Hackathon {
    hackathon_id: number;
    name: string;
    description: string;
    skills_required: string[];
    deadline: string;
    match_score?: number;
    reason?: string;
}

export const HackathonExplorer: React.FC = () => {
    const { user } = useStore();
    const navigate = useNavigate();
    const [hackathons, setHackathons] = useState<Hackathon[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHackathons = async () => {
            try {
                const endpoint = user?.student_id
                    ? `http://localhost:8000/api/recommendations/${user.student_id}`
                    : 'http://localhost:8000/api/hackathons';

                const response = await fetch(endpoint);
                const data = await response.json();
                setHackathons(data);
            } catch (error) {
                console.error("Failed to fetch hackathons:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHackathons();
    }, [user?.student_id]);

    if (isLoading) {
        return <div className="font-mono text-[10px] text-white/20 uppercase tracking-widest">Scanning Neural Channels...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hackathons.map((hack, index) => (
                    <motion.div
                        key={hack.hackathon_id || index}
                        whileHover={{ y: -5 }}
                        className="p-6 glass rounded-xl border border-white/5 hover:border-white/20 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-serif text-xl text-white group-hover:text-white/80 transition-colors uppercase tracking-tight">
                                {hack.name}
                            </h3>
                            {hack.match_score ? (
                                <div className="flex flex-col items-end">
                                    <span className="font-mono text-[10px] text-white bg-blue-500/20 border border-blue-500/40 px-2 py-0.5 rounded-full mb-1">
                                        {hack.match_score}% MATCH
                                    </span>
                                </div>
                            ) : (
                                <span className="font-mono text-[9px] text-white/30 uppercase border border-white/10 px-2 py-1 rounded">
                                    Active
                                </span>
                            )}
                        </div>

                        <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">
                            {hack.description}
                        </p>

                        {hack.reason && (
                            <div className="mb-6 p-3 bg-white/[0.02] border border-white/5 rounded-lg">
                                <p className="font-mono text-[9px] text-blue-400/60 uppercase tracking-widest leading-normal">
                                    <span className="text-white/40">Neural Logic:</span> {hack.reason}
                                </p>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-2 mb-8">
                            {hack.skills_required?.slice(0, 3).map((skill, i) => (
                                <span key={i} className="font-mono text-[8px] uppercase tracking-tighter text-white/40 bg-white/5 px-2 py-1 rounded-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>

                        <div className="flex justify-between items-center text-[9px] font-mono text-white/30 uppercase tracking-[0.2em]">
                            <span>Deadline: {new Date(hack.deadline).toLocaleDateString()}</span>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => navigate(`/register/${hack.hackathon_id}?mode=join`)}
                                    className="text-blue-400/60 hover:text-blue-400 transition-colors"
                                >
                                    Join Squad
                                </button>
                                <button
                                    onClick={() => navigate(`/register/${hack.hackathon_id}`)}
                                    className="text-white hover:text-blue-400 transition-colors"
                                >
                                    Initialize →
                                </button>
                            </div>
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
