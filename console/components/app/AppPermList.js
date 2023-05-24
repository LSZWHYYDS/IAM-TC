/**
 * Created by xifeng on 2017/12/09.
 * The Application Permission list.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import {  Button, Input } from "antd";
import util from "../../common/util";
import PagerTable from "../../common/pagerTable";
import PermDialog from "./PermDialog";
import appAPI from "../../api/appAPI";
import { PERM_SETS } from "../../constants";
import AuthzComponent from "../../common/AuthzComponent";
const Search = Input.Search;

class AppPermList extends Component {
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
                    <Button icon="delete" shape="circle" title={util.t("common.delete")} size="large" onClick={this.removePerm.bind(this, entry.name)} />
                </AuthzComponent>
            </div>
        );
    }

    refreshTable() {
        this.permTable.refresh(this.searchParams , false);
    }

    initTalbe() {
        const fixedCols = [{
            title: util.t("app.perm.perm.tbl.cols.name"),
            dataIndex: "name",
            key: "name",
            width: 150,
            render: this.onRenderName.bind(this),
        },{
            title: util.t("app.perm.perm.tbl.cols.displayName"),
            dataIndex: "display_name",
            key: "display_name",
            width: 150,
        },{
            title: util.t("app.perm.perm.tbl.cols.desc"),
            dataIndex: "description",
            key: "description",
            width: 150,
        }];

        if (this.mode === "edit") {
            fixedCols.push({
                title: util.t("app.perm.perm.tbl.cols.action"),
                key: "action",
                dataIndex: "name",
                render: this.onRenderAction.bind(this),
                width: 150,
            });
        }

        return fixedCols;
    }
    componentDidMount() {
        util.filterDangerousChars();
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
    removePerm(perm) {
        const params = {
            client_id: this.props.appId,
            perm: perm,
        };

        appAPI.removePerm(params).then(
            () => {
                util.showSuccessMessage();
                this.refreshTable();
                this.props.setReload(true, true);
            },
            (error) => {
                util.showErrorMessage(error);
            }
        );
    }
    duplicating(entry) {
        const clone = {
            payload: entry.payload,
            description: entry.description,
            display_name: entry.display_name,
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
                                <div style={{width:"30%"}}>
                                    <Search
                                        size="large"
                                        placeholder={util.t("app.perm.perm.searchPlaceholder")}
                                        onSearch={this.handleSearch.bind(this)}
                                    />
                                </div>
                                <PagerTable
                                    {...this.props}
                                    rowKey="name"
                                    api={appAPI.getAppPerms}
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

                    <PermDialog
                        show={this.state.editDlg}
                        mode="edit"
                        data={this.state.editingPerm}
                        clientId={this.props.appId}
                        onClose={this.closeEditDlg.bind(this)}
                        onSave={this.refreshTable.bind(this)}
                    />
                    <PermDialog
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

export default AppPermList;
