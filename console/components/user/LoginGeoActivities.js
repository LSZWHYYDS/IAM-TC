/**
 * Created by xifeng on 2018/01/25.
 * user historical login geo activities.
 */
/*jshint esversion: 6 */

import React, { Component } from "react";
import { Table } from "antd";
import util from "../../common/util";
import userUtil from "./userUtil";

class LoginGeoActivities extends Component {
    constructor(...args) {
        super(...args);
    }

    columns() {
        return [
            {
                key: "timestamp",
                title: util.t("user.latestLoginActivity.geo.cols.timestamp"),
                dataIndex: "timestamp",
                render: (text,record) => util.formatUnixTimestamp(record.timestamp),
            },
            {
                key: "country",
                title: util.t("user.latestLoginActivity.geo.cols.country"),
                dataIndex: "country_name",
            },
            {
                key: "city",
                title: util.t("user.latestLoginActivity.geo.cols.city"),
                dataIndex: "city",
            },
            {
                key: "ip",
                title: util.t("user.latestLoginActivity.geo.cols.ip"),
                dataIndex: "ip",
            },
            {
                key: "geo",
                title: util.t("user.latestLoginActivity.geo.cols.geo"),
                dataIndex: "latitude",
                render: (text,record) => `${record.latitude},${record.longitude}`,
            },
        ];
    }
    sort(data) {
        const sorted = userUtil.parseLatestLoginGeo(data);
        return sorted.slice(0,10);
    }
    render() {
        return (
            <Table
                columns={this.columns()}
                dataSource={this.sort(this.props.data)}
                rowKey={record => record.timestamp}
            />
        );
    }
}
export default LoginGeoActivities;