const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    let token = null;

    // Check cookie first
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } 
    // Fallback to Authorization header
    else if (req.header('Authorization') && req.header('Authorization').startsWith('Bearer ')) {
      token = req.header('Authorization').replace('Bearer ', '');
    }

    if (!token) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_budget_tracker_2026');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Session expired or invalid token' });
  }
};

module.exports = auth;
