const express = require("express");
const userReportController = require("../controllers/userReport");
const router = express.Router();

router.get("/", userReportController.getAllUserReport);
router.post("/", userReportController.createUserReportData);
router.delete("/:id", userReportController.deleteUserReport);

module.exports = router;
