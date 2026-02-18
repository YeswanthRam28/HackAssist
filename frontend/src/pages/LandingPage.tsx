import React, { lazy } from 'react';
import { Hero } from '../components/Hero';

const JourneySection = lazy(() => import('../components/JourneySection').then(m => ({ default: m.JourneySection })));
const TechStackParallax = lazy(() => import('../components/TechStackParallax').then(m => ({ default: m.TechStackParallax })));
const InnovationDashboard = lazy(() => import('../components/InnovationDashboard').then(m => ({ default: m.InnovationDashboard })));

export const LandingPage: React.FC = () => {
    return (
        <>
            <Hero />
            <section id="journey">
                <JourneySection />
            </section>
            <section id="stack">
                <TechStackParallax />
            </section>
            <section id="innovation" className="py-24 bg-black">
                <InnovationDashboard />
            </section>
        </>
    );
};
