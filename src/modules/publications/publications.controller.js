const { validateCreatePublication } = require('./publications.validator');
const {
  createPublication,
  getPublications,
  getPublicationById
} = require('./publications.service');

const index = async (req, res) => {
  const publications = await getPublications(req.user || null);

  res.render('publications/index', {
    title: 'Publicaciones',
    publications
  });
};

const showCreate = (req, res) => {
  res.render('publications/create', {
    title: 'Crear publicación',
    errors: [],
    old: {}
  });
};

const store = async (req, res) => {
  try {
    const errors = validateCreatePublication(req.body, req.files);

    if (errors.length > 0) {
      return res.status(422).render('publications/create', {
        title: 'Crear publicación',
        errors,
        old: req.body
      });
    }

    const publication = await createPublication({
      userId: req.user.id,
      body: req.body,
      files: req.files
    });

    return res.redirect(`/publications/${publication.id}`);
  } catch (error) {
    return res.status(422).render('publications/create', {
      title: 'Crear publicación',
      errors: [error.message],
      old: req.body
    });
  }
};

const detail = async (req, res) => {
  const publication = await getPublicationById(req.params.id, req.user || null);

  if (!publication) {
    return res.status(404).render('errors/404', {
      title: 'Publicación no encontrada'
    });
  }

  if (!req.user && publication.images.length === 0) {
    return res.status(403).render('errors/403', {
      title: 'Contenido restringido'
    });
  }

  return res.render('publications/detail', {
    title: publication.title,
    publication
  });
};

module.exports = {
  index,
  showCreate,
  store,
  detail
};