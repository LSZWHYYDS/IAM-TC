/*jshint esversion: 6 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import authActionCreators from "./actions/authActionCreators";
import util from "./common/util";
import { WebAuth, staticMethod } from "./common/webAuth";
import conf from "./conf";
import HomeContainer from "./containers/HomeContainer";
import Register from "./components/Register";
import AuthorizationError from "./components/AuthorizationError";
import UpdatePwdAfterForget from "./components/UpdatePwdAfterForget";
import ValidateEmail from "./components/ValidateEmail";
import MailSent from "./components/MailSent";
import SmsSent from "./components/SmsSent";
import ForcedUpdatePwd from "./components/ForcedUpdatePwd";
import policyAPI from "./api/policyAPI";

import styles from "./css/app.css";
import "./css/iconfont.css";

class App extends Component {
   constructor(...args) {
      super(...args);
      const accessToken = localStorage.getItem("access_token_tc");
      if (accessToken) {
         axios.defaults.headers.common.Authorization = "Bearer " + accessToken;
      }
      axios.defaults.baseURL = conf.getServiceUrl();
      axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
      axios.defaults.headers.put["Content-Type"] = "application/json;charset=UTF-8";
      //解决IE 读取表格数据时, get请求缓存不更新问题
      if (navigator.userAgent.indexOf("Trident") > 0) {
         axios.defaults.headers.common.Pragma = "no-cache";
      }
      this.state = {
         loginPageLoading: true,
         offline: false
      };
      this.webAuth = new WebAuth({
         clientId: "tc",
         redirectUri: conf.getFrontEndUrl() + "/tc/index.html#/",
         ucSsoUrl: conf.getBackendUrl()
      });
   }
   componentWillReceiveProps(nextProps) {
      if (!this.props.loggedIn && nextProps.loggedIn) {
         staticMethod.parseQueryString(window.location.href, (queryObj) => {
            if (nextProps.pathname === "/" || queryObj.access_token) {
               this.props.history.replace("/home");
            } else {
               this.props.history.replace(nextProps.pathname + nextProps.location.search);
            }
         });
      } else if (this.props.loggedIn && !nextProps.loggedIn) {
         util.toLogin();
      }
   }
   componentWillMount() {
      if (window.location.href.indexOf("/forget_password/") > -1) {
         let token = window.location.href.split("/forget_password/")[1].split("?")[0];
         sessionStorage.setItem("reset_token", token);
         this.props.history.replace("/forget_password/" + token);
      } else if (window.location.href.indexOf("/verify_email_address/") > -1) {
         let token = window.location.href.split("/verify_email_address/")[1].split("?")[0];
         sessionStorage.setItem("validate_token", token);
         this.props.history.replace("/verify_email_address/" + token);
      }
      if (//下列页面不需要授权就可以访问
         window.location.href.indexOf("register") === -1 &&
         window.location.href.indexOf("mailSent") === -1 &&
         window.location.href.indexOf("smsSent") === -1 &&
         window.location.href.indexOf("forget_password") === -1 &&
         window.location.href.indexOf("forcedUpdatePwd") === -1 &&
         window.location.href.indexOf("verify_email_address") === -1
      ) {
         this.webAuth.initWebAuth((accessToken) => {
            const tmpAccessToken = localStorage.getItem("id_token_tc"),
               tokenInfo = JSON.parse(atob(tmpAccessToken.split(".")[1]));
            this.props.loginSuccess(accessToken, tokenInfo.tid);
            localStorage.setItem("tcode", tokenInfo.tid);
         }, (errorType, errorDescription) => {
            if (errorType === "invalid_state") {
               this.props.history.replace("/authorizationError/" + errorType + "/" + errorDescription);
            }
            sessionStorage.clear();
         });

      }
      staticMethod.handleRedirectError((errorType, errorDescription) => {
         this.props.history.replace("/authorizationError/" + errorType + "/" + errorDescription);
      });
      staticMethod.parseQueryString(window.location.href, (obj) => {
         if (obj.warn_code === "1010216") {
            message.warning(util.t("tip.pwdToBeExpired", { days: (parseInt(obj.warn_msg, 10) / (60 * 60 * 24)).toFixed() }), 5);
         }
      });
      axios.interceptors.request.use((request) => {
         if (!this.props.loggedIn || localStorage.getItem("access_token_tc")) {
            return request;
         } else {
            this.webAuth.authorize(() => {
               sessionStorage.clear();
            });
         }
      });
      axios.interceptors.response.use((response) => {
         this.setOffline(false);
         return response;
      }, (error) => {
         if (error && error.response && error.response.status === 401) {
            this.webAuth.authorize(function () {
               sessionStorage.clear();
            });
         } else if (error && error.toString().indexOf("Network Error") > -1) { //检测断网状态
            this.setOffline(true);
         }
         return Promise.reject(error);
      });
   }
   componentDidMount() {
      if (axios.defaults.headers.common.tcode) {
         policyAPI.getPolicies().then(
            (response) => {
               if (response.data && response.data.data) {
                  localStorage.setItem("ucName", response.data.data.uc_name);
                  document.title = response.data.data.uc_name || util.t("common.UCName");
               }
            }
         );
      }
   }
   setOffline(isOffline) {
      if (isOffline !== this.state.offline) {
         this.setState({ offline: isOffline });
      }
   }
   render() {
      return (
         <div className={styles.root}>
            <Route path="/home" render={(props) => (
               <HomeContainer {...props} offline={this.state.offline} />
            )} />
            <Route path="/register" component={Register} />
            <Route path="/forget_password/:resetToken/:tcode" component={UpdatePwdAfterForget} />
            <Route path="/forcedUpdatePwd/:userName?" component={ForcedUpdatePwd} />
            <Route path="/mailSent/:userName?/:email?/:tcode?" component={MailSent} />
            <Route path="/smsSent/:userName?/:mobile?/:validity?/:tcode?" component={SmsSent} />
            <Route path="/verify_email_address/:validateToken/:tcode" component={ValidateEmail} />
            <Route path="/authorizationError/:type?/:description?" component={AuthorizationError} />
         </div>
      );
   }
}

const mapStateToProps = (state, ownProps) => ({
   loggedIn: state.login.loggedIn,
   pathname: ownProps.location.pathname
});

const mapDispatchToProps = (dispatch) => ({
   loginSuccess: (accessToken, tCode, refreshToken) => dispatch(authActionCreators.loginSuccess(accessToken, tCode, refreshToken)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
