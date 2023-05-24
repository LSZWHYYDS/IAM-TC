/**
 * Created by xifeng on 2018/1/29.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Form, Input, Col, Row } from "antd";
import CheckableUserGroupTree from "./checkableUserGroupTree";
import util from "./util";
import validator from "./validator";
const FormItem = Form.Item;

class CheckableOrgTree extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            input: "",
            showTree: false,
            keyword: "",
            autoExpandParent: true,
            expandedKeys: [],
        };
    }
    handleSelectTreeNode(checkedKeys, e) {
        let orgName = (this.props.defaultSelectedName && this.props.defaultSelectedName !== "_root") ? this.props.defaultSelectedName : util.t("org.org");
        if (checkedKeys && checkedKeys.length>0) {
            orgName = e.checkedNodes.map(node => node.props.rawtitle).join();
        }else{//nothing selected, set to default org.
            orgName = util.t("org.defaultOrg");
        }

        if (this._isMounted) {
            this.setState({
                input: orgName,
                showTree: false
            });
        }
        this.props.form.setFieldsValue({"orgName": orgName});
        this.props.form.validateFields(["orgName"]);

        this.selectedNode = {key: checkedKeys, title: orgName};
    }
    handleShowDropDown (isShow) {
        if (!this.props.readOnly) {
            if (isShow) {
                if (this._isMounted) {
                    this.setState({showTree: isShow});
                }
            } else {
                this.setTimeHdl = setTimeout(()=>{
                    if (this.clickDropDiv) {
                        this.clickDropDiv = false;
                    } else {
                        if (this._isMounted) {
                            this.setState({showTree: isShow});
                        }
                    }
                }, 300);
            }
        }
    }
    clickDropDown(isClick) {
        this.clickDropDiv = isClick;
    }
    getSelectedNode() {
        return this.selectedNode;
    }
    componentDidMount() {
        this._isMounted = true;
    }
    componentWillUnmount() {
        clearTimeout(this.setTimeHdl);
        this._isMounted = false;
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: (this.props.titleSpan || "4")},
            wrapperCol: {span: (this.props.inputSpan || "20")}
        };
        return (
            <div className="select-org-tree" onBlur={this.handleShowDropDown.bind(this, false)}>
                <Row>
                    <FormItem label={this.props.title || util.t("org.higherOrg2")} {...formItemLayout}>
                        {getFieldDecorator("orgName", {
                            validate: [validator.required],
                            initialValue: this.props.defaultSelectedName &&
                            this.props.defaultSelectedName !== "_root" ?
                            this.props.defaultSelectedName : util.t("org.org")
                        })(
                            <Input type="text" onClick={this.handleShowDropDown.bind(this, true)} readOnly
                                />
                        )}
                    </FormItem>
                </Row>
                <Row >
                    <Col className="input-area" span={this.props.inputSpan || "20"} offset={this.props.titleSpan || "4"}>
                        <div className={this.state.showTree ? "drop-down" : "hidden"}
                             onMouseDown={this.clickDropDown.bind(this, true)}
                             onMouseOut={this.clickDropDown.bind(this, false)}
                        >
                            <CheckableUserGroupTree defaultSelectedKey={this.props.defaultSelectedKey ? this.props.defaultSelectedKey.filter(key => key !== "_null") : ["_root"]}
                                           defaultGroup={this.props.defaultGroup} disabledKeys={this.props.disabledKeys}
                                           hideKey={this.props.hideKey}
                                           hideReadonly={true}
                                           defaultExpandAll
                                           onCheck={this.handleSelectTreeNode.bind(this)}/>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default CheckableOrgTree;
