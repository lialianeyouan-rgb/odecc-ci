import React from "react";
import presidentImg from "@/assets/logo6.jpg";
import { usePageTitle } from "../hooks/usePageTitle";
import { useMetaDescription } from "../hooks/useMetaDescription";

const PresidentPage: React.FC = () => {
  usePageTitle("Le President | ODEC-CI");
  useMetaDescription("Biographie et message institutionnel du President de l'ODEC-CI.");
  return (
    <div className="bg-gray-50">
      {/* Header */}
      <header className="bg-odec-blue-900 py-16 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold font-montserrat">Le Président</h1>
          <p className="mt-2 text-lg text-gray-300">
            Une vision au service de l’unité de l’Église, de la paix et de la cohésion nationale.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white p-8 rounded-lg shadow-xl -mt-24 relative">
          <div className="grid md:grid-cols-3 gap-8 items-start">

            {/* Colonne Biographie */}
            <div className="md:col-span-1 text-center">
              <img
                src={presidentImg}
                alt="Portrait officiel du Président de l'ODEC-CI"
                className="w-48 h-48 rounded-full mx-auto mb-4 border-4 border-odec-gold-500 shadow-md"
              />
              <h2 className="text-2xl font-bold text-odec-blue-900 font-montserrat">
                Révérend Marcel Kouamenan
              </h2>
              <p className="text-gray-500">
                Président national et mondial de l’ODEC
              </p>

              <div className="mt-6 border-t pt-6">
                <h3 className="text-xl font-semibold text-odec-blue-900 mb-3">
                  Biographie Officielle
                </h3>
                <p className="text-left text-gray-600 leading-relaxed">
                  Le Révérend Marcel Kouamenan est une figure majeure du paysage
                  chrétien ivoirien. Évangéliste engagé et leader spirituel,
                  il est reconnu pour son action en faveur de l’unité du Corps
                  du Christ, de la paix et de la responsabilité sociale de l’Église.
                  <br /><br />
                  Fondateur et président de l’Organisation pour les Droits des
                  Églises et des Chrétiens (ODEC), il œuvre depuis plusieurs années
                  pour la défense de la liberté religieuse, la protection des
                  ministres du culte et la crédibilité des Églises face aux
                  institutions nationales et internationales.
                  <br /><br />
                  Son ministère est marqué par un appel constant à mettre fin
                  aux dérives, aux excès médiatiques et aux pratiques qui nuisent
                  à l’image de l’Église, afin de restaurer une Église responsable,
                  structurée et fidèle aux valeurs de l’Évangile.
                </p>
              </div>
            </div>

            {/* Colonne Message Institutionnel */}
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold text-odec-blue-900 font-montserrat border-b-2 border-odec-gold-500 pb-2 mb-6">
                Message Institutionnel
              </h3>

              <div className="prose max-w-none text-gray-700 leading-loose">
                <p>Chers responsables d’Églises, partenaires et fidèles,</p>

                <p>
                  Servir Dieu est une responsabilité spirituelle, mais aussi
                  sociale et culturelle. L’Église a longtemps été reconnue comme
                  une institution responsable, une famille, un cadre de
                  rassemblement qui promeut la paix, la cohésion, l’unité et la
                  réconciliation. Aujourd’hui, il est de notre devoir de
                  restaurer cette crédibilité.
                </p>

                <p>
                  L’Organisation pour les Droits des Églises et des Chrétiens
                  (ODEC) a été créée pour défendre la liberté religieuse et les
                  droits des Églises, des ministres du culte et des chrétiens,
                  tant au niveau national qu’international
                </p>

                <p>
                  Notre vision est claire : permettre à l’Église de parler
                  d’une seule voix, de remplir efficacement sa mission
                  spirituelle et de contribuer activement à la stabilité, à
                  la paix et au bien-être social de la Côte d’Ivoire.
                </p>

                <ul>
                  <li>
                    <strong>Unité du Corps du Christ :</strong> rassembler toutes
                    les sensibilités chrétiennes autour d’un idéal commun de
                    paix, de cohésion et de réconciliation.
                  </li>
                  <li>
                    <strong>Plaidoyer et défense juridique :</strong> accompagner
                    et protéger les Églises et les ministres du culte face aux
                    défis juridiques et institutionnels.
                  </li>
                  <li>
                    <strong>Intercession nationale :</strong> promouvoir une
                    prière unifiée pour les autorités, la nation et le peuple,
                    afin que la Côte d’Ivoire demeure une terre de paix.
                  </li>
                  <li>
                    <strong>Lutte contre les dérives :</strong> prévenir les
                    excès, les spectacles et les pratiques qui fragilisent
                    l’image de l’Église.
                  </li>
                </ul>

                <p>
                  L’ODEC-CI a mis en place un Bureau national inclusif et
                  représentatif de la diversité ecclésiale ivoirienne, ainsi
                  que des représentations régionales afin de renforcer la
                  cohésion ecclésiale et rassurer les autorités sur le rôle
                  constructif des Églises.
                </p>

                <p>
                  J’invite toutes les Églises, confessions, ministères et
                  mouvements chrétiens à s’unir dans cette vision. Ensemble,
                  bâtissons une Église forte, responsable et engagée pour la
                  paix et le vivre-ensemble.
                </p>

                <p>
                  Que Dieu bénisse la Côte d’Ivoire, terre d’hospitalité,
                  d’espérance et de paix.
                </p>

                <p>
                  <strong>Révérend Marcel Kouamenan</strong>
                  <br />
                  <em>Président de l’ODEC</em>
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PresidentPage;
