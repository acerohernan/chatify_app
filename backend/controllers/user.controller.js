const lodash = require('lodash');

const UserService = require('../services/user.service');

const { createHash, compareHash } = require('../utils/bcrypt');
const { signJwt } = require('../utils/jwt');
const HttpError = require('../utils/httpError');

async function registerUserHandler(req, res) {
  try {
    const { name, email, password, pic } = req.body;

    const userExists = await UserService.queryUser({ email });

    if (userExists)
      return new HttpError(
        res,
        500,
        'El usuario ya se encuentra registrado'
      ).send();

    const hashPassword = await createHash(password);

    await UserService.createUser({
      name,
      email,
      password: hashPassword,
      pic,
    });

    res.status(201).json({
      success: true,
      message: 'Usuario creado correctamente',
    });
  } catch (e) {
    console.log(e);
    return new HttpError(res, 500, 'Error de servidor').send();
  }
}

async function loginUserHandler(req, res) {
  try {
    const { email, password } = req.body;

    const user = await UserService.queryUser({ email });

    if (!user) return new HttpError(res, 404, 'El usuario no existe').send();

    const allowed = await compareHash(password, user.password);

    if (!allowed)
      return new HttpError(
        res,
        401,
        'El email o la contraseña es incorrecto'
      ).send();

    //Hide sensitive information
    const publicUser = lodash.omit(user, [
      'createdAt',
      'updatedAt',
      '__v',
      'password',
    ]);

    const token = await signJwt(publicUser);

    return res.status(200).json({
      message: 'Usuario logeado correctamente',
      success: true,
      data: {
        allowed,
        token,
        user: publicUser,
      },
    });
  } catch (e) {
    console.error(e);
    return new HttpError(res, 500, 'Error de servidor').send();
  }
}

async function getAllUsersHandler(req, res) {
  try {
    const user = res.locals.user;
    const { search } = req.query;

    let query = {};

    if (search) {
      query = {
        $or: [
          { name: { $regex: `.*${search}.*`, $options: 'i' } },
          { email: { $regex: `.*${search}.*`, $options: 'i' } },
        ],
      };
    }

    const users = await UserService.findUsers(query);

    res.status(200).json({
      message: 'Listando los usuarios encontrados',
      success: true,
      data: {
        users,
      },
    });
  } catch (e) {
    console.error(e);
    return new HttpError(res, 500, 'Error de servidor').send();
  }
}

const UserController = {
  registerUserHandler,
  loginUserHandler,
  getAllUsersHandler,
};

module.exports = UserController;
