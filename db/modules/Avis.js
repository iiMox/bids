const mongoose = require("mongoose");

const AvisSchema = new mongoose.Schema({
    candidat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "candidat",
    },
    entreprise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "entreprise",
    },
    commentaire: {
        type: String,
    },
    evaluation: {
        type: String,
    },
    etat: {
        type: String,
    },
    datePosté: {
        type: String,
    },
});

module.exports = Avis = mongoose.model("avis", AvisSchema);
