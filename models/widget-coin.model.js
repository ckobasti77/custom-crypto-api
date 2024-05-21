const mongoose = require("mongoose");

const WidgetCoinSchema = mongoose.Schema(
  {
    display_symbol: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    last_price_usd: {
      type: Number,
      required: false,
    },
    market_cap_rank: {
      type: Number,
      required: false,
    },
    price_change_1D_percent: {
      type: Number,
      required: false,
    },
    volume_24_usd: {
      type: Number,
      required: false,
    },
    price_svg: {
      type: String,
      required: false,
    },
    shortname: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const WidgetCoin = mongoose.model("WidgetCoin", WidgetCoinSchema);

const coinTimestampSchema = new mongoose.Schema({
  coinId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WidgetCoin",
    required: true,
  },
  timestamps: [
    {
      time: { type: Date, required: true },
      value_in_usd: { type: Number, required: true },
      volume_24h_usd: { type: Number, required: true },
    },
  ],
});

const CoinTimestamp = mongoose.model("CoinTimestamp", coinTimestampSchema);

module.exports = { WidgetCoin, CoinTimestamp };
