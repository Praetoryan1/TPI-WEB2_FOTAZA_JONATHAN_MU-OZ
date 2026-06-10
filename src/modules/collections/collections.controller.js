const {
  getUserCollections,
  createCollection,
  getCollectionDetail,
  addPublicationToCollection,
  removePublicationFromCollection
} = require('./collections.service');

const { validateCollection } = require('./collections.validator');

const index = async (req, res) => {
  const collections = await getUserCollections(req.user.id);

  return res.render('collections/index', {
    title: 'Mis colecciones',
    collections,
    errors: [],
    old: {}
  });
};

const store = async (req, res) => {
  try {
    const errors = validateCollection(req.body);

    if (errors.length > 0) {
      const collections = await getUserCollections(req.user.id);

      return res.status(422).render('collections/index', {
        title: 'Mis colecciones',
        collections,
        errors,
        old: req.body
      });
    }

    await createCollection({
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description
    });

    return res.redirect('/collections');
  } catch (error) {
    const collections = await getUserCollections(req.user.id);

    return res.status(422).render('collections/index', {
      title: 'Mis colecciones',
      collections,
      errors: [error.message],
      old: req.body
    });
  }
};

const detail = async (req, res) => {
  const collection = await getCollectionDetail({
    collectionId: req.params.id,
    userId: req.user.id
  });

  if (!collection) {
    return res.status(404).render('errors/404', {
      title: 'Colección no encontrada'
    });
  }

  return res.render('collections/detail', {
    title: collection.title,
    collection
  });
};

const addPublication = async (req, res) => {
  try {
    await addPublicationToCollection({
      collectionId: req.body.collection_id,
      publicationId: req.params.publicationId,
      userId: req.user.id
    });

    return res.redirect(`/publications/${req.params.publicationId}`);
  } catch (error) {
    return res.redirect(`/publications/${req.params.publicationId}`);
  }
};

const removePublication = async (req, res) => {
  try {
    await removePublicationFromCollection({
      collectionId: req.params.collectionId,
      publicationId: req.params.publicationId,
      userId: req.user.id
    });

    return res.redirect(`/collections/${req.params.collectionId}`);
  } catch (error) {
    return res.redirect('/collections');
  }
};

module.exports = {
  index,
  store,
  detail,
  addPublication,
  removePublication
};