/**
 * Created by shaliantao on 2017/8/24.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Form, Button, Breadcrumb, Row, Col, Input, Radio, Checkbox, Select, Collapse } from "antd";
import { connect } from "react-redux";
import util from "../../common/util";
import { app } from "../../common/map";
import ImagePreview from "../../common/imagePreview";
import InfoItem from "../../common/infoItem";
import validator from "../../common/validator";
import MsgTip from "../../common/msgTip";
import DynamicFieldSet from "../../common/dynamicFieldSet";
import ClientSecret from "./ClientSecret";
import appActionCreators from "../../actions/appActionCreators";
import appAPI from "../../api/appAPI";
import profileAPI from "../../api/profileAPI";
import conf from "../../conf";
import appUtil from "./appUtil";

const FormItem = Form.Item, RadioGroup = Radio.Group, Option = Select.Option, Panel = Collapse.Panel;

class EditApp extends Component {
    constructor(...args) {
        super(...args);
        const {application_type, refresh_token_timeout} = this.props.appDetail;
        this.state = {
            requiredFields: [],
            showCustomize: application_type !== "spa" && refresh_token_timeout,
            _appListLoaded: false,
            _extraAuthFactorAttrListLoaded: false,
            _profileListLoaded: false,
            isShowWebHookUrl: false,
        };
        this.loadAppList();
        this.loadExtraAuthFactorAttrList();
        // this.loadProfileList(); // 自画像接口暂时不用
    }
    loadAppList() {
        const appList =  appAPI.getList();

        appList.then(response => {
            this.setState({_appListLoaded : true});
            this.props.setAppList(response.data);
        });
    }
    loadExtraAuthFactorAttrList() {
        const extraAuthFactorAttrList =  appAPI.getExtraAuthFactorAttrList();

        extraAuthFactorAttrList.then(response => {
            this.setState({_extraAuthFactorAttrListLoaded : true});
            this.props.setExtraAuthFactorAttrList(response.data);
        });
    }

    loadProfileList() {
        const profileList =  profileAPI.getProfileList();

        profileList.then(response => {
            this.setState({_profileListLoaded : true});
            this.props.setProfileList(response.data);
        });
    }

    //search Attribute by domain name from loaded extraAuthFactorAttrList
    searchFromExtraAuthFactorAttrList(domainName) {
        return this.props.extraAuthFactorAttrList.filter(attr => attr.domain_name === domainName)[0];
    }

    //search profile info by profieId from profileList
    searchFormProfileList(profileId) {
        return this.props.profileList.filter(profile => profile.id === profileId)[0];
    }

    componentDidMount() {
        util.filterDangerousChars();
        this.setState({
            requiredFields: [],
            isShowWebHookUrl: this.props.appDetail.webhook_enable
        });
    }
    onSubmit() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = {
                    access_token_timeout: parseInt(values.access_token_timeout, 10) * 60,
                    client_name: values.client_name,
                    client_uri: values.client_uri,
                    webhook: values.webhook,
                    description: values.description,
                    id_token_timeout: values.id_token_timeout ? parseInt(values.id_token_timeout, 10) * 60 : 1800,
                    trusted_peers: values.trusted_peers,
                    validate_factors: values.validate_factors,
                    profile_ref: values.profile_ref,
                };
                if (values.refresh_token_timeout_type === "customize") {
                    params.refresh_token_timeout = parseInt(values.refresh_token_timeout, 10) * 3600;
                } else if (values.refresh_token_timeout_type === "neverExpired") {
                    params.refresh_token_timeout = 0;
                }
                const { application_type } = this.props.appDetail;
                if (appUtil.hasRedirectURI(application_type)) {
                    params.redirect_uris = values.keys.map((k) => values[`uris-${k}`]);
                }
                if (appUtil.isSyncData(application_type)) {
                    params.webhook_enable = values.webhook_enable;
                }
                if (appUtil.needsConsentPrompt(application_type)) {
                    params.whitelisted = values.whitelisted;
                }
                if (appUtil.canLoginWithQRCode(application_type)) {
                    params.qrcode_enable = values.qrcode_enable;
                }
                if (appUtil.canLoginWithOneTimePwd(application_type)) {
                    params.one_time_pwd_enable = values.one_time_pwd_enable;
                }
                if (appUtil.canLoginWithSecureLogin(application_type)) {
                    params.secure_login_enable = values.secure_login_enable;
                }
                if (appUtil.supportCliMode(application_type)) {
                    params.cli_mode_enable = values.cli_mode_enable;
                }
                if (appUtil.canAuthWithCert(application_type)) {
                    params.auth_with_cert_enable = values.auth_with_cert_enable;
                }
                if (appUtil.canUseExtraAuthFactor(application_type)) {
                    params.validate_factors = values.validate_factors;
                }
                if (this.pic.state.image !== app.getDefaultAppIcon(application_type)) {
                    params.logo_uri = this.pic.state.image;
                }
                const { client_id } = this.props.appDetail;
                appAPI.edit(client_id, params).then(
                    (response) => {
                        this.props.setAppDetail(response.data && response.data.data);
                        util.showSuccessMessage();
                    }
                ).then(
                    () => {
                        this.props.history.push("/home/appInfo/" + client_id);
                    },
                    (error) => {
                        util.showErrorMessage(error);
                    }
                );
            }
        });
    }
    onCancel () {
        this.props.history.push("/home/appInfo/" + this.props.appDetail.client_id);
    }
    downloadCert() {
        window.open(`${conf.getServiceUrl()}/apps/${this.props.appDetail.client_id}/download_cert?tcode=${localStorage.getItem("tcode")}`);
    }
    changeTimeoutType(e) {
        this.setState({
            showCustomize: e.target.value === "customize"
        });
    }
    onWebhookEnable(e) {
        this.setState({
            isShowWebHookUrl: e.target.checked
        })
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 }
        };
        const { getFieldDecorator, getFieldsError, getFieldsValue } = this.props.form;
        const {
            client_name, application_type, client_id_issued_at, client_id, client_secret,
            cli_mode_enable, profile_ref,
            description, logo_uri, client_uri, webhook_enable, webhook, redirect_uris, access_token_timeout,
            refresh_token_timeout, id_token_timeout, whitelisted,
            trusted_peers = [], qrcode_enable, one_time_pwd_enable, secure_login_enable, auth_with_cert_enable,
        } = this.props.appDetail;
        let { validate_factors = [] } = this.props.appDetail;

        const map = {
            "NATIVE": util.t("tip.nativeRedirectURIs"),
            "SPA": util.t("tip.spaRedirectURIs"),
            "WEB": util.t("tip.webRedirectURIs")
        };
        /**
         * filter app by application name, case insensitive.
         * @param {*} inputValue user input text
         * @param {*} option dropdown option
         */
        const filterApp = function(inputValue, option){
            const keyword = option.props.keyword;
            return keyword.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1;
        };
        const trustedPeerInfo = (
            this.state._appListLoaded && this.props.appList && this.props.appList.length > 1 ?
                <Select mode="multiple" style={{ width: "100%" }} filterOption={filterApp} allowClear={true} placeholder={util.t("app.trustedPeersDropDown")}>
                    {
                        this.props.appList
                        .filter(app => app.client_id !== client_id) //not itself
                        .filter(appUtil.trustable)
                        .map(application => {
                            return (
                                <Option key={application.client_id} title={application.client_id} disabled={!appUtil.isActive(application)} keyword={application.client_name}>
                                    <img src={application.logo_uri || app.getDefaultAppIcon(application.application_type)}
                                        style={{verticalAlign:"middle", width: "30px", height: "30px", cursor: application.client_uri && "pointer"}}
                                        onClick={util.openLink.bind(this, application.client_uri)} />
                                    <span style={{display: "inline-block", marginLeft: "10px"}} title={application.client_id}>
                                        {application.client_name}
                                    </span>
                                </Option>
                            );
                        })
                    }
                </Select>
            : <Select mode="multiple" style={{ width: "100%" }}  allowClear={true} placeholder={util.t("app.trustedPeersDropDown")}/>
        );

        const profileInfo = (
            this.state._profileListLoaded && this.props.profileList && this.props.profileList.length > 0 ?
            <Select mode="default" style={{ width: "100%" }} filterOption={filterApp} allowClear={true} placeholder={util.t("app.profileRefDropDown")}>
                    {
                        this.props.profileList
                        .map(profile => {
                            return (
                                <Option key={profile.name} title={profile.name} keyword={profile.id} value={profile.id}>
                                    <span style={{display: "inline-block", marginLeft: "10px"}} title={profile.name}>
                                        {profile.name}
                                    </span>
                                </Option>
                            );
                        })
                    }
                </Select>
            : <Select mode="default" style={{ width: "100%" }}  allowClear={true} placeholder={util.t("app.profileRefDropDown")}/>
        );

        const currentProfile = (profile_ref && this.props.profileList && this.props.profileList.length > 0 ?
                this.searchFormProfileList(profile_ref) : {name: "--"}
            );

        const filterFactor= function(inputValue, option){
            const description = option.props.description,
                domainName = option.props.title,
                display = option.props.displayName;

            const m1 = (description && description.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1),
                m2 = (domainName && domainName.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) ,
                m3 = (display && display.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) ;

            return m1 || m2 || m3;
        };

        if (this.state._extraAuthFactorAttrListLoaded) {
            validate_factors = validate_factors.filter(factor =>
                this.searchFromExtraAuthFactorAttrList(factor)
            );
        }
        const extraAuthFactorsInfo = (
            this.state._extraAuthFactorAttrListLoaded && this.props.extraAuthFactorAttrList && this.props.extraAuthFactorAttrList.length > 0 ?
                <Select mode="multiple" style={{ width: "100%" }} filterOption={filterFactor} allowClear={true} placeholder={util.t("app.extraAuthFactorsDropDown")}>
                    {
                        this.props.extraAuthFactorAttrList
                        .map(attr => {
                            return (
                                <Option key={attr.domain_name} title={attr.domain_name} displayName={attr.display_name} description={attr.description}>
                                    <span style={{display: "inline-block"}}> {attr.display_name}</span>
                                </Option>
                            );
                        })
                    }
                </Select>
            : <Select mode="multiple" style={{ width: "100%" }}  allowClear={true} placeholder={util.t("app.extraAuthFactorsDropDown")}/>
        );
        return (
            <div>
                <span className="pathNode">
                    <Breadcrumb separator=">>">
                        <Breadcrumb.Item href="#/home/appList">{util.t("app.app")}</Breadcrumb.Item>
                        <Breadcrumb.Item href={"#/home/appInfo/" + client_id}>{util.t("app.detail")}</Breadcrumb.Item>
                        <Breadcrumb.Item>{util.t("app.edit")}</Breadcrumb.Item>
                    </Breadcrumb>
                </span>
                <Form className="formPadding" layout="horizontal">
                    <Collapse defaultActiveKey={["appbasic","apptoken","apppolicy", "appcert", "climode"]} bordered={false}>
                        <Panel header={util.t("app.info.panels.basic")} key="appbasic">
                            <Row>
                                <Col span={24}>
                                    <FormItem label={util.t("app.name")} {...formItemLayout}>
                                        {getFieldDecorator("client_name", {
                                            validate: [validator.required],
                                            initialValue: client_name || ""
                                        })(
                                            <Input type="text" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <InfoItem titleStr={util.t("app.type")}
                                  isNormal={true}
                                  contentObj={app.getAppType(application_type)  || "--"}
                                  contentSpan={14}
                            />
                            <InfoItem titleStr={util.t("common.createTime")}
                                    isNormal={true}
                                    contentObj={util.formatDateTime(client_id_issued_at * 1000)}
                                    contentSpan={14}
                            />
                            <InfoItem titleStr={"Client ID"}
                                    isNormal={true}
                                    contentObj={client_id || "--"}
                                    contentSpan={14}
                            />
                            {
                                appUtil.hasClientSecret(this.props.appDetail) &&
                                <ClientSecret clientSecret={client_secret}
                                    clientID={client_id}
                                    isEdit={true}
                                    mergeAppDetail={this.props.mergeAppDetail}
                                />
                            }
                            <Row>
                                <Col span={24}>
                                    <FormItem label={util.t("app.appBriefIntro")} {...formItemLayout}>
                                        {getFieldDecorator("description", {
                                            initialValue: description || ""
                                        })(
                                            <Input type="textarea" maxLength={"255"} placeholder="255个字以内"/>
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Col span={formItemLayout.labelCol.span} style={{textAlign: "right", marginTop: "15px"}}>
                                        <label>{util.t("app.appIcon")}：</label>
                                    </Col>
                                    <Col span={formItemLayout.wrapperCol.span}>
                                        <ImagePreview ref={(input) => {this.pic = input;}}
                                                    maxSize={50}
                                                    type={["jpeg", "png"]}
                                                    tip={util.t("validate.imgType")}
                                                    src={logo_uri || app.getDefaultAppIcon(application_type)}
                                        />
                                    </Col>
                                </Col>
                            </Row>

                            {/* <Row>
                                <Col span={24}>
                                    <FormItem label={<span title={util.t("app.appProfileRef")}>
                                            {util.t("app.appProfileRef")}
                                            <MsgTip msg={util.t("tip.appProfileRef")} />
                                        </span>} {...formItemLayout}>
                                        {   getFieldDecorator("profile_ref", {
                                                validate: [validator.required],
                                                initialValue: currentProfile.id
                                            })(profileInfo)
                                        }
                                    </FormItem>
                                </Col>
                            </Row> */}
                            <Row>
                                <Col span={24}>
                                    <FormItem label={<span title={util.t("app.appHomePage")}>
                                            {util.t("app.appHomePage")}
                                            <MsgTip msg={util.t("tip.appHomePage")} />
                                        </span>} {...formItemLayout}>
                                        {getFieldDecorator("client_uri", {
                                            validate: [validator.isRedirectUri("web")],
                                            initialValue: client_uri || ""
                                        })(
                                            <Input type="text" />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            {
                                appUtil.isSyncData(application_type) &&
                                <Row>
                                    <Col span={24}>
                                        <FormItem label={util.t("app.webHookEnable")} {...formItemLayout}>
                                            {
                                                getFieldDecorator("webhook_enable", {
                                                    valuePropName: "checked",
                                                    initialValue: webhook_enable
                                                })(<Checkbox onChange={this.onWebhookEnable.bind(this)}>{util.t("common.enable")}</Checkbox>)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                            }
                            {
                                this.state.isShowWebHookUrl &&
                                <Row>
                                    <Col span={24}>
                                        <FormItem label={<span title={util.t("app.webHookUrl")}>
                                                {util.t("app.webHookUrl")}
                                            </span>} {...formItemLayout}>
                                            {getFieldDecorator("webhook", {
                                                validate: [validator.isWebHookUri("web")],
                                                initialValue: webhook || ""
                                            })(
                                                <Input type="text" />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            }
                            {
                            appUtil.hasRedirectURI(application_type) &&
                                <DynamicFieldSet {...this.props.form}
                                    appType={application_type}
                                    dataArr={redirect_uris || []}
                                    label={<span title="RedirectURIs">
                                        {"RedirectURIs"}
                                        <MsgTip msg={map[application_type]} />
                                    </span>}
                                    labelSpan={6}
                                    wrapperSpan={15}
                                />
                            }
                        </Panel>
                        <Panel header={util.t("app.info.panels.token")} key="apptoken">
                            <Row>
                                <Col span={24}>
                                    <FormItem label={util.t("app.accessTokenTimeout")} {...formItemLayout}>
                                        {getFieldDecorator("access_token_timeout", {
                                            validate: [
                                                validator.required,
                                                validator.numberRange(1, 120)
                                            ],
                                            initialValue: access_token_timeout ? access_token_timeout/60  : ""
                                        })(
                                            <Input type="number" addonAfter={util.t("common.minute")} />
                                        )}
                                    </FormItem>
                                </Col>
                            </Row>
                            {
                                appUtil.canOfflineAccess(application_type) &&
                                <Row>
                                    <Col span={24}>
                                        <FormItem {...formItemLayout} label={util.t("app.refreshTokenTimeout")}>
                                            {getFieldDecorator("refresh_token_timeout_type", {
                                                initialValue: refresh_token_timeout === 0 ? "neverExpired" : "customize"
                                            })(
                                                <RadioGroup onChange={this.changeTimeoutType.bind(this)}>
                                                    <Radio value="customize">{util.t("common.customize")}</Radio>
                                                    <Radio value="neverExpired">{util.t("common.neverExpired")}</Radio>
                                                </RadioGroup>
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            }
                            {
                                this.state.showCustomize &&
                                <Row>
                                    <Col span={24}>
                                        <FormItem label={util.t("common.time")} {...formItemLayout}>
                                            {getFieldDecorator("refresh_token_timeout", {
                                                validate: [
                                                    validator.required,
                                                    validator.numberRange(1, 720)
                                                ],
                                                initialValue: refresh_token_timeout/3600 || ""
                                            })(
                                                <Input type="number" addonAfter={util.t("common.hour")} />
                                            )}
                                        </FormItem>
                                    </Col>
                                </Row>
                            }
                            <Row>
                                {
                                    appUtil.hasIdToken(application_type) &&
                                    <Col span={24}>
                                        <FormItem label={util.t("app.idTokenTimeout")} {...formItemLayout}>
                                            {getFieldDecorator("id_token_timeout", {
                                                validate: [
                                                    validator.required,
                                                    validator.numberRange(1, 1024)
                                                ],
                                                initialValue: id_token_timeout ? id_token_timeout/60 : ""
                                            })(
                                                <Input type="number" addonAfter={util.t("common.minute")} />
                                            )}
                                        </FormItem>
                                    </Col>
                                }
                            </Row>
                        </Panel>
                        <Panel header={util.t("app.info.panels.policy")} key="apppolicy">
                            {
                                appUtil.needsConsentPrompt(application_type) &&
                                <Row>
                                    <Col span={24}>
                                        <FormItem label={util.t("app.licenseFreeApp")} {...formItemLayout}>
                                            {
                                                getFieldDecorator("whitelisted", {
                                                    valuePropName: "checked",
                                                    initialValue: whitelisted
                                                })(<Checkbox>{util.t("common.enable")}</Checkbox>)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                            }
                            {
                                appUtil.canBeAuthorizationDelegated(application_type) &&
                                <Row>
                                    <Col span={24}>
                                        <FormItem label={<span title={util.t("app.trustedPeers")}>
                                                {util.t("app.trustedPeers")}
                                                <MsgTip msg={util.t("tip.trustedPeers")} />
                                            </span>} {...formItemLayout}>
                                            {
                                                getFieldDecorator("trusted_peers", {
                                                    initialValue: trusted_peers,
                                                })(trustedPeerInfo)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                            }
                            {
                                appUtil.canLoginWithQRCode(application_type) &&
                                <Row>
                                    <Col span={24}>
                                        <FormItem label={util.t("app.enableQRCodeLogin")} {...formItemLayout}>
                                            {
                                                getFieldDecorator("qrcode_enable", {
                                                    valuePropName: "checked",
                                                    initialValue: qrcode_enable
                                                })(<Checkbox>{util.t("common.enable")}</Checkbox>)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                            }
                            {
                                appUtil.canLoginWithOneTimePwd(application_type) &&
                                <Row>
                                    <Col span={24}>
                                        <FormItem label={util.t("app.enableOneTimePwd")} {...formItemLayout}>
                                            {
                                                getFieldDecorator("one_time_pwd_enable", {
                                                    valuePropName: "checked",
                                                    initialValue: one_time_pwd_enable
                                                })(<Checkbox>{util.t("common.enable")}</Checkbox>)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                            }
                            {
                                appUtil.canLoginWithSecureLogin(application_type) &&
                                <Row>
                                    <Col span={24}>
                                        <FormItem label={util.t("app.enableSecureLogin")} {...formItemLayout}>
                                            {
                                                getFieldDecorator("secure_login_enable", {
                                                    valuePropName: "checked",
                                                    initialValue: secure_login_enable
                                                })(<Checkbox>{util.t("common.enable")}</Checkbox>)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                            }
                            {
                                appUtil.canAuthWithCert(application_type) &&
                                <Row>
                                    <Col span={24}>
                                        <FormItem label={<span title={util.t("app.authWithCert")}>
                                                {util.t("app.authWithCert")}
                                                <MsgTip msg={util.t("tip.authWithCert")} />
                                            </span>} {...formItemLayout}>
                                            {
                                                getFieldDecorator("auth_with_cert_enable", {
                                                    valuePropName: "checked",
                                                    initialValue: auth_with_cert_enable
                                                })(<Checkbox>{util.t("common.enable")}</Checkbox>)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                            }
                            {
                                appUtil.canUseExtraAuthFactor(application_type) &&
                                <Row>
                                    <Col span={24}>
                                        <FormItem label={<span title={util.t("app.extraAuthFactors")}>
                                                {util.t("app.extraAuthFactors")}
                                                <MsgTip msg={util.t("tip.extraAuthFactors")} />
                                            </span>} {...formItemLayout}>
                                            {
                                                getFieldDecorator("validate_factors", {
                                                    initialValue: validate_factors,
                                                })(extraAuthFactorsInfo)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                            }
                        </Panel>
                        {
                            appUtil.supportCliMode(application_type) &&
                            <Panel header={util.t("app.info.panels.climode")} key="climode">
                                <Row>
                                    <Col span={24}>
                                        <FormItem label={<span title={util.t("app.enableCliMode")}>
                                                {util.t("app.enableCliMode")}
                                                <MsgTip msg={util.t("tip.enableCliMode")} />
                                            </span>} {...formItemLayout}>
                                            {
                                                getFieldDecorator("cli_mode_enable", {
                                                    valuePropName: "checked",
                                                    initialValue: cli_mode_enable
                                                })(<Checkbox>{util.t("common.enable")}</Checkbox>)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Panel>
                        }
                        <Panel header={util.t("app.info.panels.cert")} key="appcert">
                            <Row>
                                <Col span={24}>
                                    <InfoItem titleStr={util.t("app.signatureCert")}
                                        isNormal={true}
                                        contentObj={<Button type="primary" onClick={this.downloadCert.bind(this)}>{util.t("common.clickToDownload")}</Button>}
                                        contentSpan={14}
                                    />
                                </Col>
                            </Row>
                        </Panel>
                    </Collapse>
                    <div className="footerContainer">
                        <Button type="primary"
                                disabled={util.disabledBtnByFields(getFieldsError(), getFieldsValue(this.state.requiredFields))}
                                onClick={this.onSubmit.bind(this)}
                        >
                            {util.t("common.save")}
                        </Button>
                        <Button type="ghost" className="ml-10" onClick={this.onCancel.bind(this)}>
                            {util.t("common.cancel")}
                        </Button>
                    </div>
                </Form>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    appDetail: state.app.appDetail,
    appList: state.app.appList,
    extraAuthFactorAttrList: state.app.extraAuthFactorAttrList,
    profileList: state.app.profileList,
});
const mapDispatchToProps = (dispatch) => ({
    setAppDetail: (data) => dispatch(appActionCreators.setAppDetail(data)),
    mergeAppDetail: (data) => dispatch(appActionCreators.mergeAppDetail(data)),
    setAppList: (data) => dispatch(appActionCreators.setAppList(data)),
    setExtraAuthFactorAttrList: (data) => dispatch(appActionCreators.setExtraAuthFactorAttrList(data)),
    setProfileList: (data) => dispatch(appActionCreators.setProfileList(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(EditApp));
