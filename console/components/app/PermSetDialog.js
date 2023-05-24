/**
 * Created by xifeng on 2018/01/02.
 * edit or create app permission set dialog
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Button, Checkbox, Input, Form, Row, Col } from "antd";
import util from "../../common/util";
import MsgTip from "../../common/msgTip";
import ModalDialog from "../../common/modalDialog";
import validator from "../../common/validator";
import appAPI from "../../api/appAPI";
import AppPermBindingList from "./AppPermBindingList";
import { PERM_SETS } from "../../constants";
import AuthzComponent from "../../common/AuthzComponent";

const FormItem = Form.Item;

class PermSetDialog extends Component {
    constructor(...args) {
        super(...args);
        this.mode = this.props.mode || "add";
        this.clientId = this.props.clientId;
        this.state = {
            requiredFields: [],
            createAnother: false,
        };
    }

    componentDidMount() {
        util.filterDangerousChars();
        this.setState({
            requiredFields: ["name"]
        });
    }

    onCreateAnother(e){
        this.setState({
            createAnother: e.target.checked,
        });
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let permissions;
                if (this.permissions == null){
                    permissions = (this.props.data && this.props.data.permissions) || [];
                }else {
                    permissions = this.permissions;
                }
                const params = {
                        client_id: this.clientId,
                        name: values.name,
                        display_name: values.display_name,
                        description: values.description,
                        permissions: permissions,
                    },
                    api = this.mode === "add" ? appAPI.addPermSet : appAPI.editPermSet;

                api(params).then(
                    () => {
                        util.showSuccessMessage();
                        if (this.props.onSave) {
                            this.props.onSave();
                        }
                    },
                    (error) => {
                        util.showErrorMessage(error);
                    }
                );

                if (this.state.createAnother) {
                    this.props.form.resetFields(["name"]);
                } else {
                    this.onClose();
                }
            }
        });
    }
    onClose() {
        this.permissions = null;
        this.setState({
            createAnother: false,
        });

        this.props.onClose();
    }

    handlePermSelect(selectedRowKeys) {
        this.permissions = Object.assign([], selectedRowKeys) || [];
    }

    render() {
        const { getFieldDecorator, getFieldsError, getFieldsValue } = this.props.form, formItemLayout = {
                labelCol: { span: 5 },
                wrapperCol: { span: 18 }
            },
            title = this.mode === "add" ? util.t("app.perm.permSet.action.add") : util.t("app.perm.permSet.action.edit"),
            permissions = this.props.data ? this.props.data.permissions : [];

        const permGrouping = (
            <AppPermBindingList
                appId={this.clientId}
                onSelect={this.handlePermSelect.bind(this)}
                bindings={permissions}
            />
        );

        const saveAuthzPermSets = this.mode === "add" ? [PERM_SETS.NEW_ROLE, PERM_SETS.ADMIN_APP] : [PERM_SETS.EDIT_ROLE, PERM_SETS.ADMIN_APP];
        return (
            <ModalDialog show={this.props.show} title={title} height="auto" width="800px">
                <Form>
                    <Row>
                        <Col span={24}>
                            <FormItem label={<span title={util.t("app.perm.permSet.tbl.cols.name")}>
                                            {util.t("app.perm.permSet.tbl.cols.name")}
                                            <MsgTip msg={util.t("app.perm.permSet.tip.add")} />
                                        </span>} {...formItemLayout}>
                                {getFieldDecorator("name", {
                                    validate: [
                                        validator.required,
                                        validator.isPermName,
                                        validator.lengthRange(2, 50)
                                    ],
                                    initialValue: this.props.data ? this.props.data.name: ""
                                })(
                                    <Input type="text" readOnly={this.mode === "edit"} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label={util.t("app.perm.permSet.tbl.cols.displayName")} {...formItemLayout}>
                                {getFieldDecorator("display_name", {
                                    validate: [
                                        validator.lengthRange(2, 50)
                                    ],
                                    initialValue: this.props.data ? this.props.data.display_name: ""
                                })(
                                    <Input type="text"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label={util.t("common.desc")} {...formItemLayout}>
                                {getFieldDecorator("description", {
                                    validate: [
                                        validator.lengthRange(2, 256)
                                    ],
                                    initialValue: this.props.data ? this.props.data.description: ""
                                })(
                                    <Input type="textarea" maxLength={"256"} />
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <FormItem label={util.t("app.perm.role.perm")} {...formItemLayout}>
                                {
                                    getFieldDecorator("permissions", {
                                        initialValue: permissions,
                                    })(permGrouping)
                                }
                            </FormItem>
                        </Col>
                    </Row>
                    <div className="mt-30" style={{textAlign: "right"}}>
                        { this.mode === "add" &&
                            <Checkbox
                                onChange={this.onCreateAnother.bind(this)}
                                disabled={util.disabledBtnByFields(getFieldsError(), getFieldsValue(this.state.requiredFields))}
                                checked={this.state.createAnother}
                            >
                                {util.t("common.createAnother")}
                            </Checkbox>
                        }
                        <AuthzComponent allowed={saveAuthzPermSets}>
                            <Button type="primary"
                                    htmlType="submit"
                                    className="ml-10 fs-16"
                                    disabled={util.disabledBtnByFields(getFieldsError(), getFieldsValue(this.state.requiredFields))}
                                    onClick={this.onSubmit.bind(this)}
                            >
                                {this.mode === "add" ? util.t("common.add") : util.t("common.save")}
                            </Button>
                        </AuthzComponent>
                        <Button type="ghost"
                                className="ml-10 fs-16"
                                onClick={this.onClose.bind(this)}
                        >
                            {util.t("common.close")}
                        </Button>
                    </div>
                </Form>
            </ModalDialog>
        );
    }
}

export default Form.create()(PermSetDialog);
