import React from "react";
import Navbar from "../../helpers/Navbar";
import Footer from "../../helpers/Footer";
import Alert from "../../helpers/Alert";
import axios from "axios";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";

import "./ContactPage.css";

class ContactPage extends React.Component {
    state = { nom: "", prenom: "", email: "", message: "" };

    onChange(e) {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
    }

    async onSubmit(e) {
        e.preventDefault();
        if (
            this.state.nom !== "" &&
            this.state.prenom !== "" &&
            this.state.email !== "" &&
            this.state.message !== ""
        ) {
            const config = { headers: { "Content-type": "application/json" } };
            const body = {
                nom: this.state.nom,
                prenom: this.state.prenom,
                email: this.state.email,
                message: this.state.message,
            };
            const res = await axios.post("/send", body, config);
            if (res.data.status === "success") {
                this.props.setAlert("Message envoyé", "success", 1500);
            } else {
                this.props.setAlert("Erreur", "danger", 1500);
            }
            this.setState({ nom: "", prenom: "", email: "", message: "" });
        } else {
            this.props.setAlert("Champs vides", "danger", 1500);
        }
    }

    render() {
        return (
            <div className="contact-page">
                <Navbar />
                <div className="content">
                    <div className="container">
                        <h2 className="text-center">Contactez-nous</h2>
                        <p className="text-center">
                            Pour tous vos questions, laissez nous un message.
                        </p>
                        <form name="EmailForm">
                            <label>Nom</label>
                            <input
                                type="text"
                                name="nom"
                                value={this.state.nom}
                                onChange={(e) => this.onChange(e)}
                            />
                            <label>Prenom</label>
                            <input
                                type="text"
                                name="prenom"
                                value={this.state.prenom}
                                onChange={(e) => this.onChange(e)}
                            />
                            <label>E-mail</label>
                            <input
                                type="email"
                                name="email"
                                value={this.state.email}
                                onChange={(e) => this.onChange(e)}
                            />
                            <label>Message</label>
                            <textarea
                                name="message"
                                value={this.state.message}
                                onChange={(e) => this.onChange(e)}
                            ></textarea>
                            <Alert />
                            <button
                                value="Submit"
                                onClick={(e) => this.onSubmit(e)}
                            >
                                Envoyer
                            </button>
                        </form>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default connect(null, { setAlert })(ContactPage);
