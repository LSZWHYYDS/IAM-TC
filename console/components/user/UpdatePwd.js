/**
 * Created by tianyun on 2017/1/23.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Form, Input, Button } from "antd";
import validator from "../../common/validator";
import util from "../../common/util";
import userMgrAPI from "../../api/userMgrAPI";
import policyAPI from "../../api/policyAPI";

const FormItem = Form.Item;

class UpdatePwd extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            pwd_complexity: null
        };
    }
    componentDidMount() {
        let href = decodeURIComponent(window.location.href),
            decodeUrl = decodeURIComponent(href),
            decodeArr = [],
            tempTcodeArr = decodeUrl.split('?')
        tempTcodeArr.forEach((item) => {
            if (item.indexOf('tcode') !== -1) {
                if (item.indexOf('#') !== -1) {
                    decodeArr = item.split('#')
                }
            }
        })
        decodeArr.forEach((item) => {
            if (item.indexOf('tcode') !== -1) {
                if (item.indexOf('&') !== -1) {
                    decodeArr = item.split('&')
                }
            }
        })
        decodeArr.forEach((item) => {
            if (item.search("tcode") != -1) {
                let tempArr = item.split('='),
                    tenantId = tempArr[tempArr.length - 1]
                localStorage.setItem("tcode", tenantId)
            }
        })

        policyAPI.getPolicies().then((response) => {
            this.setState({
                pwd_complexity: response.data && response.data.data && response.data.data.pwd_complexity
            });
        }, (err) => {
            util.showErrorMessage(err);
        });
    }
    onSubmit() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (values.new_password === values.old_password_confirm) {
                    userMgrAPI.updatePwd({
                        "new_password": values.new_password,
                        "old_password": values.old_password,
                        "username": this.props.username
                    }).then(
                        () => {
                            util.showSuccessMessage(util.t("message.pwdChg"));
                            this.props.onSuccess(this.props.username, values.new_password);
                        },
                        (error) => {
                            util.showErrorMessage(error);
                        }
                    );
                } else {
                    util.showErrorMessage("两次密码不一致");
                }
            }
        });
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldsValue } = this.props.form,
            requiredFields = [
                "old_password", "new_password", "old_password_confirm"
            ];
        return <div className="update-pwd">
            <div className="update-pwd-cont">
                <Form layout="horizontal">
                    <FormItem>
                        {getFieldDecorator("old_password", {validate: [validator.required], initialValue: ""})(
                            <Input type="password" placeholder={util.t("user.inputOldPwd")} maxLength={"20"} />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator("new_password", {validate: [validator.required, validator.isCustomizedPwd(this.state.pwd_complexity)], initialValue: ""})(
                            <Input type="password" placeholder={util.t("user.inputNewPwd")} maxLength={"20"} />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator("old_password_confirm", {validate: [validator.required, validator.isEqual(this.props.form, "new_password")], initialValue: ""})(
                            <Input type="password" placeholder={util.t("user.confirmNewPwd")} maxLength={"20"} />
                        )}
                    </FormItem>
                    <div style={{textAlign: "right"}}>
                        <Button type="primary"
                                htmlType="submit"
                                className="fs-16"
                                disabled={util.disabledBtnByFields(getFieldsError(), getFieldsValue(requiredFields))}
                                onClick={this.onSubmit.bind(this)}>
                            {util.t("common.confirmUpdate")}
                        </Button>
                        <Button type="ghost" className="fs-16" style={{color: "#888888"}} onClick={this.props.onClose}>
                            {util.t("common.cancel")}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>;
    }
}

export default Form.create()(UpdatePwd);