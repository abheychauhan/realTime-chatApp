const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

const accessChat = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'UserId is required' });
    }

    let chat = await Chat.findOne({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    }).populate('users', '-password').populate('latestMessage');

    if (chat) {
        chat = await User.populate(chat, {
            path: 'latestMessage.sender',
            select: 'name email pic',
        });
    }

    if (chat) {
        res.json(chat[0]);
    }
    else {
        const chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users: [req.user._id, userId],
        };
        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate('users', '-password');
            res.status(200).json(FullChat);
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};


const fetchChats = async (req, res) => {
    try {
        let chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage');
            
            chats.sort((a, b) => b.updatedAt - a.updatedAt);
            chats = await User.populate(chats, {
                path: 'latestMessage.sender',
                select: 'name email pic',
            });

        res.json(chats);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const createGroupChat = async (req, res) => {

    const { name, users } = req.body;

    if (!name || !users) {
        return res.status(400).json({ message: 'Please provide name and users' });
    }

    const usersArray = JSON.parse(users);

    if (usersArray.length < 2) {
        return res.status(400).json({ message: 'At least 2 users are required to create a group chat' });
    }

    usersArray.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: name,
            users: usersArray,
            isGroupChat: true,
            groupAdmin: req.user._id,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate('users', '-password')
            .populate('groupAdmin', '-password');

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const renameGroup = async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { chatName },
        { new: true }
    ).populate('users', '-password').populate('groupAdmin', '-password');

    if (!updatedChat) {
        return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(updatedChat);
};


const addToGroup = async (req, res) => {
    const { chatId, userId } = req.body;
    const added = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { users: userId } },
        { new: true }
    ).populate('users', '-password').populate('groupAdmin', '-password');

    if (!added) {
        return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(added);
};


const removeFromGroup = async (req, res) => {
    const { chatId, userId } = req.body;
    const removed = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: userId } },
        { new: true }
    ).populate('users', '-password').populate('groupAdmin', '-password');

    if (!removed) {
        return res.status(404).json({ message: 'Chat not found' });
    }

    res.json(removed);
};

const deleteGroup = async (req, res) => {
    const { chatId } = req.body;
    const deleted = await Chat.findByIdAndDelete(chatId);

    if (!deleted) {
        return res.status(404).json({ message: 'Chat not found' });
    }

    const updatedChats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')
        .populate('latestMessage');

    res.json({ message: 'Chat deleted successfully', updatedChats });
};


module.exports = { accessChat , fetchChats, createGroupChat, renameGroup , addToGroup , removeFromGroup , deleteGroup };