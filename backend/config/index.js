const path = require('path');

require('dotenv').config({
  path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`),
});

module.exports = {
  port: process.env.PORT,
  salt: process.env.SALT,
  dbUri: process.env.DB_CONNECTION,
  jwt: {
    secret: process.env.JWT_SECRET,
    duration: process.env.JWT_TOKEN_DURATION,
  },
};
