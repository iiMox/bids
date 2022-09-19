const express = require("express");
const router = express.Router();
const authentificationCandidat = require("../../middleware/authentificationCandidat");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const Candidat = require("../../db/modules/Candidat");

// @route   GET api/authentificationCandidat
// @desc    Authentification route
// @access  Public
router.get("/", authentificationCandidat, async (req, res) => {
    try {
        const candidat = await Candidat.findById(req.candidat.id).select(
            "-password"
        );
        res.json(candidat);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

// @route   POST api/authentificationCandidat
// @desc    Authentifier candidat & get token
// @access  Public
router.post(
    "/",
    [
        check("email", "SVP, entrer un email valide").isEmail(),
        check("password", "Password est obligatoire").exists(),
    ],
    async (req, res) => {
        {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            try {
                // See if candidat exists

                let candidat = await Candidat.findOne({ email });

                if (!candidat) {
                    return res.status(400).json({
                        errors: [{ msg: "Informations incorrectes" }],
                    });
                }

                const isMatch = await bcrypt.compare(
                    password,
                    candidat.password
                );

                if (!isMatch) {
                    return res.status(400).json({
                        errors: [{ msg: "Informations incorrectes" }],
                    });
                }

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

module.exports = router;
