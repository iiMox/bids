import React from "react";
import CountUp from "react-countup";
import Slider from "../../helpers/Slider";
import Footer from "../../helpers/Footer";
import OffreBox from "../../helpers/OffreBox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ProcessOne from "../../../images/process1.png";
import ProcessTwo from "../../../images/process2.png";
import ProcessThree from "../../../images/process3.png";
import AvataeImg from "../../../images/avatar.png";
import history from "../../../history";

import "./Home.css";
import { connect } from "react-redux";
import axios from "axios";

class Home extends React.Component {
    state = { onStats: false, NbrEtreprise: 0 };

    constructor(props) {
        super(props);

        this.statRef = React.createRef();
    }

    async componentDidMount() {
        const res = await axios.get("/api/entreprises");
        this.setState({ ...this.state, NbrEtreprise: res.data.length });
        window.addEventListener("scroll", () => {
            if (this.statRef.current) {
                if (
                    window.scrollY >
                    this.statRef.current.offsetTop - window.innerHeight
                ) {
                    this.setState({ ...this.state, onStats: true });
                } else {
                    this.setState({ ...this.state, onStats: false });
                }
            }
        });
    }

    renderCounter() {
        if (this.state.onStats) {
            return (
                <div className="row animate__animated animate__bounceInLeft">
                    <div className="stat col-md-4">
                        <p>
                            +
                            <CountUp
                                start={0}
                                end={this.props.candidats.length}
                                duration={4}
                            />
                        </p>
                        <div>Candidats</div>
                    </div>
                    <div className="stat col-md-4">
                        <p>
                            +
                            <CountUp
                                start={0}
                                end={this.props.offres.length}
                                duration={4}
                            ></CountUp>
                        </p>
                        <div>Offres d'emplois</div>
                    </div>
                    <div className="stat col-md-4">
                        <p>
                            +
                            <CountUp
                                start={0}
                                end={this.state.NbrEtreprise}
                                duration={4}
                            />
                        </p>
                        <div>Entreprises</div>
                    </div>
                </div>
            );
        }
        return;
    }

    renderMyOffres() {
        const myOffresArray = [];
        let i = 1;
        this.props.offres.forEach((offre) => {
            if (i < 4) {
                if (offre.etat === "Actif") {
                    myOffresArray.push(
                        <OffreBox key={offre._id} offre={offre} />
                    );
                }
            }
            i++;
        });
        return myOffresArray;
    }

    render() {
        return (
            <>
                <Slider />
                <div className="process">
                    <div className="container">
                        <h2>Comment ça marche ?</h2>
                        <div className="row">
                            <div className="step col-md-4">
                                <h4>Choisir une offre</h4>
                                <span className="img-holder">
                                    <img src={ProcessOne} alt="search a job" />
                                </span>
                                <p>
                                    Selectionner les offres que vous arrange a
                                    partir de la base de données.
                                </p>
                            </div>
                            <div className="step col-md-4">
                                <h4>Envoyer une demande</h4>
                                <span className="img-holder">
                                    <img src={ProcessTwo} alt="send request" />
                                </span>
                                <p>
                                    Envoyer des demmandes d'emplois aux
                                    responsables pour avoir un intretien.
                                </p>
                            </div>
                            <div className="step col-md-4">
                                <h4>Passer un entretien</h4>
                                <span className="img-holder">
                                    <img
                                        src={ProcessThree}
                                        alt="job interview"
                                    />
                                </span>
                                <p>
                                    Le responsable va trier les demandes et il
                                    va contacter les gens qui ressemble au
                                    profil.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="posts">
                    <div className="container">
                        <h2>Offres recentes</h2>
                        {this.renderMyOffres()}
                        <button
                            onClick={() => {
                                history.push("/offres");
                            }}
                        >
                            Plus d'offres ...
                        </button>
                    </div>
                </div>
                <div className="testimonials">
                    <div className="container">
                        <h2>Temoignage</h2>
                        <p>
                            Voici ce que nos clients ont dit sur la plateforme
                        </p>
                        <div
                            id="carouselExampleIndicators"
                            className="carousel slide"
                            data-ride="carousel"
                        >
                            <ol className="carousel-indicators">
                                <li
                                    data-target="#carouselExampleIndicators"
                                    data-slide-to="0"
                                    className="active"
                                ></li>
                                <li
                                    data-target="#carouselExampleIndicators"
                                    data-slide-to="1"
                                ></li>
                                <li
                                    data-target="#carouselExampleIndicators"
                                    data-slide-to="2"
                                ></li>
                            </ol>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <div className="testimonial text-center">
                                        <div className="img-box">
                                            <img src={AvataeImg} alt="" />
                                        </div>
                                        <div className="infos">
                                            <h4>Leanne Graham</h4>
                                            <span>Développeur web</span>
                                        </div>
                                        <q>
                                            Plusieurs variations de Lorem Ipsum
                                            peuvent être trouvées ici ou là,
                                            mais la majeure partie d'entre
                                            elles.
                                        </q>
                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <div className="testimonial text-center">
                                        <div className="img-box">
                                            <img src={AvataeImg} alt="" />
                                        </div>
                                        <div className="infos">
                                            <h4>Leanne Graham</h4>
                                            <span>Développeur web</span>
                                        </div>
                                        <q>
                                            Plusieurs variations de Lorem Ipsum
                                            peuvent être trouvées ici ou là,
                                            mais la majeure partie d'entre
                                            elles.
                                        </q>
                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <div className="testimonial text-center">
                                        <div className="img-box">
                                            <img src={AvataeImg} alt="" />
                                        </div>
                                        <div className="infos">
                                            <h4>Leanne Graham</h4>
                                            <span>Développeur web</span>
                                        </div>
                                        <q>
                                            Plusieurs variations de Lorem Ipsum
                                            peuvent être trouvées ici ou là,
                                            mais la majeure partie d'entre
                                            elles.
                                        </q>
                                    </div>
                                </div>
                            </div>
                            <a
                                className="carousel-control-prev"
                                href="#carouselExampleIndicators"
                                role="button"
                                data-slide="prev"
                            >
                                <span
                                    className="carousel-control-prev-icon"
                                    aria-hidden="true"
                                >
                                    <FontAwesomeIcon
                                        icon={["fas", "chevron-left"]}
                                    />
                                </span>
                                <span className="sr-only">Previous</span>
                            </a>
                            <a
                                className="carousel-control-next"
                                href="#carouselExampleIndicators"
                                role="button"
                                data-slide="next"
                            >
                                <span
                                    className="carousel-control-next-icon"
                                    aria-hidden="true"
                                >
                                    <FontAwesomeIcon
                                        icon={["fas", "chevron-right"]}
                                    />
                                </span>
                                <span className="sr-only">Next</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="stats text-center " ref={this.statRef}>
                    <div className="container">
                        <h2>Statistique</h2>
                        {this.renderCounter()}
                    </div>
                </div>
                <Footer />
            </>
        );
    }
}

const mapStateToProps = (state) => ({
    offres: state.offres.offres,
    candidats: state.candidats.candidats,
});

export default connect(mapStateToProps)(Home);
