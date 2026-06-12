const { Op } = require('sequelize');
const {
  sequelize,
  Publication,
  Image,
  Tag,
  PublicationTag,
  User,
  Comment,
  Rating,
  ImageReport,
  CommentReport
} = require('../../database/models');

const normalizeTags = (tagsText) => {
  if (!tagsText) {
    return [];
  }

  return tagsText
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length >= 2)
    .filter((tag, index, array) => array.indexOf(tag) === index)
    .slice(0, 10);
};

const createPublication = async ({ userId, body, files }) => {
  return sequelize.transaction(async (transaction) => {
    const publication = await Publication.create(
      {
        user_id: userId,
        title: body.title.trim(),
        description: body.description ? body.description.trim() : null,
        status: 'active',
        is_edit_locked: false
      },
      { transaction }
    );

    const license = body.license;
    const watermarkText =
      license === 'copyright' && body.watermark_text
        ? body.watermark_text.trim()
        : null;

    const imageRows = files.map((file, index) => ({
      publication_id: publication.id,
      url: `/uploads/publications/${file.filename}`,
      storage_public_id: file.filename,
      alt_text: body.title.trim(),
      license,
      watermark_text: watermarkText,
      is_watermarked: Boolean(watermarkText),
      comments_enabled: true,
      order_number: index + 1,
      average_rating: 0,
      ratings_count: 0
    }));

    await Image.bulkCreate(imageRows, { transaction });

    const tagNames = normalizeTags(body.tags);

    for (const tagName of tagNames) {
      const [tag] = await Tag.findOrCreate({
        where: {
          name: tagName
        },
        defaults: {
          name: tagName
        },
        transaction
      });

      await PublicationTag.findOrCreate({
        where: {
          publication_id: publication.id,
          tag_id: tag.id
        },
        defaults: {
          publication_id: publication.id,
          tag_id: tag.id
        },
        transaction
      });
    }

    return publication;
  });
};

const getPublications = async (currentUser = null) => {
  const imageInclude = {
    model: Image,
    as: 'images',
    required: !currentUser,
    separate: false,
    order: [['order_number', 'ASC']]
  };

  if (!currentUser) {
    imageInclude.where = {
      license: 'no_copyright'
    };
  }

  return Publication.findAll({
    where: {
      status: 'active'
    },
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'nickname', 'profile_image_url']
      },
      imageInclude,
      {
        model: Tag,
        as: 'tags',
        through: {
          attributes: []
        }
      }
    ],
    order: [['created_at', 'DESC']]
  });
};

const getPublicationById = async (id, currentUser = null) => {
  const imageIncludes = [
    {
      model: Comment,
      as: 'comments',
      where: {
        is_deleted: false
      },
      required: false,
include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'nickname', 'profile_image_url']
      },
      ...(currentUser
        ? [
            {
                model: CommentReport,
                as: 'reports',
                where: {
                    user_id: currentUser.id,
                    status: 'pending'
                },
                required: false
            }
          ]
        : [])
    ]
  }
];

  if (currentUser) {
    imageIncludes.push({
      model: Rating,
      as: 'ratings',
      where: {
        user_id: currentUser.id
      },
      required: false
    });

    imageIncludes.push({
    model: ImageReport,
    as: 'reports',
    where: {
        user_id: currentUser.id,
        status: 'pending'
    },
    required: false
    });
  }
  

  const publication = await Publication.findOne({
    where: {
      id,
      status: {
        [Op.ne]: 'disabled'
      }
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
        include: imageIncludes
      },
      {
        model: Tag,
        as: 'tags',
        through: {
          attributes: []
        }
      }
    ],
    order: [
      [{ model: Image, as: 'images' }, 'order_number', 'ASC'],
      [
        { model: Image, as: 'images' },
        { model: Comment, as: 'comments' },
        'created_at',
        'ASC'
      ]
    ]
  });

  if (!publication) {
    return null;
  }

  if (!currentUser) {
    publication.images = publication.images.filter(
      (image) => image.license === 'no_copyright'
    );
  }

  return publication;
};

module.exports = {
  createPublication,
  getPublications,
  getPublicationById
};