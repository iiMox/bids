const express = require("express");
const connectDB = require("./db/db");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = socketio(server, {
    cors: { origin: "https://bids.cyclic.app/" },
});

/* const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000",
    },
}); */

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use("/api/candidats", require("./routes/api/candidats"));
app.use("/api/entreprises", require("./routes/api/entreprises"));
app.use("/api/offres", require("./routes/api/offres"));
app.use("/api/avis", require("./routes/api/avis"));
app.use("/api/demandes", require("./routes/api/demandes"));
app.use("/api/postes", require("./routes/api/postes"));
app.use("/api/conversations", require("./routes/api/conversations"));
app.use("/api/messages", require("./routes/api/messages"));
app.use(
    "/api/authentificationCandidat",
    require("./routes/api/authentificationCandidat")
);
app.use(
    "/api/authentificationEntreprise",
    require("./routes/api/authentificationEntreprise")
);

// Serve static assets in production
/* if (process.env.NODE_ENV === "production") {
    //Set static folder
    app.use(express.static("client/build"));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
} */

let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
    //when connect

    //take userId and socketId from user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    //when disconnect
    socket.on("disconnect", () => {
        removeUser(socket.id);
        io.emit("getUsers", users);
    });

    //send message
    socket.on(
        "sendMessage",
        ({ senderId, senderType, recieverId, text, conversation }) => {
            const user = getUser(recieverId);
            if (user) {
                io.to(user.socketId).emit("getMessage", {
                    senderId,
                    senderType,
                    text,
                    conversation,
                });
            }
        }
    );
});

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "3041eb2c28f886", // replace with your Mailtrap credentials
        pass: "947c52307d0221",
    },
    debug: true, // show debug output
    logger: true, // log information in console
});

app.post("/send", (req, res, next) => {
    var name = req.body.name;
    var prenom = req.body.prenom;
    var email = req.body.email;
    var message = req.body.message;

    var mail = {
        from: email,
        to: "nassim.imo10@gmail.com",
        text: message,
    };

    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({
                status: "fail",
            });
        } else {
            res.json({
                status: "success",
            });
        }
    });
});

const PORT = process.env.PORT || 5000;

/*server*/ app.listen(PORT, () =>
    console.log(`Server started on port ${PORT}`)
);
