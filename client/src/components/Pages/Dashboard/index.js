import React from "react";
import DashboardNav from "../../helpers/DashboardNav";
import OffreBoxVertical from "../../helpers/OffreBoxVertical";
import Copyright from "../../helpers/Copyright";
import { connect } from "react-redux";
import wilayas from "../../helpers/wilayas.json";
import categories from "../../helpers/categories.json";
import { loadEntreprise } from "../../actions/auth";

import $ from "jquery";

import "./Dashboard.css";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            region: "",
            experience: "",
            domaine: "",
            type: "",
            show: true,
            search: "",
            offres: [],
            offresLoaded: false,
        };
    }

    componentDidMount() {
        setTimeout(() => {
            $("#spinner").css("display", "none");
            $("#offresDiv").css("display", "flex");
        }, 2500);
    }

    componentWillReceiveProps(props) {
        props.offres.forEach(async (offre) => {
            const w = await props.loadEntreprise(offre.entreprise);
            this.setState({
                ...this.state,
                offres: [...this.state.offres, w.data.wilaya],
            });
        });
        this.setState({
            ...this.state,
            offresLoaded: true,
        });
    }

    onChange(e) {
        this.setState({
            ...this.state,
            [e.target.name]: e.target.value,
        });
    }

    renderingSalutPhrase() {
        const dt = new Date();

        if (dt.getHours() >= 0 && dt.getHours() < 12) {
            return "Bonjour ";
        }
        return "Bonsoir ";
    }

    renderLevel(exp) {
        if (exp < 3) {
            return "Débutant";
        } else if (exp <= 5) {
            return "Moyen";
        } else return "Expert";
    }

    renderOffres(region, experience, domaine, type) {
        const offresArray = [];
        let i = 0;
        this.props.offres.forEach((offre) => {
            const offreExperience = this.renderLevel(offre.experience);
            if (offre.etat === "Actif") {
                if (
                    region === "" &&
                    experience === "" &&
                    domaine === "" &&
                    type === ""
                ) {
                    offresArray.push(
                        <OffreBoxVertical
                            key={offre._id}
                            offre={offre}
                            commander="candidat"
                        />
                    );
                } else if (
                    this.state.offres[i] === region &&
                    experience === "" &&
                    domaine === "" &&
                    type === ""
                ) {
                    offresArray.push(
                        <OffreBoxVertical
                            key={offre._id}
                            offre={offre}
                            commander="candidat"
                        />
                    );
                } else if (
                    this.state.offres[i] === region &&
                    experience === offreExperience &&
                    domaine === "" &&
                    type === ""
                ) {
                    offresArray.push(
                        <OffreBoxVertical
                            key={offre._id}
                            offre={offre}
                            commander="candidat"
                        />
                    );
                } else if (
                    this.state.offres[i] === region &&
                    experience === "" &&
                    domaine === offre.categorie &&
                    type === ""
                ) {
                    offresArray.push(
                        <OffreBoxVertical
                            key={offre._id}
                            offre={offre}
                            commander="candidat"
                        />
                    );
                } else if (
                    this.state.offres[i] === region &&
                    experience === offreExperience &&
                    domaine === offre.categorie &&
                    type === ""
                ) {
                    offresArray.push(
                        <OffreBoxVertical
                            key={offre._id}
                            offre={offre}
                            commander="candidat"
                        />
                    );
                } else if (
                    this.state.offres[i] === region &&
                    experience === "" &&
                    domaine === "" &&
                    type === offre.type
                ) {
                    offresArray.push(
                        <OffreBoxVertical
                            key={offre._id}
                            offre={offre}
                            commander="candidat"
                        />
                    );
                } else if (
                    this.state.offres[i] === region &&
                    experience === offreExperience &&
                    domaine === "" &&
                    type === offre.type
                ) {
                    offresArray.push(
                        <OffreBoxVertical
                            key={offre._id}
                            offre={offre}
                            commander="candidat"
                        />
                    );
                } else if (
                    this.state.offres[i] === region &&
                    experience === "" &&
                    domaine === offre.categorie &&
                    type === offre.type
                ) {
                    offresArray.push(
                        <OffreBoxVertical
                            key={offre._id}
                            offre={offre}
                            commander="candidat"
                        />
                    );
                } else if (
                    this.state.offres[i] === region &&
                    experience === offreExperience &&
                    domaine === offre.categorie &&
                    type === offre.type
                ) {
                    offresArray.push(
                        <OffreBoxVertical
                            key={offre._id}
                            offre={offre}
                            commander="candidat"
                        />
                    );
                } else if (
                    region === "" &&
                    experience === offreExperience &&
                    domaine === "" &&
                    type === ""
                ) {
                    offresArray.push(
                        <OffreBoxVertical
                            key={offre._id}
                            offre={offre}
                            commander="candidat"
                        />
                    );
                } else if (
                    region === "" &&
                    experience === offreExperience &&
                    domaine === offre.categorie &&
                    type === ""
                ) {
                    offresArray.push(
                        <OffreBoxVertical
                            key={offre._id}
                            offre={offre}
                            commander="candidat"
                        />
                    );
                } else if (
                    region === "" &&
                    experience === offreExperience &&
                    domaine === "" &&
                    type === offre.type
                ) {
                    offresArray.push(
                        <OffreBoxVertical
                            key={offre._id}
                            offre={offre}
                            commander="candidat"
                        />
                    );
                } else if (
                    region === "" &&
                    experience === offreExperience &&
                    domaine === offre.categorie &&
                    type === offre.type
                ) {
                    offresArray.push(
                        <OffreBoxVertical
                            key={offre._id}
                            offre={offre}
                            commander="candidat"
                        />
                    );
                } else if (
                    region === "" &&
                    experience === "" &&
                    domaine === offre.categorie &&
                    type === ""
                ) {
                    offresArray.push(
                        <OffreBoxVertical
                            key={offre._id}
                            offre={offre}
                            commander="candidat"
                        />
                    );
                } else if (
                    region === "" &&
                    experience === "" &&
                    domaine === offre.categorie &&
                    type === offre.type
                ) {
                    offresArray.push(
                        <OffreBoxVertical
                            key={offre._id}
                            offre={offre}
                            commander="candidat"
                        />
                    );
                } else if (
                    region === "" &&
                    experience === "" &&
                    domaine === "" &&
                    type === offre.type
                ) {
                    offresArray.push(
                        <OffreBoxVertical
                            key={offre._id}
                            offre={offre}
                            commander="candidat"
                        />
                    );
                }
            }
            i++;
        });

        return offresArray.length !== 0 ? (
            offresArray
        ) : (
            <div style={{ textAlign: "center", width: "100%" }}>
                Pas d'offres pour l'instant.
            </div>
        );
    }

    renderWilayas() {
        const wilayasArray = [];
        wilayasArray.push(<option key="0" value=""></option>);
        wilayas.forEach((wilaya) =>
            wilayasArray.push(
                <option
                    key={wilaya.code}
                    value={wilaya.code}
                >{`${wilaya.code}- ${wilaya.wilaya}`}</option>
            )
        );
        return wilayasArray;
    }

    renderCategories() {
        const categoriesArray = [];
        categoriesArray.push(<option key="0" value=""></option>);
        categories.forEach((categorie) =>
            categoriesArray.push(
                <option key={categorie.id} value={categorie.id}>
                    {categorie.cat}
                </option>
            )
        );
        return categoriesArray;
    }

    filterSearch(e) {
        const children = $("#offresDiv").children();
        for (let i = 0; i < children.length; i++) {
            const name = children[i].children[0].children[1];
            const titre = children[i].children[1].children[0];
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

    render() {
        return this.props.offres ? (
            <div className="dashboard">
                <DashboardNav />
                <div className="dashboard-box">
                    <div className="container">
                        <div className="content">
                            <h2>
                                {this.renderingSalutPhrase()}
                                <span>
                                    {this.props.candidat === null
                                        ? "Username"
                                        : this.props.candidat.username}
                                </span>
                                .
                            </h2>
                            <p>
                                Commencez par rechercher des offres qui vous
                                conviennent
                            </p>
                            <form>
                                <input
                                    type="text"
                                    placeholder="Tapez..."
                                    onKeyUp={(e) => {
                                        this.filterSearch(e);
                                    }}
                                />
                                <button onClick={(e) => e.preventDefault()}>
                                    Rechercher
                                </button>
                            </form>
                            <div className="filter">
                                <form>
                                    <div className="row">
                                        <div className="filter-box col-md-3">
                                            <label>Région</label>
                                            <select
                                                className="select"
                                                name="region"
                                                onChange={(e) =>
                                                    this.onChange(e)
                                                }
                                            >
                                                {this.renderWilayas()}
                                            </select>
                                        </div>
                                        <div className="filter-box col-md-3">
                                            <label>Experience</label>
                                            <select
                                                className="select"
                                                name="experience"
                                                onChange={(e) =>
                                                    this.onChange(e)
                                                }
                                            >
                                                <option value=""></option>
                                                <option value="Débutant">
                                                    Débutant
                                                </option>
                                                <option value="Moyen">
                                                    Moyen
                                                </option>
                                                <option value="Expert">
                                                    Expert
                                                </option>
                                            </select>
                                        </div>
                                        <div className="filter-box col-md-3">
                                            <label>Domaine</label>
                                            <select
                                                className="select"
                                                name="domaine"
                                                onChange={(e) =>
                                                    this.onChange(e)
                                                }
                                            >
                                                {this.renderCategories()}
                                            </select>
                                        </div>
                                        <div className="filter-box col-md-3">
                                            <label>Type</label>
                                            <select
                                                className="select"
                                                name="type"
                                                onChange={(e) =>
                                                    this.onChange(e)
                                                }
                                            >
                                                <option value=""></option>
                                                <option value="emploi">
                                                    Offre d'emplois
                                                </option>
                                                <option value="stage">
                                                    Stages
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.setState({
                                                ...this.state,
                                                region: "",
                                                type: "",
                                                domaine: "",
                                                experience: "",
                                            });
                                            $(".select").val("");
                                        }}
                                    >
                                        Initialiser
                                    </button>
                                </form>
                            </div>
                            <hr />

                            <div className="spinner" id="spinner">
                                <div className="double-bounce1"></div>
                                <div className="double-bounce2"></div>
                            </div>
                            <div
                                id="offresDiv"
                                className="row"
                                style={{ display: "none" }}
                            >
                                {this.state.offresLoaded
                                    ? this.renderOffres(
                                          this.state.region,
                                          this.state.experience,
                                          this.state.domaine,
                                          this.state.type
                                      )
                                    : ""}
                            </div>
                        </div>
                    </div>
                </div>
                <Copyright />
            </div>
        ) : null;
    }
}

const mapStateToProps = (state) => ({
    candidat: state.auth.user,
    offres: state.offres.offres,
});

export default connect(mapStateToProps, { loadEntreprise })(Dashboard);
