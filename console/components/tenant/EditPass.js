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

const FormItem = Form.Item,
  Panel = Collapse.Panel;

class EditTenant extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      isLoading: false,
      tenantDetail: {},
    };
    this.tenantId = this.props.tenantId || "";
  }
  componentDidMount() {
    if (this.tenantId) {
      tenantAPI.getTenant(this.tenantId).then(
        (res) => {
          if (res.data.code === "0") {
            this.setState({
              tenantDetail: res.data.data,
            });
          }
        },
        (error) => {
          util.showErrorMessage(error);
        }
      );
    }
  }
  onSave() {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let obj = Object.assign({}, values);
        let admin = {};
        admin.password = obj.password;
        this.setState({
          isLoading: true,
        });
        if (this.tenantId) {
          delete obj.username;
          tenantAPI.updateTenantPass(obj).then(
            () => {
              this.setState({
                isLoading: false,
              });
              util.showSuccessMessage();
              this.props.onClose();
            },
            (error) => {
              this.setState({
                isLoading: false,
              });
              util.showErrorMessage(error);
            }
          );
        }
      }
    });
  }
  onSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (err) {
        return;
      }
      this.onSave();
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { tenant_id, admin } = this.state.tenantDetail || {};
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
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
          <Form
            className="formPadding"
            layout="horizontal"
            onSubmit={this.onSubmit.bind(this)}
          >
            <Row>
              <Col span={24}>
                <FormItem label={util.t("tenant.id")} {...formItemLayout}>
                  {getFieldDecorator("tcode", {
                    initialValue: tenant_id || "",
                    validate: [validator.required],
                  })(<Input disabled={!!this.tenantId} type="text" />)}
                </FormItem>
              </Col>
              <Col span={24}>
                <FormItem label={util.t("tenant.username")} {...formItemLayout}>
                  {getFieldDecorator("username", {
                    initialValue: admin ? admin.username : "admin",
                    validate: [validator.required],
                  })(<Input disabled={true} type="text" />)}
                </FormItem>
              </Col>

              <Col span={24}>
                <FormItem label={util.t("tenant.password")} {...formItemLayout}>
                  {getFieldDecorator("password", {
                    validate: [
                      validator.required,
                      validator.isCustomizedPwd({
                        min_len: 8,
                        max_len: 20,
                        require_upper_char: 1,
                        require_lower_char: 1,
                      }),
                    ],
                  })(<Input type="password" />)}
                </FormItem>
              </Col>
            </Row>

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
