/**
 * Created by shaliantao on 2017/9/11.
 */
let conf = {
  getBackendUrl() {
    //开发时将以下URL设为具体值，但不要提交
    let backendUrl = "";
    // let backendUrl = "http://localhost:8080";

    if (backendUrl.length === 0) {
      backendUrl = window.location.protocol + "//" + window.location.host;
    }
    return backendUrl + "/iam";
  },
  getServiceUrl() {
    //using backend api.
    return this.getBackendUrl() + "/api";
  },
  getServiceUrlForLogout() {
    //using backend api.
    return this.getBackendUrl();
  },
  getBackendUrl2() {
    //开发时将以下URL设为具体值，但不要提交
    let backendUrl = "";

    if (backendUrl.length === 0) {
      backendUrl = window.location.protocol + "//" + window.location.host;
    }
    return backendUrl + "/iam";
  },
  getServiceUrl2() {
    //using backend api.
    return this.getBackendUrl2() + "/api";
  },
  getFrontEndUrl() {
    //可用于开发时指定前端路径，如不指定，默认与backendUrl一致
    let frontEndUrl = "";
    // let frontEndUrl = "http://localhost:8000";
    if (frontEndUrl.length === 0) {
      frontEndUrl = this.getBackendUrl();
    }
    return frontEndUrl;
  },
  getConfig() {
    return {
      debug: false
    };
  },

  /**
   * disabled features.
   */
  disabledFeatures() {
    return [];
    //return ["app_entitlement", "app_rbac", "uc_rbac", "csv_import_user", "user_cert_management", "tag"];
  },

  /**
   * check if specific feature is enabled.
   * @param {string} feature
   */
  isFeatureEnabled(feature) {
    const disabledFeatures = this.disabledFeatures();
    return !disabledFeatures.includes(feature.toLowerCase());
  },
};

export default conf;
