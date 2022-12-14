const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
    {
        conversationId: { type: String },
        sender: {
            userId: { type: String },
            userType: { type: String },
        },
        text: { type: String },
    },
    { timestamps: true }
);

module.exports = Message = mongoose.model("message", MessageSchema);
