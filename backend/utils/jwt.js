const jwt = require('jsonwebtoken');
const config = require('../config');

async function signJwt(object) {
  try {
    const token = await jwt.sign(object, config.jwt.secret, {
      algorithm: 'HS256',
      expiresIn: config.jwt.duration,
    });
    return token;
  } catch (e) {
    console.error(e);
    throw new Error('Error al crear el token');
  }
}

async function verifyJwt(token) {
  try {
    const decoded = await jwt.verify(token, config.jwt.secret);
    return {
      valid: true,
      decoded,
      expired: false,
    };
  } catch (e) {
    console.error(e);
    return {
      valid: false,
      decoded: null,
      expired: e.message === 'jwt expired',
    };
  }
}

module.exports = {
  signJwt,
  verifyJwt,
};
