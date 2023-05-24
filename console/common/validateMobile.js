/**
 * Created by shaliantao on 2017/7/5.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Icon, Button, Input, Form } from "antd";
import util from "../common/util";
import TextTimer from "../common/textTimer";
import ModalDialog from "../common/modalDialog";
import userMgrAPI from "../api/userMgrAPI";

class ValidateMobile extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            show: false,
            code: "",
            errMsg: "",
            mobile: "",
            validity: "",
            userName: ""
        };
    }
    onClickTimer() {
        this.props.sendSms().then((res) => {
            const { identifier, validity } = res.data && res.data.data || {};
            this.setState({
                mobile: identifier,
                validity: validity,
                code: "",
                errMsg: ""
            });
        }).catch((error) => {
            this.setState({
                code: "",
                errMsg: ""
            });
            util.showErrorMessage(error);
        });
    }
    handleSwitchModal(show, identifier, validity, userName) {
        if (identifier && validity && userName) {
            this.setState({
                show: show,
                mobile: identifier,
                validity: validity,
                userName: userName,
                code: "",
                errMsg: ""
            });
        } else {
            if (show) {
                this.onClickTimer();
            }
            this.setState({show: show});
        }
    }
    onCodeInputChange(e) {
        this.setState({
            code: e.target.value,
            errMsg: ""
        });
    }
    onValidate() {
        let p;
        if (this.state.userName) {
            p = userMgrAPI.validateSmsCode({
                identifier: this.state.userName,
                sms_code: this.state.code
            });
        } else {
            p = userMgrAPI.validateMobile(this.state.code);
        }
        p.then((res) => {
            if (this.props.onSuccess) {
                this.props.onSuccess(res.data.data);
            }
            if (!this.state.userName) {
                util.showSuccessMessage(util.t("message.validateMobileSuccess"));
            }
            this.handleSwitchModal(false);
        }).catch((error) => {
            const errCode = error.response && error.response.data && error.response.data.error;
            if (errCode === "1010103") {
                this.setState({
                    errMsg: util.t("message.smsCodeErr")
                });
            } else if (errCode === "1010104") {
                this.setState({
                    errMsg: util.t("message.smsCodeExpired")
                });
            } else {
                util.showErrorMessage();
            }
        })
    }
    onClose() {
        this.handleSwitchModal(false);
    }
    render() {
        return (
            <ModalDialog show={this.state.show}>
                <Form>
                    <div className="forgetPwd">
                        <div className="forgetPwd-title">
                            <Icon type="check-circle-o" />
                            {util.t("message.smsSent")}
                        </div>
                        <p className="mb-20">
                            {util.t("message.smsSentTip", {mobile: this.state.mobile, minutes: this.state.validity})}
                            <TextTimer text={util.t("common.sendAgain")} onClickText={this.onClickTimer.bind(this)} />
                        </p>
                        <div className="mb-20">
                            <Input type="text"
                                   value={this.state.code}
                                   placeholder={util.t("common.smsCode")}
                                   maxLength={"10"}
                                   onChange={this.onCodeInputChange.bind(this)}
                            />
                        </div>
                        <div>
                            <span className="errorTip">{this.state.errMsg}</span>
                        </div>
                        <div style={{textAlign: "right"}}>
                            <Button type="primary"
                                    htmlType="submit"
                                    className="ml-10 fs-16"
                                    disabled={!this.state.code}
                                    onClick={this.onValidate.bind(this)}
                            >
                                {this.state.userName ? util.t("user.resetPwd") : util.t("common.validateImmediately")}
                            </Button>
                            <Button type="ghost"
                                    className="ml-10 fs-16"
                                    onClick={this.onClose.bind(this)}
                            >
                                {util.t("common.cancel")}
                            </Button>
                        </div>
                    </div>
                </Form>
            </ModalDialog>
        );
    }
}

export default ValidateMobile;