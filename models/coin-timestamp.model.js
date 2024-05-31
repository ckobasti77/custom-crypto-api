const mongoose = require('mongoose');

const coinTimestampSchema = new mongoose.Schema({
  metadata: {
    display_symbol: { type: String, required: true },
    name: { type: String, required: true },
  },
  time: { type: Date, required: true },
  value_in_usd: { type: Number, required: true },
  volume_24h_usd: { type: Number, required: true },
}, {
  timeseries: {
    timeField: 'time',
    metaField: 'metadata',
    granularity: 'hours', 
  },
  autoCreate: false, 
  expireAfterSeconds: 86400 * 7, 
});

const CoinTimestamp = mongoose.model('CoinTimestamp', coinTimestampSchema);

module.exports = CoinTimestamp;
