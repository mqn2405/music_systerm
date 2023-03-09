const express = require("express");
const countryController = require("../controllers/country");
const router = express.Router();

router.get("/", countryController.getAllCountry);
router.get("/:countryId", countryController.getCountryDetail);
router.post("/", countryController.createCountry);
router.put("/:countryId", countryController.updateCountry);
router.delete("/:countryId", countryController.deleteCountry);

module.exports = router;
