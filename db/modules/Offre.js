const mongoose = require("mongoose");

const OffreSchema = new mongoose.Schema({
    entreprise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "entreprise",
    },
    titre: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    categorie: {
        type: String,
    },
    type: { type: String },
    experience: { type: String },
    etat: { type: String },
    dateCreation: {
        type: String,
    },
});

module.exports = Offre = mongoose.model("offre", OffreSchema);
