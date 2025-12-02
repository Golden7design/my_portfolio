"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./AnimatedWords.css";
import { getRandomWord } from "./wordsList";

interface AnimatedWordsProps {
  isMenuOpen: boolean;
}

export default function AnimatedWords({ isMenuOpen }: AnimatedWordsProps) {
  const [currentWord, setCurrentWord] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  
  // Pour l'inertie de la souris
  const mousePos = useRef({ x: 0, y: 0 });
  const wordPos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);

  // Changer le mot à chaque ouverture du menu
  useEffect(() => {
    if (isMenuOpen) {
      const newWord = getRandomWord(currentWord);
      setCurrentWord(newWord);
    }
  }, [isMenuOpen]);

  // Animation GSAP + Inertie souris
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1000) return;

    const container = containerRef.current;
    const word = wordRef.current;
    if (!container || !word) return;

    // Animation d'apparition/disparition
    if (isMenuOpen && currentWord) {
      gsap.to(container, {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
      });

      gsap.fromTo(
        word,
        {
          scale: 0.8,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: "expo.out",
        }
      );
    } else {
      gsap.to(container, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.in",
      });
    }

    // Gestion du mouvement de la souris avec inertie
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMenuOpen || !word) return;

      const rect = container!.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calcul du déplacement relatif (limité à ±50px)
      mousePos.current.x = ((e.clientX - centerX) / centerX) * 50;
      mousePos.current.y = ((e.clientY - centerY) / centerY) * 50;
    };

    // Animation en boucle pour l'inertie
    const animate = () => {
      if (!word || !isMenuOpen) return;

      // Lerp (interpolation linéaire) pour l'inertie
      const lerpFactor = 0.08;
      wordPos.current.x += (mousePos.current.x - wordPos.current.x) * lerpFactor;
      wordPos.current.y += (mousePos.current.y - wordPos.current.y) * lerpFactor;

      // Utilise transform pour ne pas écraser le translate(-50%, -50%) du CSS
      word.style.transform = `translate(calc(-50% + ${wordPos.current.x}px), calc(-50% + ${wordPos.current.y}px))`;

      animationFrameId.current = requestAnimationFrame(animate);
    };

    if (isMenuOpen) {
      window.addEventListener("mousemove", handleMouseMove);
      animate();
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
      // Reset position
      wordPos.current = { x: 0, y: 0 };
      mousePos.current = { x: 0, y: 0 };
    };
  }, [isMenuOpen, currentWord]);

  // Ne rien afficher sur mobile
  if (typeof window !== "undefined" && window.innerWidth < 1000) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`animated-words-container ${isMenuOpen ? "active" : ""}`}
    >
      <div 
        ref={wordRef}
        className="giant-word"
        data-word={currentWord}
      >
        {currentWord}
      </div>
    </div>
  );
}