const sanitizeHtml = require("sanitize-html");
const { createHttpError } = require("../../utils/httpError.js");
const { db } = require("../../config/db.js");

const toNumberId = (id) => {
  const articleId = Number(id);
  if (!Number.isInteger(articleId) || articleId <= 0) {
    throw createHttpError(
      400,
      "ID article invalide. La valeur doit etre un entier positif",
      "ARTICLE_INVALID_ID",
      { received: id }
    );
  }
  return articleId;
};

const sanitizeText = (value) =>
  sanitizeHtml(String(value || ""), {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();

const normalizePayload = (data = {}) => {
  const safeTitle = sanitizeText(data.title);
  const safeSummary = sanitizeText(data.summary);
  const safeCategory = sanitizeText(data.category);

  const payload = {
    title: safeTitle,
    summary: safeSummary,
    content: sanitizeHtml(String(data.content || ""), {
      allowedTags: [
        "p", "br", "b", "strong", "i", "em", "u",
        "ul", "ol", "li", "h2", "h3", "blockquote", "a",
      ],
      allowedAttributes: {
        a: ["href", "target", "rel"],
      },
      allowedSchemes: ["http", "https", "mailto"],
      transformTags: {
        a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
      },
    }).trim(),
    category: safeCategory,
    date: String(data.date || "").trim(),
    imageUrl: data.imageUrl ? String(data.imageUrl) : null,
    videoUrl: data.videoUrl ? String(data.videoUrl) : null,
    pdfUrl: data.pdfUrl ? String(data.pdfUrl) : null,
  };

  const missingFields = ["title", "summary", "content", "category", "date"].filter(
    (field) => !payload[field]
  );

  if (missingFields.length > 0) {
    throw createHttpError(
      400,
      "Tous les champs title, summary, content, category et date sont obligatoires",
      "ARTICLE_REQUIRED_FIELDS_MISSING",
      { missingFields }
    );
  }

  return payload;
};

const getAll = async () => {
  try {
    // 1. On récupère d'abord TOUS les articles (sans le include qui plantait)
    const articles = await db.article.findMany({
      orderBy: [
        { date: "desc" },
        { createdAt: "desc" }
      ]
    });

    // 2. On récupère TOUTES les images de la table ArticleImage
    const articleImages = await db.articleImage.findMany({
      orderBy: {
        order: "asc"
      }
    });

    // 3. On associe manuellement chaque image à son article correspondant
    const articlesWithImages = articles.map(article => {
      // On filtre le tableau d'images pour ne garder que celles de cet article
      const matchingImages = articleImages.filter(img => img.articleId === article.id);
      
      // On retourne l'article d'origine en lui injectant sa propriété "images"
      return {
        ...article,
        images: matchingImages
      };
    });

    // 4. On renvoie le résultat final combiné
    return articlesWithImages;

  } catch (error) {
    console.error("Erreur lors de la récupération manuelle des articles :", error);
    throw error;
  }
};

const getById = async (id) => {
  const article = await db.article.findUnique({
    where: { id: toNumberId(id) },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!article) {
    throw createHttpError(404, "Article introuvable.", "ARTICLE_NOT_FOUND", { id });
  }

  return article;
};

const create = async (data, imageFiles = []) => {
  const payload = normalizePayload(data);

  if (imageFiles.length > 0 && !payload.imageUrl) {
    payload.imageUrl = "/uploads/" + imageFiles[0].filename;
  }

  const article = await db.article.create({
    data: {
      ...payload,
      images: {
        create: imageFiles.map((file, index) => ({
          imageUrl: "/uploads/" + file.filename,
          order: index,
        })),
      },
    },
    include: { images: { orderBy: { order: "asc" } } },
  });

  return article;
};

const update = async (id, data, imageFiles = []) => {
  const articleId = toNumberId(id);
  const existing = await db.article.findUnique({ where: { id: articleId } });
  if (!existing) {
    throw createHttpError(
      404,
      "Article introuvable. Impossible de le modifier",
      "ARTICLE_NOT_FOUND",
      { id }
    );
  }

  const payload = normalizePayload(data);

  if (imageFiles.length > 0 && !payload.imageUrl) {
    payload.imageUrl = "/uploads/" + imageFiles[0].filename;
  }

  const article = await db.article.update({
    where: { id: articleId },
    data: payload,
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (imageFiles.length > 0) {
    const currentCount = await db.articleImage.count({ where: { articleId } });
    for (let i = 0; i < imageFiles.length; i++) {
      await db.articleImage.create({
        data: {
          articleId,
          imageUrl: "/uploads/" + imageFiles[i].filename,
          order: currentCount + i,
        },
      });
    }
  }

  return db.article.findUnique({
    where: { id: articleId },
    include: { images: { orderBy: { order: "asc" } } },
  });
};

const remove = async (id) => {
  const articleId = toNumberId(id);
  const existing = await db.article.findUnique({ where: { id: articleId } });
  if (!existing) {
    throw createHttpError(
      404,
      "Article introuvable. Impossible de le supprimer",
      "ARTICLE_NOT_FOUND",
      { id }
    );
  }

  return db.article.delete({ where: { id: articleId } });
};

const addImage = async (articleId, { imageUrl, caption, order }) => {
  const artId = toNumberId(articleId);
  const existing = await db.article.findUnique({ where: { id: artId } });
  if (!existing) {
    throw createHttpError(404, "Article introuvable.", "ARTICLE_NOT_FOUND", { articleId });
  }

  const count = await db.articleImage.count({ where: { articleId: artId } });

  const image = await db.articleImage.create({
    data: {
      articleId: artId,
      imageUrl: String(imageUrl),
      caption: caption ? sanitizeText(caption) : null,
      order: order !== undefined ? Number(order) : count,
    },
  });

  if (!existing.imageUrl) {
    await db.article.update({
      where: { id: artId },
      data: { imageUrl },
    });
  }

  return image;
};

const removeImage = async (articleId, imageId) => {
  const artId = toNumberId(articleId);
  const imgId = toNumberId(imageId);

  const image = await db.articleImage.findFirst({
    where: { id: imgId, articleId: artId },
  });
  if (!image) {
    throw createHttpError(404, "Image introuvable pour cet article.", "ARTICLE_IMAGE_NOT_FOUND");
  }

  await db.articleImage.delete({ where: { id: imgId } });

  const article = await db.article.findUnique({ where: { id: artId } });
  if (article && article.imageUrl === image.imageUrl) {
    const firstImage = await db.articleImage.findFirst({
      where: { articleId: artId },
      orderBy: { order: "asc" },
    });
    await db.article.update({
      where: { id: artId },
      data: { imageUrl: firstImage ? firstImage.imageUrl : null },
    });
  }

  return { success: true };
};

const updateImageOrder = async (articleId, imageId, data) => {
  const artId = toNumberId(articleId);
  const imgId = toNumberId(imageId);

  const image = await db.articleImage.findFirst({
    where: { id: imgId, articleId: artId },
  });
  if (!image) {
    throw createHttpError(404, "Image introuvable pour cet article.", "ARTICLE_IMAGE_NOT_FOUND");
  }

  return db.articleImage.update({
    where: { id: imgId },
    data: {
      order: data.order !== undefined ? Number(data.order) : image.order,
      caption: data.caption !== undefined ? sanitizeText(data.caption) : image.caption,
    },
  });
};

module.exports = {
  toNumberId,
  normalizePayload,
  getAll,
  getById,
  create,
  update,
  remove,
  addImage,
  removeImage,
  updateImageOrder,
};
