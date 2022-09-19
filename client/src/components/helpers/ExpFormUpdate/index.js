import React from "react";
import ReactDOM from "react-dom";
import Alert from "../Alert";
import { connect } from "react-redux";
import { updateExperience } from "../../actions/candidat";

class ExpFormUpdate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            experience: {
                id: this.props.experience.id,
                titre: this.props.experience.titre,
                etablissement: this.props.experience.etablissement,
                description: this.props.experience.description,
                dateDebut: this.props.experience.dateDebut,
                dateFin: this.props.experience.dateFin,
                etat: this.props.experience.etat,
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

    onSubmitExperience(e) {
        e.preventDefault();
        const experience = {
            id: this.state.experience.id,
            titre: this.state.experience.titre,
            etablissement: this.state.experience.etablissement,
            description: this.state.experience.description,
            dateDebut: this.state.experience.dateDebut,
            dateFin: this.state.experience.dateFin,
            etat: this.state.experience.etat,
        };
        this.props.updateExperience(experience);
        setTimeout(() => window.location.reload(), 2500);
    }

    render() {
        return (
            <div className="update-exp" ref={this.props.reference}>
                <div className="update-exp-container">
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
                    <h4>Modifier une experience</h4>
                    <hr />
                    <Alert />
                    <form>
                        <label>Titre</label>
                        <input
                            type="text"
                            defaultValue={this.state.experience.titre}
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
                            defaultValue={this.state.experience.etablissement}
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
                        <label>Date début</label>
                        <select
                            value={this.state.experience.dateDebut}
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
                            value={this.state.experience.dateFin}
                            disabled={this.state.experience.etat ? true : false}
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
                                checked={this.state.experience.etat}
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
                            Modifier
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default connect(null, { updateExperience })(ExpFormUpdate);
