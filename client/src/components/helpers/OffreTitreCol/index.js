import React from "react";
import { connect } from "react-redux";
import { getOffre } from "../../actions/offre";

class OffreTitre extends React.Component {
    state = { titre: "" };

    async componentDidMount() {
        const res = await this.props.getOffre(this.props.offreId);
        this.setState({ titre: `${res.data.titre}` });
    }
    render() {
        return this.state.titre !== "" ? <td>{this.state.titre}</td> : null;
    }
}

export default connect(null, { getOffre })(OffreTitre);
