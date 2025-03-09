const {ROLES} = require('../utils/user');

const adminAccessMiddleware = (req, res, next) => {
  const isAdmin = req.user.role === ROLES.ADMIN;
  if (!isAdmin)
    return res.status(401).json({message: 'You are not to do this action'});

  next();
};

module.exports = {adminAccessMiddleware};
