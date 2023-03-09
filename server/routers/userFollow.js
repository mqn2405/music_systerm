const express = require("express");
const userFollowerController = require("../controllers/userFollow");
const router = express.Router();

router.get("/:userId", userFollowerController.getUserFollower);
router.post("/", userFollowerController.createUserFollower);
router.delete("/:userId", userFollowerController.deleteUserFollower);
router.get("/:userId/check/:followed", userFollowerController.checkUserFollower);

module.exports = router;
