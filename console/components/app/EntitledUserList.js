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
import defaultAvatar from "../../img/default-avatar.png";
import { PERM_SETS } from "../../constants";
import AuthzComponent from "../../common/AuthzComponent";

class EntitledUserList extends Component {
    constructor(...args) {
        super(...args);
    }
    onRenderAvatar(text, entry) {
        const avatar = (
            <img src={entry.picture || defaultAvatar} style={{verticalAlign:"middle", width: "30px", height: "30px"}} />
        );
        return (
            <AuthzComponent
                allowed={[PERM_SETS.VIEW_USER, PERM_SETS.DELETE_USER, PERM_SETS.EDIT_USER]}
                defaultComponent={avatar}
            >
                <Link className="detail-link" to={"/home/userInfo/" + entry.username}>
                    {avatar}
                </Link>
            </AuthzComponent>
        );
    }
    onRenderName(text, entry) {
        const username = (
            <span style={{display: "inline-block", marginLeft: "10px"}} title={entry.username}>
                {entry.username}
            </span>
        );
        return (
            <AuthzComponent
                allowed={[PERM_SETS.VIEW_USER, PERM_SETS.DELETE_USER, PERM_SETS.EDIT_USER]}
                defaultComponent={username}
            >
                <Link className="detail-link" to={"/home/userInfo/" + entry.username}>
                    {username}
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
    initEntitledUserTable() {
        return [{
            title: "",
            dataIndex: "picture",
            key: "picture",
            render: this.onRenderAvatar.bind(this)
        }, {
            title: util.t("app.entitlement.user.tbl.cols.username"),
            dataIndex: "username",
            key: "username",
            render: this.onRenderName.bind(this)
        }, {
            title: util.t("app.entitlement.user.tbl.cols.name"),
            dataIndex: "name",
            key: "name"
        }, {
            title: util.t("app.entitlement.user.tbl.cols.email"),
            dataIndex: "email",
            key: "email"
        }, {
            title: util.t("app.entitlement.user.tbl.cols.phone"),
            dataIndex: "phone_number",
            key: "phone_number"
        }, {
            title: util.t("app.entitlement.user.tbl.cols.action"),
            key: "actions",
            dataIndex: "sub",
            render: this.onRenderActions.bind(this),
        }];
    }
    componentDidMount() {
        util.filterDangerousChars();
    }
    removeEntitlement(entry) {
        const params = {
            id: this.props.appId,
            usernames: [ entry.username ]
        };

        appAPI.removeUserEntitlement(params).then(
            () => {
                util.showSuccessMessage(util.t("app.entitlement.user.action.deleteSuccessPrompt"));
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
                                rowKey="sub"
                                api={appAPI.getEntitledUsers}
                                containerClassName="app-entitled-user-table"
                                params={params}
                                columns={this.initEntitledUserTable()}
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

export default EntitledUserList;
