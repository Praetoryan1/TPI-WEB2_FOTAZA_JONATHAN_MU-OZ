const validateRegister = ({ nickname, email, password, confirmPassword }) => {
  const errors = [];

  if (!nickname || nickname.trim().length < 3) {
    errors.push('El nickname debe tener al menos 3 caracteres.');
  }

  if (!email || !email.includes('@')) {
    errors.push('El email no es válido.');
  }

  if (!password || password.length < 6) {
    errors.push('La contraseña debe tener al menos 6 caracteres.');
  }

  if (password !== confirmPassword) {
    errors.push('Las contraseñas no coinciden.');
  }

  return errors;
};

const validateLogin = ({ email, password }) => {
  const errors = [];

  if (!email || !email.includes('@')) {
    errors.push('El email no es válido.');
  }

  if (!password) {
    errors.push('La contraseña es obligatoria.');
  }

  return errors;
};

module.exports = {
  validateRegister,
  validateLogin
};