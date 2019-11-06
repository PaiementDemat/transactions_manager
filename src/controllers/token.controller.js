const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config/config')

const createToken = ( payload, expiresIn ) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

const validateToken = ( token, callback ) => {
    jwt.verify(token, JWT_SECRET, callback);
}

const readToken = request => {
    const bToken = request.headers['Authorization'];

    return bToken.slice(7)
}

module.exports = {
    createToken,
    validateToken,
    readToken
}