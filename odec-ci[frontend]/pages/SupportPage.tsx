import React from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { useMetaDescription } from "../hooks/useMetaDescription";

const DONATION_LOGOS = [
  {
    src: "/logos/orange-money.svg",
    alt: "Logo Orange Money",
  },
  {
    src: "/logos/wave.png",
    alt: "Logo Wave",
  },
];

const SupportPage: React.FC = () => {
  usePageTitle("Faire un don | ODEC-CI");
  useMetaDescription(
    "Contribuez a la mission de l'ODEC-CI par un don, un appui logistique ou un engagement spirituel."
  );

  return (
    <div className="bg-gray-50">
      <section className="relative overflow-hidden bg-odec-blue-900 py-20 text-white md:py-28">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://picsum.photos/seed/odec-support/1600/900"
            alt="Communaute soutenant l'ODEC-CI"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <p className="animate-[fadeIn_0.6s_ease-out] text-xs font-semibold uppercase tracking-[0.2em] text-odec-gold-500 md:text-sm">
              Faire un don a l&apos;ODEC-CI
            </p>

            <h1 className="animate-[slideDown_0.8s_ease-out] text-3xl font-extrabold leading-tight md:text-4xl lg:text-5xl">
              Soutenez une mission de paix, de plaidoyer et de protection des
              Eglises en Cote d&apos;Ivoire.
            </h1>

            <p className="animate-[slideLeft_0.9s_ease-out] text-base text-gray-200 md:text-lg">
              Votre contribution permet a l&apos;ODEC-CI de poursuivre ses actions
              de plaidoyer, d&apos;assistance juridique et de cohesion sociale, avec
              un acces direct aux coordonnees de don des l&apos;arrivee sur la page.
            </p>

            {/* Direct donation details stay at the top; contact is intentionally moved later. */}
            <div className="inline-block rounded-2xl border border-white/20 bg-white/10 px-6 py-5 backdrop-blur-sm animate-[slideRight_1s_ease-out]">
              <div className="mb-3 flex items-center gap-3">
                {DONATION_LOGOS.map((logo) => (
                  <img
                    key={logo.alt}
                    src={logo.src}
                    alt={logo.alt}
                    className="h-8 w-auto rounded bg-white p-1"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ))}
              </div>
              <p className="mb-1 text-sm text-gray-200">Coordonnees de don</p>
              <p className="text-2xl font-extrabold text-odec-gold-500 md:text-3xl">
                +225 07 47 14 17 11
              </p>
            </div>

            <p className="animate-[slideUp_1.1s_ease-out] text-sm text-gray-300">
              Les dons peuvent etre effectues sans etape de contact prealable.
              Le formulaire de contact reste disponible en fin de page pour
              toute demande complementaire.
            </p>
          </div>
        </div>

        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }

            @keyframes slideDown {
              from { opacity: 0; transform: translateY(-40px); }
              to { opacity: 1; transform: translateY(0); }
            }

            @keyframes slideUp {
              from { opacity: 0; transform: translateY(40px); }
              to { opacity: 1; transform: translateY(0); }
            }

            @keyframes slideLeft {
              from { opacity: 0; transform: translateX(-40px); }
              to { opacity: 1; transform: translateX(0); }
            }

            @keyframes slideRight {
              from { opacity: 0; transform: translateX(40px); }
              to { opacity: 1; transform: translateX(0); }
            }
          `}
        </style>
      </section>

      {/* Donation wording is softened into a clearer call to action. */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="rounded-xl border-t-4 border-odec-gold-500 bg-white p-8 shadow-lg">
              <h2 className="mb-3 text-2xl font-bold text-odec-blue-900">
                Donner pour agir
              </h2>
              <p className="mb-4 text-gray-600">
                Participez au financement des actions de plaidoyer, des missions
                de sensibilisation et des projets institutionnels de
                l&apos;ODEC-CI.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Dons ponctuels ou reguliers des Eglises, ministeres et particuliers.</li>
                <li>• Contributions speciales pour les campagnes nationales.</li>
                <li>• Soutien dedie aux frais juridiques et administratifs.</li>
              </ul>
            </div>

            <div className="rounded-xl border-t-4 border-odec-blue-800 bg-white p-8 shadow-lg">
              <h2 className="mb-3 text-2xl font-bold text-odec-blue-900">
                Apporter des ressources utiles
              </h2>
              <p className="mb-4 text-gray-600">
                Mettez vos ressources au service de la mission.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Mise a disposition de salles.</li>
                <li>• Appui en communication.</li>
                <li>• Services de conseil.</li>
              </ul>
            </div>

            <div className="rounded-xl border-t-4 border-odec-blue-700 bg-white p-8 shadow-lg">
              <h2 className="mb-3 text-2xl font-bold text-odec-blue-900">
                Porter la mission avec nous
              </h2>
              <p className="mb-4 text-gray-600">
                Engagez votre reseau dans la priere et la mobilisation.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Reseaux d&apos;intercession.</li>
                <li>• Mobilisation lors des campagnes.</li>
                <li>• Relais d&apos;information.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-odec-blue-800 py-12 text-white">
        <div className="container mx-auto grid gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8 lg:items-center">
          <div>
            {/* Contact remains available, but only after the direct donation information. */}
            <h2 className="mb-3 text-2xl font-bold md:text-3xl">
              Finaliser votre contribution
            </h2>
            <p className="mb-4 text-gray-200">
              Les coordonnees ci-dessous restent disponibles pour un don rapide.
              Si vous avez besoin d&apos;un accompagnement, notre equipe peut
              ensuite vous repondre via la page de contact.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-odec-blue-900"
            >
              Contacter l&apos;equipe
            </Link>
          </div>

          <div className="space-y-4 rounded-xl bg-odec-blue-900 p-6 shadow-lg md:p-8">
            <div className="flex flex-wrap items-center gap-3">
              {DONATION_LOGOS.map((logo) => (
                <img
                  key={`footer-${logo.alt}`}
                  src={logo.src}
                  alt={logo.alt}
                  className="h-10 w-auto rounded bg-white p-1.5"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ))}
            </div>
            <p className="text-2xl font-extrabold text-odec-gold-500">
              +225 07 47 14 17 11
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
