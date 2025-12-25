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
  // ✅ Force le remontage des composants lors du retour sur la page
  const [key, setKey] = useState(0);

  useEffect(() => {
    // ✅ Incrémenter la key à chaque changement de pathname
    setKey(prev => prev + 1);
  }, [pathname]);

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
  }, [key]); // ✅ Recharger quand la key change

  return (
    <ReactLenis root options={{ 
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    }}>
      <>
        {/* ✅ Ajouter une key pour forcer le remontage */}
        <Navbar key={`navbar-${key}`} />

        {/* SCROLL RÉEL */}
        <main id="scroll-root">
          <Hero key={`hero-${key}`} />
          <About />
          <Services />
          <Works/>
          <Skills />
          <SectionWords/>
          <Footer/>
        </main>
      </>
    </ReactLenis>
  );
}