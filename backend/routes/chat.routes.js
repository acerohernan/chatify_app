const express = require('express');

const ChatController = require('../controllers/chat.controller');
const { requireAuth } = require('../middlewares/requireAuth');

const chatRouter = express.Router();

chatRouter.get('/', requireAuth, ChatController.getAllChatsByUserHandler);
chatRouter.post('/', requireAuth, ChatController.accessChatHandler);

chatRouter.post('/group', requireAuth, ChatController.createGroupChat);
chatRouter.post(
  '/group/:chatId/remove',
  requireAuth,
  ChatController.removeUserFromChatGroup
);
chatRouter.post(
  '/group/:chatId/add',
  requireAuth,
  ChatController.addUserToChatGroup
);

module.exports = chatRouter;
