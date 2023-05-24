/**
 * Created by tianyun on 2016/12/23.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Form, Input, Col, Row, Checkbox } from "antd";
import util from "./util";
import validator from "./validator";
import MsgTip from "./msgTip";
const FormItem = Form.Item;

class NewAttrItem extends Component {
    constructor(...args) {
        super(...args);
        this.state={
            isRequired: false
        };
    }
    onChange(e) {
        this.setState({
            isRequired: (typeof e.target.value === "string") && (e.target.value.trim().length > 0)
        });
    }
    onBlur(e) {
        this.props.onBlurAttrName && this.props.onBlurAttrName(e);
    }
    render() {
        let { getFieldDecorator } = this.props.form,
            formItemLayout = {
                labelCol: { span: 6 },
                wrapperCol: { span: 18 }
            },
            validate = [
                validator.required,
                validator.isDomainName,
                validator.lengthRange(2, 20)
            ];
        if (this.props.data) {
            validate = [];
        }

        return (
            <div className="new-attr-item">
                <Row>
                    <Col span={23}>
                        <FormItem label={util.t("attr.name")} {...formItemLayout}>
                            {getFieldDecorator("domain_name", {
                                validate: validate,
                                initialValue: this.props.data ? this.props.data.domain_name : ""
                            })(
                                <Input type="text"
                                       readOnly={!!this.props.data}
                                       onChange={this.onChange.bind(this)}
                                       onBlur={this.onBlur.bind(this)}
                                />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={23}>
                        <FormItem label={util.t("attr.showName")} {...formItemLayout}>
                            {getFieldDecorator("display_name", {
                                validate: [
                                    validator.required,
                                    validator.isCenterName,
                                    validator.lengthRange(2, 20)
                                ], initialValue: this.props.data ? this.props.data.display_name : ""
                            })(
                                <Input type="text" onChange={this.onChange.bind(this)} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={23}>
                        <FormItem label={util.t("attr.prmDesc")} {...formItemLayout}>
                            {getFieldDecorator("description", {
                                initialValue: this.props.data ? this.props.data.description : ""
                            }
                            )(
                                <Input type="text" onChange={this.onChange.bind(this)} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
                {this.props.type && this.props.type === "user" &&
                    <Row>
                        <Col span={23}>
                            <FormItem {...formItemLayout} label={<span title={util.t("attr.extraAuthFactor")}>
                                    {util.t("attr.extraAuthFactor")}
                                    <MsgTip msg={util.t("attr.extraAuthFactorTip")} />
                                </span>}>
                                {getFieldDecorator("extra_auth_factor", {
                                    valuePropName: "checked",
                                    initialValue: this.props.data ? this.props.data.extra_auth_factor: false
                                }
                                )( <Checkbox onChange={this.onChange.bind(this)}>{util.t("common.enable")}</Checkbox>)}
                            </FormItem>
                        </Col>
                    </Row>
                }
            </div>
        );
    }
}

export default NewAttrItem;
