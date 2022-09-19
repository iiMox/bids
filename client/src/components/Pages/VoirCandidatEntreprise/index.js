import React from "react";
import { connect } from "react-redux";
import DashboardNavEntreprise from "../../helpers/DashboardNavEntreprise";
import wilayas from "../../helpers/wilayas.json";
import categories from "../../helpers/categories.json";
import { getCandidat } from "../../actions/candidat";
import WorkBox from "../../helpers/WorkBox";
import CorsusBox from "../../helpers/CorsusBox";
import { store } from "../../store";
import axios from "axios";
import { loadEntreprise } from "../../actions/auth";
import { GET_CANDIDAT } from "../../actions/types";

import "../ProfilPage/ProfilPage.css";

class VoirCandidatEntreprise extends React.Component {
    constructor(props) {
        super(props);

        this.PersoRef = React.createRef();
        this.ProfesRef = React.createRef();
    }

    async componentDidMount() {
        const res = await this.props.getCandidat(
            this.props.match.params.candidat_id
        );

        store.dispatch({ type: GET_CANDIDAT, payload: res.data });

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

    renderCategorie() {
        let c = "";
        categories.forEach((categorie) => {
            if (categorie.id === this.props.entreprise.categorie) {
                c = categorie.cat;
            }
        });
        return c;
    }

    async createNewChat() {
        const conversation = await axios.get(
            `/api/conversations/entreprise/${this.props.entreprise._id}/${this.props.match.params.candidat_id}`
        );

        if (conversation.data.length !== 0) {
            const friend = conversation.data[0].members.find(
                (m) =>
                    m.userId !== this.props.entreprise._id &&
                    m.userType !== this.props.currentUserType
            );
            let res;
            if (friend.userType === "Candidat") {
                res = await this.props.getCandidat(friend.userId);
            } else {
                res = await this.props.loadEntreprise(friend.userId);
            }
            store.dispatch({
                type: "SET_CURRENT_CONVERSATION",
                payload: {
                    currentConversation: conversation.data[0],
                    currentUser: this.props.entreprise,
                    friendUser: res.data,
                },
            });
            document.querySelector(".message-fomr-handler").style.display =
                "block";
        } else {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            try {
                const body = {
                    senderId: this.props.entreprise._id,
                    senderType: "Entreprise",
                    recieverId: this.props.match.params.candidat_id,
                    recieverType: "Candidat",
                };
                const res = await axios.post(
                    "/api/conversations",
                    body,
                    config
                );
                const friend = res.data.members.find(
                    (m) =>
                        m.userId !== this.props.entreprise._id &&
                        m.userType !== this.props.currentUserType
                );
                let res1;
                if (friend.userType === "Candidat") {
                    res1 = await this.props.getCandidat(friend.userId);
                } else {
                    res1 = await this.props.loadEntreprise(friend.userId);
                }
                store.dispatch({
                    type: "SET_CURRENT_CONVERSATION",
                    payload: {
                        currentConversation: res.data,
                        currentUser: this.props.entreprise,
                        friendUser: res1.data,
                    },
                });
                document.querySelector(".message-fomr-handler").style.display =
                    "block";
            } catch (err) {}
        }
    }

    render() {
        return this.props.candidat ? (
            <div className="profil">
                <DashboardNavEntreprise />
                <div className="content">
                    <div className="container">
                        <h2>Profil personnel</h2>
                        <div className="row big-box">
                            <div
                                ref={this.PersoRef}
                                className="personel-info col-md-4 slower animate__animated"
                            >
                                <img
                                    src={this.props.candidat.avatar}
                                    alt="Avatar"
                                />
                                <h4>
                                    {`${this.props.candidat.nom} ${this.props.candidat.prenom}`}
                                </h4>
                                <p>{this.props.candidat.bio}</p>
                                <div className="social">
                                    <ul className="list-unstyled">
                                        <li>
                                            <a
                                                href={
                                                    this.props.candidat
                                                        .liens !== undefined
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
                                                    this.props.candidat
                                                        .liens !== undefined
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
                                                    this.props.candidat
                                                        .liens !== undefined
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
                                                    this.props.candidat
                                                        .liens !== undefined
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
                                <div
                                    className="send-message"
                                    style={{
                                        width: "40%",
                                        marginLeft: "30%",
                                        textAlign: "center",
                                        fontSize: "17px",
                                        fontWeight: "bold",
                                    }}
                                    onClick={() => {
                                        this.createNewChat();
                                    }}
                                >
                                    <i
                                        className="fas fa-comment-dots"
                                        style={{ marginRight: "10px" }}
                                    ></i>
                                    Contacter
                                </div>
                                <div className="info-box">
                                    <div className="one-box">
                                        <i className="fas fa-user"></i>
                                        {this.props.candidat.username}
                                    </div>
                                    <div className="one-box">
                                        <i className="fas fa-envelope"></i>
                                        {this.props.candidat.email}
                                    </div>
                                    <div className="one-box">
                                        <i className="fas fa-calendar-alt"></i>
                                        {this.props.candidat.dateNaissance}
                                    </div>
                                    <div className="one-box">
                                        <i className="fas fa-map-marker-alt"></i>
                                        {this.props.candidat.adresse ===
                                            undefined ||
                                        this.props.candidat.wilaya === undefined
                                            ? ""
                                            : `${
                                                  this.props.candidat.adresse
                                              }, ${this.renderWilaya()}`}
                                    </div>
                                    <div className="one-box">
                                        <i className="fas fa-mobile-alt"></i>
                                        {this.props.candidat.tel}
                                    </div>

                                    <div className="extra-box">
                                        <div className="langs">
                                            <h5>Langues</h5>
                                            <ul>{this.renderedLangueList()}</ul>
                                        </div>
                                        <div className="skills">
                                            <h5>Compétences</h5>
                                            <ul>
                                                {this.renderedCompetanceList()}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="button-holder">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            this.createNewChat();
                                        }}
                                    >
                                        <div className="animation-box">
                                            <i className="fas fa-arrow-down"></i>
                                        </div>
                                        Contacter
                                    </button>
                                </div> */}
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

                                    {this.renderCorsusBox()}
                                </div>
                                <div className="exp">
                                    <h4>
                                        <i className="fas fa-briefcase"></i>
                                        Experience
                                    </h4>
                                    <hr />

                                    {this.renderExpBox()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null;
    }
}

const mapStateToOffre = (state) => ({
    candidat: state.candidats.candidatCurrent,
    entreprise: state.auth.user,
    currentUserType: state.auth.accoutnType,
});

export default connect(mapStateToOffre, { getCandidat, loadEntreprise })(
    VoirCandidatEntreprise
);
