import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const Footer: React.FC = () => {
  return (
    <footer className="bg-odec-blue-900 text-white">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Logo className="mb-4 h-12" />
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Navigation</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link to="/" className="transition-colors hover:text-odec-gold-500">
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/a-propos"
                  className="transition-colors hover:text-odec-gold-500"
                >
                  A propos
                </Link>
              </li>
              <li>
                <Link
                  to="/actualites"
                  className="transition-colors hover:text-odec-gold-500"
                >
                  Actualites
                </Link>
              </li>
              <li>
                {/* The support entry is renamed to a clearer donation call to action. */}
                <Link
                  to="/soutenir"
                  className="transition-colors hover:text-odec-gold-500"
                >
                  Faire un don
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="transition-colors hover:text-odec-gold-500"
                >
                  Nous contacter
                </Link>
              </li>
              <li className="border-t border-odec-blue-800 pt-4">
                <Link
                  to="/admin/login"
                  className="text-xs font-bold uppercase tracking-widest text-odec-gold-500 hover:underline"
                >
                  Espace Admin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Contact Info</h3>
            <address className="not-italic space-y-2 text-gray-400">
              <p>Lot 170 Ilot 16 Synatresor, Logement 275 - 08 BP 4179, Abidjan</p>
              <div className="space-y-1">
                <p>
                  Email principal:{" "}
                  <a
                    href="mailto:contact@odec-ci.org"
                    className="transition-colors hover:text-odec-gold-500"
                  >
                    contact@odec-ci.org
                  </a>
                </p>
                <p className="border-t border-odec-blue-800 pt-2 text-sm text-gray-400">
                  <span className="font-semibold text-white">Contacts directs</span>
                </p>
                <ul className="space-y-1 text-sm">
                  <li>
                    President:{" "}
                    <a
                      href="mailto:president@odec-ci.org"
                      className="transition-colors hover:text-odec-gold-500"
                    >
                      president@odec-ci.org
                    </a>
                  </li>
                  <li>
                    Secretaire:{" "}
                    <a
                      href="mailto:secretaire@odec-ci.org"
                      className="transition-colors hover:text-odec-gold-500"
                    >
                      secretaire@odec-ci.org
                    </a>
                  </li>
                  <li>
                    Infos:{" "}
                    <a
                      href="mailto:info@odec-ci.org"
                      className="transition-colors hover:text-odec-gold-500"
                    >
                      info@odec-ci.org
                    </a>
                  </li>
                </ul>
              </div>
              <p>Telephone: +225 07 07 90 79 26</p>
            </address>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} ODEC-CI. Tous droits reserves.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
