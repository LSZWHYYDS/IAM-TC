/**
 * Created by xifeng on 2017/12/15.
 * The Application Role(Permission Set)/Permission binding list.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import {  Input } from "antd";
import util from "../../common/util";
import PagerTable from "../../common/pagerTable";
import appAPI from "../../api/appAPI";
const Search = Input.Search;

class AppPermBindingList extends Component {
    constructor(...args) {
        super(...args);
        this.searchParams = this.props.searchParams || {};

        this.clientId = this.props.clientId;
    }
    refreshTable() {
        this.permTable.refresh(this.searchParams , true);
    }

    initTalbe() {
        const fixedCols = [{
            title: util.t("app.perm.perm.tbl.cols.name"),
            dataIndex: "name",
            key: "name",
            width: 150,
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

        return fixedCols;
    }
    componentDidMount() {
        util.filterDangerousChars();
    }
    handleSearch(searchKey) {
        this.searchParams.q = searchKey;
        this.refreshTable();
    }
    render() {
        const params = {
                client_id: this.props.appId,
            }, bindings = this.props.bindings || [];

        return (
            <div>
                <div>
                    <div className="row-container">
                        <div className="col-left-container">
                            <div>
                                <div style={{ width:"60%"}}>
                                    <Search
                                        size="large"
                                        placeholder={util.t("app.perm.perm.searchPlaceholder")}
                                        onSearch={this.handleSearch.bind(this)}
                                    />
                                </div>
                                <PagerTable
                                    {...this.props}
                                    containerClassName=""
                                    rowKey="name"
                                    api={appAPI.getAppPerms}
                                    pageSize={100}
                                    defaultSearchParams={this.searchParams}
                                    params={params}
                                    scroll={{ y: 300 }}
                                    columns={this.initTalbe()}
                                    showSelect={true}
                                    selectedRowKeys={bindings}
                                    rowKey="name"
                                    ref={(input) => {this.permTable = input;}}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default AppPermBindingList;
