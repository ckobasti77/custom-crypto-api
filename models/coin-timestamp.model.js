const mongoose = require("mongoose");

const coinTimestampSchema = new mongoose.Schema({
    name: {
      type: String,
      required: false,
    },
    display_symbol: {
      type: String,
      required: false,
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
  
  module.exports = CoinTimestamp;
  