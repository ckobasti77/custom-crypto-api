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
    icon: {
      type: String,
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const WidgetCoin = mongoose.model("WidgetCoin", WidgetCoinSchema);

module.exports = WidgetCoin;
