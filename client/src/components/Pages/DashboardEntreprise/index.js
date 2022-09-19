import React from "react";
import DashboardNavEntreprise from "../../helpers/DashboardNavEntreprise";
import ReviewBox from "../../helpers/ReviewBox";
import StatBox from "../../helpers//StatBox";
import ProfileBox from "../../helpers/ProfileBox";
import OfferBox from "../../helpers/OffreBox";

import "./DashboardEntreprise.css";
import { connect } from "react-redux";
import { getMyOffres } from "../../actions/offre";
import { getAvisEntreprise } from "../../actions/avis";
import { loadUser } from "../../actions/auth";
import history from "../../../history";
import $ from "jquery";
import axios from "axios";

class DashboardEntreprise extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchType: "appliquant",
            demandesRecus: "0",
            demandesAcceptées: "0",
        };

        this.btnRef = React.createRef();
        this.inputRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    async componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
        await this.props.getMyOffres();
        await this.props.loadUser();
        await this.props.getAvisEntreprise(this.props.entreprise._id);
        setTimeout(async () => {
            try {
                const res = await axios.get(
                    "/api/entreprises/stats/demandesRecues"
                );
                const res1 = await axios.get(
                    "/api/entreprises/stats/demandesAcceptees"
                );

                this.setState({
                    ...this.setState,
                    demandesRecus: res.data.nbr,
                    demandesAcceptées: res1.data.nbr,
                });
            } catch (err) {
                console.log(err);
            }
        }, 1000);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    /**
     * Alert if clicked on outside of element
     */
    handleClickOutside(event) {
        if (this.inputRef && !this.inputRef.current.contains(event.target)) {
            this.btnRef.current.classList.remove("active");
        }
    }

    showBtn() {
        this.btnRef.current.classList.add("active");
    }

    renderOffres() {
        const myOffresArray = [];
        this.props.offres.forEach((offre) => {
            if (offre.etat === "Actif") {
                myOffresArray.push(
                    <OfferBox
                        key={offre._id}
                        offre={offre}
                        commander="entreprise"
                    />
                );
            }
        });
        return myOffresArray;
    }

    renderCandidats() {
        const candidatsArray = [];
        let i = 1;
        this.props.candidats.reverse().forEach((candidat) => {
            const arrayLangue = [];
            candidat.langue.forEach((langue) => {
                arrayLangue.push(langue.langue);
            });
            const arraySkills = [];
            candidat.competance.forEach((competance) => {
                arraySkills.push(competance.competance);
            });

            if (i < 10) {
                candidatsArray.unshift(
                    <ProfileBox
                        candidatId={candidat._id}
                        key={candidat._id}
                        avatar={candidat.avatar}
                        name={`${candidat.nom} ${candidat.prenom}`}
                        job={candidat.bio}
                        work_at={
                            candidat.experience.length !== 0
                                ? candidat.experience[
                                      candidat.experience.length - 1
                                  ].etablissement
                                : "Pas d'inforamtions."
                        }
                        study_at={
                            candidat.formation.length !== 0
                                ? candidat.formation[
                                      candidat.formation.length - 1
                                  ].etablissement
                                : "Pas d'inforamtions."
                        }
                        langs={
                            arrayLangue.length === 0
                                ? "Pas d'inforamtions."
                                : arrayLangue.join(",")
                        }
                        skills={
                            arraySkills.length === 0
                                ? "Pas d'inforamtions."
                                : arraySkills.join(", ")
                        }
                    />
                );
                i++;
            }
        });
        return candidatsArray;
    }

    renderSuggestions() {
        if (this.state.searchType === "appliquant") {
            return (
                <div className="profile-container">
                    {this.renderCandidats()}
                </div>
            );
        } else if (this.state.searchType === "offres") {
            return (
                <div className="offers-container">{this.renderOffres()}</div>
            );
        }
    }

    renderAvis() {
        const avisArray = [];
        let i = 0;
        this.props.mesAvis.forEach((avis) => {
            if (i < 4) {
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
            }
            i++;
        });
        return avisArray.length !== 0
            ? avisArray
            : "Il n'y a pas pour le moment";
    }

    filterSearch(e) {
        const children =
            this.state.searchType === "appliquant"
                ? $(".profile-container").children()
                : $(".offers-container").children();
        if (this.state.searchType === "appliquant") {
            for (let i = 0; i < children.length; i++) {
                const name = children[i].children[0].children[1].children[0];
                if (
                    name.textContent
                        .toUpperCase()
                        .indexOf(e.target.value.toUpperCase()) > -1
                ) {
                    children[i].style.display = "";
                } else {
                    children[i].style.display = "none";
                }
            }
        } else {
            for (let i = 0; i < children.length; i++) {
                const name = children[i].children[0].children[0].children[1];
                const titre = children[i].children[0].children[1].children[0];
                if (
                    name.textContent
                        .toUpperCase()
                        .indexOf(e.target.value.toUpperCase()) > -1 ||
                    titre.textContent
                        .toUpperCase()
                        .indexOf(e.target.value.toUpperCase()) > -1
                ) {
                    children[i].style.display = "";
                } else {
                    children[i].style.display = "none";
                }
            }
        }
    }

    render() {
        return (
            <div className="dash-company">
                <DashboardNavEntreprise />
                <div className="content">
                    <div className="container">
                        <div className="row">
                            <div className="main col-md-9">
                                <div className="quick-stats">
                                    <h2>Statistiques</h2>
                                    <div className="stats-box">
                                        <div className="row">
                                            <StatBox
                                                title="Abonnées"
                                                stat={
                                                    this.props.entreprise
                                                        .followers
                                                        ? this.props.entreprise
                                                              .followers.length
                                                        : 0
                                                }
                                                icon="users"
                                            />
                                            <StatBox
                                                title="Demandes Reçues"
                                                stat={this.state.demandesRecus}
                                                icon="paper-plane"
                                            />
                                            <StatBox
                                                title="Candidats Acceptés"
                                                stat={
                                                    this.state.demandesAcceptées
                                                }
                                                icon="user-check"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="main-content">
                                    <form>
                                        <input
                                            type="text"
                                            placeholder="Chercher..."
                                            onClick={() => this.showBtn()}
                                            ref={this.inputRef}
                                            onKeyUp={(e) => {
                                                this.filterSearch(e);
                                            }}
                                        />
                                        <button ref={this.btnRef}>
                                            <i className="fas fa-search"></i>
                                        </button>
                                    </form>

                                    <h2>Suggestions</h2>

                                    <div className="results-box">
                                        <div className="select">
                                            <div
                                                className="select-box"
                                                onClick={() =>
                                                    this.setState({
                                                        searchType:
                                                            "appliquant",
                                                    })
                                                }
                                            >
                                                <i className="fas fa-users"></i>
                                                Appliquants
                                            </div>
                                            <div
                                                className="select-box"
                                                onClick={() =>
                                                    this.setState({
                                                        searchType: "offres",
                                                    })
                                                }
                                            >
                                                <i className="fas fa-tag"></i>
                                                Offres
                                            </div>
                                        </div>
                                        <hr />
                                        {this.renderSuggestions()}
                                    </div>
                                </div>
                            </div>
                            <div className="latest-review col-md-3">
                                <h4>Dernier avis</h4>
                                <hr />
                                {this.renderAvis()}
                                <button
                                    onClick={() =>
                                        history.push("/entreprise/page", {
                                            toScroll: "avis",
                                        })
                                    }
                                >
                                    Voir plus...
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    offres: state.offres.offres,
    candidats: state.candidats.candidats,
    mesAvis: state.avis.avisEntreprise,
    entreprise: state.auth.user,
});

export default connect(mapStateToProps, {
    getMyOffres,
    getAvisEntreprise,
    loadUser,
})(DashboardEntreprise);
