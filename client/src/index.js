import React from "react";
import ReactDOM from "react-dom";

import { PersistGate } from "redux-persist/integration/react";

import App from "./components/App";

//Redux
import { Provider } from "react-redux";
import { store, persistor } from "./components/store";

ReactDOM.render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>,
    document.querySelector("#root")
);
