const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup , deleteGroup } = require('../controllers/chatControllers');


router.post('/',authMiddleware , accessChat);
router.get('/', authMiddleware, fetchChats);
router.post('/group', authMiddleware, createGroupChat);
router.put('/rename', authMiddleware, renameGroup);
router.put('/add', authMiddleware, addToGroup);
router.put('/remove', authMiddleware, removeFromGroup);
router.delete('/delete', authMiddleware, deleteGroup); // Reuse removeFromGroup for leaving the group


module.exports = router;