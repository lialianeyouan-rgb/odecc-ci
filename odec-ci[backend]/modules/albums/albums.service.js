const sanitizeHtml = require('sanitize-html');
const { createHttpError } = require('../../utils/httpError.js');
const { db } = require('../../config/db.js');

const toNumberId = (id, label = 'ID') => {
  const numId = Number(id);
  if (!Number.isInteger(numId) || numId <= 0) {
    throw createHttpError(400, `${label} invalide. La valeur doit être un entier positif.`, 'INVALID_ID', { received: id });
  }
  return numId;
};

const sanitizeText = (value) =>
  sanitizeHtml(String(value || ''), { allowedTags: [], allowedAttributes: {} }).trim();

const normalizeAlbumPayload = (data = {}) => {
  const title = sanitizeText(data.title);
  const description = sanitizeText(data.description);

  if (!title) {
    throw createHttpError(400, "Le titre de l'album est obligatoire.", 'ALBUM_TITLE_REQUIRED');
  }

  return {
    title,
    description: description || null,
    coverUrl: data.coverUrl ? String(data.coverUrl) : null,
  };
};

// CORRIGÉ : Récupération et fusion manuelle
const getAll = async () => {
  const albums = await db.album.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const albumImages = await db.albumImage.findMany({
    orderBy: { order: 'asc' },
  });

  return albums.map(album => {
    const matchingImages = albumImages.filter(img => img.albumId === album.id);
    return {
      ...album,
      images: matchingImages,
      _count: { images: matchingImages.length }
    };
  });
};

// CORRIGÉ : Plus d'include natif
const getById = async (id) => {
  const albId = toNumberId(id);
  const album = await db.album.findUnique({
    where: { id: albId },
  });

  if (!album) {
    throw createHttpError(404, 'Album introuvable.', 'ALBUM_NOT_FOUND', { id });
  }

  const images = await db.albumImage.findMany({
    where: { albumId: albId },
    orderBy: { order: 'asc' },
  });

  return {
    ...album,
    images,
  };
};

// CORRIGÉ : Plus d'include natif
const create = async (data) => {
  const createdAlbum = await db.album.create({
    data: normalizeAlbumPayload(data),
  });

  return {
    ...createdAlbum,
    images: [],
    _count: { images: 0 }
  };
};

// CORRIGÉ : Plus d'include natif
const update = async (id, data) => {
  const albumId = toNumberId(id);
  const existing = await db.album.findUnique({ where: { id: albumId } });
  if (!existing) {
    throw createHttpError(404, 'Album introuvable. Impossible de le modifier.', 'ALBUM_NOT_FOUND', { id });
  }

  const updatedAlbum = await db.album.update({
    where: { id: albumId },
    data: normalizeAlbumPayload(data),
  });

  const images = await db.albumImage.findMany({
    where: { albumId },
    orderBy: { order: 'asc' },
  });

  return {
    ...updatedAlbum,
    images,
    _count: { images: images.length }
  };
};

const remove = async (id) => {
  const albumId = toNumberId(id);
  const existing = await db.album.findUnique({ where: { id: albumId } });
  if (!existing) {
    throw createHttpError(404, 'Album introuvable. Impossible de le supprimer.', 'ALBUM_NOT_FOUND', { id });
  }

  return db.album.delete({ where: { id: albumId } });
};

const addImage = async (albumId, { imageUrl, caption, order }) => {
  const albId = toNumberId(albumId, 'Album ID');

  const existing = await db.album.findUnique({ where: { id: albId } });
  if (!existing) {
    throw createHttpError(404, 'Album introuvable.', 'ALBUM_NOT_FOUND', { albumId });
  }

  const count = await db.albumImage.count({ where: { albumId: albId } });

  return db.albumImage.create({
    data: {
      albumId: albId,
      imageUrl: String(imageUrl),
      caption: caption ? sanitizeText(caption) : null,
      order: order !== undefined ? Number(order) : count,
    },
  });
};

const removeImage = async (albumId, imageId) => {
  const albId = toNumberId(albumId, 'Album ID');
  const imgId = toNumberId(imageId, 'Image ID');

  const image = await db.albumImage.findFirst({ where: { id: imgId, albumId: albId } });
  if (!image) {
    throw createHttpError(404, 'Image introuvable dans cet album.', 'ALBUM_IMAGE_NOT_FOUND', { albumId, imageId });
  }

  await db.albumImage.delete({ where: { id: imgId } });

  const album = await db.album.findUnique({ where: { id: albId } });
  if (album && album.coverUrl === image.imageUrl) {
    const firstImage = await db.albumImage.findFirst({
      where: { albumId: albId },
      orderBy: { order: 'asc' },
    });
    await db.album.update({
      where: { id: albId },
      data: { coverUrl: firstImage ? firstImage.imageUrl : null },
    });
  }

  return { success: true };
};

const updateImageOrder = async (albumId, imageId, data) => {
  const albId = toNumberId(albumId, 'Album ID');
  const imgId = toNumberId(imageId, 'Image ID');

  const image = await db.albumImage.findFirst({ where: { id: imgId, albumId: albId } });
  if (!image) {
    throw createHttpError(404, 'Image introuvable dans cet album.', 'ALBUM_IMAGE_NOT_FOUND');
  }

  return db.albumImage.update({
    where: { id: imgId },
    data: {
      order: data.order !== undefined ? Number(data.order) : image.order,
      caption: data.caption !== undefined ? sanitizeText(data.caption) : image.caption,
    },
  });
};

// CORRIGÉ : Plus d'include natif
const setCover = async (albumId, imageId) => {
  const albId = toNumberId(albumId, 'Album ID');
  const imgId = toNumberId(imageId, 'Image ID');

  const image = await db.albumImage.findFirst({ where: { id: imgId, albumId: albId } });
  if (!image) {
    throw createHttpError(404, 'Image introuvable dans cet album.', 'ALBUM_IMAGE_NOT_FOUND');
  }

  const updatedAlbum = await db.album.update({
    where: { id: albId },
    data: { coverUrl: image.imageUrl },
  });

  const images = await db.albumImage.findMany({
    where: { albumId: albId },
    orderBy: { order: 'asc' },
  });

  return {
    ...updatedAlbum,
    images,
    _count: { images: images.length }
  };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  addImage,
  removeImage,
  updateImageOrder,
  setCover,
};