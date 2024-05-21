const express = require("express");
const router = express.Router();
const Coin = require("../models/coin.model.js");
const {
  getAllCoins,
  deleteAllCoins,
  getSingleCoin,
  updateAllCoins,
} = require("../controllers/coin.controller.js");

router.get("/", getAllCoins);
router.put("/", updateAllCoins);
router.get("/:display_symbol/:name", getSingleCoin);
router.delete("/", deleteAllCoins);

module.exports = router;
