const { Router } = require('express');
const {
  getAlbums,
  getAlbum,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  addImageToAlbum,
  removeImageFromAlbum,
  updateAlbumImage,
  setAlbumCover,
} = require('./albums.controller.js');
const { protect } = require('../../middlewares/authMiddleware.js');
const upload = require('../../middlewares/upload.js');

const router = Router();

router.get('/', getAlbums);
router.get('/:id', getAlbum);
router.post('/', protect, upload.single('cover'), createAlbum);
router.put('/:id', protect, upload.single('cover'), updateAlbum);
router.delete('/:id', protect, deleteAlbum);

router.post('/:id/images', protect, upload.single('image'), addImageToAlbum);
router.delete('/:id/images/:imageId', protect, removeImageFromAlbum);
router.put('/:id/images/:imageId', protect, updateAlbumImage);
router.patch('/:id/images/:imageId/cover', protect, setAlbumCover);

module.exports = router;
