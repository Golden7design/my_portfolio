// app/page.tsx
"use client";

import { useEffect } from "react";
import ReactLenis from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/src/components/Navbar/Navbar";
import Services from "@/src/components/About/Services";
import Hero from "@/src/components/Hero/Hero";
import About from "@/src/components/About/About";
import Skills from "@/src/components/Skills/Skills";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    // Synchroniser Lenis avec ScrollTrigger
    const lenis = (window as any).lenis;
    
    if (lenis) {
      lenis.on('scroll', () => {
        ScrollTrigger.update();
      });
    }

    // Refresh ScrollTrigger après le chargement
    ScrollTrigger.refresh();

    return () => {
      if (lenis) {
        lenis.off('scroll');
      }
    };
  }, []);

  return (
    <ReactLenis root options={{ 
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    }}>
      <>
  <Navbar />

  {/* SCROLL RÉEL */}
  <main id="scroll-root">
    <Hero />
    <About />
    <Services />
    <Skills />
  </main>

</>

    </ReactLenis>
  );
}