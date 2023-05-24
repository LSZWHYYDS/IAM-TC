/**
 * Created by tianyun on 2016/12/23.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Tooltip } from "antd";

class MsgTip extends Component {
    render() {
        return (
            <span className="msg-tip">
                <Tooltip placement="top" title={this.props.msg || ""}>
                    <i className="icon iconfont icon-msg-tip"/>
                </Tooltip>
            </span>
        );
    }
}

export default MsgTip;
