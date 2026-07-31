import { Album, AlbumImage } from "../types";
import { apiRequest } from "./apiClient";
import { authService } from "./authService";

type ApiAlbum = {
  id: number;
  title: string;
  description?: string | null;
  coverUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  images?: ApiAlbumImage[];
  _count?: { images: number };
};

type ApiAlbumImage = {
  id: number;
  albumId: number;
  imageUrl: string;
  caption?: string | null;
  order: number;
  createdAt?: string;
};

const normalizeAlbumImage = (img: ApiAlbumImage): AlbumImage => ({
  id: img.id,
  albumId: img.albumId,
  imageUrl: img.imageUrl,
  caption: img.caption,
  order: img.order,
  createdAt: img.createdAt,
});

const normalizeAlbum = (album: ApiAlbum): Album => ({
  id: album.id,
  title: album.title || "",
  description: album.description || null,
  coverUrl: album.coverUrl || null,
  createdAt: album.createdAt,
  updatedAt: album.updatedAt,
  images: (album.images || []).map(normalizeAlbumImage),
  _count: album._count,
});

export const albumService = {
  async getAlbums(): Promise<Album[]> {
    const albums = await apiRequest<ApiAlbum[]>("/albums");
    return albums.map(normalizeAlbum);
  },

  async getAlbum(id: number | string): Promise<Album> {
    const album = await apiRequest<ApiAlbum>(`/albums/${id}`);
    return normalizeAlbum(album);
  },

  async createAlbum(data: {
    title: string;
    description?: string;
    coverFile?: File;
  }): Promise<Album> {
    const token = authService.getToken();
    if (!token) throw new Error("Session invalide. Reconnectez-vous.");

    const formData = new FormData();
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.coverFile) formData.append("cover", data.coverFile);

    const album = await apiRequest<ApiAlbum>("/albums", {
      method: "POST",
      body: formData,
      token,
      isFormData: true,
    });

    return normalizeAlbum(album);
  },

  async updateAlbum(
    id: number | string,
    data: { title: string; description?: string; coverFile?: File }
  ): Promise<Album> {
    const token = authService.getToken();
    if (!token) throw new Error("Session invalide. Reconnectez-vous.");

    const formData = new FormData();
    formData.append("title", data.title);
    if (data.description !== undefined) formData.append("description", data.description);
    if (data.coverFile) formData.append("cover", data.coverFile);

    const album = await apiRequest<ApiAlbum>(`/albums/${id}`, {
      method: "PUT",
      body: formData,
      token,
      isFormData: true,
    });

    return normalizeAlbum(album);
  },

  async deleteAlbum(id: number | string): Promise<void> {
    const token = authService.getToken();
    if (!token) throw new Error("Session invalide. Reconnectez-vous.");

    await apiRequest<void>(`/albums/${id}`, {
      method: "DELETE",
      token,
    });
  },

  async addImage(
    albumId: number | string,
    file: File,
    caption?: string
  ): Promise<AlbumImage> {
    const token = authService.getToken();
    if (!token) throw new Error("Session invalide. Reconnectez-vous.");

    const formData = new FormData();
    formData.append("image", file);
    if (caption) formData.append("caption", caption);

    const image = await apiRequest<ApiAlbumImage>(`/albums/${albumId}/images`, {
      method: "POST",
      body: formData,
      token,
      isFormData: true,
    });

    return normalizeAlbumImage(image);
  },

  async removeImage(albumId: number | string, imageId: number | string): Promise<void> {
    const token = authService.getToken();
    if (!token) throw new Error("Session invalide. Reconnectez-vous.");

    await apiRequest<void>(`/albums/${albumId}/images/${imageId}`, {
      method: "DELETE",
      token,
    });
  },

  async updateImage(
    albumId: number | string,
    imageId: number | string,
    data: { caption?: string; order?: number }
  ): Promise<AlbumImage> {
    const token = authService.getToken();
    if (!token) throw new Error("Session invalide. Reconnectez-vous.");

    const image = await apiRequest<ApiAlbumImage>(`/albums/${albumId}/images/${imageId}`, {
      method: "PUT",
      body: data,
      token,
    });

    return normalizeAlbumImage(image);
  },

  async setCover(albumId: number | string, imageId: number | string): Promise<Album> {
    const token = authService.getToken();
    if (!token) throw new Error("Session invalide. Reconnectez-vous.");

    const album = await apiRequest<ApiAlbum>(`/albums/${albumId}/images/${imageId}/cover`, {
      method: "PATCH",
      token,
    });

    return normalizeAlbum(album);
  },
};
