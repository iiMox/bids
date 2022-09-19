import React from "react";

import "./StatBox.css";

class StatBox extends React.Component {
    render() {
        return (
            <div className="stat-box col-md-3">
                <div className="title">{this.props.title}</div>
                <div className="row">
                    <div className="left col-md-6">{this.props.stat}</div>
                    <div className="right col-md-6">
                        <i className={`fas fa-${this.props.icon}`}></i>
                    </div>
                </div>
            </div>
        );
    }
}

export default StatBox;
