const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const authentificationCandidat = require("../../middleware/authentificationCandidat");

const Poste = require("../../db/modules/Poste");

router.post(
    "/",
    authentificationCandidat,
    [
        check("titre", "Le titre est obligatoire").not().isEmpty(),
        check("contenu", "Le contenu est obligatoire").not().isEmpty(),
    ],
    async (req, res) => {
        {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { candidat, titre, contenu, datePosté, etat } = req.body;

            try {
                const newPoste = new Poste({
                    candidat,
                    titre,
                    contenu,
                    datePosté,
                    etat,
                });

                // Save Poste in the DB

                const poste = await newPoste.save();

                res.send(poste);
            } catch (err) {
                console.log(err.message);
                res.status(500).send("Server error");
            }
        }
    }
);

router.put("/:poste_id", authentificationCandidat, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { titre, contenu } = req.body;

    // Build Offre Ojbect

    const PosteFields = {};
    if (titre) PosteFields.titre = titre;
    if (contenu) PosteFields.contenu = contenu;

    try {
        let poste = await Poste.findById(req.params.poste_id);

        if (poste) {
            // Update

            poste = await Poste.findByIdAndUpdate(
                req.params.poste_id,
                {
                    $set: PosteFields,
                },
                {
                    new: true,
                }
            );

            return res.json(poste);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server erorr");
    }
});

router.get("/", async (req, res) => {
    try {
        const postes = await Poste.find().populate("poste", ["titre"]);
        res.json(postes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/me", authentificationCandidat, async (req, res) => {
    try {
        const postes = await Poste.find({
            candidat: mongoose.Types.ObjectId(req.candidat.id),
        });
        res.json(postes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/:poste_id", async (req, res) => {
    try {
        const poste = await Poste.findById(req.params.poste_id);
        if (!poste) {
            return res.status(400).json({ msg: "Poste n'existe pas" });
        }
        res.json(poste);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(400).json({ msg: "Poste n'existe pas" });
        }
        res.status(500).send("Server error");
    }
});

router.delete("/:poste_id", authentificationCandidat, async (req, res) => {
    try {
        // Remove poste
        await Poste.findByIdAndRemove(req.params.poste_id);

        res.json({ msg: "Poste supprimé" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.delete("/", async (req, res) => {
    try {
        // Remove poste
        await Poste.findByIdAndRemove(req.query.id);

        res.json({ msg: "Poste supprimé" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.put(
    "/:poste_id/commentaires",
    [
        authentificationCandidat,
        [
            check("commentaire", "Commentaire ne peut pas etre vide")
                .not()
                .isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { candidat, commentaire, dateCommentaire } = req.body;

        const newCommentaire = {
            candidat,
            commentaire,
            dateCommentaire,
        };

        try {
            const poste = await Poste.findById(req.params.poste_id);

            poste.commentaires.unshift(newCommentaire);

            await poste.save();

            res.json(poste);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

router.put(
    "/:poste_id/commentaires/:commentaire_id",
    [
        authentificationCandidat,
        [
            check("commentaire", "Commentaire ne peut pas être vide")
                .not()
                .isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { commentaire } = req.body;

        try {
            let poste = await Poste.findOneAndUpdate(
                {
                    _id: req.params.poste_id,
                    commentaires: {
                        $elemMatch: { _id: req.params.commentaire_id },
                    },
                },
                {
                    $set: {
                        "commentaires.$.commentaire": commentaire,
                    },
                }
            );

            poste = await Poste.findById(req.params.poste_id);

            res.json(poste);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

router.delete(
    "/:poste_id/commentaires/:commentaire_id",
    authentificationCandidat,
    async (req, res) => {
        try {
            const poste = await Poste.findById(req.params.poste_id);

            // Get the remove index

            const removeIndex = poste.commentaires
                .map((item) => item.id)
                .indexOf(req.params.commentaire_id);

            poste.commentaires.splice(removeIndex, 1);

            await poste.save();

            res.json(poste);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

module.exports = router;
