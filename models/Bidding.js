const mongoose = require('mongoose');

const winSchema = new mongoose.Schema({
  winnerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
});

const biddingSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  biddingPrice: { type: Number, required: true },
  user: { type: Object },
  winInfo: winSchema, // Include the winSchema as a subdocument
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bidding', biddingSchema);
