const mongoose = require('mongoose');
const Bidding = require('./Bidding'); 

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  fixedPrice: { type: Number, required: true  },
  biddingPrice: { type: Number },
  bids: [Bidding.schema],
  isBidding: { type: Boolean, default: false },
  biddingStartTime: { type: Date },
  biddingEndTime: { type: Date },
  specifications: [String],
  reviews: [
      {
        username: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        profilePicture: {
          type: String,
        },
        reviewText: {
          type: String,
        },
        rating: {
          type: Number,
          required: true,
        },
        // Add more fields related to reviews if needed
      },
    ],
  
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
  city: { type: String, required: true },
  propertyType: { type: String, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Property', propertySchema);
