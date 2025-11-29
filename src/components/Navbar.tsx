import React from "react";

interface NavbarProps {
  title?: string;
}

const Navbar: React.FC<NavbarProps> = ({ title = "Mon Portfolio" }) => {
  return (
    <nav className="bg-blue-500 text-white p-4">
      <h1 className="text-2xl font-bold">{title}</h1>
    </nav>
  );
};

export default Navbar;