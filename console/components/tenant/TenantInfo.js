import React, { Component } from "react";
import { Button, Breadcrumb, Spin, Row, Col, Collapse, Dropdown, Menu, Icon } from "antd";
import { createSelector } from "reselect";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import util from "../../common/util";
import InfoItem from "../../common/infoItem";
import tenantAPI from "../../api/tenantAPI";
import { PERM_SETS } from "../../constants";
import { authorized } from "../../common/authorization";
import AuthzComponent from "../../common/AuthzComponent";

const Panel = Collapse.Panel, MenuItem = Menu.Item;

class TenantInfo extends Component {
  constructor (...args) {
    super(...args);
    this.state = {
      isLoading: false,
      tenantDetail: {}
    }
    this.tenantId = this.props.match.params.id || '';
  }
  componentDidMount() {
    if (this.tenantId) {
      tenantAPI.getTenant(this.tenantId).then(
        (res) => {
          if (res.data.code === '0') {
            let obj = Object.assign({}, res.data.data, res.data.data.admin)
            this.setState({
              tenantDetail: obj
            })
          }
        },
        (error) => {
          util.showErrorMessage(error);
        }
      )
    }
  }
  onCancel () {
    this.props.history.push("/home/tenantList");
  }
  render () {
    const {tenant_id, name, address, contacts, phone, email, expired_time, username, status, create_time, update_time } = this.state.tenantDetail || {};
    const operationMenu = (
      <Menu>
          {
              authorized([PERM_SETS.ADMIN_TENANT], this.props.userPermSets) && (
                  <MenuItem key="editTenant">
                      <Link to={`/home/editTenant/${this.tenantId}`}>
                          {util.t("common.edit")}
                      </Link>
                  </MenuItem>
              )
          }
          {/* {
              authorized([PERM_SETS.ADMIN_TENANT], this.props.userPermSets) && (
                  <MenuItem key="inactiveUser">
                      <a href="javascript:void(0)"
                      onClick={this.toggleActive.bind(this, status)}
                      >
                          { status === "ACTIVE" ? util.t("common.disable") : util.t("common.enable") }
                      </a>
                  </MenuItem>
              )
          } */}
      </Menu>
    );
    return (
      <Spin spinning={this.state.isLoading} style={{
        position: "fixed", left: "55%", top: "48%", height: 0, width: 0
      }}>
        <div>
          <span className="pathNode">
            <Breadcrumb separator=">>">
                <Breadcrumb.Item href="#/home/tenantList">{util.t("tenant.tenant")}</Breadcrumb.Item>
                <Breadcrumb.Item>{util.t("tenant.detail")}</Breadcrumb.Item>
            </Breadcrumb>
          </span>
          <Collapse defaultActiveKey={["tenantbasic"]} bordered={false}>
            <AuthzComponent key="deleteAppAuthz" allowed={[PERM_SETS.EDIT_TENANT,PERM_SETS.DELETE_TENANT,PERM_SETS.ADMIN_TENANT]}>
                <Row>
                    <Col span={24}>
                        <div className="searchRow">
                            <div className="addUser noPadding">
                                <Dropdown overlay={operationMenu} trigger={["click"]}>
                                    <a href="javascript:void(0)" className="fs-18 addUserBtn" >
                                        {util.t("common.operate")}
                                        <Icon type="down" />
                                    </a>
                                </Dropdown>
                            </div>
                        </div>
                    </Col>
                </Row>
            </AuthzComponent>
            <Panel header={util.t("tenant.info.panels.basic")} key="tenantbasic">
              <Row>
                <InfoItem titleStr={util.t("tenant.id")}
                        isNormal={true}
                        contentObj={tenant_id || "--"}
                        contentSpan={14}
                />
                <InfoItem titleStr={util.t("tenant.name")}
                        isNormal={true}
                        contentObj={name || "--"}
                        contentSpan={14}
                />
                <InfoItem titleStr={util.t("tenant.address")}
                        isNormal={true}
                        contentObj={address || "--"}
                        contentSpan={14}
                />
                <InfoItem titleStr={util.t("tenant.contacts")}
                        isNormal={true}
                        contentObj={contacts || "--"}
                        contentSpan={14}
                />
                <InfoItem titleStr={util.t("tenant.phone")}
                        isNormal={true}
                        contentObj={phone || "--"}
                        contentSpan={14}
                />
                <InfoItem titleStr={util.t("tenant.email")}
                        isNormal={true}
                        contentObj={email || "--"}
                        contentSpan={14}
                />
                <InfoItem titleStr={util.t("tenant.status")}
                        isNormal={true}
                        contentObj={status || "--"}
                        contentSpan={14}
                />
                <InfoItem titleStr={util.t("tenant.username")}
                        isNormal={true}
                        contentObj={username || "--"}
                        contentSpan={14}
                />
                <InfoItem titleStr={util.t("tenant.createTime")}
                        isNormal={true}
                        contentObj={create_time || "--"}
                        contentSpan={14}
                />
                <InfoItem titleStr={util.t("tenant.updateTime")}
                        isNormal={true}
                        contentObj={update_time || "--"}
                        contentSpan={14}
                />
              </Row>
            </Panel>
          </Collapse>
          <div className="footerContainer">
            <Button type="ghost" className="ml-10" onClick={this.onCancel.bind(this)}>
                {util.t("common.cancel")}
            </Button>
          </div>
        </div>
      </Spin>
    )
  }
}

const userPermSets = createSelector(state => state.login.userPermSets, (userPermSets) => userPermSets);
const mapStateToProps = (state) => ({
    appDetail: state.app.appDetail,
    appList: state.app.appList,
    extraAuthFactorAttrList: state.app.extraAuthFactorAttrList,
    profileList: state.app.profileList,
    userPermSets: userPermSets(state),
});
const mapDispatchToProps = (dispatch) => ({
    setAppDetail: (data) => dispatch(appActionCreators.setAppDetail(data)),
    mergeAppDetail: (data) => dispatch(appActionCreators.mergeAppDetail(data)),
    setAppList: (data) => dispatch(appActionCreators.setAppList(data)),
    setExtraAuthFactorAttrList: (data) => dispatch(appActionCreators.setExtraAuthFactorAttrList(data)),
    setProfileList: (data) => dispatch(appActionCreators.setProfileList(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TenantInfo);