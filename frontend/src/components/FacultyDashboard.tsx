import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Metric {
    label: string;
    value: string | number;
}

export const FacultyDashboard: React.FC = () => {
    const [report, setReport] = useState<string>('Loading AI Analysis...');
    const [metrics] = useState<Metric[]>([
        { label: 'Active Students', value: '42' },
        { label: 'Total Participations', value: '128' },
        { label: 'Win Rate', value: '15%' },
        { label: 'Upcoming Deadlines', value: '3' },
    ]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/analytics/department');
                const data = await response.json();
                setReport(data.report);
            } catch (error) {
                setReport('Error loading analytics. Check backend connectivity.');
            }
        };
        fetchAnalytics();
    }, []);

    return (
        <div className="py-12 bg-black min-h-screen">
            <div className="container mx-auto px-6">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">Faculty Overview</h1>
                    <p className="font-mono text-xs text-gray-500 uppercase tracking-[0.4em]">Tracking Class Innovation & Performance</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {metrics.map((metric, i) => (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md"
                        >
                            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-4">{metric.label}</p>
                            <h2 className="text-4xl font-serif text-white">{metric.value}</h2>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <h3 className="font-mono text-xs text-white uppercase tracking-widest mb-6">AI Innovation Report</h3>
                        <div className="prose prose-invert max-w-none text-gray-400 font-mono text-xs leading-relaxed space-y-4">
                            {report.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                        <h3 className="font-mono text-xs text-white uppercase tracking-widest mb-6">Top Performers</h3>
                        <ul className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <li key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-mono text-[10px] text-white"># {i + 1}</div>
                                        <span className="text-white font-serif">Student Hero {i + 1}</span>
                                    </div>
                                    <span className="font-mono text-[10px] text-gray-500">4 Wins</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
