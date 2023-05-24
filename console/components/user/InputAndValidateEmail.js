/**
 * Created by tianyun on 2017/4/7.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Form, Button, Row, Input } from "antd";
import validator from "../../common/validator";
import util from "../../common/util";

const FormItem = Form.Item;

class InputAndValidateEmail extends Component {
    render() {
        const { getFieldDecorator } = this.props.form;
        return <Form layout="horizontal">
            <div className="forgetPwd">
                <p>{(localStorage.getItem("ucName") || util.t("common.UCName")) + util.t("tip.wantEmail")}</p>
            </div>
            <Row style={{marginBottom: "20px"}}>
                <FormItem label={util.t("user.inputEmail")} labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
                    {getFieldDecorator("email", {validate: [validator.required, validator.isEmail]})(
                        <Input type="email" maxLength={"50"} />
                    )}
                </FormItem>
            </Row>
            <div style={{textAlign: "right"}}>
                <Button type="primary" className="ml-10 fs-16" onClick={this.props.saveAndValidateEmail}>{util.t("common.saveAndVerify")}</Button>
                <Button type="ghost" className="ml-10 fs-16" onClick={this.props.closeNoEmailDialog}>{util.t("common.cancel")}</Button>
            </div>
        </Form>;
    }
}

export default Form.create()(InputAndValidateEmail);
