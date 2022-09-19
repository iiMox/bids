const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const authentificationEntreprise = require("../../middleware/authentificationEntreprise");

const Offre = require("../../db/modules/Offre");
const Entreprise = require("../../db/modules/Entreprise");

// @route   POST api/offres
// @desc    Ajouter un offre
// @access  Private
router.post(
    "/",
    authentificationEntreprise,
    [check("titre", "Le titre de l'offre est obligatoire").not().isEmpty()],
    async (req, res) => {
        {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const {
                titre,
                description,
                categorie,
                etat,
                experience,
                dateCreation,
                type,
            } = req.body;

            try {
                const newOffre = new Offre({
                    entreprise: req.entreprise.id,
                    titre,
                    description,
                    categorie,
                    etat,
                    experience,
                    dateCreation,
                    type,
                });

                // Save Offre in the DB

                const offre = await newOffre.save();

                res.send(offre);
            } catch (err) {
                console.log(err.message);
                res.status(500).send("Server error");
            }
        }
    }
);

// @route   PUT api/offres
// @desc    Update offre
// @access  Private
router.put("/:offre_id", authentificationEntreprise, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        titre,
        description,
        categorie,
        etat,
        experience,
        dateCreation,
        type,
    } = req.body;

    // Build Offre Ojbect

    const OffreFields = {};
    if (titre) OffreFields.titre = titre;
    if (description) OffreFields.description = description;
    if (categorie) OffreFields.categorie = categorie;
    if (etat) OffreFields.etat = etat;
    if (experience) OffreFields.experience = experience;
    if (dateCreation) OffreFields.dateCreation = dateCreation;
    if (type) OffreFields.type = type;

    try {
        let offre = await Offre.findById(req.params.offre_id);

        if (offre) {
            // Update

            offre = await Offre.findByIdAndUpdate(
                req.params.offre_id,
                {
                    $set: OffreFields,
                },
                {
                    new: true,
                }
            );

            return res.json(offre);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server erorr");
    }
});

router.put(
    "/etat/:offre_id",

    async (req, res) => {
        const { etat } = req.body;

        try {
            let offre = await Offre.findById(req.params.offre_id);

            if (offre) {
                // Update

                offre = await Offre.findByIdAndUpdate(
                    req.params.offre_id,
                    {
                        $set: {
                            etat: etat,
                        },
                    },
                    {
                        new: true,
                    }
                );

                return res.json(offre);
            }
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server error");
        }
    }
);

// @route   GET api/offres
// @desc    GET all offres
// @access  Public
router.get("/", async (req, res) => {
    try {
        const offres = await Offre.find().populate("offre", ["titre"]);
        res.json(offres);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @route   GET api/offres
// @desc    GET all offres created by this entreprise
// @access  Private
router.get("/me", authentificationEntreprise, async (req, res) => {
    try {
        const offres = await Offre.find({
            entreprise: mongoose.Types.ObjectId(req.entreprise.id),
        });
        res.json(offres);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/entreprise/:entreprise_id", async (req, res) => {
    try {
        const offres = await Offre.find({
            entreprise: mongoose.Types.ObjectId(req.params.entreprise_id),
        });
        res.json(offres);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @route   GET api/offres/:offre_id
// @desc    GET offre by id
// @access  Public
router.get("/:offre_id", async (req, res) => {
    try {
        const offre = await Offre.findById(req.params.offre_id).populate(
            "offre",
            ["titre"]
        );
        if (!offre) {
            return res.status(400).json({ msg: "Offre n'existe pas" });
        }
        res.json(offre);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(400).json({ msg: "Offre n'existe pas" });
        }
        res.status(500).send("Server error");
    }
});

// @route   DELETE api/offres
// @desc    supprimer offre &
// @access  Private
router.delete("/:offre_id", authentificationEntreprise, async (req, res) => {
    try {
        // Remove candidat
        await Offre.findByIdAndRemove(req.params.offre_id);

        res.json({ msg: "Offre supprimé" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.delete("/", async (req, res) => {
    try {
        const offre = await Offre.findById(req.query.id);

        await Demande.deleteMany({ offre: offre._id });

        await Offre.findByIdAndDelete(req.query.id);

        res.json({ msg: "Offre supprimé" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
