import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";

import "./Navbar.css";

import logoImg from "../../../images/logo.svg";

const handleScroll = () => {
    if (window.scrollY !== 0) {
        $("nav").addClass("scrolled");
    } else if (window.scrollY === 0) {
        $("nav").removeClass("scrolled");
    }
};

const Navbar = () => {
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <nav className="navbar-expand-lg fixed-top">
                <div className="container">
                    <div className="row">
                        <div className="logo col-md-3 col-sm-6">
                            <span>
                                <Link to="/">
                                    <img src={logoImg} alt="LOGO" />
                                </Link>
                            </span>
                        </div>
                        <button
                            className="navbar-toggler float-right"
                            type="button"
                            data-toggle="collapse"
                            data-target="#navbarSupportedContent"
                            aria-controls="navbarSupportedContent"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <span className="navbar-toggler-icon">
                                <ul className="list-unstyled">
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                </ul>
                            </span>
                        </button>
                        <div
                            className="links col-md-9 float-right collapse navbar-collapse"
                            id="navbarSupportedContent"
                        >
                            <ul className="list-unstyled">
                                <li>
                                    <Link to="/">
                                        <span>Accueil</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/offres">
                                        <span>Offres</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/forum">
                                        <span>Forum</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/contact">
                                        <span>Contact</span>
                                    </Link>
                                </li>
                            </ul>
                            <Link to="/authentification/inscrire">
                                <button>S'inscrire</button>
                            </Link>
                            <Link to="/authentification/connexion">
                                <button>Connexion</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
