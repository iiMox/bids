import axios from "axios";
import { setAlert } from "./alert";
import {
    GET_DEMANDE,
    GET_CANDIDAT_DEMANDES,
    GET_OFFRE_DEMANDES,
} from "./types";

export const ajouterDemande =
    ({ candidat, offre, lettreMotivation, dateEnvoi, etat }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const body = JSON.stringify({
                candidat,
                offre,
                lettreMotivation,
                dateEnvoi,
                etat,
            });

            await axios.post("/api/demandes", body, config);
            dispatch(setAlert("Demande ajoutée ", "success", 2500));
        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, "danger"))
                );
            }
        }
    };

export const modifierDemande =
    ({ id, lettreMotivation, etat }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const body = JSON.stringify({
                lettreMotivation,
                etat,
            });

            await axios.put(`/api/demandes/${id}`, body, config);
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

export const supprimerDemande = (id) => async (dispatch) => {
    try {
        await axios.delete(`/api/demandes/${id}`);
        dispatch(setAlert("Demande supprimée", "success", 2500));
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const getDemande = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/demandes/${id}`);
        dispatch({ type: GET_DEMANDE, payload: res.data });
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const getCandidatDemandes = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/demandes/candidat/${id}`);
        dispatch({ type: GET_CANDIDAT_DEMANDES, payload: res.data });
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const getOffreDemandes = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/demandes/offre/${id}`);
        dispatch({ type: GET_OFFRE_DEMANDES, payload: res.data });
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const changeEtatDemande =
    ({ id, etat }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const body = JSON.stringify({
                etat,
            });

            await axios.put(`/api/demandes/etat/${id}`, body, config);
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
