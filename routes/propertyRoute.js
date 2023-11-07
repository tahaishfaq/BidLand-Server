const express = require('express');
const { addProperty, viewProperties, updateProperty, deleteProperty, viewProperty, getUserProperties, getBiddingProperties, viewBids, writeReview, viewPropertyReviews } = require('../controllers/propertyController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const {allowSellerToUpdateProperty, allowSellerToDeleteProperty} = require("../middlewares/propertyMiddleware")
const router = express.Router();

router.post('/add', verifyToken, verifyRole(['seller']), addProperty);
router.get('/view', viewProperties);
router.get('/view/:propertyId', viewProperty); 
router.put('/update/:propertyId', verifyToken, allowSellerToUpdateProperty, updateProperty);
router.delete('/delete/:propertyId', verifyToken, allowSellerToDeleteProperty, deleteProperty);
router.get('/:userId/properties', getUserProperties);
router.get('/get-bidding-properties', getBiddingProperties);
router.get('/bids/:propertyId', viewBids);
router.post('/review/:propertyId', writeReview);
module.exports = router;
