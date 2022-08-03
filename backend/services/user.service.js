const UserModel = require('../models/user.model');

async function queryUser(query, options = {}) {
  try {
    const user = UserModel.findOne(query, options).lean();
    return user;
  } catch (e) {
    console.log(e);
    throw new Error('Error al buscar al usuario en la base de datos.');
  }
}

async function findUsers(query, options = {}) {
  try {
    const users = UserModel.find(query, options).limit(5).lean();
    return users;
  } catch (e) {
    console.log(e);
    throw new Error('Error al buscar los usuarios en la base de datos.');
  }
}

async function searchUsersByUser(query, userId, options = {}) {
  try {
    const users = UserModel.find(query, options)
      .find({ _id: userId })
      .limit(5)
      .lean();
    return users;
  } catch (e) {
    console.log(e);
    throw new Error('Error al buscar los usuarios en la base de datos.');
  }
}

async function createUser(userBody) {
  try {
    const user = UserModel.create({
      email: userBody.email,
      password: userBody.password,
      name: userBody.name,
      pic:
        userBody.pic ??
        'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
    });

    return user;
  } catch (e) {
    console.log(e);
    throw new Error('Error al crear al nuevo usuario en la base de datos.');
  }
}

const UserService = {
  queryUser,
  findUsers,
  searchUsersByUser,
  createUser,
};

module.exports = UserService;
