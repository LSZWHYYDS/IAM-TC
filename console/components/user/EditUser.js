/**
 * Created by tianyun on 2017/1/5.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { createSelector } from "reselect";
import { Checkbox, Collapse, Form, Radio, Input, Row, Col, Button, Breadcrumb, Icon } from "antd";
import MsgTip from "../../common/msgTip";
import axios from "axios";
import validator from "../../common/validator";
import userMgrAPI from "../../api/userMgrAPI";
import policyAPI from "../../api/policyAPI";
import extendedAttrAPI from "../../api/extendedAttrAPI";
import util from "../../common/util";
import ImagePreview from "../../common/imagePreview";
import CheckableOrgTree from "../../common/checkableOrgTree";
import defaultAvatar from "../../img/default-avatar.png";
import { PERM_SETS } from "../../constants";
import { authorized } from "../../common/authorization";
import TagListInput from "../app/TagListInput";
import userUtil from "./userUtil";

const FormItem = Form.Item, RadioGroup = Radio.Group, Panel = Collapse.Panel;
const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 }
};
const formItemLayout2 = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};
const formItemLayout3 = {
    wrapperCol: {
    xs: { span: 8, offset: 0 },
    sm: { span: 13, offset: 6 },
    },
};
let tempLenArr = {}
let tempAttrNameArr = []
let tempStrAttr = [] // 单值属性集合
let tempArrAttr = [] // 多值属性集合
let isSubmitDisabled = true

class EditUser extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            data: null,
            emailValid: true,
            mobileValid: true,
            attrs: null,
            mandatory_attrs: null,
            password_policy: null,
            pwd_complexity: null,
            initPwd: "!aA1****************",
            attrDomainNameArr: [],
            singleValueArr: [],
            makeUpNewAttr: [],
            itemLen: null,
            itemLenArr: []
        };
        this.params = {};
        this.id = this.props.match.params.id;
    }
    componentDidMount() {
        const p1 =  extendedAttrAPI.getAttrList({basic: false}),
            p2 = policyAPI.getPolicies();
        let p3 = null;
        const authorizedManageUser = authorized([
            PERM_SETS.VIEW_USER,
            PERM_SETS.DELETE_USER,
            PERM_SETS.EDIT_USER,
            PERM_SETS.EDIT_USER_PWD,
            PERM_SETS.EXPORT_USER,
            PERM_SETS.IMPORT_USER,
            PERM_SETS.NEW_USER,
            PERM_SETS.ADMIN_APP,
        ], this.props.userPermSets);
        if (this.props.isAdminView && authorizedManageUser) {
            p3 = userMgrAPI.getUser(this.id);
        }else {
            p3 = Promise.resolve(null);
        }
        const p = axios.all([p1, p2, p3]);
        p.then(axios.spread((attrList, policies, userInfo) => {
            const policyData = policies.data.data;
            const userData = userInfo && userInfo.data.data;
            let tempAttrList = attrList.data.data.items
            let attrDomainNameArr = [],
                singleValueArr = [],
                makeUpNewAttr = [],
                mappedItemsArray = []
            
            tempAttrList.forEach((item) => {
                attrDomainNameArr.push(item.domain_name)
                singleValueArr.push(item.single_value)
                makeUpNewAttr.push({
                    display_name: item.display_name,
                    domain_name: item.domain_name,
                    single_value: item.single_value
                })
                if (item.single_value && tempStrAttr.indexOf(item.domain_name) == -1) {
                    tempStrAttr.push(item.domain_name)
                }
                if (!item.single_value && tempArrAttr.indexOf(item.domain_name) == -1) {
                    tempArrAttr.push(item.domain_name)
                }
            })
            makeUpNewAttr.forEach((item, index) => {
                if(userData[item.domain_name]){
                    mappedItemsArray.push(userData[item.domain_name])
                } else {
                    mappedItemsArray.push('')
                    userData[item.domain_name] = ''
                }
            })
            this.setState({
                attrDomainNameArr,
                singleValueArr,
                makeUpNewAttr,
                mappedItemsArray
            })

            this.setState({
                attrs: attrList.data.data.items,
                mandatory_attrs: policyData.signup_policy.mandatory_attrs,
                password_policy: policyData.password_policy,
                pwd_complexity: policyData.pwd_complexity,
                data: userData
            });
        })).catch(function (error) {
            util.showErrorMessage(error);
        });
    }
    componentWillReceiveProps(nextProps) {
        if (this.id !== nextProps.match.params.id) {
            this.id = nextProps.match.params.id;
            this.props.form.resetFields();
            this.getUserInfo(nextProps.match.params.id);
        }
    }
    getUserInfo(userId) {
        const p = userMgrAPI.getUser(userId);
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
        getFieldDecorator(`${attr.domain_name}Arr`, { initialValue: [] });
        let newDom = null
        let domainLenArr = (this.state.data[attr.domain_name] && this.state.data[attr.domain_name].constructor  == String ? this.state.data[attr.domain_name].split(',') : this.state.data[attr.domain_name] && this.state.data[attr.domain_name]) || [null]
        let domainKeys = Object.keys(domainLenArr)
        let domainKeysNumArr = []
        
        domainKeys.forEach((item) => {
            domainKeysNumArr.push(Number(item))
        })
        if(tempAttrNameArr.indexOf(`${attr.domain_name}Arr`) == -1){
            tempAttrNameArr.push(`${attr.domain_name}Arr`)
        }
        if(tempStrAttr.indexOf(attr.domain_name) !== -1){
            newDom = this.creatNewDom(attr, domainKeysNumArr)
        } else {
            newDom = this.creatNewDom(attr, domainKeysNumArr, 'mult')
        }
        
        return (
            <Col>
                {newDom}
                {
                    !attr.single_value && 
                    <FormItem {...formItemLayout3}>
                        <Col span={20}>
                        <Button type="dashed" onClick={this.add.bind(this, attr.domain_name)} style={{ width: "100%" }}>
                            <Icon type="plus" />{util.t("common.add")}
                        </Button>
                        </Col>
                    </FormItem>
                }
            </Col>
        );
    }
    createAttrs(attrs) {
        let i, list = [];
        for (i = 0; i < attrs.length; i ++) {
            list.push(<Row key={"attrs_" + i}>
                {this.creatAttrItem(attrs[i])}
            </Row>);
        }
        return list;
    }
    creatNewDom(attr, defaultValue, isMult) {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator(`${attr.domain_name}Arr`, { initialValue: defaultValue });
        const itemArr = getFieldValue(`${attr.domain_name}Arr`);
        tempLenArr[attr.domain_name] = itemArr.length ? itemArr[itemArr.length-1] : 0
        const formItems = itemArr.map((k, index) => (
        <FormItem
            {...formItemLayout}
            label={isMult ? attr.display_name + (index + 1) : attr.display_name}
            required={false}
            key={k}
        >
            {getFieldDecorator(`${attr.domain_name}[${k}]`, {
                    initialValue: (this.state.data && this.state.data[attr.domain_name].constructor == Array ? this.state.data[attr.domain_name][k] : this.state.data[attr.domain_name]) || ""
                })(<Input placeholder="" style={{ width: "90%" }} />)}
            {itemArr.length > 1 ? (
            <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.remove(attr.domain_name,k)}
                style={{marginLeft: '5px'}}
            />
            ) : null}
        </FormItem>

        ));
        return formItems
    }
    onSubmit() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                isSubmitDisabled = false
                tempAttrNameArr.forEach((item) => {
                    delete values[item]
                })
                tempStrAttr.forEach((item) => {
                    values[item] = values[item].join()
                })
                tempArrAttr.forEach((item) => {
                    let obj = {}
                    obj[item] = []
                    values[item].forEach((val) => {
                        obj[item].push(val)
                        if (val == null) {
                            values[item].splice(val, 1)
                        }
                    })
                    values[item] = obj[item]
                })

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
                    delete vals.password;
                    delete vals.password_status;
                    delete vals.org;
                    let selectedNode = this.selectOrgTree && this.selectOrgTree.getSelectedNode();
                    if (selectedNode) {
                        if (selectedNode.key && selectedNode.key.length>0) {
                            vals.org_ids = selectedNode.key;
                        } else {
                            vals.org_ids = ["_null"];
                        }
                    } else {
                        //nothing changed.
                    }
                    vals.email_verified = this.state.emailValid;
                    vals.phone_number_verified = this.state.mobileValid;
                    const p1 = userMgrAPI.editUser(this.id, vals);
                    let pArr = [p1];
                    if (this.state.initPwd === "") {
                        const p2 = userMgrAPI.adminResetUserPwd({
                            username: values.username,
                            password: values.password
                        });
                        pArr.push(p2);
                    }
                    axios.all(pArr).then(
                        () => {
                            util.showSuccessMessage();
                            this.props.history.push("/home/userInfo/" + this.id);
                            isSubmitDisabled = true
                        }
                    ).catch((error) => {
                        util.showErrorMessage(error);
                    });
                }
            }
        });
    }
    onMarkedEmailValid(e) {
        this.setState({emailValid: e.target.checked});
    }
    onMarkedMobileValid(e) {
        this.setState({mobileValid: e.target.checked});
    }
    onClickTimer() {
        userMgrAPI.sendValidateEmail().catch((error) => {
            util.showErrorMessage(error);
        });
    }
    onPwdChange() {
        if (this.state.initPwd === "!aA1****************") {
            this.setState({initPwd: ""});
        }
    }
    onCancel() {
        this.props.history.goBack();
    }
    add(domain) {
        const { form } = this.props;
        const itemNameArr = form.getFieldValue(`${domain}Arr`);
        let len = tempLenArr[domain]
        const nextKeys = itemNameArr.concat(++len);
        let dataArr = []
        if (this.state.data[domain] && this.state.data[domain].constructor == String) {
            dataArr = this.state.data[domain].split(',')
        } else if (this.state.data[domain] == '') {
            dataArr = ['']
        } else {
            dataArr = this.state.data[domain]
        }
        dataArr.push('')
        let strData = JSON.stringify(this.state.data)
        let objData = JSON.parse(strData)
        objData[domain] = dataArr
        this.setState({
            data: objData
        })
        tempLenArr[domain] = len
        form.setFieldsValue({
            [`${domain}Arr`]: nextKeys,
        });
    }
    remove(domain,k) {
        const { form } = this.props;
        const itemNameArr = form.getFieldValue(`${domain}Arr`);
        let strData = JSON.stringify(this.state.data)
        let objData = JSON.parse(strData)
        objData[domain].splice(k, 1, null)
        this.setState({
            data: objData
        })

        form.setFieldsValue({
            [`${domain}Arr`]: itemNameArr.filter(key => key !== k),
        });
    }
    render() {
        const { getFieldDecorator, getFieldsError, getFieldsValue } = this.props.form;
        const requiredFields = ["username", "orgName"];
        let attrsObj = null;
        if (this.state.attrs) {
            attrsObj = this.createAttrs(this.state.attrs);
        }
        const userNameOptions = {
            initialValue: this.state.data && this.state.data.username
        };
        let userNameObj = <Col span={12 }>
            <FormItem label={util.t("user.username")} {...formItemLayout}>
                {getFieldDecorator("username", userNameOptions)(
                    <Input type="text" readOnly={true}/>
                )}
            </FormItem>
        </Col>;
        let emailValidate = [validator.isEmail],
            sexValidate = [],
            phoneNumValidate = [validator.isPhoneNum],
            nameValidate = [validator.isName],
            nicknameValidate = [validator.isName];
        if (this.state.mandatory_attrs) {
            if (this.state.mandatory_attrs.includes("email") || this.state.emailValid) {
                emailValidate.unshift(validator.required);
                requiredFields.push("email");
            }
            if (this.state.mandatory_attrs.includes("gender")) {
                sexValidate.push(validator.required);
            }
            if (this.state.mandatory_attrs.includes("phone_number") || this.state.mobileValid) {
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
        let nameObj = <Col span={12 }>
            <FormItem label={util.t("user.name")} {...formItemLayout}>
                {getFieldDecorator("name", {
                    validate: nameValidate,
                    initialValue: this.state.data ? this.state.data.name : ""
                })(
                    <Input type="text" maxLength={"32"} />
                )}
            </FormItem>
        </Col>;
        const emailValid = (
            <div className="email-valid-info">
                <Checkbox name="email_verified" onChange={this.onMarkedEmailValid.bind(this)}
                    checked={this.state.emailValid}>
                    {util.t("common.markAsVerified")}
                </Checkbox>
                <MsgTip msg={util.t("message.requiredEmailIfChecked")} />
            </div>
        ),
            mobileValid = (
                <div className="email-valid-info">
                    <Checkbox name="phone_number_verified" onChange={this.onMarkedMobileValid.bind(this)}
                        checked={this.state.mobileValid}>
                        {util.t("common.markAsVerified")}
                    </Checkbox>
                    <MsgTip msg={util.t("message.requiredMobileIfChecked")} />
                </div>
            );
        let pwdObj = null, otherSettings = null; 
        if (this.state.data && !this.state.data.readonly &&
            this.state.data.status !== "INACTIVE" &&
            this.state.password_policy && this.state.password_policy.admin_reset_user_pwd &&
            authorized([PERM_SETS.EDIT_USER_PWD], this.props.userPermSets)) {
            requiredFields.push("password");
            pwdObj = <Col span={12 }>
                <Row>
                    <Col span={18 }>
                        <FormItem label={util.t("user.pwd")} {...formItemLayout2}>
                            {getFieldDecorator("password", {
                                validate: [
                                    validator.required,
                                    validator.isCustomizedPwd(this.state.pwd_complexity)
                                ],
                                initialValue: this.id ? this.state.initPwd : ""
                            })(
                                <Input type="password" onChange={this.onPwdChange.bind(this)} />
                            )}
                        </FormItem>
                    </Col>
                </Row>
            </Col>;
        }
        const emailObj = <Col span={12}>
            <Row>
                <Col span={18}>
                    <FormItem label={util.t("user.email")} {...formItemLayout2}>
                        {getFieldDecorator("email", {
                            validate: emailValidate,
                            initialValue: this.state.data ? this.state.data.email : ""
                        })(
                            <Input type="text" maxLength={"50"} />
                        )}
                    </FormItem>
                </Col>
                <Col span={6} style={{paddingLeft: "5px", lineHeight: "30px"}}>
                    {emailValid}
                </Col>
            </Row>
        </Col>;
        const phoneNumObj = <Col span={12}>
            <Row>
                <Col span={18}>
                    <FormItem label={util.t("user.phoneNum2")} {...formItemLayout2}>
                        {getFieldDecorator("phone_number", {
                            validate: phoneNumValidate,
                            initialValue: this.state.data ? this.state.data.phone_number : ""
                        })(
                            <Input type="text" maxLength={"50"} />
                        )}
                    </FormItem>
                </Col>
                <Col span={6} style={{paddingLeft: "5px", lineHeight: "30px"}}>
                    {mobileValid}
                </Col>
            </Row>
        </Col>;
        let breadcrumbs = null;
        if (this.props.isAdminView) {
            if (this.state.data) {
                breadcrumbs = <Breadcrumb separator=">>">
                    <Breadcrumb.Item href={"#/home/userMgr"}>
                        {util.t("user.user")}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href={"#/home/userInfo/" + this.id}>
                        {util.t("user.userDetail")}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {util.t("user.editUser")}
                    </Breadcrumb.Item>
                </Breadcrumb>;
            }
        }
        let orgObj;
        if (this.state.data && this.state.data.readonly) {
            orgObj = <Row>
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
            </Row>;
        } else if (this.state.data) {
            orgObj = <CheckableOrgTree defaultSelectedKey={this.state.data && this.state.data.orgs && this.state.data.orgs.length>0 ? this.state.data.orgs.map(org=>org.id) : ["_null"] }
                                    defaultSelectedName={this.state.data && this.state.data.orgs && this.state.data.orgs.length>0 ? this.state.data.orgs.map(org=>org.name).join() : util.t("org.defaultOrg")}
                                    titleSpan={formItemLayout.labelCol.span} defaultGroup disabledKeys={["_root","_null"]}
                                    hideKey={["_null"]}
                                    inputSpan={formItemLayout.wrapperCol.span}
                                    form={this.props.form}
                                    ref={(input) => {this.selectOrgTree = input;}}
                                    title={util.t("org.org")}/>;
        }
        return (
            <div>
                <span className="pathNode">{breadcrumbs}</span>
                <Form className="formPadding" layout="horizontal">
                <Collapse defaultActiveKey={["base","ext"]} bordered={false}>
                    <Panel header={util.t("common.baseParam")} key="base">
                        <Row>
                            {userNameObj}
                            {pwdObj}
                            {nameObj}
                            {phoneNumObj}
                            {emailObj}
                        </Row>
                        <Row>
                            <Col span={12}>
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
                            <Col span={12}>
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
                            <Col span={12}>
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
                        {
                            this.state.data &&
                            !userUtil.isSystemUser(this.state.data) &&
                            <Row style={{"height": "52px"}}>
                            <Col span={12}>
                                {orgObj}
                            </Col>
                            <Col span={12}>
                            <FormItem label={util.t("tag.static")} {...formItemLayout}>
                                    {getFieldDecorator("tag", {
                                        initialValue: this.state.data && this.state.data.tag
                                    })(
                                        <TagListInput selections={this.state.data && this.state.data.tag} params={{"type":"STATIC"}}/>
                                    )}
                                </FormItem>
                            </Col>
                        </Row>
                        }
                    </Panel>
                    {/* { attrHtml } */}
                    <Panel header={util.t("attr.extendedAttr")} key="ext">
                        {attrsObj}
                    </Panel>
                    { otherSettings }
                    </Collapse>
                    <div className="footerContainer">
                        {
                            isSubmitDisabled && 
                            <Button type="primary"
                                disabled={util.disabledBtnByFields(getFieldsError(), getFieldsValue(requiredFields))}
                                onClick={this.onSubmit.bind(this)}
                            >
                                {util.t("common.save")}
                            </Button>
                        }
                        {
                            !isSubmitDisabled && 
                            <Button type="primary"
                                disabled={!isSubmitDisabled}
                            >
                                {util.t("common.save")}
                            </Button>
                        }
                        <Button type="ghost"
                                className="ml-10"
                                onClick={this.onCancel.bind(this)}
                        >
                            {util.t("common.cancel")}
                        </Button>
                    </div>
                </Form>
            </div>
        );
    }
}
const isAdminView = createSelector(state => state.view.adminView, (adminView) => adminView);
const userPermSets = createSelector(state => state.login.userPermSets, (userPermSets) => userPermSets);

const mapStateToProps = (state) => ({
    isAdminView: isAdminView(state),
    userPermSets: userPermSets(state),
});

export default connect(mapStateToProps)(Form.create()(EditUser));
