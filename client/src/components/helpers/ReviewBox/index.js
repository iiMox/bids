import React from "react";
import { connect } from "react-redux";
import { getCandidat } from "../../actions/candidat";

import "./ReviewBox.css";

class ReviewBox extends React.Component {
    state = { candidat: null };

    async componentDidMount() {
        const res = await this.props.getCandidat(this.props.candidat);
        this.setState({ candidat: res.data });
    }

    renderStars() {
        var stars = [];

        for (let i = 0; i < this.props.stars; i++) {
            stars.push(<i key={i} className="fas fa-star"></i>);
        }
        return stars;
    }
    render() {
        return this.state.candidat ? (
            <div className="review-box">
                <div className="row">
                    <div className="img-box col-md-2">
                        <img src={this.state.candidat.avatar} alt="avatar" />
                    </div>
                    <div className="infos col-md-10">
                        <div className="username">{`${this.state.candidat.nom} ${this.state.candidat.prenom}`}</div>
                        <div className="stars">{this.renderStars()}</div>
                    </div>
                </div>
                <p>{this.props.commentaire}</p>
            </div>
        ) : null;
    }
}

export default connect(null, { getCandidat })(ReviewBox);
