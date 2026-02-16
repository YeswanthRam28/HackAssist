
import React, { useState, useEffect } from 'react';

interface DecodingTextProps {
  text: string;
  className?: string;
  trigger?: boolean;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

export const DecodingText: React.FC<DecodingTextProps> = ({ text, className, trigger = true }) => {
  const [displayText, setDisplayText] = useState(text);
  
  useEffect(() => {
    if (!trigger) return;
    
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => 
        text.split("").map((char, index) => {
          if (index < iterations) return text[index];
          if (char === " " || char === "\n") return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );
      
      if (iterations >= text.length) clearInterval(interval);
      iterations += 1/3;
    }, 30);
    
    return () => clearInterval(interval);
  }, [text, trigger]);

  return <span className={className}>{displayText}</span>;
};
