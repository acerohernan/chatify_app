const UserService = require('../services/user.service');
const HttpError = require('../utils/httpError');
const { verifyJwt } = require('../utils/jwt');

async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization.replace('Bearer ');

    if (!token)
      return new HttpError(
        res,
        401,
        'El usuario no se encuentra autorizado'
      ).send();

    const { decoded } = verifyJwt(token);

    if (!decoded)
      return new HttpError(
        res,
        401,
        'El usuario no se encuentra autorizado'
      ).send();

    res.locals.user = await UserService.queryUser({ _id: decoded._id });
    next();
  } catch (e) {
    console.error(e);
    return new HttpError(
      res,
      401,
      'El usuario no se encuentra autorizado'
    ).send();
  }
}

module.exports = {
  requireAuth,
};
