import {
    GET_DEMANDE,
    GET_CANDIDAT_DEMANDES,
    GET_OFFRE_DEMANDES,
} from "../actions/types";

const initialState = { demande: null, candidatDemandes: [], offreDemandes: [] };

// eslint-disable-next-line
export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_DEMANDE:
            return {
                ...state,
                demande: payload,
            };
        case GET_CANDIDAT_DEMANDES:
            return {
                ...state,
                candidatDemandes: payload,
            };
        case GET_OFFRE_DEMANDES:
            return {
                ...state,
                offreDemandes: payload,
            };
        default:
            return state;
    }
}
