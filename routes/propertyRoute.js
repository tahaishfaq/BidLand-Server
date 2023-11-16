const express = require('express');
const { addProperty, viewProperties, updateProperty, deleteProperty, viewProperty, getUserProperties, getBiddingProperties, viewBids, writeReview, viewPropertyReviews, filterByPriceRange, filterByPropertyCity, filterByPropertyType, addReport } = require('../controllers/propertyController');
const { verifyToken, verifyRole, authenticateUser } = require('../middlewares/authMiddleware');
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
router.get('/filterByPropertyType', filterByPropertyType);
router.get('/filterByPropertyCity', filterByPropertyCity);
router.get('/filterByPriceRange', filterByPriceRange);
router.post('/report/:propertyId', verifyToken, addReport);
module.exports = router;
