import React from "react";
import { loadEntreprise } from "../../actions/auth";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import "./OffreBox.css";
import LocationImg from "../../../images/pin.png";
import DateImg from "../../../images/calendar.png";
import ExpImg from "../../../images/level.png";
import wilayas from "../../helpers/wilayas.json";
import history from "../../../history";

class OffreBox extends React.Component {
    state = { entreprise: null };
    async componentDidMount() {
        const data = await this.props.loadEntreprise(
            this.props.offre.entreprise
        );

        this.setState({
            entreprise: data.data,
        });
    }

    renderWilaya() {
        let w = "";
        wilayas.forEach((wilaya) => {
            if (wilaya.code === this.state.entreprise.wilaya) {
                w = wilaya.wilaya;
            }
        });
        return w;
    }

    renderLevel() {
        if (this.props.offre.experience < 3) {
            return "Débutant";
        } else if (this.props.offre.experience <= 5) {
            return "Moyen";
        } else return "Expert";
    }

    render() {
        return this.state.entreprise ? (
            <div className="offre">
                <div className="row">
                    <div className="employeur col-md-2">
                        <img
                            src={this.state.entreprise.avatar}
                            alt="Employeur"
                        />
                        <span>
                            {this.props.commander === "candidat" ? (
                                <Link
                                    to={`/candidat/entreprise/${this.state.entreprise._id}`}
                                />
                            ) : (
                                this.state.entreprise.nom
                            )}
                        </span>
                    </div>
                    <div className="details col-md-10">
                        <h3>{this.props.offre.titre}</h3>
                        <hr />
                        <p>{this.props.offre.description}</p>
                        <div className="bottom">
                            <div className="infos">
                                <span>
                                    <img src={LocationImg} alt="location" />
                                    {this.renderWilaya()}
                                </span>
                                <span>
                                    <img src={DateImg} alt="date" />
                                    {this.props.offre.dateCreation}
                                </span>
                                <span>
                                    <img src={ExpImg} alt="level" />
                                    {this.props.offre.type === "emploi"
                                        ? this.renderLevel()
                                        : "Stage"}
                                </span>
                            </div>
                            <button
                                onClick={() => {
                                    if (this.props.commander === "candidat") {
                                        history.push(
                                            `/candidat/offre/${this.props.offre._id}`
                                        );
                                    } else if (
                                        this.props.commander === "entreprise"
                                    ) {
                                        history.push(
                                            `/entreprise/offre/${this.props.offre._id}`
                                        );
                                    } else {
                                        history.push(
                                            `/offres/${this.props.offre._id}`
                                        );
                                    }
                                }}
                            >
                                Voir plus...
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ) : null;
    }
}

export default connect(null, { loadEntreprise })(OffreBox);
