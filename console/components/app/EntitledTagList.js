/**
 * Created by xifeng on 2017/11/20.
 * The App entitlement user list.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {  Button } from "antd";
import util from "../../common/util";
import PagerTable from "../../common/pagerTable";
import appAPI from "../../api/appAPI";
import { PERM_SETS } from "../../constants";
import AuthzComponent from "../../common/AuthzComponent";

class EntitledTagList extends Component {
    constructor(...args) {
        super(...args);
    }
    onRenderName(text, entry) {
        const name = (
            <span style={{display: "inline-block", marginLeft: "10px"}} title={entry.name}>
                {entry.name}
            </span>
        );
        return (
            <AuthzComponent
                allowed={[PERM_SETS.VIEW_TAG, PERM_SETS.DELETE_TAG, PERM_SETS.EDIT_TAG]}
                defaultComponent={name}
            >
                <Link className="detail-link" to={"/home/editTag/" + entry.name}>
                    {name}
                </Link>
            </AuthzComponent>
        );
    }

    onRenderActions(text, entry ) {
        return (
            <div>
                <Button icon="delete" size="large" onClick={this.removeEntitlement.bind(this,entry)} />
            </div>
        );
    }

    refreshTable() {
        this.userTable.refresh({} , false);
    }
    initEntitledTagTable() {
        return [{
            title: util.t("tag.name"),
            dataIndex: "name",
            key: "name",
            render: this.onRenderName.bind(this)
        }, {
            title: util.t("tag.desc"),
            dataIndex: "description",
            key: "description",
        }, {
            title: util.t("tag.type"),
            dataIndex: "type",
            key: "type",
            render: (text,entry) => entry.type === "STATIC" ? util.t("tag.static") : util.t("tag.dynamic"),
        }, {
            title: util.t("common.action"),
            dataIndex: "name",
            key: "action",
            render: this.onRenderActions.bind(this)
        }];
    }
    componentDidMount() {
        util.filterDangerousChars();
    }
    removeEntitlement(entry) {
        const params = {
            id: this.props.appId,
            tags: [ entry.name ]
        };

        appAPI.removeTagEntitlement(params).then(
            () => {
                util.showSuccessMessage(util.t("app.entitlement.tag.action.deleteSuccessPrompt"));
                this.refreshTable();
            },
            (error) => {
                util.showErrorMessage(error);
            }
        );
    }
    render() {
        const params = {
            id: this.props.appId,
        };
        return (
            <div className="scrollable-div">
                <div className="row-container">
                    <div className="col-left-container">
                        <div>
                            <PagerTable
                                {...this.props}
                                rowKey="name"
                                api={appAPI.getEntitledTags}
                                containerClassName="app-entitled-user-table"
                                params={params}
                                columns={this.initEntitledTagTable()}
                                showSelect={false}
                                ref={(input) => {this.userTable = input;}}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EntitledTagList;
