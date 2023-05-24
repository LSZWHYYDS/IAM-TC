/**
 * Created by shaliantao on 2017/9/26.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Icon, Button } from "antd";
import util from "../common/util";
import TextTimer from "../common/textTimer";
import authAPI from "../api/authAPI";

class MailSent extends Component {
    onClickTimer() {
        let userName = this.props.match.params.userName;
        let tcode = this.props.match.params.tcode;
        authAPI.forgetPwd(userName,tcode);
    }
    render() {
        return (
            <div className="error-icon" style={{fontSize: "18px"}}>
                <div style={{width: "100%", textAlign: "center"}}>
                    <img src={require("../img/login-title.png")} style={{width: "60px"}} />
                </div>
                <div className="forgetPwd-title">
                    <Icon type="check-circle-o" />
                    {util.t("message.emailSent")}
                </div>
                {util.t("message.emailSentTip", {email: this.props.match.params.email})}
                <TextTimer text={util.t("common.sendAgain")} onClickText={this.onClickTimer.bind(this)} />
                <div className="footerContainer">
                    <Button onClick={util.toLogin}>
                        {util.t("common.close")}
                    </Button>
                </div>
            </div>
        );
    }
}

export default MailSent;