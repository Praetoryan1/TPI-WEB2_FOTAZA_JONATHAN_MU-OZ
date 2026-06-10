const validateCollection = ({ title }) => {
  const errors = [];

  const cleanTitle = title ? title.trim() : '';

  if (cleanTitle.length < 3) {
    errors.push('El nombre de la colección debe tener al menos 3 caracteres.');
  }

  if (cleanTitle.length > 100) {
    errors.push('El nombre de la colección no puede superar los 100 caracteres.');
  }

  return errors;
};

module.exports = {
  validateCollection
};