import React from "react";
import ReactDOM from "react-dom";
import DashboardNav from "../../helpers/DashboardNav";
import OfferBox from "../../helpers/OffreBox";
import ReviewBox from "../../helpers/ReviewBox";
import { connect } from "react-redux";
import categories from "../../helpers/categories.json";
import wilayas from "../../helpers/wilayas.json";
import { loadEntreprise } from "../../actions/auth";
import { getOffresByEntreprise } from "../../actions/offre";
import { store } from "../../store";
import { getAvis } from "../../actions/avis";

import "../CompanyPage/CompanyPage.css";
import "./VoirEntrepriseCandidat.css";
import AvisForm from "../../helpers/AvisForm";
import axios from "axios";

class VoirEntrepriseCandidat extends React.Component {
    constructor(props) {
        super(props);
        this.state = { entreprise: null, offres: [], abonné: false };
        this.addAvis = React.createRef();
    }

    async componentDidMount() {
        const res = await this.props.loadEntreprise(
            this.props.match.params.entreprise_id
        );
        this.setState({ ...this.state, entreprise: res.data });
        const res1 = await this.props.getOffresByEntreprise(
            this.state.entreprise._id
        );
        this.setState({ ...this.state, offres: res1 });
        store.dispatch(getAvis(this.props.match.params.entreprise_id));
        try {
            const res2 = await axios.get(
                `/api/entreprises/followers/${this.props.match.params.entreprise_id}`
            );
            this.setState({ ...this.state, abonné: res2.data.abonné });
        } catch (err) {
            console.log(err);
        }
    }

    renderCategorie() {
        let c = "";
        categories.forEach((categorie) => {
            if (categorie.id === this.state.entreprise.categorie) {
                c = categorie.cat;
            }
        });
        return c;
    }

    renderWilaya() {
        let w = "";
        wilayas.forEach((wilaya) => {
            if (wilaya.code === this.state.entreprise.wilaya) {
                w = wilaya.wilaya;
            }
        });
        return w;
    }

    renderMyOffres() {
        const myOffresArray = [];
        this.state.offres.forEach((offre) => {
            if (offre.etat === "Actif") {
                myOffresArray.push(
                    <OfferBox
                        key={offre._id}
                        offre={offre}
                        commander="candidat"
                    />
                );
            }
        });
        return myOffresArray;
    }

    renderEntrepriseAvis() {
        const avisArray = [];
        this.props.avis.forEach((avis) => {
            if (avis.etat === "Accepté") {
                avisArray.push(
                    <ReviewBox
                        key={avis._id}
                        candidat={avis.candidat}
                        stars={avis.evaluation}
                        commentaire={avis.commentaire}
                    />
                );
            }
        });
        return avisArray;
    }

    async createNewChat() {
        const conversation = await axios.get(
            `/api/conversations/candidat/${this.props.candidat._id}/${this.props.match.params.entreprise_id}`
        );

        if (conversation.data.length !== 0) {
            const friend = conversation.data[0].members.find(
                (m) =>
                    m.userId !== this.props.candidat._id &&
                    m.userType !== this.props.currentUserType
            );
            let res;
            if (friend.userType === "Candidat") {
                res = await this.props.getCandidat(friend.userId);
            } else {
                res = await this.props.loadEntreprise(friend.userId);
            }
            store.dispatch({
                type: "SET_CURRENT_CONVERSATION",
                payload: {
                    currentConversation: conversation.data[0],
                    currentUser: this.props.candidat,
                    friendUser: res.data,
                },
            });
            document.querySelector(".message-fomr-handler").style.display =
                "block";
        } else {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            try {
                const body = {
                    senderId: this.props.candidat._id,
                    senderType: "Candidat",
                    recieverId: this.props.match.params.entreprise_id,
                    recieverType: "Entreprise",
                };
                const res = await axios.post(
                    "/api/conversations",
                    body,
                    config
                );
                const friend = res.data.members.find(
                    (m) =>
                        m.userId !== this.props.candidat._id &&
                        m.userType !== this.props.currentUserType
                );
                let res1;
                if (friend.userType === "Candidat") {
                    res1 = await this.props.getCandidat(friend.userId);
                } else {
                    res1 = await this.props.loadEntreprise(friend.userId);
                }
                store.dispatch({
                    type: "SET_CURRENT_CONVERSATION",
                    payload: {
                        currentConversation: res.data,
                        currentUser: this.props.candidat,
                        friendUser: res1.data,
                    },
                });
                document.querySelector(".message-fomr-handler").style.display =
                    "block";
            } catch (err) {}
        }
    }

    async onClickHandle() {
        try {
            if (this.state.abonné) {
                await axios.delete(
                    `/api/entreprises/followers/${this.props.match.params.entreprise_id}`
                );
                this.setState({ ...this.state, abonné: false });
            } else {
                await axios.put(
                    `/api/entreprises/followers/${this.props.match.params.entreprise_id}`
                );
                this.setState({ ...this.state, abonné: true });
            }
        } catch (err) {}
    }

