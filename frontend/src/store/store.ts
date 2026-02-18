import { create } from 'zustand';

interface ChatMessage {
    role: 'user' | 'ai';
    text: string;
}

interface User {
    student_id: number;
    name: string;
    email: string;
    skills: string[];
    interests: string[];
    experience_level?: string;
    isOnboarded?: boolean;
}

interface AppState {
    chatHistory: ChatMessage[];
    addMessage: (msg: ChatMessage) => void;
    user: User | null;
    userRole: 'student' | 'faculty' | 'hod';
    setUser: (user: User | null) => void;
    setRole: (role: 'student' | 'faculty' | 'hod') => void;
}

const savedUser = localStorage.getItem('hackassist_user');

export const useStore = create<AppState>((set) => ({
    chatHistory: [{ role: 'ai', text: 'Neural Node v2.5 online. Awaiting profile synchronization...' }],
    addMessage: (msg) => set((state) => ({ chatHistory: [...state.chatHistory, msg] })),
    user: savedUser ? JSON.parse(savedUser) : null,
    userRole: 'student',
    setUser: (user) => {
        if (user) localStorage.setItem('hackassist_user', JSON.stringify(user));
        else localStorage.removeItem('hackassist_user');
        set({ user });
    },
    setRole: (role) => set({ userRole: role }),
}));
