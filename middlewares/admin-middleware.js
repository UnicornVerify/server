const jwt = require("jsonwebtoken");

const adminMiddleware = async (req, res, next) => {
    const { adminToken } = req.cookies;

    if (!adminToken) {
        return res.status(401).json({ success: false, message: 'Admin Not Authorized: No token provided' });
    }

    try {
        const tokenDecode = jwt.verify(adminToken, process.env.JWT_ADMIN_SECRET_KEY);

        if (tokenDecode?.id) {
            req.admin = { id: tokenDecode.id };
            next();
        } else {
            return res.status(401).json({ success: false, message: 'Admin Not Authorized: Invalid token' });
        }
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Admin Not Authorized: ' + error.message });
    }
};

module.exports = adminMiddleware;
