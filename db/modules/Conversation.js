const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
    { members: [{ userId: { type: String }, userType: { type: String } }] },
    { timestamps: true }
);

module.exports = Conversation = mongoose.model(
    "conversation",
    ConversationSchema
);
