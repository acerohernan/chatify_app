const express = require('express');

const userRouter = require('./user.routes');
const chatRouter = require('./chat.routes');
const messageRouter = require('./message.routes');

const RootRouter = express.Router();

/* Routes */
RootRouter.use('/user', userRouter);
RootRouter.use('/chat', chatRouter);
RootRouter.use('/message', messageRouter);

module.exports = RootRouter;
