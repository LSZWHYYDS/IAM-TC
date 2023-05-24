/**
 * Created by shaliantao on 2017/8/28.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Row, Col, Button, Checkbox, Modal } from "antd";
import util from "../../common/util";
import InfoItem from "../../common/infoItem";
import appAPI from "../../api/appAPI";

const SECRET = "********************";
class ClientSecret extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            showClientSecret: false,
            showConfirmModal: false
        };
    }
    onCopy() {
        var textArea = document.createElement("textarea");
        textArea.value = this.props.clientSecret;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand("copy");
            util.showSuccessMessage(util.t("common.copySuccess"));
        } catch (err) {
            throw new Error("Oops, unable to copy");
        }
        document.body.removeChild(textArea);
    }
    onRegenerate() {
        appAPI.generateSecret(this.props.clientID).then(
            (response) => {
                this.props.mergeAppDetail(response.data && response.data.data);
                util.showSuccessMessage();
                this.switchModal(false);
            },
            (error) => {
                util.showErrorMessage(error);
            }
        );
    }
    switchModal(show) {
        this.setState({
            showConfirmModal: show
        });
    }
    onChange() {
        this.setState({
            showClientSecret: !this.state.showClientSecret
        });
    }
    render() {
        const contentObj = <div>
            <Row>
                <Col span={24}>{this.state.showClientSecret ? this.props.clientSecret : SECRET}</Col>
            </Row>
            <Row>
                <Col span={8}>
                    <Checkbox onChange={this.onChange.bind(this)}>{util.t("app.showClientSecret")}</Checkbox>
                </Col>
                <Col span={3}>
                    <Button type="primary" onClick={this.onCopy.bind(this)}>
                        {util.t("common.copy")}
                    </Button>
                </Col>
                {
                    this.props.isEdit &&
                    <Col span={3}>
                        <Button type="danger" onClick={this.switchModal.bind(this, true)}>
                            {util.t("common.regenerate")}
                        </Button>
                    </Col>
                }
            </Row>
        </div>;
        return <div>
                <InfoItem titleStr="Client Secret" contentObj={contentObj} contentSpan={14} isNormal={this.props.isEdit} />
                <Modal title={util.t("app.regenerate")}
                       closable={false}
                       visible={this.state.showConfirmModal}
                       footer={[
                       <Button key="del" size="large" type="primary" onClick={this.onRegenerate.bind(this)}>{util.t("common.ok")}</Button>,
                       <Button key="cancel" size="large" onClick={this.switchModal.bind(this, false)}>{util.t("common.cancel")}</Button>
                    ]}
                >
                    <div style={{lineHeight: "60px"}}>
                        <p style={{height: "60px", fontSize: "14px"}}>{util.t("message.regenerate")}</p>
                    </div>
                </Modal>
            </div>;
    }
}

export default ClientSecret;
