const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const authentificationEntreprise = require("../../middleware/authentificationEntreprise");
const authentificationCandidat = require("../../middleware/authentificationCandidat");

const Entreprise = require("../../db/modules/Entreprise");
const Offre = require("../../db/modules/Offre");
const Demande = require("../../db/modules/Demande");
const Avis = require("../../db/modules/Avis");

// @route   POST api/entreprises
// @desc    Ajouter une entreprise
// @access  Public
router.post(
    "/",
    [
        check("nom", "Nom d'entreprise est obligatoire").not().isEmpty(),
        check("email", "SVP, entrer un email valide").isEmail(),
        check("password", "Password must be at least 5 chars").isLength({
            min: 5,
        }),
    ],
    async (req, res) => {
        {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { nom, email, password } = req.body;

            try {
                // See if Entreprise exists

                let entreprise = await Entreprise.findOne({ email });

                if (entreprise) {
                    return res.status(400).json({
                        errors: [{ msg: "Entreprise exist déja" }],
                    });
                }

                // Get the Entreprise gravatar

                const avatar = gravatar.url(email, {
                    s: "128",
                    r: "pg",
                    d: "mm",
                });

                entreprise = new Entreprise({
                    nom,
                    email,
                    avatar,
                    password,
                });

                // Encrypt password

                const salt = await bcrypt.genSalt(10);

                entreprise.password = await bcrypt.hash(password, salt);

                // Save Entreprise in the DB

                await entreprise.save();

                // Return jsonwebtoken

                const payload = {
                    entreprise: {
                        id: entreprise.id,
                    },
                };

                jwt.sign(
                    payload,
                    process.env.jwtSecret,
                    { expiresIn: 360000 },
                    (err, token) => {
                        if (err) {
                            throw err;
                        }
                        res.json({ token });
                    }
                );
            } catch (err) {
                console.log(err.message);
                res.status(500).send("Server error");
            }
        }
    }
);

// @route   GET api/entreprises/me
// @desc    Get current entreprise
// @access  Private
router.get("/me", authentificationEntreprise, async (req, res) => {
    try {
        const entreprise = await Entreprise.findById(req.entreprise.id);
        if (!entreprise) {
            return res
                .status(400)
                .json("Il n'exist pas une entreprise avec ce nom");
        }
        res.json(entreprise);
    } catch (err) {
        console.error(err.mesasage);
        res.status(500).send("Server error");
    }
});

// @route   PUT api/entreprises
// @desc    Update entreprise
// @access  Private
router.put("/", authentificationEntreprise, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        nom,
        email,
        adresse,
        wilaya,
        tel,
        bio,
        description,
        categorie,
        facebook,
        twitter,
        linkedin,
        website,
        contactEmail,
        oldPassword,
        newPassword,
    } = req.body;

    // Build Entreprise Ojbect

    const EntrepriseFields = {};
    if (email) EntrepriseFields.email = email;
    if (nom) EntrepriseFields.nom = nom;
    if (adresse) EntrepriseFields.adresse = adresse;
    if (wilaya) EntrepriseFields.wilaya = wilaya;
    if (tel) EntrepriseFields.tel = tel;
    if (categorie) EntrepriseFields.categorie = categorie;
    if (bio) EntrepriseFields.bio = bio;
    if (description) EntrepriseFields.description = description;

    if (newPassword) {
        const salt = await bcrypt.genSalt(10);

        EntrepriseFields.password = await bcrypt.hash(newPassword, salt);
    }

    // Build Liens Object
    EntrepriseFields.liens = {};
    if (facebook) EntrepriseFields.liens.facebook = facebook;
    if (twitter) EntrepriseFields.liens.twitter = twitter;
    if (linkedin) EntrepriseFields.liens.linkedin = linkedin;
    if (website) EntrepriseFields.liens.website = website;
    if (contactEmail) EntrepriseFields.liens.contactEmail = contactEmail;

    try {
        let entreprise = await Entreprise.findById(req.entreprise.id);

        if (oldPassword) {
            const isMatch = await bcrypt.compare(
                oldPassword,
                entreprise.password
            );

            if (!isMatch) {
                return res.status(400).json({
                    errors: [{ msg: "Informations incorrectes" }],
                });
            }
        }

        if (entreprise) {
            // Update

            entreprise = await Entreprise.findByIdAndUpdate(
                req.entreprise.id,
                {
                    $set: EntrepriseFields,
                },
                {
                    new: true,
                }
            );
            return res.json(entreprise);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server erorr");
    }
});

