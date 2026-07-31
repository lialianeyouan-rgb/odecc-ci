import { Article, ArticleImage } from "../types";
import { apiRequest } from "./apiClient";
import { authService } from "./authService";

type ApiArticleImage = {
  id: number;
  articleId: number;
  imageUrl: string;
  caption?: string | null;
  order: number;
  createdAt?: string;
};

type ApiArticle = {
  id: string | number;
  title: string;
  summary: string;
  content: string;
  category: string;
  date?: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  pdfUrl?: string | null;
  createdAt?: string;
  images?: ApiArticleImage[];
};

const normalizeArticleImage = (img: ApiArticleImage): ArticleImage => ({
  id: img.id,
  articleId: img.articleId,
  imageUrl: img.imageUrl,
  caption: img.caption,
  order: img.order,
  createdAt: img.createdAt,
});

const normalizeArticle = (article: ApiArticle): Article => ({
  id: article.id,
  title: article.title || "",
  summary: article.summary || "",
  content: article.content || "",
  category: article.category || "Actualites",
  date:
    article.date ||
    (article.createdAt
      ? article.createdAt.split("T")[0]
      : new Date().toISOString().split("T")[0]),
  imageUrl: article.imageUrl || undefined,
  videoUrl: article.videoUrl || undefined,
  pdfUrl: article.pdfUrl || undefined,
  images: (article.images || []).map(normalizeArticleImage),
});

const validateMediaUrl = (value?: string, label = "Fichier") => {
  if (!value) return;
  if (value.startsWith("data:") || value.startsWith("blob:")) {
    throw new Error(
      `${label} en base64/blob non supporte. Utilisez une URL hebergee.`
    );
  }
};

export const contentService = {
  async getArticles(): Promise<Article[]> {
    const articles = await apiRequest<ApiArticle[]>("/articles");
    return articles.map(normalizeArticle);
  },

  async getArticle(id: string | number): Promise<Article> {
    const article = await apiRequest<ApiArticle>(`/articles/${id}`);
    return normalizeArticle(article);
  },

  async saveArticle(
    article: Article & { imageFile?: File; imageFiles?: File[] }
  ): Promise<Article> {
    const token = authService.getToken();
    if (!token) throw new Error("Session invalide");

    const isUpdate = article.id !== "" && article.id !== null && article.id !== undefined && article.id !== 0;
    const path = isUpdate ? `/articles/${article.id}` : "/articles";
    const method = isUpdate ? "PUT" : "POST";

    const formData = new FormData();
    formData.append("title", article.title);
    formData.append("summary", article.summary);
    formData.append("content", article.content);
    formData.append("category", article.category);
    formData.append("date", article.date);

    if (article.videoUrl) formData.append("videoUrl", article.videoUrl);
    if (article.pdfUrl) formData.append("pdfUrl", article.pdfUrl);

    if (article.imageFiles && article.imageFiles.length > 0) {
      article.imageFiles.forEach((file) => {
        formData.append("images", file);
      });
    } else if (article.imageFile) {
      formData.append("images", article.imageFile);
    }

    const saved = await apiRequest<ApiArticle>(path, {
      method,
      body: formData,
      token,
      isFormData: true,
    });

    return normalizeArticle(saved);
  },

  async deleteArticle(id: string | number): Promise<void> {
    const token = authService.getToken();
    if (!token) {
      throw new Error("Session admin invalide. Reconnectez-vous.");
    }

    await apiRequest<void>(`/articles/${id}`, {
      method: "DELETE",
      token,
    });
  },

  async addImageToArticle(
    articleId: string | number,
    file: File,
    caption?: string
  ): Promise<ArticleImage> {
    const token = authService.getToken();
    if (!token) throw new Error("Session invalide. Reconnectez-vous.");

    const formData = new FormData();
    formData.append("image", file);
    if (caption) formData.append("caption", caption);

    const image = await apiRequest<ApiArticleImage>(`/articles/${articleId}/images`, {
      method: "POST",
      body: formData,
      token,
      isFormData: true,
    });

    return normalizeArticleImage(image);
  },

  async removeImageFromArticle(
    articleId: string | number,
    imageId: number
  ): Promise<void> {
    const token = authService.getToken();
    if (!token) throw new Error("Session invalide. Reconnectez-vous.");

    await apiRequest<void>(`/articles/${articleId}/images/${imageId}`, {
      method: "DELETE",
      token,
    });
  },
};
