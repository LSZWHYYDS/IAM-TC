/**
 * Created by shaliantao on 2017/8/24.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import axios from "axios";
import {
   Button, Checkbox, Breadcrumb, Row, Col, Dropdown, Menu, Modal, Spin, Icon, Tabs, Collapse, Form,
   Input, Select, Radio, Upload, Card, message
} from "antd";
import { createSelector } from "reselect";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import util from "../../common/util";
import { authorized } from "../../common/authorization";
import { app } from "../../common/map";
import InfoItem from "../../common/infoItem";
import IncsearchUser from "../../common/IncsearchUser";
import ClientSecret from "./ClientSecret";
import appActionCreators from "../../actions/appActionCreators";
import appAPI from "../../api/appAPI";
import profileAPI from "../../api/profileAPI";
import conf from "../../conf";
import appUtil from "./appUtil";
import EntitledUserList from "./EntitledUserList";
import EntitledTagList from "./EntitledTagList";
import EntitledOrgTree from "./EntitledOrgTree";
import AppPermList from "./AppPermList";
import AppPermSetList from "./AppPermSetList";
import PermDialog from "./PermDialog";
import PermSetDialog from "./PermSetDialog";
import RoleDialog from "./RoleDialog";
import AppRoleList from "./AppRoleList";
import MsgTip from "../../common/msgTip";
import { PERM_SETS } from "../../constants";
import AuthzComponent from "../../common/AuthzComponent";
import TagListInput from "./TagListInput";
import Options from '../../common/OptionsModal'

const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const MenuItem = Menu.Item, TabPane = Tabs.TabPane, Panel = Collapse.Panel;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
const Dragger = Upload.Dragger;


let uuid = 0;
const havePlaceholderInfo = ['input', 'select'];
const haveOptionsInfo = ['input', 'datePick'];

class AppInfo extends Component {
   constructor(...args) {
      super(...args);
      this.state = {
         showDelModal: false,
         editingPerm: false,
         editingPermSet: false,
         editingRole: false,
         isLoading: false,
         new_user_selected: false,
         new_tag_selected: false,
         reload_permission_sets: false,
         reload_roles: false,


         logo_base64: '',
         preview_base64: '',


         previewVisible: false,
         previewImage: '',
         fileList: [],

         previewVisible_ls: false,
         previewImage_ls: '',
         fileList_ls: [],

         // 控制是否显示提示语输入框 只有输入框和选择框有提示
         isShowTipsInput: true,
         // 控制是否显示配置项输入框和选择框 无配置项
         isShowOptions: true,
         // options项、
         isOptions: [],
         // rules 规则项
         isRules: [],
         // 存放每个控件的配置项
         objectController: {},


         // 控制非必填项不显示非必填信息
         isShowRequireInfo: true
      };
      this.id = this.props.match.params.id;
      this.setReload = this.setReload.bind(this);
      // this.uploadFunc_logo = this.uploadFunc_logo.bind(this);
      // this.uploadFunc_preview = this.uploadFunc_preview.bind(this)
      this.beforeUpload = this.beforeUpload.bind(this);
      this.handleChange_ls = this.handleChange_ls.bind(this);
      this.handleCancel_ls = this.handleCancel_ls.bind(this)
      this.handlePreview_ls = this.handlePreview_ls.bind(this)

      // 应用预览相关处理函数
      this.handleCancel = this.handleCancel.bind(this)
      this.handlePreview = this.handlePreview.bind(this)
      this.handleChange = this.handleChange.bind(this);
      this.add = this.add.bind(this);
      this.addOptions = this.addOptions.bind(this);
      this.remove = this.remove.bind(this);
      this.removeOptions = this.removeOptions.bind(this);
      this.handleOptions = this.handleOptions.bind(this);
      this.handleRules = this.handleRules.bind(this);
      this.onValuesChange = this.onValuesChange.bind(this);


   }
   handleOptions(options, dyKeys) {
      this.setState({
         objectController: Object.assign({}, this.state.objectController, { [dyKeys]: options })
      }, () => {
         console.log(this.state.objectController);
      });
   }

   handleRules(rules) {
      this.setState({
         isRules: rules
      });
   }

   handleCancel() {
      this.setState({ previewVisible: false })
   }
   handlePreview(file) {
      this.setState({
         previewImage: file.url || file.thumbUrl,
         previewVisible: true,
      });
   }
   handleChange({ fileList }) {
      this.setState({ fileList })
   }

   handleCancel_ls() {
      this.setState({ previewVisible_ls: false })
   }
   handlePreview_ls(file) {
      this.setState({
         previewImage_ls: file.url || file.thumbUrl,
         previewVisible_ls: true,
      });
   }

   setReload(reload_permission_sets, reload_roles) {
      this.setState({
         reload_permission_sets, reload_roles
      });
   }
   componentDidMount() {
      util.filterDangerousChars();

      if (this.id) {
         this.loadApp(this.id);
      }
      console.log(this.props.form);
      console.log(this.props);
   }
   setLoading(isLoading) {
      this.setState({
         isLoading: isLoading
      });
   }
   switchDelModal(show) {
      this.setState({
         showDelModal: show
      });
   }
   toggleActive(status) {
      const newStatus = status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      appAPI.changeStatus(this.props.appDetail && this.props.appDetail.client_id, newStatus).then(
         () => {
            this.props.mergeAppDetail({ status: newStatus });
            util.showSuccessMessage();
         },
         (error) => {
            util.showErrorMessage(error);
         }
      );
   }
   handleDel() {
      this.switchDelModal(false);
      this.setLoading(true);
      appAPI.delete(this.props.appDetail && this.props.appDetail.client_id).then(
         () => {
            this.setLoading(false);
            util.showSuccessMessage();
            this.onCancel();
         },
         (error) => {
            this.setLoading(false);
            util.showErrorMessage(error);
         }
      );
   }
   onCancel() {
      this.props.history.push("/home/appList");
   }
   downloadCert() {
      window.open(`${conf.getServiceUrl()}/apps/${this.props.appDetail.client_id}/download_cert?tcode=${localStorage.getItem("tcode")}`);
   }
   /**
    * query application info
    */
   loadApp(clientId) {
      const appList = appAPI.getList(),
         appInfo = appAPI.getApp(clientId),
         extraAuthFactorAttrList = appAPI.getExtraAuthFactorAttrList(),
         profileList = profileAPI.getProfileList(),
         loader = axios.all([appInfo, appList, extraAuthFactorAttrList, profileList]);

      loader.then(axios.spread((appInfo, appList, extraAuthFactorAttrList, profileList) => {
         this.props.setAppDetail(appInfo.data);
         this.props.setAppList(appList.data);
         this.props.setExtraAuthFactorAttrList(extraAuthFactorAttrList.data);
         // this.props.setProfileList(profileList.data); // 自画像暂时不用
         this.props.form.setFieldsValue({
            "clientId": appInfo.data.client_id,
            'appName': appInfo.data.client_name,
            'appClass': appInfo.data.inner_category,
            'agreement': appInfo.data.support_protocol,
            'appLink': appInfo.data.client_uri,
            'appIntroduce': appInfo.data.description
         });
         if (appInfo.data.preview_uri) {
            this.setState({
               "fileList": [{
                  uid: -10,
                  name: 'preview.png',
                  status: 'done',
                  url: appInfo.data.preview_uri,
               }]
            })
         }
         if (appInfo.data.logo_uri) {
            this.setState({
               "fileList_ls": [{
                  uid: -11,
                  name: 'logo.png',
                  status: 'done',
                  url: appInfo.data.logo_uri,
               }]
            })
         }


      })).catch(function (error) {
         util.showErrorMessage(error);
      });
   }
   //search Application Info by clientId from loaded appList
   searchFromAppList(clientId) {
      return this.props.appList.filter(app => app.client_id === clientId)[0];
   }
   //search profile info by profieId from profileList
   searchFormProfileList(profileId) {
      return this.props.profileList.filter(profile => profile.id === profileId)[0];
   }
   //search Attribute by domain name from loaded extraAuthFactorAttrList
   searchFromExtraAuthFactorAttrList(domainName) {
      return this.props.extraAuthFactorAttrList.filter(attr => attr.domain_name === domainName)[0];
   }

   handlePublicAccess(evt) {
      const value = evt.target.checked;
      appAPI.enablePublicAccess(this.id, value).then(() => {
         this.props.mergeAppDetail({ public_access: value });
         util.showSuccessMessage();
      });
   }
   //on new user selected
   onNewUserSelected(value) {
      this.setState({
         new_user_selected: value,
      });
   }

   //on new tag selected
   onNewTagSelected(value) {
      this.setState({
         new_tag_selected: value,
      });
   }

   //entitle user(s) to use the app
   entitleUser() {
      const selections = this.incsearchUser.getSelections(),
         usernames = selections ? selections.map(e => e.key) : [],
         params = {
            id: this.id,
            usernames: usernames,
         };

      appAPI.entitleUsers(params).then(() => {
         util.showSuccessMessage(util.t("app.entitlement.user.action.addSuccessPrompt"));

         //clear user selections
         this.incsearchUser.clearSelections();
         this.setState({
            new_user_selected: false,
         });
         this.entitledUserList.refreshTable();
      });
   }

   //entitle user(s) to use the app
   entitleTag() {
      const selections = this.tagListInput.getSelections(),
         tags = selections ? selections : [],
         params = {
            id: this.id,
            tags: tags,
         };

      appAPI.entitleTags(params).then(() => {
         util.showSuccessMessage(util.t("app.entitlement.tag.action.addSuccessPrompt"));

         //clear user selections
         this.tagListInput.clearSelections();
         this.setState({
            new_tag_selected: false,
         });
         this.entitledTagList.refreshTable();
      });
   }

   editPerm() {
      this.setState({
         editingPerm: true,
         reload_permission_sets: false,
         reload_roles: false,
      });
   }

   cancelEditPerm() {
      this.setState({
         editingPerm: false,
         reload_permission_sets: false,
         reload_roles: false,
      });
   }

   refreshPermList() {
      this.permList && this.permList.refreshTable();
   }

   editPermSet() {
      this.setState({
         editingPermSet: true,
         reload_permission_sets: false,
         reload_roles: false,
      });
   }

   cancelEditPermSet() {
      this.setState({
         editingPermSet: false,
         reload_permission_sets: false,
         reload_roles: false,
      });
   }

   refreshPermSetList() {
      this.permSetList && this.permSetList.refreshTable();
   }

   editRole() {
      this.setState({
         editingRole: true,
         reload_permission_sets: false,
         reload_roles: false,
      });
   }

   cancelEditRole() {
      this.setState({
         editingRole: false,
         reload_permission_sets: false,
         reload_roles: false,
      });
   }
   refreshRoleList() {
      this.roleList && this.roleList.refreshTable();
   }

   componentWillReceiveProps(nextProps) {
      if (this.id !== nextProps.match.params.id) {
         this.id = nextProps.match.params.id;
         if (this.id) {
            this.loadApp(this.id);
         }
      }
   }

   handleSubmit(e) {
      e.preventDefault();
      // if (!this.state.fileList_ls.length) {
      //   message.error('上传logo不能为空')
      //   return;
      // }
      this.props.form.validateFieldsAndScroll((err, values) => {
         const appfileList = [];
         for (const items in values) {
            if (items.indexOf('global') !== -1) {
               appfileList.push({
                  label: values[items]['uc-label-'],
                  name: values[items]['uc-name-'],
                  rules: [{
                     required: values[items]['uc-radio-'] == '0' ? true : false,
                     message: values[items]['uc-message-'],
                  }],
                  placeholder: values[items]['uc-placeholder-'],
                  controlType: values[items]['uc-controlType-'],
                  options: this.state.objectController[items] || []
               });
            }
         }
         values.appfileList = appfileList;
         if (!err) {
            const temp_object = Object.assign({}, values, {
               logo_url: this.state.logo_base64 || '',
               preview_url: this.state.preview_base64 || ''
            });
            delete temp_object.appPreview;
            appAPI.uploadAppList({
               auth_protocol: 'APPSTORE',
               client_id: temp_object.clientId,
               client_name: temp_object.appName,
               description: temp_object.appIntroduce,
               support_protocol: temp_object.agreement,
               inner_category: temp_object.appClass,
               client_uri: temp_object.appLink,
               preview_uri: temp_object.preview_url,
               logo_uri: temp_object.logo_url,
               template_config: {
                  template_config: temp_object.appfileList
               }
            }).then(
               (rs) => {
                  if (rs) {
                     message.success('创建成功');
                     this.handleReset();
                  }
               },
               (error) => {
                  console.log('values.appfileList')
               }
            );
         }
      });
   }

   handleReset() {
      this.props.form.resetFields();
      this.setState({
         fileList: [],
         fileList_ls: []
      })
   }

   handleChange({ fileList, file }) {
      if (fileList.length) {
         const { thumbUrl } = fileList[0];
         this.setState({ fileList, preview_base64: thumbUrl });
      } else {
         this.setState({ fileList })
      }
   }
   handleChange_ls({ fileList }) {
      if (fileList.length) {
         const { thumbUrl } = fileList[0];
         this.setState({ fileList_ls: fileList, logo_base64: thumbUrl });
      } else {
         this.setState({ fileList_ls: fileList })
      }
   }

   beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
         message.error('上传的图片必须小于1MB!');
         return Promise.reject(false);
      }
      return isLt2M;
   }


   remove(k, key) {
      const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue('keys');
      // We need at least one passenger
      // if (keys.length === 1) {
      //    return;
      // }
      // can use data-binding to set
      const tempObj = Object.assign({}, this.state.objectController);
      delete tempObj[key];
      this.setState({
         objectController: tempObj
      })
      form.setFieldsValue({
         keys: keys.filter(key => key !== k),
      });
   }
   removeOptions(k) {
      const { form } = this.props;
      // can use data-binding to get
      const keysOptions = form.getFieldValue('keysOptions');
      // We need at least one passenger
      // if (keysOptions.length === 1) {
      //    return;
      // }
      // can use data-binding to set
      form.setFieldsValue({
         keysOptions: keysOptions.filter(key => key !== k),
      });
   }
   add() {
      uuid++;
      const { form } = this.props;
      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(uuid);
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
         keys: nextKeys,
      });
   }

   addOptions() {
      uuid++;
      const { form } = this.props;
      // can use data-binding to get
      const keysOptions = form.getFieldValue('keysOptions');
      const nextKeys = keysOptions.concat(uuid);
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
         keysOptions: nextKeys,
      });
   }
   selectChange(key) {
      // 判断是否显示提示语输入框  ||   判断是否显示配置项输入框
      if (key == 'select') {
         this.setState({
            isShowTipsInput: true,
            isShowOptions: true
         });
      } else if (key == 'input') {
         this.setState({
            isShowTipsInput: true,
            isShowOptions: false
         });
      } else {
         // 单独判断时间框没有配置项
         if (key == 'datePick') {
            this.setState({
               isShowTipsInput: false,
               isShowOptions: false
            })
         } else {
            this.setState({
               isShowTipsInput: false,
               isShowOptions: true
            });
         }
      }
   }

   onValuesChange(props, values) {
      console.log(values);
   }

   render() {
      const { getFieldDecorator, getFieldValue } = this.props.form;
      const { previewVisible, previewImage, fileList, previewVisible_ls, previewImage_ls, fileList_ls } = this.state;
      const { new_user_selected, new_tag_selected } = this.state;
      const uploadButton = (
         <div>
            <Icon type="plus" />
            <div className="ant-upload-text">点击上传图片</div>
         </div>
      );
      const uploadButtons = (
         <div>
            <Icon type="plus" style={{ fontSize: '30px' }} />
            <div className="ant-upload-text" style={{ marginTop: '10px' }}>点击上传LoGo</div>
         </div>
      );

      getFieldDecorator('keys', { initialValue: [] });
      const keys = getFieldValue('keys');

      getFieldDecorator('keysOptions', { initialValue: [] });
      const keysOptions = getFieldValue('keysOptions');


      const formItemLayout = {
         labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
         },
         wrapperCol: {
            xs: { span: 24 },
            sm: { span: 18 },
         },
      };

      const formItemLayoutWithOutLabel = {
         wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 18, offset: 6 },
         },
      };
      const formItems = keys.map((k) => {
         return (
            <FormItem
               label={'表单配置项'}
               key={k}
               style={{ width: '100%' }}
            >
               {getFieldDecorator(`global${k}.uc-controlType-`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: 'input',
                  rules: [{
                     whitespace: true,
                     message: "请输入你的控件信息",
                  }],
               })(
                  <Select
                     placeholder="请选择你的控件"
                     style={{ width: '23%', marginRight: 8 }}
                  >
                     <Option value="input">输入框</Option>
                     <Option value="select">选择框</Option>
                     <Option value="datePick">时间框</Option>
                     <Option value="checkBox">复选框</Option>
                     <Option value="radioBox">单选框</Option>
                  </Select>
               )}

               {getFieldDecorator(`global${k}.uc-label-`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: '',
                  rules: [{
                     whitespace: true,
                     message: "请输入你的控件信息",
                  }],
               })(
                  <Input placeholder="请输入label" style={{ width: '23%', marginRight: 8 }} />
               )}

               {getFieldDecorator(`global${k}.uc-name-`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: '',
                  rules: [{
                     whitespace: true,
                     message: "请输入你的控件信息",
                  }],
               })(
                  <Input placeholder="请填写输入值的key" style={{ width: '23%', marginRight: 8 }} />
               )}

               {havePlaceholderInfo.includes(getFieldValue(`global${k}`)['uc-controlType-']) ?
                  getFieldDecorator(`global${k}.uc-placeholder-`, {
                     validateTrigger: ['onChange', 'onBlur'],
                     initialValue: '',
                     rules: [{
                        whitespace: true,
                        message: "请输入你的控件信息",
                     }],
                  })(
                     <Input placeholder="请填写输入框提示语" style={{ width: '23%', marginRight: 8 }} />
                  ) : ''}

               {getFieldDecorator([`global${k}.uc-message-`], {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: '',
                  rules: [{
                     whitespace: true,
                  }],
               })(
                  <Input placeholder="请输入非必填信息" style={{ marginRight: 8, width: '23%', marginTop: 10 }} />
               )}

               {getFieldDecorator([`global${k}.uc-radio-`], {
                  validateTrigger: ['onChange', 'onBlur'],
                  initialValue: '0',
                  rules: [{
                     whitespace: true,
                  }],
               })(
                  <RadioGroup onChange={this.radioChange}>
                     <Radio value={'0'}>必填项</Radio>
                     <Radio value={'1'}>非必填项</Radio>
                  </RadioGroup>
               )}




               {!haveOptionsInfo.includes(getFieldValue(`global${k}`)['uc-controlType-']) ? (
                  <Button type="primary"
                     onClick={() => {
                        this.optionss.showModal(`global${k}`);
                     }} style={{ width: '23%', marginRight: 8, marginTop: 10 }}
                  >
                     增加option配置项
                  </Button>
               ) : ''}

               {keys.length > 0 ? (
                  <Button
                     type="primary"
                     onClick={() => this.remove(k, `global${k}`)}
                     style={{ marginTop: 10 }}
                  >删除控件</Button>
               ) : null}
            </FormItem>
         );
      });
      return (
         <Spin spinning={this.state.isLoading}>
            <Tabs defaultActiveKey="apptab" style={{ paddingLeft: "20px" }}>
               <TabPane tab={util.t("app.appTabHeader")} key="apptab">
                  <div>
                     <Collapse defaultActiveKey={["appbasic"]} bordered={false}>
                        <Panel header={util.t("app.info.panels.basic")} key="appbasic">
                           <Row>
                              <Col span={12}>
                                 <Form onValuesChange={this.onValuesChange}>
                                    <FormItem
                                       label="Client ID"
                                       labelCol={{ span: 6 }}
                                       wrapperCol={{ span: 16 }}
                                       style={{ marginTop: '60px' }}
                                    >
                                       {getFieldDecorator('clientId', {
                                          rules: [{ required: true, message: '请输入你的ClientID' }],
                                       })(
                                          <Input />
                                       )}
                                    </FormItem>

                                    <FormItem
                                       label="应用名称"
                                       labelCol={{ span: 6 }}
                                       wrapperCol={{ span: 16 }}
                                       style={{ marginTop: '60px' }}
                                    >
                                       {getFieldDecorator('appName', {
                                          rules: [{ required: true, message: '请输入你的应用名称' }],
                                       })(
                                          <Input />
                                       )}
                                    </FormItem>

                                    <FormItem
                                       label="应用分类"
                                       labelCol={{ span: 6 }}
                                       wrapperCol={{ span: 16 }}
                                       style={{ marginTop: '60px' }}
                                    >
                                       {getFieldDecorator('appClass', {
                                          rules: [{ required: true, message: '请输入你的应用分类' }],
                                       })(
                                          <Select
                                             placeholder="请选择你的分类"
                                             mode="multiple"
                                          // onChange={this.handleSelectChange}
                                          >
                                             <Option value="office">协同办公</Option>
                                             <Option value="finance">营销管理</Option>
                                             <Option value="produce">项目管理</Option>
                                             <Option value="tools">开发工具</Option>
                                             <Option value="manpower">人力资源</Option>
                                             <Option value="outher">其他</Option>
                                          </Select>
                                       )}
                                    </FormItem>

                                    <FormItem
                                       label="集成协议"
                                       labelCol={{ span: 6 }}
                                       wrapperCol={{ span: 16 }}
                                       style={{ marginTop: '60px' }}
                                    >
                                       {getFieldDecorator('agreement', {
                                          rules: [{ required: true, message: '请输入集成协议' }],
                                       })(
                                          <Checkbox.Group onChange={this.onChange} >
                                             <Checkbox value={'OIDC'} style={{ marginRight: '30px', marginLeft: '7px' }}>OIDC</Checkbox>
                                             <Checkbox value={'CAS'} style={{ marginRight: '30px' }}>CAS</Checkbox>
                                             <Checkbox value={'OAUTH'} style={{ marginRight: '30px' }}>Oauth2.0</Checkbox>
                                             <Checkbox value={'SAML'} style={{ marginRight: '30px' }}>SAML</Checkbox>
                                             <Checkbox value={'APPSTORE'} style={{ marginRight: '30px' }}>非标协议</Checkbox>
                                          </Checkbox.Group>
                                       )}
                                    </FormItem>


                                    <FormItem
                                       label="应用链接"
                                       labelCol={{ span: 6 }}
                                       wrapperCol={{ span: 16 }}
                                       style={{ marginTop: '60px' }}
                                    >
                                       {getFieldDecorator('appLink', {
                                          rules: [{ required: true, message: '请输入应用链接' }],
                                       })(
                                          <Input />
                                       )}
                                    </FormItem>

                                    <FormItem
                                       label="应用简介"
                                       labelCol={{ span: 6 }}
                                       wrapperCol={{ span: 16 }}
                                       style={{ marginTop: '60px' }}
                                    >
                                       {getFieldDecorator('appIntroduce', {
                                          rules: [{ required: true, message: '请输入应用简介' }],
                                       })(
                                          <TextArea rows={4} />
                                       )}
                                    </FormItem>


                                    <FormItem
                                       label="应用预览图"
                                       labelCol={{ span: 6 }}
                                       wrapperCol={{ span: 16 }}
                                       style={{ marginTop: '60px' }}
                                    >
                                       {getFieldDecorator('appPreview', {
                                          rules: [{ message: '请输入应用预览图' }],
                                       })(
                                          <div>
                                             <Upload
                                                action="//jsonplaceholder.typicode.com/posts/"
                                                listType="picture-card"
                                                fileList={this.state.fileList}
                                                onPreview={this.handlePreview}
                                                onChange={this.handleChange}
                                                beforeUpload={this.beforeUpload}
                                             >
                                                {fileList.length > 0 ? null : uploadButton}
                                             </Upload>
                                             <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                             </Modal>
                                          </div>
                                       )}
                                    </FormItem>
                                 </Form>
                              </Col>
                              <Col span={12} style={{ marginTop: '40px' }}>
                                 <Upload
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    listType="picture-card"
                                    fileList={this.state.fileList_ls}
                                    onPreview={this.handlePreview_ls}
                                    onChange={this.handleChange_ls}
                                 >
                                    {fileList_ls.length > 0 ? null : uploadButton}
                                 </Upload>

                                 <Modal
                                    visible={previewVisible_ls}
                                    footer={null}
                                    onCancel={this.handleCancel_ls}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage_ls} />
                                 </Modal>
                                 <div>
                                    <Form onValuesChange={(params) => {
                                       console.log(params);
                                    }}>
                                       {formItems}
                                       <FormItem>
                                          <Button type="dashed" onClick={this.add} style={{ width: '100%' }}>
                                             <Icon type="plus" /> 增加一个控件
                                          </Button>
                                       </FormItem>
                                    </Form>
                                 </div>
                              </Col>
                           </Row>
                           <div style={{ display: 'flex', alignItems: "center", justifyContent: 'center' }}>
                              <div>
                                 <Button
                                    type="danger"
                                    size={'large'}
                                    onClick={this.handleReset.bind(this)}
                                    style={{ width: '100px', color: '#333', marginRight: 30 }}
                                 >
                                    重置
                                 </Button>
                                 <Button
                                    type="primary"
                                    onClick={this.handleSubmit.bind(this)}
                                    size="large"
                                    style={{ width: '100px' }}
                                 >
                                    保存
                                 </Button>
                              </div>
                           </div>

                           <Options
                              wrappedComponentRef={(ref) => this.optionss = ref}
                              handleOptions={this.handleOptions}
                           ></Options>
                           {/* <Button onClick={() => { this.optionss.showModal() }}>打开model</Button> */}
                        </Panel>
                     </Collapse>
                  </div>
               </TabPane>
            </Tabs>
         </Spin>    
      );
   }
}   








