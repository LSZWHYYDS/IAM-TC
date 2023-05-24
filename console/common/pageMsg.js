/**
 * Created by tianyun on 2016/12/21.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Alert } from "antd";

class PageMsg extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            show: this.props.show || false,
            noIcon: this.props.noIcon || false,
            type: this.props.type || 0,        //0:warning 1:error 2:success 3: hint
            msg: this.props.msg || "",
            nonClosable: this.props.nonClosable || false
        };
        this.typeMap = ["warning", "error", "success", "info"];
    }
    close() {
        this.setState({show: false});
    }
    render() {
        return (
            <div className={this.state.show ? "ml-20 mr-20" : "hidden"}>
                <Alert message={this.state.msg}
                    type={this.typeMap[this.state.type]}
                    showIcon={!this.state.noIcon}
                    closable={!this.state.nonClosable}
                    onClose={this.close.bind(this)}
                    style={this.props.style}
                />
            </div>
        );
    }
}

export default PageMsg;

