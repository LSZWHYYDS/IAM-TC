import React from "react";
import { Form, Input, Icon, Button, Modal, Radio } from 'antd';
const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
let uuid = 0;
class DynamicFieldSet extends React.Component {
   constructor(...args) {
      super(...args);
      this.state = { visible: false }
      this.showModal = this.showModal.bind(this);
      this.handleOk = this.handleOk.bind(this);
      this.handleCancel = this.handleCancel.bind(this);
      this.remove = this.remove.bind(this);
      this.add = this.add.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
   }

   showModal() {
      this.setState({
         visible: true,
      });
   }
   handleOk(e) {
      this.setState({
         visible: false,
      }, () => {
         this.handleSubmit();
      });

   }
   handleCancel(e) {
      this.setState({
         visible: false,
      });
   }
   remove(k) {
      const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue('keys');
      // We need at least one passenger
      if (keys.length === 1) {
         return;
      }
      // can use data-binding to set
      form.setFieldsValue({
         keys: keys.filter(key => key !== k),
      });
   }

   add() {
      uuid++;
      const { form } = this.props;
      // can use data-binding to get
      const keys = form.getFieldValue('keys');
      const nextKeys = keys.concat(uuid);
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
         keys: nextKeys,
      });
   }

   handleSubmit() {
      this.props.form.validateFields((err, values) => {
         this.props.handleRules(values)
      });
   }

   componentDidMount() {
      this.add();
   }

   render() {
      const { getFieldDecorator } = this.props.form;
      return (
         <Modal
            title="规则配置"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
         >
            <Form layout="inline">
               <FormItem>
                  {getFieldDecorator([`require`], {
                     rules: [{
                        require: false
                     }],
                  })(
                     <RadioGroup defaultValue={true}>
                        <Radio value={true}>必选</Radio>
                        <Radio value={false}>非必选</Radio>
                     </RadioGroup>
                  )}
               </FormItem>
               <FormItem>
                  {getFieldDecorator([`message`], {
                     validateTrigger: ['onChange', 'onBlur'],
                     rules: [{
                        whitespace: true,
                        require: false
                     }],
                  })(
                     <Input placeholder="请输入非必填信息" style={{ marginRight: 8 }} />
                  )}
               </FormItem>
            </Form>
         </Modal>

      );
   }
}

export default Form.create()(DynamicFieldSet);