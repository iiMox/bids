import React from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import { connect } from "react-redux";
import axios from "axios";
import Message from "../Message";
import { io } from "socket.io-client";
import { getCandidat } from "../../actions/candidat";
import { loadEntreprise } from "../../actions/auth";

import "./MessageForm.css";
import { store } from "../../store";

class MessageForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: null,
            currentConversationId: "",
            newMessage: "",
            socket: null,
            arrivalMessage: null,
            isLoaded: false,
        };
        this.msgBody = React.createRef();
        this.msg = React.createRef();
        this.scrolltobottom = this.scrolltobottom.bind(this);
    }
    async componentDidMount() {
        if (this.state.socket === null) {
            this.setState({
                ...this.state,
                socket: io.connect(
                    /* "ws://localhost:8900" */ "https://travail-plateforme.herokuapp.com"
                ),
            });
        }

        setInterval(async () => {
            if (this.props.currentConversation.currentConversation !== null) {
                if (
                    this.state.currentConversationId !==
                    this.props.currentConversation.currentConversation._id
                ) {
                    this.setState({ ...this.state, isLoaded: false });
                    if (this.props.currentConversation.currentConversation) {
                        try {
                            const res = await axios.get(
                                `/api/messages/${this.props.currentConversation.currentConversation._id}`
                            );
                            this.setState({
                                ...this.state,
                                messages: res.data,
                                currentConversationId:
                                    this.props.currentConversation
                                        .currentConversation._id,
                                isLoaded: true,
                            });
                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            }
        }, 500);
    }

    async componentDidUpdate(prevProp, prevState) {
        this.state.socket.on("getMessage", async (data) => {
            if (this.state.arrivalMessage === null) {
                this.setState({
                    ...this.state,
                    arrivalMessage: {
                        _id: Math.random(),
                        sender: {
                            userId: data.senderId,
                            userType: data.senderType,
                        },
                        text: data.text,
                        createdAt: Date.now(),
                    },
                });
                let res;
                if (data.senderType === "Candidat") {
                    res = await this.props.getCandidat(data.senderId);
                } else {
                    res = await this.props.loadEntreprise(data.senderId);
                }
                store.dispatch({
                    type: "SET_CURRENT_CONVERSATION",
                    payload: {
                        currentConversation: data.conversation,
                        currentUser: this.props.user,
                        friendUser: res.data,
                    },
                });
            }
        });
        if (this.props.user !== prevProp.user) {
            this.state.socket.emit("addUser", this.props.user?._id);
            this.state.socket.on("getUsers", (users) => {});
        }
        if (
            this.state.arrivalMessage !== prevState.arrivalMessage ||
            this.state.currentConversationId !== prevState.currentConversationId
        ) {
            this.state.arrivalMessage &&
                this.props.currentConversation?.currentUser?._id !==
                    this.state.arrivalMessage.sender &&
                this.setState({
                    ...this.state,
                    messages: [
                        ...this.state.messages,
                        this.state.arrivalMessage,
                    ],
                    arrivalMessage: "",
                });
            ReactDOM.findDOMNode(this.props.reference.current).style.display =
                "block";
            this.msg.current?.scrollIntoView({
                behavior: "smooth",
            });
        }
        this.msg.current?.scrollIntoView({
            behavior: "smooth",
        });
    }

    scrolltobottom() {
        this.msg.current?.scrollIntoView({
            behavior: "smooth",
        });
    }

    renderMessages() {
        const messagesArray = [];

        this.state.messages?.forEach((message) => {
            messagesArray.push(
                <div
                    key={message._id}
                    ref={this.msg}
                    style={{ overflow: "hidden" /* , minHeight: "50px" */ }}
                >
                    <Message
                        message={message.text}
                        messageDate={message.createdAt}
                        sender={message.sender}
                        owner={
                            this.props.user._id === message.sender.userId
                                ? true
                                : false
                        }
                        scroll={this.scrolltobottom}
                    />
                </div>
            );
        });

        return messagesArray.length !== 0 ? (
            messagesArray
        ) : (
            <div
                style={{
                    color: "#5d5d5d",
                    height: "100%",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    paddingBottom: "10px",
                }}
            >
                Commencez la conversation...
            </div>
        );
    }

    async sendMessage() {
        const message = {
            conversationId: this.state.currentConversationId,
            sender: {
                userId: this.props.user._id,
                userType: this.props.userType,
            },
            text: this.state.newMessage,
        };

        this.state.socket.emit("sendMessage", {
            senderId: this.props.user._id,
            senderType: this.props.userType,
            recieverId: this.props.currentConversation.friendUser._id,
            text: this.state.newMessage,
            conversation: this.props.currentConversation.currentConversation,
        });

        try {
            const res = await axios.post("/api/messages", message);
            this.setState({
                ...this.state,
                messages: [...this.state.messages, res.data],
            });
            this.setState({ ...this.state, newMessage: "" });
            const config = { headers: { "Content-type": "application/json" } };
            let body = null;
            if (this.props.userType === "Candidat") {
                body = {
                    destinationId:
                        this.props.currentConversation.friendUser._id,
                    notificationType: "newMessage",
                    extra: this.props.user._id,
                };
                await axios.put(`api/entreprises/notifications`, body, config);
            } else {
                body = {
                    destinationId:
                        this.props.currentConversation.friendUser._id,
                    notificationType: "newMessage",
                    originId: this.props.user._id,
                    originType: "Entreprise",
                    extra: this.props.user._id,
                };
                await axios.put(`api/candidats/notifications`, body, config);
            }
            await axios.put(
                `/api/conversations/${this.props.currentConversation.currentConversation._id}`
            );
            this.props.onSubmit();
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        return this.props.currentConversation.friendUser ? (
            <div className="message-form">
                <div className="form-header">
                    <img
                        src={this.props.currentConversation.friendUser.avatar}
                        alt="avatr"
                    />
                    <h6>{this.props.currentConversation.friendUser.nom}</h6>
                    <span
                        className="close-icon"
                        onClick={() => {
                            $(".message-form").parent()[0].style.display =
                                "none";
                        }}
                    >
                        <i className="fas fa-times"></i>
                    </span>
                </div>
                <div className="form-content">
                    <div
                        className="messages-body"
                        ref={(el) => {
                            this.msgBody = el;
                        }}
                    >
                        {/* {this.state.messages !== null ? (
                            this.renderMessages()
                        ) : (
                            <div>En cours...</div>
                        )} */}
                        {this.state.isLoaded ? (
                            this.state.messages.length !== 0 ? (
                                this.state.messages.map((message) => {
                                    return (
                                        <div
                                            key={message._id}
                                            ref={this.msg}
                                            style={{
                                                overflow:
                                                    "hidden" /* , minHeight: "50px" */,
                                            }}
                                        >
                                            <Message
                                                message={message.text}
                                                messageDate={message.createdAt}
                                                sender={message.sender}
                                                owner={
                                                    this.props.user._id ===
                                                    message.sender.userId
                                                        ? true
                                                        : false
                                                }
                                                scroll={this.scrolltobottom}
                                            />
                                        </div>
                                    );
                                })
                            ) : (
                                <div
                                    style={{
                                        color: "#5d5d5d",
                                        display: "flex",
                                        paddingBottom: "10px",
                                        alignItems: "flex-end",
                                        justifyContent: "center",
                                        height: "100%",
                                    }}
                                >
                                    Commencer la discussion...
                                </div>
                            )
                        ) : (
                            <div
                                style={{
                                    color: "#5d5d5d",
                                    textAlign: "center",
                                    lineHeight: "299px",
                                }}
                            >
                                En cours...
                            </div>
                        )}
                    </div>
                    <form>
                        <input
                            className="msg-input"
                            value={this.state.newMessage}
                            type="text"
                            onChange={(e) => {
                                this.setState({
                                    ...this.state,
                                    newMessage: e.target.value,
                                });
                            }}
                        />
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                this.sendMessage();
                            }}
                        >
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
            </div>
        ) : null;
    }
}

const mapStateToProps = (state) => ({
    currentConversation: state.conversations,
    user: state.auth.user,
    userType: state.auth.accountType,
});

export default connect(mapStateToProps, { getCandidat, loadEntreprise })(
    MessageForm
);
