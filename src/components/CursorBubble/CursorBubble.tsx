// components/CursorBubble.tsx
'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CursorBubble() {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!bubbleRef.current) return;

      const x = e.clientX;
      const y = e.clientY;

      // Animation GSAP avec effet élastique
      gsap.to(bubbleRef.current, {
        x: x,
        y: y,
        duration: 0.6,
        ease: "back.out(1, 5)", // Effet élastique
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={bubbleRef} 
      className="cursor-bubble"
      style={{
        position: 'fixed',
        width: '15px',
        height: '15px',
        borderRadius: '50%',
        pointerEvents: 'none',
        backgroundColor: 'white',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        mixBlendMode: 'difference',
        left: 0,
        top: 0,
      }}
    />
  );
}

// Styles pour mobile
const styles = `
  @media (max-width: 1000px) {
    .cursor-bubble {
      display: none !important;
    }
  }
`;

// Injecter les styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}