import React from "react";
import { connect } from "react-redux";
import { getCandidat } from "../../actions/candidat";
import { changeEtatDemande } from "../../actions/demande";
import axios from "axios";

import "../OfferStageRow/OfferStageRow.css";
import "./OffreDemandesRow.css";

class OffreDemandesRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = { nom: "" };

        this.deleteIcon = React.createRef();
    }

    async componentDidMount() {
        const res = await this.props.getCandidat(this.props.candidat);
        this.setState({ nom: `${res.data.nom} ${res.data.prenom}` });
    }

    iconChoice() {
        if (this.props.state === "Acceptée") {
            return <i className="fas fa-check"></i>;
        } else if (this.props.state === "Refusée") {
            return <i className="fas fa-times"></i>;
        } else {
            return <i className="fas fa-ellipsis-h"></i>;
        }
    }

    render() {
        return (
            <>
                <tr
                    onMouseEnter={() => {
                        this.deleteIcon.current.style.display = "flex";
                    }}
                    onMouseLeave={() => {
                        this.deleteIcon.current.style.display = "none";
                    }}
                >
                    <td
                        onClick={() => {
                            window.open(
                                `/entreprise/candidat/${this.props.candidat}`
                            );
                        }}
                    >
                        {this.state.nom}
                    </td>
                    <td>{this.props.dateEnvoi}</td>
                    <td>{this.props.lettreMotivation}</td>
                    <td
                        className={
                            this.props.state === "Acceptée"
                                ? "green"
                                : this.props.state === "Refusée"
                                ? "red"
                                : "gray"
                        }
                    >
                        {this.iconChoice()}
                    </td>
                    <td>
                        <span
                            className="icon-handler animate__animated animate__fadeIn"
                            ref={this.deleteIcon}
                        >
                            {this.props.state !== "Acceptée" ? (
                                <span
                                    style={{ color: "#32cd32" }}
                                    onClick={async () => {
                                        await this.props.changeEtatDemande({
                                            id: this.props.demandeId,
                                            etat: "Acceptée",
                                        });

                                        const config = {
                                            headers: {
                                                "Content-type":
                                                    "application/json",
                                            },
                                        };
                                        const body = {
                                            destinationId: this.props.candidat,
                                            notificationType:
                                                "acceptationDemande",
                                            originType: "Entreprise",
                                            originId: this.props.user._id,
                                        };
                                        try {
                                            await axios.put(
                                                `api/candidats/notifications`,
                                                body,
                                                config
                                            );
                                        } catch (err) {
                                            console.log(err);
                                        }
                                        localStorage.setItem("show", true);
                                        localStorage.setItem(
                                            "offreId",
                                            this.props.offreId
                                        );
                                        window.location.reload();
                                    }}
                                >
                                    <i className="fas fa-check"></i>
                                </span>
                            ) : null}
                            {this.props.state !== "Refusée" ? (
                                <span
                                    style={{ color: "red" }}
                                    onClick={async () => {
                                        await this.props.changeEtatDemande({
                                            id: this.props.demandeId,
                                            etat: "Refusée",
                                        });
                                        localStorage.setItem("show", true);
                                        localStorage.setItem(
                                            "offreId",
                                            this.props.offreId
                                        );
                                        window.location.reload();
                                    }}
                                >
                                    <i className="fas fa-times"></i>
                                </span>
                            ) : null}
                        </span>
                    </td>
                </tr>
            </>
        );
    }
}

const mapStatetoProps = (state) => ({
    offreDemandes: state.demandes.offreDemandes,
    offre: state.offres.offre,
    user: state.auth.user,
});

export default connect(mapStatetoProps, { getCandidat, changeEtatDemande })(
    OffreDemandesRow
);
