/**
 * Created by shaliantao on 2017/8/25.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Button, Input, Form, Row, Col, Tooltip } from "antd";
import { connect } from "react-redux";
import util from "../../common/util";
import ModalDialog from "../../common/modalDialog";
import validator from "../../common/validator";
import appActionCreators from "../../actions/appActionCreators";
import appAPI from "../../api/appAPI";

const FormItem = Form.Item;

class AddAppDialog extends Component {
   constructor(...args) {
      super(...args);
      this.state = {
         appType: "native"
      };
   }
   onSubmit(e) {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
         if (!err) {
            this.props.onClose();
            this.props.setLoading(true);
            let appType = this.state.appType.toUpperCase()
            appAPI.add({
               client_name: values.client_name,
               client_id: values.client_id,
               application_type: appType,
               enforce_https: false
            }).then(
               (response) => {
                  this.props.setAppDetail(response.data);
                  util.showSuccessMessage();
                  this.props.setLoading(false);
                  this.props.push("/home/editApp");
               },
               (error) => {
                  this.props.setLoading(false);
                  util.showErrorMessage(error);
               }
            );
         }
      });
   }
   onTypeChange(type) {
      if (type !== this.state.appType) {
         this.setState({
            appType: type
         });
      }
   }
   onClose() {
      this.props.onClose();
      if ("native" !== this.state.appType) {
         this.setState({
            appType: "native"
         });
      }
   }
   render() {
      const { getFieldDecorator } = this.props.form, formItemLayout = {
         labelCol: { span: 5 },
         wrapperCol: { span: 18 }
      };
      return (
         <ModalDialog show={this.props.show} title={util.t("app.add")} height="auto">
            <Form>
               <Row>
                  <Col span={24}>
                     <FormItem label={util.t("app.name")} {...formItemLayout}>
                        {getFieldDecorator("client_name", {
                           validate: [
                              validator.required,
                              validator.lengthRange(2, 20)
                           ],
                           initialValue: ""
                        })(
                           <Input type="text" />
                        )}
                     </FormItem>
                  </Col>
               </Row>
               <Row>
                  <Col span={24}>
                     <FormItem label="Client ID" {...formItemLayout}>
                        {getFieldDecorator("client_id", {
                           validate: [
                              validator.isClientID,
                              validator.lengthRange(3, 50)
                           ],
                           initialValue: ""
                        })(
                           <Input type="text" />
                        )}
                     </FormItem>
                  </Col>
               </Row>
               <Row className="mt-20" type="flex" justify="space-around">
                  <Col span={4}>
                     <div onClick={this.onTypeChange.bind(this, "native")}>
                        <Tooltip title={util.t("app.tip.native")}>
                           <img className={"app-type-box" + (this.state.appType === "native" ? " high-light" : "")}
                              src={require("../../img/native_type.png")} />
                        </Tooltip>
                     </div>
                     <div>Native App</div>
                  </Col>
                  <Col span={4}>
                     <div onClick={this.onTypeChange.bind(this, "trusted")}>
                        <Tooltip title={util.t("app.tip.trusted")}>
                           <img className={"app-type-box" + (this.state.appType === "trusted" ? " high-light" : "")}
                              src={require("../../img/trusted_type.png")}
                           />
                        </Tooltip>
                     </div>
                     <div>Trusted App</div>
                  </Col>
                  <Col span={4}>
                     <div onClick={this.onTypeChange.bind(this, "spa")}>
                        <Tooltip title={util.t("app.tip.spa")}>
                           <img className={"app-type-box" + (this.state.appType === "spa" ? " high-light" : "")}
                              src={require("../../img/spa_type.png")}
                           />
                        </Tooltip>
                     </div>
                     <div>SPA</div>
                  </Col>
                  <Col span={4}>
                     <div onClick={this.onTypeChange.bind(this, "web")}>
                        <Tooltip title={util.t("app.tip.web")}>
                           <img className={"app-type-box" + (this.state.appType === "web" ? " high-light" : "")}
                              src={require("../../img/web_type.png")}
                           />
                        </Tooltip>
                     </div>
                     <div>Web App</div>
                  </Col>
                  <Col span={4}>
                     <div onClick={this.onTypeChange.bind(this, "cli")}>
                        <Tooltip title={util.t("app.tip.cli")}>
                           <img className={"app-type-box" + (this.state.appType === "cli" ? " high-light" : "")}
                              src={require("../../img/cli_type.png")}
                           />
                        </Tooltip>
                     </div>
                     <div>CLI App</div>
                  </Col>
               </Row>
               <div className="mt-30" style={{ textAlign: "right" }}>
                  <Button type="primary"
                     htmlType="submit"
                     className="ml-10 fs-16"
                     onClick={this.onSubmit.bind(this)}
                  >
                     {util.t("common.add")}
                  </Button>
                  <Button type="ghost"
                     className="ml-10 fs-16"
                     onClick={this.onClose.bind(this)}
                  >
                     {util.t("common.close")}
                  </Button>
               </div>
            </Form>
         </ModalDialog>
      );
   }
}

const mapDispatchToProps = (dispatch) => ({
   setAppDetail: (data) => dispatch(appActionCreators.setAppDetail(data))
});

export default connect(null, mapDispatchToProps)(Form.create()(AddAppDialog));