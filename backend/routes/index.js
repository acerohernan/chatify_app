const express = require('express');

const userRouter = require('./user.routes');

const RootRouter = express.Router();

/* Routes */
RootRouter.use('/user', userRouter);

module.exports = RootRouter;
