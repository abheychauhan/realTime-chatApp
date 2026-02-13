const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const { sendMessage , allMessages } = require('../controllers/messageControllers');


router.post('/', authMiddleware , sendMessage)
router.get('/:chatId',authMiddleware , allMessages) 









module.exports = router;