import React from "react";
import ReactDOM from "react-dom";
import Alert from "../Alert";
import { connect } from "react-redux";
import { addFormation } from "../../actions/candidat";

import "./CorsusForm.css";

class CorsusForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            type: this.props.type,
            formation: {
                titre: "",
                etablissement: "",
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

    onSubmitForamtion(e) {
        e.preventDefault();
        const formation = {
            titre: this.state.formation.titre,
            etablissement: this.state.formation.etablissement,
            dateDebut: this.state.formation.dateDebut,
            dateFin: this.state.formation.dateFin,
            etat: this.state.formation.etat,
        };
        this.props.addFormation(formation);
        setTimeout(() => window.location.reload(), 2500);
    }

    render() {
        return (
            <div className="add-corsus" ref={this.props.reference}>
                <div className="add-corsus-container">
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
                    <h4>Ajouter une formation</h4>
                    <hr />
                    <Alert />
                    <form>
                        <label>Titre</label>
                        <input
                            type="text"
                            onChange={(e) =>
                                this.setState({
                                    formation: {
                                        ...this.state.formation,
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
                                    formation: {
                                        ...this.state.formation,
                                        etablissement: e.target.value,
                                    },
                                })
                            }
                        />
                        <label>Date début</label>
                        <select
                            onChange={(e) =>
                                this.setState({
                                    formation: {
                                        ...this.state.formation,
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
                                    formation: {
                                        ...this.state.formation,
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
                                        formation: {
                                            ...this.state.formation,
                                            etat: e.target.checked,
                                        },
                                    });
                                }}
                            />
                            <label className="check-label">Pas encore</label>
                        </div>
                        <button onClick={(e) => this.onSubmitForamtion(e)}>
                            Ajouter
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default connect(null, { addFormation })(CorsusForm);
