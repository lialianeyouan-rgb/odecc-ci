const s = require('./articles.service.js');

const getArticles = async (_req, res, next) => {
  try {
    res.json(await s.getAll());
  } catch (error) {
    next(error);
  }
};

const getArticle = async (req, res, next) => {
  try {
    res.json(await s.getById(req.params.id));
  } catch (error) {
    next(error);
  }
};

const createArticle = async (req, res, next) => {
  try {
    const imageFiles = req.files || (req.file ? [req.file] : []);

    if (imageFiles.length > 0 && !req.body.imageUrl) {
      req.body.imageUrl = '/uploads/' + imageFiles[0].filename;
    }

    const created = await s.create(req.body, imageFiles);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

const updateArticle = async (req, res, next) => {
  try {
    const imageFiles = req.files || (req.file ? [req.file] : []);

    if (imageFiles.length > 0 && !req.body.imageUrl) {
      req.body.imageUrl = '/uploads/' + imageFiles[0].filename;
    }

    const updated = await s.update(req.params.id, req.body, imageFiles);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    await s.remove(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const addImageToArticle = async (req, res, next) => {
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

    res.status(201).json(image);
  } catch (error) {
    next(error);
  }
};

const removeImageFromArticle = async (req, res, next) => {
  try {
    await s.removeImage(req.params.id, req.params.imageId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const updateArticleImage = async (req, res, next) => {
  try {
    const updated = await s.updateImageOrder(req.params.id, req.params.imageId, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  addImageToArticle,
  removeImageFromArticle,
  updateArticleImage,
};
