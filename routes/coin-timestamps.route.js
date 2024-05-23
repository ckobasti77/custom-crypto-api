const express = require("express");
const router = express.Router();
const { CoinTimestamp } = require("../models/widget-coin.model.js");
const { getTimestamps, updateTimestampsAndGenerateSVG, deleteAllTimestamps, getSingleCoinTimestamps } = require("../controllers/coin-timestamp.controller.js")

router.get("/", getTimestamps);
router.get("/:display_symbol/:name", getSingleCoinTimestamps);
router.put("/", updateTimestampsAndGenerateSVG);
router.delete("/", deleteAllTimestamps);

module.exports = router;
