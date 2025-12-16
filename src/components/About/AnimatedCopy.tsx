"use client";

import React, { useRef, ReactElement, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText);

interface AnimatedCopyProps {
  children: ReactElement | ReactNode;
  colorInitial?: string;
  colorAccent?: string;
  colorFinal?: string;
}

interface SplitRef {
  wordSplit: SplitText;
  charSplit: SplitText;
}

export default function AnimatedCopy({ 
  children,
  colorInitial = "#dddddd",
  colorAccent = "#f0a1a1",
  colorFinal = "#000000" 
}: AnimatedCopyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitRefs = useRef<SplitRef[]>([]);
  const lastScrollProgress = useRef<number>(0);
  const colorTransitionTimer = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const completedChars = useRef<Set<number>>(new Set());

  useGSAP(() => {
    if (!containerRef.current) return;

    splitRefs.current = [];
    lastScrollProgress.current = 0;
    colorTransitionTimer.current.clear();
    completedChars.current.clear();

    let elements: Element[] = [];
    if (containerRef.current.hasAttribute("data-copy-wrapper")) {
      elements = Array.from(containerRef.current.children);
    } else {
      elements = [containerRef.current];
    }

    elements.forEach((element) => {
      const wordSplit = SplitText.create(element, {
        type: "words",
        wordsClass: "word",
      });

      const charSplit = SplitText.create(wordSplit.words, {
        type: "chars",
        charsClass: "char"
      });

      splitRefs.current.push({ wordSplit, charSplit });
    });

    const allChars = splitRefs.current.flatMap(
      ({ charSplit }) => charSplit.chars
    );

    gsap.set(allChars, { color: colorInitial });

    const scheduleFinalTransition = (char: Element, index: number) => {
      if (colorTransitionTimer.current.has(index)) {
        clearTimeout(colorTransitionTimer.current.get(index));
      }

      const timer = setTimeout(() => {
        if (!completedChars.current.has(index)) {
          gsap.to(char, {
            duration: 0.1,
            ease: "none",
            color: colorFinal,
            onComplete: () => {
              completedChars.current.add(index);
            }
          });
        }
        colorTransitionTimer.current.delete(index);
      }, 100);

      colorTransitionTimer.current.set(index, timer);
    };

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 90%",
      end: "top 30%",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const totalChars = allChars.length;
        const isScrollingDown = progress >= lastScrollProgress.current;
        const currentCharIndex = Math.floor(progress * totalChars);

        allChars.forEach((char, index) => {
          if (!isScrollingDown && index >= currentCharIndex) {
            if (colorTransitionTimer.current.has(index)) {
              clearTimeout(colorTransitionTimer.current.get(index));
              colorTransitionTimer.current.delete(index);
            }

            completedChars.current.delete(index);
            gsap.set(char, { color: colorInitial });
            return;
          }

          if (completedChars.current.has(index)) {
            return;
          }

          if (index <= currentCharIndex) {
            gsap.set(char, { color: colorAccent });

            if (!colorTransitionTimer.current.has(index)) {
              scheduleFinalTransition(char, index);
            }
          } else {
            gsap.set(char, { color: colorInitial });
          }
        });

        lastScrollProgress.current = progress;
      },
    });

    return () => {
      colorTransitionTimer.current.forEach((timer) => clearTimeout(timer));
      colorTransitionTimer.current.clear();
      completedChars.current.clear();

      splitRefs.current.forEach(({ wordSplit, charSplit }) => {
        if (charSplit) charSplit.revert();
        if (wordSplit) wordSplit.revert();
      });
    };
  }, {
    scope: containerRef,
    dependencies: [colorInitial, colorAccent, colorFinal],
  });

  // Toujours wrapper dans un div pour éviter les problèmes de ref
  return (
    <div ref={containerRef} data-copy-wrapper={React.Children.count(children) > 1 ? "true" : undefined}>
      {children}
    </div>
  );
}