import React from "react";
import ReactDOM from "react-dom";
import Alert from "../Alert";
import { connect } from "react-redux";
import { addExperience } from "../../actions/candidat";

class ExpForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            experience: {
                titre: "",
                etablissement: "",
                description: "",
                dateDebut: "",
                dateFin: "",
                etat: false,
            },
        };

        this.dateFinSelectRef = React.createRef();
    }

    renderYears() {
        const arrayYears = [];
        let year = 2010;
        arrayYears.push(<option key="0" value="DEFAULT"></option>);
        while (year < 2050) {
            arrayYears.push(
                <option key={year} value={year}>
                    {year}
                </option>
            );
            year++;
        }
        return arrayYears;
    }

    onSubmitExperience(e) {
        e.preventDefault();
        const experience = {
            titre: this.state.experience.titre,
            etablissement: this.state.experience.etablissement,
            description: this.state.experience.description,
            dateDebut: this.state.experience.dateDebut,
            dateFin: this.state.experience.dateFin,
            etat: this.state.experience.etat,
        };
        this.props.addExperience(experience);
        setTimeout(() => window.location.reload(), 2500);
    }

    render() {
        return (
            <div className="add-exp" ref={this.props.reference}>
                <div className="add-exp-container">
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
                    <h4>Ajouter une experience</h4>
                    <hr />
                    <Alert />
                    <form>
                        <label>Titre</label>
                        <input
                            type="text"
                            onChange={(e) =>
                                this.setState({
                                    experience: {
                                        ...this.state.experience,
                                        titre: e.target.value,
                                    },
                                })
                            }
                        />
                        <label>Etablissement</label>
                        <input
                            type="text"
                            onChange={(e) =>
                                this.setState({
                                    experience: {
                                        ...this.state.experience,
                                        etablissement: e.target.value,
                                    },
                                })
                            }
                        />
                        <label>Déscritpion</label>
                        <textarea
                            onChange={(e) =>
                                this.setState({
                                    experience: {
                                        ...this.state.experience,
                                        description: e.target.value,
                                    },
                                })
                            }
                        ></textarea>
                        <label>Date début</label>
                        <select
                            onChange={(e) =>
                                this.setState({
                                    experience: {
                                        ...this.state.experience,
                                        dateDebut: e.target.value,
                                    },
                                })
                            }
                        >
                            {this.renderYears()}
                        </select>
                        <label>Date fin</label>
                        <select
                            className="end"
                            ref={this.dateFinSelectRef}
                            onChange={(e) =>
                                this.setState({
                                    experience: {
                                        ...this.state.experience,
                                        dateFin: e.target.value,
                                    },
                                })
                            }
                        >
                            {this.renderYears()}
                        </select>
                        <div className="check-box">
                            <input
                                type="checkbox"
                                className="checkbox"
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        this.dateFinSelectRef.current.disabled = true;
                                    } else {
                                        this.dateFinSelectRef.current.disabled = false;
                                    }
                                    this.setState({
                                        experience: {
                                            ...this.state.experience,
                                            etat: e.target.checked,
                                        },
                                    });
                                }}
                            />
                            <label className="check-label">Pas encore</label>
                        </div>
                        <button onClick={(e) => this.onSubmitExperience(e)}>
                            Ajouter
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default connect(null, { addExperience })(ExpForm);
