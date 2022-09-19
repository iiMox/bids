import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { deleteLangue, deleteCompetance } from "../../actions/candidat";

import "./SkillLangBox.css";

class SkilllangBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = { show: false };
        this.OverlayRef = React.createRef();
        this.deleteBoxRef = React.createRef();
    }

    componentDidUpdate() {
        if (this.state.show) {
            this.OverlayRef.current.classList.add("active");
        } else {
            this.OverlayRef.current.classList.remove("active");
        }
    }

    levelGenerator() {
        const spans = [];
        for (var i = 1; i <= this.props.level; i++) {
            spans.push(<span key={i} className="level-orange-bar"></span>);
        }
        for (i; i <= 6; i++) {
            spans.push(<span key={i} className="level-white-bar"></span>);
        }
        return spans;
    }

    render() {
        return (
            <div className="skill-lang-box">
                <div className="delete-box" ref={this.deleteBoxRef}>
                    <div className="delete-box-container">
                        <h4 className="text-center">Avertissement</h4>
                        <hr />
                        <p>Êtes-vous sûr de vouloir vous la supprimer ?</p>
                        <div className="buttons-container">
                            <button
                                onClick={() => {
                                    this.props.type === "lang"
                                        ? this.props.deleteLangue(
                                              this.props.langId
                                          )
                                        : this.props.deleteCompetance(
                                              this.props.langId
                                          );
                                    window.location.reload();
                                }}
                            >
                                Oui
                            </button>
                            <button
                                onClick={() => {
                                    this.deleteBoxRef.current.style.display =
                                        "none";
                                }}
                            >
                                Non
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    className="title"
                    onMouseEnter={() => this.setState({ show: true })}
                    onMouseLeave={() => this.setState({ show: false })}
                >
                    <div
                        className="overlay"
                        ref={this.OverlayRef}
                        onClick={() => {
                            this.deleteBoxRef.current.style.display = "flex";
                        }}
                    >
                        <FontAwesomeIcon icon={["fas", "trash-alt"]} />
                    </div>
                    {this.props.title}
                    <div className="level">{this.levelGenerator()}</div>
                </div>
            </div>
        );
    }
}

export default connect(null, { deleteLangue, deleteCompetance })(SkilllangBox);
