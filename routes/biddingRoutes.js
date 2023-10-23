const express = require('express');
const router = express.Router();
const biddingController = require('../controllers/biddingController');
const { verifyRole, verifyToken } = require('../middlewares/authMiddleware');
const { allowSellerToUpdateProperty } = require('../middlewares/propertyMiddleware');
const { allowSellerToAddBid, isBiddingEnabled } = require('../middlewares/biddingMiddleware');

// Route to start bidding for a property
router.put('/:propertyId/startBidding',   biddingController.startBidding);

// Route to stop bidding for a property
router.put('/:propertyId/stopBidding',  biddingController.stopBidding);

router.post('/:propertyId/placeBid', verifyToken , allowSellerToAddBid, isBiddingEnabled ,biddingController.placeBid);

module.exports = router;
