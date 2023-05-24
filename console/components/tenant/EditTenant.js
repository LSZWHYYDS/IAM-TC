import React, { Component } from "react";
import {
   Button,
   Breadcrumb,
   Spin,
   Form,
   Row,
   Col,
   Input,
   Collapse,
} from "antd";
import util from "../../common/util";
import tenantAPI from "../../api/tenantAPI";
import validator from "../../common/validator";
import LicenseConfig from "./LicenseConfig.js";

const FormItem = Form.Item,
   Panel = Collapse.Panel;
class EditTenant extends Component {
   constructor(...args) {
      super(...args);
      this.state = {
         isLoading: false,
         tenantDetail: {},
      };
      this.tenantId = this.props.match.params.id || "";
   }
   componentDidMount() {
      if (this.tenantId) {
         tenantAPI.getTenant(this.tenantId).then(
            (res) => {
               if (res.data.code === "0") {
                  this.setState({
                     tenantDetail: res.data.data,
                  });
                  // this.refLicenseConfig.setData(res.data.data.license_config);
               }
            },
            (error) => {
               util.showErrorMessage(error);
            }
         );
      }
   }
   onSave(license_config) {
      this.props.form.validateFieldsAndScroll((err, values) => {
         const isNew = !this.tenantId;
         if (!err) {
            let obj = Object.assign({}, values);
            obj.license_config = license_config;
            let admin = {};
            admin.username = obj.username;
            if (isNew) {
               admin.password = obj.password;
               if (admin.password === "******") {
                  delete admin.password;
               }
            }

            admin.mobile = obj.user_phone;
            admin.email = obj.user_email;
            obj.admin = admin;
            delete obj.username;
            delete obj.user_phone;
            delete obj.user_email;
            delete obj.password;
            this.setState({
               isLoading: true
            });
            console.log(obj);
            if (this.tenantId) {
               delete obj.tenant_id;
               tenantAPI.updateTenant(obj, this.tenantId).then(
                  () => {
                     this.setState({
                        isLoading: false
                     });
                     util.showSuccessMessage();
                     this.props.history.push("/home/tenantList");
                  },
                  (error) => {
                     this.setState({
                        isLoading: false
                     });
                     util.showErrorMessage(error);
                  }
               );
            } else {
               tenantAPI.createTenant(obj).then(
                  () => {
                     this.setState({
                        isLoading: false
                     });
                     util.showSuccessMessage();
                     this.props.history.push("/home/tenantList");
                  },
                  (error) => {
                     this.setState({
                        isLoading: false
                     });
                     util.showErrorMessage(error);
                  }
               );
            }
         }
      });
   }
   //检查是否合法
   checkLicense(data) {
      let num = 0;
      for (let key in data) {
         const itemData = data[key];
         if (
            itemData &&
            itemData.checked_value &&
            itemData.dates &&
            itemData.dates[0] &&
            itemData.dates[1]
         ) {
            num += 1;
         }
      }
      return num;
   }
   //不合法的个数
   checkInvalidLicense(data) {
      let num = 0;
      for (let key in data) {
         const itemData = data[key];
         if (
            itemData &&
            itemData.checked_value &&
            (!itemData.dates ||
               !itemData.dates[0] ||
               !itemData.dates[1])
         ) {
            num += 1;
         }
      }
      return num;
   }
   onSubmit(e) {
      e.preventDefault();
      this.props.form.validateFields((err) => {
         if (err) {
            return;
         }
         this.refLicenseConfig.getData((data) => {
            const { sdk_num, use_platform_distribute } = data;
            const dlp = data.dlp;
            const adm = data.adm;
            if (dlp) {
               dlp.sdk_num = sdk_num;
               delete data.sdk_num;
            }
            if (adm) {
               adm.use_platform_distribute = use_platform_distribute;
               delete data.use_platform_distribute;
            }
            if (!this.checkLicense(data)) {
               util.showErrorMessage("请至少选择一个模块并设置开始结束日期。");
               return;
            }
            if (this.checkInvalidLicense(data)) {
               util.showErrorMessage("请选择模块并设置开始结束日期。");
               return;
            }
            console.log('封装好的data');
            console.log(data);
            this.onSave(data);
         });
      });
   }
   render() {
      const { getFieldDecorator } = this.props.form;
      const {
         tenant_id,
         name,
         address,
         contacts,
         phone,
         password,
         email,
         admin,
         license_num,
         license_config = {},
      } = this.state.tenantDetail || {};
      const formItemLayout = {
         labelCol: { span: 6 },
         wrapperCol: { span: 14 },
      };
      const formItemLayoutUserCount = {
         labelCol: { span: 4 },
         wrapperCol: { span: 14 },
      };
      const passwordItem = (!this.tenantId) && (
         <Col span={12}>
            <FormItem
               label={util.t("tenant.password")}
               {...formItemLayout}
            >
               {getFieldDecorator("password", {
                  initialValue:
                     password || (this.tenantId && "******") || "",
                  validate: [
                     validator.required,
                     validator.isCustomizedPwd({
                        min_len: 8,
                        max_len: 20,
                        require_upper_char: 1,
                        require_lower_char: 1
                     })],
               })(<Input type="text" type="password" />)}
            </FormItem>
         </Col>);
      return (
         <Spin
            spinning={this.state.isLoading}
            style={{
               position: "fixed",
               left: "55%",
               top: "48%",
               height: 0,
               width: 0,
            }}
         >
            <div>
               <span className="pathNode">
                  <Breadcrumb separator=">>">
                     <Breadcrumb.Item href="#/home/tenantList">
                        {util.t("tenant.tenant")}
                     </Breadcrumb.Item>
                     <Breadcrumb.Item>{util.t("tenant.edit")}</Breadcrumb.Item>
                  </Breadcrumb>
               </span>
               <Form
                  className="formPadding"
                  layout="horizontal"
                  onSubmit={this.onSubmit.bind(this)}
               >
                  <Collapse
                     defaultActiveKey={["tenantbasic", "modules"]}
                     key="tenantbasic"
                     bordered={false}
                  >
                     <Panel
                        header={util.t("tenant.info.panels.basic")}
                        key="tenantbasic"
                     >
                        <Row>
                           <Col span={12}>
                              <FormItem label={util.t("tenant.id")} {...formItemLayout}>
                                 {getFieldDecorator("tenant_id", {
                                    initialValue: tenant_id || "",
                                    validate: [validator.required],
                                 })(<Input disabled={!!this.tenantId} type="text" />)}
                              </FormItem>
                           </Col>
                           <Col span={12}>
                              <FormItem label={util.t("tenant.name")} {...formItemLayout}>
                                 {getFieldDecorator("name", {
                                    initialValue: name || "",
                                    validate: [validator.required],
                                 })(<Input type="text" />)}
                              </FormItem>
                           </Col>
                        </Row>
                        <Row>
                           <Col span={12}>
                              <FormItem
                                 label={util.t("tenant.address")}
                                 {...formItemLayout}
                              >
                                 {getFieldDecorator("address", {
                                    initialValue: address || "",
                                 })(<Input type="text" />)}
                              </FormItem>
                           </Col>
                           <Col span={12}>
                              <FormItem
                                 label={util.t("tenant.contacts")}
                                 {...formItemLayout}
                              >
                                 {getFieldDecorator("contacts", {
                                    initialValue: contacts || "",
                                 })(<Input type="text" />)}
                              </FormItem>
                           </Col>
                        </Row>
                        <Row>
                           <Col span={12}>
                              <FormItem
                                 label={util.t("tenant.phone")}
                                 {...formItemLayout}
                              >
                                 {getFieldDecorator("phone", {
                                    initialValue: phone || "",
                                 })(<Input type="text" />)}
                              </FormItem>
                           </Col>
                           <Col span={12}>
                              <FormItem
                                 label={util.t("tenant.email")}
                                 {...formItemLayout}
                              >
                                 {getFieldDecorator("email", {
                                    initialValue: email || "",
                                    validate: [validator.isEmail],
                                 })(<Input type="text" />)}
                              </FormItem>
                           </Col>
                        </Row>
                        <Row>
                           <Col span={12}>
                              <FormItem
                                 label={util.t("tenant.username")}
                                 {...formItemLayout}
                              >
                                 {getFieldDecorator("username", {
                                    initialValue: admin ? admin.username : "admin",
                                    validate: [validator.required],
                                 })(<Input disabled={true} type="text" />)}
                              </FormItem>
                           </Col>
                           <Col span={12}>
                              <FormItem
                                 label={util.t("tenant.userPhone")}
                                 {...formItemLayout}
                              >
                                 {getFieldDecorator("user_phone", {
                                    initialValue: admin ? admin.mobile : "",
                                    validate: [validator.required, validator.isPhoneNum],
                                 })(<Input type="text" />)}
                              </FormItem>
                           </Col>
                        </Row>
                        <Row>
                           <Col span={12}>
                              <FormItem
                                 label={util.t("tenant.userEmail")}
                                 {...formItemLayout}
                              >
                                 {getFieldDecorator("user_email", {
                                    initialValue: admin ? admin.email : "",
                                    validate: [validator.required, validator.isEmail],
                                 })(<Input type="text" />)}
                              </FormItem>
                           </Col>
                           {passwordItem}
                        </Row>
                     </Panel>
                     <Panel header={"授权信息"} key="modules">
                        <Row>
                           <Col span={12}>
                              <FormItem label={"授权用户数"} {...formItemLayoutUserCount}>
                                 {getFieldDecorator("license_num", {
                                    initialValue: license_num || 100,
                                    validate: [
                                       validator.required,
                                       validator.numberRange(1, 1000000),
                                    ],
                                 })(<Input type="number" />)}
                              </FormItem>
                           </Col>
                        </Row>
                        <LicenseConfig
                           license_config={license_config || {}}
                           // form={this.props.form}
                           onRef={(ref) => {
                              this.refLicenseConfig = ref;
                           }}
                        />
                     </Panel>
                  </Collapse>
                  <div className="footerContainer">
                     <Button type="primary" className="ml-10" htmlType="submit">
                        {util.t("common.save")}
                     </Button>
                  </div>
               </Form>
            </div>
         </Spin>
      );
   }
}

export default Form.create()(EditTenant);
