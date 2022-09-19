import React from "react";
import { connect } from "react-redux";
import { getOffre } from "../../actions/offre";
import { loadEntreprise } from "../../actions/auth";
import { getDemande } from "../../actions/demande";

import "./DemandsRow.css";
import moment from "moment";

class DemandsRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = { offre: null, entreprise: null };

        this.deleteIcon = React.createRef();
    }

    async componentDidMount() {
        const res = await this.props.getOffre(this.props.offre);
        this.setState({ ...this.state, offre: res.data });
        const res1 = await this.props.loadEntreprise(
            this.state.offre.entreprise
        );
        this.setState({ ...this.state, entreprise: res1.data });
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
        return this.state.offre && this.state.entreprise ? (
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
                                `/candidat/offre/${this.state.offre._id}`
                            );
                        }}
                    >
                        {this.state.offre.titre}
                    </td>
                    <td
                        onClick={() => {
                            window.open(
                                `/candidat/entreprise/${this.state.entreprise._id}`
                            );
                        }}
                    >
                        {this.state.entreprise.nom}
                    </td>
                    <td>
                        {moment(
                            moment(
                                this.state.offre.dateCreation,
                                "DD-MM-YYYY"
                            ).toDate()
                        ).format("DD-MM-YYYY")}
                    </td>
                    <td>{this.props.d_submited}</td>
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
                                    onClick={() => {
                                        this.props.getDemande(
                                            this.props.demandeId
                                        );
                                        this.props.updateDemande.current.style.display =
                                            "flex";
                                    }}
                                >
                                    <i className="fas fa-edit"></i>
                                </span>
                            ) : null}

                            <span
                                onClick={() => {
                                    this.props.getDemande(this.props.demandeId);
                                    this.props.deleteRef.current.style.display =
                                        "flex";
                                }}
                            >
                                <i className="fas fa-trash"></i>
                            </span>
                        </span>
                    </td>
                </tr>
            </>
        ) : null;
    }
}

export default connect(null, { getOffre, loadEntreprise, getDemande })(
    DemandsRow
);
