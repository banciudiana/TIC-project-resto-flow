const { auth, db } = require('../config/firebase');

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized access. Token is missing.' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken; 
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token invalid or expired.' });
  }
};

// midd for checking Patron role
const isPatron = async (req, res, next) => {
  if (req.user && req.user.role === 'patron') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Patron role is required.' });
  }
};

module.exports = { verifyToken, isPatron };