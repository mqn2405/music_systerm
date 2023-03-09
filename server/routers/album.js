const express =  require('express');
const albumController = require('../controllers/album');
const router = express.Router();

router.get('/', albumController.getAllAlbum);
router.post('/', albumController.createAlbum);
router.put('/:albumId', albumController.updateAlbum);
router.delete('/:albumId', albumController.deleteAlbum);
router.get('/:id', albumController.getAlbumById);

module.exports = router;