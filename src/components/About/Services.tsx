import React, { useRef, useEffect, useState } from 'react'
import {gsap} from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import './Services.css'
import AnimatedCopy from './AnimatedCopy'
import Image from 'next/image'

const Services = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    gsap.registerPlugin(ScrollTrigger);

   useEffect(() => {
  
  // Ne lancer GSAP que si la largeur de l'écran >= 1000px
  if (window.innerWidth < 1000) return;

  const ctx = gsap.context(() => {
    gsap.to(sectionRef.current, {
      x: "-70vw",
      ease: "none",
      scrollTrigger: {
        trigger: triggerRef.current,
        start: "top 20%",
        end: "+=2000",
        scrub: true,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Mettre à jour la progression
          setProgress(self.progress * 100);
          
          // Animation de la barre de progression
          if (progressBarRef.current) {
            gsap.to(progressBarRef.current, {
              width: `${self.progress * 100}%`,
              duration: 0.1,
              ease: "none"
            });
          }
        }
      },
    });
  });

  return () => ctx.revert();
}, []);

  
  return (
    <div className='sercives' >
        <AnimatedCopy>
            <p className='services-desc' >
       I provide modern digital solutions, from custom web applications to optimized performance, designed to help your business grow.
            </p>
        </AnimatedCopy>

      <div ref={triggerRef} className="cards-pin" >
        {/* Barre de progression */}
        <div className="scroll-progress-container">
          <div className="scroll-progress-bar" ref={progressBarRef}></div>
        </div>
      <div ref={sectionRef} className="cards-container">
        <div className="card card1">
            <div className="card-head">
                <div className="card-svg">
                    <Image
                        src="/assets/img_0.png"
                        alt='Development of tailor-made web applications'
                        width={120}
                        height={80}
                        className='card-image'
                    />
                </div>
                <div className="card-number">
                    01
                </div>
            </div>
            <div className="card-desc">
                <h2 className='card-title'>
                Development of tailor-made web applications
            </h2>
                            <div className='card-body' >
                    <hr />
                    <p>
                       I create custom web applications designed specifically for your product and your users. 
From architecture to deployment, every solution is scalable, maintainable and focused on long-term performance.
                    </p>
                    </div>
            </div>
        </div>

        <div className="card card2">
            <div className="card-head">
                <div className="card-svg">
                    <Image
                        src="/assets/img_1.png"
                        alt='Development of tailor-made web applications'
                        width={120}
                        height={80}
                        className='card-image'
                    />
                </div>
                <div className="card-number">
                    02
                </div>
            </div>
            <div className="card-desc">
                    <h2 className='card-title'>
                        Modernes & Animated Front-End Interfaces
                    </h2>
                <div className='card-body' >
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
                <div className="card-svg">
                    <Image
                        src="/assets/img_2.png"
                        alt='Development of tailor-made web applications'
                        width={120}
                        height={80}
                        className='card-image'
                    />
                </div>
                <div className="card-number">
                    03
                </div>
            </div>
            <div className="card-desc">
                <h2 className='card-title' >
                    Secured API & <br />Back-End
                </h2>
                <div className='card-body' >
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
                <div className="card-svg">
                    <Image
                        src="/assets/img_3.png"
                        alt='Development of tailor-made web applications'
                        width={120}
                        height={80}
                        className='card-image'
                    />
                </div>
                <div className="card-number">
                    04
                </div>
            </div>
            <div className="card-desc">
                <h2 className='card-title' >
                CI/CD & <br />DevOps
            </h2>
                <div className='card-body' >
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
                <div className="card-svg">
                    <Image
                        src="/assets/img_4.png"
                        alt='Development of tailor-made web applications'
                        width={120}
                        height={80}
                        className='card-image'
                    />
                </div>
                <div className="card-number">
                    05
                </div>
            </div>
            <div className="card-desc">
                <h2 className='card-title' >
                Performance <br />Optimization
            </h2>
                <div className='card-body' >
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
  )
}

export default Services