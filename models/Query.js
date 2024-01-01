const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userDetails: { type: Object, required: true },
  queryText: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  replyText: { type: String },
  replyTimestamp: { type: Date },
});

module.exports = querySchema;