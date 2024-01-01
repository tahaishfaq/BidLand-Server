const Property = require('../models/Property');
const Bidding = require('../models/Bidding')
const User = require('../models/User')
const startBidding = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      throw new Error('Property not found.');
    }

    if (property.isBidding) {
      throw new Error('Bidding is already active for this property.');
    }

    const currentTime = new Date();

    // Set the bidding start time to the current time in Pakistan local time format
    property.biddingStartTime = currentTime.toLocaleString('en-US', {
      timeZone: 'Asia/Karachi',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Calculate the bidding end time by adding 7 days in milliseconds to the current time
    const biddingEndTime = currentTime.getTime() + 7 * 24 * 60 * 60 * 1000;

    // Set the bidding end time in Pakistan local time format
    property.biddingEndTime = new Date(biddingEndTime).toLocaleString('en-US', {
      timeZone: 'Asia/Karachi',
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    property.isBidding = true;
    property.winner = null;
    property.isBiddingWinnerDeclared = false;
    await property.save();

    res.json({
      property,
      message: 'Bidding started for the property.',
      biddingStartTime: property.biddingStartTime,
      biddingEndTime: property.biddingEndTime,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const stopBidding = async (req, res) => {
  const { propertyId } = req.params;

  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      throw new Error('Property not found.');
    }

    if (!property.isBidding) {
      throw new Error('Bidding is not active for this property.');
    }

    property.isBidding = false;
    property.biddingStartTime = null;
    property.biddingEndTime = null;
    await property.save();

    res.json({ property, message: 'Bidding stopped for the property.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const placeBid = async (req, res) => {
    const { propertyId } = req.params;
    const userId = req.user.userId;  // Corrected to req.user.userId
    const { biddingPrice } = req.body;
  
    const user = await User.findById(userId).select('-password');
    try {
      if (req.user.role.toLowerCase() === 'user') {
        const bidding = new Bidding({
          propertyId,
          userId,
          user,
          biddingPrice
        });
        const property = await Property.findById(propertyId);
        await property.bids.push(bidding);
        await bidding.save();
        await property.save();

        res.json({ bid: bidding, user: user, message: 'Bid placed successfully.' });
      } else {
        res.status(403).json({ message: 'Only users can place bids' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  

module.exports = {
  startBidding,
  stopBidding,
  placeBid,
};
