const { default: axios } = require("axios");
const WidgetCoin = require("../models/widget-coin.model");

const getAllWidgetCoins = async (req, res) => {
  const widgetCoins = await WidgetCoin.find({});

  res.status(200).send(widgetCoins);
};

const updateAllWidgetCoins = async () => {
  try {
    console.log(`ALL COINS DATA START: ${new Date().toISOString()}`);

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
    console.log(`ALL COINS DATA COMPLETION: ${new Date().toISOString()}`);
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
