"use client";

import { useEffect } from "react";
import gsap from "gsap";
import "./Navbar.css"; // CSS file
import { menuColumns } from "./navInfo";
import { menuLinks } from "./navLinks";

export default function Navbar() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // LOAD CDN FOR SplitTEXT
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/SplitText.min.js";
    script.onload = () => {
      if (window.SplitText) {
        gsap.registerPlugin(window.SplitText);

        
        // Animation GSAP

        const container = document.querySelector('.container');
        const navtoggle = document.querySelector('.nav-toggle');
        const menuOverlay = document.querySelector('.menu-overlay');
        const menuContent = document.querySelector('.menu-content');
        const menuImage = document.querySelector('.menu-img');
        const menuLinksWrapper = document.querySelector('.menu-links-wrapper');
        const linkHighlighter = document.querySelector('.link-highlighter');

        let currentX = 0;
        let targetX = 0;
        const lerpFactor = 0.05;

        let currentHighlighterX = 0;
        let targetHighlighterX = 0;
        let currentHighlighterwidth = 0;
        let targetHighlighterwidth = 0;

        let isMenuOpen = false;
        let isMenuAnimating = false;

        const menuLinks = document.querySelectorAll('.menu-link a');
        menuLinks.forEach((link) => {
          const chars = link.querySelectorAll('span');
          chars.forEach((char, charIndex) => {
            const split = new window.SplitText(char, { type: "chars" });
            split.chars.forEach((char) => {
              char.classList.add('char');
              char.style.fontSize = '10rem';
            });
            if (charIndex === 1) {
              gsap.set(split.chars, { y: "110%" });
            }
          });
        });

        gsap.set(menuContent, { y: "50%", opacity: 0.25 });
        gsap.set(menuImage, { scale: 0.5, opacity: 0.25 });
        gsap.set(menuLinks, { y: "150%" });
        gsap.set(linkHighlighter, { y: "150%" });

        const defaultLinkText = document.querySelector('.menu-link:first-child a span');

        if (defaultLinkText) {
          const linkWidth = defaultLinkText.offsetWidth;
          linkHighlighter!.style.width = linkWidth + 'px';
          currentHighlighterwidth = linkWidth;
          targetHighlighterwidth = linkWidth;

          const defaultLinkTextElement = document.querySelector('.menu-link:first-child');
          const linkRect = defaultLinkTextElement!.getBoundingClientRect();
          const menuWrapperRect = menuLinksWrapper!.getBoundingClientRect();
          const initialX = linkRect.left - menuWrapperRect.left;
          currentHighlighterX = initialX;
          targetHighlighterX = initialX;
        }

        // Toggle menu
        function toggleMenu() {
          if (isMenuAnimating) return;
          isMenuAnimating = true;

          if (!isMenuOpen) {
            gsap.to(container, {
              y: "-40%",
              opacity: 0.25,
              duration: 1.25,
              ease: "expo.out",
            });

            gsap.to(menuOverlay, {
              clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
              duration: 1.25,
              ease: "expo.out",
              onComplete: () => {
                gsap.set(container, { y: "40%" });
                gsap.set(".menu-link", { overflow: "visible" });

                isMenuOpen = true;
                isMenuAnimating = false;
              },
            });

            gsap.to(menuContent, { y: "0%", opacity: 1, duration: 1.5, ease: "expo.out" });
            gsap.to(menuImage, { scale: 1, opacity: 1, duration: 1.5, ease: "expo.out" });
            gsap.to(menuLinks, { y: "0%", duration: 1.25, stagger: 0.1, delay: 0.25, ease: "expo.out" });
            gsap.to(linkHighlighter, { y: "0%", duration: 1, delay: 1, ease: "expo.out" });

          } else {
            gsap.to(container, { y: "0%", opacity: 1, duration: 1.25, ease: "expo.out" });
            gsap.to(menuLinks, { y: "-200%", duration: 1.25, ease: "expo.out" });
            gsap.to(menuContent, { y: "-100%", duration: 1.25, ease: "expo.out" });
            gsap.to(menuImage, { y: "-100%", duration: 1.25, ease: "expo.out" });
            gsap.to(menuOverlay, {
              clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
              duration: 1.25,
              ease: "expo.out",
              onComplete: () => {
                gsap.set(menuOverlay, { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" });
                gsap.set(menuLinks, { y: "150%" });
                gsap.set(linkHighlighter, { y: "150%" });
                gsap.set(menuContent, { y: "50%", opacity: 0.25 });
                gsap.set(menuImage, { y: "0%", scale: 0.5, opacity: 0.25 });
                gsap.set(".menu-link", { overflow: "hidden" });

                gsap.set(menuLinksWrapper, { x: 0 });
                currentX = 0;
                targetX = 0;

                isMenuOpen = false;
                isMenuAnimating = false;
              },
            });
          }
        }

        navtoggle?.addEventListener('click', toggleMenu);

        // Mouse animations
        const menuLinksContainer = document.querySelectorAll('.menu-link');
        menuLinksContainer.forEach((link) => {
          link.addEventListener('mouseenter', () => {
            if (window.innerWidth < 1000) return;

            const linkCopy = link.querySelectorAll('a span');
            const visibleCopy = linkCopy[0];
            const animatedCopy = linkCopy[1];

            const visibleChars = visibleCopy.querySelectorAll('.char');
            gsap.to(visibleChars, { y: "-110%", stagger: 0.06, duration: 1, ease: "expo.inOut" });

            const animatedChars = animatedCopy.querySelectorAll('.char');
            gsap.to(animatedChars, { y: "0%", stagger: 0.06, duration: 1, ease: "expo.inOut" });
          });

          link.addEventListener('mouseleave', () => {
            if (window.innerWidth < 1000) return;

            const linkCopy = link.querySelectorAll('a span');
            const visibleCopy = linkCopy[0];
            const animatedCopy = linkCopy[1];

            const animatedChars = animatedCopy.querySelectorAll('.char');
            gsap.to(animatedChars, { y: "100%", stagger: 0.03, duration: 0.5, ease: "expo.inOut" });

            const visibleChars = visibleCopy.querySelectorAll('.char');
            gsap.to(visibleChars, { y: "0%", stagger: 0.03, duration: 0.5, ease: "expo.inOut" });
          });
        });

        menuOverlay?.addEventListener('mousemove', (e) => {
          if (window.innerWidth < 1000) return;

          const mouseX = e.clientX;
          const viewportWidth = window.innerWidth;
          const menuLinksWrapperWidth = menuLinksWrapper!.offsetWidth;

          const maxMoveLeft = 0;
          const maxMoveRight = viewportWidth - menuLinksWrapperWidth;

          const sensitivityRange = viewportWidth * 0.5;
          const startX = (viewportWidth - sensitivityRange) / 2;
          const endX = startX + sensitivityRange;

          let mousePercentage;
          if (mouseX < startX) mousePercentage = 0;
          else if (mouseX >= endX) mousePercentage = 1;
          else mousePercentage = (mouseX - startX) / sensitivityRange;

          targetX = maxMoveLeft + mousePercentage * (maxMoveRight - maxMoveLeft);
        });

        menuLinksContainer.forEach((link) => {
          link.addEventListener('mouseenter', () => {
            if (window.innerWidth < 1000) return;

            const linkRect = link.getBoundingClientRect();
            const menuWrapperRect = menuLinksWrapper!.getBoundingClientRect();

            targetHighlighterX = linkRect.left - menuWrapperRect.left;

            const linkCopyElement = link.querySelector('a span');
            targetHighlighterwidth = linkCopyElement ? linkCopyElement.offsetWidth : link.offsetWidth;
          });
        });

        menuLinksWrapper?.addEventListener('mouseleave', () => {
          const defaultLinkText = document.querySelector('.menu-link:first-child');
          const defaultLinkTextSpan = defaultLinkText!.querySelector('a span');

          const linkRect = defaultLinkText!.getBoundingClientRect();
          const menuWrapperRect = menuLinksWrapper!.getBoundingClientRect();

          targetHighlighterX = linkRect.left - menuWrapperRect.left;
          targetHighlighterwidth = defaultLinkTextSpan!.offsetWidth;
        });

        function animate() {
          currentX += (targetX - currentX) * lerpFactor;
          currentHighlighterX += (targetHighlighterX - currentHighlighterX) * lerpFactor;
          currentHighlighterwidth += (targetHighlighterwidth - currentHighlighterwidth) * lerpFactor;

          gsap.to(menuLinksWrapper, { x: currentX, duration: 0.3, ease: "power4.out" });
          gsap.to(linkHighlighter, { x: currentHighlighterX, width: currentHighlighterwidth, duration: 0.3, ease: "power4.out" });

          requestAnimationFrame(animate);
        }

        animate();

      }
    };
    document.body.appendChild(script);
  }, []);

  return (
     <>
      <nav>
        <div className="nav-toggle"><p>Menu</p></div>
        <div className="nav-item"><svg className="logo" width="40" height="40"  viewBox="0 0 154 164" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Group 4">
<g id="Group 2">
<path id="Rectangle 2" d="M0 2L27 27.5V120H0V2Z" fill="currentColor "/>
<path id="Rectangle 3" d="M1.42755 40.4772L20.0063 20.8856L79 77L67.5 102L1.42755 40.4772Z" fill="currentColor"/>
<path id="Rectangle 5" d="M40.7 162.554L40.8647 135.554L97.9418 135.293L127.2 162.554L40.7 162.554Z" fill="currentColor"/>
<rect id="Rectangle 4" y="119.592" width="27" height="58.9808" transform="rotate(-43.52 0 119.592)" fill="currentColor"/>
</g>
<g id="Group 3">
<path id="Rectangle 2_2" d="M153.612 161.077L126.415 135.787L125.697 43.2897L152.696 43.0801L153.612 161.077Z" fill="currentColor"/>
<path id="Rectangle 3_2" d="M151.886 122.612L133.459 142.347L74.0319 86.692L85.3375 61.6035L151.886 122.612Z" fill="currentColor"/>
<path id="Rectangle 5_2" d="M111.667 0.843628L111.712 27.8436L54.6382 28.5475L25.1693 1.51503L111.667 0.843628Z" fill="currentColor"/>
<rect id="Rectangle 4_2" x="152.699" y="43.4877" width="27" height="58.9808" transform="rotate(136.035 152.699 43.4877)" fill="currentColor"/>
</g>
</g>
</svg></div>
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

        <div className="menu-img">
          {/* ton SVG ici */}
        </div>

        <div className="menu-links-wrapper">
          {menuLinks.map((link, index) => (
            <div className="menu-link" key={index}>
              <a href={link.href}><span>{link.label}</span><span>{link.label}</span></a>
            </div>
          ))}
          <div className="link-highlighter"></div>
        </div>
      </div>

      <div className="container">
        <section className="hero">
          <h1>Welcome to My Portfolio</h1>
        </section>
      </div>
    </>
  );
}
