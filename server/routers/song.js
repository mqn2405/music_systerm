const express = require("express");
const songController = require("../controllers/song");
const router = express.Router();

router.get("/", songController.getAllSong);
router.post("/", songController.createSong);
router.put("/:songId", songController.updateSong);
router.delete("/:songId", songController.deleteSong);
router.get("/:songId", songController.getSongDetail);
router.get("/view/:songId", songController.updateSongView);
router.get("/hot/list", songController.getHotSong);
router.post("/:songId/download", songController.addSongDownloadData);
router.get('/favourite/data', songController.getUserSongFavourite)
router.put('/favourite/data', songController.changeUserFavouriteSong)
router.post("/:songId/user/listen", songController.createUserListenTime);
router.get("/user/listen", songController.getUserListenData);
router.get("/most-listen/list", songController.getMostListenList);
router.get("/most-favourite/list", songController.getMostFavourite);

module.exports = router;
