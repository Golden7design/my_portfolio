import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import './Services.css';
import AnimatedCopy from './AnimatedCopy';
import { SvgService } from './SvgService';

// 🔢 Chiffres romains
const toRoman = (num: number): string => {
  if (num < 1 || num > 3999) return String(num);
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  let roman = '';
  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]) {
      roman += symbols[i];
      num -= values[i];
    }
  }
  return roman;
};

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);
  
  // Refs pour chaque SVG
  const devSvgRef = useRef<HTMLDivElement>(null);
  const moderneSvgRef = useRef<HTMLDivElement>(null);
  const secureSvgRef = useRef<HTMLDivElement>(null);
  const devopsSvgRef = useRef<HTMLDivElement>(null);
  const performanceSvgRef = useRef<HTMLDivElement>(null);

  gsap.registerPlugin(ScrollTrigger);

  // Background + opacité
  useEffect(() => {
    if (typeof window === 'undefined' || !serviceRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(serviceRef.current, {
        '--title-opacity': 1,
        scrollTrigger: {
          trigger: serviceRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
        },
      });
      ScrollTrigger.create({
        trigger: serviceRef.current,
        start: 'top 20%',
        onEnter: () => document.body.classList.add('works-active'),
        onLeaveBack: () => document.body.classList.remove('works-active'),
      });
    });
    return () => {
      ctx.revert();
      document.body.classList.remove('works-active');
    };
  }, []);

  // Animation horizontale (desktop)
  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth < 1000) return;
    const ctx = gsap.context(() => {
      gsap.to(sectionRef.current, {
        x: '-70vw',
        ease: 'none',
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top 20%',
          end: '+=2000',
          scrub: true,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              gsap.to(progressBarRef.current, {
                width: `${self.progress * 100}%`,
                duration: 0.1,
                ease: 'none',
              });
            }
          },
        },
      });
    });
    return () => ctx.revert();
  }, []);

  // 🎨 Animation des SVG
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation SVG Dev - pulse de couleur
      if (devSvgRef.current) {
        gsap.to(devSvgRef.current.querySelectorAll('path[fill="#D7FB61"]'), {
          fill: "#e1ff01",
          scale: 1.05,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });
      }

      // Animation SVG Moderne - rotation ou scale
      if (moderneSvgRef.current) {
        gsap.to(moderneSvgRef.current.querySelectorAll('path, circle'), {
          scale: 1.15,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          transformOrigin: "center center"
        });
      }

      // Animation SVG Secure - pulse
      if (secureSvgRef.current) {
        gsap.to(secureSvgRef.current.querySelectorAll('path'), {
          duration: 1.8,
          scale: 1.05,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut"
        });
      }

      // Animation SVG DevOps - rotation légère
      if (devopsSvgRef.current) {
        gsap.to(devopsSvgRef.current.querySelectorAll('circle, path'), {
          rotation: 5,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
          transformOrigin: "center center"
        });
      }

      // Animation SVG Performance - scale pulse
      if (performanceSvgRef.current) {
        gsap.to(performanceSvgRef.current.querySelectorAll('path'), {
          scale: 1.1,
          duration: 1.3,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          transformOrigin: "center center"
        });
      }
    });
    
    return () => ctx.revert();
  }, []);

  return (
    <div className="services" ref={serviceRef}>
      <p className="services-desc">
        I provide modern digital solutions, from custom web applications to
        optimized performance, designed to help your business grow.
      </p>

      <div ref={triggerRef} className="cards-pin">
        {/* Barre de progression */}
        <div className="scroll-progress-container">
          <div className="scroll-progress-bar" ref={progressBarRef}></div>
        </div>

        <div ref={sectionRef} className="cards-container">
          {/* ✅ Carte 1 - Development */}
          <div className="card card1">
            <div className="card-head">
              <div className="card-svg" ref={devSvgRef}>
                {SvgService.dev()}
              </div>
              <div className="card-number">{toRoman(1)}</div>
            </div>
            <div className="card-desc">
              <h2 className="card-title">Development of tailor-made web applications</h2>
              <div className="card-body">
                <hr />
                <p>
                  I create custom web applications designed specifically for your product and your users.
                  From architecture to deployment, every solution is scalable, maintainable and focused on long-term performance.
                </p>
              </div>
            </div>
          </div>

          {/* ✅ Carte 2 - Modern Front-End */}
          <div className="card card2">
            <div className="card-head">
              <div className="card-svg" ref={moderneSvgRef}>
                {SvgService.moderne()}
              </div>
              <div className="card-number">{toRoman(2)}</div>
            </div>
            <div className="card-desc">
              <h2 className="card-title">
                Modern & Animated Front-End Interfaces
              </h2>
              <div className="card-body">
                <hr />
                <p>
                  I build modern user interfaces with fluid animations and refined interactions.
                  Using motion as a design tool, I turn complex ideas into intuitive and engaging experiences.
                </p>
              </div>
            </div>
          </div>

          {/* ✅ Carte 3 - Secured API */}
          <div className="card card3">
            <div className="card-head">
              <div className="card-svg" ref={secureSvgRef}>
                {SvgService.secure()}
              </div>
              <div className="card-number">{toRoman(3)}</div>
            </div>
            <div className="card-desc">
              <h2 className="card-title">
                Secured API &<br />
                Back-End
              </h2>
              <div className="card-body">
                <hr />
                <p>
                  Robust and secure back-end systems built to handle real-world traffic.
                  I design APIs that are reliable, well-structured and ready to scale with your application.
                </p>
              </div>
            </div>
          </div>

          {/* ✅ Carte 4 - CI/CD & DevOps */}
          <div className="card card4">
            <div className="card-head">
              <div className="card-svg" ref={devopsSvgRef}>
                {SvgService.devops()}
              </div>
              <div className="card-number">{toRoman(4)}</div>
            </div>
            <div className="card-desc">
              <h2 className="card-title">
                CI/CD &<br />
                DevOps
              </h2>
              <div className="card-body">
                <hr />
                <p>
                  I set up automated pipelines to ensure fast, reliable and secure deployments.
                  From version control to production, your application stays stable and easy to maintain.
                </p>
              </div>
            </div>
          </div>

          {/* ✅ Carte 5 - Performance */}
          <div className="card card5">
            <div className="card-head">
              <div className="card-svg" ref={performanceSvgRef}>
                {SvgService.performance()}
              </div>
              <div className="card-number">{toRoman(5)}</div>
            </div>
            <div className="card-desc">
              <h2 className="card-title">
                Performance<br />
                Optimization
              </h2>
              <div className="card-body">
                <hr />
                <p>
                  I optimize loading time, rendering and overall performance to deliver fast experiences.
                  Every detail matters, from code splitting to asset optimization and runtime efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;