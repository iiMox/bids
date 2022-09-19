import React from "react";
import ReactDOM from "react-dom";
import DasshboardNav from "../../helpers/DashboardNav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CorsusBox from "../../helpers/CorsusBox";
import CorsusForm from "../../helpers/CorsusForm";
import CorsusFormUpdate from "../../helpers/CorsusFormUpdate";
import ExpForm from "../../helpers/ExpForm";
import ExpFormUpdate from "../../helpers/ExpFormUpdate";
import WorkBox from "../../helpers/WorkBox";
import SkillLangBox from "../../helpers/SkillLangBox";
import { connect } from "react-redux";
import wilayas from "../../helpers/wilayas.json";
import langues from "../../helpers/langues.json";
import {
    update,
    addLangue,
    addCompetance,
    addFormation,
    updateFormation,
    deleteFormation,
    addExperience,
    updateExperience,
    deleteExperience,
} from "../../actions/candidat";
import { loadUser } from "../../actions/auth";
import PropTypes from "prop-types";
import Alert from "../../helpers/Alert";
import moment from "moment";

import "./SettingsPage.css";
import axios from "axios";

class SettingsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tab: "profil",
            uploadImg: false,
            update: false,
            candidat: {
                id: "",
                nom: "",
                prenom: "",
                email: "",
                bio: "",
                username: "",
                oldPassword: "",
                newPassword: "",
                adresse: "",
                tel: "",
                wilaya: "",
                dateNaissance: "",
                password: "",
                facebook: "",
                twitter: "",
                linkedin: "",
                website: "",
                langue: { langue: "", niveau: "" },
                competance: { competance: "", niveau: "" },
                formation: {
                    id: "",
                    titre: "",
                    etablissement: "",
                    dateDebut: "",
                    dateFin: "",
                    etat: false,
                },
            },
            experience: {
                id: "",
                titre: "",
                etablissement: "",
                dateDebut: "",
                dateFin: "",
                description: "",
                etat: false,
            },
        };

        this.deleteImgRef = React.createRef();
        this.saveRef = React.createRef();
        this.updateCorsusRef = React.createRef();
        this.deleteCorsusRef = React.createRef();
        this.deleteExpRef = React.createRef();
        this.ajoutLangRef = React.createRef();
        this.ajoutSkillRef = React.createRef();
        this.addCorsusRef = React.createRef();
        this.addExpRef = React.createRef();
        this.updateExpRef = React.createRef();
        this.dateFinSelectRef = React.createRef();
        this.dateFinExpSelectRef = React.createRef();
        this.wilayaSelect = React.createRef();
        this.dateNaissanceRef = React.createRef();
    }

    async uploadImg(file) {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "bidswebsite");
        const res = await fetch(
            "https://api.cloudinary.com/v1_1/nimou/image/upload",
            {
                method: "POST",
                body: data,
            }
        );
        const img = await res.json();

        return img.secure_url;
    }

    async handleFileChange(e) {
        const [file] = e.target.files;
        if (!file) return;

        this.setState({ ...this.state, uploadImg: true });
        const uploadedUrl = await this.uploadImg(file);
        const config = {
            headers: {
                "Content-type": "application/json",
            },
        };
        const res = await axios.put(
            "/api/candidats/me",
            { imgURL: uploadedUrl },
            config
        );
        if (res) {
            window.location.reload();
        }
    }

    async componentDidMount() {
        await this.props.loadUser();
        this.setState({
            candidat: {
                ...this.state.candidat,
                id: this.props.candidat._id,
                nom: this.props.candidat.nom ? this.props.candidat.nom : "",
                prenom: this.props.candidat.prenom
                    ? this.props.candidat.prenom
                    : "",
                username: this.props.candidat.username
                    ? this.props.candidat.username
                    : "",
                email: this.props.candidat.email
                    ? this.props.candidat.email
                    : "",
                bio: this.props.candidat.bio ? this.props.candidat.bio : "",
                dateNaissance: this.props.candidat.dateNaissance
                    ? (this.dateNaissanceRef.current.value = moment(
                          new Date(this.props.candidat.dateNaissance)
                      ).format("YYYY-MM-DD"))
                    : "",
                tel: this.props.candidat.tel ? this.props.candidat.tel : "",
                adresse: this.props.candidat.adresse
                    ? this.props.candidat.adresse
                    : "",
                wilaya: this.props.candidat.wilaya
                    ? (this.wilayaSelect.current.value =
                          this.props.candidat.wilaya)
                    : "",
                facebook:
                    this.props.candidat.liens !== undefined
                        ? this.props.candidat.liens.facebook
                            ? this.props.candidat.liens.facebook
                            : ""
                        : "",
                twitter:
                    this.props.candidat.liens !== undefined
                        ? this.props.candidat.liens.twitter
                            ? this.props.candidat.liens.twitter
                            : ""
                        : "",
                linkedin:
                    this.props.candidat.liens !== undefined
                        ? this.props.candidat.liens.linkedin
                            ? this.props.candidat.liens.linkedin
                            : ""
                        : "",
                website:
                    this.props.candidat.liens !== undefined
                        ? this.props.candidat.liens.website
                            ? this.props.candidat.liens.website
                            : ""
                        : "",
            },
        });
    }

    componentDidUpdate() {
        setInterval(() => {
            if (this.updateCorsusRef.current !== null) {
                if (this.updateCorsusRef.current.style.display === "none") {
                    this.setState({
                        candidat: {
                            formation: {
                                ...this.state.candidat.formation,
                                id: "",
                            },
                        },
                    });
                    this.setState({ update: false });
                }
            }
            if (this.updateExpRef.current !== null) {
                if (this.updateExpRef.current.style.display === "none") {
                    this.setState({
                        experience: {
                            ...this.state.experience,
                            id: "",
                        },
                    });
                    this.setState({ update: false });
                }
            }
        }, 500);
    }

    onChange(e) {
        this.setState((prevState) => ({
            candidat: {
                ...prevState.candidat,
                [e.target.name]: e.target.value,
            },
        }));
    }

    onSubmit() {
        const newVal = this.state.candidat;
        const oldVal = this.props.candidat;
        newVal.id = oldVal._id;
        if (
            newVal.nom !== oldVal.nom ||
            newVal.prenom !== oldVal.prenom ||
            newVal.username !== oldVal.username ||
            newVal.email !== oldVal.email ||
            newVal.tel !== oldVal.tel ||
            newVal.adresse !== oldVal.adresse ||
            newVal.wilaya !== oldVal.wilaya ||
            newVal.bio !== oldVal.bio ||
            newVal.dateNaissance !== oldVal.dateNaissance ||
            newVal.facebook !== oldVal.liens.facebook ||
            newVal.twitter !== oldVal.liens.website ||
            newVal.linkedin !== oldVal.liens.website ||
            newVal.website !== oldVal.liens.website
        ) {
            this.props.update(newVal);
            setTimeout(() => {
                /* window.location.reload() */
                this.props.loadUser();
                this.saveRef.current.style.display = "none";
            }, 2550);
        }
    }

    onSubmitLangue(e) {
        e.preventDefault();
        const langue = {
            langue: this.state.candidat.langue.langue,
            niveau: this.state.candidat.langue.niveau,
        };
        this.props.addLangue(langue);
        setTimeout(() => window.location.reload(), 2500);
    }

    onSubmitCompetance(e) {
        e.preventDefault();
        const competance = {
            competance: this.state.candidat.competance.competance,
            niveau: this.state.candidat.competance.niveau,
        };
        this.props.addCompetance(competance);
        setTimeout(() => window.location.reload(), 2500);
    }

    renderUpdateForm() {
        return (
            <CorsusFormUpdate
                reference={this.updateCorsusRef}
                formation={this.state.candidat.formation}
                key={this.state.candidat.formation.id}
            />
        );
    }

    renderUpdateFormExp() {
        return (
            <ExpFormUpdate
                reference={this.updateExpRef}
                experience={this.state.experience}
                key={this.state.experience.id}
            />
        );
    }

    renderLevel() {
        const optArray = [];

        optArray.push(<option key={0}></option>);
        for (let i = 1; i <= 6; i++) {
            optArray.push(<option key={i}>{i}</option>);
        }
        return optArray;
    }

    renderLangues() {
        const arrayLangues = [];
        arrayLangues.push(<option key={0} value="DEFAULT"></option>);
        langues.forEach((langue) => {
            let exist = false;
            this.props.candidat.langue.forEach((lg) => {
                if (lg.langue === langue.langue) {
                    exist = true;
                }
            });
            if (!exist) {
                arrayLangues.push(
                    <option key={langue.id} value={langue.langue}>
                        {langue.langue}
                    </option>
                );
            }
        });
        return arrayLangues;
    }

    renderWilaya() {
        const arrayWilaya = [];
        arrayWilaya.push(<option key={0} value="DEFAULT"></option>);
        wilayas.forEach((wilaya) => {
            arrayWilaya.push(
                <option
                    key={wilaya.code}
                    value={wilaya.code}
                >{`${wilaya.code} - ${wilaya.wilaya}`}</option>
            );
        });
        return arrayWilaya;
    }

    renderYears() {
        const arrayYears = [];
        let year = 2010;
        arrayYears.push(<option key="0" value="DEFAULT"></option>);
        while (year < 2050) {
            arrayYears.push(
                <option key={year} value={year}>
                    {year}
                </option>
            );
            year++;
        }
        return arrayYears;
    }

    renderedLangueList() {
        const arrayOut = [];
        let i = 0;
        this.props.candidat.langue.forEach((elt) => {
            arrayOut.push(
                <SkillLangBox
                    key={i}
                    langId={elt._id}
                    type="lang"
                    title={elt.langue}
                    level={elt.niveau}
                />
            );
            i++;
        });

        return arrayOut;
    }

    renderedCompetanceList() {
        const arrayOut = [];
        let i = 0;
        this.props.candidat.competance.forEach((elt) => {
            arrayOut.push(
                <SkillLangBox
                    key={i}
                    langId={elt._id}
                    type="skill"
                    title={elt.competance}
                    level={elt.niveau}
                />
            );
            i++;
        });
        return arrayOut;
    }

    renderCorsusBox() {
        const arrayOut = [];
        let i = 0;
        this.props.candidat.formation.forEach((elt) => {
            arrayOut.push(
                <div key={i} className="corsus-handler">
                    <CorsusBox
                        foramtionId={elt._id}
                        title={elt.titre}
                        college={elt.etablissement}
                        start={elt.dateDebut}
                        end={
                            elt.etat === true
                                ? "Jusqu'a maintenat"
                                : elt.dateFin
                        }
                    />
                    <div className="actions">
                        <FontAwesomeIcon
                            icon={["fas", "edit"]}
                            onClick={() => {
                                this.setState({
                                    update: true,
                                    candidat: {
                                        formation: {
                                            id: elt._id,
                                            titre: elt.titre,
                                            etablissement: elt.etablissement,
                                            dateDebut: elt.dateDebut,
                                            dateFin: elt.dateFin,
                                            etat: elt.etat,
                                        },
                                    },
                                });
                            }}
                        />
                        <FontAwesomeIcon
                            icon={["fas", "trash-alt"]}
                            onClick={() => {
                                this.setState({
                                    candidat: {
                                        formation: {
                                            ...this.state.candidat.formation,
                                            id: elt._id,
                                        },
                                    },
                                });

                                this.deleteCorsusRef.current.style.display =
                                    "flex";
                            }}
                        />
                    </div>
                </div>
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
                <div key={i} className="exp-handler">
                    <WorkBox
                        title={elt.titre}
                        workplace={elt.etablissement}
                        start={elt.dateDebut}
                        end={
                            elt.etat === true
                                ? "Jusqu'a maintenat"
                                : elt.dateFin
                        }
                        review={elt.description}
                    />
                    <div className="actions">
                        <FontAwesomeIcon
                            icon={["fas", "edit"]}
                            onClick={() => {
                                this.setState({
                                    update: true,
                                    experience: {
                                        id: elt._id,
                                        titre: elt.titre,
                                        etablissement: elt.etablissement,
                                        description: elt.description,
                                        dateDebut: elt.dateDebut,
                                        dateFin: elt.dateFin,
                                        etat: elt.etat,
                                    },
                                });
                            }}
                        />
                        <FontAwesomeIcon
                            icon={["fas", "trash-alt"]}
                            onClick={() => {
                                this.setState({
                                    experience: {
                                        ...this.state.experience,
                                        id: elt._id,
                                    },
                                });
                                this.deleteExpRef.current.style.display =
                                    "flex";
                            }}
                        />
                    </div>
                </div>
            );
            i++;
        });
        return arrayOut;
    }

    renderSettingsBox() {
        if (this.state.tab === "profil") {
            return (
                <div className="info-profil">
                    <h4>
                        <FontAwesomeIcon icon={["fas", "info-circle"]} />
                        Informations personnelles
                    </h4>
                    <hr />
                    <div className="img-box">
                        <img src={this.props.candidat.avatar} alt="Avater" />
                        <div className="img-edit">
                            {/* <button className="upload">Changer</button> */}
                            <input
                                type="file"
                                name="file"
                                id="file"
                                className="upload"
                                onChange={(e) => this.handleFileChange(e)}
                            />
                            <label htmlFor="file">Changer</label>
                            <button
                                className="remove"
                                onClick={() => {
                                    this.deleteImgRef.current.style.display =
                                        "flex";
                                }}
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                    <form>
                        <div className="bio">
                            <label>Bio</label>
                            <textarea
                                defaultValue={this.state.candidat.bio}
                                name="bio"
                                onSelect={() => this.forceUpdate()}
                                onChange={(e) => this.onChange(e)}
                            ></textarea>
                        </div>
                        <div className="parent-box">
                            <div className="info-box">
                                <label>Nom</label>
                                <input
                                    type="text"
                                    name="nom"
                                    onSelect={() => this.forceUpdate()}
                                    onChange={(e) => this.onChange(e)}
                                    defaultValue={this.state.candidat.nom}
                                />
                            </div>
                            <div className="info-box">
                                <label>Prénom</label>
                                <input
                                    type="text"
                                    name="prenom"
                                    onSelect={() => this.forceUpdate()}
                                    onChange={(e) => this.onChange(e)}
                                    defaultValue={this.state.candidat.prenom}
                                />
                            </div>
                            <div className="info-box">
                                <label>Nom d'utilisateur</label>
                                <input
                                    type="text"
                                    name="username"
                                    onSelect={() => this.forceUpdate()}
                                    onChange={(e) => this.onChange(e)}
                                    defaultValue={this.state.candidat.username}
                                />
                            </div>
                            <div className="info-box">
                                <label>E-mail</label>
                                <input
                                    type="text"
                                    name="email"
                                    onSelect={() => this.forceUpdate()}
                                    onChange={(e) => this.onChange(e)}
                                    defaultValue={this.state.candidat.email}
                                />
                            </div>
                            <div className="info-box">
                                <label>Téléphone</label>
                                <input
                                    type="text"
                                    onSelect={() => this.forceUpdate()}
                                    name="tel"
                                    onChange={(e) => this.onChange(e)}
                                    defaultValue={this.state.candidat.tel}
                                    maxLength="10"
                                    onKeyPress={(event) => {
                                        if (!/[0-9]/.test(event.key)) {
                                            event.preventDefault();
                                        }
                                    }}
                                />
                            </div>
                            <div className="info-box">
                                <label>Adresse</label>
                                <input
                                    type="text"
                                    onSelect={() => this.forceUpdate()}
                                    name="adresse"
                                    onChange={(e) => this.onChange(e)}
                                    defaultValue={this.state.candidat.adresse}
                                />
                            </div>
                            <div className="info-box">
                                <label>Wilaya</label>
                                <select
                                    name="wilaya"
                                    ref={this.wilayaSelect}
                                    onSelect={() => this.forceUpdate()}
                                    onChange={(e) => this.onChange(e)}
                                    defaultValue={this.state.candidat.wilaya}
                                >
                                    {this.renderWilaya()}
                                </select>
                            </div>
                            <div className="info-box">
                                <label>Date de naissance</label>
                                <input
                                    ref={this.dateNaissanceRef}
                                    type="date"
                                    onSelect={() => this.forceUpdate()}
                                    name="sateNaissance"
                                    onChange={(e) => {
                                        this.setState((prevState) => ({
                                            candidat: {
                                                ...prevState.candidat,
                                                dateNaissance: moment(
                                                    e.target.value
                                                ).format("MM-DD-YYYY"),
                                            },
                                        }));
                                    }}
                                    defaultValue={moment(
                                        new Date(
                                            this.state.candidat.dateNaissance
                                        )
                                    ).format("YYYY-MM-DD")}
                                />
                            </div>
                        </div>
                    </form>
                    <button
                        className="save"
                        onClick={() => {
                            this.forceUpdate();
                            this.saveRef.current.style.display = "flex";
                        }}
                    >
                        <FontAwesomeIcon icon={["far", "save"]} />
                        Enregistrer
                    </button>
                </div>
            );
        } else if (this.state.tab === "securite") {
            return (
                <div className="info-securite">
                    <h4>
                        <FontAwesomeIcon icon={["fas", "shield-alt"]} />
                        Protection du compte
                    </h4>
                    <hr />
                    <form>
                        <div className="parent-box">
                            <div className="info-box">
                                <label>Ancien mot de passe</label>
                                <input
                                    type="password"
                                    name="oldPassword"
                                    onChange={(e) => this.onChange(e)}
                                />
                            </div>
                            <div className="info-box">
                                <label>Nouveau mot de passe</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    onChange={(e) => this.onChange(e)}
                                />
                            </div>
                        </div>
                    </form>
                    <button
                        className="save"
                        onClick={() => {
                            this.forceUpdate();
                            this.saveRef.current.style.display = "flex";
                        }}
                    >
                        {/* <i className="far fa-save"></i> */}
                        <FontAwesomeIcon icon={["far", "save"]} />
                        Enregistrer
                    </button>
                </div>
            );
        } else if (this.state.tab === "corsus") {
            return (
                <div className="info-corsus">
                    <CorsusForm
                        formation={this.state.candidat.formation}
                        reference={this.addCorsusRef}
                    />
                    <h4>
                        <FontAwesomeIcon icon={["fas", "user-graduate"]} />
                        Cursus
                    </h4>
                    <hr />
                    <button
                        className="add-btn"
                        onClick={() => {
                            ReactDOM.findDOMNode(
                                this.addCorsusRef.current
                            ).style.display = "flex";
                        }}
                    >
                        <FontAwesomeIcon icon={["fas", "plus-circle"]} />
                        Ajouter
                    </button>

                    {this.renderCorsusBox()}
                </div>
            );
        } else if (this.state.tab === "experience") {
            return (
                <div className="info-exp">
                    <ExpForm
                        experience={this.state.experience}
                        reference={this.addExpRef}
                    />
                    <h4>
                        <FontAwesomeIcon icon={["fas", "briefcase"]} />
                        Experiences
                    </h4>
                    <hr />
                    <button
                        className="add-btn"
                        onClick={() => {
                            this.addExpRef.current.style.display = "flex";
                        }}
                    >
                        <FontAwesomeIcon icon={["fas", "plus-circle"]} />
                        Ajouter
                    </button>

                    {this.renderExpBox()}
                </div>
            );
        } else if (this.state.tab === "langues") {
            return (
                <div className="info-lang">
                    <div className="ajout-lang" ref={this.ajoutLangRef}>
                        <div className="ajout-lang-container">
                            <div
                                className="close-tab"
                                onClick={() => {
                                    this.ajoutLangRef.current.style.display =
                                        "none";
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </div>
                            <h4>Ajouter une langue</h4>
                            <hr />
                            <Alert />
                            <form>
                                <label>Langue</label>
                                <select
                                    onChange={(e) =>
                                        this.setState({
                                            candidat: {
                                                langue: {
                                                    ...this.state.candidat
                                                        .langue,
                                                    langue: e.target.value,
                                                },
                                            },
                                        })
                                    }
                                >
                                    {this.renderLangues()}
                                </select>
                                <label>Niveau</label>
                                <select
                                    onChange={(e) =>
                                        this.setState({
                                            candidat: {
                                                langue: {
                                                    ...this.state.candidat
                                                        .langue,
                                                    niveau: e.target.value,
                                                },
                                            },
                                        })
                                    }
                                >
                                    {this.renderLevel()}
                                </select>
                                <button
                                    onClick={(e) => {
                                        this.onSubmitLangue(e);
                                    }}
                                >
                                    Ajouter
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="lang-box">
                        <h4>
                            <FontAwesomeIcon icon={["fas", "language"]} />
                            Langues
                        </h4>
                        <hr />

                        {this.renderedLangueList()}

                        <button
                            className="add-btn"
                            onClick={() => {
                                this.ajoutLangRef.current.style.display =
                                    "flex";
                            }}
                        >
                            <FontAwesomeIcon icon={["fas", "plus-circle"]} />
                            Ajouter
                        </button>
                    </div>

                    <div className="ajout-skill" ref={this.ajoutSkillRef}>
                        <div className="ajout-skill-container">
                            <div
                                className="close-tab"
                                onClick={() => {
                                    this.ajoutSkillRef.current.style.display =
                                        "none";
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </div>
                            <h4>Ajouter une compétance</h4>
                            <hr />
                            <Alert />
                            <form>
                                <label>Compétance</label>
                                <input
                                    type="text"
                                    onChange={(e) =>
                                        this.setState({
                                            candidat: {
                                                competance: {
                                                    ...this.state.candidat
                                                        .competance,
                                                    competance: e.target.value,
                                                },
                                            },
                                        })
                                    }
                                />
                                <label>Niveau</label>
                                <select
                                    type="text"
                                    onChange={(e) =>
                                        this.setState({
                                            candidat: {
                                                competance: {
                                                    ...this.state.candidat
                                                        .competance,
                                                    niveau: e.target.value,
                                                },
                                            },
                                        })
                                    }
                                >
                                    {this.renderLevel()}
                                </select>
                                <button
                                    onClick={(e) => {
                                        this.onSubmitCompetance(e);
                                    }}
                                >
                                    Ajouter
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="skill-box">
                        <h4>
                            <FontAwesomeIcon icon={["fas", "wrench"]} />
                            Compétances
                        </h4>
                        <hr />

                        {this.renderedCompetanceList()}
                        <button
                            className="add-btn"
                            onClick={() => {
                                this.ajoutSkillRef.current.style.display =
                                    "flex";
                            }}
                        >
                            <FontAwesomeIcon icon={["fas", "plus-circle"]} />
                            Ajouter
                        </button>
                    </div>
                </div>
            );
        } else if (this.state.tab === "coordonnées") {
            return (
                <div className="info-contact">
                    <h4>
                        <FontAwesomeIcon icon={["fas", "poll-h"]} />
                        Coordonnées
                    </h4>
                    <hr />
                    <div className="social-box">
                        <form>
                            <label>
                                <i className="fab fa-facebook-square"></i>
                                Facebook
                            </label>
                            <input
                                type="text"
                                name="facebook"
                                onChange={(e) => this.onChange(e)}
                                defaultValue={this.state.candidat.facebook}
                            />
                            <label>
                                <i className="fab fa-twitter-square"></i>
                                Twitter
                            </label>
                            <input
                                type="text"
                                name="twitter"
                                onChange={(e) => this.onChange(e)}
                                defaultValue={this.state.candidat.twitter}
                            />
                            <label>
                                <i className="fab fa-linkedin"></i>
                                Linkedin
                            </label>
                            <input
                                type="text"
                                name="linkedin"
                                onChange={(e) => this.onChange(e)}
                                defaultValue={this.state.candidat.linkedin}
                            />
                            <label>
                                <i className="fas fa-globe"></i>
                                Site web
                            </label>
                            <input
                                type="text"
                                name="website"
                                onChange={(e) => this.onChange(e)}
                                defaultValue={this.state.candidat.website}
                            />
                        </form>
                        <button
                            className="save"
                            onClick={() => {
                                this.saveRef.current.style.display = "flex";
                            }}
                        >
                            <FontAwesomeIcon icon={["far", "save"]} />
                            Enregistrer
                        </button>
                    </div>
                </div>
            );
        }
    }
    render() {
        return this.props.candidat ? (
            <div className="settings">
                <div className="delete-img" ref={this.deleteImgRef}>
                    <div className="delete-img-container">
                        <h4 className="text-center">Avertissement</h4>
                        <hr />
                        <p>Voulez-vous vraiment supprimer ?</p>
                        <div className="buttons-container">
                            <button
                                onClick={async () => {
                                    const config = {
                                        headers: {
                                            "Content-type": "application/json",
                                        },
                                    };
                                    const res = await axios.put(
                                        "/api/candidats/me",
                                        { imgURL: null },
                                        config
                                    );
                                    if (res) {
                                        window.location.reload();
                                    }
                                }}
                            >
                                Oui
                            </button>
                            <button
                                onClick={() => {
                                    this.deleteImgRef.current.style.display =
                                        "none";
                                }}
                            >
                                Non
                            </button>
                        </div>
                    </div>
                </div>
                <div className="save-handler" ref={this.saveRef}>
                    <div className="save-container">
                        <Alert />
                        <h4 className="text-center">
                            <i className="far fa-save"></i>
                        </h4>
                        <hr />
                        <p>voulez-vous enregistrer les changements ?</p>
                        <div className="buttons-container">
                            <button onClick={() => this.onSubmit()}>Oui</button>
                            <button
                                onClick={() => {
                                    this.saveRef.current.style.display = "none";
                                }}
                            >
                                Non
                            </button>
                        </div>
                    </div>
                </div>
                {this.state.candidat.formation &&
                this.state.candidat.formation.id !== "" &&
                this.state.update
                    ? this.renderUpdateForm()
                    : null}
                {this.state.experience.id !== "" && this.state.update
                    ? this.renderUpdateFormExp()
                    : null}
                <div className="delete-corsus" ref={this.deleteCorsusRef}>
                    <div className="delete-corsus-container">
                        <h4 className="text-center">Avertissement</h4>
                        <hr />
                        <p>Voulez-vous vraiment supprimer ?</p>
                        <div className="buttons-container">
                            <button
                                onClick={() => {
                                    this.props.deleteFormation(
                                        this.state.candidat.formation.id
                                    );
                                    window.location.reload();
                                }}
                            >
                                Oui
                            </button>
                            <button
                                onClick={() => {
                                    /* this.setState({
                                        candidat: {
                                            formation: {
                                                ...this.state.candidat
                                                    .formation,
                                                id: "",
                                            },
                                        },
                                    }); */
                                    this.deleteCorsusRef.current.style.display =
                                        "none";
                                }}
                            >
                                Non
                            </button>
                        </div>
                    </div>
                </div>
                <div className="delete-corsus" ref={this.deleteExpRef}>
                    <div className="delete-corsus-container">
                        <h4 className="text-center">Avertissement</h4>
                        <hr />
                        <p>Voulez-vous vraiment supprimer ?</p>
                        <div className="buttons-container">
                            <button
                                onClick={() => {
                                    this.props.deleteExperience(
                                        this.state.experience.id
                                    );
                                    window.location.reload();
                                }}
                            >
                                Oui
                            </button>
                            <button
                                onClick={() => {
                                    this.setState({
                                        experience: {
                                            ...this.state.experience,
                                            id: "",
                                        },
                                    });
                                    this.deleteExpRef.current.style.display =
                                        "none";
                                }}
                            >
                                Non
                            </button>
                        </div>
                    </div>
                </div>
                <DasshboardNav />
                <div className="settings-content">
                    <div className="container">
                        <h2>Parametres</h2>
                        <div className="big-box slower animate__animated animate__zoomIn">
                            <div className="row">
                                <div className="choices col-md-4">
                                    <ul className="list-unstyled">
                                        <li
                                            key="profil"
                                            onClick={() =>
                                                this.setState({
                                                    tab: "profil",
                                                })
                                            }
                                        >
                                            Profil
                                        </li>
                                        <li
                                            key="securite"
                                            onClick={() =>
                                                this.setState({
                                                    tab: "securite",
                                                })
                                            }
                                        >
                                            Sécurité
                                        </li>
                                        <li
                                            key="corsus"
                                            onClick={() =>
                                                this.setState({
                                                    tab: "corsus",
                                                })
                                            }
                                        >
                                            Cursus
                                        </li>
                                        <li
                                            key="experience"
                                            onClick={() =>
                                                this.setState({
                                                    tab: "experience",
                                                })
                                            }
                                        >
                                            Experiences
                                        </li>
                                        <li
                                            key="langues"
                                            onClick={() => {
                                                this.setState({
                                                    tab: "langues",
                                                });
                                            }}
                                        >
                                            Langues & Compétances
                                        </li>
                                        <li
                                            key="coordonnées"
                                            onClick={() =>
                                                this.setState({
                                                    tab: "coordonnées",
                                                })
                                            }
                                        >
                                            Coordonnées
                                        </li>
                                    </ul>
                                </div>
                                <div className="infos col-md-8">
                                    {this.renderSettingsBox()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null;
    }
}

SettingsPage.propTypes = {
    update: PropTypes.func.isRequired,
    addLangue: PropTypes.func.isRequired,
    addCompetance: PropTypes.func.isRequired,
    addFormation: PropTypes.func.isRequired,
    updateFormation: PropTypes.func.isRequired,
    deleteFormation: PropTypes.func.isRequired,
    addExperience: PropTypes.func.isRequired,
    updateExperience: PropTypes.func.isRequired,
    deleteExperience: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    candidat: state.auth.user,
});

export default connect(mapStateToProps, {
    update,
    addLangue,
    addCompetance,
    addFormation,
    updateFormation,
    deleteFormation,
    addExperience,
    updateExperience,
    deleteExperience,
    loadUser,
})(SettingsPage);
