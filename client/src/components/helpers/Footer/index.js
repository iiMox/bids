import React from "react";
import { Link } from "react-router-dom";
import Copyright from "../Copyright";

import "./Footer.css";

import logoImg from "../../../images/logo2.svg";

const Footer = () => {
    return (
        <>
            <footer>
                <div className="container">
                    <div className="useful-links">
                        <div className="row">
                            <div className="desc col-md-4">
                                <img src={logoImg} alt="LOGO" />
                                <p>
                                    Nous sommes une entreprise qui aide les gens
                                    dans le processus de recherche de travail.
                                </p>
                                <div className="social"></div>
                            </div>
                            <div className="links col-md-4">
                                <h4>Liens utiles</h4>
                                <ul className="list-unstyled">
                                    <li>
                                        <Link to="/"></Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="newsletter col-md-4">
                                <h4>Abonnez-vous</h4>
                                <p>N'hésitez pas a s'inscrire au Newsletter</p>
                                <form>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="for-control"
                                    />

                                    <button className="float-right">
                                        S'abonner
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                <Copyright />
            </footer>
        </>
    );
};

export default Footer;
