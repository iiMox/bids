import React from "react";
import { connect } from "react-redux";
import { getCandidat } from "../../actions/candidat";
import { deleteCommentaire, updateCommentaire } from "../../actions/postes";
import $ from "jquery";

import "./CommentaireBox.css";

class CommentaireBox extends React.Component {
    state = { candidat: null, bordered: false, commetaire: "" };
    async componentDidMount() {
        const res = await this.props.getCandidat(this.props.candidatId);
        this.setState({
            ...this.state,
            candidat: res.data,
            commetaire: this.props.commentaire,
        });

        $(document).on("click", (e) => {
            if (
                $(e.target).is(`#commentaire${this.props.commentaireId}`) ===
                false
            ) {
                this.setState({ ...this.state, bordered: false });
            } else {
                this.setState({ ...this.state, bordered: true });
            }
        });
    }
    render() {
        return this.state.candidat && this.props.candidat ? (
            <div className="comment">
                <div className="row">
                    <div className="img-box col-md-1">
                        <img src={this.state.candidat.avatar} alt="avatar" />
                    </div>
                    <div className="side-content col-md-11">
                        <h6>
                            {this.state.candidat._id === this.props.candidat._id
                                ? "Moi"
                                : `${this.state.candidat.nom} ${this.state.candidat.prenom}`}
                            {this.state.candidat._id ===
                            this.props.candidat._id ? (
                                <div className="actions-div">
                                    <span
                                        onClick={async () => {
                                            if (
                                                this.state.commetaire !==
                                                $(
                                                    `#commentaire${this.props.commentaireId}`
                                                ).text()
                                            ) {
                                                const poste = {
                                                    idPoste: this.props.posteId,
                                                    idCommentaire:
                                                        this.props
                                                            .commentaireId,
                                                    commentaire: $(
                                                        `#commentaire${this.props.commentaireId}`
                                                    ).text(),
                                                };
                                                const res =
                                                    await this.props.updateCommentaire(
                                                        poste
                                                    );
                                                if (res) {
                                                    setInterval(() => {
                                                        window.location.reload();
                                                    }, 2550);
                                                }
                                            }
                                        }}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </span>
                                    <span
                                        onClick={async () => {
                                            const poste = {
                                                idPoste: this.props.posteId,
                                                idCommentaire:
                                                    this.props.commentaireId,
                                            };
                                            const res =
                                                await this.props.deleteCommentaire(
                                                    poste
                                                );
                                            if (res) {
                                                setInterval(() => {
                                                    window.location.reload();
                                                }, 1000);
                                            }
                                        }}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </span>
                                </div>
                            ) : null}
                        </h6>
                        <hr />
                        {this.state.candidat._id === this.props.candidat._id ? (
                            <p
                                id={`commentaire${this.props.commentaireId}`}
                                contentEditable
                                suppressContentEditableWarning={true}
                                className={
                                    this.state.bordered ? "bordered" : ""
                                }
                            >
                                {this.props.commentaire}
                            </p>
                        ) : (
                            <p id={`commentaire${this.props.commentaireId}`}>
                                {this.props.commentaire}
                            </p>
                        )}

                        <div className="date-posted">{this.props.date}</div>
                    </div>
                </div>
            </div>
        ) : null;
    }
}

const mapStateToProps = (state) => ({
    candidat: state.auth.user,
});

export default connect(mapStateToProps, {
    getCandidat,
    deleteCommentaire,
    updateCommentaire,
})(CommentaireBox);
