const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    // Get token from the header
    const token = req.header("x-auth-token");

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: "Autorisation refusée" });
    }

    // Verify the token
    try {
        const decoded = jwt.verify(token, process.env.jwtSecret);

        req.candidat = decoded.candidat;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Jeton n'est pas valide" });
    }
};
