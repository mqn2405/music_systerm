const express =  require('express');
const playlistController = require('../controllers/playlist');
const router = express.Router();

router.get('/', playlistController.getAllPlaylist);
router.post('/', playlistController.createNewPlaylist);
router.delete('/:id', playlistController.deletePlaylist);
router.post('/:id/song', playlistController.createPlaylistSong);
router.get('/:playlistId/song/:songId/check', playlistController.checkPlaylistSong);
router.get('/:id/song', playlistController.getPlaylistSong);
router.delete('/:playlistId/song/:songId', playlistController.deletePlaylistSong);
router.put('/:playlistId', playlistController.updatePlaylistName);

module.exports = router;