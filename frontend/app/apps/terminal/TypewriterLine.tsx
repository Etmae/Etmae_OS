// frontend/components/terminal/TypewriterLine.tsx
import React, { useState, useEffect } from 'react';

interface TypewriterLineProps {
  text: string;
  onComplete: () => void;
  delay?: number;
}

export const TypewriterLine: React.FC<TypewriterLineProps> = ({ text, onComplete, delay = 10 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, index + 1));
      index++;
      if (index >= text.length) {
        clearInterval(interval);
        // Small delay after finishing text for visual pacing
        setTimeout(onComplete, 50);
      }
    }, delay);
    return () => clearInterval(interval);
  }, [text, delay, onComplete]);

  return <span>{displayedText}</span>;
};