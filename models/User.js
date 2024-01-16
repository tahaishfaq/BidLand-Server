const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'seller', 'admin'],
    default: 'user',
  },
  verification: {
    status: { type: String, enum: ['Requested', 'Approved', 'Rejected'] },
    isVerified: { type: Boolean, default: false },
    cnicFront: { type: String }, 
    cnicBack: { type: String },  
    reason: {
      type: String,
    },
  },
  profilePicture: String, 
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  phone: {
    type: String,
    required: true,
  },
  favorites: [
    {
      property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
      addedAt: { type: Date, default: Date.now },
    }
  ],
});

module.exports = mongoose.model('User', userSchema);
