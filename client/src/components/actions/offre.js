import axios from "axios";
import { setAlert } from "./alert";
import {
    ADD_OFFRE,
    GET_OFFRES,
    GET_OFFRE,
    DELETE_OFFRE,
    GET_ENTREPRISE_OFFRES,
} from "../actions/types";

export const ajouterOffre =
    ({ titre, description, dateCreation, etat, experience, categorie, type }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const body = JSON.stringify({
                titre,
                description,
                dateCreation,
                etat,
                experience,
                categorie,
                type,
            });

            const res = await axios.post("/api/offres", body, config);
            dispatch({ type: ADD_OFFRE, payload: res.data });
            dispatch(setAlert("Offre ajouté ", "success", 2500));
        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, "danger"))
                );
            }
        }
    };

export const modifierOffre =
    ({
        id,
        titre,
        description,
        dateCreation,
        etat,
        experience,
        categorie,
        type,
    }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const body = JSON.stringify({
                titre,
                description,
                dateCreation,
                etat,
                experience,
                type,
                categorie,
            });

            await axios.put(`/api/offres/${id}`, body, config);
            dispatch(setAlert("Changements sauvegardés", "success", 2500));
        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, "danger"))
                );
            }
        }
    };

export const supprimerOffre = (id) => async (dispatch) => {
    try {
        const res = await axios.delete(`/api/offres/${id}`);
        dispatch({ type: DELETE_OFFRE, payload: res.data });
        dispatch(setAlert("Offre supprimé", "success", 2500));
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const getOffre = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/offres/${id}`);
        dispatch({ type: GET_OFFRE, payload: res.data });
        return res;
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const getAllOffres = () => async (dispatch) => {
    try {
        const res = await axios.get(`/api/offres/`);
        dispatch({ type: GET_OFFRES, payload: res.data });
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const getMyOffres = () => async (dispatch) => {
    try {
        const res = await axios.get(`/api/offres/me`);
        dispatch({ type: GET_ENTREPRISE_OFFRES, payload: res.data });
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const getOffresByEntreprise = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/offres/entreprise/${id}`);
        return res.data;
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};
