const validateComment = ({ content }) => {
  const errors = [];

  const cleanContent = content ? content.trim() : '';

  if (cleanContent.length < 2) {
    errors.push('El comentario debe tener al menos 2 caracteres.');
  }

  if (cleanContent.length > 500) {
    errors.push('El comentario no puede superar los 500 caracteres.');
  }

  return errors;
};

module.exports = {
  validateComment
};