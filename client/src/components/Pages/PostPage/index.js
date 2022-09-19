import React from "react";
import { connect } from "react-redux";
import DashboardNav from "../../helpers/DashboardNav";
import PostsBox from "../../helpers/PostsBox";
import { getPoste } from "../../actions/postes";

class PostPage extends React.Component {
    async componentDidMount() {
        await this.props.getPoste(this.props.match.params.poste_id);
    }
    render() {
        return this.props.poste ? (
            <>
                <DashboardNav />
                <div className="content" style={{ padding: "80px 0" }}>
                    <div className="container">
                        <PostsBox
                            key={this.props.poste._id}
                            idPost={this.props.match.params.poste_id}
                            candidatId={this.props.poste.candidat}
                            datePosté={this.props.poste.datePosté}
                            commentaires={this.props.poste.commentaires}
                            titre={this.props.poste.titre}
                            contenu={this.props.poste.contenu}
                            seeMore={false}
                        />
                    </div>
                </div>
            </>
        ) : null;
    }
}

const mapStateToProps = (state) => ({
    poste: state.postes.poste,
});

export default connect(mapStateToProps, { getPoste })(PostPage);
