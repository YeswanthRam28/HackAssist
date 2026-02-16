import { create } from 'zustand';

interface ChatMessage {
    role: 'user' | 'ai';
    text: string;
}

interface AppState {
    chatHistory: ChatMessage[];
    addMessage: (msg: ChatMessage) => void;
    user: { name: string; skills: string[] } | null;
    userRole: 'student' | 'faculty' | 'hod';
    setUser: (user: { name: string; skills: string[] }) => void;
    setRole: (role: 'student' | 'faculty' | 'hod') => void;
}

export const useStore = create<AppState>((set) => ({
    chatHistory: [{ role: 'ai', text: 'Neural Node v2.5 online. Awaiting query...' }],
    addMessage: (msg) => set((state) => ({ chatHistory: [...state.chatHistory, msg] })),
    user: { name: "Yeswanth Ram", skills: ["Python", "React", "AI"] },
    userRole: 'student',
    setUser: (user) => set({ user }),
    setRole: (role) => set({ userRole: role }),
}));
