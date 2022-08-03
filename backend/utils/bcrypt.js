const bcrypt = require('bcrypt');
const config = require('../config');

async function compareHash(candidate, hash) {
  try {
    const compare = await bcrypt.compare(candidate, hash);
    return compare;
  } catch (e) {
    console.error(e);
    throw new Error("Error al comparar los hash's con bcrypt");
  }
}

async function createHash(string) {
  try {
    const SALT = Number(config.salt);
    const salt = await bcrypt.genSalt(SALT);
    const hash = await bcrypt.hash(string, salt);

    return hash;
  } catch (e) {
    console.error(e);
    throw new Error('Error al crear el hash con bcrypt');
  }
}

module.exports = {
  createHash,
  compareHash,
};
