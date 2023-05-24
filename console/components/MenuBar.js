/**
 * Created by shaliantao on 2017/5/12.
 */
/*jshint esversion: 6 */
import React, { Component } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import util from "../common/util";
import conf from "../conf";
import { createSelector } from "reselect";
import { PERM_SETS } from "../constants";
import { connect } from "react-redux";
import { authorized } from "../common/authorization";

const MenuItem = Menu.Item,
    SubMenu = Menu.SubMenu;
class MenuBar extends Component {
    constructor(...args) {
        super(...args);

        this.rootSubmenuKeys = ["accounting","settings", "rbac", "app", "tenant"];
        const {  getCurMenuKey } = this.props,
            { pmenu } =  getCurMenuKey();
        this.state = {
            openKeys: [pmenu],
        };
    }
    onOpenChange(openKeys) {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);

        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }
    onSelect({item, key, selectedKeys}) {
        const pmenu = this.props.getParentMenuKey(key);
        this.setState({
            openKeys: [pmenu],
        });
        if (this.props.onSelect){
            this.props.onSelect({item, key, selectedKeys});
        }
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.location.pathname.indexOf(this.state.openKeys) !== -1) {
            this.setState({
                openKeys: ['appList']
            });
        }
    }
    render() {
        const { match, getCurMenuKey } = this.props,
            { menu, pmenu } =  getCurMenuKey();
        return (
            <div className="navMenu">
                <Menu mode="inline" theme="light"
                      className="navMenuSpan"
                      defaultSelectedKeys={[menu]}
                      defaultOpenKeys={[pmenu]}
                      onSelect={this.onSelect.bind(this)}
                      //onOpenChange={this.onOpenChange.bind(this)}
                      //openKeys={this.state.openKeys}
                >
                    {
                        authorized([
                            PERM_SETS.VIEW_TENANT,
                            PERM_SETS.DELETE_TENANT,
                            PERM_SETS.EDIT_TENANT,
                            PERM_SETS.ENTITLE_TENANT,
                            PERM_SETS.NEW_TENANT,
                            PERM_SETS.ADMIN_TENANT],
                            this.props.userPermSets) &&
                        <MenuItem key="tenant">
                            <Link to={`${match.url}/tenantList`}>
                                <i className="icon iconfont icon-user"></i>
                                <span>{util.t("tenant.tenant")}</span>
                            </Link>
                        </MenuItem>
                    }
                    {
                        authorized([
                            PERM_SETS.VIEW_APP,
                            PERM_SETS.DELETE_APP,
                            PERM_SETS.EDIT_APP,
                            PERM_SETS.ENTITLE_APP,
                            PERM_SETS.NEW_APP,
                            PERM_SETS.ADMIN_APP],
                            this.props.userPermSets) &&
                        <MenuItem key="app">
                            <Link to={`${match.url}/appList`}>
                                <i className="icon iconfont icon-app"></i>
                                <span>{util.t("app.app")}</span>
                            </Link>
                        </MenuItem>
                    }
                    {
                        conf.isFeatureEnabled("uc_rbac") &&
                        authorized([PERM_SETS.SUPER_ADMIN], this.props.userPermSets) &&
                        <SubMenu key="rbac" title={<span><i className="icon iconfont icon-rbac"/>{util.t("rbac.menu")}</span>}>
                            <MenuItem key="rbacBindings">
                                <Link to={`${match.url}/rbac-bindings`}>
                                    <span>{util.t("rbac.bindings.menu")}</span>
                                </Link>
                            </MenuItem>
                            <MenuItem key="rbacRoles">
                                <Link to={`${match.url}/rbac-roles`}>
                                    <span>{util.t("rbac.roles.menu")}</span>
                                </Link>
                            </MenuItem>
                        </SubMenu>
                    }
                </Menu>
            </div>
        );
    }
}

const userPermSets = createSelector(state => state.login.userPermSets, (userPermSets) => userPermSets);
const mapStateToProps = (state) => ({
    userPermSets: userPermSets(state),
});
export default connect(mapStateToProps)(MenuBar);
