const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config/config')

const createToken = ( payload, expiresIn ) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

const validateToken = ( token, callback ) => {
    jwt.verify(token, JWT_SECRET, callback);
}

const getToken = request => {
    if (request.headers['authorization']) {
        const bToken = request.headers['authorization'];

        return bToken.slice(7);
    }
    else return null
}

const readToken = token => {
    try {
        return jwt.decode(token)
    } catch (error) {
        return null
    }
}

module.exports = {
    createToken,
    validateToken,
    getToken,
    readToken
}