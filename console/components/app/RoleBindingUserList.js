/**
 * Created by xifeng on 2017/12/17.
 * The App role user binding list.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {  Button } from "antd";
import util from "../../common/util";
import PagerTable from "../../common/pagerTable";
import appAPI from "../../api/appAPI";
import defaultAvatar from "../../img/default-avatar.png";
import RoleBindingScopeDialog from "./RoleBindingScopeDialog";
import { PERM_SETS } from "../../constants";
import AuthzComponent from "../../common/AuthzComponent";

class RoleBindingUserList extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            editScope: false,
            editingEntry: null,
        };
    }
    onRenderAvatar(text, entry) {
        const avatar = (
            <img src={entry.user.picture || defaultAvatar} style={{verticalAlign:"middle", width: "30px", height: "30px"}} />
        );
        return (
            <AuthzComponent
                allowed={[PERM_SETS.VIEW_USER, PERM_SETS.DELETE_USER, PERM_SETS.EDIT_USER]}
                defaultComponent={avatar}
            >
                <Link className="detail-link" to={"/home/userInfo/" + entry.user.username}>
                    {avatar}
                </Link>
            </AuthzComponent>
        );
    }
    onRenderName(text, entry) {
        const username = (
            <span style={{display: "inline-block", marginLeft: "10px"}} title={entry.user.username}>
                {entry.user.username}
            </span>
        );
        return (
            <AuthzComponent
                allowed={[PERM_SETS.VIEW_USER, PERM_SETS.DELETE_USER, PERM_SETS.EDIT_USER]}
                defaultComponent={username}
            >
                <Link className="detail-link" to={"/home/userInfo/" + entry.user.username}>
                    {username}
                </Link>
            </AuthzComponent>
        );
    }
    onRenderScopes(text, entry) {
        return (
            entry.binding_scopes && entry.binding_scopes.length &&
                <div>
                    { entry.binding_scopes.map(this.renderOneScope.bind(this)) }
                </div>
        );
    }
    renderOneScope(scope) {
        return (
            scope &&
                <div key={scope.scope} title={scope.scope}>
                    {
                        scope.scope === "_null" ? util.t("org.defaultOrg")
                        : scope.scope_description || scope.scope
                    }
                </div>
        );
    }

    onRenderActions(text, entry ) {
        return (
            <div>
                {
                    this.props.hasScope &&
                    <Button icon="edit" shape="circle" title={util.t("app.perm.binding.scope.title")} size="large" onClick={this.editScope.bind(this, entry)} />
                }
                {
                    entry.user.created_mode !== 1 &&
                    <Button icon="delete" shape="circle" title={util.t("common.delete")} size="large" onClick={this.unboundUser.bind(this, entry)} />
                }
            </div>
        );
    }

    refreshTable() {
        this.userTable.refresh({} , false);
    }
    initTable() {
        const cols = [{
            title: "",
            dataIndex: "user.picture",
            key: "picture",
            render: this.onRenderAvatar.bind(this)
        }, {
            title: util.t("app.entitlement.user.tbl.cols.username"),
            dataIndex: "user.username",
            key: "username",
            render: this.onRenderName.bind(this)
        }, {
            title: util.t("app.entitlement.user.tbl.cols.name"),
            dataIndex: "user.name",
            key: "name"
        }, {
            title: util.t("app.entitlement.user.tbl.cols.email"),
            dataIndex: "user.email",
            key: "email"
        }, {
            title: util.t("app.entitlement.user.tbl.cols.phone"),
            dataIndex: "user.phone_number",
            key: "phone_number"
        }];

        if (this.props.hasScope) {
            cols.push({
                title: util.t("app.entitlement.user.tbl.cols.scope"),
                dataIndex: "binding_scopes",
                key: "binding_scopes",
                render: this.onRenderScopes.bind(this),
            });
        }

        cols.push({
            title: util.t("app.entitlement.user.tbl.cols.action"),
            key: "actions",
            dataIndex: "user.sub",
            render: this.onRenderActions.bind(this),
        });

        return cols;
    }
    componentDidMount() {
        util.filterDangerousChars();
    }
    editScope(entry) {
        this.setState({
            editScope: true,
            editingEntry: entry,
        });
    }

    cancelEditScope() {
        this.setState({
            editScope: false,
            editingEntry: null,
        });
        this.refreshTable();
    }
    unboundUser(entry) {
        const params = {
            client_id: this.props.clientId,
            role: this.props.role.name,
            username: [ entry.user.username ],
        };

        appAPI.unbindUserWithRole(params).then(
            () => {
                util.showSuccessMessage();
                this.refreshTable();
            },
            (error) => {
                util.showErrorMessage(error);
            }
        );
    }

    render() {
        const params = {
                client_id: this.props.clientId,
                role_name: this.props.role.name,
            }, { editingEntry } = this.state;
        return (
            <div>
                <div className="row-container">
                    <div className="col-left-container">
                        <div>
                            <PagerTable
                                {...this.props}
                                rowKey="user.sub"
                                pageSize={100}
                                api={appAPI.getRoleBindingUsers}
                                containerClassName="app-entitled-user-table"
                                params={params}
                                columns={this.initTable()}
                                showSelect={false}
                                ref={(input) => {this.userTable = input;}}
                            />
                        </div>
                        <div>
                            <RoleBindingScopeDialog
                                show={this.state.editScope}
                                clientId={this.props.clientId}
                                role={this.props.role}
                                data={editingEntry}
                                target={editingEntry? editingEntry.user.username: editingEntry}
                                targetType={"USER"}
                                onClose={this.cancelEditScope.bind(this)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
RoleBindingUserList.defaultProps = {
    hasScope : true, //can has scope
};
export default RoleBindingUserList;
