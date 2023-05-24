/**
 * Created by shaliantao on 2017/9/13.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Button, Breadcrumb } from "antd";
import util from "../../common/util";
import appAPI from "../../api/appAPI";
import CollapseList from "./CollapseList";

class MyApp extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            apps: null
        };
    }
    refreshTable() {
        appAPI.getSelfList().then((res) => {
            this.setState({
                apps: res.data.data.items.filter(app => app.application_type.toLowerCase() !== "cli")
            });
        }, (err) => {
            util.showErrorMessage(err);
        });
    }
    componentDidMount() {
        this.refreshTable();
    }
    onCancel() {
        this.props.history.goBack();
    }
    render() {
        return (
            <div>
                <span className="pathNode">
                    <Breadcrumb separator=">>">
                        <Breadcrumb.Item>{util.t("app.myApp")}</Breadcrumb.Item>
                    </Breadcrumb>
                </span>
                <div className="pd-20">
                    <CollapseList data={this.state.apps || []} refreshTable={this.refreshTable.bind(this)}/>
                    <div className="footerContainer">
                        <Button type="ghost"
                                className="ml-10"
                                onClick={this.onCancel.bind(this)}
                        >
                            {util.t("common.close")}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

export default MyApp;