/**
 * Created by tianyun on 2017/1/4.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import {Row, Col} from "antd";

class InfoItem extends Component {
    render() {
        return (
            <Row className="fs-14 mt-10">
                <Col span={this.props.titleSpan || "6"}
                    className="ant-form-item-label"
                    style={{textAlign: "right", fontWeight: this.props.isNormal ? "normal" : "bold"}}
                >
                    <label title={this.props.tip || this.props.titleStr}>{this.props.titleStr}</label>
                </Col>
                <Col span={this.props.contentSpan || "18"} style={{paddingLeft: "10px"}}>
                    <div className="ant-form-item-control" style={{wordWrap: "break-word"}}>{this.props.contentObj}</div>
                </Col>
            </Row>
        );
    }
}

export default InfoItem;