router.put("/me", authentificationEntreprise, async (req, res) => {
    try {
        let entreprise = await Entreprise.findById(req.entreprise.id);

        const avatar = gravatar.url(req.entreprise.email, {
            s: "128",
            r: "pg",
            d: "mm",
        });

        if (entreprise) {
            entreprise = await Entreprise.findByIdAndUpdate(
                req.entreprise.id,
                {
                    $set: {
                        avatar: req.body.imgURL ? req.body.imgURL : avatar,
                    },
                },
                {
                    new: true,
                }
            );

            return res.json(entreprise);
        }
    } catch (err) {
        console.error(err.mesasage);
        res.status(500).send("Server error");
    }
});

// @route   GET api/entreprises
// @desc    GET all entreprises
// @access  Public
router.get("/", async (req, res) => {
    try {
        const entreprise = await Entreprise.find();
        res.json(entreprise);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @route   GET api/entreprises/:entreprise_id
// @desc    GET entreprise by id
// @access  Public
router.get("/:entreprise_id", async (req, res) => {
    try {
        const entreprise = await Entreprise.findById(
            req.params.entreprise_id
        ).populate("entreprise", ["nom", "avatar"]);
        if (!entreprise) {
            return res.status(400).json({ msg: "Entreprise n'existe pas" });
        }
        res.json(entreprise);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(400).json({ msg: "Entreprise n'existe pas" });
        }
        res.status(500).send("Server error");
    }
});

// @route   DELETE api/entreprises
// @desc    supprimer entreprise & offres & avis
// @access  Private
router.delete("/", async (req, res) => {
    try {
        // Remove entreprises
        await Entreprise.findByIdAndRemove(req.query.id);

        // Remove offres
        const res1 = await Offre.find({ entreprise: req.query.id });
        res1.forEach(async (offre) => {
            await Demande.deleteMany({ offre: offre._id });
        });

        await Offre.deleteMany({ entreprise: req.query.id });

        // Remove Avis
        await Avis.deleteMany({ entreprise: req.query.id });

        res.json({ msg: "Entreprise supprimée" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.put(
    "/followers/:entreprise_id",
    authentificationCandidat,
    async (req, res) => {
        try {
            const entreprise = await Entreprise.findById(
                req.params.entreprise_id
            );

            entreprise.followers.unshift({ candidat: req.candidat.id });

            await entreprise.save();

            res.json(entreprise);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

router.delete(
    "/followers/:entreprise_id",
    authentificationCandidat,
    async (req, res) => {
        try {
            const entreprise = await Entreprise.findById(
                req.params.entreprise_id
            );

            // Get the remove index

            const removeIndex = entreprise.followers
                .map((item) => item.candidat)
                .indexOf(req.candidat.id);

            entreprise.followers.splice(removeIndex, 1);

            await entreprise.save();

            res.json(entreprise);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

router.get(
    "/followers/:entreprise_id",
    authentificationCandidat,
    async (req, res) => {
        const candidatId = req.candidat.id;
        try {
            const abonné = await Entreprise.find({
                _id: req.params.entreprise_id,
                followers: { $elemMatch: { candidat: candidatId } },
            });
            if (abonné.length !== 0) {
                res.json({ abonné: true });
            } else {
                res.json({ abonné: false });
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

router.get(
    "/stats/demandesRecues",
    authentificationEntreprise,
    async (req, res) => {
        try {
            const offres = await Offre.find({
                entreprise: req.entreprise.id,
            }).select("_id");
            let i = 0;
            offres.forEach(async (offre) => {
                const demandes = await Demande.find({
                    offre: offre._id,
                });
                i = i + demandes.length;
            });
            setTimeout(() => {
                res.json({ nbr: i });
            }, 500);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

router.get(
    "/stats/demandesAcceptees",
    authentificationEntreprise,
    async (req, res) => {
        try {
            const offres = await Offre.find({
                entreprise: req.entreprise.id,
            }).select("_id");
            let i = 0;
            offres.forEach(async (offre) => {
                const demandes = await Demande.find({
                    offre: offre._id,
                    etat: "Acceptée",
                });
                i = i + demandes.length;
            });
            setTimeout(() => {
                res.json({ nbr: i });
            }, 500);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

router.put("/notifications", authentificationCandidat, async (req, res) => {
    const { destinationId, notificationType, extra } = req.body;

    const newNotification = {
        originId: req.candidat.id,
        originType: "Candidat",
        notificationType,
        isSeen: false,
        extra,
    };

    try {
        const entreprise = await Entreprise.findById(destinationId);

        entreprise.notifications.unshift(newNotification);

        await entreprise.save();

        res.json(entreprise);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.put(
    "/notifications/:notif_id",
    authentificationEntreprise,
    async (req, res) => {
        try {
            let entreprise = await Entreprise.findOneAndUpdate(
                {
                    _id: req.entreprise.id,
                    notifications: {
                        $elemMatch: { _id: req.params.notif_id },
                    },
                },
                {
                    $set: {
                        "notifications.$.isSeen": true,
                    },
                }
            );

            entreprise = await Entreprise.findById(req.entreprise.id);

            res.json(entreprise);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

module.exports = router;
