const Property = require('../models/Property');


const allowSellerToAddBid = (req, res, next) => {
    if (req.user.role.toLowerCase() === 'user') {
      next(); // Allow the update for sellers
    } else {
      res.status(403).json({ message: 'Only user can add bid' });
    }
  };

  const isBiddingEnabled = async (req, res, next) => {
    const { propertyId } = req.params;
  
    try {
      const property = await Property.findById(propertyId);
  
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
  
      if (!property.isBidding) {
        return res.status(403).json({ message: 'Bidding is not enabled for this property' });
      }
  
      next();
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  module.exports = {allowSellerToAddBid, isBiddingEnabled}