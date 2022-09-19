import React from "react";
import { connect } from "react-redux";
import DashboardNav from "../../helpers/DashboardNav";
import { getOffre } from "../../actions/offre";
import { loadEntreprise } from "../../actions/auth";
import wilayas from "../../helpers/wilayas.json";
import categories from "../../helpers/categories.json";
import ReviewBox from "../../helpers/ReviewBox";
import { getAvisEntreprise } from "../../actions/avis";
import DemandeForm from "../../helpers/DemandeForm";

import "./VoirOffreCandidat.css";

class VoirOffreCandidat extends React.Component {
    constructor(props) {
        super(props);

        this.state = { entreprise: null };
        this.addDemande = React.createRef();
    }

    async componentDidMount() {
        await this.props.getOffre(this.props.match.params.offre_id);
        const res = await this.props.loadEntreprise(
            this.props.offre.entreprise
        );
        this.setState({
            entreprise: res.data,
        });
        await this.props.getAvisEntreprise(this.state.entreprise._id);
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

    renderAvis() {
        const avisArray = [];
        let i = 0;
        this.props.avis.forEach((avis) => {
            if (i < 3) {
                avisArray.push(
                    <ReviewBox
                        key={avis._id}
                        candidat={avis.candidat}
                        stars={avis.evaluation}
                        commentaire={avis.commentaire}
                    />
                );
            }
            i++;
        });
        return avisArray.length !== 0
            ? avisArray
            : "Pas d'avis sur cette entreprise";
    }

    render() {
        return this.props.offre && this.state.entreprise ? (
            <>
                <DashboardNav />
                <div className="container">
                    <div className="offre-box">
                        <DemandeForm
                            reference={this.addDemande}
                            candidatId={this.props.candidat._id}
                            offreId={this.props.match.params.offre_id}
                        />
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
                                        {this.state.entreprise.liens !==
                                        undefined
                                            ? this.state.entreprise.liens
                                                  .contactEmail
                                            : ""}
                                    </li>
                                    <li>
                                        <i className="fas fa-globe"></i>
                                        <a
                                            href={
                                                this.state.entreprise.liens !==
                                                undefined
                                                    ? this.state.entreprise
                                                          .liens.website
                                                    : ""
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            {this.state.entreprise.liens !==
                                            undefined
                                                ? this.state.entreprise.liens
                                                      .website
                                                : ""}
                                        </a>
                                    </li>
                                </ul>
                                <div className="avis-section">
                                    {this.renderAvis()}
                                </div>
                            </div>
                            <div className="offre-info col-md-9">
                                <h2 className="offre-titre">
                                    {this.props.offre.titre}
                                    <button
                                        onClick={() =>
                                            (this.addDemande.current.style.display =
                                                "flex")
                                        }
                                    >
                                        <i className="fas fa-paper-plane"></i>
                                        Envoyer une demande
                                    </button>
                                </h2>
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
            </>
        ) : null;
    }
}

const mapStateToOffre = (state) => ({
    offre: state.offres.offre,
    avis: state.avis.avisEntreprise,
    candidat: state.auth.user,
});

export default connect(mapStateToOffre, {
    getOffre,
    loadEntreprise,
    getAvisEntreprise,
})(VoirOffreCandidat);
