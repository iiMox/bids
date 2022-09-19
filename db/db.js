const mongoose = require("mongoose");
const db = process.env.DB_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });
        console.log("DB connected");
    } catch (err) {
        console.log(err.message);
        // Exit process
        process.exit(1);
    }
};
module.exports = connectDB;
