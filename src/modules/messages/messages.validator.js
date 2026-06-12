const validateMessage = ({ content }) => {
  const errors = [];

  const cleanContent = content ? content.trim() : '';

  if (cleanContent.length < 1) {
    errors.push('El mensaje no puede estar vacío.');
  }

  if (cleanContent.length > 1000) {
    errors.push('El mensaje no puede superar los 1000 caracteres.');
  }

  return errors;
};

module.exports = {
  validateMessage
};