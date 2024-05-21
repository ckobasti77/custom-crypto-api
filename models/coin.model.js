const mongoose = require("mongoose");

const CoinSchema = mongoose.Schema(
  {
    symbol: {
      type: String,
      required: false,
    },
    display_symbol: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    aliases: {
      type: String,
      required: false,
    },
    shortname: {
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
    volume_rank: {
      type: Number,
      required: false,
    },
    price_change_1H_percent: {
      type: Number,
      required: false,
    },
    price_change_1D_percent: {
      type: Number,
      required: false,
    },
    price_change_7D_percent: {
      type: Number,
      required: false,
    },
    price_change_30D_percent: {
      type: Number,
      required: false,
    },
    price_change_90D_percent: {
      type: Number,
      required: false,
    },
    price_change_180D_percent: {
      type: Number,
      required: false,
    },
    price_change_YTD_percent: {
      type: Number,
      required: false,
    },
    price_change_365D_percent: {
      type: Number,
      required: false,
    },
    price_change_3Y_percent: {
      type: Number,
      required: false,
    },
    price_change_5Y_percent: {
      type: Number,
      required: false,
    },
    price_change_ALL_percent: {
      type: Number,
      required: false,
    },
    volume_24_usd: {
      type: Number,
      required: false,
    },
    display: {
      type: String,
      required: false,
    },
    trading_since: {
      type: String,
      required: false,
    },
    supply: {
      type: Number,
      required: false,
    },
    last_update: {
      type: String,
      required: false,
    },
    ico_end: {
      type: String,
      required: false,
    },
    include_supply: {
      type: String,
      required: false,
    },
    use_volume: {
      type: String,
      required: false,
    },
    growth_all_time: {
      type: Number,
      required: false,
    },
    ccu_slug: {
      type: String,
      required: false,
    },
    image_id: {
      type: String,
      required: false,
    },
    image_t: {
      type: Number,
      required: false,
    },
    market_cap_usd: {
      type: Number,
      required: false,
    },
    categories: {
      type: [Number],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Coin = mongoose.model("Coin", CoinSchema);

module.exports = Coin;