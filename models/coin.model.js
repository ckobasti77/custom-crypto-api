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
    last_market_cap_usd: {
      type: Number,
      required: false,
    },
    total_supply: {
      type: Number,
      required: false,
    },
    visits_24h_rank: {
      type: Number,
      required: false,
    },
    btc_price: {
      type: Number,
      required: false,
    },
    btc_change: {
      type: Number,
      required: false,
    },
    created: {
      type: Number,
      required: false,
    },
    ath_usd: {
      type: Number,
      required: false,
    },
    ath_date: {
      type: Number,
      required: false,
    },
    green_days: {
      type: Number,
      required: false,
    },
    total_score: {
      type: Number,
      required: false,
    },
    cmgr_3m: {
      type: Number,
      required: false,
    },
    average_mktcap_all_time: {
      type: Number,
      required: false,
    },
    first_price_usd: {
      type: Number,
      required: false,
    },
    coin_age: {
      type: Number,
      required: false,
    },
    winning_months_trailing_12m: {
      type: Number,
      required: false,
    },
    score: {
      type: Number,
      required: false,
    },
    timestamps: {
      type: [[Number]],
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const Coin = mongoose.model("Coin", CoinSchema);

module.exports = Coin;