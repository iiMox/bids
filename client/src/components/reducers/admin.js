const initialState = {
    candidats: null,
    entreprises: null,
    offres: null,
    demandes: null,
    avis: null,
    postes: null,
};

// eslint-disable-next-line
export default function (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case "GET_ADMIN_CANDIDATS":
            return { ...state, candidats: payload };
        case "GET_ADMIN_ENTREPRISES":
            return { ...state, entreprises: payload };
        case "GET_ADMIN_OFFRES":
            return { ...state, offres: payload };
        case "GET_ADMIN_DEMANDES":
            return { ...state, demandes: payload };
        case "GET_ADMIN_AVIS":
            return { ...state, avis: payload };
        case "GET_ADMIN_POSTES":
            return { ...state, postes: payload };
        default:
            return state;
    }
}
