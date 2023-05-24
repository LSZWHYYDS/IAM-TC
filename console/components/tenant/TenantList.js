import React, { Component } from "react";
import { Button, Breadcrumb, Spin, Modal, Popconfirm } from "antd";
import { Link } from "react-router-dom";
import util from "../../common/util";
import { connect } from "react-redux";
import homeActionCreators from "../../actions/homeActionCreators";
import tenantAPI from "../../api/tenantAPI";
import PagerTable from "../../common/pagerTable";
import { PERM_SETS } from "../../constants";
import AuthzComponent from "../../common/AuthzComponent";
import EditPass from "./EditPass";

class TenantList extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      currentRow: {},
      passFormVisible: false,
      isLoading: false,
      deletingApp: null,
      status:
        (this.props.searchParams && this.props.searchParams.status) || "all",
      appType:
        (this.props.searchParams && this.props.searchParams.application_type) ||
        "all",
      syncData: true,
    };
    this.searchParams = this.props.searchParams || {};
  }
  refreshTable(searchParams, keepSelected) {
    this.props.setSearchParams(searchParams);
    super.refreshTable(searchParams, keepSelected);
  }
  componentDidMount() {
    util.filterDangerousChars();
  }
  renderName(text, record) {
    return (
      <Link
        className="detail-link"
        to={{ pathname: "/home/tenantInfo/" + record.tenant_id }}
      >
        {text}
      </Link>
    );
  }
  initTable() {
    return [
      {
        title: util.t("tenant.id"),
        dataIndex: "tenant_id",
        key: "tenant_id",
      },
      {
        title: util.t("tenant.name"),
        dataIndex: "name",
        key: "name",
        render: this.renderName.bind(this),
      },
      {
        title: util.t("tenant.status"),
        dataIndex: "status",
        key: "status",
        render: (value) => {
          const titles = {
            NORMAL: "正常",
            DELETED: "已删除",
          };
          return titles[value] || "--";
        },
      },
      {
        title: util.t("tenant.createTime"),
        dataIndex: "create_time",
        key: "create_time",
      },
      {
        title: util.t("tenant.expiredTime"),
        dataIndex: "expired_time",
        key: "expired_time",
      },
      {
        title: util.t("tenant.funcNames"),
        dataIndex: "license_config",
        key: "license_config",
        render: (value) => {
          if (!value) {
            return "--";
          }
          const funcs = [];
          const funcNames = {
            adm: "应用分发",
            app_sso: "应用 SSO",
            dlp: "数据防泄漏",
            file_audit: "文件审计",
            gateway: "安全接入网关",
            risk_monitor: "安全基线监测/准入",
            user_join: "用户连接",
          };
          for (let item in funcNames) {
            if (value[item] && value[item].checked_value) {
              funcs.push(funcNames[item]);
            }
          }
          if (funcs.length) {
            return funcs.join(",");
          }
          return "--";
        },
      },
      {
        title: util.t("tenant.domain"),
        dataIndex: "domain",
        key: "domain",
      },
      {
        title: util.t("common.action"),
        dataIndex: "action",
        key: "action",
        render: this.onRenderAction.bind(this),
      },
    ];
  }
  onRenderAction(text, entry) {
    if (entry.status === "DELETED") {
      return "";
    }
    return (
      <div>
        <AuthzComponent
          allowed={[PERM_SETS.DELETE_TENANT, PERM_SETS.ADMIN_TENANT]}
        >
          <Link
            className="detail-link"
            to={{ pathname: "/home/editTenant/" + entry.tenant_id }}
          >
            <Button
              icon="edit"
              shape="circle"
              title={util.t("common.edit")}
              size="large"
            />
          </Link>
        </AuthzComponent>
        <Button
          icon="lock"
          shape="circle"
          title="修改密码"
          size="large"
          onClick={this.editPass.bind(this, entry)}
        />
        <AuthzComponent
          allowed={[PERM_SETS.DELETE_TENANT, PERM_SETS.ADMIN_TENANT]}
        >
          <Popconfirm
            title="确定要删除这个租户吗?"
            onConfirm={this.handleDel.bind(this, entry)}
          >
            <Button
              icon="delete"
              shape="circle"
              title={util.t("common.delete")}
              size="large"
            />
          </Popconfirm>
        </AuthzComponent>
      </div>
    );
  }
  handleDel(entry) {
    tenantAPI.delTenant(entry.tenant_id).then(
      () => {
        this.setState({
          isLoading: false,
        });
        util.showSuccessMessage();
        this.listTable.refresh();
      },
      (error) => {
        this.setState({
          isLoading: false,
        });
        util.showErrorMessage(error);
      }
    );
  }
  handleAddNew() {
    this.props.history.push("/home/editTenant");
  }
  //修改密码
  editPass(entry) {
    console.log("entry", entry);
    this.setState({
      passFormVisible: true,
      currentRow: entry,
    });
  }
  handleRowSelect(selectedRowKeys, selectedRows) {
    this.selectedRows = selectedRows;
    let syncData = this.selectedRows.length > 0 ? false : true;
    this.setState({
      syncData,
    });
  }
  onClosePassword() {
    this.setState({
      passFormVisible: false
    });
  }
  renderPassForm() {
    const { passFormVisible, currentRow } = this.state;
    return (
      passFormVisible && (
        <Modal
          visible={passFormVisible}
          footer={null}
          title={"修改密码" + currentRow.tenant_id}
          onCancel={this.onClosePassword.bind(this)}
        >
          <EditPass tenantId={currentRow.tenant_id}  onClose={this.onClosePassword.bind(this)} />
        </Modal>
      )
    );
  }
  render() {
    return (
      <Spin
        spinning={this.state.isLoading}
        style={{
          position: "fixed",
          left: "55%",
          top: "48%",
          height: 0,
          width: 0,
        }}
      >
        <div>
          <span className="pathNode">
            <Breadcrumb separator=">>">
              <Breadcrumb.Item>{util.t("tenant.tenant")}</Breadcrumb.Item>
            </Breadcrumb>
          </span>
          <div>
            <div className="searchRow btnsRow">
              <AuthzComponent
                allowed={[PERM_SETS.NEW_TENANT, PERM_SETS.ADMIN_TENANT]}
              >
                <div className="addUser">
                  <Button
                    type="primary"
                    className="addBtnBg"
                    onClick={this.handleAddNew.bind(this)}
                  >
                    <i className="iconfont icon-add mr-10"></i>
                    {util.t("tenant.add")}
                  </Button>
                </div>
              </AuthzComponent>
            </div>
            <div>
              <PagerTable
                rowKey="tenant_id"
                api={tenantAPI.getTenantsList}
                columns={this.initTable()}
                ref={(input) => {
                  this.listTable = input;
                }}
              />
            </div>
            {this.renderPassForm.bind(this)()}
          </div>
        </div>
      </Spin>
    );
  }
}

const mapStateToProps = (state) => ({
  searchParams: state.home.searchParams,
});

const mapDispatchToProps = (dispatch) => ({
  setSearchParams: (searchParams) =>
    dispatch(homeActionCreators.setSearchParams(searchParams)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TenantList);
