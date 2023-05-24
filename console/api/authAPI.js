/*jshint esversion: 6 */
import axios from "axios";
import conf from "../conf";

let authAPI = {
    logout() {
        axios.defaults.baseURL = conf.getServiceUrlForLogout();
        return axios.get("/logout");
    },
    regist(params) {
        return axios.post("/self/users", params);
    },
    forgetPwd(username,tcode) {
        axios.defaults.baseURL = conf.getServiceUrl();
        return axios.post("/self/forget_password", {
            "username": username
        },{headers:{tcode:tcode}});
    },
    updatePwdAfterForget(params) {
        return axios.post("/self/reset_password", params,{headers:{tcode:params.tcode}});
    }
};
export default authAPI;
