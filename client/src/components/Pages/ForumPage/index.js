import React from "react";
import DashboardNav from "../../helpers/DashboardNav";
import PostsBox from "../../helpers/PostsBox";
import $ from "jquery";
import { connect } from "react-redux";
import { ajouterPoste, supprimerPoste } from "../../actions/postes";
import { loadUser } from "../../actions/auth";
import Alert from "../../helpers/Alert";
import PostRow from "../../helpers/PostRow";

import "./ForumPage.css";
import moment from "moment";
import PostFormUpdate from "../../helpers/PostFormUpdate";

class ForumPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            render: "accueil",
            poste: {
                candidat: "",
                titre: "",
                contenu: "",
                datePosté: moment(new Date()).format("DD-MM-YYYY HH:mm"),
                etat: "en attent",
            },
        };

        this.formRef = React.createRef();
        this.deleteRef = React.createRef();
        this.updateRef = React.createRef();
    }

    async componentDidMount() {
        await this.props.loadUser();
        this.setState({
            poste: { ...this.state.poste, candidat: this.props.candidat._id },
        });
    }

    renderPostes() {
        const postesArray = [];
        this.props.postes.forEach((poste) => {
            postesArray.push(
                <PostsBox
                    key={poste._id}
                    posteId={poste._id}
                    candidatId={poste.candidat}
                    datePosté={poste.datePosté}
                    commentaires={poste.commentaires}
                    titre={poste.titre}
                    contenu={poste.contenu}
                    seeMore={true}
                />
            );
        });
        return postesArray.length === 0 ? (
            <div style={{ marginTop: "40px", textAlign: "center" }}>
                Pas de postes por le moment...
            </div>
        ) : (
            postesArray
        );
    }

    renderMesPostes() {
        const mesPostesArray = [];
        this.props.mesPostes.forEach((poste) => {
            mesPostesArray.push(
                <PostRow
                    key={poste._id}
                    posteId={poste._id}
                    title={poste.titre}
                    contenu={poste.contenu}
                    datePublication={poste.datePosté}
                    commentairesNbr={poste.commentaires.length}
                    deleteRef={this.deleteRef}
                    reference={this.updateRef}
                />
            );
        });
        return mesPostesArray.length === 0 ? (
            <tr>
                <td colSpan="5">Pas de postes pour le moment.</td>
            </tr>
        ) : (
            mesPostesArray
        );
    }

    whatToRender() {
        if (this.state.render === "accueil") {
            return (
                <div className="posts-container animate__animated animate__backInRight">
                    <h2>
                        Les derniers postes
                        <button
                            onClick={async () => {
                                $(this.formRef.current).slideToggle(1000);
                            }}
                        >
                            <span>
                                <i className="fas fa-plus"></i>
                            </span>
                            Nouveau Poste
                        </button>
                    </h2>
                    <form ref={this.formRef}>
                        <Alert />
                        <input
                            type="text"
                            placeholder="Titre"
                            onChange={(e) => {
                                this.setState({
                                    poste: {
                                        ...this.state.poste,
                                        titre: e.target.value,
                                    },
                                });
                            }}
                        />
                        <textarea
                            placeholder="Contenu"
                            onChange={(e) => {
                                this.setState({
                                    poste: {
                                        ...this.state.poste,
                                        contenu: e.target.value,
                                    },
                                });
                            }}
                        ></textarea>
                        <button
                            onClick={async (e) => {
                                e.preventDefault();
                                const res = await this.props.ajouterPoste(
                                    this.state.poste
                                );
                                if (res) {
                                    setInterval(() => {
                                        $(this.formRef.current).slideUp(1000);
                                    }, 1500);
                                }
                            }}
                        >
                            Ajouter
                        </button>
                    </form>
                    {this.renderPostes()}
                </div>
            );
        } else {
            return (
                <div className="my-posts">
                    <h2>Mes postes</h2>
                    <hr />
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: "20%" }}>Titre</th>
                                <th style={{ width: "calc(35% - 150px)" }}>
                                    Contenu
                                </th>
                                <th style={{ width: "20%" }}>
                                    Date publication
                                </th>
                                <th style={{ width: "15%" }}>Commentaire</th>
                                <th style={{ width: "150px" }}></th>
                            </tr>
                        </thead>
                        <tbody>{this.renderMesPostes()}</tbody>
                    </table>
                </div>
            );
        }
    }

    render() {
        return this.props.candidat ? (
            <>
                <DashboardNav />
                <div className="forum-container">
                    <div className="delete-box" ref={this.deleteRef}>
                        <div className="delete-container">
                            <h4 className="text-center">Avertissement</h4>
                            <hr />
                            <Alert />
                            <p>Voulez-vous vraiment supprimer ?</p>
                            <div className="buttons-container">
                                <button
                                    onClick={() => {
                                        this.props.supprimerPoste(
                                            this.props.poste._id
                                        );
                                        setInterval(
                                            () => window.location.reload(),
                                            2550
                                        );
                                    }}
                                >
                                    Oui
                                </button>
                                <button
                                    onClick={() => {
                                        this.deleteRef.current.style.display =
                                            "none";
                                    }}
                                >
                                    Non
                                </button>
                            </div>
                        </div>
                    </div>
                    <PostFormUpdate reference={this.updateRef} />
                    <div className="container">
                        <div className="row">
                            <div className="col-md-3 side-bar">
                                <ul className="list-unstyled animate__animated animate__backInLeft">
                                    <li
                                        className="active"
                                        onClick={(e) => {
                                            this.setState({
                                                render: "accueil",
                                            });
                                            if (
                                                e.target.classList.contains(
                                                    "active"
                                                )
                                            ) {
                                                e.target.classList.remove(
                                                    "active"
                                                );
                                            } else {
                                                e.target.classList.add(
                                                    "active"
                                                );
                                                $(e.target)
                                                    .addClass("active")
                                                    .siblings()
                                                    .removeClass("active");
                                            }
                                        }}
                                    >
                                        <div>
                                            <i className="fas fa-home"></i>
                                        </div>
                                        Accueil
                                    </li>
                                    <li
                                        onClick={(e) => {
                                            this.setState({
                                                render: "mes postes",
                                            });
                                            if (
                                                e.target.classList.contains(
                                                    "active"
                                                )
                                            ) {
                                                e.target.classList.remove(
                                                    "active"
                                                );
                                            } else {
                                                $(e.target)
                                                    .addClass("active")
                                                    .siblings()
                                                    .removeClass("active");
                                            }
                                        }}
                                    >
                                        <div>
                                            <i className="fas fa-clipboard"></i>
                                        </div>
                                        Mes postes
                                    </li>
                                </ul>
                            </div>
                            <div className="col-md-9 main-content">
                                {this.whatToRender()}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        ) : null;
    }
}

const mapStateToProps = (state) => ({
    candidat: state.auth.user,
    postes: state.postes.postes,
    mesPostes: state.postes.mesPostes,
    poste: state.postes.poste,
});

export default connect(mapStateToProps, {
    ajouterPoste,
    supprimerPoste,
    loadUser,
})(ForumPage);
