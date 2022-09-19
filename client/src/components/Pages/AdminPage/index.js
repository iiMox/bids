import React from "react";
import logo from "../../../images/logo.svg";
import "./AdminPage.css";
import { connect } from "react-redux";
import {
    getAll,
    deleteCandidat,
    deleteEntreprise,
    deleteOffre,
    updateEtatOffre,
    deleteAvis,
    updateEtatAvis,
    deletePoste,
} from "../../actions/admin";
import EntrepriseNameCol from "../../helpers/EntrepriseNameCol";
import Alert from "../../helpers/Alert";
import OffreTitreCol from "../../helpers/OffreTitreCol";
import CandidatNameCol from "../../helpers/CandidatNameCol";
import wilayas from "../../helpers/wilayas.json";
import categories from "../../helpers/categories.json";
import { setAlert } from "../../actions/alert";
import { store } from "../../store";
import axios from "axios";
import { loadEntreprise } from "../../actions/auth";

class AdminPage extends React.Component {
    state = {
        table: "candidats",
        logged: localStorage.getItem("logged"),
        username: "",
        password: "",
    };

    async componentDidMount() {
        await this.props.getAll();
    }

    searchInTable() {
        var input, filter, table, tr, td, td1, i, txtValue, txtValue1;
        input = document.getElementById("searchInput");
        filter = input.value.toUpperCase();
        table = document.getElementById("myTable");
        tr = table.getElementsByTagName("tr");

        // Loop through all table rows, and hide those who don't match the search query
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            td1 = tr[i].getElementsByTagName("td")[1];
            if (td && td1) {
                txtValue = td.textContent || td.innerText;
                txtValue1 = td1.textContent || td1.innerText;
                if (
                    txtValue.toUpperCase().indexOf(filter) > -1 ||
                    txtValue1.toUpperCase().indexOf(filter) > -1
                ) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }

    login() {
        if (!this.state.logged) {
            return (
                <div className="form-holder">
                    <form>
                        <h2>Connexion</h2>
                        <span></span>
                        <Alert />
                        <input
                            placeholder="Nom d'utilisateur"
                            onChange={(e) => {
                                this.setState({
                                    ...this.state,
                                    username: e.target.value,
                                });
                            }}
                            type="text"
                        />
                        <input
                            placeholder="Mot de passe"
                            onChange={(e) => {
                                this.setState({
                                    ...this.state,
                                    password: e.target.value,
                                });
                            }}
                            type="password"
                        />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (
                                    this.state.username === "admin" &&
                                    this.state.password === "admin"
                                ) {
                                    this.setState({
                                        ...this.state,
                                        logged: true,
                                    });
                                    localStorage.setItem("logged", true);
                                } else {
                                    store.dispatch(
                                        setAlert(
                                            "Informations incorrectes",
                                            "danger",
                                            1500
                                        )
                                    );
                                }
                            }}
                        >
                            Connexion
                        </button>
                    </form>
                </div>
            );
        } else {
            return (
                <>
                    <div className="header">
                        <input
                            type="search"
                            id="searchInput"
                            onKeyUp={() => this.searchInTable()}
                        />
                        <span
                            onClick={() => {
                                this.setState({ ...this.state, logged: false });
                                localStorage.setItem("logged", false);
                            }}
                        >
                            <i className="fas fa-sign-out-alt"></i>
                        </span>
                    </div>
                    <h2>{this.state.table}</h2>
                    <Alert />
                    <div className="table">
                        <table id="myTable">{this.renderTableToShow()}</table>
                    </div>
                </>
            );
        }
    }

    renderWilaya(w) {
        let c = "";
        wilayas.forEach((wilaya) => {
            if (wilaya.code === w) {
                c = wilaya.wilaya;
            }
        });
        return c;
    }

    renderCategorie(w) {
        let c = "";
        categories.forEach((categorie) => {
            if (categorie.id === w) {
                c = categorie.cat;
            }
        });
        return c;
    }

    renderCandidats() {
        const array = [];
        this.props.admin.candidats.forEach((candidat) => {
            array.push(
                <tr key={candidat._id}>
                    <td style={{ cursor: "default" }}>{candidat.nom}</td>
                    <td>{candidat.prenom}</td>
                    <td>{candidat.email}</td>
                    <td>{candidat.username}</td>
                    <td>{candidat.dateNaissance}</td>
                    <td>{candidat.tel}</td>
                    <td>{this.renderWilaya(candidat.wilaya)}</td>
                    <td>
                        <span
                            onClick={async () => {
                                const res = await this.props.deleteCandidat(
                                    candidat._id
                                );
                                if (res) {
                                    setInterval(
                                        () => window.location.reload(),
                                        1550
                                    );
                                }
                            }}
                            style={{
                                opacity: ".5",
                                transition: "all 0.5s ease-in-out",
                                cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.opacity = 1;
                                e.target.style.color = "red";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.opacity = 0.5;
                                e.target.style.color = "#5d5d5d";
                            }}
                        >
                            <i className="fas fa-trash"></i>
                        </span>
                    </td>
                </tr>
            );
        });
        return array;
    }

    renderEntreprises() {
        const array = [];
        this.props.admin.entreprises.forEach((entreprise) => {
            array.push(
                <tr key={entreprise._id}>
                    <td style={{ cursor: "default" }}>{entreprise.nom}</td>
                    <td>{entreprise.email}</td>
                    <td>{entreprise.adresse}</td>
                    <td>{this.renderWilaya(entreprise.wilaya)}</td>
                    <td>{this.renderCategorie(entreprise.categorie)}</td>
                    <td
                        onClick={async () => {
                            const res = await this.props.deleteEntreprise(
                                entreprise._id
                            );
                            if (res) {
                                setInterval(
                                    () => window.location.reload(),
                                    1550
                                );
                            }
                        }}
                        style={{
                            opacity: ".5",
                            transition: "all 0.4s ease-in-out",
                            cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.opacity = 1;
                            e.target.style.color = "red";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.opacity = 0.5;
                            e.target.style.color = "#5d5d5d";
                        }}
                    >
                        <i className="fas fa-trash"></i>
                    </td>
                </tr>
            );
        });
        return array;
    }

    renderOffres() {
        const array = [];
        this.props.admin.offres.forEach((offre) => {
            array.push(
                <tr key={offre._id}>
                    <td style={{ cursor: "default" }}>{offre.titre}</td>
                    <EntrepriseNameCol entrepriseId={offre.entreprise} />
                    <td>{offre.dateCreation}</td>
                    <td>{this.renderCategorie(offre.categorie)}</td>
                    <td>
                        {offre.type === "emploi"
                            ? `${offre.experience} Ans`
                            : "/"}
                    </td>
                    <td style={{ textTransform: "capitalize" }}>
                        {offre.type}
                    </td>
                    <td>
                        {offre.etat === "en attent" ? (
                            <i
                                style={{ color: "#8e8e8e" }}
                                className="fas fa-ellipsis-h"
                            ></i>
                        ) : offre.etat === "Actif" ? (
                            <i
                                style={{ color: "#32cd32" }}
                                className="fas fa-check"
                            ></i>
                        ) : (
                            <i
                                style={{ color: "red" }}
                                className="fas fa-times"
                            ></i>
                        )}
                    </td>
                    <td>
                        {offre.etat === "en attent" ? (
                            <>
                                <span
                                    onClick={async () => {
                                        const res =
                                            await this.props.updateEtatOffre({
                                                id: offre._id,
                                                etat: "Actif",
                                            });
                                        const entreprise =
                                            await this.props.loadEntreprise(
                                                offre.entreprise
                                            );
                                        entreprise.data.followers.forEach(
                                            async (follower) => {
                                                const config = {
                                                    headers: {
                                                        "Content-type":
                                                            "application/json",
                                                    },
                                                };
                                                const body = {
                                                    destinationId:
                                                        follower.candidat,
                                                    notificationType:
                                                        "ajoutOffre",
                                                    originId:
                                                        entreprise.data._id,
                                                    originType: "Entreprise",
                                                    extra: offre._id,
                                                };
                                                try {
                                                    await axios.put(
                                                        `api/candidats/notifications`,
                                                        body,
                                                        config
                                                    );
                                                } catch (err) {
                                                    console.log(err);
                                                }
                                            }
                                        );
                                        if (res) {
                                            setInterval(
                                                () => window.location.reload(),
                                                1500
                                            );
                                        }
                                    }}
                                    style={{
                                        marginRight: "10px",
                                        cursor: "pointer",
                                        color: "#32cd32",
                                    }}
                                >
                                    <i className="fas fa-check"></i>
                                </span>
                                <span
                                    onClick={async () => {
                                        const res =
                                            await this.props.updateEtatOffre({
                                                id: offre._id,
                                                etat: "Fermé",
                                            });
                                        if (res) {
                                            setInterval(
                                                () => window.location.reload(),
                                                1500
                                            );
                                        }
                                    }}
                                    style={{
                                        marginRight: "10px",
                                        cursor: "pointer",
                                        color: "red",
                                    }}
                                >
                                    <i className="fas fa-times"></i>
                                </span>
                            </>
                        ) : offre.etat === "Actif" ? (
                            <span
                                onClick={async () => {
                                    const res =
                                        await this.props.updateEtatOffre({
                                            id: offre._id,
                                            etat: "Fermé",
                                        });
                                    if (res) {
                                        setInterval(
                                            () => window.location.reload(),
                                            1500
                                        );
                                    }
                                }}
                                style={{
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    color: "red",
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </span>
                        ) : (
                            <span
                                onClick={async () => {
                                    const res =
                                        await this.props.updateEtatOffre({
                                            id: offre._id,
                                            etat: "Actif",
                                        });
                                    const entreprise =
                                        await this.props.loadEntreprise(
                                            offre.entreprise
                                        );

                                    entreprise.data.followers.forEach(
                                        async (follower) => {
                                            const config = {
                                                headers: {
                                                    "Content-type":
                                                        "application/json",
                                                },
                                            };
                                            const body = {
                                                destinationId:
                                                    follower.candidat,
                                                notificationType: "ajoutOffre",
                                                originId: entreprise.data._id,
                                                originType: "Entreprise",
                                                extra: offre._id,
                                            };
                                            try {
                                                await axios.put(
                                                    `api/candidats/notifications`,
                                                    body,
                                                    config
                                                );
                                            } catch (err) {
                                                console.log(err);
                                            }
                                        }
                                    );
                                    if (res) {
                                        setInterval(
                                            () => window.location.reload(),
                                            1500
                                        );
                                    }
                                }}
                                style={{
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    color: "#32cd32",
                                }}
                            >
                                <i className="fas fa-check"></i>
                            </span>
                        )}
                        <span
                            onClick={async () => {
                                const res = await this.props.deleteOffre(
                                    offre._id
                                );
                                if (res) {
                                    setInterval(
                                        () => window.location.reload(),
                                        1550
                                    );
                                }
                            }}
                            style={{
                                opacity: ".5",
                                transition: "all 0.4s ease-in-out",
                                cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.opacity = 1;
                                e.target.style.color = "red";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.opacity = 0.5;
                                e.target.style.color = "#5d5d5d";
                            }}
                        >
                            <i className="fas fa-trash"></i>
                        </span>
                    </td>
                </tr>
            );
        });
        return array;
    }

    renderDemandes() {
        const array = [];
        this.props.admin.demandes.forEach((demande) => {
            array.push(
                <tr key={demande._id}>
                    <CandidatNameCol candId={demande.candidat} />
                    <OffreTitreCol offreId={demande.offre} />
                    <td>{demande.dateEnvoi}</td>
                    <td>{demande.lettreMotivation}</td>
                    <td>
                        {demande.etat === "en attent" ? (
                            <i
                                style={{ color: "#8e8e8e" }}
                                className="fas fa-ellipsis-h"
                            ></i>
                        ) : demande.etat === "Acceptée" ? (
                            <i
                                style={{ color: "#32cd32" }}
                                className="fas fa-check"
                            ></i>
                        ) : (
                            <i
                                style={{ color: "red" }}
                                className="fas fa-times"
                            ></i>
                        )}
                    </td>
                    <td></td>
                </tr>
            );
        });
        return array;
    }

    renderAvis() {
        const array = [];
        this.props.admin.avis.forEach((avis) => {
            array.push(
                <tr key={avis._id}>
                    <CandidatNameCol candId={avis.candidat} />
                    <EntrepriseNameCol entrepriseId={avis.entreprise} />
                    <td>{avis.commentaire}</td>
                    <td>{avis.evaluation}</td>
                    <td>{avis.datePosté}</td>
                    <td>
                        {avis.etat === "en attent" ? (
                            <i
                                style={{ color: "#8e8e8e" }}
                                className="fas fa-ellipsis-h"
                            ></i>
                        ) : avis.etat === "Accepté" ? (
                            <i
                                style={{ color: "#32cd32" }}
                                className="fas fa-check"
                            ></i>
                        ) : (
                            <i
                                style={{ color: "red" }}
                                className="fas fa-times"
                            ></i>
                        )}
                    </td>
                    <td>
                        {avis.etat === "en attent" ? (
                            <>
                                <span
                                    onClick={async () => {
                                        const res =
                                            await this.props.updateEtatAvis({
                                                id: avis._id,
                                                etat: "Accepté",
                                            });
                                        if (res) {
                                            setInterval(
                                                () => window.location.reload(),
                                                1500
                                            );
                                        }
                                    }}
                                    style={{
                                        marginRight: "10px",
                                        cursor: "pointer",
                                        color: "#32cd32",
                                    }}
                                >
                                    <i className="fas fa-check"></i>
                                </span>
                                <span
                                    onClick={async () => {
                                        const res =
                                            await this.props.updateEtatAvis({
                                                id: avis._id,
                                                etat: "Refusé",
                                            });
                                        if (res) {
                                            setInterval(
                                                () => window.location.reload(),
                                                1500
                                            );
                                        }
                                    }}
                                    style={{
                                        marginRight: "10px",
                                        cursor: "pointer",
                                        color: "red",
                                    }}
                                >
                                    <i className="fas fa-times"></i>
                                </span>
                            </>
                        ) : avis.etat === "Accepté" ? (
                            <span
                                onClick={async () => {
                                    const res = await this.props.updateEtatAvis(
                                        {
                                            id: avis._id,
                                            etat: "Refusé",
                                        }
                                    );
                                    if (res) {
                                        setInterval(
                                            () => window.location.reload(),
                                            1500
                                        );
                                    }
                                }}
                                style={{
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    color: "red",
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </span>
                        ) : (
                            <span
                                onClick={async () => {
                                    const res = await this.props.updateEtatAvis(
                                        {
                                            id: avis._id,
                                            etat: "Accepté",
                                        }
                                    );
                                    if (res) {
                                        setInterval(
                                            () => window.location.reload(),
                                            1500
                                        );
                                    }
                                }}
                                style={{
                                    marginRight: "10px",
                                    cursor: "pointer",
                                    color: "#32cd32",
                                }}
                            >
                                <i className="fas fa-check"></i>
                            </span>
                        )}
                        <span
                            onClick={async () => {
                                const res = await this.props.deleteAvis(
                                    avis._id
                                );
                                if (res) {
                                    setInterval(
                                        () => window.location.reload(),
                                        1550
                                    );
                                }
                            }}
                            style={{
                                opacity: ".5",
                                transition: "all 0.4s ease-in-out",
                                cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.opacity = 1;
                                e.target.style.color = "red";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.opacity = 0.5;
                                e.target.style.color = "#5d5d5d";
                            }}
                        >
                            <i className="fas fa-trash"></i>
                        </span>
                    </td>
                </tr>
            );
        });
        return array;
    }

    renderPostes() {
        const array = [];
        this.props.admin.postes.forEach((poste) => {
            array.push(
                <tr key={poste._id}>
                    <CandidatNameCol candId={poste.candidat} />
                    <td>{poste.titre}</td>
                    <td>{poste.contenu}</td>
                    <td>{poste.datePosté}</td>
                    <td>{poste.commentaires.length}</td>
                    <td>
                        <span
                            onClick={async () => {
                                const res = await this.props.deletePoste(
                                    poste._id
                                );
                                if (res) {
                                    setInterval(
                                        () => window.location.reload(),
                                        1550
                                    );
                                }
                            }}
                            style={{
                                opacity: ".5",
                                transition: "all 0.4s ease-in-out",
                                cursor: "pointer",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.opacity = 1;
                                e.target.style.color = "red";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.opacity = 0.5;
                                e.target.style.color = "#5d5d5d";
                            }}
                        >
                            <i className="fas fa-trash"></i>
                        </span>
                    </td>
                </tr>
            );
        });
        return array;
    }

    renderTableToShow() {
        if (this.state.table === "candidats") {
            return (
                <>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prenom</th>
                            <th>E-mail</th>
                            <th>Nom d'utilisateur</th>
                            <th>Date de naissance</th>
                            <th>Télephone</th>
                            <th>Wilaya</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.admin.candidats
                            ? this.renderCandidats()
                            : null}
                    </tbody>
                </>
            );
        } else if (this.state.table === "entreprises") {
            return (
                <>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>E-mail</th>
                            <th>Adresse</th>
                            <th>Wilaya</th>
                            <th>Catégorie</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.admin.entreprises
                            ? this.renderEntreprises()
                            : null}
                    </tbody>
                </>
            );
        } else if (this.state.table === "offres") {
            return (
                <>
                    <thead>
                        <tr>
                            <th>Titre</th>
                            <th>Entreprise</th>
                            <th>Date posté</th>
                            <th>Catégorie</th>
                            <th>Experience</th>
                            <th>Type</th>
                            <th>Etat</th>
                            <th style={{ minWidth: "100px" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.admin.offres ? this.renderOffres() : null}
                    </tbody>
                </>
            );
        } else if (this.state.table === "demandes") {
            return (
                <>
                    <thead>
                        <tr>
                            <th>Candidat</th>
                            <th>Offre</th>
                            <th>Date de participation</th>
                            <th>Lettre de motivation</th>
                            <th>Etat</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.admin.demandes
                            ? this.renderDemandes()
                            : null}
                    </tbody>
                </>
            );
        } else if (this.state.table === "avis") {
            return (
                <>
                    <thead>
                        <tr>
                            <th>Candidat</th>
                            <th>Entreprise</th>
                            <th>Commentaire</th>
                            <th>Evaluation</th>
                            <th>Date posté</th>
                            <th>Etat</th>
                            <th style={{ minWidth: "100px" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.admin.avis ? this.renderAvis() : null}
                    </tbody>
                </>
            );
        } else if (this.state.table === "postes") {
            return (
                <>
                    <thead>
                        <tr>
                            <th>Candidat</th>
                            <th>Titre</th>
                            <th>Contenu</th>
                            <th>Date posté</th>
                            <th>Commentaires</th>
                            <th style={{ minWidth: "100px" }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.admin.postes ? this.renderPostes() : null}
                    </tbody>
                </>
            );
        }
    }

    render() {
        return this.props.admin ? (
            <div className="admin-page">
                <div className="side-bar">
                    <div className="img-box">
                        <img src={logo} alt="LOGO" />
                    </div>
                    <hr />
                    <ul className="list-unstyled">
                        <li
                            onClick={() =>
                                this.setState({ table: "candidats" })
                            }
                        >
                            Candidats
                        </li>
                        <li
                            onClick={() =>
                                this.setState({ table: "entreprises" })
                            }
                        >
                            Entreprises
                        </li>
                        <li onClick={() => this.setState({ table: "offres" })}>
                            Offres
                        </li>
                        <li
                            onClick={() => this.setState({ table: "demandes" })}
                        >
                            Demandes
                        </li>
                        <li onClick={() => this.setState({ table: "avis" })}>
                            Avis
                        </li>
                        <li onClick={() => this.setState({ table: "postes" })}>
                            Postes
                        </li>
                    </ul>
                </div>
                <div className="content">{this.login()}</div>
            </div>
        ) : null;
    }
}
const mapStateToProps = (state) => ({
    admin: state.admin,
});

export default connect(mapStateToProps, {
    getAll,
    deleteCandidat,
    deleteEntreprise,
    deleteOffre,
    updateEtatOffre,
    deleteAvis,
    updateEtatAvis,
    deletePoste,
    loadEntreprise,
})(AdminPage);
