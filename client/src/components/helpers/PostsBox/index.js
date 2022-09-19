import React from "react";
import "./PostsBox.css";
import { connect } from "react-redux";
import { getCandidat } from "../../actions/candidat";
import { addCommentaire } from "../../actions/postes";
import CommentaireBox from "../CommentaireBox";
import moment from "moment";
import Alert from "../Alert";
import axios from "axios";

class PostsBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            candidat: null,
            commentaire: {
                idPoste: "",
                idCandidat: "",
                commentaire: "",
                dateCommentaire: moment(new Date()).format("DD-MM-YYYY HH:mm"),
            },
        };

        this.addCommentRef = React.createRef();
    }

    async componentDidMount() {
        const res = await this.props.getCandidat(this.props.candidatId);
        this.setState({
            candidat: res.data,
            commentaire: {
                ...this.state.commentaire,
                idPoste: this.props.idPost,
                idCandidat: this.props.candidat._id,
            },
        });
    }

    renderCommentaires() {
        const commentairesArray = [];
        this.props.commentaires.forEach((commentaire) => {
            commentairesArray.push(
                <CommentaireBox
                    key={commentaire._id}
                    posteId={this.props.idPost}
                    commentaireId={commentaire._id}
                    candidatId={commentaire.candidat}
                    commentaire={commentaire.commentaire}
                    date={commentaire.dateCommentaire}
                />
            );
        });
        return commentairesArray;
    }

    async submitCommentaire(e) {
        e.preventDefault();

        const commentaire = {
            idPoste: this.state.commentaire.idPoste,
            idCandidat: this.state.commentaire.idCandidat,
            commentaire: this.state.commentaire.commentaire,
            dateCommentaire: this.state.commentaire.dateCommentaire,
        };
        const res = await this.props.addCommentaire(commentaire);
        const config = {
            headers: {
                "Content-type": "application/json",
            },
        };
        const body = {
            destinationId: this.props.candidatId,
            notificationType: "ajoutCommentaire",
            originId: this.props.candidat._id,
            originType: "Candidat",
            extra: this.state.commentaire.idPoste,
        };
        try {
            await axios.put(`api/candidats/notifications`, body, config);
        } catch (err) {
            console.log(err);
        }
        if (res) {
            setInterval(() => window.location.reload(), 2550);
        }
    }

    render() {
        return this.state.candidat ? (
            <div className="post-box">
                <div className="header">
                    <div className="img-box">
                        <img src={this.state.candidat.avatar} alt="avatar" />
                    </div>
                    <div className="posted-by">
                        Posté par{" "}
                        {`${this.state.candidat.nom} ${this.state.candidat.prenom}`}
                    </div>
                    <div className="post-date">{this.props.datePosté}</div>
                </div>
                <div className="post-content">
                    <h5>{this.props.titre}</h5>
                    <hr />
                    <p>{this.props.contenu}</p>
                </div>
                {this.props.seeMore ? (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <div style={{ display: "inline-block" }}>
                            Commentaires ({this.props.commentaires.length})
                        </div>
                        {this.props.guest ? (
                            ""
                        ) : (
                            <button
                                onClick={() => {
                                    window.open(
                                        `/candidat/forum/${this.props.posteId}`
                                    );
                                }}
                            >
                                Voir plus
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="comment-section">
                        <h4>
                            Commentaires ({this.props.commentaires.length})
                            <button
                                className="add-comment"
                                onClick={(e) => {
                                    this.submitCommentaire(e);
                                }}
                            >
                                <i className="fas fa-plus"></i>
                            </button>
                        </h4>
                        <Alert />
                        <form ref={this.addCommentRef}>
                            <textarea
                                placeholder="Commentaire..."
                                onChange={(e) => {
                                    this.setState({
                                        commentaire: {
                                            ...this.state.commentaire,
                                            commentaire: e.target.value,
                                        },
                                    });
                                }}
                            ></textarea>
                        </form>
                        <hr />
                        {this.renderCommentaires()}
                    </div>
                )}
            </div>
        ) : null;
    }
}

const mapStateToProps = (state) => ({
    candidat: state.auth.user,
});

export default connect(mapStateToProps, { getCandidat, addCommentaire })(
    PostsBox
);
