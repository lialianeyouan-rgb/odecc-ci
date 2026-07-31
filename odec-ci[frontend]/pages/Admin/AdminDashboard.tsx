import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { contentService } from "@/services/contentService";
import { authService } from "@/services/authService";
import { statsService } from "@/services/statsService";
import { albumService } from "@/services/albumService";
import { Article, Album, AlbumImage } from "@/types";
import Logo from "@/components/Logo";

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/api$/, "");

const buildImageUrl = (url?: string | null) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("//")) return url;
  return `${API_BASE}${url}`;
};

const Spinner = ({ size = 30 }: { size?: number }) => (
  <div
    className="animate-spin rounded-full border-4 border-gray-300 border-t-odec-gold-500"
    style={{ width: size, height: size }}
  />
);

const DEFAULT_CATEGORIES = [
  "Actualités",
  "Événement",
  "Communiqué",
  "Actions",
  "Organisation",
  "Culture",
  "Confession",
  "À la une",
  "Politique",
];

type SortOption = "date-desc" | "date-asc" | "title-asc" | "title-desc" | "category-asc";
type AdminSection = "articles" | "albums";

const PAGE_SIZE = 10;

// ─── ARTICLES SECTION ──────────────────────────────────────────────────────────

const ArticlesSection: React.FC = () => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const multiImageInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories] = useState(DEFAULT_CATEGORIES);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article & { imageFiles?: File[]; previewUrls?: string[] } | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("date-desc");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await contentService.getArticles();
      setArticles(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors du chargement des articles";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const openNewArticle = () => {
    setEditingArticle({
      id: "",
      title: "",
      date: new Date().toISOString().split("T")[0],
      imageUrl: "",
      summary: "",
      content: "",
      category: categories[0],
      images: [],
      imageFiles: [],
      previewUrls: [],
    });
    setIsModalOpen(true);
    setErrorMessage(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;

    if (!editingArticle.title.trim()) { setErrorMessage("Le titre est requis"); return; }
    if (!editingArticle.summary.trim()) { setErrorMessage("Le résumé est requis"); return; }
    if (!editingArticle.content.trim()) { setErrorMessage("Le contenu est requis"); return; }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await contentService.saveArticle({
        ...editingArticle,
        imageFiles: editingArticle.imageFiles,
      });
      setSuccessMessage(editingArticle.id ? "Article modifié avec succès" : "Article publié avec succès");
      await fetchArticles();
      setTimeout(() => {
        setIsModalOpen(false);
        setEditingArticle(null);
        setSuccessMessage(null);
      }, 1000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de la sauvegarde";
      setErrorMessage(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (article: Article) => {
    setArticleToDelete(article);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!articleToDelete) return;
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      await contentService.deleteArticle(articleToDelete.id);
      setSuccessMessage("Article supprimé avec succès");
      await fetchArticles();
      setDeleteModalOpen(false);
      setArticleToDelete(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de la suppression";
      setErrorMessage(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMultiImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!editingArticle) return;

    const invalid = files.filter((f) => !f.type.startsWith("image/"));
    if (invalid.length > 0) { setErrorMessage("Certains fichiers ne sont pas des images valides."); return; }
    const oversize = files.filter((f) => f.size > 5 * 1024 * 1024);
    if (oversize.length > 0) { setErrorMessage("Chaque image ne doit pas dépasser 5 Mo."); return; }

    const newPreviews = files.map((f) => URL.createObjectURL(f));
    const existing = editingArticle.imageFiles || [];
    const existingPreviews = editingArticle.previewUrls || [];

    setEditingArticle({
      ...editingArticle,
      imageFiles: [...existing, ...files],
      previewUrls: [...existingPreviews, ...newPreviews],
      imageUrl: editingArticle.imageUrl || (newPreviews[0] ?? ""),
    });
    setErrorMessage(null);
    if (multiImageInputRef.current) multiImageInputRef.current.value = "";
  };

  const handleRemoveNewImage = (index: number) => {
    if (!editingArticle) return;
    const files = [...(editingArticle.imageFiles || [])];
    const previews = [...(editingArticle.previewUrls || [])];
    URL.revokeObjectURL(previews[index]);
    files.splice(index, 1);
    previews.splice(index, 1);
    setEditingArticle({ ...editingArticle, imageFiles: files, previewUrls: previews });
  };

  const handleRemoveExistingImage = async (imageId: number) => {
    if (!editingArticle || !editingArticle.id) return;
    try {
      await contentService.removeImageFromArticle(editingArticle.id, imageId);
      setEditingArticle({
        ...editingArticle,
        images: (editingArticle.images || []).filter((img) => img.id !== imageId),
      });
      setSuccessMessage("Image supprimée");
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erreur lors de la suppression de l'image");
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => setSearchQuery(value), 300);
  };

  const filteredAndSortedArticles = useMemo(() => {
    let filtered = [...articles];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.summary.toLowerCase().includes(query) ||
          a.content.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query)
      );
    }
    if (filterCategory) {
      filtered = filtered.filter((a) => a.category === filterCategory);
    }
    filtered.sort((a, b) => {
      switch (sortOption) {
        case "date-desc": return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc": return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "title-asc": return a.title.localeCompare(b.title);
        case "title-desc": return b.title.localeCompare(a.title);
        case "category-asc": return a.category.localeCompare(b.category);
        default: return 0;
      }
    });
    return filtered;
  }, [articles, searchQuery, filterCategory, sortOption]);

  const totalPages = Math.ceil(filteredAndSortedArticles.length / PAGE_SIZE);
  const paginatedArticles = filteredAndSortedArticles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const stats = useMemo(() => {
    const total = articles.length;
    const byCategory = categories.reduce((acc, cat) => {
      acc[cat] = articles.filter((a) => a.category === cat).length;
      return acc;
    }, {} as Record<string, number>);
    return { total, byCategory };
  }, [articles, categories]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const existingImages = editingArticle?.images || [];
  const newPreviews = editingArticle?.previewUrls || [];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-odec-blue-900 truncate">Espace de rédaction</h1>
          <p className="text-gray-500 text-sm sm:text-base truncate">Publications officielles de l'ODEC-CI</p>
        </div>
        <button
          onClick={openNewArticle}
          className="bg-odec-gold-500 hover:bg-odec-gold-600 text-odec-blue-900 font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl w-full sm:w-auto text-center transition-colors shadow-md hover:shadow-lg"
        >
          + Publier
        </button>
      </div>

      {successMessage && (
        <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <p className="text-green-700 font-medium">{successMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700 font-medium">{errorMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Titre, résumé, contenu..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-odec-gold-500 focus:border-odec-gold-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par catégorie</label>
            <select
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-odec-gold-500 focus:border-odec-gold-500 outline-none"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trier par</label>
            <select
              value={sortOption}
              onChange={(e) => { setSortOption(e.target.value as SortOption); setCurrentPage(1); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-odec-gold-500 focus:border-odec-gold-500 outline-none"
            >
              <option value="date-desc">Date (récent)</option>
              <option value="date-asc">Date (ancien)</option>
              <option value="title-asc">Titre (A-Z)</option>
              <option value="title-desc">Titre (Z-A)</option>
              <option value="category-asc">Catégorie</option>
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          {filteredAndSortedArticles.length === 0 ? (
            <span>Aucun article trouvé</span>
          ) : (
            <span>
              {filteredAndSortedArticles.length} article{filteredAndSortedArticles.length > 1 ? "s" : ""} trouvé
              {filteredAndSortedArticles.length > 1 ? "s" : ""}
              {filterCategory && ` dans "${filterCategory}"`}
            </span>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size={48} /></div>
      ) : paginatedArticles.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <p className="text-gray-500 text-lg">
            {searchQuery || filterCategory ? "Aucun article ne correspond à vos critères" : "Aucun article publié pour le moment"}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm overflow-x-auto mb-4">
            <table className="w-full text-sm table-auto md:table-fixed min-w-0">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="p-2 sm:p-4 text-left max-w-[350px]">Article</th>
                  <th className="p-2 sm:p-4 text-center w-32">Catégorie</th>
                  <th className="p-2 sm:p-4 text-center w-24">Date</th>
                  <th className="p-2 sm:p-4 text-center w-20">Photos</th>
                  <th className="p-2 sm:p-4 text-center w-48">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedArticles.map((a) => {
                  const imgCount = (a.images?.length || 0) + (a.imageUrl && (!a.images || a.images.length === 0) ? 1 : 0);
                  return (
                    <tr key={a.id} className="border-t hover:bg-gray-50">
                      <td className="p-2 sm:p-4 flex items-center gap-2 sm:gap-3 min-w-0 max-w-[350px]">
                        {a.imageUrl ? (
                          <img
                            src={buildImageUrl(a.images?.[0]?.imageUrl || a.imageUrl)}
                            alt={a.title}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover border flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded flex-shrink-0" />
                        )}
                        <span className="font-medium line-clamp-2">{a.title}</span>
                      </td>
                      <td className="p-2 sm:p-4 text-center truncate">{a.category}</td>
                      <td className="p-2 sm:p-4 text-center">{new Date(a.date).toLocaleDateString("fr-FR")}</td>
                      <td className="p-2 sm:p-4 text-center">
                        {imgCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            🖼 {imgCount}
                          </span>
                        )}
                      </td>
                      <td className="p-2 sm:p-4 text-center flex justify-center gap-2 sm:gap-3 flex-wrap">
                        <button
                          onClick={() => { setEditingArticle({ ...a, imageFiles: [], previewUrls: [] }); setIsModalOpen(true); setErrorMessage(null); }}
                          className="text-odec-blue-700 hover:bg-odec-blue-50 font-semibold text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 border border-odec-blue-300 rounded transition-colors"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteClick(a)}
                          className="text-red-600 hover:bg-red-50 font-semibold text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 border border-red-300 rounded transition-colors"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">«</button>
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">‹</button>
              <span className="px-4 py-2 text-sm text-gray-700">Page {currentPage} sur {totalPages}</span>
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">›</button>
              <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors">»</button>
            </div>
          )}
        </>
      )}

      {/* Article Modal */}
      {isModalOpen && editingArticle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 md:p-4">
          <div className="bg-white w-full max-w-md md:max-w-3xl rounded-3xl p-4 md:p-6 flex flex-col max-h-[90vh] overflow-y-auto relative">
            {isSaving && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-3xl">
                <Spinner size={56} />
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-odec-blue-900">
                {editingArticle.id ? "Modifier l'article" : "Nouvel article"}
              </h2>
              <button
                onClick={() => { setIsModalOpen(false); setEditingArticle(null); setErrorMessage(null); }}
                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{errorMessage}</p>
              </div>
            )}
            {successMessage && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-3 rounded-lg">
                <p className="text-green-700 text-sm font-medium">{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                  <input
                    type="text"
                    value={editingArticle.title}
                    onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-odec-gold-500 focus:border-odec-gold-500 outline-none"
                    placeholder="Titre de l'article"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                  <select
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-odec-gold-500 focus:border-odec-gold-500 outline-none"
                  >
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={editingArticle.date}
                  onChange={(e) => setEditingArticle({ ...editingArticle, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-odec-gold-500 focus:border-odec-gold-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Résumé *</label>
                <textarea
                  value={editingArticle.summary}
                  onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-odec-gold-500 focus:border-odec-gold-500 outline-none resize-none"
                  rows={3}
                  placeholder="Résumé court de l'article"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu *</label>
                <textarea
                  value={editingArticle.content}
                  onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-odec-gold-500 focus:border-odec-gold-500 outline-none resize-none font-mono text-sm"
                  rows={8}
                  placeholder="Contenu complet (HTML basique accepté : <p>, <b>, <i>, <ul>, <li>, <h2>, <h3>...)"
                  required
                />
              </div>

              {/* Images section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images de l'article
                  <span className="text-gray-400 text-xs ml-2">(JPEG, PNG, WebP — max 5 Mo chacune)</span>
                </label>

                {existingImages.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Images actuelles :</p>
                    <div className="flex flex-wrap gap-2">
                      {existingImages.map((img) => (
                        <div key={img.id} className="relative group w-20 h-20">
                          <img
                            src={buildImageUrl(img.imageUrl)}
                            alt="Image article"
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingImage(img.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            title="Supprimer cette image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {newPreviews.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Nouvelles images à ajouter :</p>
                    <div className="flex flex-wrap gap-2">
                      {newPreviews.map((url, i) => (
                        <div key={i} className="relative group w-20 h-20">
                          <img src={url} alt={`Preview ${i + 1}`} className="w-20 h-20 object-cover rounded-lg border border-odec-gold-400" />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewImage(i)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            title="Retirer cette image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <input
                  ref={multiImageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultiImageSelect}
                  className="hidden"
                  id="article-multi-image-input"
                />
                <label
                  htmlFor="article-multi-image-input"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-odec-gold-400 hover:text-odec-gold-600 transition-colors text-sm"
                >
                  <span>📷</span>
                  <span>Ajouter des images</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL de la vidéo</label>
                <input
                  type="url"
                  value={editingArticle.videoUrl || ""}
                  onChange={(e) => setEditingArticle({ ...editingArticle, videoUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-odec-gold-500 focus:border-odec-gold-500 outline-none"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL du document PDF</label>
                <input
                  type="url"
                  value={editingArticle.pdfUrl || ""}
                  onChange={(e) => setEditingArticle({ ...editingArticle, pdfUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-odec-gold-500 focus:border-odec-gold-500 outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingArticle(null); setErrorMessage(null); }}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-odec-gold-500 hover:bg-odec-gold-600 text-odec-blue-900 font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                >
                  {isSaving ? "Enregistrement…" : editingArticle.id ? "Modifier" : "Publier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Article Modal */}
      {deleteModalOpen && articleToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-odec-blue-900 mb-3">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer l'article <strong>« {articleToDelete.title} »</strong> ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setDeleteModalOpen(false); setArticleToDelete(null); }}
                disabled={isDeleting}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl disabled:opacity-50 transition-colors"
              >
                {isDeleting ? "Suppression…" : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── ALBUMS SECTION ────────────────────────────────────────────────────────────

const AlbumsSection: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<{
    id?: number;
    title: string;
    description: string;
    coverFile?: File;
    coverPreview?: string;
  } | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [albumToDelete, setAlbumToDelete] = useState<Album | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageCaption, setImageCaption] = useState("");

  const coverInputRef = useRef<HTMLInputElement>(null);
  const imageUploadRef = useRef<HTMLInputElement>(null);

  const fetchAlbums = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await albumService.getAlbums();
      setAlbums(data);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erreur lors du chargement des albums");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  const openNewAlbum = () => {
    setEditingAlbum({ title: "", description: "" });
    setIsModalOpen(true);
    setErrorMessage(null);
  };

  const openEditAlbum = (album: Album) => {
    setEditingAlbum({
      id: album.id,
      title: album.title,
      description: album.description || "",
      coverPreview: album.coverUrl ? buildImageUrl(album.coverUrl) : undefined,
    });
    setIsModalOpen(true);
    setErrorMessage(null);
  };

  const handleSaveAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlbum) return;
    if (!editingAlbum.title.trim()) { setErrorMessage("Le titre de l'album est requis"); return; }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (editingAlbum.id) {
        await albumService.updateAlbum(editingAlbum.id, {
          title: editingAlbum.title,
          description: editingAlbum.description,
          coverFile: editingAlbum.coverFile,
        });
        setSuccessMessage("Album modifié avec succès");
      } else {
        await albumService.createAlbum({
          title: editingAlbum.title,
          description: editingAlbum.description,
          coverFile: editingAlbum.coverFile,
        });
        setSuccessMessage("Album créé avec succès");
      }
      await fetchAlbums();
      setTimeout(() => { setIsModalOpen(false); setEditingAlbum(null); setSuccessMessage(null); }, 1000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDeleteAlbum = async () => {
    if (!albumToDelete) return;
    setIsDeleting(true);
    try {
      await albumService.deleteAlbum(albumToDelete.id);
      setSuccessMessage("Album supprimé avec succès");
      await fetchAlbums();
      if (selectedAlbum?.id === albumToDelete.id) setSelectedAlbum(null);
      setDeleteModalOpen(false);
      setAlbumToDelete(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erreur lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingAlbum) return;
    if (!file.type.startsWith("image/")) { setErrorMessage("Veuillez sélectionner une image valide"); return; }
    if (file.size > 5 * 1024 * 1024) { setErrorMessage("L'image ne doit pas dépasser 5 Mo"); return; }
    const preview = URL.createObjectURL(file);
    setEditingAlbum({ ...editingAlbum, coverFile: file, coverPreview: preview });
    setErrorMessage(null);
  };

  const handleViewAlbum = async (album: Album) => {
    try {
      const full = await albumService.getAlbum(album.id);
      setSelectedAlbum(full);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erreur lors du chargement de l'album");
    }
  };

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedAlbum) return;
    if (!file.type.startsWith("image/")) { setErrorMessage("Fichier non supporté"); return; }
    if (file.size > 5 * 1024 * 1024) { setErrorMessage("Image trop grande (max 5 Mo)"); return; }

    setIsUploadingImage(true);
    setErrorMessage(null);
    try {
      await albumService.addImage(selectedAlbum.id, file, imageCaption || undefined);
      const updated = await albumService.getAlbum(selectedAlbum.id);
      setSelectedAlbum(updated);
      const idx = albums.findIndex((a) => a.id === selectedAlbum.id);
      if (idx >= 0) {
        const newAlbums = [...albums];
        newAlbums[idx] = { ...newAlbums[idx], _count: { images: (updated.images?.length || 0) }, coverUrl: updated.coverUrl };
        setAlbums(newAlbums);
      }
      setImageCaption("");
      setSuccessMessage("Image ajoutée");
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erreur lors de l'ajout de l'image");
    } finally {
      setIsUploadingImage(false);
      if (imageUploadRef.current) imageUploadRef.current.value = "";
    }
  };

  const handleRemoveImage = async (imageId: number) => {
    if (!selectedAlbum) return;
    try {
      await albumService.removeImage(selectedAlbum.id, imageId);
      const updated = await albumService.getAlbum(selectedAlbum.id);
      setSelectedAlbum(updated);
      const idx = albums.findIndex((a) => a.id === selectedAlbum.id);
      if (idx >= 0) {
        const newAlbums = [...albums];
        newAlbums[idx] = { ...newAlbums[idx], _count: { images: updated.images?.length || 0 }, coverUrl: updated.coverUrl };
        setAlbums(newAlbums);
      }
      setSuccessMessage("Image supprimée");
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erreur lors de la suppression de l'image");
    }
  };

  const handleSetCover = async (imageId: number) => {
    if (!selectedAlbum) return;
    try {
      const updated = await albumService.setCover(selectedAlbum.id, imageId);
      setSelectedAlbum({ ...selectedAlbum, coverUrl: updated.coverUrl });
      const idx = albums.findIndex((a) => a.id === selectedAlbum.id);
      if (idx >= 0) {
        const newAlbums = [...albums];
        newAlbums[idx] = { ...newAlbums[idx], coverUrl: updated.coverUrl };
        setAlbums(newAlbums);
      }
      setSuccessMessage("Photo de couverture mise à jour");
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Erreur");
    }
  };

  if (selectedAlbum) {
    const images = selectedAlbum.images || [];
    return (
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setSelectedAlbum(null)}
            className="text-odec-blue-700 hover:text-odec-gold-600 font-semibold transition-colors"
          >
            ← Albums
          </button>
          <span className="text-gray-400">/</span>
          <h1 className="text-2xl font-bold text-odec-blue-900 truncate">{selectedAlbum.title}</h1>
        </div>

        {successMessage && <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-3 rounded-lg"><p className="text-green-700 text-sm font-medium">{successMessage}</p></div>}
        {errorMessage && <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-lg"><p className="text-red-700 text-sm font-medium">{errorMessage}</p></div>}

        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">Légende (optionnelle)</label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Description de l'image..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-odec-gold-500 focus:border-odec-gold-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ajouter une photo</label>
              <input
                ref={imageUploadRef}
                type="file"
                accept="image/*"
                onChange={handleAddImage}
                className="hidden"
                id="album-image-upload"
              />
              <label
                htmlFor="album-image-upload"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-odec-gold-500 hover:bg-odec-gold-600 text-odec-blue-900 font-bold rounded-xl transition-colors shadow text-sm"
              >
                {isUploadingImage ? <Spinner size={16} /> : <span>📷</span>}
                {isUploadingImage ? "Envoi…" : "Ajouter une photo"}
              </label>
            </div>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center">
            <p className="text-gray-400 text-lg">Cet album ne contient aucune photo.</p>
            <p className="text-gray-400 text-sm mt-1">Utilisez le bouton ci-dessus pour en ajouter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((img: AlbumImage) => {
              const isCover = selectedAlbum.coverUrl === img.imageUrl;
              return (
                <div key={img.id} className="relative group rounded-xl overflow-hidden border-2 aspect-square" style={{ borderColor: isCover ? '#d4a017' : 'transparent' }}>
                  <img
                    src={buildImageUrl(img.imageUrl)}
                    alt={img.caption || `Photo ${img.order + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {isCover && (
                    <div className="absolute top-1 left-1 bg-odec-gold-500 text-odec-blue-900 text-xs font-bold px-1.5 py-0.5 rounded">
                      Couverture
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    {!isCover && (
                      <button
                        onClick={() => handleSetCover(img.id)}
                        className="text-white text-xs bg-odec-gold-500 hover:bg-odec-gold-600 px-2 py-1 rounded font-medium transition-colors"
                        title="Définir comme couverture"
                      >
                        ⭐ Couverture
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveImage(img.id)}
                      className="text-white text-xs bg-red-500 hover:bg-red-600 px-2 py-1 rounded font-medium transition-colors"
                      title="Supprimer cette image"
                    >
                      🗑 Supprimer
                    </button>
                  </div>
                  {img.caption && (
                    <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {img.caption}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-odec-blue-900">Galerie – Albums</h1>
          <p className="text-gray-500 text-sm">Créez et gérez les albums photos de l'ODEC-CI</p>
        </div>
        <button
          onClick={openNewAlbum}
          className="bg-odec-gold-500 hover:bg-odec-gold-600 text-odec-blue-900 font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-xl w-full sm:w-auto text-center transition-colors shadow-md hover:shadow-lg"
        >
          + Créer un album
        </button>
      </div>

      {successMessage && <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg"><p className="text-green-700 font-medium">{successMessage}</p></div>}
      {errorMessage && <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"><p className="text-red-700 font-medium">{errorMessage}</p></div>}

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size={48} /></div>
      ) : albums.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <p className="text-gray-400 text-6xl mb-4">📷</p>
          <p className="text-gray-500 text-lg">Aucun album créé pour le moment</p>
          <p className="text-gray-400 text-sm mt-1">Cliquez sur « + Créer un album » pour commencer</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => {
            const count = album._count?.images ?? album.images?.length ?? 0;
            return (
              <div key={album.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                <div className="relative h-44 bg-gray-100 overflow-hidden">
                  {album.coverUrl ? (
                    <img src={buildImageUrl(album.coverUrl)} alt={album.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">📷</div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {count} photo{count !== 1 ? "s" : ""}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-odec-blue-900 truncate mb-1">{album.title}</h3>
                  {album.description && <p className="text-gray-500 text-sm line-clamp-2 mb-3">{album.description}</p>}
                  <div className="flex gap-2 flex-wrap mt-2">
                    <button
                      onClick={() => handleViewAlbum(album)}
                      className="flex-1 text-odec-blue-700 border border-odec-blue-300 hover:bg-odec-blue-50 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors"
                    >
                      📷 Gérer les photos
                    </button>
                    <button
                      onClick={() => openEditAlbum(album)}
                      className="text-gray-600 border border-gray-300 hover:bg-gray-50 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => { setAlbumToDelete(album); setDeleteModalOpen(true); }}
                      className="text-red-500 border border-red-200 hover:bg-red-50 font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Album Modal */}
      {isModalOpen && editingAlbum && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            {isSaving && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-3xl">
                <Spinner size={40} />
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-odec-blue-900">
                {editingAlbum.id ? "Modifier l'album" : "Nouvel album"}
              </h2>
              <button
                onClick={() => { setIsModalOpen(false); setEditingAlbum(null); setErrorMessage(null); }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {errorMessage && <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-lg"><p className="text-red-700 text-sm">{errorMessage}</p></div>}

            <form onSubmit={handleSaveAlbum} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input
                  type="text"
                  value={editingAlbum.title}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-odec-gold-500 outline-none"
                  placeholder="Titre de l'album"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingAlbum.description}
                  onChange={(e) => setEditingAlbum({ ...editingAlbum, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-odec-gold-500 outline-none resize-none"
                  rows={3}
                  placeholder="Description de l'album (optionnel)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo de couverture</label>
                {editingAlbum.coverPreview && (
                  <img src={editingAlbum.coverPreview} alt="Couverture" className="w-full h-32 object-cover rounded-xl mb-2 border" />
                )}
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverSelect}
                  className="hidden"
                  id="album-cover-input"
                />
                <label
                  htmlFor="album-cover-input"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-odec-gold-400 hover:text-odec-gold-600 transition-colors text-sm"
                >
                  📷 {editingAlbum.coverPreview ? "Changer la couverture" : "Choisir une couverture"}
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingAlbum(null); setErrorMessage(null); }}
                  className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-odec-gold-500 hover:bg-odec-gold-600 text-odec-blue-900 font-bold rounded-xl disabled:opacity-50 transition-colors"
                >
                  {isSaving ? "Enregistrement…" : editingAlbum.id ? "Modifier" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Album Modal */}
      {deleteModalOpen && albumToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-odec-blue-900 mb-3">Supprimer l'album</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer l'album <strong>« {albumToDelete.title} »</strong> et toutes ses photos ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setDeleteModalOpen(false); setAlbumToDelete(null); }}
                disabled={isDeleting}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmDeleteAlbum}
                disabled={isDeleting}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl disabled:opacity-50 transition-colors"
              >
                {isDeleting ? "Suppression…" : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── MAIN DASHBOARD ────────────────────────────────────────────────────────────

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>("articles");

  const [dashboardStats, setDashboardStats] = useState<{
    totalForms: number;
    totalDons: number;
    totalInscrits: number;
  } | null>(null);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/admin/login");
      return;
    }

    const loadStats = async () => {
      try {
        const s = await statsService.getStats();
        setDashboardStats(s);
      } catch {
        setDashboardStats({ totalForms: 0, totalDons: 0, totalInscrits: 0 });
      }
    };
    loadStats();
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-gray-100 flex flex-col md:flex-row">
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40 w-64 flex-shrink-0
          bg-odec-blue-900 text-white flex flex-col
          h-screen md:h-full md:min-h-0 min-h-screen
          overflow-y-auto overflow-x-hidden
          transform transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="p-6 border-b border-odec-blue-800 flex items-center justify-between flex-shrink-0">
          <Logo className="h-10" />
          <button
            className="md:hidden text-white text-xl"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fermer le menu"
          >
            ✕
          </button>
        </div>

        <nav className="p-4 flex flex-col gap-2">
          <button
            onClick={() => { setActiveSection("articles"); setSidebarOpen(false); }}
            className={`w-full px-4 py-2 rounded-lg text-left font-semibold transition-colors ${
              activeSection === "articles"
                ? "bg-odec-gold-500 text-odec-blue-900"
                : "hover:bg-odec-blue-800 text-white"
            }`}
          >
            📝 Articles
          </button>

          <button
            onClick={() => { setActiveSection("albums"); setSidebarOpen(false); }}
            className={`w-full px-4 py-2 rounded-lg text-left font-semibold transition-colors ${
              activeSection === "albums"
                ? "bg-odec-gold-500 text-odec-blue-900"
                : "hover:bg-odec-blue-800 text-white"
            }`}
          >
            📷 Albums Photos
          </button>

          <hr className="border-odec-blue-800 my-2" />

          <button
            onClick={handleLogout}
            className="text-red-300 hover:text-red-200 w-full text-left px-4 py-2 rounded-lg hover:bg-odec-blue-800 transition-colors"
          >
            🚪 Déconnexion
          </button>
        </nav>

        {dashboardStats && (
          <div className="p-4 border-t border-odec-blue-800 mt-auto">
            <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Statistiques</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Formulaires</span>
                <span className="font-semibold">{dashboardStats.totalForms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Inscrits</span>
                <span className="font-semibold">{dashboardStats.totalInscrits}</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-y-auto">
        <header className="md:hidden h-14 bg-odec-blue-900 text-white flex items-center justify-between px-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="text-xl" aria-label="Ouvrir le menu">☰</button>
          <span className="font-semibold truncate">ODEC Admin</span>
          <button onClick={handleLogout} className="text-sm text-red-300">Quitter</button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 min-w-0">
          {activeSection === "articles" && <ArticlesSection />}
          {activeSection === "albums" && <AlbumsSection />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
