import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const HODDashboard: React.FC = () => {
    const [report, setReport] = useState<string>('Crunching Numbers...');
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncLog, setSyncLog] = useState<string | null>(null);

    const handleSync = async () => {
        setIsSyncing(true);
        setSyncLog('Accessing External Nodes...');
        try {
            const response = await fetch('http://localhost:8000/api/sync', { method: 'POST' });
            const data = await response.json();
            setSyncLog(data.status === 'success' ? '✓ Synchronization Complete' : '⚠ Sync Node Failed');
            setTimeout(() => setSyncLog(null), 5000);
        } catch (error) {
            setSyncLog('⚠ Critical Link Failure');
        } finally {
            setIsSyncing(false);
        }
    };

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/analytics/department');
                const data = await response.json();
                setReport(data.report);
            } catch (error) {
                setReport('Dashboard analysis paused. Backend unreachable.');
            }
        };
        fetchAnalytics();
    }, []);

    return (
        <div className="py-12 bg-black min-h-screen font-mono">
            <div className="container mx-auto px-6">
                <header className="mb-12 border-b border-white/5 pb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-serif text-white mb-4 italic">Departmental Intelligence</h1>
                        <p className="font-mono text-[10px] text-gray-500 uppercase tracking-[0.4em]">Head of Department • Innovation Strategy</p>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        {syncLog && (
                            <motion.span
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-[8px] uppercase tracking-widest text-white/40"
                            >
                                {syncLog}
                            </motion.span>
                        )}
                        <button
                            onClick={handleSync}
                            disabled={isSyncing}
                            className={`px-6 py-3 rounded-full border border-white/10 text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-white hover:text-black hover:border-white ${isSyncing ? 'animate-pulse opacity-50' : ''}`}
                        >
                            {isSyncing ? 'Syncing...' : 'Initialize Live Sync'}
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="font-mono text-[10px] text-white uppercase tracking-[0.5em] mb-8">System Analytics</h2>
                        <div className="space-y-12">
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between font-mono text-[10px] uppercase text-gray-500">
                                    <span>Innovation Index</span>
                                    <span>78/100</span>
                                </div>
                                <div className="w-full h-[1px] bg-white/10 relative">
                                    <div className="absolute inset-y-0 left-0 bg-white w-[78%]" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between font-mono text-[10px] uppercase text-gray-500">
                                    <span>Student Engagement</span>
                                    <span>62%</span>
                                </div>
                                <div className="w-full h-[1px] bg-white/10 relative">
                                    <div className="absolute inset-y-0 left-0 bg-white w-[62%]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-12 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-xl"
                    >
                        <h3 className="font-mono text-[10px] text-white uppercase tracking-[0.3em] mb-8">Strategic Summary</h3>
                        <div className="font-mono text-xs text-gray-400 leading-relaxed space-y-6">
                            {report.split('\n').map((line, i) => (
                                <p key={i}>{line}</p>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};
