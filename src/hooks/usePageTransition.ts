"use client";

import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useCallback } from "react";

export function usePageTransition() {
  const router = useRouter();

  const navigateWithTransition = useCallback(
    (href: string) => {
      const animateTransition = () => {
        return new Promise<void>((resolve) => {
          gsap.set(".block", { visibility: "visible", scaleY: 0 });
          
          // Anime row-1 vers le bas (origin: top)
          gsap.to(".row-1 .block", {
            scaleY: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power4.inOut",
          });
          
          // Anime row-2 vers le haut (origin: bottom)
          gsap.to(".row-2 .block", {
            scaleY: 1,
            duration: 1,
            stagger: 0.1,
            ease: "power4.inOut",
            onComplete: resolve,
          });
        });
      };

      animateTransition().then(() => {
        router.push(href);
      });
    },
    [router]
  );

  return { navigateWithTransition };
}