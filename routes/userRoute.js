const express = require('express');
const { loginUser, registerUser, viewSellerProfile, forgotPassword, resetPassword, getAllSellers, updateUser, viewUserProfile, getAllUsers, deleteUserAccount, updateUserPassword, VerificationProfile, manageVerificationRequest, getPropertyReports, getReportsByPropertyId, addToFavorites, removeFromFavorites, getFavoriteProperties } = require('../controllers/userController');
const { verifyToken, verifyRole, authenticateAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/seller/:userId',  viewSellerProfile);
router.get('/user/:userId',  viewUserProfile);
router.get('/get-all-sellers', getAllSellers);
router.get('/get-all-users', getAllUsers);
router.delete('/delete/:userId', deleteUserAccount);
router.put('/update-password/:userId', updateUserPassword);
router.post("/resetpassword/:id", resetPassword);
router.post('/verify-profile/:userId',  VerificationProfile);
router.post('/manage-verification', authenticateAdmin, manageVerificationRequest);
router.get('/properties/reports', authenticateAdmin, getPropertyReports);
router.get('/properties/reports/:propertyId', authenticateAdmin, getReportsByPropertyId);


router.get('/protected-route', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

router.get('/admin-route', verifyToken, verifyRole(['admin']), (req, res) => {
  res.json({ message: 'This is an admin-only route' });
});
router.post('/forgot-password', forgotPassword);


router.put('/user/:userId', updateUser)

module.exports = router;
