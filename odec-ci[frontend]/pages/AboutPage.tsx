import React from "react";
import { MissionValue } from "../types";
import peopleImg from "@/assets/logo5.jpg";
import { usePageTitle } from "../hooks/usePageTitle";
import { useMetaDescription } from "../hooks/useMetaDescription";

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const RocketIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

const values: MissionValue[] = [
  {
    icon: RocketIcon,
    title: "Notre Mission",
    description:
      "Defendre la liberte religieuse et les droits des Eglises, des ministres du culte et des chretiens, tout en oeuvrant pour la paix, la cohesion sociale et le vivre-ensemble en Cote d'Ivoire et a l'international.",
  },
  {
    icon: EyeIcon,
    title: "Notre Vision",
    description:
      "Batir une Eglise unie, credible et responsable, capable de parler d'une seule voix et de contribuer activement a la stabilite, a la reconciliation et au developpement harmonieux de la societe.",
  },
  {
    icon: HeartIcon,
    title: "Nos Valeurs",
    description:
      "Unite, responsabilite, integrite, paix, justice et respect des lois. Ces valeurs fondent notre engagement spirituel, social et institutionnel.",
  },
];

const advocacyHighlights = [
  {
    title: "Plaidoyer institutionnel",
    description:
      "L’ODEC agit comme un organe de plaidoyer auprès des institutions nationales et internationales afin de défendre la liberté religieuse et les droits des Églises, des ministres du culte et des chrétiens, notamment auprès des instances parlementaires et juridictionnelles.",
  },
  {
    title: "Assistance juridique",
    description:
      "L’Organisation bénéficie de l’accompagnement d’avocats et de juristes chargés de conseiller, d’assister et de protéger les Églises et les ministères du culte sur les questions juridiques, fiscales et associatives, dans le respect des lois de la République.",
  },
  {
    title: "Rapports et documentation",
    description:
      "L’ODEC documente les réalités du paysage chrétien ivoirien à travers des communiqués officiels, des rapports et des analyses, afin de prévenir les dérives, éclairer l’opinion publique et promouvoir une Église responsable, crédible et structurée.",
  },
  {
    title: "Paix et cohesion sociale",
    description:
      "L’ODEC œuvre pour l’unité du Corps du Christ à travers l’intercession nationale, le dialogue entre confessions chrétiennes et la mobilisation des responsables religieux pour la paix, la cohésion sociale, le vivre-ensemble et la stabilité de la Côte d’Ivoire.",
  },
];

const AboutPage: React.FC = () => {
  usePageTitle("A propos | ODEC-CI");
  useMetaDescription(
    "Presentation de l'ODEC-CI : mission, vision, valeurs, histoire et engagement institutionnel."
  );

  return (
    <div className="bg-white">
      <header className="bg-odec-blue-900 py-16 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">A propos de l'ODEC-CI</h1>
          <p className="mt-2 text-lg text-gray-300">
            Une organisation au service de l'unite de l'Eglise, de la paix et
            de la cohesion sociale.
          </p>
        </div>
      </header>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 text-center md:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="p-6">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-odec-gold-500 text-odec-blue-900">
                  <value.icon className="h-10 w-10" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-odec-blue-900">
                  {value.title}
                </h2>
                <p className="leading-relaxed text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container mx-auto grid gap-12 px-4 md:grid-cols-2 md:items-center">
          <div>
            <img
              src={peopleImg}
              alt="ODEC-CI - Installation du Bureau National"
              className="rounded-lg shadow-xl"
            />
          </div>
          <div>
            <h2 className="mb-4 text-3xl font-bold text-odec-blue-900">
              Notre histoire
            </h2>
            <p className="mb-4 leading-relaxed text-gray-600">
              L'Organisation pour la Defense des Droits des Eglises et des
              Chretiens (ODEC-CI) est un organe de plaidoyer chretien engage
              dans la defense des libertes religieuses, la protection des
              ministeres du culte et la promotion d'une Eglise structuree et
              responsable. Installee officiellement a Abidjan, l'ODEC rassemble
              les principales confessions chretiennes autour d'un ideal commun :
              l'unite, la paix et la cohesion sociale.
            </p>
            <p className="leading-relaxed text-gray-600">
              A travers ses actions de plaidoyer national et international, son
              accompagnement juridique et ses initiatives spirituelles,
              l'ODEC-CI oeuvre pour restaurer la credibilite de l'Eglise et
              renforcer son role dans la stabilite et le bien-etre de la
              societe ivoirienne.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* The former plaidoyer content is intentionally merged into the About page. */}
          <div className="mb-12 max-w-3xl">
            <h2 className="mb-4 text-3xl font-bold text-odec-blue-900">
              Notre engagement en action
            </h2>
            <p className="leading-relaxed text-gray-600">
              Pour renforcer son role de cadre federateur, l'ODEC-CI deploie
              ses actions de plaidoyer, d'accompagnement et de mobilisation
              dans une meme dynamique de service envers l'Eglise et la Nation.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {advocacyHighlights.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg"
              >
                <h3 className="mb-3 text-2xl font-bold text-odec-blue-900">
                  {item.title}
                </h3>
                <p className="leading-relaxed text-gray-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold text-odec-blue-900">
            Textes fondateurs
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-gray-600">
            Les statuts et reglements interieurs de l'ODEC-CI definissent son
            cadre juridique, sa gouvernance et ses principes d'action. Ils
            garantissent une organisation transparente, conforme aux lois de la
            Republique et fidele aux valeurs chretiennes.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
