import React from 'react'
import './Footer.css'
import { TechLogos } from '../techlogo/TechLogos'
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


const Footer = () => {
  const svgRef = useRef<SVGSVGElement>(null);
const sectionRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (!svgRef.current || !sectionRef.current) return;

  const path = svgRef.current.querySelector("path");
  const circles = svgRef.current.querySelectorAll("circle");

  if (!path) return;

  const length = path.getTotalLength();

  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length,
  });

  gsap.set(circles, {
    scale: 0,
    opacity: 0,
    transformOrigin: "50% 50%",
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.current,
      start: "top 10%",
      once: true,
    },
  });

  tl.to(path, {
    strokeDashoffset: 0,
    duration: 1.8,
    ease: "power2.out",
  });

  tl.to(
    circles,
    {
      scale: 1,
      opacity: 1,
      duration: 0.25,
      stagger: 0.2,
      ease: "back.out(2)",
    },
    "-=0.2"
  );

  return () => {
    tl.kill(); // clean & suffisant
  };
}, []);


  return (
    <div className='say-hello' ref={sectionRef} >
        <h1 id='say-hello!' className="say-hello-title">
          Say Hello!
        </h1>

        <div className="message">
          <p>Let's build something great together!</p>

          <div className="email-container">
            <input type="email" placeholder='Enter your email' />
            <button className='send' >Send</button>
          </div>
        </div>

        <div className="say-hello-contact">

          <div className="social-contact">
            <TechLogos.GitHub/>
            <TechLogos.LinkedIn/>
            <TechLogos.Whatsapp/>
          </div>

          <div className="my-contact">
            <p>gouombanassir@gmail.com</p>
            <p>+242 06 876 59 39</p>
          </div>

        </div>


        <div className="say-name">
  <div className="copyright-container">
    <div className="copyright">
      <TechLogos.nash />
      <p>©Nassir | 2025</p>
    </div>
    <div className="designed-by">
      <p>designed & developed by me</p>
    </div>
  </div>

  <div className="name-mask">
    <h1>NAS<svg
            className="sign"
            viewBox="0 0 297 145"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            ref={svgRef}
          >
            <path
              d="M1.5 70.5203H296.5C296.5 70.5203 -24.5774 145.666 36.5 64.5203C64.9354 26.7418 140.5 2.52029 140.5 2.52029L69.5 143.52C69.5 143.52 138.854 1.30253 147.5 48.5203C149.54 59.6603 142.5 77.5203 142.5 77.5203C142.5 77.5203 154.175 39.5382 165.5 48.5203C174.373 55.5577 164.5 77.5203 164.5 77.5203C164.5 77.5203 180.175 37.9761 191.5 48.5203C199.789 56.2375 179.5 77.5203 179.5 77.5203"
              stroke="#d7fb61"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="212" cy="38.0203" r="2.5" fill="#d7fb61" />
            <circle cx="237" cy="26.0203" r="2.5" fill="#d7fb61" />
            <circle cx="263" cy="15.0203" r="2.5" fill="#d7fb61" />
          </svg>SIR</h1>
  </div>
</div>


    </div>
  )
}

export default Footer