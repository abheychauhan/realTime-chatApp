const express = require("express");

const router = express.Router();

const { registerUser, authUser ,allUsers} = require('../controllers/userControllers');
const authMiddleware = require("../middleware/authMiddleware");


router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/all',authMiddleware, allUsers);


module.exports = router;