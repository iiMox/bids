import React from "react";
import ReactDOM from "react-dom";
import Alert from "../Alert";
import { connect } from "react-redux";
import { ajouterAvis } from "../../actions/avis";

import "./AvisForm.css";
import moment from "moment";

class AvisForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            avis: {
                commentaire: "",
                evaluation: "",
                etat: "en attent",
                datePosté: moment(new Date()).format("DD-MM-YYYY"),
            },
        };
    }

    onSubmitExperience(e) {
        e.preventDefault();
        const avis = {
            entreprise: this.props.entrepriseId,
            commentaire: this.state.avis.commentaire,
            evaluation: this.state.avis.evaluation,
            etat: this.state.avis.etat,
            datePosté: this.state.avis.datePosté,
        };
        const res = this.props.ajouterAvis(avis);
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
                    <h4>Ajouter un avis</h4>
                    <hr />
                    <Alert />
                    <form>
                        <label>Commentaire</label>
                        <textarea
                            type="text"
                            onChange={(e) =>
                                this.setState({
                                    avis: {
                                        ...this.state.avis,
                                        commentaire: e.target.value,
                                    },
                                })
                            }
                        ></textarea>
                        <label>Evaluation</label>
                        <input
                            type="text"
                            onKeyPress={(event) => {
                                if (!/[0-5]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                            onChange={(e) =>
                                this.setState({
                                    avis: {
                                        ...this.state.avis,
                                        evaluation: e.target.value,
                                    },
                                })
                            }
                        />

                        <button onClick={(e) => this.onSubmitExperience(e)}>
                            Ajouter
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default connect(null, { ajouterAvis })(AvisForm);
