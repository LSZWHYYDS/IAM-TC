/**
 * Created by tianyun on 2017/1/3.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Form, Input, Col, Row } from "antd";
import UserGroupTree from "./userGroupTree";
import util from "./util";
import validator from "./validator";
const FormItem = Form.Item;

class SelectOrgTree extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            input: "",
            showTree: false
        };
    }
    handleSelectTreeNode(selectedKey, e) {
        let val = e ? (e.selected ? e.selectedNodes[0].props.rawtitle : "") : ((this.props.defaultSelectedName && this.props.defaultSelectedName !== "_root") ? this.props.defaultSelectedName : util.t("org.org"));
        if (this._isMounted) {
            this.setState({
                input: val,
                showTree: false
            });
        }
        this.props.form.setFieldsValue({"orgName": val});
        this.props.form.validateFields(["orgName"]);
        this.selectedNode = {key: selectedKey, title: val};
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
                            <UserGroupTree defaultSelectedKey={this.props.defaultSelectedKey ? this.props.defaultSelectedKey : "_root"}
                                           defaultGroup={this.props.defaultGroup} disabledKeys={this.props.disabledKeys}
                                           hideKey={this.props.hideKey}
                                           hideReadonly={true}
                                           defaultExpandAll
                                           onClickTreeNode={this.handleSelectTreeNode.bind(this)}/>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default SelectOrgTree;
