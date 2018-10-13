const config = require('./config/config.js');
const express = require('express');
const path = require('path');

const publicPath = path.join(__dirname, '../public');

const app = express();
app.use(express.static(publicPath));

app.listen(config.port, () => {
  console.log(`Server is up on port ${config.port}`);
});
