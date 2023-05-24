/**
 * Created by tianyun on 2017/1/20.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Form, Icon, Button, Input, Radio, Row, Col } from "antd";
import util from "../common/util";
import validator from "../common/validator";
import authAPI from "../api/authAPI";
import policyAPI from "../api/policyAPI";
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class Register extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            mandatory_attrs: null,
            pwd_complexity: null,
            showSuccess: false,
            enabledSubmit: false
        };
    }
    componentDidMount() {
        util.filterDangerousChars();
        policyAPI.getPolicies().then(
            (response) => {
                if (response.data && response.data.data) {
                    const policyData = response.data.data;
                    this.setState({
                        mandatory_attrs: policyData.signup_policy.mandatory_attrs,
                        pwd_complexity: policyData.pwd_complexity
                    });
                }
            }
        );
    }
    onSubmit() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                authAPI.regist(values).then(
                    () => {
                        this.setState({
                            showSuccess: true
                        });
                    },
                    (error) => {
                        util.showErrorMessage(error);
                    }
                );
            }
        });
    }
    onInput() {
        let vals = this.props.form.getFieldsValue(), i, hasNull = false;
        for(i in vals) {
            if (vals.hasOwnProperty(i)) {
                if (!vals[i] || vals[i] === "") {
                    hasNull = true;
                    break;
                }
            }
        }
        this.setState({enabledSubmit: !hasNull});
    }
    render() {
        if (!this.state.showSuccess) {
            const { getFieldDecorator, getFieldValue } = this.props.form;
            let pwdValidate = {},
                pwdCfmValidate = {};
            if (getFieldValue("confirmPassword")) {
                pwdValidate = validator.isEqual(this.props.form, "confirmPassword");
            }
            if (getFieldValue("password")) {
                pwdCfmValidate = validator.isEqual(this.props.form, "password");
            }
            let emailObj = null,
                sexObj = null,
                phoneNumObj = null,
                nameObj = null,
                nicknameObj = null;
            if (this.state.mandatory_attrs) {
                if (this.state.mandatory_attrs.indexOf("email") > -1) {
                    emailObj = <FormItem>
                        {getFieldDecorator("email", {
                            validate: [
                                validator.required, validator.isEmail, validator.listener(this.onInput.bind(this))
                            ],
                            initialValue: this.props.data ? this.props.data.email : ""
                        })(
                            <Input type="text"
                                   placeholder={util.t("user.email")}
                                   maxLength={"50"}
                                   onChange={this.onInput.bind(this)}
                            />
                        )}
                    </FormItem>;
                }
                if (this.state.mandatory_attrs.indexOf("gender") > -1) {
                    sexObj = <FormItem label={util.t("user.sex")}>
                        {getFieldDecorator("gender", {validate: [validator.required], initialValue: this.props.data && this.props.data.gender ? this.props.data.gender : "SECRET"})(
                            <RadioGroup>
                                <Radio value={"SECRET"}>{util.t("user.secret")}</Radio>
                                <Radio value={"MALE"}>{util.t("user.male")}</Radio>
                                <Radio value={"FEMALE"}>{util.t("user.female")}</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>;
                }
                if (this.state.mandatory_attrs.indexOf("phone_number") > -1) {
                    phoneNumObj = <FormItem>
                        {getFieldDecorator("phone_number", {
                            validate: [
                                validator.required, validator.isPhoneNum, validator.listener(this.onInput.bind(this))
                            ],
                            initialValue: this.props.data ? this.props.data.phone_number : ""
                        })(
                            <Input type="text"
                                   placeholder={util.t("user.phoneNum2")}
                                   maxLength={"50"}
                                   onChange={this.onInput.bind(this)}
                            />
                        )}
                    </FormItem>;
                }
                if (this.state.mandatory_attrs.indexOf("name") > -1) {
                    nameObj = <FormItem>
                        {getFieldDecorator("name", {
                            validate: [
                                validator.required, validator.listener(this.onInput.bind(this))
                            ],
                            initialValue: this.props.data ? this.props.data.name : ""
                        })(
                            <Input type="text"
                                   placeholder={util.t("user.name")}
                                   maxLength={"50"}
                                   onChange={this.onInput.bind(this)}
                            />
                        )}
                    </FormItem>;
                }
                if (this.state.mandatory_attrs.indexOf("nickname") > -1) {
                    nicknameObj = <FormItem>
                        {getFieldDecorator("nickname", {
                            validate: [
                                validator.required, validator.listener(this.onInput.bind(this))
                            ],
                            initialValue: this.props.data ? this.props.data.nickname : ""
                        })(
                            <Input type="text"
                                   placeholder={util.t("user.nickName")}
                                   maxLength={"50"}
                                   onChange={this.onInput.bind(this)}
                            />
                        )}
                    </FormItem>;
                }
            }
            return (
                <div className="loginPage">
                    <div className="loginBg">
                        <div className="loginMsg">
                            <div className="loginTitle">
                                <img src={require("../img/login-title.png")} />
                                <div className="content-title">
                                    <span>{localStorage.getItem("ucName") || util.t("common.UCName")}</span>
                                </div>
                            </div>
                            <Form className="formPadding">
                                <FormItem>
                                    {getFieldDecorator("username",
                                        {validate: [validator.required, validator.isUserName, validator.lengthRange(2, 32), validator.listener(this.onInput.bind(this))], initialValue: ""})(
                                        <Input  type="text"
                                                name="userName"
                                                placeholder={util.t("user.username")}
                                                style={{marginTop: "0"}}
                                                disabled={!!this.props.data}
                                        />
                                    )}
                                </FormItem>
                                {emailObj}
                                {sexObj}
                                {phoneNumObj}
                                {nameObj}
                                {nicknameObj}
                                <FormItem>
                                    {getFieldDecorator("password", {
                                        validate: [
                                            validator.required,
                                            validator.isCustomizedPwd(this.state.pwd_complexity),
                                            validator.listener(this.onInput.bind(this)), pwdValidate
                                        ],
                                        initialValue: ""
                                    })(
                                        <Input type="password"
                                               name="pwd"
                                               placeholder={util.t("user.pwd")}
                                               maxLength={"20"}
                                               style={{marginBottom: "12px"}}
                                        />
                                    )}
                                </FormItem>
                                <FormItem>
                                    {getFieldDecorator("confirmPassword", {
                                        validate: [
                                            validator.required,
                                            validator.listener(this.onInput.bind(this)),
                                            pwdCfmValidate
                                        ],
                                        initialValue: ""
                                    })(
                                        <Input type="password"
                                               name="pwd"
                                               placeholder={util.t("user.confirmPwd")}
                                               maxLength={"20"}
                                               style={{marginBottom: "12px"}}
                                        />
                                    )}
                                </FormItem>
                                <Row>
                                    <Col>
                                        <Button type="primary"
                                                htmlType="submit"
                                                style={{marginTop: "16px", width: "100%"}}
                                                disabled={!this.state.enabledSubmit}
                                                onClick={this.onSubmit.bind(this)}>
                                            注册
                                        </Button>
                                    </Col>
                                </Row>
                                <Row style={{textAlign: "center", color: "#0B7FF5", marginBottom: "20px"}}>
                                    <Col className="mt-10">
                                        <a href="javascript:void(0)" onClick={util.toLogin}>&lt;&lt;&nbsp;{util.t("user.backToLogin")}</a>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="register-container">
                    <div className="loginPage">
                        <div className="loginBg">
                            <div className="loginMsg">
                                <div className="loginTitle">
                                    <img src={require("../img/login-title.png")} />
                                    <div className="content-title">
                                        <span>{localStorage.getItem("ucName") || util.t("common.UCName")}</span>
                                    </div>
                                </div>
                                <div className="txt-al-ct fs-18">
                                    <Icon type="check-circle-o" />
                                    {util.t("message.registSuccess")}
                                </div>
                                <div className="txt-al-ct fs-16 mt-30">
                                    {util.t("common.rightNow")}
                                    <a href="javascript:void(0)" onClick={util.toLogin}>{util.t("user.login")}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

    }
}

export default Form.create()(Register);
