// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import ReactLenis from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/src/components/Navbar/Navbar";
import Services from "@/src/components/About/Services";
import Hero from "@/src/components/Hero/Hero";
import About from "@/src/components/About/About";
import Skills from "@/src/components/Skills/Skills";
import Works from "@/src/components/Works/Works";
import { usePathname } from "next/navigation";
import SectionWords from "@/src/components/SectionWords/SectionWords";
import Footer from "@/src/components/Footer/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // ✅ Cleanup complet des ScrollTriggers au retour de navigation
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    
    // ✅ Reset scroll position
    window.scrollTo(0, 0);
    
    // ✅ Attendre que le DOM soit stable avant de refresh
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [pathname, mounted]);

  useEffect(() => {
    if (!mounted) return;

    // Synchroniser Lenis avec ScrollTrigger
    const lenis = (window as any).lenis;
    
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
    }

    return () => {
      if (lenis) {
        lenis.off('scroll', ScrollTrigger.update);
      }
    };
  }, [mounted]);

  if (!mounted) {
    return null; // Évite les problèmes d'hydratation
  }

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

        <main id="scroll-root">
          <Hero />
          <About />
          <Services />
          <Works />
          <Skills />
          <SectionWords />
          <Footer />
        </main>
      </>
    </ReactLenis>
  );
}