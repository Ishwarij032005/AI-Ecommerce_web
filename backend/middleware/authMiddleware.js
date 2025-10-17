const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ message: 'No token provided' });
  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token format' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

const adminMiddleware = (req, res, next) => {
  const adminHeader = req.headers['x-admin-token'];
  if (process.env.ADMIN_TOKEN && adminHeader && adminHeader === process.env.ADMIN_TOKEN) {
    return next();
  }
  if (req.user && req.user.isAdmin) return next();
  return res.status(403).json({ message: 'Admin access required' });
};

module.exports = { authMiddleware, adminMiddleware };
