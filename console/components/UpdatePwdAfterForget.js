/**
 * Created by tianyun on 2017/2/21.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, Row, Col, Icon, Input, Button } from "antd";
import authActionCreators from "../actions/authActionCreators";
import validator from "../common/validator";
import util from "../common/util";
import policyAPI from "../api/policyAPI";

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 }
};

class UpdatePwdAfterForget extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            showSuccess: false,
            pwd_complexity: null
        };
    }
    componentDidMount() {
        util.filterDangerousChars();
        localStorage.setItem("tcode", this.props.match.params.tcode)
        policyAPI.getPolicies().then(
            (response) => {
                if (response.data && response.data.data) {
                    this.setState({
                        pwd_complexity: response.data.data.pwd_complexity
                    });
                }
            }
        );
    }
    componentWillUnmount() {
        this.props.resetUpdatePwdStatus();
    }
    onSubmit() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.updatePwdAfterForget({
                    "new_password": values.new_password,
                    "reset_password_token": this.props.match.params.resetToken,
                    "tcode":this.props.match.params.tcode
                });
            }
        });
    }
    render() {
        const { getFieldDecorator, getFieldValue, getFieldsError, getFieldsValue } = this.props.form,
        requiredFields = [
            "new_password_confirm", "new_password"
        ];
        let newPwdValidate = {},
            newPwdCfmValidate = {};
        if (getFieldValue("new_password_confirm")) {
            newPwdValidate = validator.isEqual(this.props.form, "new_password_confirm");
        }
        if (getFieldValue("new_password")) {
            newPwdCfmValidate = validator.isEqual(this.props.form, "new_password");
        }
        if (this.props.updatePwdSuccess) {
            return <div className="register-container main-content">
                <div className="loginTitle">
                    <img src={require("../img/login-title.png")} />
                    <div className="content-title">
                        <span>{localStorage.getItem("ucName") || util.t("common.UCName")}</span>
                    </div>
                </div>
                <div className="txt-al-ct fs-18">
                    <Icon type="check-circle-o" />
                    {util.t("message.resetPwdSuccess")}
                </div>
                <div className="txt-al-ct fs-16 mt-30">
                    {util.t("common.rightNow")}
                    <a href="javascript:void(0)" onClick={util.toLogin}>{util.t("user.login")}</a>
                </div>
            </div>;
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
                                <div className="update-pwd">
                                    <div className="update-pwd-cont">
                                        <Form className="formPadding">
                                            <FormItem>
                                                {getFieldDecorator("new_password", {
                                                    validate: [
                                                        validator.required, validator.isCustomizedPwd(this.state.pwd_complexity), newPwdValidate
                                                    ],
                                                    initialValue: ""
                                                })(
                                                    <Input type="password" placeholder={util.t("user.inputNewPwd")} maxLength={"20"} />
                                                )}
                                            </FormItem>
                                            <FormItem>
                                                {getFieldDecorator("new_password_confirm", {
                                                    validate: [validator.required, newPwdCfmValidate],
                                                    initialValue: ""
                                                })(
                                                    <Input type="password" placeholder={util.t("user.confirmNewPwd")} maxLength={"20"} />
                                                )}
                                            </FormItem>
                                            <Row>
                                                <Col>
                                                    <Button type="primary"
                                                            htmlType="submit"
                                                            style={{width: "100%", fontSize: "18px"}}
                                                            disabled={util.disabledBtnByFields(getFieldsError(), getFieldsValue(requiredFields))}
                                                            onClick={this.onSubmit.bind(this)}>
                                                        {util.t("user.resetPwd")}
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

const mapStateToProps = (state, ownProps) => ({
    updatePwdSuccess: state.login.updatePwdSuccess
});

const mapDispatchToProps = (dispatch) => ({
    updatePwdAfterForget: (params) => dispatch(authActionCreators.updatePwdAfterForget(params)),
    resetUpdatePwdStatus: () => dispatch(authActionCreators.resetUpdatePwdStatus())
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(UpdatePwdAfterForget));
