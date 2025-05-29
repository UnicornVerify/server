const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not Authorized: No token provided' });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_USER_SECRET_KEY);

        if (tokenDecode?.id) {
            req.user = { id: tokenDecode.id };
            next();
        } else {
            return res.status(401).json({ success: false, message: 'Not Authorized: Invalid token' });
        }
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not Authorized: ' + error.message });
    }
};

module.exports = authMiddleware;
