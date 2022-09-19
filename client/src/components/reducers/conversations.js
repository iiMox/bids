const initialState = {
    currentConversation: null,
    currentUser: null,
    friendUser: null,
};

// eslint-disable-next-line
export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case "SET_CURRENT_CONVERSATION":
            return {
                ...state,
                currentConversation: payload.currentConversation,
                currentUser: payload.currentUser,
                friendUser: payload.friendUser,
            };
        default:
            return state;
    }
}
