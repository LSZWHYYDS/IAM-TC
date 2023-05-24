/**
 * Created by xifeng on 2017/12/17.
 * edit or create app Role bindings(user/org) dialog
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Button, Form, Row, Col, Tabs } from "antd";
import util from "../../common/util";
import ModalDialog from "../../common/modalDialog";
import RoleBindingUserComponent from "./RoleBindingUserComponent";
import RoleBindingTagComponent from "./RoleBindingTagComponent";
import RoleBindingOrgTree from "./RoleBindingOrgTree";

const TabPane = Tabs.TabPane;

class RoleBindingDialog extends Component {
    constructor(...args) {
        super(...args);
        this.clientId = this.props.clientId;
        this.role = this.props.role;
    }

    componentDidMount() {
        util.filterDangerousChars();
    }
    onClose() {
        this.props.onClose();
    }
    render() {
        const title = this.props.role ? `${util.t("app.perm.binding.title")} : ${this.props.role.name}`
                    : util.t("app.perm.binding.title");
        return (
            <ModalDialog show={this.props.show} title={title} height="auto" width="900px" style={{textAlign:"left"}}>
                <Tabs defaultActiveKey="userTab" style={{paddingLeft: "20px"}} style={{textAlign: "left"}}>
                    {
                        this.props.showBindingUser &&
                        <TabPane tab={util.t("app.perm.binding.user.title")} key="userTab">
                            <RoleBindingUserComponent
                                clientId={this.clientId}
                                role={this.props.role}
                            />
                        </TabPane>
                    }
                    {
                        this.props.showBindingOrg &&
                        <TabPane tab={util.t("app.perm.binding.org.title")} key="orgTab">
                            <Row>
                                <Col span={24}>
                                    {
                                        this.clientId && this.props.role &&
                                            <RoleBindingOrgTree
                                                appId={this.clientId}
                                                role={this.props.role}
                                            />
                                    }
                                </Col>
                            </Row>
                        </TabPane>
                    }
                    {
                        this.props.showBindingTag &&
                        <TabPane tab={util.t("app.perm.binding.tag.title")} key="tagTab">
                            <RoleBindingTagComponent
                                clientId={this.clientId}
                                role={this.props.role}
                            />
                        </TabPane>
                    }
                </Tabs>
                <div className="mt-30" style={{textAlign: "right"}}>
                    <Button type="ghost"
                        className="ml-10 fs-16"
                        onClick={this.onClose.bind(this)}
                    >
                        {util.t("common.close")}
                    </Button>
                </div>
            </ModalDialog>
        );
    }
}

RoleBindingDialog.defaultProps = {
    showBindingUser: true,
    showBindingOrg: true,
    showBindingTag: true,
};
export default Form.create()(RoleBindingDialog);