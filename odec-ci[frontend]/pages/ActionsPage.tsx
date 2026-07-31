import React from 'react';
import { Link } from 'react-router-dom';
import { ALL_NEWS } from '../data/content';
import { usePageTitle } from "../hooks/usePageTitle";
import { useMetaDescription } from "../hooks/useMetaDescription";

// Icônes existantes
const DocumentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const GavelIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MegaphoneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.356a1.76 1.76 0 011.17-2.175l.334-.112a1.76 1.76 0 001.328-1.879l-.02-1.252a1.76 1.76 0 011.76-1.76h.002z" />
  </svg>
);

// Nouvelle icône pour le 4ᵉ élément
const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8c0-2.21 1.79-4 4-4 1.66 0 3 1.34 3 3 0 1.66-1.34 3-3 3H4v10h16V8h-4c-1.66 0-3-1.34-3-3 0-1.66 1.34-3 3-3h4V2H4v6z" />
  </svg>
);

// Helper pour filtrer les communiqués
const capitalize = (chaine: string) => {
  return chaine.charAt(0).toUpperCase() + chaine.slice(1).toLowerCase();
}

const communiques = ALL_NEWS.filter(article => 
  capitalize(article.category) === 'Communiqué' || capitalize(article.category) === 'Plaidoyer'
);

const ActionsPage: React.FC = () => {
  usePageTitle("Actions & Plaidoyer | ODEC-CI");
  useMetaDescription(
    "Actions, plaidoyer, assistance juridique, rapports et initiatives pour la paix en Cote d'Ivoire."
  );
  return (
    <div className="bg-white">
      <header className="bg-odec-blue-900 py-16 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold font-montserrat">Actions & Plaidoyer</h1>
          <p className="mt-2 text-lg text-gray-300">
            Un cadre d’action pour l’unité de l’Église, la paix et la défense des libertés religieuses.
          </p>
        </div>
      </header>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-odec-blue-900 font-montserrat mb-12">
            Nos missions au service des Églises et de la Nation
          </h2>

          {/* Grille responsive : 1 colonne mobile, 4 colonnes desktop */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

            <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <MegaphoneIcon className="w-16 h-16 mx-auto text-odec-gold-500 mb-4" />
              <h3 className="text-xl font-bold text-odec-blue-900 mb-2">
                Plaidoyer Institutionnel
              </h3>
              <p className="text-gray-600">
                L’ODEC agit comme un organe de plaidoyer auprès des institutions
                nationales et internationales afin de défendre la liberté
                religieuse et les droits des Églises, des ministres du culte et
                des chrétiens, notamment auprès de l’ECOSOC des Nations Unies,
                des instances parlementaires et juridictionnelles.
              </p>
            </div>

            <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <GavelIcon className="w-16 h-16 mx-auto text-odec-gold-500 mb-4" />
              <h3 className="text-xl font-bold text-odec-blue-900 mb-2">
                Assistance Juridique
              </h3>
              <p className="text-gray-600">
                L’Organisation bénéficie de l’accompagnement d’avocats et de
                juristes chargés de conseiller, d’assister et de protéger les
                Églises et les ministères du culte sur les questions juridiques,
                fiscales et associatives, dans le respect des lois de la
                République.
              </p>
            </div>

            <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <DocumentIcon className="w-16 h-16 mx-auto text-odec-gold-500 mb-4" />
              <h3 className="text-xl font-bold text-odec-blue-900 mb-2">
                Rapports & Documentation
              </h3>
              <p className="text-gray-600">
                L’ODEC documente les réalités du paysage chrétien ivoirien à
                travers des communiqués officiels, des rapports et des analyses,
                afin de prévenir les dérives, éclairer l’opinion publique et
                promouvoir une Église responsable, crédible et structurée.
              </p>
            </div>

            <div className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <HeartIcon className="w-16 h-16 mx-auto text-odec-gold-500 mb-4" />
              <h3 className="text-xl font-bold text-odec-blue-900 mb-2">
                Paix & Cohésion Sociale
              </h3>
              <p className="text-gray-600">
                L’ODEC œuvre pour l’unité du Corps du Christ à travers
                l’intercession nationale, le dialogue entre confessions
                chrétiennes et la mobilisation des responsables religieux pour
                la paix, la cohésion sociale, le vivre-ensemble et la stabilité
                de la Côte d’Ivoire.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ActionsPage;
