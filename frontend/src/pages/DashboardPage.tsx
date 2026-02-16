import React, { lazy, Suspense } from 'react';
import { useStore } from '../store/store';
import { GeminiChat } from '../components/GeminiChat';

const InnovationDashboard = lazy(() => import('../components/InnovationDashboard').then(m => ({ default: m.InnovationDashboard })));
const RoadmapView = lazy(() => import('../components/RoadmapView').then(m => ({ default: m.RoadmapView })));
const FacultyDashboard = lazy(() => import('../components/FacultyDashboard').then(m => ({ default: m.FacultyDashboard })));
const HODDashboard = lazy(() => import('../components/HODDashboard').then(m => ({ default: m.HODDashboard })));
const ProgressTracker = lazy(() => import('../components/ProgressTracker').then(m => ({ default: m.ProgressTracker })));

export const DashboardPage: React.FC = () => {
    const { userRole } = useStore();

    return (
        <div className="pt-32 pb-24 bg-black min-h-screen">
            <Suspense fallback={<div className="h-screen bg-black flex items-center justify-center font-mono text-[10px] text-white/20">Syncing Personas...</div>}>
                {userRole === 'student' ? (
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-24">
                            <div>
                                <h2 className="font-serif text-4xl mb-12 text-white">Project Roadmap</h2>
                                <RoadmapView />
                            </div>
                            <div>
                                <h2 className="font-serif text-4xl mb-12 text-white">Operation Status</h2>
                                <ProgressTracker />
                            </div>
                        </div>
                        <InnovationDashboard />
                    </div>
                ) : userRole === 'faculty' ? (
                    <FacultyDashboard />
                ) : (
                    <HODDashboard />
                )}
            </Suspense>
            <GeminiChat />
        </div>
    );
};
