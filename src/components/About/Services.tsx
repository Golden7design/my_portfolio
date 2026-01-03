import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import "./Services.css";
import { SvgService } from "./SvgService";

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);
  

  // Animation opacité / background
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

useEffect(() => {
  if (!sectionRef.current || !triggerRef.current || window.innerWidth < 1000) return;

  const ctx = gsap.context(() => {
    const cards = sectionRef.current!;
    const progress = progressBarRef.current!;

    // 👉 Petit offset pour laisser respirer la dernière card
    const getExtraOffset = () => window.innerWidth * 0.15; // 15vw

    const getScrollAmount = () => {
      return cards.scrollWidth - window.innerWidth + getExtraOffset();
    };

    gsap.to(cards, {
      x: () => -getScrollAmount(),
      ease: "none",
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top 20%",
        end: () => `+=${getScrollAmount()}`,
        scrub: true,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progress.style.width = `${self.progress * 100}%`;
        },
      },
    });
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
        <div className="scroll-progress-container">
          <div className="scroll-progress-bar" ref={progressBarRef}></div>
        </div>

        <div ref={sectionRef} className="cards-container">
          <div className="card card1">
            <div className="card-head">
              <div className="card-svg">{SvgService.dev()}</div>
              <div className="card-number">01</div>
            </div>
            <div className="card-desc">
              <h2 className="card-title" translate="no">Development of tailor-made web applications</h2>
              <div className="card-body">
                <hr />
                <p>I create custom web applications that are user-focused, scalable, and built for long-term performance.
</p>
              </div>
            </div>
          </div>

          <div className="card card2">
            <div className="card-head">
              <div className="card-svg">{SvgService.moderne()}</div>
              <div className="card-number">02</div>
            </div>
            <div className="card-desc">
              <h2 className="card-title" translate="no">Modern & Animated Front-End Interfaces</h2>
              <div className="card-body">
                <hr />
                <p>
                  I build modern user interfaces with fluid animations and refined interactions.
                  Using motion as a design tool, I turn complex ideas into intuitive and engaging experiences.
                </p>
              </div>
            </div>
          </div>

          <div className="card card3">
            <div className="card-head">
              <div className="card-svg">{SvgService.secure()}</div>
              <div className="card-number">03</div>
            </div>
            <div className="card-desc">
              <h2 className="card-title" translate="no">Secured API <br /> & Back-End</h2>
              <div className="card-body">
                <hr />
                <p>
                  Robust and secure back-end systems built to handle real-world traffic.
                  I design APIs that are reliable, well-structured and ready to scale with your application.
                </p>
              </div>
            </div>
          </div>

          <div className="card card4">
            <div className="card-head">
              <div className="card-svg">{SvgService.devops()}</div>
              <div className="card-number" >04</div>
            </div>
            <div className="card-desc">
              <h2 className="card-title" translate="no">CI/CD & <br /> DevOps</h2>
              <div className="card-body">
                <hr />
                <p>
                  I set up automated pipelines to ensure fast, reliable and secure deployments.
                  From version control to production, your application stays stable and easy to maintain.
                </p>
              </div>
            </div>
          </div>

          <div className="card card5">
            <div className="card-head">
              <div className="card-svg">{SvgService.performance()}</div>
              <div className="card-number">05</div>
            </div>
            <div className="card-desc">
              <h2 className="card-title" translate="no">Performance <br /> Optimization</h2>
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
