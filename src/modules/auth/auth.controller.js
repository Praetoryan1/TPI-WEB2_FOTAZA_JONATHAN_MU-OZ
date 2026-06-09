const { COOKIE_NAME } = require('../../middlewares/auth.middleware');
const { registerUser, loginUser } = require('./auth.service');
const { validateRegister, validateLogin } = require('./auth.validator');

const showRegister = (req, res) => {
  res.render('auth/register', {
    title: 'Crear cuenta',
    errors: [],
    old: {}
  });
};

const register = async (req, res) => {
  try {
    const errors = validateRegister(req.body);

    if (errors.length > 0) {
      return res.status(422).render('auth/register', {
        title: 'Crear cuenta',
        errors,
        old: req.body
      });
    }

    const { token } = await registerUser(req.body);

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.redirect('/');
  } catch (error) {
    return res.status(422).render('auth/register', {
      title: 'Crear cuenta',
      errors: [error.message],
      old: req.body
    });
  }
};

const showLogin = (req, res) => {
  res.render('auth/login', {
    title: 'Iniciar sesión',
    errors: [],
    old: {}
  });
};

const login = async (req, res) => {
  try {
    const errors = validateLogin(req.body);

    if (errors.length > 0) {
      return res.status(422).render('auth/login', {
        title: 'Iniciar sesión',
        errors,
        old: req.body
      });
    }

    const { token } = await loginUser(req.body);

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.redirect('/');
  } catch (error) {
    return res.status(401).render('auth/login', {
      title: 'Iniciar sesión',
      errors: [error.message],
      old: req.body
    });
  }
};

const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME);
  return res.redirect('/auth/login');
};

module.exports = {
  showRegister,
  register,
  showLogin,
  login,
  logout
};