/**
 * Created by tianyun on 2017/2/22.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Icon } from "antd";
import util from "../common/util";
import userMgrAPI from "../api/userMgrAPI";

class ValidateEmail extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            status: "loading",
            email: null
        };
    }
    componentDidMount() {
        //let token = window.location.href.split("/verify_email_address/")[1].split("#")[0];
        let token = this.props.match.params.validateToken;
        let tcode = this.props.match.params.tcode;
        userMgrAPI.verifyEmail(token,tcode).then(
            (response) => {
                if (response.data) {
                    this.setState({
                        status: "success",
                        email: response.data.data
                    });
                }
            },
            () => {
                this.setState({status: "failure"});
            }
        );
    }
    render() {
        let content = null;
        if (this.state.status === "loading") {
            content = <div>
                <div className="txt-al-ct"><Icon type="loading" /></div>
                <div className="txt-al-ct pd-20 fs-16">{util.t("common.validateLoading")}</div>
            </div>;
        } else if (this.state.status === "success") {
            content = <div>
                <div className="txt-al-ct pd-20 fs-16"><Icon type="check-circle-o" className="fs-24 mr-10 color-blk" style={{position: "relative", top: "3px"}}/>{util.t("message.validateEmailSuccess")}</div>
                <div className="txt-al-ct fs-14">{util.t("message.yourEmailValidated", {email: this.state.email})}</div>
            </div>;
        } else if (this.state.status === "failure") {
            content = <div>
                <div className="txt-al-ct pd-20 fs-18"><Icon type="close-circle-o" className="fs-24 mr-10 color-blk" style={{position: "relative", top: "3px"}}/>{util.t("message.validateEmailFailure")}</div>
                <div className="txt-al-ct fs-14">{util.t("message.yourEmailValidatFailure")}</div>
            </div>;
        }
        return <div className="register-container">
            <div>
                <div className="loginMsg">
                    <div className="loginTitle">
                        <img src={require("../img/login-title.png")} />
                        <div className="content-title">
                            <span>{localStorage.getItem("ucName") || util.t("common.UCName")}</span>
                        </div>
                    </div>
                </div>
                {content}
            </div>
        </div>;
    }
}

export default ValidateEmail;