import React from "react";
import { connect } from "react-redux";
import { getOffre } from "../../actions/offre";
import { loadEntreprise } from "../../actions/auth";
import wilayas from "../../helpers/wilayas.json";
import categories from "../../helpers/categories.json";
import ReviewBox from "../../helpers/ReviewBox";
import Navbar from "../../helpers/Navbar";

import "../VoirOffreCandidat/VoirOffreCandidat.css";
import "./VoirOffreGuest.css";

class VoirOffreGuest extends React.Component {
    state = { entreprise: null };

    async componentDidMount() {
        await this.props.getOffre(this.props.match.params.offre_id);
        const res = await this.props.loadEntreprise(
            this.props.offre.entreprise
        );
        this.setState({
            entreprise: res.data,
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

    renderCategorie() {
        let c = "";
        categories.forEach((categorie) => {
            if (categorie.id === this.state.entreprise.categorie) {
                c = categorie.cat;
            }
        });
        return c;
    }

    render() {
        return this.props.offre && this.state.entreprise ? (
            <div className="voir-offre">
                <Navbar />
                <div className="container">
                    <div className="offre-box">
                        <div className="row">
                            <div className="side-info col-md-3 text-center">
                                <img
                                    src={this.state.entreprise.avatar}
                                    alt="Avatar"
                                    style={{ width: "128px" }}
                                />
                                <h4>{this.state.entreprise.nom}</h4>
                                <hr />
                                <p>{this.state.entreprise.bio}</p>
                                <ul className="list-unstyled">
                                    <li>
                                        <i className="fas fa-server"></i>
                                        {this.renderCategorie()}
                                    </li>
                                    <li>
                                        <i className="fas fa-map-marker-alt"></i>
                                        {`${
                                            this.state.entreprise.adresse
                                        }, ${this.renderWilaya()}`}
                                    </li>
                                    <li>
                                        <i className="fas fa-envelope"></i>
                                        {
                                            this.state.entreprise.liens
                                                .contactEmail
                                        }
                                    </li>
                                    <li>
                                        <i className="fas fa-globe"></i>
                                        <a
                                            href={
                                                this.state.entreprise.liens
                                                    .website
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {
                                                this.state.entreprise.liens
                                                    .website
                                            }
                                        </a>
                                    </li>
                                </ul>
                                <div className="avis-section">
                                    <ReviewBox stars={2} />
                                    <ReviewBox stars={4} />
                                </div>
                            </div>
                            <div className="offre-info col-md-9">
                                <h2>{this.props.offre.titre}</h2>
                                <hr />
                                <ul className="list-unstyled">
                                    <li>
                                        Posté le :{" "}
                                        {this.props.offre.dateCreation}
                                    </li>
                                    <li>
                                        Type : {""} {this.props.offre.type}
                                    </li>
                                </ul>
                                <p className="description">
                                    {this.props.offre.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null;
    }
}

const mapStateToOffre = (state) => ({
    offre: state.offres.offre,
});

export default connect(mapStateToOffre, { getOffre, loadEntreprise })(
    VoirOffreGuest
);
