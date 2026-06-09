const validateCreatePublication = (body, files) => {
  const errors = [];

  const title = body.title ? body.title.trim() : '';
  const license = body.license;

  if (title.length < 3) {
    errors.push('El título debe tener al menos 3 caracteres.');
  }

  if (!files || files.length === 0) {
    errors.push('La publicación debe tener al menos una imagen.');
  }

  if (files && files.length > 5) {
    errors.push('Solo se permiten hasta 5 imágenes por publicación.');
  }

  if (!['copyright', 'no_copyright'].includes(license)) {
    errors.push('La licencia seleccionada no es válida.');
  }

  return errors;
};

module.exports = {
  validateCreatePublication
};