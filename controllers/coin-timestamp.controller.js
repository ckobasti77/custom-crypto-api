const { default: axios } = require("axios");
const WidgetCoin = require("../models/widget-coin.model.js");
const CoinTimestamp = require("../models/coin-timestamp.model.js");

const getTimestamps = async (req, res) => {
  try {
    const timestamps = CoinTimestamp.find({});

    res.send(timestamps);
  } catch (error) {
    console.log(error);
  }
};

const generateSvgGraph = (prices) => {
  const width = 800;
  const height = 400;
  const padding = 50;
  const data = prices.slice(-42);
  const minPrice = Math.min(...data);
  const maxPrice = Math.max(...data);

  const xScale = (index) =>
    (index / (data.length - 1)) * (width - 2 * padding) + padding;
  const yScale = (price) =>
    height -
    padding -
    ((price - minPrice) / (maxPrice - minPrice)) * (height - 2 * padding);

  const pathData = data
    .map(
      (price, index) =>
        `${index === 0 ? "M" : "L"} ${xScale(index)},${yScale(price)}`
    )
    .join(" ");

  const color = data[data.length - 1] > data[0] ? "green" : "red";

  return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white"/>
        <path d="${pathData}" stroke="${color}" fill="none" stroke-width="2"/>
        <g font-size="10" fill="black">
          ${data
            .map(
              (price, index) => `
            <text x="${xScale(index)}" y="${height - padding + 15}" text-anchor="middle">${index % 6 === 0 ? index : ""}</text>
            <text x="${padding - 10}" y="${yScale(price) + 5}" text-anchor="end">${index === 0 || index === data.length - 1 ? price : ""}</text>
          `
            )
            .join("")}
        </g>
      </svg>
    `;
};

const updateTimestampsAndGenerateSVG = async () => {
  try {
    console.log(`TIMESTAMPS DATA START: ${new Date().toISOString()}`);

    const widgetCoins = await WidgetCoin.find({});
    const now = new Date().toISOString();
    
    const timestampOps = widgetCoins.map((coin) => ({
      updateOne: {
        filter: { display_symbol: coin.display_symbol, name: coin.name },
        update: {
          $setOnInsert: {
            name: coin.name,
            display_symbol: coin.display_symbol,
          },
          $push: {
            timestamps: {
              $each: [
                {
                  time: now,
                  value_in_usd: coin.last_price_usd,
                  volume_24h_usd: coin.volume_24_usd,
                },
              ],
              $slice: -42,
            },
          },
        },
        upsert: true,
      },
    }));

    console.log(timestampOps)

    await CoinTimestamp.bulkWrite(timestampOps);

    for (const coin of widgetCoins) {
      const coinTimestamps = await CoinTimestamp.findOne({ display_symbol: coin.display_symbol, name: coin.name });
      const prices = coinTimestamps.timestamps.map((ts) => ts.value_in_usd);
      const svg = generateSvgGraph(prices);

      await WidgetCoin.updateOne(
        { _id: coin._id },
        { $set: { price_svg: svg, icon: `https://cryptify.space/img/${coin.shortname}.avif` } }
      );
    }

    console.log("TIMESTAMPS DATA COMPLETION: " + new Date().toISOString());
  } catch (error) {
    console.error("Error fetching or updating CoinTimestamp data:", error);
  }
};


const deleteAllTimestamps = async (req, res) => {
  try {
    const clear = await CoinTimestamp.deleteMany({});
    res.send("Success");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSingleCoinTimestamps = async (req, res) => {
  try {
    const { display_symbol, name } = req.params;
    const singleCoin = await CoinTimestamps.findOne({ display_symbol, name });
    res.send(singleCoin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTimestamps,
  getSingleCoinTimestamps,
  updateTimestampsAndGenerateSVG,
  deleteAllTimestamps,
};
