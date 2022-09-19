import React from "react";

import "./ProfileBox.css";

class ProfileBox extends React.Component {
    render() {
        return (
            <div className="profile-box">
                <div className="row">
                    <div className="img-holder col-md-3">
                        <img src={this.props.avatar} alt="avatar" />
                    </div>
                    <div className="applicant-infos col-md-8 offset-md-1">
                        <h5>
                            {this.props.name}
                            <span className="job-title">{this.props.job}</span>
                        </h5>
                        <div className="prev-work">
                            <div>
                                <i className="fas fa-briefcase"></i>
                            </div>
                            {this.props.work_at}
                        </div>
                        <div className="prev-edu">
                            <div>
                                <i className="fas fa-user-graduate"></i>
                            </div>
                            {this.props.study_at}
                        </div>
                        <div className="langs">
                            <div>
                                <i className="fas fa-language"></i>
                            </div>
                            {this.props.langs}
                        </div>
                        <div className="skills">
                            <div>
                                <i className="fas fa-hand-sparkles"></i>
                            </div>
                            {this.props.skills}
                        </div>
                        <button
                            onClick={() => {
                                window.open(
                                    `/entreprise/candidat/${this.props.candidatId}`
                                );
                            }}
                        >
                            Voir plus...
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileBox;
