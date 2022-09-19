import React from "react";
import ReactDOM from "react-dom";
import DashboardNavEntreprise from "../../helpers/DashboardNavEntreprise";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OfferStageRow from "../../helpers/OfferStageRow";
import OffreForm from "../../helpers/OffreForm";
import OffreUpdateForm from "../../helpers/OffreUpdateForm";
import OffreDemandes from "../../helpers/OffreDemandes";

import { connect } from "react-redux";
import { getMyOffres, supprimerOffre } from "../../actions/offre";
import { getOffreDemandes } from "../../actions/demande";
import Alert from "../../helpers/Alert";
import { store } from "../../store";

import "./OffersCompany.css";

class OffersCompany extends React.Component {
    constructor(props) {
        super(props);

        this.state = { offreId: "" };

        this.addOffreRef = React.createRef();
        this.updateOffreRef = React.createRef();
        this.deleteOffreRef = React.createRef();
        this.offreDemandesRef = React.createRef();
    }

    async componentDidMount() {
        store.dispatch(getMyOffres());
        const val = localStorage.getItem("show");
        if (val === "true") {
            await this.props.getOffreDemandes(localStorage.getItem("offreId"));
        }
        setInterval(async () => {
            if (this.props.offre) {
                if (this.state.offreId !== this.props.offre._id) {
                    await this.props.getOffreDemandes(this.props.offre._id);
                    this.setState({ offreId: this.props.offre._id });
                }
            }
        }, 500);
    }

    renderOffres() {
        const offresArray = [];
        let i = 0;
        this.props.myOffres.forEach((offre) => {
            offresArray.push(
                <OfferStageRow
                    key={i}
                    offreId={offre._id}
                    title={offre.titre}
                    d_posted={offre.dateCreation}
                    type={offre.type === "emploi" ? "Emploi" : "Stage"}
                    state={offre.etat}
                    reference={this.updateOffreRef}
                    referenceDelete={this.deleteOffreRef}
                    referenceDemandes={this.offreDemandesRef}
                />
            );
            i++;
        });
        return offresArray;
    }

    renderNbrEmplois() {
        let i = 0;
        this.props.myOffres.forEach((offre) => {
            if (offre.type === "emploi") {
                i++;
            }
        });
        return i;
    }

    renderNbrStage() {
        let i = 0;
        this.props.myOffres.forEach((offre) => {
            if (offre.type === "stage") {
                i++;
            }
        });
        return i;
    }

    searchInTable() {
        var input, filter, table, tr, td, td1, i, txtValue, txtValue1;
        input = document.getElementById("searchInMesOffresTable");
        filter = input.value.toUpperCase();
        table = document.getElementById("mesOffresTable");
        tr = table.getElementsByTagName("tr");

        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            td1 = tr[i].getElementsByTagName("td")[1];
            if (td && td1) {
                txtValue = td.textContent || td.innerText;
                txtValue1 = td1.textContent || td1.innerText;
                if (
                    txtValue.toUpperCase().indexOf(filter) > -1 ||
                    txtValue1.toUpperCase().indexOf(filter) > -1
                ) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }

    render() {
        return (
            <div className="company-offers">
                <OffreForm reference={this.addOffreRef} />
                <OffreUpdateForm
                    type="emploi"
                    reference={this.updateOffreRef}
                />
                <OffreDemandes reference={this.offreDemandesRef} />
                <div className="delete-box" ref={this.deleteOffreRef}>
                    <div className="delete-box-container">
                        <h4 className="text-center">Avertissement</h4>
                        <hr />
                        <Alert />
                        <p>Voulez-vous vraiment supprimer ?</p>
                        <div className="buttons-container">
                            <button
                                onClick={() => {
                                    this.props.supprimerOffre(
                                        this.props.offre._id
                                    );
                                    setInterval(
                                        () => window.location.reload(),
                                        2550
                                    );
                                }}
                            >
                                Oui
                            </button>
                            <button
                                onClick={() => {
                                    this.deleteOffreRef.current.style.display =
                                        "none";
                                }}
                            >
                                Non
                            </button>
                        </div>
                    </div>
                </div>
                <DashboardNavEntreprise />
                <div className="offers-content">
                    <div className="container">
                        <h2>Offres & Stages</h2>
                        <div className="offers-stats">
                            <div className="offers-send animate__animated animate__bounceInLeft">
                                <div>
                                    <FontAwesomeIcon icon={["fas", "share"]} />
                                    Offres d'emplois poster
                                </div>
                                <span>{this.renderNbrEmplois()}</span>
                            </div>
                            <div className="offers-accepted animate__animated animate__bounceInRight">
                                <div>
                                    <FontAwesomeIcon
                                        icon={["fas", "check-circle"]}
                                    />
                                    Offres de stages crées
                                </div>
                                <span>{this.renderNbrStage()}</span>
                            </div>
                        </div>
                        <div className="table-container">
                            <div className="control-buttons row">
                                <div className="search-bar col-md-6 animate__animated animate__backInLeft">
                                    <input
                                        type="text"
                                        id="searchInMesOffresTable"
                                        onKeyUp={(e) => {
                                            this.searchInTable(e);
                                        }}
                                    />
                                    <FontAwesomeIcon icon={["fas", "search"]} />
                                </div>
                                <div className="buttons-container col-md-6 text-right animate__animated animate__backInRight">
                                    <button
                                        onClick={() => {
                                            ReactDOM.findDOMNode(
                                                this.addOffreRef.current
                                            ).style.display = "flex";
                                        }}
                                    >
                                        <i className="fas fa-plus"></i>Ajouter
                                    </button>
                                </div>
                            </div>
                            <hr />
                            <table
                                className="animate__animated animate__bounceInUp"
                                id="mesOffresTable"
                            >
                                <thead>
                                    <tr className="table-header">
                                        <th>Titre de l'offre</th>
                                        <th>Date postée</th>
                                        <th>Type</th>
                                        <th>Etat de l'offre</th>
                                        <th style={{ width: "150px" }}></th>
                                    </tr>
                                </thead>
                                <tbody>{this.renderOffres()}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    offres: state.offres.offres,
    offre: state.offres.offre,
    myOffres: state.offres.entrepriseOffres,
    demandes: state.demandes.OffreDemandes,
});

export default connect(mapStateToProps, {
    getMyOffres,
    supprimerOffre,
    getOffreDemandes,
})(OffersCompany);
