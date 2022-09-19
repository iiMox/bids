import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { getCandidat } from "../../actions/candidat";
import { loadEntreprise } from "../../actions/auth";
import { store } from "../../store";
import { format } from "timeago.js";

import "./MessageBox.css";

class MessageBox extends React.Component {
    state = { user: null };

    async componentDidMount() {
        const friend = this.props.conversation.members.find(
            (m) =>
                m.userId !== this.props.currentUser._id &&
                m.userType !== this.props.currentUserType
        );
        if (friend.userType === "Candidat") {
            const res = await this.props.getCandidat(friend.userId);
            this.setState({ user: res?.data });
        } else {
            const res = await this.props.loadEntreprise(friend.userId);
            this.setState({ user: res?.data });
        }
    }

    render() {
        return this.state.user ? (
            <div
                className={`message-box ${
                    this.props.lastMessage ? "" : "padding"
                }`}
                onClick={() => {
                    ReactDOM.findDOMNode(
                        this.props.reference.current
                    ).style.display = "block";
                    /*  setTimeout(() => {
                        var elem = document.querySelector(".messages-body");
                        if (elem !== null) {
                            elem.scrollTop = elem.scrollHeight;
                        }
                    }, 1000); */
                    /* $(".message-box")
                        .parent()
                        .parent()[0].children[3].style.display = "block"; */
                    /* console.log(
                        $(".message-box").parent().parent()[0].children[3]
                    ); */
                    store.dispatch({
                        type: "SET_CURRENT_CONVERSATION",
                        payload: {
                            currentConversation: this.props.conversation,
                            currentUser: this.props.currentUser,
                            friendUser: this.state.user,
                        },
                    });
                }}
            >
                <div className="left-side">
                    <div className="img-box">
                        <img src={this.state.user.avatar} alt="avatar" />
                    </div>
                    <div className="middle-side">
                        <h6>
                            {this.props.userType === "Candidat"
                                ? `${this.state.user.nom} ${this.state.user.prenom}`
                                : this.state.user.nom}
                        </h6>
                        <p>
                            {this.props.lastMessage
                                ? this.props.lastMessage
                                : ""}
                        </p>
                    </div>
                </div>
                <div className="date-side">
                    <span>
                        {this.props.date ? format(this.props.date) : null}
                    </span>
                </div>
            </div>
        ) : null;
    }
}

export default connect(null, { getCandidat, loadEntreprise })(MessageBox);
