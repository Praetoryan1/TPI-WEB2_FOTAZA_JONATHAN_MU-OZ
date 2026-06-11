const validateImageReport = ({ reason_type, description }) => {
  const errors = [];

  const validReasons = [
    'inappropriate',
    'copyright',
    'offensive',
    'spam',
    'other'
  ];

  if (!validReasons.includes(reason_type)) {
    errors.push('El motivo de denuncia no es válido.');
  }

  const cleanDescription = description ? description.trim() : '';

  if (cleanDescription.length < 1) {
    errors.push('La descripción debe tener al menos 1 caracter.');
  }

  if (cleanDescription.length > 1000) {
    errors.push('La descripción no puede superar los 1000 caracteres.');
  }

  return errors;
};

module.exports = {
  validateImageReport
};