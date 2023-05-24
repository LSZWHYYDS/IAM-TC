/**
 * Created by tianyun on 2017/1/5.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Collapse, Form, Radio, Input, Icon, Row, Col, Button, Breadcrumb } from "antd";
import axios from "axios";
import validator from "../../common/validator";
import userMgrAPI from "../../api/userMgrAPI";
import policyAPI from "../../api/policyAPI";
import extendedAttrAPI from "../../api/extendedAttrAPI";
import util from "../../common/util";
import ImagePreview from "../../common/imagePreview";
import ModalDialog from "../../common/modalDialog";
import TextTimer from "../../common/textTimer";
import ValidateMobile from "../../common/validateMobile";
import defaultAvatar from "../../img/default-avatar.png";
import userMgrCreators from "../../actions/userMgrCreators";

const FormItem = Form.Item, RadioGroup = Radio.Group, Panel = Collapse.Panel;
const isLandscape = util.isLandscape();
const formItemLayout = {
    labelCol: { span: isLandscape ? 6 : 5 },
    wrapperCol: { span: isLandscape ? 12 : 15 }
};
const formItemLayout2 = {
    labelCol: { span: isLandscape ? 8 : 6},
    wrapperCol: { span: isLandscape ? 16 : 18 }
};

class EditSelf extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            data: null,
            showValidateEmail: false,
            emailChanged: false,
            mobileChanged: false,
            emailValid: true,
            mobileValid: true,
            attrs: null,
            mandatory_attrs: null,
        };
        this.id = this.props.match.params.id;
    }
    componentDidMount() {
        const p1 =  extendedAttrAPI.getAttrList({basic: false}),
            p2 = policyAPI.getPolicies(),
            p3 = userMgrAPI.getSelfInfo();

        const p = axios.all([p1, p2, p3]);
        p.then(axios.spread((attrList, policies, userInfo) => {
            const policyData = policies.data.data;
            const userData = userInfo && userInfo.data.data;
            this.setState({
                attrs: attrList.data.data.items,
                mandatory_attrs: policyData.signup_policy.mandatory_attrs,
                data: userData,
            });
            if (userData) {
                this.setState({
                    emailValid: userData.email_verified,
                    mobileValid: userData.phone_number_verified
                });
            }
        })).catch(function (error) {
            util.showErrorMessage(error);
        });
    }
    getSelfInfo() {
        const p = userMgrAPI.getSelfInfo();
        p.then(
            (response) => {
                const data = response.data && response.data.data;
                this.setState({
                    data: data,
                    emailValid: data.email_verified,
                    mobileValid: data.phone_number_verified
                });
            }
        );
    }
    creatAttrItem(attr) {
        const { getFieldDecorator } = this.props.form;
        return (
            <Col span={isLandscape ? 12 : 24}>
                <FormItem label={attr.display_name} {...formItemLayout}>
                    {getFieldDecorator(attr.domain_name, {
                        initialValue: (this.state.data && this.state.data[attr.domain_name]) || ""
                    })(
                        <Input type="text" maxLength={"200"} />
                    )}
                </FormItem>
            </Col>
        );
    }
    createAttrs(attrs) {
        let len = Math.floor(attrs.length / 2),
            last = attrs.length % 2,
            i, list = [];
        for (i = 0; i < len; i ++) {
            list.push(<Row key={"attrs_" + i}>
                {this.creatAttrItem(attrs[2 * i])}
                {this.creatAttrItem(attrs[2 * i + 1])}
            </Row>);
        }
        if (last) {
            list.push(<Row key={"attrs_" + i}>
                {this.creatAttrItem(attrs[2 * i])}
            </Row>);
        }
        return list;
    }
    onSubmit() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let vals = Object.assign({}, values), i;
                if (this.pic.state.image !== defaultAvatar) {
                    vals.picture = this.pic.state.image;
                }
                for (i in vals) {
                    if (vals.hasOwnProperty(i) && i === "orgName") {
                        delete vals[i];
                    }
                }
                if (this.state.data) {
                    delete vals.username;
                    delete vals.org;
                    userMgrAPI.editSelfInfo(vals).then(
                        ()=> {
                            util.showSuccessMessage();
                            this.props.getSelfInfo();
                            this.props.history.push("/home/self/" + this.id);
                        },
                        (error)=>{
                            util.showErrorMessage(error);
                        }
                    );
                }
            }
        });
    }
    onEmailChanged() {
        let email = this.props.form.getFieldValue("email");
        if (this.state.data) {
            if (this.state.data.email_verified) {
                this.setState({
                    emailValid: email === this.state.data.email,
                    emailChanged: email !== this.state.data.email
                });
            } else {
                this.setState({
                    emailValid: false,
                    emailChanged: email !==  this.state.data.email
                });
            }   
        }
    }
    onMobileChanged() {
        let phone_number = this.props.form.getFieldValue("phone_number");
        if (this.state.data) {
            if (this.state.data.phone_number_verified) {
                this.setState({
                    mobileValid: phone_number === this.state.data.phone_number,
                    mobileChanged: phone_number !== this.state.data.phone_number
                });
            } else {
                this.setState({
                    mobileValid: false,
                    mobileChanged: phone_number !== this.state.data.phone_number
                });
            }   
        }
    }
    handleValidateEmail() {
        userMgrAPI.sendValidateEmail();
        this.handleShowValidateEmail(true);
    }
    handleValidateMobile() {
        this.validateMobile.handleSwitchModal(true);
    }
    handleShowValidateEmail(isShow) {
        this.setState({showValidateEmail: isShow});
    }
    onClickTimer() {
        userMgrAPI.sendValidateEmail().catch((error) => {
            util.showErrorMessage(error);
        });
    }
    onCancel() {
        this.props.history.goBack();
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldsValue } = this.props.form;
        const requiredFields = ["username" ];
        let attrsObj = null;
        if (this.state.attrs) {
            attrsObj = this.createAttrs(this.state.attrs);
        }
        let attrHtml = null;
        if (attrsObj && attrsObj.length && attrsObj.length > 0) {
            attrHtml = (
                <Panel header={util.t("attr.extendedAttr")} key="ext">
                    {attrsObj}
                </Panel>
            );
        }
        const userNameOptions = {
            initialValue: this.state.data && this.state.data.username
        };
        const userNameObj = (
            <Col span={isLandscape ? 12 : 24}>
                <FormItem label={util.t("user.username")} {...formItemLayout}>
                    {getFieldDecorator("username", userNameOptions)(
                        <Input type="text" readOnly={true}/>
                    )}
                </FormItem>
            </Col>
        );

        let emailValidate = [validator.isEmail, validator.changeListener(this.onEmailChanged.bind(this))],
            sexValidate = [],
            phoneNumValidate = [validator.isPhoneNum, validator.changeListener(this.onMobileChanged.bind(this))],
            nameValidate = [validator.isName],
            nicknameValidate = [validator.isName];
        if (this.state.mandatory_attrs) {
            if (this.state.mandatory_attrs.includes("email") || !this.id && this.state.emailValid) {
                emailValidate.unshift(validator.required);
                requiredFields.push("email");
            }
            if (this.state.mandatory_attrs.includes("gender")) {
                sexValidate.push(validator.required);
            }
            if (this.state.mandatory_attrs.includes("phone_number") || !this.id && this.state.mobileValid) {
                phoneNumValidate.unshift(validator.required);
                requiredFields.push("phone_number");
            }
            if (this.state.mandatory_attrs.includes("name")) {
                nameValidate.unshift(validator.required);
            }
            if (this.state.mandatory_attrs.includes("nickname")) {
                nicknameValidate.unshift(validator.required);
            }
        }
        let nameObj = <Col span={isLandscape ? 12 : 24}>
            <FormItem label={util.t("user.name")} {...formItemLayout}>
                {getFieldDecorator("name", {
                    validate: nameValidate,
                    initialValue: this.state.data ? this.state.data.name : ""
                })(
                    <Input type="text" maxLength={"32"} />
                )}
            </FormItem>
        </Col>;
        let emailValid = null, mobileValid = null ;
        if (this.state.data) {
            if (!this.state.emailChanged && this.state.data.email) {
                if (this.state.data.email_verified) {
                    emailValid = <div className="pre-tip-blue">{util.t("common.validated")}</div>;
                } else {
                    emailValid = <Button type="primary" className="ml-5" onClick={this.handleValidateEmail.bind(this)}>
                        {isLandscape ? util.t("common.validateImmediately") : util.t("common.validate")}
                    </Button>;
                }
            }
            if (!this.state.mobileChanged && this.state.data.phone_number) {
                if (this.state.data.phone_number_verified) {
                    mobileValid = <div className="pre-tip-blue">{util.t("common.validated")}</div>;
                } else {
                    mobileValid = <Button type="primary" className="ml-5" onClick={this.handleValidateMobile.bind(this)}>
                        {isLandscape ? util.t("common.validateImmediately") : util.t("common.validate")}
                    </Button>;
                }
            }
        }
        let emailObj = (
            <Col span={isLandscape ? 12 : 24}>
                <Row>
                    <Col span={isLandscape ? 18 : 20}>
                        <FormItem label={util.t("user.email")} {...formItemLayout2}>
                            {getFieldDecorator("email", {
                                validate: emailValidate,
                                initialValue: this.state.data ? this.state.data.email : ""
                            })(
                                <Input type="text" maxLength={"50"} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={isLandscape ? 6 : 4} style={{paddingLeft: "5px", lineHeight: "30px"}}>
                        {emailValid}
                    </Col>
                </Row>
            </Col>
        );
        let phoneNumObj = (
            <Col span={isLandscape ? 12 : 24}>
                <Row>
                    <Col span={isLandscape ? 18 : 20}>
                        <FormItem label={util.t("user.phoneNum2")} {...formItemLayout2}>
                            {getFieldDecorator("phone_number", {
                                validate: phoneNumValidate,
                                initialValue: this.state.data ? this.state.data.phone_number : ""
                            })(
                                <Input type="text" maxLength={"50"} />
                            )}
                        </FormItem>
                    </Col>
                    <Col span={isLandscape ? 6 : 4} style={{paddingLeft: "5px", lineHeight: "30px"}}>
                        {mobileValid}
                    </Col>
                </Row>
            </Col>
        );
        const orgObj = (
            <Row>
                <Col>
                    <FormItem label={util.t("org.org")} {...formItemLayout}>
                        {getFieldDecorator("org", {
                            initialValue: this.state.data && this.state.data.orgs && this.state.data.orgs.length ?
                                this.state.data.orgs.map(org => org.name).join(): util.t("org.defaultOrg")
                        })(
                            <Input type="text" readOnly />
                        )}
                    </FormItem>
                </Col>
            </Row>
        );
        return (
            <div>
                <span className="pathNode">
                    <Breadcrumb separator=">>">
                        <Breadcrumb.Item href={"#/home/self/" + this.id}>
                            {util.t("user.userAttrs")}
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {util.t("user.editUserAttrs")}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </span>
                <Form className={isLandscape ? "formPadding" : "formPaddingMobile"} layout="horizontal">
                <Collapse defaultActiveKey={["base","ext"]} bordered={false}>
                    <Panel header={util.t("common.baseParam")} key="base">
                        <Row>
                            {userNameObj}
                            {nameObj}
                            {phoneNumObj}
                            {emailObj}
                        </Row>
                        <Row>
                            <Col span={isLandscape ? 12 : 24}>
                                <Col span={formItemLayout.labelCol.span} style={{textAlign: "right", marginTop: "15px"}}>
                                    <label>头像：</label>
                                </Col>
                                <Col span={formItemLayout.wrapperCol.span}>
                                    <ImagePreview ref={(input) => {this.pic = input;}}  
                                                  maxSize={50}
                                                  type={["jpeg", "png"]}
                                                  tip={util.t("validate.imgType")}
                                                  src={this.state.data && this.state.data.picture ?
                                                  this.state.data.picture : defaultAvatar}
                                    />
                                </Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={isLandscape ? 12 : 24}>
                                <FormItem label={util.t("user.nickName")} {...formItemLayout}>
                                    {getFieldDecorator("nickname", {
                                        validate: nicknameValidate,
                                        initialValue: this.state.data ?
                                            this.state.data.nickname : ""
                                    })(
                                        <Input type="text" maxLength={"32"} />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={isLandscape ? 12 : 24}>
                                <FormItem label={util.t("user.sex")} {...formItemLayout}>
                                    {getFieldDecorator("gender", {
                                        validate: sexValidate,
                                        initialValue: this.state.data && this.state.data.gender ?
                                            this.state.data.gender : "SECRET"
                                    })(
                                        <RadioGroup onChange={this.onChange}>
                                            <Radio value={"SECRET"}>{util.t("user.secret")}</Radio>
                                            <Radio value={"MALE"}>{util.t("user.male")}</Radio>
                                            <Radio value={"FEMALE"}>{util.t("user.female")}</Radio>
                                        </RadioGroup>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        <Row style={{"height": "52px"}}>
                            <Col span={isLandscape ? 12 : 24}>
                                {orgObj}
                            </Col>
                        </Row>
                    </Panel>
                    { attrHtml }
                    </Collapse>
                    <div className="footerContainer">
                        <Button type="primary"
                            disabled={util.disabledBtnByFields(getFieldsError(), getFieldsValue(requiredFields))}
                            onClick={this.onSubmit.bind(this)}
                        >
                            {util.t("common.save")}
                        </Button>
                        <Button type="ghost"
                                className="ml-10"
                                onClick={this.onCancel.bind(this)}
                        >
                            {util.t("common.cancel")}
                        </Button>
                    </div>
                </Form>
                <ValidateMobile ref={(input) => {this.validateMobile = input;}}
                                onSuccess={this.getSelfInfo.bind(this)}
                                sendSms={() => userMgrAPI.sendValidateMobile()}
                />
                <ModalDialog show={this.state.showValidateEmail}>
                    <div className="forgetPwd">
                        <div className="forgetPwd-title"><Icon type="check-circle-o" />{util.t("message.emailSent")}</div>
                        <p>
                            {util.t("message.emailSentMsg1")}
                            <span className="forgetPwd-email">{this.state.data ? this.state.data.email : null}</span>
                            {util.t("message.emailSentMsg2")}
                            {util.t("message.emailSentMsg3")}
                            {
                                this.state.showValidateEmail ?
                                <TextTimer text={util.t("common.sendAgain")} onClickText={this.onClickTimer.bind(this)}/> :
                                null
                            }
                        </p>
                    </div>
                    <div style={{textAlign: "right"}}>
                        <Button type="ghost"
                                className="ml-10 fs-16"
                                onClick={this.handleShowValidateEmail.bind(this, false)}
                        >
                            {util.t("common.close")}
                        </Button>
                    </div>
                </ModalDialog>
            </div>
        );
    }
}

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => ({
    getSelfInfo: () => dispatch(userMgrCreators.getSelfInfo())
});

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(EditSelf));
