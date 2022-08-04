const ChatModel = require('../models/chat.model');
const UserModel = require('../models/user.model');
const HttpError = require('../utils/httpError');

async function accessChatHandler(req, res) {
  try {
    const user = res.locals.user;
    const { userId } = req.body;

    let isChat = await ChatModel.find({
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

    if (isChat[0]) {
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
      message: 'Chat creado correctamente',
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

async function getAllChatsByUserHandler(req, res) {
  try {
    const user = res.locals.user;

    ChatModel.find({
      users: { $elemMatch: { $eq: user._id } },
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await UserModel.populate(results, {
          path: 'latestMessage.sender',
          select: 'name pic email',
        });
        res.status(200).json({
          message: 'Listando los chats',
          success: true,
          data: {
            chats: results,
          },
        });
      });
  } catch (e) {
    console.error(e);
    return new HttpError(res, 500, 'Error de servidor');
  }
}

async function createGroupChat(req, res) {
  try {
    const creator = res.locals.user;
    let { users, name } = req.body;

    users = [...users, creator._id];

    const groupChat = await ChatModel.create({
      chatName: name,
      users,
      isGroupChat: true,
      groupAdmin: creator._id,
    });

    const fullGroup = await ChatModel.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json({
      message: 'Grupo creado exitosamente',
      succes: true,
      data: {
        group: fullGroup,
      },
    });
  } catch (e) {
    console.error(e);
    return new HttpError(res, 500, 'Error de servidor').send();
  }
}

async function addUserToChatGroup(req, res) {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;
    const requester = res.locals.user;

    //Check if the user is admin
    const chat = await ChatModel.findById(chatId).lean();

    if (!chat) return new HttpError(res, 404, 'El chat no ha sido encontrado');

    if (String(chat.groupAdmin) !== String(requester._id))
      return new HttpError(res, 401, 'No eres administrador de este grupo');

    // Check if the user to add exists
    const userToAdd = await UserModel.findById(userId);

    if (!userToAdd)
      return new HttpError(
        res,
        404,
        'No se encontró el usuario que se desea agregar.'
      );

    // Update the chat
    const group = await ChatModel.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json({
      message: 'El usuario ha sido agregado correctamente al grupo',
      success: true,
      data: {
        group,
      },
    });
  } catch (e) {
    console.error(e);
    return new HttpError(res, 500, 'Error de servidor');
  }
}

async function removeUserFromChatGroup(req, res) {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;
    const requester = res.locals.user;

    //Check if the chat exits
    const chat = await ChatModel.findById(chatId).lean();

    if (!chat) return new HttpError(res, 404, 'El chat no ha sido encontrado');

    console.log(String(chat.groupAdmin), String(requester._id));

    //Check if the user is admin
    if (String(chat.groupAdmin) !== String(requester._id))
      return new HttpError(res, 401, 'No eres administrador de este grupo');

    // Check if the user to remove exists
    const userToRemove = await UserModel.findById(userId);

    if (!userToRemove)
      return new HttpError(
        res,
        404,
        'No se encontró el usuario que se desea eliminar.'
      );

    // Update the chat
    const group = await ChatModel.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json({
      message: 'El usuario ha sido eliminado correctamente al grupo',
      success: true,
      data: { group },
    });
  } catch (e) {
    console.error(e);
    return new HttpError(res, 500, 'Error de servidor');
  }
}

const ChatController = {
  accessChatHandler,
  getAllChatsByUserHandler,
  createGroupChat,
  addUserToChatGroup,
  removeUserFromChatGroup,
};

module.exports = ChatController;
