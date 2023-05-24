/**
 * Created by xifeng on 2018/01/02.
 * The Application Permission Set list.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import {  Button, Input } from "antd";
import util from "../../common/util";
import PagerTable from "../../common/pagerTable";
import PermSetDialog from "./PermSetDialog";
import appAPI from "../../api/appAPI";
import { PERM_SETS } from "../../constants";
import AuthzComponent from "../../common/AuthzComponent";
const Search = Input.Search;

class AppPermSetList extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            editDlg: false,
            delDlg: false,
        };

        this.searchParams = this.props.searchParams || {};
        this.mode = this.props.mode || "edit";
    }
    onRenderName(text, entry) {
        return (
            <a onClick={this.showEditDlg.bind(this,entry)} >{text}</a>
        );
    }

    onRenderAction(text, entry ) {
        return (
            <div>
                <AuthzComponent allowed={[PERM_SETS.EDIT_ROLE]}>
                    <Button icon="edit" shape="circle" title={util.t("common.edit")} size="large" onClick={this.showEditDlg.bind(this, entry)} />
                </AuthzComponent>
                <AuthzComponent allowed={[PERM_SETS.NEW_ROLE]}>
                    <Button icon="copy" shape="circle" title={util.t("common.copy")} size="large" onClick={this.duplicating.bind(this, entry)} />
                </AuthzComponent>
                <AuthzComponent allowed={[PERM_SETS.DELETE_ROLE]}>
                    <Button icon="delete" shape="circle" title={util.t("common.delete")} size="large" onClick={this.remove.bind(this, entry.name)} />
                </AuthzComponent>
            </div>
        );
    }

    refreshTable() {
        this.permTable.refresh(this.searchParams , false);
    }

    initTalbe() {
        const fixedCols = [{
            title: util.t("app.perm.permSet.tbl.cols.name"),
            dataIndex: "name",
            key: "name",
            width: 150,
            render: this.onRenderName.bind(this),
        },{
            title: util.t("app.perm.permSet.tbl.cols.displayName"),
            dataIndex: "display_name",
            key: "display_name",
            width: 150,
        },{
            title: util.t("app.perm.permSet.tbl.cols.desc"),
            dataIndex: "description",
            key: "description",
            width: 150,
        }];

        if (this.mode === "edit") {
            fixedCols.push({
                title: util.t("app.perm.permSet.tbl.cols.action"),
                key: "action",
                dataIndex: "name",
                render: this.onRenderAction.bind(this),
                width: 150,
            });
        }

        return fixedCols;
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.reload){
            this.refreshTable();
        }
    }
    componentDidMount() {
        util.filterDangerousChars();
    }
    cancelDelUserModal() {
        this.setState({
            delDlg: false
        });
    }
    showEditDlg(entry) {
        this.setState({
            editDlg: true,
            editingPerm: entry,
        });
    }

    closeEditDlg() {
        this.setState({
            editDlg: false
        });
    }
    duplicating(entry) {
        const clone = {
            permissions: Object.assign([], entry.permissions) || [],
        };
        this.setState({
            duplicating: true,
            duplicatingEntry: clone,
        });
    }

    cancelDuplicate() {
        this.setState({
            duplicating: false,
            duplicatingEntry: null,
        });
    }
    remove(ps) {
        const params = {
            client_id: this.props.appId,
            name: ps,
        };

        appAPI.removePermSet(params).then(
            () => {
                util.showSuccessMessage();
                this.refreshTable();
                this.props.setReload(false, true);
            },
            (error) => {
                util.showErrorMessage(error);
            }
        );
    }
    handleSearch(searchKey) {
        this.searchParams.q = searchKey;
        this.refreshTable();
    }
    render() {
        const params = {
            client_id: this.props.appId,
        };
        return (
            <div>
                <div>
                    <div className="row-container">
                        <div className="col-left-container">
                            <div>
                                <div style={{ width:"30%"}}>
                                    <Search
                                        size="large"
                                        placeholder={util.t("app.perm.permSet.searchPlaceholder")}
                                        onSearch={this.handleSearch.bind(this)}
                                    />
                                </div>
                                <PagerTable
                                    {...this.props}
                                    rowKey="name"
                                    api={appAPI.getPermSet}
                                    pageSize={100}
                                    scroll={{ y: 300 }}
                                    containerClassName=""
                                    defaultSearchParams={this.searchParams}
                                    params={params}
                                    columns={this.initTalbe()}
                                    showSelect={this.mode === "select" ? true :false}
                                    ref={(input) => {this.permTable = input;}}
                                />
                            </div>
                        </div>
                    </div>

                    <PermSetDialog
                        show={this.state.editDlg}
                        mode="edit"
                        data={this.state.editingPerm}
                        clientId={this.props.appId}
                        onClose={this.closeEditDlg.bind(this)}
                        onSave={this.refreshTable.bind(this)}
                    />
                    <PermSetDialog
                        show={this.state.duplicating}
                        mode="add"
                        data={this.state.duplicatingEntry}
                        clientId={this.props.appId}
                        onClose={this.cancelDuplicate.bind(this)}
                        onSave={this.refreshTable.bind(this)}
                    />
                </div>
            </div>
        );
    }
}

export default AppPermSetList;
