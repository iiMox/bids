import React from "react";
import ReactDOM from "react-dom";
import { loadEntreprise } from "../../actions/auth";
import { connect } from "react-redux";
import { store } from "../../store";
import { getAvisById } from "../../actions/avis";

import "../DemandsRow/DemandsRow.css";

class AvisRow extends React.Component {
    constructor(props) {
        super(props);

        this.state = { entrepriseName: "" };

        this.deleteIcon = React.createRef();
    }

    async componentDidMount() {
        const entreprise = await this.props.loadEntreprise(
            this.props.entrepriseId
        );
        this.setState({ entrepriseName: entreprise.data.nom });
    }

    iconChoice() {
        if (this.props.state === "Actif") {
            return <i className="fas fa-check"></i>;
        } else if (this.props.state === "Fermé") {
            return <i className="fas fa-times"></i>;
        } else {
            return <i className="fas fa-ellipsis-h"></i>;
        }
    }

    render() {
        return this.state.entrepriseName ? (
            <>
                <tr
                    onMouseEnter={() => {
                        this.deleteIcon.current.style.display = "flex";
                    }}
                    onMouseLeave={() => {
                        this.deleteIcon.current.style.display = "none";
                    }}
                >
                    <td>{this.state.entrepriseName}</td>
                    <td>{this.props.commentaire}</td>
                    <td>{this.props.datePosté}</td>
                    <td>{this.props.evaluation}</td>
                    <td
                        className={
                            this.props.state === "Actif"
                                ? "green"
                                : this.props.state === "Fermé"
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
                            <span
                                onClick={() => {
                                    ReactDOM.findDOMNode(
                                        this.props.reference.current
                                    ).style.display = "flex";
                                    this.props.getAvisById(this.props.avisId);
                                }}
                            >
                                <i className="fas fa-edit"></i>
                            </span>
                            <span
                                onClick={() => {
                                    this.props.deleteRef.current.style.display =
                                        "flex";
                                    store.dispatch({
                                        type: "AVIS_TO_DELETE",
                                        payload: this.props.avisId,
                                    });
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

export default connect(null, { loadEntreprise, getAvisById })(AvisRow);
