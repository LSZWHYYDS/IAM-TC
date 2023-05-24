import React from "react";
import { Form, Input, Icon, Button, Modal } from 'antd';
const FormItem = Form.Item;

let uuid = 0;
class DynamicFieldSet extends React.Component {
   constructor(...args) {
      super(...args);
      this.state = { visible: false, saveKeys: '' }
      this.showModal = this.showModal.bind(this);
      this.handleOk = this.handleOk.bind(this);
      this.handleCancel = this.handleCancel.bind(this);
      this.remove = this.remove.bind(this);
      this.add = this.add.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
   }

   showModal(params) {
      this.setState({
         visible: true,
         saveKeys: params
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
         if (!err) {
            const optionArray = [];
            const CopyValues = values;
            delete CopyValues['keys'];
            let indexFlgh = 1;
            for (const item in CopyValues) {
               if (item.indexOf(indexFlgh) !== -1) {
                  optionArray.push({
                     label: CopyValues['label-' + indexFlgh],
                     value: CopyValues['value-' + indexFlgh]
                  });
                  indexFlgh++;
               }
            }

            this.props.handleOptions(optionArray, this.state.saveKeys);
            this.props.form.resetFields();
         }
      });
   }

   componentDidMount() {
      // this.add();
   }

   render() {
      const { getFieldDecorator, getFieldValue } = this.props.form;
      // console.log(this.props.form)
      const formItemLayout = {
         labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
         },
         wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
         },
      };
      const formItemLayoutWithOutLabel = {
         wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 20, offset: 4 },
         },
      };
      getFieldDecorator('keys', { initialValue: [] });
      const keys = getFieldValue('keys');
      const formItems = keys.map((k, index) => {
         return (
            <FormItem
               {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
               label={index === 0 ? 'options配置项' : ''}
               required={false}
               key={k}
            >
               {getFieldDecorator([`label-${index + 1}`], {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{
                     required: true,
                     whitespace: true,
                     message: "Please input passenger's name or delete this field.",
                  }],
               })(
                  <Input placeholder="请输入你的label" style={{ width: '40%', marginRight: 8 }} />
               )}

               {getFieldDecorator([`value-${index + 1}`], {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [{
                     required: true,
                     whitespace: true,
                     message: "Please input passenger's name or delete this field.",
                  }],
               })(
                  <Input placeholder="请输入你的value" style={{ width: '40%', marginRight: 8 }} />
               )}

               {keys.length > 1 ? (
                  <Icon
                     className="dynamic-delete-button"
                     type="minus-circle-o"
                     disabled={keys.length === 1}
                     onClick={() => this.remove(k)}
                  />
               ) : null}
            </FormItem>
         );
      });
      return (
         <Modal
            title="配置弹窗"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
         >
            <Form>
               {formItems}
               <FormItem {...formItemLayoutWithOutLabel}>
                  <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                     <Icon type="plus" /> Add field
                  </Button>
               </FormItem>
            </Form>
         </Modal>

      );
   }
}

export default Form.create()(DynamicFieldSet);