import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import OffreDemandesRow from "../OffreDemandesRow";

import "./OffreDemandes.css";

class OffreDemandes extends React.Component {
    componentDidMount() {
        const val = localStorage.getItem("show");
        if (val === "true") {
            this.props.reference.current.style.display = "flex";
        }
    }

    renderDemandes() {
        const demandesArray = [];
        this.props.demandes.forEach((demande) => {
            demandesArray.push(
                <OffreDemandesRow
                    key={demande._id}
                    demandeId={demande._id}
                    offreId={demande.offre}
                    candidat={demande.candidat}
                    dateEnvoi={demande.dateEnvoi}
                    lettreMotivation={demande.lettreMotivation}
                    state={demande.etat}
                />
            );
        });
        return demandesArray.length === 0 ? (
            <tr>
                <td
                    style={{ textAlign: "center", padding: "20px 0" }}
                    colSpan="5"
                >
                    Pas de demandes pour le moment
                </td>
            </tr>
        ) : (
            demandesArray
        );
    }

    render() {
        return this.props.demandes ? (
            <div className="offre-demandes" ref={this.props.reference}>
                <div className="offre-demandes-container">
                    <div
                        className="close-tab"
                        onClick={() => {
                            localStorage.setItem("show", false);
                            localStorage.setItem("offreId", "");
                            ReactDOM.findDOMNode(
                                this.props.reference.current
                            ).style.display = "none";
                        }}
                    >
                        <i className="fas fa-times"></i>
                    </div>
                    <h4>Les demandes reçus sur l'offre</h4>
                    <hr />
                    <table>
                        <thead>
                            <tr className="table-header">
                                <th style={{ width: "20%" }}>Nom</th>
                                <th>Date d'envoi</th>
                                <th>Lettre de motivation</th>
                                <th>Etat de la demande</th>
                                <th style={{ width: "80px" }}></th>
                            </tr>
                        </thead>
                        <tbody>{this.renderDemandes()}</tbody>
                    </table>
                </div>
            </div>
        ) : (
            <div className="offre-demandes" ref={this.props.reference}></div>
        );
    }
}

const mapStateToPorps = (state) => ({
    offre: state.offres.offre,
    demandes: state.demandes.offreDemandes,
});

export default connect(mapStateToPorps)(OffreDemandes);
