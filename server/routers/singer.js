const express =  require('express');
const singerController = require('../controllers/singer');
const router = express.Router();

router.get('/', singerController.getAllSinger);
router.post('/', singerController.createSinger);
router.put('/:singerId', singerController.updateSinger);
router.delete('/:singerId', singerController.deleteSinger);
router.put('/effect/:singerId', singerController.changeSingerEffect);
router.get('/effect/list', singerController.getPopularSinger);
router.get('/:singerId', singerController.getSingerDetail);

module.exports = router;