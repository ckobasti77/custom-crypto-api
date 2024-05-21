const { default: axios } = require("axios");
const { WidgetCoin } = require("../models/widget-coin.model");
const redis = require('redis');

const client = redis.createClient();
const lock = promisify(client.set).bind(client);

const getAllWidgetCoins = async (req, res) => {
  const widgetCoins = await WidgetCoin.find({});

  res.status(200).send(widgetCoins);
};

const updateAllWidgetCoins = async () => {
  try {
    const isLocked = await lock(lockKey, lockValue, 'NX', 'EX', 60); // Lock for 110 seconds

    if (!isLocked) {
      console.log('Another instance is already running');
      return;
    }

    console.log(`WIDGET DATA START: ${new Date().toISOString()}`);

    await WidgetCoin.deleteMany({});

    const response = await axios.get(
      "https://coincodex.com/apps/coincodex/cache/all_coins.json"
    );
    const coins = response.data;

    await WidgetCoin.insertMany(coins);
  } catch (error) {
    console.error("Error fetching or updating WidgetCoin data:", error);
  } finally {
    client.del(lockKey);
    console.log(`WIDGET DATA COMPLETION: ${new Date().toISOString()}`);
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
