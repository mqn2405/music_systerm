const express =  require('express');
const songReportController = require('../controllers/songReport');
const router = express.Router();

router.get('/', songReportController.getAllSongReport);
router.post('/', songReportController.createSongReportData);
router.delete('/:id', songReportController.deleteSongReport);

module.exports = router;