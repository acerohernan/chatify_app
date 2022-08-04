const express = require('express');

const MessageController = require('../controllers/message.controller');
const { requireAuth } = require('../middlewares/requireAuth');

const messageRouter = express.Router();

messageRouter.get(
  '/:chatId',
  requireAuth,
  MessageController.getAllMessagesFromChatHandler
);
messageRouter.post('/', requireAuth, MessageController.createMessageHandler);

module.exports = messageRouter;
