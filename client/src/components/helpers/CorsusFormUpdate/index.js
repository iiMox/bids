import React from "react";
import ReactDOM from "react-dom";
import Alert from "../Alert";
import { connect } from "react-redux";
import { updateFormation } from "../../actions/candidat";

import "./CorsusFormUpdate.css";

class CorsusFormUpdate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            formation: {
                id: this.props.formation.id,
                titre: this.props.formation.titre,
                etablissement: this.props.formation.etablissement,
                dateDebut: this.props.formation.dateDebut,
                dateFin: this.props.formation.dateFin,
                etat: this.props.formation.etat,
            },
        };

        this.dateFinSelectRef = React.createRef();
    }

    componentDidMount() {
        ReactDOM.findDOMNode(this.props.reference.current).style.display =
            "flex";
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
            id: this.state.formation.id,
            titre: this.state.formation.titre,
            etablissement: this.state.formation.etablissement,
            dateDebut: this.state.formation.dateDebut,
            dateFin: this.state.formation.dateFin,
            etat: this.state.formation.etat,
        };
        this.props.updateFormation(formation);
        setTimeout(() => window.location.reload(), 2500);
    }

    render() {
        return (
            <div className="update-corsus" ref={this.props.reference}>
                <div className="update-corsus-container">
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
                    <h4>Modifier une formation</h4>
                    <hr />
                    <Alert />
                    <form>
                        <label>Titre</label>
                        <input
                            type="text"
                            defaultValue={this.state.formation.titre}
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
                            defaultValue={this.state.formation.etablissement}
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
                            value={this.state.formation.dateDebut}
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
                            value={this.state.formation.dateFin}
                            disabled={this.state.formation.etat ? true : false}
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
                                checked={this.state.formation.etat}
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
                            Modifier
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default connect(null, { updateFormation })(CorsusFormUpdate);
