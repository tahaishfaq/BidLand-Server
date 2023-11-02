const mongoose = require('mongoose');

const biddingSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  biddingPrice: { type: Number, required: true },
  user: { type: Object },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bidding', biddingSchema);
