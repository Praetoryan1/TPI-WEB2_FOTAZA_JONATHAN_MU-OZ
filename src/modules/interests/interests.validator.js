const validateInterestRequest = ({ message }) => {
  const errors = [];

  if (message && message.trim().length > 500) {
    errors.push('El mensaje no puede superar los 500 caracteres.');
  }

  return errors;
};

module.exports = {
  validateInterestRequest
};