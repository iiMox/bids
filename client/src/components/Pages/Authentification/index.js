import React from "react";
import { connect } from "react-redux";
import $ from "jquery";
import { Link } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import { register, login } from "../../actions/auth";
import PropTypes from "prop-types";
import Alert from "../../helpers/Alert";
import history from "../../../history";
import { store } from "../../store";
import { AUTH_ERROR } from "../../actions/types";

import "./Auth.css";

import logoImg from "../../../images/logo.svg";

class Auth extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            type: this.props.match.params.type,
            registerData: {
                username: "",
                email: "",
                password: "",
                password2: "",
                accountType: "Candidat",
            },
            loginData: {
                email: "",
                password: "",
                accountType: "Candidat",
            },
        };

        this.switchOverlay = React.createRef();
    }

    onChange(e) {
        if (this.state.type === "inscrire") {
            this.setState({
                registerData: {
                    ...this.state.registerData,
                    [e.target.name]: e.target.value,
                },
            });
        } else {
            this.setState({
                loginData: {
                    ...this.state.loginData,
                    [e.target.name]: e.target.value,
                },
            });
        }
    }

    onSubmit = async (e) => {
        e.preventDefault();
        if (this.state.type === "inscrire") {
            if (
                this.state.registerData.password !==
                this.state.registerData.password2
            ) {
                this.props.setAlert(
                    "Vérifier les deux mots de passe",
                    "danger"
                );
            } else {
                this.props.register({
                    username: this.state.registerData.username,
                    email: this.state.registerData.email,
                    password: this.state.registerData.password,
                    accountType: this.state.registerData.accountType,
                });
            }
        } else {
            this.props.login({
                email: this.state.loginData.email,
                password: this.state.loginData.password,
                accountType: this.state.loginData.accountType,
            });
        }
    };

    componentDidMount() {
        $(".authentification").innerHeight($(window).innerHeight());
        $(".content").css(
            "min-height",
            $(".authentification").innerHeight() - $(".logo").innerHeight()
        );
        this.positionOverlay();
        store.dispatch({
            type: AUTH_ERROR,
        });
    }

    componentDidUpdate() {
        this.positionOverlay();
        window.history.replaceState(
            null,
            "New Page Title",
            `/authentification/${this.state.type}`
        );
        if (this.props.isAuthenticated) {
            if (this.props.accountType === "Candidat") {
                history.push("/candidat");
            } else if (this.props.accountType === "Entreprise") {
                history.push("/entreprise");
            }
        }
    }

    renderForm() {
        if (this.state.type === "connexion")
            return (
                <div className="box">
                    <h2>Accéder à votre compte</h2>
                    <Alert />
                    <form onSubmit={(e) => this.onSubmit(e)}>
                        <label>E-mail</label>
                        <input
                            type="email"
                            name="email"
                            value={this.state.loginData.email}
                            onChange={(e) => this.onChange(e)}
                            required
                        />
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            value={this.state.loginData.password}
                            onChange={(e) => this.onChange(e)}
                            required
                        />
                        <label>Type</label>
                        <select
                            name="accountType"
                            value={this.state.loginData.accountType}
                            onChange={(e) => this.onChange(e)}
                            required
                        >
                            <option>Candidat</option>
                            <option>Entreprise</option>
                        </select>
                        <button>Connexion</button>
                    </form>
                </div>
            );
        return (
            <div className="box">
                <h2>Créer un compte personnel</h2>
                <Alert />
                <form onSubmit={(e) => this.onSubmit(e)}>
                    <label>
                        Nom{" "}
                        {this.state.registerData.accountType === "Candidat"
                            ? "d'utilisateur"
                            : "de l'entreprise"}
                    </label>
                    <input
                        type="text"
                        name="username"
                        value={this.state.registerData.username}
                        onChange={(e) => this.onChange(e)}
                    />
                    <label>E-mail</label>
                    <input
                        type="email"
                        name="email"
                        value={this.state.registerData.email}
                        onChange={(e) => this.onChange(e)}
                    />
                    <div className="password-box">
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            name="password"
                            value={this.state.registerData.password}
                            onChange={(e) => this.onChange(e)}
                        />
                    </div>
                    <div className="password-box">
                        <label>Confirmer le mot de passe</label>
                        <input
                            type="password"
                            name="password2"
                            value={this.state.registerData.password2}
                            onChange={(e) => this.onChange(e)}
                        />
                    </div>
                    <label>Type</label>
                    <select
                        name="accountType"
                        value={this.state.registerData.accountType}
                        onChange={(e) => this.onChange(e)}
                    >
                        <option>Candidat</option>
                        <option>Entreprise</option>
                    </select>
                    <button>Inscrire</button>
                </form>
            </div>
        );
    }

    positionOverlay() {
        if (this.state.type === "connexion") {
            $(this.switchOverlay.current).css("left", 0);
        } else {
            $(this.switchOverlay.current).css("left", "50%");
        }
    }

    render() {
        return (
            <div className="authentification">
                <div className="logo">
                    <div className="container">
                        <Link to="/">
                            <img src={logoImg} alt="LOGO" />
                        </Link>
                    </div>
                </div>
                <div className="content">
                    <div className="container">
                        <div className="switch">
                            <div
                                className="switch-overlay"
                                ref={this.switchOverlay}
                            ></div>
                            <label
                                onClick={() =>
                                    this.setState({ type: "connexion" })
                                }
                                className={`left text-center ${
                                    this.state.type === "connexion"
                                        ? "active"
                                        : ""
                                }`}
                            >
                                Connexion
                            </label>
                            <label
                                onClick={() =>
                                    this.setState({ type: "inscrire" })
                                }
                                className={`right text-center ${
                                    this.state.type === "inscrire"
                                        ? "active"
                                        : ""
                                }`}
                            >
                                Inscrire
                            </label>
                        </div>
                        {this.renderForm()}
                    </div>
                </div>
            </div>
        );
    }
}

Auth.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    accountType: PropTypes.string,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    accountType: state.auth.accountType,
});

export default connect(mapStateToProps, { setAlert, register, login })(Auth);
