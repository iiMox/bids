import React from "react";
import ReactDOM from "react-dom";
import Alert from "../Alert";
import { connect } from "react-redux";
import { modifierDemande } from "../../actions/demande";

class ExpFormUpdate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            demande: {
                id: "",
                lettreMotivation: "",
                etat: "en attnet",
            },
        };
    }

    componentDidMount() {
        setInterval(() => {
            if (this.props.demande) {
                if (this.state.demande.id !== this.props.demande._id) {
                    this.setState({
                        demande: {
                            ...this.state.demande,
                            id: this.props.demande._id,
                            lettreMotivation:
                                this.props.demande.lettreMotivation,
                        },
                    });
                }
            }
        }, 500);
    }

    onSubmitExperience(e) {
        e.preventDefault();
        const demande = {
            id: this.state.demande.id,
            lettreMotivation: this.state.demande.lettreMotivation,
            etat: this.state.demande.etat,
        };
        this.props.modifierDemande(demande);
        setTimeout(() => window.location.reload(), 2500);
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
                        Modifier une demande d'emploi
                    </h4>
                    <hr />
                    <Alert />
                    <form>
                        <label>Lettre de motivation</label>
                        <textarea
                            type="text"
                            defaultValue={this.state.demande.lettreMotivation}
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
                            Modifier
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    demande: state.demandes.demande,
});

export default connect(mapStateToProps, { modifierDemande })(ExpFormUpdate);
