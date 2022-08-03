const express = require('express');
const config = require('./config');
const router = require('./routes');
const { connectionToDB } = require('./database/conect');

const app = express();

const PORT = config.port;

app.use(express.json());
app.use('/api/v1', router);

app.listen(PORT, async () => {
  console.log('The server is running on port ' + PORT);

  await connectionToDB();
});
