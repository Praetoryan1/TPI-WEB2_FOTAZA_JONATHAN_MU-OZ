const {
  Collection,
  CollectionPublication,
  Publication,
  Image,
  Tag,
  User
} = require('../../database/models');

const getUserCollections = async (userId) => {
  return Collection.findAll({
    where: {
      user_id: userId
    },
    include: [
      {
        model: Publication,
        as: 'publications',
        through: {
          attributes: []
        },
        required: false
      }
    ],
    order: [['created_at', 'DESC']]
  });
};

const createCollection = async ({ userId, title, description }) => {
  const cleanTitle = title.trim();

  const existingCollection = await Collection.findOne({
    where: {
      user_id: userId,
      title: cleanTitle
    }
  });

  if (existingCollection) {
    throw new Error('Ya tenés una colección con ese nombre.');
  }

  return Collection.create({
    user_id: userId,
    title: cleanTitle,
    description: description ? description.trim() : null
  });
};

const getCollectionDetail = async ({ collectionId, userId }) => {
  return Collection.findOne({
    where: {
      id: collectionId,
      user_id: userId
    },
    include: [
      {
        model: Publication,
        as: 'publications',
        through: {
          attributes: []
        },
        required: false,
        where: {
          status: 'active'
        },
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['id', 'nickname', 'profile_image_url']
          },
          {
            model: Image,
            as: 'images',
            required: false
          },
          {
            model: Tag,
            as: 'tags',
            through: {
              attributes: []
            }
          }
        ]
      }
    ],
    order: [[{ model: Publication, as: 'publications' }, 'created_at', 'DESC']]
  });
};

const addPublicationToCollection = async ({ collectionId, publicationId, userId }) => {
  const collection = await Collection.findOne({
    where: {
      id: collectionId,
      user_id: userId
    }
  });

  if (!collection) {
    throw new Error('La colección no existe o no te pertenece.');
  }

  const publication = await Publication.findOne({
    where: {
      id: publicationId,
      status: 'active'
    }
  });

  if (!publication) {
    throw new Error('La publicación no existe o no está disponible.');
  }

  const existingItem = await CollectionPublication.findOne({
    where: {
      collection_id: collectionId,
      publication_id: publicationId
    }
  });

  if (existingItem) {
    throw new Error('Esta publicación ya está guardada en la colección.');
  }

  await CollectionPublication.create({
    collection_id: collectionId,
    publication_id: publicationId
  });

  return collection;
};

const removePublicationFromCollection = async ({ collectionId, publicationId, userId }) => {
  const collection = await Collection.findOne({
    where: {
      id: collectionId,
      user_id: userId
    }
  });

  if (!collection) {
    throw new Error('La colección no existe o no te pertenece.');
  }

  await CollectionPublication.destroy({
    where: {
      collection_id: collectionId,
      publication_id: publicationId
    }
  });

  return collection;
};

module.exports = {
  getUserCollections,
  createCollection,
  getCollectionDetail,
  addPublicationToCollection,
  removePublicationFromCollection
};