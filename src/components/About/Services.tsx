import React, { useRef, useEffect } from 'react'
import {gsap} from 'gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'
import './Services.css'
import AnimatedCopy from './AnimatedCopy'
import Image from 'next/image'

const Services = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const svgPathRef = useRef<SVGPathElement>(null); // ✅ Ajouté pour l'animation SVG

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
      },
    });
  });

  return () => ctx.revert();
}, []);




  
  return (
    <div className='sercives' >

        <AnimatedCopy>
            <p className='services-desc' >
       We provide modern digital solutions, from custom web applications to optimized performance, designed to help your business grow.

</p>
        </AnimatedCopy>
      <div ref={triggerRef} className="cards-pin" >
                {/* <div className="svg-anime">
            <svg viewBox="0 0 7194 4078" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                    ref={svgPathRef}
                    d="M23 7.5C23 7.5 1435.11 668.623 1921.5 1467.5C2207.37 1937.03 2130.79 2308.8 2382.5 2797.5C2624.22 3266.81 2713.59 3620.65 3159 3904C4292.21 4624.9 5408.07 -77.4564 4281 653C3320.5 1275.5 4700 1459.59 5050 1921C5351.73 2318.78 5453.51 2665.44 5910.5 2866.5C6363.93 3066 7179 2866.5 7179 2866.5" 
                    stroke="#804A4A" 
                    strokeOpacity="0.5" 
                    strokeWidth="197" 
                    strokeLinecap="round"
                />
            </svg>
        </div> */}
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