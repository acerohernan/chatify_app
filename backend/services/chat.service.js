const ChatModel = require('../models/chat.model');

async function queryChat(query, options = {}) {
  try {
    return ChatModel.findOne(query, options).lean();
  } catch (e) {
    console.log(e);
    throw new Error('Error al buscar el chat en la base de datos.');
  }
}

async function findChats(query, options = {}) {
  try {
    const chats = ChatModel.find(query, options).lean();
    return chats;
  } catch (e) {
    console.log(e);
    throw new Error('Error al buscar los chats en la base de datos.');
  }
}

const ChatService = {
  queryChat,
  findChats,
};

module.exports = ChatService;
