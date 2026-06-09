const jwt = require('jsonwebtoken');
const { User, Role } = require('../database/models');
const env = require('../config/env');

const COOKIE_NAME = 'fotaza_token';

const attachUser = async (req, res, next) => {
  try {
    const token = req.cookies?.[COOKIE_NAME];

    res.locals.currentUser = null;
    res.locals.isAuthenticated = false;

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, env.auth.jwtSecret);

    const user = await User.findByPk(decoded.id, {
      include: [
        {
          model: Role,
          as: 'role'
        }
      ]
    });

    if (!user || !user.is_active) {
      res.clearCookie(COOKIE_NAME);
      return next();
    }

    req.user = user;
    res.locals.currentUser = user;
    res.locals.isAuthenticated = true;

    return next();
  } catch (error) {
    res.clearCookie(COOKIE_NAME);
    return next();
  }
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/auth/login');
  }

  return next();
};

const requireGuest = (req, res, next) => {
  if (req.user) {
    return res.redirect('/');
  }

  return next();
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.redirect('/auth/login');
    }

    if (!roles.includes(req.user.role.name)) {
      return res.status(403).render('errors/403', {
        title: 'Acceso denegado'
      });
    }

    return next();
  };
};

module.exports = {
  COOKIE_NAME,
  attachUser,
  requireAuth,
  requireGuest,
  requireRole
};