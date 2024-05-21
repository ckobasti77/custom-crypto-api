const mongoose = require('mongoose');

const timestampSchema = new mongoose.Schema({
  coinSymbol: { type: String, required: true },
  timestamps: [{
    time: { type: Date, required: true },
    value_in_usd: { type: Number, required: true },
    volume_24h_usd: { type: Number, required: true }
  }]
});

const Timestamp = mongoose.model('Timestamp', timestampSchema);

module.exports = Timestamp;