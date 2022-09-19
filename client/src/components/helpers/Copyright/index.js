import React from "react";

import "./Copyright.css";

class Copyright extends React.Component {
    render() {
        return (
            <div className="copyright text-center">
                <div className="container">
                    Copyright <span>&copy;</span> 2021
                </div>
            </div>
        );
    }
}

export default Copyright;
