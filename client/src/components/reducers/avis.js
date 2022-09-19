import {
    GET_AVIS,
    GET_AVIS_CANDIDAT,
    GET_AVIS_ENTREPRISE,
} from "../actions/types";

const initialState = {
    avis: [],
    avisCandidat: [],
    avisIdToDelete: "",
    avisEntreprise: [],
    avisToUpdate: {},
};

// eslint-disable-next-line
export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_AVIS:
            return {
                ...state,
                avis: payload,
            };
        case GET_AVIS_CANDIDAT:
            return {
                ...state,
                avisCandidat: payload,
            };
        case GET_AVIS_ENTREPRISE:
            return {
                ...state,
                avisEntreprise: payload,
            };
        case "AVIS_TO_DELETE":
            return { ...state, avisIdToDelete: payload };
        case "AVIS_TO_UPDATE":
            return { ...state, avisToUpdate: payload };
        default:
            return state;
    }
}
