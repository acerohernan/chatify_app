const express = require('express');
const UserController = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter.get('/', UserController.getAllUsersHandler);
userRouter.post('/signup', UserController.registerUserHandler);
userRouter.post('/login', UserController.loginUserHandler);

module.exports = userRouter;
