import React from "react";
import Navbar from "../../helpers/Navbar";
import Footer from "../../helpers/Footer";
import OffreBox from "../../helpers/OffreBox";
import $ from "jquery";

import "./OffersPage.css";
import { connect } from "react-redux";

class OffersPage extends React.Component {
    componentDidMount() {
        window.scrollTo(0, 0);
        setTimeout(() => {
            if (window.location.search !== "") {
                this.filterSearch(window.location.search.substring(1));
            }
        }, 500);
    }

    renderMyOffres() {
        const myOffresArray = [];
        this.props.offres.forEach((offre) => {
            if (offre.etat === "Actif") {
                myOffresArray.push(<OffreBox key={offre._id} offre={offre} />);
            }
        });
        return myOffresArray.length !== 0 ? (
            myOffresArray
        ) : (
            <div style={{ textAlign: "center" }}>Pas d'offres disponibles</div>
        );
    }

    filterSearch(value) {
        const children = $(".offres-holder").children();

        for (let i = 0; i < children.length; i++) {
            const name = children[i].children[0].children[0].children[1];
            const title = children[i].children[0].children[1].children[0];

            if (
                name.textContent.toUpperCase().indexOf(value.toUpperCase()) >
                    -1 ||
                title.textContent.toUpperCase().indexOf(value.toUpperCase()) >
                    -1
            ) {
                children[i].style.display = "";
            } else {
                children[i].style.display = "none";
            }
        }
    }

    render() {
        return (
            <div className="offers-page">
                <Navbar />
                <div className="content">
                    <div className="container">
                        <h2 className="text-center">Les offres disponible</h2>
                        <form>
                            <input
                                onKeyUp={(e) => {
                                    this.filterSearch(e.target.value);
                                }}
                                type="text"
                                placeholder="Titre, compétance, entreprise..."
                            />
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                }}
                            >
                                Chercher
                            </button>
                        </form>
                        <div className="offres-holder">
                            {this.renderMyOffres()}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    offres: state.offres.offres,
});

export default connect(mapStateToProps)(OffersPage);
