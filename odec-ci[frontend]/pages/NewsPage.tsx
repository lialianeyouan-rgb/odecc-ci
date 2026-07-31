import React, { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import DOMPurify from "dompurify";
import { contentService } from '../services/contentService';
import { Article, ArticleImage } from '../types';
import { usePageTitle } from "../hooks/usePageTitle";
import { useMetaDescription } from "../hooks/useMetaDescription";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/api$/, "");

const buildImageUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("//")) return url;
  return `${API_BASE}${url}`;
};

const Lightbox: React.FC<{
  images: { url: string; caption?: string | null }[];
  current: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}> = ({ images, current, onClose, onPrev, onNext }) => {
  const image = images[current];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white text-3xl hover:text-odec-gold-400 transition-colors"
        onClick={onClose}
        aria-label="Fermer"
      >
        ✕
      </button>
      {images.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-odec-gold-400 transition-colors px-2"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label="Précédent"
          >
            ‹
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-odec-gold-400 transition-colors px-2"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label="Suivant"
          >
            ›
          </button>
        </>
      )}
      <div
        className="max-w-5xl max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.url}
          alt={image.caption || `Image ${current + 1}`}
          className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
        />
        {image.caption && (
          <p className="text-white text-center mt-4 text-sm opacity-80 max-w-lg">{image.caption}</p>
        )}
        <p className="text-gray-400 text-xs mt-2">{current + 1} / {images.length}</p>
      </div>
    </div>
  );
};

interface GalleryImage {
  url: string;
  caption?: string | null;
}

const ArticleImageGallery: React.FC<{ article: Article }> = ({ article }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allImages: GalleryImage[] = [];

  if (article.images && article.images.length > 0) {
    article.images.forEach((img: ArticleImage) => {
      allImages.push({ url: buildImageUrl(img.imageUrl), caption: img.caption });
    });
  } else if (article.imageUrl) {
    allImages.push({ url: buildImageUrl(article.imageUrl), caption: null });
  }

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + allImages.length) % allImages.length)),
    [allImages.length]
  );
  const nextImage = useCallback(() =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % allImages.length)),
    [allImages.length]
  );

  if (allImages.length === 0) return null;

  if (allImages.length === 1) {
    return (
      <>
        <div
          className="mb-8 cursor-pointer group relative overflow-hidden rounded-2xl shadow-md"
          onClick={() => openLightbox(0)}
        >
          <img
            src={allImages[0].url}
            alt={article.title}
            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-3xl drop-shadow"></span>
          </div>
        </div>
        {lightboxIndex !== null && (
          <Lightbox images={allImages} current={lightboxIndex} onClose={closeLightbox} onPrev={prevImage} onNext={nextImage} />
        )}
      </>
    );
  }

  const [main, ...rest] = allImages;

  return (
    <>
      <div className="mb-8">
        <div
          className="cursor-pointer group relative overflow-hidden rounded-2xl shadow-md mb-3"
          onClick={() => openLightbox(0)}
        >
          <img
            src={main.url}
            alt={article.title}
            className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {allImages.length} photos
          </div>
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-3xl drop-shadow">🔍</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {rest.slice(0, 3).map((img, i) => {
            const isLast = i === 2 && rest.length > 3;
            return (
              <div
                key={i}
                className="relative cursor-pointer group overflow-hidden rounded-xl aspect-square"
                onClick={() => openLightbox(i + 1)}
              >
                <img
                  src={img.url}
                  alt={img.caption || `Photo ${i + 2}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {isLast && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white text-xl font-bold">+{rest.length - 3}</span>
                  </div>
                )}
              </div>
            );
          })}
          {rest.length === 0 && (
            <div className="col-span-4" />
          )}
        </div>
      </div>
      {lightboxIndex !== null && (
        <Lightbox images={allImages} current={lightboxIndex} onClose={closeLightbox} onPrev={prevImage} onNext={nextImage} />
      )}
    </>
  );
};

const NewsPage: React.FC = () => {
  usePageTitle("Actualites | ODEC-CI");
  useMetaDescription("Actualites, communiques et rapports officiels de l'ODEC-CI.");
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const data = await contentService.getArticles();
        setArticles([...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

        if (location.hash) {
          const id = location.hash.replace('#', '');
          setTimeout(() => {
            const element = document.getElementById(id);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
          }, 200);
        }
      } catch (error) {
        console.error("Erreur chargement articles", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [location]);

  const isYouTubeUrl = (url?: string) => {
    return url && (url.includes('youtube.com') || url.includes('youtu.be'));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-odec-blue-900 py-16 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold font-montserrat">Actualités & Communiqués</h1>
          <p className="mt-2 text-lg text-gray-300">Suivez nos dernières actions et nos rapports officiels.</p>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="space-y-12">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border animate-pulse">
                  <div className="bg-gray-200 h-64 w-full rounded-2xl mb-8"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-16">
              {articles.map((article: Article) => (
                <article
                  key={article.id}
                  id={String(article.id)}
                  className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-gray-100 scroll-mt-24 transition-transform hover:translate-y-[-4px]"
                >
                  {article.videoUrl ? (
                    <div className="aspect-video mb-8 rounded-2xl overflow-hidden bg-black shadow-lg">
                      {isYouTubeUrl(article.videoUrl) ? (
                        <iframe
                          className="w-full h-full"
                          src={article.videoUrl.replace('watch?v=', 'embed/')}
                          title={article.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video className="w-full h-full object-contain" controls src={article.videoUrl}>
                          Votre navigateur ne supporte pas la lecture de vidéos.
                        </video>
                      )}
                    </div>
                  ) : (
                    <ArticleImageGallery article={article} />
                  )}

                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <span className="font-semibold">
                      {new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="mx-3 opacity-30">|</span>
                    <span className="inline-block bg-odec-blue-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {article.category}
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold font-montserrat text-odec-blue-900 mb-6 leading-tight">
                    {article.title}
                  </h2>

                  <div
                    className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-8"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}
                  />

                  {article.pdfUrl && (
                    <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 text-red-600 flex items-center justify-center rounded-xl text-xl">📄</div>
                        <div>
                          <p className="font-bold text-odec-blue-900">Document Officiel Joint</p>
                          <p className="text-sm text-gray-500">Format PDF disponible en téléchargement</p>
                        </div>
                      </div>
                      <a
                        href={article.pdfUrl}
                        download={`document-odec-ci-${article.id}.pdf`}
                        className="w-full sm:w-auto px-6 py-3 bg-odec-blue-900 text-white font-bold rounded-xl hover:bg-odec-blue-800 transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <span>⬇️</span> Télécharger le fichier
                      </a>
                    </div>
                  )}
                </article>
              ))}

              {articles.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 text-xl font-montserrat italic">Aucun contenu n'est disponible pour le moment.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
