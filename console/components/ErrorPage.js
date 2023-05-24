/*jshint esversion: 6 */
import React, { Component } from "react";

class ErrorPage extends Component {
    componentDidUpdate() {
        this.props.getSelfInfo();
    }
    render() {
        return (
            <div className="error-icon" >
                <img src={require("../img/networkError.png")} />
                <p className="error-msg">
                   <span>网络开小差，请检查您的网络~</span>
                </p>
            </div>
        );
    }
}

export default ErrorPage;
