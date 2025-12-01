export interface MenuLink {
  label: string;
  href?: string; // pour futur ancrage
}

export const menuLinks: MenuLink[] = [
  { label: "Home", href: "#home" },
  { label: "Biography", href: "#biography" },
  { label: "Works", href: "#works" },
  { label: "Skills", href: "#skills" },
  { label: "Say Hello!", href: "#sayhello" },
];
