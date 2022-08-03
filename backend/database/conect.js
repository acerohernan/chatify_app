const mongoose = require('mongoose');
const config = require('../config');

const DB_URI = config.dbUri;

async function connectionToDB() {
  try {
    await mongoose.connect(DB_URI);
    console.log(`The database is connected`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

module.exports = {
  connectionToDB,
};
