/**
 * Created by shaliantao on 2017/7/14.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Form, Button, Row, Col, Input, Modal } from "antd";
import UserGroupTree from "./userGroupTree";
import ModalDialog from "../common/modalDialog";
import SelectOrgTree from "../common/selectOrgTree";
import validator from "../common/validator";
import util from "./util";
import conf from "../conf";
import orgAPI from "../api/orgAPI";
import { PERM_SETS } from "../constants";
import AuthzComponent from "./AuthzComponent";

const FormItem = Form.Item, Search = Input.Search;

class OrgOptions extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            showEditModal: false,
            showDelModal: false,
            selectedKey: null,
            data: null,
            addType: null
        };
    }
    getOrgInfo(key, onSuccess) {
        orgAPI.getOrg(key).then(
            (response) => {
                onSuccess && onSuccess(response && response.data && response.data.data);
            },
            (error) => {
                util.showErrorMessage(error);
            }
        );
    }
    onEdit() {
        this.setState({
            showEditModal: true,
            addType: null
        });
    }
    onCreate(addType) {
        this.setState({
            showEditModal: true,
            addType: addType
        });
    }
    onSubmit() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = {
                        "description": values.description,
                        "name": values.name
                    }, p = null, selectedNode = this.selectOrgTree.getSelectedNode();
                params.parent_id = selectedNode.key;
                if (!this.state.addType) {
                    p = orgAPI.editOrg(this.state.selectedKey, params);
                } else {
                    p = orgAPI.addOrg(params);
                }
                p.then(
                    () => {
                        util.showSuccessMessage();
                        this.groupTree.getOrgTree();
                        this.closeDialog();
                    },
                    (error) => {
                        util.showErrorMessage(error);
                    }
                );
            }
        });
    }
    onDelete() {
        this.setState({
            showDelModal: true
        });
    }
    delOrg() {
        orgAPI.deleteOrg(this.state.selectedKey).then(
            () => {
                util.showSuccessMessage();
                this.setState({
                    showDelModal: false,
                    selectedKey: "_root"
                });
                this.groupTree.getOrgTree();
                this.props.onClickTreeNode(null);
            },
            (error) => {
                util.showErrorMessage(error);
            }
        );
    }
    cancelDel() {
        this.setState({
            showDelModal: false
        });
    }
    closeDialog() {
        this.setState({
            showEditModal: false
        });
    }
    onClickTreeNode(key, e) {
        if (!e || e.selected) {
            if (e) {
                this.props.onClickTreeNode(key);
            }
            if (key === "_root") {
                this.setState({
                    data: {
                        readyonly: false,
                        name: util.t("org.org"),
                        id: key,
                        parent: null
                    },
                    selectedKey: key
                });
            } else if (key === "_null" || key === '-2') {
                this.setState({
                    data: {
                        readyonly: false,
                        name: util.t("org.defaultOrg"),
                        id: key,
                        parent: {id: "_root", name: util.t("org.org")}
                    },
                    selectedKey: key
                });
            } else {
                this.getOrgInfo(key, (data) => {
                    this.setState({
                        data: data,
                        selectedKey: key
                    });
                });
            }
        } else {
            this.setState({
                selectedKey: null
            });
        }
    }
    onSearch(evt) {
        const keyword = evt.target.value;
        this.groupTree.onSearch(keyword);
    }
    render() {
        let operate = null, operations = [];
        if (this.state.selectedKey && this.state.data && !this.state.data.readonly) {
            let edit = null, addSub = null, addBrother = null, del = null;
            if (this.state.selectedKey === "_root") {
                addSub = (
                    <AuthzComponent key="authz_addsub_root" allowed={[PERM_SETS.SUPER_ADMIN]}>
                        <Col span={3} key="addsub">
                            <span onClick={this.onCreate.bind(this, "sub")} title={util.t("org.newSub")}>
                                <i className="icon iconfont icon-add-sub"></i>
                            </span>
                        </Col>
                    </AuthzComponent>
                );
            } else if (this.state.selectedKey === "_null" || this.state.selectedKey === "-2") {
                addBrother = (
                    <AuthzComponent key="authz_addbro_null" allowed={[PERM_SETS.SUPER_ADMIN]}>
                        <Col span={3} key="addbrother">
                            <span onClick={this.onCreate.bind(this, "bro")} title={util.t("org.newBrother")}>
                                <i className="icon iconfont icon-add-brother"></i>
                            </span>
                        </Col>
                    </AuthzComponent>
                );
            } else {
                edit = (
                    <AuthzComponent key="authz_edit" allowed={[PERM_SETS.SUPER_ADMIN]}>
                        <Col span={3} key="edit">
                            <span onClick={this.onEdit.bind(this)} title={util.t("common.edit")}>
                                <i className="icon iconfont icon-edit-org"></i>
                            </span>
                        </Col>
                    </AuthzComponent>
                );
                addSub = (
                    <AuthzComponent key="authz_addsub" allowed={[PERM_SETS.SUPER_ADMIN]}>
                        <Col span={3} key="addsub">
                            <span onClick={this.onCreate.bind(this, "sub")} title={util.t("org.newSub")}>
                                <i className="icon iconfont icon-add-sub"></i>
                            </span>
                        </Col>
                    </AuthzComponent>
                );
                addBrother = (
                    <AuthzComponent key="authz_addbrother" allowed={[PERM_SETS.SUPER_ADMIN]}>
                        <Col span={3} key="addbrother">
                            <span onClick={this.onCreate.bind(this, "bro")} title={util.t("org.newBrother")}>
                                <i className="icon iconfont icon-add-brother"></i>
                            </span>
                        </Col>
                    </AuthzComponent>
                );
                if (this.state.data.num_of_children === 0 && this.state.data.num_of_users === 0) {
                    del = (
                        <AuthzComponent key="authz_delete" allowed={[PERM_SETS.SUPER_ADMIN]}>
                            <Col span={3} key="delete">
                                <span onClick={this.onDelete.bind(this)} title={util.t("common.delete")}>
                                    <i className="icon iconfont icon-delete-org"></i>
                                </span>
                            </Col>
                        </AuthzComponent>
                    );
                }
            }
            operations = [ addSub, addBrother, edit, del ];
        }
        if (conf.isFeatureEnabled("search_org") && this.state.selectedKey && this.state.data) {
            const search = (
                <Col span={12} key="search">
                    <Search
                        size="large"
                        placeholder={util.t("common.search")}
                        onChange={this.onSearch.bind(this)}
                    />
                </Col>
            );
            operations.push(search);
        }

        operate = (
            <span>
                {[...operations]}
            </span>
        );
        const requiredFields = ["name", "orgName"];
        let { getFieldDecorator, getFieldsError, getFieldsValue } = this.props.form,
            formItemLayout = {
                labelCol: { span: 6 },
                wrapperCol: { span: 18 }
            };
        return (
            <div>
                <Row style={{height: "30px", marginLeft: "10px"}}>{ operate }</Row>
                <UserGroupTree defaultGroup
                               ref={(input) => {this.groupTree = input;}}
                               selectedKey = {this.state.selectedKey}
                               defaultSelectedKey = {this.state.selectedKey || this.props.defaultSelectedKey}
                               onClickTreeNode = {this.onClickTreeNode.bind(this)}
                />
                <AuthzComponent allowed={[PERM_SETS.SUPER_ADMIN]}>
                    <ModalDialog show={this.state.showEditModal}
                                title={
                                    this.state.addType ?
                                    (this.state.addType === "sub" ? util.t("org.newSub") :
                                    util.t("org.newBrother")) : util.t("org.editOrg")
                                }
                                onClose={this.closeDialog.bind(this)}
                    >
                        <Form>
                            <Row style={{height: "50px"}}>
                                <Col>
                                    <FormItem label={util.t("org.orgName")} {...formItemLayout}>
                                        {getFieldDecorator("name", {
                                            validate: [validator.required],
                                            initialValue: this.state.addType ? "" : this.state.data && this.state.data.name
                                        })(
                                            <Input type="text" maxLength={"50"} />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row style={{height: "50px"}}>
                                <Col>
                                    <SelectOrgTree defaultSelectedKey={this.state.addType && (this.state.addType === "sub") ?
                                                    this.state.data && this.state.data.id :
                                                    this.state.data && this.state.data.parent && this.state.data.parent.id}
                                                defaultSelectedName={this.state.addType && (this.state.addType === "sub") ?
                                                    this.state.data && this.state.data.name :
                                                    this.state.data && this.state.data.parent && this.state.data.parent.name
                                                }
                                                readOnly={!!this.state.addType}
                                                hideKey={this.state.data ? this.state.data.id : null}
                                                form={this.props.form}
                                                ref={(input) => {this.selectOrgTree = input;}}
                                                titleSpan="6"
                                                inputSpan="18"
                                                title={util.t("org.higherOrg2")}
                                    />
                                </Col>
                            </Row>
                            <Row style={{height: "50px"}}>
                                <Col>
                                    <FormItem label={util.t("common.desc")} {...formItemLayout}>
                                        {getFieldDecorator("description", {
                                            initialValue: this.state.addType ? "" : this.state.data && this.state.data.description
                                        })(
                                            <Input type="text" maxLength={"250"} />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <div style={{textAlign: "right"}}>
                                <Button type="primary"
                                        className="ml-10 fs-16"
                                        disabled={util.disabledBtnByFields(getFieldsError(), getFieldsValue(requiredFields))}
                                        onClick={this.onSubmit.bind(this)}
                                >
                                    {util.t("common.save")}
                                </Button>
                                <Button type="ghost"
                                        className="ml-10 fs-16"
                                        onClick={this.closeDialog.bind(this)}
                                >
                                    {util.t("common.cancel")}
                                </Button>
                            </div>
                        </Form>
                    </ModalDialog>
                </AuthzComponent>
                <AuthzComponent allowed={[PERM_SETS.SUPER_ADMIN]}>
                    <Modal title={util.t("common.delPrompt")}
                        closable={false}
                        visible={this.state.showDelModal}
                        footer={[
                            <Button key="cancel" size="large" onClick={this.cancelDel.bind(this)}>
                                    {util.t("common.cancel")}
                            </Button>,
                            <Button key="del" size="large" type="primary" onClick={this.delOrg.bind(this)}>
                                {util.t("common.ok")}
                            </Button>
                        ]}
                    >
                        <div style={{lineHeight: "60px"}}>
                            <p style={{height: "60px", fontSize: "14px"}}>{util.t("message.delOrgPrompt")}</p>
                        </div>
                    </Modal>
                </AuthzComponent>
            </div>
        );
    }
}

export default Form.create()(OrgOptions);
