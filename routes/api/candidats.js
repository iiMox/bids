const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const authentificationCandidat = require("../../middleware/authentificationCandidat");

const Candidat = require("../../db/modules/Candidat");
const Demande = require("../../db/modules/Demande");
const Avis = require("../../db/modules/Avis");
const Poste = require("../../db/modules/Poste");
const authentificationEntreprise = require("../../middleware/authentificationEntreprise");

// @route   POST api/candidats
// @desc    Ajouter un candidat
// @access  Public
router.post(
    "/",
    [
        check("username", "Nom d'utilisateur est obligatoire").not().isEmpty(),
        check("email", "SVP, entrer un email valide").isEmail(),
        check(
            "password",
            "le mot de passe doit comporter au moins 5 caractères"
        ).isLength({
            min: 5,
        }),
    ],
    async (req, res) => {
        {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { username, email, password } = req.body;

            try {
                // See if candidat exists

                let candidat = await Candidat.findOne({ email });

                if (candidat) {
                    return res.status(400).json({
                        errors: [{ msg: "Candidat exist déja" }],
                    });
                }

                // Get the Candidat gravatar

                const avatar = gravatar.url(email, {
                    s: "128",
                    r: "pg",
                    d: "mm",
                });

                candidat = new Candidat({
                    username,
                    email,
                    avatar,
                    password,
                });

                // Encrypt password

                const salt = await bcrypt.genSalt(10);

                candidat.password = await bcrypt.hash(password, salt);

                // Save Candidat in the DB

                await candidat.save();

                // Return jsonwebtoken

                const payload = {
                    candidat: {
                        id: candidat.id,
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

router.put("/me", authentificationCandidat, async (req, res) => {
    try {
        let candidat = await Candidat.findById(req.candidat.id);

        const avatar = gravatar.url(req.candidat.email, {
            s: "128",
            r: "pg",
            d: "mm",
        });

        if (candidat) {
            candidat = await Candidat.findByIdAndUpdate(
                req.candidat.id,
                {
                    $set: {
                        avatar: req.body.imgURL ? req.body.imgURL : avatar,
                    },
                },
                {
                    new: true,
                }
            );

            return res.json(candidat);
        }
    } catch (err) {
        console.error(err.mesasage);
        res.status(500).send("Server error");
    }
});

// @route   GET api/candidats/me
// @desc    Get current candidat
// @access  Private
router.get("/me", authentificationCandidat, async (req, res) => {
    try {
        const candidat = await Candidat.findById(req.candidat.id);
        if (!candidat) {
            return res
                .status(400)
                .json("Il n'exist pas un candidat avec ce nom");
        }
        res.json(candidat);
    } catch (err) {
        console.error(err.mesasage);
        res.status(500).send("Server error");
    }
});

// @route   PUT api/candidats
// @desc    Update candidat
// @access  Private
router.put("/", authentificationCandidat, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        username,
        email,
        nom,
        prenom,
        dateNaissance,
        adresse,
        wilaya,
        tel,
        bio,
        facebook,
        twitter,
        linkedin,
        website,
        oldPassword,
        newPassword,
    } = req.body;

    // Build Candidat Ojbect

    const CandidatFields = {};
    if (username) CandidatFields.username = username;
    if (email) CandidatFields.email = email;
    if (nom) CandidatFields.nom = nom;
    if (prenom) CandidatFields.prenom = prenom;
    if (dateNaissance) CandidatFields.dateNaissance = dateNaissance;
    if (adresse) CandidatFields.adresse = adresse;
    if (wilaya) CandidatFields.wilaya = wilaya;
    if (tel) CandidatFields.tel = tel;
    if (bio) CandidatFields.bio = bio;

    if (newPassword) {
        const salt = await bcrypt.genSalt(10);

        CandidatFields.password = await bcrypt.hash(newPassword, salt);
    }

    // Build Liens Object
    CandidatFields.liens = {};
    if (facebook) CandidatFields.liens.facebook = facebook;
    if (twitter) CandidatFields.liens.twitter = twitter;
    if (linkedin) CandidatFields.liens.linkedin = linkedin;
    if (website) CandidatFields.liens.website = website;

    try {
        let candidat = await Candidat.findById(req.candidat.id);

        if (oldPassword) {
            const isMatch = await bcrypt.compare(
                oldPassword,
                candidat.password
            );

            if (!isMatch) {
                return res.status(400).json({
                    errors: [{ msg: "Informations incorrectes" }],
                });
            }
        }

        if (candidat) {
            // Update

            candidat = await Candidat.findByIdAndUpdate(
                req.candidat.id,
                {
                    $set: CandidatFields,
                },
                {
                    new: true,
                }
            );

            return res.json(candidat);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server erorr");
    }
});

// @route   GET api/candidats
// @desc    GET all candidats
// @access  Public
router.get("/", async (req, res) => {
    try {
        const candidats = await Candidat.find().populate("candidat", [
            "nom",
            "avatar",
        ]);
        res.json(candidats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @route   GET api/candidats/:candidat_id
// @desc    GET candidat by id
// @access  Public
router.get("/:candidat_id", async (req, res) => {
    try {
        const candidat = await Candidat.findById(
            req.params.candidat_id
        ).populate("candidat", ["nom", "avatar"]);
        if (!candidat) {
            return res.status(400).json({ msg: "Candidat n'existe pas" });
        }
        res.json(candidat);
    } catch (err) {
        console.error(err.message);
        if (err.kind === "ObjectId") {
            return res.status(400).json({ msg: "Candidat n'existe pas" });
        }
        res.status(500).send("Server error");
    }
});

// @route   DELETE api/candidats
// @desc    supprimer candidat & demandes & avis
// @access  Private
router.delete("/", async (req, res) => {
    try {
        // Remove candidat
        await Candidat.findByIdAndRemove(req.query.id);

        // Remove demandes
        await Demande.deleteMany({ candidat: req.query.id });

        // Remove Postes
        await Poste.deleteMany({ candidat: req.query.id });

        // Remove Avis
        await Avis.deleteMany({ candidat: req.query.id });

        res.json({ msg: "Candidat supprimé" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

// @route   PUT api/candidats/formation
// @desc    Add candidat formation
// @access  Private
router.put(
    "/formation",
    [
        authentificationCandidat,
        [
            check("titre", "Titre est obligatoire").not().isEmpty(),
            check("etablissement", "Etablissement est obligatoire")
                .not()
                .isEmpty(),
            check("dateDebut", "Date debut est obligatoire").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { titre, etablissement, dateDebut, dateFin, etat } = req.body;

        const newFormation = {
            titre,
            etablissement,
            dateDebut,
            dateFin,
            etat,
        };

        try {
            const candidat = await Candidat.findById(req.candidat.id);

            candidat.formation.unshift(newFormation);

            await candidat.save();

            res.json(candidat);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

// @route   UPDATE api/candidats/formation/formation_id
// @desc    Update candidat formation
// @access  Private
router.put(
    "/formation/:formation_id",
    [
        authentificationCandidat,
        [
            check("titre", "Titre est obligatoire").not().isEmpty(),
            check("etablissement", "Etablissement est obligatoire")
                .not()
                .isEmpty(),
            check("dateDebut", "Date debut est obligatoire").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { titre, etablissement, dateDebut, dateFin, etat } = req.body;

        try {
            let candidat = await Candidat.findOneAndUpdate(
                {
                    _id: req.candidat.id,
                    formation: { $elemMatch: { _id: req.params.formation_id } },
                },
                {
                    $set: {
                        "formation.$.titre": titre,
                        "formation.$.etablissement": etablissement,
                        "formation.$.dateDebut": dateDebut,
                        "formation.$.dateFin": dateFin,
                        "formation.$.etat": etat,
                    },
                }
            );

            candidat = await Candidat.findById(req.candidat.id);

            res.json(candidat);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

// @route   DELETE api/candidats/formation/formation_id
// @desc    Remove candidat formation
// @access  Private
router.delete(
    "/formation/:formation_id",
    authentificationCandidat,
    async (req, res) => {
        try {
            const candidat = await Candidat.findById(req.candidat.id);

            // Get the remove index

            const removeIndex = candidat.formation
                .map((item) => item.id)
                .indexOf(req.params.formation_id);

            candidat.formation.splice(removeIndex, 1);

            await candidat.save();

            res.json(candidat);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

// @route   PUT api/candidats/experience
// @desc    Add candidat experience
// @access  Private
router.put(
    "/experience",
    [
        authentificationCandidat,
        [
            check("titre", "Titre est obligatoire").not().isEmpty(),
            check("etablissement", "Etablissement est obligatoire")
                .not()
                .isEmpty(),
            check("dateDebut", "Date debut est obligatoire").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { titre, etablissement, dateDebut, dateFin, etat, description } =
            req.body;

        const newExperience = {
            titre,
            etablissement,
            dateDebut,
            dateFin,
            etat,
            description,
        };

        try {
            const candidat = await Candidat.findById(req.candidat.id);

            candidat.experience.unshift(newExperience);

            await candidat.save();

            res.json(candidat);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

// @route   UPDATE api/candidats/experience/experience_id
// @desc    Update candidat experience
// @access  Private
router.put(
    "/experience/:experience_id",
    [
        authentificationCandidat,
        [
            check("titre", "Titre est obligatoire").not().isEmpty(),
            check("etablissement", "Etablissement est obligatoire")
                .not()
                .isEmpty(),
            check("dateDebut", "Date debut est obligatoire").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { titre, etablissement, dateDebut, dateFin, etat, description } =
            req.body;

        try {
            let candidat = await Candidat.findOneAndUpdate(
                {
                    _id: req.candidat.id,
                    experience: {
                        $elemMatch: { _id: req.params.experience_id },
                    },
                },
                {
                    $set: {
                        "experience.$.titre": titre,
                        "experience.$.etablissement": etablissement,
                        "experience.$.dateDebut": dateDebut,
                        "experience.$.dateFin": dateFin,
                        "experience.$.etat": etat,
                        "experience.$.description": description,
                    },
                }
            );

            candidat = await Candidat.findById(req.candidat.id);

            res.json(candidat);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

// @route   DELETE api/candidats/experience/experience_id
// @desc    Remove candidat experience
// @access  Private
router.delete(
    "/experience/:experience_id",
    authentificationCandidat,
    async (req, res) => {
        try {
            const candidat = await Candidat.findById(req.candidat.id);

            // Get the remove index

            const removeIndex = candidat.experience
                .map((item) => item.id)
                .indexOf(req.params.experience_id);

            candidat.experience.splice(removeIndex, 1);

            await candidat.save();

            res.json(candidat);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

// @route   PUT api/candidats/langue
// @desc    Add candidat langue
// @access  Private
router.put(
    "/langue",
    [
        authentificationCandidat,
        [
            check("langue", "Langue est obligatoire").not().isEmpty(),
            check("niveau", "Niveau est obligatoire").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { langue, niveau } = req.body;

        const newLangue = {
            langue,
            niveau,
        };

        try {
            const candidat = await Candidat.findById(req.candidat.id);

            candidat.langue.unshift(newLangue);

            await candidat.save();

            res.json(candidat);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

// @route   UPDATE api/candidats/langue/langue_id
// @desc    Update candidat langue
// @access  Private
router.put(
    "/langue/:langue_id",
    [
        authentificationCandidat,
        [
            check("langue", "Langue est obligatoire").not().isEmpty(),
            check("niveau", "Niveau est obligatoire").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { langue, niveau } = req.body;

        try {
            let candidat = await Candidat.findOneAndUpdate(
                {
                    _id: req.candidat.id,
                    langue: {
                        $elemMatch: { _id: req.params.langue_id },
                    },
                },
                {
                    $set: {
                        "langue.$.langue": langue,
                        "langue.$.niveau": niveau,
                    },
                }
            );

            candidat = await Candidat.findById(req.candidat.id);

            res.json(candidat);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

// @route   DELETE api/candidats/langue/langue
// @desc    Remove candidat langue
// @access  Private
router.delete(
    "/langue/:langue_id",
    authentificationCandidat,
    async (req, res) => {
        try {
            const candidat = await Candidat.findById(req.candidat.id);

            // Get the remove index

            const removeIndex = candidat.langue
                .map((item) => item.id)
                .indexOf(req.params.langue_id);

            candidat.langue.splice(removeIndex, 1);

            await candidat.save();

            res.json(candidat);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

// @route   PUT api/candidats/competance
// @desc    Add candidat competance
// @access  Private
router.put(
    "/competance",
    [
        authentificationCandidat,
        [
            check("competance", "Competance est obligatoire").not().isEmpty(),
            check("niveau", "Niveau est obligatoire").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { competance, niveau } = req.body;

        const newCompetance = {
            competance,
            niveau,
        };

        try {
            const candidat = await Candidat.findById(req.candidat.id);

            candidat.competance.unshift(newCompetance);

            await candidat.save();

            res.json(candidat);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

// @route   UPDATE api/candidats/competance/competance_id
// @desc    Update candidat competance
// @access  Private
router.put(
    "/competance/:competance_id",
    [
        authentificationCandidat,
        [
            check("competance", "Competance est obligatoire").not().isEmpty(),
            check("niveau", "Niveau est obligatoire").not().isEmpty(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { competance, niveau } = req.body;

        try {
            let candidat = await Candidat.findOneAndUpdate(
                {
                    _id: req.candidat.id,
                    competance: {
                        $elemMatch: { _id: req.params.competance_id },
                    },
                },
                {
                    $set: {
                        "competance.$.competance": competance,
                        "competance.$.niveau": niveau,
                    },
                }
            );

            candidat = await Candidat.findById(req.candidat.id);

            res.json(candidat);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

// @route   DELETE api/candidats/competance/competance_id
// @desc    Remove candidat competance
// @access  Private
router.delete(
    "/competance/:competance_id",
    authentificationCandidat,
    async (req, res) => {
        try {
            const candidat = await Candidat.findById(req.candidat.id);

            // Get the remove index

            const removeIndex = candidat.competance
                .map((item) => item.id)
                .indexOf(req.params.competance_id);

            candidat.competance.splice(removeIndex, 1);

            await candidat.save();

            res.json(candidat);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

router.put("/notifications", async (req, res) => {
    const { destinationId, notificationType, originId, originType, extra } =
        req.body;

    const newNotification = {
        originId: originId,
        originType: originType,
        notificationType,
        isSeen: false,
        extra,
    };

    try {
        const candidat = await Candidat.findById(destinationId);

        candidat.notifications.unshift(newNotification);

        await candidat.save();

        res.json(candidat);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

router.put(
    "/notifications/:notif_id",
    authentificationCandidat,
    async (req, res) => {
        try {
            let candidat = await Candidat.findOneAndUpdate(
                {
                    _id: req.candidat.id,
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

            candidat = await Candidat.findById(req.candidat.id);

            res.json(candidat);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

module.exports = router;
