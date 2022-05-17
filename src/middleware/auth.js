const jwt = require('jsonwebtoken');
const config = process.env;

const verifyToken = (req, res, next) => {

    // const token = req.body.token || req.query.token || req.headers['x-access-token'];
    
    const token = req.headers['x-access-token'];

    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
        req.user = decoded.user;
        
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
    return next();
};

module.exports = verifyToken;