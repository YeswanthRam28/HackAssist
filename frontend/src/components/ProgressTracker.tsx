import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ParticipationRecord {
    hackathon: string;
    status: string;
    deadline: string;
}

export const ProgressTracker: React.FC = () => {
    const [records, setRecords] = useState<ParticipationRecord[]>([]);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/student_progress/1'); // Hardcoded for demo
                const data = await response.json();
                setRecords(data);
            } catch (error) {
                console.error("Failed to fetch progress", error);
            }
        };
        fetchProgress();
    }, []);

    return (
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
            <h3 className="font-mono text-[10px] text-white uppercase tracking-[0.4em] mb-8 text-center">Active Trackers</h3>

            {records.length === 0 ? (
                <div className="text-center py-12">
                    <p className="font-mono text-[10px] text-gray-600 uppercase">No active operations detected.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {records.map((record, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center justify-between group"
                        >
                            <div className="flex flex-col gap-1">
                                <span className="text-white font-serif text-lg">{record.hackathon}</span>
                                <span className="font-mono text-[8px] text-gray-500 uppercase tracking-widest">{new Date(record.deadline).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="h-[1px] w-12 bg-white/10" />
                                <span className={`px-3 py-1 rounded-full font-mono text-[8px] uppercase tracking-widest ${record.status === 'Won' ? 'bg-green-500/20 text-green-400' :
                                        record.status === 'Lost' ? 'bg-red-500/20 text-red-400' :
                                            'bg-white/10 text-white'
                                    }`}>
                                    {record.status}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};
