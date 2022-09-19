import React from "react";
import ReactDOM from "react-dom";

import { connect } from "react-redux";
import { getPoste } from "../../actions/postes";

class PostRow extends React.Component {
    constructor(props) {
        super(props);

        this.deleteIcon = React.createRef();
    }
    render() {
        return (
            <>
                <tr
                    onMouseEnter={() => {
                        this.deleteIcon.current.style.display = "flex";
                    }}
                    onMouseLeave={() => {
                        this.deleteIcon.current.style.display = "none";
                    }}
                >
                    <td
                        onClick={() => {
                            window.open(
                                `/candidat/forum/${this.props.posteId}`
                            );
                        }}
                    >
                        {this.props.title}
                    </td>
                    <td>{this.props.contenu}</td>
                    <td>{this.props.datePublication}</td>
                    <td>{this.props.commentairesNbr}</td>
                    <td>
                        <span
                            className="icon-handler animate__animated animate__fadeIn"
                            ref={this.deleteIcon}
                        >
                            <span
                                onClick={() => {
                                    this.props.getPoste(this.props.posteId);
                                    ReactDOM.findDOMNode(
                                        this.props.reference.current
                                    ).style.display = "flex";
                                }}
                            >
                                <i className="fas fa-edit"></i>
                            </span>
                            <span
                                onClick={() => {
                                    this.props.getPoste(this.props.posteId);
                                    ReactDOM.findDOMNode(
                                        this.props.deleteRef.current
                                    ).style.display = "flex";
                                }}
                            >
                                <i className="fas fa-trash"></i>
                            </span>
                        </span>
                    </td>
                </tr>
            </>
        );
    }
}

export default connect(null, { getPoste })(PostRow);
