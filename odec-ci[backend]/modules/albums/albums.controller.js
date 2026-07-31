const s = require('./albums.service.js');

const getAlbums = async (_req, res, next) => {
  try {
    res.json(await s.getAll());
  } catch (error) {
    next(error);
  }
};

const getAlbum = async (req, res, next) => {
  try {
    res.json(await s.getById(req.params.id));
  } catch (error) {
    next(error);
  }
};

const createAlbum = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.coverUrl = '/uploads/' + req.file.filename;
    }
    const created = await s.create(req.body);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

const updateAlbum = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.coverUrl = '/uploads/' + req.file.filename;
    }
    const updated = await s.update(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteAlbum = async (req, res, next) => {
  try {
    await s.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const addImageToAlbum = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucune image fournie.' });
    }

    const imageUrl = '/uploads/' + req.file.filename;
    const image = await s.addImage(req.params.id, {
      imageUrl,
      caption: req.body.caption,
      order: req.body.order,
    });

    const album = await s.getById(req.params.id);
    if (!album.coverUrl) {
      await s.setCover(req.params.id, image.id);
    }

    res.status(201).json(image);
  } catch (error) {
    next(error);
  }
};

const removeImageFromAlbum = async (req, res, next) => {
  try {
    await s.removeImage(req.params.id, req.params.imageId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const updateAlbumImage = async (req, res, next) => {
  try {
    const updated = await s.updateImageOrder(req.params.id, req.params.imageId, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const setAlbumCover = async (req, res, next) => {
  try {
    const updated = await s.setCover(req.params.id, req.params.imageId);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAlbums,
  getAlbum,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addImageToAlbum,
  removeImageFromAlbum,
  updateAlbumImage,
  setAlbumCover,
};
