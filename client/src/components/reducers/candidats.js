import { GET_CANDIDATS, GET_CANDIDAT } from "../actions/types";
const initialState = { candidats: [], candidatCurrent: null };

// eslint-disable-next-line
export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_CANDIDATS:
            return {
                ...state,
                candidats: payload,
            };
        case GET_CANDIDAT:
            return {
                ...state,
                candidatCurrent: payload,
            };
        default:
            return state;
    }
}
