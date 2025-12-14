"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollPinExample() {
  const container = useRef(null);
  const left = useRef(null);
  const right1 = useRef(null);
  const right2 = useRef(null);

  useGSAP(() => {
    // Pin du bloc gauche
    ScrollTrigger.create({
      trigger: container.current,
      start: "top top",
      end: "bottom bottom",
      pin: left.current,
      pinType: "transform",
    });

    // Animation du bloc de droite
    gsap.timeline({
      scrollTrigger: {
        trigger: container.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    })
      // RIGHT 1 monte → sort du viewport
      .to(right1.current, {
        y: "-100%",
        ease: "none",
      })
      // RIGHT 2 monte pour prendre la place du RIGHT 1
      .to(
        right2.current,
        {
          y: "-100%",
          ease: "none",
        },
        "<" // en même temps
      );
  }, []);

  return (
    <div
      ref={container}
      className="relative h-[300vh] w-full bg-gray-200 flex gap-10 p-10"
    >
      {/* Bloc gauche (pinné) */}
      <div
        ref={left}
        className="w-1/2 h-screen bg-purple-500 text-white p-10 sticky-content"
      >
        <h2 className="text-3xl">Bloc Gauche (pinned)</h2>
      </div>

      {/* Bloc droite */}
      <div className="w-1/2 relative overflow-hidden">
        {/* RIGHT 1 */}
        <div
          ref={right1}
          className="absolute top-0 left-0 w-full h-screen bg-blue-400 p-10"
        >
          <h2 className="text-2xl">Bloc Droite 1</h2>
        </div>

        {/* RIGHT 2 (positionné sous le viewport au départ) */}
        <div
          ref={right2}
          className="absolute top-full left-0 w-full h-screen bg-green-400 p-10"
        >
          <h2 className="text-2xl">Bloc Droite 2</h2>
        </div>
      </div>
    </div>
  );
}
