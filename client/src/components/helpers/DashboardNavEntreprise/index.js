import React from "react";
import { Link } from "react-router-dom";
import $ from "jquery";

import "./DashboardNavEntreprise.css";

import logoImg from "../../../images/logo2.svg";
import avatarImg from "../../../images/google-logo.png";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import history from "../../../history";
import NotifBox from "../NotifBox";

class DashboardNavEntreprise extends React.Component {
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
                notifications: this.props.entreprise.notifications.slice(0, 20),
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
                                <Link to="/entreprise">
                                    <img src={logoImg} alt="LOGO" />
                                </Link>
                            </div>
                            <div className="holder-box col-md-9 text-left">
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
                                            className="drop-notif"
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
                                                                        type="entreprises"
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
                                            className="drop-msg"
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
                                                                        type="entreprises"
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
                                <div className="profile">
                                    <div className="img-box">
                                        <img
                                            src={
                                                this.props.entreprise === null
                                                    ? avatarImg
                                                    : this.props.entreprise
                                                          .avatar
                                            }
                                            alt="avatar"
                                        />
                                    </div>
                                    <div
                                        className="user-info"
                                        ref={this.userNameRef}
                                        onClick={() => this.togglingInfoDrop()}
                                    >
                                        {this.props.entreprise === null
                                            ? "Entreprise"
                                            : this.props.entreprise.nom}
                                    </div>
                                    <div
                                        className="drop-info"
                                        ref={this.dropListInfo}
                                    >
                                        <ul className="list-unstyled">
                                            <li>
                                                <Link to="/entreprise/page">
                                                    Page
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="/entreprise/offres">
                                                    Mes offres
                                                </Link>
                                            </li>
                                        </ul>
                                        <div className="drop-bottom">
                                            <Link to="/entreprise/paramètres">
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

DashboardNavEntreprise.propTypes = {
    logout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    entreprise: state.auth.user,
});

export default connect(mapStateToProps, { logout })(DashboardNavEntreprise);
