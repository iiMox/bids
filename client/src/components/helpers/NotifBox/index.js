import React from "react";
import { format } from "timeago.js";
import { connect } from "react-redux";
import { getCandidat } from "../../actions/candidat";
import { loadEntreprise } from "../../actions/auth";
import axios from "axios";
import $ from "jquery";
import { store } from "../../store";
import history from "../../../history";

import "./NotifBox.css";

class NotifBox extends React.Component {
    state = { user: null, islaoded: false };

    async componentDidMount() {
        let res;
        if (this.props.originType === "Candidat") {
            res = await this.props.getCandidat(this.props.originId);
        } else {
            res = await this.props.loadEntreprise(this.props.originId);
        }
        this.setState({ ...this.state, user: res?.data, islaoded: true });
    }

    whatToRender() {
        if (this.props.notifType === "newMessage") {
            return (
                <>
                    <span>{this.state.user.nom}</span> vous a envoyé un message
                </>
            );
        } else if (this.props.notifType === "newDemande") {
            return (
                <>
                    <span>{this.state.user.nom}</span> a postulé pour votre
                    offre
                </>
            );
        } else if (this.props.notifType === "ajoutOffre") {
            return (
                <>
                    <span>{this.state.user.nom}</span> a ajouté une offre
                </>
            );
        } else if (this.props.notifType === "acceptationDemande") {
            return (
                <>
                    <span>{this.state.user.nom}</span> a accepté votre demande
                </>
            );
        } else if (this.props.notifType === "ajoutCommentaire") {
            return (
                <>
                    <span>{this.state.user.nom}</span> a commenté sur votre
                    publication
                </>
            );
        }
        return;
    }

    render() {
        return this.state.islaoded && this.state.user ? (
            <div
                className={`notif-box ${this.props.seen ? "seen" : ""}`}
                onClick={async (e) => {
                    document.querySelector(".notif-box");
                    try {
                        const res = await axios.put(
                            `api/${this.props.type}/notifications/${this.props.notifId}`
                        );
                        if (res) {
                            if ($(e.target).parent().hasClass("notif-box")) {
                                $(e.target).parent().addClass("seen");
                            } else {
                                $(e.target).parent().parent().addClass("seen");
                            }
                        }
                    } catch (err) {
                        console.log(err);
                    }
                    if (this.props.notifType === "newMessage") {
                        const conversation = await axios.get(
                            `/api/conversations/${this.props.userType}/${this.props.user._id}/${this.props.extraInfo}`
                        );

                        if (conversation.data.length !== 0) {
                            let res;
                            if (this.props.userType === "Candidat") {
                                res = await this.props.loadEntreprise(
                                    this.props.extraInfo
                                );
                            } else {
                                res = await this.props.getCandidat(
                                    this.props.extraInfo
                                );
                            }
                            store.dispatch({
                                type: "SET_CURRENT_CONVERSATION",
                                payload: {
                                    currentConversation: conversation.data[0],
                                    currentUser: this.props.user,
                                    friendUser: res.data,
                                },
                            });
                            document.querySelector(
                                ".message-fomr-handler"
                            ).style.display = "block";
                        }
                    } else if (this.props.notifType === "newDemande") {
                        history.push("/entreprise/offres");
                    } else if (this.props.notifType === "ajoutOffre") {
                        window.open(`/candidat/offre/${this.props.extraInfo}`);
                    } else if (this.props.notifType === "ajoutCommentaire") {
                        window.open(`/candidat/forum/${this.props.extraInfo}`);
                    }
                }}
            >
                <div className="notif-body">{this.whatToRender()}</div>
                <div className="notif-date">{format(this.props.date)}</div>
            </div>
        ) : null;
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    userType: state.auth.accountType,
});

export default connect(mapStateToProps, { getCandidat, loadEntreprise })(
    NotifBox
);
