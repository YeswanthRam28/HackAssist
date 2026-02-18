import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/store';
import { API_BASE_URL } from '../api';

const RoadmapView = lazy(() => import('../components/RoadmapView').then(m => ({ default: m.RoadmapView })));

export const RegistrationPage: React.FC = () => {
    const { hackathonId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useStore();

    const [hackathon, setHackathon] = useState<any>(null);
    const [mode, setMode] = useState<'selection' | 'create' | 'join' | 'success'>('selection');
    const [teamName, setTeamName] = useState('');
    const [teamCode, setTeamCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [teamId, setTeamId] = useState<number | null>(null);
    const [members, setMembers] = useState<any[]>([]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('mode') === 'join') {
            setMode('join');
        }

        if (!hackathonId || hackathonId === 'undefined') {
            const timer = setTimeout(() => {
                navigate('/app');
            }, 3000);
            return () => clearTimeout(timer);
        }

        const fetchHack = async () => {
            const res = await fetch(`${API_BASE_URL}/api/hackathon/${hackathonId}`);
            if (!res.ok) return;
            const data = await res.json();
            setHackathon(data);
        };

        const checkMembership = async () => {
            if (!user?.student_id) return;
            const res = await fetch(`${API_BASE_URL}/api/team/check/${user.student_id}/${hackathonId}`);
            const data = await res.json();
            if (data.status === 'exists') {
                setTeamId(data.team_id);
                setGeneratedCode(data.team_code);
                setMode('success');
                fetchMembers(data.team_id);
            }
        };

        fetchHack();
        checkMembership();
    }, [hackathonId, location.search, user?.student_id]);

    const handleCreateTeam = async () => {
        if (!teamName) return;
        const res = await fetch(`${API_BASE_URL}/api/team/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                hackathon_id: parseInt(hackathonId!),
                student_id: user?.student_id,
                team_name: teamName
            })
        });
        const data = await res.json();
        if (data.status === 'success') {
            setGeneratedCode(data.team_code);
            setTeamId(data.team_id);
            setMode('success');
            fetchMembers(data.team_id);
        }
    };

    const handleJoinTeam = async () => {
        if (!teamCode) return;
        const res = await fetch(`${API_BASE_URL}/api/team/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                student_id: user?.student_id,
                team_code: teamCode
            })
        });
        const data = await res.json();
        if (data.status === 'success') {
            alert(`Successfully joined ${data.team_name}!`);
            navigate('/app');
        } else {
            alert(data.message);
        }
    };

    const fetchMembers = async (tid: number) => {
        const res = await fetch(`${API_BASE_URL}/api/team/members/${tid}`);
        const data = await res.json();
        setMembers(data);
    };

    if (!hackathon) {
        return (
            <div className="h-screen bg-black flex flex-col items-center justify-center gap-4">
                <div className="font-mono text-[10px] text-white/20 uppercase tracking-[0.5em]">Calibrating Sector...</div>
                {(!hackathonId || hackathonId === 'undefined') && (
                    <div className="font-mono text-[8px] text-blue-400/40 uppercase tracking-widest animate-pulse">
                        Mission ID Invalid. Redirecting to Command Center...
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-32 pb-24 px-12 sm:px-24">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <header className="mb-24">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-[1px] bg-white/10" />
                        <span className="font-mono text-[9px] text-white/30 uppercase tracking-[0.4em]">Mission Protocol</span>
                    </div>
                    <h1 className="font-serif text-6xl text-white tracking-tighter mb-4">{hackathon?.name}</h1>
                    <p className="font-mono text-[10px] text-blue-400/60 uppercase tracking-[0.2em]">
                        {hackathon?.description ? `${hackathon.description.slice(0, 100)}...` : 'Neural data stream active...'}
                    </p>
                </header>

                <AnimatePresence mode="wait">
                    {mode === 'selection' && (
                        <motion.div
                            key="selection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            <button
                                onClick={() => setMode('create')}
                                className="group p-12 glass border border-white/5 hover:border-white/20 transition-all text-left"
                            >
                                <h3 className="font-mono text-white text-xs uppercase tracking-[0.4em] mb-4 group-hover:pl-2 transition-all">Create Squad</h3>
                                <p className="font-mono text-[9px] text-white/20 uppercase leading-relaxed">Forge a new initiative and generate a unique neural access code.</p>
                            </button>
                            <button
                                onClick={() => setMode('join')}
                                className="group p-12 glass border border-white/5 hover:border-white/20 transition-all text-left"
                            >
                                <h3 className="font-mono text-white text-xs uppercase tracking-[0.4em] mb-4 group-hover:pl-2 transition-all">Sync with Team</h3>
                                <p className="font-mono text-[9px] text-white/20 uppercase leading-relaxed">Enter a squad access code to link your persona with an existing unit.</p>
                            </button>
                        </motion.div>
                    )}

                    {mode === 'create' && (
                        <motion.div
                            key="create"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-md space-y-12"
                        >
                            <div className="space-y-4">
                                <label className="font-mono text-[9px] text-white/20 uppercase tracking-[0.4em]">Squad Designation</label>
                                <input
                                    type="text"
                                    className="w-full bg-white/5 border-b border-white/10 p-4 text-white font-mono text-xs focus:border-white focus:outline-none transition-all"
                                    placeholder="Enter Team Name..."
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleCreateTeam}
                                    className="flex-1 py-4 bg-white text-black font-mono text-[10px] uppercase tracking-[0.4em] hover:bg-gray-200 transition-colors"
                                >
                                    Index Squad →
                                </button>
                                <button onClick={() => setMode('selection')} className="px-8 font-mono text-[9px] text-white/20 uppercase tracking-widest hover:text-white transition-colors">Abort</button>
                            </div>
                        </motion.div>
                    )}

                    {mode === 'join' && (
                        <motion.div
                            key="join"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-md space-y-12"
                        >
                            <div className="space-y-4">
                                <label className="font-mono text-[9px] text-white/20 uppercase tracking-[0.4em]">Neural Access Code</label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    className="w-full bg-white/5 border-b border-white/10 p-4 text-white font-mono text-2xl tracking-[1em] text-center focus:border-white focus:outline-none transition-all uppercase"
                                    placeholder="XXXXXX"
                                    value={teamCode}
                                    onChange={(e) => setTeamCode(e.target.value.toUpperCase())}
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleJoinTeam}
                                    className="flex-1 py-4 bg-white text-black font-mono text-[10px] uppercase tracking-[0.4em] hover:bg-gray-200 transition-colors"
                                >
                                    Establish Link →
                                </button>
                                <button onClick={() => setMode('selection')} className="px-8 font-mono text-[9px] text-white/20 uppercase tracking-widest hover:text-white transition-colors">Abort</button>
                            </div>
                        </motion.div>
                    )}

                    {mode === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-16"
                        >
                            <div className="p-12 glass border border-blue-500/30 text-center">
                                <p className="font-mono text-[10px] text-blue-400 uppercase tracking-[0.6em] mb-8">Access Code Generated</p>
                                <h2 className="font-mono text-6xl text-white tracking-[0.5em] mb-4 pl-4">{generatedCode}</h2>
                                <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest">Share this sequence with your collaborators to sync units.</p>
                            </div>

                            <div className="space-y-8">
                                <h3 className="font-mono text-[10px] text-white/30 uppercase tracking-[0.4em]">Unit Manifest</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {members.map((member) => (
                                        <div key={member.student_id} className="p-4 border border-white/5 bg-white/[0.02] flex items-center gap-4">
                                            <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                                            <span className="font-mono text-[10px] text-white/60 uppercase">{member.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/app')}
                                className="w-full py-4 bg-white/5 border border-white/10 text-white font-mono text-[10px] uppercase tracking-[0.4em] hover:bg-white/10 transition-colors"
                            >
                                Return to Command Center
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Relocated Roadmap */}
                <div className="mt-32">
                    <h2 className="font-serif text-3xl mb-12 text-white/80">Project Roadmap</h2>
                    <Suspense fallback={<div className="font-mono text-[10px] text-white/20 uppercase">Mapping Neural Paths...</div>}>
                        <RoadmapView hackathonId={hackathonId} studentId={user?.student_id} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};
