import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { albumService } from "../services/albumService";
import { Album, AlbumImage } from "../types";
import { usePageTitle } from "../hooks/usePageTitle";
import { useMetaDescription } from "../hooks/useMetaDescription";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/api$/, "");

const buildImageUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("blob:")) return url;
  return `${API_BASE}${url}`;
};

const Spinner = ({ size = 40 }: { size?: number }) => (
  <div
    className="animate-spin rounded-full border-4 border-gray-300 border-t-odec-gold-500 mx-auto"
    style={{ width: size, height: size }}
  />
);

const Lightbox: React.FC<{
  images: AlbumImage[];
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
        className="absolute top-4 right-4 text-white text-3xl hover:text-odec-gold-400 transition-colors z-10"
        onClick={onClose}
        aria-label="Fermer"
      >
        ✕
      </button>

      {images.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-odec-gold-400 transition-colors z-10 px-2"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label="Image précédente"
          >
            ‹
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl hover:text-odec-gold-400 transition-colors z-10 px-2"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label="Image suivante"
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
          src={buildImageUrl(image.imageUrl)}
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

const AlbumCard: React.FC<{ album: Album }> = ({ album }) => {
  const count = album._count?.images ?? album.images?.length ?? 0;

  return (
    <Link
      to={`/galerie/${album.id}`}
      className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      <div className="relative h-56 bg-gray-100 overflow-hidden">
        {album.coverUrl ? (
          <img
            src={buildImageUrl(album.coverUrl)}
            alt={album.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {count} photo{count !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold font-montserrat text-odec-blue-900 mb-1 group-hover:text-odec-gold-600 transition-colors">
          {album.title}
        </h3>
        {album.description && (
          <p className="text-gray-500 text-sm line-clamp-2 flex-grow">{album.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-3">
          {album.createdAt
            ? new Date(album.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
            : ""}
        </p>
      </div>
    </Link>
  );
};

const GalleryListPage: React.FC = () => {
  usePageTitle("Galerie Photos | ODEC-CI");
  useMetaDescription("Découvrez la galerie photos officielle de l'ODEC-CI : albums d'événements et activités.");

  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await albumService.getAlbums();
        setAlbums(data);
      } catch (err) {
        setError("Impossible de charger les albums. Veuillez réessayer.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-odec-blue-900 py-16 text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold font-montserrat">Galerie Photos</h1>
          <p className="mt-2 text-lg text-gray-300">Retrouvez nos albums photos et moments forts.</p>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="py-20 text-center">
            <Spinner size={48} />
            <p className="text-gray-500 mt-4">Chargement des albums...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-400 text-xl font-montserrat italic">Aucun album disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AlbumDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  usePageTitle(album ? `${album.title} | Galerie ODEC-CI` : "Galerie | ODEC-CI");
  useMetaDescription(album?.description || "Galerie photos de l'ODEC-CI.");

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const data = await albumService.getAlbum(id);
        setAlbum(data);
      } catch (err) {
        setError("Impossible de charger cet album. Il n'existe peut-être plus.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const images = album?.images || [];

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() =>
    setLightboxIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const nextImage = useCallback(() =>
    setLightboxIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <header className="bg-odec-blue-900 py-16 text-white text-center">
          <div className="container mx-auto px-4">
            <div className="h-10 bg-odec-blue-800 rounded-xl w-64 mx-auto animate-pulse" />
          </div>
        </header>
        <div className="container mx-auto px-4 py-20 text-center">
          <Spinner size={48} />
          <p className="text-gray-500 mt-4">Chargement de l'album...</p>
        </div>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <header className="bg-odec-blue-900 py-16 text-white text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold font-montserrat">Album introuvable</h1>
          </div>
        </header>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-red-500 text-lg mb-6">{error}</p>
          <Link to="/galerie" className="text-odec-blue-700 hover:text-odec-gold-600 font-semibold transition-colors">
            ← Retour à la galerie
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-odec-blue-900 py-16 text-white text-center">
        <div className="container mx-auto px-4">
          <Link to="/galerie" className="inline-block text-odec-gold-400 hover:text-odec-gold-300 text-sm mb-4 transition-colors">
            ← Retour à la galerie
          </Link>
          <h1 className="text-4xl font-bold font-montserrat">{album.title}</h1>
          {album.description && (
            <p className="mt-2 text-lg text-gray-300 max-w-2xl mx-auto">{album.description}</p>
          )}
          <p className="mt-2 text-sm text-gray-400">
            {images.length} photo{images.length !== 1 ? "s" : ""}
            {album.createdAt && (
              <> · {new Date(album.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</>
            )}
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {images.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 text-xl font-montserrat italic">Cet album ne contient aucune photo.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="break-inside-avoid cursor-pointer group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={buildImageUrl(image.imageUrl)}
                  alt={image.caption || `Photo ${index + 1}`}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {image.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-xs">{image.caption}</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-3xl"></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lightboxIndex !== null && images.length > 0 && (
        <Lightbox
          images={images}
          current={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </div>
  );
};

const GalleryPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  return id ? <AlbumDetailPage /> : <GalleryListPage />;
};

export default GalleryPage;
