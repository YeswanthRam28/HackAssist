
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/store';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { API_BASE_URL } from '../api';

export const AuthPage: React.FC = () => {
    const navigate = useNavigate();
    const { setUser } = useStore();
    const [step, setStep] = useState(0); // 0: Login/Register, 1: Basics, 2: Experience, 3: Skills, 4: Interests
    const [isLogin, setIsLogin] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        student_id: 0,
        department: 'CSE',
        experience_level: 'Intermediate',
        skills: [] as string[],
        interests: [] as string[]
    });

    const handleAuthAction = async () => {
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const body = isLogin
            ? { email: formData.email, password: formData.password }
            : { name: formData.name, email: formData.email, password: formData.password };

        try {
            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();

            if (data.status === 'success') {
                setFormData(prev => ({ ...prev, student_id: data.student_id }));
                if (isLogin) {
                    if (data.onboarded) {
                        setUser({
                            student_id: data.student_id,
                            name: data.name,
                            email: formData.email,
                            skills: [], // Will be fetched via profile later or just redirect
                            interests: [],
                            isOnboarded: true
                        });
                        navigate('/app');
                    } else {
                        setStep(1); // Force onboarding
                    }
                } else {
                    setStep(1); // Proceed to onboarding basics
                }
            } else {
                alert(data.message || "Authentication failure.");
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleOnboardSubmit = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/student/onboard`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student_id: formData.student_id,
                    department: formData.department,
                    experience_level: formData.experience_level,
                    skills: formData.skills,
                    interests: formData.interests
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setUser({
                    student_id: formData.student_id,
                    name: formData.name,
                    email: formData.email,
                    skills: formData.skills,
                    interests: formData.interests,
                    experience_level: formData.experience_level,
                    isOnboarded: true
                });
                navigate('/dashboard');
            }
        } catch (e) {
            console.error(e);
        }
    };

    const steps = [
        // STEP 0: Auth
        <div className="space-y-8 w-full max-w-md">
            <h1 className="font-serif text-5xl text-white tracking-tighter mb-4">{isLogin ? 'Welcome Back' : 'Create Persona'}</h1>
            <p className="font-mono text-[10px] text-white/40 uppercase tracking-[0.3em] mb-12">Neural Core v2.5 Authentication</p>

            <div className="space-y-6">
                {!isLogin && (
                    <div className="space-y-2">
                        <label className="font-mono text-[9px] text-white/20 uppercase tracking-widest">Full Name</label>
                        <input
                            type="text"
                            className="w-full bg-white/5 border-b border-white/10 p-3 text-white focus:border-white focus:outline-none transition-colors"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                )}
                <div className="space-y-2">
                    <label className="font-mono text-[9px] text-white/20 uppercase tracking-widest">Neural ID (Email)</label>
                    <input
                        type="email"
                        className="w-full bg-white/5 border-b border-white/10 p-3 text-white focus:border-white focus:outline-none transition-colors"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="font-mono text-[9px] text-white/20 uppercase tracking-widest">Access Key (Password)</label>
                    <input
                        type="password"
                        className="w-full bg-white/5 border-b border-white/10 p-3 text-white focus:border-white focus:outline-none transition-colors"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>
            </div>

            <button
                onClick={handleAuthAction}
                className="w-full py-4 bg-white text-black font-mono text-[10px] uppercase tracking-[0.4em] hover:bg-gray-200 transition-colors mt-8"
            >
                Initialize Protocol →
            </button>

            <p className="text-center font-mono text-[9px] text-white/20 uppercase tracking-widest mt-8">
                {isLogin ? "No persona?" : "Already onboarded?"}
                <span className="text-white cursor-pointer ml-2 hover:underline" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Register Hub" : "Login Node"}
                </span>
            </p>
        </div>,

        // STEP 1: Department
        <div className="space-y-12 w-full max-w-md">
            <h1 className="font-serif text-5xl text-white tracking-tighter">Academic Sector</h1>
            <div className="grid grid-cols-2 gap-4">
                {['CSE', 'IT', 'ECE', 'AI/ML', 'MECH', 'CIVIL'].map(dept => (
                    <button
                        key={dept}
                        onClick={() => { setFormData({ ...formData, department: dept }); setStep(2); }}
                        className={`p-6 border ${formData.department === dept ? 'border-white bg-white/10' : 'border-white/5 bg-white/[0.02]'} hover:border-white/40 transition-all font-mono text-[10px] tracking-widest uppercase`}
                    >
                        {dept}
                    </button>
                ))}
            </div>
        </div>,

        // STEP 2: Experience
        <div className="space-y-12 w-full max-w-md">
            <h1 className="font-serif text-5xl text-white tracking-tighter">Experience Depth</h1>
            <div className="space-y-4">
                {[
                    { l: 'Beginner', d: 'Familiarizing with neural concepts.' },
                    { l: 'Intermediate', d: 'Ready for full-stack engagement.' },
                    { l: 'Expert', d: 'Architecting high-frequency systems.' }
                ].map(exp => (
                    <button
                        key={exp.l}
                        onClick={() => { setFormData({ ...formData, experience_level: exp.l }); setStep(3); }}
                        className={`w-full p-8 border ${formData.experience_level === exp.l ? 'border-white bg-white/10' : 'border-white/5 bg-white/[0.02]'} text-left group transition-all`}
                    >
                        <h3 className="text-white font-mono text-xs uppercase tracking-widest mb-2 group-hover:pl-2 transition-all">{exp.l}</h3>
                        <p className="text-white/30 text-[10px] font-mono uppercase leading-relaxed">{exp.d}</p>
                    </button>
                ))}
            </div>
        </div>,

        // STEP 3: Skills
        <div className="space-y-12 w-full max-w-md">
            <h1 className="font-serif text-5xl text-white tracking-tighter">Neural Skills</h1>
            <div className="flex flex-wrap gap-4">
                {['React', 'Python', 'Go', 'Typescript', 'Rust', 'PostgreSQL', 'ThreeJS', 'TensorFlow', 'LLMs', 'Solidity'].map(skill => (
                    <button
                        key={skill}
                        onClick={() => {
                            const newSkills = formData.skills.includes(skill)
                                ? formData.skills.filter(s => s !== skill)
                                : [...formData.skills, skill];
                            setFormData({ ...formData, skills: newSkills });
                        }}
                        className={`px-6 py-2 rounded-full border ${formData.skills.includes(skill) ? 'border-white bg-white text-black' : 'border-white/10 bg-white/5 text-white/40'} font-mono text-[9px] uppercase tracking-tighter transition-all`}
                    >
                        {skill}
                    </button>
                ))}
            </div>
            <button
                onClick={() => setStep(4)}
                disabled={formData.skills.length === 0}
                className="w-full py-4 bg-white/10 border border-white/20 text-white font-mono text-[10px] uppercase tracking-[0.4em] hover:bg-white/20 transition-all disabled:opacity-20"
            >
                Confirm Stack →
            </button>
        </div>,

        // STEP 4: Interests
        <div className="space-y-12 w-full max-w-md">
            <h1 className="font-serif text-5xl text-white tracking-tighter">Strategic Interests</h1>
            <div className="flex flex-wrap gap-4">
                {['FinTech', 'HealthTech', 'Web3', 'AI Safety', 'Green Tech', 'Social Impact', 'Security', 'Automation'].map(interest => (
                    <button
                        key={interest}
                        onClick={() => {
                            const newIns = formData.interests.includes(interest)
                                ? formData.interests.filter(i => i !== interest)
                                : [...formData.interests, interest];
                            setFormData({ ...formData, interests: newIns });
                        }}
                        className={`px-6 py-2 rounded-full border ${formData.interests.includes(interest) ? 'border-white bg-white text-black' : 'border-white/10 bg-white/5 text-white/40'} font-mono text-[9px] uppercase tracking-tighter transition-all`}
                    >
                        {interest}
                    </button>
                ))}
            </div>
            <button
                onClick={handleOnboardSubmit}
                disabled={formData.interests.length === 0}
                className="w-full py-4 bg-white text-black font-mono text-[10px] uppercase tracking-[0.4em] hover:bg-gray-200 transition-all"
            >
                Finalize Persona →
            </button>
        </div>
    ];

    return (
        <div className="h-screen w-full bg-black flex flex-col md:flex-row items-center overflow-hidden">
            {/* Visual Side */}
            <div className="hidden md:block w-1/2 h-full bg-white/[0.02] relative border-r border-white/5">
                <div className="absolute inset-0 pointer-events-none opacity-40">
                    <Canvas>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <Sphere visible args={[1, 100, 200]} scale={2.5}>
                            <MeshDistortMaterial
                                color="#ffffff"
                                attach="material"
                                distort={0.5}
                                speed={1.5}
                                roughness={0}
                                metalness={1}
                            />
                        </Sphere>
                        <OrbitControls enableZoom={false} />
                    </Canvas>
                </div>

                <div className="absolute bottom-24 left-24 space-y-4">
                    <div className="w-12 h-[1px] bg-white/20" />
                    <h2 className="font-serif text-3xl text-white tracking-tighter">Strategic Insight</h2>
                    <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.4em] leading-relaxed max-w-xs">
                        Personalizing the neural layer to optimize mission recommendations and innovation flow.
                    </p>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 h-full flex items-center justify-center p-12 relative">
                <div className="absolute top-12 left-12 md:left-24 flex items-center gap-4">
                    <div className="font-mono text-[10px] text-white/30 tracking-widest uppercase">System Protocol</div>
                    <div className="flex gap-1">
                        {[0, 1, 2, 3, 4].map(idx => (
                            <div key={idx} className={`w-8 h-1 transition-all duration-500 ${step === idx ? 'bg-white' : 'bg-white/5'}`} />
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
                        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                        className="w-full flex justify-center"
                    >
                        {steps[step]}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="absolute bottom-12 right-12 font-mono text-[8px] text-white/10 uppercase tracking-[0.5em] hidden md:block">
                HackAssist • AEC 2026 • Encrypted Channel
            </div>
        </div>
    );
};
