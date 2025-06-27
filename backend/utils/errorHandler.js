const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
  logger(`Error: ${err.message}`);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
};

module.exports = errorHandler;