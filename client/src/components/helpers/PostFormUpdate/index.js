import React from "react";
import { connect } from "react-redux";
import { modifierPoste } from "../../actions/postes";
import ReactDOM from "react-dom";
import Alert from "../Alert";

import "../CorsusFormUpdate/CorsusFormUpdate.css";

class PostFormUpdate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            poste: {
                id: "",
                titre: "",
                contenu: "",
            },
        };
    }

    componentDidMount() {
        setInterval(() => {
            if (this.props.poste) {
                if (this.props.poste._id !== this.state.poste.id) {
                    this.setState({
                        poste: {
                            id: this.props.poste._id,
                            titre: this.props.poste.titre,
                            contenu: this.props.poste.contenu,
                        },
                    });
                }
            }
        }, 500);
    }

    onSubmitExperience(e) {
        e.preventDefault();

        const poste = {
            id: this.state.poste.id,
            titre: this.state.poste.titre,
            contenu: this.state.poste.contenu,
        };

        const res = this.props.modifierPoste(poste);
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
                    <h4>Modifier un poste</h4>
                    <hr />
                    <Alert />
                    <form>
                        <label>Titre</label>
                        <input
                            type="text"
                            defaultValue={this.state.poste.titre}
                            onChange={(e) =>
                                this.setState({
                                    poste: {
                                        ...this.state.poste,
                                        titre: e.target.value,
                                    },
                                })
                            }
                        ></input>
                        <label>Contenu</label>
                        <textarea
                            defaultValue={this.state.poste.contenu}
                            onChange={(e) =>
                                this.setState({
                                    poste: {
                                        ...this.state.poste,
                                        contenu: e.target.value,
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
    poste: state.postes.poste,
});

export default connect(mapStateToProps, { modifierPoste })(PostFormUpdate);
