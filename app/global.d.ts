// global.d.ts
export {}; // pour s'assurer que c'est un module

declare global {
  interface Window {
    SplitText?: unknown;
  }
}