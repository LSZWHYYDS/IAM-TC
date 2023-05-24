/**
 * Created by shaliantao on 2017/9/18.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import util from "../common/util";

class AuthorizationError extends Component {
    render() {
        return (
            <div>
                <header className="navbar-top">
                    <span className="title">
                            <i className="iconDefault pathNodeIcon icon-favicon-white"></i>
                            <span id="uc_console_name">
                                {
                                    localStorage.getItem("ucName") || (!this.props.hasAdminPerm ?
                                        util.t("common.UCName") : util.t("common.userCenterConsole"))
                                }
                            </span>
                        </span>
                </header>
                <div className="error-icon" style={{marginTop: "-200px"}} >
                    <img src={require("../img/authorization-error.png")} />
                    <div className="error-msg loginTitle">
                        <span>{util.t("app.authorizationError")}</span>
                    </div>
                    <div className="error-description">
                        <span>{this.props.match.params.type}：</span>
                        <span>{this.props.match.params.description}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default AuthorizationError;
