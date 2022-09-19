import axios from "axios";
import { setAlert } from "./alert";

// Update Entreprise
export const update =
    ({
        id,
        nom,
        email,
        tel,
        adresse,
        wilaya,
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
    }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            let body;
            if (oldPassword !== "" && newPassword !== "") {
                body = JSON.stringify({
                    id,
                    nom,
                    email,
                    tel,
                    adresse,
                    wilaya,
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
                });
            } else {
                body = JSON.stringify({
                    id,
                    nom,
                    email,
                    tel,
                    adresse,
                    wilaya,
                    bio,
                    description,
                    categorie,
                    facebook,
                    twitter,
                    linkedin,
                    website,
                    contactEmail,
                });
            }
            await axios.put("/api/entreprises", body, config);
            dispatch(setAlert("Changements sauvegardés ", "success", 2500));
        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, "danger"))
                );
            }
        }
    };
