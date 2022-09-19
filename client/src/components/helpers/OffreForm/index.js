import React from "react";
import ReactDOM from "react-dom";
import Alert from "../Alert";
import { connect } from "react-redux";
import { ajouterOffre } from "../../actions/offre";
import categories from "../categories.json";
import { setAlert } from "../../actions/alert";

import "./OffreForm.css";
import moment from "moment";

class OffreForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            offre: {
                titre: "",
                description: "",
                dateCreation: "",
                categorie: "",
                etat: "",
                type: "DEFAULT",
                experience: "",
            },
        };

        this.expInputRef = React.createRef();
    }

    renderCategories() {
        const arrayCategorie = [];
        arrayCategorie.push(<option value="DEFAULT" key={0}></option>);
        categories.forEach((categorie) =>
            arrayCategorie.push(
                <option key={categorie.id} value={categorie.id}>
                    {categorie.cat}
                </option>
            )
        );
        return arrayCategorie;
    }

    onSubmitOffre(e) {
        e.preventDefault();
        if (this.state.offre.type !== "DEFAULT") {
            const offre = {
                titre: this.state.offre.titre,
                description: this.state.offre.description,
                dateCreation: moment(new Date()).format("DD-MM-YYYY HH:mm"),
                categorie: this.state.offre.categorie,
                type: this.state.offre.type,
                experience: this.state.offre.experience,
                etat: "en attent",
            };
            this.props.ajouterOffre(offre);
            setTimeout(() => window.location.reload(), 2500);
        } else {
            this.props.setAlert();
        }
    }

    render() {
        return (
            <div className="add-offre" ref={this.props.reference}>
                <div className="add-offre-container">
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
                    <h4>Ajouter une offre / stage</h4>
                    <hr />
                    <Alert />
                    <form>
                        <label>Titre</label>
                        <input
                            type="text"
                            onChange={(e) =>
                                this.setState({
                                    offre: {
                                        ...this.state.offre,
                                        titre: e.target.value,
                                    },
                                })
                            }
                        />
                        <label>Description</label>
                        <textarea
                            onChange={(e) =>
                                this.setState({
                                    offre: {
                                        ...this.state.offre,
                                        description: e.target.value,
                                    },
                                })
                            }
                        ></textarea>
                        <label>Catégorie</label>
                        <select
                            onChange={(e) =>
                                this.setState({
                                    offre: {
                                        ...this.state.offre,
                                        categorie: e.target.value,
                                    },
                                })
                            }
                        >
                            {this.renderCategories()}
                        </select>
                        <label>Type</label>
                        <select
                            onChange={(e) => {
                                if (e.target.value === "stage") {
                                    this.expInputRef.current.disabled = true;
                                } else {
                                    this.expInputRef.current.disabled = false;
                                }
                                this.setState({
                                    offre: {
                                        ...this.state.offre,
                                        type: e.target.value,
                                    },
                                });
                            }}
                        >
                            <option value="DEFAULT"></option>
                            <option value="emploi">Offre d'emploi</option>
                            <option value="stage">Offre de stage</option>
                        </select>
                        <label>Experience</label>
                        <input
                            ref={this.expInputRef}
                            type="text"
                            onKeyPress={(event) => {
                                if (!/[0-9]/.test(event.key)) {
                                    event.preventDefault();
                                }
                            }}
                            onChange={(e) =>
                                this.setState({
                                    offre: {
                                        ...this.state.offre,
                                        experience: e.target.value,
                                    },
                                })
                            }
                        />
                        <span>Ans</span>
                        <button onClick={(e) => this.onSubmitOffre(e)}>
                            Ajouter
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setAlert: () =>
            dispatch(setAlert("Type est obligatoire ", "danger", 1500)),
        ajouterOffre: (offre) => dispatch(ajouterOffre(offre)),
    };
};

export default connect(null, mapDispatchToProps)(OffreForm);
