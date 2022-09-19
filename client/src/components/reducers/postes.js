import { GET_POSTE, GET_POSTES, GET_MES_POSTES } from "../actions/types";
const initialState = { postes: [], poste: null, mesPostes: [] };

// eslint-disable-next-line
export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_POSTES:
            return {
                ...state,
                postes: payload,
            };
        case GET_POSTE:
            return {
                ...state,
                poste: payload,
            };
        case GET_MES_POSTES:
            return {
                ...state,
                mesPostes: payload,
            };
        default:
            return state;
    }
}
