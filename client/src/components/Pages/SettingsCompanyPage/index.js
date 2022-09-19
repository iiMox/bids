import React from "react";
import DashboardNavEntreprise from "../../helpers/DashboardNavEntreprise";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { update } from "../../actions/entreprise";
import { loadUser } from "../../actions/auth";
import Alert from "../../helpers/Alert";
import axios from "axios";

import "./SettingsCompanyPage.css";
import categories from "../../helpers/categories.json";
import wilayas from "../../helpers/wilayas.json";

class SettingsCompanyPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tab: "profil",
            uploadImg: false,
            entreprise: {
                id: "",
                nom: "",
                email: "",
                bio: "",
                description: "",
                tel: "",
                adresse: "",
                wilaya: "",
                categorie: "",
                facebook: "",
                twitter: "",
                linkedin: "",
                contactEmail: "",
                website: "",
                oldPassword: "",
                newPassword: "",
            },
        };

        this.deleteImgRef = React.createRef();
        this.saveRef = React.createRef();
        this.catSelect = React.createRef();
        this.wilayaSelect = React.createRef();
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
            "/api/entreprises/me",
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
            entreprise: {
                id: this.props.entreprise._id,
                nom: this.props.entreprise.nom ? this.props.entreprise.nom : "",
                email: this.props.entreprise.email
                    ? this.props.entreprise.email
                    : "",
                bio: this.props.entreprise.bio ? this.props.entreprise.bio : "",
                description: this.props.entreprise.description
                    ? this.props.entreprise.description
                    : "",
                tel: this.props.entreprise.tel ? this.props.entreprise.tel : "",
                adresse: this.props.entreprise.adresse
                    ? this.props.entreprise.adresse
                    : "",
                wilaya: this.props.entreprise.wilaya
                    ? (this.wilayaSelect.current.value =
                          this.props.entreprise.wilaya)
                    : "",
                categorie: this.props.entreprise.categorie
                    ? (this.catSelect.current.value =
                          this.props.entreprise.categorie)
                    : "",
                facebook:
                    this.props.entreprise.liens !== undefined
                        ? this.props.entreprise.liens.facebook
                            ? this.props.entreprise.liens.facebook
                            : ""
                        : "",
                twitter:
                    this.props.entreprise.liens !== undefined
                        ? this.props.entreprise.liens.twitter
                            ? this.props.entreprise.liens.twitter
                            : ""
                        : "",
                linkedin:
                    this.props.entreprise.liens !== undefined
                        ? this.props.entreprise.liens.linkedin
                            ? this.props.entreprise.liens.linkedin
                            : ""
                        : "",
                contactEmail:
                    this.props.entreprise.liens !== undefined
                        ? this.props.entreprise.liens.contactEmail
                            ? this.props.entreprise.liens.contactEmail
                            : ""
                        : "",
                website:
                    this.props.entreprise.liens !== undefined
                        ? this.props.entreprise.liens.website
                            ? this.props.entreprise.liens.website
                            : ""
                        : "",
            },
        });
    }

    onChange(e) {
        this.setState({
            entreprise: {
                ...this.state.entreprise,
                [e.target.name]: e.target.value,
            },
        });
    }

    onSubmit() {
        this.props.update(this.state.entreprise);
        setTimeout(() => {
            /* window.location.reload(false) */
            this.props.loadUser();
            this.saveRef.current.style.display = "none";
        }, 2550);
    }

    renderCategories() {
        const arrayOut = [];
        arrayOut.push(<option key={0} value="DEFAULT"></option>);
        categories.forEach((categorie) => {
            arrayOut.push(
                <option key={categorie.id} value={categorie.id}>
                    {categorie.cat}
                </option>
            );
        });
        return arrayOut;
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
                        <img src={this.props.entreprise.avatar} alt="Avater" />
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
                                name="bio"
                                onChange={(e) => this.onChange(e)}
                                onSelect={() => this.forceUpdate()}
                                defaultValue={this.state.entreprise.bio}
                            ></textarea>
                            <label>Description</label>
                            <textarea
                                name="description"
                                onChange={(e) => this.onChange(e)}
                                onSelect={() => this.forceUpdate()}
                                defaultValue={this.state.entreprise.description}
                            ></textarea>
                        </div>
                        <div className="parent-box">
                            <div className="info-box">
                                <label>Nom d'entreprise</label>
                                <input
                                    type="text"
                                    name="nom"
                                    onChange={(e) => this.onChange(e)}
                                    onSelect={() => this.forceUpdate()}
                                    defaultValue={this.state.entreprise.nom}
                                />
                            </div>

                            <div className="info-box">
                                <label>E-mail</label>
                                <input
                                    type="text"
                                    name="email"
                                    onChange={(e) => this.onChange(e)}
                                    onSelect={() => this.forceUpdate()}
                                    defaultValue={this.state.entreprise.email}
                                />
                            </div>
                            <div className="info-box">
                                <label>Téléphone</label>
                                <input
                                    type="text"
                                    name="tel"
                                    onChange={(e) => this.onChange(e)}
                                    onSelect={() => this.forceUpdate()}
                                    defaultValue={this.state.entreprise.tel}
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
                                    name="adresse"
                                    onChange={(e) => this.onChange(e)}
                                    onSelect={() => this.forceUpdate()}
                                    defaultValue={this.state.entreprise.adresse}
                                />
                            </div>
                            <div className="info-box">
                                <label>Wilaya</label>
                                <select
                                    ref={this.wilayaSelect}
                                    name="wilaya"
                                    onChange={(e) => this.onChange(e)}
                                    onSelect={() => this.forceUpdate()}
                                    defaultValue={this.state.entreprise.wilaya}
                                >
                                    {this.renderWilaya()}
                                </select>
                            </div>
                            <div className="info-box">
                                <label>Catégorie</label>
                                <select
                                    ref={this.catSelect}
                                    name="categorie"
                                    onChange={(e) => this.onChange(e)}
                                    onSelect={() => this.forceUpdate()}
                                    defaultValue={
                                        this.state.entreprise.categorie
                                    }
                                >
                                    {this.renderCategories()}
                                </select>
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
                        <i className="far fa-save"></i>
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
                        <i className="far fa-save"></i>
                        Enregistrer
                    </button>
                </div>
            );
        } else if (this.state.tab === "contact") {
            return (
                <div className="info-contact">
                    <h4>
                        <FontAwesomeIcon icon={["fas", "poll-h"]} />
                        Contact
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
                                onSelect={() => this.forceUpdate()}
                                defaultValue={this.state.entreprise.facebook}
                            />
                            <label>
                                <i className="fab fa-twitter-square"></i>
                                Twitter
                            </label>
                            <input
                                type="text"
                                name="twitter"
                                onChange={(e) => this.onChange(e)}
                                onSelect={() => this.forceUpdate()}
                                defaultValue={this.state.entreprise.twitter}
                            />
                            <label>
                                <i className="fab fa-linkedin"></i>
                                Linkedin
                            </label>
                            <input
                                type="text"
                                name="linkedin"
                                onChange={(e) => this.onChange(e)}
                                onSelect={() => this.forceUpdate()}
                                defaultValue={this.state.entreprise.linkedin}
                            />
                            <label>
                                <i className="fas fa-envelope"></i>
                                Support e-mail
                            </label>
                            <input
                                type="text"
                                name="contactEmail"
                                onChange={(e) => this.onChange(e)}
                                onSelect={() => this.forceUpdate()}
                                defaultValue={
                                    this.state.entreprise.contactEmail
                                }
                            />
                            <label>
                                <i className="fas fa-globe"></i>
                                Site web
                            </label>
                            <input
                                type="text"
                                name="website"
                                onChange={(e) => this.onChange(e)}
                                onSelect={() => this.forceUpdate()}
                                defaultValue={this.state.entreprise.website}
                            />
                        </form>
                        <button
                            className="save"
                            onClick={() => {
                                this.forceUpdate();
                                this.saveRef.current.style.display = "flex";
                            }}
                        >
                            <i className="far fa-save"></i>
                            Enregistrer
                        </button>
                    </div>
                </div>
            );
        }
    }

    render() {
        return this.props.entreprise ? (
            <div className="settings-company">
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
                                        "/api/entreprises/me",
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
                            <button
                                onClick={() => {
                                    this.onSubmit();
                                }}
                            >
                                Oui
                            </button>
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
                <DashboardNavEntreprise />
                <div className="settings-content">
                    <div className="container">
                        <h2>Parametres</h2>
                        <div className="big-box slower animate__animated animate__zoomIn">
                            <div className="row">
                                <div className="choices col-md-4">
                                    <ul className="list-unstyled">
                                        <li
                                            onClick={() =>
                                                this.setState({ tab: "profil" })
                                            }
                                        >
                                            Profil
                                        </li>
                                        <li
                                            onClick={() =>
                                                this.setState({
                                                    tab: "securite",
                                                })
                                            }
                                        >
                                            Sécurité
                                        </li>
                                        <li
                                            onClick={() =>
                                                this.setState({
                                                    tab: "contact",
                                                })
                                            }
                                        >
                                            Contact
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

const mapStateToProps = (state) => ({
    entreprise: state.auth.user,
});

export default connect(mapStateToProps, { update, loadUser })(
    SettingsCompanyPage
);
