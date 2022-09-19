import React from "react";

import "./CorsusBox.css";

class CorsusBox extends React.Component {
    render() {
        return (
            <div className="edu-box">
                <div className="title">{this.props.title}</div>
                <div className="institution">{this.props.college}</div>
                <div className="dates">
                    {this.props.start} - {this.props.end}
                </div>
            </div>
        );
    }
}

export default CorsusBox;
