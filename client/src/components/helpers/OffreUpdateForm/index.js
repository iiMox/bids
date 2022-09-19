import React from "react";
import ReactDOM from "react-dom";
import Alert from "../Alert";
import { connect } from "react-redux";
import { modifierOffre, getOffre } from "../../actions/offre";
import categories from "../categories.json";
import { setAlert } from "../../actions/alert";

class OffreForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            offre: {
                id: "",
                titre: "",
                description: "",
                dateCreation: "",
                categorie: "",
                etat: "",
                type: props.type,
                experience: "",
            },
        };

        this.selectCategorieRef = React.createRef();
        this.selectTypeRef = React.createRef();
        this.expInputRef = React.createRef();
    }

    componentDidMount() {
        setInterval(() => {
            if (this.props.offre) {
                if (this.props.offre._id !== this.state.offre.id) {
                    this.setState({
                        offre: {
                            id: this.props.offre._id,
                            titre: this.props.offre.titre,
                            description: this.props.offre.description,
                            dateCreation: this.props.offre.dateCreation,
                            categorie: this.props.offre.categorie,
                            etat: this.props.offre.etat,
                            type: this.props.offre.type,
                            experience: this.props.offre.experience,
                        },
                    });
                    this.selectCategorieRef.current.value =
                        this.state.offre.categorie;
                    this.selectTypeRef.current.value = this.state.offre.type;
                }
            }
        }, 500);
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
        if (this.props.type !== "DEFAULT") {
            const offre = {
                id: this.state.offre.id,
                titre: this.state.offre.titre,
                description: this.state.offre.description,
                dateCreation: this.state.offre.dateCreation,
                categorie: this.state.offre.categorie,
                type: this.state.offre.type,
                experience: this.state.offre.experience,
                etat: "en attent",
            };
            this.props.modifierOffre(offre);
            setTimeout(() => window.location.reload(), 2500);
        } else {
            this.props.setAlert();
        }
    }

    render() {
        return this.state.offre ? (
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
                    <h4>Modifier une offre / stage</h4>
                    <hr />
                    <Alert />
                    <form>
                        <label>Titre</label>
                        <input
                            type="text"
                            defaultValue={this.state.offre.titre}
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
                            defaultValue={this.state.offre.description}
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
                            ref={this.selectCategorieRef}
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
                            ref={this.selectTypeRef}
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
                            defaultValue={this.state.offre.experience}
                            disabled={
                                this.state.offre.type === "stage" ? true : false
                            }
                            type="text"
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
                            Modifier
                        </button>
                    </form>
                </div>
            </div>
        ) : null;
    }
}

const mapStateToProps = (state) => ({
    offre: state.offres.offre,
});

const mapDispatchToProps = (dispatch) => {
    return {
        setAlert: () =>
            dispatch(setAlert("Type est obligatoire ", "danger", 1500)),
        modifierOffre: (offre) => dispatch(modifierOffre(offre)),
        getOffre: (id) => dispatch(getOffre(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OffreForm);
