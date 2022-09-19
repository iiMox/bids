import React from "react";
import DashboardNav from "../../helpers/DashboardNav";
import CorsusBox from "../../helpers/CorsusBox";
import WorkBox from "../../helpers/WorkBox";
import { connect } from "react-redux";
import wilayas from "../../helpers/wilayas.json";

import "./ProfilPage.css";
import profilImg from "../../../images/avatar.png";

class ProfilPage extends React.Component {
    constructor(props) {
        super(props);

        this.PersoRef = React.createRef();
        this.ProfesRef = React.createRef();
    }

    componentDidMount() {
        this.ProfesRef.current.classList.add("animate__backInRight");
        this.PersoRef.current.classList.add("animate__backInUp");
    }

    componentWillUnmount() {
        this.ProfesRef.current.classList.remove("animate__backInRight");
        this.PersoRef.current.classList.remove("animate__backInUp");
    }

    renderedLangueList() {
        const arrayOut = [];
        let i = 0;
        this.props.candidat.langue.forEach((elt) => {
            arrayOut.push(<li key={i}>{elt.langue}</li>);
            i++;
        });
        return arrayOut;
    }

    renderedCompetanceList() {
        const arrayOut = [];
        let i = 0;
        this.props.candidat.competance.forEach((elt) => {
            arrayOut.push(<li key={i}>{elt.competance}</li>);
            i++;
        });
        return arrayOut;
    }

    renderCorsusBox() {
        const arrayOut = [];
        let i = 0;
        this.props.candidat.formation.forEach((elt) => {
            arrayOut.push(
                <CorsusBox
                    key={i}
                    title={elt.titre}
                    college={elt.etablissement}
                    start={elt.dateDebut}
                    end={elt.etat === true ? "Jusqu'a maintenat" : elt.dateFin}
                />
            );
            i++;
        });
        return arrayOut;
    }

    renderExpBox() {
        const arrayOut = [];
        let i = 0;
        this.props.candidat.experience.forEach((elt) => {
            arrayOut.push(
                <WorkBox
                    key={i}
                    title={elt.titre}
                    workplace={elt.etablissement}
                    start={elt.dateDebut}
                    end={elt.etat === true ? "Jusqu'a maintenat" : elt.dateFin}
                    review={elt.description}
                />
            );
            i++;
        });
        return arrayOut;
    }

    renderWilaya() {
        let w = "";
        wilayas.forEach((wilaya) => {
            if (wilaya.code === this.props.candidat.wilaya) {
                w = wilaya.wilaya;
            }
        });

        return w;
    }

