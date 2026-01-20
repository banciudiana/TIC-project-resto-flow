const { verifyToken } = require('../utils/auth');


function validateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "No token found" });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = decoded; 
    next();
}


const isOwner = (req, res, next) => {
  
    if (!req.user) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    if (req.user.role !== 'ROLE_OWNER') {
        return res.status(403).json({ 
            error: "Access denied. This action requires OWNER privileges." 
        });
    }

    next(); 
};


module.exports = { validateToken, isOwner };