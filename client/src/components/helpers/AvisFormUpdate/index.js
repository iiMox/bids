import React from "react";
import ReactDOM from "react-dom";
import Alert from "../Alert";
import { connect } from "react-redux";
import { modifierAvis, getAvisById } from "../../actions/avis";

import "../AvisForm/AvisForm.css";

class AvisFormUpdate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            avis: {
                id: "",
                commentaire: "",
                evaluation: "",
                etat: "en attent",
            },
        };
    }

    componentDidMount() {
        setInterval(() => {
            if (this.props.avis) {
                if (this.props.avis._id !== this.state.avis.id) {
                    this.setState({
                        avis: {
                            ...this.state.avis,
                            id: this.props.avis._id,
                            commentaire: this.props.avis.commentaire,
                            evaluation: this.props.avis.evaluation,
                        },
                    });
                }
            }
        }, 500);
    }

    onSubmitExperience(e) {
        e.preventDefault();

        const avis = {
            id: this.state.avis.id,
            commentaire: this.state.avis.commentaire,
            evaluation: this.state.avis.evaluation,
            etat: this.state.avis.etat,
        };
        const res = this.props.modifierAvis(avis);
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
                    <h4>Modifier un avis</h4>
                    <hr />
                    <Alert />
                    <form>
                        <label>Commentaire</label>
                        <textarea
                            type="text"
                            defaultValue={this.state.avis.commentaire}
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
                            maxLength="1"
                            defaultValue={this.state.avis.evaluation}
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
                            Modifier
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    avis: state.avis.avisToUpdate,
});

export default connect(mapStateToProps, { modifierAvis, getAvisById })(
    AvisFormUpdate
);
