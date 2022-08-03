const ChatModel = require('../models/chat.model');
const UserModel = require('../models/user.model');
const ChatService = require('../services/chat.service');
const HttpError = require('../utils/httpError');

async function accessChatHandler(req, res) {
  try {
    const user = res.locals.user;
    const { userId } = req.body;

    const isChat = await ChatModel.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate('users', '-password')
      .populate('latestMessage');

    isChat = await UserModel.populate(isChat, {
      path: 'latestMessage.sender',
      select: 'name pic email',
    });

    if (isChat.lenght > 0) {
      return res.status(200).json({
        message: 'Acceso correcto al chat',
        success: true,
        data: {
          chat: isChat[0],
        },
      });
    }

    let chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [user._id, userId],
    };

    const createdChat = await ChatModel.create(chatData);
    const FullChat = await ChatModel.findOne({ _id: createdChat._id }).populate(
      'users',
      '-password'
    );

    res.status(200).json({
      message: 'Acceso correcto al chat',
      success: true,
      data: {
        chat: FullChat,
      },
    });
  } catch (e) {
    console.error(e);
    return new HttpError(res, 500, 'Error de servidor').send();
  }
}

async function getAllChatsHandler(req, res) {
  try {
    const user = res.locals.user;

    const chats = ChatModel.find({
      users: { $elemMatch: { $eq: user._id } },
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: 'latestMessage.sender',
          select: 'name pic email',
        });
        res.status(200).json({
          message: 'Listando los chats',
          success: true,
          data: {
            chats,
          },
        });
      });
  } catch (e) {
    console.error(e);
    return new HttpError(res, 500, 'Error de servidor');
  }
}

const ChatController = {
  accessChatHandler,
  getAllChatsHandler,
};

module.exports = ChatController;
