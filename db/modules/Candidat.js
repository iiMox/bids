const mongoose = require("mongoose");

const CandidatSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    nom: {
        type: String,
    },
    prenom: {
        type: String,
    },
    avatar: {
        type: String,
    },
    dateNaissance: {
        type: String,
    },
    adresse: {
        type: String,
    },
    wilaya: {
        type: String,
    },
    tel: {
        type: String,
    },
    bio: {
        tyype: String,
    },
    formation: [
        {
            titre: {
                type: String,
            },
            etablissement: {
                type: String,
            },
            dateDebut: {
                type: String,
            },
            dateFin: {
                type: String,
            },
            etat: {
                type: Boolean,
            },
        },
    ],
    experience: [
        {
            titre: {
                type: String,
            },
            etablissement: {
                type: String,
            },
            dateDebut: {
                type: String,
            },
            dateFin: {
                type: String,
            },
            description: {
                type: String,
            },
            etat: {
                type: Boolean,
            },
        },
    ],
    langue: [
        {
            langue: {
                type: String,
            },
            niveau: {
                type: "number",
            },
        },
    ],
    competance: [
        {
            competance: {
                type: String,
            },
            niveau: {
                type: "number",
            },
        },
    ],
    liens: {
        facebook: {
            type: String,
        },
        twitter: {
            type: String,
        },
        linkedin: {
            type: String,
        },
        website: {
            type: String,
        },
    },
    notifications: [
        {
            originId: { type: mongoose.Schema.ObjectId },
            originType: { type: String },
            notificationType: { type: String },
            isSeen: { type: Boolean },
            extra: { type: String },
            createdAt: { type: Date, default: Date.now() },
        },
    ],
});

module.exports = Candidat = mongoose.model("candidat", CandidatSchema);
