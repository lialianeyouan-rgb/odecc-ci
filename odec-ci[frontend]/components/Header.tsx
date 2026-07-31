import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "./Logo";

const NavItem: React.FC<{
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `block rounded px-3 py-2 transition-colors duration-200 ${
        isActive
          ? "bg-odec-blue-900 text-white lg:bg-transparent lg:text-odec-gold-500"
          : "text-odec-blue-900 hover:bg-odec-gold-200 lg:hover:bg-transparent lg:hover:text-odec-gold-500"
      }`
    }
  >
    {children}
  </NavLink>
);

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-odec-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-20 items-center justify-between">
          <NavLink to="/" className="flex items-center" onClick={closeMenu}>
            <Logo className="h-12" />
          </NavLink>

          <div className="flex lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              aria-label="Menu principal"
              aria-expanded={isMenuOpen}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md p-2 text-odec-blue-800 hover:bg-odec-white-100 focus:outline-none focus:ring-2 focus:ring-odec-gold-500"
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>

          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } absolute left-0 top-20 w-full bg-odec-white-100 shadow-lg lg:static lg:block lg:w-auto lg:bg-transparent lg:shadow-none`}
          >
            <ul className="flex flex-col p-4 font-medium lg:flex-row lg:flex-nowrap lg:space-x-6 lg:p-0">
              <li>
                <NavItem to="/" onClick={closeMenu}>
                  Accueil
                </NavItem>
              </li>
              <li>
                <NavItem to="/a-propos" onClick={closeMenu}>
                  A propos
                </NavItem>
              </li>
              <li>
                <NavItem to="/le-president" onClick={closeMenu}>
                  Le President
                </NavItem>
              </li>
              <li>
                <NavItem to="/actualites" onClick={closeMenu}>
                  Actualites
                </NavItem>
              </li>
              <li>
                <NavItem to="/galerie" onClick={closeMenu}>
                  Galerie
                </NavItem>
              </li>
              <li>
                <NavItem to="/soutenir" onClick={closeMenu}>
                  Faire un don
                </NavItem>
              </li>
              <li>
                <NavItem to="/contact" onClick={closeMenu}>
                  Contact
                </NavItem>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
