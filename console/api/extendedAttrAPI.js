/**
 * Created by tianyun on 2016/12/21.
 */
/*jshint esversion: 6 */
import axios from "axios";
import conf from "../conf";
import util from "../common/util";

let attrAPI = {
    getAttrList(params) {
        axios.defaults.baseURL = conf.getServiceUrl();
        return axios.get("/user_attrs" + util.createQueryString(params));
    },
    getAttr(id) {
        return axios.get("/user_attrs/" + id);
    },
    addAttr(params) {
        return axios.post("/user_attrs", {
            "ext_attrs": [params]
        });
    },
    editAttr(id, params) {
        return axios.patch("/user_attrs/" + id, params);
    },
    getOrgAttrList(params) {
        return axios.get("/org_attrs" + util.createQueryString(params));
    }
};

export default attrAPI;
