const validateRating = ({ value }) => {
  const errors = [];

  const numericValue = Number(value);

  if (!Number.isInteger(numericValue)) {
    errors.push('La valoración debe ser un número entero.');
  }

  if (numericValue < 1 || numericValue > 5) {
    errors.push('La valoración debe estar entre 1 y 5.');
  }

  return errors;
};

module.exports = {
  validateRating
};