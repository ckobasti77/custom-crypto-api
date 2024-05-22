const { default: axios } = require("axios");
const Coin = require("../models/coin.model.js");

const getAllCoins = async (req, res) => {
  try {
    const order_by = req.query["order_by"];
    const queryValue = req.query["direction"] === "asc" ? 1 : -1;
    const offset = req.query["offset"];
    const limit = req.query["limit"];

    if (!order_by && !queryValue && !offset & !limit) {
      throw new Error("Query params invalid / missing.");
    }

    if (![1, -1].includes(queryValue) && order_by) {
      return res
        .status(400)
        .json({ message: "Invalid sort value: must be 1 or -1" });
    }
    const sortObj = { [order_by]: queryValue };

    // Use the sort object to sort the results
    const coins = order_by
      ? await Coin.find({}).sort(sortObj)
      : await Coin.find({});

    let removeNullArray;

    if (order_by) {
      removeNullArray = coins.filter(
        (coin) => coin[order_by] !== null && coin[order_by] !== undefined
      );
    } else {
      removeNullArray = coins;
    }

    let queriedArray;

    if (offset && limit) {
      queriedArray = removeNullArray.slice(
        (offset - 1) * limit,
        offset * limit
      );
    } else {
      queriedArray = removeNullArray;
    }

    res.status(200).json(queriedArray);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

const updateAllCoins = async () => {
  try {
    console.log(`ALL COINS DATA START: ${new Date().toISOString()}`);

    await Coin.deleteMany({});

    const response = await axios.get(
      "https://coincodex.com/apps/coincodex/cache/all_coins.json"
    );
    const coins = response.data;

    await Coin.insertMany(coins);

    console.log("Data synchronization complete");
  } catch (error) {
    console.error("Error fetching or updating data:", error);
  } finally {
    console.log(`ALL COINS DATA COMPLETION: ${new Date().toISOString()}`);
  }
};

const getSingleCoin = async (req, res) => {
  try {
    const { display_symbol, name } = req.params;
    const singleCoin = await Coin.findOne({ display_symbol, name });
    res.send(singleCoin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAllCoins = async (req, res) => {
  try {
    const clear = await Coin.deleteMany({});
    res.send("Success");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCoins,
  updateAllCoins,
  getSingleCoin,
  deleteAllCoins,
};
