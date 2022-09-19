const mongoose = require("mongoose");

const EntrepriseSchema = new mongoose.Schema({
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
        required: true,
    },
    avatar: {
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
    description: {
        type: String,
    },
    bio: {
        type: String,
    },
    categorie: {
        type: String,
    },
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
        contactEmail: {
            type: String,
        },
    },
    followers: [
        { candidat: { type: mongoose.Schema.Types.ObjectId, ref: "candidat" } },
    ],
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

module.exports = Entreprise = mongoose.model("entreprise", EntrepriseSchema);
