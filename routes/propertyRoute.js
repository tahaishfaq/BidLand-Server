const express = require('express');
const { addProperty, viewProperties, updateProperty, deleteProperty, viewProperty, getUserProperties, getBiddingProperties, viewBids, writeReview, viewPropertyReviews, filterByPriceRange, filterByPropertyCity, filterByPropertyType, addReport, createCheckoutSession, fetchPayments, viewUserBids, winBid, getPropertyQueries, addPropertyQuery, replyToQuery } = require('../controllers/propertyController');
const { verifyToken, verifyRole, authenticateUser } = require('../middlewares/authMiddleware');
const {allowSellerToUpdateProperty, allowSellerToDeleteProperty} = require("../middlewares/propertyMiddleware")
const router = express.Router();

router.post('/add', verifyToken, verifyRole(['seller']), addProperty);
router.get('/view', viewProperties);
router.get('/view/:propertyId', viewProperty); 
router.put('/update/:propertyId', verifyToken, allowSellerToUpdateProperty, updateProperty);
router.delete('/delete/:propertyId', verifyToken,  deleteProperty);
router.get('/:userId/properties', getUserProperties);
router.get('/get-bidding-properties', getBiddingProperties);
router.get('/bids/:propertyId', viewBids);
router.post('/review/:propertyId', writeReview);
router.get('/filterByPropertyType', filterByPropertyType);
router.get('/filterByPropertyCity', filterByPropertyCity);
router.get('/filterByPriceRange', filterByPriceRange);
router.post('/report/:propertyId', verifyToken, addReport);
router.post('/create-checkout-session', createCheckoutSession);
router.get('/fetch-payments', fetchPayments);
router.post('/win-bid', winBid);

router.get('/queries/:propertyId',  getPropertyQueries)
router.post('/add-query/:propertyId', verifyToken, addPropertyQuery);
router.post('/reply-query/:queryId',  replyToQuery);

module.exports = router;
