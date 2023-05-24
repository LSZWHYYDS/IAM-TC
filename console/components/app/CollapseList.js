/**
 * Created by shaliantao on 2017/9/4.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Row, Col, Table, Button, Tooltip } from "antd";
import { app } from "../../common/map";
import util from "../../common/util";
import appAPI from "../../api/appAPI";

const isLandscape = util.isLandscape();

class CollapseList extends Component {
    constructor(...args) {
        super(...args);
    }
    cancelAuthorization(auth_id) {
        appAPI.cancelAuthorization(auth_id).then(() => {
            util.showSuccessMessage();
            this.props.refreshTable();
        }, (err) => {
            util.showErrorMessage(err);
        });
    }
    openAppHome(appHome) {
        if (appHome) {
            window.open(appHome + '?tcode=' + localStorage.getItem("tcode"));
        }
        return false;
    }
    renderName(text, record) {
        return (
            <div style={{height: "30px", lineHeight: "30px"}}>
                <Tooltip title={record.client_uri}>
                    <img src={record.logo_uri || app.getDefaultAppIcon(record.application_type)}
                        style={{width: "30px", height: "30px", cursor: record.client_uri && "pointer"}}
                        onClick={this.openAppHome.bind(this, record.client_uri)}
                    />
                </Tooltip>
                <span style={{verticalAlign: "top", marginLeft: isLandscape ? "40px" : "10px"}}>
                    {text}
                </span>
            </div>
        );
    }
    initTable() {
        return [
            {
                title: util.t("app.name"),
                dataIndex: "client_name",
                key: "client_name",
                className: "align-left",
                render: this.renderName.bind(this)
            },
            {
                title: util.t("common.operate"),
                dataIndex: "key",
                key: "key",
                render: (text, record) =>
                    <Button disabled={!record.approved_id}
                            onClick={this.cancelAuthorization.bind(this, record.approved_id)}
                    >
                        { util.t("app.cancelAuthorization") }
                    </Button>
            }
        ];
    }
    expandedRowRender(record) {
        return <div>
                <Row className="align-left">
                    <Col span={isLandscape ? 2 : 6}>{util.t("app.type")}：</Col>
                    <Col span={isLandscape ? 22 : 18}>{app.getAppType(record.application_type)}</Col>
                </Row>
                {
                    record.description && (
                        <Row className="align-left">
                            <Col span={isLandscape ? 2 : 6}>{util.t("app.appBriefIntro")}：</Col>
                            <Col span={isLandscape ? 22 : 18}>{record.description}</Col>
                        </Row>
                    )
                }
            </div>;
    }
    render() {
        return (
            <Table
                rowKey={record => record.client_id}
                columns={this.initTable()}
                pagination={false}
                expandedRowRender={this.expandedRowRender.bind(this)}
                dataSource={this.props.data}
            />
        );
    }
}

export default CollapseList;