import React from "react";

import "./WorkBox.css";

class WorkBox extends React.Component {
    render() {
        return (
            <div className="exp-box">
                <div className="title">{this.props.title}</div>
                <div className="holder">
                    <div className="institution">{this.props.workplace}</div>
                    <div className="dates">
                        {this.props.start} - {this.props.end}
                    </div>
                </div>
                <p>{this.props.review}</p>
            </div>
        );
    }
}

export default WorkBox;
