import axios from "axios";
import { setAlert } from "./alert";
import setAuthToken from "../utils/setAuthToken";
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
} from "./types";
import { getMyOffres } from "./offre";

// Load User
export const loadUser = () => async (dispatch) => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {
        if (localStorage.accountType === "Candidat") {
            const res = await axios.get("/api/authentificationCandidat");

            dispatch({ type: USER_LOADED, payload: res.data });
            return res;
        } else if (localStorage.accountType === "Entreprise") {
            const res = await axios.get("/api/authentificationEntreprise");

            dispatch({ type: USER_LOADED, payload: res.data });
        } else {
            dispatch({
                type: AUTH_ERROR,
            });
        }
    } catch (err) {
        dispatch({
            type: AUTH_ERROR,
        });
    }
};

//Load entreprise
export const loadEntreprise = (id) => async (dispatch) => {
    try {
        const res = await axios.get(`api/entreprises/${id}`);
        return res;
    } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
            errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
        }
    }
};

// Register User
export const register =
    ({ username, email, password, accountType }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            if (accountType === "Candidat") {
                const body = JSON.stringify({ username, email, password });
                const res = await axios.post("/api/candidats", body, config);
                dispatch({
                    type: REGISTER_SUCCESS,
                    payload: { ...res.data, accountType },
                });
                dispatch(loadUser());
            } else if (accountType === "Entreprise") {
                const body = JSON.stringify({ nom: username, email, password });
                const res = await axios.post("/api/entreprises", body, config);
                dispatch({
                    type: REGISTER_SUCCESS,
                    payload: { ...res.data, accountType },
                });
                dispatch(loadUser());
            }
        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, "danger"))
                );
            }

            dispatch({ type: REGISTER_FAIL });
        }
    };

// Login User
export const login =
    ({ email, password, accountType }) =>
    async (dispatch) => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            if (accountType === "Candidat") {
                const body = JSON.stringify({ email, password });
                const res = await axios.post(
                    "/api/authentificationCandidat",
                    body,
                    config
                );
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: { ...res.data, accountType },
                });
                dispatch(loadUser());
            } else if (accountType === "Entreprise") {
                const body = JSON.stringify({ email, password });
                const res = await axios.post(
                    "/api/authentificationEntreprise",
                    body,
                    config
                );
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: { ...res.data, accountType },
                });
                dispatch(loadUser());
                dispatch(getMyOffres());
            }
        } catch (err) {
            const errors = err.response.data.errors;

            if (errors) {
                errors.forEach((error) =>
                    dispatch(setAlert(error.msg, "danger"))
                );
            }

            dispatch({ type: LOGIN_FAIL });
        }
    };

// Logout / Clear
export const logout = () => (dispatch) => {
    dispatch({ type: LOGOUT });
};
