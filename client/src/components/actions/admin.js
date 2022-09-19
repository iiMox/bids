import axios from "axios";
import { setAlert } from "./alert";

export const getAll = () => async (dispatch) => {
    try {
        let res = await axios.get("api/candidats");
        dispatch({ type: "GET_ADMIN_CANDIDATS", payload: res.data });
        res = await axios.get("api/entreprises");
        dispatch({ type: "GET_ADMIN_ENTREPRISES", payload: res.data });
        res = await axios.get("api/offres");
        dispatch({ type: "GET_ADMIN_OFFRES", payload: res.data });
        res = await axios.get("api/demandes");
        dispatch({ type: "GET_ADMIN_DEMANDES", payload: res.data });
        res = await axios.get("api/avis");
        dispatch({ type: "GET_ADMIN_AVIS", payload: res.data });
        res = await axios.get("api/postes");
        dispatch({ type: "GET_ADMIN_POSTES", payload: res.data });
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const deleteCandidat = (id) => async (dispatch) => {
    try {
        const res = await axios.delete("/api/candidats", { params: { id } });
        dispatch(setAlert("Candidat supprimé", "success", 1500));
        return res;
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const deleteEntreprise = (id) => async (dispatch) => {
    try {
        const res = await axios.delete("/api/entreprises", { params: { id } });
        dispatch(setAlert("Entreprise supprimée", "success", 1500));
        return res;
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const deleteOffre = (id) => async (dispatch) => {
    try {
        const res = await axios.delete("/api/offres", { params: { id } });
        dispatch(setAlert("Offre supprimé", "success", 1500));
        return res;
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const updateEtatOffre =
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
            const res = await axios.put(`/api/offres/etat/${id}`, body, config);
            dispatch(setAlert("Changements sauvegardés", "success", 1500));
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

export const deleteAvis = (id) => async (dispatch) => {
    try {
        const res = await axios.delete("/api/avis", { params: { id } });
        dispatch(setAlert("Avis supprimé", "success", 1500));
        return res;
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const updateEtatAvis =
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
            const res = await axios.put(`/api/avis/etat/${id}`, body, config);
            dispatch(setAlert("Changements sauvegardés", "success", 1500));
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

export const deletePoste = (id) => async (dispatch) => {
    try {
        const res = await axios.delete("/api/postes", { params: { id } });
        dispatch(setAlert("Poste supprimé", "success", 1500));
        return res;
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};
