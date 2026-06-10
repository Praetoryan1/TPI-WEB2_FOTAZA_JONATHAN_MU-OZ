const { Op } = require('sequelize');
const {
  Publication,
  Image,
  Tag,
  User
} = require('../../database/models');

const cleanFilters = (query) => {
  return {
    q: query.q ? query.q.trim() : '',
    author: query.author ? query.author.trim() : '',
    tag: query.tag ? query.tag.trim().toLowerCase() : '',
    license: query.license || '',
    minRating: query.minRating ? Number(query.minRating) : null,
    dateFrom: query.dateFrom || '',
    dateTo: query.dateTo || ''
  };
};

const searchPublications = async ({ query, currentUser = null }) => {
  const filters = cleanFilters(query);

  if (!currentUser && filters.license === 'copyright') {
    return {
      publications: [],
      filters
    };
  }

  const publicationWhere = {
    status: 'active'
  };

  if (filters.q) {
    publicationWhere[Op.or] = [
      {
        title: {
          [Op.like]: `%${filters.q}%`
        }
      },
      {
        description: {
          [Op.like]: `%${filters.q}%`
        }
      }
    ];
  }

  if (filters.dateFrom || filters.dateTo) {
    publicationWhere.created_at = {};

    if (filters.dateFrom) {
      publicationWhere.created_at[Op.gte] = new Date(`${filters.dateFrom}T00:00:00`);
    }

    if (filters.dateTo) {
      publicationWhere.created_at[Op.lte] = new Date(`${filters.dateTo}T23:59:59`);
    }
  }

  const imageWhere = {};

  if (!currentUser) {
    imageWhere.license = 'no_copyright';
  }

  if (currentUser && filters.license) {
    imageWhere.license = filters.license;
  }

  if (filters.minRating) {
    imageWhere.average_rating = {
      [Op.gte]: filters.minRating
    };
  }

  const authorInclude = {
    model: User,
    as: 'author',
    attributes: ['id', 'nickname', 'profile_image_url']
  };

  if (filters.author) {
    authorInclude.where = {
      nickname: {
        [Op.like]: `%${filters.author}%`
      }
    };
    authorInclude.required = true;
  }

  const tagInclude = {
    model: Tag,
    as: 'tags',
    through: {
      attributes: []
    },
    required: false
  };

  if (filters.tag) {
    tagInclude.where = {
      name: {
        [Op.like]: `%${filters.tag}%`
      }
    };
    tagInclude.required = true;
  }

  const imageInclude = {
    model: Image,
    as: 'images',
    required:
      !currentUser ||
      Boolean(filters.license) ||
      Boolean(filters.minRating),
    where: Object.keys(imageWhere).length ? imageWhere : undefined
  };

  const publications = await Publication.findAll({
    where: publicationWhere,
    include: [
      authorInclude,
      imageInclude,
      tagInclude
    ],
    order: [
      ['created_at', 'DESC']
    ],
    distinct: true
  });

  return {
    publications,
    filters
  };
};

module.exports = {
  searchPublications
};