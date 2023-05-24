/**
 * Created by shaliantao on 2017/9/26.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Icon, Button, Input, Form, Row, Col } from "antd";
import util from "../common/util";
import TextTimer from "../common/textTimer";
import authAPI from "../api/authAPI";
import userMgrAPI from "../api/userMgrAPI";

class ValidateMobile extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            code: "",
            errMsg: "",
            mobile: this.props.match.params.mobile,
            validity: this.props.match.params.validity,
            userName: this.props.match.params.userName,
            tcode:this.props.match.params.tcode
        };
    }
    onClickTimer() {
        authAPI.forgetPwd(this.state.userName,this.state.tcode).then((res) => {
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
    onCodeInputChange(e) {
        this.setState({
            code: e.target.value,
            errMsg: ""
        });
    }
    verifySmsCodeSuccess(resetToken) {
        this.props.history.push("/forget_password/" + resetToken+"/"+this.props.match.params.tcode);
    }
    onValidate() {
        userMgrAPI.validateSmsCode({
            identifier: this.state.userName,
            sms_code: this.state.code,
            tcode:this.state.tcode
        }).then((res) => {
            this.verifySmsCodeSuccess(res.data.data);
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
    render() {
        return (
            <Form className="error-icon" style={{fontSize: "18px"}}>
                <div className="forgetPwd">
                    <div style={{width: "100%", textAlign: "center"}}>
                        <img src={require("../img/login-title.png")} style={{width: "60px"}} />
                    </div>
                    <div className="forgetPwd-title">
                        <Icon type="check-circle-o" />
                        {util.t("message.smsSent")}
                    </div>
                    <p className="mb-20">
                        {util.t("message.smsSentTip", {mobile: this.state.mobile, minutes: this.state.validity})}
                        <TextTimer text={util.t("common.sendAgain")} onClickText={this.onClickTimer.bind(this)} />
                    </p>
                    <div className="mb-20">
                        <Row>
                            <Col span="18">
                                <Input type="text"
                                       value={this.state.code}
                                       placeholder={util.t("common.smsCode")}
                                       maxLength={"10"}
                                       onChange={this.onCodeInputChange.bind(this)}
                                />
                            </Col>
                            <Col span="6">
                                <Button type="primary"
                                        htmlType="submit"
                                        className="ml-10 fs-16"
                                        disabled={!this.state.code}
                                        onClick={this.onValidate.bind(this)}
                                >
                                    {util.t("user.resetPwd")}
                                </Button>
                            </Col>
                        </Row>
                    </div>
                    <div>
                        <span className="errorTip">{this.state.errMsg}</span>
                    </div>
                    <div className="footerContainer">
                        <Button onClick={util.toLogin}>
                            {util.t("common.close")}
                        </Button>
                    </div>
                </div>
            </Form>
        );
    }
}

export default ValidateMobile;