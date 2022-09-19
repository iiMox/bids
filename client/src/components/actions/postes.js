import axios from "axios";
import { setAlert } from "./alert";
import { GET_POSTE, GET_POSTES, GET_MES_POSTES } from "../actions/types";

export const ajouterPoste =
    ({ candidat, titre, contenu, datePosté, etat }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const body = JSON.stringify({
                candidat,
                titre,
                contenu,
                datePosté,
                etat,
            });

            const res = await axios.post("/api/postes", body, config);
            dispatch(setAlert("Poste ajouté ", "success", 2500));
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

export const modifierPoste =
    ({ id, titre, contenu }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const body = JSON.stringify({
                titre,
                contenu,
            });

            await axios.put(`/api/postes/${id}`, body, config);
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

export const supprimerPoste = (id) => async (dispatch) => {
    try {
        await axios.delete(`/api/postes/${id}`);
        dispatch(setAlert("Poste supprimé", "success", 2500));
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const getPoste = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`/api/postes/${id}`);
        dispatch({ type: GET_POSTE, payload: res.data });
        return res;
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const getAllPostes = () => async (dispatch) => {
    try {
        const res = await axios.get(`/api/postes/`);
        dispatch({ type: GET_POSTES, payload: res.data });
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const getMyPostes = () => async (dispatch) => {
    try {
        const res = await axios.get(`/api/postes/me`);
        dispatch({ type: GET_MES_POSTES, payload: res.data });
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

export const addCommentaire =
    ({ idPoste, idCandidat, commentaire, dateCommentaire }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const body = JSON.stringify({
                candidat: idCandidat,
                commentaire,
                dateCommentaire,
            });

            const res = await axios.put(
                `/api/postes/${idPoste}/commentaires`,
                body,
                config
            );
            dispatch(setAlert("Commentaire ajouté ", "success", 2500));
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

export const updateCommentaire =
    ({ idPoste, idCommentaire, commentaire }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        try {
            const body = JSON.stringify({
                commentaire,
            });

            const res = await axios.put(
                `/api/postes/${idPoste}/commentaires/${idCommentaire}`,
                body,
                config
            );
            dispatch(setAlert("Changements sauvegardés ", "success", 2500));
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

export const deleteCommentaire =
    ({ idPoste, idCommentaire }) =>
    async (dispatch) => {
        try {
            const res = await axios.delete(
                `/api/postes/${idPoste}/commentaires/${idCommentaire}`
            );
            dispatch(setAlert("Commentaire supprimé ", "danger", 2500));
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
