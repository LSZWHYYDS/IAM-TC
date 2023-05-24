/**
 * Created by xifeng on 2017/12/19.
 * RBAC API
 */
/*jshint esversion: 6 */
import axios from "axios";
import util from "../common/util";
import conf from "../conf";

let rbacAPI = {
    getAdminUsers(params) {
        params.client_id = "tc";
        return axios.get("/roles/users" + util.createQueryString(params));
    }
};

export default rbacAPI;
