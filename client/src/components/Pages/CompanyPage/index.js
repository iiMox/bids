import React from "react";
import DashboardNavEntreprise from "../../helpers/DashboardNavEntreprise";
import OfferBox from "../../helpers/OffreBox";
import ReviewBox from "../../helpers/ReviewBox";
import { connect } from "react-redux";
import categories from "../../helpers/categories.json";
import wilayas from "../../helpers/wilayas.json";

import "./CompanyPage.css";
import imgAvatar from "../../../images/google-logo.png";
import { getAvisEntreprise } from "../../actions/avis";
import { loadUser } from "../../actions/auth";

class CompanyPage extends React.Component {
    async componentDidMount() {
        await this.props.loadUser();
        await this.props.getAvisEntreprise(this.props.entreprise._id);
        if (this.props.location.state !== undefined) {
            document
                .getElementById(this.props.location.state.toScroll)
                .scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }

    renderCategorie() {
        let c = "";
        categories.forEach((categorie) => {
            if (categorie.id === this.props.entreprise.categorie) {
                c = categorie.cat;
            }
        });
        return c;
    }

    renderWilaya() {
        let w = "";
        wilayas.forEach((wilaya) => {
            if (wilaya.code === this.props.entreprise.wilaya) {
                w = wilaya.wilaya;
            }
        });
        return w;
    }

    renderMyOffres() {
        const myOffresArray = [];
        this.props.myOffres.forEach((offre) => {
            if (offre.etat === "Actif") {
                myOffresArray.push(<OfferBox key={offre._id} offre={offre} />);
            }
        });
        return myOffresArray;
    }

    renderAvis() {
        const avisArray = [];
        this.props.mesAvis.forEach((avis) => {
            if (avis.etat === "Accepté") {
                avisArray.push(
                    <ReviewBox
                        key={avis._id}
                        candidat={avis.candidat}
                        stars={avis.evaluation}
                        commentaire={avis.commentaire}
                    />
                );
            }
        });
        return avisArray.length !== 0
            ? avisArray
            : "Il n'y a pas pour le moment";
    }

    render() {
        return (
            <div className="company-page">
                <DashboardNavEntreprise />
                <div className="page-content">
                    <div className="container">
                        <div className="company-infos">
                            <div className="poster">
                                <div className="avatar-img">
                                    <img
                                        src={
                                            this.props.entreprise === null
                                                ? imgAvatar
                                                : this.props.entreprise.avatar
                                        }
                                        alt="avatar"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="left-box col-md-8">
                                    <h2>
                                        {this.props.entreprise === null
                                            ? ""
                                            : this.props.entreprise.nom}
                                        <div className="category">
                                            <i className="fas fa-server"></i>
                                            {this.props.entreprise
                                                ? this.renderCategorie()
                                                : ""}
                                        </div>
                                    </h2>

                                    <p>
                                        {this.props.entreprise === null
                                            ? ""
                                            : this.props.entreprise.bio}
                                    </p>
                                </div>
                                <div className="contact-info col-md-4">
                                    <ul className="list-unstyled">
                                        <li>
                                            <i className="fas fa-map-marker-alt"></i>
                                            {this.props.entreprise === null
                                                ? ""
                                                : this.props.entreprise
                                                      .adresse === undefined ||
                                                  this.props.entreprise
                                                      .wilaya === undefined
                                                ? ""
                                                : `${
                                                      this.props.entreprise
                                                          .adresse
                                                  }, ${
                                                      this.props.entreprise
                                                          ? this.renderWilaya()
                                                          : ""
                                                  }`}
                                        </li>
                                        <li>
                                            <i className="fas fa-phone-alt"></i>
                                            {this.props.entreprise === null
                                                ? ""
                                                : this.props.entreprise.tel}
                                        </li>
                                        <li>
                                            <i className="fas fa-envelope"></i>
                                            {this.props.entreprise === null
                                                ? ""
                                                : this.props.entreprise
                                                      .liens === undefined
                                                ? ""
                                                : this.props.entreprise.liens
                                                      .contactEmail}
                                        </li>
                                        <li className="website-item">
                                            <i className="fas fa-globe"></i>
                                            <a
                                                href="https://www.google.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {this.props.entreprise === null
                                                    ? ""
                                                    : this.props.entreprise
                                                          .liens === undefined
                                                    ? ""
                                                    : this.props.entreprise
                                                          .liens.website}
                                            </a>
                                        </li>
                                    </ul>
                                    <div className="socials">
                                        <ul className="list-unstyled">
                                            <li>
                                                <a
                                                    href={
                                                        this.props
                                                            .entreprise === null
                                                            ? ""
                                                            : this.props
                                                                  .entreprise
                                                                  .liens ===
                                                              undefined
                                                            ? ""
                                                            : this.props
                                                                  .entreprise
                                                                  .liens
                                                                  .facebook
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <i className="fab fa-facebook-square"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href={
                                                        this.props
                                                            .entreprise === null
                                                            ? ""
                                                            : this.props
                                                                  .entreprise
                                                                  .liens ===
                                                              undefined
                                                            ? ""
                                                            : this.props
                                                                  .entreprise
                                                                  .liens.twitter
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <i className="fab fa-twitter-square"></i>
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href={
                                                        this.props
                                                            .entreprise === null
                                                            ? ""
                                                            : this.props
                                                                  .entreprise
                                                                  .liens ===
                                                              undefined
                                                            ? ""
                                                            : this.props
                                                                  .entreprise
                                                                  .liens
                                                                  .linkedin
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <i className="fab fa-linkedin"></i>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="company-desc">
                            <h4 style={{ display: "block" }}>
                                <i className="fas fa-info-circle"></i>
                                Description
                            </h4>
                            <p>
                                {this.props.entreprise === null
                                    ? ""
                                    : this.props.entreprise.description}
                            </p>
                        </div>
                        <div className="company-offers">
                            <h4 style={{ display: "block" }}>
                                <i className="fas fa-align-left"></i>
                                Les offres
                            </h4>
                            <div className="offers-container">
                                {/* <OfferBox />
                                <OfferBox />
                                <OfferBox /> */}
                                {this.renderMyOffres()}
                            </div>
                        </div>
                        <div className="company-reviews" id="avis">
                            <h4 style={{ display: "block" }}>
                                <i className="fas fa-search"></i>
                                Les avis
                            </h4>
                            <div className="reviews-container">
                                {this.renderAvis()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    entreprise: state.auth.user,
    myOffres: state.offres.entrepriseOffres,
    mesAvis: state.avis.avisEntreprise,
});

export default connect(mapStateToProps, { getAvisEntreprise, loadUser })(
    CompanyPage
);
