"use client";

import ReactLenis from "lenis/react";
import CursorBubble from "@/src/components/CursorBubble/CursorBubble";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root>
      {children}
      <CursorBubble />
    </ReactLenis>
  );
}
