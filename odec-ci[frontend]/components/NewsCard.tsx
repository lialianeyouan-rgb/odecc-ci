import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';

interface NewsCardProps {
  article: Article;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/api$/, "");

const buildImageUrl = (url?: string | null): string => {
  if (!url) return "https://picsum.photos/600/400";
  if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("//")) return url;
  return `${API_BASE}${url}`;
};

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const coverUrl = buildImageUrl(article.images?.[0]?.imageUrl || article.imageUrl);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <img className="h-48 w-full object-cover" src={coverUrl} alt={article.title} />
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <span className="inline-block bg-odec-blue-800 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">{article.category}</span>
          <span className="text-gray-500 text-sm">{article.date}</span>
        </div>
        <h3 className="text-xl font-bold font-montserrat text-odec-blue-900 mb-2">{article.title}</h3>
        <p className="text-gray-700 flex-grow">{article.summary}</p>
        <div className="mt-6">
          <Link to={`/actualites#${article.id}`} className="font-bold text-odec-blue-700 hover:text-odec-gold-600 transition-colors">
            Lire la suite &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