    render() {
        return (
            <div className="profil">
                <DashboardNav />
                <div className="content">
                    <div className="container">
                        <h2>Profil personnel</h2>
                        <div className="row big-box">
                            <div
                                ref={this.PersoRef}
                                className="personel-info col-md-4 slower animate__animated"
                            >
                                <img
                                    src={
                                        this.props.candidat === null
                                            ? profilImg
                                            : this.props.candidat.avatar
                                    }
                                    alt="Avatar"
                                />
                                <h4>
                                    {this.props.candidat === null
                                        ? "Candidat"
                                        : `${this.props.candidat.nom} ${this.props.candidat.prenom}`}
                                </h4>
                                <p>
                                    {this.props.candidat === null
                                        ? ""
                                        : this.props.candidat.bio}
                                </p>
                                <div className="social">
                                    <ul className="list-unstyled">
                                        <li>
                                            <a
                                                href={
                                                    this.props.candidat === null
                                                        ? ""
                                                        : this.props.candidat
                                                              .liens !==
                                                          undefined
                                                        ? this.props.candidat
                                                              .liens.facebook
                                                        : ""
                                                }
                                                target="_blanck"
                                            >
                                                <i className="fab fa-facebook-square"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href={
                                                    this.props.candidat === null
                                                        ? ""
                                                        : this.props.candidat
                                                              .liens !==
                                                          undefined
                                                        ? this.props.candidat
                                                              .liens.twitter
                                                        : ""
                                                }
                                                target="_blanck"
                                            >
                                                <i className="fab fa-twitter-square"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href={
                                                    this.props.candidat === null
                                                        ? ""
                                                        : this.props.candidat
                                                              .liens !==
                                                          undefined
                                                        ? this.props.candidat
                                                              .liens.linkedin
                                                        : ""
                                                }
                                                target="_blanck"
                                            >
                                                <i className="fab fa-linkedin"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a
                                                href={
                                                    this.props.candidat === null
                                                        ? ""
                                                        : this.props.candidat
                                                              .liens !==
                                                          undefined
                                                        ? this.props.candidat
                                                              .liens.website
                                                        : ""
                                                }
                                                target="_blanck"
                                            >
                                                <i className="fas fa-globe"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="info-box">
                                    <div className="one-box">
                                        <i className="fas fa-user"></i>
                                        {this.props.candidat === null
                                            ? ""
                                            : this.props.candidat.username}
                                    </div>
                                    <div className="one-box">
                                        <i className="fas fa-envelope"></i>
                                        {this.props.candidat === null
                                            ? ""
                                            : this.props.candidat.email}
                                    </div>
                                    <div className="one-box">
                                        <i className="fas fa-calendar-alt"></i>
                                        {this.props.candidat === null
                                            ? ""
                                            : this.props.candidat.dateNaissance}
                                    </div>
                                    <div className="one-box">
                                        <i className="fas fa-map-marker-alt"></i>
                                        {this.props.candidat === null
                                            ? ""
                                            : this.props.candidat.adresse ===
                                                  undefined ||
                                              this.props.candidat.wilaya ===
                                                  undefined
                                            ? ""
                                            : `${
                                                  this.props.candidat.adresse
                                              }, ${this.renderWilaya()}`}
                                    </div>
                                    <div className="one-box">
                                        <i className="fas fa-mobile-alt"></i>
                                        {this.props.candidat === null
                                            ? ""
                                            : this.props.candidat.tel}
                                    </div>

                                    <div className="extra-box">
                                        <div className="langs">
                                            <h5>Langues</h5>
                                            <ul>
                                                {this.props.candidat === null
                                                    ? ""
                                                    : this.renderedLangueList()}
                                            </ul>
                                        </div>
                                        <div className="skills">
                                            <h5>Compétences</h5>
                                            <ul>
                                                {this.props.candidat === null
                                                    ? ""
                                                    : this.renderedCompetanceList()}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                ref={this.ProfesRef}
                                className="profesionel-info col-md-8 slower animate__animated"
                            >
                                <div className="edu">
                                    <h4>
                                        <i className="fas fa-user-graduate"></i>
                                        Cursus
                                    </h4>
                                    <hr />
                                    {/*  <CorsusBox
                                        title="LIC INFORMATIQUE"
                                        college="USTHB"
                                        start="2018"
                                        end="2021"
                                    />
                                    <CorsusBox
                                        title="MASTER AI"
                                        college="USTHB"
                                        start="2021"
                                        end="2023"
                                    /> */}
                                    {this.props.candidat === null
                                        ? ""
                                        : this.renderCorsusBox()}
                                </div>
                                <div className="exp">
                                    <h4>
                                        <i className="fas fa-briefcase"></i>
                                        Experience
                                    </h4>
                                    <hr />
                                    {/* <WorkBox
                                        title="Fornt End Developper"
                                        workplace="Google Inc."
                                        start="2019"
                                        end="2020"
                                        review="Le Lorem Ipsum est simplement du faux texte employé dans la
                                        composition et la mise en page avant impression. Le Lorem
                                        Ipsum est le faux texte standard de l'imprimerie depuis les
                                        années 1500, quand un imprimeur anonyme assembla ensemble
                                        des morceaux de texte pour réaliser un livre spécimen de
                                        polices de texte. Il n'a pas fait que survivre cinq siècles,
                                        mais s'est aussi adapté à la bureautique informatique, sans
                                        que son."
                                    />
                                    <WorkBox
                                        title="Back End Developper"
                                        workplace="Facebook Inc."
                                        start="2020"
                                        end="2021"
                                        review="Le Lorem Ipsum est simplement du faux texte employé dans la
                                        composition et la mise en page avant impression. Le Lorem
                                        Ipsum est le faux texte standard de l'imprimerie depuis les
                                        années 1500, quand un imprimeur anonyme assembla ensemble
                                        des morceaux de texte pour réaliser un livre spécimen de
                                        polices de texte. Il n'a pas fait que survivre cinq siècles,
                                        mais s'est aussi adapté à la bureautique informatique, sans
                                        que son."
                                    /> */}
                                    {this.props.candidat === null
                                        ? ""
                                        : this.renderExpBox()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    candidat: state.auth.user,
});

export default connect(mapStateToProps)(ProfilPage);
