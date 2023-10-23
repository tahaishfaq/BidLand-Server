const Property = require('../models/Property');
const Bidding = require('../models/Bidding')
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
    const biddingDurationInMinutes = 7; // Adjust the bidding duration as needed

    // Set bidding start time to current time
    property.biddingStartTime = currentTime;

    // Calculate bidding end time by adding the bidding duration to current time
    const biddingEndTime = new Date(currentTime.getTime() + biddingDurationInMinutes * 60000);
    property.biddingEndTime = biddingEndTime;

    property.isBidding = true;
    await property.save();

    res.json({
      property,
      message: 'Bidding started for the property.',
      biddingStartTime: property.biddingStartTime,
      biddingEndTime: property.biddingEndTime
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
  
    try {
      if (req.user.role.toLowerCase() === 'user') {
        const bidding = new Bidding({
          propertyId,
          userId,
          biddingPrice
        });
        await bidding.save();
        res.json({ bid: bidding, message: 'Bid placed successfully.' });
      } else {
        res.status(403).json({ message: 'Only users can place bids' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  module.exports = {
    placeBid
  };
  
module.exports = {
  startBidding,
  stopBidding,
  placeBid,
};
