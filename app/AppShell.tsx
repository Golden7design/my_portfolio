"use client";

import { useState } from "react";
import Providers from "./Providers";
import PageTransition from "@/src/components/PageTransition/PageTransition";
import LoadingAnimation from "@/src/components/LoadingAnimation/LoadingAnimation";
import Hero from "@/src/components/Hero/Hero";
export default function AppShell({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  return (
    <>
      {!ready && <LoadingAnimation onComplete={() => setReady(true)} />}

      <Hero ready={ready} />

      <PageTransition />

      <Providers>{children}</Providers>
    </>
  );
}
