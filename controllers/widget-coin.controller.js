const { default: axios } = require("axios");
const WidgetCoin = require("../models/widget-coin.model");

const getAllWidgetCoins = async (req, res) => {
  const widgetCoins = await WidgetCoin.find({});

  res.status(200).send(widgetCoins);
};

const updateAllWidgetCoins = async () => {
  try {
    console.log(`WIDGET DATA START: ${new Date().toISOString()}`);

    // Fetch coin data from the API
    const response = await axios.get(
      "https://coincodex.com/apps/coincodex/cache/all_coins.json"
    );
    const coins = response.data;

    // Prepare bulk operations
    const bulkOps = coins.map((coin) => ({
      updateOne: {
        filter: { display_symbol: coin.display_symbol, name: coin.name },
        update: {
          $set: {
            display_symbol: coin.display_symbol,
            name: coin.name,
            last_price_usd: coin.last_price_usd,
            market_cap_rank: coin.market_cap_rank,
            price_change_1D_percent: coin.price_change_1D_percent,
            volume_24_usd: coin.volume_24_usd,
            image_id: coin.image_id,
            image_t: coin.image_t,
          },
        },
        upsert: true, // Insert the document if it does not exist
      },
    }));

    // Execute bulk operations
    await WidgetCoin.bulkWrite(bulkOps);

  } catch (error) {
    console.error("Error fetching or updating WidgetCoin data:", error);
  } finally {
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
