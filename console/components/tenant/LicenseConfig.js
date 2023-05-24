import React, { Component } from "react";
import { Form, Row, Col, Input, Checkbox } from "antd";
import validator from "../../common/validator";
import Modules from "./Modules.js";
import { withRouter } from 'react-router-dom'
const FormItem = Form.Item;
class LicenseConfig extends Component {
   constructor(...args) {
      super(...args);
      this.state = {
         controlPingTaiFenfa: this.returnBoolear(),
      };
   }

   returnBoolear() {
      if (window.location.hash == '#/home/editTenant') return false;
      else return true;
   }

   modifyControlPingtaiFenfa() {
      this.setState((data) => {
         console.log(data);
         return {
            controlPingTaiFenfa: !data.controlPingTaiFenfa
         }
      })
   }

   setData(license_config) {
      this.setState({ license_config });
   }
   formatterDateValue(formData, fieldName) {
      const values = formData[fieldName].dates;
      formData[fieldName].dates = [
         values[0].format("YYYY-MM-DD"),
         values[1].format("YYYY-MM-DD"),
      ];
   }
   checkModule(rule, value, callback) {
      if (value && value.checked_value) {
         if (!value.dates[0] || !value.dates[1]) {
            callback("请选择开始结束日期");
         }
         callback();
         return;
      }
   }
   getData(callback) {
      // this.props.form.validateFields((err, values) => {
      //   if (err) {
      //     return;
      //   }
      //   callback(values);
      // });
      callback(this.props.form.getFieldsValue());
   }
   componentDidMount() {
      this.props.onRef(this);
      // this.setState({
      //    controlPingTaiFenfa: this.props.license_config.adm.checked_value
      // });
      // this.props.form.setFieldsValue({
      //    'use_platform_distribute': Boolean(this.props.license_config.use_platform_distribute)
      // });
   }
   componentWillReceiveProps(nextProps) {
      // Should be a controlled component.
      if ("value" in nextProps) {
         const value = nextProps.value;
         if (value) {
            this.setState(value);
         }
      }
      if (JSON.stringify(nextProps.license_config.adm) != JSON.stringify(this.props.license_config.adm)) {
         console.log(nextProps.license_config);
         this.setState({
            controlPingTaiFenfa: nextProps.license_config.adm.checked_value
         });
         this.props.form.setFieldsValue({
            'use_platform_distribute': Boolean(nextProps.license_config.adm.use_platform_distribute)
         });
      }

   }
   render() {
      const formItemLayout1 = {
         labelCol: { span: 3 },
         wrapperCol: { span: 14 },
      };
      const formItemLayout = {
         labelCol: { span: 12 },
         wrapperCol: { span: 17 },
      };
      const formItemLayoutDlp = {
         labelCol: { span: 12 },
         wrapperCol: { span: 23 },
      };
      const { license_config } = this.props;
      const {
         adm = {},
         user_join = {},
         app_sso = {},
         dlp = {},
         file_audit = {},
         gateway = {},
         risk_monitor = {},
         show_no_perm_menu,
         controlPingTaiFenfa,
         use_platform_distribute
      } = license_config || {};
      const { sdk_num } = dlp || {};
      const formItemLayoutSdk = {
         labelCol: { span: 12 },
         wrapperCol: { span: 10 },
      };
      const { getFieldDecorator } = this.props.form;
      return (
         <Form>
            <Row>
               <Col span={12}>
                  <FormItem label={"授权模块"} {...formItemLayout1}></FormItem>
               </Col>
            </Row>
            <Row>
               <Col offset={1} span={12}>
                  <FormItem {...formItemLayout}>
                     {getFieldDecorator("show_no_perm_menu", {
                        initialValue: show_no_perm_menu,
                        valuePropName: 'checked'
                     })(<Checkbox>无权限菜单是否显示</Checkbox>)}
                  </FormItem>
               </Col>
            </Row>
            <Row>
               <Col offset={1} span={12}>
                  <FormItem {...formItemLayout}>
                     {getFieldDecorator("user_join", {
                        initialValue: user_join,
                        rules: [{ validator: this.checkModule }],
                     })(<Modules label="用户连接" />)}
                  </FormItem>
               </Col>
               <Col span={10}>
                  <FormItem {...formItemLayout}>
                     {getFieldDecorator("app_sso", {
                        initialValue: app_sso,
                        rules: [{ validator: this.checkModule }],
                     })(<Modules label="应用 SSO" />)}
                  </FormItem>
               </Col>
            </Row>
            <Row>
               <Col offset={1} span={12}>
                  <FormItem {...formItemLayout}>
                     {getFieldDecorator("risk_monitor", {
                        initialValue: risk_monitor,
                        rules: [{ validator: this.checkModule }],
                     })(<Modules label="安全基线监测/准入" />)}
                  </FormItem>
               </Col>
               <Col span={10}>
                  <FormItem {...formItemLayout}>
                     {getFieldDecorator("file_audit", {
                        initialValue: file_audit,
                        rules: [{ validator: this.checkModule }],
                     })(<Modules label="文件审计" />)}
                  </FormItem>
               </Col>
            </Row>
            <Row>
               <Col offset={1} span={12}>
                  <FormItem {...formItemLayout}>
                     {getFieldDecorator("adm", {
                        initialValue: adm,
                        rules: [{ validator: this.checkModule }],
                     })(<Modules label="应用分发" modifyControlPingtaiFenfa={this.modifyControlPingtaiFenfa.bind(this)} />)}
                  </FormItem>
                  {this.state.controlPingTaiFenfa ? (
                     <FormItem {...formItemLayout}>
                        {getFieldDecorator("use_platform_distribute", {
                           initialValue: use_platform_distribute == undefined ? false : use_platform_distribute,
                           valuePropName: 'checked'
                        })(<Checkbox>启用平台分发</Checkbox>)}
                     </FormItem>
                  ) : ''}

               </Col>
               <Col span={7}>
                  <FormItem {...formItemLayoutDlp}>
                     {getFieldDecorator("dlp", {
                        initialValue: dlp,
                        rules: [{ validator: this.checkModule }],
                     })(<Modules label="数据防泄漏" />)}
                  </FormItem>
               </Col>
               <Col span={4}>
                  <FormItem label={"SDK授权数"} {...formItemLayoutSdk}>
                     {getFieldDecorator("sdk_num", {
                        initialValue: sdk_num || 100,
                        validate: [validator.required, validator.numberRange(1, 1000000)],
                     })(<Input type="number" />)}
                  </FormItem>
               </Col>
            </Row>
            <Row>
               <Col offset={1} span={12}>
                  <FormItem {...formItemLayout}>
                     {getFieldDecorator("gateway", {
                        initialValue: gateway,
                     })(<Modules label="安全接入网关" />)}
                  </FormItem>
               </Col>
            </Row>
         </Form>
      );
   }
}

export default Form.create()(withRouter(LicenseConfig));
