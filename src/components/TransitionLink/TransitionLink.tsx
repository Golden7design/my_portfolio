"use client";

import Link from "next/link";
import { usePageTransition } from "@/src/hooks/usePageTransition";
import { ReactNode, MouseEvent } from "react";
import { useLenis } from "lenis/react";

interface TransitionLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  smoothScroll?: boolean;
  scrollDuration?: number;
  scrollOffset?: number;
}

export function TransitionLink({ 
  href, 
  children, 
  className,
  smoothScroll = true,
  scrollDuration = 1.2,
  scrollOffset = 80
}: TransitionLinkProps) {
  const { navigateWithTransition } = usePageTransition();
  const lenis = useLenis();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey) {
      return;
    }

    if (href.startsWith("http")) {
      return;
    }

    e.preventDefault();

    if (href.startsWith("#")) {
      const targetId = href.substring(1);
      
      const waitForElement = (id: string, maxWait = 2000): Promise<HTMLElement | null> => {
        return new Promise((resolve) => {
          const element = document.getElementById(id);
          if (element) {
            resolve(element);
            return;
          }

          const startTime = Date.now();
          const checkExistence = () => {
            const el = document.getElementById(id);
            if (el) {
              resolve(el);
            } else if (Date.now() - startTime < maxWait) {
              requestAnimationFrame(checkExistence);
            } else {
              resolve(null);
            }
          };
          checkExistence();
        });
      };

      waitForElement(targetId).then((targetElement) => {
        if (targetElement && lenis && smoothScroll) {
          lenis.scrollTo(targetElement, {
            duration: scrollDuration,
            offset: -scrollOffset,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });

          // ✅ LIGNE CLÉ : résout le scroll bloqué dans la section Services
          setTimeout(() => {
            if (typeof window !== "undefined" && (window as any).ScrollTrigger?.refresh) {
              (window as any).ScrollTrigger.refresh();
            }
          }, 300);
        } else if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          
          // ✅ Même refresh pour le fallback natif
          setTimeout(() => {
            if (typeof window !== "undefined" && (window as any).ScrollTrigger?.refresh) {
              (window as any).ScrollTrigger.refresh();
            }
          }, 300);
        }
      });

      return;
    }

    navigateWithTransition(href);
  };

  if (href.startsWith("#") || href.startsWith("http")) {
    return (
      <a href={href} onClick={handleClick} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}