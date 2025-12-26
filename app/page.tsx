// app/page.tsx
"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Navbar from "@/src/components/Navbar/Navbar";
import Hero from "@/src/components/Hero/Hero";
import About from "@/src/components/About/About";
import Services from "@/src/components/About/Services";
import Works from "@/src/components/Works/Works";
import Skills from "@/src/components/Skills/Skills";
import SectionWords from "@/src/components/SectionWords/SectionWords";
import Footer from "@/src/components/Footer/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    // Refresh ScrollTrigger après le chargement
    ScrollTrigger.refresh();
  }, []);

  return (
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
  );
}
