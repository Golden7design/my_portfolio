"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import './SectionWords.css'

import Lenis from "lenis";

interface SplitTextInstance {
  chars: HTMLElement[];
  revert: () => void;
}

const SectionWords: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const lenis = new Lenis();

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time: number) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    const titleHeadings = gsap.utils.toArray<HTMLHeadingElement>(".title h1");
    const splits: SplitTextInstance[] = [];

    titleHeadings.forEach((heading) => {
      const splitInstance = new SplitText(heading, {
        type: "chars",
        charsClass: "char",
      }) as unknown as SplitTextInstance;
      splits.push(splitInstance);

      splitInstance.chars.forEach((char, i) => {
        const charInitialY = i % 2 === 0 ? -150 : 150;
        gsap.set(char, { y: charInitialY });
      });
    });

    const titles = gsap.utils.toArray<HTMLDivElement>(".title");

    titles.forEach((title, index) => {
      const titleContainer = title.querySelector<HTMLDivElement>(".title-container");
      const titleContainerInitialX = index === 1 ? -100 : 100;
      const split = splits[index];
      const charCount = split.chars.length;

      ScrollTrigger.create({
        trigger: title,
        start: "top bottom",
        end: "top -25%",
        scrub: 1,
        onUpdate: (self) => {
          const titleContainerX =
            titleContainerInitialX - self.progress * titleContainerInitialX;
          if (titleContainer) {
            gsap.set(titleContainer, { x: `${titleContainerX}%` });
          }

          split.chars.forEach((char, i) => {
            let charStaggerIndex: number;
            if (index === 1) {
              charStaggerIndex = charCount - 1 - i;
            } else {
              charStaggerIndex = i;
            }

            const charStartDelay = 0.1;

            const charTimeLineSpan = 1 - charStartDelay;

            const staggerFactor = Math.min(0.75, charTimeLineSpan * 0.75);
            const delay =
              charStartDelay + (charStaggerIndex / charCount) * staggerFactor;

            const duration =
              charTimeLineSpan - (staggerFactor * (charCount - 1)) / charCount;
            const start = delay;

            let charProgress = 0;
            if (self.progress >= start) {
              charProgress = Math.min(1, (self.progress - start) / duration);
            }

            const charInitialY = i % 2 === 0 ? -150 : 150;
            const charY = charInitialY - charProgress * charInitialY;
            gsap.set(char, { y: charY });
          });
        },
      });
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      splits.forEach((split) => split.revert());
    };
  }, []);

  return (
    <section className="animated-titles" ref={sectionRef}>
      <div className="title">
        <div className="title-container">
          <h1>You focus</h1>
        </div>
      </div>
      <div className="title">
        <div className="title-container">
          <h1>I handle</h1>
        </div>
      </div>
      <div className="title">
        <div className="title-container">
          <h1>It flows</h1>
        </div>
      </div>
    </section>
  );
};

export default SectionWords;