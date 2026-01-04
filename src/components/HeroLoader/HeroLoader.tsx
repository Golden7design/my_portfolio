import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface HeroLoaderProps {
  onLoadComplete?: () => void;
}

const HeroLoader: React.FC<HeroLoaderProps> = ({ onLoadComplete }) => {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const blocksRef = useRef<Array<HTMLDivElement | null>>([]);
  const counterRef = useRef<HTMLDivElement | null>(null);
  const signatureRef = useRef<SVGSVGElement | null>(null);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    // Force le body à cacher la navbar immédiatement
    document.body.classList.add('loader-active');
    
    // Retirer la classe de blocage initial
    document.documentElement.classList.remove('initial-load');

    // 🔴 CRITIQUE : Cacher la signature IMMÉDIATEMENT avant toute animation
    if (signatureRef.current) {
      signatureRef.current.style.opacity = '0';
      
      const signPath = signatureRef.current.querySelector('path') as SVGPathElement | null;
      const signCircles = signatureRef.current.querySelectorAll('circle') as NodeListOf<SVGCircleElement> | undefined;
      
      if (signPath) {
        const length = signPath.getTotalLength();
        gsap.set(signPath, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
      }

      if (signCircles) {
        gsap.set(signCircles, { scale: 0, opacity: 0 });
      }
    }

    const tl = gsap.timeline({
      onComplete: () => {
        // Animation de sortie
        gsap.to(loaderRef.current, {
          yPercent: -100,
          duration: 1,
          ease: "power4.inOut",
          onComplete: () => {
            document.body.classList.remove('loader-active');
            onLoadComplete?.();
          }
        });
      }
    });

    // Faire apparaître la signature en fondu
    tl.to(signatureRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.out"
    });

    // Animation du compteur
    tl.to({ val: 0 }, {
      val: 100,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: function() {
        setProgress(Math.floor(this.targets()[0].val));
      }
    }, "-=0.3");

    // Animation de la signature (path drawing)
    const signPath = signatureRef.current?.querySelector('path') as SVGPathElement | null;
    const signCircles = signatureRef.current?.querySelectorAll('circle') as NodeListOf<SVGCircleElement> | undefined;
    
    if (signPath) {
      tl.to(signPath, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: "power2.inOut"
      }, "-=1.8");
    }

    if (signCircles) {
      tl.to(signCircles, {
        scale: 1,
        opacity: 1,
        stagger: 0.1,
        duration: 0.3,
        ease: "back.out(2)"
      }, "+=0.1");
    }

    // Animation des blocs qui se retirent
    const blocks = blocksRef.current.filter(Boolean) as HTMLDivElement[];
    tl.to(blocks, {
      scaleY: 0,
      stagger: {
        amount: 0.8,
        from: "random"
      },
      duration: 0.6,
      ease: "power3.inOut"
    }, "-=0.3");

    return () => {
      tl.kill();
      document.body.classList.remove('loader-active');
    };
  }, [onLoadComplete]);

  return (
    <div
      ref={loaderRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8f8f8',
        pointerEvents: 'none'
      }}
    >
      {/* Grille de blocs */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gridTemplateRows: 'repeat(6, 1fr)',
        gap: '2px',
        background: '#d7fb61'
      }}>
        {Array.from({ length: 48 }).map((_, i) => (
          <div
            key={i}
            ref={el => { blocksRef.current[i] = el }}
            style={{
              backgroundColor: '#f8f8f8',
              transformOrigin: i % 2 === 0 ? 'top' : 'bottom',
              willChange: 'transform'
            }}
          />
        ))}
      </div>

      {/* Contenu central */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '3rem',
        zIndex: 1
      }}>
        {/* Signature SVG - CACHÉE PAR DÉFAUT */}
        <svg
          ref={signatureRef}
          width="297"
          height="145"
          viewBox="0 0 297 145"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            width: 'min(60vw, 400px)',
            height: 'auto',
            opacity: 0  // 🔴 Caché par défaut
          }}
        >
          <path
            d="M1.5 70.5203H296.5C296.5 70.5203 -24.5774 145.666 36.5 64.5203C64.9354 26.7418 140.5 2.52029 140.5 2.52029L69.5 143.52C69.5 143.52 138.854 1.30253 147.5 48.5203C149.54 59.6603 142.5 77.5203 142.5 77.5203C142.5 77.5203 154.175 39.5382 165.5 48.5203C174.373 55.5577 164.5 77.5203 164.5 77.5203C164.5 77.5203 180.175 37.9761 191.5 48.5203C199.789 56.2375 179.5 77.5203 179.5 77.5203"
            stroke="#141414"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="212" cy="38.0203" r="2.5" fill="#141414" />
          <circle cx="237" cy="26.0203" r="2.5" fill="#141414" />
          <circle cx="263" cy="15.0203" r="2.5" fill="#141414" />
        </svg>

        {/* Compteur de progression */}
        <div
          ref={counterRef}
          style={{
            fontSize: 'clamp(4rem, 12vw, 8rem)',
            fontFamily: 'var(--font-clash-display)',
            fontWeight: 700,
            color: '#141414',
            lineHeight: 1,
            letterSpacing: '-0.02em'
          }}
        >
          {progress.toString().padStart(2, '0')}%
        </div>

        {/* Texte de chargement */}
        <div style={{
          fontFamily: 'var(--font-generale-sans)',
          fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
          color: '#141414',
          opacity: 0.6,
          letterSpacing: '0.2em',
          textTransform: 'uppercase'
        }}>
          Loading Experience
        </div>

        {/* Barre de progression */}
        <div style={{
          width: 'min(80vw, 400px)',
          height: '2px',
          backgroundColor: 'rgba(20,20,20,0.1)',
          borderRadius: '2px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: `${progress}%`,
            backgroundColor: '#141414',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    </div>
  );
};

