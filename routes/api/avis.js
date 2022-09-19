const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const authentificationCandidat = require("../../middleware/authentificationCandidat");

const Avis = require("../../db/modules/Avis");
const { response } = require("express");

//Ajouter un avis
router.post(
    "/",
    [
        authentificationCandidat,
        [
            check("commentaire", "Le commentaire est obligatoire")
                .not()
                .isEmpty(),
            check("evaluation", "Vous douvez donner une évaluation")
                .not()
                .isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { entreprise, commentaire, evaluation, datePosté, etat } =
            req.body;

        try {
            const newAvis = new Avis({
                candidat: req.candidat.id,
                entreprise,
                commentaire,
                evaluation,
                datePosté,
                etat,
            });
            const avis = await newAvis.save();
            res.send(avis);
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server error");
        }
    }
);

//Modifier un avis
router.put(
    "/:avis_id",
    [
        authentificationCandidat,
        [
            check("commentaire", "Le commentaire est obligatoire")
                .not()
                .isEmpty(),
            check("evaluation", "Vous douvez donner une évaluation")
                .not()
                .isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { commentaire, evaluation, etat } = req.body;

        const AvisFields = {};
        if (commentaire) AvisFields.commentaire = commentaire;
        if (evaluation) AvisFields.evaluation = evaluation;
        if (etat) AvisFields.etat = etat;

        try {
            let avis = await Avis.findById(req.params.avis_id);

            if (avis) {
                // Update

                avis = await Avis.findByIdAndUpdate(
                    req.params.avis_id,
                    {
                        $set: AvisFields,
                    },
                    {
                        new: true,
                    }
                );

                return res.json(avis);
            }
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server error");
        }
    }
);

//Supprimer Avis
router.delete("/:avis_id", authentificationCandidat, async (req, res) => {
    try {
        await Avis.findByIdAndRemove(req.params.avis_id);
        res.send("done");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.delete("/", async (req, res) => {
    try {
        await Avis.findByIdAndRemove(req.query.id);
        res.send("done");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//Get mes avis (candidat)
router.get("/avis_candidat/:candidat_id", async (req, res) => {
    try {
        const avis = await Avis.find({
            candidat: mongoose.Types.ObjectId(req.params.candidat_id),
        });
        res.json(avis);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//Get mes avis (entreprise)
router.get("/avis_entreprise/:entreprise_id", async (req, res) => {
    try {
        const avis = await Avis.find({
            entreprise: mongoose.Types.ObjectId(req.params.entreprise_id),
        });
        res.json(avis);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//Get Avis d'une entreprise
router.get("/:entreprise_id", async (req, res) => {
    try {
        const avis = await Avis.find({
            entreprise: mongoose.Types.ObjectId(req.params.entreprise_id),
        });
        res.json(avis);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//Get Avis d'une entreprise
router.get("/avis/:avis_id", async (req, res) => {
    try {
        const avis = await Avis.findById(req.params.avis_id);
        res.json(avis);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/", async (req, res) => {
    try {
        const avis = await Avis.find();
        res.json(avis);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.put(
    "/etat/:avis_id",

    async (req, res) => {
        const { etat } = req.body;

        try {
            let avis = await Avis.findById(req.params.avis_id);

            if (avis) {
                // Update

                avis = await Avis.findByIdAndUpdate(
                    req.params.avis_id,
                    {
                        $set: {
                            etat: etat,
                        },
                    },
                    {
                        new: true,
                    }
                );

                return res.json(avis);
            }
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server error");
        }
    }
);

module.exports = router;