const userPermSets = createSelector(state => state.login.userPermSets, (userPermSets) => userPermSets);
const mapStateToProps = (state) => ({
   appDetail: state.app.appDetail,
   appList: state.app.appList,
   extraAuthFactorAttrList: state.app.extraAuthFactorAttrList,
   profileList: state.app.profileList,
   userPermSets: userPermSets(state),
});
const mapDispatchToProps = (dispatch) => ({
   setAppDetail: (data) => dispatch(appActionCreators.setAppDetail(data)),
   mergeAppDetail: (data) => dispatch(appActionCreators.mergeAppDetail(data)),
   setAppList: (data) => dispatch(appActionCreators.setAppList(data)),
   setExtraAuthFactorAttrList: (data) => dispatch(appActionCreators.setExtraAuthFactorAttrList(data)),
   setProfileList: (data) => dispatch(appActionCreators.setProfileList(data)),
});
export default Form.create({
   onValuesChange: (props, values, Toal) => {
      console.log(props);
      console.log(values);
      console.log(Toal);
   }
})(connect(mapStateToProps, mapDispatchToProps)(AppInfo));



{/* {!haveOptionsInfo.includes(getFieldValue(`global${index}`)['uc-controlType-']) ? (
   <Button type="dashed" onClick={this.addOptions} style={{
      width: '100%',
      marginRight: 8, marginTop: 10                                          
   }}>
      <Icon type="plus" /> 增加选择框的配置
   </Button>) : ''} */}





{/* {keysOptions.map((ks, indexs) => {
      return (
         <FormItem
            style={{ marginTop: 10 }}
            required={false}
            key={indexs}
         >
            {getFieldDecorator([`label-${indexs}`], {
               validateTrigger: ['onChange', 'onBlur'],
               rules: [{
                  required: true,
                  whitespace: true,
                  message: "Please input passenger's name or delete this field.",
               }],
            })(
               <Input placeholder="请输入你的label" style={{ width: '40%', marginRight: 8 }} />
            )}
            {getFieldDecorator([`value-${indexs}`], {
               validateTrigger: ['onChange', 'onBlur'],
               rules: [{
                  required: true,
                  whitespace: true,
                  message: "Please input passenger's name or delete this field.",
               }],
            })(
               <Input placeholder="请输入你的value" style={{ width: '40%', marginRight: 8 }} />
            )}
            {keysOptions.length > 0 ? (
               <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={() => this.removeOptions(ks)}
               />
            ) : null}
         </FormItem>
      );
   })} */}