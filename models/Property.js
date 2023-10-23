const mongoose = require('mongoose');
const Bidding = require('./Bidding'); 

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  fixedPrice: { type: Number },
  biddingPrice: { type: Number },
  bids: [Bidding.schema],
  isBidding: { type: Boolean, default: false },
  biddingStartTime: { type: Date },
  biddingEndTime: { type: Date },
  specifications: [String],
  reviews: [{ type: String }],
  comments: [{ type: String }],
  images: [{ type: String }], // Array of image URLs
  location: {
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    },
    address: { type: String }
  },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Property', propertySchema);
