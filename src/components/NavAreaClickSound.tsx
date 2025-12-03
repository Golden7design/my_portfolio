"use client";

import { useEffect, useRef } from "react";

export default function NavAreaClickSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const navbarWrapper = document.querySelector(".navbar-wrapper");
    if (!navbarWrapper) return;

    // Volume bas, safe
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
    }

    const play = () => {
      if (!audioRef.current) return;

      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    };

    navbarWrapper.addEventListener("click", play);

    return () => {
      navbarWrapper.removeEventListener("click", play);
    };
  }, []);

  return <audio ref={audioRef} src="/sounds/click.mp3" preload="auto" />;
}
