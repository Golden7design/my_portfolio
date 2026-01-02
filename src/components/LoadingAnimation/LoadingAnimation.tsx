"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type LoadingAnimationProps = {
  onComplete: () => void;
};

export default function LoadingAnimation({ onComplete }: LoadingAnimationProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const loaderTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "auto";
          onComplete(); // 🔥 signal envoyé au Hero
        },
      });

      // Texte "Loading"
      tl.to(loaderTextRef.current, {
        opacity: 0,
        y: -20,
        duration: 1,
        ease: "expo.inOut",
        delay: 1.4,
      });

      // Rideau
      tl.to(
        ".loading-block",
        {
          width: 0,
          duration: 0.9,
          ease: "power2.in",
          stagger: 0.045,
        },
        "-=0.4"
      );

      // Fade out overlay
      tl.to(overlayRef.current, {
        opacity: 0,
        duration: 0.35,
        onComplete: () => {
          overlayRef.current!.style.display = "none";
        },
      });
    });

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 555,
        overflow: "hidden",
        background: "#f8f8f8",
      }}
    >
      {/* Loading text */}
      <div
        ref={loaderTextRef}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "var(--font-clash-display)",
          fontSize: "clamp(1.5rem, 3vw, 3rem)",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "#141414",
          zIndex: 2,
        }}
      >
        Loading
      </div>

      {/* Rideau */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="loading-block"
          style={{
            position: "absolute",
            top: 0,
            left: `${i * 5}%`,
            width: "5%",
            height: "100%",
            backgroundColor: "#d7fb61",
            willChange: "width",
          }}
        />
      ))}
    </div>
  );
}

