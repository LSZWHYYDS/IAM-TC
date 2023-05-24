/**
 * Created by tianyun on 2016/12/28.
 */
/*jshint esversion: 6 */
import axios from "axios";
import conf from "../conf";

let policyAPI = {
    getPolicies() {
        axios.defaults.baseURL = conf.getServiceUrl();
        return axios.get("/configs/policies", {
            transformRequest: [(data, headers) => {
                delete headers.common.Authorization;
                return data;
            }],
            headers: {
                "tcode": localStorage.getItem("tcode")
            }
        });
    },
    getEmailConfigs() {
        return axios.get("/configs/email");
    },
    getSmsConfigs() {
        return axios.get("/configs/sms");
    },
    editPolicies(params) {
        return axios.patch("/configs/policies", params);
    },
    editEmailConfigs(params) {
        return axios.patch("/configs/email", params);
    },
    editSmsConfigs(params) {
        return axios.patch("/configs/sms", params);
    }
};

export default policyAPI;

