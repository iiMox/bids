import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { getOffreDemandes } from "../../actions/demande";
import { getOffre, supprimerOffre } from "../../actions/offre";

import "./OfferStageRow.css";

class OfferStageRow extends React.Component {
    constructor(props) {
        super(props);

        this.deleteIcon = React.createRef();
    }

    iconChoice() {
        if (this.props.state === "en attent") {
            return (
                <i
                    style={{ color: "#8e8e8e" }}
                    className="fas fa-ellipsis-h"
                ></i>
            );
        } else if (this.props.state === "Actif") {
            return (
                <i style={{ color: "#32cd32" }} className="fas fa-check"></i>
            );
        } else {
            return <i style={{ color: "red" }} className="fas fa-times"></i>;
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
                    <td>{this.props.title}</td>
                    <td>{this.props.d_posted}</td>
                    <td>{this.props.type}</td>
                    <td
                        className={
                            this.props.state === "Actif" ? "green" : "red"
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
                                onClick={async () => {
                                    await this.props.getOffre(
                                        this.props.offreId
                                    );
                                    await this.props.getOffreDemandes(
                                        this.props.offreId
                                    );
                                    ReactDOM.findDOMNode(
                                        this.props.referenceDemandes.current
                                    ).style.display = "flex";
                                }}
                            >
                                <i className="fas fa-eye"></i>
                            </span>
                            <span
                                onClick={async () => {
                                    await this.props.getOffre(
                                        this.props.offreId
                                    );
                                    ReactDOM.findDOMNode(
                                        this.props.reference.current
                                    ).style.display = "flex";
                                }}
                            >
                                <i className="fas fa-edit"></i>
                            </span>
                            <span
                                onClick={async () => {
                                    await this.props.getOffre(
                                        this.props.offreId
                                    );
                                    ReactDOM.findDOMNode(
                                        this.props.referenceDelete.current
                                    ).style.display = "flex";
                                }}
                            >
                                <i className="fas fa-trash"></i>
                            </span>
                        </span>
                    </td>
                </tr>
            </>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getOffre: (offreId) => dispatch(getOffre(offreId)),
        supprimerOffre: (offreId) => dispatch(supprimerOffre(offreId)),
        getOffreDemandes: (offreId) => dispatch(getOffreDemandes(offreId)),
    };
};

export default connect(null, mapDispatchToProps)(OfferStageRow);
