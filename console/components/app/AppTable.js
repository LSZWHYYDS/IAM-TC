/**
 * Created by shaliantao on 2017/8/24.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Dropdown, Icon, Menu, Tooltip, Modal } from "antd";
import util from "../../common/util";
import { app } from "../../common/map";
import appAPI from "../../api/appAPI";
import PagerTable from "../../common/pagerTable";
import { PERM_SETS } from "../../constants";
import AuthzComponent from "../../common/AuthzComponent";

const MenuItem = Menu.Item;

class AppTable extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            showDelModal: false,
            showAddModal: false,
            isLoading: false,
            selectedRows: [],
            status: (this.props.searchParams && this.props.searchParams.status) || "all",
            appType: (this.props.searchParams && this.props.searchParams.application_type) || "all"
        };
        this.searchParams = this.props.searchParams || {};
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
                <Tooltip title={record.description || text}>
                    <span style={{verticalAlign: "top", display: "inline-block", marginLeft: "60px"}}>
                        { this.props.showAppDetail ?
                            <Link className="detail-link" to={"/home/appInfo/" + record.client_id}>{text}</Link>
                            : text
                        }
                    </span>
                </Tooltip>
            </div>
        );
    }
    refreshTable(searchParams, keepSelected) {
        //this.props.setSearchParams(searchParams);
        this.listTable.refresh(searchParams, keepSelected);
    }
    handleFilterStatus(status) {
        if (status === "all") {
            delete this.searchParams.status;
        } else {
            this.searchParams.status = status;
        }
        this.refreshTable(this.searchParams);
        this.setState({
            status: status
        });
    }
    handleFilterType(appType) {
        if (appType === "all") {
            delete this.searchParams.application_type;
        } else {
            this.searchParams.application_type = appType;
        }
        this.refreshTable(this.searchParams);
        this.setState({
            appType: appType
        });
    }
    getAppTypeMenu() {
        return (
            <Menu>
                <MenuItem  key="all">
                    <a href="javascript:void(0)" onClick={this.handleFilterType.bind(this, "all")}>{util.t("common.all")}</a>
                </MenuItem>
                <MenuItem  key="native">
                    <a href="javascript:void(0)" onClick={this.handleFilterType.bind(this, "native")}>Native App</a>
                </MenuItem>
                <MenuItem  key="trusted">
                    <a href="javascript:void(0)" onClick={this.handleFilterType.bind(this, "trusted")}>Trusted App</a>
                </MenuItem>
                <MenuItem  key="spa">
                    <a href="javascript:void(0)" onClick={this.handleFilterType.bind(this, "spa")}>Single Page App</a>
                </MenuItem>
                <MenuItem  key="web">
                    <a href="javascript:void(0)" onClick={this.handleFilterType.bind(this, "web")}>Web App</a>
                </MenuItem>
                <MenuItem  key="cli">
                    <a href="javascript:void(0)" onClick={this.handleFilterType.bind(this, "cli")}>CLI App</a>
                </MenuItem>
            </Menu>
        );
    }
    getStatusMenu() {
        return (
            <Menu>
                <MenuItem  key="all">
                    <a href="javascript:void(0)" onClick={this.handleFilterStatus.bind(this, "all")}>{util.t("common.all")}</a>
                </MenuItem>
                <MenuItem  key="ACTIVE">
                    <a href="javascript:void(0)" onClick={this.handleFilterStatus.bind(this, "ACTIVE")}>{util.t("common.enabled")}</a>
                </MenuItem>
                <MenuItem  key="INACTIVE">
                    <a href="javascript:void(0)" onClick={this.handleFilterStatus.bind(this, "INACTIVE")}>{util.t("common.inactive")}</a>
                </MenuItem>
            </Menu>
        );
    }
    toggleActive(entry, newStatus) {
        let id = entry.client_id;
        appAPI.changeStatus(id, newStatus).then(
            () => {
                this.refreshTable(this.searchParams);
                util.showSuccessMessage();
            },
            (error) => {
                util.showErrorMessage(error);
            }
        );
    }
    switchDelModal(show, entry) {
        this.setState({
            showDelModal: show,
            deletingApp: entry,
        });
    }
    handleDel() {
        const { deletingApp } = this.state;

        this.switchDelModal(false);
        this.setLoading(true);
        appAPI.delete(deletingApp.client_id).then(
            () => {
                this.setLoading(false);
                util.showSuccessMessage();
                this.listTable.refresh();
            },
            (error) => {
                this.setLoading(false);
                util.showErrorMessage(error);
            }
        );
    }
    onRenderAction(text, entry ) {
        const enableBtn = (
            <AuthzComponent allowed={[PERM_SETS.EDIT_APP, PERM_SETS.ADMIN_APP]}>
                <Button icon="play-circle-o" shape="circle" title={util.t("common.enable")} size="large"
                    onClick={this.toggleActive.bind(this, entry, "ACTIVE")}
                />
            </AuthzComponent>
        ), disableBtn = (
            <AuthzComponent allowed={[PERM_SETS.EDIT_APP, PERM_SETS.ADMIN_APP]}>
                <Button icon="minus-circle-o" shape="circle" title={util.t("common.disable")} size="large"
                    title={util.t("common.disable")}
                    onClick={this.toggleActive.bind(this, entry, "INACTIVE")}
                />
            </AuthzComponent>
        );

        return (
            <div>
                <AuthzComponent allowed={[PERM_SETS.EDIT_APP, PERM_SETS.ADMIN_APP]} >
                    <Link className="detail-link" to={"/home/appInfo/" + entry.client_id}>
                        <Button icon="edit" shape="circle" title={util.t("common.edit")} size="large"/>
                    </Link>
                </AuthzComponent>
                {entry.status === "ACTIVE" ? disableBtn : enableBtn}
                {
                    /**
                    * TODO: does not work.
                    <Link to="/home/editApp">
                        <Button icon="edit" shape="circle" title={util.t("common.edit")} size="large"/>
                    </Link>
                     */
                }
                <AuthzComponent allowed={[PERM_SETS.DELETE_APP, PERM_SETS.ADMIN_APP]}>
                    <Button icon="delete" shape="circle" title={util.t("common.delete")} size="large"
                        onClick={this.switchDelModal.bind(this, true, entry)}
                    />
                </AuthzComponent>
            </div>
        );
    }

    initTable() {
        const cols = [{
            title: util.t("app.name"),
            dataIndex: "client_name",
            key: "client_name",
            className: "align-left",
            render: this.renderName.bind(this)
        }, {
            title: (
                <div style={{textAlign: "center"}}>
                    { this.props.showFilter &&
                        <Dropdown overlay={this.getAppTypeMenu()} trigger={["click"]}>
                            <span style={{cursor: "pointer", width: "200px", display: "inline-block"}}>
                                {util.t("app.type")}({app.getAppType(this.state.appType)})
                                <Icon type="down" />
                            </span>
                        </Dropdown>
                    }
                    { !this.props.showFilter &&
                        <span style={{width: "200px", display: "inline-block"}}>{util.t("app.type")}</span>
                    }
                </div>
            ),
            dataIndex: "application_type",
            key: "application_type",
            render: (text) => app.getAppType(text)
        }, {
            title: "Client ID",
            dataIndex: "client_id",
            key: "client_id"
        },{
            title: (
                <div style={{textAlign: "center"}}>
                    {
                        this.props.showFilter ? (
                            <Dropdown overlay={this.getStatusMenu()} trigger={["click"]}>
                                <span style={{cursor: "pointer", width: "100px", display: "inline-block"}}>
                                    {util.t("common.status")}({app.getStatus(this.state.status)})
                                    <Icon type="down" />
                                </span>
                            </Dropdown> )
                        : (<span style={{width: "100px", display: "inline-block"}}>{util.t("common.status")}</span>)
                    }
                </div>
            ),
            dataIndex: "status",
            key: "status",
            render: (text) => app.getStatus(text)
        }];

        if (this.props.showAction) {
            const actionCol = {
                title: util.t("common.action"),
                dataIndex: "profile_name",
                key: "action",
                render: this.onRenderAction.bind(this)
            };
            cols.push(actionCol);
        }

        return cols;
    }
    componentDidMount() {
        util.filterDangerousChars();
    }
    handleRowSelect(selectedRowKeys, selectedRows) {
        this.setState({
            selectedRows: selectedRows
        });
    }
    setLoading(isLoading) {
        this.setState({
            isLoading: isLoading
        });
    }
    render() {
        return (
            <div>
                <PagerTable rowKey="client_id"
                    api={this.props.api}
                    params={this.props.params}
                    columns={this.initTable()}
                    showSelect={this.props.showSelect}
                    selectType={this.props.selectType || "radio"}
                    showFilter={this.props.showFilter}
                    defaultSearchParams={this.searchParams}
                    hidePagination={true}
                    ref={(input) => {this.listTable = input;}}
                    onSelect={this.props.onSelect || this.handleRowSelect.bind(this)}
                />
                <Modal title={util.t("common.delPrompt")}
                    closable={false}
                    visible={this.state.showDelModal}
                    footer={[
                        <Button key="cancel" size="large" onClick={this.switchDelModal.bind(this, false)}>{util.t("common.cancel")}</Button>,
                        <Button key="del" size="large" type="primary" onClick={this.handleDel.bind(this)}>{util.t("common.ok")}</Button>
                    ]}
                >
                    <div style={{lineHeight: "60px"}}>
                        <p style={{height: "30px", fontSize: "14px"}}>{util.t("message.delAppPrompt")}</p>
                        <p style={{height: "30px", fontSize: "14px", color: "#E84352"}}>
                            <Icon type="exclamation-circle-o" /> {util.t("message.delAppTip")}
                        </p>
                    </div>
                </Modal>
            </div>
        );
    }
}

AppTable.defaultProps = {
    showAppDetail: true, //show app detail ?
    showAction: false, //show action column ?
};

export default AppTable;
