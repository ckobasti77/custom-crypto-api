const { default: axios } = require("axios");
const WidgetCoin = require("../models/widget-coin.model");

// const getAllWidgetCoins = async (req, res) => {
//   const widgetCoins = await WidgetCoin.find({});

//   res.status(200).send(widgetCoins);
// };
const getAllWidgetCoins = async (req, res) => {
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
      ? await WidgetCoin.find({}).sort(sortObj)
      : await WidgetCoin.find({});

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

const updateAllWidgetCoins = async () => {
  try {
    console.log(`Widget COINS DATA START: ${new Date().toISOString()}`);

    await WidgetCoin.deleteMany({});

    const response = await axios.get(
      "https://coincodex.com/apps/coincodex/cache/all_coins.json"
    );
    const coins = response.data;

    await WidgetCoin.insertMany(coins);

    console.log("Data synchronization complete");
  } catch (error) {
    console.error("Error fetching or updating data:", error);
  } finally {
    console.log(`Widget COINS DATA COMPLETION: ${new Date().toISOString()}`);
  }
};


const getSingleWidgetCoin = async (req, res) => {
    try {
      const { display_symbol, name } = req.params;
      const singleWidgetCoin = await WidgetCoin.findOne({ display_symbol, name });
      res.send(singleWidgetCoin);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

const deleteAllWidgetCoins = async (req, res) => {
  try {
    const clear = await WidgetCoin.deleteMany({});
    res.send("Success");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllWidgetCoins,
  updateAllWidgetCoins,
  getSingleWidgetCoin,
  deleteAllWidgetCoins,
};
