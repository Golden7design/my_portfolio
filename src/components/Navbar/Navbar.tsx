"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import "./Navbar.css";
import { menuColumns } from "./navInfo";
import { menuLinks } from "./navLinks";
import { TimeDisplay } from "../Time/TimeDisplay";
import AnimatedWords from "./AnimatedWords/AnimatedWords";
import NavAreaClickSound from "../NavAreaClickSound";
import { TransitionLink } from "../TransitionLink/TransitionLink";

// Enregistre SplitText une fois côté client
if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

export default function Navbar() {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const menuOpenRef = useRef(false);
  const toggleMenuRef = useRef<(() => void) | null>(null);
  const cleanupFunctionsRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const navtoggle = document.querySelector<HTMLDivElement>(".nav-toggle");
    const menuOverlay = document.querySelector<HTMLDivElement>(".menu-overlay");
    const menuContent = document.querySelector<HTMLDivElement>(".menu-content");
    const menuImage = document.querySelector<HTMLDivElement>(".menu-img");
    const menuLinksWrapper = document.querySelector<HTMLDivElement>(".menu-links-wrapper");
    const linkHighlighter = document.querySelector<HTMLDivElement>(".link-highlighter");

    if (!menuOverlay || !menuContent || !menuImage || !menuLinksWrapper || !linkHighlighter) {
      return;
    }

    let currentX = 0;
    let targetX = 0;
    const lerpFactor = 0.05;

    let currentHighlighterX = 0;
    let targetHighlighterX = 0;
    let currentHighlighterwidth = 0;
    let targetHighlighterwidth = 0;

    let isMenuAnimating = false;
    let animationFrameId: number | null = null;

    const menuLinksEls = document.querySelectorAll<HTMLAnchorElement>(".menu-link a");
    menuLinksEls.forEach((link) => {
      const spans = link.querySelectorAll<HTMLSpanElement>("span");
      spans.forEach((char, charIndex) => {
        if (!char.classList.contains("split-initialized")) {
          const split = new SplitText(char, { type: "chars" });
          split.chars.forEach((charEl) => {
            charEl.classList.add("char");
          });
          char.classList.add("split-initialized");
          if (charIndex === 1) {
            gsap.set(split.chars, { y: "110%" });
          }
        }
      });
    });

    gsap.set(menuContent, { y: "50%", opacity: 0.25 });
    gsap.set(menuImage, { scale: 0.5, opacity: 0.25 });
    gsap.set(menuLinksEls, { y: "150%" });
    gsap.set(linkHighlighter, { y: "150%" });

    const defaultLinkText = document.querySelector<HTMLSpanElement>(".menu-link:first-child a span");
    if (defaultLinkText) {
      const linkWidth = defaultLinkText.offsetWidth;
      linkHighlighter.style.width = linkWidth + "px";
      currentHighlighterwidth = linkWidth;
      targetHighlighterwidth = linkWidth;

      const firstLink = document.querySelector<HTMLDivElement>(".menu-link:first-child");
      if (firstLink) {
        const linkRect = firstLink.getBoundingClientRect();
        const menuWrapperRect = menuLinksWrapper.getBoundingClientRect();
        const initialX = linkRect.left - menuWrapperRect.left;
        currentHighlighterX = initialX;
        targetHighlighterX = initialX;
      }
    }

    function toggleMenu() {
      if (isMenuAnimating) return;
      isMenuAnimating = true;

      const newOpenState = !menuOpenRef.current;
      menuOpenRef.current = newOpenState;
      setIsBurgerOpen(newOpenState);

      if (newOpenState) {
        gsap.to(menuOverlay, {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
          duration: 1.25,
          ease: "expo.out",
          onComplete: () => {
            gsap.set(".menu-link", { overflow: "visible" });
            isMenuAnimating = false;
          },
        });

        gsap.to(menuContent, { y: "0%", opacity: 1, duration: 1.5, ease: "expo.out" });
        gsap.to(menuImage, { scale: 1, opacity: 1, duration: 1.5, ease: "expo.out" });
        gsap.to(menuLinksEls, { y: "0%", duration: 1.25, stagger: 0.1, delay: 0.25, ease: "expo.out" });
        gsap.to(linkHighlighter, { y: "0%", duration: 0.5, delay: 1, ease: "expo.out" });
      } else {
        gsap.to(menuLinksEls, { y: "-200%", duration: 1.25, ease: "expo.out" });
        gsap.to(menuContent, { y: "-100%", duration: 1.25, ease: "expo.out" });
        gsap.to(menuImage, { y: "-100%", duration: 1.25, ease: "expo.out" });
        gsap.to(menuOverlay, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1.25,
          ease: "expo.out",
          onComplete: () => {
            gsap.set(menuOverlay, {
              clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
            });
            gsap.set(menuLinksEls, { y: "150%" });
            gsap.set(linkHighlighter, { y: "150%" });
            gsap.set(menuContent, { y: "50%", opacity: 0.25 });
            gsap.set(menuImage, { y: "0%", scale: 0.5, opacity: 0.25 });
            gsap.set(".menu-link", { overflow: "hidden" });
            gsap.set(menuLinksWrapper, { x: 0 });
            currentX = 0;
            targetX = 0;
            isMenuAnimating = false;
          },
        });
      }
    }

    toggleMenuRef.current = toggleMenu;

    const handleNavToggleClick = () => toggleMenu();
    navtoggle?.addEventListener("click", handleNavToggleClick);
    cleanupFunctionsRef.current.push(() => {
      navtoggle?.removeEventListener("click", handleNavToggleClick);
    });

    menuLinksEls.forEach((linkEl) => {
      const handleLinkClick = (e: Event) => {
        if (menuOpenRef.current) {
          toggleMenu();
        }
      };
      linkEl.addEventListener("click", handleLinkClick);
      cleanupFunctionsRef.current.push(() => {
        linkEl.removeEventListener("click", handleLinkClick);
      });
    });

    const menuLinksContainer = document.querySelectorAll<HTMLDivElement>(".menu-link");
    menuLinksContainer.forEach((link) => {
      const handleMouseEnter = () => {
        if (window.innerWidth < 1000) return;
        const spans = link.querySelectorAll<HTMLSpanElement>("a span");
        const [visible, hidden] = spans;
        const vChars = visible.querySelectorAll<HTMLElement>(".char");
        const hChars = hidden.querySelectorAll<HTMLElement>(".char");
        gsap.to(vChars, { y: "-110%", stagger: 0.06, duration: 1, ease: "expo.inOut" });
        gsap.to(hChars, { y: "0%", stagger: 0.06, duration: 1, ease: "expo.inOut" });
      };

      const handleMouseLeave = () => {
        if (window.innerWidth < 1000) return;
        const spans = link.querySelectorAll<HTMLSpanElement>("a span");
        const [visible, hidden] = spans;
        const vChars = visible.querySelectorAll<HTMLElement>(".char");
        const hChars = hidden.querySelectorAll<HTMLElement>(".char");
        gsap.to(hChars, { y: "100%", stagger: 0.03, duration: 0.5, ease: "expo.inOut" });
        gsap.to(vChars, { y: "0%", stagger: 0.03, duration: 0.5, ease: "expo.inOut" });
      };

      link.addEventListener("mouseenter", handleMouseEnter);
      link.addEventListener("mouseleave", handleMouseLeave);

      cleanupFunctionsRef.current.push(() => {
        link.removeEventListener("mouseenter", handleMouseEnter);
        link.removeEventListener("mouseleave", handleMouseLeave);
      });
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1000) return;
      const mouseX = e.clientX;
      const vw = window.innerWidth;
      const wrapperWidth = menuLinksWrapper.offsetWidth;
      const maxRight = vw - wrapperWidth;
      const range = vw * 0.5;
      const startX = (vw - range) / 2;
      const endX = startX + range;
      let perc = mouseX < startX ? 0 : mouseX > endX ? 1 : (mouseX - startX) / range;
      targetX = perc * maxRight;
    };

    menuOverlay?.addEventListener("mousemove", handleMouseMove);
    cleanupFunctionsRef.current.push(() => {
      menuOverlay?.removeEventListener("mousemove", handleMouseMove);
    });

    menuLinksContainer.forEach((link) => {
      const handleLinkMouseEnter = () => {
        if (window.innerWidth < 1000) return;
        const rect = link.getBoundingClientRect();
        const wrapperRect = menuLinksWrapper.getBoundingClientRect();
        targetHighlighterX = rect.left - wrapperRect.left;
        const span = link.querySelector<HTMLSpanElement>("a span");
        targetHighlighterwidth = span ? span.offsetWidth : link.offsetWidth;
      };

      link.addEventListener("mouseenter", handleLinkMouseEnter);
      cleanupFunctionsRef.current.push(() => {
        link.removeEventListener("mouseenter", handleLinkMouseEnter);
      });
    });

    const handleMenuWrapperLeave = () => {
      const firstLink = document.querySelector<HTMLDivElement>(".menu-link:first-child");
      const span = firstLink?.querySelector<HTMLSpanElement>("a span");
      if (!firstLink || !span) return;
      const linkRect = firstLink.getBoundingClientRect();
      const wrapperRect = menuLinksWrapper.getBoundingClientRect();
      targetHighlighterX = linkRect.left - wrapperRect.left;
      targetHighlighterwidth = span.offsetWidth;
    };

    menuLinksWrapper?.addEventListener("mouseleave", handleMenuWrapperLeave);
    cleanupFunctionsRef.current.push(() => {
      menuLinksWrapper?.removeEventListener("mouseleave", handleMenuWrapperLeave);
    });

    function animate() {
      currentX += (targetX - currentX) * lerpFactor;
      currentHighlighterX += (targetHighlighterX - currentHighlighterX) * lerpFactor;
      currentHighlighterwidth += (targetHighlighterwidth - currentHighlighterwidth) * lerpFactor;
      gsap.to(menuLinksWrapper, { x: currentX, duration: 0.3, ease: "power4.out" });
      gsap.to(linkHighlighter, {
        x: currentHighlighterX,
        width: currentHighlighterwidth,
        duration: 0.3,
        ease: "power4.out",
      });
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    cleanupFunctionsRef.current.push(() => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    });

    // ✅ Cleanup complet au démontage
    return () => {
      cleanupFunctionsRef.current.forEach(cleanup => cleanup());
      cleanupFunctionsRef.current = [];
      
      // ✅ Réinitialiser l'état du menu
      menuOpenRef.current = false;
      setIsBurgerOpen(false);
      
      // ✅ Tuer toutes les animations GSAP
      gsap.killTweensOf([menuOverlay, menuContent, menuImage, menuLinksEls, linkHighlighter, menuLinksWrapper]);
    };
  }, []);


  useEffect(() => {
    if (typeof window === "undefined") return;

    const nav = document.querySelector("nav");
    if (!nav) return;

    let lastScroll = window.scrollY;
    let isHidden = false;

    const showNav = () => {
      if (!isHidden) return;
      gsap.to(nav, {
        y: 0,
        duration: 0.35,
        ease: "power3.out",
      });
      isHidden = false;
    };

    const hideNav = () => {
      if (isHidden) return;
      gsap.to(nav, {
        y: "-120%",
        duration: 0.35,
        ease: "power3.out",
      });
      isHidden = true;
    };

    const onScroll = () => {
      if (menuOpenRef.current) return;

      const current = window.scrollY;

      if (current < 80) {
        showNav();
        lastScroll = current;
        return;
      }

      if (current > lastScroll) {
        hideNav();
      } else {
        showNav();
      }

      lastScroll = current;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);


  return (
    <>
      <NavAreaClickSound />
      <div className="navbar-wrapper">
        <AnimatedWords isMenuOpen={isBurgerOpen} />
        <nav>
          <div className="nav-left">
            <div className="nav-toggle" aria-label={isBurgerOpen ? "Close menu" : "Open menu"}>
              <div className={`burger ${isBurgerOpen ? "open" : ""}`}>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </div>
            </div>
          </div>

          <div className="nav-center">
            <div className="nav-item">
              <svg className="logo" viewBox="0 0 154 164" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Group-4" className="logo-groups">
                  <g id="Group-2" className="logo-part left-part">
                    <path d="M0 2L27 27.5V120H0V2Z" fill="white" />
                    <path d="M1.42755 40.4772L20.0063 20.8856L79 77L67.5 102L1.42755 40.4772Z" fill="white" />
                    <path d="M40.7 162.554L40.8647 135.554L97.9418 135.293L127.2 162.554L40.7 162.554Z" fill="white" />
                    <rect y="119.592" width="27" height="58.9808" transform="rotate(-43.52 0 119.592)" fill="white" />
                  </g>
                  <g id="Group-3" className="logo-part right-part">
                    <path d="M153.612 161.077L126.415 135.787L125.697 43.2897L152.696 43.0801L153.612 161.077Z" fill="white" />
                    <path d="M151.886 122.612L133.459 142.347L74.0319 86.692L85.3375 61.6035L151.886 122.612Z" fill="white" />
                    <path d="M111.667 0.843628L111.712 27.8436L54.6382 28.5475L25.1693 1.51503L111.667 0.843628Z" fill="white" />
                    <rect x="152.699" y="43.4877" width="27" height="58.9808" transform="rotate(136.035 152.699 43.4877)" fill="white" />
                  </g>
                </g>
              </svg>
            </div>
          </div>

          <div className="nav-right">
            <TimeDisplay />
          </div>
        </nav>

        <div className="menu-overlay">
          <div className="menu-content">
            {menuColumns.map((col, colIndex) => (
              <div className="menu-col" key={colIndex}>
                {col.items.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="menu-img" />

          <div className="menu-links-wrapper">
            {menuLinks.map((link, index) => (
              <div className="menu-link" key={index}>
                <TransitionLink href={link.href || ""}>
                  <span>{link.label}</span>
                  <span>{link.label}</span>
                </TransitionLink>
              </div>
            ))}
            <div className="link-highlighter"></div>
          </div>
        </div>
      </div>
    </>
  );
}