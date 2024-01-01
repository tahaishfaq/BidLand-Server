const mongoose = require('mongoose');
const Bidding = require('./Bidding'); 
const querySchema = require('./Query');

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  fixedPrice: { type: Number, required: true  },
  biddingPrice: { type: Number },
  bids: [Bidding.schema],
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Track the winner
  isBiddingWinnerDeclared: { type: Boolean, default: false },
  isBidding: { type: Boolean, default: false },
  biddingStartTime: { type: Date },
  biddingEndTime: { type: Date },
  specifications: [String],
  queries: [querySchema], 
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
    reports: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        feedbackMessage: { type: String, },
        feedbackReason: { type: String,  },
        timestamp: { type: Date, default: Date.now },
      }
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
  city: { type: String, },
  propertyType: { type: String,},
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Property', propertySchema);
