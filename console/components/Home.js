/*jshint esversion: 6 */
import React, { Component } from "react";
import { Route } from "react-router-dom";
import { Menu, Dropdown, Icon, Layout } from "antd";
import UpdatePwd from "./user/UpdatePwd";
import ErrorPage from "./ErrorPage";
import MenuBar from "./MenuBar";
import util from "../common/util";
import { PERM_SETS } from "../constants";
import conf from "../conf";
import ModalDialog from "../common/modalDialog";
import AuthzComponent from "../common/AuthzComponent";
import SelfInfo from "./user/SelfInfo";
import userUtil from "./user/userUtil";
import EditSelf from "./user/EditSelf";
import EditUser from "./user/EditUser";
import AppList from "./app/AppList";
import EditApp from "./app/EditApp";
import AppInfo from "./app/AppInfo";
import TenantList from "./tenant/TenantList";
import EditTenant from "./tenant/EditTenant";
import TenantInfo from "./tenant/TenantInfo";
import MyApp from "./app/MyApp";
import ValidateEmail from "../common/validateEmail";
import defaultAvatar from "../img/default-avatar.png";
import NewBuild from './app/NewBuild';

const MenuItem = Menu.Item;
const { Content, Sider } = Layout;


class Home extends Component {
   constructor(...args) {
      super(...args);
      this.state = {
         showUpdatePwd: false,
         clickSameMenu: false,
         collapsed: false,
      };
   }
   onSelect({ key }) {
      this.props.clearSearchParams();
      this.props.setCurMenuItem(key);
   }
   logout() {
      this.props.logout(true);
   }
   handleShowUpdatePwd(isShow) {
      if (!this.props.isSystemUser) {
         this.props.switchToSSView();
      }
      this.setState({ showUpdatePwd: isShow });
   }
   handleShowAccountInfo() {
      if (!this.props.isSystemUser) {
         this.props.switchToSSView();
      }
      const accessToken = localStorage.getItem("id_token_tc"),
         tokenInfo = JSON.parse(atob(accessToken.split(".")[1]));
      this.props.history.push("/home/editUser/" + tokenInfo.username);
   }
   handleShowMyApp() {
      if (!this.props.isSystemUser) {
         this.props.switchToSSView();
      }
      this.props.history.push("/home/myApp");
   }
   updatePwdSuccess() {
      this.handleShowUpdatePwd(false);
      setTimeout(this.logout.bind(this), 1500);
   }
   componentDidMount() {
      this.props.getSelfInfo();
      document.title = localStorage.getItem("ucName") || util.t("common.UCName");
      this.props.clearSearchParams();
   }
   componentWillReceiveProps(nextProps) {
      if (nextProps.pathname === "/home" && nextProps.selfInfo) {
         if (userUtil.isSystemUser(nextProps.selfInfo)) {
            this.props.history.push({ pathname: "/home/tenantList" });
         } else {
            this.props.history.push({
               pathname: "/home/self/" + nextProps.selfInfo.username,
               state: { userInfo: nextProps.selfInfo }
            });
         }
      }
   }
   getCurMenuKey() {
      let pathMap = {
         "editUser": "user", "self": "user",
         "appList": "app", "editApp": "app", "appInfo": "app",
         "rbac-bindings": "rbacBindings", "rbac-roles": "rbacRoles",
         "tenantList": "tenant", "editTenant": "tenant", "newbuild": "NewBuild"
      }, subPath = this.props.pathname.split("/")[2];
      if (pathMap[subPath] === this.props.curMenuKey) {
         return {
            menu: pathMap[subPath],
            pmenu: this.getParentMenuKey(pathMap[subPath]),
         };
      } else {
         return {
            menu: "tenant",
            pmenu: "tenantList",
         };
      }
   }
   //get parent menu key
   getParentMenuKey(submenuKey) {
      const menu2Parent = {
         "user": "accounting",
         "profile": "accounting",
         "attr": "accounting",
         "linker": "accounting",
         "setting": "settings",
         "template": "settings",
         "app": "app",
         "rbacBindings": "rbac",
         "rbacRoles": "rbac",
         "tenant": "tenant",
      };

      return menu2Parent[submenuKey];
   }
   handleHelp() {
      const link = this.props.hasAdminPerm ? conf.getBackendUrl() + "/help/index.html?treeNodeId=foreword" : conf.getBackendUrl() + "/docs/user-guide/ss.html?tcode=" + localStorage.getItem("tcode");
      window.open(link);
      return false;
   }
   toggleAdminView() {
      if (this.props.isAdminView) {
         this.props.history.push({
            pathname: "/home/self/" + this.props.selfInfo.username,
            state: { userInfo: this.props.selfInfo }
         });
      }

      this.props.toggleAdminView();
   }
   onCollapse(collapsed) {
      this.setState({ collapsed });
   }
   render() {
      const { match, loggedIn } = this.props;
      let accountInfoItem = null, myApp = null, validateEmail = null, helpInfo = null, adminViewToggler = null, adminViewDivider = null;
      if (this.props.isSystemUser) {
         accountInfoItem = (
            <MenuItem key="accountInfo">
               <a href="javascript:void(0)" onClick={this.handleShowAccountInfo.bind(this)}>{util.t("user.accountInfo")}</a>
            </MenuItem>
         );
         myApp = (
            <MenuItem key="myApp">
               <a href="javascript:void(0)" onClick={this.handleShowMyApp.bind(this)}>{util.t("app.myApp")}</a>
            </MenuItem>
         );
      }
      if (this.props.hasAdminPerm) {
         helpInfo = (
            <span className="block fl-r mr-20">
               <a style={{ color: "#FFFFFF" }}
                  title={util.t("common.help")}
                  href="javascript:void(0)" onClick={this.handleHelp.bind(this)}
               >
                  <Icon type="question-circle-o" style={{ fontSize: 24, lineHeight: "60px" }} />
               </a>
            </span>
         );

         if (!this.props.isSystemUser) {
            const togglerText = this.props.isAdminView ? util.t("common.ssView") : util.t("common.adminView");
            adminViewToggler = (
               <MenuItem key="adminViewToggler">
                  <a href="javascript:void(0)" onClick={this.toggleAdminView.bind(this)}>{togglerText}</a>
               </MenuItem>
            ), adminViewDivider = (
               <Menu.Divider />
            );
         }
      }
      if (loggedIn) {
         let loginUserMenu = (
            <Menu style={{ border: "1px solid #ddd" }}>
               {/*{ accountInfoItem }*/}
               {/*{ myApp }*/}
               <MenuItem key="updatePwd">
                  <a href="javascript:void(0)" onClick={this.handleShowUpdatePwd.bind(this, true)}>{util.t("user.updatePwd")}</a>
               </MenuItem>
               {adminViewDivider}
               {adminViewToggler}
               <Menu.Divider />
               <MenuItem key="logout">
                  <a href="javascript:void(0)" onClick={this.logout.bind(this)}>{util.t("common.logout")}</a>
               </MenuItem>
            </Menu>
         ), mainContent = null;
         if (this.props.offline) {
            mainContent = <Route render={(props) => <ErrorPage getSelfInfo={this.props.getSelfInfo} />} />;
         } else if (this.props.selfInfo) {
            mainContent = (<div>
               <AuthzComponent
                  group={{ enable: true }}
                  allowed={[PERM_SETS.VIEW_APP, PERM_SETS.EDIT_APP, PERM_SETS.NEW_APP, PERM_SETS.DELETE_APP,
                  PERM_SETS.ENTITLE_APP, PERM_SETS.ADMIN_APP]}
               >
                  <Route path={`${match.url}/appList`} component={AppList} />
                  <Route path={`${match.url}/editApp/:id?`} component={EditApp} />
                  <Route path={`${match.url}/appInfo/:id?`} component={AppInfo} />
               </AuthzComponent>

               <AuthzComponent
                  group={{ enable: true }}
                  allowed={[PERM_SETS.VIEW_TENANT, PERM_SETS.EDIT_TENANT, PERM_SETS.NEW_TENANT, PERM_SETS.DELETE_TENANT,
                  PERM_SETS.ENTITLE_TENANT, PERM_SETS.ADMIN_TENANT]}
               >
                  <Route path={`${match.url}/tenantList`} component={TenantList} />
                  <Route path={`${match.url}/editTenant/:id?`} component={EditTenant} />
                  <Route path={`${match.url}/tenantInfo/:id?`} component={TenantInfo} />
               </AuthzComponent>

               <Route path={`${match.url}/myApp`} component={MyApp} />

               <Route path={`${match.url}/self/:id`} component={SelfInfo} />
               <Route path={`${match.url}/editSelf/:id?`} render={
                  (props) => <EditSelf {...props} />
               } />
               <AuthzComponent
                  allowed={[PERM_SETS.DELETE_USER,
                  PERM_SETS.EDIT_USER,
                  PERM_SETS.ADMIN_APP]}
               >
                  <Route path={`${match.url}/editUser/:id?`} render={
                     (props) => <EditUser {...props} clearSearchParams={this.props.clearSearchParams} />
                  } />
               </AuthzComponent>

            </div>);
         }
         if (this.props.isSystemUser) {
            validateEmail = <ValidateEmail email={this.props.selfInfo && this.props.selfInfo.email}
               email_verified={this.props.selfInfo && this.props.selfInfo.email_verified}
            />;
         }
         return (
            <div className="home-div">
               <header className="navbarTop">
                  <span className="title">
                     <i className="iconDefault pathNodeIcon icon-favicon-white"></i>
                     <span id="uc_console_name">
                        {
                           localStorage.getItem("ucName") || (!this.props.hasAdminPerm ?
                              util.t("common.UCName") : util.t("common.userCenterConsole"))
                        }
                     </span>
                  </span>
                  <Dropdown overlay={loginUserMenu} trigger={["click"]}>
                     <span className="block fl-r"
                        title={this.props.selfInfo && this.props.selfInfo.username}
                        style={{ cursor: "pointer" }}
                     >
                        <span style={{ paddingRight: "4px" }}><img src={this.props.selfInfo && this.props.selfInfo.picture || defaultAvatar}
                           className="small-avatar"
                           alt={this.props.selfInfo && this.props.selfInfo.username}
                        /></span>
                        <span style={{ display: "inline-block", verticalAlign: "top" }}>
                           <Icon type="down" />
                        </span>
                     </span>
                  </Dropdown>
                  {helpInfo}
               </header>
               <Layout style={{ minHeight: "100vh", background: "#fff" }}>
                  {
                     (this.props.hasAdminPerm && this.props.isAdminView || this.props.isSystemUser) &&
                     <Sider
                        collapsible
                        collapsed={this.state.collapsed}
                        onCollapse={this.onCollapse.bind(this)}
                        style={{ background: "#fff", boxShadow: "3px 0 11px 0 rgba(0,0,0,0.13)" }}
                     >
                        <Route render={(props) => {
                           return (
                              (this.props.hasAdminPerm && this.props.isAdminView || this.props.isSystemUser) ? <MenuBar ref={(input) => { this.menubar = input; }} {...props}
                                 getCurMenuKey={this.getCurMenuKey.bind(this)}
                                 getParentMenuKey={this.getParentMenuKey.bind(this)}
                                 onSelect={this.onSelect.bind(this)} /> : null
                           );
                        }
                        }
                        />
                     </Sider>
                  }
                  <Content style={{ background: "#F2F5F4", padding: "0 1px" }}>
                     {mainContent}
                  </Content>
               </Layout>
               <ModalDialog show={this.state.showUpdatePwd}
                  title={util.t("user.updatePwd")}
               >
                  <UpdatePwd username={this.props.selfInfo && this.props.selfInfo.username}
                     onSuccess={this.updatePwdSuccess.bind(this)}
                     onClose={this.handleShowUpdatePwd.bind(this, false)}
                  />
               </ModalDialog>
               {validateEmail}
            </div>
         );
      }
      if (this.props.pathname === "/") {
         return <div>系统异常，请联系管理员</div>;
      }
      return <div></div>;
   }
}

export default Home;
