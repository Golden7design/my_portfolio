// components/CursorBubble.tsx
'use client';

import { useEffect, useRef } from 'react';
import './CursorBubble.css';

export default function CursorBubble() {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!bubbleRef.current) return;

      // Position du curseur
      const x = e.clientX;
      const y = e.clientY;

      // Appliquer la position à la bulle
      bubbleRef.current.style.left = `${x}px`;
      bubbleRef.current.style.top = `${y}px`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <div ref={bubbleRef} className="cursor-bubble" />;
}