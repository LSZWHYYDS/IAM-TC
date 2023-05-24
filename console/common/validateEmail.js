/**
 * Created by shaliantao on 2017/6/22.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Icon, Button } from "antd";
import util from "../common/util";
import TextTimer from "../common/textTimer";
import ModalDialog from "../common/modalDialog";
import userMgrAPI from "../api/userMgrAPI";
import InputAndValidateEmail from "../components/user/InputAndValidateEmail";

class ValidateEmail extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            noEmail: false,
            showValidateEmail: "NO_DIALOG" //"NO_DIALOG": 不显示任何验证弹窗  "TO_VERIFY"： 提示验证  "SEND_NOW"： 发送验证邮件
        };
    }
    componentDidMount() {
        this.switchShowValidateEmail(this.props.email, this.props.email_verified);
    }
    onClickTimer() {
        userMgrAPI.sendValidateEmail().catch((error) => {
            util.showErrorMessage(error);
        });
    }
    switchShowValidateEmail(email, email_verified) {
        if (email) {
            if (email_verified === false) {
                if (!sessionStorage.getItem("hideValidateEmailDialog")) {
                    this.handleShowValidateEmail("TO_VERIFY");
                }
            } else {
                this.handleShowValidateEmail("NO_DIALOG");
            }
        } else if (!sessionStorage.getItem("hideNoEmailDialog")) {
            this.setState({
                noEmail: true
            });
        }
    }
    handleShowValidateEmail(val) {
        this.setState({showValidateEmail: val});
        if (!sessionStorage.getItem("hideValidateEmailDialog")) {
            sessionStorage.setItem("hideValidateEmailDialog", true);
        }
        if (val === "SEND_NOW") {
            this.onClickTimer();
        }
    }
    closeNoEmailDialog() {
        if (!sessionStorage.getItem("hideNoEmailDialog")) {
            sessionStorage.setItem("hideNoEmailDialog", true);
        }
        this.setState({
            noEmail: false
        });
    }
    saveAndValidateEmail() {
        if (!sessionStorage.getItem("hideNoEmailDialog")) {
            sessionStorage.setItem("hideNoEmailDialog", true);
        }
        this.inputEmailDialog.validateFields((err, values) => {
            if (!err) {
                userMgrAPI.editSelfInfo({email: values.email}).then(
                    () => {
                        if (this.props.onSaveEmailSuccess) {
                            this.props.onSaveEmailSuccess(values.email);   
                        }
                        this.closeNoEmailDialog();
                        this.handleShowValidateEmail("SEND_NOW");
                    },
                    (error) => {
                        this.closeNoEmailDialog();
                        util.showErrorMessage(error);
                    }
                );
            }
        });
    }
    render() {
        return (
            <div>
                <ModalDialog show={this.state.showValidateEmail === "TO_VERIFY"}
                             title={util.t("user.validateEmail")}>
                    <div className="pd-tb-20 fs-16 mt-20" style={{textAlign: "left"}}>
                        {
                            util.t("message.requireValidateEmail", {
                                platform: localStorage.getItem("ucName") || util.t("common.UCName")
                            })
                        }
                    </div>
                    <div style={{textAlign: "right"}}>
                        <Button type="primary"
                                className="ml-10 fs-16"
                                onClick={() => this.handleShowValidateEmail("SEND_NOW")}
                        >
                            {util.t("common.validateImmediately")}
                        </Button>
                        <Button type="ghost"
                                className="ml-10 fs-16"
                                onClick={() => this.handleShowValidateEmail("NO_DIALOG")}
                        >
                            {util.t("common.validateLater")}
                        </Button>
                    </div>
                </ModalDialog>
                <ModalDialog show={this.state.showValidateEmail === "SEND_NOW"}>
                    <div className="forgetPwd">
                        <div className="forgetPwd-title">
                            <Icon type="check-circle-o" />
                            {util.t("message.emailSent")}
                        </div>
                        <p>
                            {util.t("message.emailSentMsg1")}
                            <span className="forgetPwd-email">
                                {this.props.email}
                            </span>
                            {util.t("message.emailSentMsg2")}
                            {util.t("message.emailSentMsg3")}
                            {
                                this.state.showValidateEmail === "SEND_NOW" ?
                                <TextTimer text={util.t("common.sendAgain")}
                                           onClickText={this.onClickTimer.bind(this)}
                                /> : null
                            }
                        </p>
                        <div style={{textAlign: "right"}}>
                            <Button type="ghost"
                                    className="ml-10 fs-16"
                                    onClick={() => this.handleShowValidateEmail("NO_DIALOG")}
                            >
                                {util.t("common.close")}
                            </Button>
                        </div>
                    </div>
                </ModalDialog>
                <ModalDialog show={this.state.noEmail}
                             title={util.t("user.inputEmail")}
                >
                    <InputAndValidateEmail
                        ref={(input) => {this.inputEmailDialog = input;}}
                        saveAndValidateEmail={this.saveAndValidateEmail.bind(this)}
                        closeNoEmailDialog={this.closeNoEmailDialog.bind(this)}
                    />
                </ModalDialog>
            </div>
        );
    }
}

export default ValidateEmail;