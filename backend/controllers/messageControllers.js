


const Message = require("../models/Message");
const User = require("../models/User");
const Chat = require("../models/Chat");


const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({ error: "Invalid data passed into request" });
  }

  const chat = await Chat.findById(chatId);
  if (!chat) return res.status(400).json({ error: "Chat not found" });

  try {
    let message = await Message.create({
      sender: req.user._id,
      content,
      chat: chatId
    });

    message = await message.populate([
      { path: "sender", select: "name pic" },
      { path: "chat", populate: { path: "users", select: "name pic email" } }
    ]);

    chat.latestMessage = message;
    await chat.save();

    res.json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};



const allMessages = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate("sender", "name pic email").populate("chat");
        res.json(messages);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = { sendMessage, allMessages };