/*jshint esversion: 6 */
import React, { Component } from "react";
import { Form, Input, Icon, Button } from "antd";
import validator from "./validator";
import util from "./util";

const FormItem = Form.Item;

class DynamicFieldSet extends Component {
    constructor(...args) {
        super(...args);
        const dataArr = this.props.dataArr;
        this.uuid = dataArr ? dataArr.length : 0;
        this.tmplArr = dataArr.map((item, index) => ({key: index, value: item}));
    }
    componentWillReceiveProps(nextProps) {
        const nextDataArr = nextProps.dataArr;
        if (nextDataArr.length !== this.props.dataArr.length) {
            this.uuid = nextDataArr ? nextDataArr.length : 0;
            this.tmplArr = nextDataArr.map((item, index) => ({key: index, value: item}));
        }
    }
    remove(k) {
        const { getFieldValue, setFieldsValue  } = this.props;
        const keys = getFieldValue("keys");
        if (keys.length === 1) {
            return;
        }
        setFieldsValue({
            keys: keys.filter(key => key !== k)
        });
        this.tmplArr = this.tmplArr.filter((item) => item.key !== k);
    }
    
    add() {
        this.uuid ++;
        const { getFieldValue, setFieldsValue } = this.props;
        const keys = getFieldValue("keys");
        const nextKeys = keys.concat(this.uuid);
        setFieldsValue({
            keys: nextKeys
        });
    }
    
    render() {
        const { getFieldDecorator, getFieldValue, labelSpan, wrapperSpan } = this.props;
        const formItemLayout = {
            labelCol: {
                span: labelSpan
            },
            wrapperCol: {
                span: wrapperSpan
            }
        };
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                span: wrapperSpan,
                offset: labelSpan
            }
        };
        getFieldDecorator("keys", {
            initialValue: this.tmplArr.length === 0 ? [0] : this.tmplArr.map((item) => item.key)
        });
        const keys = getFieldValue("keys");
        const formItems = keys.map((k, index) => {
            const item = this.tmplArr.find((item) => item.key === k);
            return (
                <FormItem
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? this.props.label : ""}
                    required={true}
                    key={k}
                >
                    {getFieldDecorator(`uris-${k}`, {
                        validate: [
                            validator.required,
                            validator.isRedirectUri(this.props.appType)
                        ],
                        initialValue: item && item.value || ""
                    })(
                        <Input style={{ width: "93%", marginRight: 8 }} />
                    )}
                    {keys.length > 1 ? (
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            disabled={keys.length === 1}
                            onClick={() => this.remove(k)}
                        />
                    ) : null}
                </FormItem>
            );
        });
        return (
            <div>
                {formItems}
                <FormItem {...formItemLayoutWithOutLabel}>
                    <Button type="dashed" onClick={this.add.bind(this)} style={{ width: "93%" }}>
                        <Icon type="plus" />{util.t("common.add")}
                    </Button>
                </FormItem>
            </div>
        );
    }
}

export default DynamicFieldSet;