const express = require("express");
const router = express.Router();

const Conversation = require("../../db/modules/Conversation");

router.post("/", async (req, res) => {
    const { senderId, senderType, recieverId, recieverType } = req.body;
    const newConversation = new Conversation({
        members: [
            {
                userId: senderId,
                userType: senderType,
            },
            {
                userId: recieverId,
                userType: recieverType,
            },
        ],
    });

    try {
        const conversation = await newConversation.save();
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/candidat/:candidat_id", async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: {
                $elemMatch: {
                    userId: req.params.candidat_id,
                    userType: "Candidat",
                },
            },
        }).sort({ updatedAt: "desc" });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/candidat/:candidat_id/:entreprise_id", async (req, res) => {
    try {
        const conversation = await Conversation.find({
            $and: [
                {
                    members: {
                        $elemMatch: {
                            userId: req.params.candidat_id,
                            userType: "Candidat",
                        },
                    },
                },
                {
                    members: {
                        $elemMatch: {
                            userId: req.params.entreprise_id,
                            userType: "Entreprise",
                        },
                    },
                },
            ],
        });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/entreprise/:entreprise_id", async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: {
                $elemMatch: {
                    userId: req.params.entreprise_id,
                    userType: "Entreprise",
                },
            },
        })
            .sort({ updatedAt: -1 })
            .exec(function (err, conversation) {
                if (err) throw err;
                res.status(200).json(conversation);
            });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/entreprise/:entreprise_id/:candidat_id", async (req, res) => {
    try {
        const conversation = await Conversation.find({
            $and: [
                {
                    members: {
                        $elemMatch: {
                            userId: req.params.candidat_id,
                            userType: "Candidat",
                        },
                    },
                },
                {
                    members: {
                        $elemMatch: {
                            userId: req.params.entreprise_id,
                            userType: "Entreprise",
                        },
                    },
                },
            ],
        });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put("/:conversation_id", async (req, res) => {
    try {
        let conversation = await Conversation.findById(
            req.params.conversation_id
        );
        if (conversation) {
            conversation = await Conversation.findByIdAndUpdate(
                req.params.conversation_id,
                {
                    $set: {
                        updatedAt: new Date(),
                    },
                },
                {
                    new: true,
                }
            );
            res.status(200).json(conversation);
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
