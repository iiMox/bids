import axios from "axios";
import { setAlert } from "./alert";
import { GET_CANDIDATS } from "./types";

//Get All Candidat
export const getAllCandidats = () => async (dispatch) => {
    try {
        const res = await axios.get("api/candidats");
        dispatch({ type: GET_CANDIDATS, payload: res.data });
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const getCandidat = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`api/candidats/${id}`);
        /* dispatch({ type: GET_CANDIDAT, payload: res.data }); */
        return res;
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

// Update Candidat
export const update =
    ({
        id,
        nom,
        prenom,
        username,
        email,
        tel,
        adresse,
        wilaya,
        bio,
        dateNaissance,
        facebook,
        twitter,
        linkedin,
        website,
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
                    username,
                    email,
                    nom,
                    prenom,
                    tel,
                    bio,
                    adresse,
                    wilaya,
                    dateNaissance,
                    facebook,
                    twitter,
                    linkedin,
                    website,
                    oldPassword,
                    newPassword,
                });
            } else {
                body = JSON.stringify({
                    id,
                    username,
                    email,
                    nom,
                    prenom,
                    tel,
                    bio,
                    adresse,
                    wilaya,
                    dateNaissance,
                    facebook,
                    twitter,
                    linkedin,
                    website,
                });
            }
            await axios.put("/api/candidats", body, config);
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

export const addLangue =
    ({ langue, niveau }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const body = JSON.stringify({
                langue,
                niveau,
            });

            await axios.put("/api/candidats/langue", body, config);
            dispatch(setAlert("Langue ajoutée ", "success", 2500));
        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, "danger"))
                );
            }
        }
    };

export const deleteLangue = (id) => async (dispatch) => {
    try {
        await axios.delete(`/api/candidats/langue/${id}`);
        dispatch(setAlert("Langue supprimée ", "success", 2500));
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const addCompetance =
    ({ competance, niveau }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const body = JSON.stringify({
                competance,
                niveau,
            });

            await axios.put("/api/candidats/competance", body, config);
            dispatch(setAlert("Compétance ajoutée ", "success", 2500));
        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, "danger"))
                );
            }
        }
    };

export const deleteCompetance = (id) => async (dispatch) => {
    try {
        await axios.delete(`/api/candidats/competance/${id}`);
        dispatch(setAlert("Competance supprimée ", "success", 2500));
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const addFormation =
    ({ titre, etablissement, dateDebut, dateFin, etat }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const body = JSON.stringify({
                titre,
                etablissement,
                dateDebut,
                dateFin,
                etat,
            });

            await axios.put("/api/candidats/formation", body, config);
            dispatch(setAlert("Formation ajoutée ", "success", 2500));
        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, "danger"))
                );
            }
        }
    };

export const updateFormation =
    ({ id, titre, etablissement, dateDebut, dateFin, etat }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const body = JSON.stringify({
                id,
                titre,
                etablissement,
                dateDebut,
                dateFin,
                etat,
            });

            await axios.put(`/api/candidats/formation/${id}`, body, config);
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

export const deleteFormation = (id) => async (dispatch) => {
    try {
        await axios.delete(`/api/candidats/formation/${id}`);
        dispatch(setAlert("Formation supprimée ", "success", 2500));
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const addExperience =
    ({ titre, etablissement, description, dateDebut, dateFin, etat }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const body = JSON.stringify({
                titre,
                etablissement,
                description,
                dateDebut,
                dateFin,
                etat,
            });

            await axios.put("/api/candidats/experience", body, config);
            dispatch(setAlert("Experience ajoutée ", "success", 2500));
        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, "danger"))
                );
            }
        }
    };

export const updateExperience =
    ({ id, titre, etablissement, dateDebut, dateFin, description, etat }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const body = JSON.stringify({
                id,
                titre,
                etablissement,
                dateDebut,
                dateFin,
                description,
                etat,
            });

            await axios.put(`/api/candidats/experience/${id}`, body, config);
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

export const deleteExperience = (id) => async (dispatch) => {
    try {
        await axios.delete(`/api/candidats/experience/${id}`);
        dispatch(setAlert("Experience supprimée ", "success", 2500));
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};
