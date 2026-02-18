
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/store';

export const GeminiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { chatHistory, addMessage, user } = useStore();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  const [lastIntent, setLastIntent] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSend = async (manualText?: string) => {
    const textToSend = manualText || inputValue;
    if (!textToSend.trim() || isTyping) return;

    const userMsg = textToSend;
    addMessage({ role: 'user', text: userMsg });
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          user_id: user?.student_id?.toString() || "anonymous"
        }),
      });

      const data = await response.json();
      addMessage({ role: 'ai', text: data.response });
      setLastIntent(data.intent);
    } catch (error) {
      console.error("API Error:", error);
      addMessage({ role: 'ai', text: "Connection failure to Neural Core." });
    } finally {
      setIsTyping(false);
    }
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      await fetch('http://localhost:8000/api/register_hackathon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: "1",
          user_id: user?.student_id?.toString() || "1"
        }), // Mocking hackathon_id 1
      });
      addMessage({ role: 'ai', text: "✓ Successfully registered for the AI Innovation Challenge. Tracking initialized." });
      setLastIntent('');
    } catch (error) {
      addMessage({ role: 'ai', text: "Registration failed. Try again later." });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-80 md:w-96 bg-black/80 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl flex flex-col h-[500px] border border-white/10"
          >
            <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-white opacity-40 rounded-full animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/40">Neural Node v2.5</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} space-y-2`}>
                  <div className={`max-w-[85%] p-4 rounded-lg text-xs leading-relaxed ${msg.role === 'user' ? 'bg-white/10 text-white border border-white/10' : 'bg-white/[0.02] text-gray-400 border border-white/5'}`}>
                    {msg.text}
                  </div>
                  {msg.role === 'ai' && i === chatHistory.length - 1 && lastIntent.includes('RECOMMENDATION') && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={handleRegister}
                      disabled={isRegistering}
                      className="ml-2 px-4 py-2 bg-white text-black text-[10px] font-mono uppercase tracking-widest rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {isRegistering ? 'Processing...' : 'Register for AI Innovation Challenge'}
                    </motion.button>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-3 rounded-lg flex gap-1.5">
                    <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            <div className="px-4 py-2 border-t border-white/5 bg-black/50 flex flex-wrap gap-2">
              {[
                "Suggest healthcare AI ideas",
                "Recommend hackathons for me",
                "Help me form a team"
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setInputValue(chip);
                    // Trigger send immediately for better UX
                    const syntheticEvent = { key: 'Enter', preventDefault: () => { } } as any;
                    setTimeout(() => handleSend(chip), 0);
                  }}
                  className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] text-white/40 hover:text-white hover:border-white/20 transition-all font-mono"
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="p-4 border-t border-white/5 flex gap-2 bg-black">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Query system..."
                className="flex-1 bg-white/5 border border-white/5 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-white/20 text-white placeholder:text-gray-700 font-mono"
              />
              <button
                onClick={() => handleSend()}
                disabled={isTyping}
                className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-lg transition-colors disabled:opacity-20 flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-white p-[1px] shadow-2xl"
      >
        <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </div>
      </motion.button>
    </div>
  );
};
