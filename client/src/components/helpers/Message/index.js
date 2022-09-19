import React from "react";
import { connect } from "react-redux";
import { getCandidat } from "../../actions/candidat";
import { loadEntreprise } from "../../actions/auth";
import { format } from "timeago.js";

import "./Message.css";

class Message extends React.Component {
    state = { user: null };

    async componentDidMount() {
        if (this.props.sender) {
            if (this.props.sender.userType === "Candidat") {
                const res = await this.props.getCandidat(
                    this.props.sender.userId
                );
                this.setState({ user: res.data });
            } else {
                const res = await this.props.loadEntreprise(
                    this.props.sender.userId
                );
                this.setState({ user: res.data });
            }
        }
        this.props.scroll();
    }

    render() {
        return this.state.user ? (
            <div className={`message ${this.props.owner ? "float-true" : ""}`}>
                <div className="holder">
                    {this.props.owner ? (
                        <>
                            <div
                                style={{ textAlign: "left" }}
                                className={`message-text ${
                                    !this.props.owner ? "colored" : ""
                                }`}
                            >
                                {this.props.message}
                            </div>
                            <div
                                style={{ marginLeft: "10px", marginRight: "0" }}
                                className="message-owner-img"
                            >
                                <img
                                    style={{ border: "1px solid #ccc" }}
                                    src={this.state.user.avatar}
                                    alt="avatar"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="message-owner-img">
                                <img
                                    style={{ border: "1px solid #FF8C00" }}
                                    src={this.state.user.avatar}
                                    alt="avatar"
                                />
                            </div>
                            <div
                                className={`message-text ${
                                    !this.props.owner ? "colored" : ""
                                }`}
                            >
                                {this.props.message}
                            </div>
                        </>
                    )}
                </div>
                <div
                    className={`message-date ${
                        this.props.owner ? "text-right" : ""
                    } `}
                >
                    {format(this.props.messageDate)}
                </div>
            </div>
        ) : null;
    }
}

export default connect(null, { getCandidat, loadEntreprise })(Message);
