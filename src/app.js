const express = require('express');
const api = require('./api');
const globalErrorHandler = require('./handler/errorHandler');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Server is running...',
  });
});

app.use('/api', api);
app.use(globalErrorHandler);

module.exports = app;
