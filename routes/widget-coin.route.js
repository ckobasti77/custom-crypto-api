const express = require("express");
const router = express.Router();
const Coin = require("../models/coin.model.js");
const { getAllWidgetCoins, updateAllWidgetCoins, getSingleWidgetCoin, deleteAllWidgetCoins } = require('../controllers/widget-coin.controller.js')

router.get("/", getAllWidgetCoins);
router.put("/", updateAllWidgetCoins);
router.get("/:display_symbol/:name", getSingleWidgetCoin);
router.delete("/", deleteAllWidgetCoins);

module.exports = router;