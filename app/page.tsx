import Image from "next/image";
import Navbar from "@/src/components/Navbar/Navbar";
import ReactLenis from "lenis/react";


export default function Home() {
  return (
    <ReactLenis root>
    <div>
      <Navbar/>
    </div>
    </ReactLenis>
  );
}
