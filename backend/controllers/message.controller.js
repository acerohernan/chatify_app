const { populate } = require('../models/chat.model');
const ChatModel = require('../models/chat.model');
const MessageModel = require('../models/message.model');
const UserModel = require('../models/user.model');
const HttpError = require('../utils/httpError');

async function getAllMessagesFromChatHandler(req, res) {
  try {
    const { chatId } = req.params;

    //Check is the chat exists
    const chat = await ChatModel.findById(chatId);

    if (!chat) return new HttpError(res, 404, 'No existe el chat enviado');

    const messages = await MessageModel.find({ chat: chatId })
      .populate('sender', 'name pic email')
      .populate('chat');

    res.status(200).json({
      message: 'Listando mensajes encontrados',
      success: true,
      data: { messages },
    });
  } catch (e) {
    console.error(e);
    return new HttpError(res, 500, 'Error de servidor');
  }
}

async function createMessageHandler(req, res) {
  try {
    const creator = res.locals.user;
    const { content, chatId } = req.body;

    const messageToSend = {
      sender: creator._id,
      content,
      chat: chatId,
    };

    let message = await MessageModel.create(messageToSend);

    message = await message.populate('sender', 'name pic');
    message = await message.populate('chat');
    message = await UserModel.populate(message, {
      path: 'chat.users',
      select: 'name pic email',
    });

    await ChatModel.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });

    res.status(200).json({
      success: true,
      message: 'Mensaje creado correctamente',
      data: { message },
    });
  } catch (e) {
    console.error(e);
    return new HttpError(res, 500, 'Error de servidor');
  }
}

const MessageController = {
  getAllMessagesFromChatHandler,
  createMessageHandler,
};

module.exports = MessageController;
