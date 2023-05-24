/**
 * Created by xifeng on 2017/12/09.
 * The Application Role list.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import {  Button, Input } from "antd";
import util from "../../common/util";
import PagerTable from "../../common/pagerTable";
import appAPI from "../../api/appAPI";
import appUtil from "./appUtil";
import RoleDialog from "./RoleDialog";
import RoleBindingDialog from "./RoleBindingDialog";
import { PERM_SETS } from "../../constants";
import AuthzComponent from "../../common/AuthzComponent";
const Search = Input.Search;

class AppRoleList extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            editing: false,
        };

        this.searchParams = this.props.searchParams || {};
        this.mode = this.props.mode || "edit";
    }

    onRenderName(text, entry) {
        return (
            <a onClick={this.editing.bind(this,entry)} >{text}</a>
        );
    }

    onRenderAction(text, entry ) {
        return (
            <div>
                {
                    this.props.showBinding &&
                    <AuthzComponent allowed={[PERM_SETS.ASSIGN_ROLE]}>
                        <Button icon="usergroup-add" shape="circle" title={util.t("common.bindRoleWithUser")} size="large" onClick={this.editRoleBinding.bind(this, entry)} />
                    </AuthzComponent>
                }
                {
                    this.props.showActions &&
                    (appUtil.isRoleEditable(entry) ?
                        <AuthzComponent allowed={[PERM_SETS.EDIT_ROLE]}>
                            <Button icon="edit" shape="circle" title={util.t("common.edit")} size="large" onClick={this.editing.bind(this, entry)} />
                        </AuthzComponent>
                    :   <AuthzComponent allowed={[PERM_SETS.EDIT_ROLE]}>
                            <Button icon="lock" shape="circle" title={util.t("common.view")} size="large" onClick={this.editing.bind(this, entry)} />
                        </AuthzComponent>
                    )
                }
                {
                    this.props.showActions && (
                        <AuthzComponent allowed={[PERM_SETS.NEW_ROLE]}>
                            <Button icon="copy" shape="circle" title={util.t("common.copy")} size="large" onClick={this.duplicating.bind(this, entry)} />
                        </AuthzComponent>
                    )
                }
                {
                    this.props.showActions && !appUtil.isSystemRole(entry) && (
                        <AuthzComponent allowed={[PERM_SETS.DELETE_ROLE]}>
                            <Button icon="delete" shape="circle" title={util.t("common.delete")} size="large" onClick={this.removeRole.bind(this, entry.name)} />
                        </AuthzComponent>
                    )
                }
            </div>
        );
    }

    refreshTable() {
        if (this.props.createMode) {
            this.searchParams.create_mode = this.props.createMode;
        }
        this.roleTable.refresh(this.searchParams , false);
    }

    initTable() {
        return [{
            title: util.t("app.perm.role.tbl.cols.name"),
            dataIndex: "name",
            key: "name",
            width: 150,
            render: this.onRenderName.bind(this),
            sorter: (a,b) => {
                if (a.name.toUpperCase() === "SUPER_ADMIN") {
                    return b.name.toUpperCase() === "SUPER_ADMIN" ? 0 : -1;
                }
                if (b.name.toUpperCase() === "SUPER_ADMIN") {
                    return a.name.toUpperCase() === "SUPER_ADMIN" ? 0 : 1;
                }

                if (appUtil.isSystemRole(a)) {
                    return appUtil.isSystemRole(b) ? a.name.localeCompare(b.name) : -1;
                }
                if (appUtil.isSystemRole(b)) {
                    return appUtil.isSystemRole(a) ? a.name.localeCompare(b.name) : 1;
                }
                return a.name.localeCompare(b.name);
            },
            sortOrder: "ascend",
        }, {
            title: util.t("app.perm.role.tbl.cols.displayName"),
            dataIndex: "display_name",
            key: "display_name",
            width: 150,
        }, {
            title: util.t("app.perm.role.tbl.cols.desc"),
            dataIndex: "description",
            key: "description",
            width: 150,
        }, {
            title: util.t("app.perm.role.tbl.cols.action"),
            key: "action",
            dataIndex: "name",
            render: this.onRenderAction.bind(this),
            width: 150,
        }];
    }
    componentDidMount() {
        util.filterDangerousChars();
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.reload){
            this.refreshTable();
        }
    }
    editing(entry) {
        this.setState({
            editing: true,
            editingRole: entry,
        });
    }

    cancelEditRole() {
        this.setState({
            editing: false,
            editingRole: null,
        });
    }
    duplicating(entry) {
        const clone = {
            permissions: Object.assign([], entry.permissions) || [],
            permission_sets: Object.assign([], entry.permission_sets) || [],
        };
        //hack for usercenter, we do not allow ORG permission to be copied
        if (this.props.appId === "tc") {
            clone.permission_sets = clone.permission_sets.filter(ps => {
                return !["NEW_ORG", "EDIT_ORG", "DELETE_ORG"].includes(ps);
            });
        }

        this.setState({
            duplicating: true,
            duplicatingEntry: clone,
        });
    }

    cancelDuplicateRole() {
        this.setState({
            duplicating: false,
            duplicatingEntry: null,
        });
    }
    editRoleBinding(entry) {
        this.setState({
            editBinding: true,
            editingRole: entry,
        });
    }

    cancelEditRoleBinding() {
        this.setState({
            editBinding: false,
            editingRole: null,
        });
    }

    editRole(role) {
        const params = {
            id: this.props.appId,
            role: role,
        };

        appAPI.editRole(params).then(
            () => {
                util.showSuccessMessage();
                this.refreshTable();
            },
            (error) => {
                util.showErrorMessage(error);
            }
        );
    }
    removeRole(role) {
        const params = {
            id: this.props.appId,
            role: role,
        };

        appAPI.removeRole(params).then(
            () => {
                util.showSuccessMessage();
                this.refreshTable();
            },
            (error) => {
                util.showErrorMessage(error);
            }
        );
    }
    handleShowModal(isShow) {
        this.setState({showModal: isShow});
    }
    handleSearch(searchKey) {
        this.searchParams.q = searchKey;
        this.refreshTable();
    }
    render() {
        const params = {
            id: this.props.appId,
        };
        if (this.props.createMode) {
            params.create_mode = this.props.createMode;
        }
        return (
            <div>
                <div className={this.state.modalHidden ? "hidden" : ""}>
                    <div className="row-container">
                        <div className="col-left-container">
                            <div>
                                <div style={{width:"30%"}}>
                                    <Search
                                        size="large"
                                        placeholder={util.t("app.perm.role.searchPlaceholder")}
                                        onSearch={this.handleSearch.bind(this)}
                                    />
                                </div>
                                <PagerTable
                                    {...this.props}
                                    rowKey="name"
                                    api={appAPI.getAppRoles}
                                    pageSize={100}
                                    scroll={this.props.scroll || { y: 300 }}
                                    containerClassName={this.props.containerClassName}
                                    defaultSearchParams={this.searchParams}
                                    params={params}
                                    columns={this.initTable()}
                                    showSelect={false}
                                    ref={(input) => {this.roleTable = input;}}
                                />
                            </div>
                        </div>
                    </div>

                    <RoleDialog
                        show={this.state.editing}
                        showPerm={this.props.showPerm}
                        showPermSet={this.props.showPermSet}
                        permSetRenderMode={this.props.permSetRenderMode}
                        mode="edit"
                        data={this.state.editingRole}
                        clientId={this.props.appId}
                        onClose={this.cancelEditRole.bind(this)}
                        onSave={this.refreshTable.bind(this)}
                    />

                    <AuthzComponent allowed={[PERM_SETS.NEW_ROLE]}>
                        <RoleDialog
                            show={this.state.duplicating}
                            showPerm={this.props.showPerm}
                            showPermSet={this.props.showPermSet}
                            permSetRenderMode={this.props.permSetRenderMode}
                            mode="add"
                            data={this.state.duplicatingEntry}
                            clientId={this.props.appId}
                            onClose={this.cancelDuplicateRole.bind(this)}
                            onSave={this.refreshTable.bind(this)}
                        />
                    </AuthzComponent>

                    <AuthzComponent allowed={[PERM_SETS.ASSIGN_ROLE]}>
                        <RoleBindingDialog
                            show={this.state.editBinding}
                            showBindingUser={this.props.showBindingUser}
                            showBindingOrg={this.props.showBindingOrg}
                            showBindingTag={this.props.showBindingTag}
                            mode="edit"
                            data={this.state.editingRole}
                            clientId={this.props.appId}
                            role={this.state.editingRole}
                            onClose={this.cancelEditRoleBinding.bind(this)}
                        />
                    </AuthzComponent>
                </div>
            </div>
        );
    }
}

AppRoleList.defaultProps = {
    showPerm: true,
    showPermSet: true,
    permSetRenderMode: "table",
    showBinding: true,//show binding ?
    showBindingUser: true,
    showBindingOrg: true,
    showActions: true,//show other actions?
    containerClassName: "",
};
export default AppRoleList;
