const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token.split(" ")[1], 'HelloWorld');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

const verifyRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied for this role' });
    }
    next();
  };
};

const authenticateAdmin = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required.' });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], 'HelloWorld');

    const user = await User.findOne({ _id: decoded.userId });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin authorization required.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = { verifyToken, verifyRole, authenticateAdmin };
