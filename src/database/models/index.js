const { sequelize } = require('../../config/database');

const Role = require('./Role')(sequelize);
const User = require('./User')(sequelize);

const models = {
  sequelize,
  Role,
  User
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;