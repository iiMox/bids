import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import { Link } from "react-router-dom";
import $ from "jquery";
import history from "../../../history";

import "./DashboardNav.css";

import logoImg from "../../../images/logo2.svg";
import avatarImg from "../../../images/avatar.png";
import NotifBox from "../NotifBox";

class DashboardNav extends React.Component {
    constructor(props) {
        super(props);

        this.state = { notifications: [], isLoaded: false };

        this.logOutRef = React.createRef();
        this.userNameRef = React.createRef();
        this.dropNotifs = React.createRef();
        this.dropMsgs = React.createRef();
        this.dropListInfo = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
        setInterval(() => {
            this.setState({
                ...this.state,
                notifications: this.props.candidat.notifications.slice(0, 20),
                isLoaded: true,
            });
        }, 1000);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    togglingInfoDrop() {
        if (
            this.dropListInfo.current.style.display === "none" ||
            this.dropListInfo.current.style.display === ""
        ) {
            $(this.dropListInfo.current).slideDown(500);
        }
        $(this.dropMsgs.current).slideUp(500);
        $(this.dropNotifs.current).slideUp(500);
    }

    showingDropMsg() {
        $(this.dropNotifs.current).slideUp(300, () => {
            if (
                this.dropMsgs.current.style.display === "none" ||
                this.dropMsgs.current.style.display === ""
            ) {
                $(this.dropMsgs.current).slideDown(500);
            }
        });
        $(this.dropListInfo.current).slideUp(500);
    }

    showingDropNotifs() {
        $(this.dropListInfo.current).slideUp(500);
        $(this.dropMsgs.current).slideUp(300, () => {
            if (
                this.dropNotifs.current.style.display === "none" ||
                this.dropNotifs.current.style.display === ""
            ) {
                $(this.dropNotifs.current).slideDown(500);
            }
        });
    }

    handleClickOutside(event) {
        if (
            this.dropNotifs &&
            !this.dropNotifs.current.contains(event.target) &&
            this.dropNotifs.current.style.display === "block"
        ) {
            $(this.dropNotifs.current).slideUp(500);
        }

        if (
            this.dropMsgs &&
            !this.dropMsgs.current.contains(event.target) &&
            this.dropMsgs.current.style.display === "block"
        ) {
            $(this.dropMsgs.current).slideUp(500);
        }

        if (
            this.dropListInfo &&
            !this.dropListInfo.current.contains(event.target) &&
            this.dropListInfo.current.style.display === "block"
        ) {
            $(this.dropListInfo.current).slideUp(500);
        }
    }

    handleLogOut() {
        if (this.logOutRef.current.style.display === "none") {
            this.logOutRef.current.style.display = "flex";
        } else {
            this.logOutRef.current.style.display = "none";
        }
        console.log(this.logOutRef.current.style.display);
    }

    renderNbrMsg() {
        let i = 0;
        this.state.notifications.forEach((notif) => {
            if (notif.notificationType === "newMessage" && !notif.isSeen) {
                i++;
            }
        });
        return i;
    }

    renderNbrNotifs() {
        let j = 0;
        this.state.notifications.forEach((notif) => {
            if (notif.notificationType !== "newMessage" && !notif.isSeen) {
                j++;
            }
        });
        return j;
    }

    render() {
        return (
            <div className="dash-nav">
                <div className="logout-container " ref={this.logOutRef}>
                    <div className="logout-box">
                        <div className="text-center icon-container">
                            <i className="fas fa-sign-out-alt"></i>
                        </div>
                        <p>Êtes-vous sûr de vouloir vous déconnecter ?</p>
                        <div className="buttons-container">
                            <button
                                onClick={() => {
                                    this.props.logout();
                                    history.push("/");
                                }}
                            >
                                <i className="fas fa-check"></i>Oui
                            </button>
                            <button
                                onClick={() => {
                                    this.logOutRef.current.style.display =
                                        "none";
                                }}
                            >
                                <i className="fas fa-times"></i>Non
                            </button>
                        </div>
                    </div>
                </div>
                <div className="dash-container">
                    <div className="container">
                        <div className="row">
                            <div className="logo col-md-3">
                                <Link to="/candidat">
                                    <img src={logoImg} alt="LOGO" />
                                </Link>
                            </div>
                            <div className="holder-box col-md-9 text-right">
                                <div className="receive-box">
                                    <div
                                        className="notifications"
                                        onClick={() => this.showingDropNotifs()}
                                    >
                                        <span className="num">
                                            {this.renderNbrNotifs()}
                                        </span>
                                        <i className="fas fa-bell"></i>
                                        <div
                                            className="drop-notif text-left"
                                            ref={this.dropNotifs}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <h6>Notifications</h6>
                                            <hr />
                                            <div className="msg-notifs-body">
                                                {this.state.isLoaded ? (
                                                    this.state.notifications.map(
                                                        (notif) => {
                                                            if (
                                                                notif.notificationType !==
                                                                "newMessage"
                                                            ) {
                                                                return (
                                                                    <NotifBox
                                                                        key={
                                                                            notif._id
                                                                        }
                                                                        notifId={
                                                                            notif._id
                                                                        }
                                                                        type="candidats"
                                                                        originId={
                                                                            notif.originId
                                                                        }
                                                                        originType={
                                                                            notif.originType
                                                                        }
                                                                        date={
                                                                            notif.createdAt
                                                                        }
                                                                        seen={
                                                                            notif.isSeen
                                                                        }
                                                                        notifType={
                                                                            notif.notificationType
                                                                        }
                                                                        extraInfo={
                                                                            notif.extra
                                                                        }
                                                                    />
                                                                );
                                                            }
                                                            return null;
                                                        }
                                                    )
                                                ) : (
                                                    <div>En cours...</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="messages"
                                        onClick={() => {
                                            this.showingDropMsg();
                                        }}
                                    >
                                        <span className="num">
                                            {this.renderNbrMsg()}
                                        </span>
                                        <i className="fas fa-envelope"></i>
                                        <div
                                            className="drop-msg text-left"
                                            ref={this.dropMsgs}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <h6>Messages</h6>
                                            <hr />
                                            <div className="msg-notifs-body">
                                                {this.state.isLoaded ? (
                                                    this.state.notifications.map(
                                                        (notif) => {
                                                            if (
                                                                notif.notificationType ===
                                                                "newMessage"
                                                            ) {
                                                                return (
                                                                    <NotifBox
                                                                        key={
                                                                            notif._id
                                                                        }
                                                                        notifId={
                                                                            notif._id
                                                                        }
                                                                        type="candidats"
                                                                        originId={
                                                                            notif.originId
                                                                        }
                                                                        originType={
                                                                            notif.originType
                                                                        }
                                                                        date={
                                                                            notif.createdAt
                                                                        }
                                                                        seen={
                                                                            notif.isSeen
                                                                        }
                                                                        notifType={
                                                                            notif.notificationType
                                                                        }
                                                                        extraInfo={
                                                                            notif.extra
                                                                        }
                                                                    />
                                                                );
                                                            }
                                                            return null;
                                                        }
                                                    )
                                                ) : (
                                                    <div>En cours...</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="profile ">
                                    <div className="img-box">
                                        <img
                                            src={
                                                this.props.candidat === null
                                                    ? avatarImg
                                                    : this.props.candidat.avatar
                                            }
                                            alt="avatar"
                                        />
                                    </div>
                                    <div
                                        className="user-info"
                                        ref={this.userNameRef}
                                        onClick={() => this.togglingInfoDrop()}
                                    >
                                        {this.props.candidat === null
                                            ? "candidat"
                                            : this.props.candidat.nom ===
                                                  undefined ||
                                              this.props.candidat.prenom ===
                                                  undefined
                                            ? this.props.candidat.username
                                            : `${this.props.candidat.nom} ${this.props.candidat.prenom}`}
                                    </div>
                                    <div
                                        className="drop-info text-left"
                                        ref={this.dropListInfo}
                                    >
                                        <ul className="list-unstyled">
                                            <li>
                                                <Link to="/candidat/profil">
                                                    Profil
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/candidat/demandes">
                                                    Mes demandes
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/candidat/avis">
                                                    Mes avis
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/candidat/forum">
                                                    Forum
                                                </Link>
                                            </li>
                                        </ul>
                                        <div className="drop-bottom">
                                            <Link to="/candidat/paramètres">
                                                <div className="settings">
                                                    <i className="fas fa-cog"></i>
                                                </div>
                                            </Link>
                                            <div
                                                className="sign-out"
                                                onClick={() => {
                                                    this.logOutRef.current.style.display =
                                                        "flex";
                                                }}
                                            >
                                                <i className="fas fa-sign-out-alt"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

DashboardNav.propTypes = {
    logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    candidat: state.auth.user,
    type: state.auth.accountType,
});

export default connect(mapStateToProps, { logout })(DashboardNav);
