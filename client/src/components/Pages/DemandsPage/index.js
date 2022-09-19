import React from "react";
import DashboardNav from "../../helpers/DashboardNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DemandsRow from "../../helpers/DemandsRow";
import Alert from "../../helpers/Alert";
import DemandeFormUpdate from "../../helpers/DemandeFormUpdate";

import "./DemandsPage.css";
import { connect } from "react-redux";
import { getCandidatDemandes, supprimerDemande } from "../../actions/demande";
import { loadUser } from "../../actions/auth";

class DemandsPage extends React.Component {
    constructor(props) {
        super(props);

        this.deleteRef = React.createRef();
        this.updateDemande = React.createRef();
    }

    async componentDidMount() {
        await this.props.loadUser();
        await this.props.getCandidatDemandes(this.props.candidat._id);
    }

    handleDeleteBox() {
        if (this.deleteRef.current.style.dispaly === "flex") {
            this.deleteRef.current.style.dispaly = "none";
        } else {
            this.deleteRef.current.style.dispaly = "flex";
        }
        console.log(this.deleteRef.current.style.dispaly);
    }

    renderDemandes() {
        const demandesArray = [];
        this.props.mesDemandes.forEach((demande) => {
            demandesArray.push(
                <DemandsRow
                    key={demande._id}
                    demandeId={demande._id}
                    offre={demande.offre}
                    d_submited={demande.dateEnvoi}
                    state={demande.etat}
                    deleteRef={this.deleteRef}
                    updateDemande={this.updateDemande}
                />
            );
        });
        return demandesArray;
    }

    getNbrDzemandesAcceptées() {
        let i = 0;
        this.props.mesDemandes.forEach((demande) => {
            if (demande.etat === "Acceptée") {
                i++;
            }
        });
        return i;
    }

    searchInTable() {
        var input, filter, table, tr, td, td1, i, txtValue, txtValue1;
        input = document.getElementById("searchInDemandesTable");
        filter = input.value.toUpperCase();
        table = document.getElementById("demandesTable");
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
        return this.props.mesDemandes ? (
            <div className="demands">
                <DashboardNav />
                <div className="demands-content">
                    <DemandeFormUpdate reference={this.updateDemande} />
                    <div className="container">
                        <h2>Mes demandes d'emplois</h2>
                        <div className="demands-stats">
                            <div className="demands-send animate__animated animate__bounceInLeft">
                                <div>
                                    <FontAwesomeIcon icon={["fas", "share"]} />
                                    Demandes D'emplois envoyées
                                </div>
                                <span>{this.props.mesDemandes.length}</span>
                            </div>
                            <div className="demands-accepted animate__animated animate__bounceInRight">
                                <div>
                                    <FontAwesomeIcon
                                        icon={["fas", "check-circle"]}
                                    />
                                    Demandes D'emplois acceptées
                                </div>
                                <span>{this.getNbrDzemandesAcceptées()}</span>
                            </div>
                        </div>
                        <div className="table-container">
                            <div className="search-bar animate__animated animate__bounceInUp">
                                <input
                                    type="text"
                                    id="searchInDemandesTable"
                                    onKeyUp={(e) => {
                                        this.searchInTable(e);
                                    }}
                                />
                                <FontAwesomeIcon icon={["fas", "search"]} />
                            </div>
                            <hr />
                            <div className="delete-box" ref={this.deleteRef}>
                                <div className="delete-container">
                                    <h4 className="text-center">
                                        Avertissement
                                    </h4>
                                    <hr />
                                    <Alert />
                                    <p>Voulez-vous vraiment supprimer ?</p>
                                    <div className="buttons-container">
                                        <button
                                            onClick={() => {
                                                this.props.supprimerDemande(
                                                    this.props.demande._id
                                                );
                                                setInterval(
                                                    () =>
                                                        window.location.reload(),
                                                    2550
                                                );
                                            }}
                                        >
                                            Oui
                                        </button>
                                        <button
                                            onClick={() => {
                                                this.deleteRef.current.style.display =
                                                    "none";
                                            }}
                                        >
                                            Non
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <table
                                className="animate__animated animate__bounceInUp"
                                id="demandesTable"
                            >
                                <thead>
                                    <tr className="table-header">
                                        <th>Titre d'emploi</th>
                                        <th>Entreprise</th>
                                        <th>Date postée</th>
                                        <th>Date de participation</th>
                                        <th>Etat de la demande</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>{this.renderDemandes()}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        ) : null;
    }
}

const mapStateToProps = (state) => ({
    candidat: state.auth.user,
    mesDemandes: state.demandes.candidatDemandes,
    demande: state.demandes.demande,
});

export default connect(mapStateToProps, {
    getCandidatDemandes,
    loadUser,
    supprimerDemande,
})(DemandsPage);
