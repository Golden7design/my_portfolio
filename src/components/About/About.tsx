"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InversionLens from "./InversionLens/InversionLens";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);


  useEffect(() => {
    if (!svgRef.current) return;

    const path = svgRef.current.querySelector("path");
    const circles = svgRef.current.querySelectorAll("circle");

    if (!path) return;

    const length = path.getTotalLength();

    // ÉTAPE 1 – préparer la ligne
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    // ÉTAPE 2 – préparer les cercles
    gsap.set(circles, {
      scale: 0,
      opacity: 0,
      transformOrigin: "50% 50%",
    });

    // TIMELINE
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: svgRef.current,
        start: "top 60%",
        toggleActions: "play none none none",
      },
    });

    // 1️⃣ écriture de la ligne
    tl.to(path, {
      strokeDashoffset: 0,
      duration: 2.2,
      ease: "power2.out",
    });

    // 2️⃣ cercles un par un
    tl.to(
      circles,
      {
        scale: 1,
        opacity: 1,
        duration: 0.25,
        stagger: 0.2,
        ease: "back.out(2)",
      },
      "+=0.1"
    );

  }, []);

  useEffect(() => {
  const btn = buttonRef.current;
  if (!btn) return;

  const strength = 0.4; // force d'attraction
  const radius = 120;   // distance d'activation (px)

  const onMouseMove = (e: MouseEvent) => {
    const rect = btn.getBoundingClientRect();
    const btnX = rect.left + rect.width / 2;
    const btnY = rect.top + rect.height / 2;

    const distX = e.clientX - btnX;
    const distY = e.clientY - btnY;

    const distance = Math.sqrt(distX ** 2 + distY ** 2);

    if (distance < radius) {
      gsap.to(btn, {
        x: distX * strength,
        y: distY * strength,
        duration: 0.3,
        ease: "power3.out",
      });
    } else {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
      });
    }
  };

  window.addEventListener("mousemove", onMouseMove);

  return () => {
    window.removeEventListener("mousemove", onMouseMove);
  };
}, []);

useEffect(() => {
  const chars = document.querySelectorAll(".fill-btn .char");
  chars.forEach((char, i) => {
    (char as HTMLElement).style.setProperty("--i", i.toString());
  });
}, []);



  return (
    <div className="about-container">
        <h1 className='about-title' >About Me</h1>

        <div className="about-content1">
            <div className="about-me-description">
                <p>I am a FullStack Developer & DevOps enthusiast, passionate about creating efficient and elegant projects. With over 4 years of experience working on my own projects, I am proficient in Node.js, Next.js, and Three.js. I operate in a DevOps environment, combining design, pipeline, and development to deliver projects ready for deployment at any moment.</p>
                <p>I prioritize clean UI/UX, security, and effective team collaboration. Curious, open-minded, and thoughtful, I enjoy taking on bold challenges while exploring creative and experimental solutions. My goal: to take on freelance missions, join internationally recognized companies, and leave a visible mark on every project I work on.</p>
                <button ref={buttonRef} className="magnetic-btn fill-btn">
                  <span className="fill-bg"></span>
                  <span className="text">
                    {"Contact Me".split("").map((char, i) => (
                      <span key={i} className="char">
                        {char === " " ? "\u00A0" : char}
                      </span>
                    ))}
                  </span>
                </button>


            </div>
            <div className="img_inversed">
                <svg
                className="sign"
            ref={svgRef}
            width="297"
            height="145"
            viewBox="0 0 297 145"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 70.5203H296.5C296.5 70.5203 -24.5774 145.666 36.5 64.5203C64.9354 26.7418 140.5 2.52029 140.5 2.52029L69.5 143.52C69.5 143.52 138.854 1.30253 147.5 48.5203C149.54 59.6603 142.5 77.5203 142.5 77.5203C142.5 77.5203 154.175 39.5382 165.5 48.5203C174.373 55.5577 164.5 77.5203 164.5 77.5203C164.5 77.5203 180.175 37.9761 191.5 48.5203C199.789 56.2375 179.5 77.5203 179.5 77.5203"
              stroke="#804A4A"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="212" cy="38.0203" r="2.5" fill="#804A4A" />
            <circle cx="237" cy="26.0203" r="2.5" fill="#804A4A" />
            <circle cx="263" cy="15.0203" r="2.5" fill="#804A4A" />
          </svg>

                <InversionLens src="/nassir_img.png" className="inversion-lens"/>
            </div>

        </div>

        
    </div>
  )
}

export default About
