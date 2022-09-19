import React from "react";
import Navbar from "../../helpers/Navbar";
import PostsBox from "../../helpers/PostsBox";
import { connect } from "react-redux";

import "./ForumGuestPage.css";

class ForumGuestPage extends React.Component {
    renderPostes() {
        const postesArray = [];
        this.props.postes.forEach((poste) => {
            postesArray.push(
                <PostsBox
                    key={poste._id}
                    posteId={poste._id}
                    candidatId={poste.candidat}
                    datePosté={poste.datePosté}
                    commentaires={poste.commentaires}
                    titre={poste.titre}
                    contenu={poste.contenu}
                    seeMore={true}
                    guest="yes"
                />
            );
        });
        return postesArray.length === 0 ? (
            <div style={{ marginTop: "40px", textAlign: "center" }}>
                Pas de postes por le moment...
            </div>
        ) : (
            postesArray
        );
    }

    render() {
        return (
            <div className="forum-guest">
                <Navbar />
                <div className="content" style={{ padding: "40px 0" }}>
                    <div className="container">
                        <div
                            styyle={{ padding: "80px 0" }}
                            className="posts-container animate__animated animate__backInRight"
                        >
                            <h2>Les derniers postes</h2>
                            {this.renderPostes()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    postes: state.postes.postes,
});

export default connect(mapStateToProps)(ForumGuestPage);
