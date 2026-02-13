const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {

    const { name, email, password  , pic} = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please enter all the fields' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hassedPassword = bcrypt.hashSync(password, 10);

    const user = new User({
        name,
        email,
        password: hassedPassword,
        pic,
    });

    user.save()


     
    res.status(201).json({ message: 'User registered successfully' , token:jwt.sign({ id: user._id }, process.env.JWT_SECRET) , user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
    }});
};


const authUser = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all the fields' });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: 'User does not exist' });
    }

    const isPasswordMatch = bcrypt.compareSync(password, user.password);

    if (!isPasswordMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    


    res.status(200).json({ message: 'User logged in successfully' , token, user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
    }});
}


const allUsers = async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
        ],
    } : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.status(200).json(users);
};

 

module.exports = { registerUser, authUser, allUsers };
