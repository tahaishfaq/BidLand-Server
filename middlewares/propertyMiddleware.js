const allowSellerToUpdateProperty = (req, res, next) => {
    if (req.user.role.toLowerCase() === 'seller') {
      next(); // Allow the update for sellers
    } else {
      res.status(403).json({ message: 'Only sellers can update properties' });
    }
  };

  const allowSellerToDeleteProperty = (req, res, next) => {
    if (req.user.role.toLowerCase() === 'seller') {
      next(); // Allow the update for sellers
    } else {
      res.status(403).json({ message: 'Only sellers can delete properties' });
    }
  };
  
  
  
  module.exports = { allowSellerToUpdateProperty , allowSellerToDeleteProperty};
  