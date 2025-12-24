"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import "./PageTransition.css";

export default function PageTransition() {
  const pathname = usePathname();
  const isFirstLoad = useRef(true);

  useEffect(() => {
    // Skip animation on first load (page refresh)
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      // Cacher immédiatement les blocs sans animation
      gsap.set(".block", { visibility: "hidden", scaleY: 0 });
      return;
    }

    // Animation d'entrée lors du changement de page
    const revealTransition = () => {
      return new Promise<void>((resolve) => {
        gsap.set(".block", { visibility: "visible", scaleY: 1 });
        
        // Anime row-1 (origin: top) et row-2 (origin: bottom) simultanément
        gsap.to(".row-1 .block", {
          scaleY: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power4.inOut",
        });
        
        gsap.to(".row-2 .block", {
          scaleY: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power4.inOut",
          onComplete: () => {
            gsap.set(".block", { visibility: "hidden" });
            resolve();
          },
        });
      });
    };

    revealTransition();
  }, [pathname]);

  return (
    <div className="transition">
      <div className="transition-row row-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="block" />
        ))}
      </div>

      <div className="transition-row row-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="block" />
        ))}
      </div>
    </div>
  );
}