    render() {
        return this.state.entreprise && this.props.candidat ? (
            <div className="company-page">
                <DashboardNav />
                <AvisForm
                    candidatId={this.props.candidat._id}
                    entrepriseId={this.props.match.params.entreprise_id}
                    reference={this.addAvis}
                />
                <div className="page-content">
                    <div className="container">
                        <div className="company-infos">
                            <div className="poster">
                                <div className="avatar-img">
                                    <img
                                        src={this.state.entreprise.avatar}
                                        alt="avatar"
                                        style={{ width: "128px" }}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="left-box col-md-8">
                                    <div className="actions">
                                        <div
                                            onClick={(e) => {
                                                e.preventDefault();
                                                this.onClickHandle();
                                            }}
                                            className={`follow-action ${
                                                this.state.abonné ? "done" : ""
                                            }`}
                                        >
                                            {this.state.abonné ? (
                                                <span key={0}>
                                                    <i className="fas fa-check"></i>
                                                </span>
                                            ) : (
                                                <span key={1}>
                                                    <i className="fas fa-bell"></i>
                                                </span>
                                            )}

                                            {this.state.abonné
                                                ? "Abonné"
                                                : "S'abonner"}
                                        </div>
                                        <div
                                            className="send-message"
                                            onClick={() => {
                                                this.createNewChat();
                                            }}
                                        >
                                            <i
                                                className="fas fa-comment-dots"
                                                style={{ marginRight: "10px" }}
                                            ></i>
                                            Contacter
                                        </div>
                                    </div>
                                    <h2 style={{ marginTop: "40px" }}>
                                        {this.state.entreprise.nom}
                                        <div className="category">
                                            <i className="fas fa-server"></i>
                                            {this.renderCategorie()}
                                        </div>
                                    </h2>

                                    <p>{this.state.entreprise.bio}</p>
                                </div>
                                <div className="contact-info col-md-4">
                                    <ul className="list-unstyled">
                                        <li>
                                            <i className="fas fa-map-marker-alt"></i>
                                            {this.state.entreprise.adresse ===
                                                undefined ||
                                            this.state.entreprise.wilaya ===
                                                undefined
                                                ? ""
                                                : `${
                                                      this.state.entreprise
                                                          .adresse
                                                  }, ${
                                                      this.state.entreprise
                                                          ? this.renderWilaya()
                                                          : ""
                                                  }`}
                                        </li>
                                        <li>
                                            <i className="fas fa-phone-alt"></i>
                                            {this.state.entreprise.tel}
                                        </li>
                                        <li>
                                            <i className="fas fa-envelope"></i>
                                            {this.state.entreprise.liens ===
                                            undefined
                                                ? ""
                                                : this.state.entreprise.liens
                                                      .contactEmail}
                                        </li>
                                        <li className="website-item">
                                            <i className="fas fa-globe"></i>
                                            <a
                                                href="https://www.google.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {this.state.entreprise.liens ===
                                                undefined
                                                    ? ""
                                                    : this.state.entreprise
                                                          .liens.website}
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="socials">
                                        <ul className="list-unstyled">
                                            <li>
                                                <a
                                                    href={
                                                        this.state.entreprise
                                                            .liens === undefined
                                                            ? ""
                                                            : this.state
                                                                  .entreprise
                                                                  .liens
                                                                  .facebook
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <i className="fab fa-facebook-square"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href={
                                                        this.state.entreprise
                                                            .liens === undefined
                                                            ? ""
                                                            : this.state
                                                                  .entreprise
                                                                  .liens.twitter
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <i className="fab fa-twitter-square"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href={
                                                        this.state.entreprise
                                                            .liens === undefined
                                                            ? ""
                                                            : this.state
                                                                  .entreprise
                                                                  .liens
                                                                  .linkedin
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <i className="fab fa-linkedin"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="company-desc">
                            <h4 style={{ justifyContent: "left" }}>
                                <i className="fas fa-info-circle"></i>
                                Description
                            </h4>
                            <p>{this.state.entreprise.description}</p>
                        </div>
                        <div className="company-offers">
                            <h4 style={{ justifyContent: "left" }}>
                                <i className="fas fa-align-left"></i>
                                Les offres
                            </h4>
                            <div className="offers-container">
                                {this.renderMyOffres()}
                            </div>
                        </div>
                        <div className="company-reviews">
                            <h4>
                                <div>
                                    <i className="fas fa-search"></i>
                                    Les avis
                                </div>
                                <button
                                    onClick={() =>
                                        (ReactDOM.findDOMNode(
                                            this.addAvis.current
                                        ).style.display = "flex")
                                    }
                                >
                                    <i className="fas fa-plus"></i>Ajouter
                                </button>
                            </h4>
                            <div className="reviews-container">
                                {this.renderEntrepriseAvis()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null;
    }
}

const mapStateToProps = (state) => ({
    avis: state.avis.avis,
    candidat: state.auth.user,
    currentUserType: state.auth.accountType,
});

export default connect(mapStateToProps, {
    loadEntreprise,
    getOffresByEntreprise,
    getAvis,
})(VoirEntrepriseCandidat);
