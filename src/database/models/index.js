const { sequelize } = require('../../config/database');

const Role = require('./Role')(sequelize);
const User = require('./User')(sequelize);
const Publication = require('./Publication')(sequelize);
const Image = require('./Image')(sequelize);
const Tag = require('./Tag')(sequelize);
const PublicationTag = require('./PublicationTag')(sequelize);

const models = {
  sequelize,
  Role,
  User,
  Publication,
  Image,
  Tag,
  PublicationTag
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;