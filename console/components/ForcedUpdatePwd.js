/**
 * Created by tianyun on 2017/2/21.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Row, Col } from "antd";
import util from "../common/util";
import conf from "../conf";
import UpdatePwd from "./user/UpdatePwd";
import {Secure} from "../common/secure-sdk";
import JSEncrypt from "jsencrypt";

class ForcedUpdatePwd extends Component {
    constructor(...args) {
        super(...args);
        this.userName = this.props.match.params.userName;
    }
    onSuccess(username, password) {
        const loginUrl = conf.getBackendUrl() + "/login" + "?_t=" + new Date().getTime() + '&tcode=' + localStorage.getItem("tcode"),
            form = document.createElement("form"),
            usernameInput = document.createElement("input"),
            passwordInput = document.createElement("input"),
            clientIdInput = document.createElement("input"),
            continueInput = document.createElement("input");


        const qs = util.parseQueryString(window.location.href);
        form.style.display = "none";
        form.setAttribute("method", "POST");
        form.setAttribute("action", loginUrl);

        usernameInput.name = "username";
        usernameInput.value = username;
        form.appendChild(usernameInput);

        passwordInput.name = "password";
        passwordInput.value = password;
        form.appendChild(passwordInput);

        clientIdInput.name = "client_id";
        form.appendChild(clientIdInput);

        if (qs.continue) {
            continueInput.name = "continue";
            continueInput.value = qs.continue;
            form.appendChild(continueInput);
        }
        
        clientIdInput.value = "tc";

        document.getElementsByTagName("body")[0].appendChild(form);
        const secureLogin = new Secure(conf.getBackendUrl(), clientIdInput.value);
        secureLogin.login(usernameInput.value, passwordInput.value, localStorage.getItem("tcode"), function(loginId, password){
            usernameInput.value = loginId;
            passwordInput.value = password;
            form.submit();
        }, function (error) {
            var errorMap = {
                "1011105": "该应用不存在",
                "1011122": "该应用被禁用",
                "no_public_key": "应用需加密登录，但login_hello未生成公钥"
            };
            // msgTip.innerText = "";
            // errorTip.innerText = errorMap[error.error] || "操作失败。";
        });
    }

    render() {
        return (
            <div className="register-container setPW">
                <div className="loginPage">
                    <div className="loginBg">
                        <div className="loginMsg">
                            <div className="loginTitle">
                                <img src={require("../img/login-title.png")} />
                                <div className="content-title">
                                    <span>{localStorage.getItem("ucName") || util.t("common.UCName")}</span>
                                </div>
                            </div>
                            <div>
                                <Row>
                                    <Col>
                                        <div className="pre-tip fs-16">{util.t("message.forcedUpdatePwd")}</div>
                                    </Col>
                                </Row>
                                <UpdatePwd username={this.userName} onSuccess={this.onSuccess.bind(this)} onClose={util.toLogin}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ForcedUpdatePwd;

