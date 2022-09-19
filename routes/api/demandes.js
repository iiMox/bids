const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const authentificationCandidat = require("../../middleware/authentificationCandidat");

const Demande = require("../../db/modules/Demande");
const authentificationEntreprise = require("../../middleware/authentificationEntreprise");

//Add Demande
router.post("/", authentificationCandidat, async (req, res) => {
    const { candidat, offre, lettreMotivation, dateEnvoi, etat } = req.body;

    try {
        const newDemande = new Demande({
            candidat,
            offre,
            lettreMotivation,
            dateEnvoi,
            etat,
        });

        // Save Demande in the DB

        const demande = await newDemande.save();

        res.send(demande);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

//Modifier Demande
router.put("/:demande_id", authentificationCandidat, async (req, res) => {
    const { lettreMotivation, etat } = req.body;

    try {
        let demande = await Demande.findById(req.params.demande_id);

        if (demande) {
            // Update

            demande = await Demande.findByIdAndUpdate(
                req.params.demande_id,
                {
                    $set: {
                        lettreMotivation: lettreMotivation,
                        etat: etat,
                    },
                },
                {
                    new: true,
                }
            );

            return res.json(demande);
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

router.put(
    "/etat/:demande_id",
    authentificationEntreprise,
    async (req, res) => {
        const { etat } = req.body;

        try {
            let demande = await Demande.findById(req.params.demande_id);

            if (demande) {
                // Update

                demande = await Demande.findByIdAndUpdate(
                    req.params.demande_id,
                    {
                        $set: {
                            etat: etat,
                        },
                    },
                    {
                        new: true,
                    }
                );

                return res.json(demande);
            }
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Server error");
        }
    }
);

//Delete Demande
router.delete("/:demande_id", authentificationCandidat, async (req, res) => {
    try {
        // Remove Demande
        await Demande.findByIdAndRemove(req.params.demande_id);

        res.json({ msg: "Demande supprimé" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

//Get Demande By Id
router.get("/:demande_id", async (req, res) => {
    try {
        const demande = await Demande.findById(req.params.demande_id);
        if (!demande) {
            return res.status(400).json({ msg: "Demande n'existe pas" });
        }
        res.json(demande);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(400).json({ msg: "Demande n'existe pas" });
        }
        res.status(500).send("Server error");
    }
});

//Get Candidat Demandes
router.get(
    "/candidat/:candidat_id",
    authentificationCandidat,
    async (req, res) => {
        try {
            const demandes = await Demande.find({
                candidat: mongoose.Types.ObjectId(req.params.candidat_id),
            });
            res.json(demandes);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

//Get Offre Demandes
router.get("/offre/:offre_id", authentificationEntreprise, async (req, res) => {
    try {
        const demandes = await Demande.find({
            offre: mongoose.Types.ObjectId(req.params.offre_id),
        });
        res.json(demandes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.get("/", async (req, res) => {
    try {
        const demandes = await Demande.find();
        res.json(demandes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
