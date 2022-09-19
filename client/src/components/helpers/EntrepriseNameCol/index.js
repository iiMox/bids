import React from "react";
import { connect } from "react-redux";
import { loadEntreprise } from "../../actions/auth";

class EntrepriseNameCol extends React.Component {
    state = { name: "" };

    async componentDidMount() {
        const res = await this.props.loadEntreprise(this.props.entrepriseId);
        this.setState({ name: `${res.data.nom}` });
    }
    render() {
        return this.state.name !== "" ? <td>{this.state.name}</td> : null;
    }
}

export default connect(null, { loadEntreprise })(EntrepriseNameCol);
