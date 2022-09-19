import React from "react";
import { loadEntreprise } from "../../actions/auth";
import { Link } from "react-router-dom";

import "./OffreBoxVertical.css";
import wilayas from "../../helpers/wilayas.json";
import { connect } from "react-redux";
import history from "../../../history";

class OffreBoxVertical extends React.Component {
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
            <div className="offre-vertical">
                <div className="employeur">
                    <img src={this.state.entreprise.avatar} alt="Employeur" />
                    <span>
                        <Link
                            to={`/candidat/entreprise/${this.state.entreprise._id}`}
                        >
                            {this.state.entreprise.nom}
                        </Link>
                    </span>
                </div>
                <div className="details">
                    <h3>{this.props.offre.titre}</h3>
                    <hr />
                    <p>{this.props.offre.description}</p>
                    <div className="bottom">
                        <div className="infos">
                            <span>
                                <i className="fas fa-map-marker-alt"></i>
                                {this.renderWilaya()}
                            </span>
                            <span>
                                <i className="far fa-calendar-alt"></i>
                                {this.props.offre.dateCreation}
                            </span>
                            <span>
                                <i className="fas fa-signal"></i>
                                {this.renderLevel()}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            history.push(
                                `/candidat/offre/${this.props.offre._id}`
                            );
                        }}
                    >
                        Voir plus...
                    </button>
                </div>
            </div>
        ) : null;
    }
}

export default connect(null, { loadEntreprise })(OffreBoxVertical);
