import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NewsCard from "../components/NewsCard";
import { contentService } from "../services/contentService";
import { Article } from "../types";
import president from "@/assets/logo2.jpg";
import presidentImg from "@/assets/logo3.jpg";
import { usePageTitle } from "../hooks/usePageTitle";
import { useMetaDescription } from "../hooks/useMetaDescription";

const HomePage: React.FC = () => {
  usePageTitle("ODEC-CI | Organisation pour les Droits des Eglises et des Chretiens");
  useMetaDescription(
    "Site officiel de l'ODEC-CI. Decouvrez notre mission, nos actions, nos actualites et comment nous soutenir."
  );
  const [news, setNews] = useState<Article[]>([]);
  const [newsError, setNewsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await contentService.getArticles();
        setNews(data.slice(0, 3));
        setNewsError(null);
      } catch (error) {
        console.error("Error loading news on homepage", error);
        setNews([]);
        setNewsError(
          "Impossible de charger les actualites pour le moment. Veuillez reessayer plus tard.",
        );
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero with a donation CTA visible immediately on arrival. */}
      <section className="relative bg-odec-blue-900 py-20 text-white md:py-32">
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/seed/hero/1920/1080"
            alt="ODEC-CI communaute chretienne"
            className="h-full w-full object-cover opacity-20"
          />
        </div>
        <div className="container relative mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-6xl">
            Une Eglise unie pour la paix et la cohesion
          </h1>
          <p className="mx-auto mb-8 max-w-3xl text-lg text-gray-300 md:text-xl">
            L&apos;Organisation pour les Droits des Eglises et des Chretiens de
            Cote d&apos;Ivoire (ODEC-CI) oeuvre pour la defense de la liberte
            religieuse, l&apos;unite du Corps du Christ et la promotion de la paix
            nationale.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/soutenir"
              className="inline-flex items-center justify-center rounded-full bg-odec-gold-500 px-8 py-3 font-bold text-odec-blue-900 shadow-lg transition-transform hover:scale-105 hover:bg-odec-gold-600"
            >
              Faire un don
            </Link>
            <Link
              to="/a-propos"
              className="rounded-full bg-odec-gold-500 px-8 py-3 font-bold text-odec-blue-900 transition-transform hover:scale-105 hover:bg-odec-gold-600"
            >
              Decouvrir l&apos;ODEC-CI
            </Link>
            <Link
              to="/contact"
              className="rounded-full border-2 border-white bg-transparent px-8 py-3 font-bold transition-colors hover:bg-white hover:text-odec-blue-900"
            >
              Nous contacter
            </Link>
          </div>
          <div className="mt-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm text-gray-100 backdrop-blur">
            {/* Repeated helper text keeps the donation route obvious without changing the visual tone. */}
            Vos dons soutiennent directement le plaidoyer, l&apos;assistance et
            les actions de paix.
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-odec-blue-900">
                Bienvenue a l&apos;ODEC-CI
              </h2>
              <p className="mb-4 leading-relaxed text-gray-600">
                L&apos;ODEC-CI est un organe de plaidoyer chretien dedie a la
                defense des droits et libertes des Eglises, des ministres du
                culte et des chretiens, tant au niveau national
                qu&apos;international.
              </p>
              <p className="leading-relaxed text-gray-600">
                Elle agit comme un cadre federateur pour promouvoir une Eglise
                responsable, structuree et engagee en faveur de la paix, de
                l&apos;unite, de la cohesion sociale et du vivre-ensemble en Cote
                d&apos;Ivoire.
              </p>
            </div>
            <div>
              <img
                src={president}
                alt="Membres de l'ODEC-CI"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Support teaser now speaks first to donation action and then points to the full page. */}
      <section className="bg-odec-blue-900 py-16 text-white">
        <div className="container mx-auto grid items-center gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-3xl font-bold">Contribuer a la mission de l&apos;ODEC-CI</h2>
            <p className="mb-4 leading-relaxed text-gray-200">
              En soutenant l&apos;ODEC-CI, vous participez concretement a la
              defense des libertes religieuses, a l&apos;assistance des Eglises et a
              la promotion de la paix et de la cohesion sociale en Cote
              d&apos;Ivoire.
            </p>
            <p className="text-sm text-gray-300">
              Eglises, ministeres, partenaires et fideles peuvent s&apos;engager
              par la priere, les dons financiers, le soutien materiel ou les
              partenariats institutionnels.
            </p>
          </div>
          <div className="flex md:justify-end">
            <div className="w-full rounded-2xl border border-white/20 bg-white/10 p-6 text-center shadow-lg backdrop-blur md:w-auto">
              <p className="mb-4 text-sm text-gray-200">
                Un espace dedie vous permet de faire un don rapidement.
              </p>
              <Link
                to="/soutenir"
                className="inline-flex items-center justify-center rounded-full bg-odec-gold-500 px-6 py-3 font-bold text-odec-blue-900 shadow-md transition-transform hover:scale-105 hover:bg-odec-gold-600"
              >
                Acceder aux dons
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-odec-blue-800 py-16 text-white">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <img
            src={presidentImg}
            alt="President de l'ODEC-CI"
            className="mx-auto mb-4 h-24 w-24 rounded-full border-4 border-odec-gold-500"
          />
          <h2 className="mb-4 text-3xl font-bold">Message du President</h2>
          <blockquote className="mx-auto mb-6 max-w-3xl text-xl italic text-gray-200">
            "L&apos;ODEC est un outil d&apos;union de l&apos;Eglise, un cadre de
            rassemblement pour batir une Eglise credible, responsable et
            porteuse de paix, d&apos;unite et de reconciliation pour notre nation."
          </blockquote>
          <Link
            to="/le-president"
            className="font-bold text-odec-gold-500 transition-colors hover:text-white"
          >
            Lire le message complet →
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-odec-blue-900">
            Actualites & Communiques
          </h2>
          {newsError && (
            <p className="mb-6 text-center text-red-600">{newsError}</p>
          )}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {news.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              to="/actualites"
              className="rounded-full bg-odec-blue-900 px-8 py-3 font-bold text-white transition-transform hover:scale-105 hover:bg-odec-blue-800"
            >
              Voir toutes les actualites
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
