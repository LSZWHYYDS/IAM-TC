/*jshint esversion: 6 */
import axios from "axios";
import util from "../common/util";

let userMgrAPI = {
    getUserList(params={page: 0, size: 10}) {
        params.attrs = "sub,name,org_ids,email,username,status,phone_number,readonly,come_from,picture";
        const { org_id:orgId } = params;
        if (orgId) {
            if (orgId === '_root') {
                params.return_users_in_sub_org = true; //return users in sub org
            }else {
                params.return_users_in_sub_org = false; //do not return users in sub org
            }
        }
        return axios.get("/users", {params});
    },
    //incsearch user.
    incsearch(keyword) {
        const params = {
            q : keyword,
            limit: 20,
            attrs : "sub,username,name,email,picture",
            m: "inc",
        };
        const api = axios.get("/users" + util.createQueryString(params));
        return api;
    },
    getUser(username) {
        return axios.get("/user" + util.createQueryString({username}));
    },
    /**
     * get all the applications which are entitled to a specific user.
     * @param {object} params must includes username
     */
    getUserEntitledApp(params) {
        return axios.get("/user/apps" + util.createQueryString(params));
    },
    getSelfInfo() {
        return axios.get("/self/user_info", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access_token_tc"),
                "Content-Type": "application/json;charset=UTF-8"
            }
        });
    },
    /**
     * get self permission sets.
     */
    getSelfPermSets() {
        return axios.get("/self/permission_sets");
    },
    updatePwd(params) {
        return axios.put("/self/password", params, {
            headers: {
                "tcode": localStorage.getItem("tcode")
            }
        });
    },
    addUser(data, params) {
        return axios.post("/users" + util.createQueryString(params), data);
    },
    delUser(ids) {
        return axios.post("/users/delete", {
            usernames: ids
        });
    },
    editUser(username, data) {
        return axios.patch("/user" + util.createQueryString({username}), data);
    },
    editSelfInfo(data) {
        return axios.patch("/self/user_info", data);
    },
    changeStatus(isActived, ids) {
        return axios.put("/users/status", {
            "status": isActived ? "ACTIVE" : "INACTIVE",
            "usernames": ids
        });
    },
    getPreImportUsers(params={page: 0, size: 10}) {
        return axios.get("/users/pre_import" + util.createQueryString(params));
    },
    saveImportUsers(isCover) {
        return axios.post("/users/import", {
            "replace": isCover
        });
    },
    delPreImportedUsers() {
        return axios.delete("/users/pre_import");
    },
    getPreImportResult() {
        return axios.get("/users/pre_import/statistics");
    },
    sendValidateEmail() {
        return axios.post("/self/email_to_verify_email_address", null, {
            "content-type": "application/json;charset=UTF-8"
        });
    },
    verifyEmail(token,tcode) {
        return axios.get("/self/verify_email_address/" + token,{headers:{"tcode":tcode}});
    },
    importAdLdap() {
        return axios.post("/users/pre_import/idp" , null, {
            "content-type": "application/json;charset=UTF-8"
        });
    },
    //testing ad/ldap import
    testAdLdapImport(data) {
        return axios.post("/users/sync_test", data);
    },

    saveAdLdapConfig(data) {
        return axios.patch("/connectors/pre_import/config", data);
    },
    getPreImportConfig() {
        return axios.get("/connectors/pre_import/config");
    },
    getImportConfigTips() {
        return axios.get("/connectors/pre_import/config/tips");
    },
    adminResetUserPwd(data) {
        return axios.post("/users/password", data);
    },
    sendValidateMobile() {
        return axios.post("/self/send_verify_mobile_code", null, {
            "content-type": "application/json;charset=UTF-8"
        });
    },
    validateMobile(smsCode) {
        return axios.get("/self/verify_mobile/" + smsCode);
    },
    validateSmsCode(params) {
        return axios.get("/self/verify_forget_password_sms_code" + util.createQueryString(params));
    },

    /**
     * get self certificates.
     */
    getSelfCerts() {
        return axios.get("/self/cert");
    },

    /**
     * self active/inactive cert by cert id
     * @param {string} status INACTIVE/ACTIVE
     */
    selfToggleCertStatus(certid, status) {
        return axios.patch("/self/cert/" + certid + "/status", {status});
    },

    /**
     * self delete one certificate.
     * @param {string} certid certification id
     */
    selfDeleteCert(certid) {
        return axios.delete("/self/cert/" + certid);
    },

    /**
     * user admin to get someone else's certificates.
     * @param {string} username
     */
    adminGetUserCerts(username) {
        return axios.get("/cert" + util.createQueryString({ username }));
    },

    /**
     * user admin to active/inactive someone else's certificate.
     * @param {string} certid certification identity
     * @param {string} status ACTIVE/INACTIVE
     * @param {string} username
     */
    adminToggleCertStatus(certid, status, username) {
        return axios.patch("/cert/" + certid + "/status" + util.createQueryString({username}), {status});
    },

    /**
     * user admin to delete someone else's certificate.
     * @param {string} certid certification identity
     * @param {string} username
     */
    adminDeleteCert(certid, username) {
        return axios.delete("/cert/" + certid + util.createQueryString({username}));
    },
};

export default userMgrAPI;