const express = require("express");
const router = express.Router();

const Message = require("../../db/modules/Message");

router.post("/", async (req, res) => {
    const newMessage = new Message(req.body);

    try {
        const message = await newMessage.save();
        res.status(200).json(message);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/:conversation_id", async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversation_id,
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
