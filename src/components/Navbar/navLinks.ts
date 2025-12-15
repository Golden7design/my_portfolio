export interface MenuLink {
  label: string;
  href?: string; // pour futur ancrage
}

export const menuLinks: MenuLink[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#About" },
  { label: "Works", href: "#works" },
  { label: "Skills", href: "#skills" },
  { label: "Say Hello!", href: "#sayhello" },
];
