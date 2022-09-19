import React from "react";
import $ from "jquery";
import MessageBox from "../MessageBox";
import axios from "axios";
import { connect } from "react-redux";

import "./MessageSidePanel.css";
import MessageForm from "../MessageForm";

class MessageSidePanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            conversations: [],
            lastMessages: [],
            isLoaded: false,
            empty: true,
        };

        this.messageForm = React.createRef();

        this.reloadLastMessage = this.reloadLastMessage.bind(this);
    }

    componentDidMount() {
        setTimeout(async () => {
            try {
                if (this.props.user) {
                    const res = await axios.get(
                        `/api/conversations/${this.props.userType}/${this.props.user._id}`
                    );
                    this.setState({
                        ...this.state,
                        conversations: res.data,
                        isLoaded: true,
                    });
                }
            } catch (err) {
                console.log(err);
            }
            this.state.conversations.map(async (conversation) => {
                try {
                    const res = await axios.get(
                        `/api/messages/${conversation._id}`
                    );
                    this.setState({
                        ...this.state,
                        isLoaded: true,
                        lastMessages: [
                            ...this.state.lastMessages,
                            res.data[res.data.length - 1],
                        ],
                    });
                } catch (err) {
                    console.log(err);
                }
            });
        }, 1000);
    }

    filterMessages(e) {
        const children = $(".messages-box").children();
        for (let i = 0; i < children.length; i++) {
            if (children[i].children[0] !== undefined) {
                const name = children[i].children[0].children[1].children[0];
                if (
                    name.textContent
                        .toUpperCase()
                        .indexOf(e.target.value.toUpperCase()) > -1
                ) {
                    children[i].style.display = "";
                } else {
                    children[i].style.display = "none";
                }
            }
        }
    }

    renderMessagesBox() {
        const boxArray = [];

        if (this.state.conversations.length !== 0) {
            this.state.conversations.forEach((conversation) => {
                for (let i = 0; i < this.state.lastMessages.length; i++) {
                    if (this.state.lastMessages[i]) {
                        if (
                            this.state.lastMessages[i].conversationId ===
                            conversation._id
                        ) {
                            boxArray.push(
                                <MessageBox
                                    key={conversation._id}
                                    conversation={conversation}
                                    currentUser={this.props.user}
                                    currentUserType={this.props.userType}
                                    reference={this.messageForm}
                                    lastMessage={
                                        this.state.lastMessages[i]
                                            ? this.state.lastMessages[i].text
                                            : null
                                    }
                                    date={
                                        this.state.lastMessages[i]
                                            ? this.state.lastMessages[i]
                                                  .createdAt
                                            : null
                                    }
                                />
                            );
                        }
                    }
                }
            });
        }

        return boxArray.length !== 0 ? (
            boxArray
        ) : (
            <div style={{ textAlign: "center", color: "#5d5d5d" }}>
                Pas de conversation
            </div>
        );
    }

    async reloadLastMessage() {
        this.setState({
            conversations: [],
            lastMessages: [],
            isLoaded: false,
        });
        try {
            if (this.props.user) {
                const res = await axios.get(
                    `/api/conversations/${this.props.userType}/${this.props.user._id}`
                );
                this.setState({ ...this.state, conversations: res.data });
            }
        } catch (err) {
            console.log(err);
        }
        this.state.conversations.map(async (conversation) => {
            try {
                const res = await axios.get(
                    `/api/messages/${conversation._id}`
                );
                this.setState({
                    ...this.state,
                    isLoaded: true,
                    lastMessages: [
                        ...this.state.lastMessages,
                        res.data[res.data.length - 1],
                    ],
                });
            } catch (err) {
                console.log(err);
            }
        });
    }

    render() {
        return (
            <div className="message-panel">
                <div
                    className="header"
                    onClick={() => {
                        $(".message-panel .body").toggleClass("show");
                    }}
                >
                    <h4>Messagerie </h4>
                </div>
                <div className="body">
                    <form>
                        <input
                            type="text"
                            placeholder="Chercher..."
                            onKeyUp={(e) => {
                                this.filterMessages(e);
                            }}
                        />
                        <div className="search-icon">
                            <i className="fas fa-search"></i>
                        </div>
                    </form>
                    <hr />
                    <div className="messages-box">
                        {this.state.isLoaded ? (
                            this.state.conversations.length !== 0 ? (
                                this.state.conversations.map((conversation) => {
                                    for (
                                        let i = 0;
                                        i < this.state.lastMessages.length;
                                        i++
                                    ) {
                                        if (this.state.lastMessages[i]) {
                                            if (this.state.empty) {
                                                this.setState({
                                                    ...this.state,
                                                    empty: false,
                                                });
                                            }
                                            if (
                                                this.state.lastMessages[i]
                                                    .conversationId ===
                                                conversation._id
                                            ) {
                                                return (
                                                    <MessageBox
                                                        key={conversation._id}
                                                        conversation={
                                                            conversation
                                                        }
                                                        currentUser={
                                                            this.props.user
                                                        }
                                                        currentUserType={
                                                            this.props.userType
                                                        }
                                                        reference={
                                                            this.messageForm
                                                        }
                                                        lastMessage={
                                                            this.state
                                                                .lastMessages[i]
                                                                ? this.state
                                                                      .lastMessages[
                                                                      i
                                                                  ].text
                                                                : null
                                                        }
                                                        date={
                                                            this.state
                                                                .lastMessages[i]
                                                                ? this.state
                                                                      .lastMessages[
                                                                      i
                                                                  ].createdAt
                                                                : null
                                                        }
                                                    />
                                                );
                                            }
                                        }
                                    }
                                    return null;
                                })
                            ) : (
                                <div
                                    style={{
                                        textAlign: "center",
                                        color: "#5d5d5d",
                                        marginTop: "20px",
                                    }}
                                >
                                    Pas de conversations
                                </div>
                            )
                        ) : (
                            <div
                                style={{
                                    textAlign: "center",
                                    color: "#5d5d5d",
                                    marginTop: "20px",
                                }}
                            >
                                En cours...
                            </div>
                        )}
                        {this.state.empty &&
                        this.state.conversations.length !== 0 ? (
                            <div
                                style={{
                                    textAlign: "center",
                                    color: "#5d5d5d",
                                    marginTop: "20px",
                                }}
                            >
                                Pas de conversations
                            </div>
                        ) : null}
                    </div>
                    <div
                        className="message-fomr-handler"
                        ref={this.messageForm}
                        style={{ display: "none" }}
                    >
                        <MessageForm
                            onSubmit={this.reloadLastMessage}
                            reference={this.messageForm}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    userType: state.auth.accountType,
});

export default connect(mapStateToProps)(MessageSidePanel);
