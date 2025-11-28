'use client';

import { useState, useEffect } from 'react';

const RotatingWords = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const phrases = [
    { prefix: "generate", keyword: "10x faster leads", suffix: "from Dubai buyers" },
    { prefix: "build", keyword: "high-converting landing pages", suffix: "for your properties" },
    { prefix: "create", keyword: "premium websites", suffix: "that attract investors" },
    { prefix: "develop", keyword: "AI-powered CRM", suffix: "to close more deals" },
    { prefix: "drive", keyword: "qualified buyer traffic", suffix: "to your listings" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % phrases.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [phrases.length]);

  const currentPhrase = phrases[currentIndex];

  return (
    <div className="inline">
      <span className="text-white">{currentPhrase.prefix} </span>
      <span 
        className={`inline-block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent font-bold transition-all duration-500 ${
          isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
        }`}
      >
        {currentPhrase.keyword}
      </span>
      <span className="text-white"> {currentPhrase.suffix}</span>
    </div>
  );
};

export default RotatingWords;