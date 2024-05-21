require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require('node-cron');
const coinRoute = require("./routes/coin.route.js");
const widgetCoinRoute = require("./routes/widget-coin.route.js");
const coinTimestampsRoute = require("./routes/coin-timestamps.route.js");
const { updateAllCoins } = require('./controllers/coin.controller.js');
const { updateAllWidgetCoins } = require('./controllers/widget-coin.controller.js');
const { updateTimestampsAndGenerateSVG } = require('./controllers/coin-timestamp.controller.js');
const { default: axios } = require("axios");

const app = express();
const PORT = process.env.PORT || 8080;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to Custom Crypto API" });
});
app.use('/api/all-coins', coinRoute);
app.use('/api/widget-coins', widgetCoinRoute);
app.use('/api/coin-timestamps', coinTimestampsRoute);

cron.schedule('*/2 * * * *', () => {
  updateAllWidgetCoins();
  updateAllCoins();
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
