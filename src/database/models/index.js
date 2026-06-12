const { sequelize } = require('../../config/database');

const Role = require('./Role')(sequelize);
const User = require('./User')(sequelize);
const Publication = require('./Publication')(sequelize);
const Image = require('./Image')(sequelize);
const Tag = require('./Tag')(sequelize);
const PublicationTag = require('./PublicationTag')(sequelize);
const Comment = require('./Comment')(sequelize);
const Rating = require('./Rating')(sequelize);
const Follower = require('./Follower')(sequelize);
const Notification = require('./Notification')(sequelize);
const Collection = require('./Collection')(sequelize);
const CollectionPublication = require('./CollectionPublication')(sequelize);
const ImageReport = require('./ImageReport')(sequelize);
const CommentReport = require('./CommentReport')(sequelize);
const InterestRequest = require('./InterestRequest')(sequelize);
const Conversation = require('./Conversation')(sequelize);
const Message = require('./Message')(sequelize);

const models = {
  sequelize,
  Role,
  User,
  Publication,
  Image,
  Tag,
  PublicationTag,
  Comment,
  Rating,
  Follower,
  Notification,
  Collection,
  CollectionPublication,
  ImageReport,
  CommentReport,
  InterestRequest,
  Conversation,
  Message
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;