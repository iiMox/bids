import React from "react";
import $ from "jquery";
import { Router, Route } from "react-router-dom";
import history from "../history";
import HomePage from "./Pages/HomePage";
import Dashboard from "./Pages/Dashboard";
import Auth from "./Pages/Authentification";
import OffersPage from "./Pages/OffersPage";
import ContactPage from "./Pages/ContactPage";
import ProfilPage from "./Pages/ProfilPage";
import SettingsPage from "./Pages/SettingsPage";
import DemandsPage from "./Pages/DemandsPage";
import DashboardEntreprise from "./Pages/DashboardEntreprise";
import CompanyPage from "./Pages/CompanyPage";
import OffersCompany from "./Pages/OffersCompany";
import SettingsCompanyPage from "./Pages/SettingsCompanyPage";
import VoirOffreCandidat from "./Pages/VoirOffreCandidat";
import VoirOffreEntreprise from "./Pages/VoirOffreEntreprise";
import VoirCandidatEntreprise from "./Pages/VoirCandidatEntreprise";
import ForumPage from "./Pages/ForumPage";
import MessageSidePanel from "./helpers/MessageSidePanel";

//Redux
import { store } from "./store";

import "./Style.css";
import setAuthToken from "./utils/setAuthToken";
import { loadUser } from "./actions/auth";
import { getAllOffres } from "./actions/offre";
import { getAllCandidats } from "./actions/candidat";
import { getAllPostes, getMyPostes } from "./actions/postes";
import VoirOffreGuest from "./Pages/VoirOffreGuest";
import VoirEntrepriseCandidat from "./Pages/VoirEntrepriseCandidat";
import AvisPage from "./Pages/AvisPage";
import PostPage from "./Pages/PostPage";
import AdminPage from "./Pages/AdminPage";
import ForumGuestPage from "./Pages/ForumGuestPage";

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.loadingRef = React.createRef();
    }

    componentDidMount() {
        setTimeout(() => {
            $(this.loadingRef.current).fadeOut();
        }, 2000);
        store.dispatch(loadUser());
        store.dispatch(getAllOffres());
        store.dispatch(getAllCandidats());
        store.dispatch(getAllPostes());
        store.dispatch(getMyPostes());
    }

    render() {
        return (
            <>
                <Router history={history}>
                    <div className="loading" ref={this.loadingRef}>
                        <div className="loader"></div>
                    </div>

                    <Route path="/" exact component={HomePage} />
                    <Route
                        path="/authentification/:type"
                        exact
                        component={Auth}
                    />
                    <Route path="/offres" exact component={OffersPage} />
                    <Route path="/forum" exact component={ForumGuestPage} />
                    <Route
                        path="/offres/:offre_id"
                        exact
                        component={VoirOffreGuest}
                    />
                    <Route path="/contact" exact component={ContactPage} />
                    <Route path="/candidat" exact component={Dashboard} />
                    <Route path="/candidat" component={MessageSidePanel} />
                    <Route
                        path="/candidat/profil"
                        exact
                        component={ProfilPage}
                    />
                    <Route
                        path="/candidat/paramètres"
                        exact
                        component={SettingsPage}
                    />
                    <Route
                        path="/candidat/demandes"
                        exact
                        component={DemandsPage}
                    />
                    <Route path="/candidat/forum" exact component={ForumPage} />
                    <Route
                        path="/candidat/forum/:poste_id"
                        exact
                        component={PostPage}
                    />
                    <Route path="/candidat/avis" exact component={AvisPage} />
                    <Route
                        path="/candidat/offre/:offre_id"
                        exact
                        component={VoirOffreCandidat}
                    />
                    <Route
                        path="/candidat/entreprise/:entreprise_id"
                        exact
                        component={VoirEntrepriseCandidat}
                    />

                    <Route
                        path="/entreprise"
                        exact
                        component={DashboardEntreprise}
                    />
                    <Route path="/entreprise" component={MessageSidePanel} />
                    <Route
                        path="/entreprise/page"
                        exact
                        component={CompanyPage}
                    />
                    <Route
                        path="/entreprise/offres"
                        exact
                        component={OffersCompany}
                    />
                    <Route
                        path="/entreprise/paramètres"
                        exact
                        component={SettingsCompanyPage}
                    />
                    <Route
                        path="/entreprise/offre/:offre_id"
                        exact
                        component={VoirOffreEntreprise}
                    />
                    <Route
                        path="/entreprise/candidat/:candidat_id"
                        exact
                        component={VoirCandidatEntreprise}
                    />
                    <Route path="/admin" exact component={AdminPage} />
                </Router>
            </>
        );
    }
}

export default App;