export { HeroLoader };

// SCRIPT À INJECTER DANS layout.tsx (avant le body)
export const InitialLoaderScript = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `
        (function() {
          const isRefresh = performance.getEntriesByType('navigation')[0]?.type === 'reload';
          const hasSeenLoader = sessionStorage.getItem('hasSeenLoader');
          
          if (isRefresh || !hasSeenLoader) {
            document.documentElement.classList.add('initial-load');
          }
        })();
      `
    }}
  />
);

// Hero.tsx avec gestion intelligente du loader
export function HeroWithSmartLoader({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Détecte si c'est un refresh (performance.navigation.type === 1)
    const isRefresh = 
      (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)?.type === 'reload';
    
    // Détecte si on vient d'une autre page de l'app
    const hasSeenLoader = sessionStorage.getItem('hasSeenLoader');
    
    // Si refresh OU première visite : montrer le loader
    if (isRefresh || !hasSeenLoader) {
      // Réinitialiser le flag si c'est un refresh
      if (isRefresh) {
        sessionStorage.removeItem('hasSeenLoader');
      }
      
      // Cacher la navbar immédiatement
      document.body.classList.add('loader-active');
      setIsLoading(true);
    } else {
      // Skip le loader si déjà vu dans cette session (navigation interne)
      setIsLoading(false);
      setShowContent(true);
    }

    // Désactiver le scroll pendant le chargement
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('loader-active');
    };
  }, [isLoading]);

  const handleLoadComplete = () => {
    // Marquer qu'on a vu le loader dans cette session
    sessionStorage.setItem('hasSeenLoader', 'true');
    setIsLoading(false);
    
    // Délai pour la transition
    setTimeout(() => {
      setShowContent(true);
    }, 300);
  };

  return (
    <>
      {isLoading && <HeroLoader onLoadComplete={handleLoadComplete} />}
      
      <div
        style={{
          opacity: showContent ? 1 : 0,
          visibility: showContent ? 'visible' : 'hidden',
          transition: 'opacity 0.5s ease'
        }}
      >
        {children}
      </div>
    </>
  );
}

// Styles critiques à ajouter dans globals.css ou HeroLoader.css
const criticalStyles = `
/* Cache la navbar immédiatement au chargement initial */
body.loader-active .navbar-wrapper,
body.loader-active nav {
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  transition: none !important;
}

/* Empêche le flash de la signature SVG */
body.loader-active .hero canvas {
  visibility: hidden !important;
}

/* S'assure que le loader est au-dessus de tout */
.hero-loader-wrapper {
  z-index: 10000 !important;
}
`;

// Export du CSS pour copier dans votre fichier CSS
export const loaderStyles = criticalStyles;