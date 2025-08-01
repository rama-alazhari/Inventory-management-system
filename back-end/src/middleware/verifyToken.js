const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded._id) {
            return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
        }

        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.userId = user._id;
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in verifyToken:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = verifyToken;
