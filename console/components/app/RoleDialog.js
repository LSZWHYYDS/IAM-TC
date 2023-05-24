/**
 * Created by xifeng on 2017/12/10.
 * edit or create app Role dialog
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Button, Checkbox, Input, Form, Row, Col, Tabs } from "antd";
import util from "../../common/util";
import MsgTip from "../../common/msgTip";
import ModalDialog from "../../common/modalDialog";
import validator from "../../common/validator";
import appAPI from "../../api/appAPI";
import AppPermBindingList from "./AppPermBindingList";
import appUtil from "./appUtil";
import AppPermSetBindingList from "./AppPermSetBindingList";
import PermSetTree from "../rbac/PermSetTree";
import { PERM_SETS } from "../../constants";
import AuthzComponent from "../../common/AuthzComponent";
const TabPane = Tabs.TabPane, FormItem = Form.Item;

class RoleDialog extends Component {
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

    editable(){
        return appUtil.isRoleEditable(this.props.data);
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

                let permission_sets;
                if (this.permission_sets == null){
                    permission_sets = (this.props.data && this.props.data.permission_sets) || [];
                }else {
                    permission_sets = this.permission_sets;
                }
                const params = {
                        client_id: this.clientId,
                        name: values.name,
                        display_name: values.display_name,
                        description: values.description,
                        permissions: permissions,
                        permission_sets: permission_sets,
                    },
                    api = this.mode === "add" ? appAPI.addRole: appAPI.editRole;
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
        this.permission_sets = null;
        this.setState({
            createAnother: false,
        });

        this.props.onClose();
    }

    handlePermSelect(selected) {
        this.permissions = Object.assign([], selected) || [];
    }
    handlePermSetSelect(selected) {
        this.permission_sets = Object.assign([], selected) || [];
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldsValue } = this.props.form, formItemLayout = {
                labelCol: { span: 5 },
                wrapperCol: { span: 18 }
            },
            title = this.mode === "add" ? util.t("app.perm.role.action.add") : util.t("app.perm.role.action.edit"),
            permissions = this.props.data ? this.props.data.permissions : [],
            permission_sets = this.props.data ? this.props.data.permission_sets : [];

        const permBinding = this.props.showPerm ? (
            <AppPermBindingList
                appId={this.clientId}
                onSelect={this.handlePermSelect.bind(this)}
                bindings={permissions}
            />
        ) : null,
            permSetBinding = this.props.showPermSet ? (
                this.props.permSetRenderMode === "table" ?
                    <AppPermSetBindingList
                        appId={this.clientId}
                        onSelect={this.handlePermSetSelect.bind(this)}
                        bindings={permission_sets}
                    />
                : <PermSetTree
                    bindings={permission_sets}
                    onCheck={this.handlePermSetSelect.bind(this)}
                    readonly={!this.editable()}
                />
        ) : null;
        const saveAuthzPermSets = this.mode === "add" ? [PERM_SETS.NEW_ROLE, PERM_SETS.ADMIN_APP] : [PERM_SETS.EDIT_ROLE, PERM_SETS.ADMIN_APP];

        return (
            <ModalDialog show={this.props.show} title={title} height="auto" width="800px">
                <Form>
                    <Tabs defaultActiveKey="infoTab" style={{paddingLeft: "20px"}} style={{textAlign: "left"}}>
                        <TabPane tab={util.t("app.perm.role.tabs.info")} key="infoTab">
                            <Row>
                                <Col span={24}>
                                    <FormItem label={<span title={util.t("app.perm.role.tbl.cols.name")}>
                                                    {util.t("app.perm.role.tbl.cols.name")}
                                                    <MsgTip msg={util.t("app.perm.role.tip.add")} />
                                                </span>} {...formItemLayout}>
                                        {getFieldDecorator("name", {
                                            validate: [
                                                validator.required,
                                                validator.isPermName,
                                                validator.lengthRange(2, 50)
                                            ],
                                            initialValue: this.props.data ? this.props.data.name: ""
                                        })(
                                            <Input type="text" readOnly={this.mode === "edit" || !this.editable()} />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <FormItem label={util.t("app.perm.role.tbl.cols.displayName")} {...formItemLayout}>
                                        {getFieldDecorator("display_name", {
                                            validate: [
                                                validator.lengthRange(2, 50)
                                            ],
                                            initialValue: this.props.data ? this.props.data.display_name: ""
                                        })(
                                            <Input type="text" readOnly={!this.editable()}/>
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
                                            <Input type="textarea" maxLength={"256"} readOnly={!this.editable()}/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                        </TabPane>
                        {
                            this.props.showPermSet &&
                            <TabPane tab={util.t("app.perm.role.tabs.permSets")} key="permSetsTab">
                                <Row>
                                    <Col span={24}>
                                        {permSetBinding}
                                    </Col>
                                </Row>
                            </TabPane>
                        }
                        {
                            this.props.showPerm &&
                            <TabPane tab={util.t("app.perm.role.tabs.perms")} key="permsTab">
                                <Row>
                                    <Col span={24}>
                                        {permBinding}
                                    </Col>
                                </Row>
                            </TabPane>
                        }
                    </Tabs>
                    <div className="mt-30" style={{textAlign: "right"}}>
                        { this.mode === "add" && this.editable() &&
                            <Checkbox
                                onChange={this.onCreateAnother.bind(this)}
                                disabled={util.disabledBtnByFields(getFieldsError(), getFieldsValue(this.state.requiredFields))}
                                checked={this.state.createAnother}
                            >
                                {util.t("common.createAnother")}
                            </Checkbox>
                        }
                        {
                            this.editable() &&
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
                        }
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

RoleDialog.defaultProps = {
    showPerm: true,//show perm bindings?
    showPermSet: true, //show perm set bindings?
    permSetRenderMode: "table",//perm set render mode, might be "table" or "tree"
};
export default Form.create()(RoleDialog);
