
import React from 'react';
import ContactForm from '../components/ContactForm';
import { FacebookIcon, TwitterIcon, LinkedinIcon } from '../components/icons/SocialIcons';
import { usePageTitle } from "../hooks/usePageTitle";
import { useMetaDescription } from "../hooks/useMetaDescription";

const ContactPage: React.FC = () => {
  usePageTitle("Contact | ODEC-CI");
  useMetaDescription("Contactez l'ODEC-CI pour toute information, partenariat ou demande.");
  return (
    <div className="bg-gray-50">
      <header className="bg-odec-blue-900 py-16 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold font-montserrat">Nous Contacter</h1>
          <p className="mt-2 text-lg text-gray-300">Nous sommes à votre écoute. Prenez contact avec nous.</p>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-8 grid md:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-odec-blue-900 font-montserrat mb-6">Envoyez-nous un message</h2>
            <ContactForm />
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-odec-blue-900 font-montserrat mb-6">Nos Coordonnées</h2>
            
            <div>
              <h3 className="text-lg font-semibold text-odec-blue-800">Adresse du siège</h3>
              <p className="text-gray-600 mt-1">Lot 170 Ilot 16 Synatresor, Logement 275 - 08 BP 4179, Abidjan</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-odec-blue-800">
                Email
              </h3>
              <a
                href="mailto:contact@odec-ci.org"
                className="text-gray-600 hover:text-odec-gold-600 transition-colors mt-1 block"
              >
                contact@odec-ci.org
              </a>

              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm font-semibold text-odec-blue-800 mb-2">
                  Contacts directs
                </p>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>
                    <span className="font-medium">Président :</span>{" "}
                    <a
                      href="mailto:president@odec-ci.org"
                      className="hover:text-odec-gold-600 transition-colors"
                    >
                      president@odec-ci.org
                    </a>
                  </li>
                  <li>
                    <span className="font-medium">Secrétaire :</span>{" "}
                    <a
                      href="mailto:secretaire@odec-ci.org"
                      className="hover:text-odec-gold-600 transition-colors"
                    >
                      secretaire@odec-ci.org
                    </a>
                  </li>
                  <li>
                    <span className="font-medium">Infos générales :</span>{" "}
                    <a
                      href="mailto:info@odec-ci.org"
                      className="hover:text-odec-gold-600 transition-colors"
                    >
                      info@odec-ci.org
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-odec-blue-800">Téléphone</h3>
              <p className="text-gray-600 mt-1">+225 07 07 90 79 26</p>
            </div>

            {/* <div>
              <h3 className="text-lg font-semibold text-odec-blue-800">Suivez-nous</h3>
              <div className="flex mt-2 space-x-4">
                <a href="#" className="text-odec-blue-900 hover:text-odec-gold-500 transition-colors"><FacebookIcon className="w-8 h-8" /></a>
                <a href="#" className="text-odec-blue-900 hover:text-odec-gold-500 transition-colors"><TwitterIcon className="w-8 h-8" /></a>
                <a href="#" className="text-odec-blue-900 hover:text-odec-gold-500 transition-colors"><LinkedinIcon className="w-8 h-8" /></a>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
