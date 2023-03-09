const express = require("express");
const userSongController = require("../controllers/userSong");
const router = express.Router();

router.get("/", userSongController.getAllUserSong);
router.post("/", userSongController.createUserSong);
router.put("/:userSongId", userSongController.updateUserSong);
router.delete("/:userSongId", userSongController.deleteUserSong);

module.exports = router;
