const logger = require('../utils/logger');

const roleCheck = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    logger(`Access denied for user ${req.user.id}: Role ${req.user.role} not allowed`);
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

const categoryCheck = (req, res, next) => {
  const { category } = req.body;
  if (category && !req.user.categories.includes(category)) {
    logger(`Access denied for user ${req.user.id}: Not authorized for category ${category}`);
    return res.status(403).json({ message: 'Not authorized for this category' });
  }
  next();
};

module.exports = { roleCheck, categoryCheck };