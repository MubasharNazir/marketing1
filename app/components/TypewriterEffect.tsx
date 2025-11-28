'use client';

import { useState, useEffect } from 'react';

const TypewriterEffect = () => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(50);

  const phrases = [
    "generate 10x faster leads",
    "build high-converting landing pages", 
    "create premium property websites",
    "drive qualified buyer traffic",
    "develop AI-powered CRM systems"
  ];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 30 : 60);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1000); // Pause at full text
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
        setTypingSpeed(100); // Pause before starting next phrase
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, phrases]);

  return (
    <div className="text-2xl md:text-4xl lg:text-5xl font-bold">
  <span className="bg-gradient-to-r from-green-300 to-emerald-400 bg-clip-text text-transparent">
    {text}
  </span>
  <span className="ml-1 animate-pulse">|</span>
</div>

  );
};

export default TypewriterEffect;