import {
    ADD_OFFRE,
    GET_OFFRES,
    GET_ENTREPRISE_OFFRES,
    GET_OFFRE,
    DELETE_OFFRE,
} from "../actions/types";
const initialState = {
    offres: [],
    offre: null,
    entrepriseOffres: [],
    filtredOffres: [],
};

// eslint-disable-next-line
export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case GET_OFFRE:
            return {
                ...state,
                offre: payload,
            };
        case GET_OFFRES:
            return {
                ...state,
                offres: [...payload].reverse(),
            };
        case GET_ENTREPRISE_OFFRES:
            return {
                ...state,
                entrepriseOffres: payload,
            };
        case ADD_OFFRE:
            return { ...state, offres: [payload, ...state.offres] };
        case DELETE_OFFRE:
            return {
                ...state,
                offres: state.offres.filter((offre) => offre._id !== payload),
            };
        default:
            return state;
    }
}
