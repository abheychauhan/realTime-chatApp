const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require('cors');
dotenv.config();
connectDB();

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173"
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 200 
}));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const msgRoutes = require('./routes/msgRoutes');

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', msgRoutes);








const server = app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});



const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:5173",
    },
});

io.on("connection" , (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log("User joined room: " + userData._id);
        socket.emit("connected");
    });

        socket.on("join chat", (room) => {
            socket.join(room);
            console.log("User joined chat room: " + room);
        });

        socket.on("typing", (room) => socket.in(room).emit("typing"));
        socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

        socket.on("new message", (newMessageRecieved) => {
            var chat = newMessageRecieved.chat;

                if (!chat.users) return console.log("chat.users not defined");
                chat.users.forEach(user => {
                    if (user._id == newMessageRecieved.sender._id) return;
                    socket.in(user._id).emit("message recieved", newMessageRecieved);
                });

        });
});
