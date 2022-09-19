const express = require("express");
const router = express.Router();
const authentificationEntreprise = require("../../middleware/authentificationEntreprise");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

const Entreprise = require("../../db/modules/Entreprise");

// @route   GET api/authentificationEntreprise
// @desc    Authentification route
// @access  Public
router.get("/", authentificationEntreprise, async (req, res) => {
    try {
        const entreprise = await Entreprise.findById(req.entreprise.id).select(
            "-password"
        );
        res.json(entreprise);
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server error");
    }
});

// @route   POST api/authentificationEntreprise
// @desc    Authentifier entreprise & get token
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

                let entreprise = await Entreprise.findOne({ email });

                if (!entreprise) {
                    return res.status(400).json({
                        errors: [{ msg: "Informations incorrectes" }],
                    });
                }

                const isMatch = await bcrypt.compare(
                    password,
                    entreprise.password
                );

                if (!isMatch) {
                    return res.status(400).json({
                        errors: [{ msg: "Informations incorrectes" }],
                    });
                }

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

module.exports = router;
