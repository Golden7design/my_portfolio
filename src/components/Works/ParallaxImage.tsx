"use client";

import React, { useRef, useEffect, useState } from 'react';

const lerp = (start: number, end: number, factor: number): number =>
  start + (end - start) * factor;

interface ParallaxImageProps {
  src: string;
  alt: string;
  speed?: number;
}

const ParallaxImage: React.FC<ParallaxImageProps> = ({ src, alt, speed = 0.5 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const currentTranslateY = useRef(0);
  const targetTranslateY = useRef(0);
  const rafId = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 1000 : false);

  useEffect(() => {
    // Détection mobile
    const checkMobile = () => window.innerWidth < 1000;

    const handleResize = () => {
      setIsMobile(checkMobile());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Si mobile, pas d'animation parallax
    if (isMobile) {
      if (imageRef.current) {
        imageRef.current.style.transform = 'translate3d(0, 0, 0) scale(1)';
      }
      return;
    }

    let isAnimating = true;

    const animate = () => {
      if (!isAnimating) return;

      currentTranslateY.current = lerp(
        currentTranslateY.current,
        targetTranslateY.current,
        0.08
      );

      if (imageRef.current) {
        imageRef.current.style.transform = `translate3d(0, ${currentTranslateY.current}px, 0) scale(1.3)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Si l'élément n'est pas visible, on ne calcule pas
      if (rect.bottom < 0 || rect.top > windowHeight) return;

      // Position de l'élément par rapport au centre du viewport
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const distanceFromCenter = viewportCenter - elementCenter;

      // Appliquer le parallax
      targetTranslateY.current = distanceFromCenter * speed;
    };

    // Initialiser
    handleScroll();
    animate();

    // Écouter le scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      isAnimating = false;
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [speed, isMobile]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        display: 'block',
      }}
    >
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          willChange: isMobile ? 'auto' : 'transform',
          transform: isMobile ? 'translate3d(0, 0, 0) scale(1)' : 'translate3d(0, 0, 0) scale(1.3)',
          display: 'block',
          verticalAlign: 'top',
        }}
      />
    </div>
  );
};

export default ParallaxImage;