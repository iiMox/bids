const mongoose = require("mongoose");

const PosteSchema = new mongoose.Schema({
    candidat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "candidat",
    },
    titre: {
        type: String,
    },
    contenu: {
        type: String,
    },
    datePosté: {
        type: String,
    },
    etat: {
        type: String,
    },
    commentaires: [
        {
            candidat: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "candidat",
            },
            commentaire: { type: String },
            dateCommentaire: { type: String },
        },
    ],
});

module.exports = Poste = mongoose.model("poste", PosteSchema);
