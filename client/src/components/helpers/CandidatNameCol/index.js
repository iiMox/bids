import React from "react";
import { connect } from "react-redux";
import { getCandidat } from "../../actions/candidat";

class CandidatNameCol extends React.Component {
    state = { name: "" };

    async componentDidMount() {
        const res = await this.props.getCandidat(this.props.candId);
        this.setState({ name: `${res.data.nom} ${res.data.prenom}` });
    }
    render() {
        return this.state.name !== "" ? (
            <td style={{ cursor: "default" }}>{this.state.name}</td>
        ) : null;
    }
}

export default connect(null, { getCandidat })(CandidatNameCol);
