/**
 * Created by tianyun on 2016/12/21.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Button, Input, Form } from "antd";
import validator from "./validator";
const InputGroup = Input.Group;
const FormItem = Form.Item;

class SearchBox extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            placeholder: this.props.placeholder,
            error: "",
        };
    }

    handleSearch() {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onSearch(values.searchKey && values.searchKey.trim());
            }
        });
    }

    componentWillReceiveProps (nextProps) {
        if(nextProps.clearValue){
            this.props.form.resetFields();
        }
    }

    emitEmpty () {
        this.inputBox.focus();
        this.props.form.setFieldsValue({searchKey: ""});
    }

    render() {
        const { getFieldDecorator } = this.props.form,
            { searchKey } = this.props.form.getFieldsValue();
        return (
            <InputGroup className="searchBox">
                <Form>
                    <FormItem>
                        {getFieldDecorator("searchKey", {
                            initialValue: this.props.defaultSearchKey,
                            validate: [validator.isSearch(this.props.minLength)],
                            //onChange:this.handleChange.bind(this)
                        })(
                            <Input type="text" placeholder={this.state.placeholder} maxLength={"50"}
                                prefix={this.props.prefix}
                                onPressEnter={this.handleSearch.bind(this)}
                                ref={node => this.inputBox = node}
                            />
                        )}
                    </FormItem>
                        <div className="ant-input-group-wrap">
                            { this.props.showClear && searchKey &&
                                <Button className="closeBtn" icon="close-circle" onClick={this.emitEmpty.bind(this)}></Button>
                            }
                            { this.props.showSearchButton &&
                                <Button className="searchBtn" icon="search" onClick={this.handleSearch.bind(this)}></Button>
                            }
                        </div>
                </Form>
            </InputGroup>
        );
    }
}

//default props
SearchBox.defaultProps = {
    showSearchButton: true, // show search button ?
    minLength: 2,
    showClear: true, //show close button ?
};

export default Form.create()(SearchBox);
