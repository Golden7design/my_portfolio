'use client';

import { useEffect, useRef, useState } from 'react';

export default function InfiniteScrollName() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const [currentSpeed, setCurrentSpeed] = useState(150);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight;
      
      const scrollPercent = Math.min(scrollPosition / heroHeight, 1);
      
      const newSpeed = 20 - (scrollPercent * 15);
      const speed = Math.max(newSpeed, 5);
      
      setCurrentSpeed(speed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="marquee-container">
      <div 
        ref={marqueeRef}
        className="marquee"
        style={{ animationDuration: `${currentSpeed}s` }}
      >
        {[...Array(6)].map((_, i) => (
          <span key={i} className="marquee-text">
            NASSIR GOUOMBA
          </span>
        ))}
      </div>

      <style jsx>{`
        .marquee-container {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          position: absolute;
          bottom: 0%;
          left: 0;
          transform: translateY(-50%);
        }

        .marquee {
          display: inline-block;
          animation: scroll-left 20s linear infinite;
          will-change: transform;
        }

        .marquee-text {
          display: inline-block;
          font-size: 180px;
          font-weight: 900;
          color: #fff;
          padding: 0 40px;
          letter-spacing: -10px;
          text-transform: uppercase;
          font-family: 'Arial Black', sans-serif;
          transform: scaleY(1.8)
        }

        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @media (max-width: 768px) {
          .marquee-text {
            font-size: 80px;
            padding: 0 20px;
          }
        }
      `}</style>
    </div>
  );
}