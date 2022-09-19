const mongoose = require("mongoose");

const DemandeSchema = new mongoose.Schema({
    candidat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "candidat",
    },
    offre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "offre",
    },
    lettreMotivation: {
        type: String,
        required: true,
    },
    dateEnvoi: { type: String },
    etat: { type: String },
});

module.exports = Demande = mongoose.model("demande", DemandeSchema);
