const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../../database/models');
const env = require('../../config/env');

const createToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role?.name || 'user'
    },
    env.auth.jwtSecret,
    {
      expiresIn: '7d'
    }
  );
};

const registerUser = async ({ nickname, email, password }) => {
  const existingUser = await User.findOne({
    where: {
      email
    }
  });

  if (existingUser) {
    throw new Error('Ya existe un usuario registrado con ese email.');
  }

  const existingNickname = await User.findOne({
    where: {
      nickname
    }
  });

  if (existingNickname) {
    throw new Error('El nickname ya está en uso.');
  }

  const userRole = await Role.findOne({
    where: {
      name: 'user'
    }
  });

  if (!userRole) {
    throw new Error('No existe el rol de usuario. Ejecutá npm run db:init.');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    role_id: userRole.id,
    nickname,
    email,
    password_hash: passwordHash,
    biography: null,
    profile_image_url: null,
    is_active: true,
    banned_publications_count: 0
  });

  const userWithRole = await User.findByPk(user.id, {
    include: [
      {
        model: Role,
        as: 'role'
      }
    ]
  });

  return {
    user: userWithRole,
    token: createToken(userWithRole)
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({
    where: {
      email
    },
    include: [
      {
        model: Role,
        as: 'role'
      }
    ]
  });

  if (!user) {
    throw new Error('Credenciales inválidas.');
  }

  if (!user.is_active) {
    throw new Error('La cuenta se encuentra inactiva.');
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);

  if (!isValidPassword) {
    throw new Error('Credenciales inválidas.');
  }

  return {
    user,
    token: createToken(user)
  };
};

module.exports = {
  registerUser,
  loginUser
};