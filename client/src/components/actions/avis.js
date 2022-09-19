import axios from "axios";
import { setAlert } from "./alert";
import { GET_AVIS_CANDIDAT, GET_AVIS_ENTREPRISE, GET_AVIS } from "./types";

export const ajouterAvis =
    ({ entreprise, commentaire, evaluation, etat, datePosté }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const body = JSON.stringify({
                entreprise,
                commentaire,
                evaluation,
                etat,
                datePosté,
            });

            const res = await axios.post("/api/avis", body, config);
            dispatch(setAlert("Avis ajouté", "success", 2500));
            return res;
        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, "danger"))
                );
            }
        }
    };

export const modifierAvis =
    ({ id, commentaire, evaluation, etat }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const body = JSON.stringify({
                commentaire,
                evaluation,
                etat,
            });

            const res = await axios.put(`/api/avis/${id}`, body, config);
            dispatch(setAlert("Changements sauvegardés", "success", 2500));
            return res;
        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, "danger"))
                );
            }
        }
    };

export const supprimerAvis = (id) => async (dispatch) => {
    try {
        const res = await axios.delete(`/api/avis/${id}`);
        dispatch(setAlert("Avis supprimé", "success", 2500));
        return res;
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const getAvisCandidat = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`api/avis/avis_candidat/${id}`);
        dispatch({ type: GET_AVIS_CANDIDAT, payload: res.data });
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const getAvisEntreprise = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`api/avis/avis_entreprise/${id}`);
        dispatch({ type: GET_AVIS_ENTREPRISE, payload: res.data });
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const getAvis = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`api/avis/${id}`);
        dispatch({ type: GET_AVIS, payload: res.data });
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const getAvisById = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`api/avis/avis/${id}`);
        dispatch({ type: "AVIS_TO_UPDATE", payload: res.data });
        return res;
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};
