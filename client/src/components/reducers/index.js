import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import alert from "./alert";
import auth from "./auth";
import offres from "./offres";
import candidats from "./candidats";
import avis from "./avis";
import demandes from "./demandes";
import postes from "./postes";
import admin from "./admin";
import conversations from "./conversations";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth"],
};

const rootReducer = combineReducers({
    alert,
    auth,
    offres,
    candidats,
    avis,
    demandes,
    postes,
    admin,
    conversations,
});

export default persistReducer(persistConfig, rootReducer);
