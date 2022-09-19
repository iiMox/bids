import React from "react";
import ReactDOM from "react-dom";
import Alert from "../Alert";
import { connect } from "react-redux";
import { ajouterDemande } from "../../actions/demande";
import axios from "axios";
import { getOffre } from "../../actions/offre";

import "../AvisForm/AvisForm.css";
import moment from "moment";

class DemandeForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            demande: {
                candidat: props.candidatId,
                offre: props.offreId,
                lettreMotivation: "",
                dateEnvoi: moment(new Date()).format("DD-MM-YYYY"),
                etat: "en attent",
            },
        };
    }

    async onSubmitExperience(e) {
        e.preventDefault();
        const demande = {
            candidat: this.state.demande.candidat,
            offre: this.state.demande.offre,
            lettreMotivation: this.state.demande.lettreMotivation,
            dateEnvoi: this.state.demande.dateEnvoi,
            etat: this.state.demande.etat,
        };
        const res = this.props.ajouterDemande(demande);
        const entreprise = await this.props.getOffre(this.state.demande.offre);
        const config = { headers: { "Content-type": "application/json" } };
        const body = {
            destinationId: entreprise.data.entreprise,
            notificationType: "newDemande",
        };
        await axios.put(`api/entreprises/notifications`, body, config);

        if (res !== undefined) {
            setTimeout(() => window.location.reload(), 2500);
        }
    }

    render() {
        return (
            <div className="add-avis" ref={this.props.reference}>
                <div className="add-avis-container">
                    <div
                        className="close-tab"
                        onClick={() => {
                            ReactDOM.findDOMNode(
                                this.props.reference.current
                            ).style.display = "none";
                        }}
                    >
                        <i className="fas fa-times"></i>
                    </div>
                    <h4 style={{ fontSize: "30px" }}>
                        Envoyer une demande d'emploi
                    </h4>
                    <hr />
                    <Alert />
                    <form>
                        <label>Lettre de motivation</label>
                        <textarea
                            type="text"
                            onChange={(e) =>
                                this.setState({
                                    demande: {
                                        ...this.state.demande,
                                        lettreMotivation: e.target.value,
                                    },
                                })
                            }
                        ></textarea>

                        <button onClick={(e) => this.onSubmitExperience(e)}>
                            Envoyer
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default connect(null, { ajouterDemande, getOffre })(DemandeForm);
