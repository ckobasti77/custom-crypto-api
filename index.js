require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const cron = require('node-cron');
const Coin = require("./models/coin.model.js");
const { WidgetCoin, CoinTimestamp } = require('./models/widgetCoin.model.js');

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const PORT = process.env.PORT || 8080;

app.get("/api/widget-coins", async (req, res) => {
  const widgetCoins = await WidgetCoin.find({});

  res.status(200).send(widgetCoins);
})

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Custom Crypto API" });
});

app.get("/api/coins", async (req, res) => {
  try {
    const order_by = req.query["order_by"];
    const queryValue = req.query["direction"] === 'asc' ? 1 : -1;
    const offset = req.query["offset"];
    const limit = req.query["limit"];

    console.log(queryValue)

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

    const removeNullArray = coins.filter(
      (coin) => coin[order_by] !== null && coin[order_by] !== undefined
    );

    const queriedArray = removeNullArray.slice((offset - 1) * limit, (offset * limit))

    res.status(200).json(queriedArray);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
});

app.delete("/api/widget-coins", async (req, res) => {
  try {
    const clear = await WidgetCoin.deleteMany({});
    res.send("Success");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.delete("/api/timestamps", async (req, res) => {
  try {
    const clear = await CoinTimestamp.deleteMany({});
    res.send("Success");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const postData = async () => {
  try {
    console.log(new Date().toISOString())

    const response = await axios.get(
      "https://coincodex.com/apps/coincodex/cache/all_coins.json"
    );
    const coins = response.data;

    await Coin.insertMany(coins);

    console.log("Data synchronization complete");
  } catch (error) {
    console.error("Error fetching or updating data:", error);
  } finally {
    console.log(new Date().toISOString())
  }
};
const updateWidgetData = async () => {
  try {
    console.log(`WIDGET DATA START: ${new Date().toISOString()}`)

    await WidgetCoin.deleteMany({});

    const response = await axios.get("https://coincodex.com/apps/coincodex/cache/all_coins.json");
    const coins = response.data;
    
    await WidgetCoin.insertMany(coins);

  } catch (error) {
    console.error("Error fetching or updating WidgetCoin data:", error);
  } finally {
    console.log(`WIDGET DATA COMPLETION: ${new Date().toISOString()}`)
  }
};

const generateSvgGraph = (prices) => {
  if (prices.length < 2) {
    throw new Error('Not enough data points to generate a graph.');
  }

  const width = 800;
  const height = 400;
  const padding = 50;
  const data = prices.slice(-42);
  const minPrice = Math.min(...data);
  const maxPrice = Math.max(...data);

  const xScale = (index) => (index / (data.length - 1)) * (width - 2 * padding) + padding;
  const yScale = (price) => height - padding - ((price - minPrice) / (maxPrice - minPrice)) * (height - 2 * padding);

  const pathData = data
    .map((price, index) => `${index === 0 ? 'M' : 'L'} ${xScale(index)},${yScale(price)}`)
    .join(' ');

  const color = data[data.length - 1] > data[0] ? 'green' : 'red';

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="white"/>
      <path d="${pathData}" stroke="${color}" fill="none" stroke-width="2"/>
      <g font-size="10" fill="black">
        ${data.map((price, index) => `
          <text x="${xScale(index)}" y="${height - padding + 15}" text-anchor="middle">${index % 6 === 0 ? index : ''}</text>
          <text x="${padding - 10}" y="${yScale(price) + 5}" text-anchor="end">${index === 0 || index === data.length - 1 ? price.toFixed(2) : ''}</text>
        `).join('')}
      </g>
    </svg>
  `;
};

const updateTimestampsAndGenerateSVG = async () => {
  try {
    console.log(`TIMESTAMPS DATA START: ${new Date().toISOString()}`);

    const widgetCoins = await WidgetCoin.find({});
    const now = new Date().toISOString();

    const timestampOps = widgetCoins.map(coin => ({
      updateOne: {
        filter: { coinId: coin._id },
        update: {
          $push: {
            timestamps: {
              $each: [{ time: now, value_in_usd: coin.last_price_usd, volume_24h_usd: coin.volume_24_usd }],
              $slice: -42
            }
          }
        },
        upsert: true
      }
    }));

    await CoinTimestamp.bulkWrite(timestampOps);

    for (const coin of widgetCoins) {
      const coinTimestamps = await CoinTimestamp.findOne({ coinId: coin._id });
      const prices = coinTimestamps.timestamps.map(ts => ts.value_in_usd);
      const svg = generateSvgGraph(prices);

      await WidgetCoin.updateOne({ _id: coin._id }, { $set: { price_svg: svg } });
    }

    console.log("TIMESTAMPS DATA COMPLETION: " + new Date().toISOString());
  } catch (error) {
    console.error("Error fetching or updating CoinTimestamp data:", error);
  }
};

cron.schedule('*/2 * * * *', () => {
  updateWidgetData();
});

cron.schedule('0 */4 * * *', () => {
  updateTimestampsAndGenerateSVG();
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to database!");
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(() => {
    console.log("Connection failed!");
  });
