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

    // ✅ Gestion des ancres (même page)
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
          // ✅ Force le refresh de ScrollTrigger AVANT le scroll
          if (typeof window !== "undefined" && (window as any).ScrollTrigger?.refresh) {
            (window as any).ScrollTrigger.refresh();
          }

          lenis.scrollTo(targetElement, {
            duration: scrollDuration,
            offset: -scrollOffset,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });

          // ✅ Double refresh après le scroll
          setTimeout(() => {
            if (typeof window !== "undefined" && (window as any).ScrollTrigger?.refresh) {
              (window as any).ScrollTrigger.refresh();
            }
          }, scrollDuration * 1000 + 100);
        } else if (targetElement) {
          // Fallback scroll natif
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          
          setTimeout(() => {
            if (typeof window !== "undefined" && (window as any).ScrollTrigger?.refresh) {
              (window as any).ScrollTrigger.refresh();
            }
          }, 300);
        }
      });

      return;
    }

    // ✅ Gestion des ancres cross-page (ex: /works#section)
    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      
      // Si on est déjà sur la bonne page, juste scroller
      if (window.location.pathname === path) {
        const targetElement = document.getElementById(hash);
        if (targetElement && lenis && smoothScroll) {
          // ✅ Refresh avant scroll
          if (typeof window !== "undefined" && (window as any).ScrollTrigger?.refresh) {
            (window as any).ScrollTrigger.refresh();
          }

          lenis.scrollTo(targetElement, {
            duration: scrollDuration,
            offset: -scrollOffset,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });

          // ✅ Refresh après scroll
          setTimeout(() => {
            if (typeof window !== "undefined" && (window as any).ScrollTrigger?.refresh) {
              (window as any).ScrollTrigger.refresh();
            }
          }, scrollDuration * 1000 + 100);
        }
        return;
      }

      // Sinon, naviguer puis scroller
      navigateWithTransition(path, () => {
        // ✅ Callback après navigation
        setTimeout(() => {
          const targetElement = document.getElementById(hash);
          if (targetElement && lenis && smoothScroll) {
            // ✅ Triple refresh pour être sûr
            if (typeof window !== "undefined" && (window as any).ScrollTrigger?.refresh) {
              (window as any).ScrollTrigger.refresh();
            }

            lenis.scrollTo(targetElement, {
              duration: scrollDuration,
              offset: -scrollOffset,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });

            setTimeout(() => {
              if (typeof window !== "undefined" && (window as any).ScrollTrigger?.refresh) {
                (window as any).ScrollTrigger.refresh();
              }
            }, scrollDuration * 1000 + 100);
          } else if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 500); // Attendre que la page soit chargée
      });

      return;
    }

    // ✅ Navigation normale
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