const express = require('express');
const { loginUser, registerUser, viewSellerProfile, forgotPassword, resetPassword, getAllSellers } = require('../controllers/userController');
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/seller/:userId',  viewSellerProfile);
router.get('/get-all-sellers', getAllSellers);


router.get('/protected-route', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

router.get('/admin-route', verifyToken, verifyRole(['admin']), (req, res) => {
  res.json({ message: 'This is an admin-only route' });
});
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password', resetPassword);



module.exports = router;
