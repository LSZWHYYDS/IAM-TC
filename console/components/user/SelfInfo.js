/*jshint esversion: 6 */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Col, Row, Collapse, Breadcrumb, Tabs } from "antd";
import util from "../../common/util";
import conf from "../../conf";
import InfoItem from "../../common/infoItem";
import ValidateEmail from "../../common/validateEmail";
import ValidateMobile from "../../common/validateMobile";
import userMgrAPI from "../../api/userMgrAPI";
import extendedAttrAPI from "../../api/extendedAttrAPI";
import appAPI from "../../api/appAPI";
import defaultAvatar from "../../img/default-avatar.png";
import CollapseList from "../app/CollapseList";
import LoginGeoActivities from "./LoginGeoActivities";
import UserCerts from "./UserCerts";
import userUtil from "./userUtil";

const TabPane = Tabs.TabPane, Panel = Collapse.Panel;
const isLandscape = util.isLandscape();

class SelfInfo extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            data: null,
            attrs: null,
            entitledApps: null, // all of the apps which are entitled to this user.
        };
        this.id = this.props.match.params.id;
    }
    componentDidMount() {
        this._isMounted = true;
        extendedAttrAPI.getAttrList({basic: false}).then((response) => {
            this.setState({
                attrs: response.data && response.data.data && response.data.data.items
            });
        });
        this.refresh();
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    refresh(callback) {
        userMgrAPI.getSelfInfo().then(
            (response) => {
                if (this._isMounted && response.data) {
                    this.setState({data: response.data.data});
                    if (callback) {
                        callback(response.data.data);
                    }
                }
            }
        );
    }
    createAttrs() {
        if (!this.state.attrs) {
            return null;
        }
        return this.state.attrs.map((item, idx) => (
            <InfoItem key={"attrs_" + idx} titleStr={item.display_name} contentObj={(this.state.data && this.state.data[item.domain_name]) || "--"}/>
        ));
    }
    onSaveEmailSuccess(email) {
        const data = Object.assign({}, this.state.data, {email: email});
        this.setState({
            data: data
        });
    }
    refreshAppList() {
        appAPI.getSelfList().then((res) => {
            this.setState({
                entitledApps: res.data.data.items
            });
        }, (err) => {
            util.showErrorMessage(err);
        });
    }
    onTabChange(key) {
        if (this.state.entitledApps === null && key === "2") {
            this.refreshAppList();
        }
    }
    render() {
        const operation = (
            <Link to={`/home/editSelf/${this.id}`}>
                <Button type="primary" className="addBtnBg">
                    {util.t("common.edit")}
                </Button>
            </Link>
        );

        //latest login geo location
        let latestGeos, latestGeosObj;
        if (this.state.data) {
            latestGeos = this.state.data.login_geo;
            latestGeosObj = (
                <LoginGeoActivities
                    data={latestGeos}
                />
            );
        }

        let map = {"MALE": util.t("user.male"), "FEMALE": util.t("user.female"), "SECRET": util.t("user.secret")};
        let attrObjs = this.createAttrs();
        const paths = (
            <Breadcrumb separator=">>">
                <Breadcrumb.Item>{util.t("user.userAttrs")}</Breadcrumb.Item>
            </Breadcrumb>
        );
        let photo = "";
        if (this.state.data) {
            photo = this.state.data.picture ?
                <img src={this.state.data.picture} className="pre-box"/> :
                <img src={defaultAvatar} className="pre-box"/>;
        }

        let emailContent = null, mobileContent  = null;
        if (this.state.data) {
            if (this.state.data.email) {
                if (this.state.data.email_verified) {
                    emailContent = <div>
                        {this.state.data.email}
                        <span className="pre-tip-blue ml-10">{util.t("common.validated")}</span>
                    </div>;
                } else {
                    emailContent = <div>
                        {this.state.data.email}
                        <Button type="primary"
                                className="ml-10"
                                onClick={() => this.validateEmail.handleShowValidateEmail("SEND_NOW")}
                        >
                            {isLandscape ? util.t("common.validateImmediately") : util.t("common.validate")}
                        </Button>
                    </div>;
                }
            } else {
                emailContent = "--";
            }
            if (this.state.data.phone_number) {
                if (this.state.data.phone_number_verified) {
                    mobileContent = <div>
                        {this.state.data.phone_number}
                        <span className="pre-tip-blue ml-10">{util.t("common.validated")}</span>
                    </div>;
                } else {
                    mobileContent = <div>
                        {this.state.data.phone_number}
                        <Button type="primary"
                                className="ml-10"
                                onClick={() => this.validateMobile.handleSwitchModal(true)}
                        >
                            {isLandscape ? util.t("common.validateImmediately") : util.t("common.validate")}
                        </Button>
                    </div>;
                }
            } else {
                mobileContent = "--";
            }
        }

        let attrHtml, colSpan = "24", validateEmail = null;
        if (attrObjs && attrObjs.length && attrObjs.length > 0) {
            if (isLandscape) {
                colSpan = "12";
            }
            attrHtml = (
                <Col span={isLandscape ? 12 : 24}>
                    <Collapse defaultActiveKey={["ext"]} bordered={false}>
                        <Panel header={util.t("attr.extendedAttr")} key="ext">
                            {attrObjs}
                        </Panel>
                    </Collapse>
                </Col>
            );
        }
        if (this.state.data) {
            validateEmail = <ValidateEmail ref={(input) => {this.validateEmail = input;}}
                                           email={this.state.data && this.state.data.email}
                                           email_verified={this.state.data && this.state.data.email_verified}
                                           onSaveEmailSuccess={this.onSaveEmailSuccess.bind(this)}
            />;
        }
        let selfinfo = <div>
            <div className="searchRow">
                <div className="addUser noPadding">
                    {operation}
                </div>
            </div>
            <Row>
                <Col span={colSpan}>
                    <Collapse defaultActiveKey={["base","login", "pwdExpiryWarning", "tag"]} bordered={false}>
                        <Panel header={util.t("common.baseParam")} key="base">
                            <Row>
                                <Col span={isLandscape ? 16 : 24}>
                                    { !isLandscape && <InfoItem titleStr={util.t("user.photo")}
                                                                contentObj={photo}
                                    />
                                    }
                                    <InfoItem titleStr={util.t("user.username")}
                                            contentObj={this.state.data && this.state.data.username}
                                    />
                                    <InfoItem titleStr={util.t("user.name")}
                                            contentObj={(this.state.data && this.state.data.name) || "--"}
                                    />
                                    <InfoItem titleStr={util.t("user.phoneNum2")}
                                            contentObj={mobileContent}
                                    />
                                    <InfoItem titleStr={util.t("user.email")}
                                            contentObj={emailContent}
                                    />
                                    <InfoItem titleStr={util.t("user.nickName")}
                                            contentObj={(this.state.data && this.state.data.nickname) || "--"}
                                    />
                                    <InfoItem titleStr={util.t("user.sex")}
                                            contentObj={(this.state.data && this.state.data.gender) ?
                                                                map[this.state.data.gender] :
                                                                "--"}
                                    />
                                    <InfoItem titleStr={util.t("org.org")}
                                            contentObj={this.state.data && this.state.data.orgs && this.state.data.orgs.length>0 ?
                                                                this.state.data.orgs.map(org => org.name).join() :
                                                                util.t("org.defaultOrg")}
                                    />
                                    {
                                        <InfoItem titleStr={util.t("user.createdAt")}
                                                contentObj={this.state.data && util.formatUnixTimestamp(this.state.data.created_at) || "--"}
                                        />
                                    }
                                </Col>
                                { isLandscape && <Col span="8">
                                    <InfoItem titleStr={util.t("user.photo")} contentObj={photo}/>
                                </Col> }
                            </Row>
                        </Panel>
                        {
                            conf.isFeatureEnabled("user_pwd_expiry_warning") &&
                            this.state.data && this.state.data.come_from === null &&
                            <Panel header={util.t("common.pwdExpiryWarning")} key="pwdExpiryWarning">
                                <Row>
                                    <Col span={isLandscape ? 16 : 24}>
                                        <InfoItem titleStr={util.t("user.pwdChangedTime")}
                                                contentObj={this.state.data && util.formatUnixTimestamp(this.state.data.pwd_changed_time) || "--"}
                                        />
                                        <InfoItem titleStr={util.t("user.pwdExpirationTime")}
                                                contentObj={this.state.data && util.formatUnixTimestamp(this.state.data.pwd_expiration_time, util.t("user.pwdNeverExpire")) || "--"}
                                        />
                                    </Col>
                                </Row>
                            </Panel>
                        }
                        {
                            conf.isFeatureEnabled("tag") &&
                            this.state.data &&
                            !userUtil.isSystemUser(this.state.data) &&
                            <Panel header={util.t("tag.menu")} key="tag">
                                <Row>
                                    <Col span={isLandscape ? 16 : 24}>
                                        <InfoItem titleStr={util.t("tag.static")}
                                                contentObj={this.state.data && this.state.data.tag && this.state.data.tag.join()}
                                        />
                                        <InfoItem titleStr={util.t("tag.dynamic")}
                                                contentObj={this.state.data && this.state.data.dynamic_tag && this.state.data.dynamic_tag.join()}
                                        />
                                    </Col>
                                </Row>
                            </Panel>
                        }
                    </Collapse>
                </Col>
                {attrHtml}
            </Row>
        </div>;
        const mainContent = (
            <Tabs defaultActiveKey="1" onChange={this.onTabChange.bind(this)}>
                <TabPane tab={util.t("user.userInfoTabHeader")} key="1">
                    { selfinfo }
                </TabPane>
                {/* {
                    conf.isFeatureEnabled("user_cert_management") &&
                    <TabPane tab={util.t("user.userCertTabHeader")} key="usercert">
                        <UserCerts
                            id={this.id}
                        />
                    </TabPane>
                } */}
                <TabPane tab={util.t("user.appInfoTabHeader")} key="2">
                    <CollapseList data={this.state.entitledApps || []} refreshTable={this.refreshAppList.bind(this)} />
                </TabPane>
                {/* <TabPane tab={util.t("common.loginActivity")} key="loginactivity">
                    {
                        conf.isFeatureEnabled("user_login_activity") &&
                        <div>
                            <Row className="fs-14 mt-10">
                                <Col span={4}
                                    className="ant-form-item-label"
                                    style={{textAlign: "left", fontWeight: "bold"}}
                                >
                                    <label>{util.t("user.lastLogin")}</label>
                                </Col>
                                <Col span={20}
                                    className="ant-form-item-label"
                                    style={{textAlign: "left"}}
                                >
                                    {this.state.data && util.formatUnixTimestamp(this.state.data.last_login) || "--"}
                                </Col>
                            </Row>
                            <Row>
                                <Col span={4}
                                    className="ant-form-item-label"
                                    style={{textAlign: "left", fontWeight: "bold"}}
                                >
                                    <label>{util.t("user.latestGeos")}</label>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={isLandscape ? 16 : 24}>
                                    {
                                        latestGeos && latestGeos.length>0 && latestGeosObj
                                    }
                                </Col>
                            </Row>
                        </div>
                    }
                </TabPane> */}
            </Tabs>
        );
        //}
        return (
            <div>
                <span className="pathNode">{paths}</span>
                <div className={isLandscape && "pd-lr-20"}>
                    { mainContent }
                </div>
                { validateEmail }
                <ValidateMobile ref={(input) => {this.validateMobile = input;}}
                                onSuccess={this.refresh.bind(this)}
                                sendSms={() => userMgrAPI.sendValidateMobile()}
                />
            </div>
        );
    }
}

export default SelfInfo;
