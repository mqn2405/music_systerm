const express =  require('express');
const searchController = require('../controllers/search');
const router = express.Router();

router.post('/keyword', searchController.createKeyWordSearch)
router.get('/most', searchController.getSongMostSearch)

module.exports = router;