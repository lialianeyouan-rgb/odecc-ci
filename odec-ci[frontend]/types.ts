import React from "react";

export interface ArticleImage {
  id: number;
  articleId: number;
  imageUrl: string;
  caption?: string | null;
  order: number;
  createdAt?: string;
}

export interface Article {
  id: number | string;
  title: string;
  date: string;
  imageUrl?: string;
  pdfUrl?: string;
  videoUrl?: string;
  imageFile?: File;
  imageFiles?: File[];
  summary: string;
  content: string;
  category: string;
  images?: ArticleImage[];
}

export interface AlbumImage {
  id: number;
  albumId: number;
  imageUrl: string;
  caption?: string | null;
  order: number;
  createdAt?: string;
}

export interface Album {
  id: number;
  title: string;
  description?: string | null;
  coverUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  images?: AlbumImage[];
  _count?: { images: number };
}

export interface MissionValue {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}
