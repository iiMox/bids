import React from "react";
import Navbar from "../Navbar";
import $ from "jquery";

import "./Slider.css";

class Slider extends React.Component {
    state = { term: "" };

    componentDidMount() {
        $(".slider").innerHeight($(window).innerHeight());
        $(".header").innerHeight(
            $(".slider").innerHeight() - $("nav").innerHeight()
        );
    }

    render() {
        return (
            <>
                <div className="slider">
                    <div className="overlay">
                        <Navbar />
                        <div className="container">
                            <div className="header">
                                <h1>Vous cherchez un travail ?</h1>
                                <p>
                                    C'est très simple, just tapez ce que vous
                                    cherchez
                                </p>
                                <form>
                                    <input
                                        type="text"
                                        value={this.state.term}
                                        onChange={(e) => {
                                            this.setState({
                                                term: e.target.value,
                                            });
                                        }}
                                        placeholder="Titre de poste, competance, entreprise..."
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.open(
                                                `/offres/?${this.state.term}`
                                            );
                                        }}
                                    >
                                        Rechercher
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Slider;
