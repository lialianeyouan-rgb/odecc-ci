const { Router } = require('express');
const {
  createArticle,
  deleteArticle,
  getArticles,
  getArticle,
  updateArticle,
  addImageToArticle,
  removeImageFromArticle,
  updateArticleImage,
} = require('./articles.controller.js');
const { protect } = require('../../middlewares/authMiddleware.js');
const upload = require('../../middlewares/upload.js');

const router = Router();

router.get('/', getArticles);
router.get('/:id', getArticle);
router.post('/', protect, upload.array('images', 10), createArticle);
router.put('/:id', protect, upload.array('images', 10), updateArticle);
router.delete('/:id', protect, deleteArticle);

router.post('/:id/images', protect, upload.single('image'), addImageToArticle);
router.delete('/:id/images/:imageId', protect, removeImageFromArticle);
router.put('/:id/images/:imageId', protect, updateArticleImage);

module.exports = router;
